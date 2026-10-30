# APAAR-Setu — Rules, Seed Data & Legal Constraints

> **PROTOTYPE — NON-OFFICIAL CONCEPT | ZERO-TRUST RBAC ENGINE**

---

## ⚠️ STRICT LEGAL RULES

1. **ZERO Official Logos**: No AICTE, DigiLocker, ABC (Academic Bank of Credits), UGC, Ministry of Education, or any Government of India logos, seals, or emblems may appear anywhere in this prototype — code, UI, assets, or documentation.
2. **Branding**: Use `Lucide ShieldCheck` icon as the app logo. Every page/screen must display the header badge:
   ```
   PROTOTYPE — NON-OFFICIAL CONCEPT | ZERO-TRUST RBAC ENGINE
   ```
3. **DPDP Act 2023**: All PII handling must follow Data Protection and Digital Privacy Act 2023 consent flows. No PII is shared without explicit student consent.
4. **Demo Data Only**: All seed data is fictional and for demonstration purposes only.

---

## 🧑‍🎓 Seed Data — Students

### Primary Demo Student
| Field         | Value                        |
|---------------|------------------------------|
| Name          | `Pritam Raj Chaurasiya`      |
| APAAR ID      | `7841-9023-4412`             |
| Institute ID  | `PID-1-4920182`              |
| Program       | B.Tech Computer Science & Engineering |
| Semester      | 3                            |
| CGPA          | `8.40`                       |
| ABC Credits   | `68`                         |
| Status        | `ACTIVE`                     |

### Dual-Enrollment Conflict Student
| Field         | Value                        |
|---------------|------------------------------|
| Name          | `Rohan Verma`                |
| APAAR ID      | `8832-5519-1029`             |
| Active At     | `PID-1-3310`                 |
| Conflict At   | `PID-1-4920182`              |
| Expected      | **HTTP 409 Conflict** when `PID-1-4920182` attempts batch-sync |
| Status        | `ACTIVE` at `PID-1-3310`, `BLOCKED` at `PID-1-4920182` |

### Additional Seed Students
| Name            | APAAR ID          | Institute       | Sem | CGPA  | ABC Credits | Status      |
|-----------------|-------------------|-----------------|-----|-------|-------------|-------------|
| Ananya Sharma   | `5501-3378-2290`  | `PID-1-4920182` | 5   | 9.10  | 112         | ACTIVE      |
| Vikram Singh    | `6623-4481-7756`  | `PID-1-4920182` | 7   | 7.85  | 156         | GRADUATED   |

---

## 🏛️ Seed Data — Institutions

| Institute ID    | Name                                          | City        | State           |
|-----------------|-----------------------------------------------|-------------|-----------------|
| `PID-1-4920182` | Demo Institute of Technology                   | New Delhi   | Delhi           |
| `PID-1-3310`    | Demo National Engineering College              | Mumbai      | Maharashtra     |

---

## 🧪 Seed Data — Demo Scenarios

### Scenario 1: Forensic Tamper Detection
- **Authentic Record**: CGPA field reads `8.40`, SHA-256 hash matches Merkle root → `AUTHENTIC`
- **Tampered Record**: CGPA field altered to `9.40`, font-kerning irregularity detected, hash mismatch → `TAMPERED_CGPA`
- **Evidence**: Original `8.40` vs Submitted `9.40`, confidence `97.3%`

### Scenario 2: Duplicate APAAR Enrollment Block
- Nodal officer at `PID-1-4920182` attempts `POST /api/v1/nodal/batch-sync` with student `Rohan Verma` (APAAR `8832-5519-1029`)
- System detects ACTIVE enrollment at `PID-1-3310`
- Returns **HTTP 409**:
  ```json
  {
    "error": "DUPLICATE_ACTIVE_ENROLLMENT",
    "apaar_id": "8832-5519-1029",
    "existing_institute": "PID-1-3310",
    "message": "Student already has an ACTIVE enrollment. Transfer or revocation required first."
  }
  ```

### Scenario 3: RLS Cross-Tenant Violation
- Nodal officer of `PID-1-4920182` attempts to access records of `PID-1-3310`
- RLS policy blocks the query
- Returns **HTTP 403**:
  ```json
  {
    "error": "RLS_CROSS_TENANT_VIOLATION",
    "requested_institute": "PID-1-3310",
    "caller_institute": "PID-1-4920182",
    "message": "Access denied. Row-Level Security prevents cross-institute data access."
  }
  ```

### Scenario 4: DPDP Consent — Verifier Request
| Field           | Value                                          |
|-----------------|-------------------------------------------------|
| Requester       | `Infosys Campus Hiring BGV Portal`              |
| Request Type    | Sem 1-3 Transcript                              |
| Target Student  | `Pritam Raj Chaurasiya` (`7841-9023-4412`)       |
| Consent Status  | `PENDING`                                        |
| ZK PII Masking  | Toggle available — when ON, name/DOB/address masked; only APAAR ID + academic data visible |
| Expires         | 30 days from request                             |

---

## 🔐 RBAC Demo Credentials (JWT Payloads)

| Role                 | User              | Institute       | Token Prefix       |
|----------------------|-------------------|-----------------|---------------------|
| `ROLE_COUNCIL_ADMIN` | `admin@aicte.demo`| `*` (all)       | `demo-admin-token`  |
| `ROLE_INST_NODAL`    | `nodal@pid1.demo` | `PID-1-4920182` | `demo-nodal-token`  |
| `ROLE_STUDENT`       | `pritam@stu.demo` | `PID-1-4920182` | `demo-student-token`|
| `ROLE_VERIFIER`      | `bgv@infosys.demo`| `*` (consented) | `demo-verifier-token`|

---

## 📋 Audit Log Chain Seed

| Seq | Event                          | Actor               | SHA-256 (truncated)      |
|-----|--------------------------------|----------------------|--------------------------|
| 1   | `SYSTEM_INIT`                  | `system`             | `a3f2...c891`            |
| 2   | `ENROLLMENT_CREATED`           | `nodal@pid1.demo`    | `chain(prev + payload)`  |
| 3   | `DUPLICATE_BLOCKED`            | `nodal@pid1.demo`    | `chain(prev + payload)`  |
| 4   | `CONSENT_REQUESTED`            | `bgv@infosys.demo`   | `chain(prev + payload)`  |
| 5   | `FORENSIC_SCAN_TAMPERED`       | `system`             | `chain(prev + payload)`  |
