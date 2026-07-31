import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import {
  Monitor, Smartphone, Code, PenTool, Layers, Cloud,
  Zap, Headphones, Shield, Network, Camera, Printer,
  BookOpen, Briefcase, Package, Megaphone,
  ArrowRight, CheckCircle2, ChevronDown, ChevronUp,
  Globe, Users, Star, Clock,
} from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.07, ease: EASE } }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

/* ─── Data ─── */
interface SubService { label: string }
interface ServiceCategory {
  id: string;
  icon: React.ElementType;
  title: string;
  desc: string;
  color: string;
  bg: string;
  highlights: string[];
  items: SubService[];
}

const CATEGORIES: ServiceCategory[] = [
  {
    id: 'web-design',
    icon: Monitor,
    title: 'Web Design & Development',
    desc: 'Stunning, fast websites for every industry — from landing pages to full enterprise portals.',
    color: '#3CB52A',
    bg: '#f0fdf4',
    highlights: ['Business & Corporate Websites', 'E-commerce Stores', 'Custom Portals & Platforms'],
    items: [
      { label: 'Business Websites' }, { label: 'Corporate Websites' }, { label: 'NGO & Nonprofit Websites' },
      { label: 'Government Websites' }, { label: 'School & University Websites' }, { label: 'Church Websites' },
      { label: 'E-commerce Stores' }, { label: 'Real Estate Websites' }, { label: 'Hotel & Hospitality Websites' },
      { label: 'Healthcare Websites' }, { label: 'News & Magazine Websites' }, { label: 'Portfolio Websites' },
      { label: 'Landing Pages' }, { label: 'Website Redesign' }, { label: 'Website Maintenance & Support' },
      { label: 'Website Speed Optimisation' }, { label: 'Domain Registration' }, { label: 'Web Hosting' },
      { label: 'SSL Certificates' }, { label: 'Website Security' },
    ],
  },
  {
    id: 'software',
    icon: Code,
    title: 'Software Development',
    desc: 'Bespoke enterprise software, ERP, CRM, and management systems built around your workflows.',
    color: '#0A7EBF',
    bg: '#eff6ff',
    highlights: ['Custom ERP & CRM Systems', 'Hospital & School Management', 'API & Database Development'],
    items: [
      { label: 'Custom Software Development' }, { label: 'ERP Systems' }, { label: 'CRM Systems' },
      { label: 'School Management Systems' }, { label: 'Hospital Management Systems' }, { label: 'HR & Payroll Systems' },
      { label: 'Inventory Management Systems' }, { label: 'Accounting Systems' }, { label: 'POS Systems' },
      { label: 'Booking & Reservation Systems' }, { label: 'Custom Business Applications' },
      { label: 'API Development & Integration' }, { label: 'Database Development' },
    ],
  },
  {
    id: 'mobile',
    icon: Smartphone,
    title: 'Mobile App Development',
    desc: 'Native and cross-platform iOS & Android apps that users love — from concept to App Store.',
    color: '#7C3AED',
    bg: '#f5f3ff',
    highlights: ['Android & iOS Apps', 'Cross-Platform Development', 'E-commerce & Business Apps'],
    items: [
      { label: 'Android Apps' }, { label: 'iOS Apps' }, { label: 'Cross-Platform Apps' },
      { label: 'Business Apps' }, { label: 'E-commerce Apps' }, { label: 'Education Apps' },
      { label: 'Healthcare Apps' }, { label: 'App Maintenance & Support' },
    ],
  },
  {
    id: 'digital-marketing',
    icon: Megaphone,
    title: 'Digital Marketing',
    desc: 'Grow your audience, generate leads, and dominate search rankings across every channel.',
    color: '#EA580C',
    bg: '#fff7ed',
    highlights: ['SEO & Google Ads', 'Social Media Management', 'Email & SMS Campaigns'],
    items: [
      { label: 'Social Media Management' }, { label: 'Social Media Advertising' }, { label: 'Google Ads (PPC)' },
      { label: 'Facebook & Instagram Ads' }, { label: 'Search Engine Optimisation (SEO)' },
      { label: 'Email Marketing' }, { label: 'SMS Marketing' }, { label: 'Content Marketing' },
      { label: 'Online Reputation Management' },
    ],
  },
  {
    id: 'branding',
    icon: PenTool,
    title: 'Graphic Design & Branding',
    desc: 'Professional visual identities, marketing collateral, and creative assets that make your brand unforgettable.',
    color: '#DB2777',
    bg: '#fdf2f8',
    highlights: ['Logo & Brand Identity', 'Marketing Collateral', 'Social Media Graphics'],
    items: [
      { label: 'Logo Design' }, { label: 'Brand Identity' }, { label: 'Business Cards' },
      { label: 'Flyers & Posters' }, { label: 'Brochures & Company Profiles' }, { label: 'Banners & Billboards' },
      { label: 'Social Media Graphics' }, { label: 'Presentation Design' }, { label: 'Infographics' },
      { label: 'Product Packaging' },
    ],
  },
  {
    id: 'ui-ux',
    icon: Layers,
    title: 'UI/UX Design',
    desc: 'User-centred interfaces that drive engagement, reduce friction, and convert visitors into customers.',
    color: '#0891B2',
    bg: '#ecfeff',
    highlights: ['Website & App UI Design', 'User Research & Prototyping', 'Dashboard Design'],
    items: [
      { label: 'Website UI Design' }, { label: 'Mobile App UI Design' }, { label: 'Dashboard Design' },
      { label: 'User Research' }, { label: 'Wireframing' }, { label: 'Prototyping' },
    ],
  },
  {
    id: 'cloud',
    icon: Cloud,
    title: 'Cloud & IT Services',
    desc: 'Secure, scalable cloud infrastructure and managed IT solutions on AWS, Azure, and Google Cloud.',
    color: '#0369A1',
    bg: '#eff6ff',
    highlights: ['Cloud Migration & Hosting', 'Microsoft 365 & Google Workspace', 'Server & Backup Management'],
    items: [
      { label: 'Cloud Migration' }, { label: 'Cloud Hosting' }, { label: 'Microsoft 365 Setup' },
      { label: 'Google Workspace Setup' }, { label: 'Business Email Setup' },
      { label: 'Cloud Backup & Recovery' }, { label: 'Server Management' },
    ],
  },
  {
    id: 'cybersecurity',
    icon: Shield,
    title: 'Cybersecurity',
    desc: 'Enterprise-grade security audits, penetration testing, and continuous threat protection.',
    color: '#DC2626',
    bg: '#fef2f2',
    highlights: ['Security Audits & Pen Testing', 'Firewall & Data Protection', 'Cybersecurity Training'],
    items: [
      { label: 'Website Security' }, { label: 'Security Audits' }, { label: 'Vulnerability Assessment' },
      { label: 'Penetration Testing' }, { label: 'Data Backup & Recovery' },
      { label: 'Firewall Configuration' }, { label: 'Cybersecurity Training' },
    ],
  },
  {
    id: 'networking',
    icon: Network,
    title: 'Networking & Infrastructure',
    desc: 'End-to-end network installation, CCTV, access control, and structured cabling for any scale.',
    color: '#4F46E5',
    bg: '#eef2ff',
    highlights: ['Network & Wi-Fi Installation', 'CCTV & Access Control', 'Server & Structured Cabling'],
    items: [
      { label: 'Network Installation' }, { label: 'Office Network Setup' }, { label: 'Wi-Fi Installation' },
      { label: 'CCTV Installation' }, { label: 'Access Control Systems' },
      { label: 'Biometric Systems' }, { label: 'Server Installation' }, { label: 'Structured Cabling' },
    ],
  },
  {
    id: 'it-consulting',
    icon: Briefcase,
    title: 'IT Consulting',
    desc: 'Strategic technology advisory to drive digital transformation and accelerate your business growth.',
    color: '#065F46',
    bg: '#ecfdf5',
    highlights: ['Digital Transformation', 'IT Strategy & Planning', 'Business Process Automation'],
    items: [
      { label: 'Digital Transformation' }, { label: 'IT Strategy & Planning' }, { label: 'Technology Consulting' },
      { label: 'Business Process Automation' }, { label: 'Project Management' }, { label: 'ICT Policy Development' },
    ],
  },
  {
    id: 'multimedia',
    icon: Camera,
    title: 'Creative Media',
    desc: 'Professional photography, videography, motion graphics, and multimedia production.',
    color: '#B45309',
    bg: '#fffbeb',
    highlights: ['Photography & Videography', 'Motion Graphics & Animation', 'Podcast & Live Streaming'],
    items: [
      { label: 'Photography' }, { label: 'Videography' }, { label: 'Motion Graphics' },
      { label: 'Video Editing' }, { label: 'Animation' }, { label: 'Live Streaming' },
      { label: 'Podcast Production' },
    ],
  },
  {
    id: 'printing',
    icon: Printer,
    title: 'Printing & Promotional',
    desc: 'Large-format printing, branded merchandise, signage, and corporate promotional materials.',
    color: '#9D174D',
    bg: '#fdf2f8',
    highlights: ['Large Format & T-Shirt Printing', 'ID Cards & Stickers', 'Branded Merchandise & Signage'],
    items: [
      { label: 'Large Format Printing' }, { label: 'T-Shirt Printing' }, { label: 'ID Card Printing' },
      { label: 'Stickers & Labels' }, { label: 'Branded Merchandise' }, { label: 'Signage' },
    ],
  },
  {
    id: 'support',
    icon: Headphones,
    title: 'Technical Support',
    desc: '24/7 remote and on-site IT support, hardware repairs, and helpdesk services.',
    color: '#047857',
    bg: '#ecfdf5',
    highlights: ['Remote & On-site IT Support', 'Computer & Laptop Repairs', '24/7 Helpdesk Services'],
    items: [
      { label: 'Remote IT Support' }, { label: 'On-site IT Support' }, { label: 'Help Desk Services' },
      { label: 'Computer Repairs' }, { label: 'Laptop Repairs' }, { label: 'Printer Support' },
      { label: 'Software Installation' },
    ],
  },
  {
    id: 'business',
    icon: Package,
    title: 'Business Solutions',
    desc: 'Digital payment integration, customer portals, e-signature, and document management platforms.',
    color: '#6D28D9',
    bg: '#f5f3ff',
    highlights: ['Online Payment Integration', 'Client & Vendor Portals', 'Document & E-signature Solutions'],
    items: [
      { label: 'Business Email Solutions' }, { label: 'Digital Document Management' }, { label: 'E-signature Solutions' },
      { label: 'Online Payment Integration' }, { label: 'Appointment Booking Systems' },
      { label: 'Customer Portal Development' }, { label: 'Client Portal Development' }, { label: 'Vendor Portal Development' },
    ],
  },
  {
    id: 'training',
    icon: BookOpen,
    title: 'ICT Training',
    desc: 'Hands-on training programmes in Microsoft Office, cybersecurity, AI tools, and professional tech skills.',
    color: '#0F766E',
    bg: '#f0fdfa',
    highlights: ['Microsoft Office Training', 'AI Tools & Digital Skills', 'Cybersecurity Awareness'],
    items: [
      { label: 'Microsoft Office Training' }, { label: 'AI Tools Training' }, { label: 'Cybersecurity Awareness' },
      { label: 'Digital Skills Training' }, { label: 'Software User Training' },
    ],
  },
];

