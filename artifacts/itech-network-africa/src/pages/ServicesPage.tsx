import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import {
  Monitor, Smartphone, Code, PenTool, Layers, Cloud,
  Headphones, Shield, Network, Camera, Printer,
  BookOpen, Briefcase, Package, Megaphone,
  ArrowRight, CheckCircle2, ChevronDown, ChevronUp,
  Globe, Users, Star, Clock, Zap,
} from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.06, ease: EASE } }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

interface ServiceCategory {
  id: string;
  slug: string; // matches ServiceDetailPage slug
  icon: React.ElementType;
  title: string;
  desc: string;
  highlights: string[];
  items: string[];
}

const CATEGORIES: ServiceCategory[] = [
  {
    id: 'web-design',
    slug: 'web-development',
    icon: Monitor,
    title: 'Web Design & Development',
    desc: 'Stunning, fast websites for every industry — from landing pages to full enterprise portals.',
    highlights: ['Business & Corporate Websites', 'E-commerce Stores', 'Custom Portals & Platforms'],
    items: [
      'Business Websites', 'Corporate Websites', 'NGO & Nonprofit Websites',
      'Government Websites', 'School & University Websites', 'Church Websites',
      'E-commerce Stores', 'Real Estate Websites', 'Hotel & Hospitality Websites',
      'Healthcare Websites', 'News & Magazine Websites', 'Portfolio Websites',
      'Landing Pages', 'Website Redesign', 'Website Maintenance & Support',
      'Website Speed Optimisation', 'Domain Registration', 'Web Hosting', 'SSL Certificates',
    ],
  },
  {
    id: 'software',
    slug: 'software-development',
    icon: Code,
    title: 'Software Development',
    desc: 'Bespoke enterprise software, ERP, CRM, and management systems built around your workflows.',
    highlights: ['Custom ERP & CRM Systems', 'Hospital & School Management', 'API & Database Development'],
    items: [
      'Custom Software Development', 'ERP Systems', 'CRM Systems',
      'School Management Systems', 'Hospital Management Systems', 'HR & Payroll Systems',
      'Inventory Management Systems', 'Accounting Systems', 'POS Systems',
      'Booking & Reservation Systems', 'Custom Business Applications',
      'API Development & Integration', 'Database Development',
    ],
  },
  {
    id: 'mobile',
    slug: 'mobile-app-development',
    icon: Smartphone,
    title: 'Mobile App Development',
    desc: 'Native and cross-platform iOS & Android apps that users love — from concept to App Store.',
    highlights: ['Android & iOS Apps', 'Cross-Platform Development', 'E-commerce & Business Apps'],
    items: [
      'Android Apps', 'iOS Apps', 'Cross-Platform Apps',
      'Business Apps', 'E-commerce Apps', 'Education Apps',
      'Healthcare Apps', 'App Maintenance & Support',
    ],
  },
  {
    id: 'digital-marketing',
    slug: 'digital-marketing',
    icon: Megaphone,
    title: 'Digital Marketing',
    desc: 'Grow your audience, generate leads, and dominate search rankings across every channel.',
    highlights: ['SEO & Google Ads', 'Social Media Management', 'Email & SMS Campaigns'],
    items: [
      'Social Media Management', 'Social Media Advertising', 'Google Ads (PPC)',
      'Facebook & Instagram Ads', 'Search Engine Optimisation (SEO)',
      'Email Marketing', 'SMS Marketing', 'Content Marketing', 'Online Reputation Management',
    ],
  },
  {
    id: 'branding',
    slug: 'branding',
    icon: PenTool,
    title: 'Graphic Design & Branding',
    desc: 'Professional visual identities, marketing collateral, and creative assets that make your brand unforgettable.',
    highlights: ['Logo & Brand Identity', 'Marketing Collateral', 'Social Media Graphics'],
    items: [
      'Logo Design', 'Brand Identity', 'Business Cards',
      'Flyers & Posters', 'Brochures & Company Profiles', 'Banners & Billboards',
      'Social Media Graphics', 'Presentation Design', 'Infographics', 'Product Packaging',
    ],
  },
  {
    id: 'ui-ux',
    slug: 'ui-ux-design',
    icon: Layers,
    title: 'UI/UX Design',
    desc: 'User-centred interfaces that drive engagement, reduce friction, and convert visitors into customers.',
    highlights: ['Website & App UI Design', 'User Research & Prototyping', 'Dashboard Design'],
    items: [
      'Website UI Design', 'Mobile App UI Design', 'Dashboard Design',
      'User Research', 'Wireframing', 'Prototyping',
    ],
  },
  {
    id: 'cloud',
    slug: 'cloud-services',
    icon: Cloud,
    title: 'Cloud & IT Services',
    desc: 'Secure, scalable cloud infrastructure and managed IT solutions on AWS, Azure, and Google Cloud.',
    highlights: ['Cloud Migration & Hosting', 'Microsoft 365 & Google Workspace', 'Server & Backup Management'],
    items: [
      'Cloud Migration', 'Cloud Hosting', 'Microsoft 365 Setup',
      'Google Workspace Setup', 'Business Email Setup',
      'Cloud Backup & Recovery', 'Server Management',
    ],
  },
  {
    id: 'cybersecurity',
    slug: 'cybersecurity',
    icon: Shield,
    title: 'Cybersecurity',
    desc: 'Enterprise-grade security audits, penetration testing, and continuous threat protection.',
    highlights: ['Security Audits & Pen Testing', 'Firewall & Data Protection', 'Cybersecurity Training'],
    items: [
      'Website Security', 'Security Audits', 'Vulnerability Assessment',
      'Penetration Testing', 'Data Backup & Recovery',
      'Firewall Configuration', 'Cybersecurity Training',
    ],
  },
  {
    id: 'networking',
    slug: 'networking',
    icon: Network,
    title: 'Networking & Infrastructure',
    desc: 'End-to-end network installation, CCTV, access control, and structured cabling for any scale.',
    highlights: ['Network & Wi-Fi Installation', 'CCTV & Access Control', 'Server & Structured Cabling'],
    items: [
      'Network Installation', 'Office Network Setup', 'Wi-Fi Installation',
      'CCTV Installation', 'Access Control Systems',
      'Biometric Systems', 'Server Installation', 'Structured Cabling',
    ],
  },
  {
    id: 'it-consulting',
    slug: 'it-consulting',
    icon: Briefcase,
    title: 'IT Consulting',
    desc: 'Strategic technology advisory to drive digital transformation and accelerate your business growth.',
    highlights: ['Digital Transformation', 'IT Strategy & Planning', 'Business Process Automation'],
    items: [
      'Digital Transformation', 'IT Strategy & Planning', 'Technology Consulting',
      'Business Process Automation', 'Project Management', 'ICT Policy Development',
    ],
  },
  {
    id: 'multimedia',
    slug: 'creative-media',
    icon: Camera,
    title: 'Creative Media',
    desc: 'Professional photography, videography, motion graphics, and multimedia production.',
    highlights: ['Photography & Videography', 'Motion Graphics & Animation', 'Podcast & Live Streaming'],
    items: [
      'Photography', 'Videography', 'Motion Graphics',
      'Video Editing', 'Animation', 'Live Streaming', 'Podcast Production',
    ],
  },
  {
    id: 'printing',
    slug: 'printing-promotional',
    icon: Printer,
    title: 'Printing & Promotional',
    desc: 'Large-format printing, branded merchandise, signage, and corporate promotional materials.',
    highlights: ['Large Format & T-Shirt Printing', 'ID Cards & Stickers', 'Branded Merchandise & Signage'],
    items: [
      'Large Format Printing', 'T-Shirt Printing', 'ID Card Printing',
      'Stickers & Labels', 'Branded Merchandise', 'Signage',
    ],
  },
  {
    id: 'support',
    slug: 'it-support',
    icon: Headphones,
    title: 'Technical Support',
    desc: '24/7 remote and on-site IT support, hardware repairs, and helpdesk services.',
    highlights: ['Remote & On-site IT Support', 'Computer & Laptop Repairs', '24/7 Helpdesk Services'],
    items: [
      'Remote IT Support', 'On-site IT Support', 'Help Desk Services',
      'Computer Repairs', 'Laptop Repairs', 'Printer Support', 'Software Installation',
    ],
  },
  {
    id: 'business',
    slug: 'business-solutions',
    icon: Package,
    title: 'Business Solutions',
    desc: 'Digital payment integration, customer portals, e-signature, and document management platforms.',
    highlights: ['Online Payment Integration', 'Client & Vendor Portals', 'Document & E-signature Solutions'],
    items: [
      'Business Email Solutions', 'Digital Document Management', 'E-signature Solutions',
      'Online Payment Integration', 'Appointment Booking Systems',
      'Customer Portal Development', 'Client Portal Development', 'Vendor Portal Development',
    ],
  },
  {
    id: 'training',
    slug: 'ict-training',
    icon: BookOpen,
    title: 'ICT Training',
    desc: 'Hands-on training programmes in Microsoft Office, cybersecurity, AI tools, and professional tech skills.',
    highlights: ['Microsoft Office Training', 'AI Tools & Digital Skills', 'Cybersecurity Awareness'],
    items: [
      'Microsoft Office Training', 'AI Tools Training', 'Cybersecurity Awareness',
      'Digital Skills Training', 'Software User Training',
    ],
  },
];

