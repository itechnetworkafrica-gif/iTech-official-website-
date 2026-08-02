import React from 'react';
import { Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';

/* ── Custom brand icons ── */
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.02a8.27 8.27 0 0 0 4.83 1.55V7.12a4.85 4.85 0 0 1-1.06-.43z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface SocialItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

/* ── Footer social bar ── */
export const FooterSocial: React.FC = () => {
  const socials: SocialItem[] = [
    { icon: <Facebook size={28} />, label: 'Facebook', href: 'https://www.facebook.com/itechnetworkafrica' },
    { icon: <Instagram size={28} />, label: 'Instagram', href: 'https://www.instagram.com/info.itechnetwork?igsh=MXM5eG5xNzRzc2Z0MQ==' },
    { icon: <Linkedin size={28} />, label: 'LinkedIn', href: 'https://www.linkedin.com/company/gotecx-itech-network-africa/' },
    { icon: <TikTokIcon />, label: 'TikTok', href: '#' },
    { icon: <XIcon />, label: 'X (Twitter)', href: '#' },
    { icon: <Youtube size={28} />, label: 'YouTube', href: 'https://youtube.com/@wilmotkerkulah?si=0wpgFcy-NBquNa3w' },
  ];

  return (
    <div className="flex flex-row items-center gap-3">
      {socials.map((social) => (
        <a
          key={social.label}
          href={social.href}
          aria-label={social.label}
          target={social.href !== '#' ? '_blank' : undefined}
          rel={social.href !== '#' ? 'noopener noreferrer' : undefined}
          className="text-white/70 hover:text-white transition-colors duration-200"
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
};
