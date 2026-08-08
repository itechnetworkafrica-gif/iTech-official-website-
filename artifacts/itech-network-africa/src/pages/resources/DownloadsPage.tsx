import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download, ChevronRight, Monitor, Smartphone, Code2, FileText,
  Layers, ArrowRight, CheckCircle2, Shield, Package,
} from 'lucide-react';
import { Link } from 'wouter';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.55, delay, ease: EASE },
});

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Desktop Apps': Monitor,
  'Mobile Apps': Smartphone,
  'SDKs & Libraries': Code2,
  'Templates': FileText,
  'Brand Assets': Layers,
};

const DOWNLOADS = [
  // Desktop Apps
  {
    category: 'Desktop Apps',
    name: 'iTech CRM Desktop',
    desc: 'Full-featured CRM desktop client for Windows and macOS with offline sync and local data caching.',
    version: 'v2.4.1',
    size: '124 MB',
    platforms: ['Windows', 'macOS'],
    updated: 'Jul 2025',
    stable: true,
  },
  {
    category: 'Desktop Apps',
    name: 'iTech POS Terminal Client',
    desc: 'Point-of-sale desktop application — receipt printing, barcode scanning, and hardware terminal pairing.',
    version: 'v2.2.0',
    size: '89 MB',
    platforms: ['Windows'],
    updated: 'Jun 2025',
    stable: true,
  },
  {
    category: 'Desktop Apps',
    name: 'iTech ERP Dashboard',
    desc: 'Enterprise resource planning desktop client with inventory, HR, and financial module access.',
    version: 'v1.9.3',
    size: '210 MB',
    platforms: ['Windows', 'macOS', 'Linux'],
    updated: 'May 2025',
    stable: true,
  },

  // Mobile Apps
  {
    category: 'Mobile Apps',
    name: 'iTech Business App (Android)',
    desc: 'Manage your CRM, view analytics, approve requests, and receive push notifications on Android.',
    version: 'v3.1.0',
    size: '34 MB',
    platforms: ['Android 10+'],
    updated: 'Jul 2025',
    stable: true,
  },
  {
    category: 'Mobile Apps',
    name: 'iTech Business App (iOS)',
    desc: 'Full business management on iPhone and iPad — available directly from the App Store.',
    version: 'v3.1.0',
    size: '41 MB',
    platforms: ['iOS 16+'],
    updated: 'Jul 2025',
    stable: true,
  },
  {
    category: 'Mobile Apps',
    name: 'iTech Field Agent APK',
    desc: 'Lightweight Android APK for field agents — works offline, syncs on reconnect. Sideload for enterprise deployments.',
    version: 'v2.0.4',
    size: '18 MB',
    platforms: ['Android 9+'],
    updated: 'Jun 2025',
    stable: false,
  },

  // SDKs & Libraries
  {
    category: 'SDKs & Libraries',
    name: 'JavaScript / TypeScript SDK',
    desc: 'Official Node.js and browser SDK with full TypeScript types, promise-based API, and retry logic built in.',
    version: 'v2.5.0',
    size: '2.1 MB',
    platforms: ['Node 18+', 'Browser'],
    updated: 'Jul 2025',
    stable: true,
  },
  {
    category: 'SDKs & Libraries',
    name: 'Python SDK',
    desc: 'Pythonic client for the iTech REST API — supports async/await, auto-pagination, and type hints.',
    version: 'v2.3.1',
    size: '1.4 MB',
    platforms: ['Python 3.10+'],
    updated: 'Jun 2025',
    stable: true,
  },
  {
    category: 'SDKs & Libraries',
    name: 'PHP SDK',
    desc: 'PSR-compatible PHP library with Guzzle HTTP client, Laravel service provider, and Composer support.',
    version: 'v2.1.0',
    size: '980 KB',
    platforms: ['PHP 8.1+'],
    updated: 'May 2025',
    stable: true,
  },
  {
    category: 'SDKs & Libraries',
    name: 'Postman Collection',
    desc: 'Pre-configured Postman collection covering all API endpoints, auth flows, and example request bodies.',
    version: 'v2.x',
    size: '340 KB',
    platforms: ['Postman'],
    updated: 'Jul 2025',
    stable: true,
  },

  // Templates
  {
    category: 'Templates',
    name: 'API Integration Config Template',
    desc: 'Ready-made JSON configuration templates for common iTech API integration patterns and webhook setups.',
    version: 'v1.2',
    size: '48 KB',
    platforms: ['JSON'],
    updated: 'Jun 2025',
    stable: true,
  },
  {
    category: 'Templates',
    name: 'CRM Data Import Template',
    desc: 'Excel and CSV templates for bulk-importing contacts, companies, and deal data into iTech CRM.',
    version: 'v2.0',
    size: '120 KB',
    platforms: ['Excel', 'CSV'],
    updated: 'Jun 2025',
    stable: true,
  },
  {
    category: 'Templates',
    name: 'Cloud Deployment IaC Template',
    desc: 'Terraform and AWS CloudFormation templates for provisioning iTech-compatible infrastructure on AWS Africa.',
    version: 'v1.4',
    size: '220 KB',
    platforms: ['Terraform', 'CloudFormation'],
    updated: 'May 2025',
    stable: true,
  },

  // Brand Assets
  {
    category: 'Brand Assets',
    name: 'iTech Logo Pack',
    desc: 'Official logo files in SVG, PNG, and AI formats — light, dark, and mono variants for all use cases.',
    version: '2025 Edition',
    size: '8.4 MB',
    platforms: ['SVG', 'PNG', 'AI'],
    updated: 'Jan 2025',
    stable: true,
  },
  {
    category: 'Brand Assets',
    name: 'Brand Guidelines PDF',
    desc: 'Full brand style guide — colour palette, typography, logo usage rules, and do-not-use examples.',
    version: '2025 Edition',
    size: '5.2 MB',
    platforms: ['PDF'],
    updated: 'Jan 2025',
    stable: true,
  },
];

