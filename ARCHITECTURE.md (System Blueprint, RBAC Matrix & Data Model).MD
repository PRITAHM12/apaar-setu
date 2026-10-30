# System Architecture, RBAC Matrix & Data Model (v2.0)

## 1. End-to-End Multi-Tier Architecture
```text
+------------------------+     +--------------------------+     +----------------------------+
|   NATIONAL GATEWAYS    |     |  TECHNICAL INSTITUTIONS  |     |    EXTERNAL VERIFIERS      |
| [API Setu / ABC / NAD] |     | [Samarth ERP / Bulk CSV] |     | [Recruiters / Universities]|
+-----------+------------+     +------------+-------------+     +-------------+--------------+
            |                               |                                 |
            | OAuth 2.0 / Signed Webhook    | Mutual TLS + Nodal DSC          | APAAR ID / QR
            v                               v                                 v
+--------------------------------------------------------------------------------------------+
|                    APAAR-SETU ZERO-TRUST API GATEWAY & RBAC MIDDLEWARE                     |
|  [Zod Schema Sanitizer] | [JWT RS256 Guard] | [PostgreSQL RLS Context] | [DPDP Gatekeeper] |
+-------------------------------------------+------------------------------------------------+
                                            |
                  +-------------------------+-------------------------+
                  v                                                   v
+--------------------------------------+            +----------------------------------------+
|   AI DOCUMENT FORENSICS ENGINE       |            |    CRYPTOGRAPHIC TRUST & STORAGE       |
| - PaddleOCR + LayoutLMv3 Extraction  |            | - PostgreSQL 16 (Row-Level Security)   |
| - Error Level Analysis (Pixel Tamper)|            | - SHA-256 Merkle Tree Credential Ledger|
| - Cross-College De-Duplication Check |            | - W3C Verifiable Credentials v2.0      |
+--------------------------------------+            +----------------------------------------+