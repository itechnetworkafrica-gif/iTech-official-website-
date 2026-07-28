import React from 'react';
import { Globe, ChevronUp } from 'lucide-react';
import { ScrollingMarquee } from './ScrollingMarquee';
import { DynamicPageIdentifier } from './DynamicPageIdentifier';
import { FooterAccordion } from './FooterAccordion';
import { FooterBrand } from './FooterBrand';
import { FooterSocial } from './FooterSocial';
import { FooterLegal } from './FooterLegal';
import { FooterBottom } from './FooterBottom';

const footerSections = [
  {
    title: "About iTech Network Africa",
    links: ["Company Overview", "Our Story", "Vision", "Mission", "Core Values", "Leadership Team"]
  },
  {
    title: "Services",
    links: ["Web Development", "Website Design", "Mobile Apps", "Software Dev", "UI/UX Design", "Graphic Design", "Branding", "Cloud Services", "API Dev", "DB Dev", "Business Automation", "IT Support", "Cybersecurity", "Networking"]
  },
  {
    title: "Solutions",
    links: ["POS Systems", "ERP Solutions", "CRM Systems", "HR Management", "School Management", "Hospital Management", "Church Management", "Inventory Management"]
  },
  {
    title: "Products",
    links: ["Software Products", "Cloud Products", "Mobile Apps", "Enterprise Platforms"]
  },
  {
    title: "Resources",
    links: ["Documentation", "API Reference", "Tutorials", "Blog", "Downloads", "Changelog"]
  },
  {
    title: "Developers",
    links: ["API Reference", "SDKs", "Webhooks", "Open Source", "Developer Blog"]
  },
  {
    title: "Partners",
    links: ["Technology Partners", "Become a Partner", "Strategic Alliances", "Partner Portal"]
  },
  {
    title: "Careers",
    links: ["Job Openings", "Benefits", "Culture", "Internships", "Apply Now"]
  },
  {
    title: "Support",
    links: ["Help Center", "Contact Support", "Status Page", "Community Forum", "Report Issue"]
  },
  {
    title: "Company",
    links: ["About Us", "Leadership", "Press & Media", "Awards", "Investors", "Sitemap"]
  },
  {
    title: "Contact",
    links: ["Contact Us", "Office Locations", "Request a Quote", "Live Chat"]
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Cookies Policy", "Terms & Conditions", "Accessibility", "Security"]
  }
];

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#111111] overflow-hidden flex flex-col">
      <ScrollingMarquee />
      <DynamicPageIdentifier />

      {/* ── Main footer body ── */}
      <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-12">

        {/* 1. Accordion nav sections */}
        <div className="py-6">
          <FooterAccordion sections={footerSections} />
        </div>

        {/* 2. Brand logo — left-aligned, just like GoDaddy */}
        <FooterBrand />

        {/* 3. Thin divider */}
        <div className="border-t border-white/10" />

        {/* 4. Region / Currency row */}
        <div className="flex items-center justify-between py-5">
          <button className="flex items-center gap-1.5 text-[#BDBDBD] hover:text-white transition-colors text-sm">
            <Globe size={15} className="shrink-0" />
            <span>Liberia &ndash; English</span>
            <ChevronUp size={14} className="ml-0.5" />
          </button>
          <button className="flex items-center gap-1 text-[#BDBDBD] hover:text-white transition-colors text-sm">
            <span>USD $</span>
            <ChevronUp size={14} />
          </button>
        </div>

        {/* 5. Social icons — flat, left-aligned, exactly like GoDaddy */}
        <FooterSocial />

      </div>

      {/* 6. Legal bottom strip — full-width slightly darker separation */}
      <div className="border-t border-white/10 mt-4">
        <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-12 py-8 flex flex-col items-center gap-4">
          <FooterLegal />
          <FooterBottom />
        </div>
      </div>
    </footer>
  );
};
