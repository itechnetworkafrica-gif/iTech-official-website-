import React from 'react';
import { Link } from 'wouter';

export const FooterLegal: React.FC = () => {
  const links = [
    "Legal",
    "Privacy Policy",
    "Cookies Policy",
    "Terms & Conditions",
    "Accessibility",
    "Security",
    "Sitemap"
  ];

  return (
    <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6 py-6 text-sm text-[#BDBDBD]">
      {links.map((link, index) => (
        <React.Fragment key={link}>
          <Link href="#" className="hover:text-white transition-colors">
            {link}
          </Link>
          {index < links.length - 1 && (
            <span className="text-white/20 text-[10px]">•</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
