import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderOpen, FileText, Headphones, Download,
  LogOut, Bell, Settings, ChevronRight, TrendingUp, Clock,
  CheckCircle2, AlertCircle, XCircle, Plus, Eye, ExternalLink,
  User, Lock, Mail, Phone, Shield, Star, ArrowUpRight,
  Menu, X, Inbox, Activity, BarChart3,
} from 'lucide-react';

/* ─── types ─── */
interface Project {
  id: string; name: string; type: string; status: 'Active' | 'Completed' | 'On Hold';
  progress: number; start: string; deadline: string; manager: string;
}
interface Invoice {
  id: string; desc: string; date: string; due: string; amount: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}
interface Ticket {
  id: string; subject: string; priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  created: string; updated: string;
}
interface Download {
  id: string; name: string; type: string; size: string; date: string;
}

/* ─── mock data ─── */
const CLIENT = { name: 'Emmanuel Togba', role: 'Director of IT', org: 'Central Bank of Liberia', email: 'e.togba@cbl.gov.lr', phone: '+231 770 123 456', tier: 'Enterprise', since: 'March 2023' };

const PROJECTS: Project[] = [
  { id: 'P-001', name: 'Core Banking Platform Upgrade', type: 'Enterprise Software', status: 'Active', progress: 72, start: 'Jan 2025', deadline: 'Sep 2025', manager: 'Wilmot S.' },
  { id: 'P-002', name: 'Mobile Banking App v2', type: 'Web & Mobile', status: 'Active', progress: 45, start: 'Mar 2025', deadline: 'Dec 2025', manager: 'Foday K.' },
  { id: 'P-003', name: 'Cybersecurity Audit & Remediation', type: 'Cybersecurity', status: 'Completed', progress: 100, start: 'Oct 2024', deadline: 'Jan 2025', manager: 'Alvina K.' },
  { id: 'P-004', name: 'Staff Training & Capacity Building', type: 'Training', status: 'On Hold', progress: 30, start: 'Feb 2025', deadline: 'Aug 2025', manager: 'Wilmot S.' },
];

const INVOICES: Invoice[] = [
  { id: 'INV-2025-041', desc: 'Core Banking Phase 2 Milestone', date: 'Jul 01, 2025', due: 'Jul 31, 2025', amount: '$18,500.00', status: 'Pending' },
  { id: 'INV-2025-028', desc: 'Mobile App Development – Sprint 4', date: 'Jun 01, 2025', due: 'Jun 30, 2025', amount: '$9,200.00', status: 'Paid' },
  { id: 'INV-2025-019', desc: 'Cybersecurity Audit – Final Report', date: 'Jan 15, 2025', due: 'Feb 15, 2025', amount: '$14,750.00', status: 'Paid' },
  { id: 'INV-2024-098', desc: 'Annual Retainer Q4 2024', date: 'Oct 01, 2024', due: 'Oct 31, 2024', amount: '$6,000.00', status: 'Paid' },
  { id: 'INV-2025-035', desc: 'Cloud Infrastructure Setup', date: 'May 20, 2025', due: 'Jun 05, 2025', amount: '$3,400.00', status: 'Overdue' },
];

const TICKETS: Ticket[] = [
  { id: 'TKT-882', subject: 'API timeout on bulk transaction endpoint', priority: 'High', status: 'In Progress', created: 'Jul 28, 2025', updated: '2 hours ago' },
  { id: 'TKT-879', subject: 'User permission sync delay after AD update', priority: 'Medium', status: 'Open', created: 'Jul 25, 2025', updated: '1 day ago' },
  { id: 'TKT-855', subject: 'Report export formatting issue on mobile', priority: 'Low', status: 'Resolved', created: 'Jul 10, 2025', updated: 'Jul 18, 2025' },
  { id: 'TKT-831', subject: 'MFA setup assistance for 3 new staff accounts', priority: 'Medium', status: 'Resolved', created: 'Jun 29, 2025', updated: 'Jul 2, 2025' },
];

