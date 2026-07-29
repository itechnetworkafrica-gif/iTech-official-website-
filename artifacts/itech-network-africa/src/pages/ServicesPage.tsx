import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHero } from '@/components/PageHero';
import { Link } from 'wouter';
import {
  Monitor, Smartphone, Code, Palette, PenTool, Layers, Cloud,
  Terminal, Database, Zap, Headphones, Shield, Network, Video,
  Globe, Server, Mail, ArrowRight, Megaphone, Camera, Printer,
  BookOpen, Briefcase, Cpu, Search, BarChart2, MessageSquare,
  Lock, Wifi, HardDrive, PhoneCall, Package
} from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.07, ease: EASE } }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

interface SubService { label: string; href: string }
interface ServiceCategory {
  id: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
  slug: string;
  items: SubService[];
}

const CATEGORIES: ServiceCategory[] = [
  {
    id: 'web-design',
    icon: <Monitor size={22} />,
    title: 'Web Design & Development',
    desc: 'Stunning, fast websites for every industry — from landing pages to full enterprise portals.',
    color: '#3CB52A',
    slug: 'web-development',
    items: [
      { label: 'Business Websites', href: '/services/web-development' },
      { label: 'Corporate Websites', href: '/services/web-development' },
      { label: 'NGO & Nonprofit Websites', href: '/services/web-development' },
      { label: 'Government Websites', href: '/services/web-development' },
      { label: 'School & University Websites', href: '/services/website-design' },
      { label: 'Church Websites', href: '/services/website-design' },
      { label: 'E-commerce Stores', href: '/services/web-development' },
      { label: 'Real Estate Websites', href: '/services/web-development' },
      { label: 'Hotel & Hospitality Websites', href: '/services/web-development' },
      { label: 'Healthcare Websites', href: '/services/web-development' },
      { label: 'News & Magazine Websites', href: '/services/web-development' },
      { label: 'Portfolio Websites', href: '/services/website-design' },
      { label: 'Landing Pages', href: '/services/website-design' },
      { label: 'Website Redesign', href: '/services/website-design' },
      { label: 'Website Maintenance & Support', href: '/services/web-development' },
      { label: 'Website Speed Optimisation', href: '/services/web-development' },
      { label: 'Website Security', href: '/services/cybersecurity' },
      { label: 'Domain Registration', href: '/services/domain-registration' },
      { label: 'Web Hosting', href: '/services/web-hosting' },
      { label: 'SSL Certificates', href: '/services/web-hosting' },
    ],
  },
  {
    id: 'software',
    icon: <Code size={22} />,
    title: 'Software Development',
    desc: 'Bespoke enterprise software, ERP, CRM, and management systems built around your workflows.',
    color: '#0A7EBF',
    slug: 'software-development',
    items: [
      { label: 'Custom Software Development', href: '/services/software-development' },
      { label: 'ERP Systems', href: '/services/software-development' },
      { label: 'CRM Systems', href: '/services/software-development' },
      { label: 'School Management Systems', href: '/services/software-development' },
      { label: 'Hospital Management Systems', href: '/services/software-development' },
      { label: 'HR & Payroll Systems', href: '/services/software-development' },
      { label: 'Inventory Management Systems', href: '/services/software-development' },
      { label: 'Accounting Systems', href: '/services/software-development' },
      { label: 'POS Systems', href: '/services/software-development' },
      { label: 'Booking & Reservation Systems', href: '/services/software-development' },
      { label: 'Custom Business Applications', href: '/services/software-development' },
      { label: 'API Development & Integration', href: '/services/api-development' },
      { label: 'Database Development', href: '/services/database-development' },
    ],
  },
  {
    id: 'mobile',
    icon: <Smartphone size={22} />,
    title: 'Mobile App Development',
    desc: 'Native and cross-platform iOS & Android apps that users love.',
    color: '#7C3AED',
    slug: 'mobile-app-development',
    items: [
      { label: 'Android Apps', href: '/services/mobile-app-development' },
      { label: 'iOS Apps', href: '/services/mobile-app-development' },
      { label: 'Cross-Platform Apps', href: '/services/mobile-app-development' },
      { label: 'Business Apps', href: '/services/mobile-app-development' },
      { label: 'E-commerce Apps', href: '/services/mobile-app-development' },
      { label: 'Education Apps', href: '/services/mobile-app-development' },
      { label: 'Healthcare Apps', href: '/services/mobile-app-development' },
      { label: 'App Maintenance & Support', href: '/services/mobile-app-development' },
    ],
  },
  {
    id: 'digital-marketing',
    icon: <Megaphone size={22} />,
    title: 'Digital Marketing',
    desc: 'Grow your audience, generate leads, and dominate search rankings across every channel.',
    color: '#EA580C',
    slug: 'digital-marketing',
    items: [
      { label: 'Social Media Management', href: '/services/digital-marketing' },
      { label: 'Social Media Advertising', href: '/services/digital-marketing' },
      { label: 'Google Ads (PPC)', href: '/services/digital-marketing' },
      { label: 'Facebook & Instagram Ads', href: '/services/digital-marketing' },
      { label: 'Search Engine Optimisation (SEO)', href: '/services/digital-marketing' },
      { label: 'Email Marketing', href: '/services/digital-marketing' },
      { label: 'SMS Marketing', href: '/services/digital-marketing' },
      { label: 'Content Marketing', href: '/services/digital-marketing' },
      { label: 'Online Reputation Management', href: '/services/digital-marketing' },
    ],
  },
  {
    id: 'branding',
    icon: <PenTool size={22} />,
    title: 'Graphic Design & Branding',
    desc: 'Professional visual identities, marketing collateral, and creative assets that make your brand unforgettable.',
    color: '#DB2777',
    slug: 'branding',
    items: [
      { label: 'Logo Design', href: '/services/branding' },
      { label: 'Brand Identity', href: '/services/branding' },
      { label: 'Business Cards', href: '/services/graphic-design' },
      { label: 'Flyers & Posters', href: '/services/graphic-design' },
      { label: 'Brochures & Company Profiles', href: '/services/graphic-design' },
      { label: 'Banners & Billboards', href: '/services/graphic-design' },
      { label: 'Social Media Graphics', href: '/services/graphic-design' },
      { label: 'Presentation Design', href: '/services/graphic-design' },
      { label: 'Infographics', href: '/services/graphic-design' },
      { label: 'Product Packaging', href: '/services/branding' },
    ],
  },
  {
    id: 'ui-ux',
    icon: <Layers size={22} />,
    title: 'UI/UX Design',
    desc: 'User-centred interfaces that drive engagement, reduce friction, and convert visitors into customers.',
    color: '#0891B2',
    slug: 'ui-ux-design',
    items: [
      { label: 'Website UI Design', href: '/services/ui-ux-design' },
      { label: 'Mobile App UI Design', href: '/services/ui-ux-design' },
      { label: 'Dashboard Design', href: '/services/ui-ux-design' },
      { label: 'User Research', href: '/services/ui-ux-design' },
      { label: 'Wireframing', href: '/services/ui-ux-design' },
      { label: 'Prototyping', href: '/services/ui-ux-design' },
    ],
  },
  {
    id: 'cloud',
    icon: <Cloud size={22} />,
    title: 'Cloud & IT Services',
    desc: 'Secure, scalable cloud infrastructure and managed IT solutions on AWS, Azure, and Google Cloud.',
    color: '#0369A1',
    slug: 'cloud-services',
    items: [
      { label: 'Cloud Migration', href: '/services/cloud-services' },
      { label: 'Cloud Hosting', href: '/services/cloud-services' },
      { label: 'Microsoft 365 Setup', href: '/services/cloud-services' },
      { label: 'Google Workspace Setup', href: '/services/cloud-services' },
      { label: 'Business Email Setup', href: '/services/email-hosting' },
      { label: 'Cloud Backup & Recovery', href: '/services/cloud-services' },
      { label: 'Server Management', href: '/services/cloud-services' },
    ],
  },
  {
    id: 'cybersecurity',
    icon: <Shield size={22} />,
    title: 'Cybersecurity',
    desc: 'Enterprise-grade security audits, penetration testing, and continuous threat protection.',
    color: '#DC2626',
    slug: 'cybersecurity',
    items: [
      { label: 'Website Security', href: '/services/cybersecurity' },
      { label: 'Security Audits', href: '/services/cybersecurity' },
      { label: 'Vulnerability Assessment', href: '/services/cybersecurity' },
      { label: 'Penetration Testing', href: '/services/cybersecurity' },
      { label: 'Data Backup & Recovery', href: '/services/cybersecurity' },
      { label: 'Firewall Configuration', href: '/services/cybersecurity' },
      { label: 'Cybersecurity Training', href: '/services/cybersecurity' },
    ],
  },
  {
    id: 'networking',
    icon: <Network size={22} />,
    title: 'Networking & Infrastructure',
    desc: 'End-to-end network installation, CCTV, access control, and structured cabling.',
    color: '#4F46E5',
    slug: 'networking',
    items: [
      { label: 'Network Installation', href: '/services/networking' },
      { label: 'Office Network Setup', href: '/services/networking' },
      { label: 'Wi-Fi Installation', href: '/services/networking' },
      { label: 'CCTV Installation', href: '/services/cctv-installation' },
      { label: 'Access Control Systems', href: '/services/networking' },
      { label: 'Biometric Systems', href: '/services/networking' },
      { label: 'Server Installation', href: '/services/networking' },
      { label: 'Structured Cabling', href: '/services/networking' },
    ],
  },
  {
    id: 'it-consulting',
    icon: <Briefcase size={22} />,
    title: 'IT Consulting',
    desc: 'Strategic technology advisory to drive digital transformation and accelerate your business growth.',
    color: '#065F46',
    slug: 'it-consulting',
    items: [
      { label: 'Digital Transformation', href: '/services/it-consulting' },
      { label: 'IT Strategy & Planning', href: '/services/it-consulting' },
      { label: 'Technology Consulting', href: '/services/it-consulting' },
      { label: 'Business Process Automation', href: '/services/business-automation' },
      { label: 'Project Management', href: '/services/it-consulting' },
      { label: 'ICT Policy Development', href: '/services/it-consulting' },
    ],
  },
  {
    id: 'multimedia',
    icon: <Camera size={22} />,
    title: 'Creative Media',
    desc: 'Professional photography, videography, motion graphics, and multimedia production.',
    color: '#B45309',
    slug: 'creative-media',
    items: [
      { label: 'Photography', href: '/services/creative-media' },
      { label: 'Videography', href: '/services/creative-media' },
      { label: 'Motion Graphics', href: '/services/creative-media' },
      { label: 'Video Editing', href: '/services/creative-media' },
      { label: 'Animation', href: '/services/creative-media' },
      { label: 'Live Streaming', href: '/services/creative-media' },
      { label: 'Podcast Production', href: '/services/creative-media' },
    ],
  },
  {
    id: 'printing',
    icon: <Printer size={22} />,
    title: 'Printing & Promotional',
    desc: 'Large-format printing, branded merchandise, signage, and corporate promotional materials.',
    color: '#9D174D',
    slug: 'printing-promotional',
    items: [
      { label: 'Large Format Printing', href: '/services/printing-promotional' },
      { label: 'T-Shirt Printing', href: '/services/printing-promotional' },
      { label: 'ID Card Printing', href: '/services/printing-promotional' },
      { label: 'Stickers & Labels', href: '/services/printing-promotional' },
      { label: 'Branded Merchandise', href: '/services/printing-promotional' },
      { label: 'Signage', href: '/services/printing-promotional' },
    ],
  },
  {
    id: 'support',
    icon: <Headphones size={22} />,
    title: 'Technical Support',
    desc: '24/7 remote and on-site IT support, hardware repairs, and helpdesk services.',
    color: '#047857',
    slug: 'it-support',
    items: [
      { label: 'Remote IT Support', href: '/services/it-support' },
      { label: 'On-site IT Support', href: '/services/it-support' },
      { label: 'Help Desk Services', href: '/services/it-support' },
      { label: 'Computer Repairs', href: '/services/it-support' },
      { label: 'Laptop Repairs', href: '/services/it-support' },
      { label: 'Printer Support', href: '/services/it-support' },
      { label: 'Software Installation', href: '/services/it-support' },
    ],
  },
  {
    id: 'business',
    icon: <Package size={22} />,
    title: 'Business Solutions',
    desc: 'Digital payment integration, customer portals, e-signature, and document management platforms.',
    color: '#6D28D9',
    slug: 'business-solutions',
    items: [
      { label: 'Business Email Solutions', href: '/services/email-hosting' },
      { label: 'Digital Document Management', href: '/services/business-solutions' },
      { label: 'E-signature Solutions', href: '/services/business-solutions' },
      { label: 'Online Payment Integration', href: '/services/business-solutions' },
      { label: 'Appointment Booking Systems', href: '/services/business-solutions' },
      { label: 'Customer Portal Development', href: '/services/software-development' },
      { label: 'Client Portal Development', href: '/services/software-development' },
      { label: 'Vendor Portal Development', href: '/services/software-development' },
    ],
  },
  {
    id: 'training',
    icon: <BookOpen size={22} />,
    title: 'ICT Training',
    desc: 'Hands-on training programmes in Microsoft Office, cybersecurity, AI tools, and professional tech skills.',
    color: '#0F766E',
    slug: 'ict-training',
    items: [
      { label: 'Microsoft Office Training', href: '/services/ict-training' },
      { label: 'AI Tools Training', href: '/services/ict-training' },
      { label: 'Cybersecurity Awareness', href: '/services/cybersecurity' },
      { label: 'Digital Skills Training', href: '/services/ict-training' },
      { label: 'Software User Training', href: '/services/ict-training' },
    ],
  },
];

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  return (
    <div className="flex flex-col w-full bg-[#F8F9FA]">
      <PageHero
        badge="Our Expertise"
        title="World-Class Technology Services"
        subtitle="From robust enterprise software to strategic cloud infrastructure, we deliver solutions that drive growth and operational excellence across Africa."
        ctaPrimary={{ label: 'Request a Quote', href: '/contact' }}
      />

      {/* Category quick-nav */}
      <div className="sticky top-[56px] z-30 bg-white border-b border-[#E5E7EB] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex gap-1 overflow-x-auto scrollbar-none py-2">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                onClick={() => setActiveTab(cat.id)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#6B7280] hover:text-[#3CB52A] hover:bg-[#f0fdf4] transition-all whitespace-nowrap"
              >
                <span className="text-[#3CB52A]">{cat.icon}</span>
                {cat.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Category sections */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full py-16 space-y-20">
        {CATEGORIES.map((cat, catIdx) => (
          <section key={cat.id} id={cat.id}>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              variants={stagger}
            >
              {/* Category header */}
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 mt-0.5"
                    style={{ backgroundColor: cat.color }}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#060E18]">{cat.title}</h2>
                    <p className="text-[#6B7280] text-sm mt-1 max-w-xl">{cat.desc}</p>
                  </div>
                </div>
                <Link
                  href={`/services/${cat.slug}`}
                  className="flex-shrink-0 inline-flex items-center gap-1.5 text-sm font-bold text-[#3CB52A] hover:gap-2.5 transition-all"
                >
                  View Full Details <ArrowRight size={14} />
                </Link>
              </motion.div>

              {/* Sub-service grid */}
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {cat.items.map((item, i) => (
                  <motion.div
                    key={item.label}
                    custom={i}
                    variants={fadeUp}
                  >
                    <Link
                      href={item.href}
                      className="group flex items-center gap-3 p-4 bg-white border border-[#E5E7EB] rounded-xl hover:border-[#3CB52A]/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0 transition-transform group-hover:scale-125"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-sm font-medium text-[#374151] group-hover:text-[#060E18] transition-colors leading-tight">
                        {item.label}
                      </span>
                      <ArrowRight
                        size={13}
                        className="ml-auto shrink-0 text-[#D1D5DB] group-hover:text-[#3CB52A] group-hover:translate-x-0.5 transition-all"
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>
        ))}
      </div>

      {/* CTA */}
      <section className="bg-[#0A1929] py-20 lg:py-28 text-white text-center px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Need a custom solution not listed here?</h2>
          <p className="text-[#BDBDBD] text-lg mb-10">
            Our engineering team specialises in solving complex, unique business challenges. Let's discuss your specific requirements.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#3CB52A] text-white font-bold rounded-xl hover:bg-[#2e911f] transition-all shadow-lg shadow-[#3CB52A]/20"
          >
            Schedule a Free Consultation <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
