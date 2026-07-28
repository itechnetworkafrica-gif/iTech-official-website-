import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';

interface PageHeroProps {
  title: string;
  subtitle: string;
  badge: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
}

export const PageHero: React.FC<PageHeroProps> = ({ title, subtitle, badge, ctaPrimary, ctaSecondary }) => {
  return (
    <section className="relative bg-[#060E18] py-20 lg:py-28 overflow-hidden">
      {/* Subtle green glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-[#3CB52A]/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-[#3CB52A]/5 rounded-full blur-[120px] pointer-events-none" />

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
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-5 tracking-tight"
            dangerouslySetInnerHTML={{ __html: title }}
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="text-white/60 text-lg md:text-xl leading-relaxed max-w-2xl"
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
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#3CB52A] hover:bg-[#2da822] text-white font-bold rounded-xl transition-all shadow-[0_8px_24px_rgba(60,181,42,0.35)] hover:-translate-y-0.5"
                >
                  {ctaPrimary.label} <ArrowRight size={16} />
                </Link>
              )}
              {ctaSecondary && (
                <Link
                  href={ctaSecondary.href}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-transparent text-white font-bold rounded-xl border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all"
                >
                  {ctaSecondary.label}
                </Link>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom border line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3CB52A]/30 to-transparent" />
    </section>
  );
};
