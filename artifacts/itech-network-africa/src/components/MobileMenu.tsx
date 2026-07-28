import React, { useState, useEffect } from 'react';
import { X, Plus, ExternalLink } from 'lucide-react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { navigationData } from './NavigationData';
import wordmarkLogo from '@/assets/logo-wordmark.png';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(prev => (prev === id ? null : id));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 left-0 h-full w-[88vw] max-w-[420px] bg-[#0D0D0D] z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <Link href="/" onClick={onClose}>
                <img src={wordmarkLogo} alt="iTech Network Africa" className="h-8 object-contain" />
              </Link>
              <button
                onClick={onClose}
                className="text-[#BDBDBD] hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Nav items */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden py-2">
              {navigationData.map((item) => {
                /* Services: use categories for grouping if available */
                const isServices = !!item.categories;
                const isOpen = openAccordion === item.id;

                return (
                  <div key={item.id} className="border-b border-white/5 last:border-0">
                    <button
                      onClick={() => toggleAccordion(item.id)}
                      className="w-full flex items-center justify-between py-4 px-6 transition-colors hover:bg-white/5 group"
                    >
                      <span className={`font-semibold text-sm transition-colors ${isOpen ? 'text-[#3CB52A]' : 'text-white/90 group-hover:text-white'}`}>
                        {item.label}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                        className={`transition-colors ${isOpen ? 'text-[#3CB52A]' : 'text-white/40 group-hover:text-white/70'}`}
                      >
                        <Plus size={18} />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: 'easeInOut' }}
                          className="overflow-hidden bg-white/[0.02]"
                        >
                          {isServices && item.categories ? (
                            /* Services: grouped by category */
                            <div className="pb-4 pt-2 px-6 space-y-4">
                              {item.categories.map((cat, ci) => (
                                <div key={ci}>
                                  <Link
                                    href={cat.href}
                                    onClick={onClose}
                                    className="block text-[11px] font-bold text-[#3CB52A] tracking-widest uppercase mb-2"
                                  >
                                    {cat.title}
                                  </Link>
                                  <ul className="space-y-1 pl-3 border-l border-white/10">
                                    {cat.items.map((sub, si) => (
                                      <li key={si}>
                                        <Link
                                          href={sub.href}
                                          onClick={onClose}
                                          className="block py-1.5 text-[13px] text-white/50 hover:text-white transition-colors"
                                        >
                                          {sub.label}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          ) : (
                            /* All other items: flat list */
                            <ul className="pb-3 pt-1 pl-6 pr-4 space-y-0.5">
                              {item.children.map((child, idx) => (
                                <li key={idx}>
                                  <Link
                                    href={child.href}
                                    onClick={onClose}
                                    className="block py-2.5 px-3 text-[13px] text-white/55 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                  >
                                    {child.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Footer CTA */}
            <div className="p-6 border-t border-white/10 bg-[#111111] space-y-3">
              <Link
                href="/contact"
                onClick={onClose}
                className="w-full bg-[#3CB52A] text-white py-3 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2 hover:bg-[#2da822] transition-colors shadow-lg shadow-[#3CB52A]/20"
              >
                Request a Quote
              </Link>
              <Link
                href="/portal"
                onClick={onClose}
                className="w-full bg-white/5 text-white/70 py-3 rounded-xl font-medium text-sm text-center flex items-center justify-center gap-2 hover:bg-white/10 transition-colors border border-white/10"
              >
                <ExternalLink size={14} /> Client Portal
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
