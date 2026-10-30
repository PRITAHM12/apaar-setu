import React from 'react';
import { useAuth, OFFICIAL_ROLES } from '../context/AuthContext';

export const TopNavbar = () => {
  const { currentUser, role, logout, switchRole } = useAuth();

  if (!currentUser) return null;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Official Government Tri-Color Accent Line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#EA580C] via-white to-[#10B981]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Brand & Prototype Identity */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-900 text-white flex items-center justify-center font-black shadow-md border border-blue-800">
            <span className="text-emerald-400 text-base">✦</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-base tracking-tight text-slate-900">
                APAAR-SETU
              </span>
              <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-300 uppercase tracking-wider">
                SIH 2026 PROTOTYPE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              National Academic Depository & Zero-Trust Verification Engine
            </p>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* DEMO SWITCHER: REWRITTEN TO MATCH EXACT OFFICIAL .MD ROLES           */}
        {/* ==================================================================== */}
        <div className="hidden lg:flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <span className="text-[10px] font-black text-slate-500 px-2 uppercase tracking-wider">
            RBAC Demo Switcher:
          </span>

          {/* Role 1: Institute Nodal Officer (ROLE_INST_NODAL) */}
          <button
            type="button"
            onClick={() => switchRole('ROLE_INST_NODAL')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
              role === 'ROLE_INST_NODAL'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>🏛️</span>
            <span>Institute Nodal Officer (ROLE_INST_NODAL)</span>
          </button>

          {/* Role 2: Enrolled Technical Student (ROLE_STUDENT) */}
          <button
            type="button"
            onClick={() => switchRole('ROLE_STUDENT')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
              role === 'ROLE_STUDENT'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>🎓</span>
            <span>Enrolled Technical Student (ROLE_STUDENT)</span>
          </button>

          {/* Role 3: National Regulatory Officer (ROLE_COUNCIL_ADMIN) */}
          <button
            type="button"
            onClick={() => switchRole('ROLE_COUNCIL_ADMIN')}
            className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1 ${
              role === 'ROLE_COUNCIL_ADMIN'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
            title="National Regulatory Officer (ROLE_COUNCIL_ADMIN)"
          >
            <span>⚖️</span>
            <span>ROLE_COUNCIL_ADMIN</span>
          </button>

          {/* Role 4: Corporate HR / BGV Agency (ROLE_VERIFIER) */}
          <button
            type="button"
            onClick={() => switchRole('ROLE_VERIFIER')}
            className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1 ${
              role === 'ROLE_VERIFIER'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
            title="Corporate HR / BGV Agency (ROLE_VERIFIER)"
          >
            <span>🔍</span>
            <span>ROLE_VERIFIER</span>
          </button>
        </div>

        {/* Current Active Persona & Logout */}
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <div className="flex items-center justify-end space-x-1.5">
              <span className="text-xs font-bold text-slate-900">{currentUser.personaName || currentUser.name}</span>
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  role === 'ROLE_INST_NODAL'
                    ? 'bg-blue-100 text-blue-900 border border-blue-200'
                    : role === 'ROLE_STUDENT'
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                    : role === 'ROLE_COUNCIL_ADMIN'
                    ? 'bg-purple-100 text-purple-900 border border-purple-200'
                    : 'bg-amber-100 text-amber-900 border border-amber-200'
                }`}
              >
                {currentUser.roleCode || role}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-500">
              {currentUser.apaarId ? `APAAR: ${currentUser.apaarId}` : `Tenant: ${currentUser.tenantPid}`}
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="text-xs font-bold bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 border border-slate-200 hover:border-rose-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
