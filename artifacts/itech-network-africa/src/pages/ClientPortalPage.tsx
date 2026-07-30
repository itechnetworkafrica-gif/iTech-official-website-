import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderOpen, FileText, Headphones, Download,
  LogOut, User, Lock, Mail, Phone, Shield, ArrowRight,
  Menu, X, Clock, CheckCircle2, AlertCircle, ExternalLink,
  Building2, Star, FolderX, InboxIcon, FileX, HardDrive,
} from 'lucide-react';
import { Link } from 'wouter';
import { findClient, verifyPassword, type PortalClient } from '@/lib/portalClients';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ─── Nav items ─── */
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'projects',  label: 'Projects',   icon: FolderOpen      },
  { id: 'invoices',  label: 'Invoices',   icon: FileText        },
  { id: 'tickets',   label: 'Tickets',    icon: Headphones      },
  { id: 'downloads', label: 'Downloads',  icon: Download        },
  { id: 'profile',   label: 'Profile',    icon: User            },
];

/* ─── Status color map ─── */
const STATUS_COLOR: Record<string, string> = {
  Active:    'bg-[#dcfce7] text-[#166534]',
  Completed: 'bg-[#e0f2fe] text-[#0369a1]',
  'On Hold': 'bg-[#fef9c3] text-[#854d0e]',
};

