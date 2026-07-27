import React from 'react';
import { ScrollingMarquee } from './ScrollingMarquee';
import { DynamicPageIdentifier } from './DynamicPageIdentifier';
import { FooterAccordion } from './FooterAccordion';
import { FooterBrand } from './FooterBrand';
import { FooterSocial } from './FooterSocial';
import { FooterLegal } from './FooterLegal';
import { FooterBottom } from './FooterBottom';
import { Globe } from 'lucide-react';

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
      
      <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-12 py-16 flex flex-col gap-12">
        <FooterAccordion sections={footerSections} />
        
        <FooterBrand />
        
        {/* Country & Language + Currency */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-b border-white/10">
          <button className="flex items-center gap-2 text-[#BDBDBD] hover:text-white transition-colors text-sm group">
            <Globe size={16} className="group-hover:text-[#007BFF] transition-colors" />
            <span>Liberia &ndash; English</span>
            <span className="text-[10px] ml-1">▼</span>
          </button>
          <button className="text-[#BDBDBD] hover:text-white transition-colors text-sm font-medium hover:bg-white/5 px-3 py-1.5 rounded">
            USD $
          </button>
        </div>
        
        <FooterSocial />
        <FooterLegal />
        <FooterBottom />
      </div>
    </footer>
  );
};
