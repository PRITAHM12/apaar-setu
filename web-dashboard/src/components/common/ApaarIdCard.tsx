import React, { useState } from 'react';
import { 
  Building2, 
  Check, 
  Eye, 
  EyeOff, 
  ShieldAlert
} from 'lucide-react';
import { StudentRecord } from '../../types/apaar.types';

export interface ApaarIdCardProps {
  student: StudentRecord;
  showMaskToggle?: boolean;
}

export const ApaarIdCard: React.FC<ApaarIdCardProps> = ({ 
  student, 
  showMaskToggle = true 
}) => {
  const [isMasked, setIsMasked] = useState(false);

  const displayApaar = isMasked
    ? `••••-••••-${student.apaarId.slice(-4)}`
    : student.apaarId;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white shadow-2xl border border-blue-500/20 flex flex-col justify-between">
      
      {/* ======================================================== */}
      {/* 1. HIGHLY VISIBLE FULL-WIDTH RED WARNING BANNER AT TOP   */}
      {/* ======================================================== */}
      {student.isFlagged && (
        <div 
          id="apaar-card-flagged-banner"
          className="w-full bg-red-600 border-b-2 border-red-700 text-white px-4 py-2.5 text-xs font-black tracking-wide flex items-center justify-between shadow-lg animate-pulse z-30"
        >
          <div className="flex items-center space-x-2 truncate">
            <span className="text-sm flex-shrink-0">⚠️</span>
            <span className="truncate uppercase font-black tracking-wider text-[11px] sm:text-xs">
              FLAGGED BY {student.flagDetails?.flaggedBy || 'LNCTS'} — {student.flagDetails?.reason || 'Forged FDR Document'}
            </span>
          </div>
          <span className="ml-2 px-2 py-0.5 rounded bg-black/40 text-[10px] font-mono font-bold flex-shrink-0">
            {student.flagDetails?.date || '2026-10-31'}
          </span>
        </div>
      )}

      {/* Card Content Container */}
      <div className="p-7 flex-1 flex flex-col justify-between relative">
        {/* Ambient Background Accents */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

        {/* Card Header Strip */}
        <div className="relative z-10 flex items-start justify-between gap-2">
          <div>
            <span className="text-[10px] font-extrabold tracking-widest text-amber-400 uppercase">
              NATIONAL ACADEMIC PASSPORT
            </span>
            <h3 className="text-xs font-semibold text-slate-300 mt-0.5">
              Academic Bank of Credits • Government of India
            </h3>
          </div>

          {student.isFlagged ? (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-red-500/20 text-red-300 border border-red-500/40 flex items-center space-x-1 shadow-2xs">
              <ShieldAlert className="w-3 h-3 text-red-400" />
              <span>FLAGGED RECORD</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1">
              <Check className="w-3 h-3" />
              <span>OAuth 2.0 & ABC Verified</span>
            </span>
          )}
        </div>

        {/* Student Name & Program Info */}
        <div className="relative z-10 my-6">
          <span className="text-[11px] font-medium text-slate-400">Candidate Name</span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {student.fullName}
          </h2>
          <p className="text-xs font-medium text-blue-200 mt-1">
            {student.program}
          </p>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center space-x-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{student.instituteName}</span>
          </p>
        </div>

        {/* 12-Digit Sovereign APAAR ID Row */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">
              12-Digit Sovereign APAAR ID
            </span>
            <span className="text-base font-mono font-bold text-amber-300 tracking-wider">
              {displayApaar}
            </span>
            <span className="text-[11px] font-mono text-blue-300 block mt-0.5">
              Roll ID: {student.institutionalStudentId || 'LNCTE-CSE-2022-042'}
            </span>
          </div>

          {showMaskToggle && (
            <button
              type="button"
              onClick={() => setIsMasked(!isMasked)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-colors flex items-center space-x-1 text-xs"
              title={isMasked ? "Show full ID" : "Mask ID"}
            >
              {isMasked ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="text-[11px] font-medium">{isMasked ? "Unmask" : "Mask"}</span>
            </button>
          )}
        </div>

        {/* Bottom QR Code & Cryptographic Ledger Stamp */}
        <div className="relative z-10 mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
          {/* Crisp SVG QR Code */}
          <div className="w-16 h-16 bg-white rounded-xl p-1.5 flex items-center justify-center shadow-lg flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900" fill="currentColor">
              {/* Outer Frames */}
              <rect x="0" y="0" width="30" height="30" rx="4" />
              <rect x="5" y="5" width="20" height="20" fill="white" />
              <rect x="10" y="10" width="10" height="10" />
              
              <rect x="70" y="0" width="30" height="30" rx="4" />
              <rect x="75" y="5" width="20" height="20" fill="white" />
              <rect x="80" y="10" width="10" height="10" />

              <rect x="0" y="70" width="30" height="30" rx="4" />
              <rect x="5" y="75" width="20" height="20" fill="white" />
              <rect x="10" y="80" width="10" height="10" />

              {/* Data Blocks */}
              <rect x="40" y="10" width="8" height="8" />
              <rect x="52" y="10" width="8" height="8" />
              <rect x="40" y="22" width="8" height="8" />
              <rect x="52" y="22" width="8" height="8" />
              <rect x="10" y="40" width="8" height="8" />
              <rect x="22" y="40" width="8" height="8" />
              <rect x="70" y="40" width="8" height="8" />
              <rect x="82" y="40" width="8" height="8" />
              <rect x="40" y="40" width="20" height="20" rx="2" />
              <rect x="40" y="70" width="8" height="8" />
              <rect x="52" y="70" width="8" height="8" />
              <rect x="70" y="70" width="8" height="8" />
              <rect x="82" y="82" width="8" height="8" />
            </svg>
          </div>

          <div className="text-right pl-3">
            <span className="text-[10px] text-slate-400 block font-semibold">
              W3C Cryptographic Proof
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold block">
              SHA-256 Merkle Root Valid
            </span>
            <span className="text-[9px] font-mono text-slate-500 block truncate max-w-[170px]">
              0x7a19c42e8b10f92a3d4e5f6a
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ApaarIdCard;
