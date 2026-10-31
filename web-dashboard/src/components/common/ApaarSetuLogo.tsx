import React from 'react';
import logoImg from '../../assets/apaar-setu-logo.jpg';

interface ApaarSetuLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const ApaarSetuLogo: React.FC<ApaarSetuLogoProps> = ({ 
  className = '', 
  size = 'md',
  showSubtitle = true 
}) => {
  const iconSizes = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-3.5 ${className}`}>
      {/* Official Sovereign Government Insignia Image */}
      <div className={`${iconSizes[size]} flex-shrink-0 relative flex items-center justify-center rounded-2xl overflow-hidden shadow-xs border border-amber-200/80 bg-[#FFFDF8] p-0.5`}>
        <img 
          src={logoImg} 
          alt="APAAR-SETU National Logo" 
          className="w-full h-full object-contain"
        />
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
