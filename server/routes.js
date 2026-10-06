import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { query, DEFAULT_USER_ID } from './db.js';
import { validateBody } from './middleware/validation.js';
import { createFieldSchema, updateFieldSchema, generateAdvisorySchema, userSettingsSchema } from '../shared/schema.js';
import { generateCropAdvisory, diagnoseCropDisease } from './services/gemini.js';
import { getFieldWeather, getMarketInsights } from './services/weather.js';

const router = express.Router();

// Memory storage for diagnostic photo uploads (validates MIME & max 5MB)
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image type. Only JPEG, PNG and WebP are allowed.'));
    }
  }
});

// User Multi-Tenant Middleware (enforces ownership as per section 11)
router.use((req, res, next) => {
  req.user = { id: DEFAULT_USER_ID };
  next();
});

// --- FIELD PARCEL CRUD ROUTES ---

// GET /api/fields
router.get('/fields', async (req, res) => {
  try {
    const fields = await query(
      `SELECT * FROM fields WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(fields);
  } catch (err) {
    console.error('Error fetching fields:', err);
    res.status(500).json({ error: 'Failed to fetch field profiles' });
  }
});

// GET /api/fields/:id
router.get('/fields/:id', async (req, res) => {
  try {
    const fields = await query(
      `SELECT * FROM fields WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );
    if (fields.length === 0) {
      return res.status(404).json({ error: 'Field not found' });
    }
    
    // Attach current weather & risks
    const field = fields[0];
    const weather = getFieldWeather(field.latitude, field.longitude, field.location_name);
    res.json({ ...field, weather });
  } catch (err) {
    console.error('Error fetching field details:', err);
    res.status(500).json({ error: 'Failed to fetch field details' });
  }
});

// POST /api/fields
router.post('/fields', validateBody(createFieldSchema), async (req, res) => {
  try {
    const f = req.body;
    const fieldId = uuidv4();

    await query(
      `INSERT INTO fields (
        id, user_id, name, location_name, latitude, longitude, area_hectares, 
        soil_type, nitrogen_ppm, phosphorus_ppm, potassium_ppm, ph_level, organic_matter_pct, irrigation_type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [
        fieldId,
        req.user.id,
        f.name,
        f.locationName,
        f.latitude || null,
        f.longitude || null,
        f.areaHectares,
        f.soilType,
        f.nitrogenPpm,
        f.phosphorusPpm,
        f.potassiumPpm,
        f.phLevel,
        f.organicMatterPct || 2.5,
        f.irrigationType
      ]
    );

    const newField = await query(`SELECT * FROM fields WHERE id = $1`, [fieldId]);
    res.status(201).json(newField[0]);
  } catch (err) {
    console.error('Error creating field:', err);
    res.status(500).json({ error: 'Failed to create field profile' });
  }
});

// PUT /api/fields/:id
router.put('/fields/:id', validateBody(updateFieldSchema), async (req, res) => {
  try {
    const existing = await query(
      `SELECT * FROM fields WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Field not found' });
    }

    const current = existing[0];
    const b = req.body;

    const name = b.name ?? current.name;
    const locationName = b.locationName ?? current.location_name;
    const lat = b.latitude ?? current.latitude;
    const lon = b.longitude ?? current.longitude;
    const area = b.areaHectares ?? current.area_hectares;
    const soilType = b.soilType ?? current.soil_type;
    const n = b.nitrogenPpm ?? current.nitrogen_ppm;
    const p = b.phosphorusPpm ?? current.phosphorus_ppm;
    const k = b.potassiumPpm ?? current.potassium_ppm;
    const ph = b.phLevel ?? current.ph_level;
    const organic = b.organicMatterPct ?? current.organic_matter_pct;
    const irrigation = b.irrigationType ?? current.irrigation_type;

    await query(
      `UPDATE fields SET 
        name = $1, location_name = $2, latitude = $3, longitude = $4, area_hectares = $5,
        soil_type = $6, nitrogen_ppm = $7, phosphorus_ppm = $8, potassium_ppm = $9,
        ph_level = $10, organic_matter_pct = $11, irrigation_type = $12
       WHERE id = $13 AND user_id = $14`,
      [name, locationName, lat, lon, area, soilType, n, p, k, ph, organic, irrigation, req.params.id, req.user.id]
    );

    const updated = await query(`SELECT * FROM fields WHERE id = $1`, [req.params.id]);
    res.json(updated[0]);
  } catch (err) {
    console.error('Error updating field:', err);
    res.status(500).json({ error: 'Failed to update field parcel' });
  }
});

