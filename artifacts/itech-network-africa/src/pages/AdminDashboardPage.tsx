import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, FileText, Headphones, Settings, LogOut,
  Mail, Lock, Eye, EyeOff, AlertCircle, Shield, Menu, X,
  CheckCircle2, Clock, Copy, Check, Plus, Trash2,
  Building2, Phone, Star, TrendingUp, TrendingDown, Key, ExternalLink,
  Send, RefreshCw, Printer, Download, Edit3,
  DollarSign, AlertTriangle, MessageSquare, Filter,
  Megaphone, BarChart2, FolderOpen, FileUp, StickyNote,
  ChevronDown, ChevronLeft, Zap, Activity, Tag, UserCog, BookTemplate,
  Bell, Archive, Search, Upload, Percent, Flag, UserCheck,
  MinusCircle, CheckSquare, Square, Handshake,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { PORTAL_CLIENTS } from '@/lib/portalClients';
import { apiUrl } from '@/lib/apiBase';
import { ADMIN_CREDENTIALS, verifyAdminPassword, decodeClientPassword } from '@/lib/adminAuth';
import {
  getInvoices, saveInvoice, deleteInvoice, updateInvoiceStatus,
  getTickets, addTicketMessage, updateTicketStatus, updateTicketPriority,
  assignTicket, markTicketMessagesRead, getAdminUnread,
  getManagedProjects, saveProject, deleteProject, toggleMilestone,
  getAnnouncements, saveAnnouncement, deleteAnnouncement,
  getFiles, saveFile, deleteFile,
  getPaymentConfirmations, updatePaymentStatus,
  getQuickReplies, saveQuickReply, deleteQuickReply,
  getClientNotes, saveClientNote, deleteClientNote,
  getActivityLog,
  getInvoiceTemplates, saveInvoiceTemplate, deleteInvoiceTemplate,
  getMonthlyRevenue,
  getClientUploadedFiles, updateClientUploadStatus, deleteClientUploadedFile,
  getDisputes, updateDisputeStatus,
  playNotificationSound, hydrateAdminFromAPI, scheduleSyncToAPI,
  fmt$, fmtDate, timeAgo, todayStr, addDays, genId,
  type Invoice, type SupportTicket, type ManagedProject,
  type Announcement, type PortalFile, type QuickReplyTemplate,
  type ClientNote, type InvoiceTemplate, type ClientUploadedFile,
  type InvoiceDispute,
} from '@/lib/portalData';
import { LiveChatSection, TeamSection } from '@/components/admin/LiveSupportSection';
import { PartnershipsSection } from '@/components/admin/PartnershipsSection';
import { saveAuthToken, clearAuthToken } from '@/lib/authToken';

