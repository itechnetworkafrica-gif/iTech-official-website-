import React from 'react';
import { Link } from 'wouter';

export const FooterLegal: React.FC = () => {
  const links = [
    { label: 'Legal', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Cookies', href: '/cookies' },
  ];

  return (
    <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-white">
      {links.map((link) => (
        <Link key={link.label} href={link.href} className="hover:opacity-70 transition-opacity">
          {link.label}
        </Link>
      ))}
    </div>
  );
};
