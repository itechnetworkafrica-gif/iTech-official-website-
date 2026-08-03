import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, FolderOpen, Settings, LogOut,
  Mail, Lock, Eye, EyeOff, AlertCircle, Shield, Menu, X,
  CheckCircle2, Clock, PauseCircle, Copy, Check,
  Building2, Phone, Star, TrendingUp, ChevronRight,
  Key, ExternalLink,
} from 'lucide-react';
import { PORTAL_CLIENTS, type PortalClient } from '@/lib/portalClients';
import { ADMIN_CREDENTIALS, verifyAdminPassword, decodeClientPassword } from '@/lib/adminAuth';

/* ── helpers ── */
const TIER_COLOR: Record<string, string> = {
  Standard:   'bg-blue-50 text-blue-700 border border-blue-200',
  Business:   'bg-violet-50 text-violet-700 border border-violet-200',
  Enterprise: 'bg-amber-50 text-amber-700 border border-amber-200',
};

const STATUS_COLOR: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  Active:    { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle2 },
  Completed: { bg: 'bg-sky-50',     text: 'text-sky-700',     icon: CheckCircle2 },
  'On Hold': { bg: 'bg-amber-50',   text: 'text-amber-700',   icon: PauseCircle  },
};

/* ── copy-to-clipboard hook ── */
function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }
  return { copied, copy };
}

