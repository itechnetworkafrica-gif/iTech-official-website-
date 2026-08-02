import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { FloatingParticles } from '@/components/FloatingParticles';

interface PageHeroProps {
  title: string;
  subtitle: string;
  badge: string;
  bgImage?: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
}

/* Cycle through these for variety across pages */
const BG_IMAGES = [
  '/hero-event-audience.jpg',
  '/hero-woman-vr.jpg',
  '/hero-group-excited.jpg',
  '/hero-man-denim.jpg',
];

let bgIndex = 0;
function nextBg() {
  const img = BG_IMAGES[bgIndex % BG_IMAGES.length];
  bgIndex++;
  return img;
}

export const PageHero: React.FC<PageHeroProps> = ({
  title,
  subtitle,
  badge,
  bgImage,
  ctaPrimary,
  ctaSecondary,
}) => {
  const [bg] = React.useState(() => bgImage ?? nextBg());

  return (
    <section className="relative bg-[#060E18] py-24 lg:py-32 overflow-hidden">
      {/* Dark background image */}
      <img
        src={bg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ opacity: 0.35 }}
      />

      {/* Dark overlay — heavier on left for text legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(6,14,24,0.97) 0%, rgba(6,14,24,0.88) 50%, rgba(6,14,24,0.70) 100%), linear-gradient(to bottom, rgba(6,14,24,0.20) 0%, rgba(6,14,24,0.60) 100%)',
        }}
      />

      {/* Animated dot grid overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(60,181,42,0.12) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          maskImage:
            'linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%)',
        }}
      />

      {/* Animated scan line */}
      <motion.div
        aria-hidden="true"
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(60,181,42,0.5), transparent)',
        }}
        animate={{ y: [-40, 800] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
      />

      {/* Floating particles */}
      <FloatingParticles count={22} color="#3CB52A" />

      {/* Ambient glow orbs */}
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 500,
          height: 500,
          right: '-80px',
          top: '-120px',
          background:
            'radial-gradient(circle, rgba(60,181,42,0.10) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 300,
          height: 300,
          left: '40%',
          bottom: '-60px',
          background:
            'radial-gradient(circle, rgba(60,181,42,0.08) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{ scale: [1, 1.18, 1], x: [0, 20, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-[#3CB52A]/15 border border-[#3CB52A]/30"
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-[#3CB52A]"
              animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">{badge}</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black italic text-white leading-tight mb-5 tracking-tight"
            dangerouslySetInnerHTML={{ __html: title }}
          />

          {/* Animated underline accent */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="h-[3px] w-24 mb-5 rounded-full"
            aria-hidden="true"
            style={{
              background: 'linear-gradient(to right, #3CB52A, rgba(60,181,42,0))',
              boxShadow: '0 0 12px 2px rgba(60,181,42,0.4)',
              transformOrigin: 'left center',
            }}
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="text-white/65 text-lg md:text-xl leading-relaxed max-w-2xl"
          >
            {subtitle}
          </motion.p>

          {/* CTAs */}
          {(ctaPrimary || ctaSecondary) && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28 }}
              className="flex flex-wrap items-center gap-4 mt-10"
            >
              {ctaPrimary && (
                <Link
                  href={ctaPrimary.href}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#3CB52A] hover:bg-[#2da822] text-white font-bold rounded-full transition-all shadow-[0_8px_24px_rgba(60,181,42,0.40)] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(60,181,42,0.55)]"
                >
                  {ctaPrimary.label} <ArrowRight size={16} />
                </Link>
              )}
              {ctaSecondary && (
                <Link
                  href={ctaSecondary.href}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-transparent text-white font-bold rounded-full border border-white/25 hover:border-white/50 hover:bg-white/5 transition-all"
                >
                  {ctaSecondary.label}
                </Link>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(6,14,24,0.6))',
        }}
      />
    </section>
  );
};
