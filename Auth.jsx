import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const GOOGLE_CLIENT_ID =
  process.env?.REACT_APP_GOOGLE_CLIENT_ID ||
  '1084209182391-sample.apps.googleusercontent.com';

export const Auth = ({ onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState('STUDENT_GOOGLE');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successUser, setSuccessUser] = useState(null);

  const [adminEmail, setAdminEmail] = useState('nodal.officer@lncte.edu.in');
  const [adminPassword, setAdminPassword] = useState('NodalAdmin@2026!');
  const [institutionId, setInstitutionId] = useState('COL-LNCTE-001');

  // TAB 1: Student Google OAuth 2.0 Handler (Mocked Bypass)
  const handleGoogleSuccess = async (_credentialResponse) => {
    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      const mockUser = {
        id: 'usr_student_002',
        name: 'Pritam Raj Chaurasiya',
        email: 'pritam.raj@student.gov.in',
        role: 'ROLE_STUDENT',
        apaarId: '7841-9023-4412'
      };
      setSuccessUser(mockUser);
      if (onAuthSuccess) {
        onAuthSuccess(mockUser);
      }
      setIsLoading(false);
    }, 300);
  };

  const handleGoogleError = () => {
    setErrorMessage('Google Sign-In popup was closed or encountered an error.');
  };

  // TAB 2: Admin Email/Password Handler (Mocked Bypass)
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      const mockUser = {
        id: 'usr_admin_001',
        name: 'Dr. Alok Verma',
        email: adminEmail,
        role: 'ROLE_INST_NODAL',
        institutionId: institutionId || 'COL-LNCTE-001'
      };
      setSuccessUser(mockUser);
      if (onAuthSuccess) {
        onAuthSuccess(mockUser);
      }
      setIsLoading(false);
    }, 300);
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
          <div>
            <div className="flex justify-center">
              <span className="text-4xl">🏛️</span>
            </div>
            <h2 className="mt-4 text-center text-2xl font-extrabold text-slate-900 tracking-tight">
              Sign in to APAAR-Setu
            </h2>
            <p className="mt-1 text-center text-xs text-slate-500">
              National Academic Verifiable Ledger • Zero-Trust Identity
            </p>
          </div>

          <div className="flex rounded-lg bg-slate-100 p-1">
            <button
              onClick={() => setActiveTab('STUDENT_GOOGLE')}
              className={`flex-1 text-xs font-bold py-2 rounded-md transition-all ${
                activeTab === 'STUDENT_GOOGLE'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Student (Google)
            </button>
            <button
              onClick={() => setActiveTab('ADMIN_PASSWORD')}
              className={`flex-1 text-xs font-bold py-2 rounded-md transition-all ${
                activeTab === 'ADMIN_PASSWORD'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Nodal Admin
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {errorMessage}
            </div>
          )}

          {successUser && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
              Authenticated successfully as <strong>{successUser.name}</strong> ({successUser.role})
            </div>
          )}

          {activeTab === 'STUDENT_GOOGLE' ? (
            <div className="space-y-4 text-center">
              <p className="text-xs text-slate-500">
                Authenticate with verified DigiLocker student identity claims.
              </p>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => handleGoogleSuccess({})}
                  disabled={isLoading}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-sm"
                >
                  {isLoading ? 'Verifying Student Identity...' : 'Sign In as Student (Pritam Raj)'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nodal Officer Email
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-sm"
              >
                {isLoading ? 'Authenticating...' : 'Sign In as Nodal Admin'}
              </button>
            </form>
          )}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Auth;
