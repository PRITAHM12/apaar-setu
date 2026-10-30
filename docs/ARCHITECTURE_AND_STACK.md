# APAAR-Setu — Architecture & Stack Reference

> **PROTOTYPE — NON-OFFICIAL CONCEPT | ZERO-TRUST RBAC ENGINE**
> No official AICTE, DigiLocker, or Govt of India logos are used anywhere in this project.

---

## Monorepo Structure

```
APAAR-Setu/
├── docs/
│   ├── ARCHITECTURE_AND_STACK.md    ← You are here
│   └── RULES_AND_SEED.md
├── database/
│   └── schema.sql                   ← PostgreSQL 16 DDL + RLS
├── ai-forensics-fastapi/
│   ├── main.py                      ← FastAPI on :8000
│   └── requirements.txt
├── api-gateway-node/
│   ├── server.js                    ← Express on :4000
│   └── package.json
├── web-dashboard/                   ← React + Vite + TS + Tailwind + Lucide
│   └── (Phase 2)
└── student-mobile-app/              ← Flutter DPDP Consent Wallet
    └── (Phase 2)
```

---

## 1. Database — `database/schema.sql`

| Attribute       | Value                             |
|-----------------|-----------------------------------|
| Engine          | PostgreSQL 16                     |
| Security        | Row-Level Security (RLS) per `institute_id` |
| Key Constraint  | Unique partial index: one ACTIVE enrollment per 12-digit APAAR ID |
| Audit           | SHA-256 chained `audit_log` table |

### Key Tables
- `institutions` — AICTE-approved institute registry
- `students` — Master student identity (APAAR ID is the natural key)
- `enrollments` — Links student ↔ institute with status enum (`ACTIVE`, `TRANSFERRED`, `GRADUATED`, `REVOKED`)
- `academic_records` — Semester-wise CGPA, credits, W3C Merkle hash
- `dpdp_consents` — DPDP Act 2023 consent ledger
- `audit_log` — Append-only SHA-256 chained security events

### RLS Policy
Every table with `institute_id` enforces:
```sql
CREATE POLICY institute_isolation ON <table>
  USING (institute_id = current_setting('app.current_institute_id')::UUID);
```
Cross-tenant access returns **HTTP 403**.

---

## 2. AI Forensics Service — `ai-forensics-fastapi/`

| Attribute   | Value                              |
|-------------|------------------------------------|
| Framework   | Python FastAPI                     |
| Port        | `8000`                             |
| Hashing     | `hashlib.sha256` (W3C Merkle)      |
| Detection   | OCR + Font-kerning tamper analysis  |

### Endpoints
| Method | Path                      | Purpose                                    |
|--------|---------------------------|--------------------------------------------|
| POST   | `/api/ai/hash-record`     | Compute SHA-256 Merkle hash of a record    |
| POST   | `/api/ai/forensic-scan`   | Detect CGPA tampering (AUTHENTIC vs TAMPERED) |

---

## 3. API Gateway — `api-gateway-node/`

| Attribute   | Value                                |
|-------------|--------------------------------------|
| Framework   | Node.js + Express                    |
| Port        | `4000`                               |
| Auth        | JWT-based 4-tier RBAC                |

### RBAC Tiers
| Role                  | Scope                                           |
|-----------------------|-------------------------------------------------|
| `ROLE_COUNCIL_ADMIN`  | Full platform access, cross-institute analytics |
| `ROLE_INST_NODAL`     | Manage enrollments & records within own institute |
| `ROLE_STUDENT`        | Read own data, manage DPDP consents              |
| `ROLE_VERIFIER`       | Read-only access to consented transcripts        |

### Endpoints
| Method | Path                              | Auth Roles                  | Key Behavior                |
|--------|-----------------------------------|-----------------------------|-----------------------------|
| POST   | `/api/v1/nodal/batch-sync`        | `ROLE_INST_NODAL`           | HTTP 409 on duplicate ACTIVE APAAR |
| GET    | `/api/v1/nodal/cross-tenant-test` | `ROLE_INST_NODAL`           | HTTP 403 on RLS violation   |
| GET    | `/api/v1/student/consents`        | `ROLE_STUDENT`              | DPDP consent list + toggle  |
| PATCH  | `/api/v1/student/consents/:id`    | `ROLE_STUDENT`              | Update consent (ZK PII toggle) |
| GET    | `/api/v1/audit-stream`            | `ROLE_COUNCIL_ADMIN`        | Live SHA-256 chained logs   |

---

## 4. Web Dashboard — `web-dashboard/` (Phase 2)

| Attribute   | Value                                    |
|-------------|------------------------------------------|
| Framework   | React 18 + Vite + TypeScript             |
| Styling     | Tailwind CSS v3                          |
| Icons       | Lucide-React (`ShieldCheck` as branding) |
| State       | Zustand or React Context                 |

---

## 5. Student Mobile App — `student-mobile-app/` (Phase 2)

| Attribute   | Value                                |
|-------------|--------------------------------------|
| Framework   | Flutter (Dart)                       |
| Entry       | `lib/main.dart`                      |
| Purpose     | APAAR Academic Passport & DPDP Consent Wallet |

---

## Security Principles

1. **Zero-Trust**: Every request is authenticated and authorized; no implicit trust.
2. **RLS Isolation**: PostgreSQL row-level security ensures institute data isolation.
3. **DPDP Act 2023 Compliance**: Explicit consent required before any PII disclosure.
4. **Merkle Audit Trail**: SHA-256 chained logs ensure tamper-evident audit history.
5. **No Official Branding**: Prototype uses `Lucide ShieldCheck` only — zero government logos.
