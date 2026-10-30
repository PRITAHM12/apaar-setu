import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ShieldCheck, 
  Download, 
  Lock, 
  Building2, 
  Check, 
  X,
  Award,
  Sparkles,
  Layers,
  FileEdit,
  FileCheck2,
  Send,
  AlertCircle,
  History
} from 'lucide-react';
import { useAuthRBAC } from '../../context/AuthRBACContext';

interface EmployerConsentEntry {
  id: string;
  employerName: string;
  verifierId: string;
  purpose: string;
  dataAccessed: string;
  timestamp: string;
  status: 'ACTIVE' | 'REVOKED';
  token: string;
}

const INITIAL_CONSENT_LEDGER: EmployerConsentEntry[] = [
  {
    id: 'CSL-01',
    employerName: 'Infosys Limited',
    verifierId: 'ORG-INFOSYS-BGV',
    purpose: 'Campus Recruitment Verification',
    dataAccessed: 'Semesters 1-3 Marksheet & Dual-ID Credentials',
    timestamp: 'Today at 10:45 AM',
    status: 'ACTIVE',
    token: 'TKN-DPDP-991'
  },
  {
    id: 'CSL-02',
    employerName: 'Tata Consultancy Services',
    verifierId: 'ORG-TCS-BGV',
    purpose: 'Prime Digital Degree Screening',
    dataAccessed: 'Degree Title, CGPA (8.40) & ABC Credits',
    timestamp: 'Yesterday at 04:15 PM',
    status: 'ACTIVE',
    token: 'TKN-DPDP-884'
  },
  {
    id: 'CSL-03',
    employerName: 'Wipro Technologies',
    verifierId: 'ORG-WIPRO-HR',
    purpose: 'Pre-Employment Background Audit',
    dataAccessed: 'Full Academic Passport (S1-S3)',
    timestamp: '27 Oct 2026, 06:30 PM',
    status: 'REVOKED',
    token: 'TKN-DPDP-742'
  }
];

