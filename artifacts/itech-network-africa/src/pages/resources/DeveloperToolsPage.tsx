import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wrench, ChevronRight, Code2, Terminal, Package, Globe,
  Zap, Copy, CheckCheck, ArrowRight, Shield, Database,
  Play, BookOpen, ExternalLink,
} from 'lucide-react';
import { Link } from 'wouter';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.55, delay, ease: EASE },
});

const TOOLS = [
  {
    icon: Package,
    name: 'JavaScript / TypeScript SDK',
    tagline: 'Official Node.js & Browser SDK',
    desc: 'Full-featured SDK with TypeScript strict types, promise-based API, automatic retry with exponential backoff, and tree-shakeable ES modules.',
    install: 'npm install @itech-network/sdk',
    badge: 'v2.5.0',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    links: [{ label: 'Docs', href: '/resources/docs' }, { label: 'GitHub', href: '#' }, { label: 'Changelog', href: '/resources/changelog' }],
    featured: true,
  },
  {
    icon: Package,
    name: 'Python SDK',
    tagline: 'Async-first Python client',
    desc: 'Pythonic async/await client for the iTech API — full type hints, auto-pagination helper, and compatible with Python 3.10+.',
    install: 'pip install itech-network',
    badge: 'v2.3.1',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    links: [{ label: 'Docs', href: '/resources/docs' }, { label: 'PyPI', href: '#' }],
    featured: true,
  },
  {
    icon: Package,
    name: 'PHP SDK',
    tagline: 'Laravel-ready PHP library',
    desc: 'PSR-compatible library with a Laravel service provider, Guzzle HTTP client, and full Composer support. Supports PHP 8.1+.',
    install: 'composer require itech-network/php-sdk',
    badge: 'v2.1.0',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    links: [{ label: 'Docs', href: '/resources/docs' }, { label: 'Packagist', href: '#' }],
    featured: true,
  },
  {
    icon: Terminal,
    name: 'iTech CLI',
    tagline: 'Command-line control for everything',
    desc: 'Manage services, deploy configurations, rotate API keys, tail logs, and trigger webhooks — all from your terminal.',
    install: 'npm install -g @itech-network/cli',
    badge: 'v1.4.0',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    links: [{ label: 'CLI Docs', href: '/resources/docs' }, { label: 'GitHub', href: '#' }],
    featured: false,
  },
  {
    icon: Globe,
    name: 'Postman Collection',
    tagline: 'Pre-built API workspace',
    desc: 'Full Postman collection covering all v2 API endpoints with example request bodies, authentication pre-scripts, and environment variables.',
    install: null,
    badge: 'v2.x',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
    links: [{ label: 'Import to Postman', href: '#' }, { label: 'View Docs', href: '/resources/api' }],
    featured: false,
  },
  {
    icon: Play,
    name: 'Sandbox Environment',
    tagline: 'Test without real data',
    desc: 'Isolated sandbox tenant with seeded test data, separate API keys, and full platform access — your own risk-free development playground.',
    install: null,
    badge: 'Always On',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    links: [{ label: 'Open Sandbox', href: '#' }, { label: 'Sandbox Docs', href: '/resources/docs' }],
    featured: false,
  },
  {
    icon: Zap,
    name: 'Webhook Tester',
    tagline: 'Debug delivery in real time',
    desc: 'Inspect webhook payloads, simulate events, replay failed deliveries, and verify HMAC signatures — without touching production.',
    install: null,
    badge: 'Beta',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    links: [{ label: 'Open Tester', href: '#' }, { label: 'Webhook Docs', href: '/resources/api' }],
    featured: false,
  },
  {
    icon: Shield,
    name: 'API Key Manager',
    tagline: 'Create, scope, and rotate keys',
    desc: 'Generate scoped API keys from your dashboard, set IP restrictions, configure key expiry, and audit all key usage in one place.',
    install: null,
    badge: 'In Dashboard',
    badgeColor: 'bg-zinc-100 text-zinc-600 border-zinc-200',
    links: [{ label: 'Open Dashboard', href: '/portal' }, { label: 'Security Docs', href: '/resources/docs' }],
    featured: false,
  },
  {
    icon: Database,
    name: 'OpenAPI / Swagger Spec',
    tagline: 'Machine-readable API specification',
    desc: 'Download the full OpenAPI 3.1 spec for code generation, import into Insomnia, or use with any OpenAPI-compatible toolchain.',
    install: null,
    badge: 'OpenAPI 3.1',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    links: [{ label: 'Download Spec', href: '#' }, { label: 'API Reference', href: '/resources/api' }],
    featured: false,
  },
];

