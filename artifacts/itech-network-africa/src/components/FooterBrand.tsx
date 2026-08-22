import React from 'react';
import logoWordmark from '@/assets/logo-wordmark.webp';

export const FooterBrand: React.FC = () => {
  return (
    <div>
      <img
        src={logoWordmark}
        alt="iTech Network Africa"
        className="h-20 max-w-[200px] object-contain"
      />
    </div>
  );
};
