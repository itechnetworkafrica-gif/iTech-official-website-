import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, ChevronRight, Search, BookOpen, Shield, Cloud,
  Settings, Zap, Users, ArrowRight, Clock, Star, CheckCircle2,
  X, Lock, Globe, Database, Code2,
} from 'lucide-react';
import { Link } from 'wouter';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.55, delay, ease: EASE },
});

const CATEGORIES = [
  { id: 'all',          label: 'All Docs',         icon: FileText  },
  { id: 'getting-started', label: 'Getting Started', icon: Zap      },
  { id: 'platform',    label: 'Platform Guides',   icon: Settings  },
  { id: 'integration', label: 'Integrations',      icon: Code2     },
  { id: 'security',    label: 'Security',          icon: Shield    },
  { id: 'cloud',       label: 'Cloud & Infra',     icon: Cloud     },
  { id: 'admin',       label: 'Administration',    icon: Users     },
];

const DOCS = [
  {
    category: 'getting-started',
    title: 'Quick Start: Your First iTech Integration',
    desc: 'Spin up an API key, make your first authenticated request, and receive live data — all in under 30 minutes.',
    level: 'Beginner',
    readTime: '30 min',
    updated: 'Jul 2025',
    icon: Zap,
    featured: true,
  },
  {
    category: 'getting-started',
    title: 'Platform Overview & Architecture',
    desc: 'Understand the iTech Network Africa platform: core services, data flows, tenancy model, and regional deployment zones.',
    level: 'Beginner',
    readTime: '20 min',
    updated: 'Jun 2025',
    icon: Globe,
    featured: false,
  },
  {
    category: 'getting-started',
    title: 'Authentication & API Keys',
    desc: 'Generate, rotate, and scope API keys. Set up OAuth 2.0 flows and service-to-service bearer tokens.',
    level: 'Beginner',
    readTime: '15 min',
    updated: 'Jul 2025',
    icon: Lock,
    featured: false,
  },
  {
    category: 'platform',
    title: 'iTech CRM — Complete Configuration Guide',
    desc: 'Customise pipelines, fields, automations, and user roles for your CRM deployment. Includes multi-branch setup.',
    level: 'Intermediate',
    readTime: '45 min',
    updated: 'Jun 2025',
    icon: Users,
    featured: true,
  },
  {
    category: 'platform',
    title: 'POS System Setup & Terminal Pairing',
    desc: 'Pair hardware terminals, configure tax rules, set up receipt templates, and connect to your payment gateway.',
    level: 'Intermediate',
    readTime: '35 min',
    updated: 'May 2025',
    icon: Settings,
    featured: false,
  },
  {
    category: 'platform',
    title: 'ERP Module Configuration',
    desc: 'Set up inventory, purchasing, HR modules, and financial reporting within the iTech ERP platform.',
    level: 'Advanced',
    readTime: '60 min',
    updated: 'Apr 2025',
    icon: Database,
    featured: false,
  },
  {
    category: 'integration',
    title: 'REST API Integration Quickstart',
    desc: 'Authenticate and make your first API call with copy-ready code samples in JavaScript, Python, and PHP.',
    level: 'Intermediate',
    readTime: '20 min',
    updated: 'Jul 2025',
    icon: Code2,
    featured: true,
  },
  {
    category: 'integration',
    title: 'Webhook Events Reference',
    desc: 'Subscribe to platform events, validate HMAC signatures, handle retries, and debug delivery failures.',
    level: 'Intermediate',
    readTime: '25 min',
    updated: 'Jun 2025',
    icon: Zap,
    featured: false,
  },
  {
    category: 'integration',
    title: 'Third-Party App Connectors',
    desc: 'Connect iTech to M-Pesa, Flutterwave, Paystack, Mailchimp, Slack, and 40+ other services via native connectors.',
    level: 'Intermediate',
    readTime: '30 min',
    updated: 'May 2025',
    icon: Globe,
    featured: false,
  },
  {
    category: 'security',
    title: 'Enterprise Security Best Practices',
    desc: 'MFA enforcement, API key scoping, role-based access control, IP whitelisting, and audit log configuration.',
    level: 'Advanced',
    readTime: '40 min',
    updated: 'Jul 2025',
    icon: Shield,
    featured: true,
  },
  {
    category: 'security',
    title: 'Data Encryption & Privacy Compliance',
    desc: 'Encrypt data at rest and in transit. Configure GDPR, NDPA (Nigeria), and Kenya DPA compliance settings.',
    level: 'Advanced',
    readTime: '35 min',
    updated: 'Jun 2025',
    icon: Lock,
    featured: false,
  },
  {
    category: 'cloud',
    title: 'Cloud Deployment Checklist for Africa',
    desc: 'Pre-launch checklist for AWS, Azure, and GCP deployments with African data-residency and latency requirements.',
    level: 'Advanced',
    readTime: '25 min',
    updated: 'Jun 2025',
    icon: Cloud,
    featured: false,
  },
  {
    category: 'cloud',
    title: 'High Availability & Disaster Recovery',
    desc: 'Configure multi-zone redundancy, automated failover, and backup schedules for production deployments.',
    level: 'Advanced',
    readTime: '45 min',
    updated: 'May 2025',
    icon: Database,
    featured: false,
  },
  {
    category: 'admin',
    title: 'User Roles & Permissions Management',
    desc: 'Create custom roles, configure granular permissions, enable SSO, and audit user activity across your organisation.',
    level: 'Intermediate',
    readTime: '20 min',
    updated: 'Jul 2025',
    icon: Users,
    featured: false,
  },
  {
    category: 'admin',
    title: 'Multi-Tenancy & Branch Management',
    desc: 'Manage multiple business units, separate data by tenant, and configure inter-branch reporting hierarchies.',
    level: 'Advanced',
    readTime: '30 min',
    updated: 'Jun 2025',
    icon: Globe,
    featured: false,
  },
];