const CLI_COMMANDS = [
  { cmd: 'itech login',                      desc: 'Authenticate with your account' },
  { cmd: 'itech services list',              desc: 'List all active services' },
  { cmd: 'itech services restart <id>',      desc: 'Restart a specific service' },
  { cmd: 'itech logs tail <service-id>',     desc: 'Stream live logs from a service' },
  { cmd: 'itech keys create --scope=read',   desc: 'Generate a scoped API key' },
  { cmd: 'itech webhooks test <endpoint>',   desc: 'Send a test event to a webhook' },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <button onClick={copy} className="text-white/40 hover:text-white transition-colors flex items-center gap-1 text-xs shrink-0">
      {copied ? <><CheckCheck size={13} className="text-[#3CB52A]" /></> : <Copy size={13} />}
    </button>
  );
}

export default function DeveloperToolsPage() {
  const featured = TOOLS.filter(t => t.featured);
  const rest = TOOLS.filter(t => !t.featured);

  return (
    <div className="flex flex-col w-full bg-white">

      {/* HERO */}
      <section className="relative bg-[#060E18] pt-20 pb-24 overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        <div aria-hidden className="absolute right-0 top-0 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(60,181,42,0.06) 0%, transparent 65%)' }} />

        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 relative z-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="flex items-center gap-2 text-white/40 text-sm mb-10">
            <Link href="/"><span className="hover:text-white transition-colors cursor-pointer">Home</span></Link>
            <ChevronRight size={14} />
            <Link href="/resources"><span className="hover:text-white transition-colors cursor-pointer">Resources</span></Link>
            <ChevronRight size={14} />
            <span className="text-white/70">Developer Tools</span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#3CB52A]/15 border border-[#3CB52A]/30 mb-8">
                <Wrench size={13} className="text-[#3CB52A]" />
                <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">Developer Tools</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1, ease: EASE }} className="text-5xl md:text-6xl font-black text-white leading-tight mb-5">
                Build Faster<br />with <span className="text-[#3CB52A]">Official Tools</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.16, ease: EASE }} className="text-white/50 text-lg leading-relaxed mb-8 max-w-lg">
                SDKs, a CLI, Postman collection, sandbox environment, and more — everything developers need to integrate quickly and ship with confidence.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.22 }} className="flex flex-wrap gap-3">
                {[
                  { label: 'API Reference', href: '/resources/api' },
                  { label: 'Documentation', href: '/resources/docs' },
                ].map((l, i) => (
                  <Link key={i} href={l.href}>
                    <span className={`inline-flex items-center gap-1.5 text-sm font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer ${i === 0 ? 'bg-[#3CB52A] text-white hover:bg-[#2da822] shadow-[0_4px_20px_rgba(60,181,42,0.35)]' : 'border border-white/20 text-white hover:border-white/40 hover:bg-white/5'}`}>
                      {i === 0 ? <Code2 size={14} /> : <BookOpen size={14} />} {l.label}
                    </span>
                  </Link>
                ))}
              </motion.div>
            </div>

            {/* CLI quick preview */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: EASE }} className="bg-[#0D1B2A] border border-white/10 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/10">
                <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-rose-500/70" /><div className="w-3 h-3 rounded-full bg-amber-500/70" /><div className="w-3 h-3 rounded-full bg-emerald-500/70" /></div>
                <span className="text-white/30 text-xs font-mono ml-2">iTech CLI — terminal</span>
              </div>
              <div className="p-5 space-y-3">
                {CLI_COMMANDS.map((c, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span className="text-[#3CB52A] font-mono text-xs shrink-0 mt-0.5">$</span>
                      <div className="min-w-0">
                        <code className="text-white/80 font-mono text-xs">{c.cmd}</code>
                        <p className="text-white/30 text-[10px] mt-0.5">{c.desc}</p>
                      </div>
                    </div>
                    <CopyButton text={c.cmd} />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SDKs */}
      <section className="py-16 bg-[#F8F9FA] border-b border-[#E5E7EB]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <motion.div {...fadeUp()} className="mb-10">
            <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase block mb-2">Official SDKs</span>
            <h2 className="text-3xl font-black text-[#0A0A0A]">Client Libraries</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <motion.div key={i} {...fadeUp(i * 0.07)} className="group bg-white border border-[#E5E7EB] rounded-2xl p-7 hover:border-[#3CB52A]/50 hover:shadow-xl transition-all duration-300 flex flex-col">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center group-hover:bg-[#3CB52A] group-hover:border-[#3CB52A] transition-all shrink-0">
                      <Icon size={20} className="text-[#3CB52A] group-hover:text-white transition-colors" />
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${tool.badgeColor}`}>{tool.badge}</span>
                  </div>
                  <h3 className="font-black text-[#0A0A0A] text-lg mb-1">{tool.name}</h3>
                  <p className="text-[#9CA3AF] text-xs mb-3">{tool.tagline}</p>
                  <p className="text-[#6B7280] text-sm leading-relaxed flex-grow">{tool.desc}</p>

                  {tool.install && (
                    <div className="mt-5 bg-[#0D1B2A] rounded-xl px-4 py-3 flex items-center justify-between gap-2">
                      <code className="text-[#3CB52A] font-mono text-xs truncate">{tool.install}</code>
                      <CopyButton text={tool.install} />
                    </div>
                  )}

                  <div className="flex items-center gap-3 mt-5 pt-4 border-t border-[#F3F4F6]">
                    {tool.links.map((l, li) => (
                      <Link key={li} href={l.href}>
                        <span className={`text-xs font-bold flex items-center gap-1 cursor-pointer ${li === 0 ? 'text-[#3CB52A] hover:underline' : 'text-[#9CA3AF] hover:text-[#6B7280]'}`}>
                          {l.label} {li === 0 && <ArrowRight size={11} />}
                        </span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* OTHER TOOLS */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <motion.div {...fadeUp()} className="mb-10">
            <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase block mb-2">Toolchain</span>
            <h2 className="text-3xl font-black text-[#0A0A0A]">More Developer Tools</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <motion.div key={i} {...fadeUp(i * 0.06)} className="group bg-white border border-[#E5E7EB] rounded-2xl p-6 hover:border-[#3CB52A]/50 hover:shadow-lg transition-all duration-300 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center group-hover:bg-[#3CB52A] group-hover:border-[#3CB52A] transition-all shrink-0">
                      <Icon size={17} className="text-[#3CB52A] group-hover:text-white transition-colors" />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${tool.badgeColor}`}>{tool.badge}</span>
                  </div>
                  <h3 className="font-black text-[#0A0A0A] text-base mb-1">{tool.name}</h3>
                  <p className="text-[#9CA3AF] text-xs mb-2">{tool.tagline}</p>
                  <p className="text-[#6B7280] text-sm leading-relaxed flex-grow">{tool.desc}</p>

                  {tool.install && (
                    <div className="mt-4 bg-[#0D1B2A] rounded-xl px-4 py-2.5 flex items-center justify-between gap-2">
                      <code className="text-[#3CB52A] font-mono text-xs truncate">{tool.install}</code>
                      <CopyButton text={tool.install} />
                    </div>
                  )}

                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#F3F4F6]">
                    {tool.links.map((l, li) => (
                      <Link key={li} href={l.href}>
                        <span className={`text-xs font-bold flex items-center gap-1 cursor-pointer ${li === 0 ? 'text-[#3CB52A] hover:underline' : 'text-[#9CA3AF] hover:text-[#6B7280]'}`}>
                          {l.label} {li === 0 && <ExternalLink size={10} />}
                        </span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#060E18] py-20 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(60,181,42,0.08) 0%, transparent 60%)' }} />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <motion.div {...fadeUp()}>
            <Code2 size={36} className="text-[#3CB52A] mx-auto mb-5" />
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Need something custom?</h2>
            <p className="text-white/50 mb-8">Our developer relations team can assist with custom integrations, SDK feature requests, or enterprise toolchain support.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/support"><span className="inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2da822] text-white font-bold px-7 py-3.5 rounded-xl transition-colors shadow-[0_6px_28px_rgba(60,181,42,0.35)] cursor-pointer">Contact Dev Support</span></Link>
              <Link href="/resources/api"><span className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl transition-all hover:bg-white/5 cursor-pointer">API Reference <ArrowRight size={15} /></span></Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
