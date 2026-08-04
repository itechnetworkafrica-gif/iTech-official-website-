import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code2, ChevronRight, Copy, CheckCheck, Lock, Zap, Users,
  Database, Globe, ArrowRight, Shield, Activity, Bell,
} from 'lucide-react';
import { Link } from 'wouter';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.55, delay, ease: EASE },
});

const METHOD_COLORS: Record<string, string> = {
  GET:    'bg-sky-50 text-sky-700 border-sky-200',
  POST:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  PUT:    'bg-amber-50 text-amber-700 border-amber-200',
  DELETE: 'bg-rose-50 text-rose-700 border-rose-200',
  PATCH:  'bg-purple-50 text-purple-700 border-purple-200',
};

const ENDPOINT_GROUPS = [
  {
    id: 'auth',
    icon: Lock,
    label: 'Authentication',
    desc: 'Generate and manage access tokens, refresh tokens, and API key authentication.',
    endpoints: [
      { method: 'POST', path: '/auth/token',          desc: 'Exchange credentials for an access + refresh token pair' },
      { method: 'POST', path: '/auth/refresh',        desc: 'Rotate an expired access token using a refresh token' },
      { method: 'POST', path: '/auth/revoke',         desc: 'Revoke an active token or API key immediately' },
      { method: 'GET',  path: '/auth/me',             desc: 'Return the currently authenticated identity and scopes' },
    ],
  },
  {
    id: 'users',
    icon: Users,
    label: 'Users & Roles',
    desc: 'Create, update, and manage user accounts, roles, and permission assignments.',
    endpoints: [
      { method: 'GET',    path: '/users',              desc: 'List all users (paginated, filterable by role and status)' },
      { method: 'POST',   path: '/users',              desc: 'Create a new user account within your organisation' },
      { method: 'GET',    path: '/users/:id',          desc: 'Retrieve a single user by ID' },
      { method: 'PATCH',  path: '/users/:id',          desc: 'Update name, email, status, or role assignments' },
      { method: 'DELETE', path: '/users/:id',          desc: 'Deactivate or permanently delete a user account' },
      { method: 'POST',   path: '/users/:id/roles',    desc: 'Assign one or more roles to a user' },
    ],
  },
  {
    id: 'services',
    icon: Globe,
    label: 'Services & Products',
    desc: 'Interact with iTech hosted services — CRM, POS, ERP, domain, and hosting APIs.',
    endpoints: [
      { method: 'GET',  path: '/services',             desc: 'List all active services on your account' },
      { method: 'GET',  path: '/services/:id',         desc: 'Get configuration and status for a specific service' },
      { method: 'POST', path: '/services/:id/restart', desc: 'Restart a hosted service instance' },
      { method: 'GET',  path: '/services/:id/logs',    desc: 'Stream or fetch recent service logs (last 1000 lines)' },
      { method: 'GET',  path: '/domains',              desc: 'List all registered or transferred domains on your account' },
      { method: 'POST', path: '/domains/check',        desc: 'Check availability for one or multiple domain names' },
    ],
  },
  {
    id: 'analytics',
    icon: Activity,
    label: 'Analytics & Reports',
    desc: 'Query usage metrics, generate reports, and pull business intelligence data.',
    endpoints: [
      { method: 'GET',  path: '/analytics/overview',   desc: 'High-level platform usage metrics for your account' },
      { method: 'GET',  path: '/analytics/events',     desc: 'Paginated event stream with filter, date-range, and type params' },
      { method: 'POST', path: '/analytics/reports',    desc: 'Generate a custom report; returns a downloadable URL' },
      { method: 'GET',  path: '/analytics/reports/:id', desc: 'Poll an async report by ID for status or result URL' },
    ],
  },
  {
    id: 'webhooks',
    icon: Bell,
    label: 'Webhooks',
    desc: 'Register endpoints, manage subscriptions, and inspect delivery history.',
    endpoints: [
      { method: 'GET',    path: '/webhooks',           desc: 'List all configured webhook endpoints for your account' },
      { method: 'POST',   path: '/webhooks',           desc: 'Register a new webhook endpoint with event subscriptions' },
      { method: 'PUT',    path: '/webhooks/:id',       desc: 'Update URL, secret, or subscribed event types' },
      { method: 'DELETE', path: '/webhooks/:id',       desc: 'Remove a webhook endpoint and all its subscriptions' },
      { method: 'GET',    path: '/webhooks/:id/deliveries', desc: 'Inspect delivery attempts, status codes, and payloads' },
      { method: 'POST',   path: '/webhooks/:id/test',  desc: 'Send a test event to verify the endpoint is reachable' },
    ],
  },
  {
    id: 'data',
    icon: Database,
    label: 'Data & Storage',
    desc: 'Manage files, object storage, and structured data exports.',
    endpoints: [
      { method: 'GET',    path: '/storage/files',      desc: 'List files and directories in your storage bucket' },
      { method: 'POST',   path: '/storage/upload',     desc: 'Upload a file (multipart/form-data, max 500 MB)' },
      { method: 'GET',    path: '/storage/files/:key', desc: 'Download a file by its storage key' },
      { method: 'DELETE', path: '/storage/files/:key', desc: 'Permanently delete a stored file' },
      { method: 'POST',   path: '/data/export',        desc: 'Export a full data snapshot (CRM, POS, ERP) as JSON or CSV' },
    ],
  },
];

