import pkg from 'pg';
const { Pool } = pkg;
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

let isPostgres = false;
let pgPool = null;

// Embedded JSON file storage for zero-dependency local dev execution
const dataDir = path.resolve(process.cwd(), 'data');
const jsonDbFile = path.join(dataDir, 'db_store.json');

let store = {
  users: [],
  fields: [],
  crop_advisories: [],
  disease_diagnostics: []
};

function loadStore() {
  if (fs.existsSync(jsonDbFile)) {
    try {
      const raw = fs.readFileSync(jsonDbFile, 'utf8');
      store = JSON.parse(raw);
    } catch (e) {
      console.warn('⚠️ Could not load store file, initializing fresh store');
    }
  }
}

function saveStore() {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(jsonDbFile, JSON.stringify(store, null, 2), 'utf8');
  } catch (e) {
    console.error('❌ Failed to persist db store:', e.message);
  }
}

export const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000001";

export async function initDb() {
  if (process.env.DATABASE_URL) {
    try {
      pgPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
      });
      await pgPool.query('SELECT 1');
      isPostgres = true;
      console.log('✅ Connected to PostgreSQL Database');
      await setupPgTables();
      await seedDefaultPgData();
      return;
    } catch (err) {
      console.warn('⚠️ PostgreSQL connection failed, falling back to embedded store:', err.message);
      pgPool = null;
    }
  }

  // Pure JS file persistent engine
  console.log('✅ Running AgriWise with Embedded Storage Engine');
  loadStore();
  seedDefaultStore();
}

