import React from 'react';
import wordmarkLogo from '@assets/BackgroundEraser_20260727_193334961_1785198538356.png';

export const FooterBrand: React.FC = () => {
  return (
    <div className="pt-10 pb-6">
      <img
        src={wordmarkLogo}
        alt="iTech Network Africa"
        className="h-28 object-contain"
      />
    </div>
  );
};
