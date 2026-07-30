import React from 'react';
import { Link } from 'wouter';

export const FooterLegal: React.FC = () => {
  const links = [
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Cookies Policy', href: '/cookies' },
    { label: 'Refund Policy', href: '/refund-policy' },
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
