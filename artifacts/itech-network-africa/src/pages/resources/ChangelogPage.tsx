import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock, ChevronRight, Zap, Shield, Bug, ArrowRight,
  Package, Star, AlertTriangle, CheckCircle2,
} from 'lucide-react';
import { Link } from 'wouter';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.55, delay, ease: EASE },
});

type TagType = 'New' | 'Improved' | 'Fix' | 'Security' | 'Breaking' | 'Deprecated';

const TAG_STYLES: Record<TagType, string> = {
  New:        'bg-emerald-50 text-emerald-700 border-emerald-200',
  Improved:   'bg-sky-50 text-sky-700 border-sky-200',
  Fix:        'bg-amber-50 text-amber-700 border-amber-200',
  Security:   'bg-purple-50 text-purple-700 border-purple-200',
  Breaking:   'bg-rose-50 text-rose-700 border-rose-200',
  Deprecated: 'bg-zinc-100 text-zinc-500 border-zinc-200',
};

const TAG_ICONS: Record<TagType, React.ElementType> = {
  New:        Zap,
  Improved:   Star,
  Fix:        Bug,
  Security:   Shield,
  Breaking:   AlertTriangle,
  Deprecated: Clock,
};

interface ChangeEntry {
  tag: TagType;
  text: string;
}

interface Release {
  version: string;
  date: string;
  label?: string;
  summary: string;
  changes: ChangeEntry[];
  products: string[];
}

