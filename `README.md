```markdown
# APAAR-Setu (v2.0) — Unified Student Data Management & Cryptographic Verification Platform

> **LEGAL & TRADEMARK NOTICE:** This project is an independent software prototype built for the Smart India Hackathon (SIH) 2026 Problem Statement: *"Development of an APAAR ID-Based Student Data Management and Verification Platform for AICTE-Approved Institutions"*. It is 100% trademark-safe and uses zero official government or institutional emblems.

## 1. Executive Summary
Technical education institutions across India struggle with fragmented ERP data silos, duplicate full-time student enrollments ("ghost admissions" causing scholarship leakage), and slow, forgery-prone manual background verifications. 

**APAAR-Setu** solves this by anchoring every academic lifecycle event (Enrollment, Semester Credit Sync, Internship, and Degree Issuance) to the student's 12-digit **APAAR ID** using a **4-Tier Zero-Trust RBAC Architecture**, **PostgreSQL Row-Level Security (RLS)**, **W3C Verifiable Credentials (SHA-256 Merkle Proofs)**, and an **AI Document Forensics Engine**.

## 2. Core Differentiators (Winning SIH Judges)
1. **Cross-Institute De-Duplication (`HTTP 409 Conflict`):** Prevents a single APAAR ID from holding active full-time admission in two AICTE institutions simultaneously.
2. **Tenant-Isolated Row-Level Security (`HTTP 403 Forbidden`):** Cryptographically scopes College Nodal Officers to their own `Institute_PID`, blocking cross-college data snooping.
3. **Dual-Layer Verification (Cryptographic Hash + AI OCR Forensics):** Detects both SHA-256 Merkle hash mismatches and pixel/font-kerning tampering on forged PDF mark sheets in `< 1.2 seconds`.
4. **DPDP Act 2023 Selective Disclosure (Zero-Knowledge Mode):** Students approve time-bound verification requests and can mask personal PII (Aadhaar/Address) while proving `Passing Status: TRUE & CGPA >= 7.5`.

## 3. Exact 90-Second SIH Prototype Video Demo Script
- **0:00 - 0:25 | `ROLE_INST_NODAL` (Bulk Sync & Fraud Block):**
  - Click **"Simulate Semester-3 ERP Batch Sync (120 Records)"**.
  - Show real-time Zod schema validation and SHA-256 hashing.
  - Show the automatic **HTTP 409 Conflict Alert Modal** blocking APAAR ID `8832-5519-1029` for attempting concurrent full-time enrollment at two institutes.
  - Click **"Test Cross-Tenant Query (RLS Check)"** to demonstrate an instant `HTTP 403 Forbidden` PostgreSQL RLS block in the live Security Audit Stream.
- **0:25 - 0:50 | `ROLE_STUDENT` (APAAR Passport & DPDP Consent):**
  - Switch role to `ROLE_STUDENT`. View the dynamic SVG QR Academic Passport and verified Semester 1–3 ABC credits.
  - In the **DPDP Consent Inbox**, check `[x] Zero-Knowledge Mode (Mask Aadhaar & Home Address)` and click **"Approve 24h Access"** for the pending recruiter request.
- **0:50 - 1:15 | `ROLE_VERIFIER` (Instant Verification & AI Tamper Detection):**
  - Switch role to `ROLE_VERIFIER`. Query APAAR ID `7841-9023-4412` to display the green **W3C Cryptographic Verification Certificate** (`< 1.2s`).
  - Click **"Run AI Forged PDF Forensics Test"** to display a side-by-side mark sheet inspection where an altered CGPA (`9.40` vs official ledger `8.40`) triggers a red bounding-box alert and SHA-256 hash mismatch.
- **1:15 - 1:30 | `ROLE_COUNCIL_ADMIN` (National Command Center):**
  - Switch to `ROLE_COUNCIL_ADMIN` to showcase state-wise APAAR onboarding analytics, credit mobility counters, and the national blocked-fraud ledger.