const LEVEL_COLORS: Record<string, string> = {
  Beginner:     'bg-emerald-50 text-emerald-700 border-emerald-200',
  Intermediate: 'bg-amber-50 text-amber-700 border-amber-200',
  Advanced:     'bg-rose-50 text-rose-700 border-rose-200',
};

export default function DocsPage() {
  const [active, setActive] = useState('all');
  const [query, setQuery] = useState('');

  const filtered = DOCS.filter(d => {
    const matchCat = active === 'all' || d.category === active;
    const matchQ = !query || d.title.toLowerCase().includes(query.toLowerCase()) || d.desc.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  const featured = DOCS.filter(d => d.featured);

  return (
    <div className="flex flex-col w-full bg-white">

      {/* HERO */}
      <section className="relative bg-[#060E18] pt-20 pb-24 overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        <div aria-hidden className="absolute left-0 top-0 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(60,181,42,0.07) 0%, transparent 65%)' }} />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
          {/* Breadcrumb */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="flex items-center gap-2 text-white/40 text-sm mb-10">
            <Link href="/"><span className="hover:text-white transition-colors cursor-pointer">Home</span></Link>
            <ChevronRight size={14} />
            <Link href="/resources"><span className="hover:text-white transition-colors cursor-pointer">Resources</span></Link>
            <ChevronRight size={14} />
            <span className="text-white/70">Documentation</span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#3CB52A]/15 border border-[#3CB52A]/30 mb-8">
                <FileText size={13} className="text-[#3CB52A]" />
                <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">Documentation</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1, ease: EASE }} className="text-5xl md:text-6xl font-black text-white leading-tight mb-5">
                Platform<br /><span className="text-[#3CB52A]">Documentation</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.16, ease: EASE }} className="text-white/50 text-lg leading-relaxed mb-8 max-w-lg">
                Comprehensive guides for every iTech platform — from first setup to advanced enterprise configuration.
              </motion.p>

              {/* Search */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.22 }} className="relative max-w-md">
                <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  placeholder="Search documentation…"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="w-full pl-11 pr-10 py-3.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#3CB52A]/40 focus:border-[#3CB52A]/60 transition-all backdrop-blur-sm"
                />
                {query && <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"><X size={15} /></button>}
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: EASE }} className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { value: '15+', label: 'Documentation Guides' },
                { value: '6',   label: 'Topic Categories' },
                { value: 'v2.x', label: 'Current Platform' },
                { value: 'Free', label: 'For All Clients' },
              ].map((s, i) => (
                <div key={i} className={`rounded-2xl p-8 ${i === 0 ? 'bg-[#3CB52A]' : 'bg-white/5 border border-white/10'}`}>
                  <div className="text-4xl font-black text-white mb-2">{s.value}</div>
                  <div className={`text-sm font-semibold ${i === 0 ? 'text-white/80' : 'text-white/40'}`}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      {!query && active === 'all' && (
        <section className="py-16 bg-[#F8F9FA] border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <motion.div {...fadeUp()} className="mb-10">
              <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase block mb-2">Most Popular</span>
              <h2 className="text-3xl font-black text-[#0A0A0A]">Featured Guides</h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.map((doc, i) => {
                const Icon = doc.icon;
                return (
                  <motion.div key={i} {...fadeUp(i * 0.06)} className="group bg-white border border-[#E5E7EB] rounded-2xl p-6 hover:border-[#3CB52A]/50 hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer">
                    <div className="w-11 h-11 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center mb-5 group-hover:bg-[#3CB52A] group-hover:border-[#3CB52A] transition-all">
                      <Icon size={19} className="text-[#3CB52A] group-hover:text-white transition-colors" />
                    </div>
                    <span className={`self-start text-[10px] font-bold px-2 py-0.5 rounded-full border mb-3 ${LEVEL_COLORS[doc.level]}`}>{doc.level}</span>
                    <h3 className="font-black text-[#0A0A0A] text-sm leading-snug mb-2 group-hover:text-[#3CB52A] transition-colors flex-grow">{doc.title}</h3>
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#F3F4F6]">
                      <span className="text-[#9CA3AF] text-xs flex items-center gap-1"><Clock size={11} />{doc.readTime}</span>
                      <span className="text-[#C4C4C4] text-xs">{doc.updated}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CATEGORY + DOCS */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* Sidebar */}
            <aside className="lg:w-56 shrink-0">
              <p className="text-[#9CA3AF] text-xs font-bold uppercase tracking-wider mb-4">Browse by Category</p>
              <nav className="flex flex-row lg:flex-col gap-2 flex-wrap">
                {CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  const isActive = active === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActive(cat.id)}
                      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${isActive ? 'bg-[#3CB52A] text-white shadow-md' : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#0A0A0A]'}`}
                    >
                      <Icon size={15} />
                      {cat.label}
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Docs Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-[#6B7280]">
                  <strong className="text-[#0A0A0A]">{filtered.length}</strong> {filtered.length === 1 ? 'guide' : 'guides'}
                  {query && <> for "<strong className="text-[#0A0A0A]">{query}</strong>"</>}
                </p>
                {query && <button onClick={() => setQuery('')} className="text-[#3CB52A] text-sm font-semibold flex items-center gap-1 hover:underline"><X size={13} /> Clear</button>}
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <BookOpen size={40} className="text-[#E5E7EB] mx-auto mb-4" />
                  <p className="text-[#9CA3AF] mb-3">No guides match your search.</p>
                  <button onClick={() => { setQuery(''); setActive('all'); }} className="text-[#3CB52A] font-semibold hover:underline text-sm">Browse all documentation</button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map((doc, i) => {
                    const Icon = doc.icon;
                    return (
                      <motion.div key={i} {...fadeUp(i * 0.04)} className="group bg-white border border-[#E5E7EB] rounded-2xl p-6 hover:border-[#3CB52A]/50 hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-10 h-10 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center group-hover:bg-[#3CB52A] group-hover:border-[#3CB52A] transition-all shrink-0">
                            <Icon size={17} className="text-[#3CB52A] group-hover:text-white transition-colors" />
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${LEVEL_COLORS[doc.level]}`}>{doc.level}</span>
                        </div>
                        <h3 className="font-black text-[#0A0A0A] text-sm leading-snug mb-2 group-hover:text-[#3CB52A] transition-colors">{doc.title}</h3>
                        <p className="text-[#6B7280] text-xs leading-relaxed flex-grow">{doc.desc}</p>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#F3F4F6]">
                          <div className="flex items-center gap-3">
                            <span className="text-[#9CA3AF] text-xs flex items-center gap-1"><Clock size={11} />{doc.readTime}</span>
                            <span className="text-[#C4C4C4] text-xs">{doc.updated}</span>
                          </div>
                          <span className="text-[#3CB52A] text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                            Read <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#060E18] py-20 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(60,181,42,0.08) 0%, transparent 60%)' }} />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <motion.div {...fadeUp()}>
            <CheckCircle2 size={36} className="text-[#3CB52A] mx-auto mb-5" />
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Still need help?</h2>
            <p className="text-white/50 mb-8 leading-relaxed">Our support engineers are available 24/7 to walk you through any guide or configuration.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/support"><span className="inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2da822] text-white font-bold px-7 py-3.5 rounded-xl transition-colors shadow-[0_6px_28px_rgba(60,181,42,0.35)] cursor-pointer">Open a Support Ticket</span></Link>
              <Link href="/resources"><span className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl transition-all hover:bg-white/5 cursor-pointer"><ArrowRight size={15} className="rotate-180" /> Back to Resources</span></Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