const PROCESS = [
  { num: '01', title: 'Discovery', desc: 'We listen to your goals, audit your current setup, and map out requirements.' },
  { num: '02', title: 'Strategy', desc: 'Our architects design a tailored roadmap aligned to your timeline and budget.' },
  { num: '03', title: 'Build', desc: 'Agile sprints with regular reviews, rigorous QA, and transparent progress.' },
  { num: '04', title: 'Launch & Support', desc: 'Smooth go-live, full training, and 24/7 ongoing support.' },
];

function ServiceCard({ cat, index }: { cat: ServiceCategory; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = cat.icon;

  return (
    <motion.div
      id={cat.id}
      custom={index}
      variants={fadeUp}
      className="group flex flex-col bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:border-[#3CB52A]/40 hover:shadow-xl transition-all duration-300"
    >
      {/* Green top accent bar */}
      <div className="h-1 w-full bg-[#3CB52A] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex flex-col flex-1 p-6">
        {/* Icon + title row */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-12 h-12 rounded-xl bg-[#0A1929] flex items-center justify-center shrink-0 group-hover:bg-[#3CB52A] transition-colors duration-300">
            <Icon size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="font-bold text-[#0A1929] text-base leading-tight">{cat.title}</h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-[#6B7280] text-sm leading-relaxed mb-5">{cat.desc}</p>

        {/* Key highlights */}
        <div className="space-y-2.5 mb-6 flex-1">
          {cat.highlights.map((h) => (
            <div key={h} className="flex items-start gap-2.5">
              <CheckCircle2 size={14} className="text-[#3CB52A] shrink-0 mt-0.5" />
              <span className="text-xs text-[#374151] font-medium leading-snug">{h}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-[#F3F4F6] pt-4 flex items-center justify-between gap-3">
          <button
            onClick={() => setExpanded(v => !v)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#3CB52A] transition-colors"
          >
            {expanded ? 'Hide services' : `+${cat.items.length} services`}
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          <Link
            href={`/services/${cat.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#0A1929] hover:bg-[#3CB52A] px-4 py-2 rounded-lg transition-all duration-200 group/btn"
          >
            Details <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Expandable sub-services */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="pt-4 flex flex-wrap gap-1.5">
                {cat.items.map((item) => (
                  <span
                    key={item}
                    className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-[#F3F4F6] text-[#374151]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function ServicesPage() {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filtered = activeFilter === 'all'
    ? CATEGORIES
    : CATEGORIES.filter(c => c.id === activeFilter);

  return (
    <div className="flex flex-col w-full overflow-x-hidden">

      {/* ══ HERO ══ */}
      <section
        className="relative bg-[#060E18] overflow-hidden"
        style={{ paddingTop: 'clamp(5.5rem, 10vw, 8rem)', paddingBottom: 'clamp(4rem, 7vw, 6rem)' }}
      >
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '52px 52px',
          }}
        />
        {/* Green glow top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[260px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(60,181,42,0.10) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-12">
          <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-3xl">

            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#3CB52A]/30 mb-6"
              style={{ background: 'rgba(60,181,42,0.08)' }}>
              <Zap size={12} className="text-[#3CB52A]" />
              <span className="text-[#3CB52A] text-[11px] font-bold tracking-[0.18em] uppercase">Our Services</span>
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1}
              className="font-black text-white leading-[1.05] tracking-tight mb-5"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}>
              Everything You Need to{' '}
              <span className="text-[#3CB52A] italic">Grow</span>{' '}
              in the Digital Economy
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-white/55 text-lg leading-relaxed mb-8 max-w-2xl">
              15+ service categories. One trusted partner. iTech Network Africa delivers technology solutions built for organisations across the continent.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-3 mb-12">
              <Link href="/contact"
                className="inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2ea827] text-white text-sm font-bold px-7 py-3.5 rounded-full transition-all shadow-[0_6px_28px_rgba(60,181,42,0.40)] hover:-translate-y-0.5">
                Request a Free Quote <ArrowRight size={15} />
              </Link>
              <Link href="/portfolio"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-semibold px-6 py-3.5 rounded-full border border-white/20 hover:border-white/40 transition-all">
                See Our Work <ArrowRight size={14} />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp} custom={4} className="flex flex-wrap gap-6 lg:gap-10">
              {[
                { icon: Star,  value: '15+',  label: 'Service Categories' },
                { icon: Users, value: '30+',  label: 'Enterprise Clients'  },
                { icon: Globe, value: '5+',   label: 'Countries Served'    },
                { icon: Clock, value: '24/7', label: 'Support Available'   },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(60,181,42,0.12)' }}>
                    <Icon size={15} className="text-[#3CB52A]" />
                  </div>
                  <div>
                    <div className="text-white font-black text-lg leading-none">{value}</div>
                    <div className="text-white/40 text-xs mt-0.5">{label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══ FILTER NAV ══ */}
      <div className="sticky top-[56px] z-30 bg-white border-b border-[#E5E7EB] shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-2.5 items-center">
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFilter === 'all'
                  ? 'bg-[#0A1929] text-white'
                  : 'text-[#6B7280] hover:text-[#0A1929] hover:bg-[#F3F4F6]'
              }`}
            >
              All Services
            </button>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(isActive ? 'all' : cat.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#3CB52A] text-white'
                      : 'text-[#6B7280] hover:text-[#0A1929] hover:bg-[#F3F4F6]'
                  }`}
                >
                  <Icon size={12} />
                  {cat.title.split(' ').slice(0, 2).join(' ')}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══ SERVICE CARDS ══ */}
      <section className="bg-[#F8F9FA] py-14 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">

          {activeFilter === 'all' && (
            <div className="mb-10">
              <h2 className="text-2xl lg:text-3xl font-black text-[#0A1929] mb-2">All Service Categories</h2>
              <p className="text-[#6B7280] text-sm">Click <strong>Details</strong> on any card to learn more, or expand to see sub-services.</p>
            </div>
          )}

          <motion.div
            key={activeFilter}
            initial="hidden"
            animate="show"
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map((cat, i) => (
              <ServiceCard key={cat.id} cat={cat} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ HOW WE DELIVER ══ */}
      <section className="bg-white py-16 lg:py-24 border-t border-[#E5E7EB]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger} className="text-center mb-12">
            <motion.span variants={fadeUp} className="inline-block text-[#3CB52A] text-[11px] font-bold tracking-widest uppercase mb-3 bg-[#f0fdf4] border border-[#bbf7d0] px-4 py-1.5 rounded-full">
              Our Process
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl lg:text-4xl font-black text-[#060E18] mb-3">How We Deliver</motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-[#6B7280] max-w-md mx-auto text-sm">
              A structured, proven delivery approach — from first conversation to long-term support.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {PROCESS.map((step, i) => (
              <motion.div key={step.num} custom={i} variants={fadeUp}>
                <div className="relative bg-white border border-[#E5E7EB] rounded-2xl p-6 h-full hover:border-[#3CB52A]/40 hover:shadow-lg transition-all duration-300">
                  {/* Step number */}
                  <div className="w-11 h-11 rounded-xl bg-[#0A1929] flex items-center justify-center mb-4">
                    <span className="text-[#3CB52A] text-sm font-black">{step.num}</span>
                  </div>
                  <h3 className="font-black text-[#0A1929] text-base mb-2">{step.title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{step.desc}</p>

                  {/* Connector arrow (not last) */}
                  {i < PROCESS.length - 1 && (
                    <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-[#3CB52A] items-center justify-center shadow-md">
                      <ArrowRight size={12} className="text-white" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="relative bg-[#0A1929] py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{ backgroundImage: 'radial-gradient(circle, #3CB52A 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-1 bg-gradient-to-r from-transparent via-[#3CB52A]/40 to-transparent" />

        <div className="relative z-10 max-w-[900px] mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
            <motion.span variants={fadeUp} className="inline-block text-[#3CB52A] text-[11px] font-bold tracking-widest uppercase mb-5 bg-[#3CB52A]/10 border border-[#3CB52A]/25 px-4 py-1.5 rounded-full">
              Get Started Today
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-5 leading-tight">
              Need a Custom Solution?
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-white/50 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Our engineering team specialises in solving complex, unique business challenges. Tell us what you need — no commitment required.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact"
                className="inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2ea827] text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-[0_6px_28px_rgba(60,181,42,0.40)] hover:-translate-y-0.5 text-sm">
                Schedule a Free Consultation <ArrowRight size={16} />
              </Link>
              <Link href="/pricing"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-semibold px-6 py-4 rounded-2xl border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all">
                View Pricing Plans <ArrowRight size={14} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
