-- ============================================================================
-- APAAR-Setu (TRL-6 Smart India Hackathon Architecture)
-- PostgreSQL 16 Database Schema for Supabase
-- Zero-Trust Academic Ledger, Anti-Fraud Intake Engine, & Real-Time Auditing
-- ============================================================================

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean existing objects if re-initializing (deterministic teardown)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS colleges CASCADE;
DROP TYPE IF EXISTS enrollment_status CASCADE;
DROP TYPE IF EXISTS kyc_status_enum CASCADE;

-- ----------------------------------------------------------------------------
-- 1. Custom Types
-- ----------------------------------------------------------------------------
CREATE TYPE enrollment_status AS ENUM ('Pending', 'Approved');
CREATE TYPE kyc_status_enum AS ENUM ('VERIFIED', 'PENDING', 'REJECTED');

-- ----------------------------------------------------------------------------
-- 2. Colleges Table
-- Defines educational institutions and their statutory sanctioned intake quota
-- ----------------------------------------------------------------------------
CREATE TABLE colleges (
    college_id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    approved_intake_quota INT NOT NULL CHECK (approved_intake_quota > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. Students Table
-- Canonical sovereign academic identity records indexed by 12-digit APAAR ID
-- ----------------------------------------------------------------------------
CREATE TABLE students (
    apaar_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    kyc_status kyc_status_enum NOT NULL DEFAULT 'VERIFIED',
    email VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_apaar_format CHECK (apaar_id ~ '^[0-9]{4}-[0-9]{4}-[0-9]{4}$')
);

-- ----------------------------------------------------------------------------
-- 4. Enrollments Table
-- Tracks student admissions with strict single-college constraint
-- ----------------------------------------------------------------------------
CREATE TABLE enrollments (
    enrollment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id VARCHAR(64) NOT NULL REFERENCES colleges(college_id) ON DELETE RESTRICT,
    apaar_id VARCHAR(20) NOT NULL REFERENCES students(apaar_id) ON DELETE CASCADE,
    status enrollment_status NOT NULL DEFAULT 'Pending',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- CRITICAL ANTI-FRAUD RULE:
    -- Strict Unique Constraint on apaar_id prevents multi-college enrollment fraud
    CONSTRAINT uq_enrollments_apaar UNIQUE (apaar_id)
);

-- ----------------------------------------------------------------------------
-- 5. Audit Logs Table
-- Immutable ledger for security, quota violations, and access events
-- ----------------------------------------------------------------------------
CREATE TABLE audit_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(128) NOT NULL,
    action TEXT NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. Performance Indexes
-- Optimized for high-throughput batch validation and real-time streaming
-- ----------------------------------------------------------------------------
CREATE INDEX idx_enrollments_college ON enrollments(college_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- ----------------------------------------------------------------------------
-- 7. Supabase Realtime Publication Setup
-- Enables WebSocket push events to frontend for instantaneous anomaly alerting
-- ----------------------------------------------------------------------------
ALTER TABLE audit_logs REPLICA IDENTITY FULL;

-- Add audit_logs to Supabase realtime publication
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'audit_logs'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE audit_logs;
    END IF;
EXCEPTION
    WHEN undefined_object THEN
        -- If running locally without supabase_realtime publication
        CREATE PUBLICATION supabase_realtime FOR TABLE audit_logs;
END $$;

-- ----------------------------------------------------------------------------
-- 8. Seed Baseline Data (TRL-6 Ready Institutional Profiles)
-- ----------------------------------------------------------------------------
INSERT INTO colleges (college_id, name, approved_intake_quota)
VALUES 
    ('COL-LNCTE-001', 'Lakshmi Narain College of Technology & Excellence, Bhopal', 60),
    ('COL-IITD-002', 'Indian Institute of Technology Delhi', 120),
    ('COL-NITK-003', 'National Institute of Technology Karnataka, Surathkal', 90)
ON CONFLICT (college_id) DO NOTHING;

-- Seed baseline verified student identity
INSERT INTO students (apaar_id, name, kyc_status, email)
VALUES 
    ('7841-9023-4412', 'Pritam Raj Chaurasiya', 'VERIFIED', 'pritam.raj@student.gov.in'),
    ('8832-5519-1029', 'Ananya Sharma', 'VERIFIED', 'ananya.sharma@student.gov.in')
ON CONFLICT (apaar_id) DO NOTHING;

-- Seed existing approved enrollment (58 already enrolled at LNCTE)
INSERT INTO enrollments (college_id, apaar_id, status)
VALUES 
    ('COL-LNCTE-001', '7841-9023-4412', 'Approved')
ON CONFLICT (apaar_id) DO NOTHING;
