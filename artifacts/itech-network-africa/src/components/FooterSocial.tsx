import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';

/* ── Custom brand icons ── */
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.02a8.27 8.27 0 0 0 4.83 1.55V7.12a4.85 4.85 0 0 1-1.06-.43z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface SocialItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

/* Ripple ring that expands and fades */
const RippleRing: React.FC<{ delay: number }> = ({ delay }) => (
  <motion.span
    aria-hidden
    className="absolute inset-0 rounded-full border-2 pointer-events-none"
    style={{ borderColor: 'rgba(60,181,42,0.7)' }}
    initial={{ scale: 0.85, opacity: 0.8 }}
    animate={{ scale: 2.2, opacity: 0 }}
    transition={{ duration: 0.7, delay, ease: 'easeOut' }}
  />
);

/* ── Single icon button with ripple effect ── */
const SocialLink: React.FC<{ social: SocialItem }> = ({ social }) => {
  const [rippleKey, setRippleKey] = useState(0);
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
    setRippleKey(k => k + 1);
  };

  return (
    <a
      href={social.href}
      aria-label={social.label}
      target={social.href !== '#' ? '_blank' : undefined}
      rel={social.href !== '#' ? 'noopener noreferrer' : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
      className="relative flex items-center justify-center w-14 h-14 select-none"
    >
      {/* Ripple rings on hover */}
      <AnimatePresence>
        {hovered && (
          <>
            <RippleRing key={`${rippleKey}-a`} delay={0} />
            <RippleRing key={`${rippleKey}-b`} delay={0.18} />
          </>
        )}
      </AnimatePresence>

      {/* Filled background circle */}
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full pointer-events-none"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={hovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
        transition={{ type: 'spring', stiffness: 360, damping: 20 }}
        style={{ background: 'linear-gradient(135deg, #2da822 0%, #3CB52A 55%, #50d43e 100%)' }}
      />

      {/* Glow */}
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full pointer-events-none"
        initial={{ opacity: 0 }}
        animate={hovered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.22 }}
        style={{ boxShadow: '0 0 0 3px rgba(60,181,42,0.25), 0 0 20px 8px rgba(60,181,42,0.4)' }}
      />

      {/* Icon — scales up and rotates slightly on hover */}
      <motion.span
        className="relative z-10 pointer-events-none"
        animate={
          hovered
            ? { color: '#ffffff', scale: 1.2, rotate: 10 }
            : { color: 'rgba(255,255,255,0.75)', scale: 1, rotate: 0 }
        }
        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
      >
        {social.icon}
      </motion.span>
    </a>
  );
};

/* ── Footer social bar ── */
export const FooterSocial: React.FC = () => {
  const socials: SocialItem[] = [
    { icon: <Facebook size={24} />, label: 'Facebook', href: 'https://www.facebook.com/itechnetworkafrica' },
    { icon: <Instagram size={24} />, label: 'Instagram', href: 'https://www.instagram.com/info.itechnetwork?igsh=MXM5eG5xNzRzc2Z0MQ==' },
    { icon: <Linkedin size={24} />, label: 'LinkedIn', href: 'https://www.linkedin.com/company/gotecx-itech-network-africa/' },
    { icon: <TikTokIcon />, label: 'TikTok', href: '#' },
    { icon: <XIcon />, label: 'X (Twitter)', href: '#' },
    { icon: <Youtube size={24} />, label: 'YouTube', href: 'https://youtube.com/@wilmotkerkulah?si=0wpgFcy-NBquNa3w' },
  ];

  return (
    <div className="flex flex-row items-center gap-1">
      {socials.map((social) => (
        <SocialLink key={social.label} social={social} />
      ))}
    </div>
  );
};