// DELETE /api/fields/:id
router.delete('/fields/:id', async (req, res) => {
  try {
    const result = await query(
      `DELETE FROM fields WHERE id = $1 AND user_id = $2 RETURNING id`,
      [req.params.id, req.user.id]
    );
    res.json({ success: true, deletedId: req.params.id });
  } catch (err) {
    console.error('Error deleting field:', err);
    res.status(500).json({ error: 'Failed to delete field parcel' });
  }
});

// --- AI CROP ADVISORY ROUTES ---

// POST /api/advisory/generate
router.post('/advisory/generate', validateBody(generateAdvisorySchema), async (req, res) => {
  try {
    const { fieldId, season, targetLanguage } = req.body;

    // Fetch field parcel details ensuring user ownership
    const fields = await query(
      `SELECT * FROM fields WHERE id = $1 AND user_id = $2`,
      [fieldId, req.user.id]
    );

    if (fields.length === 0) {
      return res.status(404).json({ error: 'Field not found' });
    }

    const field = fields[0];
    const weather = getFieldWeather(field.latitude, field.longitude, field.location_name);

    // Trigger Gemini API Advisory Engine
    const aiOutput = await generateCropAdvisory({
      field,
      season,
      targetLanguage,
      weather
    });

    const advisoryId = uuidv4();
    const jsonVal = (val) => typeof val === 'object' ? JSON.stringify(val) : val;

    await query(
      `INSERT INTO crop_advisories (
        id, field_id, season, recommended_crops, fertilizer_schedule, 
        irrigation_plan, risk_assessment, raw_ai_response, language
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        advisoryId,
        fieldId,
        season,
        jsonVal(aiOutput.recommendedCrops),
        jsonVal(aiOutput.fertilizerSchedule),
        jsonVal(aiOutput.irrigationPlan),
        jsonVal(aiOutput.riskAssessment),
        jsonVal(aiOutput),
        targetLanguage
      ]
    );

    const saved = await query(`SELECT * FROM crop_advisories WHERE id = $1`, [advisoryId]);
    res.status(201).json(saved[0]);
  } catch (err) {
    console.error('Error generating advisory:', err);
    res.status(500).json({ error: 'Failed to generate AI advisory report' });
  }
});

// GET /api/advisory/history/:fieldId
router.get('/advisory/history/:fieldId', async (req, res) => {
  try {
    const advisories = await query(
      `SELECT a.* FROM crop_advisories a
       JOIN fields f ON a.field_id = f.id
       WHERE f.id = $1 AND f.user_id = $2
       ORDER BY a.created_at DESC`,
      [req.params.fieldId, req.user.id]
    );
    res.json(advisories);
  } catch (err) {
    console.error('Error fetching advisory history:', err);
    res.status(500).json({ error: 'Failed to fetch advisory history' });
  }
});

// GET /api/advisory/:id
router.get('/advisory/:id', async (req, res) => {
  try {
    const advisories = await query(
      `SELECT a.*, f.name as field_name, f.location_name, f.area_hectares, f.soil_type, f.ph_level, f.nitrogen_ppm, f.phosphorus_ppm, f.potassium_ppm
       FROM crop_advisories a
       JOIN fields f ON a.field_id = f.id
       WHERE a.id = $1 AND f.user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (advisories.length === 0) {
      return res.status(404).json({ error: 'Advisory report not found' });
    }

    res.json(advisories[0]);
  } catch (err) {
    console.error('Error fetching advisory:', err);
    res.status(500).json({ error: 'Failed to fetch advisory report' });
  }
});

// --- PEST & DISEASE VISUAL DIAGNOSTIC ROUTES ---

// POST /api/diagnose
router.post('/diagnose', upload.single('image'), async (req, res) => {
  try {
    const fieldId = req.body.fieldId || null;
    const targetLanguage = req.body.targetLanguage || 'en';
    
    let field = null;
    if (fieldId) {
      const fRes = await query(`SELECT * FROM fields WHERE id = $1 AND user_id = $2`, [fieldId, req.user.id]);
      if (fRes.length > 0) field = fRes[0];
    }

    let imageBuffer = req.file ? req.file.buffer : null;
    let mimeType = req.file ? req.file.mimetype : 'image/jpeg';
    
    // Default preview URL or uploaded image data URL
    let imageUrl = req.body.imageUrl || 'https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&q=80&w=800';
    if (req.file) {
      imageUrl = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
    }

    // Call Gemini 2.5 Flash Vision Diagnostic API
    const diagResult = await diagnoseCropDisease({
      imageBuffer,
      mimeType,
      field,
      targetLanguage
    });

    const diagId = uuidv4();
    const jsonVal = (val) => typeof val === 'object' ? JSON.stringify(val) : val;

    await query(
      `INSERT INTO disease_diagnostics (
        id, field_id, user_id, image_url, detected_condition, 
        confidence_score, severity_level, symptoms, treatment_protocol
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        diagId,
        fieldId,
        req.user.id,
        imageUrl,
        diagResult.conditionName,
        diagResult.confidenceScore,
        diagResult.severity,
        jsonVal(diagResult.identifiedSymptoms),
        jsonVal(diagResult.treatmentProtocol)
      ]
    );

    const saved = await query(`SELECT * FROM disease_diagnostics WHERE id = $1`, [diagId]);
    res.status(201).json(saved[0]);
  } catch (err) {
    console.error('Error performing diagnostic scan:', err);
    res.status(400).json({ error: err.message || 'Diagnostic scan failed' });
  }
});

// GET /api/diagnose/history
router.get('/diagnose/history', async (req, res) => {
  try {
    const list = await query(
      `SELECT d.*, f.name as field_name FROM disease_diagnostics d
       LEFT JOIN fields f ON d.field_id = f.id
       WHERE d.user_id = $1
       ORDER BY d.created_at DESC`,
      [req.user.id]
    );
    res.json(list);
  } catch (err) {
    console.error('Error fetching diagnostics history:', err);
    res.status(500).json({ error: 'Failed to fetch diagnostic records' });
  }
});

// --- MARKET & RISK INSIGHTS ---

// GET /api/market/insights
router.get('/market/insights', async (req, res) => {
  try {
    const market = getMarketInsights();
    // Also include summary weather risk for user's primary field
    const userFields = await query(`SELECT * FROM fields WHERE user_id = $1 LIMIT 1`, [req.user.id]);
    const primaryField = userFields[0] || null;
    const weather = getFieldWeather(primaryField?.latitude, primaryField?.longitude, primaryField?.location_name || 'Regional Zone');

    res.json({
      market,
      weatherRisk: weather.riskProfile,
      fieldForecast: weather.forecast
    });
  } catch (err) {
    console.error('Error fetching market insights:', err);
    res.status(500).json({ error: 'Failed to fetch market & risk insights' });
  }
});

// --- USER & SETTINGS ---

// GET /api/user
router.get('/user', async (req, res) => {
  try {
    const users = await query(`SELECT * FROM users WHERE id = $1`, [req.user.id]);
    res.json(users[0] || { id: req.user.id, preferred_language: 'en', unit_system: 'metric' });
  } catch (err) {
    console.error('Error fetching user settings:', err);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// PUT /api/user/settings
router.put('/user/settings', validateBody(userSettingsSchema), async (req, res) => {
  try {
    const { fullName, preferredLanguage, unitSystem } = req.body;
    await query(
      `UPDATE users SET full_name = COALESCE($1, full_name), preferred_language = $2, unit_system = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4`,
      [fullName || null, preferredLanguage, unitSystem, req.user.id]
    );
    const updated = await query(`SELECT * FROM users WHERE id = $1`, [req.user.id]);
    res.json(updated[0]);
  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(500).json({ error: 'Failed to update user settings' });
  }
});

export default router;
