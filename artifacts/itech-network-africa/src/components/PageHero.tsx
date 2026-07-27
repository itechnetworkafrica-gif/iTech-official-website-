import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';

interface PageHeroProps {
  title: string;
  subtitle: string;
  badge: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
}

export const PageHero: React.FC<PageHeroProps> = ({ title, subtitle, badge, ctaPrimary, ctaSecondary }) => {
  return (
    <section className="relative bg-gradient-to-br from-[#0A1929] to-[#1a2f4a] py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#3CB52A]/10 blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#3CB52A]/5 blur-[120px]" />
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block mb-6 px-4 py-1.5 rounded-full bg-[#3CB52A]/20 border border-[#3CB52A]/30 text-[#3CB52A] text-sm font-semibold tracking-wide uppercase"
        >
          {badge}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight max-w-4xl"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-[#BDBDBD] max-w-3xl mx-auto"
        >
          {subtitle}
        </motion.p>
        
        {(ctaPrimary || ctaSecondary) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-10"
          >
            {ctaPrimary && (
              <Link href={ctaPrimary.href} className="px-8 py-3.5 bg-[#3CB52A] text-white font-medium rounded-lg hover:bg-[#2e911f] transition-colors shadow-lg shadow-[#3CB52A]/20">
                {ctaPrimary.label}
              </Link>
            )}
            {ctaSecondary && (
              <Link href={ctaSecondary.href} className="px-8 py-3.5 bg-transparent text-white font-medium rounded-lg border border-white/20 hover:bg-white/10 transition-colors">
                {ctaSecondary.label}
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};
