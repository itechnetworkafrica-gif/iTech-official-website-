import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderOpen, FileText, Headphones, Download,
  LogOut, User, Lock, Mail, Phone, Shield, ArrowRight, Menu, X,
  Clock, CheckCircle2, AlertCircle, ExternalLink, Building2, Star,
  FolderX, HardDrive, TrendingUp, MessageSquarePlus,
  ChevronRight, ChevronLeft, Plus, Send, RefreshCw, Printer, Eye, DollarSign,
  Megaphone, Briefcase, Share2, Bell, Activity, Calendar,
  CheckSquare, Square, CreditCard, Banknote, Smartphone, Bitcoin,
  Upload, Flag, FileUp, Trash2,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { type PortalClient } from '@/lib/portalClients';
import { apiUrl } from '@/lib/apiBase';
import { saveAuthToken, clearAuthToken } from '@/lib/authToken';
import { usePortalNotifications } from '@/hooks/usePortalNotifications';
import { NotificationBell } from '@/components/NotificationBell';
import { Logo } from '@/components/Logo';
import {
  getClientInvoices, getClientTickets, createTicket, addTicketMessage,
  markTicketMessagesRead, markInvoiceViewed, getClientUnread, updateTicketStatus,
  rateTicket, getClientManagedProjects, toggleMilestone,
  getClientAnnouncements, getClientFiles, submitPaymentConfirmation,
  getClientPayments, getMonthlyRevenue,
  getClientUploadedFiles, saveClientUploadedFile, deleteClientUploadedFile,
  getClientDisputes, submitDispute,
  playNotificationSound, hydrateClientFromAPI, scheduleSyncToAPI,
  fmt$, fmtDate, timeAgo, todayStr, addDays, nowIso,
  type Invoice, type SupportTicket, type Announcement, type PortalFile,
  type ClientUploadedFile, type InvoiceDispute,
} from '@/lib/portalData';
import { useSEO } from '@/hooks/useSEO';