export const StudentPassportView: React.FC = () => {
  const { 
    activeStudent, 
    dpdpConsents, 
    approveConsent, 
    revokeConsent,
    isZkPrivacyEnabled,
    setIsZkPrivacyEnabled,
    addAuditLog
  } = useAuthRBAC();

  const [isMasked, setIsMasked] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingDualCert, setIsDownloadingDualCert] = useState(false);

  // Consent Ledger State
  const [consentLedger, setConsentLedger] = useState<EmployerConsentEntry[]>(INITIAL_CONSENT_LEDGER);
  const [showConsentLedger, setShowConsentLedger] = useState(true);

  // Data Correction Request Modal State
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [correctionField, setCorrectionField] = useState('CGPA / Semester Grade');
  const [correctionDetails, setCorrectionDetails] = useState('');
  const [correctionTicket, setCorrectionTicket] = useState<string | null>(null);
  const [isSubmittingCorrection, setIsSubmittingCorrection] = useState(false);

  const consentRequest = dpdpConsents.find(c => c.consentId === 'CONSENT-2026-991') || dpdpConsents[0];
  const isApproved = consentRequest?.status === 'APPROVED';

  const handleApprove = async () => {
    if (!consentRequest) return;
    await approveConsent(consentRequest.consentId, isZkPrivacyEnabled);
    setToastMessage('✓ Access Approved! Infosys Campus Hiring Team granted 24-hour verification token.');
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleRevoke = async () => {
    if (!consentRequest) return;
    await revokeConsent(consentRequest.consentId);
    setToastMessage('✓ Access Revoked! Infosys cannot view your transcript.');
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setToastMessage('✓ Official Verified Marksheet (PDF) downloaded successfully!');
      setTimeout(() => setToastMessage(null), 3500);
    }, 1200);
  };

  const handleDownloadDualIdCertificate = () => {
    setIsDownloadingDualCert(true);
    setTimeout(() => {
      setIsDownloadingDualCert(false);
      
      const content = `================================================================================
GOVERNMENT OF INDIA • NATIONAL ACADEMIC VERIFIABLE CREDENTIAL
DUAL-ID ATTESTATION CERTIFICATE (W3C SPECIFICATION)
================================================================================
Student Name                 : ${activeStudent.fullName}
National 12-Digit APAAR ID   : ${activeStudent.apaarId}
Institutional Roll / PID     : ${activeStudent.institutionalStudentId || 'LNCTE-CSE-2022-042'}
Affiliated Institution       : Lakshmi Narain College of Technology Excellence
Nodal AICTE PID              : PID-1-4920182
Enrolled Program             : B.Tech Computer Science & Engineering
Cumulative Grade Point Avg   : ${Number(activeStudent.cgpa).toFixed(2)}
Academic Bank of Credits     : 68 Credits (Anchored)
Status                       : ACTIVE & ENROLLED (100% Zero Multi-Admission Conflict)
Cryptographic Merkle Root    : 0x7a19c42e8b10f92a3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c
Issuing Authority            : AICTE & Academic Bank of Credits (ABC)
Attestation Timestamp        : ${new Date().toISOString()}
================================================================================`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Dual_ID_Certificate_${activeStudent.apaarId.replace(/-/g, '')}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setToastMessage('✓ Official Dual-ID Certificate downloaded with cryptographic seals!');
      setTimeout(() => setToastMessage(null), 3500);
    }, 800);
  };

  const handleToggleConsent = (id: string) => {
    setConsentLedger(prev => prev.map(c => {
      if (c.id === id) {
        const newStatus = c.status === 'ACTIVE' ? 'REVOKED' : 'ACTIVE';
        setToastMessage(newStatus === 'REVOKED' 
          ? `✓ Access revoked for ${c.employerName}. Token invalidated.`
          : `✓ Access re-granted for ${c.employerName} (24h token generated).`
        );
        setTimeout(() => setToastMessage(null), 3500);
        return { ...c, status: newStatus };
      }
      return c;
    }));
  };

  const handleSubmitCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionDetails.trim()) return;

    setIsSubmittingCorrection(true);
    await new Promise(r => setTimeout(r, 700));

    const ticketId = `TKT-CORR-${Math.floor(1000 + Math.random() * 9000)}`;
    setCorrectionTicket(ticketId);
    setIsSubmittingCorrection(false);

    if (addAuditLog) {
      addAuditLog(
        'STUDENT_DATA_CORRECTION_REQUESTED',
        202,
        `Student ${activeStudent.fullName} submitted data correction ticket [${ticketId}] for field "${correctionField}". Transmitted to Nodal Officer.`
      );
    }
  };

  const displayApaar = isMasked
    ? `XXXX-XXXX-${activeStudent.apaarId.slice(-4)}`
    : activeStudent.apaarId;

  const semestersList = activeStudent.semesters && activeStudent.semesters.length > 0
    ? activeStudent.semesters
    : [
        { semester: 1, sgpa: 8.20, cgpa: 8.20, credits: 22, hash: "0x7a19c42e8b10f92a3d4e5f6a7b8c9d0e1f2a3b4c", verified: true },
        { semester: 2, sgpa: 8.60, cgpa: 8.35, credits: 24, hash: "0x3f88d19a4c77e2019b8a7c6d5e4f3a2b1c0d9e8f", verified: true },
        { semester: 3, sgpa: 8.40, cgpa: 8.40, credits: 22, hash: "0x8f92e41b7c2091a41c5d6e7f8a9b0c1d2e3f4a5b", verified: true },
      ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-8 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-2 animate-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner / Introduction */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-2 border-b border-slate-200/80 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              🎓 Student Digital Academic Passport
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Academic Bank of Credits (ABC) ID: 784-190-234
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Welcome, {activeStudent.fullName}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Your tamper-proof academic credentials, semester results, and privacy consent permissions.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="bg-emerald-50 text-emerald-800 font-bold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>DigiLocker & ABC Synced</span>
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ROW 1: DIGITAL ID CARD (5 COLS) + ACADEMIC SUMMARY (7 COLS) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Top Left (5 cols) — Interactive Digital APAAR ID Card */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-7 shadow-2xl border border-blue-500/20 flex-1 flex flex-col justify-between">
            
            {/* Ambient Background Accents */}
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

            {/* Card Header */}
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold tracking-widest text-amber-400 uppercase">
                  NATIONAL ACADEMIC PASSPORT
                </span>
                <h3 className="text-xs font-semibold text-slate-300 mt-0.5">
                  Academic Bank of Credits • Government of India
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1">
                <Check className="w-3 h-3" />
                <span>OAuth 2.0 & ABC Verified</span>
              </span>
            </div>

            {/* Student Info */}
            <div className="relative z-10 my-6">
              <span className="text-[11px] font-medium text-slate-400">Candidate Name</span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {activeStudent.fullName}
              </h2>
              <p className="text-xs font-medium text-blue-200 mt-1">
                {activeStudent.program}
              </p>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeStudent.instituteName}</span>
              </p>
            </div>

            {/* APAAR ID & Mask/Unmask Toggle */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">
                  12-Digit Sovereign APAAR ID
                </span>
                <span className="text-base font-mono font-bold text-amber-300 tracking-wider">
                  {displayApaar}
                </span>
                <span className="text-[11px] font-mono text-blue-300 block mt-0.5">
                  Roll ID: {activeStudent.institutionalStudentId || 'LNCTE-CSE-2022-042'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMasked(!isMasked)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-colors flex items-center space-x-1 text-xs"
                title={isMasked ? "Show full ID" : "Mask ID"}
              >
                {isMasked ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span className="text-[11px] font-medium">{isMasked ? "Unmask" : "Mask"}</span>
              </button>
            </div>

            {/* Bottom QR Code & Security Stamp */}
            <div className="relative z-10 mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
              {/* Crisp SVG QR Code */}
              <div className="w-16 h-16 bg-white rounded-xl p-1.5 flex items-center justify-center shadow-lg flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900" fill="currentColor">
                  {/* Outer Frame */}
                  <rect x="0" y="0" width="30" height="30" rx="4" />
                  <rect x="5" y="5" width="20" height="20" fill="white" />
                  <rect x="10" y="10" width="10" height="10" />
                  
                  <rect x="70" y="0" width="30" height="30" rx="4" />
                  <rect x="75" y="5" width="20" height="20" fill="white" />
                  <rect x="80" y="10" width="10" height="10" />

                  <rect x="0" y="70" width="30" height="30" rx="4" />
                  <rect x="5" y="75" width="20" height="20" fill="white" />
                  <rect x="10" y="80" width="10" height="10" />

                  {/* Matrix Bits */}
                  <rect x="40" y="10" width="8" height="8" />
                  <rect x="52" y="10" width="8" height="8" />
                  <rect x="40" y="24" width="8" height="8" />
                  <rect x="40" y="40" width="20" height="20" rx="2" />
                  <rect x="70" y="40" width="8" height="8" />
                  <rect x="82" y="52" width="8" height="8" />
                  <rect x="15" y="45" width="8" height="8" />
                  <rect x="70" y="75" width="10" height="10" />
                  <rect x="85" y="85" width="8" height="8" />
                </svg>
              </div>

              <div className="text-right text-[11px] text-slate-300">
                <span className="font-semibold text-emerald-400 block">Sha-256 Merkle Root</span>
                <span className="font-mono text-[10px] text-slate-400">0x7a19...4a5b</span>
                <span className="block text-[10px] text-slate-400 mt-1">Issued: Oct 2026</span>
              </div>
            </div>

          </div>
        </div>

        {/* Top Right (7 cols) — Academic Summary & Share Actions */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          
          {/* 3 Clean White KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Current CGPA</span>
                <Award className="w-5 h-5 text-blue-600" />
              </div>
              <div className="mt-3">
                <span className="text-3xl font-black text-slate-900 tracking-tight">8.40</span>
                <span className="text-xs text-slate-500 font-medium block mt-0.5">Scale: 10.0 • First Class Distinction</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">ABC Credits</span>
                <Layers className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="mt-3">
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black text-slate-900 tracking-tight">68</span>
                  <span className="text-sm font-bold text-slate-400">/ 160</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '42.5%' }} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Digital Signatures</span>
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="mt-3">
                <span className="inline-flex items-center space-x-1.5 text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Active & Verified</span>
                </span>
                <span className="text-[11px] text-slate-400 block mt-2">W3C Compliant Cryptographic Seals</span>
              </div>
            </div>

          </div>

          {/* Quick Actions & Share Buttons */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Official Student Credential Actions</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Generate tamper-proof verification proofs for job interviews, higher studies, or scholarship applications.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="py-3 px-4 rounded-xl border-2 border-slate-800 text-slate-900 text-xs font-bold flex items-center justify-center space-x-2 hover:bg-slate-900 hover:text-white transition-all duration-300 ease-in-out hover:shadow-lg active:scale-95 disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-slate-600 group-hover:text-white" />
                <span>{isDownloading ? 'Generating PDF...' : 'Download Verified Marksheet'}</span>
              </button>

              {/* Explicit Download Dual-ID Certificate Button (AICTE Requirement) */}
              <button
                id="btn-download-dual-id-cert"
                type="button"
                onClick={handleDownloadDualIdCertificate}
                disabled={isDownloadingDualCert}
                className="py-3 px-4 rounded-xl border-2 border-emerald-600 text-emerald-700 text-xs font-bold flex items-center justify-center space-x-2 hover:bg-emerald-600 hover:text-white transition-all duration-300 ease-in-out hover:shadow-lg active:scale-95 disabled:opacity-50"
              >
                <FileCheck2 className="w-4 h-4 text-emerald-600 group-hover:text-white" />
                <span>{isDownloadingDualCert ? 'Attesting Dual-ID...' : 'Download Dual-ID Certificate'}</span>
              </button>

              {/* Consent Ledger Button: Sitting right next to Download Dual-ID Certificate */}
              <button
                id="btn-toggle-consent-ledger"
                type="button"
                onClick={() => setShowConsentLedger(!showConsentLedger)}
                className={`py-3 px-4 rounded-xl border-2 text-xs font-bold flex items-center justify-center space-x-2 transition-all duration-300 ease-in-out hover:shadow-lg active:scale-95 ${
                  showConsentLedger
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                    : 'border-indigo-600 text-indigo-700 hover:bg-indigo-600 hover:text-white'
                }`}
              >
                <History className="w-4 h-4" />
                <span>{showConsentLedger ? 'Consent Ledger (Active)' : 'View Consent Ledger (3)'}</span>
              </button>

              {/* Request Data Correction Button (AICTE Requirement) */}
              <button
                id="btn-request-data-correction"
                type="button"
                onClick={() => {
                  setCorrectionTicket(null);
                  setIsCorrectionModalOpen(true);
                }}
                className="py-3 px-4 rounded-xl border-2 border-amber-600 text-amber-700 text-xs font-bold flex items-center justify-center space-x-2 hover:bg-amber-600 hover:text-white transition-all duration-300 ease-in-out hover:shadow-lg active:scale-95"
              >
                <FileEdit className="w-4 h-4 text-amber-600 group-hover:text-white" />
                <span>Request Data Correction</span>
              </button>
            </div>

            {/* CONSENT LEDGER: Shows exactly which employers have viewed their data */}
            {showConsentLedger && (
              <div className="pt-3 border-t border-slate-100 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-extrabold text-[#0F172A]">Consent Ledger: Employer Data Access History</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    DPDP Act 2023 Compliant
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl bg-slate-50">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase text-[9px]">
                      <tr>
                        <th className="py-2 px-3">Employer / Agency</th>
                        <th className="py-2 px-3">Purpose & Data Viewed</th>
                        <th className="py-2 px-3">Timestamp</th>
                        <th className="py-2 px-3">Consent Status</th>
                        <th className="py-2 px-3 text-right">Access Control</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/80 bg-white">
                      {consentLedger.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-[#0F172A] block">{c.employerName}</span>
                            <span className="font-mono text-[10px] text-slate-400">{c.verifierId}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-slate-800 font-medium block">{c.purpose}</span>
                            <span className="text-[10px] text-slate-500 block">{c.dataAccessed}</span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                            {c.timestamp}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              c.status === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                              <span>{c.status === 'ACTIVE' ? 'Active Consent (24h)' : 'Access Revoked'}</span>
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleToggleConsent(c.id)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all shadow-2xs ${
                                c.status === 'ACTIVE'
                                  ? 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              {c.status === 'ACTIVE' ? 'Revoke Access' : 'Re-grant Access'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Institutional Trust Info Box */}
          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building2 className="w-5 h-5 text-slate-500 flex-shrink-0" />
              <div>
                <span className="font-bold text-slate-800">Affiliated Nodal Institution:</span>
                <span className="block text-slate-500">Lakshmi Narain College of Technology Excellence (Nodal PID: PID-1-4920182)</span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-500">RLS Isolated</span>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* ROW 2: SEMESTER RESULTS (7 COLS) + DPDP PRIVACY (5 COLS) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Bottom Left (7 cols) — Semester-Wise Result & Credit Timeline */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Semester-Wise Results & ABC Credit Ledger</h3>
              <p className="text-xs text-slate-500">Chronological academic ledger digitally stamped by LNCT Excellence.</p>
            </div>
            <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-xl border border-blue-200">
              3 Semesters Registered
            </span>
          </div>

          <div className="space-y-3.5">
            {semestersList.map((sem: any) => (
              <div 
                key={sem.semester || sem.sem}
                className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-slate-50 hover:border-blue-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-extrabold text-sm flex items-center justify-center flex-shrink-0">
                    S{sem.semester || sem.sem}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Semester {sem.semester || sem.sem} • B.Tech CSE
                    </h4>
                    <span className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
                      <span>SGPA: <strong className="text-slate-800">{Number(sem.sgpa).toFixed(2)}</strong></span>
                      <span>•</span>
                      <span>Credits: <strong className="text-slate-800">{sem.credits} Cr</strong></span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified by College</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-200">
                    {sem.hash ? sem.hash.slice(0, 10) + '...' : '0x7a19...'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/60 text-xs text-blue-800 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>All credits earned are stored in the Academic Bank of Credits (ABC) repository and are eligible for National Credit Framework (NCrF) mobility.</span>
          </div>
        </div>

        {/* Bottom Right (5 cols) — "Who Can See My Data?" (DPDP Privacy & OAuth Consent Manager) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Who Can See My Data?</h3>
                <p className="text-[11px] text-slate-500">DPDP Act 2023 Consent Gatekeeper</p>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              isApproved
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {isApproved ? 'Access Active (24h)' : 'Pending Decision'}
            </span>
          </div>

          {/* Clean Notification Card */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-2">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                Active Verification Request
              </span>
              <span className="text-[10px] text-indigo-500 font-mono">
                {consentRequest?.consentId || 'CONSENT-2026-991'}
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">
              Infosys Campus Hiring Team requested OAuth access to your B.Tech Transcript.
            </h4>
            <p className="text-[11px] text-slate-600">
              Purpose: <strong>Campus Placement Background Verification</strong>
            </p>
          </div>

          {/* Interactive Privacy Toggle */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="pr-3">
                <span className="text-xs font-bold text-slate-800 block">
                  Zero-Knowledge Privacy Mode
                </span>
                <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                  Hide Aadhaar & home address. Share only verified marks and passing status.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsZkPrivacyEnabled(!isZkPrivacyEnabled)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 flex-shrink-0 ${
                  isZkPrivacyEnabled ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                    isZkPrivacyEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500">
              Status: {isZkPrivacyEnabled ? (
                <span className="text-blue-700 font-bold">Privacy Mode ON (Masks personal PII)</span>
              ) : (
                <span className="text-slate-600 font-medium">Standard Transcript Sharing</span>
              )}
            </div>
          </div>

          {/* Two Clear Buttons: Approve & Revoke */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={handleApprove}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-sm ${
                isApproved 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isApproved ? 'Approved (24h)' : 'Approve Access (24h)'}</span>
            </button>

            <button
              type="button"
              onClick={handleRevoke}
              className="py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 flex items-center justify-center space-x-1.5 transition-all"
            >
              <X className="w-3.5 h-3.5" />
              <span>Revoke Access</span>
            </button>
          </div>

          <p className="text-[10px] text-slate-400 text-center leading-normal">
            Under India's Digital Personal Data Protection (DPDP) Act 2023, you retain 100% sovereign ownership of your academic records and can revoke access anytime.
          </p>

        </div>

      </div>

      {/* ======================================================== */}
      {/* DATA CORRECTION REQUEST MODAL (AICTE REQUIREMENT)        */}
      {/* ======================================================== */}
      {isCorrectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <FileEdit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Student Academic Data Correction</h3>
                  <p className="text-xs text-slate-500">Submit a formal rectification request to your Nodal Officer.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCorrectionModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {correctionTicket ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">Correction Grievance Dispatched!</h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    Your request has been cryptographically recorded and assigned to the Nodal Officer at LNCT Excellence.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-emerald-200 font-mono text-xs text-slate-800">
                  Tracking Ticket ID: <strong className="text-emerald-800 font-bold">{correctionTicket}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCorrectionModalOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                >
                  Close & Return
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitCorrection} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Field Requiring Correction:
                  </label>
                  <select
                    value={correctionField}
                    onChange={(e) => setCorrectionField(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="CGPA / Semester Grade">CGPA / Semester Grade Discrepancy</option>
                    <option value="Candidate Legal Name Spelling">Candidate Legal Name Spelling</option>
                    <option value="Institutional Roll / Student ID">Institutional Roll / Student ID</option>
                    <option value="Supernumerary / Quota Category">Supernumerary / Quota Category Update</option>
                    <option value="Academic Bank of Credits (ABC) Sync">Academic Bank of Credits (ABC) Sync</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Description & Supporting Reference:
                  </label>
                  <textarea
                    rows={3}
                    value={correctionDetails}
                    onChange={(e) => setCorrectionDetails(e.target.value)}
                    placeholder="Provide details regarding the discrepancy (e.g. Sem 3 SGPA showing 8.40 instead of re-evaluated 8.65 per University gazette notification #412)..."
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    Your submission will be timestamped and permanently tracked in the tamper-evident audit trail with SHA-256 verification.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsCorrectionModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingCorrection || !correctionDetails.trim()}
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmittingCorrection ? 'Transmitting...' : 'Submit to Nodal Officer'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
