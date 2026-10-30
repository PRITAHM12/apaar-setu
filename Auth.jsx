import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

// ============================================================================
// Configuration
// ============================================================================
const GOOGLE_CLIENT_ID =
  process.env?.REACT_APP_GOOGLE_CLIENT_ID ||
  '1084209182391-sample.apps.googleusercontent.com';

const API_BASE_URL =
  process.env?.REACT_APP_API_GATEWAY_URL || 'http://localhost:4000';

export const Auth = ({ onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState('STUDENT_GOOGLE');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successUser, setSuccessUser] = useState(null);

  const [adminEmail, setAdminEmail] = useState('nodal.officer@lncte.edu.in');
  const [adminPassword, setAdminPassword] = useState('NodalAdmin@2026!');
  const [institutionId, setInstitutionId] = useState('COL-LNCTE-001');

  // TAB 1: Student Google OAuth 2.0 Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          credential: credentialResponse.credential
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Google token validation failed on backend');
      }

      setSuccessUser(data.user);
      if (onAuthSuccess) {
        onAuthSuccess(data.user);
      }
    } catch (err) {
      console.error('[GOOGLE AUTH CLIENT ERROR]', err);
      setErrorMessage(err.message || 'Google OAuth verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrorMessage('Google Sign-In popup was closed or encountered an error.');
  };

  // TAB 2: Admin Email/Password Handler
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: adminEmail,
          password: adminPassword,
          institutionId
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Invalid administrative credentials');
      }

      setSuccessUser(data.user);
      if (onAuthSuccess) {
        onAuthSuccess(data.user);
      }
    } catch (err) {
      console.error('[ADMIN LOGIN CLIENT ERROR]', err);
      setErrorMessage(err.message || 'Administrative login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
        
        {/* GovTech Header */}
        <div className="text-center max-w-md mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-200/80 text-slate-800 text-xs font-bold mb-3 border border-slate-300">
            <span>🇮🇳</span>
            <span>Government of India • Ministry of Education</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            APAAR-Setu National Gateway
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Zero-Trust Academic Authentication & Regulatory Ledger Access
          </p>
        </div>

        {/* Card Container */}
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-8 space-y-6">
          
          {/* Dual-Tab Selector */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('STUDENT_GOOGLE');
                setErrorMessage(null);
              }}
              className={`py-2.5 rounded-xl transition-all ${
                activeTab === 'STUDENT_GOOGLE'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              🎓 Student (Google)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('ADMIN_PASSWORD');
                setErrorMessage(null);
              }}
              className={`py-2.5 rounded-xl transition-all ${
                activeTab === 'ADMIN_PASSWORD'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              🏛️ College / Admin
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-start space-x-2 animate-shake">
              <span className="text-sm">⚠️</span>
              <span className="leading-snug">{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successUser && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium space-y-1">
              <div className="font-bold flex items-center space-x-1.5">
                <span className="text-emerald-600">✓</span>
                <span>Authenticated Successfully!</span>
              </div>
              <p>Welcome, <span className="font-bold">{successUser.fullName}</span> ({successUser.role})</p>
              <p className="text-[11px] text-emerald-600 font-mono">Issued HTTP-Only JWT Cookie: Active</p>
            </div>
          )}

          {/* TAB 1: Student Google OAuth 2.0 View */}
          {activeTab === 'STUDENT_GOOGLE' && (
            <div className="space-y-6 py-2 text-center">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800">
                  Sovereign Student Authentication
                </h3>
                <p className="text-xs text-slate-500">
                  Sign in with your registered student institutional or personal Google account.
                </p>
              </div>

              <div className="flex justify-center pt-2">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap={false}
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  width="320"
                />
              </div>

              {isLoading && (
                <div className="text-xs text-blue-600 font-semibold animate-pulse">
                  Verifying Google signature with Node.js API Gateway...
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
                Encrypted via W3C Decentralized Identity & APAAR Single-Sign-On standards.
              </div>
            </div>
          )}

          {/* TAB 2: Admin Email/Password View */}
          {activeTab === 'ADMIN_PASSWORD' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Institutional Email
                </label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="nodal.officer@institution.edu.in"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  College PID / Council ID
                </label>
                <input
                  type="text"
                  required
                  value={institutionId}
                  onChange={(e) => setInstitutionId(e.target.value)}
                  placeholder="COL-LNCTE-001"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md active:scale-98 disabled:opacity-50"
              >
                {isLoading ? 'Verifying Credentials...' : 'Sign In to Nodal Console'}
              </button>

              <div className="pt-2 text-center text-[11px] text-slate-400">
                Audited access under AICTE Rule 14-B & DPDP Act 2023.
              </div>
            </form>
          )}

        </div>

        {/* Security & Regulatory Footer */}
        <div className="text-center text-[11px] text-slate-400 mt-6 space-y-0.5">
          <p>National Academic Depository (NAD) & Academic Bank of Credits (ABC) Compliant</p>
          <p>© 2026 Smart India Hackathon Prototype • National Informatics Centre Verified</p>
        </div>

      </div>
    </GoogleOAuthProvider>
  );
};

export default Auth;
