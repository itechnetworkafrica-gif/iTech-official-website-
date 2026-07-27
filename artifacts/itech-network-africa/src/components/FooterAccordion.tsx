import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
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
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-0 lg:gap-y-8">
      {/* Desktop view (no accordion, just lists) */}
      {sections.map((section) => (
        <div key={section.title} className="hidden lg:block py-4">
          <h3 className="text-white font-bold text-lg mb-4">{section.title}</h3>
          <ul className="space-y-3">
            {section.links.map((link) => (
              <li key={link}>
                <Link href="#" className="text-[#BDBDBD] hover:text-[#007BFF] transition-colors text-sm hover:translate-x-1 inline-block transform duration-200">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Mobile/Tablet view (accordion) */}
      <div className="lg:hidden col-span-full">
        {sections.map((section) => (
          <div key={section.title} className="border-b border-white/5 last:border-0">
            <button
              onClick={() => toggleSection(section.title)}
              className="w-full flex justify-between items-center py-5 text-left transition-colors hover:bg-white/5 px-2 -mx-2 rounded-lg"
            >
              <span className="text-white font-bold text-base">{section.title}</span>
              <motion.div
                animate={{ rotate: openSection === section.title ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-[#007BFF]"
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
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <ul className="pb-5 pt-1 px-4 space-y-4">
                    {section.links.map((link) => (
                      <li key={link}>
                        <Link href="#" className="text-[#BDBDBD] hover:text-[#007BFF] transition-colors text-sm block">
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
