```markdown 
# Technical Stack & Real Cryptographic Implementation (v2.0)

## 1. Frontend Prototype Dependencies (`package.json`)
- `react`, `react-dom` (v18+)
- `lucide-react` (Icons for shields, locks, QR codes, and forensic alerts)
- `tailwindcss`, `postcss`, `autoprefixer` (Styling)
- `zod` (Runtime schema validation and XSS sanitization)
- `clsx`, `tailwind-merge` (Conditional styling utilities)

## 2. Real Browser SHA-256 Implementation (`src/utils/crypto.ts`)
Use this exact utility so the prototype computes genuine SHA-256 hashes in real time without external heavy crypto libraries:

```typescript
export async function generateSHA256Hash(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return `0x${hashHex}`;
}

export function maskApaarId(apaarId: string, showFull: boolean = false): string {
  if (showFull) return apaarId;
  const parts = apaarId.split('-');
  if (parts.length !== 3) return 'XXXX-XXXX-XXXX';
  return `XXXX-XXXX-${parts[2]}`;
}
# Complete Full-Stack & Mobile Technical Specification (v3.0 - Monorepo)

## 1. Monorepo Directory Architecture
This project uses a clean multi-service architecture so every technology in our SIH PPT is genuinely implemented:

```text
apaar-setu-sih/
├── web-dashboard/           # React.js (Vite) + Tailwind CSS (Admin, Nodal, Verifier Web Portals)
├── student-mobile-app/      # Flutter (Dart) Mobile App (Student APAAR Passport & DPDP Consent Wallet)
├── api-gateway-node/        # Node.js + Express.js (JWT RBAC Middleware, Consent Routing, RLS Guard)
├── ai-forensics-fastapi/    # Python + FastAPI (OCR Extraction, Tamper Detection, SHA-256 Merkle Engine)
└── database/                # PostgreSQL Schema + Row-Level Security (RLS) SQL Policies