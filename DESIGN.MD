```markdown
# UI/UX Design Specification & Wireframes (v2.0)

## 1. Visual Identity ("GovTech Enterprise Trust")
- **Aesthetic Direction:** High-contrast, authoritative Bento-Grid Enterprise Dashboard (inspired by Linear, Stripe Identity, and modern digital public infrastructure).
- **Trademark Safety:** Use a custom dual-tone geometric shield (`Lucide ShieldCheck`) with a subtle glowing emerald status dot. Never use official government coats of arms or restricted logos.

## 2. Color Tokens (Tailwind CSS Mapping)
- **App Canvas Background:** `bg-slate-50` (`#F8FAFC`)
- **Primary Navigation & Audit Drawer:** `bg-slate-900` (`#0F172A`) with `border-slate-800`
- **Card Surface:** `bg-white` (`#FFFFFF`) with `border border-slate-200 shadow-sm rounded-xl`
- **Primary Brand Accent (Sovereign Royal Blue):** `bg-blue-900` (`#1E3A8A`) / Interactive `bg-blue-600` (`#2563EB`)
- **Cryptographic Verified (Trust Emerald):** `text-emerald-600 bg-emerald-50 border-emerald-200` (`#10B981`)
- **Pending Consent / Warning (Amber):** `text-amber-700 bg-amber-50 border-amber-200` (`#F59E0B`)
- **Security Block / Tamper Alert (Forensic Rose):** `text-red-600 bg-red-50 border-red-200` (`#EF4444`)

## 3. Typography Rules
- **Primary UI Font:** `Inter`, system-ui, sans-serif.
- **Monospace Data Font (`font-mono`):** Mandatory for all APAAR IDs (`7841-9023-4412`), Institute PIDs (`PID-1-4920182`), HTTP status badges (`HTTP 409 CONFLICT`), and SHA-256 hashes (`0x8f92e41b...`).

## 4. Master Workspace ASCII Wireframe
```text
+--------------------------------------------------------------------------------------------------+
| [Shield] APAAR-SETU | [PROTOTYPE — NON-OFFICIAL CONCEPT]   [Role: ROLE_INST_NODAL v] [Search]    |
+--------------------------------------------------------------------------------------------------+
| KPI BENTO ROW                                                                                    |
| +-----------------------+ +-----------------------+ +-----------------------+ +----------------+ |
| | VERIFIED APAAR IDs    | | AVG VERIFICATION TIME | | DUAL-ADMISSION BLOCKS | | RLS SECURITY   | |
| | 1,42,850 (+12.4%)     | | 1.14 Seconds          | | 18 Blocked [HTTP 409] | | STRICT ENFORCED| |
| +-----------------------+ +-----------------------+ +-----------------------+ +----------------+ |
|                                                                                                  |
| MAIN INTERACTIVE WORKSPACE (DYNAMIC BY ACTIVE ROLE)                                              |
| +-----------------------------------------------+ +--------------------------------------------+ |
| | LEFT PANEL: CORE ROLE WORKFLOW                | | RIGHT PANEL: CRYPTO & AI FORENSICS         | |
| | - [Nodal]: Bulk CSV Sync + 409 Conflict Demo  | | - Live SHA-256 Merkle Tree Inspector       | |
| | - [Student]: QR Passport + DPDP Consent Inbox | | - Side-by-Side PDF OCR Tamper Bounding Box | |
| | - [Verifier]: Instant Lookup + Tamper Upload  | | - [Test Cross-Tenant RLS Query (403 Demo)] | |
| | - [Admin]: State Heatmap + Fraud Registry     | | - W3C Verifiable Credential JSON Viewer    | |
| +-----------------------------------------------+ +--------------------------------------------+ |
|                                                                                                  |
| PERSISTENT BOTTOM TERMINAL: LIVE ZERO-TRUST RBAC & SECURITY AUDIT STREAM                         |
| +----------------------------------------------------------------------------------------------+ |
| | [HTTP 200] [ROLE_INST_NODAL] Batch SHA-256 Hash Anchored -> 0x8f92e41b7c2091a41c  | |
| | [HTTP 409] [DE-DUP ENGINE] BLOCKED Dual Enrollment for APAAR 8832-XXXX-1029       | |
| | [HTTP 403] [POSTGRES RLS] Denied PID-1-4920182 query on tenant PID-1-3310         | |
| +----------------------------------------------------------------------------------------------+ |
+--------------------------------------------------------------------------------------------------+