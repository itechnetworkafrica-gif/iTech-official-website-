import React from 'react';
import { Logo } from './Logo';

export const FooterBrand: React.FC = () => {
  return (
    <div className="py-12 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-white/10">
      <div className="flex flex-col items-center md:items-start gap-4 max-w-lg text-center md:text-left">
        <Logo />
        <p className="text-[#BDBDBD] text-sm leading-relaxed mt-2">
          Empowering businesses, governments and communities across Africa through innovative technology, AI solutions, enterprise software and digital transformation.
        </p>
      </div>
      <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
        <span className="text-[#BDBDBD] text-sm font-medium uppercase tracking-wider">Powered by</span>
        <span className="text-white text-2xl font-bold tracking-tight">Gotecx</span>
      </div>
    </div>
  );
};
