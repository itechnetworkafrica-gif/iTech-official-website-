import React from 'react';

export const Logo: React.FC<{ className?: string, hideTextOnMobile?: boolean }> = ({ className = "", hideTextOnMobile = false }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Node Icon */}
      <svg 
        width="32" 
        height="32" 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path d="M16 2L2 10V22L16 30L30 22V10L16 2Z" stroke="#007BFF" strokeWidth="2.5" strokeLinejoin="round"/>
        <circle cx="16" cy="16" r="4" fill="#007BFF"/>
        <line x1="16" y1="2" x2="16" y2="12" stroke="#007BFF" strokeWidth="2.5"/>
        <line x1="28" y1="10" x2="19.5" y2="14" stroke="#007BFF" strokeWidth="2.5"/>
        <line x1="4" y1="10" x2="12.5" y2="14" stroke="#007BFF" strokeWidth="2.5"/>
        <line x1="4" y1="22" x2="12.5" y2="18" stroke="#007BFF" strokeWidth="2.5"/>
        <line x1="28" y1="22" x2="19.5" y2="18" stroke="#007BFF" strokeWidth="2.5"/>
        <line x1="16" y1="30" x2="16" y2="20" stroke="#007BFF" strokeWidth="2.5"/>
      </svg>
      {/* Text */}
      <span className={`text-white font-bold text-xl tracking-tight leading-none ${hideTextOnMobile ? 'hidden sm:block' : ''}`}>
        iTech Network <span className="text-[#007BFF]">Africa</span>
      </span>
    </div>
  );
};