// ─── Colours ──────────────────────────────────────────────────────────────────
const INV_STATUS: Record<string, { bg: string; text: string; dot: string }> = {
  Sent:    { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-400'    },
  Paid:    { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  Overdue: { bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-400'     },
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
const ANN_STYLE: Record<string, { bar: string; bg: string; text: string }> = {
  info:        { bar: 'bg-blue-500',    bg: 'bg-blue-50 border-blue-200',       text: 'text-blue-700'    },
  warning:     { bar: 'bg-amber-500',   bg: 'bg-amber-50 border-amber-200',     text: 'text-amber-700'   },
  success:     { bar: 'bg-emerald-500', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
  maintenance: { bar: 'bg-slate-500',   bg: 'bg-slate-100 border-slate-200',    text: 'text-slate-600'   },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function NavBadge({ n }: { n: number }) {
  if (!n) return null;
  return <span className="ml-auto min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{n > 99 ? '99+' : n}</span>;
}
function Modal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl my-4">
        <div className="flex justify-end px-4 pt-4 pb-0">
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"><X size={16} /></button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, message, action }: { icon: React.ElementType; title: string; message: string; action?: { label: string; href?: string; onClick?: () => void } }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4"><Icon size={26} className="text-slate-300" /></div>
      <h3 className="text-sm font-bold text-slate-700 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-400 max-w-xs leading-relaxed mb-5">{message}</p>
      {action && (action.onClick
        ? <button onClick={action.onClick} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3CB52A] hover:underline">{action.label} <ArrowRight size={14} /></button>
        : <a href={action.href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3CB52A] hover:underline">{action.label} <ArrowRight size={14} /></a>
      )}
    </div>
  );
}

// ─── INVOICE FULL VIEW ────────────────────────────────────────────────────────
function InvoiceView({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  const s = INV_STATUS[invoice.status] ?? INV_STATUS['Sent'];
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl my-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 print:hidden">
          <span className="font-bold text-slate-800">{invoice.invoiceNumber}</span>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"><Printer size={14} /> Print / PDF</button>
            <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400"><X size={18} /></button>
          </div>
        </div>
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div><div className="text-2xl font-black text-[#0A1929]">iTech Network Africa</div><div className="text-sm text-slate-500 mt-1">itechnetworkafrica@gmail.com</div><div className="text-sm text-slate-500">www.itechnetworkafrica.com</div></div>
            <div className="text-right"><div className="text-3xl font-black text-[#3CB52A]">INVOICE</div><div className="text-sm font-mono text-slate-500 mt-1">{invoice.invoiceNumber}</div><span className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full ${s.bg} ${s.text}`}>{invoice.status}</span></div>
          </div>
          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div><div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bill To</div><div className="font-bold text-slate-800">{invoice.clientName}</div><div className="text-sm text-slate-500">{invoice.clientOrg}</div><div className="text-sm text-slate-500">{invoice.clientEmail}</div></div>
            <div className="text-right"><div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Details</div><div className="text-sm text-slate-600"><span className="font-semibold">Issue Date:</span> {fmtDate(invoice.issuedDate)}</div><div className="text-sm text-slate-600"><span className="font-semibold">Due Date:</span> {fmtDate(invoice.dueDate)}</div></div>
          </div>
          <table className="w-full text-sm border-collapse">
            <thead><tr className="bg-[#0A1929] text-white"><th className="text-left px-4 py-3 font-semibold rounded-tl-lg">Description</th><th className="text-center px-4 py-3 font-semibold w-16">Qty</th><th className="text-right px-4 py-3 font-semibold w-24">Rate</th><th className="text-right px-4 py-3 font-semibold w-24 rounded-tr-lg">Amount</th></tr></thead>
            <tbody>{invoice.items.filter(i => i.description).map((item, i) => (<tr key={item.id} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}><td className="px-4 py-3 text-slate-700">{item.description}</td><td className="px-4 py-3 text-center text-slate-600">{item.qty}</td><td className="px-4 py-3 text-right text-slate-600">{fmt$(item.rate)}</td><td className="px-4 py-3 text-right font-semibold text-slate-800">{fmt$(item.amount)}</td></tr>))}</tbody>
          </table>
          <div className="flex justify-end">
            <div className="w-56 space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>{fmt$(invoice.subtotal)}</span></div>
              {invoice.taxRate > 0 && <div className="flex justify-between text-slate-500"><span>Tax ({invoice.taxRate}%)</span><span>{fmt$(invoice.taxAmount)}</span></div>}
              <div className="flex justify-between font-black text-[#0A1929] text-lg border-t border-slate-200 pt-2"><span>Total Due</span><span>{fmt$(invoice.total)}</span></div>
            </div>
          </div>
          {(invoice.notes || invoice.paymentTerms) && (
            <div className="border-t border-slate-100 pt-4 space-y-1.5 text-sm text-slate-500">
              {invoice.notes && <p><strong className="text-slate-700">Notes:</strong> {invoice.notes}</p>}
              {invoice.paymentTerms && <p><strong className="text-slate-700">Payment Terms:</strong> {invoice.paymentTerms}</p>}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── PAYMENT CONFIRMATION FORM ────────────────────────────────────────────────
function PaymentConfirmationForm({ invoice, clientId, clientName, onClose, onSubmitted }: {
  invoice: Invoice; clientId: string; clientName: string; onClose: () => void; onSubmitted: () => void;
}) {
  const [method, setMethod] = useState<'Bank Transfer' | 'Mobile Money' | 'Credit Card' | 'Cash' | 'Crypto' | 'Other'>('Bank Transfer');
  const [ref, setRef]       = useState('');
  const [note, setNote]     = useState('');
  const [err, setErr]       = useState('');
  const [done, setDone]     = useState(false);

  const METHODS = [
    { id: 'Bank Transfer', icon: Banknote },
    { id: 'Mobile Money',  icon: Smartphone },
    { id: 'Credit Card',   icon: CreditCard },
    { id: 'Crypto',        icon: Bitcoin },
    { id: 'Cash',          icon: DollarSign },
    { id: 'Other',         icon: DollarSign },
  ];

  function submit(e: React.FormEvent) {
    e.preventDefault(); setErr('');
    if (!ref.trim()) { setErr('Please enter a payment reference or transaction ID.'); return; }
    submitPaymentConfirmation({ invoiceId: invoice.id, invoiceNumber: invoice.invoiceNumber, clientId, clientName, reference: ref.trim(), method, note: note.trim(), });
    setDone(true);
    setTimeout(onSubmitted, 2000);
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-white rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div><h3 className="font-black text-slate-900">Confirm Payment</h3><p className="text-xs text-slate-400">{invoice.invoiceNumber} · {fmt$(invoice.total)}</p></div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400"><X size={16} /></button>
        </div>
        {done ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4"><CheckCircle2 size={28} className="text-emerald-500" /></div>
            <h4 className="font-black text-slate-900 text-lg mb-2">Payment Submitted!</h4>
            <p className="text-sm text-slate-400">Our team will verify and confirm your payment within 1 business day.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="p-6 space-y-4">
            {err && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl"><AlertCircle size={14} /> {err}</div>}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {METHODS.map(m => (
                  <button key={m.id} type="button" onClick={() => setMethod(m.id as any)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-xs font-semibold transition-all ${method === m.id ? 'border-[#3CB52A] bg-[#f0fdf4] text-[#166534]' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                    <m.icon size={18} /> {m.id}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Transaction / Reference ID *</label>
              <input type="text" value={ref} onChange={e => setRef(e.target.value)} placeholder="e.g. TXN-12345678 or bank reference" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Note (optional)</label>
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Any additional details about your payment…" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A] resize-none" />
            </div>
            <div className="flex gap-3 pt-1">
              <button type="submit" className="flex-1 py-3 rounded-xl bg-[#3CB52A] hover:bg-[#2e911f] text-white text-sm font-bold flex items-center justify-center gap-2"><Send size={14} /> Submit Payment</button>
              <button type="button" onClick={onClose} className="px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-500 hover:bg-slate-50">Cancel</button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}

// ─── CLIENT INVOICES ──────────────────────────────────────────────────────────
function ClientInvoices({ client }: { client: PortalClient }) {
  const [invoices, setInvoices]   = useState<Invoice[]>([]);
  const [myDisputes, setMyDisputes] = useState<InvoiceDispute[]>([]);
  const [viewing, setViewing]     = useState<Invoice | null>(null);
  const [confirming, setConfirming] = useState<Invoice | null>(null);
  const [disputingInv, setDisputingInv] = useState<Invoice | null>(null);
  const [disputeReason, setDisputeReason] = useState('Incorrect Amount');
  const [disputeDetails, setDisputeDetails] = useState('');
  const [activeTab, setActiveTab] = useState<'list' | 'chart'>('list');

  function reload() { setInvoices(getClientInvoices(client.id)); setMyDisputes(getClientDisputes(client.id)); }
  useEffect(() => { reload(); }, []);

  const totalPaid  = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.total, 0);
  const totalOwing = invoices.filter(i => i.status === 'Sent' || i.status === 'Overdue').reduce((s, i) => s + i.total, 0);
  const payments   = getClientPayments(client.id);
  const chartData  = getMonthlyRevenue(6);

  function openInvoice(inv: Invoice) { markInvoiceViewed(inv.id); setViewing({ ...inv, viewedByClient: true }); reload(); }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-black text-[#0A1929]">Invoices</h2><p className="text-sm text-slate-400 mt-0.5">Your billing history</p></div>
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
          <button onClick={() => setActiveTab('list')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'list' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>List</button>
          <button onClick={() => setActiveTab('chart')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'chart' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>Chart</button>
        </div>
      </div>

      {invoices.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Invoices', value: invoices.length,    icon: FileText,    color: 'bg-slate-50 text-slate-500'       },
            { label: 'Paid',           value: fmt$(totalPaid),    icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
            { label: 'Outstanding',    value: fmt$(totalOwing),   icon: Clock,       color: 'bg-amber-50 text-amber-600'      },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}><s.icon size={16} /></div>
              <div><div className="font-black text-slate-900 text-sm">{s.value}</div><div className="text-[11px] text-slate-400">{s.label}</div></div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'chart' ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-4 text-sm">Your Invoice Activity (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
              <Tooltip formatter={(v: number) => [fmt$(v), 'Revenue']} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="revenue" fill="#3CB52A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-slate-400 mt-3 text-center">Portal-wide invoice data (all clients combined)</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {invoices.length === 0 ? (
            <EmptyState icon={FileText} title="No invoices yet" message="Invoices from iTech Network Africa will appear here once issued." action={{ label: 'Email billing team', href: 'mailto:itechnetworkafrica@gmail.com?subject=Billing%20Query' }} />
          ) : (
            <div className="divide-y divide-slate-50">
              <div className="grid grid-cols-12 px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">
                <div className="col-span-4">Invoice</div><div className="col-span-3 hidden sm:block">Issued</div>
                <div className="col-span-2 hidden sm:block">Due</div><div className="col-span-2 text-right">Amount</div><div className="col-span-1 text-right">Status</div>
              </div>
              {invoices.map(inv => {
                const s = INV_STATUS[inv.status] ?? INV_STATUS['Sent'];
                const myPayment = payments.find(p => p.invoiceId === inv.id);
                return (
                  <div key={inv.id} className="grid grid-cols-12 items-center px-5 py-4 hover:bg-slate-50/50 transition-colors cursor-pointer group" onClick={() => openInvoice(inv)}>
                    <div className="col-span-4 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                      <div>
                        <div className="font-bold text-sm text-slate-800 group-hover:text-[#3CB52A] transition-colors">{inv.invoiceNumber}</div>
                        {!inv.viewedByClient && inv.status === 'Sent' && <span className="text-[9px] font-bold bg-blue-500 text-white px-1.5 py-0.5 rounded-full">NEW</span>}
                        {myPayment && <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${myPayment.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : myPayment.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{myPayment.status === 'Verified' ? '✓ Verified' : myPayment.status === 'Pending' ? 'Payment Pending' : 'Payment Rejected'}</span>}
                      </div>
                    </div>
                    <div className="col-span-3 text-sm text-slate-400 hidden sm:block">{fmtDate(inv.issuedDate)}</div>
                    <div className="col-span-2 text-sm text-slate-400 hidden sm:block">{fmtDate(inv.dueDate)}</div>
                    <div className="col-span-2 text-right font-black text-slate-900">{fmt$(inv.total)}</div>
                    <div className="col-span-1 flex justify-end">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>{inv.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Payment confirmation CTA */}
      {invoices.some(i => (i.status === 'Sent' || i.status === 'Overdue') && !payments.find(p => p.invoiceId === i.id && p.status !== 'Rejected')) && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><CreditCard size={11} /> Confirm a Payment</div>
          <p className="text-sm text-slate-500">Made a payment? Submit your reference so our team can verify and mark your invoice as paid.</p>
          <div className="space-y-2">
            {invoices.filter(i => (i.status === 'Sent' || i.status === 'Overdue') && !payments.find(p => p.invoiceId === i.id && (p.status === 'Pending' || p.status === 'Verified'))).map(inv => (
              <button key={inv.id} onClick={() => setConfirming(inv)}
                className="w-full flex items-center justify-between gap-3 bg-slate-50 hover:bg-[#f0fdf4] border border-slate-200 hover:border-[#BBF7D0] rounded-xl px-4 py-3 transition-colors group">
                <div className="text-left"><div className="text-sm font-bold text-slate-800 group-hover:text-[#166534]">{inv.invoiceNumber}</div><div className="text-xs text-slate-400">{fmtDate(inv.dueDate)} · {fmt$(inv.total)}</div></div>
                <span className="text-xs font-bold text-[#3CB52A] flex items-center gap-1">Confirm Payment <ChevronRight size={13} /></span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#3CB52A]/15 flex items-center justify-center shrink-0"><DollarSign size={18} className="text-[#3CB52A]" /></div>
        <div className="flex-1"><p className="text-sm font-bold text-[#166534]">Invoice query or payment question?</p><p className="text-xs text-[#166534]/70 mt-0.5">Our billing team responds within 24 hours.</p></div>
        <a href="mailto:itechnetworkafrica@gmail.com?subject=Invoice%20Query" className="shrink-0 text-sm font-bold text-[#3CB52A] hover:underline flex items-center gap-1">Email Billing <ExternalLink size={13} /></a>
      </div>

      {/* Dispute CTA */}
      {invoices.some(i => (i.status === 'Sent' || i.status === 'Overdue') && !myDisputes.find(d => d.invoiceId === i.id && d.status !== 'Resolved')) && (
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-4 space-y-3">
          <div className="text-xs font-bold text-red-500 uppercase tracking-wider flex items-center gap-1.5"><Flag size={11} /> Dispute an Invoice</div>
          <p className="text-sm text-slate-500">See an error or unexpected charge? You can flag the invoice and our team will review it.</p>
          <div className="space-y-2">
            {invoices.filter(i => (i.status === 'Sent' || i.status === 'Overdue') && !myDisputes.find(d => d.invoiceId === i.id && d.status !== 'Resolved')).map(inv => (
              <button key={inv.id} onClick={() => { setDisputingInv(inv); setDisputeReason('Incorrect Amount'); setDisputeDetails(''); }}
                className="w-full flex items-center justify-between gap-3 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl px-4 py-3 transition-colors group">
                <div className="text-left"><div className="text-sm font-bold text-slate-800">{inv.invoiceNumber}</div><div className="text-xs text-slate-400">{fmt$(inv.total)} · Due {fmtDate(inv.dueDate)}</div></div>
                <span className="text-xs font-bold text-red-500 flex items-center gap-1">Dispute <Flag size={12} /></span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Show existing disputes */}
      {myDisputes.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Flag size={11} /> My Disputes</div>
          {myDisputes.map(d => {
            const sc = d.status === 'Open' ? 'bg-red-50 text-red-700' : d.status === 'Under Review' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700';
            return (
              <div key={d.id} className="flex flex-wrap items-center gap-3 py-2 border-t border-slate-50 first:border-t-0">
                <Flag size={14} className="text-red-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-slate-800">{d.invoiceNumber}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sc}`}>{d.status}</span>
                    <span className="text-[10px] text-slate-400">{d.reason}</span>
                  </div>
                  {d.details && <p className="text-xs text-slate-500 mt-0.5 italic">"{d.details}"</p>}
                  {d.adminNote && <p className="text-xs text-[#3CB52A] mt-0.5 font-semibold">iTech note: "{d.adminNote}"</p>}
                </div>
                <span className="text-[11px] text-slate-300">{timeAgo(d.submittedAt)}</span>
              </div>
            );
          })}
        </div>
      )}

      <AnimatePresence>{viewing && <InvoiceView invoice={viewing} onClose={() => setViewing(null)} />}</AnimatePresence>
      <AnimatePresence>{confirming && <PaymentConfirmationForm invoice={confirming} clientId={client.id} clientName={client.name} onClose={() => setConfirming(null)} onSubmitted={() => { setConfirming(null); reload(); }} />}</AnimatePresence>

      {/* Dispute Modal */}
      <AnimatePresence>
        {disputingInv && (
          <Modal onClose={() => setDisputingInv(null)}>
            <div className="px-6 pb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center"><Flag size={18} className="text-red-500" /></div>
                <div>
                  <h3 className="font-black text-slate-900">Dispute Invoice</h3>
                  <p className="text-xs text-slate-400">{disputingInv.invoiceNumber} · {fmt$(disputingInv.total)}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Reason</label>
                  <select value={disputeReason} onChange={e => setDisputeReason(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-red-400 bg-white">
                    {(['Incorrect Amount', 'Service Not Delivered', 'Already Paid', 'Duplicate Invoice', 'Other'] as const).map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Details (optional)</label>
                  <textarea value={disputeDetails} onChange={e => setDisputeDetails(e.target.value)} rows={3} placeholder="Explain the issue…"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-red-400 resize-none" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => {
                    submitDispute({ invoiceId: disputingInv.id, invoiceNumber: disputingInv.invoiceNumber, clientId: client.id, clientName: client.name, reason: disputeReason as InvoiceDispute['reason'], details: disputeDetails });
                    playNotificationSound('invoice');
                    setDisputingInv(null); reload();
                  }} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2">
                    <Flag size={14} /> Submit Dispute
                  </button>
                  <button onClick={() => setDisputingInv(null)} className="px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-500 hover:bg-slate-50">Cancel</button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── CLIENT SUPPORT ───────────────────────────────────────────────────────────
function ClientSupport({ client }: { client: PortalClient }) {
  const [tickets, setTickets]   = useState<SupportTicket[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [showNew, setShowNew]   = useState(false);
  const [reply, setReply]       = useState('');
  const [sending, setSending]   = useState(false);
  const [filter, setFilter]     = useState('All');
  const [subject, setSubject]   = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('General');
  const [priority, setPriority] = useState<SupportTicket['priority']>('Medium');
  const [message, setMessage]   = useState('');
  const [formErr, setFormErr]   = useState('');
  const [ratingModal, setRatingModal] = useState<{ ticketId: string; subject: string } | null>(null);
  const [rating, setRating]     = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const msgEndRef               = useRef<HTMLDivElement>(null);

  const [prevUnread, setPrevUnread] = useState(0);

  function reload() { setTickets(getClientTickets(client.id)); }
  useEffect(() => { reload(); const id = setInterval(reload, 8000); return () => clearInterval(id); }, []);
  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [selected, tickets]);

  // Play sound when admin replies arrive
  useEffect(() => {
    const cur = tickets.reduce((n, t) => n + t.messages.filter(m => m.sender === 'admin' && !m.read).length, 0);
    if (cur > prevUnread && prevUnread >= 0) playNotificationSound('message');
    setPrevUnread(cur);
  }, [tickets]);

  const ticket = tickets.find(t => t.id === selected) || null;
  const FILTERS = ['All', 'Open', 'In Progress', 'Resolved'];
  const filtered = filter === 'All' ? tickets : tickets.filter(t => t.status === filter);
  const unread = (t: SupportTicket) => t.messages.filter(m => m.sender === 'admin' && !m.read).length;

  function openTicket(id: string) { setSelected(id); setShowNew(false); markTicketMessagesRead(id, 'client'); reload(); }
  function sendReply() {
    if (!reply.trim() || !selected || sending) return;
    setSending(true);
    setTimeout(() => { addTicketMessage(selected, 'client', client.name, reply.trim()); setReply(''); setSending(false); reload(); }, 300);
  }
  function submitNewTicket(e: React.FormEvent) {
    e.preventDefault(); setFormErr('');
    if (!subject.trim()) { setFormErr('Please enter a subject.'); return; }
    if (!message.trim()) { setFormErr('Please describe your issue.'); return; }
    const t = createTicket({ clientId: client.id, clientName: client.name, clientEmail: client.email, subject, category, priority, message });
    reload(); setShowNew(false); setSelected(t.id);
    setSubject(''); setMessage('');
  }
  function submitRating() {
    if (!ratingModal || !rating) return;
    rateTicket(ratingModal.ticketId, rating, ratingComment);
    setRatingModal(null); setRating(0); setRatingComment(''); reload();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div><h2 className="text-xl font-black text-[#0A1929]">Support</h2><p className="text-sm text-slate-400 mt-0.5">Chat with the iTech support team</p></div>
        <div className="flex gap-2">
          <button onClick={reload} className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"><RefreshCw size={15} /></button>
          <button onClick={() => { setShowNew(true); setSelected(null); }} className="flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2e911f] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"><Plus size={15} /> New Ticket</button>
        </div>
      </div>

      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === f ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{f}</button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:h-[580px]">
        <div className={`${(selected || showNew) ? 'hidden lg:flex' : 'flex'} w-full lg:w-64 shrink-0 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex-col h-[460px] lg:h-auto`}>
          <div className="p-3 border-b border-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider">{filtered.length} ticket{filtered.length !== 1 ? 's' : ''}</div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {filtered.length === 0 && <div className="py-12 text-center text-slate-400 text-sm px-4">{tickets.length === 0 ? 'No tickets yet. Click "New Ticket" to get started.' : `No ${filter} tickets.`}</div>}
            {filtered.map(t => {
              const s = TKT_STATUS[t.status];
              const u = unread(t);
              const canRate = (t.status === 'Resolved' || t.status === 'Closed') && !t.rating;
              return (
                <button key={t.id} onClick={() => openTicket(t.id)}
                  className={`w-full text-left px-4 py-3.5 hover:bg-slate-50 transition-colors ${selected === t.id ? 'bg-[#f0fdf4] border-r-2 border-[#3CB52A]' : ''}`}>
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-semibold text-sm text-slate-800 truncate flex-1">{t.subject}</span>
                    {u > 0 && <span className="shrink-0 min-w-[16px] h-4 bg-[#3CB52A] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">{u}</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${s.bg} ${s.text}`}>{t.status}</span>
                    <span className={`text-[10px] font-semibold ${PRIORITY_COLOR[t.priority]}`}>{t.priority}</span>
                    {t.rating && <span className="text-[10px] text-amber-500">{'★'.repeat(t.rating)}</span>}
                    {canRate && <span className="text-[9px] font-bold text-violet-500 bg-violet-50 px-1.5 py-0.5 rounded-full">Rate us</span>}
                    <span className="text-[10px] text-slate-300 ml-auto">{timeAgo(t.updatedAt)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className={`${(selected || showNew) ? 'flex' : 'hidden lg:flex'} flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm flex-col overflow-hidden h-[70vh] lg:h-auto`}>
          {showNew ? (
            <div className="flex-1 overflow-y-auto">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h3 className="font-black text-slate-900">New Support Ticket</h3>
                <button onClick={() => setShowNew(false)} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400"><X size={16} /></button>
              </div>
              <form onSubmit={submitNewTicket} className="p-5 space-y-4">
                {formErr && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl"><AlertCircle size={14} /> {formErr}</div>}
                <div><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Subject *</label><input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Website showing an error" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A]" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Category</label><select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A] bg-white">{['General', 'Technical', 'Billing', 'Feature Request'].map(c => <option key={c}>{c}</option>)}</select></div>
                  <div><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Priority</label><select value={priority} onChange={e => setPriority(e.target.value as any)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A] bg-white">{['Low', 'Medium', 'High', 'Urgent'].map(p => <option key={p}>{p}</option>)}</select></div>
                </div>
                <div><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Message *</label><textarea value={message} onChange={e => setMessage(e.target.value)} rows={5} placeholder="Describe your issue in detail…" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A] resize-none" /></div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 py-3 rounded-xl bg-[#3CB52A] hover:bg-[#2e911f] text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors"><Send size={14} /> Submit Ticket</button>
                  <button type="button" onClick={() => setShowNew(false)} className="px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-500 hover:bg-slate-50">Cancel</button>
                </div>
              </form>
            </div>
          ) : !ticket ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 p-6 text-center">
              <Headphones size={40} className="mb-3" /><p className="text-sm font-semibold text-slate-400">Select a ticket or create a new one</p>
            </div>
          ) : (
            <>
              <div className="px-4 lg:px-5 py-3 lg:py-4 border-b border-slate-100">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-1 min-w-0">
                    <button onClick={() => setSelected(null)} className="lg:hidden w-8 h-8 -ml-1 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 shrink-0"><ChevronLeft size={18} /></button>
                    <div className="min-w-0">
                    <div className="font-black text-slate-900 truncate">{ticket.subject}</div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs font-mono text-slate-400">{ticket.ticketNumber}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TKT_STATUS[ticket.status].bg} ${TKT_STATUS[ticket.status].text}`}>{ticket.status}</span>
                      <span className={`text-[10px] font-bold ${PRIORITY_COLOR[ticket.priority]}`}>{ticket.priority} Priority</span>
                      {ticket.assignedTo && <span className="text-[10px] text-slate-400">· Assigned to {ticket.assignedTo}</span>}
                    </div>
                    </div>
                  </div>
                  {/* Rating button for resolved tickets */}
                  {(ticket.status === 'Resolved' || ticket.status === 'Closed') && !ticket.rating && (
                    <button onClick={() => setRatingModal({ ticketId: ticket.id, subject: ticket.subject })}
                      className="flex items-center gap-1.5 text-xs font-bold bg-violet-50 text-violet-600 hover:bg-violet-100 px-3 py-2 rounded-xl transition-colors">
                      <Star size={13} /> Rate Support
                    </button>
                  )}
                  {ticket.rating && (
                    <div className="text-xs text-amber-500 flex items-center gap-1"><Star size={12} fill="currentColor" /> {'★'.repeat(ticket.rating)} Rated</div>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {ticket.messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[78%] rounded-2xl px-4 py-3 ${msg.sender === 'client' ? 'bg-[#3CB52A] text-white rounded-br-md' : 'bg-slate-100 text-slate-800 rounded-bl-md'}`}>
                      <div className="text-[11px] font-bold mb-1 opacity-60">{msg.senderName}</div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      <div className="text-[10px] mt-1.5 opacity-50 text-right">{timeAgo(msg.timestamp)}</div>
                    </div>
                  </div>
                ))}
                <div ref={msgEndRef} />
              </div>

              {ticket.status !== 'Closed' && (
                <div className="px-5 py-4 border-t border-slate-100 flex gap-3">
                  <textarea value={reply} onChange={e => setReply(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                    rows={2} placeholder="Reply… (Enter to send)"
                    className="flex-1 resize-none text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#3CB52A] transition-colors" />
                  <button onClick={sendReply} disabled={!reply.trim() || sending}
                    className="self-end w-10 h-10 rounded-xl bg-[#3CB52A] hover:bg-[#2e911f] flex items-center justify-center text-white disabled:opacity-40 transition-colors shrink-0"><Send size={16} /></button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Rating modal */}
      <AnimatePresence>
        {ratingModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
              <div className="text-center mb-5">
                <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-3"><Star size={22} className="text-violet-500" /></div>
                <h3 className="font-black text-slate-900">Rate Your Support Experience</h3>
                <p className="text-xs text-slate-400 mt-1 truncate">"{ratingModal.subject}"</p>
              </div>
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => setRating(n)} className="text-3xl transition-transform hover:scale-110">
                    <span className={n <= rating ? 'text-amber-400' : 'text-slate-200'}>★</span>
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <>
                  <textarea value={ratingComment} onChange={e => setRatingComment(e.target.value)} rows={2} placeholder="Optional: share any feedback…" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A] resize-none mb-4" />
                  <button onClick={submitRating} className="w-full py-3 rounded-xl bg-[#3CB52A] text-white text-sm font-bold hover:bg-[#2e911f] mb-2">Submit Rating</button>
                </>
              )}
              <button onClick={() => setRatingModal(null)} className="w-full py-2 rounded-xl border border-slate-200 text-sm text-slate-500 hover:bg-slate-50">Skip</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
function Projects({ client }: { client: PortalClient }) {
  const managedProjects = getClientManagedProjects(client.id);
  const [, setRefresh] = useState(0);

  // Merge static + managed projects
  const allProjects = [
    ...client.projects.map(p => ({ ...p, _managed: false, progress: 0, milestones: [] })),
    ...managedProjects.map(p => ({ ...p, _managed: true })),
  ];

  function handleToggle(projId: string, msId: string) {
    toggleMilestone(projId, msId); setRefresh(n => n + 1);
  }

  const statusDot: Record<string, string> = { Active: 'bg-emerald-400', Completed: 'bg-sky-400', 'On Hold': 'bg-amber-400' };
  const statusBadge: Record<string, string> = { Active: 'bg-emerald-50 text-emerald-700', Completed: 'bg-sky-50 text-sky-700', 'On Hold': 'bg-amber-50 text-amber-700' };
  const statusBar: Record<string, string> = { Active: 'bg-emerald-400', Completed: 'bg-sky-400', 'On Hold': 'bg-amber-400' };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="text-xl font-black text-[#0A1929]">My Projects</h2><p className="text-sm text-slate-400 mt-0.5">{allProjects.length} project{allProjects.length !== 1 ? 's' : ''} on your account</p></div>
        <div className="flex gap-2">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">{allProjects.filter(p => p.status === 'Active').length} Active</span>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700">{allProjects.filter(p => p.status === 'Completed').length} Done</span>
        </div>
      </div>

      {allProjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <EmptyState icon={FolderX} title="No projects yet" message="Projects will be added by your iTech account manager." action={{ label: 'Contact us', href: '/contact' }} />
        </div>
      ) : (
        <div className="space-y-4">
          {allProjects.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className={`h-1 ${statusBar[p.status] || 'bg-slate-300'}`} />
              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] text-slate-400 font-mono">{p.id}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${statusBadge[p.status]}`}>{p.status}</span>
                    </div>
                    <h3 className="font-black text-[#0A1929] text-lg leading-tight">{p.name}</h3>
                    <p className="text-sm text-slate-400 mt-0.5">{p.type}</p>
                  </div>
                </div>

                {p.description && <p className="text-sm text-slate-600 leading-relaxed mb-4 bg-slate-50 rounded-xl p-4 border border-slate-100">{p.description}</p>}

                {/* Progress bar — only for managed projects with defined progress */}
                {p._managed && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-slate-500">Progress</span>
                      <span className="text-xs font-black text-[#3CB52A]">{p.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${p.progress}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full bg-[#3CB52A] rounded-full" />
                    </div>
                  </div>
                )}

                {/* Milestones */}
                {p._managed && p.milestones.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><CheckSquare size={11} /> Milestones</p>
                    <div className="space-y-2">
                      {p.milestones.map((ms: any) => (
                        <button key={ms.id} onClick={() => handleToggle(p.id, ms.id)}
                          className="w-full flex items-center gap-3 text-left hover:bg-slate-50 rounded-xl px-3 py-2 transition-colors group">
                          {ms.done
                            ? <CheckSquare size={16} className="text-[#3CB52A] shrink-0" />
                            : <Square size={16} className="text-slate-300 group-hover:text-slate-400 shrink-0 transition-colors" />}
                          <span className={`text-sm transition-colors ${ms.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>{ms.label}</span>
                          {ms.dueDate && <span className="ml-auto text-[10px] text-slate-400">{fmtDate(ms.dueDate)}</span>}
                        </button>
                      ))}
                    </div>
                  </div>
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

// ─── DOWNLOADS & UPLOADS ──────────────────────────────────────────────────────
function Downloads({ client }: { client: PortalClient }) {
  const [files, setFiles]           = useState<PortalFile[]>([]);
  const [myUploads, setMyUploads]   = useState<ClientUploadedFile[]>([]);
  const [filter, setFilter]         = useState('All');
  const [activeTab, setActiveTab]   = useState<'downloads' | 'myuploads'>('downloads');
  const [uploading, setUploading]   = useState(false);
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadErr, setUploadErr]   = useState('');
  const fileInputRef                = useRef<HTMLInputElement>(null);

  function reload() {
    setFiles(getClientFiles(client.id));
    setMyUploads(getClientUploadedFiles(client.id));
  }
  useEffect(() => { reload(); }, []);

  function pickFile() { fileInputRef.current?.click(); }

  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadErr('');
    if (file.size > 10 * 1024 * 1024) { setUploadErr('File is too large. Max 10 MB.'); return; }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string;
      const ext = file.name.split('.').pop()?.toUpperCase() || 'Other';
      const sizeKB = Math.round(file.size / 1024);
      const sizeLabel = sizeKB >= 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;
      saveClientUploadedFile({
        clientId: client.id,
        name: file.name,
        fileType: ['PDF','DOCX','XLSX','ZIP','PNG','MP4','JPG','JPEG'].includes(ext) ? ext : 'Other',
        sizeLabel,
        dataUrl,
        description: uploadDesc.trim() || undefined,
      });
      playNotificationSound('upload');
      setUploading(false);
      setUploadDesc('');
      reload();
      setActiveTab('myuploads');
    };
    reader.onerror = () => { setUploadErr('Failed to read file. Please try again.'); setUploading(false); };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  const FILE_ICON: Record<string, string> = { PDF: '📄', ZIP: '📦', DOCX: '📝', XLSX: '📊', PNG: '🖼️', MP4: '🎬', JPG: '🖼️', JPEG: '🖼️', Other: '📎' };
  const CAT_COLOR: Record<string, string> = { Contract: 'bg-violet-50 text-violet-700', Report: 'bg-blue-50 text-blue-700', Design: 'bg-pink-50 text-pink-700', Invoice: 'bg-emerald-50 text-emerald-700', Proposal: 'bg-amber-50 text-amber-700', Other: 'bg-slate-100 text-slate-600' };

  const categories = ['All', ...Array.from(new Set(files.map(f => f.category)))];
  const filtered = filter === 'All' ? files : files.filter(f => f.category === filter);

  function downloadPortalFile(f: PortalFile) {
    if (f.dataUrl) { const a = document.createElement('a'); a.href = f.dataUrl; a.download = f.name; a.click(); }
    else if (f.downloadUrl && f.downloadUrl !== '#') { window.open(f.downloadUrl, '_blank'); }
  }
  function downloadMyFile(f: ClientUploadedFile) { const a = document.createElement('a'); a.href = f.dataUrl; a.download = f.name; a.click(); }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="text-xl font-black text-[#0A1929]">Files</h2><p className="text-sm text-slate-400 mt-0.5">Downloads from iTech & your uploaded documents</p></div>
        <button onClick={pickFile} disabled={uploading}
          className="flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2e911f] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50">
          {uploading ? <RefreshCw size={15} className="animate-spin" /> : <Upload size={15} />} Upload File
        </button>
      </div>

      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFilePick} />

      {/* Upload description helper */}
      <div className="bg-[#f0fdf4] border border-[#BBF7D0] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <Upload size={16} className="text-[#3CB52A] shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-[#166534]">Upload documents for iTech to review</p>
          <input value={uploadDesc} onChange={e => setUploadDesc(e.target.value)} placeholder="Optional: add a description before uploading…"
            className="w-full mt-2 px-3 py-2 rounded-xl border border-[#BBF7D0] bg-white/80 text-sm focus:outline-none focus:border-[#3CB52A] text-slate-700 placeholder:text-slate-300" />
          {uploadErr && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle size={12} /> {uploadErr}</p>}
        </div>
      </div>

      {/* Tab switch */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        <button onClick={() => setActiveTab('downloads')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'downloads' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          Downloads ({files.length})
        </button>
        <button onClick={() => setActiveTab('myuploads')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'myuploads' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          My Uploads ({myUploads.length})
          {myUploads.filter(f => f.status === 'Accepted').length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#3CB52A]" />}
        </button>
      </div>

      {activeTab === 'downloads' ? (
        <>
          {files.length > 0 && categories.length > 2 && (
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit flex-wrap">
              {categories.map(c => (
                <button key={c} onClick={() => setFilter(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === c ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{c}</button>
              ))}
            </div>
          )}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {filtered.length === 0 ? (
              <EmptyState icon={HardDrive} title="No files yet" message="Downloadable assets and project deliverables will appear here once uploaded by your account manager." action={{ label: 'Request a file', href: 'mailto:itechnetworkafrica@gmail.com?subject=File%20Request' }} />
            ) : (
              <div className="divide-y divide-slate-50">
                {filtered.map(f => (
                  <div key={f.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/50 transition-colors group">
                    <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shrink-0">{FILE_ICON[f.fileType] || '📎'}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-slate-800 truncate">{f.name}</div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${CAT_COLOR[f.category]}`}>{f.category}</span>
                        <span className="text-[10px] text-slate-400">{f.fileType}</span>
                        <span className="text-[10px] text-slate-400">{f.sizeLabel}</span>
                        <span className="text-[10px] text-slate-300">· {timeAgo(f.uploadedAt)}</span>
                      </div>
                    </div>
                    <button onClick={() => downloadPortalFile(f)}
                      disabled={!f.dataUrl && f.downloadUrl === '#'}
                      className={`flex items-center gap-1.5 text-sm font-bold px-3 py-2 rounded-xl transition-colors shrink-0 ${(!f.dataUrl && f.downloadUrl === '#') ? 'text-slate-300 cursor-not-allowed' : 'text-[#3CB52A] hover:bg-[#f0fdf4]'}`}>
                      <Download size={14} /> Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        /* My Uploads Tab */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {myUploads.length === 0 ? (
            <EmptyState icon={FileUp} title="No uploads yet" message="Upload documents for iTech to review — contracts, references, images, or anything else needed for your project." action={{ onClick: pickFile, label: 'Upload your first file' }} />
          ) : (
            <div className="divide-y divide-slate-50">
              {[...myUploads].reverse().map(f => {
                const statusCls = f.status === 'Pending Review' ? 'bg-amber-50 text-amber-700' : f.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700';
                const statusIcon = f.status === 'Pending Review' ? '⏳' : f.status === 'Accepted' ? '✅' : '❌';
                return (
                  <div key={f.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/50 transition-colors group">
                    <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shrink-0">{FILE_ICON[f.fileType] || '📎'}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-slate-800 truncate">{f.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusCls}`}>{statusIcon} {f.status}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[10px] text-slate-400">{f.fileType} · {f.sizeLabel}</span>
                        <span className="text-[10px] text-slate-300">· {timeAgo(f.uploadedAt)}</span>
                      </div>
                      {f.description && <p className="text-xs text-slate-500 mt-1 italic">"{f.description}"</p>}
                      {f.adminNote && <p className={`text-xs mt-1 font-semibold ${f.status === 'Accepted' ? 'text-emerald-600' : 'text-red-500'}`}>iTech note: "{f.adminNote}"</p>}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => downloadMyFile(f)} className="flex items-center gap-1.5 text-sm font-bold text-[#3CB52A] hover:underline px-2 py-1"><Download size={14} /></button>
                      <button onClick={() => { deleteClientUploadedFile(f.id); reload(); }} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm text-slate-500">
        <p><strong className="text-slate-700">Need a specific file?</strong> Contact your account manager directly.</p>
        <a href="mailto:itechnetworkafrica@gmail.com?subject=File%20Request" className="mt-2 inline-flex items-center gap-1 text-[#3CB52A] font-semibold hover:underline text-sm">Request a file <ExternalLink size={12} /></a>
      </div>
    </div>
  );
}

// ─── ANNOUNCEMENTS ────────────────────────────────────────────────────────────
function AnnouncementsView({ client }: { client: PortalClient }) {
  const announcements = getClientAnnouncements(client.id);
  const ANN_STYLE_MAP: Record<string, { bg: string; text: string; label: string }> = {
    info:        { bg: 'bg-blue-50 border-blue-200',        text: 'text-blue-700',    label: 'Information'  },
    warning:     { bg: 'bg-amber-50 border-amber-200',      text: 'text-amber-700',   label: 'Warning'      },
    success:     { bg: 'bg-emerald-50 border-emerald-200',  text: 'text-emerald-700', label: 'Good News'    },
    maintenance: { bg: 'bg-slate-100 border-slate-200',     text: 'text-slate-600',   label: 'Maintenance'  },
  };

  return (
    <div className="space-y-5">
      <div><h2 className="text-xl font-black text-[#0A1929]">Announcements</h2><p className="text-sm text-slate-400 mt-0.5">Updates and notices from iTech Network Africa</p></div>

      {announcements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <EmptyState icon={Megaphone} title="No announcements" message="Important updates from iTech Network Africa will appear here." />
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map(ann => {
            const style = ANN_STYLE_MAP[ann.type];
            return (
              <motion.div key={ann.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl border p-5 ${style.bg}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${style.bg}`}>
                    {ann.type === 'info' && <Bell size={15} className={style.text} />}
                    {ann.type === 'warning' && <AlertCircle size={15} className={style.text} />}
                    {ann.type === 'success' && <CheckCircle2 size={15} className={style.text} />}
                    {ann.type === 'maintenance' && <Clock size={15} className={style.text} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-bold text-sm ${style.text}`}>{ann.title}</span>
                      {ann.pinned && <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Pinned</span>}
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/60 text-slate-500`}>{style.label}</span>
                    </div>
                    <p className={`text-sm mt-2 leading-relaxed ${style.text} opacity-90`}>{ann.body}</p>
                    <p className="text-[11px] text-slate-400 mt-2">{ann.adminName} · {timeAgo(ann.createdAt)}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── SERVICE CATALOG ──────────────────────────────────────────────────────────
const SERVICES = [
  { name: 'Web Development', icon: '🌐', desc: 'Custom websites, web apps, landing pages, and e-commerce platforms built to the highest standard.', price: 'From $800', category: 'Development' },
  { name: 'Mobile App Development', icon: '📱', desc: 'Native and cross-platform mobile apps for iOS and Android. Fast, intuitive, and beautifully designed.', price: 'From $1,500', category: 'Development' },
  { name: 'AI & Automation', icon: '🤖', desc: 'Integrate AI into your business — chatbots, data processing automation, smart workflows, and more.', price: 'From $1,200', category: 'AI' },
  { name: 'Cloud Infrastructure', icon: '☁️', desc: 'Cloud setup, migration, and management on AWS, Google Cloud, or Azure. Scalable and secure.', price: 'From $500', category: 'Infrastructure' },
  { name: 'Cybersecurity', icon: '🔒', desc: 'Security audits, penetration testing, SSL setup, firewall configuration, and compliance support.', price: 'From $700', category: 'Security' },
  { name: 'SEO & Digital Marketing', icon: '📈', desc: 'Grow your online presence with data-driven SEO strategies, content marketing, and analytics.', price: 'From $300/mo', category: 'Marketing' },
  { name: 'UI/UX Design', icon: '🎨', desc: 'Professional design systems, brand identity, wireframes, and polished user interfaces.', price: 'From $600', category: 'Design' },
  { name: 'IT Consultancy', icon: '💼', desc: 'Expert technology advice, system audits, IT roadmaps, and digital transformation strategy.', price: 'From $150/hr', category: 'Consulting' },
  { name: 'Network Solutions', icon: '🔗', desc: 'Enterprise networking, VPN setup, structured cabling, and network monitoring.', price: 'From $400', category: 'Infrastructure' },
  { name: 'Monthly Maintenance', icon: '🛠️', desc: 'Ongoing website updates, backups, security patches, and performance monitoring.', price: 'From $150/mo', category: 'Support' },
];

function ServiceCatalog() {
  const [filter, setFilter] = useState('All');
  const cats = ['All', ...Array.from(new Set(SERVICES.map(s => s.category)))];
  const filtered = filter === 'All' ? SERVICES : SERVICES.filter(s => s.category === filter);

  return (
    <div className="space-y-5">
      <div><h2 className="text-xl font-black text-[#0A1929]">Service Catalog</h2><p className="text-sm text-slate-400 mt-0.5">Explore our range of technology services</p></div>
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit flex-wrap">
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === c ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{c}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((s, i) => (
          <motion.div key={s.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:border-[#3CB52A]/30 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="text-3xl">{s.icon}</div>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{s.category}</span>
            </div>
            <h3 className="font-black text-[#0A1929] mb-2 group-hover:text-[#3CB52A] transition-colors">{s.name}</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">{s.desc}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-[#3CB52A]">{s.price}</span>
              <a href={`mailto:itechnetworkafrica@gmail.com?subject=Enquiry:%20${encodeURIComponent(s.name)}&body=Hello%20iTech%20Team%2C%0A%0AI%20am%20interested%20in%20your%20${encodeURIComponent(s.name)}%20service.%20Could%20you%20please%20provide%20more%20information%3F%0A%0AThank%20you`}
                className="flex items-center gap-1.5 text-xs font-bold text-[#3CB52A] hover:underline">
                Enquire <ExternalLink size={11} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function Profile({ client }: { client: PortalClient }) {
  const initials = client.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const tierColors: Record<string, string> = { Standard: 'bg-blue-50 text-blue-700 border border-blue-200', Business: 'bg-violet-50 text-violet-700 border border-violet-200', Enterprise: 'bg-amber-50 text-amber-700 border border-amber-200' };
  const [pwForm, setPwForm]         = useState({ current: '', next: '', confirm: '' });
  const [pwStatus, setPwStatus]     = useState<'idle' | 'success' | 'error'>('idle');
  const [pwMsg, setPwMsg]           = useState('');
  const [showReferral, setShowReferral] = useState(false);
  const [referralCopied, setReferralCopied] = useState(false);
  const referralLink = `https://www.itechnetworkafrica.com/?ref=${client.id}`;

  async function changePassword(e: React.FormEvent) {
    e.preventDefault(); setPwStatus('idle'); setPwMsg('');
    if (!pwForm.current) { setPwStatus('error'); setPwMsg('Please enter your current password.'); return; }
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
        setPwStatus('success'); setPwMsg('Password updated! Your new password is active immediately.');
        setPwForm({ current: '', next: '', confirm: '' });
      }
    } catch {
      setPwStatus('error'); setPwMsg('Connection error. Please try again.');
    }
  }

  function copyReferral() {
    navigator.clipboard.writeText(referralLink).catch(() => {});
    setReferralCopied(true); setTimeout(() => setReferralCopied(false), 2000);
  }

  return (
    <div className="space-y-5 max-w-lg">
      <div><h2 className="text-xl font-black text-[#0A1929]">My Profile</h2><p className="text-sm text-slate-400 mt-0.5">Your account details and security settings</p></div>

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-[#0A1929] px-6 pt-8 pb-16 relative">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #3CB52A 0%, transparent 60%)' }} />
        </div>
        <div className="px-6 pb-6 -mt-10 relative">
          <div className="w-20 h-20 rounded-2xl bg-[#3CB52A] border-4 border-white shadow-lg flex items-center justify-center text-white font-black text-2xl mb-3">{initials}</div>
          <div className="flex flex-wrap items-start gap-3">
            <div><h3 className="text-xl font-black text-[#0A1929]">{client.name}</h3><p className="text-sm text-slate-400">{client.role} · {client.organisation}</p></div>
            <span className={`mt-1 text-[10px] font-bold px-3 py-1 rounded-full ${tierColors[client.tier] ?? 'bg-slate-100 text-slate-600'}`}>{client.tier} Client</span>
          </div>
        </div>
        <div className="border-t border-slate-50 px-6 py-4 space-y-3">
          {[{ icon: Mail, label: 'Email', value: client.email }, { icon: Phone, label: 'Phone', value: client.phone }, { icon: Building2, label: 'Organisation', value: client.organisation }, { icon: Shield, label: 'Plan', value: `${client.tier} Client` }, { icon: Clock, label: 'Member Since', value: client.memberSince }].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0"><Icon size={14} className="text-slate-400" /></div>
              <div><div className="text-[11px] text-slate-400 font-medium">{label}</div><div className="text-sm font-semibold text-slate-700">{value}</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Lock size={15} className="text-[#3CB52A]" /> Change Password</h3>
        <form onSubmit={changePassword} className="space-y-3">
          {pwStatus === 'error' && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl"><AlertCircle size={14} /> {pwMsg}</div>}
          {pwStatus === 'success' && <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl"><CheckCircle2 size={14} /> {pwMsg}</div>}
          {[{ key: 'current', label: 'Current Password', placeholder: '••••••••' }, { key: 'next', label: 'New Password', placeholder: 'Min. 8 characters' }, { key: 'confirm', label: 'Confirm New Password', placeholder: 'Repeat new password' }].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">{f.label}</label>
              <input type="password" value={pwForm[f.key as keyof typeof pwForm]} onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A]" />
            </div>
          ))}
          <button type="submit" className="w-full py-3 rounded-xl bg-[#3CB52A] hover:bg-[#2e911f] text-white text-sm font-bold transition-colors mt-1">Update Password</button>
        </form>
      </div>

      {/* Referral */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800 flex items-center gap-2"><Share2 size={15} className="text-[#3CB52A]" /> Refer a Business</h3>
          <button onClick={() => setShowReferral(v => !v)} className="text-xs font-bold text-[#3CB52A] hover:underline">{showReferral ? 'Hide' : 'Show link'}</button>
        </div>
        <p className="text-sm text-slate-500 mb-3">Know someone who could benefit from iTech's services? Share your referral link and help them get started.</p>
        <AnimatePresence>
          {showReferral && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-3">
                <span className="flex-1 text-sm font-mono text-slate-700 truncate">{referralLink}</span>
                <button onClick={copyReferral} className="text-sm font-bold text-[#3CB52A] hover:underline shrink-0">
                  {referralCopied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
              <div className="flex gap-2">
                <a href={`https://wa.me/?text=${encodeURIComponent(`Check out iTech Network Africa for all your tech needs: ${referralLink}`)}`} target="_blank" rel="noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold text-center hover:bg-[#1ebe5a] transition-colors">Share on WhatsApp</a>
                <a href={`mailto:?subject=Check%20out%20iTech%20Network%20Africa&body=Hi%2C%0A%0AI%20wanted%20to%20recommend%20iTech%20Network%20Africa%20for%20all%20your%20tech%20needs.%20They're%20exceptional.%0A%0A${encodeURIComponent(referralLink)}`}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 text-center hover:bg-slate-50 transition-colors">Share via Email</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
        <strong>Need to update your contact details?</strong> Contact your account manager at{' '}
        <a href="mailto:itechnetworkafrica@gmail.com" className="underline font-semibold">itechnetworkafrica@gmail.com</a>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ client, onNavigate }: { client: PortalClient; onNavigate: (s: string) => void }) {
  const [unread, setUnread] = useState({ invoices: 0, support: 0, announcements: 0 });
  useEffect(() => { setUnread(getClientUnread(client.id)); }, []);

  const invoices       = getClientInvoices(client.id);
  const tickets        = getClientTickets(client.id);
  const allProjects    = [...client.projects, ...getClientManagedProjects(client.id)];
  const announcements  = getClientAnnouncements(client.id).slice(0, 2);
  const totalOwing     = invoices.filter(i => i.status === 'Sent' || i.status === 'Overdue').reduce((s, i) => s + i.total, 0);
  const totalPaid      = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.total, 0);
  const overdue        = invoices.filter(i => i.status === 'Overdue');
  const upcomingDue    = invoices.filter(i => i.status === 'Sent' && new Date(i.dueDate) > new Date()).sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 3);

  // Recent activity — pull from ticket + invoice events
  const activities = [
    ...tickets.flatMap(t => t.messages.slice(-1).map(m => ({ type: 'support' as const, label: `${m.sender === 'admin' ? 'Reply on' : 'You replied to'}: ${t.subject}`, time: m.timestamp }))),
    ...invoices.slice(-3).map(i => ({ type: 'invoice' as const, label: `Invoice ${i.invoiceNumber} — ${fmt$(i.total)} (${i.status})`, time: i.updatedAt })),
  ].sort((a, b) => b.time.localeCompare(a.time)).slice(0, 5);

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0A1929] p-6 md:p-8">
        <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-[#3CB52A]/5 -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#3CB52A] animate-pulse" /> Client Portal
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Welcome back, {client.name.split(' ')[0]} 👋</h2>
            <p className="text-white/40 text-sm max-w-md">Your secure workspace — projects, invoices, support, and files all in one place.</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#3CB52A]/20 border border-[#3CB52A]/30 flex items-center justify-center text-[#3CB52A] font-black text-2xl shrink-0">{client.name[0]}</div>
        </div>
      </div>

      {/* Pinned announcements banner */}
      {announcements.filter(a => a.pinned).slice(0, 1).map(ann => {
        const st = ANN_STYLE[ann.type];
        return (
          <div key={ann.id} className={`rounded-2xl border p-4 flex items-start gap-3 ${st.bg}`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${st.bg}`}><Megaphone size={14} className={st.text} /></div>
            <div className="flex-1">
              <p className={`text-sm font-bold ${st.text}`}>{ann.title}</p>
              <p className={`text-xs mt-0.5 ${st.text} opacity-80`}>{ann.body.slice(0, 120)}{ann.body.length > 120 ? '…' : ''}</p>
            </div>
            <button onClick={() => onNavigate('announcements')} className={`text-xs font-bold ${st.text} hover:underline shrink-0 flex items-center gap-1`}>View <ChevronRight size={12} /></button>
          </div>
        );
      })}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Active Projects',   value: allProjects.filter(p => p.status === 'Active').length, icon: TrendingUp,   color: 'text-[#3CB52A] bg-[#f0fdf4]', section: 'projects'  },
          { label: 'Total Invoices',    value: invoices.length,                                        icon: FileText,    color: 'text-violet-600 bg-violet-50', section: 'invoices'  },
          { label: 'Support Tickets',   value: tickets.length,                                         icon: Headphones,  color: 'text-blue-600 bg-blue-50',    section: 'support'   },
          { label: 'Total Paid',        value: fmt$(totalPaid),                                        icon: CheckCircle2,color: 'text-emerald-600 bg-emerald-50', section: 'invoices'},
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            onClick={() => onNavigate(s.section)}
            className="bg-white rounded-2xl p-4 md:p-5 border border-slate-100 shadow-sm cursor-pointer hover:border-[#3CB52A]/30 hover:shadow-md transition-all">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.color}`}><s.icon size={17} /></div>
            <div className="text-xl font-black text-[#0A1929]">{s.value}</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Notifications */}
      {(unread.invoices > 0 || unread.support > 0) && (
        <div className="space-y-2">
          {unread.invoices > 0 && (
            <button onClick={() => onNavigate('invoices')}
              className="w-full flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-2xl p-4 text-left hover:bg-blue-100 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0"><FileText size={16} className="text-blue-600" /></div>
              <div className="flex-1"><p className="text-sm font-bold text-blue-800">You have {unread.invoices} new invoice{unread.invoices > 1 ? 's' : ''}</p><p className="text-xs text-blue-600 mt-0.5">Tap to view your billing</p></div>
              <ChevronRight size={16} className="text-blue-400" />
            </button>
          )}
          {unread.support > 0 && (
            <button onClick={() => onNavigate('support')}
              className="w-full flex items-center gap-3 bg-[#f0fdf4] border border-[#BBF7D0] rounded-2xl p-4 text-left hover:bg-[#dcfce7] transition-colors">
              <div className="w-9 h-9 rounded-xl bg-[#3CB52A]/15 flex items-center justify-center shrink-0"><Headphones size={16} className="text-[#3CB52A]" /></div>
              <div className="flex-1"><p className="text-sm font-bold text-[#166534]">{unread.support} new support repl{unread.support > 1 ? 'ies' : 'y'} from our team</p><p className="text-xs text-[#166534]/70 mt-0.5">Tap to view your tickets</p></div>
              <ChevronRight size={16} className="text-[#3CB52A]" />
            </button>
          )}
        </div>
      )}

      {/* Upcoming due dates */}
      {upcomingDue.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center gap-2">
            <Calendar size={15} className="text-amber-500" />
            <h3 className="font-bold text-slate-800 text-sm">Upcoming Invoice Due Dates</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {upcomingDue.map(inv => {
              const daysUntil = Math.max(0, Math.ceil((new Date(inv.dueDate).getTime() - Date.now()) / 86400000));
              return (
                <div key={inv.id} className="flex items-center gap-3 px-5 py-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-black ${daysUntil <= 3 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>{daysUntil}d</div>
                  <div className="flex-1"><div className="text-sm font-semibold text-slate-800">{inv.invoiceNumber}</div><div className="text-xs text-slate-400">Due {fmtDate(inv.dueDate)}</div></div>
                  <div className="text-sm font-black text-slate-900">{fmt$(inv.total)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Overdue alert */}
      {overdue.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-700">{overdue.length} overdue invoice{overdue.length > 1 ? 's' : ''}</p>
            <p className="text-xs text-red-600 mt-0.5">Please arrange payment at your earliest convenience.</p>
          </div>
          <button onClick={() => onNavigate('invoices')} className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1">View <ChevronRight size={12} /></button>
        </div>
      )}

      {/* Activity feed + Project previews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent activity */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center gap-2">
            <Activity size={14} className="text-[#3CB52A]" />
            <h3 className="font-bold text-slate-800 text-sm">Recent Activity</h3>
          </div>
          {activities.length === 0
            ? <div className="py-8 text-center text-slate-400 text-sm">No activity yet.</div>
            : <div className="divide-y divide-slate-50">
              {activities.map((a, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${a.type === 'support' ? 'bg-blue-50' : 'bg-violet-50'}`}>
                    {a.type === 'support' ? <Headphones size={12} className="text-blue-600" /> : <FileText size={12} className="text-violet-600" />}
                  </div>
                  <div className="flex-1 min-w-0"><p className="text-xs text-slate-700 truncate">{a.label}</p><p className="text-[10px] text-slate-400">{timeAgo(a.time)}</p></div>
                </div>
              ))}
            </div>
          }
        </div>

        {/* Projects preview */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-[#0A1929] flex items-center gap-2"><FolderOpen size={16} className="text-[#3CB52A]" />Your Projects</h3>
            {allProjects.length > 0 && <button onClick={() => onNavigate('projects')} className="text-xs font-semibold text-[#3CB52A] hover:underline flex items-center gap-1">View all <ChevronRight size={13} /></button>}
          </div>
          {allProjects.length === 0
            ? <EmptyState icon={FolderX} title="No projects yet" message="Your projects will appear here once added." action={{ label: 'Contact us', href: '/contact' }} />
            : <div className="divide-y divide-slate-50">
              {allProjects.slice(0, 4).map(p => (
                <div key={p.id} className="px-5 py-3.5 flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${p.status === 'Active' ? 'bg-emerald-400' : p.status === 'Completed' ? 'bg-sky-400' : 'bg-amber-400'}`} />
                  <div className="flex-1 min-w-0"><div className="text-sm font-semibold text-[#0A1929] truncate">{p.name}</div><div className="text-xs text-slate-400">{p.type}</div></div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${p.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : p.status === 'Completed' ? 'bg-sky-50 text-sky-700' : 'bg-amber-50 text-amber-700'}`}>{p.status}</span>
                </div>
              ))}
            </div>
          }
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: MessageSquarePlus, label: 'Open Ticket',   desc: 'Report an issue',               action: () => onNavigate('support'),  color: 'text-violet-600 bg-violet-50' },
          { icon: FileText,          label: 'View Invoices', desc: 'Check billing status',           action: () => onNavigate('invoices'), color: 'text-[#3CB52A] bg-[#f0fdf4]' },
          { icon: Megaphone,         label: 'Announcements', desc: 'Latest iTech updates',           action: () => onNavigate('announcements'), color: 'text-amber-600 bg-amber-50' },
          { icon: Briefcase,         label: 'Our Services',  desc: 'Explore what we offer',         action: () => onNavigate('services'), color: 'text-sky-600 bg-sky-50' },
        ].map((a, i) => (
          <button key={i} onClick={a.action}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-start gap-3 hover:border-[#3CB52A]/30 hover:shadow-md transition-all group text-left">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${a.color}`}><a.icon size={17} /></div>
            <div><div className="text-sm font-bold text-[#0A1929] group-hover:text-[#3CB52A] transition-colors">{a.label}</div><div className="text-xs text-slate-400 mt-0.5">{a.desc}</div></div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── PORTAL SHELL ─────────────────────────────────────────────────────────────
function PortalShell({ client, onLogout }: { client: PortalClient; onLogout: () => void }) {
  const [section, setSection]     = useState('dashboard');
  const [mobileNav, setMobileNav] = useState(false);
  const [unread, setUnread]       = useState({ invoices: 0, support: 0, announcements: 0 });

  // Notifications
  const notifs    = usePortalNotifications();
  const prevUnread = useRef({ invoices: -1, support: -1, announcements: -1 });
  const notifyRef  = useRef(notifs.notify);
  useEffect(() => { notifyRef.current = notifs.notify; }, [notifs.notify]);

  // Request browser notification permission on first mount
  useEffect(() => { notifs.requestPermission(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Poll client unread — fires notifications when counts increase
  useEffect(() => {
    function refresh() {
      const current = getClientUnread(client.id);

      // New ticket reply from the team
      if (prevUnread.current.support >= 0 && current.support > prevUnread.current.support) {
        notifyRef.current({
          type: 'ticket',
          title: '💬 New reply on your support ticket',
          body: 'The iTech team replied to one of your tickets. Tap to read.',
          section: 'support',
        });
      }

      // New invoice or overdue notice
      if (prevUnread.current.invoices >= 0 && current.invoices > prevUnread.current.invoices) {
        notifyRef.current({
          type: 'invoice',
          title: '🧾 New invoice from iTech',
          body: `You have ${current.invoices} unread invoice${current.invoices !== 1 ? 's' : ''}. Open Invoices to view.`,
          sound: 'invoice',
          section: 'invoices',
        });
      }

      prevUnread.current = current;
      setUnread(current);
    }
    refresh(); const id = setInterval(refresh, 4000); return () => clearInterval(id);
  }, [client.id]);

  // Periodically sync client-side writes to the server (cross-device persistence)
  useEffect(() => {
    scheduleSyncToAPI(false);
    const id = setInterval(() => scheduleSyncToAPI(false), 30000);
    return () => clearInterval(id);
  }, []);

  function navTo(s: string) { setSection(s); setMobileNav(false); }

  const NAV = [
    { id: 'dashboard',     label: 'Dashboard',      icon: LayoutDashboard, badge: 0                      },
    { id: 'projects',      label: 'Projects',        icon: FolderOpen,      badge: 0                      },
    { id: 'invoices',      label: 'Invoices',        icon: FileText,        badge: unread.invoices         },
    { id: 'support',       label: 'Support',         icon: Headphones,      badge: unread.support          },
    { id: 'downloads',     label: 'Files',           icon: FolderOpen,      badge: getClientUploadedFiles(client.id).filter(f => f.status === 'Accepted').length },
    { id: 'announcements', label: 'Announcements',   icon: Megaphone,       badge: 0                      },
    { id: 'services',      label: 'Services',        icon: Briefcase,       badge: 0                      },
    { id: 'profile',       label: 'Profile',         icon: User,            badge: 0                      },
  ];

  const sectionMap: Record<string, React.ReactNode> = {
    dashboard:     <Dashboard client={client} onNavigate={navTo} />,
    projects:      <Projects client={client} />,
    invoices:      <ClientInvoices client={client} />,
    support:       <ClientSupport client={client} />,
    downloads:     <Downloads client={client} />,
    announcements: <AnnouncementsView client={client} />,
    services:      <ServiceCatalog />,
    profile:       <Profile client={client} />,
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="h-16 bg-[#0A1929] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button className="lg:hidden w-9 h-9 rounded-xl text-white/60 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors" onClick={() => setMobileNav(v => !v)}>
            {mobileNav ? <X size={20} /> : <Menu size={20} />}
          </button>
          <img src="/logo-icon.png" alt="iTech" className="w-7 h-7 rounded object-contain" onError={e => (e.currentTarget.style.display = 'none')} />
          <span className="text-white font-bold text-sm">Client Portal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-right mr-1">
            <div className="text-white text-xs font-semibold">{client.name}</div>
            <div className="text-white/30 text-[10px]">{client.tier} Client</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#3CB52A] flex items-center justify-center text-white font-bold text-sm shrink-0">{client.name[0]}</div>
          {/* Notification bell */}
          <NotificationBell hook={notifs} onNavigate={navTo} dark />
          <button onClick={onLogout} className="w-9 h-9 flex items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors" title="Log out"><LogOut size={17} /></button>
        </div>
      </header>

      <div className="flex flex-1 relative">
        <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-slate-100 sticky top-16 h-[calc(100vh-4rem)] pt-4 pb-6">
          <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
            {NAV.map(item => (
              <button key={item.id} onClick={() => navTo(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${section === item.id ? 'bg-[#f0fdf4] text-[#3CB52A]' : 'text-slate-500 hover:bg-slate-50 hover:text-[#0A1929]'}`}>
                <item.icon size={16} className={section === item.id ? 'text-[#3CB52A]' : 'text-slate-400'} />
                {item.label}
                <NavBadge n={item.badge} />
              </button>
            ))}
          </nav>
          <div className="px-4 mt-4 space-y-3">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <p className="text-xs text-slate-400 mb-1.5">Need help?</p>
              <a href="mailto:itechnetworkafrica@gmail.com" className="text-xs font-bold text-[#3CB52A] hover:underline flex items-center gap-1">Email us <ExternalLink size={11} /></a>
            </div>
            <a href="/" className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-[#3CB52A] transition-colors px-1"><ExternalLink size={12} /> Back to website</a>
          </div>
        </aside>

        <AnimatePresence>
          {mobileNav && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 bg-black/50 z-20 top-16" onClick={() => setMobileNav(false)} />
              <motion.aside initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }} transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                className="lg:hidden fixed left-0 top-16 bottom-0 w-56 bg-white border-r border-slate-100 z-30 flex flex-col pt-4 pb-6">
                <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
                  {NAV.map(item => (
                    <button key={item.id} onClick={() => navTo(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${section === item.id ? 'bg-[#f0fdf4] text-[#3CB52A]' : 'text-slate-500 hover:bg-slate-50'}`}>
                      <item.icon size={16} />{item.label}<NavBadge n={item.badge} />
                    </button>
                  ))}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 p-4 lg:p-8 min-w-0 pb-24 lg:pb-8">
          <AnimatePresence mode="wait">
            <motion.div key={section} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
              {sectionMap[section]}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-20 flex items-center justify-around px-1 py-1 shadow-lg">
        {NAV.slice(0, 6).map(item => (
          <button key={item.id} onClick={() => navTo(item.id)}
            className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl flex-1 relative transition-colors ${section === item.id ? 'text-[#3CB52A]' : 'text-slate-400'}`}>
            <item.icon size={19} />
            <span className="text-[9px] font-semibold leading-none">{item.label}</span>
            {item.badge > 0 && <span className="absolute top-1 right-1 min-w-[14px] h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center px-0.5">{item.badge}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (client: PortalClient) => void }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError('');
    if (!email.trim() || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password, userType: 'client' }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Invalid email or password. Contact us if you need access.'); setLoading(false); return; }
      saveAuthToken(data.token);
      await hydrateClientFromAPI();
      onLogin({
        id: data.user.id, name: data.user.name, email: data.user.email,
        passwordHash: '', organisation: data.user.organisation || '',
        role: data.user.role || 'Client', phone: data.user.phone || '—',
        memberSince: data.user.memberSince || '', tier: data.user.tier || 'Standard',
        projects: [],
      });
    } catch {
      setError('Connection error. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#060E18]" style={{ backgroundImage: 'radial-gradient(ellipse at 65% 30%, rgba(60,181,42,0.07) 0%, transparent 60%)' }}>
      <div className="pt-16 pb-10 text-center px-6">
        <div className="flex justify-center mb-8">
          <Logo variant="icon" white size="lg" />
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3CB52A]/15 border border-[#3CB52A]/30 mb-5">
          <Lock size={12} className="text-[#3CB52A]" /><span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">Secure Client Area</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Client Portal</h1>
        <p className="text-white/40 text-sm max-w-xs mx-auto leading-relaxed">Access is managed by the iTech Network Africa admin team.</p>
      </div>
      <div className="flex-1 flex items-start justify-center px-4 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-sm">
          <div className="neon-border shadow-[0_0_40px_rgba(0,229,255,0.15)]">
            <div className="neon-glass">
              <h2 className="text-2xl font-black text-white mb-1 text-center">Welcome Back</h2>
              <p className="text-white/40 text-sm mb-7 text-center">Sign in to your client portal</p>
              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" /><span>{error}</span>
                </motion.div>
              )}
              <form onSubmit={submit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Email Address</label>
                  <div className="relative"><Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" autoComplete="email"
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-transparent border-2 border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#00e5ff] transition-all"
                      onFocus={e => (e.currentTarget.style.boxShadow = '0 0 15px rgba(0,229,255,0.2)')} onBlur={e => (e.currentTarget.style.boxShadow = 'none')} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Password</label>
                  <div className="relative"><Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password"
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-transparent border-2 border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#00e5ff] transition-all"
                      onFocus={e => (e.currentTarget.style.boxShadow = '0 0 15px rgba(0,229,255,0.2)')} onBlur={e => (e.currentTarget.style.boxShadow = 'none')} />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <a href="mailto:itechnetworkafrica@gmail.com?subject=Portal%20Password%20Reset" className="text-[#00e5ff] hover:underline text-xs font-medium">Forgot Password?</a>
                  <a href="mailto:itechnetworkafrica@gmail.com?subject=Portal%20Access%20Request" className="text-[#00e5ff] hover:underline text-xs font-medium">Request Access</a>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-xl font-bold text-white text-base transition-all disabled:opacity-60 hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(90deg,#00e5ff,#ff00cc)', boxShadow: loading ? 'none' : '0 0 20px rgba(255,0,204,0.35)' }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 0 32px rgba(255,0,204,0.55)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = loading ? 'none' : '0 0 20px rgba(255,0,204,0.35)'; }}>
                  {loading ? (<span className="flex items-center justify-center gap-2 text-sm"><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" /></svg>Signing in…</span>) : 'Sign In'}
                </button>
              </form>
              <p className="text-center text-white/30 text-xs mt-6">Don't have an account?{' '}<a href="mailto:itechnetworkafrica@gmail.com?subject=Portal%20Access%20Request" className="text-[#00e5ff] hover:underline font-semibold">Request Access</a></p>
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

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function ClientPortalPage() {
  useSEO({
    title: 'Client Portal',
    description: 'Secure client portal for iTech Network Africa customers.',
    canonical: '/portal',
    noindex: false,
  });
  const [client, setClient] = useState<PortalClient | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Restore session on page load/refresh (cross-device: also hydrates from server)
    fetch(apiUrl('/api/auth/me'), { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(async data => {
        if (data?.user?.userType === 'client') {
          await hydrateClientFromAPI();
          setClient({
            id: data.user.id, name: data.user.name, email: data.user.email,
            passwordHash: '', organisation: data.user.organisation || '',
            role: data.user.role || 'Client', phone: data.user.phone || '—',
            memberSince: data.user.memberSince || '',
            tier: (data.user.tier || 'Standard') as PortalClient['tier'],
            projects: [],
          });
        }
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  async function handleLogout() {
    await fetch(apiUrl('/api/auth/logout'), { method: 'POST', credentials: 'include' }).catch(() => {});
    clearAuthToken();
    setClient(null);
  }

  if (checking) return (
    <div className="min-h-screen bg-[#060E18] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 rounded-full border-2 border-[#3CB52A] border-t-transparent animate-spin mx-auto" />
        <p className="text-white/30 text-sm">Loading portal…</p>
      </div>
    </div>
  );

  return client ? <PortalShell client={client} onLogout={handleLogout} /> : <LoginScreen onLogin={setClient} />;
}
