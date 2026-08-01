import React from 'react';
import { ScrollingMarquee } from './ScrollingMarquee';
import { DynamicPageIdentifier } from './DynamicPageIdentifier';
import { FooterAccordion } from './FooterAccordion';
import { FooterBrand } from './FooterBrand';
import { FooterSocial } from './FooterSocial';
import { FooterLegal } from './FooterLegal';
import { FooterBottom } from './FooterBottom';
import { FooterLocale } from './FooterLocale';

const footerSections = [
  {
    title: 'About iTech Network Africa',
    links: [
      { label: 'Company Overview', href: '/about' },
      { label: 'Our Story', href: '/about#our-story' },
      { label: 'Leadership Team', href: '/about#our-team' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press & Media', href: '/blog' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Support',
    isNew: true,
    links: [
      { label: 'Help Center', href: '/support', isNew: true },
      { label: 'Contact Support', href: '/contact' },
      { label: 'Report an Issue', href: '/contact' },
      { label: 'Client Portal', href: '/portal', isNew: true },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/resources' },
      { label: 'Blog & Insights', href: '/blog' },
      { label: 'Case Studies', href: '/portfolio' },
      { label: 'Partners', href: '/partners' },
      { label: 'Sitemap', href: '/sitemap' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Web Development', href: '/services' },
      { label: 'Mobile Apps', href: '/services' },
      { label: 'AI Solutions', href: '/ai-solutions' },
      { label: 'Cloud Services', href: '/services' },
      { label: 'Cybersecurity', href: '/services' },
      { label: 'IT Support', href: '/support' },
    ],
  },
  {
    title: 'Pricing',
    isNew: true,
    links: [
      { label: 'Website Design', href: '/pricing' },
      { label: 'Web Hosting', href: '/pricing' },
      { label: 'Digital Marketing', href: '/pricing' },
      { label: 'IT Consultancy', href: '/pricing' },
      { label: 'Graphic Design', href: '/pricing' },
      { label: 'Request a Quote', href: '/contact' },
    ],
  },
  {
    title: 'Partner Programs',
    links: [
      { label: 'Technology Partners', href: '/partners' },
      { label: 'Become a Partner', href: '/contact' },
      { label: 'Strategic Alliances', href: '/partners' },
      { label: 'Partner Portal', href: '/portal' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Client Portal Login', href: '/portal', isNew: true },
      { label: 'Register', href: '/portal' },
      { label: 'Dashboard', href: '/portal' },
      { label: 'Billing', href: '/portal' },
    ],
  },
  {
    title: 'Contact',
    desktopOnly: true,
    links: [
      { label: 'Get in Touch', href: '/contact' },
      { label: 'Request a Quote', href: '/contact' },
      { label: 'Book a Consultation', href: '/contact' },
      { label: 'Office Locations', href: '/contact' },
      { label: 'WhatsApp Us', href: '/contact' },
      { label: 'Support Tickets', href: '/support' },
    ],
  },
];

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#111111] overflow-hidden flex flex-col">
      <ScrollingMarquee />
      <DynamicPageIdentifier />

      <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-12">

        <div className="py-6">
          <FooterAccordion sections={footerSections} />
        </div>

        {/* Desktop: logo on left, social icons on right; Mobile: logo then icons stacked */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pt-10 pb-6">
          <FooterBrand />
          <FooterSocial />
        </div>

        <div className="border-t border-white/10" />

        <FooterLocale />

      </div>

      <div className="border-t border-white/10 mt-4">
        <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-12 py-8 flex flex-col items-center gap-4">
          <FooterLegal />
          <FooterBottom />
        </div>
      </div>
    </footer>
  );
};
