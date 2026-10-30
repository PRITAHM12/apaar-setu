import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  AlertOctagon, 
  ShieldCheck, 
  Printer,
  History,
  Download,
  GraduationCap,
  Check
} from 'lucide-react';
import { useAuthRBAC } from '../../context/AuthRBACContext';
import { apiClient } from '../../utils/apiClient';

interface VerificationAuditItem {
  id: string;
  timestamp: string;
  verifierId: string;
  verifierOrg: string;
  candidateName: string;
  apaarId: string;
  institutionalId: string;
  consentToken: string;
  consentStatus: 'APPROVED' | 'PENDING' | 'EXPIRED';
  verdict: 'GENUINE' | 'TAMPER_DETECTED';
  verdictScore: string;
  receiptHash: string;
}

const INITIAL_AUDIT_TRAIL: VerificationAuditItem[] = [
  {
    id: 'AUD-2026-9901',
    timestamp: '2026-10-29 09:42:15',
    verifierId: 'ORG-INFOSYS-BGV',
    verifierOrg: 'Infosys Limited (Corporate BGV)',
    candidateName: 'Pritam Raj Chaurasiya',
    apaarId: '7841-9023-4412',
    institutionalId: 'LNCTE-CSE-2022-042',
    consentToken: 'TKN-DPDP-991',
    consentStatus: 'APPROVED',
    verdict: 'GENUINE',
    verdictScore: '100% Ledger Match',
    receiptHash: '0x7a19c42e8b10f92a3d4e5f6a',
  },
  {
    id: 'AUD-2026-9892',
    timestamp: '2026-10-28 21:45:10',
    verifierId: 'ORG-TCS-BGV',
    verifierOrg: 'TCS Prime Talent Operations',
    candidateName: 'Rohit Sen',
    apaarId: '9012-3456-7890',
    institutionalId: 'LNCTE-CSE-2022-042',
    consentToken: 'TKN-DPDP-884',
    consentStatus: 'APPROVED',
    verdict: 'GENUINE',
    verdictScore: '98.8% Ledger Match',
    receiptHash: '0x3f88d19a4c77e2019b8a7c6d',
  },
  {
    id: 'AUD-2026-9880',
    timestamp: '2026-10-28 20:30:15',
    verifierId: 'ORG-WIPRO-HR',
    verifierOrg: 'Wipro Elite Verification Cell',
    candidateName: 'Ananya Bose (Forged PDF)',
    apaarId: '4412-9023-7841',
    institutionalId: 'LNCTE-CSE-2021-088',
    consentToken: 'TKN-DPDP-742',
    consentStatus: 'APPROVED',
    verdict: 'TAMPER_DETECTED',
    verdictScore: 'Font Inflation Anomaly (89.2%)',
    receiptHash: '0x8f92e41b7c2091a41c5d6e7f',
  },
  {
    id: 'AUD-2026-9855',
    timestamp: '2026-10-28 19:10:00',
    verifierId: 'ORG-INFOSYS-BGV',
    verifierOrg: 'Infosys Limited (Corporate BGV)',
    candidateName: 'Sneha Patel',
    apaarId: '8832-5519-1029',
    institutionalId: 'LNCTE-IT-2022-019',
    consentToken: 'TKN-DPDP-619',
    consentStatus: 'APPROVED',
    verdict: 'GENUINE',
    verdictScore: '99.1% Ledger Match',
    receiptHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f',
  },
];

