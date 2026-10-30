-- ============================================================
-- APAAR-Setu: PostgreSQL 16 Schema with Row-Level Security
-- PROTOTYPE — NON-OFFICIAL CONCEPT | ZERO-TRUST RBAC ENGINE
--
-- SIH 2026: "Development of an APAAR ID-Based Student Data
-- Management and Verification Platform for AICTE-Approved
-- Institutions"
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE enrollment_status AS ENUM (
    'ACTIVE',
    'TRANSFERRED',
    'GRADUATED',
    'REVOKED',
    'BLOCKED'
);

CREATE TYPE consent_status AS ENUM (
    'PENDING',
    'APPROVED',
    'REVOKED',
    'EXPIRED'
);

CREATE TYPE user_role AS ENUM (
    'ROLE_COUNCIL_ADMIN',
    'ROLE_INST_NODAL',
    'ROLE_STUDENT',
    'ROLE_VERIFIER'
);

CREATE TYPE forensic_verdict AS ENUM (
    'AUTHENTIC',
    'TAMPERED_CGPA',
    'TAMPERED_CREDITS',
    'TAMPERED_IDENTITY',
    'INCONCLUSIVE'
);

-- ============================================================
-- TABLE: institutions
-- AICTE-approved institute registry keyed by Institute PID.
-- ============================================================

CREATE TABLE institutions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_pid   VARCHAR(20)  NOT NULL UNIQUE,        -- e.g. 'PID-1-4920182'
    name            VARCHAR(255) NOT NULL,
    city            VARCHAR(100),
    state           VARCHAR(100),
    aicte_approved  BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: students
-- Master student identity. The 12-digit APAAR ID (format
-- XXXX-XXXX-XXXX) is the unique natural key across all
-- institutions nationally.
-- ============================================================

CREATE TABLE students (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    apaar_id        VARCHAR(14)  NOT NULL UNIQUE,         -- ^\\d{4}-\\d{4}-\\d{4}$
    full_name       VARCHAR(255) NOT NULL,
    date_of_birth   DATE,
    gender          VARCHAR(20),
    email           VARCHAR(255),
    phone           VARCHAR(15),
    address_masked  TEXT,        -- Encrypted/masked under DPDP Act 2023
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_apaar_format CHECK (apaar_id ~ '^\d{4}-\d{4}-\d{4}$')
);

-- ============================================================
-- TABLE: enrollments
-- Links student ↔ institute. A student can be enrolled at
-- multiple institutes over time, but only ONE can be ACTIVE
-- full-time at any given moment (enforced by partial index).
-- ============================================================

CREATE TABLE enrollments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id      UUID         NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
    institute_id    UUID         NOT NULL REFERENCES institutions(id) ON DELETE RESTRICT,
    program         VARCHAR(255) NOT NULL,
    semester        INTEGER      NOT NULL CHECK (semester >= 1 AND semester <= 12),
    status          enrollment_status NOT NULL DEFAULT 'ACTIVE',
    enrolled_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- UNIQUE PARTIAL INDEX:
-- Prevents a single 12-digit APAAR ID from holding two
-- simultaneous ACTIVE full-time enrollments. This is the
-- database-level enforcement behind the HTTP 409 CONFLICT
-- response (ERR_APAAR_DUAL_ENROLLMENT).
-- ============================================================

CREATE UNIQUE INDEX idx_one_active_enrollment_per_student
    ON enrollments (student_id)
    WHERE (status = 'ACTIVE');

-- ============================================================
-- TABLE: academic_records
-- Semester-wise CGPA, ABC credits, and W3C Merkle hash.
-- RLS-protected: ROLE_INST_NODAL can only see records
-- belonging to their own institute_id.
-- ============================================================

CREATE TABLE academic_records (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enrollment_id   UUID         NOT NULL REFERENCES enrollments(id) ON DELETE RESTRICT,
    institute_id    UUID         NOT NULL REFERENCES institutions(id) ON DELETE RESTRICT,
    student_id      UUID         NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
    semester        INTEGER      NOT NULL CHECK (semester >= 1 AND semester <= 12),
    sgpa            NUMERIC(4,2) NOT NULL CHECK (sgpa >= 0.00 AND sgpa <= 10.00),
    cgpa            NUMERIC(4,2) NOT NULL CHECK (cgpa >= 0.00 AND cgpa <= 10.00),
    abc_credits     INTEGER      NOT NULL DEFAULT 0 CHECK (abc_credits >= 0),
    merkle_hash     VARCHAR(70),     -- SHA-256 hex with 0x prefix (66 chars)
    verified        BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_record_per_enrollment_sem UNIQUE (enrollment_id, semester)
);

-- ============================================================
-- TABLE: dpdp_consents
-- DPDP Act 2023 Consent Ledger. Students grant or revoke
-- time-bound access to their academic data for verifiers
-- (recruiters, universities). Supports Zero-Knowledge PII
-- masking mode.
-- ============================================================

