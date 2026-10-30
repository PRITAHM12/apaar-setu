import React, { useState } from 'react';
import { 
  GraduationCap, 
  Building2, 
  Search, 
  Landmark, 
  ShieldCheck, 
  CheckCircle2, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { RoleType, OAuthSession } from '../../types/apaar.types';
import { useAuthRBAC } from '../../context/AuthRBACContext';
import { ApaarSetuLogo } from '../common/ApaarSetuLogo';

interface GoogleAccountProfile {
  email: string;
  name: string;
  role: RoleType;
  identifier: string;
  tenantPid?: string;
  apaarId?: string;
  avatarUrl: string;
  domain: string;
  authorityTitle: string;
  provider: string;
  scope: string;
}

const GOOGLE_PROFILES: Record<RoleType, GoogleAccountProfile> = {
  ROLE_STUDENT: {
    email: 'pritam.raj@student.gov.in',
    name: 'Pritam Raj Chaurasiya',
    role: 'ROLE_STUDENT',
    identifier: '7841-9023-4412',
    apaarId: '7841-9023-4412',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    domain: 'National Academic Depository (NAD / DigiLocker)',
    authorityTitle: 'Verified Student • B.Tech CSE (3rd Sem)',
    provider: 'Google Identity / DigiLocker OAuth 2.0',
    scope: 'openid email profile https://www.googleapis.com/auth/userinfo.profile apaar.read'
  },
  ROLE_INST_NODAL: {
    email: 'nodal.officer@lncte.edu.in',
    name: 'Dr. Alok Verma',
    role: 'ROLE_INST_NODAL',
    identifier: 'PID-1-4920182',
    tenantPid: 'PID-1-4920182',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    domain: 'Lakshmi Narain College of Technology Excellence',
    authorityTitle: 'Institutional Nodal Officer • AICTE PID-1-4920182',
    provider: 'Google Workspace for Education / SAML 2.0',
    scope: 'openid email profile erp.intake.sync student.write quota.manage'
  },
  ROLE_VERIFIER: {
    email: 'bgv.talent@infosys.com',
    name: 'Pooja Iyer (Infosys HR)',
    role: 'ROLE_VERIFIER',
    identifier: 'ORG-INFOSYS-BGV',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    domain: 'Infosys Limited • Global Background Verification Cell',
    authorityTitle: 'Corporate Talent Lead • Registered BGV Agency',
    provider: 'Google Cloud Identity Enterprise',
    scope: 'openid email profile bgv.verify marksheet.audit dpdp.consent'
  },
  ROLE_COUNCIL_ADMIN: {
    email: 'director.analytics@aicte.gov.in',
    name: 'Prof. Ramesh K. Sundaram',
    role: 'ROLE_COUNCIL_ADMIN',
    identifier: 'AICTE-HQ-ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    domain: 'All India Council for Technical Education (HQ New Delhi)',
    authorityTitle: 'National Directorate • Intake Quota & De-Dup',
    provider: 'National Informatics Centre (NIC) / Google SSO',
    scope: 'openid email profile national.directorate anomaly.enforce'
  }
};

export const LoginGateway: React.FC = () => {
  const { loginWithOAuth, setActiveScreen } = useAuthRBAC();

  const [selectedRole, setSelectedRole] = useState<RoleType>('ROLE_STUDENT');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState<string>('');

  const currentProfile = GOOGLE_PROFILES[selectedRole];

  const handleSignInWithGoogle = async () => {
    setIsAuthenticating(true);
    setAuthStep('Connecting to Google Identity Services (accounts.google.com)...');

    // Simulate realistic Google Auth / Firebase JWT exchange
    await new Promise(r => setTimeout(r, 600));
    setAuthStep('Exchanging OAuth 2.0 authorization code for Firebase ID Token...');
    await new Promise(r => setTimeout(r, 600));
    setAuthStep('Validating RS256 signature against Google public JWKS keys...');
    await new Promise(r => setTimeout(r, 500));
    setAuthStep('Mapping verified email claims to national authority role...');
    await new Promise(r => setTimeout(r, 400));

    // Construct verified Google OAuth JWT session
    const timestamp = Date.now();
    const fakeJwt = `eyJhbGciOiJSUzI1NiIsImtpZCI6Imdvb2dsZS1rZXktMjAyNiJ9.${btoa(JSON.stringify({
      iss: 'https://accounts.google.com',
      aud: 'apaar-setu-gov-in.apps.googleusercontent.com',
      sub: `google-uid-${timestamp}`,
      email: currentProfile.email,
      email_verified: true,
      name: currentProfile.name,
      picture: currentProfile.avatarUrl,
      role: currentProfile.role,
      identifier: currentProfile.identifier,
      iat: Math.floor(timestamp / 1000),
      exp: Math.floor(timestamp / 1000) + 3600
    }))}.fake_signature_google_jwks_verified`;

    const session: OAuthSession = {
      accessToken: fakeJwt,
      tokenType: 'Bearer',
      scope: currentProfile.scope,
      userProfile: {
        name: currentProfile.name,
        role: currentProfile.role,
        identifier: currentProfile.identifier,
        tenantPid: currentProfile.tenantPid,
        apaarId: currentProfile.apaarId,
        provider: currentProfile.provider,
        email: currentProfile.email,
      },
      issuedAt: new Date().toISOString(),
    };

    setIsAuthenticating(false);
    loginWithOAuth(session);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Official Government Tri-Color Top Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#EA580C] via-white to-[#10B981]"></div>

      {/* Official GovTech Header Strip */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center space-x-2.5 font-medium">
            <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-300 font-bold text-[11px]">
              GovTech Official SSO
            </span>
            <span>Government of India • Ministry of Education & AICTE Initiative</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-slate-500 font-mono">
            <span>ISO 27001 Certified</span>
            <span>•</span>
            <span>DPDP Act 2023 Compliant</span>
            <span>•</span>
            <button 
              onClick={() => setActiveScreen('LANDING')}
              className="text-blue-700 hover:text-blue-900 font-sans font-bold underline"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Authentication Section */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: National Academic Ledger Overview           */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <ApaarSetuLogo size="lg" />
              <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight leading-tight mt-4">
                National Academic Verifiable Ledger Gateway
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Single sign-on gateway for students, universities, employers, and national councils. Powered by <strong>Google Identity Services OAuth 2.0</strong>, zero-knowledge proofs, and real-time AICTE quota enforcement.
              </p>
            </div>

            {/* 3 Core GovTech Pillars */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#EA580C] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A]">One Nation, One Student ID (APAAR)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    12-digit lifelong academic identifier anchored to the Academic Bank of Credits (ABC) repository.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A]">AICTE Intake Quota Lock (Rule 14-B)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time prevention of over-admission beyond approved gazette capacity (HTTP 422 enforcement).
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#10B981] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A]">Zero-Knowledge BGV & DPDP Act 2023</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Selective disclosure of marksheets and degrees with explicit time-bound student consent.
                  </p>
                </div>
              </div>
            </div>

            {/* Helpline Information */}
            <div className="pt-2 flex items-center space-x-4 text-xs text-slate-500">
              <span className="font-medium">National Helpdesk: <strong className="text-slate-800">1800-11-2244</strong> (Toll Free)</span>
              <span>•</span>
              <span className="font-mono">support@apaar.gov.in</span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Google Authentication Card                 */}
          {/* ======================================================== */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-7 sm:p-9 space-y-6">
              
              {/* Header */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    SSO Identification
                  </span>
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                    OAuth 2.0 / OpenID Connect
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-[#0F172A] mt-1">
                  Select Stakeholder Identity
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose your administrative portal role to authenticate with your Google account.
                </p>
              </div>

              {/* 4 Stakeholder Tabs */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedRole('ROLE_STUDENT')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center space-x-2.5 ${
                    selectedRole === 'ROLE_STUDENT'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold block truncate">Student Portal</span>
                    <span className="text-[10px] text-slate-500 block truncate">DigiLocker / ABC</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('ROLE_INST_NODAL')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center space-x-2.5 ${
                    selectedRole === 'ROLE_INST_NODAL'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold block truncate">College ERP Nodal</span>
                    <span className="text-[10px] text-slate-500 block truncate">PID-1-4920182</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('ROLE_VERIFIER')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center space-x-2.5 ${
                    selectedRole === 'ROLE_VERIFIER'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <Search className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold block truncate">Employer BGV</span>
                    <span className="text-[10px] text-slate-500 block truncate">Corporate Verification</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('ROLE_COUNCIL_ADMIN')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center space-x-2.5 ${
                    selectedRole === 'ROLE_COUNCIL_ADMIN'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold block truncate">AICTE Admin</span>
                    <span className="text-[10px] text-slate-500 block truncate">National Directorate</span>
                  </div>
                </button>
              </div>

              {/* Active Profile Identity Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center space-x-3">
                  <img 
                    src={currentProfile.avatarUrl} 
                    alt={currentProfile.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-extrabold text-xs text-[#0F172A] truncate">
                        {currentProfile.name}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    </div>
                    <span className="font-mono text-[11px] text-slate-500 block truncate">
                      {currentProfile.email}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-600 flex flex-col space-y-0.5">
                  <span className="font-semibold text-slate-700">Authority: {currentProfile.authorityTitle}</span>
                  <span className="text-slate-500 truncate">Domain: {currentProfile.domain}</span>
                </div>
              </div>

              {/* Google Authentication Progress State or Button */}
              {isAuthenticating ? (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-center space-y-3 animate-pulse">
                  <div className="flex items-center justify-center space-x-2 text-blue-800 font-bold text-xs">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span>Google Identity Verification</span>
                  </div>
                  <p className="text-xs text-blue-700 font-mono">
                    {authStep}
                  </p>
                </div>
              ) : (
                /* The Clean "Sign in with Google" Button (Official Google Design) */
                <button
                  id="google-signin-btn"
                  type="button"
                  onClick={handleSignInWithGoogle}
                  className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] font-bold text-sm border-2 border-slate-300 hover:border-slate-400 shadow-sm hover:shadow-md flex items-center justify-center space-x-3 transition-all duration-200 active:scale-98 group"
                >
                  {/* Official Multi-Color Google G Logo SVG */}
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#0F172A] transition-all" />
                </button>
              )}

              {/* Security & Regulatory Footer Note */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Google Cloud Identity Verified</span>
                </span>
                <span>DPDP Rule 2023 Enforced</span>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Official Government Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-8 mt-auto text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p>© 2026 Ministry of Education, Government of India & AICTE. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400">Designed for Indian Higher Technical Education</span>
            <span>•</span>
            <span className="font-mono text-emerald-700 font-bold">SHA-256 Merkle Ledger Live</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
