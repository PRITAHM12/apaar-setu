import React from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  GraduationCap, 
  Building2, 
  Search, 
  Lock, 
  ChevronRight
} from 'lucide-react';
import { useAuthRBAC } from '../../context/AuthRBACContext';
import { ApaarSetuLogo } from '../common/ApaarSetuLogo';

export const LandingPage: React.FC = () => {
  const { setActiveScreen } = useAuthRBAC();

  const handleLaunchGoogleAuth = () => {
    setActiveScreen('SCREEN_OAUTH');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Official Tri-Color Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#EA580C] via-white to-[#10B981]"></div>

      {/* Official Government Top Bar */}
      <div className="bg-white border-b border-slate-200 py-2.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center space-x-2.5 font-medium">
            <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-300 font-bold text-[11px]">
              GovTech Portal
            </span>
            <span>Government of India • Ministry of Education & AICTE Initiative</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-slate-500 font-mono">
            <span>Toll-Free Helpline: 1800-11-2244</span>
            <span>•</span>
            <span>DPDP Act 2023 Compliant</span>
          </div>
        </div>
      </div>

      {/* Public Header / Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <ApaarSetuLogo size="md" />

          <nav className="hidden md:flex items-center space-x-6 text-xs font-bold text-slate-700">
            <a href="#how-it-works" className="hover:text-blue-700 transition-colors">How It Works</a>
            <a href="#architecture" className="hover:text-blue-700 transition-colors">National Ledger Architecture</a>
            <a href="#compliance" className="hover:text-blue-700 transition-colors">AICTE Rule 14-B</a>
          </nav>

          <div className="flex items-center space-x-3">
            <button
              id="landing-signin-btn"
              type="button"
              onClick={handleLaunchGoogleAuth}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] font-bold text-xs border border-slate-300 hover:border-slate-400 shadow-xs hover:shadow-sm transition-all"
            >
              {/* Google G Logo SVG */}
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 1. HERO SECTION: Strictly Pristine White GovTech Aesthetic*/}
      {/* ======================================================== */}
      <section className="bg-white border-b border-slate-200 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          
          {/* Official Trust Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold tracking-wide uppercase">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>National Academic Ledger • Statutory Digital Infrastructure</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tight leading-tight">
            APAAR-Setu: <span className="text-[#EA580C]">National Academic Ledger</span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Unified student identity, real-time AICTE approved intake quota enforcement, and zero-knowledge background verification for India's higher technical education system.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="hero-google-auth-btn"
              type="button"
              onClick={handleLaunchGoogleAuth}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0F172A] hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center space-x-3 transition-all active:scale-98"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign in with Google Account</span>
              <ArrowRight className="w-4 h-4 text-slate-300" />
            </button>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl border-2 border-slate-300 hover:border-slate-800 text-slate-700 hover:text-slate-900 font-bold text-sm bg-white hover:bg-slate-50 transition-all flex items-center justify-center space-x-1.5"
            >
              <span>Explore How It Works</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          {/* 4 Clean GovTech Metric Cards */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">APAAR IDs Linked</span>
              <div className="text-2xl font-black text-[#0F172A] mt-1">3.4M+</div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Nationwide Student Registry</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Institutions Synced</span>
              <div className="text-2xl font-black text-[#0F172A] mt-1">9,412</div>
              <span className="text-[10px] text-slate-500 block mt-0.5">AICTE Approved Technical Colleges</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Intake Quota Lock</span>
              <div className="text-2xl font-black text-blue-700 mt-1">Rule 14-B</div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Automated HTTP 422 Over-Capacity Guard</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Dual-Enrollment Fraud</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">100% Zero</div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Cryptographic Cross-State Guard</span>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. "HOW IT WORKS" SECTION: Strict 3-Pillar Workflow       */}
      {/* ======================================================== */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider">
            Operational Architecture
          </span>
          <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
            How APAAR-Setu Functions Across Stakeholders
          </h2>
          <p className="text-sm text-slate-600">
            A seamless three-step ledger connecting students, colleges, and enterprise background verifiers.
          </p>
        </div>

        {/* 3 Pillar Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1: Student Identity & Credentials */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-black text-lg">
                1
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">
                Student APAAR Linking & ABC Depository
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Every candidate is anchored to their 12-digit lifelong APAAR ID via DigiLocker. Academic Bank of Credits (ABC), semester transcripts, and W3C Dual-ID certificates are verifiable with instant tamper-proof proofs.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-[11px] font-bold text-blue-700 flex items-center space-x-1">
              <GraduationCap className="w-4 h-4" />
              <span>Student Academic Passport</span>
            </div>
          </div>

          {/* Step 2: College ERP & Intake Enforcement */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-lg">
                2
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">
                College ERP Sync & Intake Quota Lock
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Institutional Nodal Officers manage Sanctioned Intake via the Course & Seat Matrix and perform Bulk CSV Uploads. The Automated Validation Engine intercepts admissions exceeding the 60 approved capacity (HTTP 422).
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-[11px] font-bold text-indigo-700 flex items-center space-x-1">
              <Building2 className="w-4 h-4" />
              <span>Institutional Nodal Hub</span>
            </div>
          </div>

          {/* Step 3: Employer BGV & Forensics */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-lg">
                3
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">
                Employer BGV & Zero-Knowledge Verification
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Corporate verifiers query candidate APAAR numbers with time-bound DPDP consent tokens. Validated degrees and marksheets are retrieved in under 150ms while maintaining an immutable audit trail.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-[11px] font-bold text-emerald-700 flex items-center space-x-1">
              <Search className="w-4 h-4" />
              <span>Employer BGV Suite</span>
            </div>
          </div>

        </div>

        {/* Regulatory Governance Banner */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6 text-slate-700" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0F172A]">AICTE Section 10(k) & Gazette Order Compliance</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Technical institutions are strictly prohibited from exceeding sanctioned capacity without formal council approval.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLaunchGoogleAuth}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-xs"
          >
            <span>Access Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. CLEAN FOOTER: Official GovTech Information             */}
      {/* ======================================================== */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-3">
              <ApaarSetuLogo size="md" />
              <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                National Academic Verifiable Ledger Gateway under the aegis of the Ministry of Education and All India Council for Technical Education (AICTE), Government of India.
              </p>
              <div className="text-[11px] text-slate-400 font-mono">
                Platform Version: 2.4.0 • ISO 27001 Certified • SHA-256 Merkle Ok
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#0F172A] uppercase tracking-wider text-[11px]">Government Initiatives</h4>
              <ul className="space-y-1.5 text-slate-500">
                <li>Academic Bank of Credits (ABC)</li>
                <li>DigiLocker National Depository</li>
                <li>National Educational Alliance (NEAT)</li>
                <li>AICTE Approval Process Handbook</li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#0F172A] uppercase tracking-wider text-[11px]">Security & Compliance</h4>
              <ul className="space-y-1.5 text-slate-500">
                <li>Digital Personal Data Protection Act 2023</li>
                <li>Rule 14-B Quota Enforcement Engine</li>
                <li>Zero-Knowledge Proofs & Merkle Tree</li>
                <li>Toll Free: 1800-11-2244</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <p>© 2026 Ministry of Education, Government of India & AICTE. All rights reserved.</p>
            <p className="font-medium text-slate-600">National Informatics Centre (NIC) Secured</p>
          </div>
        </div>
      </footer>

    </div>
  );
};
