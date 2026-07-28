import React from 'react';
import { Globe, ChevronUp } from 'lucide-react';
import { ScrollingMarquee } from './ScrollingMarquee';
import { DynamicPageIdentifier } from './DynamicPageIdentifier';
import { FooterAccordion } from './FooterAccordion';
import { FooterBrand } from './FooterBrand';
import { FooterSocial } from './FooterSocial';
import { FooterLegal } from './FooterLegal';
import { FooterBottom } from './FooterBottom';

/* Exactly 6 sections — mirrors GoDaddy's structure */
const footerSections = [
  {
    title: "About iTech Network Africa",
    links: ["Company Overview", "Our Story", "Leadership Team", "Careers", "Press & Media", "Contact Us"],
  },
  {
    title: "Support",
    links: ["Help Center", "Contact Support", "Status Page", "Community Forum", "Report an Issue"],
  },
  {
    title: "Resources",
    links: ["Documentation", "API Reference", "Blog", "Tutorials", "Downloads"],
  },
  {
    title: "Partner Programs",
    links: ["Technology Partners", "Become a Partner", "Strategic Alliances", "Partner Portal"],
  },
  {
    title: "Account",
    links: ["Login", "Register", "Dashboard", "Profile Settings", "Billing"],
  },
  {
    title: "Services",
    links: ["Web Development", "Mobile Apps", "AI Solutions", "Cloud Services", "Cybersecurity", "IT Support"],
  },
];

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#111111] overflow-hidden flex flex-col">
      <ScrollingMarquee />
      <DynamicPageIdentifier />

      {/* ── Main footer body ── */}
      <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-12">

        {/* 1. Accordion nav — 6 sections */}
        <div className="py-6">
          <FooterAccordion sections={footerSections} />
        </div>

        {/* 2. Brand logo — icon + wordmark, left-aligned */}
        <FooterBrand />

        {/* 3. Thin divider */}
        <div className="border-t border-white/10" />

        {/* 4. Region / Currency row */}
        <div className="flex items-center justify-between py-5">
          <button className="flex items-center gap-1.5 text-white hover:opacity-80 transition-opacity text-sm">
            <Globe size={15} className="shrink-0" />
            <span>Liberia &ndash; English</span>
            <ChevronUp size={14} className="ml-0.5" />
          </button>
          <button className="flex items-center gap-1 text-white hover:opacity-80 transition-opacity text-sm">
            <span>USD $</span>
            <ChevronUp size={14} />
          </button>
        </div>

        {/* 5. Social icons — flat, left-aligned */}
        <FooterSocial />

      </div>

      {/* 6. Legal bottom strip */}
      <div className="border-t border-white/10 mt-4">
        <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-12 py-8 flex flex-col items-center gap-4">
          <FooterLegal />
          <FooterBottom />
        </div>
      </div>
    </footer>
  );
};