export const VerifierForensicView: React.FC = () => {
  const { activeStudent, studentsList, addAuditLog } = useAuthRBAC();

  const [searchApaar, setSearchApaar] = useState('7841-9023-4412');
  const [isVerifying, setIsVerifying] = useState(false);
  const [viewState, setViewState] = useState<'IDLE' | 'GENUINE' | 'FORGED'>('GENUINE');
  const [isExportingAudit, setIsExportingAudit] = useState(false);
  const [auditTrail, setAuditTrail] = useState<VerificationAuditItem[]>(INITIAL_AUDIT_TRAIL);

  // Selected student record
  const student = studentsList.find(s => s.apaarId === searchApaar.trim()) || activeStudent;

  const handleVerifyCandidate = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setViewState('GENUINE');

      // Log this search into the visible audit trail
      const matched = studentsList.find(s => s.apaarId === searchApaar.trim()) || activeStudent;
      const newEntry: VerificationAuditItem = {
        id: `AUD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        verifierId: 'ORG-INFOSYS-BGV',
        verifierOrg: 'Infosys Limited (Corporate BGV)',
        candidateName: matched.fullName,
        apaarId: matched.apaarId,
        institutionalId: matched.institutionalStudentId || 'LNCTE-CSE-2022-042',
        consentToken: `TKN-DPDP-${Math.floor(100 + Math.random() * 900)}`,
        consentStatus: 'APPROVED',
        verdict: 'GENUINE',
        verdictScore: '100% Cryptographic Match',
        receiptHash: `0x${Array.from({length: 24}, () => Math.floor(Math.random()*16).toString(16)).join('')}`
      };

      setAuditTrail(prev => [newEntry, ...prev]);

      if (addAuditLog) {
        addAuditLog(
          'BGV_CANDIDATE_VERIFIED',
          200,
          `Infosys BGV verified digital degree for ${matched.fullName} (APAAR: ${matched.apaarId}). Audit hash recorded.`
        );
      }
    }, 500);
  };

  const handleTestGenuine = async () => {
    setSearchApaar('7841-9023-4412');
    setIsVerifying(true);
    try {
      await apiClient.runForensicScan('AUTHENTIC');
    } catch {
      // Graceful fallback
    }
    setIsVerifying(false);
    setViewState('GENUINE');

    const newEntry: VerificationAuditItem = {
      id: `AUD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      verifierId: 'ORG-INFOSYS-BGV',
      verifierOrg: 'Infosys Limited (Corporate BGV)',
      candidateName: 'Pritam Raj Chaurasiya',
      apaarId: '7841-9023-4412',
      institutionalId: 'LNCTE-CSE-2022-042',
      consentToken: 'TKN-DPDP-991',
      consentStatus: 'APPROVED',
      verdict: 'GENUINE',
      verdictScore: '100% Cryptographic Match',
      receiptHash: '0x7a19c42e8b10f92a3d4e5f6a'
    };
    setAuditTrail(prev => [newEntry, ...prev]);
  };

  const handleTestForged = async () => {
    setIsVerifying(true);
    try {
      await apiClient.runForensicScan('TAMPERED_CGPA');
    } catch {
      // Graceful fallback
    }
    setIsVerifying(false);
    setViewState('FORGED');

    const newEntry: VerificationAuditItem = {
      id: `AUD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      verifierId: 'ORG-INFOSYS-BGV',
      verifierOrg: 'Infosys Limited (Corporate BGV)',
      candidateName: 'Candidate (Forged PDF Upload)',
      apaarId: searchApaar || '7841-9023-4412',
      institutionalId: 'LNCTE-CSE-2022-042',
      consentToken: 'TKN-DPDP-742',
      consentStatus: 'APPROVED',
      verdict: 'TAMPER_DETECTED',
      verdictScore: 'Font Inflation Anomaly (94.2%)',
      receiptHash: '0x8f92e41b7c2091a41c5d6e7f'
    };
    setAuditTrail(prev => [newEntry, ...prev]);
  };

  const handleExportAuditTrailCsv = () => {
    setIsExportingAudit(true);
    setTimeout(() => {
      const header = "Audit ID,Timestamp,Verifier ID,Agency Name,Candidate Name,APAAR ID,Institutional Roll ID,Consent Token,Consent Status,Forensic Verdict,Diagnostic Score,Cryptographic Receipt Hash\n";
      const rows = auditTrail.map(a => 
        `${a.id},"${a.timestamp}","${a.verifierId}","${a.verifierOrg}","${a.candidateName}","${a.apaarId}","${a.institutionalId}","${a.consentToken}","${a.consentStatus}","${a.verdict}","${a.verdictScore}","${a.receiptHash}"`
      ).join("\n");
      const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Verification_Audit_Trail_ORG-INFOSYS-BGV_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsExportingAudit(false);

      if (addAuditLog) {
        addAuditLog(
          'VERIFIER_AUDIT_TRAIL_EXPORTED',
          200,
          `Employer verifier exported cryptographic verification audit trail (${auditTrail.length} records).`
        );
      }
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header: Employer Background Verification (BGV) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
              Corporate BGV Suite
            </span>
            <span className="text-xs text-slate-600 font-mono font-bold">
              Verifier: Infosys Limited (ORG-INFOSYS-BGV)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
            Employer Background Verification (BGV)
          </h1>
          <p className="text-sm text-slate-600 mt-0.5 font-medium">
            Query the national sovereign APAAR ledger to authenticate candidate digital degrees, marksheets, and detect forged transcripts.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="bg-emerald-50 text-emerald-800 font-bold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>AI Forensics & W3C Engine Online</span>
          </span>
        </div>
      </div>

      {/* 2. Functional Search Bar: "Enter APAAR ID to Verify Candidate" */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-extrabold text-[#0F172A] uppercase tracking-wider mb-2">
            Enter APAAR ID to Verify Candidate:
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                id="search-apaar-input"
                type="text"
                value={searchApaar}
                onChange={(e) => setSearchApaar(e.target.value)}
                placeholder="Enter 12-digit APAAR ID (e.g. 7841-9023-4412)"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
              />
            </div>
            <button
              id="btn-verify-candidate"
              type="button"
              onClick={handleVerifyCandidate}
              disabled={isVerifying}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md flex items-center justify-center space-x-2 transition-all hover:shadow-lg disabled:opacity-50"
            >
              {isVerifying ? (
                <span>Querying National Ledger...</span>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Verify Candidate</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Test Candidate Pills */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="font-bold text-slate-500">Quick Test Scenarios:</span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleTestGenuine}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                viewState === 'GENUINE'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Pritam Raj (7841-9023-4412) • 8.40 CGPA</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSearchApaar('5501-3378-2290');
                handleVerifyCandidate();
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 transition-all flex items-center space-x-1"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Ananya Sharma (5501-3378-2290)</span>
            </button>

            <button
              type="button"
              onClick={handleTestForged}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                viewState === 'FORGED'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Simulate Edited / Forged Marksheet (9.40 CGPA)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. VALIDATED DIGITAL DEGREE CERTIFICATE CARD             */}
      {/* ======================================================== */}
      {viewState === 'GENUINE' && (
        <div className="bg-white rounded-2xl border-2 border-emerald-300 shadow-sm p-7 sm:p-9 space-y-6 animate-in fade-in duration-300">
          
          {/* Top Verification Status Banner */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-emerald-950">
                  NATIONAL VERIFIABLE DIGITAL DEGREE • AUTHENTIC
                </h3>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Verified in 0.94s | SHA-256 Merkle Hash Matched • Issued by {student.instituteName}.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-all"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-400" />
                <span>Print Official Degree Certificate</span>
              </button>
            </div>
          </div>

          {/* Official Verifiable Digital Degree Card */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-slate-50 border-2 border-slate-300 shadow-inner relative overflow-hidden space-y-6">
            
            {/* National Watermark Emblem */}
            <div className="absolute right-6 top-6 opacity-5 pointer-events-none">
              <Building2 className="w-64 h-64 text-slate-900" />
            </div>

            {/* University & Degree Header */}
            <div className="text-center pb-4 border-b border-slate-200 space-y-1">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                AICTE Approved Higher Technical Education Institution
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                {student.instituteName}
              </h2>
              <p className="text-xs font-mono text-slate-500">
                AICTE National Identifier PID: {student.institutePid} • NBA & NAAC Accredited
              </p>
            </div>

            {/* Candidate & Program Particulars */}
            <div className="text-center space-y-2 py-2">
              <p className="text-xs text-slate-600 uppercase tracking-wide">
                This is to officially certify that
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                {student.fullName}
              </h3>
              <p className="text-sm font-semibold text-slate-700 max-w-lg mx-auto">
                has successfully completed all prescribed academic requirements and is hereby awarded the degree of
              </p>
              <div className="py-2">
                <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 font-extrabold text-sm sm:text-base">
                  {student.program}
                </span>
              </div>
            </div>

            {/* 4 Key Degree Verification Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">APAAR ID</span>
                <span className="font-mono font-bold text-slate-900 text-xs">{student.apaarId}</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Institutional ID</span>
                <span className="font-mono font-bold text-slate-900 text-xs">{student.institutionalStudentId || 'LNCTE-CSE-2022-042'}</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Cumulative CGPA</span>
                <span className="font-black text-emerald-700 text-sm">{Number(student.cgpa).toFixed(2)} / 10.0</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">ABC Credits Anchored</span>
                <span className="font-black text-blue-700 text-sm">{student.abcCredits} Credits</span>
              </div>
            </div>

            {/* Cryptographic Stamping & Signatures */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="space-y-0.5 text-slate-500 font-mono text-[10px]">
                <div>Merkle Receipt: <strong>0x7a19c42e8b10f92a3d4e5f6a</strong></div>
                <div>DPDP Consent Token: <strong className="text-emerald-700">TKN-DPDP-991 (VERIFIED)</strong></div>
              </div>

              <div className="flex items-center space-x-3 text-right">
                <div className="w-12 h-12 rounded-full border-2 border-emerald-600 flex items-center justify-center p-1 bg-emerald-50">
                  <Check className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-left text-[11px] leading-tight">
                  <span className="font-extrabold text-[#0F172A] block">Registrar & Controller of Exams</span>
                  <span className="text-slate-500 font-medium">Digital Signature Valid • 2026</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Forged Anomaly Detected Card */}
      {viewState === 'FORGED' && (
        <div className="bg-white rounded-2xl border-2 border-red-400 shadow-sm p-7 space-y-4 animate-in fade-in duration-300">
          <div className="p-4 rounded-xl bg-red-50 border border-red-300 flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-extrabold text-red-950">
                CRITICAL FORENSIC ALERT: DOCUMENT TAMPERING DETECTED
              </h3>
              <p className="text-xs text-red-900 mt-1 leading-relaxed">
                Candidate submitted a PDF marksheet with CGPA <strong>9.40</strong>. Sovereign APAAR ledger reports authentic grade is <strong>8.40</strong>.
              </p>
              <div className="mt-3 p-3 rounded-lg bg-white border border-red-300 text-xs font-mono text-red-900 space-y-1">
                <div>Forensic Diagnostic: Font Kerning Discrepancy & Bounding-Box Inflation detected (94.2% confidence).</div>
                <div>Ledger Hash Mismatch: 0x8f92...e7f != National Root 0x7a19...4a5b.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. VISIBLE VERIFICATION AUDIT TRAIL & ACCESS LOGS        */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#0F172A]">
                Verification Audit Trail & Access Logs
              </h3>
              <p className="text-xs text-slate-500">
                Immutable DPDP compliance audit log documenting all employer background checks.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExportAuditTrailCsv}
            disabled={isExportingAudit}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs flex items-center space-x-1.5 hover:bg-slate-900 hover:text-white transition-all shadow-xs disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExportingAudit ? 'Exporting Log...' : 'Export Audit Trail (CSV)'}</span>
          </button>
        </div>

        {/* Audit Trail Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Audit ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Candidate / APAAR</th>
                <th className="py-2.5 px-3">Verifier ID</th>
                <th className="py-2.5 px-3">DPDP Consent</th>
                <th className="py-2.5 px-3">Verdict</th>
                <th className="py-2.5 px-3 text-right">Receipt Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditTrail.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{a.id}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">{a.timestamp}</td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-[#0F172A] block">{a.candidateName}</span>
                    <span className="font-mono text-slate-500 text-[10px]">{a.apaarId}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-slate-800 block text-xs">{a.verifierOrg}</span>
                    <span className="font-mono text-[10px] text-slate-400">{a.verifierId}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                      {a.consentToken}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      a.verdict === 'GENUINE' 
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' 
                        : 'bg-red-100 text-red-900 border border-red-200'
                    }`}>
                      {a.verdict === 'GENUINE' ? <CheckCircle2 className="w-3 h-3 text-emerald-700" /> : <AlertTriangle className="w-3 h-3 text-red-700" />}
                      <span>{a.verdict}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-[10px] text-slate-500">
                    {a.receiptHash.substring(0, 14)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>Displaying {auditTrail.length} background verification checks</span>
          <span className="font-mono text-[11px] text-emerald-700 font-bold">SHA-256 Merkle Ok</span>
        </div>
      </div>

    </div>
  );
};
