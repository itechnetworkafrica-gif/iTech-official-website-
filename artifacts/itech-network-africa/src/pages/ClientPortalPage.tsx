import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderOpen, FileText, Headphones, Download,
  LogOut, User, Lock, Mail, Phone, Shield, ArrowRight,
  Menu, X, Clock, CheckCircle2, AlertCircle, ExternalLink,
  Building2, Star, FolderX, InboxIcon, FileX, HardDrive,
  TrendingUp, Zap, MessageSquarePlus, ChevronRight,
} from 'lucide-react';
import { Link } from 'wouter';
import { findClient, verifyPassword, type PortalClient } from '@/lib/portalClients';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'projects',  label: 'Projects',   icon: FolderOpen      },
  { id: 'invoices',  label: 'Invoices',   icon: FileText        },
  { id: 'tickets',   label: 'Tickets',    icon: Headphones      },
  { id: 'downloads', label: 'Downloads',  icon: Download        },
  { id: 'profile',   label: 'Profile',    icon: User            },
];

const STATUS_COLOR: Record<string, string> = {
  Active:    'bg-emerald-50 text-emerald-700',
  Completed: 'bg-sky-50 text-sky-700',
  'On Hold': 'bg-amber-50 text-amber-700',
};

const STATUS_DOT: Record<string, string> = {
  Active:    'bg-emerald-400',
  Completed: 'bg-sky-400',
  'On Hold': 'bg-amber-400',
};

function EmptyState({ icon: Icon, title, message, action }: {
  icon: React.ElementType; title: string; message: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
        <Icon size={26} className="text-slate-300" />
      </div>
      <h3 className="text-sm font-bold text-slate-700 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-400 max-w-xs leading-relaxed mb-5">{message}</p>
      {action && (
        <a
          href={action.href}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3CB52A] hover:underline"
        >
          {action.label} <ArrowRight size={14} />
        </a>
      )}
    </div>
  );
}

