import React from 'react';
import { useLocation } from 'wouter';
import { ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import iconLogo from '@assets/BackgroundEraser_20260727_193353873_1785181085865.png';

const routeNames: Record<string, string> = {
  '/': 'Home',
  '/about': 'About Us',
  '/services': 'Services',
  '/ai-solutions': 'AI Solutions',
  '/solutions': 'Solutions',
  '/products': 'Products',
  '/portfolio': 'Portfolio',
  '/projects': 'Projects',
  '/industries': 'Industries',
  '/partners': 'Partners',
  '/resources': 'Resources',
  '/blog': 'Blog',
  '/careers': 'Careers',
  '/support': 'Support',
  '/contact': 'Contact',
  '/pricing': 'Pricing',
  '/privacy-policy': 'Privacy Policy',
  '/terms': 'Terms & Conditions',
  '/cookies': 'Cookies Policy',
};

export const DynamicPageIdentifier: React.FC = () => {
  const [location] = useLocation();
  const pageName = routeNames[location] ?? location.split('/').pop()?.replace(/-/g, ' ') ?? 'Home';

  return (
    <div className="bg-[#111111] border-b border-white/10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-5 flex items-center gap-2">
        <img
          src={iconLogo}
          alt="iTech Network Africa"
          className="h-9 w-9 object-contain shrink-0"
        />
        <ChevronRight size={16} className="text-white/50 shrink-0" />
        <AnimatePresence mode="wait">
          <motion.span
            key={pageName}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 4 }}
            transition={{ duration: 0.18 }}
            className="text-white text-base font-medium"
          >
            {pageName}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};