// ─── Colour Maps ──────────────────────────────────────────────────────────────
const INV_STATUS: Record<string, { bg: string; text: string; dot: string }> = {
  Draft:   { bg: 'bg-slate-100',  text: 'text-slate-600',   dot: 'bg-slate-400'   },
  Sent:    { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500'    },
  Paid:    { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Overdue: { bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500'     },
};
const TKT_STATUS: Record<string, { bg: string; text: string }> = {
  Open:          { bg: 'bg-amber-50',   text: 'text-amber-700'   },
  'In Progress': { bg: 'bg-blue-50',    text: 'text-blue-700'    },
  Resolved:      { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  Closed:        { bg: 'bg-slate-100',  text: 'text-slate-500'   },
};
const PRIORITY_COLOR: Record<string, string> = {
  Low: 'text-slate-400', Medium: 'text-amber-500', High: 'text-orange-500', Urgent: 'text-red-600',
};
const TIER_COLOR: Record<string, string> = {
  Standard: 'bg-blue-50 text-blue-700', Business: 'bg-violet-50 text-violet-700', Enterprise: 'bg-amber-50 text-amber-700',
};
const ANN_TYPE: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  info:        { bg: 'bg-blue-50 border-blue-200',    text: 'text-blue-700',    icon: Bell          },
  warning:     { bg: 'bg-amber-50 border-amber-200',  text: 'text-amber-700',   icon: AlertTriangle  },
  success:     { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: CheckCircle2 },
  maintenance: { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-600',   icon: Settings       },
};

// ─── Shared ───────────────────────────────────────────────────────────────────
function Badge({ n }: { n: number }) {
  if (!n) return null;
  return <span className="ml-auto min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{n > 99 ? '99+' : n}</span>;
}
function Chip({ label, cls }: { label: string; cls: string }) {
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>;
}
function SectionHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
      <div><h2 className="text-xl font-black text-slate-900">{title}</h2>{sub && <p className="text-sm text-slate-400 mt-0.5">{sub}</p>}</div>
      {action}
    </div>
  );
}
function GreenBtn({ children, onClick, sm }: { children: React.ReactNode; onClick?: () => void; sm?: boolean }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2e911f] text-white font-bold rounded-xl transition-colors ${sm ? 'text-xs px-3 py-2' : 'text-sm px-4 py-2.5'}`}>
      {children}
    </button>
  );
}
function Modal({ onClose, children, wide }: { onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className={`w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} bg-white rounded-2xl shadow-2xl my-6`}>
        <div className="flex justify-end px-5 pt-4"><button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400"><X size={16} /></button></div>
        {children}
      </motion.div>
    </div>
  );
}

// ─── OVERVIEW ─────────────────────────────────────────────────────────────────
function Overview({ onNav }: { onNav: (s: string) => void }) {
  const invoices  = getInvoices();
  const tickets   = getTickets();
  const revenue   = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.total, 0);
  const prevRev   = revenue * 0.84; // simulated prev period
  const pending   = invoices.filter(i => i.status === 'Sent').reduce((s, i) => s + i.total, 0);
  const openTkts  = tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;
  const unread    = getAdminUnread();
  const chartData = getMonthlyRevenue(6);
  const activity  = getActivityLog().slice(0, 8);

  const STATS = [
    { label: 'Total Clients',     value: PORTAL_CLIENTS.length,   icon: Users,        color: 'bg-violet-50 text-violet-600', trend: null },
    { label: 'Revenue Collected', value: fmt$(revenue),           icon: DollarSign,   color: 'bg-emerald-50 text-emerald-600', trend: revenue > prevRev ? 'up' : 'down' },
    { label: 'Awaiting Payment',  value: fmt$(pending),           icon: Clock,        color: 'bg-blue-50 text-blue-600', trend: null },
    { label: 'Open Tickets',      value: openTkts,                icon: MessageSquare,color: 'bg-amber-50 text-amber-600', trend: unread ? 'alert' : null },
    { label: 'Paid Invoices',     value: invoices.filter(i => i.status === 'Paid').length, icon: CheckCircle2, color: 'bg-teal-50 text-teal-600', trend: null },
    { label: 'Overdue',           value: invoices.filter(i => i.status === 'Overdue').length, icon: AlertTriangle, color: 'bg-red-50 text-red-600', trend: 'warn' },
  ];

  const ENTITY_ICON: Record<string, React.ElementType> = {
    Invoice: FileText, Ticket: Headphones, Client: Users, Project: FolderOpen,
    File: FileUp, Announcement: Megaphone, System: Settings,
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Overview" sub="Real-time snapshot of your portal" />

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {STATS.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-start gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}><s.icon size={20} /></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="text-2xl font-black text-slate-900 leading-none">{s.value}</div>
                {s.trend === 'up' && <TrendingUp size={14} className="text-emerald-500" />}
                {s.trend === 'down' && <TrendingDown size={14} className="text-red-400" />}
                {s.trend === 'alert' && <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">{unread} new</span>}
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2"><BarChart2 size={16} className="text-[#3CB52A]" /> Revenue (Last 6 Months)</h3>
          <span className="text-xs text-slate-400">Paid invoices only</span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
            <Tooltip formatter={(v: number) => [fmt$(v), 'Revenue']} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
            <Bar dataKey="revenue" fill="#3CB52A" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent invoices */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Recent Invoices</h3>
            <button onClick={() => onNav('invoices')} className="text-xs font-semibold text-[#3CB52A] hover:underline">View all</button>
          </div>
          {getInvoices().slice(-4).reverse().map(inv => {
            const s = INV_STATUS[inv.status];
            return (
              <div key={inv.id} className="flex items-center gap-3 px-5 py-3 border-b border-slate-50 last:border-0">
                <div className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 truncate">{inv.invoiceNumber} — {inv.clientName}</div>
                  <div className="text-xs text-slate-400">{fmtDate(inv.issuedDate)}</div>
                </div>
                <div className="text-sm font-black text-slate-900">{fmt$(inv.total)}</div>
              </div>
            );
          })}
          {getInvoices().length === 0 && <div className="py-10 text-center text-slate-400 text-sm">No invoices yet.</div>}
        </div>

        {/* Activity log */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><Activity size={14} className="text-[#3CB52A]" />Activity Log</h3>
            <span className="text-xs text-slate-400">{activity.length} recent</span>
          </div>
          <div className="divide-y divide-slate-50">
            {activity.length === 0 && <div className="py-10 text-center text-slate-400 text-sm">No activity yet.</div>}
            {activity.map(log => {
              const Icon = ENTITY_ICON[log.entity] ?? Activity;
              return (
                <div key={log.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center shrink-0"><Icon size={12} className="text-slate-400" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-700 truncate">{log.action}</div>
                    <div className="text-[10px] text-slate-400 truncate">{log.detail}</div>
                  </div>
                  <div className="text-[10px] text-slate-300 shrink-0">{timeAgo(log.timestamp)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-[#0A1929] rounded-2xl p-6">
        <h3 className="text-white font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'New Invoice',    icon: FileText,    action: () => onNav('invoices'),       color: 'bg-[#3CB52A]/20 text-[#3CB52A]' },
            { label: 'View Tickets',   icon: MessageSquare, action: () => onNav('support'),      color: 'bg-blue-500/20 text-blue-400'   },
            { label: 'Announcement',   icon: Megaphone,   action: () => onNav('announcements'),  color: 'bg-amber-500/20 text-amber-400' },
            { label: 'Reports',        icon: BarChart2,   action: () => onNav('reports'),        color: 'bg-violet-500/20 text-violet-400'},
          ].map((a, i) => (
            <button key={i} onClick={a.action} className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white/5 transition-colors text-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.color}`}><a.icon size={18} /></div>
              <span className="text-xs font-semibold text-white/60">{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── INVOICES SECTION ─────────────────────────────────────────────────────────
function InvoiceForm({ editing, onClose, onSaved }: { editing: Invoice | null; onClose: () => void; onSaved: () => void }) {
  const blank = { id: '', description: '', qty: 1, rate: 0, amount: 0 };
  const [clientId, setClientId] = useState(editing?.clientId || '');
  const [issued, setIssued]     = useState(editing?.issuedDate || todayStr());
  const [due, setDue]           = useState(editing?.dueDate || addDays(30));
  const [items, setItems]       = useState(editing?.items.map(i => ({ ...i })) || [{ ...blank, id: '1' }]);
  const [taxRate, setTaxRate]   = useState(editing?.taxRate ?? 0);
  const [notes, setNotes]       = useState(editing?.notes || '');
  const [terms, setTerms]       = useState(editing?.paymentTerms || 'Payment due within 30 days of invoice date.');
  const [saving, setSaving]     = useState<'Draft' | 'Sent' | null>(null);
  const [err, setErr]           = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [dbClients, setDbClients] = useState<DbClient[]>([]);

  const [discountPct, setDiscountPct] = useState(editing?.discountPercent ?? 0);

  useEffect(() => {
    fetch(apiUrl('/api/admin/clients'), { credentials: 'include' })
      .then(r => r.ok ? r.json() : []).then(setDbClients).catch(() => {});
  }, []);

  const client = dbClients.find(c => c.id === clientId);
  const subtotal    = items.reduce((s, i) => s + (i.amount || 0), 0);
  const discAmt     = subtotal * (discountPct || 0) / 100;
  const taxAmt      = (subtotal - discAmt) * (taxRate || 0) / 100;
  const total       = subtotal - discAmt + taxAmt;

  function loadTemplate(tpl: InvoiceTemplate) {
    setItems(tpl.items.map(i => ({ ...i })));
    setNotes(tpl.notes); setTerms(tpl.paymentTerms); setTaxRate(tpl.taxRate);
    setShowTemplates(false);
  }
  function addRow() { setItems(p => [...p, { id: Date.now().toString(), description: '', qty: 1, rate: 0, amount: 0 }]); }
  function removeRow(id: string) { setItems(p => p.filter(r => r.id !== id)); }
  function updateRow(id: string, field: string, val: string | number) {
    setItems(p => p.map(r => {
      if (r.id !== id) return r;
      if (field === 'amount') return { ...r, amount: Number(val) };           // manual override
      if (field === 'qty')    return { ...r, qty: Number(val), amount: Number(val) * r.rate };
      if (field === 'rate')   return { ...r, rate: Number(val), amount: r.qty * Number(val) };
      return { ...r, [field]: val };
    }));
  }
  function handleSave(status: 'Draft' | 'Sent') {
    setErr('');
    if (!clientId) { setErr('Please select a client.'); return; }
    if (items.every(i => !i.description.trim())) { setErr('Add at least one line item.'); return; }
    setSaving(status);
    setTimeout(() => {
      const savedInv = saveInvoice({
        ...(editing || {}),
        clientId, clientName: client!.name, clientEmail: client!.email, clientOrg: client!.organisation,
        issuedDate: issued, dueDate: due, status,
        items: items.map(i => ({ ...i })),
        taxRate, discountPercent: discountPct, discountAmount: discAmt,
        subtotal, taxAmount: taxAmt, total, notes, paymentTerms: terms,
        ...(status === 'Sent' ? { emailSentAt: new Date().toISOString() } : {}),
      });
      setSaving(null);
      // If sending to client, open mailto with invoice details
      if (status === 'Sent' && client) {
        const body = `Dear ${client.name},\n\nPlease find your invoice details below:\n\nInvoice: ${savedInv.invoiceNumber}\nAmount Due: ${fmt$(total)}\nDue Date: ${fmtDate(due)}\n\nPlease log in to your portal at /portal to view and pay this invoice.\n\nThank you for your business.\n\niTech Network Africa`;
        const mailto = `mailto:${client.email}?subject=${encodeURIComponent(`Invoice ${savedInv.invoiceNumber} - ${fmt$(total)}`)}&body=${encodeURIComponent(body)}`;
        window.open(mailto, '_blank');
      }
      onSaved();
    }, 400);
  }

  const templates = getInvoiceTemplates();

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 280, damping: 30 }}
      className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
        <div>
          <h2 className="font-black text-slate-900">{editing ? 'Edit Invoice' : 'New Invoice'}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{editing ? editing.invoiceNumber : 'Fill in details below'}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowTemplates(v => !v)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <BookTemplate size={13} /> Templates
          </button>
          <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"><X size={18} /></button>
        </div>
      </div>
      <AnimatePresence>
        {showTemplates && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-b border-slate-100 bg-slate-50 overflow-hidden">
            <div className="p-4">
              <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Load Template</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {templates.map(t => (
                  <button key={t.id} onClick={() => loadTemplate(t)} className="text-left p-3 rounded-xl border border-slate-200 bg-white hover:border-[#3CB52A] transition-colors text-sm font-semibold text-slate-700">{t.name}</button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {err && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl"><AlertCircle size={15} /> {err}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Bill To (Client)</label>
            <select value={clientId} onChange={e => setClientId(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A] bg-white">
              <option value="">— Select client —</option>
              {PORTAL_CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name} ({c.organisation})</option>)}
            </select>
          </div>
          <div><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Issue Date</label><input type="date" value={issued} onChange={e => setIssued(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A]" /></div>
          <div><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Due Date</label><input type="date" value={due} onChange={e => setDue(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A]" /></div>
          <div><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Tax (%)</label><input type="number" min={0} max={100} step={0.5} value={taxRate} onChange={e => setTaxRate(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A]" /></div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Line Items</label>
            <button onClick={addRow} className="flex items-center gap-1.5 text-xs font-bold text-[#3CB52A] hover:underline"><Plus size={13} /> Add Row</button>
          </div>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 bg-slate-50 px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <div className="col-span-5">Description</div><div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Rate ($)</div><div className="col-span-2 text-right">Amount</div><div className="col-span-1" />
            </div>
            {items.map((row, i) => (
              <div key={row.id} className="grid grid-cols-12 items-center px-4 py-2.5 border-b border-slate-100 last:border-0 gap-1">
                <div className="col-span-5"><input type="text" value={row.description} onChange={e => updateRow(row.id, 'description', e.target.value)} placeholder={`Item ${i + 1}`} className="w-full text-sm bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-300" /></div>
                <div className="col-span-2 flex justify-center"><input type="number" min={1} value={row.qty} onChange={e => updateRow(row.id, 'qty', Number(e.target.value))} className="w-14 text-center text-sm bg-slate-50 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#3CB52A]" /></div>
                <div className="col-span-2 flex justify-end"><input type="number" min={0} step={0.01} value={row.rate} onChange={e => updateRow(row.id, 'rate', Number(e.target.value))} className="w-20 text-right text-sm bg-slate-50 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#3CB52A]" /></div>
                <div className="col-span-2 flex justify-end"><input type="number" min={0} step={0.01} value={row.amount} onChange={e => updateRow(row.id, 'amount', Number(e.target.value))} className="w-20 text-right text-sm font-semibold text-slate-700 bg-slate-50 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#3CB52A]" /></div>
                <div className="col-span-1 flex justify-end">{items.length > 1 && <button onClick={() => removeRow(row.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <div className="w-72 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600"><span>Subtotal</span><span className="font-semibold">{fmt$(subtotal)}</span></div>
            <div className="flex items-center gap-2 text-slate-600">
              <span className="flex items-center gap-1"><Percent size={12} className="text-amber-500" /> Discount (%)</span>
              <input type="number" min={0} max={100} step={0.5} value={discountPct}
                onChange={e => setDiscountPct(Number(e.target.value))}
                className="ml-auto w-16 text-right text-sm bg-amber-50 border border-amber-200 rounded-lg px-2 py-0.5 focus:outline-none focus:border-amber-400" />
              <span className="font-semibold text-amber-600">-{fmt$(discAmt)}</span>
            </div>
            {taxRate > 0 && <div className="flex justify-between text-slate-600"><span>Tax ({taxRate}%)</span><span className="font-semibold">{fmt$(taxAmt)}</span></div>}
            <div className="flex justify-between font-black text-slate-900 border-t border-slate-200 pt-2 text-base"><span>Total</span><span className="text-[#3CB52A]">{fmt$(total)}</span></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Notes</label><textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Thank you for your business…" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A] resize-none" /></div>
          <div><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Payment Terms</label><textarea value={terms} onChange={e => setTerms(e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A] resize-none" /></div>
        </div>
      </div>
      <div className="px-6 py-4 border-t border-slate-100 bg-white flex gap-3">
        <button onClick={() => handleSave('Draft')} disabled={!!saving} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50">
          {saving === 'Draft' ? 'Saving…' : 'Save as Draft'}
        </button>
        <button onClick={() => handleSave('Sent')} disabled={!!saving} className="flex-1 py-2.5 rounded-xl bg-[#3CB52A] hover:bg-[#2e911f] text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
          <Send size={14} />{saving === 'Sent' ? 'Sending…' : 'Send to Client'}
        </button>
      </div>
    </motion.div>
  );
}

function InvoicesSection() {
  const [invoices, setInvoices]     = useState<Invoice[]>([]);
  const [disputes, setDisputes]     = useState<InvoiceDispute[]>([]);
  const [filter, setFilter]         = useState('All');
  const [showForm, setShowForm]     = useState(false);
  const [editing, setEditing]       = useState<Invoice | null>(null);
  const [previewing, setPreviewing] = useState<Invoice | null>(null);
  const [selected, setSelected]     = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab]   = useState<'invoices' | 'payments' | 'disputes'>('invoices');

  function reload() { setInvoices(getInvoices()); setDisputes(getDisputes()); }
  useEffect(() => { reload(); }, []);

  const filtered = filter === 'All' ? invoices : invoices.filter(i => i.status === filter);
  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.total, 0);
  const pending = invoices.filter(i => i.status === 'Sent').reduce((s, i) => s + i.total, 0);

  function toggleSelect(id: string) { setSelected(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function bulkMarkPaid() { selected.forEach(id => updateInvoiceStatus(id, 'Paid')); setSelected(new Set()); reload(); }
  function bulkMarkOverdue() { selected.forEach(id => updateInvoiceStatus(id, 'Overdue')); setSelected(new Set()); reload(); }
  function bulkDelete() { if (!confirm(`Delete ${selected.size} invoices?`)) return; selected.forEach(id => deleteInvoice(id)); setSelected(new Set()); reload(); }

  const payments = getPaymentConfirmations();

  return (
    <div className="space-y-5">
      <SectionHeader title="Invoices" sub="Create, manage and send invoices to clients"
        action={<GreenBtn onClick={() => { setEditing(null); setShowForm(true); }}><Plus size={15} /> New Invoice</GreenBtn>} />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: invoices.length, icon: FileText, color: 'bg-slate-50 text-slate-500' },
          { label: 'Revenue', value: fmt$(totalRevenue), icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Awaiting', value: fmt$(pending), icon: Clock, color: 'bg-blue-50 text-blue-600' },
          { label: 'Overdue', value: invoices.filter(i => i.status === 'Overdue').length, icon: AlertTriangle, color: 'bg-red-50 text-red-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}><s.icon size={16} /></div>
            <div><div className="font-black text-slate-900 text-sm">{s.value}</div><div className="text-[11px] text-slate-400">{s.label}</div></div>
          </div>
        ))}
      </div>

      {/* Tab switch */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit flex-wrap">
        <button onClick={() => setActiveTab('invoices')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'invoices' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          Invoices ({invoices.length})
        </button>
        <button onClick={() => setActiveTab('payments')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'payments' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          Payments {payments.filter(p => p.status === 'Pending').length > 0 && <span className="ml-1 bg-amber-500 text-white text-[9px] font-bold rounded-full px-1.5 py-0.5">{payments.filter(p => p.status === 'Pending').length}</span>}
        </button>
        <button onClick={() => setActiveTab('disputes')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'disputes' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <Flag size={11} /> Disputes
          {disputes.filter(d => d.status === 'Open').length > 0 && <span className="bg-red-500 text-white text-[9px] font-bold rounded-full px-1.5 py-0.5">{disputes.filter(d => d.status === 'Open').length}</span>}
        </button>
      </div>

      {activeTab === 'invoices' ? (
        <>
          {/* Bulk actions */}
          {selected.size > 0 && (
            <div className="flex items-center gap-3 bg-[#f0fdf4] border border-[#BBF7D0] rounded-xl px-4 py-3">
              <span className="text-sm font-bold text-[#166534]">{selected.size} selected</span>
              <button onClick={bulkMarkPaid} className="text-xs font-bold bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors">Mark Paid</button>
              <button onClick={bulkMarkOverdue} className="text-xs font-bold bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition-colors">Mark Overdue</button>
              <button onClick={bulkDelete} className="text-xs font-bold bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors">Delete</button>
              <button onClick={() => setSelected(new Set())} className="ml-auto text-xs text-slate-400 hover:text-slate-600">Clear</button>
            </div>
          )}

          <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
            {['All', 'Draft', 'Sent', 'Paid', 'Overdue'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === f ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {f} {f !== 'All' && <span className="opacity-60">({invoices.filter(i => i.status === f).length})</span>}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {filtered.length === 0
              ? <div className="py-16 text-center text-slate-400 text-sm">{filter === 'All' ? 'No invoices yet.' : `No ${filter} invoices.`}</div>
              : <div className="divide-y divide-slate-50">
                {filtered.map(inv => {
                  const s = INV_STATUS[inv.status];
                  const isOverdue = inv.status === 'Sent' && new Date(inv.dueDate) < new Date();
                  return (
                    <div key={inv.id} className="flex flex-wrap items-center gap-3 px-5 py-4 hover:bg-slate-50/50 transition-colors">
                      <input type="checkbox" checked={selected.has(inv.id)} onChange={() => toggleSelect(inv.id)} className="rounded" />
                      <div className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-800 text-sm">{inv.invoiceNumber}</span>
                          <Chip label={inv.status} cls={`${s.bg} ${s.text}`} />
                          {isOverdue && <Chip label="Overdue!" cls="bg-red-100 text-red-600" />}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{inv.clientName} · {inv.clientOrg}</div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <div className="font-black text-slate-900 text-sm">{fmt$(inv.total)}</div>
                        <div className="text-[11px] text-slate-400">Due {fmtDate(inv.dueDate)}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setPreviewing(inv)} title="Preview" className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"><Eye size={15} /></button>
                        <button onClick={() => { setEditing(inv); setShowForm(true); }} title="Edit" className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"><Edit3 size={15} /></button>
                        {(inv.status === 'Sent' || inv.status === 'Overdue') && (
                          <button onClick={() => { updateInvoiceStatus(inv.id, 'Paid'); reload(); }} title="Mark Paid"
                            className="w-8 h-8 rounded-lg hover:bg-emerald-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors"><CheckCircle2 size={15} /></button>
                        )}
                        {(inv.status === 'Sent' || inv.status === 'Overdue') && (
                          <a href={`mailto:${inv.clientEmail}?subject=Invoice%20Reminder%20-%20${inv.invoiceNumber}&body=Dear%20${encodeURIComponent(inv.clientName)}%2C%0A%0AThis%20is%20a%20friendly%20reminder%20that%20invoice%20${inv.invoiceNumber}%20for%20${encodeURIComponent(fmt$(inv.total))}%20is%20due%20${fmtDate(inv.dueDate)}.%0A%0APlease%20log%20in%20to%20your%20portal%20to%20view%20and%20pay%20your%20invoice.%0A%0ABest%20regards%2C%0AiTech%20Network%20Africa`}
                            title="Send reminder" className="w-8 h-8 rounded-lg hover:bg-amber-50 flex items-center justify-center text-slate-400 hover:text-amber-600 transition-colors"><Mail size={15} /></a>
                        )}
                        <button onClick={() => { deleteInvoice(inv.id); reload(); }} title="Delete"
                          className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            }
          </div>
        </>
      ) : activeTab === 'payments' ? (
        /* Payment Confirmations */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-50 bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Client Payment Submissions ({payments.length})
          </div>
          {payments.length === 0
            ? <div className="py-16 text-center text-slate-400 text-sm">No payment confirmations yet. Clients submit these from their portal.</div>
            : <div className="divide-y divide-slate-50">
              {[...payments].reverse().map(p => {
                const statusCls = p.status === 'Pending' ? 'bg-amber-50 text-amber-700' : p.status === 'Verified' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700';
                return (
                  <div key={p.id} className="flex flex-wrap items-center gap-3 px-5 py-4 hover:bg-slate-50/50">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-800 text-sm">{p.invoiceNumber}</span>
                        <Chip label={p.status} cls={statusCls} />
                        <Chip label={p.method} cls="bg-slate-100 text-slate-600" />
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{p.clientName} · Ref: <span className="font-mono font-bold text-slate-600">{p.reference}</span></div>
                      {p.note && <div className="text-xs text-slate-500 mt-1 italic">"{p.note}"</div>}
                    </div>
                    <div className="text-xs text-slate-400">{timeAgo(p.submittedAt)}</div>
                    {p.status === 'Pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => { updatePaymentStatus(p.id, 'Verified'); const inv = getInvoices().find(i => i.id === p.invoiceId); if (inv) updateInvoiceStatus(inv.id, 'Paid'); reload(); }}
                          className="text-xs font-bold bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors">Verify & Mark Paid</button>
                        <button onClick={() => { updatePaymentStatus(p.id, 'Rejected'); reload(); }}
                          className="text-xs font-bold border border-red-200 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">Reject</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          }
        </div>
      ) : (
        /* Disputes */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-50 bg-slate-50 flex items-center gap-2">
            <Flag size={13} className="text-red-500" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Invoice Disputes ({disputes.length})</span>
          </div>
          {disputes.length === 0
            ? <div className="py-16 text-center text-slate-400 text-sm">No disputes submitted. Clients can flag invoices from their portal.</div>
            : <div className="divide-y divide-slate-50">
              {[...disputes].reverse().map(d => {
                const statusCls = d.status === 'Open' ? 'bg-red-50 text-red-700' : d.status === 'Under Review' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700';
                return (
                  <div key={d.id} className="flex flex-wrap items-center gap-3 px-5 py-4 hover:bg-slate-50/50">
                    <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0"><Flag size={15} className="text-red-500" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-800 text-sm">{d.invoiceNumber}</span>
                        <Chip label={d.status} cls={statusCls} />
                        <Chip label={d.reason} cls="bg-slate-100 text-slate-600" />
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{d.clientName} · {timeAgo(d.submittedAt)}</div>
                      {d.details && <div className="text-xs text-slate-600 mt-1 italic">"{d.details}"</div>}
                      {d.adminNote && <div className="text-xs text-[#3CB52A] mt-1">Admin note: "{d.adminNote}"</div>}
                    </div>
                    <div className="flex flex-col gap-1">
                      {d.status === 'Open' && (
                        <button onClick={() => { updateDisputeStatus(d.id, 'Under Review'); reload(); }}
                          className="text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors">Start Review</button>
                      )}
                      {d.status !== 'Resolved' && (
                        <button onClick={() => { const note = prompt('Resolution note:') || ''; updateDisputeStatus(d.id, 'Resolved', note); reload(); }}
                          className="text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">Resolve</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          }
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowForm(false)} />
            <InvoiceForm editing={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); reload(); }} />
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {previewing && (
          <Modal onClose={() => setPreviewing(null)} wide>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div><div className="text-xl font-black text-[#0A1929]">iTech Network Africa</div><div className="text-xs text-slate-400">itechnetworkafrica@gmail.com</div></div>
                <div className="text-right"><div className="text-2xl font-black text-[#3CB52A]">INVOICE</div><div className="text-xs font-mono text-slate-400">{previewing.invoiceNumber}</div><Chip label={previewing.status} cls={`${INV_STATUS[previewing.status].bg} ${INV_STATUS[previewing.status].text} mt-1`} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div><div className="text-xs font-bold text-slate-400 uppercase mb-1">Bill To</div><div className="font-bold text-slate-800">{previewing.clientName}</div><div className="text-sm text-slate-500">{previewing.clientOrg}</div></div>
                <div className="text-right"><div className="text-xs font-bold text-slate-400 uppercase mb-1">Details</div><div className="text-sm text-slate-600">Issued: {fmtDate(previewing.issuedDate)}</div><div className="text-sm text-slate-600">Due: {fmtDate(previewing.dueDate)}</div></div>
              </div>
              <table className="w-full text-sm"><thead><tr className="bg-[#0A1929] text-white"><th className="text-left px-3 py-2 rounded-tl-lg">Description</th><th className="px-3 py-2 text-center w-12">Qty</th><th className="px-3 py-2 text-right w-20">Rate</th><th className="px-3 py-2 text-right w-20 rounded-tr-lg">Total</th></tr></thead>
                <tbody>{previewing.items.filter(i => i.description).map((item, i) => (<tr key={item.id} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}><td className="px-3 py-2 text-slate-700">{item.description}</td><td className="px-3 py-2 text-center text-slate-600">{item.qty}</td><td className="px-3 py-2 text-right text-slate-600">{fmt$(item.rate)}</td><td className="px-3 py-2 text-right font-semibold text-slate-800">{fmt$(item.amount)}</td></tr>))}</tbody>
              </table>
              <div className="flex justify-end"><div className="w-48 space-y-1 text-sm"><div className="flex justify-between text-slate-500"><span>Subtotal</span><span>{fmt$(previewing.subtotal)}</span></div>{previewing.taxRate > 0 && <div className="flex justify-between text-slate-500"><span>Tax ({previewing.taxRate}%)</span><span>{fmt$(previewing.taxAmount)}</span></div>}<div className="flex justify-between font-black text-slate-900 border-t pt-1"><span>Total</span><span>{fmt$(previewing.total)}</span></div></div></div>
              <button onClick={() => window.print()} className="flex items-center gap-2 text-sm font-bold px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"><Printer size={14} /> Print / PDF</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── SUPPORT SECTION ──────────────────────────────────────────────────────────
function SupportSection() {
  const [tickets, setTickets]   = useState<SupportTicket[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [reply, setReply]       = useState('');
  const [filter, setFilter]     = useState('All');
  const [search, setSearch]     = useState('');
  const [sending, setSending]   = useState(false);
  const [showQR, setShowQR]     = useState(false);
  const [prevUnread, setPrevUnread] = useState(0);
  const msgEndRef               = useRef<HTMLDivElement>(null);

  function reload() { setTickets(getTickets()); }
  useEffect(() => { reload(); }, []);
  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [selected, tickets]);

  // Notification sound when unread count increases
  useEffect(() => {
    const current = tickets.reduce((n, t) => n + t.messages.filter(m => m.sender === 'client' && !m.read).length, 0);
    if (current > prevUnread && prevUnread > 0) playNotificationSound('message');
    setPrevUnread(current);
  }, [tickets]);

  const ticket  = tickets.find(t => t.id === selected) || null;
  const qrs     = getQuickReplies();
  const FILTERS = ['All', 'Open', 'In Progress', 'Resolved', 'Closed'];
  const filtered = tickets
    .filter(t => filter === 'All' || t.status === filter)
    .filter(t => !search.trim() || t.subject.toLowerCase().includes(search.toLowerCase()) || t.clientName.toLowerCase().includes(search.toLowerCase()));
  const unread   = (t: SupportTicket) => t.messages.filter(m => m.sender === 'client' && !m.read).length;

  function openTicket(id: string) { setSelected(id); markTicketMessagesRead(id, 'admin'); reload(); }
  function sendReply() {
    if (!reply.trim() || !selected || sending) return;
    setSending(true);
    setTimeout(() => { addTicketMessage(selected, 'admin', 'iTech Support Team', reply.trim()); setReply(''); setSending(false); reload(); }, 300);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionHeader title="Support Center" sub={`${tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length} active tickets`} />
        <div className="flex gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets…"
              className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A] w-48" />
          </div>
          <button onClick={reload} className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700"><RefreshCw size={15} /></button>
        </div>
      </div>

      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit flex-wrap">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === f ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {f} <span className="opacity-60">({f === 'All' ? tickets.length : tickets.filter(t => t.status === f).length})</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:h-[600px]">
        <div className={`${selected ? 'hidden lg:flex' : 'flex'} w-full lg:w-72 shrink-0 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex-col h-[480px] lg:h-auto`}>
          <div className="p-3 border-b border-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider">Tickets ({filtered.length})</div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {filtered.length === 0 && <div className="py-12 text-center text-slate-400 text-sm">No tickets.</div>}
            {filtered.map(t => {
              const s = TKT_STATUS[t.status];
              const u = unread(t);
              return (
                <button key={t.id} onClick={() => openTicket(t.id)}
                  className={`w-full text-left px-4 py-3.5 hover:bg-slate-50 transition-colors ${selected === t.id ? 'bg-[#f0fdf4] border-r-2 border-[#3CB52A]' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-sm text-slate-800 truncate flex-1">{t.subject}</span>
                    {u > 0 && <span className="shrink-0 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">{u}</span>}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 truncate">{t.clientName}</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Chip label={t.status} cls={`${s.bg} ${s.text}`} />
                    <span className={`text-[10px] font-semibold ${PRIORITY_COLOR[t.priority]}`}>{t.priority}</span>
                    <span className="text-[10px] text-slate-300 ml-auto">{timeAgo(t.updatedAt)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className={`${selected ? 'flex' : 'hidden lg:flex'} flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm flex-col overflow-hidden h-[70vh] lg:h-auto`}>
          {!ticket ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
              <MessageSquare size={40} className="mb-3" /><p className="text-sm font-semibold">Select a ticket to view the conversation</p>
            </div>
          ) : (
            <>
              <div className="px-4 lg:px-5 py-3 lg:py-4 border-b border-slate-100 flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-1 min-w-0">
                  <button onClick={() => setSelected(null)} className="lg:hidden w-8 h-8 -ml-1 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 shrink-0"><ChevronLeft size={18} /></button>
                  <div className="min-w-0">
                    <div className="font-black text-slate-900 truncate">{ticket.subject}</div>
                    <div className="text-xs text-slate-400 mt-0.5 truncate">{ticket.ticketNumber} · {ticket.clientName} · {ticket.category}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Priority selector */}
                  <select value={ticket.priority} onChange={e => { updateTicketPriority(ticket.id, e.target.value as any); reload(); }}
                    className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#3CB52A] bg-white ${PRIORITY_COLOR[ticket.priority]}`}>
                    {['Low', 'Medium', 'High', 'Urgent'].map(p => <option key={p}>{p}</option>)}
                  </select>
                  {/* Assign */}
                  <select value={ticket.assignedTo || ''} onChange={e => { assignTicket(ticket.id, e.target.value); reload(); }}
                    className="text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#3CB52A] bg-white text-slate-700">
                    <option value="">Unassigned</option>
                    {['Sarah K.', 'James O.', 'Mercy A.', 'David T.'].map(a => <option key={a}>{a}</option>)}
                  </select>
                  {/* Status */}
                  <select value={ticket.status} onChange={e => { updateTicketStatus(ticket.id, e.target.value as any); reload(); }}
                    className="text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#3CB52A] bg-white text-slate-700">
                    {['Open', 'In Progress', 'Resolved', 'Closed'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {ticket.rating && (
                <div className="px-5 py-2 bg-amber-50 border-b border-amber-100 flex items-center gap-2 text-xs text-amber-700">
                  <Star size={13} fill="currentColor" /> Client rated this ticket: {'★'.repeat(ticket.rating)}{'☆'.repeat(5 - ticket.rating)}
                  {ticket.ratingComment && <span className="text-amber-600 italic">· "{ticket.ratingComment}"</span>}
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {ticket.messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${msg.sender === 'admin' ? 'bg-[#0A1929] text-white rounded-br-md' : 'bg-slate-100 text-slate-800 rounded-bl-md'}`}>
                      <div className="text-[11px] font-bold mb-1 opacity-60">{msg.senderName}</div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      <div className="text-[10px] mt-1.5 opacity-40 text-right">{timeAgo(msg.timestamp)}</div>
                    </div>
                  </div>
                ))}
                <div ref={msgEndRef} />
              </div>

              {ticket.status !== 'Closed' && (
                <div className="border-t border-slate-100">
                  {/* Quick replies */}
                  <AnimatePresence>
                    {showQR && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-b border-slate-100 bg-slate-50 p-3">
                        <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Quick Replies</p>
                        <div className="grid grid-cols-2 gap-2">
                          {qrs.map(qr => (
                            <button key={qr.id} onClick={() => { setReply(qr.body); setShowQR(false); }}
                              className="text-left p-2 rounded-xl border border-slate-200 bg-white hover:border-[#3CB52A] transition-colors text-xs">
                              <div className="font-bold text-slate-700">{qr.title}</div>
                              <div className="text-slate-400 truncate mt-0.5">{qr.body.slice(0, 60)}…</div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="px-5 py-3 flex gap-2 items-end">
                    <textarea value={reply} onChange={e => setReply(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                      rows={2} placeholder="Type your reply… (Enter to send)"
                      className="flex-1 resize-none text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#3CB52A] transition-colors" />
                    <button onClick={() => setShowQR(v => !v)} className={`w-9 h-9 rounded-xl border flex items-center justify-center text-sm transition-colors ${showQR ? 'bg-[#3CB52A] border-[#3CB52A] text-white' : 'border-slate-200 text-slate-400 hover:text-[#3CB52A]'}`} title="Quick replies"><Zap size={15} /></button>
                    <button onClick={sendReply} disabled={!reply.trim() || sending}
                      className="w-9 h-9 rounded-xl bg-[#3CB52A] hover:bg-[#2e911f] flex items-center justify-center text-white disabled:opacity-40 transition-colors shrink-0"><Send size={16} /></button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── CLIENTS SECTION ──────────────────────────────────────────────────────────
interface DbClient { id: string; name: string; email: string; organisation: string; role: string; phone: string; memberSince: string; tier: string; isActive: boolean; }

function ClientsSection() {
  const [clients, setClients]     = useState<DbClient[]>([]);
  const [loading, setLoading]     = useState(true);
  const [openClient, setOpenClient] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm]     = useState({ name: '', email: '', password: '', organisation: '', role: 'Client', phone: '', tier: 'Standard' as string });
  const [addErr, setAddErr]       = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [editingPw, setEditingPw] = useState<string | null>(null);
  const [newPw, setNewPw]         = useState('');
  const [copied, setCopied]       = useState<string | null>(null);
  const [noteText, setNoteText]   = useState('');
  const [showProjForm, setShowProjForm] = useState<string | null>(null);
  const [projForm, setProjForm]   = useState<Partial<ManagedProject>>({});
  const [milestoneInput, setMilestoneInput] = useState('');
  const [, forceUpdate]           = useState(0);

  function reloadLocal() { forceUpdate(n => n + 1); }
  function copy(text: string, key: string) { navigator.clipboard.writeText(text).catch(() => {}); setCopied(key); setTimeout(() => setCopied(null), 2000); }

  async function reloadClients() {
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/api/admin/clients'), { credentials: 'include' });
      if (res.ok) setClients(await res.json());
    } catch {}
    setLoading(false);
  }

  useEffect(() => { reloadClients(); }, []);

  async function handleAddClient(e: React.FormEvent) {
    e.preventDefault(); setAddErr('');
    if (!addForm.name.trim() || !addForm.email.trim() || !addForm.password) { setAddErr('Name, email, and password are required.'); return; }
    setAddLoading(true);
    const res = await fetch(apiUrl('/api/admin/clients'), {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addForm),
    });
    const data = await res.json();
    if (!res.ok) { setAddErr(data.error || 'Failed to add client.'); setAddLoading(false); return; }
    setAddForm({ name: '', email: '', password: '', organisation: '', role: 'Client', phone: '', tier: 'Standard' });
    setShowAddForm(false); setAddLoading(false);
    reloadClients();
  }

  async function handleDeactivate(clientId: string) {
    if (!confirm('Deactivate this client? They will no longer be able to log in.')) return;
    await fetch(apiUrl(`/api/admin/clients/${clientId}`), { method: 'DELETE', credentials: 'include' });
    reloadClients();
  }

  async function handleResetPassword(clientId: string) {
    if (!newPw || newPw.length < 8) { alert('Password must be at least 8 characters.'); return; }
    await fetch(apiUrl(`/api/admin/clients/${clientId}`), {
      method: 'PUT', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword: newPw }),
    });
    setEditingPw(null); setNewPw('');
    alert('Password reset successfully.');
  }

  function addNote(clientId: string) {
    if (!noteText.trim()) return;
    saveClientNote({ clientId, text: noteText.trim(), authorName: 'Admin', pinned: false });
    setNoteText(''); reloadLocal();
  }
  function submitProject(clientId: string) {
    if (!projForm.name?.trim()) return;
    saveProject({ ...projForm, clientId });
    setProjForm({}); setShowProjForm(null); reloadLocal();
  }
  function addMilestone() {
    if (!milestoneInput.trim()) return;
    const ms = [...(projForm.milestones || []), { id: genId(), label: milestoneInput.trim(), done: false }];
    setProjForm(p => ({ ...p, milestones: ms }));
    setMilestoneInput('');
  }

  return (
    <div className="space-y-5">
      <SectionHeader title="Client Management" sub={`${clients.length} registered client${clients.length !== 1 ? 's' : ''}`}
        action={<GreenBtn onClick={() => setShowAddForm(v => !v)}><Plus size={15} /> Add Client</GreenBtn>} />

      {/* Add client form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="bg-[#f0fdf4] border border-[#BBF7D0] rounded-2xl p-6 space-y-4">
              <h3 className="font-black text-slate-800 flex items-center gap-2"><UserCheck size={16} className="text-[#3CB52A]" /> New Client Account</h3>
              {addErr && <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2">{addErr}</div>}
              <form onSubmit={handleAddClient} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" placeholder="Full name *" required value={addForm.name} onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))} className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A]" />
                  <input type="email" placeholder="Email address *" required value={addForm.email} onChange={e => setAddForm(p => ({ ...p, email: e.target.value }))} className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A]" />
                  <input type="password" placeholder="Initial password *" required value={addForm.password} onChange={e => setAddForm(p => ({ ...p, password: e.target.value }))} className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A]" />
                  <input type="text" placeholder="Organisation" value={addForm.organisation} onChange={e => setAddForm(p => ({ ...p, organisation: e.target.value }))} className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A]" />
                  <input type="text" placeholder="Role (e.g. CEO)" value={addForm.role} onChange={e => setAddForm(p => ({ ...p, role: e.target.value }))} className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A]" />
                  <input type="text" placeholder="Phone" value={addForm.phone} onChange={e => setAddForm(p => ({ ...p, phone: e.target.value }))} className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A]" />
                  <select value={addForm.tier} onChange={e => setAddForm(p => ({ ...p, tier: e.target.value }))} className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A] bg-white">
                    {['Standard', 'Business', 'Enterprise'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="submit" disabled={addLoading} className="px-5 py-2.5 rounded-xl bg-[#3CB52A] text-white text-sm font-bold hover:bg-[#2e911f] disabled:opacity-50">{addLoading ? 'Creating…' : 'Create Client Account'}</button>
                  <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-500 hover:bg-slate-50">Cancel</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && <div className="flex justify-center py-8"><div className="w-7 h-7 rounded-full border-2 border-[#3CB52A] border-t-transparent animate-spin" /></div>}

      <div className="space-y-4">
        {clients.filter(c => c.isActive).map(client => {
          const isOpen         = openClient === client.id;
          const clientInvoices = getInvoices().filter(i => i.clientId === client.id);
          const clientTickets  = getTickets().filter(t => t.clientId === client.id);
          const notes          = getClientNotes(client.id);
          const projects       = getManagedProjects().filter(p => p.clientId === client.id);

          return (
            <div key={client.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 flex flex-wrap items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#f0fdf4] border-2 border-[#3CB52A]/20 flex items-center justify-center text-[#3CB52A] font-black text-xl shrink-0">{client.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-slate-900">{client.name}</span>
                    <Chip label={client.tier} cls={TIER_COLOR[client.tier] || 'bg-slate-100 text-slate-600'} />
                  </div>
                  <div className="text-sm text-slate-400 truncate">{client.role} · {client.organisation || client.email}</div>
                </div>
                <div className="flex gap-4 text-center text-xs">
                  <div><div className="font-black text-slate-800">{clientInvoices.length}</div><div className="text-slate-400">Invoices</div></div>
                  <div><div className="font-black text-slate-800">{clientTickets.length}</div><div className="text-slate-400">Tickets</div></div>
                  <div><div className="font-black text-slate-800">{projects.length}</div><div className="text-slate-400">Projects</div></div>
                </div>
                <button onClick={() => setOpenClient(isOpen ? null : client.id)}
                  className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-[#3CB52A] transition-colors">
                  <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} /> Details
                </button>
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="border-t border-slate-50 px-6 py-4 space-y-5">
                      {/* Contact info */}
                      <div className="flex flex-wrap gap-4 text-sm">
                        {[{ icon: Mail, v: client.email }, { icon: Phone, v: client.phone || '—' }, { icon: Building2, v: client.organisation || '—' }, { icon: Star, v: `Since ${client.memberSince}` }].map(({ icon: Icon, v }, i) => (
                          <div key={i} className="flex items-center gap-2"><Icon size={13} className="text-slate-400" /><span className="text-slate-600">{v}</span></div>
                        ))}
                      </div>

                      {/* Portal credentials */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Key size={11} /> Portal Access</span>
                        </div>
                        <div className="space-y-2">
                          {[{ label: 'Portal URL', value: '/portal', key: `url-${client.id}` }, { label: 'Email', value: client.email, key: `em-${client.id}` }].map(({ label, value, key }) => (
                            <div key={key} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-200">
                              <div className="flex-1"><div className="text-[10px] text-slate-400 font-semibold">{label}</div><div className="text-sm font-mono text-slate-800">{value}</div></div>
                              <button onClick={() => copy(value, key)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#3CB52A] transition-colors">
                                {copied === key ? <Check size={14} className="text-[#3CB52A]" /> : <Copy size={14} />}
                              </button>
                            </div>
                          ))}
                          {/* Password reset */}
                          {editingPw === client.id ? (
                            <div className="flex gap-2">
                              <input type="password" placeholder="New password (min 8 chars)" value={newPw} onChange={e => setNewPw(e.target.value)} className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A]" />
                              <button onClick={() => handleResetPassword(client.id)} className="px-3 py-2 rounded-xl bg-[#3CB52A] text-white text-xs font-bold">Reset</button>
                              <button onClick={() => { setEditingPw(null); setNewPw(''); }} className="px-3 py-2 rounded-xl border border-slate-200 text-xs">Cancel</button>
                            </div>
                          ) : (
                            <button onClick={() => setEditingPw(client.id)} className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-[#3CB52A] transition-colors mt-1">
                              <Key size={12} /> Reset client password
                            </button>
                          )}
                          <a href={`mailto:${client.email}?subject=Your%20iTech%20Portal%20Access&body=Hello%20${encodeURIComponent(client.name)}%2C%0A%0AYour%20client%20portal%20is%20ready!%0APortal%20URL%3A%20%2Fportal%0AEmail%3A%20${encodeURIComponent(client.email)}%0A%0APlease%20use%20the%20password%20we%20sent%20you%20separately%20for%20security.%0A%0ABest%20regards%2C%0AiTech%20Network%20Africa`}
                            className="flex items-center gap-1.5 text-xs font-bold text-[#3CB52A] hover:underline mt-1">
                            <Mail size={12} /> Email client portal link <ExternalLink size={11} />
                          </a>
                        </div>
                      </div>

                      {/* Projects */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><FolderOpen size={11} /> Projects</span>
                          <button onClick={() => { setProjForm({ clientId: client.id, milestones: [] }); setShowProjForm(client.id); }} className="text-xs font-bold text-[#3CB52A] hover:underline flex items-center gap-1"><Plus size={12} /> Add Project</button>
                        </div>
                        <div className="space-y-2">
                          {projects.map(p => (
                            <div key={p.id} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                              <div className={`w-2 h-2 rounded-full shrink-0 ${p.status === 'Active' ? 'bg-emerald-400' : p.status === 'Completed' ? 'bg-sky-400' : 'bg-amber-400'}`} />
                              <div className="flex-1 min-w-0"><div className="text-sm font-semibold text-slate-700 truncate">{p.name}</div><div className="text-xs text-slate-400">{p.type} · {p.status} · {p.progress}%</div></div>
                              <button onClick={() => { deleteProject(p.id); reloadLocal(); }} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                            </div>
                          ))}
                          {projects.length === 0 && <div className="text-xs text-slate-400 py-2 text-center">No projects yet.</div>}
                        </div>
                        {showProjForm === client.id && (
                          <div className="mt-3 p-4 bg-[#f0fdf4] border border-[#BBF7D0] rounded-xl space-y-3">
                            <p className="text-xs font-bold text-[#166534] uppercase tracking-wider">New Project</p>
                            <input type="text" placeholder="Project name *" value={projForm.name || ''} onChange={e => setProjForm(p => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A]" />
                            <div className="grid grid-cols-2 gap-2">
                              <input type="text" placeholder="Type (e.g. Web Dev)" value={projForm.type || ''} onChange={e => setProjForm(p => ({ ...p, type: e.target.value }))} className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A]" />
                              <select value={projForm.status || 'Active'} onChange={e => setProjForm(p => ({ ...p, status: e.target.value as any }))} className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A] bg-white">
                                {['Active', 'Completed', 'On Hold'].map(s => <option key={s}>{s}</option>)}
                              </select>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500">Progress:</span>
                              <input type="range" min={0} max={100} value={projForm.progress || 0} onChange={e => setProjForm(p => ({ ...p, progress: Number(e.target.value) }))} className="flex-1 accent-[#3CB52A]" />
                              <span className="text-xs font-bold text-[#3CB52A] w-10 text-right">{projForm.progress || 0}%</span>
                            </div>
                            <div className="flex gap-2">
                              <input type="text" placeholder="Add milestone" value={milestoneInput} onChange={e => setMilestoneInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addMilestone()} className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A]" />
                              <button onClick={addMilestone} className="px-3 py-2 rounded-xl bg-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-300">Add</button>
                            </div>
                            {(projForm.milestones || []).length > 0 && (
                              <div className="space-y-1">{(projForm.milestones || []).map(m => <div key={m.id} className="text-xs text-slate-600 flex items-center gap-2"><CheckCircle2 size={11} className="text-[#3CB52A]" />{m.label}</div>)}</div>
                            )}
                            <div className="flex gap-2">
                              <button onClick={() => submitProject(client.id)} className="flex-1 py-2 rounded-xl bg-[#3CB52A] text-white text-xs font-bold hover:bg-[#2e911f]">Save Project</button>
                              <button onClick={() => setShowProjForm(null)} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-500 hover:bg-slate-50">Cancel</button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Internal notes */}
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><StickyNote size={11} /> Internal Notes</p>
                        <div className="space-y-2 mb-2">
                          {notes.map(n => (
                            <div key={n.id} className="flex gap-3 items-start bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
                              <div className="flex-1"><p className="text-sm text-slate-700">{n.text}</p><p className="text-[10px] text-slate-400 mt-1">{n.authorName} · {timeAgo(n.createdAt)}</p></div>
                              <button onClick={() => { deleteClientNote(n.id); reloadLocal(); }} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                            </div>
                          ))}
                          {notes.length === 0 && <div className="text-xs text-slate-400">No notes yet.</div>}
                        </div>
                        <div className="flex gap-2">
                          <input type="text" value={noteText} onChange={e => setNoteText(e.target.value)} onKeyDown={e => e.key === 'Enter' && addNote(client.id)} placeholder="Add internal note…" className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A]" />
                          <button onClick={() => addNote(client.id)} className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-600 hover:bg-slate-200">Add</button>
                        </div>
                      </div>

                      {/* Danger zone */}
                      <div className="pt-2 border-t border-slate-100">
                        <button onClick={() => handleDeactivate(client.id)} className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-600 transition-colors">
                          <MinusCircle size={13} /> Deactivate account
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        {!loading && clients.filter(c => c.isActive).length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
            <Users size={32} className="mx-auto text-slate-200 mb-3" />
            <p className="text-slate-400 text-sm font-semibold">No clients yet</p>
            <p className="text-slate-300 text-xs mt-1">Click "Add Client" to create the first account</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ANNOUNCEMENTS SECTION ────────────────────────────────────────────────────
function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showForm, setShowForm]           = useState(false);
  const [editing, setEditing]             = useState<Announcement | null>(null);
  const [form, setForm]                   = useState<Partial<Announcement>>({ type: 'info', targetClients: 'all', pinned: false });

  function reload() { setAnnouncements(getAnnouncements()); }
  useEffect(() => { reload(); }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title?.trim() || !form.body?.trim()) return;
    saveAnnouncement({ ...editing, ...form });
    setShowForm(false); setEditing(null); setForm({ type: 'info', targetClients: 'all', pinned: false }); reload();
  }

  return (
    <div className="space-y-5">
      <SectionHeader title="Announcements" sub="Post updates visible in the client portal"
        action={<GreenBtn onClick={() => { setEditing(null); setForm({ type: 'info', targetClients: 'all', pinned: false }); setShowForm(true); }}><Plus size={15} /> New Announcement</GreenBtn>} />

      <AnimatePresence>
        {showForm && (
          <Modal onClose={() => setShowForm(false)}>
            <div className="px-6 pb-6">
              <h3 className="font-black text-slate-900 text-lg mb-4">{editing ? 'Edit Announcement' : 'New Announcement'}</h3>
              <form onSubmit={submit} className="space-y-4">
                <div><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Title *</label><input type="text" value={form.title || ''} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A]" placeholder="e.g. Scheduled Maintenance This Weekend" required /></div>
                <div><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Message *</label><textarea value={form.body || ''} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} rows={4} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A] resize-none" placeholder="Describe the announcement in detail…" required /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Type</label>
                    <select value={form.type || 'info'} onChange={e => setForm(p => ({ ...p, type: e.target.value as any }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A] bg-white">
                      {['info', 'warning', 'success', 'maintenance'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Audience</label>
                    <select value={typeof form.targetClients === 'string' ? form.targetClients : 'specific'} onChange={e => setForm(p => ({ ...p, targetClients: e.target.value === 'all' ? 'all' : [] }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A] bg-white">
                      <option value="all">All Clients</option>
                    </select>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.pinned || false} onChange={e => setForm(p => ({ ...p, pinned: e.target.checked }))} className="rounded" />
                  <span className="text-sm font-semibold text-slate-700">Pin to top of client portal</span>
                </label>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 py-3 rounded-xl bg-[#3CB52A] text-white text-sm font-bold hover:bg-[#2e911f]">{editing ? 'Update' : 'Publish'}</button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-500 hover:bg-slate-50">Cancel</button>
                </div>
              </form>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {announcements.length === 0 && <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center text-slate-400 text-sm">No announcements yet. Publish one to notify your clients.</div>}
        {[...announcements].reverse().map(ann => {
          const at = ANN_TYPE[ann.type];
          const AIcon = at.icon;
          return (
            <div key={ann.id} className={`rounded-2xl border p-5 ${at.bg}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${at.bg}`}><AIcon size={16} className={at.text} /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${at.text}`}>{ann.title}</span>
                      {ann.pinned && <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Pinned</span>}
                      <Chip label={ann.type} cls="bg-white/60 text-slate-600" />
                    </div>
                    <p className={`text-sm mt-1 leading-relaxed ${at.text} opacity-80`}>{ann.body}</p>
                    <p className="text-[10px] text-slate-400 mt-2">{ann.adminName} · {timeAgo(ann.createdAt)} · {ann.targetClients === 'all' ? 'All clients' : `${(ann.targetClients as string[]).length} clients`}</p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => { setEditing(ann); setForm({ ...ann }); setShowForm(true); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-white/50 transition-colors"><Edit3 size={14} /></button>
                  <button onClick={() => { deleteAnnouncement(ann.id); reload(); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-white/50 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── REPORTS SECTION ──────────────────────────────────────────────────────────
function ReportsSection() {
  const invoices = getInvoices();
  const tickets  = getTickets();
  const revenue  = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.total, 0);
  const pending  = invoices.filter(i => i.status === 'Sent').reduce((s, i) => s + i.total, 0);
  const overdue  = invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.total, 0);
  const chartData = getMonthlyRevenue(12);
  const byClient  = PORTAL_CLIENTS.map(c => ({ name: c.name, revenue: invoices.filter(i => i.clientId === c.id && i.status === 'Paid').reduce((s, i) => s + i.total, 0), tickets: tickets.filter(t => t.clientId === c.id).length }));
  const avgRes    = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
  const rated     = tickets.filter(t => t.rating).map(t => t.rating!);
  const avgRating = rated.length ? (rated.reduce((s, r) => s + r, 0) / rated.length).toFixed(1) : '—';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader title="Reports" sub="Revenue and support analytics" />
        <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"><Printer size={14} /> Print Report</button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue Collected', value: fmt$(revenue), icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Outstanding', value: fmt$(pending + overdue), icon: Clock, color: 'bg-amber-50 text-amber-600' },
          { label: 'Total Invoices', value: invoices.length, icon: FileText, color: 'bg-blue-50 text-blue-600' },
          { label: 'Avg Support Rating', value: avgRating, icon: Star, color: 'bg-violet-50 text-violet-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}><s.icon size={18} /></div>
            <div><div className="text-xl font-black text-slate-900">{s.value}</div><div className="text-xs text-slate-400 mt-0.5">{s.label}</div></div>
          </div>
        ))}
      </div>

      {/* Revenue trend chart */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><BarChart2 size={15} className="text-[#3CB52A]" /> Monthly Revenue Trend (12 months)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
            <Tooltip formatter={(v: number) => [fmt$(v), 'Revenue']} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
            <Bar dataKey="revenue" fill="#3CB52A" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* By-client breakdown */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Revenue by Client</h3>
          <button onClick={() => { const csv = 'Client,Revenue,Tickets\n' + byClient.map(c => `${c.name},${c.revenue},${c.tickets}`).join('\n'); const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv); a.download = 'itech-report.csv'; a.click(); }} className="text-xs font-bold text-[#3CB52A] hover:underline flex items-center gap-1"><Download size={12} /> Export CSV</button>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider"><th className="px-5 py-3 text-left">Client</th><th className="px-5 py-3 text-right">Revenue</th><th className="px-5 py-3 text-right">Tickets</th><th className="px-5 py-3 text-right">Invoices</th></tr></thead>
          <tbody className="divide-y divide-slate-50">
            {byClient.sort((a, b) => b.revenue - a.revenue).map(c => (
              <tr key={c.name} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 font-semibold text-slate-800">{c.name}</td>
                <td className="px-5 py-3 text-right font-black text-emerald-600">{fmt$(c.revenue)}</td>
                <td className="px-5 py-3 text-right text-slate-500">{c.tickets}</td>
                <td className="px-5 py-3 text-right text-slate-500">{invoices.filter(i => i.clientId === PORTAL_CLIENTS.find(pc => pc.name === c.name)?.id).length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Support summary */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Headphones size={15} className="text-[#3CB52A]" /> Support Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Tickets', value: tickets.length },
            { label: 'Resolved', value: tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length },
            { label: 'Open / Active', value: tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length },
            { label: 'Rated Tickets', value: `${rated.length} (avg ${avgRating}★)` },
          ].map((s, i) => (
            <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="text-xl font-black text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── FILES SECTION ────────────────────────────────────────────────────────────
function FilesSection() {
  const [files, setFiles]           = useState<PortalFile[]>([]);
  const [clientUploads, setClientUploads] = useState<ClientUploadedFile[]>([]);
  const [activeTab, setActiveTab]   = useState<'admin' | 'client'>('admin');
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState<Partial<PortalFile>>({ clientId: 'all', fileType: 'PDF', category: 'Other' });
  const [uploading, setUploading]   = useState(false);
  const [err, setErr]               = useState('');
  const fileInputRef                = useRef<HTMLInputElement>(null);

  function reload() { setFiles(getFiles()); setClientUploads(getClientUploadedFiles()); }
  useEffect(() => { reload(); }, []);

  function pickFile() { fileInputRef.current?.click(); }

  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string;
      const ext = file.name.split('.').pop()?.toUpperCase() || 'Other';
      const sizeKB = Math.round(file.size / 1024);
      const sizeLabel = sizeKB >= 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;
      setForm(p => ({
        ...p,
        name: file.name,
        fileType: ['PDF','DOCX','XLSX','ZIP','PNG','MP4'].includes(ext) ? ext : 'Other',
        sizeLabel,
        dataUrl,
        downloadUrl: '#',
      }));
      setShowForm(true);
      setUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  function submit(e: React.FormEvent) {
    e.preventDefault(); setErr('');
    if (!form.name?.trim()) { setErr('File name is required.'); return; }
    saveFile({ ...form, clientId: form.clientId || 'all', downloadUrl: form.downloadUrl || '#' } as PortalFile);
    setShowForm(false); setForm({ clientId: 'all', fileType: 'PDF', category: 'Other' }); reload();
  }

  function downloadFile(f: PortalFile) {
    if (f.dataUrl) {
      const a = document.createElement('a'); a.href = f.dataUrl; a.download = f.name; a.click();
    } else if (f.downloadUrl && f.downloadUrl !== '#') {
      window.open(f.downloadUrl, '_blank');
    }
  }

  const FILE_ICON: Record<string, string> = { PDF: '📄', ZIP: '📦', DOCX: '📝', XLSX: '📊', PNG: '🖼️', MP4: '🎬', Other: '📎' };
  const pendingUploads = clientUploads.filter(f => f.status === 'Pending Review').length;

  return (
    <div className="space-y-5">
      <SectionHeader title="File Manager" sub="Upload files for clients and review client submissions"
        action={
          <div className="flex gap-2">
            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFilePick} />
            <GreenBtn onClick={pickFile}>
              {uploading ? <RefreshCw size={15} className="animate-spin" /> : <Upload size={15} />} Upload File
            </GreenBtn>
            <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50">
              <ExternalLink size={13} /> Add Link
            </button>
          </div>
        } />

      {/* Tab switch */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        <button onClick={() => setActiveTab('admin')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'admin' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
          Admin Files ({files.length})
        </button>
        <button onClick={() => setActiveTab('client')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'client' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
          Client Uploads ({clientUploads.length})
          {pendingUploads > 0 && <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">{pendingUploads}</span>}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <Modal onClose={() => setShowForm(false)}>
            <div className="px-6 pb-6">
              <h3 className="font-black text-slate-900 text-lg mb-4">{form.dataUrl ? 'Save Uploaded File' : 'Add File Link'}</h3>
              {form.dataUrl && <div className="flex items-center gap-2 bg-[#f0fdf4] border border-[#BBF7D0] rounded-xl px-4 py-3 mb-4 text-sm text-[#166534]"><CheckCircle2 size={15} /> File uploaded and ready. Fill in the details below.</div>}
              {!form.dataUrl && <p className="text-xs text-slate-400 mb-4">Link to Google Drive, Dropbox, or any direct URL.</p>}
              {err && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{err}</div>}
              <form onSubmit={submit} className="space-y-4">
                <div><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">File Name *</label><input type="text" value={form.name || ''} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Project Proposal v2.pdf" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A]" /></div>
                {!form.dataUrl && <div><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Download URL</label><input type="text" value={form.downloadUrl || ''} onChange={e => setForm(p => ({ ...p, downloadUrl: e.target.value }))} placeholder="https://drive.google.com/…" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A]" /></div>}
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Type</label>
                    <select value={form.fileType || 'PDF'} onChange={e => setForm(p => ({ ...p, fileType: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A] bg-white">
                      {['PDF', 'DOCX', 'XLSX', 'ZIP', 'PNG', 'MP4', 'Other'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Category</label>
                    <select value={form.category || 'Other'} onChange={e => setForm(p => ({ ...p, category: e.target.value as any }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A] bg-white">
                      {['Contract', 'Report', 'Design', 'Invoice', 'Proposal', 'Other'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Size</label><input type="text" value={form.sizeLabel || ''} onChange={e => setForm(p => ({ ...p, sizeLabel: e.target.value }))} placeholder="2.4 MB" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A]" /></div>
                  <div><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Visible To</label>
                    <select value={typeof form.clientId === 'string' && form.clientId !== 'all' ? form.clientId : 'all'} onChange={e => setForm(p => ({ ...p, clientId: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A] bg-white">
                      <option value="all">All Clients</option>
                      {PORTAL_CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 py-3 rounded-xl bg-[#3CB52A] text-white text-sm font-bold hover:bg-[#2e911f]">Save File</button>
                  <button type="button" onClick={() => { setShowForm(false); setForm({ clientId: 'all', fileType: 'PDF', category: 'Other' }); }} className="px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-500 hover:bg-slate-50">Cancel</button>
                </div>
              </form>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {activeTab === 'admin' ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {files.length === 0
            ? <div className="py-16 text-center text-slate-400 text-sm">No files yet. Upload files to make them available to clients in their portal.</div>
            : <div className="divide-y divide-slate-50">
              {files.map(f => (
                <div key={f.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/50 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shrink-0">{FILE_ICON[f.fileType] || '📎'}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-slate-800 truncate">{f.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{f.category}</span>
                      <span>{f.fileType}</span>
                      {f.sizeLabel && <span>{f.sizeLabel}</span>}
                      {f.dataUrl && <span className="text-[#3CB52A] font-semibold">Direct upload</span>}
                      <span>→ {f.clientId === 'all' ? 'All clients' : f.clientId}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 hidden sm:block">{timeAgo(f.uploadedAt)}</div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => downloadFile(f)} title="Download" className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"><Download size={14} /></button>
                    <button onClick={() => { deleteFile(f.id); reload(); }} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
      ) : (
        /* Client Uploads Tab */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-50 bg-slate-50 flex items-center gap-2">
            <Upload size={13} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Files uploaded by clients ({clientUploads.length})</span>
          </div>
          {clientUploads.length === 0
            ? <div className="py-16 text-center text-slate-400 text-sm">No client uploads yet. Clients can upload files from their portal.</div>
            : <div className="divide-y divide-slate-50">
              {[...clientUploads].reverse().map(f => {
                const statusCls = f.status === 'Pending Review' ? 'bg-amber-50 text-amber-700' : f.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700';
                return (
                  <div key={f.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shrink-0">{FILE_ICON[f.fileType] || '📎'}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-slate-800 truncate">{f.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusCls}`}>{f.status}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {PORTAL_CLIENTS.find(c => c.id === f.clientId)?.name || f.clientId} · {f.fileType} · {f.sizeLabel}
                        {f.description && <span className="italic"> · "{f.description}"</span>}
                      </div>
                      {f.adminNote && <div className="text-xs text-slate-500 mt-0.5 italic">Admin note: "{f.adminNote}"</div>}
                    </div>
                    <div className="text-[11px] text-slate-400">{timeAgo(f.uploadedAt)}</div>
                    <div className="flex flex-col gap-1">
                      <button onClick={() => { const a = document.createElement('a'); a.href = f.dataUrl; a.download = f.name; a.click(); }}
                        className="flex items-center gap-1 text-xs font-bold text-[#3CB52A] hover:underline"><Download size={12} /> Download</button>
                      <div className="flex gap-1">
                        {f.status === 'Pending Review' && <>
                          <button onClick={() => { updateClientUploadStatus(f.id, 'Accepted'); reload(); }}
                            className="text-[10px] font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2 py-1 rounded-lg transition-colors">Accept</button>
                          <button onClick={() => { const note = prompt('Rejection reason (optional):') || ''; updateClientUploadStatus(f.id, 'Rejected', note); reload(); }}
                            className="text-[10px] font-bold bg-red-50 text-red-600 hover:bg-red-100 px-2 py-1 rounded-lg transition-colors">Reject</button>
                        </>}
                        <button onClick={() => { deleteClientUploadedFile(f.id); reload(); }}
                          className="text-[10px] font-bold text-slate-300 hover:text-red-500 px-2 py-1 rounded-lg transition-colors"><Trash2 size={11} /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          }
        </div>
      )}
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function AdminSettings() {
  const [copied, setCopied]       = useState<string | null>(null);
  const [qrs, setQrs]             = useState<QuickReplyTemplate[]>([]);
  const [showQRForm, setShowQRForm] = useState(false);
  const [qrForm, setQrForm]       = useState<Partial<QuickReplyTemplate>>({});
  const [pwForm, setPwForm]       = useState({ current: '', next: '', confirm: '' });
  const [pwStatus, setPwStatus]   = useState<'idle' | 'success' | 'error'>('idle');
  const [pwMsg, setPwMsg]         = useState('');
  const [showPw, setShowPw]       = useState(false);

  function reloadQrs() { setQrs(getQuickReplies()); }
  useEffect(() => { reloadQrs(); }, []);
  function copy(v: string, k: string) { navigator.clipboard.writeText(v).catch(() => {}); setCopied(k); setTimeout(() => setCopied(null), 2000); }
  function saveQR(e: React.FormEvent) {
    e.preventDefault(); if (!qrForm.title?.trim() || !qrForm.body?.trim()) return;
    saveQuickReply(qrForm); setShowQRForm(false); setQrForm({}); reloadQrs();
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault(); setPwStatus('idle'); setPwMsg('');
    if (!pwForm.current) { setPwStatus('error'); setPwMsg('Enter current password.'); return; }
    if (pwForm.next.length < 8) { setPwStatus('error'); setPwMsg('New password must be at least 8 characters.'); return; }
    if (pwForm.next !== pwForm.confirm) { setPwStatus('error'); setPwMsg('Passwords do not match.'); return; }
    try {
      const res = await fetch(apiUrl('/api/auth/change-password'), {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      });
      if (!res.ok) {
        const d = await res.json();
        setPwStatus('error'); setPwMsg(d.error || 'Current password is incorrect.');
      } else {
        setPwStatus('success'); setPwMsg('Password updated successfully.');
        setPwForm({ current: '', next: '', confirm: '' });
      }
    } catch { setPwStatus('error'); setPwMsg('Connection error. Please try again.'); }
  }

  return (
    <div className="space-y-6 max-w-xl">
      <SectionHeader title="Settings" sub="Admin account, quick replies, and system configuration" />

      {/* Admin account card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-4 pb-5 border-b border-slate-50">
          <div className="w-14 h-14 rounded-2xl bg-[#0A1929] flex items-center justify-center text-[#3CB52A]"><Shield size={26} /></div>
          <div>
            <div className="font-black text-slate-900 text-lg">iTech Admin</div>
            <div className="text-sm text-slate-400">Super Administrator · {ADMIN_CREDENTIALS.email}</div>
          </div>
        </div>
        {[{ label: 'Admin URL', value: '/admin', key: 'url' }, { label: 'Email', value: ADMIN_CREDENTIALS.email, key: 'email' }].map(({ label, value, key }) => (
          <div key={key} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
            <div className="flex-1"><div className="text-[11px] text-slate-400 font-semibold">{label}</div><div className="text-sm font-mono text-slate-800">{value}</div></div>
            <button onClick={() => copy(value, key)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#3CB52A]">
              {copied === key ? <Check size={14} className="text-[#3CB52A]" /> : <Copy size={14} />}
            </button>
          </div>
        ))}

        {/* Change password form */}
        <div className="pt-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Key size={11} /> Change Password</p>
          {pwStatus === 'success' && <div className="mb-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 flex items-center gap-2"><CheckCircle2 size={14} />{pwMsg}</div>}
          {pwStatus === 'error'   && <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2 flex items-center gap-2"><AlertCircle size={14} />{pwMsg}</div>}
          <form onSubmit={changePassword} className="space-y-3">
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} placeholder="Current password" value={pwForm.current} onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A] pr-10" />
              <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">{showPw ? <EyeOff size={14} /> : <Eye size={14} />}</button>
            </div>
            <input type="password" placeholder="New password (min 8 chars)" value={pwForm.next} onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A]" />
            <input type="password" placeholder="Confirm new password" value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A]" />
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#0A1929] text-white text-sm font-bold hover:bg-[#0f2a3d] transition-colors">Update Password</button>
          </form>
        </div>
      </div>

      {/* Quick Reply Templates */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2"><Zap size={15} className="text-[#3CB52A]" /> Quick Reply Templates</h3>
          <button onClick={() => { setQrForm({}); setShowQRForm(v => !v); }} className="text-xs font-bold text-[#3CB52A] hover:underline flex items-center gap-1"><Plus size={12} /> Add</button>
        </div>
        <AnimatePresence>
          {showQRForm && (
            <motion.form onSubmit={saveQR} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-3 border border-[#BBF7D0] bg-[#f0fdf4] rounded-xl p-4">
              <input type="text" placeholder="Template title" value={qrForm.title || ''} onChange={e => setQrForm(p => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A]" />
              <textarea placeholder="Template body…" rows={3} value={qrForm.body || ''} onChange={e => setQrForm(p => ({ ...p, body: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A] resize-none" />
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 rounded-xl bg-[#3CB52A] text-white text-xs font-bold hover:bg-[#2e911f]">Save</button>
                <button type="button" onClick={() => setShowQRForm(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-500">Cancel</button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
        <div className="space-y-2">
          {qrs.map(qr => (
            <div key={qr.id} className="flex items-start gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-slate-700">{qr.title}</div>
                <div className="text-xs text-slate-400 truncate">{qr.body.slice(0, 80)}{qr.body.length > 80 ? '…' : ''}</div>
              </div>
              <button onClick={() => { deleteQuickReply(qr.id); reloadQrs(); }} className="text-slate-300 hover:text-red-500 transition-colors shrink-0"><Trash2 size={13} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Data & backend */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-3">
        <h3 className="font-bold text-slate-800 flex items-center gap-2"><Activity size={15} className="text-[#3CB52A]" /> Data & Backend</h3>
        <div className="space-y-2 text-sm text-slate-500">
          <p>All portal data — clients, invoices, tickets, projects, announcements — is stored in a <strong className="text-slate-700">PostgreSQL database</strong> and synced across devices.</p>
          <p>Sessions last <strong className="text-slate-700">30 days</strong> and are stored server-side with HTTP-only cookies. Logging in on any device loads the latest data automatically.</p>
        </div>
        <div className="flex flex-wrap gap-3 pt-1">
          {[
            { label: 'API Server', value: 'http://localhost:8000', key: 'api' },
            { label: 'Client Portal', value: '/portal', key: 'portal' },
            { label: 'Admin Dashboard', value: '/admin', key: 'admin' },
          ].map(({ label, value, key }) => (
            <div key={key} className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-200">
              <div className="text-[10px] text-slate-400 font-semibold">{label}</div>
              <code className="text-xs font-mono text-slate-700">{value}</code>
              <button onClick={() => copy(value, key)} className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-300 hover:text-[#3CB52A] transition-colors">
                {copied === key ? <Check size={11} className="text-[#3CB52A]" /> : <Copy size={11} />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN SHELL ──────────────────────────────────────────────────────────────
const ADMIN_NAV = [
  { id: 'overview',       label: 'Overview',       icon: LayoutDashboard },
  { id: 'invoices',       label: 'Invoices',        icon: FileText        },
  { id: 'support',        label: 'Support',         icon: Headphones      },
  { id: 'livechat',       label: 'Live Chat',       icon: MessageSquare   },
  { id: 'clients',        label: 'Clients',         icon: Users           },
  { id: 'partnerships',   label: 'Partnerships',    icon: Handshake       },
  { id: 'team',           label: 'Team',            icon: UserCog         },
  { id: 'announcements',  label: 'Announcements',   icon: Megaphone       },
  { id: 'reports',        label: 'Reports',         icon: BarChart2       },
  { id: 'files',          label: 'Files',           icon: FileUp          },
  { id: 'settings',       label: 'Settings',        icon: Settings        },
];

function AdminShell({ onLogout, permissions }: { onLogout: () => void; permissions: string[] | null }) {
  // permissions === null → full access; otherwise only listed sections
  const allowed = (id: string) => permissions == null || permissions.includes(id);
  const nav = ADMIN_NAV.filter(item => allowed(item.id));
  const [section, setSection]     = useState(() => (nav[0]?.id ?? 'overview'));
  const [mobileNav, setMobileNav] = useState(false);
  const [unread, setUnread]       = useState(0);
  const [liveWaiting, setLiveWaiting] = useState(0);

  useEffect(() => {
    function refresh() { setUnread(getAdminUnread()); }
    refresh(); const id = setInterval(refresh, 3000); return () => clearInterval(id);
  }, []);

  // Poll for visitors waiting on a live agent
  useEffect(() => {
    let prev = 0;
    async function poll() {
      try {
        const res = await fetch(apiUrl('/api/admin/live-chats'), { credentials: 'include' });
        if (!res.ok) return;
        const data = await res.json() as { status: string }[];
        const waiting = data.filter(s => s.status === 'waiting').length;
        if (waiting > prev && prev >= 0) playNotificationSound('message');
        prev = waiting;
        setLiveWaiting(waiting);
      } catch { /* ignore */ }
    }
    poll(); const id = setInterval(poll, 6000); return () => clearInterval(id);
  }, []);

  // Periodically sync admin writes to the server (cross-device persistence)
  useEffect(() => {
    scheduleSyncToAPI(true);
    const id = setInterval(() => scheduleSyncToAPI(true), 30000);
    return () => clearInterval(id);
  }, []);

  function navTo(s: string) { if (!allowed(s)) return; setSection(s); setMobileNav(false); }

  const sectionMap: Record<string, React.ReactNode> = {
    overview:      <Overview onNav={navTo} />,
    invoices:      <InvoicesSection />,
    support:       <SupportSection />,
    livechat:      <LiveChatSection />,
    clients:       <ClientsSection />,
    partnerships:  <PartnershipsSection />,
    team:          <TeamSection />,
    announcements: <AnnouncementsSection />,
    reports:       <ReportsSection />,
    files:         <FilesSection />,
    settings:      <AdminSettings />,
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="h-16 bg-[#0A1929] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button className="lg:hidden w-9 h-9 rounded-xl text-white/60 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
            onClick={() => setMobileNav(v => !v)}>{mobileNav ? <X size={20} /> : <Menu size={20} />}</button>
          <div className="w-8 h-8 rounded-lg bg-[#3CB52A] flex items-center justify-center shrink-0"><Shield size={16} className="text-white" /></div>
          <div><span className="text-white font-bold text-sm leading-none block">Admin Dashboard</span><span className="text-white/30 text-[10px]">iTech Network Africa</span></div>
        </div>
        <div className="flex items-center gap-3">
          {unread > 0 && <button onClick={() => navTo('support')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 text-red-400 text-xs font-bold"><MessageSquare size={13} /> {unread} unread</button>}
          <div className="hidden sm:flex items-center gap-1.5 mr-1"><div className="w-2 h-2 rounded-full bg-[#3CB52A] animate-pulse" /><span className="text-white/30 text-xs">Live</span></div>
          <button onClick={onLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors text-xs font-semibold"><LogOut size={14} /> Logout</button>
        </div>
      </header>

      <div className="flex flex-1 relative">
        <aside className="hidden lg:flex flex-col w-52 bg-white border-r border-slate-100 sticky top-16 h-[calc(100vh-4rem)] pt-4 pb-6">
          <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
            {nav.map(item => (
              <button key={item.id} onClick={() => navTo(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${section === item.id ? 'bg-[#f0fdf4] text-[#3CB52A]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
                <item.icon size={16} className={section === item.id ? 'text-[#3CB52A]' : 'text-slate-400'} />
                {item.label}
                {item.id === 'support' && <Badge n={unread} />}
                {item.id === 'livechat' && <Badge n={liveWaiting} />}
              </button>
            ))}
          </nav>
          <div className="px-4"><a href="/portal" className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-[#3CB52A] transition-colors"><ExternalLink size={12} /> View Client Portal</a></div>
        </aside>

        <AnimatePresence>
          {mobileNav && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 bg-black/40 z-20 top-16" onClick={() => setMobileNav(false)} />
              <motion.aside initial={{ x: -220 }} animate={{ x: 0 }} exit={{ x: -220 }} transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                className="lg:hidden fixed left-0 top-16 bottom-0 w-52 bg-white border-r border-slate-100 z-30 flex flex-col pt-4 pb-6">
                <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
                  {nav.map(item => (
                    <button key={item.id} onClick={() => navTo(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${section === item.id ? 'bg-[#f0fdf4] text-[#3CB52A]' : 'text-slate-500 hover:bg-slate-50'}`}>
                      <item.icon size={16} />{item.label}{item.id === 'support' && <Badge n={unread} />}{item.id === 'livechat' && <Badge n={liveWaiting} />}
                    </button>
                  ))}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 p-4 lg:p-8 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={section} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
              {allowed(section) ? sectionMap[section] : (
                <div className="py-16 text-center text-slate-400 text-sm">You don't have access to this section.</div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// ─── ADMIN LOGIN ──────────────────────────────────────────────────────────────
function AdminLoginScreen({ onLogin }: { onLogin: (permissions: string[] | null) => void }) {
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError('');
    if (!email.trim() || !password) { setError('Enter email and password.'); return; }
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password, userType: 'admin' }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Invalid admin credentials.'); setLoading(false); return; }
      saveAuthToken(data.token);
      await hydrateAdminFromAPI();
      onLogin(Array.isArray(data.user?.permissions) ? data.user.permissions : null);
    } catch {
      setError('Connection error. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#060E18] flex flex-col items-center justify-center px-4"
      style={{ backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(60,181,42,0.08) 0%, transparent 55%)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#3CB52A]/15 border border-[#3CB52A]/30">
            <Shield size={13} className="text-[#3CB52A]" /><span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">Admin Access Only</span>
          </div>
        </div>
        <div className="text-center mb-7"><h1 className="text-3xl font-black text-white">Admin Dashboard</h1><p className="text-white/40 text-sm mt-2">iTech Network Africa · Staff only</p></div>
        <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-7 backdrop-blur-sm">
          {error && <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-5"><AlertCircle size={15} className="shrink-0 mt-0.5" />{error}</motion.div>}
          <form onSubmit={submit} className="space-y-4">
            <div><label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Email</label>
              <div className="relative"><Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" /><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@itechnetworkafrica.com" autoComplete="username" className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#3CB52A]/60 transition-colors" /></div>
            </div>
            <div><label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative"><Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" /><input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#3CB52A]/60 transition-colors" /><button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">{showPw ? <EyeOff size={15} /> : <Eye size={15} />}</button></div>
            </div>
            <button type="submit" disabled={loading} className="w-full mt-2 py-3.5 rounded-xl font-bold text-white text-sm bg-[#3CB52A] hover:bg-[#2e911f] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" /></svg>Signing in…</> : <>Sign In to Dashboard</>}
            </button>
          </form>
        </div>
        <p className="text-center text-white/20 text-xs mt-5 flex items-center justify-center gap-2"><Lock size={11} /> Restricted · Staff only</p>
      </motion.div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [authed, setAuthed]     = useState(false);
  const [perms, setPerms]       = useState<string[] | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Restore admin session on page load/refresh
    fetch(apiUrl('/api/auth/me'), { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(async data => {
        if (data?.user?.userType === 'admin') {
          setPerms(Array.isArray(data.user.permissions) ? data.user.permissions : null);
          await hydrateAdminFromAPI();
          setAuthed(true);
        }
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  async function handleLogout() {
    await fetch(apiUrl('/api/auth/logout'), { method: 'POST', credentials: 'include' }).catch(() => {});
    clearAuthToken();
    setAuthed(false);
  }

  if (checking) return (
    <div className="min-h-screen bg-[#060E18] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 rounded-full border-2 border-[#3CB52A] border-t-transparent animate-spin mx-auto" />
        <p className="text-white/30 text-sm">Loading dashboard…</p>
      </div>
    </div>
  );

  return authed
    ? <AdminShell onLogout={handleLogout} permissions={perms} />
    : <AdminLoginScreen onLogin={p => { setPerms(p); setAuthed(true); }} />;
}
