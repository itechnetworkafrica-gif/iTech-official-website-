import React from 'react';
import iconLogo from '@assets/BackgroundEraser_20260727_193353873_1785181085865.png';
import wordmarkLogo from '@assets/BackgroundEraser_20260727_193334961_1785181085959.png';

interface LogoProps {
  className?: string;
  /** 'full' = icon + wordmark, 'icon' = icon only, 'wordmark' = wordmark only */
  variant?: 'full' | 'icon' | 'wordmark';
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
}) => {
  const iconSize = size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-14 w-14' : 'h-10 w-10';
  const wordmarkHeight = size === 'sm' ? 'h-5' : size === 'lg' ? 'h-10' : 'h-7';

  return (
    <div className={`flex items-center gap-3 shrink-0 ${className}`}>
      {(variant === 'full' || variant === 'icon') && (
        <img
          src={iconLogo}
          alt="iTech Network Africa icon"
          className={`${iconSize} object-contain shrink-0`}
        />
      )}
      {(variant === 'full' || variant === 'wordmark') && (
        <img
          src={wordmarkLogo}
          alt="iTech Network Africa"
          className={`${wordmarkHeight} object-contain shrink-0`}
        />
      )}
    </div>
  );
};
