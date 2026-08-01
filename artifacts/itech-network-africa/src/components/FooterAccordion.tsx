import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Link } from 'wouter';

interface FooterLink {
  label: string;
  href: string;
  isNew?: boolean;
}

interface FooterAccordionProps {
  sections: {
    title: string;
    isNew?: boolean;
    links: FooterLink[];
  }[];
}

export const FooterAccordion: React.FC<FooterAccordionProps> = ({ sections }) => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <div className="w-full">
      {/* Desktop: 3-column grid */}
      <div className="hidden lg:grid grid-cols-4 gap-x-10 gap-y-10">
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              {section.title}
              {section.isNew && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#3CB52A] text-white tracking-wide uppercase leading-none">NEW</span>
              )}
            </h3>
            <ul className="space-y-3">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                    {link.isNew && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#3CB52A] text-white tracking-wide uppercase leading-none">NEW</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Mobile/Tablet: accordion */}
      <div className="lg:hidden">
        {sections.map((section) => (
          <div key={section.title} className="border-b border-white/10 last:border-0">
            <button
              onClick={() => setOpenSection(openSection === section.title ? null : section.title)}
              className="w-full flex justify-between items-center py-5 text-left"
            >
              <span className="text-white font-semibold text-base flex items-center gap-2">
                {section.title}
                {section.isNew && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#3CB52A] text-white tracking-wide uppercase leading-none">NEW</span>
                )}
              </span>
              <motion.div
                animate={{ rotate: openSection === section.title ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-white shrink-0"
              >
                <Plus size={20} />
              </motion.div>
            </button>
            <AnimatePresence>
              {openSection === section.title && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <ul className="pb-5 space-y-4">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="inline-flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-sm"
                        >
                          {link.label}
                          {link.isNew && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#3CB52A] text-white tracking-wide uppercase leading-none">NEW</span>
                          )}
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
    </div>
  );
};
