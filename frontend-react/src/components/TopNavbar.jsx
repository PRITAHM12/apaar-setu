import React from 'react';
import { useAuth } from '../context/AuthContext';

export const TopNavbar = () => {
  const { currentUser, role, logout, switchRole } = useAuth();

  if (!currentUser) return null;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Tri-color accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#EA580C] via-white to-[#10B981]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo and Brand */}
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
              National Academic Depository & Real-Time AICTE Quota Sentinel
            </p>
          </div>
        </div>

        {/* Center / Fast Demo Switcher for Judges */}
        <div className="hidden md:flex items-center space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 px-2 uppercase">Demo Switcher:</span>
          <button
            onClick={() => switchRole('admin')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              role === 'admin'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            Nodal Admin Dashboard
          </button>
          <button
            onClick={() => switchRole('user')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              role === 'user'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            Student User Dashboard
          </button>
        </div>

        {/* Current User Profile & Logout */}
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <div className="flex items-center justify-end space-x-1.5">
              <span className="text-xs font-bold text-slate-900">{currentUser.name}</span>
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  role === 'admin'
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                {currentUser.roleCode || role.toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-500">
              {currentUser.apaarId ? `APAAR: ${currentUser.apaarId}` : `Tenant: ${currentUser.tenantPid}`}
            </p>
          </div>

          <button
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