async function setupPgTables() {
  const ddl = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email VARCHAR(255) UNIQUE NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      preferred_language VARCHAR(10) DEFAULT 'en',
      unit_system VARCHAR(10) DEFAULT 'metric',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS fields (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      location_name VARCHAR(255) NOT NULL,
      latitude DECIMAL(10, 8),
      longitude DECIMAL(11, 8),
      area_hectares DECIMAL(10, 2) NOT NULL,
      soil_type VARCHAR(50) NOT NULL,
      nitrogen_ppm DECIMAL(6, 2) NOT NULL,
      phosphorus_ppm DECIMAL(6, 2) NOT NULL,
      potassium_ppm DECIMAL(6, 2) NOT NULL,
      ph_level DECIMAL(4, 2) NOT NULL,
      organic_matter_pct DECIMAL(4, 2),
      irrigation_type VARCHAR(50) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS crop_advisories (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      field_id UUID NOT NULL REFERENCES fields(id) ON DELETE CASCADE,
      season VARCHAR(50) NOT NULL,
      recommended_crops JSONB NOT NULL,
      fertilizer_schedule JSONB NOT NULL,
      irrigation_plan JSONB NOT NULL,
      risk_assessment JSONB NOT NULL,
      raw_ai_response JSONB NOT NULL,
      language VARCHAR(10) DEFAULT 'en',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS disease_diagnostics (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      field_id UUID REFERENCES fields(id) ON DELETE SET NULL,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      image_url TEXT NOT NULL,
      detected_condition VARCHAR(255) NOT NULL,
      confidence_score DECIMAL(5, 4) NOT NULL,
      severity_level VARCHAR(50) NOT NULL,
      symptoms JSONB NOT NULL,
      treatment_protocol JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pgPool.query(ddl);
}

// Unified Query Handler
export async function query(text, params = []) {
  if (isPostgres) {
    const res = await pgPool.query(text, params);
    return res.rows;
  }

  // Embedded store query simulator
  const sql = text.trim();

  // SELECT FROM USERS
  if (sql.includes('FROM users')) {
    if (sql.includes('WHERE id = $1')) {
      return store.users.filter(u => u.id === params[0]);
    }
    return store.users;
  }

  // UPDATE USERS
  if (sql.includes('UPDATE users')) {
    const user = store.users.find(u => u.id === params[3] || u.id === DEFAULT_USER_ID);
    if (user) {
      if (params[0]) user.full_name = params[0];
      user.preferred_language = params[1] || user.preferred_language;
      user.unit_system = params[2] || user.unit_system;
      user.updated_at = new Date().toISOString();
      saveStore();
      return [user];
    }
    return [];
  }

  // SELECT FROM FIELDS
  if (sql.includes('FROM fields')) {
    if (sql.includes('WHERE id = $1 AND user_id = $2')) {
      return store.fields.filter(f => f.id === params[0] && f.user_id === params[1]);
    }
    if (sql.includes('WHERE id = $1')) {
      return store.fields.filter(f => f.id === params[0]);
    }
    if (sql.includes('WHERE user_id = $1')) {
      return store.fields.filter(f => f.user_id === params[0]);
    }
    return store.fields;
  }

  // INSERT INTO FIELDS
  if (sql.includes('INSERT INTO fields')) {
    const newField = {
      id: params[0],
      user_id: params[1],
      name: params[2],
      location_name: params[3],
      latitude: params[4],
      longitude: params[5],
      area_hectares: params[6],
      soil_type: params[7],
      nitrogen_ppm: params[8],
      phosphorus_ppm: params[9],
      potassium_ppm: params[10],
      ph_level: params[11],
      organic_matter_pct: params[12],
      irrigation_type: params[13],
      created_at: new Date().toISOString()
    };
    store.fields.unshift(newField);
    saveStore();
    return [newField];
  }

  // UPDATE FIELDS
  if (sql.includes('UPDATE fields')) {
    const fId = params[12];
    const field = store.fields.find(f => f.id === fId);
    if (field) {
      field.name = params[0];
      field.location_name = params[1];
      field.latitude = params[2];
      field.longitude = params[3];
      field.area_hectares = params[4];
      field.soil_type = params[5];
      field.nitrogen_ppm = params[6];
      field.phosphorus_ppm = params[7];
      field.potassium_ppm = params[8];
      field.ph_level = params[9];
      field.organic_matter_pct = params[10];
      field.irrigation_type = params[11];
      saveStore();
      return [field];
    }
    return [];
  }

  // DELETE FROM FIELDS
  if (sql.includes('DELETE FROM fields')) {
    const id = params[0];
    store.fields = store.fields.filter(f => f.id !== id);
    saveStore();
    return [{ id }];
  }

  // SELECT FROM CROP_ADVISORIES
  if (sql.includes('FROM crop_advisories')) {
    if (sql.includes('WHERE a.id = $1') || sql.includes('WHERE id = $1')) {
      const adv = store.crop_advisories.find(a => a.id === params[0]);
      if (adv) {
        const field = store.fields.find(f => f.id === adv.field_id);
        return [{
          ...adv,
          field_name: field?.name,
          location_name: field?.location_name,
          area_hectares: field?.area_hectares,
          soil_type: field?.soil_type,
          ph_level: field?.ph_level,
          nitrogen_ppm: field?.nitrogen_ppm,
          phosphorus_ppm: field?.phosphorus_ppm,
          potassium_ppm: field?.potassium_ppm
        }];
      }
      return [];
    }
    if (sql.includes('WHERE f.id = $1') || sql.includes('WHERE field_id = $1')) {
      return store.crop_advisories.filter(a => a.field_id === params[0]);
    }
    return store.crop_advisories;
  }

  // INSERT INTO CROP_ADVISORIES
  if (sql.includes('INSERT INTO crop_advisories')) {
    const parseJson = (val) => typeof val === 'string' ? JSON.parse(val) : val;
    const newAdv = {
      id: params[0],
      field_id: params[1],
      season: params[2],
      recommended_crops: parseJson(params[3]),
      fertilizer_schedule: parseJson(params[4]),
      irrigation_plan: parseJson(params[5]),
      risk_assessment: parseJson(params[6]),
      raw_ai_response: parseJson(params[7]),
      language: params[8] || 'en',
      created_at: new Date().toISOString()
    };
    store.crop_advisories.unshift(newAdv);
    saveStore();
    return [newAdv];
  }

  // SELECT FROM DISEASE_DIAGNOSTICS
  if (sql.includes('FROM disease_diagnostics')) {
    if (sql.includes('WHERE id = $1')) {
      return store.disease_diagnostics.filter(d => d.id === params[0]);
    }
    return store.disease_diagnostics.map(d => {
      const field = store.fields.find(f => f.id === d.field_id);
      return { ...d, field_name: field?.name || 'General Scan' };
    });
  }

  // INSERT INTO DISEASE_DIAGNOSTICS
  if (sql.includes('INSERT INTO disease_diagnostics')) {
    const parseJson = (val) => typeof val === 'string' ? JSON.parse(val) : val;
    const newDiag = {
      id: params[0],
      field_id: params[1],
      user_id: params[2],
      image_url: params[3],
      detected_condition: params[4],
      confidence_score: params[5],
      severity_level: params[6],
      symptoms: parseJson(params[7]),
      treatment_protocol: parseJson(params[8]),
      created_at: new Date().toISOString()
    };
    store.disease_diagnostics.unshift(newDiag);
    saveStore();
    return [newDiag];
  }

  return [];
}

async function seedDefaultPgData() {
  const users = await query('SELECT * FROM users WHERE id = $1', [DEFAULT_USER_ID]);
  if (users.length === 0) {
    await query(
      `INSERT INTO users (id, email, full_name, preferred_language, unit_system) 
       VALUES ($1, $2, $3, $4, $5)`,
      [DEFAULT_USER_ID, 'demo.farmer@agriwise.ai', 'Agronomist Akhil', 'en', 'metric']
    );
  }
}

function seedDefaultStore() {
  if (store.users.length === 0) {
    console.log('🌱 Seeding AgriWise default user & field parcels...');
    store.users.push({
      id: DEFAULT_USER_ID,
      email: 'demo.farmer@agriwise.ai',
      full_name: 'Agronomist Akhil',
      preferred_language: 'en',
      unit_system: 'metric',
      created_at: new Date().toISOString()
    });

    const f1Id = uuidv4();
    const f2Id = uuidv4();

    store.fields.push(
      {
        id: f1Id,
        user_id: DEFAULT_USER_ID,
        name: 'Sunny Valley Block A',
        location_name: 'Sacramento Basin, CA',
        latitude: 38.5816,
        longitude: -121.4944,
        area_hectares: 4.5,
        soil_type: 'Loamy',
        nitrogen_ppm: 140,
        phosphorus_ppm: 45,
        potassium_ppm: 190,
        ph_level: 6.5,
        organic_matter_pct: 3.2,
        irrigation_type: 'Drip',
        created_at: new Date().toISOString()
      },
      {
        id: f2Id,
        user_id: DEFAULT_USER_ID,
        name: 'Highland Organic Terrace',
        location_name: 'Punjab Valley Region',
        latitude: 30.9010,
        longitude: 75.8573,
        area_hectares: 2.8,
        soil_type: 'Clay',
        nitrogen_ppm: 95,
        phosphorus_ppm: 28,
        potassium_ppm: 130,
        ph_level: 7.2,
        organic_matter_pct: 2.1,
        irrigation_type: 'Sprinkler',
        created_at: new Date().toISOString()
      }
    );

    // Seed initial advisory
    const advId = uuidv4();
    store.crop_advisories.push({
      id: advId,
      field_id: f1Id,
      season: 'Summer',
      recommended_crops: [
        {
          cropName: "Sweet Corn (Zea mays)",
          suitabilityScore: 94,
          projectedYieldPerHectareKg: 9500,
          reasoning: "Optimal soil NPK balance (140-45-190 PPM) and favorable pH of 6.5 provide ideal growth conditions.",
          economicViability: "High market demand. Estimated gross revenue of $4,800/ha."
        },
        {
          cropName: "Roma Tomatoes (Solanum lycopersicum)",
          suitabilityScore: 89,
          projectedYieldPerHectareKg: 18200,
          reasoning: "Drip irrigation system coupled with rich organic loamy soil yields strong root uptake.",
          economicViability: "Premium fresh market pricing. Estimated gross revenue of $7,200/ha."
        },
        {
          cropName: "Soybeans (Glycine max)",
          suitabilityScore: 84,
          projectedYieldPerHectareKg: 3800,
          reasoning: "Excellent crop rotation candidate to naturally fix atmospheric nitrogen into the root zone.",
          economicViability: "Stable futures contract prices. Low input cost requirement."
        }
      ],
      fertilizer_schedule: [
        {
          growthStage: "Pre-Planting Soil Prep",
          nitrogenKgHa: 30,
          phosphorusKgHa: 45,
          potassiumKgHa: 20,
          applicationMethod: "Broadcast incorporation 10cm deep into soil bed"
        },
        {
          growthStage: "Vegetative Peak Growth",
          nitrogenKgHa: 60,
          phosphorusKgHa: 0,
          potassiumKgHa: 25,
          applicationMethod: "Side-dressing along drip irrigation line"
        },
        {
          growthStage: "Tasseling & Silking Stage",
          nitrogenKgHa: 40,
          phosphorusKgHa: 15,
          potassiumKgHa: 35,
          applicationMethod: "Foliar spray and fertigation via drip lines"
        }
      ],
      irrigation_plan: {
        weeklyWaterRequirementLitersPerHa: 32000,
        wateringFrequencyDays: 3,
        criticalGrowthStages: ["Germination", "Tasseling & Pollination", "Kernel Milk Stage"],
        droughtMitigationTip: "Apply 5-7cm organic straw mulch to conserve moisture and maintain soil temp below 28°C."
      },
      risk_assessment: {
        diseaseRisks: ["Northern Corn Leaf Blight", "Gray Leaf Spot"],
        pestRisks: ["Corn Earworm", "Western Corn Rootworm"],
        climateRiskLevel: "Low",
        mitigationStrategy: "Deploy resistant hybrid seeds and monitor sticky traps bi-weekly."
      },
      raw_ai_response: { status: "success", model: "gemini-2.5-pro" },
      language: "en",
      created_at: new Date().toISOString()
    });

    // Seed initial diagnostic
    store.disease_diagnostics.push({
      id: uuidv4(),
      field_id: f1Id,
      user_id: DEFAULT_USER_ID,
      image_url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&q=80&w=800',
      detected_condition: 'Tomato Early Blight (Alternaria solani)',
      confidence_score: 0.964,
      severity_level: 'Moderate',
      symptoms: [
        "Irregular brown necrotic lesions with yellow halos on leaf surface",
        "Early leaf defoliation on lower canopy",
        "Stunted vine elongation"
      ],
      treatment_protocol: {
        organicControls: [
          "Apply Copper Octanoate (Soap) spray every 7 days during damp conditions",
          "Neem oil (0.5% concentration) application at dawn or dusk"
        ],
        chemicalControls: [
          "Chlorothalonil 75% WP spray at 2.0g/L water ratio",
          "Mancozeb 75% DF preventative broad-spectrum fungicide"
        ],
        preventativeSteps: [
          "Prune lower leaves up to 30cm off soil line to improve airflow",
          "Avoid overhead irrigation; switch exclusively to drip system",
          "Practice 3-year crop rotation with non-solanaceous crops"
        ]
      },
      created_at: new Date().toISOString()
    });

    saveStore();
  }
}