const PROCESS = [
  { num: '01', title: 'Discovery', desc: 'We listen to your goals, audit your current setup, and map out requirements.' },
  { num: '02', title: 'Strategy', desc: 'Our architects design a tailored roadmap aligned to your timeline and budget.' },
  { num: '03', title: 'Build', desc: 'Agile sprints with regular reviews, rigorous QA, and transparent progress.' },
  { num: '04', title: 'Launch & Support', desc: 'Smooth go-live, full training, and 24/7 ongoing support.' },
];

/* ─── Service Card ─── */
function ServiceCard({ cat, index }: { cat: ServiceCategory; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = cat.icon;

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      className="group flex flex-col bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-xl hover:border-transparent transition-all duration-300"
      style={{ ['--accent' as string]: cat.color }}
    >
      {/* Top colour bar */}
      <div className="h-1 w-full" style={{ background: cat.color }} />

      <div className="flex flex-col flex-1 p-6">
        {/* Icon + title */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
            style={{ backgroundColor: cat.bg }}
          >
            <Icon size={22} style={{ color: cat.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[#0A1929] text-base leading-tight mb-1">{cat.title}</h3>
            <p className="text-[#6B7280] text-xs leading-relaxed line-clamp-2">{cat.desc}</p>
          </div>
        </div>

        {/* Highlights */}
        <div className="space-y-2 mb-5 flex-1">
          {cat.highlights.map((h) => (
            <div key={h} className="flex items-start gap-2">
              <CheckCircle2 size={13} className="shrink-0 mt-0.5" style={{ color: cat.color }} />
              <span className="text-xs text-[#374151] font-medium leading-snug">{h}</span>
            </div>
          ))}
        </div>

        {/* Service count badge + expand toggle */}
        <div className="border-t border-[#F3F4F6] pt-4 flex items-center justify-between">
          <button
            onClick={() => setExpanded(v => !v)}
            className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
            style={{ color: cat.color }}
          >
            {expanded ? 'Hide' : `+${cat.items.length} services`}
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
          <Link
            href={`/services/${cat.id}`}
            className="flex items-center gap-1 text-xs font-semibold text-[#6B7280] hover:text-[#0A1929] transition-colors group/link"
          >
            Details <ArrowRight size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Expanded sub-services */}
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
                    key={item.label}
                    className="text-[10px] font-medium px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: cat.bg, color: cat.color }}
                  >
                    {item.label}
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

/* ─── Main Page ─── */
export default function ServicesPage() {
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? CATEGORIES : CATEGORIES.filter(c => c.id === filter);

  return (
    <div className="flex flex-col w-full overflow-x-hidden">

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section
        className="relative bg-[#060E18] overflow-hidden"
        style={{ paddingTop: 'clamp(6rem, 12vw, 9rem)', paddingBottom: 'clamp(4rem, 8vw, 6rem)' }}
      >
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '48px 48px' }}
        />
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(60,181,42,0.12) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-12">
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="max-w-3xl"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#3CB52A]/30 mb-6" style={{ background: 'rgba(60,181,42,0.08)' }}>
              <Zap size={12} className="text-[#3CB52A]" />
              <span className="text-[#3CB52A] text-[11px] font-bold tracking-[0.18em] uppercase">Our Services</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-black text-white leading-[1.05] tracking-tight mb-5"
              style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4rem)' }}
            >
              Everything You Need to{' '}
              <span className="text-[#3CB52A] italic">Grow</span>{' '}
              in the Digital Economy
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-white/55 text-lg leading-relaxed mb-8 max-w-2xl">
              From enterprise software to creative media — iTech Network Africa delivers 15+ service categories built for organisations across the continent.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-3 mb-12">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2ea827] text-white text-sm font-bold px-7 py-3.5 rounded-full transition-all shadow-[0_6px_28px_rgba(60,181,42,0.45)] hover:-translate-y-0.5"
              >
                Request a Free Quote <ArrowRight size={15} />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 text-white/75 hover:text-white text-sm font-semibold px-6 py-3.5 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all"
              >
                See Our Work <ArrowRight size={14} />
              </Link>
            </motion.div>

            {/* Stats strip */}
            <motion.div variants={fadeUp} custom={4} className="flex flex-wrap gap-6 lg:gap-10">
              {[
                { icon: Star,  value: '15+', label: 'Service Categories'  },
                { icon: Users, value: '30+', label: 'Enterprise Clients'  },
                { icon: Globe, value: '5+',  label: 'Countries Served'    },
                { icon: Clock, value: '24/7',label: 'Support Available'   },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(60,181,42,0.12)' }}>
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

      {/* ════════════════════════════════════════
          QUICK-FILTER NAV
      ════════════════════════════════════════ */}
      <div className="sticky top-[56px] z-30 bg-white border-b border-[#E5E7EB] shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-2.5 items-center">
            <button
              onClick={() => setFilter('all')}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === 'all'
                  ? 'bg-[#3CB52A] text-white shadow-sm'
                  : 'text-[#6B7280] hover:text-[#3CB52A] hover:bg-[#f0fdf4]'
              }`}
            >
              All Services
            </button>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setFilter(filter === cat.id ? 'all' : cat.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    filter === cat.id
                      ? 'text-white shadow-sm'
                      : 'text-[#6B7280] hover:text-[#0A1929] hover:bg-[#F3F4F6]'
                  }`}
                  style={filter === cat.id ? { backgroundColor: cat.color } : {}}
                >
                  <Icon size={12} />
                  {cat.title.split(' ').slice(0, 2).join(' ')}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          SERVICE CARDS GRID
      ════════════════════════════════════════ */}
      <section className="bg-[#F8F9FA] py-14 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">

          {filter === 'all' && (
            <div className="mb-10">
              <h2 className="text-2xl lg:text-3xl font-black text-[#0A1929] mb-2">All Service Categories</h2>
              <p className="text-[#6B7280] text-sm">Click any card to expand the full list of sub-services.</p>
            </div>
          )}

          <motion.div
            key={filter}
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

      {/* ════════════════════════════════════════
          HOW WE DELIVER
      ════════════════════════════════════════ */}
      <section className="bg-white py-16 lg:py-24 border-t border-[#E5E7EB]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.span variants={fadeUp} className="inline-block text-[#3CB52A] text-[11px] font-bold tracking-widest uppercase mb-3 bg-[#f0fdf4] px-4 py-1.5 rounded-full">
              Our Process
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl lg:text-4xl font-black text-[#060E18] mb-3">
              How We Deliver
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-[#6B7280] max-w-lg mx-auto">
              A structured, proven delivery approach — from first conversation to long-term support.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative"
          >
            {/* Connector line (desktop) */}
            <div className="hidden lg:block absolute top-9 left-[12.5%] right-[12.5%] h-px" style={{ background: 'linear-gradient(90deg, transparent, #E5E7EB 15%, #E5E7EB 85%, transparent)' }} />

            {PROCESS.map((step, i) => (
              <motion.div key={step.num} custom={i} variants={fadeUp} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative z-10 w-18 h-18 mb-5">
                    <div className="w-[68px] h-[68px] rounded-2xl bg-[#0A1929] flex flex-col items-center justify-center shadow-lg shadow-black/10">
                      <span className="text-[#3CB52A] text-[10px] font-black tracking-widest">{step.num}</span>
                    </div>
                  </div>
                  <h3 className="text-base font-black text-[#0A1929] mb-2">{step.title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA
      ════════════════════════════════════════ */}
      <section className="relative bg-[#0A1929] py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #3CB52A 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-1 bg-gradient-to-r from-transparent via-[#3CB52A]/40 to-transparent" />

        <div className="relative z-10 max-w-[900px] mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            <motion.span variants={fadeUp} className="inline-block text-[#3CB52A] text-[11px] font-bold tracking-widest uppercase mb-5 bg-[#3CB52A]/10 border border-[#3CB52A]/25 px-4 py-1.5 rounded-full">
              Get Started Today
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-5 leading-tight">
              Need a Custom Solution?
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-white/50 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Our engineering team specialises in solving complex, unique business challenges. Tell us what you need.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2ea827] text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-[0_6px_28px_rgba(60,181,42,0.40)] hover:-translate-y-0.5 text-sm"
              >
                Schedule a Free Consultation <ArrowRight size={16} />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-semibold px-6 py-4 rounded-2xl border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all"
              >
                View Pricing Plans <ArrowRight size={14} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
