# Antigravity Agent Execution Rules & Coding Standards (v2.0)

You are building **APAAR-Setu**, an enterprise-grade prototype for Smart India Hackathon (SIH) 2026 Problem Statement: *"Development of an APAAR ID-Based Student Data Management and Verification Platform for AICTE-Approved Institutions"*.

## 1. Non-Negotiable Architecture & Legal Rules
1. **ZERO OFFICIAL LOGOS OR TRADEMARKS:** Never import, link, or render official Government of India, AICTE, DigiLocker, or Ministry emblems. Exclusively use `lucide-react` geometric icons (`ShieldCheck`, `Lock`, `Cpu`, `FileCheck2`, `AlertOctagon`).
2. **MANDATORY HEADER DISCLAIMER:** The top navigation bar MUST permanently display the badge:
   `PROTOTYPE — NON-OFFICIAL CONCEPT | ZERO-TRUST RBAC ENGINE`
3. **NO PLACEHOLDER VIEWS:** Every one of the 4 roles (`ROLE_COUNCIL_ADMIN`, `ROLE_INST_NODAL`, `ROLE_STUDENT`, `ROLE_VERIFIER`) must render a complete, interactive dashboard with working demo buttons. Never write `// TODO` or `Coming Soon`.
4. **SHARED GLOBAL STATE (`AppContext`):** When `ROLE_STUDENT` approves or revokes a DPDP consent request, or when `ROLE_INST_NODAL` syncs a semester batch, that state change must immediately reflect in `ROLE_VERIFIER` and `ROLE_COUNCIL_ADMIN` without refreshing the page.
5. **PERSISTENT SECURITY AUDIT STREAM:** Every view must include the collapsible bottom/right terminal drawer (`SecurityAuditDrawer`) that logs every role switch, `HTTP 200 OK`, `HTTP 403 Forbidden` (RLS violation), `HTTP 409 Conflict` (Dual enrollment block), and `HTTP 422 Unprocessable Entity` (AI Tamper Alert) with a real SHA-256 event hash.
```markdown
# Antigravity Full-Stack Execution Rules (v3.0)

1. **HONOR THE EXACT TECH STACK:**
   - **Frontend Web:** React.js + Tailwind CSS (`web-dashboard/`)
   - **Mobile App:** Flutter (`student-mobile-app/lib/main.dart`)
   - **API Gateway & RBAC:** Node.js + Express.js (`api-gateway-node/`)
   - **AI & Crypto Service:** Python + FastAPI (`ai-forensics-fastapi/`)
   - **Database Schema:** PostgreSQL with RLS (`database/schema.sql`)
2. **HYBRID DEMO RESILIENCE (CRITICAL FOR SIH VIDEO):**
   - The React Web Dashboard must make real `fetch()` calls to the Node.js (`:4000`) and FastAPI (`:8000`) backends, AND include a graceful fallback interceptor so that even if a backend port is paused during a live pitch, the UI never crashes and still renders the exact `HTTP 200`, `HTTP 403`, `HTTP 409`, and `HTTP 422` responses seamlessly.
3. **EMBEDDED FLUTTER MOBILE SIMULATOR IN WEB + REAL FLUTTER CODE:**
   - Write the genuine Flutter mobile app code in `student-mobile-app/lib/main.dart`.
   - Additionally, inside the React `StudentPassportView.tsx`, render an interactive **Mobile Phone Frame Preview** of that exact Flutter app so the user can record both the Desktop Web Portals and the Mobile Student App side-by-side in a single browser window during the 90-second SIH video!
4. **ZERO OFFICIAL TRADEMARKS:** Never use official AICTE, DigiLocker, or Govt of India emblems. Always show the top badge: `PROTOTYPE — NON-OFFICIAL CONCEPT | ZERO-TRUST RBAC ENGINE`. 

## 2. File & Directory Structure to Generate
```text
src/
├── types/
│   └── apaar.types.ts         # Strict TypeScript interfaces for Roles, Students, Consents, AuditLogs
├── utils/
│   ├── crypto.ts              # Real Web Crypto API SHA-256 generator & PII masking helpers
│   └── validators.ts          # Zod schemas for APAAR ID (^\d{4}-\d{4}-\d{4}$) & CSV payloads
├── data/
│   └── seedData.ts            # Synchronized initial records, fraud triggers, and DPDP requests
├── context/
│   └── AuthRBACContext.tsx    # 4-Role JWT switcher, RLS guard functions, and live Audit Log state
├── components/
│   ├── layout/
│   │   ├── TopNavbar.tsx      # Trademark-safe brand shield, Role Switcher, Global Search
│   │   └── AuditStream.tsx    # Terminal-style live Zero-Trust security event stream
│   └── views/
│       ├── CouncilAdminView.tsx   # National KPIs, State Sync Table, Blocked Dual-Admissions Registry
│       ├── NodalOfficerView.tsx   # Bulk CSV Sync Simulator, HTTP 409 Blocker Modal, RLS 403 Tester
│       ├── StudentPassportView.tsx# QR Academic Passport, Semester Timeline, DPDP Consent Inbox
│       └── VerifierForensicView.tsx# Instant Lookup, W3C Hash Verifier, AI PDF Tamper Bounding Box
└── App.tsx