import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import {
  CheckCircle2, ArrowRight, ShoppingCart, Layers, Users,
  Briefcase, GraduationCap, HeartPulse, Building2, Package,
  ChevronDown, ChevronUp, Zap, Shield, Globe, BarChart3,
} from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6, delay, ease: EASE },
});

/* ─── Solutions data ─── */
const SOLUTIONS = [
  {
    icon: ShoppingCart,
    title: 'POS Systems',
    industry: 'Retail & Hospitality',
    desc: 'Next-generation Point of Sale software designed for multi-location businesses, supermarkets, and restaurants.',
    features: ['Real-time inventory sync', 'Offline mode capability', 'Multi-store management', 'Employee shift tracking', 'Comprehensive sales reporting'],
    accent: '#3CB52A',
  },
  {
    icon: Layers,
    title: 'ERP Solutions',
    industry: 'Enterprise',
    desc: 'Unified Enterprise Resource Planning systems to connect finance, supply chain, operations, and commerce across your organisation.',
    features: ['Financial management', 'Supply chain visibility', 'Procurement automation', 'Project accounting', 'Custom dashboard analytics'],
    accent: '#3CB52A',
  },
  {
    icon: Users,
    title: 'CRM Systems',
    industry: 'Sales & Marketing',
    desc: 'Intelligent Customer Relationship Management to track leads, close deals, and build lasting client relationships.',
    features: ['Lead pipeline tracking', 'Automated email campaigns', 'Customer interaction history', 'Sales forecasting', 'WhatsApp & SMS integration'],
    accent: '#3CB52A',
  },
  {
    icon: Briefcase,
    title: 'HR Management',
    industry: 'Corporate',
    desc: 'End-to-end Human Resources software for recruitment, payroll, performance management, and employee self-service.',
    features: ['Automated payroll processing', 'Leave & attendance tracking', 'Performance appraisals', 'Recruitment pipeline', 'Employee self-service portal'],
    accent: '#3CB52A',
  },
  {
    icon: GraduationCap,
    title: 'School Management',
    industry: 'Education',
    desc: 'Comprehensive platform for K-12 and universities to manage students, academics, finance, and administration.',
    features: ['Student information system', 'Gradebook & report cards', 'Fee collection & invoicing', 'Parent communication portal', 'Timetable generation'],
    accent: '#3CB52A',
  },
  {
    icon: HeartPulse,
    title: 'Hospital Management',
    industry: 'Healthcare',
    desc: 'Secure, compliant HMS for clinics and hospitals to manage patient records, billing, pharmacy, and laboratory.',
    features: ['Electronic Health Records (EHR)', 'Appointment scheduling', 'Pharmacy inventory', 'Laboratory management', 'Insurance billing integration'],
    accent: '#3CB52A',
  },
  {
    icon: Building2,
    title: 'Church Management',
    industry: 'Non-Profit',
    desc: 'Dedicated software for religious organisations to manage memberships, donations, events, and communications.',
    features: ['Member directory', 'Tithe & offering tracking', 'Event scheduling', 'Volunteer management', 'Bulk SMS/Email communication'],
    accent: '#3CB52A',
  },
  {
    icon: Package,
    title: 'Inventory Management',
    industry: 'Logistics & Retail',
    desc: 'Advanced stock control systems to prevent stockouts, manage warehouses, and optimise your supply chain.',
    features: ['Barcode/QR scanning', 'Low stock alerts', 'Warehouse bin tracking', 'Supplier management', 'Purchase order automation'],
    accent: '#3CB52A',
  },
];

const WHY = [
  { icon: Zap,       title: 'Fast to Deploy',     desc: 'Most solutions go live in under 2 weeks with guided onboarding from our team.' },
  { icon: Globe,     title: 'Built for Africa',   desc: 'Designed with African infrastructure realities — offline-capable, low-bandwidth optimised.' },
  { icon: Shield,    title: 'Enterprise Security', desc: 'Role-based access, AES-256 encryption, audit trails, and compliance-ready from day one.' },
  { icon: BarChart3, title: 'Data You Can Act On', desc: 'Real-time dashboards and custom reports so every decision is backed by clean data.' },
];

const STATS = [
  { value: '8',    label: 'Industry Solutions' },
  { value: '200+', label: 'Enterprise Clients'  },
  { value: '10+',  label: 'African Countries'   },
  { value: '99%',  label: 'Client Satisfaction' },
];