/* ─────────────────────────────
   Empty-state helper
───────────────────────────── */
function EmptyState({ icon: Icon, title, message, action }: {
  icon: React.ElementType; title: string; message: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#F3F4F6] flex items-center justify-center mb-4">
        <Icon size={28} className="text-[#D1D5DB]" />
      </div>
      <h3 className="text-base font-bold text-[#374151] mb-2">{title}</h3>
      <p className="text-sm text-[#9CA3AF] max-w-xs leading-relaxed mb-5">{message}</p>
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
function Dashboard({ client }: { client: PortalClient }) {
  const activeProjects = client.projects.filter(p => p.status === 'Active').length;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-[#0A1929] rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-56 h-56 rounded-full bg-[#3CB52A]/5 pointer-events-none -translate-y-1/2 translate-x-1/4" />
        <div className="absolute right-8 bottom-0 w-32 h-32 rounded-full bg-[#3CB52A]/5 pointer-events-none translate-y-1/2" />
        <div className="relative z-10">
          <span className="inline-block text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-3">Client Portal</span>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
            Welcome, {client.name.split(' ')[0]} 👋
          </h2>
          <p className="text-white/50 text-sm max-w-md">
            This is your secure workspace. Your projects, invoices, support tickets, and files from iTech Network Africa all live here.
          </p>
        </div>
      </div>

      {/* Account summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Projects',  value: activeProjects || '—', icon: FolderOpen,  color: '#3CB52A', bg: '#f0fdf4' },
          { label: 'Open Invoices',    value: '—',                   icon: FileText,    color: '#E85D04', bg: '#fff7ed' },
          { label: 'Support Tickets',  value: '—',                   icon: Headphones,  color: '#7C3AED', bg: '#f5f3ff' },
          { label: 'Member Since',     value: client.memberSince,    icon: Star,        color: '#0A7EBF', bg: '#eff6ff' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: s.bg }}>
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <div className="text-xl font-black text-[#0A1929] mb-0.5">{s.value}</div>
            <div className="text-xs text-[#6B7280] font-medium">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Active projects preview */}
      {client.projects.length > 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-[#0A1929]">Your Projects</h3>
            <span className="text-xs text-[#3CB52A] font-semibold">{client.projects.length} project{client.projects.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="space-y-4">
            {client.projects.map(p => (
              <div key={p.id} className="flex items-start gap-4 p-4 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB]">
                <div className="w-10 h-10 rounded-xl bg-[#f0fdf4] flex items-center justify-center shrink-0">
                  <FolderOpen size={18} className="text-[#3CB52A]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-[#0A1929]">{p.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLOR[p.status]}`}>{p.status}</span>
                  </div>
                  <p className="text-xs text-[#6B7280]">{p.type} · Started {p.startDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
          <EmptyState
            icon={FolderX}
            title="No projects yet"
            message="Your projects will appear here once your account manager adds them."
            action={{ label: 'Contact your account manager', href: '/contact' }}
          />
        </div>
      )}

      {/* Admin contact callout */}
      <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#3CB52A]/15 flex items-center justify-center shrink-0">
          <Mail size={18} className="text-[#3CB52A]" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-[#166534]">Need to add a project, invoice or file?</p>
          <p className="text-xs text-[#166534]/70 mt-0.5">Contact your iTech account manager — they'll update your portal within 24 hours.</p>
        </div>
        <a
          href="mailto:itechnetworkafrica@gmail.com"
          className="shrink-0 text-sm font-bold text-[#3CB52A] hover:underline flex items-center gap-1"
        >
          Email Admin <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}

/* ─────────────────────────────
   Projects
───────────────────────────── */
function Projects({ client }: { client: PortalClient }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-[#0A1929]">My Projects</h2>
        <p className="text-[#6B7280] text-sm mt-1">{client.projects.length} project{client.projects.length !== 1 ? 's' : ''} on your account</p>
      </div>

      {client.projects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm">
          <EmptyState
            icon={FolderX}
            title="No projects yet"
            message="Projects will be added by your iTech account manager. Check back soon or get in touch."
            action={{ label: 'Contact us', href: '/contact' }}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {client.projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-[#9CA3AF] font-mono">{p.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLOR[p.status]}`}>{p.status}</span>
                  </div>
                  <h3 className="font-bold text-[#0A1929] text-lg">{p.name}</h3>
                  <p className="text-sm text-[#6B7280] mt-0.5">{p.type}</p>
                </div>
              </div>
              {p.description && (
                <p className="text-sm text-[#374151] leading-relaxed mb-4 bg-[#F8F9FA] rounded-xl p-4">
                  {p.description}
                </p>
              )}
              <div className="flex flex-wrap gap-4 text-xs text-[#6B7280]">
                <span className="flex items-center gap-1.5"><Clock size={12} /> Started {p.startDate}</span>
                <span className="flex items-center gap-1.5"><User size={12} /> {p.manager}</span>
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
        <h2 className="text-2xl font-bold text-[#0A1929]">Invoices</h2>
        <p className="text-[#6B7280] text-sm mt-1">Your billing history and outstanding payments</p>
      </div>
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm">
        <EmptyState
          icon={FileX}
          title="No invoices yet"
          message="Your invoices will appear here once your account manager adds them. For billing queries, contact us directly."
          action={{ label: 'Email billing team', href: 'mailto:itechnetworkafrica@gmail.com' }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────
   Support Tickets
───────────────────────────── */
function Tickets() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0A1929]">Support Tickets</h2>
          <p className="text-[#6B7280] text-sm mt-1">Track issues and requests with our technical team</p>
        </div>
        <a
          href="/support"
          className="flex items-center gap-1.5 bg-[#3CB52A] hover:bg-[#2e911f] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          + New Ticket
        </a>
      </div>
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm">
        <EmptyState
          icon={InboxIcon}
          title="No support tickets"
          message="You haven't raised any support tickets yet. Use the button above to open a new request."
          action={{ label: 'Open a support ticket', href: '/support' }}
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
        <h2 className="text-2xl font-bold text-[#0A1929]">Downloads</h2>
        <p className="text-[#6B7280] text-sm mt-1">Project files, reports, and deliverable assets</p>
      </div>
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm">
        <EmptyState
          icon={HardDrive}
          title="No files yet"
          message="Downloadable assets, reports, and project files will appear here once your account manager uploads them."
          action={{ label: 'Contact account manager', href: '/contact' }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────
   Profile
───────────────────────────── */
function Profile({ client }: { client: PortalClient }) {
  return (
    <div className="space-y-5 max-w-lg">
      <div>
        <h2 className="text-2xl font-bold text-[#0A1929]">My Profile</h2>
        <p className="text-[#6B7280] text-sm mt-1">Your account details</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#F3F4F6]">
          <div className="w-16 h-16 rounded-2xl bg-[#f0fdf4] border-2 border-[#3CB52A]/20 flex items-center justify-center text-[#3CB52A] font-black text-2xl">
            {client.name[0]}
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#0A1929]">{client.name}</h3>
            <p className="text-[#6B7280] text-sm">{client.role} · {client.organisation}</p>
            <span className="inline-block mt-1.5 text-[10px] font-bold bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0] px-2.5 py-0.5 rounded-full">
              {client.tier} Client
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          {[
            { icon: Mail,      label: 'Email',         value: client.email      },
            { icon: Phone,     label: 'Phone',         value: client.phone      },
            { icon: Building2, label: 'Organisation',  value: client.organisation },
            { icon: Shield,    label: 'Plan',          value: `${client.tier} Client` },
            { icon: Clock,     label: 'Member Since',  value: client.memberSince },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 py-3 border-b border-[#F9FAFB] last:border-0">
              <div className="w-9 h-9 rounded-xl bg-[#F8F9FA] flex items-center justify-center shrink-0">
                <Icon size={16} className="text-[#6B7280]" />
              </div>
              <div>
                <div className="text-xs text-[#9CA3AF] font-medium">{label}</div>
                <div className="text-sm font-semibold text-[#374151]">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-2xl p-4 text-sm text-[#92400E]">
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
  const [section, setSection] = useState('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const sectionMap: Record<string, React.ReactNode> = {
    dashboard: <Dashboard client={client} />,
    projects:  <Projects client={client} />,
    invoices:  <Invoices />,
    tickets:   <Tickets />,
    downloads: <Downloads />,
    profile:   <Profile client={client} />,
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F6F9]">

      {/* ── Top bar ── */}
      <header className="h-16 bg-[#0A1929] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setMobileNavOpen(v => !v)}
            aria-label="Toggle navigation"
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
            <div className="text-white text-xs font-semibold leading-tight">{client.name}</div>
            <div className="text-white/40 text-[10px]">{client.organisation}</div>
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

        {/* ── Sidebar (desktop) ── */}
        <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-[#E5E7EB] sticky top-16 h-[calc(100vh-4rem)] pt-4 pb-6">
          <nav className="flex-1 px-3 space-y-0.5">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  section === item.id
                    ? 'bg-[#f0fdf4] text-[#3CB52A]'
                    : 'text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#0A1929]'
                }`}
              >
                <item.icon size={17} className={section === item.id ? 'text-[#3CB52A]' : 'text-[#9CA3AF]'} />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="px-4 mt-4">
            <div className="bg-[#F8F9FA] rounded-xl p-3 text-center border border-[#E5E7EB]">
              <p className="text-xs text-[#9CA3AF] mb-1.5 leading-tight">Questions? Contact admin</p>
              <a href="mailto:itechnetworkafrica@gmail.com" className="text-xs font-bold text-[#3CB52A] hover:underline flex items-center justify-center gap-1">
                Email us <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </aside>

        {/* ── Mobile overlay nav ── */}
        <AnimatePresence>
          {mobileNavOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/40 z-20 top-16"
                onClick={() => setMobileNavOpen(false)}
              />
              <motion.aside
                initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                className="lg:hidden fixed left-0 top-16 bottom-0 w-56 bg-white border-r border-[#E5E7EB] z-30 flex flex-col pt-4 pb-6"
              >
                <nav className="flex-1 px-3 space-y-0.5">
                  {NAV_ITEMS.map(item => (
                    <button
                      key={item.id}
                      onClick={() => { setSection(item.id); setMobileNavOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                        section === item.id
                          ? 'bg-[#f0fdf4] text-[#3CB52A]'
                          : 'text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#0A1929]'
                      }`}
                    >
                      <item.icon size={17} />
                      {item.label}
                    </button>
                  ))}
                </nav>
                <div className="px-4 mt-4">
                  <a href="mailto:itechnetworkafrica@gmail.com" className="text-xs font-bold text-[#3CB52A] hover:underline flex items-center justify-center gap-1">
                    Contact Admin <ExternalLink size={11} />
                  </a>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ── Main content ── */}
        <main className="flex-1 p-4 lg:p-8 min-w-0 pb-20 lg:pb-8">
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

      {/* ── Bottom nav (mobile only) ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] z-20 flex items-center justify-around px-1 py-1">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => { setSection(item.id); setMobileNavOpen(false); }}
            className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl flex-1 transition-colors ${
              section === item.id ? 'text-[#3CB52A]' : 'text-[#9CA3AF]'
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
    // Small delay so it feels like a real request
    setTimeout(() => {
      const client = findClient(email);
      if (!client || !verifyPassword(password, client.passwordHash)) {
        setError('Invalid email or password. If you don\'t have access, request it below.');
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
      {/* Header */}
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

      {/* Login card */}
      <div className="flex-1 flex items-start justify-center px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-2xl shadow-black/40">
            <h2 className="text-lg font-bold text-[#0A1929] mb-1">Sign in</h2>
            <p className="text-xs text-[#9CA3AF] mb-6">Use the credentials provided by the admin team.</p>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 bg-[#fee2e2] text-[#991b1b] text-sm px-4 py-3 rounded-xl mb-4"
              >
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E5E7EB] text-sm text-[#0A1929] focus:outline-none focus:ring-2 focus:ring-[#3CB52A]/30 focus:border-[#3CB52A] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E5E7EB] text-sm text-[#0A1929] focus:outline-none focus:ring-2 focus:ring-[#3CB52A]/30 focus:border-[#3CB52A] transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3.5 bg-[#3CB52A] hover:bg-[#2e911f] disabled:opacity-60 text-white font-bold rounded-xl transition-all shadow-[0_4px_16px_rgba(60,181,42,0.3)] flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2 text-sm">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                  </svg>
                  Signing in…
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Request access */}
          <div className="mt-4 bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
            <p className="text-white/50 text-xs mb-3">Don't have access yet? Request an account from the admin team.</p>
            <a
              href="mailto:itechnetworkafrica@gmail.com?subject=Portal%20Access%20Request&body=Hello%2C%0A%0AI%20would%20like%20to%20request%20access%20to%20the%20iTech%20Network%20Africa%20client%20portal.%0A%0AName%3A%20%0ACompany%3A%20%0AEmail%3A%20%0A%0AThank%20you."
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3CB52A] hover:underline"
            >
              Request Portal Access <ArrowRight size={14} />
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-4 flex items-center justify-center gap-4 text-white/20">
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
