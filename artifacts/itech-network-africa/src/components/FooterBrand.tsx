import React from 'react';
import logoNew from '@/assets/logo-new.png';

export const FooterBrand: React.FC = () => {
  return (
    <div>
      <img
        src={logoNew}
        alt="iTech Network Africa"
        className="h-20 max-w-[200px] object-contain"
      />
    </div>
  );
};
