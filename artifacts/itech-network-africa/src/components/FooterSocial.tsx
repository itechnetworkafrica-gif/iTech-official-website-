import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';

/* ── Custom brand icons ── */
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.02a8.27 8.27 0 0 0 4.83 1.55V7.12a4.85 4.85 0 0 1-1.06-.43z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface SocialItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

/* ── Single magnetic icon button ── */
const SocialLink: React.FC<{ social: SocialItem }> = ({ social }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);

  /* Spring-backed magnetic translate */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 280, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 280, damping: 18, mass: 0.6 });

  /* Cursor spotlight inside the button */
  const [spot, setSpot] = useState({ x: 24, y: 24 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = e.clientX - rect.left - cx;
    const dy = e.clientY - rect.top - cy;
    /* Magnetic pull: 38 % of offset */
    mx.set(dx * 0.38);
    my.set(dy * 0.38);
    setSpot({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    mx.set(0);
    my.set(0);
  };

  return (
    <a
      ref={ref}
      href={social.href}
      aria-label={social.label}
      target={social.href !== '#' ? '_blank' : undefined}
      rel={social.href !== '#' ? 'noopener noreferrer' : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-center w-12 h-12 select-none"
      style={{ willChange: 'transform' }}
    >
      {/* 1 — Outer pulse halo (appears on hover, fades out) */}
      <motion.span
        aria-hidden
        className="absolute inset-[-6px] rounded-full pointer-events-none"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={hovered
          ? { opacity: [0, 0.55, 0], scale: [0.7, 1.55, 1.9] }
          : { opacity: 0, scale: 0.6 }}
        transition={hovered
          ? { duration: 0.65, ease: 'easeOut' }
          : { duration: 0.2 }}
        style={{ background: 'radial-gradient(circle, #3CB52A44 0%, transparent 70%)' }}
      />

      {/* 2 — Filled circle background */}
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full pointer-events-none"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={hovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ type: 'spring', stiffness: 340, damping: 22 }}
        style={{ background: 'linear-gradient(135deg, #2da822 0%, #3CB52A 55%, #50d43e 100%)' }}
      />

      {/* 3 — Cursor spotlight that tracks inside the button */}
      {hovered && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
          style={{
            background: `radial-gradient(circle 20px at ${spot.x}px ${spot.y}px, rgba(255,255,255,0.18) 0%, transparent 75%)`,
          }}
        />
      )}

      {/* 4 — Border ring */}
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full border pointer-events-none"
        initial={{ opacity: 0, scale: 0.75 }}
        animate={hovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.75 }}
        transition={{ type: 'spring', stiffness: 380, damping: 24 }}
        style={{ borderColor: 'rgba(255,255,255,0.35)' }}
      />

      {/* 5 — Outer glow shadow (CSS, always present but transitions) */}
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full pointer-events-none"
        initial={{ opacity: 0 }}
        animate={hovered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.25 }}
        style={{ boxShadow: '0 0 0 4px rgba(60,181,42,0.20), 0 0 22px 6px rgba(60,181,42,0.35)' }}
      />

      {/* 6 — Magnetic icon */}
      <motion.span
        style={{ x: sx, y: sy }}
        className="relative z-10 pointer-events-none"
        animate={{ color: hovered ? '#ffffff' : 'rgba(255,255,255,0.75)' }}
        transition={{ duration: 0.18 }}
      >
        {social.icon}
      </motion.span>
    </a>
  );
};

/* ── Footer social bar ── */
export const FooterSocial: React.FC = () => {
  const socials: SocialItem[] = [
    { icon: <Facebook size={20} />, label: 'Facebook', href: 'https://www.facebook.com/itechnetworkafrica' },
    { icon: <Instagram size={20} />, label: 'Instagram', href: 'https://www.instagram.com/info.itechnetwork?igsh=MXM5eG5xNzRzc2Z0MQ==' },
    { icon: <Linkedin size={20} />, label: 'LinkedIn', href: 'https://www.linkedin.com/company/gotecx-itech-network-africa/' },
    { icon: <TikTokIcon />, label: 'TikTok', href: '#' },
    { icon: <XIcon />, label: 'X (Twitter)', href: '#' },
    { icon: <Youtube size={20} />, label: 'YouTube', href: 'https://youtube.com/@wilmotkerkulah?si=0wpgFcy-NBquNa3w' },
  ];

  return (
    <div className="flex flex-row items-center gap-1">
      {socials.map((social) => (
        <SocialLink key={social.label} social={social} />
      ))}
    </div>
  );
};
