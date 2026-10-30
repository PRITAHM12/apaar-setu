```markdown
# Mock API Contracts & Synchronized Seed Data (v2.0)

## 1. Pre-Seeded Global State (`src/data/seedData.ts`)
Use these exact records so all 4 dashboards are immediately populated and interconnected:

### Primary Demo Student Record
- **Full Name:** `Pritam Raj Chaurasiya`
- **APAAR ID:** `7841-9023-4412`
- **Enrolled Institute PID:** `PID-1-4920182` (`Lakshmi Narain College of Technology Excellence - Demo Tenant`)
- **Program:** `B.Tech Computer Science & Engineering`
- **Current Status:** `ACTIVE (Semester 3)`
- **Cumulative CGPA:** `8.40` | **ABC Credits Earned:** `68`
- **Semester Breakdown:**
  - `Sem 1`: SGPA `8.20` | Credits `22` | Anchored Hash: `0x7a19c42e8b10f92a3d4e5f6a7b8c9d0e1f2a3b4c`
  - `Sem 2`: SGPA `8.60` | Credits `24` | Anchored Hash: `0x3f88d19a4c77e2019b8a7c6d5e4f3a2b1c0d9e8f`
  - `Sem 3`: SGPA `8.40` | Credits `22` | Anchored Hash: `0x8f92e41b7c2091a41c5d6e7f8a9b0c1d2e3f4a5b`

### Fraud & Conflict Seed Record (Triggered during Nodal CSV Batch Sync)
- **Conflict APAAR ID:** `8832-5519-1029`
- **Student Name:** `Rohan Verma (Duplicate Enrollment Flag)`
- **Existing Active Institute:** `PID-1-3310 (Institute of Engineering & Science - Tenant B)`
- **Attempted New Enrollment:** `PID-1-4920182`
- **System Action:** Throws `HTTP 409 CONFLICT (ERR_APAAR_DUAL_ENROLLMENT)` and blocks scholarship/admission registration.

### Pending DPDP Act 2023 Consent Request
- **Consent ID:** `CONSENT-2026-991`
- **Target APAAR ID:** `7841-9023-4412`
- **Requester Organization:** `Infosys Campus Hiring BGV Portal (ORG-INFOSYS-BGV)`
- **Requested Scope:** `B.Tech CSE Sem 1-3 Verified Transcript & CGPA`
- **Default Status:** `PENDING` (Can be toggled to `APPROVED` or `REVOKED` by `ROLE_STUDENT`, with `zeroKnowledgeMode: true` masking Aadhaar/Address).

## 2. Simulated API Interceptors & Status Codes
1. `POST /api/v1/nodal/batch-sync`
   - Checks active role === `ROLE_INST_NODAL`.
   - Processes 120 sample rows, commits valid hashes (`HTTP 200`), and halts on `8832-5519-1029` with `HTTP 409 Conflict`.
2. `GET /api/v1/nodal/cross-tenant-test?targetPid=PID-1-3310`
   - Simulates `ROLE_INST_NODAL` (`PID-1-4920182`) attempting to read another college's records.
   - Immediately returns `HTTP 403 Forbidden (ERR_POSTGRES_RLS_POLICY_VIOLATION)`.
3. `POST /api/v1/verifier/forensic-scan`
   - Accepts mode `'AUTHENTIC'` or `'TAMPERED_CGPA'`.
   - In `'TAMPERED_CGPA'` mode, returns `HTTP 422 Unprocessable Entity`, showing `ocrExtractedCgpa: 9.40`, `officialLedgerCgpa: 8.40`, `hashMatch: false`, and highlights the altered region on the visual certificate preview.