const CATEGORIES = ['All', ...Object.keys(CATEGORY_ICONS)];

export default function DownloadsPage() {
  const [active, setActive] = useState('All');

  const filtered = active === 'All' ? DOWNLOADS : DOWNLOADS.filter(d => d.category === active);

  const grouped = CATEGORIES.slice(1).reduce<Record<string, typeof DOWNLOADS>>((acc, cat) => {
    const items = filtered.filter(d => d.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  return (
    <div className="flex flex-col w-full bg-white">

      {/* HERO */}
      <section className="relative bg-[#060E18] pt-20 pb-24 overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        <div aria-hidden className="absolute right-0 bottom-0 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(60,181,42,0.06) 0%, transparent 65%)' }} />

        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 relative z-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="flex items-center gap-2 text-white/40 text-sm mb-10">
            <Link href="/"><span className="hover:text-white transition-colors cursor-pointer">Home</span></Link>
            <ChevronRight size={14} />
            <Link href="/resources"><span className="hover:text-white transition-colors cursor-pointer">Resources</span></Link>
            <ChevronRight size={14} />
            <span className="text-white/70">Downloads</span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#3CB52A]/15 border border-[#3CB52A]/30 mb-8">
                <Download size={13} className="text-[#3CB52A]" />
                <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">Downloads</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1, ease: EASE }} className="text-5xl md:text-6xl font-black text-white leading-tight mb-5">
                Apps, SDKs &<br /><span className="text-[#3CB52A]">Templates</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.16, ease: EASE }} className="text-white/50 text-lg leading-relaxed mb-8 max-w-lg">
                Everything you need to build, deploy, and integrate — desktop clients, mobile apps, SDKs, configuration templates, and official brand assets.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.22 }} className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3CB52A]/15 border border-[#3CB52A]/30">
                  <Shield size={14} className="text-[#3CB52A]" />
                  <span className="text-[#3CB52A] text-sm font-bold">All downloads are free for clients</span>
                </div>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: EASE }} className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { value: `${DOWNLOADS.length}+`, label: 'Available Downloads' },
                { value: '5',                    label: 'Categories' },
                { value: 'v2.x',                 label: 'Platform Version' },
                { value: 'Free',                 label: 'For All Clients' },
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

      {/* CATEGORY TABS */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#E5E7EB] shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <div className="flex gap-1 overflow-x-auto py-3 no-scrollbar">
            {CATEGORIES.map(cat => {
              const Icon = CATEGORY_ICONS[cat];
              const isActive = active === cat;
              return (
                <button key={cat} onClick={() => setActive(cat)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${isActive ? 'bg-[#3CB52A] text-white shadow-md' : 'text-[#6B7280] hover:bg-[#F3F4F6]'}`}>
                  {Icon && <Icon size={14} />}
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* DOWNLOADS */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 space-y-16">
          {Object.entries(grouped).map(([cat, items], gi) => {
            const Icon = CATEGORY_ICONS[cat] ?? Package;
            return (
              <div key={cat}>
                <motion.div {...fadeUp(gi * 0.05)} className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center">
                    <Icon size={18} className="text-[#3CB52A]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#0A0A0A]">{cat}</h2>
                    <p className="text-[#9CA3AF] text-sm">{items.length} download{items.length !== 1 ? 's' : ''}</p>
                  </div>
                </motion.div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {items.map((d, i) => (
                    <motion.div key={i} {...fadeUp(i * 0.06)} className="group bg-white border border-[#E5E7EB] rounded-2xl p-6 hover:border-[#3CB52A]/50 hover:shadow-lg transition-all duration-300 flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-black text-[#0A0A0A] text-base leading-snug">{d.name}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-[#6B7280] font-mono">{d.version}</span>
                            {d.stable
                              ? <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">Stable</span>
                              : <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">Beta</span>}
                          </div>
                        </div>
                      </div>

                      <p className="text-[#6B7280] text-sm leading-relaxed flex-grow">{d.desc}</p>

                      <div className="mt-5 pt-4 border-t border-[#F3F4F6]">
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {d.platforms.map((p, pi) => (
                            <span key={pi} className="text-[10px] font-semibold text-[#6B7280] bg-[#F8F9FA] border border-[#E5E7EB] px-2 py-0.5 rounded-md">{p}</span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#9CA3AF] text-xs">{d.size} · {d.updated}</span>
                          <button className="flex items-center gap-1.5 text-sm font-bold text-white bg-[#3CB52A] hover:bg-[#2da822] px-4 py-2 rounded-xl transition-colors shadow-sm">
                            <Download size={13} /> Download
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#060E18] py-20 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(60,181,42,0.08) 0%, transparent 60%)' }} />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <motion.div {...fadeUp()}>
            <CheckCircle2 size={36} className="text-[#3CB52A] mx-auto mb-5" />
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Need a custom build?</h2>
            <p className="text-white/50 mb-8">Enterprise clients can request custom installers, white-label builds, or offline deployment packages.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact"><span className="inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2da822] text-white font-bold px-7 py-3.5 rounded-xl transition-colors shadow-[0_6px_28px_rgba(60,181,42,0.35)] cursor-pointer">Contact Our Team</span></Link>
              <Link href="/resources"><span className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl transition-all hover:bg-white/5 cursor-pointer"><ArrowRight size={15} className="rotate-180" /> Back to Resources</span></Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