const DOWNLOADS: Download[] = [
  { id: 'd1', name: 'Core Banking Platform – User Manual v3.2', type: 'PDF', size: '4.2 MB', date: 'Jul 2025' },
  { id: 'd2', name: 'Mobile App Release Build v2.0.4 (Android)', type: 'APK', size: '28.7 MB', date: 'Jun 2025' },
  { id: 'd3', name: 'Cybersecurity Audit Final Report', type: 'PDF', size: '6.1 MB', date: 'Jan 2025' },
  { id: 'd4', name: 'API Integration Guide – REST v2', type: 'PDF', size: '1.8 MB', date: 'May 2025' },
  { id: 'd5', name: 'Staff Training Slides – Module 1', type: 'PPTX', size: '12.3 MB', date: 'Feb 2025' },
  { id: 'd6', name: 'SLA & Service Agreement 2025', type: 'PDF', size: '0.9 MB', date: 'Jan 2025' },
];

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects',  label: 'Projects',  icon: FolderOpen },
  { id: 'invoices',  label: 'Invoices',  icon: FileText },
  { id: 'tickets',   label: 'Tickets',   icon: Headphones },
  { id: 'downloads', label: 'Downloads', icon: Download },
  { id: 'profile',   label: 'Profile',   icon: User },
];

/* ─── helpers ─── */
const statusColor = {
  Active: 'bg-[#dcfce7] text-[#166534]',
  Completed: 'bg-[#e0f2fe] text-[#0369a1]',
  'On Hold': 'bg-[#fef9c3] text-[#854d0e]',
  Paid: 'bg-[#dcfce7] text-[#166534]',
  Pending: 'bg-[#fef9c3] text-[#854d0e]',
  Overdue: 'bg-[#fee2e2] text-[#991b1b]',
  Open: 'bg-[#fef9c3] text-[#854d0e]',
  'In Progress': 'bg-[#ede9fe] text-[#5b21b6]',
  Resolved: 'bg-[#dcfce7] text-[#166534]',
  Critical: 'bg-[#fee2e2] text-[#991b1b]',
  High: 'bg-[#ffedd5] text-[#9a3412]',
  Medium: 'bg-[#fef9c3] text-[#854d0e]',
  Low: 'bg-[#f3f4f6] text-[#374151]',
};

