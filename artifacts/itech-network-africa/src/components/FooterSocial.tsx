import React, { useState } from 'react';
import { Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.02a8.27 8.27 0 0 0 4.83 1.55V7.12a4.85 4.85 0 0 1-1.06-.43z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface SocialItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const SocialLink: React.FC<{ social: SocialItem }> = ({ social }) => {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => setPos(null);

  return (
    <a
      key={social.label}
      href={social.href}
      aria-label={social.label}
      target={social.href !== '#' ? '_blank' : undefined}
      rel={social.href !== '#' ? 'noopener noreferrer' : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-110"
      style={{
        color: pos ? '#3CB52A' : 'white',
        filter: pos
          ? 'drop-shadow(0 0 8px #3CB52A) drop-shadow(0 0 18px #3CB52Aaa)'
          : 'none',
        transition: 'color 0.2s ease, filter 0.2s ease, transform 0.2s ease',
      }}
    >
      {/* Radial green spotlight that follows the cursor */}
      {pos && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            inset: '-8px',
            borderRadius: '50%',
            background: `radial-gradient(circle 28px at ${pos.x + 8}px ${pos.y + 8}px, #3CB52A33 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
      )}
      {social.icon}
    </a>
  );
};

export const FooterSocial: React.FC = () => {
  const socials: SocialItem[] = [
    { icon: <Facebook size={36} />, label: 'Facebook', href: 'https://www.facebook.com/itechnetworkafrica' },
    { icon: <Instagram size={36} />, label: 'Instagram', href: 'https://www.instagram.com/info.itechnetwork?igsh=MXM5eG5xNzRzc2Z0MQ==' },
    { icon: <Linkedin size={36} />, label: 'LinkedIn', href: 'https://www.linkedin.com/company/gotecx-itech-network-africa/' },
    { icon: <TikTokIcon />, label: 'TikTok', href: '#' },
    { icon: <XIcon />, label: 'X (Twitter)', href: '#' },
    { icon: <Youtube size={36} />, label: 'YouTube', href: 'https://youtube.com/@wilmotkerkulah?si=0wpgFcy-NBquNa3w' },
  ];

  return (
    <div className="flex flex-row items-center gap-3 flex-wrap sm:flex-nowrap">
      {socials.map((social) => (
        <SocialLink key={social.label} social={social} />
      ))}
    </div>
  );
};
