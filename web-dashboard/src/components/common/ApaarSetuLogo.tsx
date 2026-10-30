import React from 'react';

interface ApaarSetuLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const ApaarSetuLogo: React.FC<ApaarSetuLogoProps> = ({ 
  className = '', 
  size = 'md',
  showSubtitle = true 
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Official GovTech SVG Emblem: Setu Bridge Arch + Academic Shield */}
      <div className={`${iconSizes[size]} flex-shrink-0 relative flex items-center justify-center`}>
        <svg 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          {/* Sovereign Navy Shield Background */}
          <path 
            d="M24 4L7 10V22C7 32.5 14.2 42.2 24 44C33.8 42.2 41 32.5 41 22V10L24 4Z" 
            fill="#0F172A" 
            stroke="#1E293B" 
            strokeWidth="1.5"
          />
          
          {/* Saffron/Orange Setu Bridge Arch representing the National Ledger Bridge */}
          <path 
            d="M13 27C13 21 18 16 24 16C30 16 35 21 35 27" 
            stroke="#EA580C" 
            strokeWidth="3" 
            strokeLinecap="round"
          />
          
          {/* Trust Emerald Academic Pillar & Keystone */}
          <path 
            d="M24 11L15 15.5L24 20L33 15.5L24 11Z" 
            fill="#10B981" 
          />
          <path 
            d="M24 20V29" 
            stroke="#10B981" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
          
          {/* Tri-color Base Foundation Accent */}
          <circle cx="18" cy="28" r="2" fill="#EA580C" />
          <circle cx="24" cy="30" r="2.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1" />
          <circle cx="30" cy="28" r="2" fill="#10B981" />
        </svg>
      </div>

      {/* Official Typography */}
      <div className="flex flex-col text-left leading-tight">
        <div className="flex items-center space-x-2">
          <span className={`font-black ${textSizes[size]} tracking-tight text-[#0F172A]`}>
            APAAR<span className="text-[#EA580C]">-Setu</span>
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-orange-50 text-[#EA580C] border border-orange-200 px-1.5 py-0.5 rounded">
            National Ledger
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[11px] font-semibold text-slate-500 tracking-tight">
            Ministry of Education & AICTE Initiative
          </span>
        )}
      </div>
    </div>
  );
};
