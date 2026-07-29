import React from 'react';
import logoNew from '@/assets/logo-new.png';

export const FooterBrand: React.FC = () => {
  return (
    <div className="pt-10 pb-6">
      <img
        src={logoNew}
        alt="iTech Network Africa"
        className="h-20 object-contain"
      />
    </div>
  );
};