/* ─── Section views ─── */
function Dashboard() {
  const activeProjects = PROJECTS.filter(p => p.status === 'Active').length;
  const unpaidTotal = INVOICES.filter(i => i.status !== 'Paid')
    .reduce((s, i) => s + parseFloat(i.amount.replace(/[$,]/g, '')), 0);
  const openTickets = TICKETS.filter(t => t.status !== 'Resolved').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0A1929]">Welcome back, {CLIENT.name.split(' ')[0]} 👋</h2>
        <p className="text-[#6B7280] text-sm mt-1">Here's what's happening with your account today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Projects', value: activeProjects, icon: Activity, color: '#3CB52A', bg: '#f0fdf4' },
          { label: 'Open Tickets', value: openTickets, icon: Inbox, color: '#7C3AED', bg: '#f5f3ff' },
          { label: 'Pending Invoices', value: `$${unpaidTotal.toLocaleString()}`, icon: FileText, color: '#E85D04', bg: '#fff7ed' },
          { label: 'Client Since', value: '2023', icon: Star, color: '#0A7EBF', bg: '#eff6ff' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.bg }}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <ArrowUpRight size={14} className="text-[#9CA3AF]" />
            </div>
            <div className="text-2xl font-black text-[#0A1929] mb-0.5">{s.value}</div>
            <div className="text-xs text-[#6B7280] font-medium">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Active projects */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-[#0A1929]">Active Projects</h3>
            <span className="text-xs text-[#3CB52A] font-semibold">{activeProjects} running</span>
          </div>
          <div className="space-y-4">
            {PROJECTS.filter(p => p.status === 'Active').map(p => (
              <div key={p.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-[#374151] truncate pr-2">{p.name}</span>
                  <span className="text-xs text-[#6B7280] shrink-0">{p.progress}%</span>
                </div>
                <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#3CB52A] transition-all duration-700"
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
                <div className="text-xs text-[#9CA3AF] mt-1">Due {p.deadline}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent tickets */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-[#0A1929]">Recent Tickets</h3>
            <span className="text-xs text-[#7C3AED] font-semibold">{openTickets} open</span>
          </div>
          <div className="space-y-3">
            {TICKETS.slice(0, 3).map(t => (
              <div key={t.id} className="flex items-start gap-3 py-2 border-b border-[#F3F4F6] last:border-0">
                <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${statusColor[t.status]}`}>{t.status}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#374151] truncate">{t.subject}</div>
                  <div className="text-xs text-[#9CA3AF] mt-0.5">{t.id} · {t.updated}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest invoice */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[#0A1929]">Latest Invoice</h3>
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${statusColor[INVOICES[0].status]}`}>{INVOICES[0].status}</span>
        </div>
        <div className="flex flex-wrap gap-6 text-sm">
          <div><div className="text-[#9CA3AF] text-xs mb-1">Invoice #</div><div className="font-semibold text-[#374151]">{INVOICES[0].id}</div></div>
          <div><div className="text-[#9CA3AF] text-xs mb-1">Description</div><div className="font-semibold text-[#374151]">{INVOICES[0].desc}</div></div>
          <div><div className="text-[#9CA3AF] text-xs mb-1">Amount</div><div className="font-bold text-[#0A1929] text-lg">{INVOICES[0].amount}</div></div>
          <div><div className="text-[#9CA3AF] text-xs mb-1">Due Date</div><div className="font-semibold text-[#374151]">{INVOICES[0].due}</div></div>
        </div>
      </div>
    </div>
  );
}

function Projects() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0A1929]">My Projects</h2>
          <p className="text-[#6B7280] text-sm mt-1">{PROJECTS.length} total projects</p>
        </div>
      </div>

      <div className="grid gap-4">
        {PROJECTS.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm hover:border-[#3CB52A]/30 hover:shadow-md transition-all"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-[#9CA3AF] font-mono">{p.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[p.status]}`}>{p.status}</span>
                </div>
                <h3 className="font-bold text-[#0A1929] text-lg">{p.name}</h3>
                <p className="text-sm text-[#6B7280] mt-0.5">{p.type}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-black text-[#3CB52A]">{p.progress}%</div>
                <div className="text-xs text-[#9CA3AF]">complete</div>
              </div>
            </div>

            <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden mb-4">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${p.progress}%`, backgroundColor: p.status === 'Completed' ? '#0A7EBF' : p.status === 'On Hold' ? '#F59E0B' : '#3CB52A' }}
              />
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-[#6B7280]">
              <span className="flex items-center gap-1"><Clock size={12} /> Started {p.start}</span>
              <span className="flex items-center gap-1"><TrendingUp size={12} /> Due {p.deadline}</span>
              <span className="flex items-center gap-1"><User size={12} /> {p.manager}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Invoices() {
  const total = INVOICES.filter(i => i.status === 'Pending' || i.status === 'Overdue')
    .reduce((s, i) => s + parseFloat(i.amount.replace(/[$,]/g, '')), 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0A1929]">Invoices</h2>
        <p className="text-[#6B7280] text-sm mt-1">Outstanding balance: <strong className="text-[#E85D04]">${total.toLocaleString()}</strong></p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="hidden md:grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-6 py-3 bg-[#F8F9FA] border-b border-[#E5E7EB] text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
          <span>Invoice</span><span>Description</span><span>Due</span><span>Amount</span><span>Status</span>
        </div>

        <div className="divide-y divide-[#F3F4F6]">
          {INVOICES.map((inv, i) => (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="px-6 py-4 hover:bg-[#FAFAFA] transition-colors"
            >
              {/* Mobile layout */}
              <div className="md:hidden space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#0A1929]">{inv.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[inv.status]}`}>{inv.status}</span>
                </div>
                <p className="text-sm text-[#374151]">{inv.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#9CA3AF]">Due {inv.due}</span>
                  <span className="font-bold text-[#0A1929]">{inv.amount}</span>
                </div>
              </div>

              {/* Desktop layout */}
              <div className="hidden md:grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 items-center">
                <span className="text-sm font-bold text-[#374151] font-mono">{inv.id}</span>
                <span className="text-sm text-[#374151] truncate">{inv.desc}</span>
                <span className="text-sm text-[#9CA3AF]">{inv.due}</span>
                <span className="text-sm font-bold text-[#0A1929]">{inv.amount}</span>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${statusColor[inv.status]}`}>{inv.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <p className="text-xs text-[#9CA3AF] text-center">For billing enquiries email <a href="mailto:itechnetworkafrica@gmail.com" className="text-[#3CB52A] hover:underline">itechnetworkafrica@gmail.com</a></p>
    </div>
  );
}

function Tickets() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0A1929]">Support Tickets</h2>
          <p className="text-[#6B7280] text-sm mt-1">{TICKETS.filter(t => t.status !== 'Resolved').length} open tickets</p>
        </div>
        <a
          href="/support"
          className="flex items-center gap-1.5 bg-[#3CB52A] hover:bg-[#2e911f] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={15} /> New Ticket
        </a>
      </div>

      <div className="space-y-3">
        {TICKETS.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm hover:border-[#3CB52A]/30 transition-all"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-[#9CA3AF]">{t.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[t.priority]}`}>{t.priority}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[t.status]}`}>{t.status}</span>
                </div>
                <h3 className="font-semibold text-[#0A1929] text-sm">{t.subject}</h3>
              </div>
              <div className="text-right text-xs text-[#9CA3AF] shrink-0">
                <div>Opened {t.created}</div>
                <div className="mt-0.5">Updated {t.updated}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Downloads() {
  const icons: Record<string, string> = { PDF: '📄', APK: '📱', PPTX: '📊', DOCX: '📝' };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0A1929]">Downloads</h2>
        <p className="text-[#6B7280] text-sm mt-1">{DOWNLOADS.length} files available</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {DOWNLOADS.map((d, i) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm hover:border-[#3CB52A]/30 hover:shadow-md transition-all group flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-[#F8F9FA] flex items-center justify-center text-xl shrink-0 group-hover:bg-[#f0fdf4] transition-colors">
              {icons[d.type] || '📁'}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-[#0A1929] leading-snug truncate">{d.name}</h4>
              <p className="text-xs text-[#9CA3AF] mt-1">{d.type} · {d.size} · {d.date}</p>
            </div>
            <button className="w-9 h-9 rounded-xl border border-[#E5E7EB] group-hover:border-[#3CB52A] group-hover:bg-[#f0fdf4] flex items-center justify-center text-[#9CA3AF] group-hover:text-[#3CB52A] transition-all shrink-0">
              <Download size={15} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Profile() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-[#0A1929]">My Profile</h2>
        <p className="text-[#6B7280] text-sm mt-1">Account details and preferences</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-[#F3F4F6]">
          <div className="w-16 h-16 rounded-2xl bg-[#f0fdf4] border-2 border-[#3CB52A]/20 flex items-center justify-center text-[#3CB52A] font-black text-2xl">
            {CLIENT.name[0]}
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#0A1929]">{CLIENT.name}</h3>
            <p className="text-[#6B7280] text-sm">{CLIENT.role} · {CLIENT.org}</p>
            <span className="inline-block mt-1.5 text-[10px] font-bold bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0] px-2.5 py-0.5 rounded-full">{CLIENT.tier} Client</span>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { icon: Mail,   label: 'Email',        value: CLIENT.email },
            { icon: Phone,  label: 'Phone',         value: CLIENT.phone },
            { icon: Shield, label: 'Membership',    value: `${CLIENT.tier} Plan` },
            { icon: Clock,  label: 'Client Since',  value: CLIENT.since },
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

      <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-2xl p-5 text-sm text-[#92400E]">
        <strong>Need to update your details?</strong> Contact your account manager or email <a href="mailto:itechnetworkafrica@gmail.com" className="underline font-semibold">itechnetworkafrica@gmail.com</a>.
      </div>
    </div>
  );
}

/* ─── Portal Shell ─── */
function PortalShell({ onLogout }: { onLogout: () => void }) {
  const [section, setSection] = useState<string>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const current = NAV_ITEMS.find(n => n.id === section)!;

  const sectionMap: Record<string, React.ReactNode> = {
    dashboard: <Dashboard />,
    projects:  <Projects />,
    invoices:  <Invoices />,
    tickets:   <Tickets />,
    downloads: <Downloads />,
    profile:   <Profile />,
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F6F9]">

      {/* Top bar */}
      <header className="h-16 bg-[#0A1929] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setMobileNavOpen(v => !v)}
          >
            {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-2">
            <img src="/logo-icon.png" alt="iTech" className="w-7 h-7 rounded object-contain" onError={e => (e.currentTarget.style.display = 'none')} />
            <span className="text-white font-bold text-sm">Client Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-right mr-1">
            <div className="text-white text-xs font-semibold leading-tight">{CLIENT.name}</div>
            <div className="text-white/50 text-[10px]">{CLIENT.org}</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#3CB52A] flex items-center justify-center text-white font-bold text-sm shrink-0">
            {CLIENT.name[0]}
          </div>
          <button
            onClick={onLogout}
            className="ml-1 w-9 h-9 flex items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            title="Log out"
          >
            <LogOut size={17} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-[#E5E7EB] sticky top-16 h-[calc(100vh-4rem)] pt-4 pb-6">
          <nav className="flex-1 px-3 space-y-1">
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
                <item.icon size={18} className={section === item.id ? 'text-[#3CB52A]' : 'text-[#9CA3AF]'} />
                {item.label}
                {item.id === 'tickets' && TICKETS.filter(t => t.status !== 'Resolved').length > 0 && (
                  <span className="ml-auto w-5 h-5 rounded-full bg-[#7C3AED] text-white text-[10px] font-bold flex items-center justify-center">
                    {TICKETS.filter(t => t.status !== 'Resolved').length}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div className="px-4 mt-4">
            <div className="bg-[#F8F9FA] rounded-xl p-3 text-center">
              <div className="text-xs text-[#9CA3AF] mb-1">Need help?</div>
              <a href="/support" className="text-xs font-semibold text-[#3CB52A] hover:underline flex items-center justify-center gap-1">
                Open Support <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </aside>

        {/* Mobile overlay nav */}
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
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="lg:hidden fixed left-0 top-16 bottom-0 w-60 bg-white border-r border-[#E5E7EB] z-30 flex flex-col pt-4 pb-6"
              >
                <nav className="flex-1 px-3 space-y-1">
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
                      <item.icon size={18} />
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
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {sectionMap[section]}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Bottom nav — mobile only */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] z-20 flex items-center justify-around px-1 py-1 safe-area-pb">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => { setSection(item.id); setMobileNavOpen(false); }}
            className={`flex flex-col items-center gap-1 px-2 py-2 rounded-xl flex-1 transition-colors relative ${
              section === item.id ? 'text-[#3CB52A]' : 'text-[#9CA3AF]'
            }`}
          >
            {item.id === 'tickets' && TICKETS.filter(t => t.status !== 'Resolved').length > 0 && (
              <span className="absolute top-1.5 right-2 w-4 h-4 rounded-full bg-[#7C3AED] text-white text-[9px] font-bold flex items-center justify-center">
                {TICKETS.filter(t => t.status !== 'Resolved').length}
              </span>
            )}
            <item.icon size={20} />
            <span className="text-[9px] font-semibold leading-none">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom nav spacer on mobile */}
      <div className="lg:hidden h-16" />
    </div>
  );
}

/* ─── Login screen ─── */
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError('Please enter your credentials.'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1200);
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#060E18]" style={{ backgroundImage: 'radial-gradient(ellipse at 70% 30%, rgba(60,181,42,0.08) 0%, transparent 60%)' }}>
      {/* Hero header */}
      <div className="relative pt-20 pb-16 text-center px-6">
        <img src="/logo-new.png" alt="iTech Network Africa" className="h-12 object-contain mx-auto mb-10" onError={e => (e.currentTarget.style.display='none')} />
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#3CB52A]/15 border border-[#3CB52A]/30 mb-6">
          <Lock size={13} className="text-[#3CB52A]" />
          <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">Secure Client Area</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Client Portal</h1>
        <p className="text-white/50 text-base max-w-sm mx-auto">Your projects, invoices, support tickets, and files — all in one place.</p>
      </div>

      {/* Login card */}
      <div className="flex-1 flex items-start justify-center px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-2xl shadow-black/40">
            <h2 className="text-xl font-bold text-[#0A1929] mb-6">Sign in to your account</h2>

            {error && (
              <div className="flex items-center gap-2 bg-[#fee2e2] text-[#991b1b] text-sm px-4 py-3 rounded-xl mb-4">
                <AlertCircle size={15} /> {error}
              </div>
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
                    placeholder="you@company.com"
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
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
                  </svg>
                  Signing in…
                </span>
              ) : 'Sign In to Portal'}
            </button>

            <p className="text-center text-xs text-[#9CA3AF] mt-5">
              Don't have access?{' '}
              <a href="/contact" className="text-[#3CB52A] font-semibold hover:underline">Request access →</a>
            </p>
          </form>

          <div className="mt-5 text-center space-y-1">
            <p className="text-white/30 text-xs">Protected by enterprise-grade security</p>
            <div className="flex items-center justify-center gap-3 text-white/25">
              <CheckCircle2 size={12} />
              <span className="text-xs">SSL Encrypted</span>
              <CheckCircle2 size={12} />
              <span className="text-xs">ISO-aligned</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Root export ─── */
export default function ClientPortalPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  return loggedIn
    ? <PortalShell onLogout={() => setLoggedIn(false)} />
    : <LoginScreen onLogin={() => setLoggedIn(true)} />;
}
