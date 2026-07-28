import React from 'react';
import { Facebook, Instagram, Youtube } from 'lucide-react';

/* TikTok & X don't exist in lucide-react — using inline SVGs */
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.02a8.27 8.27 0 0 0 4.83 1.55V7.12a4.85 4.85 0 0 1-1.06-.43z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const FooterSocial: React.FC = () => {
  const socials = [
    { icon: <Facebook size={22} />, label: 'Facebook', href: '#' },
    { icon: <Instagram size={22} />, label: 'Instagram', href: '#' },
    { icon: <TikTokIcon />, label: 'TikTok', href: '#' },
    { icon: <XIcon />, label: 'X (Twitter)', href: '#' },
    { icon: <Youtube size={22} />, label: 'YouTube', href: '#' },
  ];

  return (
    <div className="flex items-center gap-6 py-6">
      {socials.map((social) => (
        <a
          key={social.label}
          href={social.href}
          aria-label={social.label}
          className="text-white/70 hover:text-white transition-colors duration-200"
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
};
