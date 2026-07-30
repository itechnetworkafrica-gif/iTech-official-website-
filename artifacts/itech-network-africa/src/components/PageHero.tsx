import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';

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

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-[#3CB52A]/15 border border-[#3CB52A]/30"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#3CB52A] animate-pulse" />
            <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">{badge}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black italic text-white leading-tight mb-5 tracking-tight"
            dangerouslySetInnerHTML={{ __html: title }}
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="text-white/65 text-lg md:text-xl leading-relaxed max-w-2xl"
          >
            {subtitle}
          </motion.p>

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
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#3CB52A] hover:bg-[#2da822] text-white font-bold rounded-full transition-all shadow-[0_8px_24px_rgba(60,181,42,0.40)] hover:-translate-y-0.5"
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
    </section>
  );
};
