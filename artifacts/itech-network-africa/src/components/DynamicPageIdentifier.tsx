import React from 'react';
import { useLocation } from 'wouter';
import { Logo } from './Logo';
import { AnimatePresence, motion } from 'framer-motion';

const getPageName = (path: string): string => {
  if (path === '/') return 'Home';
  const segment = path.split('/')[1];
  if (!segment) return 'Home';
  
  // Capitalize and format
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const DynamicPageIdentifier: React.FC = () => {
  const [location] = useLocation();
  const pageName = getPageName(location);

  return (
    <div className="bg-[#111111] px-6 lg:px-12 py-8 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <Logo />
        <div className="h-6 w-px bg-white/20 hidden md:block"></div>
        <AnimatePresence mode="wait">
          <motion.h2 
            key={pageName}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="text-white text-3xl font-bold tracking-tight text-center md:text-right"
          >
            {pageName}
          </motion.h2>
        </AnimatePresence>
      </div>
    </div>
  );
};