const RELEASES: Release[] = [
  {
    version: 'v2.9.0',
    date: 'July 28, 2025',
    label: 'Latest',
    summary: 'Major AI assistant update, real-time analytics dashboard, and performance improvements across all platforms.',
    products: ['CRM', 'Analytics', 'API', 'AI Module'],
    changes: [
      { tag: 'New',      text: 'AI Assistant now supports multi-turn conversational flows with memory context across sessions.' },
      { tag: 'New',      text: 'Real-time analytics dashboard with live event streaming and customisable widget layout.' },
      { tag: 'New',      text: 'Webhook delivery retry queue with configurable backoff and DLQ (dead-letter queue) support.' },
      { tag: 'Improved', text: 'API response time improved by 38% through query optimisation and Redis cache layer expansion.' },
      { tag: 'Improved', text: 'CRM pipeline drag-and-drop now works on touch devices (iOS and Android mobile browsers).' },
      { tag: 'Fix',      text: 'Fixed date-range filter on the Reports page incorrectly applying UTC offset for GMT+1/+3 users.' },
      { tag: 'Fix',      text: 'Resolved duplicate webhook delivery occurring when the endpoint returned HTTP 500 on first attempt.' },
      { tag: 'Security', text: 'Session tokens now rotate on every privilege escalation event and are invalidated after 24 h of inactivity.' },
    ],
  },
  {
    version: 'v2.8.2',
    date: 'July 10, 2025',
    summary: 'Hotfix release addressing POS sync delays and a CRM import regression.',
    products: ['POS', 'CRM'],
    changes: [
      { tag: 'Fix', text: 'POS terminal sync delay resolved — transactions now post within 3 s under intermittent connectivity.' },
      { tag: 'Fix', text: 'CRM bulk import via CSV no longer silently drops rows when phone numbers contain spaces.' },
      { tag: 'Fix', text: 'Corrected dashboard layout shift on 1280 px-wide screens in the ERP financial overview module.' },
    ],
  },
  {
    version: 'v2.8.0',
    date: 'June 18, 2025',
    summary: 'Multi-branch administration, SSO improvements, new payment gateway connectors, and SDK v2.5.',
    products: ['Admin', 'SSO', 'Payments', 'SDK'],
    changes: [
      { tag: 'New',      text: 'Multi-branch management: create unlimited sub-branches under a parent account with isolated data scopes.' },
      { tag: 'New',      text: 'SAML 2.0 SSO support added alongside existing OAuth 2.0 (Google, Microsoft, Okta).' },
      { tag: 'New',      text: 'Native payment connectors for Flutterwave, Paystack, and M-Pesa released (replaces legacy webhook bridge).' },
      { tag: 'New',      text: 'JavaScript SDK v2.5.0 released with full TypeScript strict-mode types and tree-shakeable ES modules.' },
      { tag: 'Improved', text: 'Role editor now shows a live preview of permission sets before saving.' },
      { tag: 'Improved', text: 'ERP purchase-order approval workflow redesigned — now supports parallel approvers and delegated authority.' },
      { tag: 'Fix',      text: 'Fixed SSO redirect loop occurring when the IdP returned claims with non-standard email attribute.' },
      { tag: 'Security', text: 'All outbound webhook requests now include an HMAC-SHA256 signature header for payload verification.' },
    ],
  },
  {
    version: 'v2.7.0',
    date: 'May 5, 2025',
    summary: 'Cloud deployment templates, AI module GA, and breaking change to the Users API response shape.',
    products: ['Cloud', 'AI Module', 'API'],
    changes: [
      { tag: 'New',      text: 'AI & Automation module is now generally available (GA) — out of beta for all Business+ clients.' },
      { tag: 'New',      text: 'Terraform and AWS CloudFormation templates published for one-click iTech infrastructure provisioning.' },
      { tag: 'New',      text: 'Changelog now available in-app under Settings → Platform Updates.' },
      { tag: 'Improved', text: 'AI chatbot response latency reduced from ~2.1 s to ~0.6 s with async streaming output.' },
      { tag: 'Breaking', text: 'GET /users now returns a `meta.pagination` object instead of top-level `page`/`total` fields. Update your SDK to v2.4+ or adjust manual parsers.' },
      { tag: 'Deprecated', text: '`/v1/users` endpoints will be removed on December 31, 2025. Migrate to `/v2/users` now.' },
      { tag: 'Fix',      text: 'API rate-limit 429 responses now include `Retry-After` header in all cases (was missing for burst windows).' },
      { tag: 'Security', text: 'Enforced TLS 1.3 minimum for all platform-to-platform service calls; TLS 1.0 and 1.1 fully deprecated.' },
    ],
  },
  {
    version: 'v2.6.0',
    date: 'March 22, 2025',
    summary: 'Domain registrar integration, POS hardware support expansion, and mobile app v3.',
    products: ['Domains', 'POS', 'Mobile'],
    changes: [
      { tag: 'New',      text: 'Domain registration and DNS management fully integrated into the platform dashboard.' },
      { tag: 'New',      text: 'POS now supports Sunmi T2 Mini and Verifone P400 terminal models.' },
      { tag: 'New',      text: 'iTech Business mobile app v3.0 released — fully redesigned with bottom-nav and offline-first sync.' },
      { tag: 'Improved', text: 'Invoice PDF rendering engine replaced — now 5x faster and supports custom branding per branch.' },
      { tag: 'Fix',      text: 'Fixed inventory count discrepancy when stock adjustments were made while a stocktake was in progress.' },
    ],
  },
];

const ALL_TAGS: TagType[] = ['New', 'Improved', 'Fix', 'Security', 'Breaking', 'Deprecated'];

