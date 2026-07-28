import React from 'react';
import wordmarkLogo from '@assets/BackgroundEraser_20260727_193334961_1785181085959.png';

export const FooterBrand: React.FC = () => {
  return (
    <div className="pt-10 pb-6">
      <img
        src={wordmarkLogo}
        alt="iTech Network Africa"
        className="h-24 object-contain"
      />
    </div>
  );
};
