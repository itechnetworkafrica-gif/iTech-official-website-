import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Link } from 'wouter';

interface FooterAccordionProps {
  sections: {
    title: string;
    links: string[];
  }[];
}

export const FooterAccordion: React.FC<FooterAccordionProps> = ({ sections }) => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (title: string) => {
    setOpenSection(openSection === title ? null : title);
  };

  return (
    <div className="w-full">
      {/* Desktop: 3-column grid */}
      <div className="hidden lg:grid grid-cols-3 gap-x-12 gap-y-10">
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="text-white font-bold text-base mb-4">{section.title}</h3>
            <ul className="space-y-3">
              {section.links.map((link) => (
                <li key={link}>
                  <Link href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Mobile/Tablet: full-width accordion, exactly like GoDaddy */}
      <div className="lg:hidden">
        {sections.map((section) => (
          <div key={section.title} className="border-b border-white/10 last:border-0">
            <button
              onClick={() => toggleSection(section.title)}
              className="w-full flex justify-between items-center py-5 text-left"
            >
              <span className="text-white font-semibold text-base">{section.title}</span>
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
                      <li key={link}>
                        <Link href="#" className="text-white/70 hover:text-white transition-colors text-sm block">
                          {link}
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
