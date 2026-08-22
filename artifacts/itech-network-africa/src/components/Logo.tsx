import React from 'react';
import iconLogo from '@/assets/logo-icon-color.png';
import iconLogoWhite from '@/assets/logo-icon-white.png';
import wordmarkLogo from '@/assets/logo-wordmark.png';

interface LogoProps {
  className?: string;
  /** 'full' = icon + wordmark, 'icon' = icon only, 'wordmark' = wordmark only */
  variant?: 'full' | 'icon' | 'wordmark';
  size?: 'sm' | 'md' | 'lg';
  /** Use the all-white icon instead of the coloured one */
  white?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
  white = false,
}) => {
  const iconSize = size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-14 w-14' : 'h-10 w-10';
  const wordmarkHeight = size === 'sm' ? 'h-5' : size === 'lg' ? 'h-10' : 'h-7';
  const icon = white ? iconLogoWhite : iconLogo;

  return (
    <div className={`flex items-center gap-3 shrink-0 ${className}`}>
      {(variant === 'full' || variant === 'icon') && (
        <img
          src={icon}
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
