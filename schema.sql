-- ====================================================================
-- AgriWise Database Schema & Initial Migration (PostgreSQL / Supabase)
-- ====================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users / Farmers Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    preferred_language VARCHAR(10) DEFAULT 'en',
    unit_system VARCHAR(10) DEFAULT 'metric',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Fields / Land Parcels Table
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

-- 4. AI Crop Advisories Table
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

-- 5. Disease Visual Diagnostics Table
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

-- 6. Indexes for Query Optimization
CREATE INDEX IF NOT EXISTS idx_fields_user_id ON fields(user_id);
CREATE INDEX IF NOT EXISTS idx_advisories_field_id ON crop_advisories(field_id);
CREATE INDEX IF NOT EXISTS idx_diagnostics_field_id ON disease_diagnostics(field_id);
CREATE INDEX IF NOT EXISTS idx_diagnostics_user_id ON disease_diagnostics(user_id);

-- ====================================================================
-- SEED INITIAL SEED DATA FOR DEMO & TESTING
-- ====================================================================

-- Default Demo User
INSERT INTO users (id, email, full_name, preferred_language, unit_system) 
VALUES ('00000000-0000-0000-0000-000000000001', 'demo.farmer@agriwise.ai', 'Agronomist Akhil', 'en', 'metric')
ON CONFLICT (id) DO NOTHING;

-- Sample Land Parcel 1
INSERT INTO fields (id, user_id, name, location_name, latitude, longitude, area_hectares, soil_type, nitrogen_ppm, phosphorus_ppm, potassium_ppm, ph_level, organic_matter_pct, irrigation_type)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000001',
    'Sunny Valley Block A',
    'Sacramento Basin, CA',
    38.5816,
    -121.4944,
    4.50,
    'Loamy',
    140.00,
    45.00,
    190.00,
    6.50,
    3.20,
    'Drip'
) ON CONFLICT (id) DO NOTHING;

-- Sample Land Parcel 2
INSERT INTO fields (id, user_id, name, location_name, latitude, longitude, area_hectares, soil_type, nitrogen_ppm, phosphorus_ppm, potassium_ppm, ph_level, organic_matter_pct, irrigation_type)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000001',
    'Highland Organic Terrace',
    'Punjab Valley Region',
    30.9010,
    75.8573,
    2.80,
    'Clay',
    95.00,
    28.00,
    130.00,
    7.20,
    2.10,
    'Sprinkler'
) ON CONFLICT (id) DO NOTHING;