/* ─────────────────────────────
   Dashboard
───────────────────────────── */
function Dashboard({ client, onNavigate }: { client: PortalClient; onNavigate: (s: string) => void }) {
  const activeProjects    = client.projects.filter(p => p.status === 'Active').length;
  const completedProjects = client.projects.filter(p => p.status === 'Completed').length;
  const total             = client.projects.length;

  return (
    <div className="space-y-5">
      {/* Welcome hero */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0A1929] p-6 md:p-8">
        <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-[#3CB52A]/5 -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute right-12 bottom-0 w-36 h-36 rounded-full bg-[#3CB52A]/5 translate-y-1/2 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#3CB52A] animate-pulse" /> Client Portal
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
              Welcome back, {client.name.split(' ')[0]} 👋
            </h2>
            <p className="text-white/40 text-sm max-w-md">
              Your secure workspace — projects, invoices, support, and files from iTech Network Africa.
            </p>
          </div>
          <div className="shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-[#3CB52A]/20 border border-[#3CB52A]/30 flex items-center justify-center text-[#3CB52A] font-black text-2xl">
              {client.name[0]}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Active Projects',  value: activeProjects || '0',  icon: TrendingUp,  color: 'text-[#3CB52A]', bg: 'bg-[#f0fdf4]', section: 'projects'  },
          { label: 'Completed',        value: completedProjects || '0', icon: CheckCircle2, color: 'text-sky-600',   bg: 'bg-sky-50',   section: 'projects'  },
          { label: 'Open Invoices',    value: '0',                    icon: FileText,    color: 'text-violet-600', bg: 'bg-violet-50', section: 'invoices'  },
          { label: 'Member Since',     value: client.memberSince,     icon: Star,        color: 'text-amber-600',  bg: 'bg-amber-50',  section: null        },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, ease: EASE, duration: 0.4 }}
            onClick={() => s.section && onNavigate(s.section)}
            className={`bg-white rounded-2xl p-4 md:p-5 border border-slate-100 shadow-sm ${s.section ? 'cursor-pointer hover:border-[#3CB52A]/30 hover:shadow-md' : ''} transition-all`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.bg}`}>
              <s.icon size={17} className={s.color} />
            </div>
            <div className="text-xl font-black text-[#0A1929]">{s.value}</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Projects preview */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-[#0A1929] flex items-center gap-2">
            <FolderOpen size={16} className="text-[#3CB52A]" />
            Your Projects
          </h3>
          {total > 0 && (
            <button onClick={() => onNavigate('projects')} className="text-xs font-semibold text-[#3CB52A] hover:underline flex items-center gap-1">
              View all <ChevronRight size={13} />
            </button>
          )}
        </div>

        {total === 0 ? (
          <EmptyState
            icon={FolderX}
            title="No projects yet"
            message="Your projects will appear here once your account manager adds them."
            action={{ label: 'Contact your account manager', href: '/contact' }}
          />
        ) : (
          <div className="divide-y divide-slate-50">
            {client.projects.map(p => (
              <div key={p.id} className="px-6 py-4 flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[p.status] ?? 'bg-slate-300'}`} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-[#0A1929] truncate">{p.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{p.type} · Started {p.startDate}</div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${STATUS_COLOR[p.status]}`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: MessageSquarePlus, label: 'Open a Support Ticket', desc: 'Report an issue or request help', href: '/support',  color: 'text-violet-600', bg: 'bg-violet-50' },
          { icon: Zap,               label: 'Browse Our Services',   desc: 'See what else we can do for you', href: '/services', color: 'text-[#3CB52A]', bg: 'bg-[#f0fdf4]'  },
          { icon: Mail,              label: 'Contact Account Manager', desc: 'Direct line to your manager',  href: 'mailto:itechnetworkafrica@gmail.com', color: 'text-sky-600', bg: 'bg-sky-50' },
        ].map((a, i) => (
          <a
            key={i}
            href={a.href}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-start gap-3 hover:border-[#3CB52A]/30 hover:shadow-md transition-all group"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${a.bg}`}>
              <a.icon size={17} className={a.color} />
            </div>
            <div>
              <div className="text-sm font-bold text-[#0A1929] group-hover:text-[#3CB52A] transition-colors">{a.label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{a.desc}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────
   Projects
───────────────────────────── */
function Projects({ client }: { client: PortalClient }) {
  const active    = client.projects.filter(p => p.status === 'Active');
  const completed = client.projects.filter(p => p.status === 'Completed');
  const onHold    = client.projects.filter(p => p.status === 'On Hold');

  const groups = [
    { label: 'Active', items: active, empty: false },
    { label: 'On Hold', items: onHold, empty: false },
    { label: 'Completed', items: completed, empty: false },
  ].filter(g => g.items.length > 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-[#0A1929]">My Projects</h2>
          <p className="text-sm text-slate-400 mt-0.5">{client.projects.length} project{client.projects.length !== 1 ? 's' : ''} on your account</p>
        </div>
        <div className="flex gap-2">
          {[
            { label: `${active.length} Active`,    color: 'bg-emerald-50 text-emerald-700' },
            { label: `${completed.length} Done`,   color: 'bg-sky-50 text-sky-700'         },
          ].map(b => (
            <span key={b.label} className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${b.color}`}>{b.label}</span>
          ))}
        </div>
      </div>

      {client.projects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <EmptyState
            icon={FolderX}
            title="No projects yet"
            message="Projects will be added by your iTech account manager. Check back soon or get in touch."
            action={{ label: 'Contact us', href: '/contact' }}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {(groups.length > 0 ? groups.flatMap(g => g.items) : client.projects).map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, ease: EASE }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
              <div className={`h-1 ${p.status === 'Active' ? 'bg-emerald-400' : p.status === 'Completed' ? 'bg-sky-400' : 'bg-amber-400'}`} />
              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] text-slate-400 font-mono">{p.id}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${STATUS_COLOR[p.status]}`}>{p.status}</span>
                    </div>
                    <h3 className="font-black text-[#0A1929] text-lg leading-tight">{p.name}</h3>
                    <p className="text-sm text-slate-400 mt-0.5">{p.type}</p>
                  </div>
                </div>

                {p.description && (
                  <p className="text-sm text-slate-600 leading-relaxed mb-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
                    {p.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5"><Clock size={12} /> Started {p.startDate}</span>
                  <span className="flex items-center gap-1.5"><User size={12} /> {p.manager}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────
   Invoices
───────────────────────────── */
function Invoices() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-[#0A1929]">Invoices</h2>
        <p className="text-sm text-slate-400 mt-0.5">Your billing history and outstanding payments</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <EmptyState
          icon={FileX}
          title="No invoices yet"
          message="Your invoices will appear here once your account manager adds them."
        />
      </div>

      <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#3CB52A]/15 flex items-center justify-center shrink-0">
          <FileText size={18} className="text-[#3CB52A]" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-[#166534]">Need a copy of an invoice?</p>
          <p className="text-xs text-[#166534]/70 mt-0.5">Email our billing team and they'll send it within 24 hours.</p>
        </div>
        <a
          href="mailto:itechnetworkafrica@gmail.com?subject=Invoice%20Request"
          className="shrink-0 text-sm font-bold text-[#3CB52A] hover:underline flex items-center gap-1"
        >
          Request Invoice <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}

/* ─────────────────────────────
   Support Tickets
───────────────────────────── */
function Tickets() {
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject]   = useState('');
  const [message, setMessage]   = useState('');
  const [sent, setSent]         = useState(false);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    // Opens email client pre-filled — lightweight frontend-only solution
    window.location.href = `mailto:itechnetworkafrica@gmail.com?subject=${encodeURIComponent('[Support] ' + subject)}&body=${encodeURIComponent(message)}`;
    setSent(true);
    setShowForm(false);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-[#0A1929]">Support Tickets</h2>
          <p className="text-sm text-slate-400 mt-0.5">Track issues and requests with our technical team</p>
        </div>
        <button
          onClick={() => { setShowForm(v => !v); setSent(false); }}
          className="flex items-center gap-1.5 bg-[#3CB52A] hover:bg-[#2e911f] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shrink-0"
        >
          <MessageSquarePlus size={15} /> New Ticket
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSend} className="bg-white rounded-2xl border border-[#3CB52A]/30 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-[#0A1929]">Open a Support Ticket</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Website bug, Feature request…"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#3CB52A] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Message</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Describe the issue or request in detail…"
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#3CB52A] transition-colors resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#3CB52A] hover:bg-[#2e911f] text-white text-sm font-bold transition-colors">
                  Send via Email
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
              </div>
              <p className="text-xs text-slate-400">This will open your email client pre-filled with your message.</p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {sent && (
        <motion.div
          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-[#f0fdf4] border border-[#BBF7D0] rounded-2xl p-4 text-sm text-[#166534]"
        >
          <CheckCircle2 size={16} className="text-[#3CB52A] shrink-0" />
          Ticket sent! Our team will get back to you within 24 hours.
        </motion.div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <EmptyState
          icon={InboxIcon}
          title="No support tickets"
          message="You haven't raised any support tickets yet. Use the button above to open a new request."
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────
   Downloads
───────────────────────────── */
function Downloads() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-[#0A1929]">Downloads</h2>
        <p className="text-sm text-slate-400 mt-0.5">Project files, reports, and deliverable assets</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <EmptyState
          icon={HardDrive}
          title="No files yet"
          message="Downloadable assets, reports, and project deliverables will appear here once uploaded."
          action={{ label: 'Contact account manager', href: '/contact' }}
        />
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
          <Download size={16} className="text-slate-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-700">Looking for a specific file?</p>
          <p className="text-xs text-slate-400 mt-0.5">Your account manager can share project files directly to this section. <a href="mailto:itechnetworkafrica@gmail.com" className="text-[#3CB52A] hover:underline font-semibold">Email us</a> to request a file.</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────
   Profile
───────────────────────────── */
function Profile({ client }: { client: PortalClient }) {
  const initials = client.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const tierColors: Record<string, string> = {
    Standard:   'bg-blue-50 text-blue-700 border border-blue-200',
    Business:   'bg-violet-50 text-violet-700 border border-violet-200',
    Enterprise: 'bg-amber-50 text-amber-700 border border-amber-200',
  };

  return (
    <div className="space-y-5 max-w-lg">
      <div>
        <h2 className="text-xl font-black text-[#0A1929]">My Profile</h2>
        <p className="text-sm text-slate-400 mt-0.5">Your account details</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Avatar header */}
        <div className="bg-[#0A1929] px-6 pt-8 pb-16 relative">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #3CB52A 0%, transparent 60%)' }} />
        </div>
        <div className="px-6 pb-6 -mt-10 relative">
          <div className="w-20 h-20 rounded-2xl bg-[#3CB52A] border-4 border-white shadow-lg flex items-center justify-center text-white font-black text-2xl mb-3">
            {initials}
          </div>
          <div className="flex flex-wrap items-start gap-3">
            <div>
              <h3 className="text-xl font-black text-[#0A1929]">{client.name}</h3>
              <p className="text-sm text-slate-400">{client.role} · {client.organisation}</p>
            </div>
            <span className={`mt-1 text-[10px] font-bold px-3 py-1 rounded-full ${tierColors[client.tier] ?? 'bg-slate-100 text-slate-600'}`}>
              {client.tier} Client
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="border-t border-slate-50 px-6 py-4 space-y-3">
          {[
            { icon: Mail,      label: 'Email',        value: client.email        },
            { icon: Phone,     label: 'Phone',        value: client.phone        },
            { icon: Building2, label: 'Organisation', value: client.organisation },
            { icon: Shield,    label: 'Plan',         value: `${client.tier} Client` },
            { icon: Clock,     label: 'Member Since', value: client.memberSince  },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                <Icon size={14} className="text-slate-400" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-medium">{label}</div>
                <div className="text-sm font-semibold text-slate-700">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
        <strong>Need to update your details?</strong> Contact your account manager at{' '}
        <a href="mailto:itechnetworkafrica@gmail.com" className="underline font-semibold">
          itechnetworkafrica@gmail.com
        </a>
      </div>
    </div>
  );
}

/* ─────────────────────────────
   Portal Shell (after login)
───────────────────────────── */
function PortalShell({ client, onLogout }: { client: PortalClient; onLogout: () => void }) {
  const [section, setSection]       = useState('dashboard');
  const [mobileNavOpen, setMobileNav] = useState(false);

  const sectionMap: Record<string, React.ReactNode> = {
    dashboard: <Dashboard client={client} onNavigate={setSection} />,
    projects:  <Projects client={client} />,
    invoices:  <Invoices />,
    tickets:   <Tickets />,
    downloads: <Downloads />,
    profile:   <Profile client={client} />,
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">

      {/* Top bar */}
      <header className="h-16 bg-[#0A1929] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setMobileNav(v => !v)}
          >
            {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <img
            src="/logo-icon.png"
            alt="iTech Network Africa"
            className="w-7 h-7 rounded object-contain"
            onError={e => (e.currentTarget.style.display = 'none')}
          />
          <span className="text-white font-bold text-sm">Client Portal</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-right mr-1">
            <div className="text-white text-xs font-semibold">{client.name}</div>
            <div className="text-white/30 text-[10px]">{client.tier} Client</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#3CB52A] flex items-center justify-center text-white font-bold text-sm shrink-0">
            {client.name[0]}
          </div>
          <button
            onClick={onLogout}
            className="ml-1 w-9 h-9 flex items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            title="Log out"
          >
            <LogOut size={17} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative">

        {/* Sidebar (desktop) */}
        <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-slate-100 sticky top-16 h-[calc(100vh-4rem)] pt-4 pb-6">
          <nav className="flex-1 px-3 space-y-0.5">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  section === item.id
                    ? 'bg-[#f0fdf4] text-[#3CB52A]'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-[#0A1929]'
                }`}
              >
                <item.icon size={16} className={section === item.id ? 'text-[#3CB52A]' : 'text-slate-400'} />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="px-4 mt-4 space-y-3">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <p className="text-xs text-slate-400 mb-1.5 leading-tight">Questions? Reach admin</p>
              <a href="mailto:itechnetworkafrica@gmail.com" className="text-xs font-bold text-[#3CB52A] hover:underline flex items-center gap-1">
                Email us <ExternalLink size={11} />
              </a>
            </div>
            <a href="/" className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-[#3CB52A] transition-colors px-1">
              <ExternalLink size={12} /> Back to website
            </a>
          </div>
        </aside>

        {/* Mobile overlay nav */}
        <AnimatePresence>
          {mobileNavOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 z-20 top-16"
                onClick={() => setMobileNav(false)}
              />
              <motion.aside
                initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                className="lg:hidden fixed left-0 top-16 bottom-0 w-56 bg-white border-r border-slate-100 z-30 flex flex-col pt-4 pb-6"
              >
                <nav className="flex-1 px-3 space-y-0.5">
                  {NAV_ITEMS.map(item => (
                    <button
                      key={item.id}
                      onClick={() => { setSection(item.id); setMobileNav(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                        section === item.id ? 'bg-[#f0fdf4] text-[#3CB52A]' : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <item.icon size={16} />
                      {item.label}
                    </button>
                  ))}
                </nav>
                <div className="px-4 mt-4">
                  <a href="mailto:itechnetworkafrica@gmail.com" className="text-xs font-bold text-[#3CB52A] hover:underline flex items-center gap-1">
                    Contact Admin <ExternalLink size={11} />
                  </a>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-8 min-w-0 pb-24 lg:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              {sectionMap[section]}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-20 flex items-center justify-around px-1 py-1 shadow-lg">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => { setSection(item.id); setMobileNav(false); }}
            className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl flex-1 transition-colors ${
              section === item.id ? 'text-[#3CB52A]' : 'text-slate-400'
            }`}
          >
            <item.icon size={19} />
            <span className="text-[9px] font-semibold leading-none">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

/* ─────────────────────────────
   Login screen
───────────────────────────── */
function LoginScreen({ onLogin }: { onLogin: (client: PortalClient) => void }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) { setError('Please enter your email and password.'); return; }

    setLoading(true);
    setTimeout(() => {
      const client = findClient(email);
      if (!client || !verifyPassword(password, client.passwordHash)) {
        setError('Invalid email or password. Contact us if you need access.');
        setLoading(false);
        return;
      }
      setLoading(false);
      onLogin(client);
    }, 900);
  }

  return (
    <div
      className="flex flex-col w-full min-h-screen bg-[#060E18]"
      style={{ backgroundImage: 'radial-gradient(ellipse at 65% 30%, rgba(60,181,42,0.07) 0%, transparent 60%)' }}
    >
      <div className="pt-16 pb-10 text-center px-6">
        <img
          src="/logo-icon.png"
          alt="iTech Network Africa"
          className="h-14 w-14 object-contain mx-auto mb-8 rounded-2xl"
          onError={e => (e.currentTarget.style.display = 'none')}
        />
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3CB52A]/15 border border-[#3CB52A]/30 mb-5">
          <Lock size={12} className="text-[#3CB52A]" />
          <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">Secure Client Area</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Client Portal</h1>
        <p className="text-white/40 text-sm max-w-xs mx-auto leading-relaxed">
          Access is managed by the iTech Network Africa admin team.
        </p>
      </div>

      <div className="flex-1 flex items-start justify-center px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="neon-border shadow-[0_0_40px_rgba(0,229,255,0.15)]">
            <div className="neon-glass">
              <h2 className="text-2xl font-black text-white mb-1 text-center">Welcome Back</h2>
              <p className="text-white/40 text-sm mb-7 text-center">Sign in to your client portal</p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-5"
                >
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com" autoComplete="email"
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-transparent border-2 border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#00e5ff] transition-all"
                      onFocus={e => (e.currentTarget.style.boxShadow = '0 0 15px rgba(0,229,255,0.2)')}
                      onBlur={e  => (e.currentTarget.style.boxShadow = 'none')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="password" value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••" autoComplete="current-password"
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-transparent border-2 border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#00e5ff] transition-all"
                      onFocus={e => (e.currentTarget.style.boxShadow = '0 0 15px rgba(0,229,255,0.2)')}
                      onBlur={e  => (e.currentTarget.style.boxShadow = 'none')}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <a
                    href="mailto:itechnetworkafrica@gmail.com?subject=Portal%20Password%20Reset%20Request"
                    className="text-[#00e5ff] hover:underline text-xs font-medium"
                  >
                    Forgot Password?
                  </a>
                  <a
                    href="mailto:itechnetworkafrica@gmail.com?subject=Portal%20Access%20Request"
                    className="text-[#00e5ff] hover:underline text-xs font-medium"
                  >
                    Request Access
                  </a>
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-xl font-bold text-white text-base transition-all disabled:opacity-60 hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(90deg,#00e5ff,#ff00cc)', boxShadow: loading ? 'none' : '0 0 20px rgba(255,0,204,0.35)' }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 0 32px rgba(255,0,204,0.55)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = loading ? 'none' : '0 0 20px rgba(255,0,204,0.35)'; }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2 text-sm">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
                      </svg>
                      Signing in…
                    </span>
                  ) : 'Sign In'}
                </button>
              </form>

              <p className="text-center text-white/30 text-xs mt-6">
                Don't have an account?{' '}
                <a href="mailto:itechnetworkafrica@gmail.com?subject=Portal%20Access%20Request" className="text-[#00e5ff] hover:underline font-semibold">
                  Request Access
                </a>
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-4 text-white/20">
            <span className="flex items-center gap-1 text-[11px]"><CheckCircle2 size={11} /> SSL Encrypted</span>
            <span className="flex items-center gap-1 text-[11px]"><Shield size={11} /> Admin-controlled access</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─────────────────────────────
   Root export
───────────────────────────── */
export default function ClientPortalPage() {
  const [client, setClient] = useState<PortalClient | null>(null);
  return client
    ? <PortalShell client={client} onLogout={() => setClient(null)} />
    : <LoginScreen onLogin={setClient} />;
}