/* ─── Solution card with expand/collapse ─── */
function SolutionCard({ s, index }: { s: typeof SOLUTIONS[0]; index: number }) {
  const [open, setOpen] = useState(false);
  const Icon = s.icon;

  return (
    <motion.div
      {...fadeUp(index * 0.06)}
      className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:border-[#3CB52A]/40 hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      {/* Header */}
      <div className="p-8">
        {/* Icon + industry */}
        <div className="flex items-start justify-between mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center group-hover:bg-[#3CB52A] group-hover:border-[#3CB52A] transition-all duration-300">
            <Icon size={24} className="text-[#3CB52A] group-hover:text-white transition-colors duration-300" />
          </div>
          <span className="text-[10px] font-bold text-[#3CB52A] bg-[#f0fdf4] border border-[#bbf7d0] px-3 py-1 rounded-full uppercase tracking-wider">
            {s.industry}
          </span>
        </div>

        <h3 className="text-2xl font-black text-[#0A0A0A] mb-3 leading-tight">{s.title}</h3>
        <p className="text-[#6B7280] leading-relaxed text-sm">{s.desc}</p>
      </div>

      {/* Features */}
      <div className="px-8 pb-2">
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center justify-between w-full py-3 border-t border-[#F3F4F6] text-sm font-semibold text-[#374151] hover:text-[#3CB52A] transition-colors"
        >
          <span>Key Features</span>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        <motion.div
          initial={false}
          animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
          transition={{ duration: 0.28, ease: EASE }}
          className="overflow-hidden"
        >
          <ul className="space-y-2.5 pb-4 pt-1">
            {s.features.map((f, i) => (
              <li key={i} className="flex items-start gap-3 text-[#4B5563] text-sm">
                <CheckCircle2 size={16} className="text-[#3CB52A] shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* CTA */}
      <div className="px-8 pb-8 mt-auto pt-4">
        <Link href="/contact">
          <a className="flex items-center justify-between w-full px-5 py-3 bg-[#0A1929] text-white font-semibold rounded-xl hover:bg-[#3CB52A] transition-colors duration-300 text-sm group/btn">
            <span>Request a Demo</span>
            <ArrowRight size={16} className="transform group-hover/btn:translate-x-1 transition-transform" />
          </a>
        </Link>
      </div>
    </motion.div>
  );
}

export default function SolutionsPage() {
  return (
    <div className="flex flex-col w-full bg-white">

      {/* ═══════════════════════════
          HERO
      ═══════════════════════════ */}
      <section className="relative bg-[#060E18] pt-20 pb-28 overflow-hidden">
        {/* Background grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        {/* Green glow */}
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(60,181,42,0.08) 0%, transparent 65%)' }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-white/40 text-sm mb-12"
          >
            <Link href="/"><a className="hover:text-white transition-colors">Home</a></Link>
            <span>/</span>
            <span className="text-white/70">Solutions</span>
          </motion.div>

          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#3CB52A]/15 border border-[#3CB52A]/30 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-[#3CB52A] animate-pulse" />
              <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">Ready-to-Deploy Software</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
              className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6"
            >
              Enterprise<br /><span className="text-[#3CB52A]">Solutions</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18, ease: EASE }}
              className="text-white/55 text-xl leading-relaxed mb-10 max-w-2xl"
            >
              Robust, scalable, and secure management platforms tailored to specific industry workflows.
              Built to streamline your operations from day one.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.26 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/contact">
                <a className="inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2da822] text-white font-bold px-7 py-3.5 rounded-xl transition-colors shadow-[0_6px_28px_rgba(60,181,42,0.4)]">
                  Request a Demo <ArrowRight size={17} />
                </a>
              </Link>
              <Link href="/pricing">
                <a className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl transition-all hover:bg-white/5">
                  View Pricing
                </a>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          STATS STRIP
      ═══════════════════════════ */}
      <section className="bg-[#0A1929] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
                className="py-8 px-8 text-center"
              >
                <div className="text-3xl md:text-4xl font-black text-white mb-1">{s.value}</div>
                <div className="text-white/40 text-xs font-semibold uppercase tracking-wider">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          WHY iTECH SOLUTIONS
      ═══════════════════════════ */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div {...fadeUp()} className="text-center max-w-xl mx-auto mb-14">
            <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase block mb-3">Why iTech</span>
            <h2 className="text-4xl font-black text-[#0A0A0A] leading-tight">Built Different. Built for Africa.</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY.map((w, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.07)}
                className="bg-white rounded-2xl p-7 border border-[#E5E7EB] hover:border-[#3CB52A]/40 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center mb-5">
                  <w.icon size={22} className="text-[#3CB52A]" />
                </div>
                <h3 className="font-bold text-[#0A0A0A] mb-2">{w.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{w.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          SOLUTIONS GRID
      ═══════════════════════════ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div {...fadeUp()} className="mb-14">
            <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase block mb-3">All Solutions</span>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <h2 className="text-4xl md:text-5xl font-black text-[#0A0A0A] leading-tight">
                Pick Your<br />Industry
              </h2>
              <p className="text-[#6B7280] text-sm max-w-xs leading-relaxed">
                Click "Key Features" on any card to expand the feature list. Every solution is customisable to your business.
              </p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {SOLUTIONS.map((s, i) => (
              <SolutionCard key={i} s={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          BOTTOM CTA
      ═══════════════════════════ */}
      <section className="bg-[#060E18] py-24 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 80%, rgba(60,181,42,0.08) 0%, transparent 60%)' }}
        />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <motion.div {...fadeUp()}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3CB52A]/15 border border-[#3CB52A]/30 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#3CB52A] animate-pulse" />
              <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">Get Started Today</span>
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
              Not sure which solution<br />fits your business?
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              Our team will analyse your workflow and recommend the right solution — at no cost.
              Most clients are live within two weeks.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact">
                <a className="inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2da822] text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-[0_6px_28px_rgba(60,181,42,0.4)]">
                  Book a Free Consultation <ArrowRight size={17} />
                </a>
              </Link>
              <Link href="/pricing">
                <a className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:bg-white/5">
                  See Pricing Plans
                </a>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
