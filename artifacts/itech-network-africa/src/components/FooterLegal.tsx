import React from 'react';
import { Link } from 'wouter';

export const FooterLegal: React.FC = () => {
  const links = [
    { label: 'Legal', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cookies', href: '/cookies' },
  ];

  return (
    <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-[#BDBDBD]">
      {links.map((link) => (
        <Link key={link.label} href={link.href} className="hover:text-white transition-colors">
          {link.label}
        </Link>
      ))}
    </div>
  );
};