const BASE_URL = 'https://api.itechnetworkafrica.com/v2';

const JS_SAMPLE = `const response = await fetch(
  '${BASE_URL}/users',
  {
    method: 'GET',
    headers: {
      Authorization: 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json',
    },
  }
);

const { data, meta } = await response.json();
console.log(data); // array of user objects`;

const PY_SAMPLE = `import requests

resp = requests.get(
    "${BASE_URL}/users",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json",
    },
)

data = resp.json()
print(data["data"])  # list of user objects`;

const PHP_SAMPLE = `$ch = curl_init("${BASE_URL}/users");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer YOUR_API_KEY",
        "Content-Type: application/json",
    ],
]);
$body = json_decode(curl_exec($ch), true);
print_r($body['data']);`;

type Lang = 'javascript' | 'python' | 'php';
const SAMPLES: Record<Lang, string> = { javascript: JS_SAMPLE, python: PY_SAMPLE, php: PHP_SAMPLE };

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="text-white/40 hover:text-white transition-colors flex items-center gap-1.5 text-xs">
      {copied ? <><CheckCheck size={13} className="text-[#3CB52A]" /> Copied</> : <><Copy size={13} /> Copy</>}
    </button>
  );
}

export default function ApiReferencePage() {
  const [activeGroup, setActiveGroup] = useState('auth');
  const [lang, setLang] = useState<Lang>('javascript');

  const group = ENDPOINT_GROUPS.find(g => g.id === activeGroup)!;

  return (
    <div className="flex flex-col w-full bg-white">

      {/* HERO */}
      <section className="relative bg-[#060E18] pt-20 pb-24 overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        <div aria-hidden className="absolute right-0 top-0 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(60,181,42,0.06) 0%, transparent 65%)' }} />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="flex items-center gap-2 text-white/40 text-sm mb-10">
            <Link href="/"><span className="hover:text-white transition-colors cursor-pointer">Home</span></Link>
            <ChevronRight size={14} />
            <Link href="/resources"><span className="hover:text-white transition-colors cursor-pointer">Resources</span></Link>
            <ChevronRight size={14} />
            <span className="text-white/70">API Reference</span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#3CB52A]/15 border border-[#3CB52A]/30 mb-8">
                <Code2 size={13} className="text-[#3CB52A]" />
                <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">API Reference</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1, ease: EASE }} className="text-5xl md:text-6xl font-black text-white leading-tight mb-5">
                REST API<br /><span className="text-[#3CB52A]">Reference</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.16, ease: EASE }} className="text-white/50 text-lg leading-relaxed mb-6 max-w-lg">
                Full reference for the iTech Network Africa REST API v2 — endpoints, parameters, authentication, and live code samples.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.22 }} className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-mono text-white/60">
                  <Globe size={14} className="text-[#3CB52A]" />
                  {BASE_URL}
                </div>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#3CB52A]/15 border border-[#3CB52A]/30">
                  <Zap size={13} className="text-[#3CB52A]" />
                  <span className="text-[#3CB52A] text-xs font-bold">v2 — Stable</span>
                </div>
              </motion.div>
            </div>

            {/* Quick-start code */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: EASE }} className="bg-[#0D1B2A] border border-white/10 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                <div className="flex gap-2">
                  {(['javascript', 'python', 'php'] as Lang[]).map(l => (
                    <button key={l} onClick={() => setLang(l)} className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${lang === l ? 'bg-[#3CB52A] text-white' : 'text-white/40 hover:text-white'}`}>{l}</button>
                  ))}
                </div>
                <CopyButton text={SAMPLES[lang]} />
              </div>
              <pre className="p-5 text-xs text-white/70 font-mono leading-relaxed overflow-x-auto whitespace-pre">{SAMPLES[lang]}</pre>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ENDPOINTS */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* Sidebar */}
            <aside className="lg:w-56 shrink-0">
              <p className="text-[#9CA3AF] text-xs font-bold uppercase tracking-wider mb-4">Endpoint Groups</p>
              <nav className="flex flex-row lg:flex-col gap-2 flex-wrap">
                {ENDPOINT_GROUPS.map(g => {
                  const Icon = g.icon;
                  const isActive = activeGroup === g.id;
                  return (
                    <button key={g.id} onClick={() => setActiveGroup(g.id)}
                      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${isActive ? 'bg-[#3CB52A] text-white shadow-md' : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#0A0A0A]'}`}>
                      <Icon size={15} />
                      {g.label}
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Endpoints */}
            <div className="flex-1">
              <motion.div {...fadeUp()} className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center">
                    {React.createElement(group.icon, { size: 17, className: 'text-[#3CB52A]' })}
                  </div>
                  <h2 className="text-2xl font-black text-[#0A0A0A]">{group.label}</h2>
                </div>
                <p className="text-[#6B7280] text-sm">{group.desc}</p>
              </motion.div>

              {/* Auth note */}
              <motion.div {...fadeUp(0.05)} className="flex items-start gap-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 mb-6">
                <Shield size={16} className="text-[#3CB52A] mt-0.5 shrink-0" />
                <p className="text-sm text-[#374151]">
                  All endpoints require an <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#E5E7EB] text-xs">Authorization: Bearer YOUR_API_KEY</code> header.
                  Generate keys in your <strong>Account → API Keys</strong> settings.
                </p>
              </motion.div>

              <div className="space-y-3">
                {group.endpoints.map((ep, i) => (
                  <motion.div key={i} {...fadeUp(i * 0.04)} className="group bg-white border border-[#E5E7EB] rounded-2xl p-5 hover:border-[#3CB52A]/40 hover:shadow-md transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <span className={`self-start sm:self-auto text-[11px] font-black px-3 py-1 rounded-lg border font-mono shrink-0 ${METHOD_COLORS[ep.method]}`}>{ep.method}</span>
                      <code className="font-mono text-sm text-[#0A0A0A] font-semibold flex-1 min-w-0">{ep.path}</code>
                      <span className="text-[#9CA3AF] text-xs group-hover:text-[#3CB52A] transition-colors flex items-center gap-1 shrink-0">
                        View details <ArrowRight size={11} />
                      </span>
                    </div>
                    <p className="text-[#6B7280] text-sm mt-2.5 leading-relaxed">{ep.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Response format */}
              <motion.div {...fadeUp(0.1)} className="mt-10 bg-[#0D1B2A] rounded-2xl overflow-hidden border border-white/10">
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                  <span className="text-white/60 text-xs font-bold uppercase tracking-wider">Standard Response Format</span>
                  <CopyButton text={`{\n  "ok": true,\n  "data": { /* resource */ },\n  "meta": {\n    "page": 1,\n    "per_page": 20,\n    "total": 143\n  }\n}`} />
                </div>
                <pre className="p-5 text-xs text-white/70 font-mono leading-relaxed">{`{
  "ok": true,
  "data": { /* resource or array of resources */ },
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 143
  }
}

// Error shape
{
  "ok": false,
  "error": {
    "code": "UNAUTHENTICATED",
    "message": "Invalid or expired API key.",
    "status": 401
  }
}`}</pre>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Rate limits */}
      <section className="py-14 bg-[#F8F9FA] border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div {...fadeUp()} className="mb-8">
            <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase block mb-2">Limits & Versioning</span>
            <h2 className="text-3xl font-black text-[#0A0A0A]">Rate Limits</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { tier: 'Starter',    rate: '100 req / min',  color: 'bg-white border border-[#E5E7EB]' },
              { tier: 'Growth',     rate: '500 req / min',  color: 'bg-white border border-[#E5E7EB]' },
              { tier: 'Business',   rate: '2,000 req / min', color: 'bg-white border border-[#3CB52A]/30' },
              { tier: 'Enterprise', rate: 'Unlimited',      color: 'bg-[#3CB52A] text-white' },
            ].map((t, i) => (
              <motion.div key={i} {...fadeUp(i * 0.06)} className={`rounded-2xl p-6 ${t.color}`}>
                <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${i === 3 ? 'text-white/70' : 'text-[#9CA3AF]'}`}>{t.tier}</p>
                <p className={`text-2xl font-black ${i === 3 ? 'text-white' : 'text-[#0A0A0A]'}`}>{t.rate}</p>
                <p className={`text-xs mt-1 ${i === 3 ? 'text-white/60' : 'text-[#9CA3AF]'}`}>Burst headers included</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#060E18] py-20 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(60,181,42,0.08) 0%, transparent 60%)' }} />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <motion.div {...fadeUp()}>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to integrate?</h2>
            <p className="text-white/50 mb-8">Get your API key from your dashboard, or explore our developer tools and Postman collection.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/resources/tools"><span className="inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2da822] text-white font-bold px-7 py-3.5 rounded-xl transition-colors shadow-[0_6px_28px_rgba(60,181,42,0.35)] cursor-pointer">Developer Tools</span></Link>
              <Link href="/resources/docs"><span className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl transition-all hover:bg-white/5 cursor-pointer">Read the Docs <ArrowRight size={15} /></span></Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
