import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Static mock array: Semester Academic Records
const MOCK_SEMESTERS = [
  {
    semester: 'Semester 1 (Autumn 2024)',
    sgpa: 8.85,
    credits: 24,
    status: 'VERIFIED_ON_ABC',
    hash: '0x3f91a82bc09e14a821e847719f201e91244e8a10',
    courses: [
      { code: 'CS101', name: 'Data Structures & Algorithms', credits: 4, grade: 'A+' },
      { code: 'MA101', name: 'Discrete Mathematics & Logic', credits: 4, grade: 'A' },
      { code: 'CS102', name: 'Computer System Architecture', credits: 4, grade: 'A+' },
      { code: 'CS103', name: 'Operating Systems Principles', credits: 4, grade: 'O' },
      { code: 'HS101', name: 'Professional Ethics & NEP Cyber Laws', credits: 4, grade: 'A+' },
      { code: 'CS104P', name: 'Advanced Systems Lab', credits: 4, grade: 'O' }
    ]
  },
  {
    semester: 'Semester 2 (Spring 2025)',
    sgpa: 9.10,
    credits: 26,
    status: 'VERIFIED_ON_ABC',
    hash: '0x7b28d901f4219a8bc430e7195820ab1e488102a9',
    courses: [
      { code: 'CS201', name: 'Database Management & Relational Calculus', credits: 4, grade: 'O' },
      { code: 'CS202', name: 'Computer Networks & Zero-Trust Protocols', credits: 4, grade: 'A+' },
      { code: 'MA201', name: 'Linear Algebra & Probability for AI', credits: 4, grade: 'A+' },
      { code: 'CS203', name: 'Modern Full-Stack Web Technologies', credits: 4, grade: 'O' },
      { code: 'CS204', name: 'Formal Language & Automata Theory', credits: 4, grade: 'A' },
      { code: 'CS205P', name: 'Database & Network Security Lab', credits: 6, grade: 'O' }
    ]
  },
  {
    semester: 'Semester 3 (Autumn 2025)',
    sgpa: 9.25,
    credits: 24,
    status: 'CURRENT_ENROLLED',
    hash: '0x91c0e81249b58102ae9471b028819a571029ba81',
    courses: [
      { code: 'CS301', name: 'Cloud Native Systems & Distributed Ledgers', credits: 4, grade: 'Enrolled' },
      { code: 'CS302', name: 'Applied Artificial Intelligence & Machine Learning', credits: 4, grade: 'Enrolled' },
      { code: 'CS303', name: 'Information Security & Cryptographic Auditing', credits: 4, grade: 'Enrolled' },
      { code: 'CS304', name: 'NEP 2020 GovTech Capstone Project', credits: 8, grade: 'Enrolled' },
      { code: 'CS305P', name: 'AI & Cloud Infrastructure Lab', credits: 4, grade: 'Enrolled' }
    ]
  }
];

// Static mock array: DPDP Act 2023 Consent Requests
const MOCK_CONSENTS = [
  {
    id: 'req_infosys_bgv_001',
    requestor: 'Infosys Limited • Global BGV Division',
    purpose: 'Pre-Employment Background Verification for Campus Internship',
    scope: 'Academic Transcript, CGPA, Degree Authenticity & ABC Records',
    requestedDate: '2026-10-28',
    status: 'APPROVED',
    expiresInDays: 14
  },
  {
    id: 'req_aicte_sch_002',
    requestor: 'AICTE National Merit Scholarship Directorate',
    purpose: 'Tuition Fee Reimbursement Eligibility Validation',
    scope: 'Semester 1 & 2 Marksheet Authenticity & Active Enrollment Status',
    requestedDate: '2026-10-29',
    status: 'PENDING',
    expiresInDays: 7
  },
  {
    id: 'req_tcs_placement_003',
    requestor: 'Tata Consultancy Services • Campus Hiring Cell',
    purpose: 'Eligibility Check for Digital Profile Assessment',
    scope: 'Cumulative Credit Bank Statement & Verified Identity',
    requestedDate: '2026-10-15',
    status: 'REVOKED',
    expiresInDays: 0
  }
];

