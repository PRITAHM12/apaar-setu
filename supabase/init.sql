-- ============================================================================
-- APAAR-Setu PostgreSQL 16 Schema for Supabase
-- Anti-Fraud Academic Ledger, Single-Enrollment Constraint, & Realtime Auditing
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Teardown if re-running
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS colleges CASCADE;
DROP TYPE IF EXISTS enrollment_status_enum CASCADE;
DROP TYPE IF EXISTS kyc_status_enum CASCADE;

-- 1. Custom Types
CREATE TYPE enrollment_status_enum AS ENUM ('Pending', 'Approved');
CREATE TYPE kyc_status_enum AS ENUM ('VERIFIED', 'PENDING', 'REJECTED');

-- 2. Colleges Table
CREATE TABLE colleges (
    college_id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    approved_intake_quota INT NOT NULL CHECK (approved_intake_quota > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Students Table
CREATE TABLE students (
    apaar_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    kyc_status kyc_status_enum NOT NULL DEFAULT 'VERIFIED',
    email VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_apaar_format CHECK (apaar_id ~ '^[0-9]{4}-[0-9]{4}-[0-9]{4}$')
);

-- 4. Enrollments Table (Strict Multi-College Anti-Fraud Constraint)
CREATE TABLE enrollments (
    enrollment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id VARCHAR(64) NOT NULL REFERENCES colleges(college_id) ON DELETE RESTRICT,
    apaar_id VARCHAR(20) NOT NULL REFERENCES students(apaar_id) ON DELETE CASCADE,
    status enrollment_status_enum NOT NULL DEFAULT 'Pending',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Anti-Fraud Constraint: A student can only be enrolled in one institution
    CONSTRAINT uq_enrollments_apaar UNIQUE (apaar_id)
);

-- 5. Audit Logs Table (Immutable Realtime Log Stream)
CREATE TABLE audit_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(128) NOT NULL,
    action TEXT NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Indexes
CREATE INDEX idx_enrollments_college ON enrollments(college_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- ----------------------------------------------------------------------------
-- 7. ENABLE SUPABASE REALTIME WEBSOCKETS ON AUDIT_LOGS AND ENROLLMENTS
-- ----------------------------------------------------------------------------
ALTER TABLE audit_logs REPLICA IDENTITY FULL;
ALTER TABLE enrollments REPLICA IDENTITY FULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'audit_logs'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE audit_logs;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'enrollments'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE enrollments;
    END IF;
EXCEPTION
    WHEN undefined_object THEN
        CREATE PUBLICATION supabase_realtime FOR TABLE audit_logs, enrollments;
END $$;

-- 8. Seed Baseline Institutions & Records
INSERT INTO colleges (college_id, name, approved_intake_quota)
VALUES 
    ('COL-LNCTE-001', 'Lakshmi Narain College of Technology & Excellence, Bhopal', 60),
    ('COL-IITD-002', 'Indian Institute of Technology Delhi', 120),
    ('COL-NITK-003', 'National Institute of Technology Karnataka, Surathkal', 90)
ON CONFLICT (college_id) DO NOTHING;

INSERT INTO students (apaar_id, name, kyc_status, email)
VALUES 
    ('7841-9023-4412', 'Pritam Raj Chaurasiya', 'VERIFIED', 'pritam.raj@student.gov.in'),
    ('8832-5519-1029', 'Ananya Sharma', 'VERIFIED', 'ananya.sharma@student.gov.in')
ON CONFLICT (apaar_id) DO NOTHING;

INSERT INTO enrollments (college_id, apaar_id, status)
VALUES 
    ('COL-LNCTE-001', '7841-9023-4412', 'Approved')
ON CONFLICT (apaar_id) DO NOTHING;
