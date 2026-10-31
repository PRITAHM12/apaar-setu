import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BulkScanFDRSection } from './BulkScanFDRSection';

const INITIAL_BGV_LOGS = [
  {
    id: 'BGV-AUD-9901',
    timestamp: '2026-10-31 11:20:15',
    candidateName: 'Pritam Raj Chaurasiya',
    apaarId: '7841-9023-4412',
    college: 'LNCTE Bhopal (PID-1-4920182)',
    degree: 'B.Tech Computer Science & Engineering',
    cgpa: '9.25',
    verdict: 'GENUINE',
    merkleRoot: '0x7a19c42e8b10f92a3d4e5f6a'
  },
  {
    id: 'BGV-AUD-9892',
    timestamp: '2026-10-30 17:45:00',
    candidateName: 'Rohit Sen',
    apaarId: '9012-3456-7890',
    college: 'LNCTE Bhopal (PID-1-4920182)',
    degree: 'B.Tech Information Technology',
    cgpa: '8.80',
    verdict: 'GENUINE',
    merkleRoot: '0x3f88d19a4c77e2019b8a7c6d'
  },
  {
    id: 'BGV-AUD-9880',
    timestamp: '2026-10-30 14:10:30',
    candidateName: 'Ananya Bose (Forged PDF Upload)',
    apaarId: '4412-9023-7841',
    college: 'LNCTE Bhopal (PID-1-4920182)',
    degree: 'B.Tech Computer Science & Engineering',
    cgpa: '9.90 (Tampered)',
    verdict: 'TAMPER_DETECTED',
    merkleRoot: '0x8f92e41b7c2091a41c5d6e7f'
  }
];

export const VerifierDashboard = () => {
  const { currentUser } = useAuth();
  const [apaarInput, setApaarInput] = useState('7841-9023-4412');
  const [isSearching, setIsSearching] = useState(false);
  const [activeCandidate, setActiveCandidate] = useState({
    name: 'Pritam Raj Chaurasiya',
    apaarId: '7841-9023-4412',
    institution: 'Lakshmi Narain College of Technology Excellence, Bhopal',
    program: 'B.Tech in Computer Science & Engineering',
    cgpa: '9.25',
    totalCredits: 74,
    status: 'VERIFIED_ON_ABC',
    dpdpConsent: 'ACTIVE (Token: TKN-DPDP-991)'
  });
  const [tamperState, setTamperState] = useState('GENUINE');
  const [logs, setLogs] = useState(INITIAL_BGV_LOGS);

  const handleVerifyCandidate = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setTamperState('GENUINE');
    }, 400);
  };

  const handleSimulateTamper = () => {
    setTamperState('FORGED');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* 1. Header: Employer BGV Portal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
              Corporate BGV Portal
            </span>
            <span className="text-xs font-mono text-slate-500">
              {currentUser?.tenantPid || 'ORG-INFOSYS-BGV'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Employer Background Verification & Forensic Audit
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Authorized organization: <strong className="text-slate-800">{currentUser?.personaName || 'Pooja Iyer'}</strong> • {currentUser?.tenantName || 'Infosys Limited Global BGV Division'}.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center space-x-1.5">
            <span>🛡️</span>
            <span>Zero-Knowledge Proofs Active</span>
          </span>
        </div>
      </div>

      {/* 2. Candidate Lookup Console */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
          Search Candidate by 12-Digit APAAR ID:
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={apaarInput}
            onChange={(e) => setApaarInput(e.target.value)}
            placeholder="e.g. 7841-9023-4412"
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="button"
            onClick={handleVerifyCandidate}
            disabled={isSearching}
            className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs transition-colors shadow-xs"
          >
            {isSearching ? 'Querying National Ledger...' : 'Verify Candidate'}
          </button>
          <button
            type="button"
            onClick={handleSimulateTamper}
            className="px-4 py-2.5 rounded-xl border-2 border-rose-500 text-rose-600 hover:bg-rose-600 hover:text-white font-bold text-xs transition-colors shadow-xs"
          >
            ⚡ Test Forged PDF Alert
          </button>
        </div>

        {/* Candidate Result Card */}
        {tamperState === 'FORGED' ? (
          <div className="p-5 rounded-xl bg-rose-50 border-2 border-rose-400 text-rose-950 space-y-2 animate-fadeIn">
            <div className="flex items-center space-x-2">
              <span className="text-xl">⚠️</span>
              <h4 className="text-sm font-black text-rose-900">
                CRITICAL FORENSIC ANOMALY: TAMPERED MARKSHEET DETECTED
              </h4>
            </div>
            <p className="text-xs text-rose-800">
              Font Inflation & Kerning Discrepancy detected (94.2% confidence). Scanned PDF claimed CGPA: <strong>9.90</strong>, but official ABC Sovereign Merkle Root records genuine CGPA: <strong>9.25</strong>.
            </p>
            <div className="text-[11px] font-mono text-rose-700 bg-rose-100 p-2 rounded-lg border border-rose-200">
              Merkle Root Mismatch: 0x8f92e41b... != Sovereign Root 0x7a19c42e...
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
              <div>
                <span className="text-xs text-slate-500 font-semibold">Candidate Full Name:</span>
                <h3 className="text-base font-extrabold text-slate-900">{activeCandidate.name}</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                ✓ 100% Cryptographic Match
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">APAAR ID:</span>
                <span className="font-mono font-bold text-slate-900">{activeCandidate.apaarId}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Institution:</span>
                <span className="font-semibold text-slate-800">{activeCandidate.institution}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Cumulative CGPA:</span>
                <span className="font-mono font-black text-blue-700 text-sm">{activeCandidate.cgpa} / 10.0</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 3. BULK SCAN FEATURE SECTION (FDR & SECURITY DEPOSIT)     */}
      {/* ======================================================== */}
      <BulkScanFDRSection roleVariant="ROLE_VERIFIER" />

      {/* 4. Verification Audit Log */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Verification Audit Trail & DPDP Access Logs
            </h3>
            <p className="text-xs text-slate-500">
              Immutable employer background check records anchored to regulatory ledger.
            </p>
          </div>
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-700">
            {logs.length} Audits Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-4">Audit ID</th>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Candidate & APAAR</th>
                <th className="py-2.5 px-4">Institution</th>
                <th className="py-2.5 px-4">Verdict</th>
                <th className="py-2.5 px-4 text-right">Receipt Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">{log.id}</td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{log.timestamp}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{log.candidateName}</div>
                    <div className="font-mono text-[10px] text-slate-500">{log.apaarId}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{log.college}</td>
                  <td className="py-3 px-4">
                    {log.verdict === 'GENUINE' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        ✓ GENUINE
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                        ⚠ TAMPER DETECTED
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500 text-right text-[11px]">{log.merkleRoot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default VerifierDashboard;
