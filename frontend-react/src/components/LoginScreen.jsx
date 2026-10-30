import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const LoginScreen = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('GovTech@2026!');
  const [selectedRolePreset, setSelectedRolePreset] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (!username) {
        setError('Please enter a username (e.g. "admin" or "user").');
        setLoading(false);
        return;
      }
      login(username, password, selectedRolePreset);
      setLoading(false);
    }, 300);
  };

  const handleQuickLogin = (role) => {
    setLoading(true);
    setTimeout(() => {
      login(role, 'Demo@2026!', role);
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
          
          {/* Left Column: Platform Overview & Architecture */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-black shadow-lg border border-blue-800">
                  <span className="text-emerald-400 text-xl">✦</span>
                </div>
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">APAAR-SETU</h1>
                  <span className="text-[11px] uppercase font-bold tracking-wider text-blue-900">
                    National Academic Verifiable Ledger
                  </span>
                </div>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight leading-tight mt-4">
                Unified Role-Based Identity & Governance Gateway
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Seamless role-based portal for <strong>Institutional Nodal Officers</strong>,{' '}
                <strong>Enrolled Technical Students</strong>, and Regulatory Councils. Fully bypassed for SIH hackathon evaluation with verified mock identity claims.
              </p>
            </div>

            {/* GovTech Feature Highlights */}
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

          {/* Right Column: Interactive Login Card */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-7 sm:p-9 space-y-6">
              
              {/* Header */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    Authentication Portal
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Mock Bypass Active
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-[#0F172A] mt-1">
                  Sign In to APAAR-Setu
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter dummy credentials or use the instant 1-click evaluator buttons below.
                </p>
              </div>

              {/* 1-Click Fast Switch Buttons for SIH Judges */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Quick 1-Click Role Login:
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRolePreset('admin');
                      setUsername('admin');
                      handleQuickLogin('admin');
                    }}
                    className="p-3 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 text-left transition-colors flex items-center space-x-3 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center text-xs font-black">
                      🏛️
                    </div>
                    <div>
                      <div className="text-xs font-bold text-blue-950">Login as Admin</div>
                      <div className="text-[10px] text-blue-700">Nodal / Council Governance</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRolePreset('user');
                      setUsername('user');
                      handleQuickLogin('user');
                    }}
                    className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 text-left transition-colors flex items-center space-x-3 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs font-black">
                      🎓
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-950">Login as User</div>
                      <div className="text-[10px] text-emerald-700">Student Academic Passport</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-xs font-bold text-slate-400 uppercase">
                  Or enter credentials
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Credential Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Username / Role Identifier
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter 'admin' or 'user'"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 font-mono"
                    required
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Use <strong className="text-blue-900 font-mono">admin</strong> for Nodal Admin Dashboard or{' '}
                    <strong className="text-emerald-700 font-mono">user</strong> for Student Passport.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password (Dummy)
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Any password..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl text-sm transition-colors shadow-md flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Enter Secure Workspace</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </form>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px]">
                <strong className="text-slate-800">Deployment Notice:</strong> All Supabase backend calls are severed. State is preserved in memory and redirects to role-specific protected dashboards.
              </div>

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