CREATE TABLE dpdp_consents (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consent_code    VARCHAR(30)  NOT NULL UNIQUE,          -- e.g. 'CONSENT-2026-991'
    student_id      UUID         NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
    requester_name  VARCHAR(255) NOT NULL,
    requester_org   VARCHAR(100),                          -- e.g. 'ORG-INFOSYS-BGV'
    requester_email VARCHAR(255),
    purpose         TEXT         NOT NULL,
    data_scope      TEXT         NOT NULL,                  -- e.g. 'B.Tech CSE Sem 1-3 Verified Transcript & CGPA'
    zero_knowledge_mode BOOLEAN  NOT NULL DEFAULT FALSE,
    status          consent_status NOT NULL DEFAULT 'PENDING',
    expires_at      TIMESTAMPTZ  NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
    granted_at      TIMESTAMPTZ,
    revoked_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: forensic_scans
-- Stores results of AI document forensics (OCR extraction,
-- font-kerning analysis, ELA pixel tamper detection).
-- ============================================================

CREATE TABLE forensic_scans (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_id       UUID         REFERENCES academic_records(id),
    institute_id    UUID         NOT NULL REFERENCES institutions(id),
    scanned_by      VARCHAR(255),
    verdict         forensic_verdict NOT NULL,
    ocr_extracted_cgpa  VARCHAR(10),
    official_ledger_cgpa VARCHAR(10),
    hash_match      BOOLEAN      NOT NULL DEFAULT TRUE,
    confidence      NUMERIC(5,2),
    bounding_box    JSONB,       -- {"x": 412, "y": 680, "width": 95, "height": 28}
    details         JSONB,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: security_audit_logs
-- Append-only SHA-256 chained ledger. Every security event
-- (role switch, 200 OK, 403 RLS block, 409 conflict, 422
-- tamper alert) is logged with a hash chain for tamper
-- evidence.
-- ============================================================

CREATE TABLE security_audit_logs (
    id              BIGSERIAL PRIMARY KEY,
    event_type      VARCHAR(100) NOT NULL,    -- e.g. BATCH_SYNC_OK, DUAL_ENROLLMENT_BLOCKED, RLS_VIOLATION, TAMPER_DETECTED
    http_status     INTEGER      NOT NULL,    -- 200, 403, 409, 422
    actor_email     VARCHAR(255) NOT NULL,
    actor_role      user_role,
    institute_id    UUID         REFERENCES institutions(id),
    payload         JSONB        NOT NULL DEFAULT '{}',
    prev_hash       VARCHAR(70),              -- Hash of previous entry (NULL for genesis)
    current_hash    VARCHAR(70)  NOT NULL,    -- SHA-256(prev_hash + event_type + payload)
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_event_type    ON security_audit_logs(event_type);
CREATE INDEX idx_audit_http_status   ON security_audit_logs(http_status);
CREATE INDEX idx_audit_actor         ON security_audit_logs(actor_email);
CREATE INDEX idx_audit_institute     ON security_audit_logs(institute_id);
CREATE INDEX idx_audit_created       ON security_audit_logs(created_at DESC);

-- ============================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
--
-- Enforces tenant isolation: ROLE_INST_NODAL users can ONLY
-- access rows where institute_id matches their session's
-- app.current_institute_id. ROLE_COUNCIL_ADMIN bypasses RLS.
-- Violations surface as HTTP 403 Forbidden
-- (ERR_POSTGRES_RLS_POLICY_VIOLATION).
-- ============================================================

-- Enable RLS on institute-scoped tables
ALTER TABLE academic_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE forensic_scans   ENABLE ROW LEVEL SECURITY;

-- Force RLS even for table owners (critical for demo integrity)
ALTER TABLE academic_records FORCE ROW LEVEL SECURITY;
ALTER TABLE enrollments      FORCE ROW LEVEL SECURITY;
ALTER TABLE forensic_scans   FORCE ROW LEVEL SECURITY;

-- Policy: academic_records — isolate ROLE_INST_NODAL to own institute
CREATE POLICY rls_academic_records_institute_isolation
    ON academic_records
    FOR ALL
    USING (
        institute_id = current_setting('app.current_institute_id', TRUE)::UUID
        OR current_setting('app.current_role', TRUE) = 'ROLE_COUNCIL_ADMIN'
    );

-- Policy: enrollments — isolate ROLE_INST_NODAL to own institute
CREATE POLICY rls_enrollments_institute_isolation
    ON enrollments
    FOR ALL
    USING (
        institute_id = current_setting('app.current_institute_id', TRUE)::UUID
        OR current_setting('app.current_role', TRUE) = 'ROLE_COUNCIL_ADMIN'
    );

-- Policy: forensic_scans — isolate ROLE_INST_NODAL to own institute
CREATE POLICY rls_forensic_scans_institute_isolation
    ON forensic_scans
    FOR ALL
    USING (
        institute_id = current_setting('app.current_institute_id', TRUE)::UUID
        OR current_setting('app.current_role', TRUE) = 'ROLE_COUNCIL_ADMIN'
    );

-- ============================================================
-- SEED DATA
-- Matches APIS.md and RULES_AND_SEED.md exactly.
-- ============================================================

-- Institutions
INSERT INTO institutions (id, institute_pid, name, city, state) VALUES
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PID-1-4920182',
     'Lakshmi Narain College of Technology Excellence - Demo Tenant',
     'New Delhi', 'Delhi'),
    ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'PID-1-3310',
     'Institute of Engineering & Science - Tenant B',
     'Mumbai', 'Maharashtra');

-- Students
INSERT INTO students (id, apaar_id, full_name, date_of_birth, gender, email) VALUES
    ('c3d4e5f6-a7b8-9012-cdef-123456789012', '7841-9023-4412',
     'Pritam Raj Chaurasiya', '2004-07-15', 'Male', 'pritam@demo.student'),
    ('d4e5f6a7-b8c9-0123-defa-234567890123', '8832-5519-1029',
     'Rohan Verma', '2004-03-22', 'Male', 'rohan@demo.student'),
    ('e5f6a7b8-c9d0-1234-efab-345678901234', '5501-3378-2290',
     'Ananya Sharma', '2003-11-08', 'Female', 'ananya@demo.student'),
    ('f6a7b8c9-d0e1-2345-fabc-456789012345', '6623-4481-7756',
     'Vikram Singh', '2002-01-30', 'Male', 'vikram@demo.student');

-- Enrollments
INSERT INTO enrollments (id, student_id, institute_id, program, semester, status) VALUES
    -- Pritam: ACTIVE at PID-1-4920182
    ('11111111-aaaa-bbbb-cccc-dddddddddddd',
     'c3d4e5f6-a7b8-9012-cdef-123456789012',
     'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
     'B.Tech Computer Science & Engineering', 3, 'ACTIVE'),
    -- Rohan: ACTIVE at PID-1-3310 (triggers 409 when PID-1-4920182 attempts sync)
    ('22222222-aaaa-bbbb-cccc-dddddddddddd',
     'd4e5f6a7-b8c9-0123-defa-234567890123',
     'b2c3d4e5-f6a7-8901-bcde-f12345678901',
     'B.Tech Electronics & Communication', 3, 'ACTIVE'),
    -- Ananya: ACTIVE at PID-1-4920182
    ('33333333-aaaa-bbbb-cccc-dddddddddddd',
     'e5f6a7b8-c9d0-1234-efab-345678901234',
     'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
     'B.Tech Computer Science & Engineering', 5, 'ACTIVE'),
    -- Vikram: GRADUATED from PID-1-4920182
    ('44444444-aaaa-bbbb-cccc-dddddddddddd',
     'f6a7b8c9-d0e1-2345-fabc-456789012345',
     'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
     'B.Tech Computer Science & Engineering', 7, 'GRADUATED');

-- Academic Records (exact hashes from APIS.md)
INSERT INTO academic_records (enrollment_id, institute_id, student_id, semester, sgpa, cgpa, abc_credits, merkle_hash, verified) VALUES
    ('11111111-aaaa-bbbb-cccc-dddddddddddd',
     'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
     'c3d4e5f6-a7b8-9012-cdef-123456789012',
     1, 8.20, 8.20, 22,
     '0x7a19c42e8b10f92a3d4e5f6a7b8c9d0e1f2a3b4c', TRUE),

    ('11111111-aaaa-bbbb-cccc-dddddddddddd',
     'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
     'c3d4e5f6-a7b8-9012-cdef-123456789012',
     2, 8.60, 8.35, 24,
     '0x3f88d19a4c77e2019b8a7c6d5e4f3a2b1c0d9e8f', TRUE),

    ('11111111-aaaa-bbbb-cccc-dddddddddddd',
     'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
     'c3d4e5f6-a7b8-9012-cdef-123456789012',
     3, 8.40, 8.40, 22,
     '0x8f92e41b7c2091a41c5d6e7f8a9b0c1d2e3f4a5b', TRUE);

-- DPDP Consent (Consent ID from APIS.md)
INSERT INTO dpdp_consents (consent_code, student_id, requester_name, requester_org,
    requester_email, purpose, data_scope, zero_knowledge_mode, status) VALUES
    ('CONSENT-2026-991',
     'c3d4e5f6-a7b8-9012-cdef-123456789012',
     'Infosys Campus Hiring BGV Portal', 'ORG-INFOSYS-BGV', 'bgv@infosys.demo',
     'Background Verification for Campus Placement',
     'B.Tech CSE Sem 1-3 Verified Transcript & CGPA',
     FALSE, 'PENDING');

-- Genesis audit log entry
INSERT INTO security_audit_logs (event_type, http_status, actor_email, actor_role,
    payload, prev_hash, current_hash) VALUES
    ('SYSTEM_INIT', 200, 'system', 'ROLE_COUNCIL_ADMIN',
     '{"message":"APAAR-Setu platform initialized","version":"1.0.0"}',
     NULL,
     encode(digest('SYSTEM_INIT|200|system|APAAR-Setu platform initialized', 'sha256'), 'hex'));
