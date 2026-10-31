import React, { useState } from 'react';
import { useAuth, OFFICIAL_ROLES } from '../context/AuthContext';

export const LoginScreen = () => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState('ROLE_INST_NODAL');
  const [identifierInput, setIdentifierInput] = useState('PID-1-4920182');
  const [password, setPassword] = useState('GovTech@2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentRoleConfig = OFFICIAL_ROLES[selectedRole];

  // When switching role in selector, automatically populate the corresponding documented identifier
  const handleRoleChange = (roleKey) => {
    setSelectedRole(roleKey);
    const target = OFFICIAL_ROLES[roleKey];
    setIdentifierInput(target?.identifier || '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      login(selectedRole, password, selectedRole);
      setLoading(false);
    }, 250);
  };

  const handleInstantRoleAuth = (roleKey) => {
    setSelectedRole(roleKey);
    setLoading(true);
    setTimeout(() => {
      login(roleKey, 'GovTech@2026!', roleKey);
      setLoading(false);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans text-slate-900">
      {/* Official Government Tri-Color Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#EA580C] via-white to-[#10B981]"></div>

      {/* Official GovTech Header Banner */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center space-x-2.5 font-medium">
            <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-300 font-bold text-[11px]">
              GovTech Official SSO
            </span>
            <span>Government of India • Ministry of Education & AICTE Initiative</span>
          </div>

          <div className="flex items-center space-x-3 text-[11px] text-slate-500 font-mono">
            <span>ISO 27001 Certified</span>
            <span>•</span>
            <span>DPDP Act 2023 Compliant</span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">Zero-Trust Active</span>
          </div>
        </div>
      </div>

      {/* Main Split Section */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Platform Overview & Official Architecture */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3.5">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-amber-200/80 bg-[#FFFDF8] shadow-sm flex items-center justify-center p-0.5 flex-shrink-0">
                  <img src="/apaar-setu-logo.jpg" alt="APAAR-SETU Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">APAAR-SETU</h1>
                  <span className="text-[11px] uppercase font-bold tracking-wider text-blue-900">
                    National Academic Verifiable Ledger
                  </span>
                </div>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight leading-tight mt-4">
                Strict 4-Role RBAC Identity Gateway
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Autonomous credential and token management mapped to the official Zero-Trust RBAC matrix defined in{' '}
                <strong className="text-slate-900">RBAC.MD</strong> and <strong className="text-slate-900">database/schema.sql</strong>.
              </p>
            </div>

            {/* GovTech Pillars */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#EA580C] flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                  🆔
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A]">One Nation, One Student ID (APAAR)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    12-digit lifelong academic identifier verified via DigiLocker / ABC National Registry.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                  🛡️
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A]">AICTE Intake Quota Lock (Rule 14-B)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Automated real-time prevention of over-admission beyond approved gazette capacity.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#10B981] flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                  🔒
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A]">DPDP Act 2023 Consent & Verifiable Credentials</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Time-bound student consent management and tamper-evident W3C QR verifiable degrees.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Exact Documented Roles Login Card */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-7 sm:p-9 space-y-6">
              
              {/* Header */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    Official RBAC Gateway
                  </span>
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full">
                    PostgreSQL RLS Scoped
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-[#0F172A] mt-1">
                  RBAC Demo Switcher & Role Selector
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select your documented authority role below to enter the corresponding authenticated dashboard for prototype evaluation.
                </p>
              </div>

              {/* 4 Documented Role Selector Tabs */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Select Role to Enter App:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  
                  {/* Role 1: Institute Nodal Officer */}
                  <button
                    type="button"
                    onClick={() => handleRoleChange('ROLE_INST_NODAL')}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start space-x-3 ${
                      selectedRole === 'ROLE_INST_NODAL'
                        ? 'border-blue-700 bg-blue-50/80 ring-2 ring-blue-700 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-lg mt-0.5">🏛️</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 leading-snug">
                        Institute Nodal Officer
                      </div>
                      <div className="text-[10px] font-mono text-blue-700 font-semibold truncate">
                        ROLE_INST_NODAL
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        PID-1-4920182 (LNCTE)
                      </div>
                    </div>
                  </button>

                  {/* Role 2: Enrolled Technical Student */}
                  <button
                    type="button"
                    onClick={() => handleRoleChange('ROLE_STUDENT')}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start space-x-3 ${
                      selectedRole === 'ROLE_STUDENT'
                        ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-600 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-lg mt-0.5">🎓</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 leading-snug">
                        Enrolled Technical Student
                      </div>
                      <div className="text-[10px] font-mono text-emerald-700 font-semibold truncate">
                        ROLE_STUDENT
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        APAAR 7841-9023-4412
                      </div>
                    </div>
                  </button>

                  {/* Role 3: National Regulatory Officer */}
                  <button
                    type="button"
                    onClick={() => handleRoleChange('ROLE_COUNCIL_ADMIN')}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start space-x-3 ${
                      selectedRole === 'ROLE_COUNCIL_ADMIN'
                        ? 'border-purple-700 bg-purple-50/80 ring-2 ring-purple-700 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-lg mt-0.5">⚖️</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 leading-snug">
                        National Regulatory Officer
                      </div>
                      <div className="text-[10px] font-mono text-purple-700 font-semibold truncate">
                        ROLE_COUNCIL_ADMIN
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        NATIONAL_ALL (Council)
                      </div>
                    </div>
                  </button>

                  {/* Role 4: Corporate HR / BGV Agency */}
                  <button
                    type="button"
                    onClick={() => handleRoleChange('ROLE_VERIFIER')}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start space-x-3 ${
                      selectedRole === 'ROLE_VERIFIER'
                        ? 'border-amber-700 bg-amber-50/80 ring-2 ring-amber-700 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-lg mt-0.5">🔍</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 leading-snug">
                        Corporate HR / BGV Agency
                      </div>
                      <div className="text-[10px] font-mono text-amber-800 font-semibold truncate">
                        ROLE_VERIFIER
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        ORG-INFOSYS-BGV
                      </div>
                    </div>
                  </button>

                </div>
              </div>

              {/* Active Stakeholder Persona Details Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">
                    {currentRoleConfig?.personaName}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                    {currentRoleConfig?.roleCode}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 font-mono">
                  {currentRoleConfig?.email} • {currentRoleConfig?.identifier}
                </div>
                <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                  {currentRoleConfig?.authorityScope}
                </div>
              </div>

              {/* Explicit Credential Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Scoped Identifier (Institute PID / APAAR ID / Agency ID)
                  </label>
                  <input
                    type="text"
                    value={identifierInput}
                    onChange={(e) => setIdentifierInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Digital Signature / Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 font-mono"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors shadow-md flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <span>Verifying Claims...</span>
                    ) : (
                      <>
                        <span>Authenticate as {currentRoleConfig?.roleTitle}</span>
                        <span>→</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInstantRoleAuth(selectedRole)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-3 rounded-xl text-xs transition-colors shadow-sm"
                    title="1-Click Instant Demo Authentication"
                  >
                    ⚡ Instant
                  </button>
                </div>
              </form>

            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500">
        APAAR-SETU GovTech Reference Implementation • Smart India Hackathon (SIH 2026)
      </footer>
    </div>
  );
};

export default LoginScreen;
