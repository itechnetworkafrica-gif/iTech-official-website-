import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { navigationData } from './NavigationData';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // Close with escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(prev => (prev === id ? null : id));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 left-0 h-full w-[85vw] max-w-[400px] bg-[#111111] z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <span className="text-white font-bold text-lg uppercase tracking-widest">Navigation</span>
              <button 
                onClick={onClose}
                className="text-[#BDBDBD] hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Accordion List */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-1">
              {navigationData.map((item) => (
                <div key={item.id} className="border-b border-white/5 last:border-0">
                  <button
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full flex items-center justify-between py-5 px-4 rounded-lg transition-colors hover:bg-white/5 group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl" aria-hidden="true">{item.emoji}</span>
                      <span className={`font-medium transition-colors ${openAccordion === item.id ? 'text-[#3CB52A]' : 'text-white group-hover:text-white'}`}>
                        {item.label}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: openAccordion === item.id ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className={`transition-colors ${openAccordion === item.id ? 'text-[#3CB52A]' : 'text-[#BDBDBD] group-hover:text-white'}`}
                    >
                      <Plus size={20} />
                    </motion.div>
                  </button>

                  {/* Sub-items */}
                  <AnimatePresence>
                    {openAccordion === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <ul className="pb-4 pt-1 pl-[52px] pr-4 space-y-1">
                          {item.children.map((subItem, idx) => (
                            <li key={idx}>
                              <Link 
                                href={item.href}
                                onClick={onClose}
                                className="block py-[10px] px-3 text-[14px] text-[#BDBDBD] hover:text-[#3CB52A] hover:bg-white/5 rounded-md transition-all duration-200"
                              >
                                {subItem}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
            
            {/* Quick Actions Footer */}
            <div className="p-6 border-t border-white/10 bg-[#1A1A1A]">
              <Link href="/contact" onClick={onClose} className="w-full bg-[#3CB52A] text-white py-3 rounded-lg font-medium text-center flex items-center justify-center gap-2 hover:bg-[#2fa022] transition-colors shadow-lg shadow-[#3CB52A]/20">
                Contact Support
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