export const UserDashboard = () => {
  const { currentUser } = useAuth();
  const [consents, setConsents] = useState(MOCK_CONSENTS);
  const [selectedSemester, setSelectedSemester] = useState(MOCK_SEMESTERS[0]);
  const [copied, setCopied] = useState(false);

  const toggleConsent = (id) => {
    setConsents((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === 'APPROVED' ? 'REVOKED' : 'APPROVED';
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const handleCopyApaar = () => {
    navigator.clipboard?.writeText(currentUser?.apaarId || '7841-9023-4412');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">

        {/* Top Header Card / Student Passport Overview */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-900 text-white font-black text-2xl flex items-center justify-center shadow-md">
                🎓
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Student Digital Identity Passport
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>DigiLocker / ABC Verified</span>
                  </span>
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                  {currentUser?.name || 'Pritam Raj Chaurasiya'}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lakshmi Narain College of Technology & Excellence, Bhopal • B.Tech Computer Science (3rd Sem)
                </p>
              </div>
            </div>

            {/* APAAR ID Pill with Copy button */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center space-x-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                  Lifelong APAAR ID
                </span>
                <span className="text-lg font-black font-mono text-blue-950">
                  {currentUser?.apaarId || '7841-9023-4412'}
                </span>
              </div>
              <button
                onClick={handleCopyApaar}
                className="text-xs bg-white border border-slate-300 hover:border-slate-400 font-bold px-3 py-1.5 rounded-lg text-slate-700 transition-colors shadow-2xs"
              >
                {copied ? 'Copied ✓' : 'Copy'}
              </button>
            </div>

          </div>
        </div>

        {/* 3 Key Stats / Academic Bank of Credits */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cumulative GPA (CGPA)</span>
            <div className="text-3xl font-black text-blue-900 mt-2">9.07 <span className="text-sm font-normal text-slate-400">/ 10.0</span></div>
            <span className="text-xs text-emerald-600 font-semibold block mt-1">Top 3% in Cohort</span>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Earned Academic Credits</span>
            <div className="text-3xl font-black text-slate-900 mt-2">74 <span className="text-sm font-normal text-slate-400">Credits</span></div>
            <span className="text-xs text-slate-500 block mt-1">Anchored to ABC National Depository</span>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active DPDP Consents</span>
            <div className="text-3xl font-black text-emerald-700 mt-2">
              {consents.filter((c) => c.status === 'APPROVED').length} <span className="text-sm font-normal text-slate-400">/ {consents.length}</span>
            </div>
            <span className="text-xs text-slate-500 block mt-1">Zero-Knowledge Disclosure Enabled</span>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Credential Status</span>
            <div className="text-xl font-black text-emerald-600 mt-3 flex items-center space-x-1.5">
              <span>●</span>
              <span>W3C Verified</span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">SHA-256 Merkle Proven</span>
          </div>
        </div>

        {/* Middle Two-Column Grid: Academic Transcripts & Verifiable QR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Academic Transcript Timeline */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-black text-slate-900">Academic Transcript & Subject Ledger</h2>
                <p className="text-xs text-slate-500">
                  Select a semester to review verified course grades and credit assignments.
                </p>
              </div>

              {/* Semester Switcher Tabs */}
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
                {MOCK_SEMESTERS.map((sem, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSemester(sem)}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                      selectedSemester.semester === sem.semester
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Sem {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Semester Meta */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-slate-900 block">{selectedSemester.semester}</span>
                <span className="text-slate-500 font-mono text-[11px]">
                  Merkle Root: {selectedSemester.hash}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">SGPA</span>
                  <span className="font-black text-blue-900 text-sm">{selectedSemester.sgpa}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Credits</span>
                  <span className="font-black text-slate-900 text-sm">{selectedSemester.credits}</span>
                </div>
              </div>
            </div>

            {/* Courses Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">Course Code</th>
                    <th className="p-3">Course Title</th>
                    <th className="p-3">Credits</th>
                    <th className="p-3 text-right">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedSemester.courses.map((course, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 font-sans">
                      <td className="p-3 font-mono font-bold text-blue-900">{course.code}</td>
                      <td className="p-3 text-slate-800 font-medium">{course.name}</td>
                      <td className="p-3 font-mono text-slate-600">{course.credits}</td>
                      <td className="p-3 text-right font-black font-mono text-slate-900">
                        <span
                          className={`px-2 py-0.5 rounded ${
                            course.grade === 'O' || course.grade === 'A+'
                              ? 'bg-emerald-100 text-emerald-800'
                              : course.grade === 'Enrolled'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {course.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: W3C Verifiable Credential QR Card */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Verifiable Credential
                </h3>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                  W3C Standards
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Tamper-evident academic credential authenticated by the National Depository public key.
              </p>
            </div>

            {/* Simulated Cryptographic QR Card */}
            <div className="bg-slate-900 rounded-xl p-5 text-center text-white space-y-3">
              <div className="w-36 h-36 mx-auto bg-white p-2 rounded-lg flex items-center justify-center">
                {/* SVG Visual QR Mock */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                  <rect x="0" y="0" width="30" height="30" />
                  <rect x="5" y="5" width="20" height="20" fill="white" />
                  <rect x="10" y="10" width="10" height="10" />
                  <rect x="70" y="0" width="30" height="30" />
                  <rect x="75" y="5" width="20" height="20" fill="white" />
                  <rect x="80" y="10" width="10" height="10" />
                  <rect x="0" y="70" width="30" height="30" />
                  <rect x="5" y="75" width="20" height="20" fill="white" />
                  <rect x="10" y="80" width="10" height="10" />
                  <rect x="40" y="10" width="15" height="15" />
                  <rect x="40" y="40" width="20" height="20" />
                  <rect x="70" y="45" width="15" height="15" />
                  <rect x="40" y="75" width="15" height="15" />
                  <rect x="70" y="75" width="20" height="20" />
                </svg>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-mono font-bold text-emerald-400">
                  SHA-256 ANCHOR VERIFIED
                </div>
                <div className="text-[10px] font-mono text-slate-400 truncate max-w-xs mx-auto">
                  0x8f92e41b7c2091a41ce69418a02b1
                </div>
              </div>
            </div>

            <button
              onClick={() => alert('W3C Verifiable Credential JSON payload downloaded successfully.')}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 rounded-xl transition-colors border border-slate-200"
            >
              Export Cryptographic JSON-LD
            </button>
          </div>

        </div>

        {/* Bottom Section: DPDP Act 2023 Consent Inbox */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-black text-slate-900">
                Digital Personal Data Protection (DPDP) Act 2023 Consent Inbox
              </h2>
              <p className="text-xs text-slate-500">
                Third-party background verification agencies and government entities requesting verified transcripts.
              </p>
            </div>
            <span className="text-xs font-mono bg-blue-50 text-blue-800 font-bold px-3 py-1 rounded-full border border-blue-200">
              Active Consents: {consents.filter((c) => c.status === 'APPROVED').length}
            </span>
          </div>

          <div className="space-y-3">
            {consents.map((consent) => {
              const isApproved = consent.status === 'APPROVED';
              const isPending = consent.status === 'PENDING';

              return (
                <div
                  key={consent.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black text-slate-900">{consent.requestor}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isApproved
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : isPending
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {consent.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{consent.purpose}</p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Scope: {consent.scope} • Requested: {consent.requestedDate}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleConsent(consent.id)}
                      className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors ${
                        isApproved
                          ? 'bg-rose-600 hover:bg-rose-700 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {isApproved ? 'Revoke Consent' : 'Approve Consent'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;
