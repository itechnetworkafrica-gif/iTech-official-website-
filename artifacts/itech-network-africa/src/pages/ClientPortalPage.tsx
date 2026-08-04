import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderOpen, FileText, Headphones, Download,
  LogOut, User, Lock, Mail, Phone, Shield, ArrowRight, Menu, X,
  Clock, CheckCircle2, AlertCircle, ExternalLink, Building2, Star,
  FolderX, InboxIcon, HardDrive, TrendingUp, Zap, MessageSquarePlus,
  ChevronRight, Plus, Send, RefreshCw, Printer, Eye, DollarSign,
} from 'lucide-react';
import { findClient, verifyPassword, type PortalClient } from '@/lib/portalClients';
import {
  getClientInvoices, getClientTickets, createTicket, addTicketMessage,
  markTicketMessagesRead, markInvoiceViewed, getClientUnread, updateTicketStatus,
  fmt$, fmtDate, timeAgo, todayStr,
  type Invoice, type SupportTicket,
} from '@/lib/portalData';

// ─── Colours ──────────────────────────────────────────────────────────────────

const INVOICE_STATUS: Record<string, { bg: string; text: string; dot: string }> = {
  Sent:    { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-400'    },
  Paid:    { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  Overdue: { bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-400'     },
};
const TICKET_STATUS: Record<string, { bg: string; text: string }> = {
  Open:          { bg: 'bg-amber-50',   text: 'text-amber-700'   },
  'In Progress': { bg: 'bg-blue-50',    text: 'text-blue-700'    },
  Resolved:      { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  Closed:        { bg: 'bg-slate-100',  text: 'text-slate-500'   },
};
const PRIORITY_COLOR: Record<string, string> = {
  Low: 'text-slate-400', Medium: 'text-amber-500', High: 'text-orange-500', Urgent: 'text-red-600',
};
const STATUS_DOT: Record<string, string> = {
  Active: 'bg-emerald-400', Completed: 'bg-sky-400', 'On Hold': 'bg-amber-400',
};
const STATUS_BADGE: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-700', Completed: 'bg-sky-50 text-sky-700', 'On Hold': 'bg-amber-50 text-amber-700',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function NavBadge({ n }: { n: number }) {
  if (!n) return null;
  return <span className="ml-auto min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{n > 99 ? '99+' : n}</span>;
}

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
        <a href={action.href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3CB52A] hover:underline">
          {action.label} <ArrowRight size={14} />
        </a>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  INVOICE FULL VIEW (print template)
// ─────────────────────────────────────────────────────────────────────────────

function InvoiceView({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  const s = INVOICE_STATUS[invoice.status] ?? INVOICE_STATUS['Sent'];
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl my-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 print:hidden">
          <span className="font-bold text-slate-800">{invoice.invoiceNumber}</span>
          <div className="flex gap-2">
            <button onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              <Printer size={14} /> Print / PDF
            </button>
            <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400"><X size={18} /></button>
          </div>
        </div>
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-2xl font-black text-[#0A1929]">iTech Network Africa</div>
              <div className="text-sm text-slate-500 mt-1">itechnetworkafrica@gmail.com</div>
              <div className="text-sm text-slate-500">www.itechnetworkafrica.com</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-[#3CB52A]">INVOICE</div>
              <div className="text-sm font-mono text-slate-500 mt-1">{invoice.invoiceNumber}</div>
              <span className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full ${s.bg} ${s.text}`}>{invoice.status}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bill To</div>
              <div className="font-bold text-slate-800">{invoice.clientName}</div>
              <div className="text-sm text-slate-500">{invoice.clientOrg}</div>
              <div className="text-sm text-slate-500">{invoice.clientEmail}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Details</div>
              <div className="text-sm text-slate-600"><span className="font-semibold">Issue Date:</span> {fmtDate(invoice.issuedDate)}</div>
              <div className="text-sm text-slate-600"><span className="font-semibold">Due Date:</span> {fmtDate(invoice.dueDate)}</div>
            </div>
          </div>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#0A1929] text-white">
                <th className="text-left px-4 py-3 font-semibold rounded-tl-lg">Description</th>
                <th className="text-center px-4 py-3 font-semibold w-16">Qty</th>
                <th className="text-right px-4 py-3 font-semibold w-24">Rate</th>
                <th className="text-right px-4 py-3 font-semibold w-24 rounded-tr-lg">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.filter(i => i.description).map((item, i) => (
                <tr key={item.id} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                  <td className="px-4 py-3 text-slate-700">{item.description}</td>
                  <td className="px-4 py-3 text-center text-slate-600">{item.qty}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{fmt$(item.rate)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-800">{fmt$(item.amount)}</td>
                </tr>
              ))}
            </tbody>
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

// ─────────────────────────────────────────────────────────────────────────────
//  CLIENT INVOICES
// ─────────────────────────────────────────────────────────────────────────────

function ClientInvoices({ client }: { client: PortalClient }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [viewing, setViewing]   = useState<Invoice | null>(null);

  function reload() { setInvoices(getClientInvoices(client.id)); }
  useEffect(() => { reload(); }, []);

  function openInvoice(inv: Invoice) {
    markInvoiceViewed(inv.id);
    setViewing({ ...inv, viewedByClient: true });
    reload();
  }

  const totalPaid   = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.total, 0);
  const totalOwing  = invoices.filter(i => i.status === 'Sent' || i.status === 'Overdue').reduce((s, i) => s + i.total, 0);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-[#0A1929]">Invoices</h2>
        <p className="text-sm text-slate-400 mt-0.5">Your billing history from iTech Network Africa</p>
      </div>

      {invoices.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Invoices', value: invoices.length,  icon: FileText,   color: 'bg-slate-50 text-slate-500'       },
            { label: 'Paid',           value: fmt$(totalPaid),  icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
            { label: 'Awaiting',       value: fmt$(totalOwing), icon: Clock,       color: 'bg-amber-50 text-amber-600'      },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}><s.icon size={16} /></div>
              <div><div className="font-black text-slate-900 text-sm">{s.value}</div><div className="text-[11px] text-slate-400">{s.label}</div></div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {invoices.length === 0 ? (
          <EmptyState icon={FileText} title="No invoices yet"
            message="Invoices from iTech Network Africa will appear here once issued."
            action={{ label: 'Email billing team', href: 'mailto:itechnetworkafrica@gmail.com?subject=Billing%20Query' }} />
        ) : (
          <div className="divide-y divide-slate-50">
            <div className="grid grid-cols-12 px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">
              <div className="col-span-4">Invoice</div>
              <div className="col-span-3 hidden sm:block">Issued</div>
              <div className="col-span-3 hidden sm:block">Due</div>
              <div className="col-span-3 text-right">Amount</div>
              <div className="col-span-2 text-right">Status</div>
            </div>
            {invoices.map(inv => {
              const s = INVOICE_STATUS[inv.status] ?? INVOICE_STATUS['Sent'];
              return (
                <div key={inv.id}
                  onClick={() => openInvoice(inv)}
                  className="grid grid-cols-12 items-center px-5 py-4 hover:bg-slate-50/50 transition-colors cursor-pointer group">
                  <div className="col-span-4 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                    <div>
                      <div className="font-bold text-sm text-slate-800 group-hover:text-[#3CB52A] transition-colors">{inv.invoiceNumber}</div>
                      {!inv.viewedByClient && inv.status === 'Sent' && (
                        <span className="text-[9px] font-bold bg-blue-500 text-white px-1.5 py-0.5 rounded-full">NEW</span>
                      )}
                    </div>
                  </div>
                  <div className="col-span-3 text-sm text-slate-400 hidden sm:block">{fmtDate(inv.issuedDate)}</div>
                  <div className="col-span-3 text-sm text-slate-400 hidden sm:block">{fmtDate(inv.dueDate)}</div>
                  <div className="col-span-3 text-right font-black text-slate-900">{fmt$(inv.total)}</div>
                  <div className="col-span-2 flex justify-end">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>{inv.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#3CB52A]/15 flex items-center justify-center shrink-0">
          <DollarSign size={18} className="text-[#3CB52A]" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-[#166534]">Invoice query or payment confirmation?</p>
          <p className="text-xs text-[#166534]/70 mt-0.5">Our billing team responds within 24 hours.</p>
        </div>
        <a href="mailto:itechnetworkafrica@gmail.com?subject=Invoice%20Query"
          className="shrink-0 text-sm font-bold text-[#3CB52A] hover:underline flex items-center gap-1">
          Email Billing <ExternalLink size={13} />
        </a>
      </div>

      <AnimatePresence>
        {viewing && <InvoiceView invoice={viewing} onClose={() => setViewing(null)} />}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  CLIENT SUPPORT
// ─────────────────────────────────────────────────────────────────────────────

function ClientSupport({ client }: { client: PortalClient }) {
  const [tickets, setTickets]     = useState<SupportTicket[]>([]);
  const [selected, setSelected]   = useState<string | null>(null);
  const [showNew, setShowNew]     = useState(false);
  const [reply, setReply]         = useState('');
  const [sending, setSending]     = useState(false);
  const [filter, setFilter]       = useState('All');

  // New ticket form
  const [subject, setSubject]     = useState('');
  const [category, setCategory]   = useState<SupportTicket['category']>('General');
  const [priority, setPriority]   = useState<SupportTicket['priority']>('Medium');
  const [message, setMessage]     = useState('');
  const [formErr, setFormErr]     = useState('');
  const msgEndRef                 = useRef<HTMLDivElement>(null);

  function reload() { setTickets(getClientTickets(client.id)); }
  useEffect(() => { reload(); }, []);
  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [selected, tickets]);

  const ticket = tickets.find(t => t.id === selected) || null;

  function openTicket(id: string) {
    setSelected(id); setShowNew(false);
    markTicketMessagesRead(id, 'client');
    reload();
  }

  function sendReply() {
    if (!reply.trim() || !selected || sending) return;
    setSending(true);
    setTimeout(() => {
      addTicketMessage(selected, 'client', client.name, reply.trim());
      setReply(''); setSending(false); reload();
    }, 300);
  }

  function submitNewTicket(e: React.FormEvent) {
    e.preventDefault(); setFormErr('');
    if (!subject.trim()) { setFormErr('Please enter a subject.'); return; }
    if (!message.trim()) { setFormErr('Please describe your issue.'); return; }
    const t = createTicket({ clientId: client.id, clientName: client.name, clientEmail: client.email, subject, category, priority, message });
    reload(); setShowNew(false); setSelected(t.id);
    setSubject(''); setMessage('');
  }

  const unread = (t: SupportTicket) => t.messages.filter(m => m.sender === 'admin' && !m.read).length;
  const FILTERS = ['All', 'Open', 'In Progress', 'Resolved'];
  const filtered = filter === 'All' ? tickets : tickets.filter(t => t.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-[#0A1929]">Support</h2>
          <p className="text-sm text-slate-400 mt-0.5">Chat with the iTech support team</p>
        </div>
        <div className="flex gap-2">
          <button onClick={reload} className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"><RefreshCw size={15} /></button>
          <button onClick={() => { setShowNew(true); setSelected(null); }}
            className="flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2e911f] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors">
            <Plus size={15} /> New Ticket
          </button>
        </div>
      </div>

      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter===f?'bg-white text-slate-800 shadow-sm':'text-slate-500 hover:text-slate-700'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="flex gap-4 h-[580px]">
        {/* Ticket list */}
        <div className="w-64 shrink-0 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-3 border-b border-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider">
            {filtered.length} ticket{filtered.length !== 1 ? 's' : ''}
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {filtered.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-sm px-4">
                {tickets.length === 0 ? 'No tickets yet. Click "New Ticket" to get started.' : `No ${filter} tickets.`}
              </div>
            )}
            {filtered.map(t => {
              const s = TICKET_STATUS[t.status];
              const u = unread(t);
              return (
                <button key={t.id} onClick={() => openTicket(t.id)}
                  className={`w-full text-left px-4 py-3.5 hover:bg-slate-50 transition-colors ${selected===t.id?'bg-[#f0fdf4] border-r-2 border-[#3CB52A]':''}`}>
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-semibold text-sm text-slate-800 truncate flex-1">{t.subject}</span>
                    {u > 0 && <span className="shrink-0 min-w-[16px] h-4 bg-[#3CB52A] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">{u}</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${s.bg} ${s.text}`}>{t.status}</span>
                    <span className={`text-[10px] font-semibold ${PRIORITY_COLOR[t.priority]}`}>{t.priority}</span>
                    <span className="text-[10px] text-slate-300 ml-auto">{timeAgo(t.updatedAt)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right panel: new ticket form OR thread */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
          {showNew ? (
            /* ── New ticket form ── */
            <div className="flex-1 overflow-y-auto">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h3 className="font-black text-slate-900">New Support Ticket</h3>
                <button onClick={() => setShowNew(false)} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400"><X size={16}/></button>
              </div>
              <form onSubmit={submitNewTicket} className="p-5 space-y-4">
                {formErr && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                    <AlertCircle size={14}/> {formErr}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Subject *</label>
                  <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Website is showing an error"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#3CB52A] transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#3CB52A] transition-colors bg-white">
                      {['General','Technical','Billing','Feature Request'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Priority</label>
                    <select value={priority} onChange={e => setPriority(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#3CB52A] transition-colors bg-white">
                      {['Low','Medium','High','Urgent'].map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Message *</label>
                  <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5}
                    placeholder="Describe your issue in detail. Include any error messages, steps to reproduce, and expected behaviour…"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#3CB52A] transition-colors resize-none" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 py-3 rounded-xl bg-[#3CB52A] hover:bg-[#2e911f] text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                    <Send size={14}/> Submit Ticket
                  </button>
                  <button type="button" onClick={() => setShowNew(false)} className="px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : !ticket ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 p-6 text-center">
              <Headphones size={40} className="mb-3"/>
              <p className="text-sm font-semibold text-slate-400">Select a ticket or create a new one</p>
              <p className="text-xs text-slate-300 mt-1">Our team typically responds within a few hours.</p>
            </div>
          ) : (
            /* ── Thread view ── */
            <>
              <div className="px-5 py-4 border-b border-slate-100">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-black text-slate-900">{ticket.subject}</div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs font-mono text-slate-400">{ticket.ticketNumber}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TICKET_STATUS[ticket.status].bg} ${TICKET_STATUS[ticket.status].text}`}>{ticket.status}</span>
                      <span className={`text-[10px] font-bold ${PRIORITY_COLOR[ticket.priority]}`}>{ticket.priority} Priority</span>
                      <span className="text-[10px] text-slate-400">· {ticket.category}</span>
                    </div>
                  </div>
                  {ticket.status === 'Resolved' || ticket.status === 'Closed' ? (
                    <span className="text-xs text-slate-400 font-semibold">{ticket.status}</span>
                  ) : null}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {ticket.messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[78%] rounded-2xl px-4 py-3 ${
                      msg.sender === 'client'
                        ? 'bg-[#3CB52A] text-white rounded-br-md'
                        : 'bg-slate-100 text-slate-800 rounded-bl-md'
                    }`}>
                      <div className="text-[11px] font-bold mb-1 opacity-60">{msg.senderName}</div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      <div className="text-[10px] mt-1.5 opacity-50 text-right">{timeAgo(msg.timestamp)}</div>
                    </div>
                  </div>
                ))}
                <div ref={msgEndRef}/>
              </div>

              {ticket.status !== 'Closed' && (
                <div className="px-5 py-4 border-t border-slate-100 flex gap-3">
                  <textarea value={reply} onChange={e => setReply(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                    rows={2} placeholder="Reply to the support team… (Enter to send)"
                    className="flex-1 resize-none text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#3CB52A] transition-colors"/>
                  <button onClick={sendReply} disabled={!reply.trim() || sending}
                    className="self-end w-10 h-10 rounded-xl bg-[#3CB52A] hover:bg-[#2e911f] flex items-center justify-center text-white disabled:opacity-40 transition-colors shrink-0">
                    <Send size={16}/>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

function Dashboard({ client, onNavigate }: { client: PortalClient; onNavigate: (s: string) => void }) {
  const [unread, setUnread] = useState({ invoices: 0, support: 0 });
  useEffect(() => { setUnread(getClientUnread(client.id)); }, []);

  const invoices       = getClientInvoices(client.id);
  const tickets        = getClientTickets(client.id);
  const activeProjects = client.projects.filter(p => p.status === 'Active').length;
  const totalOwing     = invoices.filter(i => i.status === 'Sent' || i.status === 'Overdue').reduce((s, i) => s + i.total, 0);

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-2xl bg-[#0A1929] p-6 md:p-8">
        <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-[#3CB52A]/5 -translate-y-1/3 translate-x-1/4 pointer-events-none"/>
        <div className="absolute right-16 bottom-0 w-36 h-36 rounded-full bg-[#3CB52A]/5 translate-y-1/2 pointer-events-none"/>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#3CB52A] animate-pulse"/> Client Portal
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Welcome back, {client.name.split(' ')[0]} 👋</h2>
            <p className="text-white/40 text-sm max-w-md">Your secure workspace — projects, invoices, support, and files all in one place.</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#3CB52A]/20 border border-[#3CB52A]/30 flex items-center justify-center text-[#3CB52A] font-black text-2xl shrink-0">
            {client.name[0]}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Active Projects', value: activeProjects, icon: TrendingUp,   color: 'text-[#3CB52A] bg-[#f0fdf4]', section: 'projects'  },
          { label: 'Invoices',        value: invoices.length, icon: FileText,    color: 'text-violet-600 bg-violet-50', section: 'invoices'  },
          { label: 'Support Tickets', value: tickets.length,  icon: Headphones,  color: 'text-blue-600 bg-blue-50',    section: 'support'   },
          { label: 'Awaiting Payment',value: fmt$(totalOwing),icon: DollarSign,  color: 'text-amber-600 bg-amber-50',  section: 'invoices'  },
        ].map((s, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.4 }}
            onClick={() => onNavigate(s.section)}
            className="bg-white rounded-2xl p-4 md:p-5 border border-slate-100 shadow-sm cursor-pointer hover:border-[#3CB52A]/30 hover:shadow-md transition-all">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon size={17}/>
            </div>
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
              <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0"><FileText size={16} className="text-blue-600"/></div>
              <div className="flex-1"><p className="text-sm font-bold text-blue-800">You have {unread.invoices} new invoice{unread.invoices > 1 ? 's' : ''}</p><p className="text-xs text-blue-600 mt-0.5">Tap to view your billing</p></div>
              <ChevronRight size={16} className="text-blue-400"/>
            </button>
          )}
          {unread.support > 0 && (
            <button onClick={() => onNavigate('support')}
              className="w-full flex items-center gap-3 bg-[#f0fdf4] border border-[#BBF7D0] rounded-2xl p-4 text-left hover:bg-[#dcfce7] transition-colors">
              <div className="w-9 h-9 rounded-xl bg-[#3CB52A]/15 flex items-center justify-center shrink-0"><Headphones size={16} className="text-[#3CB52A]"/></div>
              <div className="flex-1"><p className="text-sm font-bold text-[#166534]">{unread.support} new support repl{unread.support > 1 ? 'ies' : 'y'} from our team</p><p className="text-xs text-[#166534]/70 mt-0.5">Tap to view your tickets</p></div>
              <ChevronRight size={16} className="text-[#3CB52A]"/>
            </button>
          )}
        </div>
      )}

      {/* Projects preview */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-[#0A1929] flex items-center gap-2"><FolderOpen size={16} className="text-[#3CB52A]"/>Your Projects</h3>
          {client.projects.length > 0 && <button onClick={() => onNavigate('projects')} className="text-xs font-semibold text-[#3CB52A] hover:underline flex items-center gap-1">View all <ChevronRight size={13}/></button>}
        </div>
        {client.projects.length === 0 ? (
          <EmptyState icon={FolderX} title="No projects yet" message="Your projects will appear here once added." action={{ label: 'Contact us', href: '/contact' }}/>
        ) : (
          <div className="divide-y divide-slate-50">
            {client.projects.map(p => (
              <div key={p.id} className="px-6 py-4 flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[p.status] ?? 'bg-slate-300'}`}/>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-[#0A1929] truncate">{p.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{p.type} · Started {p.startDate}</div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${STATUS_BADGE[p.status]}`}>{p.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: MessageSquarePlus, label: 'Open Support Ticket', desc: 'Report an issue or ask a question', action: () => onNavigate('support'), color: 'text-violet-600 bg-violet-50' },
          { icon: FileText,          label: 'View Invoices',        desc: 'Check your billing status',         action: () => onNavigate('invoices'), color: 'text-[#3CB52A] bg-[#f0fdf4]' },
          { icon: Mail,              label: 'Email Our Team',        desc: 'Direct line to your account manager', action: () => window.location.href = 'mailto:itechnetworkafrica@gmail.com', color: 'text-sky-600 bg-sky-50' },
        ].map((a, i) => (
          <button key={i} onClick={a.action}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-start gap-3 hover:border-[#3CB52A]/30 hover:shadow-md transition-all group text-left">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${a.color}`}><a.icon size={17}/></div>
            <div>
              <div className="text-sm font-bold text-[#0A1929] group-hover:text-[#3CB52A] transition-colors">{a.label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{a.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  PROJECTS
// ─────────────────────────────────────────────────────────────────────────────

function Projects({ client }: { client: PortalClient }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-[#0A1929]">My Projects</h2>
          <p className="text-sm text-slate-400 mt-0.5">{client.projects.length} project{client.projects.length !== 1 ? 's' : ''} on your account</p>
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">{client.projects.filter(p=>p.status==='Active').length} Active</span>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700">{client.projects.filter(p=>p.status==='Completed').length} Done</span>
        </div>
      </div>
      {client.projects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <EmptyState icon={FolderX} title="No projects yet" message="Projects will be added by your iTech account manager." action={{ label: 'Contact us', href: '/contact' }}/>
        </div>
      ) : (
        <div className="space-y-3">
          {client.projects.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className={`h-1 ${p.status==='Active'?'bg-emerald-400':p.status==='Completed'?'bg-sky-400':'bg-amber-400'}`}/>
              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] text-slate-400 font-mono">{p.id}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${STATUS_BADGE[p.status]}`}>{p.status}</span>
                    </div>
                    <h3 className="font-black text-[#0A1929] text-lg leading-tight">{p.name}</h3>
                    <p className="text-sm text-slate-400 mt-0.5">{p.type}</p>
                  </div>
                </div>
                {p.description && <p className="text-sm text-slate-600 leading-relaxed mb-4 bg-slate-50 rounded-xl p-4 border border-slate-100">{p.description}</p>}
                <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5"><Clock size={12}/> Started {p.startDate}</span>
                  <span className="flex items-center gap-1.5"><User size={12}/> {p.manager}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  DOWNLOADS
// ─────────────────────────────────────────────────────────────────────────────

function Downloads() {
  return (
    <div className="space-y-5">
      <div><h2 className="text-xl font-black text-[#0A1929]">Downloads</h2><p className="text-sm text-slate-400 mt-0.5">Project files, reports, and deliverable assets</p></div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <EmptyState icon={HardDrive} title="No files yet" message="Downloadable assets and project deliverables will appear here once uploaded by your account manager." action={{ label: 'Request a file', href: 'mailto:itechnetworkafrica@gmail.com?subject=File%20Request' }}/>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  PROFILE
// ─────────────────────────────────────────────────────────────────────────────

function Profile({ client }: { client: PortalClient }) {
  const initials = client.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
  const tierColors: Record<string,string> = {
    Standard: 'bg-blue-50 text-blue-700 border border-blue-200',
    Business: 'bg-violet-50 text-violet-700 border border-violet-200',
    Enterprise: 'bg-amber-50 text-amber-700 border border-amber-200',
  };
  return (
    <div className="space-y-5 max-w-lg">
      <div><h2 className="text-xl font-black text-[#0A1929]">My Profile</h2><p className="text-sm text-slate-400 mt-0.5">Your account details</p></div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-[#0A1929] px-6 pt-8 pb-16 relative">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #3CB52A 0%, transparent 60%)' }}/>
        </div>
        <div className="px-6 pb-6 -mt-10 relative">
          <div className="w-20 h-20 rounded-2xl bg-[#3CB52A] border-4 border-white shadow-lg flex items-center justify-center text-white font-black text-2xl mb-3">{initials}</div>
          <div className="flex flex-wrap items-start gap-3">
            <div><h3 className="text-xl font-black text-[#0A1929]">{client.name}</h3><p className="text-sm text-slate-400">{client.role} · {client.organisation}</p></div>
            <span className={`mt-1 text-[10px] font-bold px-3 py-1 rounded-full ${tierColors[client.tier] ?? 'bg-slate-100 text-slate-600'}`}>{client.tier} Client</span>
          </div>
        </div>
        <div className="border-t border-slate-50 px-6 py-4 space-y-3">
          {[
            { icon: Mail,      label: 'Email',        value: client.email        },
            { icon: Phone,     label: 'Phone',        value: client.phone        },
            { icon: Building2, label: 'Organisation', value: client.organisation },
            { icon: Shield,    label: 'Plan',         value: `${client.tier} Client` },
            { icon: Clock,     label: 'Member Since', value: client.memberSince  },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0"><Icon size={14} className="text-slate-400"/></div>
              <div><div className="text-[11px] text-slate-400 font-medium">{label}</div><div className="text-sm font-semibold text-slate-700">{value}</div></div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
        <strong>Need to update your details?</strong> Contact your account manager at{' '}
        <a href="mailto:itechnetworkafrica@gmail.com" className="underline font-semibold">itechnetworkafrica@gmail.com</a>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  PORTAL SHELL
// ─────────────────────────────────────────────────────────────────────────────

function PortalShell({ client, onLogout }: { client: PortalClient; onLogout: () => void }) {
  const [section, setSection]     = useState('dashboard');
  const [mobileNav, setMobileNav] = useState(false);
  const [unread, setUnread]       = useState({ invoices: 0, support: 0 });

  useEffect(() => {
    function refresh() { setUnread(getClientUnread(client.id)); }
    refresh();
    const id = setInterval(refresh, 4000);
    return () => clearInterval(id);
  }, []);

  function navTo(s: string) { setSection(s); setMobileNav(false); }

  const NAV = [
    { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard, badge: 0                                    },
    { id: 'projects',  label: 'Projects',   icon: FolderOpen,      badge: 0                                    },
    { id: 'invoices',  label: 'Invoices',   icon: FileText,        badge: unread.invoices                      },
    { id: 'support',   label: 'Support',    icon: Headphones,      badge: unread.support                       },
    { id: 'downloads', label: 'Downloads',  icon: Download,        badge: 0                                    },
    { id: 'profile',   label: 'Profile',    icon: User,            badge: 0                                    },
  ];

  const sectionMap: Record<string, React.ReactNode> = {
    dashboard: <Dashboard client={client} onNavigate={navTo}/>,
    projects:  <Projects client={client}/>,
    invoices:  <ClientInvoices client={client}/>,
    support:   <ClientSupport client={client}/>,
    downloads: <Downloads/>,
    profile:   <Profile client={client}/>,
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="h-16 bg-[#0A1929] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button className="lg:hidden w-9 h-9 rounded-xl text-white/60 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors" onClick={() => setMobileNav(v=>!v)}>
            {mobileNav ? <X size={20}/> : <Menu size={20}/>}
          </button>
          <img src="/logo-icon.png" alt="iTech" className="w-7 h-7 rounded object-contain" onError={e=>(e.currentTarget.style.display='none')}/>
          <span className="text-white font-bold text-sm">Client Portal</span>
        </div>
        <div className="flex items-center gap-2">
          {(unread.invoices + unread.support) > 0 && (
            <span className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#3CB52A]/20 text-[#3CB52A] text-xs font-bold">
              {unread.invoices + unread.support} new
            </span>
          )}
          <div className="hidden sm:block text-right mr-1">
            <div className="text-white text-xs font-semibold">{client.name}</div>
            <div className="text-white/30 text-[10px]">{client.tier} Client</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#3CB52A] flex items-center justify-center text-white font-bold text-sm shrink-0">{client.name[0]}</div>
          <button onClick={onLogout} className="ml-1 w-9 h-9 flex items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors" title="Log out">
            <LogOut size={17}/>
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-slate-100 sticky top-16 h-[calc(100vh-4rem)] pt-4 pb-6">
          <nav className="flex-1 px-3 space-y-0.5">
            {NAV.map(item => (
              <button key={item.id} onClick={() => navTo(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${section===item.id?'bg-[#f0fdf4] text-[#3CB52A]':'text-slate-500 hover:bg-slate-50 hover:text-[#0A1929]'}`}>
                <item.icon size={16} className={section===item.id?'text-[#3CB52A]':'text-slate-400'}/>
                {item.label}
                <NavBadge n={item.badge}/>
              </button>
            ))}
          </nav>
          <div className="px-4 mt-4 space-y-3">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <p className="text-xs text-slate-400 mb-1.5">Need help?</p>
              <a href="mailto:itechnetworkafrica@gmail.com" className="text-xs font-bold text-[#3CB52A] hover:underline flex items-center gap-1">Email us <ExternalLink size={11}/></a>
            </div>
            <a href="/" className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-[#3CB52A] transition-colors px-1"><ExternalLink size={12}/> Back to website</a>
          </div>
        </aside>

        {/* Mobile overlay */}
        <AnimatePresence>
          {mobileNav && (
            <>
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="lg:hidden fixed inset-0 bg-black/50 z-20 top-16" onClick={()=>setMobileNav(false)}/>
              <motion.aside initial={{x:-240}} animate={{x:0}} exit={{x:-240}} transition={{type:'spring',stiffness:320,damping:32}}
                className="lg:hidden fixed left-0 top-16 bottom-0 w-56 bg-white border-r border-slate-100 z-30 flex flex-col pt-4 pb-6">
                <nav className="flex-1 px-3 space-y-0.5">
                  {NAV.map(item => (
                    <button key={item.id} onClick={() => navTo(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${section===item.id?'bg-[#f0fdf4] text-[#3CB52A]':'text-slate-500 hover:bg-slate-50'}`}>
                      <item.icon size={16}/>{item.label}<NavBadge n={item.badge}/>
                    </button>
                  ))}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 p-4 lg:p-8 min-w-0 pb-24 lg:pb-8">
          <AnimatePresence mode="wait">
            <motion.div key={section} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:0.2}}>
              {sectionMap[section]}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-20 flex items-center justify-around px-1 py-1 shadow-lg">
        {NAV.map(item => (
          <button key={item.id} onClick={() => navTo(item.id)}
            className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl flex-1 relative transition-colors ${section===item.id?'text-[#3CB52A]':'text-slate-400'}`}>
            <item.icon size={19}/>
            <span className="text-[9px] font-semibold leading-none">{item.label}</span>
            {item.badge > 0 && <span className="absolute top-1 right-1 min-w-[14px] h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center px-0.5">{item.badge}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  LOGIN SCREEN
// ─────────────────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (client: PortalClient) => void }) {
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault(); setError('');
    if (!email.trim() || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    setTimeout(() => {
      const client = findClient(email);
      if (!client || !verifyPassword(password, client.passwordHash)) { setError("Invalid email or password. Contact us if you need access."); setLoading(false); return; }
      setLoading(false); onLogin(client);
    }, 900);
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#060E18]" style={{ backgroundImage: 'radial-gradient(ellipse at 65% 30%, rgba(60,181,42,0.07) 0%, transparent 60%)' }}>
      <div className="pt-16 pb-10 text-center px-6">
        <img src="/logo-icon.png" alt="iTech" className="h-14 w-14 object-contain mx-auto mb-8 rounded-2xl" onError={e=>(e.currentTarget.style.display='none')}/>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3CB52A]/15 border border-[#3CB52A]/30 mb-5">
          <Lock size={12} className="text-[#3CB52A]"/>
          <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">Secure Client Area</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Client Portal</h1>
        <p className="text-white/40 text-sm max-w-xs mx-auto leading-relaxed">Access is managed by the iTech Network Africa admin team.</p>
      </div>
      <div className="flex-1 flex items-start justify-center px-4 pb-16">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}} className="w-full max-w-sm">
          <div className="neon-border shadow-[0_0_40px_rgba(0,229,255,0.15)]">
            <div className="neon-glass">
              <h2 className="text-2xl font-black text-white mb-1 text-center">Welcome Back</h2>
              <p className="text-white/40 text-sm mb-7 text-center">Sign in to your client portal</p>
              {error && (
                <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
                  <AlertCircle size={15} className="shrink-0 mt-0.5"/><span>{error}</span>
                </motion.div>
              )}
              <form onSubmit={submit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"/>
                    <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" autoComplete="email"
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-transparent border-2 border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#00e5ff] transition-all"
                      onFocus={e=>(e.currentTarget.style.boxShadow='0 0 15px rgba(0,229,255,0.2)')} onBlur={e=>(e.currentTarget.style.boxShadow='none')}/>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"/>
                    <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password"
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-transparent border-2 border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#00e5ff] transition-all"
                      onFocus={e=>(e.currentTarget.style.boxShadow='0 0 15px rgba(0,229,255,0.2)')} onBlur={e=>(e.currentTarget.style.boxShadow='none')}/>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <a href="mailto:itechnetworkafrica@gmail.com?subject=Portal%20Password%20Reset" className="text-[#00e5ff] hover:underline text-xs font-medium">Forgot Password?</a>
                  <a href="mailto:itechnetworkafrica@gmail.com?subject=Portal%20Access%20Request" className="text-[#00e5ff] hover:underline text-xs font-medium">Request Access</a>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-xl font-bold text-white text-base transition-all disabled:opacity-60 hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(90deg,#00e5ff,#ff00cc)', boxShadow: loading?'none':'0 0 20px rgba(255,0,204,0.35)' }}
                  onMouseEnter={e=>{ if(!loading) e.currentTarget.style.boxShadow='0 0 32px rgba(255,0,204,0.55)'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.boxShadow=loading?'none':'0 0 20px rgba(255,0,204,0.35)'; }}>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2 text-sm">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/></svg>Signing in…
                    </span>
                  ) : 'Sign In'}
                </button>
              </form>
              <p className="text-center text-white/30 text-xs mt-6">
                Don't have an account?{' '}
                <a href="mailto:itechnetworkafrica@gmail.com?subject=Portal%20Access%20Request" className="text-[#00e5ff] hover:underline font-semibold">Request Access</a>
              </p>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-center gap-4 text-white/20">
            <span className="flex items-center gap-1 text-[11px]"><CheckCircle2 size={11}/> SSL Encrypted</span>
            <span className="flex items-center gap-1 text-[11px]"><Shield size={11}/> Admin-controlled access</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  ROOT
// ─────────────────────────────────────────────────────────────────────────────

export default function ClientPortalPage() {
  const [client, setClient] = useState<PortalClient | null>(null);
  return client
    ? <PortalShell client={client} onLogout={() => setClient(null)}/>
    : <LoginScreen onLogin={setClient}/>;
}
