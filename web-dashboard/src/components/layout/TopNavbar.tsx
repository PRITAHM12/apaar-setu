import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  LogOut,
  GraduationCap,
  Building2,
  Search,
  Landmark,
  UserCheck
} from 'lucide-react';
import { useAuthRBAC } from '../../context/AuthRBACContext';
import { apiClient } from '../../utils/apiClient';
import { ApaarSetuLogo } from '../common/ApaarSetuLogo';
import { SecurityLogsModal } from './SecurityLogsModal';

export const TopNavbar: React.FC = () => {
  const { 
    isAuthenticated,
    activeRole,
    oauthSession, 
    auditLogs,
    setActiveScreen, 
    logout 
  } = useAuthRBAC();
  
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [isSystemOnline, setIsSystemOnline] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const h = await apiClient.getSystemHealth();
        setIsSystemOnline(h.nodeGateway === 'ONLINE');
      } catch {
        setIsSystemOnline(true);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigateHome = () => {
    if (!isAuthenticated) {
      setActiveScreen('LANDING');
    }
  };

  const handleScrollAboutUs = () => {
    setActiveScreen('LANDING');
    setTimeout(() => {
      const element = document.getElementById('how-it-works');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  // Determine authorized dashboard title and icon
  const getRoleDashboardInfo = () => {
    switch (activeRole) {
      case 'ROLE_STUDENT':
        return {
          title: 'Student Digital Academic Passport',
          badge: 'Verified Student ID',
          icon: <GraduationCap className="w-5 h-5 text-blue-700" />,
          colorClass: 'text-blue-900 bg-blue-50 border-blue-200'
        };
      case 'ROLE_INST_NODAL':
        return {
          title: 'Institutional Nodal Hub | PID: PID-1-4920182',
          badge: 'Sanctioned Intake Active',
          icon: <Building2 className="w-5 h-5 text-indigo-700" />,
          colorClass: 'text-indigo-900 bg-indigo-50 border-indigo-200'
        };
      case 'ROLE_VERIFIER':
        return {
          title: 'Employer Background Verification (BGV)',
          badge: 'W3C & AI Forensics',
          icon: <Search className="w-5 h-5 text-emerald-700" />,
          colorClass: 'text-emerald-900 bg-emerald-50 border-emerald-200'
        };
      case 'ROLE_COUNCIL_ADMIN':
        return {
          title: 'AICTE National Command & Analytics',
          badge: 'Apex Council Authority',
          icon: <Landmark className="w-5 h-5 text-purple-700" />,
          colorClass: 'text-purple-900 bg-purple-50 border-purple-200'
        };
      default:
        return {
          title: 'Secure Academic Portal',
          badge: 'Authorized',
          icon: <UserCheck className="w-5 h-5 text-blue-700" />,
          colorClass: 'text-blue-900 bg-blue-50 border-blue-200'
        };
    }
  };

  const roleInfo = getRoleDashboardInfo();

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Left: Official APAAR-Setu Brand Logo */}
            <div 
              onClick={handleNavigateHome}
              className={`flex items-center space-x-3 flex-shrink-0 ${!isAuthenticated ? 'cursor-pointer' : ''}`}
            >
              <ApaarSetuLogo size="md" />
            </div>

            {/* CONDITIONAL CENTER & RIGHT: Public Navbar vs Authenticated Navbar */}
            {!isAuthenticated ? (
              /* ================= PUBLIC NAVBAR ================= */
              <div className="flex items-center justify-end space-x-4 flex-1">
                <button
                  onClick={handleScrollAboutUs}
                  className="hidden md:inline-flex text-xs font-bold text-slate-700 hover:text-blue-700 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  How It Works
                </button>

                {/* System Status Indicator Pill */}
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-600">
                  <span className={`w-2 h-2 rounded-full ${isSystemOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                  <span className="font-medium">{isSystemOnline ? 'Ledger Live' : 'Connecting'}</span>
                </div>

                {/* Primary Google Sign-in CTA */}
                <button
                  id="navbar-google-signin-btn"
                  onClick={() => setActiveScreen('SCREEN_OAUTH')}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-[#0F172A] font-bold text-xs shadow-xs hover:shadow-sm transition-all"
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Sign in with Google</span>
                </button>
              </div>
            ) : (
              /* ================= AUTHENTICATED NAVBAR ================= */
              <>
                {/* Center: ONLY Authorized Role Dashboard Title */}
                <div className="hidden md:flex items-center">
                  <div className={`flex items-center space-x-2.5 px-4 py-2 rounded-2xl border ${roleInfo.colorClass} shadow-xs`}>
                    {roleInfo.icon}
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-xs tracking-tight text-slate-900">
                        {roleInfo.title}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {roleInfo.badge} • Authorized Context
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Active Session Badge, Logs, and Sign Out */}
                <div className="flex items-center space-x-3 flex-shrink-0">
                  {/* Active OAuth Session Badge */}
                  <div 
                    className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#0F172A] text-white text-xs border border-slate-800 shadow-xs"
                    title={`Subject: ${oauthSession?.userProfile.name} (${oauthSession?.userProfile.identifier})`}
                  >
                    <div className={`w-2 h-2 rounded-full ${isSystemOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                    <div className="flex flex-col text-left max-w-[140px] truncate">
                      <span className="font-bold text-[11px] text-emerald-400 truncate">
                        {oauthSession?.userProfile.name || 'Verified User'}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono truncate">
                        {oauthSession?.userProfile.identifier}
                      </span>
                    </div>
                  </div>

                  {/* Security Logs Button */}
                  <button
                    onClick={() => setIsLogsModalOpen(true)}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-800 hover:text-white hover:border-slate-800 transition-all duration-300 ease-in-out active:scale-95"
                    title="View tamper-proof audit trail"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Logs</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold">
                      {auditLogs.length}
                    </span>
                  </button>

                  {/* Sign Out Button */}
                  <button
                    id="navbar-signout-btn"
                    onClick={logout}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border-2 border-rose-500 text-rose-600 text-xs font-bold hover:bg-rose-600 hover:text-white transition-all duration-300 ease-in-out hover:shadow-md hover:shadow-rose-500/20 active:scale-95"
                    title="Terminate current session and return to Landing Page"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}

          </div>

          {/* Authenticated Mobile Sub-bar with Dashboard Title */}
          {isAuthenticated && (
            <div className="md:hidden flex items-center justify-between pb-3 pt-1 border-t border-slate-100">
              <div className="flex items-center space-x-2">
                {roleInfo.icon}
                <span className="font-bold text-xs text-slate-800 truncate">
                  {roleInfo.title}
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Active
              </span>
            </div>
          )}

        </div>
      </header>

      {/* Security Logs Modal */}
      <SecurityLogsModal
        isOpen={isLogsModalOpen}
        onClose={() => setIsLogsModalOpen(false)}
      />
    </>
  );
};
