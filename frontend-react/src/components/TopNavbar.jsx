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
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-200/80 bg-[#FFFDF8] shadow-xs flex items-center justify-center p-0.5 flex-shrink-0">
            <img src="/apaar-setu-logo.jpg" alt="APAAR-SETU Logo" className="w-full h-full object-contain" />
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

        {/* Clean Authenticated User Identity, Role Badge, and Sign Out */}
        <div className="flex items-center space-x-4">
          <div className="text-right flex flex-col items-end">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-600">
                {currentUser.tenantPid ? `Tenant: ${currentUser.tenantPid}` : (currentUser.apaarId ? `APAAR: ${currentUser.apaarId}` : 'National Node')}
              </span>
              <span className="text-slate-300">•</span>
              {/* Active Role Badge: 'Name - ROLE_CODE' */}
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border shadow-2xs ${
                  role === 'ROLE_INST_NODAL'
                    ? 'bg-blue-50 text-blue-900 border-blue-200'
                    : role === 'ROLE_STUDENT'
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    : role === 'ROLE_COUNCIL_ADMIN'
                    ? 'bg-purple-50 text-purple-900 border-purple-200'
                    : 'bg-amber-50 text-amber-900 border-amber-200'
                }`}
              >
                {currentUser.personaName || currentUser.name} — {currentUser.roleCode || role}
              </span>
            </div>
          </div>

          <button
            type="button"
            id="navbar-signout-btn"
            onClick={logout}
            className="text-xs font-bold bg-white hover:bg-rose-50 text-rose-700 hover:text-rose-800 border border-slate-200 hover:border-rose-300 px-3.5 py-1.5 rounded-xl transition-all shadow-2xs active:scale-95 flex items-center space-x-1.5"
            title="Terminate session and return to Login Gateway"
          >
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
