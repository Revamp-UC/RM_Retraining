-- RM RETRAINING DATABASE SCHEMA
-- Run this in Supabase SQL Editor

-- Users table (pre-seeded, no public registration)
CREATE TABLE IF NOT EXISTS users (
  mobile_number   VARCHAR(15) PRIMARY KEY,
  name            VARCHAR(100) NOT NULL,
  password        VARCHAR(255) NOT NULL,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Custom auth sessions
CREATE TABLE IF NOT EXISTS sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mobile_number   VARCHAR(15) NOT NULL REFERENCES users(mobile_number) ON DELETE CASCADE,
  token           TEXT NOT NULL UNIQUE,
  expires_at      TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_mobile ON sessions(mobile_number);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- Consultation history (one row per session)
CREATE TABLE IF NOT EXISTS consultation_history (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mobile_number       VARCHAR(15) NOT NULL REFERENCES users(mobile_number) ON DELETE CASCADE,
  module_attempted    VARCHAR(100) NOT NULL,
  customer_name       VARCHAR(100),
  customer_gender     VARCHAR(10),
  attempt_date        DATE NOT NULL,
  attempt_time        TIME NOT NULL,
  duration_seconds    INTEGER,
  overall_score       DECIMAL(5,2),
  introduction_score  DECIMAL(5,2),
  technical_score     DECIMAL(5,2),
  budget_score        DECIMAL(5,2),
  discovery_score     DECIMAL(5,2),
  report_card_json    JSONB,
  status              VARCHAR(20) DEFAULT 'in_progress',
  created_at          TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_consultation_mobile ON consultation_history(mobile_number);
CREATE INDEX IF NOT EXISTS idx_consultation_module ON consultation_history(mobile_number, module_attempted);
CREATE INDEX IF NOT EXISTS idx_consultation_date ON consultation_history(attempt_date DESC);

-- Full transcripts (never exposed to RM frontend)
CREATE TABLE IF NOT EXISTS transcripts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id     UUID NOT NULL REFERENCES consultation_history(id) ON DELETE CASCADE,
  mobile_number       VARCHAR(15) NOT NULL REFERENCES users(mobile_number) ON DELETE CASCADE,
  module_attempted    VARCHAR(100) NOT NULL,
  customer_name       VARCHAR(100),
  full_transcript     JSONB NOT NULL DEFAULT '[]',
  created_at          TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_transcripts_consultation ON transcripts(consultation_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_transcripts_unique ON transcripts(consultation_id);

-- Row Level Security: lock everything down to service role only
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcripts ENABLE ROW LEVEL SECURITY;

-- No public access. Server uses SUPABASE_SERVICE_ROLE_KEY only.
-- Anon and authenticated roles cannot access any table directly.
CREATE POLICY "no_public_access_users" ON users FOR ALL TO anon, authenticated USING (false);
CREATE POLICY "no_public_access_sessions" ON sessions FOR ALL TO anon, authenticated USING (false);
CREATE POLICY "no_public_access_consultations" ON consultation_history FOR ALL TO anon, authenticated USING (false);
CREATE POLICY "no_public_access_transcripts" ON transcripts FOR ALL TO anon, authenticated USING (false);