function Tag({ type }: { type: TagType }) {
  const Icon = TAG_ICONS[type];
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border ${TAG_STYLES[type]}`}>
      <Icon size={9} />{type}
    </span>
  );
}

export default function ChangelogPage() {
  const [filterTag, setFilterTag] = useState<TagType | 'All'>('All');

  return (
    <div className="flex flex-col w-full bg-white">

      {/* HERO */}
      <section className="relative bg-[#060E18] pt-20 pb-24 overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        <div aria-hidden className="absolute left-0 bottom-0 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(60,181,42,0.06) 0%, transparent 65%)' }} />

        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 relative z-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="flex items-center gap-2 text-white/40 text-sm mb-10">
            <Link href="/"><span className="hover:text-white transition-colors cursor-pointer">Home</span></Link>
            <ChevronRight size={14} />
            <Link href="/resources"><span className="hover:text-white transition-colors cursor-pointer">Resources</span></Link>
            <ChevronRight size={14} />
            <span className="text-white/70">Changelog</span>
          </motion.div>

          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#3CB52A]/15 border border-[#3CB52A]/30 mb-8">
              <Clock size={13} className="text-[#3CB52A]" />
              <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">Changelog</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1, ease: EASE }} className="text-5xl md:text-6xl font-black text-white leading-tight mb-5">
              What's<br /><span className="text-[#3CB52A]">New</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.16, ease: EASE }} className="text-white/50 text-lg leading-relaxed mb-8 max-w-lg">
              Release notes, feature announcements, fixes, and platform improvements across all iTech product lines.
            </motion.p>

            {/* Latest badge */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.22 }} className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10">
                <Package size={14} className="text-[#3CB52A]" />
                <span className="text-white/60 text-sm">Current: <strong className="text-white">v2.9.0</strong> · July 28, 2025</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#E5E7EB] shadow-sm">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <div className="flex gap-2 overflow-x-auto py-3 no-scrollbar">
            <button onClick={() => setFilterTag('All')} className={`text-xs font-bold px-4 py-2 rounded-xl border transition-all shrink-0 ${filterTag === 'All' ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#0A0A0A]/30'}`}>All Changes</button>
            {ALL_TAGS.map(t => {
              const Icon = TAG_ICONS[t];
              const isActive = filterTag === t;
              return (
                <button key={t} onClick={() => setFilterTag(t)} className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl border transition-all shrink-0 ${isActive ? `${TAG_STYLES[t]} shadow-sm` : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#6B7280]/30'}`}>
                  <Icon size={12} />{t}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TIMELINE */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[7px] top-3 bottom-3 w-px bg-[#E5E7EB] hidden sm:block" />

            <div className="space-y-12">
              {RELEASES.map((release, ri) => {
                const filteredChanges = filterTag === 'All' ? release.changes : release.changes.filter(c => c.tag === filterTag);
                if (filteredChanges.length === 0) return null;

                return (
                  <motion.div key={ri} {...fadeUp(ri * 0.06)} className="sm:pl-10 relative">
                    {/* Timeline dot */}
                    <div className="hidden sm:block absolute left-0 top-2 w-3.5 h-3.5 rounded-full bg-[#3CB52A] border-2 border-white shadow-[0_0_0_2px_#3CB52A] z-10" />

                    {/* Release header */}
                    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:border-[#3CB52A]/30 hover:shadow-lg transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-5 bg-[#F8F9FA] border-b border-[#E5E7EB]">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-black text-xl text-[#0A0A0A]">{release.version}</span>
                          {release.label && (
                            <span className="text-[10px] font-black text-white bg-[#3CB52A] px-2.5 py-1 rounded-full">{release.label}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex flex-wrap gap-1.5">
                            {release.products.map((p, pi) => (
                              <span key={pi} className="text-[10px] font-semibold text-[#6B7280] bg-white border border-[#E5E7EB] px-2.5 py-0.5 rounded-full">{p}</span>
                            ))}
                          </div>
                          <span className="text-[#9CA3AF] text-xs whitespace-nowrap flex items-center gap-1">
                            <Clock size={11} />{release.date}
                          </span>
                        </div>
                      </div>

                      <div className="px-6 py-5">
                        <p className="text-[#6B7280] text-sm mb-5 leading-relaxed">{release.summary}</p>
                        <ul className="space-y-3">
                          {filteredChanges.map((change, ci) => (
                            <li key={ci} className="flex items-start gap-3">
                              <Tag type={change.tag} />
                              <span className="text-[#374151] text-sm leading-relaxed">{change.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
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
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Stay up to date</h2>
            <p className="text-white/50 mb-8">Subscribe to release notifications or check the documentation for migration guides on breaking changes.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/resources/docs"><span className="inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2da822] text-white font-bold px-7 py-3.5 rounded-xl transition-colors shadow-[0_6px_28px_rgba(60,181,42,0.35)] cursor-pointer">Migration Guides <ArrowRight size={15} /></span></Link>
              <Link href="/resources"><span className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl transition-all hover:bg-white/5 cursor-pointer"><ArrowRight size={15} className="rotate-180" /> Back to Resources</span></Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