/* ─────────────────────────────
   Stat card
───────────────────────────── */
function StatCard({ label, value, sub, color, icon: Icon }: {
  label: string; value: number | string; sub?: string;
  color: string; icon: React.ElementType;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <div className="text-2xl font-black text-slate-900 leading-none mb-1">{value}</div>
        <div className="text-xs font-semibold text-slate-500">{label}</div>
        {sub && <div className="text-[11px] text-slate-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

/* ─────────────────────────────
   Overview section
───────────────────────────── */
function Overview() {
  const totalClients  = PORTAL_CLIENTS.length;
  const totalProjects = PORTAL_CLIENTS.reduce((s, c) => s + c.projects.length, 0);
  const activeProjects = PORTAL_CLIENTS.reduce(
    (s, c) => s + c.projects.filter(p => p.status === 'Active').length, 0
  );
  const completedProjects = PORTAL_CLIENTS.reduce(
    (s, c) => s + c.projects.filter(p => p.status === 'Completed').length, 0
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900">Overview</h2>
        <p className="text-sm text-slate-500 mt-0.5">Real-time snapshot of your client portal</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Clients"     value={totalClients}     icon={Users}       color="bg-violet-50 text-violet-600" />
        <StatCard label="Total Projects"    value={totalProjects}    icon={FolderOpen}  color="bg-[#f0fdf4] text-[#3CB52A]" />
        <StatCard label="Active Projects"   value={activeProjects}   icon={TrendingUp}  color="bg-sky-50 text-sky-600" sub="In progress" />
        <StatCard label="Completed"         value={completedProjects} icon={CheckCircle2} color="bg-emerald-50 text-emerald-600" />
      </div>

      {/* Recent clients */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Registered Clients</h3>
          <span className="text-xs font-semibold text-[#3CB52A]">{totalClients} total</span>
        </div>
        {PORTAL_CLIENTS.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">No clients registered yet.</div>
        ) : (
          <div className="divide-y divide-slate-50">
            {PORTAL_CLIENTS.map(client => (
              <div key={client.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-[#f0fdf4] border border-[#3CB52A]/20 flex items-center justify-center text-[#3CB52A] font-black text-sm shrink-0">
                  {client.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 text-sm truncate">{client.name}</div>
                  <div className="text-xs text-slate-400 truncate">{client.email}</div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${TIER_COLOR[client.tier]}`}>
                  {client.tier}
                </span>
                <div className="text-xs text-slate-400 hidden sm:block">{client.projects.length} project{client.projects.length !== 1 ? 's' : ''}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All projects */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50">
          <h3 className="font-bold text-slate-800">All Projects</h3>
        </div>
        {totalProjects === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">No projects yet.</div>
        ) : (
          <div className="divide-y divide-slate-50">
            {PORTAL_CLIENTS.flatMap(client =>
              client.projects.map(project => {
                const s = STATUS_COLOR[project.status] ?? STATUS_COLOR.Active;
                return (
                  <div key={project.id} className="px-6 py-4 flex flex-wrap items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${s.bg}`}>
                      <s.icon size={14} className={s.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-800 text-sm">{project.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{client.name} · {project.type} · Started {project.startDate}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${s.bg} ${s.text}`}>
                      {project.status}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────
   Clients section
───────────────────────────── */
function ClientsSection() {
  const { copied, copy } = useCopy();
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  function toggleReveal(id: string) {
    setRevealedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900">Client Management</h2>
        <p className="text-sm text-slate-500 mt-0.5">View all client accounts and their portal credentials</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 items-start">
        <Key size={16} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <strong>Admin only.</strong> Credentials are shown so you can send login details to clients. Do not share this page.
          To add a new client, edit <code className="bg-amber-100 px-1 rounded text-xs">src/lib/portalClients.ts</code>.
        </div>
      </div>

      {PORTAL_CLIENTS.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center text-slate-400 text-sm">
          No clients registered yet. Add clients in <code>src/lib/portalClients.ts</code>.
        </div>
      ) : (
        <div className="space-y-4">
          {PORTAL_CLIENTS.map(client => {
            const plainPassword = decodeClientPassword(client.passwordHash);
            const revealed = revealedIds.has(client.id);
            return (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              >
                {/* Client header */}
                <div className="px-6 py-5 flex flex-wrap items-center gap-4 border-b border-slate-50">
                  <div className="w-12 h-12 rounded-2xl bg-[#f0fdf4] border-2 border-[#3CB52A]/20 flex items-center justify-center text-[#3CB52A] font-black text-xl shrink-0">
                    {client.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-slate-900">{client.name}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${TIER_COLOR[client.tier]}`}>{client.tier}</span>
                    </div>
                    <div className="text-sm text-slate-500 mt-0.5">{client.role} · {client.organisation}</div>
                  </div>
                  <div className="text-xs font-mono text-slate-400 hidden md:block">{client.id}</div>
                </div>

                {/* Details grid */}
                <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { icon: Mail,      label: 'Email',         value: client.email      },
                    { icon: Phone,     label: 'Phone',         value: client.phone      },
                    { icon: Building2, label: 'Organisation',  value: client.organisation },
                    { icon: Star,      label: 'Member Since',  value: client.memberSince },
                    { icon: FolderOpen,label: 'Projects',      value: `${client.projects.length} project${client.projects.length !== 1 ? 's' : ''}` },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3">
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

                {/* Credentials */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Key size={12} /> Portal Login Credentials
                    </span>
                    <button
                      onClick={() => toggleReveal(client.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      {revealed ? <EyeOff size={13} /> : <Eye size={13} />}
                      {revealed ? 'Hide' : 'Show'} credentials
                    </button>
                  </div>

                  <AnimatePresence>
                    {revealed && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2">
                          {[
                            { label: 'Portal URL', value: '/portal', key: `url-${client.id}` },
                            { label: 'Email',      value: client.email, key: `email-${client.id}` },
                            { label: 'Password',   value: plainPassword, key: `pass-${client.id}` },
                          ].map(({ label, value, key }) => (
                            <div key={key} className="flex items-center gap-3 bg-white rounded-xl px-4 py-2.5 border border-slate-200">
                              <div className="flex-1 min-w-0">
                                <div className="text-[10px] text-slate-400 font-semibold">{label}</div>
                                <div className="text-sm font-mono text-slate-800 truncate">{value}</div>
                              </div>
                              <button
                                onClick={() => copy(value, key)}
                                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#3CB52A] hover:bg-[#f0fdf4] transition-all"
                                title="Copy"
                              >
                                {copied === key ? <Check size={14} className="text-[#3CB52A]" /> : <Copy size={14} />}
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Send credentials shortcut */}
                        <a
                          href={`mailto:${client.email}?subject=Your%20iTech%20Network%20Africa%20Client%20Portal%20Access&body=Hello%20${encodeURIComponent(client.name)}%2C%0A%0AYour%20client%20portal%20is%20ready.%20Please%20use%20the%20following%20credentials%20to%20log%20in%3A%0A%0APortal%20URL%3A%20https%3A%2F%2Fitechnetworkafrica.com%2Fportal%0AEmail%3A%20${encodeURIComponent(client.email)}%0APassword%3A%20${encodeURIComponent(plainPassword)}%0A%0APlease%20change%20your%20password%20after%20your%20first%20login.%0A%0ABest%20regards%2C%0AiTech%20Network%20Africa%20Team`}
                          className="mt-3 flex items-center gap-2 text-xs font-bold text-[#3CB52A] hover:underline"
                        >
                          <Mail size={12} /> Send credentials to {client.name.split(' ')[0]} via email
                          <ExternalLink size={11} />
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Projects */}
                {client.projects.length > 0 && (
                  <div className="px-6 py-4 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Projects</p>
                    <div className="space-y-2">
                      {client.projects.map(p => {
                        const s = STATUS_COLOR[p.status] ?? STATUS_COLOR.Active;
                        return (
                          <div key={p.id} className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full shrink-0 ${s.bg.replace('bg-', 'bg-').replace('-50', '-400')}`}
                              style={{ background: p.status === 'Active' ? '#10b981' : p.status === 'Completed' ? '#0ea5e9' : '#f59e0b' }}
                            />
                            <span className="text-sm text-slate-700 font-medium flex-1 truncate">{p.name}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>{p.status}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────
   Settings section
───────────────────────────── */
function AdminSettings() {
  const { copied, copy } = useCopy();
  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-xl font-black text-slate-900">Admin Settings</h2>
        <p className="text-sm text-slate-500 mt-0.5">Your admin account details</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-4 pb-5 border-b border-slate-50">
          <div className="w-14 h-14 rounded-2xl bg-[#0A1929] flex items-center justify-center text-[#3CB52A]">
            <Shield size={26} />
          </div>
          <div>
            <div className="font-black text-slate-900 text-lg">iTech Admin</div>
            <div className="text-sm text-slate-500">Super Administrator</div>
          </div>
        </div>

        {[
          { label: 'Admin URL',  value: '/admin',                          key: 'url'   },
          { label: 'Email',      value: ADMIN_CREDENTIALS.email,           key: 'email' },
        ].map(({ label, value, key }) => (
          <div key={key} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
            <div className="flex-1">
              <div className="text-[11px] text-slate-400 font-semibold">{label}</div>
              <div className="text-sm font-mono text-slate-800">{value}</div>
            </div>
            <button
              onClick={() => copy(value, key)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#3CB52A] transition-colors"
            >
              {copied === key ? <Check size={14} className="text-[#3CB52A]" /> : <Copy size={14} />}
            </button>
          </div>
        ))}

        <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-4 text-sm text-[#166534]">
          <strong>To change the admin password:</strong> Open <code className="bg-[#dcfce7] px-1 rounded text-xs">src/lib/adminAuth.ts</code> and
          update the <code className="bg-[#dcfce7] px-1 rounded text-xs">hash</code> field.
          Generate a new hash by running <code className="bg-[#dcfce7] px-1 rounded text-xs">btoa("NewPassword:iTechPortal2025")</code> in the browser console.
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-3">Adding New Clients</h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-3">
          Edit <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">src/lib/portalClients.ts</code> to add new clients.
          Follow the template in that file. Generate password hashes using:
        </p>
        <div className="bg-slate-900 rounded-xl px-4 py-3 font-mono text-sm text-emerald-400">
          btoa("ClientPassword:iTechPortal2025")
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────
   Admin Login Screen
───────────────────────────── */
function AdminLoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) { setError('Enter your admin email and password.'); return; }
    if (email.trim().toLowerCase() !== ADMIN_CREDENTIALS.email.toLowerCase()) {
      setError('Invalid admin credentials.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (!verifyAdminPassword(password)) {
        setError('Invalid admin credentials.');
        setLoading(false);
        return;
      }
      setLoading(false);
      onLogin();
    }, 700);
  }

  return (
    <div className="min-h-screen bg-[#060E18] flex flex-col items-center justify-center px-4"
      style={{ backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(60,181,42,0.09) 0%, transparent 55%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-sm"
      >
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#3CB52A]/15 border border-[#3CB52A]/30">
            <Shield size={13} className="text-[#3CB52A]" />
            <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">Admin Access Only</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white">Admin Dashboard</h1>
          <p className="text-white/40 text-sm mt-2">iTech Network Africa · Staff only</p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-7 backdrop-blur-sm">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-5"
            >
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@itechnetworkafrica.com"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#3CB52A]/60 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#3CB52A]/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl font-bold text-white text-sm bg-[#3CB52A] hover:bg-[#2e911f] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>Sign In to Dashboard <ChevronRight size={15} /></>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-5 flex items-center justify-center gap-2">
          <Lock size={11} /> Restricted area · Staff only
        </p>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────
   Admin Shell (after login)
───────────────────────────── */
const ADMIN_NAV = [
  { id: 'overview', label: 'Overview',  icon: LayoutDashboard },
  { id: 'clients',  label: 'Clients',   icon: Users           },
  { id: 'settings', label: 'Settings',  icon: Settings        },
];

function AdminShell({ onLogout }: { onLogout: () => void }) {
  const [section, setSection]         = useState('overview');
  const [mobileNavOpen, setMobileNav] = useState(false);

  const sectionMap: Record<string, React.ReactNode> = {
    overview: <Overview />,
    clients:  <ClientsSection />,
    settings: <AdminSettings />,
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
          <div className="w-8 h-8 rounded-lg bg-[#3CB52A] flex items-center justify-center shrink-0">
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-sm leading-none block">Admin Dashboard</span>
            <span className="text-white/30 text-[10px]">iTech Network Africa</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 mr-2">
            <div className="w-2 h-2 rounded-full bg-[#3CB52A] animate-pulse" />
            <span className="text-white/40 text-xs">Live</span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors text-xs font-semibold"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative">

        {/* Desktop sidebar */}
        <aside className="hidden lg:flex flex-col w-52 bg-white border-r border-slate-100 sticky top-16 h-[calc(100vh-4rem)] pt-4 pb-6">
          <nav className="flex-1 px-3 space-y-0.5">
            {ADMIN_NAV.map(item => (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  section === item.id
                    ? 'bg-[#f0fdf4] text-[#3CB52A]'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <item.icon size={16} className={section === item.id ? 'text-[#3CB52A]' : 'text-slate-400'} />
                {item.label}
                {item.id === 'clients' && PORTAL_CLIENTS.length > 0 && (
                  <span className="ml-auto text-[10px] font-bold bg-slate-100 text-slate-500 rounded-full px-1.5 py-0.5">
                    {PORTAL_CLIENTS.length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="px-4">
            <a
              href="/portal"
              className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-[#3CB52A] transition-colors"
            >
              <ExternalLink size={12} /> View Client Portal
            </a>
          </div>
        </aside>

        {/* Mobile overlay nav */}
        <AnimatePresence>
          {mobileNavOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/40 z-20 top-16"
                onClick={() => setMobileNav(false)}
              />
              <motion.aside
                initial={{ x: -220 }} animate={{ x: 0 }} exit={{ x: -220 }}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                className="lg:hidden fixed left-0 top-16 bottom-0 w-52 bg-white border-r border-slate-100 z-30 flex flex-col pt-4 pb-6"
              >
                <nav className="flex-1 px-3 space-y-0.5">
                  {ADMIN_NAV.map(item => (
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
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-8 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {sectionMap[section]}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

/* ─────────────────────────────
   Root export
───────────────────────────── */
export default function AdminDashboardPage() {
  const [authed, setAuthed] = useState(false);
  return authed
    ? <AdminShell onLogout={() => setAuthed(false)} />
    : <AdminLoginScreen onLogin={() => setAuthed(true)} />;
}
