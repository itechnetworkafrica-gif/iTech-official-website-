import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, FileText, Headphones, Settings, LogOut,
  Mail, Lock, Eye, EyeOff, AlertCircle, Shield, Menu, X,
  CheckCircle2, Clock, PauseCircle, Copy, Check, Plus, Trash2,
  Building2, Phone, Star, TrendingUp, Key, ExternalLink,
  Send, RefreshCw, ChevronDown, Printer, Download, Edit3,
  DollarSign, AlertTriangle, MessageSquare, ArrowLeft, Filter,
} from 'lucide-react';
import { PORTAL_CLIENTS } from '@/lib/portalClients';
import { ADMIN_CREDENTIALS, verifyAdminPassword, decodeClientPassword } from '@/lib/adminAuth';
import {
  getInvoices, saveInvoice, deleteInvoice, updateInvoiceStatus,
  getTickets, addTicketMessage, updateTicketStatus, markTicketMessagesRead,
  getAdminUnread, fmt$, fmtDate, timeAgo, todayStr, addDays,
  type Invoice, type SupportTicket,
} from '@/lib/portalData';

// ─── Colours ──────────────────────────────────────────────────────────────────

const INVOICE_STATUS: Record<string, { bg: string; text: string; dot: string }> = {
  Draft:   { bg: 'bg-slate-100',   text: 'text-slate-600',   dot: 'bg-slate-400'   },
  Sent:    { bg: 'bg-blue-50',     text: 'text-blue-700',    dot: 'bg-blue-500'    },
  Paid:    { bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Overdue: { bg: 'bg-red-50',      text: 'text-red-700',     dot: 'bg-red-500'     },
};
const TICKET_STATUS: Record<string, { bg: string; text: string }> = {
  Open:        { bg: 'bg-amber-50',   text: 'text-amber-700'   },
  'In Progress':{ bg: 'bg-blue-50',   text: 'text-blue-700'    },
  Resolved:    { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  Closed:      { bg: 'bg-slate-100',  text: 'text-slate-500'   },
};
const PRIORITY_COLOR: Record<string, string> = {
  Low: 'text-slate-400', Medium: 'text-amber-500', High: 'text-orange-500', Urgent: 'text-red-600',
};
const TIER_COLOR: Record<string, string> = {
  Standard:   'bg-blue-50 text-blue-700',
  Business:   'bg-violet-50 text-violet-700',
  Enterprise: 'bg-amber-50 text-amber-700',
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color, icon: Icon }: {
  label: string; value: number | string; sub?: string; color: string; icon: React.ElementType;
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

// ─── Badge ────────────────────────────────────────────────────────────────────

function Badge({ n }: { n: number }) {
  if (!n) return null;
  return (
    <span className="ml-auto min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
      {n > 99 ? '99+' : n}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  INVOICE FORM (slide-over)
// ─────────────────────────────────────────────────────────────────────────────

function InvoiceForm({ editing, onClose, onSaved }: {
  editing: Invoice | null; onClose: () => void; onSaved: () => void;
}) {
  const blank = { id: '', description: '', qty: 1, rate: 0, amount: 0 };
  const [clientId, setClientId]   = useState(editing?.clientId || '');
  const [issued, setIssued]       = useState(editing?.issuedDate || todayStr());
  const [due, setDue]             = useState(editing?.dueDate   || addDays(30));
  const [items, setItems]         = useState(editing?.items.map(i => ({ ...i })) || [{ ...blank, id: '1' }]);
  const [taxRate, setTaxRate]     = useState(editing?.taxRate ?? 0);
  const [notes, setNotes]         = useState(editing?.notes || '');
  const [terms, setTerms]         = useState(editing?.paymentTerms || 'Payment due within 30 days of invoice date.');
  const [saving, setSaving]       = useState<'Draft' | 'Sent' | null>(null);
  const [err, setErr]             = useState('');

  const client  = PORTAL_CLIENTS.find(c => c.id === clientId);
  const subtotal = items.reduce((s, i) => s + (i.qty || 0) * (i.rate || 0), 0);
  const taxAmt   = subtotal * (taxRate || 0) / 100;
  const total    = subtotal + taxAmt;

  function addRow() { setItems(p => [...p, { id: Date.now().toString(), description: '', qty: 1, rate: 0, amount: 0 }]); }
  function removeRow(id: string) { setItems(p => p.filter(r => r.id !== id)); }
  function updateRow(id: string, field: string, val: string | number) {
    setItems(p => p.map(r => r.id === id ? { ...r, [field]: val, amount: field === 'qty' ? Number(val) * r.rate : r.qty * Number(val) } : r));
  }

  function handleSave(status: 'Draft' | 'Sent') {
    setErr('');
    if (!clientId) { setErr('Please select a client.'); return; }
    if (items.every(i => !i.description.trim())) { setErr('Add at least one line item.'); return; }
    setSaving(status);
    setTimeout(() => {
      saveInvoice({
        ...(editing || {}),
        clientId,
        clientName: client!.name,
        clientEmail: client!.email,
        clientOrg: client!.organisation,
        issuedDate: issued,
        dueDate: due,
        status,
        items: items.map(i => ({ ...i, amount: i.qty * i.rate })),
        taxRate,
        subtotal,
        taxAmount: taxAmt,
        total,
        notes,
        paymentTerms: terms,
      });
      setSaving(null);
      onSaved();
    }, 400);
  }

  return (
    <motion.div
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 280, damping: 30 }}
      className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
        <div>
          <h2 className="font-black text-slate-900">{editing ? 'Edit Invoice' : 'New Invoice'}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{editing ? editing.invoiceNumber : 'Fill in the template below'}</p>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {err && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            <AlertCircle size={15} /> {err}
          </div>
        )}

        {/* Client + Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-3">
            <label className="label">Bill To (Client)</label>
            <select value={clientId} onChange={e => setClientId(e.target.value)} className="input">
              <option value="">— Select client —</option>
              {PORTAL_CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name} ({c.organisation})</option>)}
            </select>
          </div>
          <div>
            <label className="label">Issue Date</label>
            <input type="date" value={issued} onChange={e => setIssued(e.target.value)} className="input" />
          </div>
          <div>
            <label className="label">Due Date</label>
            <input type="date" value={due} onChange={e => setDue(e.target.value)} className="input" />
          </div>
          <div>
            <label className="label">Tax Rate (%)</label>
            <input type="number" min={0} max={100} step={0.5} value={taxRate} onChange={e => setTaxRate(Number(e.target.value))} className="input" />
          </div>
        </div>

        {/* Line items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="label mb-0">Line Items</label>
            <button onClick={addRow} className="flex items-center gap-1.5 text-xs font-bold text-[#3CB52A] hover:underline">
              <Plus size={13} /> Add Row
            </button>
          </div>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 bg-slate-50 px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <div className="col-span-5">Description</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Rate ($)</div>
              <div className="col-span-2 text-right">Amount</div>
              <div className="col-span-1" />
            </div>
            {items.map((row, i) => (
              <div key={row.id} className="grid grid-cols-12 items-center px-4 py-2.5 border-b border-slate-100 last:border-0 gap-1">
                <div className="col-span-5">
                  <input
                    type="text" value={row.description}
                    onChange={e => updateRow(row.id, 'description', e.target.value)}
                    placeholder={`Item ${i + 1}`}
                    className="w-full text-sm text-slate-800 bg-transparent focus:outline-none placeholder:text-slate-300"
                  />
                </div>
                <div className="col-span-2 flex justify-center">
                  <input type="number" min={1} value={row.qty} onChange={e => updateRow(row.id, 'qty', Number(e.target.value))}
                    className="w-14 text-center text-sm text-slate-800 bg-slate-50 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#3CB52A]" />
                </div>
                <div className="col-span-2 flex justify-end">
                  <input type="number" min={0} step={0.01} value={row.rate} onChange={e => updateRow(row.id, 'rate', Number(e.target.value))}
                    className="w-20 text-right text-sm text-slate-800 bg-slate-50 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#3CB52A]" />
                </div>
                <div className="col-span-2 text-right text-sm font-semibold text-slate-700">{fmt$(row.qty * row.rate)}</div>
                <div className="col-span-1 flex justify-end">
                  {items.length > 1 && (
                    <button onClick={() => removeRow(row.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600"><span>Subtotal</span><span className="font-semibold">{fmt$(subtotal)}</span></div>
            {taxRate > 0 && <div className="flex justify-between text-slate-600"><span>Tax ({taxRate}%)</span><span className="font-semibold">{fmt$(taxAmt)}</span></div>}
            <div className="flex justify-between font-black text-slate-900 border-t border-slate-200 pt-2 text-base"><span>Total</span><span>{fmt$(total)}</span></div>
          </div>
        </div>

        {/* Notes + Terms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Thank you for your business…" className="input resize-none" />
          </div>
          <div>
            <label className="label">Payment Terms</label>
            <textarea value={terms} onChange={e => setTerms(e.target.value)} rows={3} className="input resize-none" />
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="px-6 py-4 border-t border-slate-100 bg-white flex gap-3">
        <button onClick={() => handleSave('Draft')} disabled={!!saving}
          className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50">
          {saving === 'Draft' ? 'Saving…' : 'Save as Draft'}
        </button>
        <button onClick={() => handleSave('Sent')} disabled={!!saving}
          className="flex-1 py-2.5 rounded-xl bg-[#3CB52A] hover:bg-[#2e911f] text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
          <Send size={14} /> {saving === 'Sent' ? 'Sending…' : 'Send to Client'}
        </button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  INVOICE PREVIEW (print template)
// ─────────────────────────────────────────────────────────────────────────────

function InvoicePreview({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  const s = INVOICE_STATUS[invoice.status];
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl my-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 print:hidden">
          <span className="font-bold text-slate-800">{invoice.invoiceNumber}</span>
          <div className="flex gap-2">
            <button onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              <Printer size={14} /> Print / PDF
            </button>
            <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"><X size={18} /></button>
          </div>
        </div>

        {/* Invoice */}
        <div className="p-8 space-y-6">
          {/* Header */}
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

          {/* Dates + Bill to */}
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

          {/* Items table */}
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

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-56 space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>{fmt$(invoice.subtotal)}</span></div>
              {invoice.taxRate > 0 && <div className="flex justify-between text-slate-500"><span>Tax ({invoice.taxRate}%)</span><span>{fmt$(invoice.taxAmount)}</span></div>}
              <div className="flex justify-between font-black text-[#0A1929] text-lg border-t border-slate-200 pt-2"><span>Total Due</span><span>{fmt$(invoice.total)}</span></div>
            </div>
          </div>

          {/* Notes + Terms */}
          {(invoice.notes || invoice.paymentTerms) && (
            <div className="border-t border-slate-100 pt-4 space-y-2 text-sm text-slate-500">
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
//  ADMIN INVOICES SECTION
// ─────────────────────────────────────────────────────────────────────────────

function InvoicesSection() {
  const [invoices, setInvoices]       = useState<Invoice[]>([]);
  const [filter, setFilter]           = useState<string>('All');
  const [showForm, setShowForm]       = useState(false);
  const [editing, setEditing]         = useState<Invoice | null>(null);
  const [previewing, setPreviewing]   = useState<Invoice | null>(null);

  function reload() { setInvoices(getInvoices()); }
  useEffect(() => { reload(); }, []);

  const FILTERS = ['All', 'Draft', 'Sent', 'Paid', 'Overdue'];
  const filtered = filter === 'All' ? invoices : invoices.filter(i => i.status === filter);

  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.total, 0);
  const pending      = invoices.filter(i => i.status === 'Sent').reduce((s, i) => s + i.total, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">Invoices</h2>
          <p className="text-sm text-slate-400 mt-0.5">Create, manage and send invoices to clients</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2e911f] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors">
          <Plus size={15} /> New Invoice
        </button>
      </div>

      {/* Revenue strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Invoices', value: invoices.length, icon: FileText,      color: 'bg-slate-50 text-slate-500'   },
          { label: 'Revenue Collected', value: fmt$(totalRevenue), icon: DollarSign,  color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Awaiting Payment', value: fmt$(pending),     icon: Clock,       color: 'bg-blue-50 text-blue-600'    },
          { label: 'Overdue',          value: invoices.filter(i=>i.status==='Overdue').length, icon: AlertTriangle, color: 'bg-red-50 text-red-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}><s.icon size={16} /></div>
            <div><div className="font-black text-slate-900 text-sm">{s.value}</div><div className="text-[11px] text-slate-400">{s.label}</div></div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === f ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {f} {f !== 'All' && <span className="ml-1 opacity-60">({invoices.filter(i=>i.status===f).length})</span>}
          </button>
        ))}
      </div>

      {/* Invoice list */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            {filter === 'All' ? 'No invoices yet. Create your first one.' : `No ${filter} invoices.`}
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map(inv => {
              const s = INVOICE_STATUS[inv.status];
              return (
                <div key={inv.id} className="flex flex-wrap items-center gap-3 px-5 py-4 hover:bg-slate-50/50 transition-colors">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-800 text-sm">{inv.invoiceNumber}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>{inv.status}</span>
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
                    {inv.status === 'Sent' && (
                      <button onClick={() => { updateInvoiceStatus(inv.id, 'Paid'); reload(); }} title="Mark Paid"
                        className="w-8 h-8 rounded-lg hover:bg-emerald-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors"><CheckCircle2 size={15} /></button>
                    )}
                    <button onClick={() => { deleteInvoice(inv.id); reload(); }} title="Delete"
                      className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Slide-over form */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowForm(false)} />
            <InvoiceForm editing={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); reload(); }} />
          </>
        )}
      </AnimatePresence>

      {/* Preview modal */}
      <AnimatePresence>
        {previewing && <InvoicePreview invoice={previewing} onClose={() => setPreviewing(null)} />}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  ADMIN SUPPORT SECTION
// ─────────────────────────────────────────────────────────────────────────────

function SupportSection() {
  const [tickets, setTickets]     = useState<SupportTicket[]>([]);
  const [selected, setSelected]   = useState<string | null>(null);
  const [reply, setReply]         = useState('');
  const [filter, setFilter]       = useState('All');
  const [sending, setSending]     = useState(false);
  const msgEndRef                 = useRef<HTMLDivElement>(null);

  function reload() { setTickets(getTickets()); }
  useEffect(() => { reload(); }, []);
  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [selected, tickets]);

  const ticket = tickets.find(t => t.id === selected) || null;

  function openTicket(id: string) {
    setSelected(id); markTicketMessagesRead(id, 'admin'); reload();
  }

  function sendReply() {
    if (!reply.trim() || !selected || sending) return;
    setSending(true);
    setTimeout(() => {
      addTicketMessage(selected, 'admin', 'iTech Support Team', reply.trim());
      setReply(''); setSending(false); reload();
    }, 300);
  }

  const FILTERS = ['All', 'Open', 'In Progress', 'Resolved', 'Closed'];
  const filtered = filter === 'All' ? tickets : tickets.filter(t => t.status === filter);
  const unread = (t: SupportTicket) => t.messages.filter(m => m.sender === 'client' && !m.read).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Support Center</h2>
          <p className="text-sm text-slate-400 mt-0.5">{tickets.filter(t=>t.status==='Open'||t.status==='In Progress').length} active ticket{tickets.filter(t=>t.status==='Open'||t.status==='In Progress').length!==1?'s':''}</p>
        </div>
        <button onClick={reload} className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"><RefreshCw size={15} /></button>
      </div>

      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {FILTERS.map(f => {
          const count = f === 'All' ? tickets.length : tickets.filter(t=>t.status===f).length;
          return (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter===f?'bg-white text-slate-800 shadow-sm':'text-slate-500 hover:text-slate-700'}`}>
              {f} <span className="opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-4 h-[600px]">
        {/* Ticket list */}
        <div className="w-72 shrink-0 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-3 border-b border-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider">Tickets ({filtered.length})</div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {filtered.length === 0 && <div className="py-12 text-center text-slate-400 text-sm">No tickets.</div>}
            {filtered.map(t => {
              const s = TICKET_STATUS[t.status];
              const u = unread(t);
              return (
                <button key={t.id} onClick={() => openTicket(t.id)}
                  className={`w-full text-left px-4 py-3.5 hover:bg-slate-50 transition-colors ${selected===t.id?'bg-[#f0fdf4] border-r-2 border-[#3CB52A]':''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-sm text-slate-800 truncate flex-1">{t.subject}</span>
                    {u > 0 && <span className="shrink-0 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">{u}</span>}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 truncate">{t.clientName}</div>
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

        {/* Thread */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
          {!ticket ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
              <MessageSquare size={40} className="mb-3" />
              <p className="text-sm font-semibold">Select a ticket to view the conversation</p>
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-black text-slate-900">{ticket.subject}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{ticket.ticketNumber} · {ticket.clientName} · {ticket.category}</div>
                </div>
                <div className="flex items-center gap-2">
                  <select value={ticket.status}
                    onChange={e => { updateTicketStatus(ticket.id, e.target.value as SupportTicket['status']); reload(); }}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#3CB52A] bg-white text-slate-700">
                    {['Open','In Progress','Resolved','Closed'].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Messages */}
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

              {/* Reply */}
              {ticket.status !== 'Closed' && (
                <div className="px-5 py-4 border-t border-slate-100 flex gap-3">
                  <textarea value={reply} onChange={e => setReply(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                    rows={2} placeholder="Type your reply… (Enter to send)"
                    className="flex-1 resize-none text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#3CB52A] transition-colors" />
                  <button onClick={sendReply} disabled={!reply.trim() || sending}
                    className="self-end w-10 h-10 rounded-xl bg-[#3CB52A] hover:bg-[#2e911f] flex items-center justify-center text-white disabled:opacity-40 transition-colors shrink-0">
                    <Send size={16} />
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
//  OVERVIEW
// ─────────────────────────────────────────────────────────────────────────────

function Overview({ onNav }: { onNav: (s: string) => void }) {
  const invoices = getInvoices();
  const tickets  = getTickets();
  const revenue  = invoices.filter(i=>i.status==='Paid').reduce((s,i)=>s+i.total,0);
  const pending  = invoices.filter(i=>i.status==='Sent').reduce((s,i)=>s+i.total,0);
  const openTkts = tickets.filter(t=>t.status==='Open'||t.status==='In Progress').length;
  const unread   = getAdminUnread();

  const recentTickets  = [...tickets].sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)).slice(0,4);
  const recentInvoices = [...invoices].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).slice(0,4);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900">Overview</h2>
        <p className="text-sm text-slate-400 mt-0.5">Real-time snapshot of your client portal activity</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Clients"     value={PORTAL_CLIENTS.length}         icon={Users}        color="bg-violet-50 text-violet-600" />
        <StatCard label="Revenue Collected" value={fmt$(revenue)}                 icon={DollarSign}   color="bg-emerald-50 text-emerald-600" sub="Paid invoices" />
        <StatCard label="Awaiting Payment"  value={fmt$(pending)}                 icon={Clock}        color="bg-blue-50 text-blue-600" />
        <StatCard label="Open Tickets"      value={openTkts} sub={unread ? `${unread} unread` : undefined} icon={MessageSquare} color="bg-amber-50 text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent invoices */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Recent Invoices</h3>
            <button onClick={() => onNav('invoices')} className="text-xs font-semibold text-[#3CB52A] hover:underline">View all</button>
          </div>
          {recentInvoices.length === 0
            ? <div className="py-10 text-center text-slate-400 text-sm">No invoices yet.</div>
            : recentInvoices.map(inv => {
              const s = INVOICE_STATUS[inv.status];
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
            })
          }
        </div>

        {/* Recent tickets */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Recent Support</h3>
            <button onClick={() => onNav('support')} className="text-xs font-semibold text-[#3CB52A] hover:underline">View all</button>
          </div>
          {recentTickets.length === 0
            ? <div className="py-10 text-center text-slate-400 text-sm">No tickets yet.</div>
            : recentTickets.map(t => {
              const s = TICKET_STATUS[t.status];
              const u = t.messages.filter(m=>m.sender==='client'&&!m.read).length;
              return (
                <div key={t.id} className="flex items-center gap-3 px-5 py-3 border-b border-slate-50 last:border-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-800 truncate">{t.subject}</span>
                      {u > 0 && <span className="shrink-0 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">{u}</span>}
                    </div>
                    <div className="text-xs text-slate-400">{t.clientName} · {timeAgo(t.updatedAt)}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${s.bg} ${s.text}`}>{t.status}</span>
                </div>
              );
            })
          }
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-[#0A1929] rounded-2xl p-6">
        <h3 className="text-white font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'New Invoice',   icon: FileText,    action: () => onNav('invoices'),   color: 'bg-[#3CB52A]/20 text-[#3CB52A]' },
            { label: 'View Tickets',  icon: MessageSquare, action: () => onNav('support'),  color: 'bg-blue-500/20 text-blue-400'   },
            { label: 'Manage Clients',icon: Users,       action: () => onNav('clients'),    color: 'bg-violet-500/20 text-violet-400'},
            { label: 'Settings',      icon: Settings,    action: () => onNav('settings'),   color: 'bg-slate-500/20 text-slate-400' },
          ].map((a,i) => (
            <button key={i} onClick={a.action}
              className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white/5 transition-colors text-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.color}`}><a.icon size={18} /></div>
              <span className="text-xs font-semibold text-white/60">{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  CLIENTS SECTION
// ─────────────────────────────────────────────────────────────────────────────

function ClientsSection() {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [copied, setCopied]     = useState<string | null>(null);

  function toggleReveal(id: string) {
    setRevealed(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).catch(()=>{});
    setCopied(key); setTimeout(()=>setCopied(null),2000);
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-slate-900">Client Management</h2>
        <p className="text-sm text-slate-400 mt-0.5">{PORTAL_CLIENTS.length} registered client{PORTAL_CLIENTS.length!==1?'s':''}</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 items-start text-sm text-amber-800">
        <Key size={15} className="text-amber-500 shrink-0 mt-0.5" />
        <span>Credentials are shown so you can send login details to clients. To add a client, edit <code className="bg-amber-100 px-1 rounded text-xs">src/lib/portalClients.ts</code>.</span>
      </div>

      {PORTAL_CLIENTS.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center text-slate-400 text-sm">No clients yet.</div>
      )}

      <div className="space-y-4">
        {PORTAL_CLIENTS.map(client => {
          const plainPw = decodeClientPassword(client.passwordHash);
          const isRevealed = revealed.has(client.id);
          const clientInvoices = getInvoices().filter(i=>i.clientId===client.id);
          const clientTickets  = getTickets().filter(t=>t.clientId===client.id);
          return (
            <div key={client.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 flex flex-wrap items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#f0fdf4] border-2 border-[#3CB52A]/20 flex items-center justify-center text-[#3CB52A] font-black text-xl shrink-0">{client.name[0]}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-slate-900">{client.name}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${TIER_COLOR[client.tier]}`}>{client.tier}</span>
                  </div>
                  <div className="text-sm text-slate-400">{client.role} · {client.organisation}</div>
                </div>
                <div className="flex gap-4 text-center text-xs">
                  <div><div className="font-black text-slate-800">{clientInvoices.length}</div><div className="text-slate-400">Invoices</div></div>
                  <div><div className="font-black text-slate-800">{clientTickets.length}</div><div className="text-slate-400">Tickets</div></div>
                  <div><div className="font-black text-slate-800">{client.projects.length}</div><div className="text-slate-400">Projects</div></div>
                </div>
              </div>

              <div className="px-6 pb-4 border-t border-slate-50 pt-4 flex flex-wrap gap-4">
                {[
                  { icon: Mail, label: 'Email', value: client.email },
                  { icon: Phone, label: 'Phone', value: client.phone },
                  { icon: Building2, label: 'Org', value: client.organisation },
                  { icon: Star, label: 'Since', value: client.memberSince },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-2 text-sm">
                    <Icon size={13} className="text-slate-400 shrink-0" />
                    <span className="text-slate-400">{label}:</span>
                    <span className="font-semibold text-slate-700">{value}</span>
                  </div>
                ))}
              </div>

              <div className="px-6 pb-5 border-t border-slate-50 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Key size={11} /> Portal Credentials</span>
                  <button onClick={() => toggleReveal(client.id)} className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors">
                    {isRevealed ? <EyeOff size={13}/> : <Eye size={13}/>} {isRevealed ? 'Hide' : 'Show'}
                  </button>
                </div>
                <AnimatePresence>
                  {isRevealed && (
                    <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} className="overflow-hidden">
                      <div className="space-y-2">
                        {[
                          { label: 'URL',      value: '/portal',       key: `url-${client.id}`   },
                          { label: 'Email',    value: client.email,    key: `em-${client.id}`    },
                          { label: 'Password', value: plainPw,         key: `pw-${client.id}`    },
                        ].map(({ label, value, key }) => (
                          <div key={key} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-200">
                            <div className="flex-1 min-w-0">
                              <div className="text-[10px] text-slate-400 font-semibold">{label}</div>
                              <div className="text-sm font-mono text-slate-800 truncate">{value}</div>
                            </div>
                            <button onClick={() => copy(value, key)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#3CB52A] transition-colors">
                              {copied === key ? <Check size={14} className="text-[#3CB52A]"/> : <Copy size={14}/>}
                            </button>
                          </div>
                        ))}
                      </div>
                      <a href={`mailto:${client.email}?subject=Your%20iTech%20Portal%20Access&body=Hello%20${encodeURIComponent(client.name)}%2C%0A%0AYour%20portal%20is%20ready.%0A%0AURL%3A%20/portal%0AEmail%3A%20${encodeURIComponent(client.email)}%0APassword%3A%20${encodeURIComponent(plainPw)}%0A%0ABest%20regards%2C%0AiTech%20Network%20Africa`}
                        className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#3CB52A] hover:underline">
                        <Mail size={12}/> Email credentials to {client.name.split(' ')[0]} <ExternalLink size={11}/>
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  SETTINGS
// ─────────────────────────────────────────────────────────────────────────────

function AdminSettings() {
  const [copied, setCopied] = useState<string|null>(null);
  function copy(v: string, k: string) { navigator.clipboard.writeText(v).catch(()=>{}); setCopied(k); setTimeout(()=>setCopied(null),2000); }
  return (
    <div className="space-y-6 max-w-xl">
      <div><h2 className="text-xl font-black text-slate-900">Settings</h2><p className="text-sm text-slate-400 mt-0.5">Admin account and configuration</p></div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-4 pb-5 border-b border-slate-50">
          <div className="w-14 h-14 rounded-2xl bg-[#0A1929] flex items-center justify-center text-[#3CB52A]"><Shield size={26}/></div>
          <div><div className="font-black text-slate-900 text-lg">iTech Admin</div><div className="text-sm text-slate-400">Super Administrator</div></div>
        </div>
        {[
          { label: 'Admin URL', value: '/admin',                  key: 'url'   },
          { label: 'Email',     value: ADMIN_CREDENTIALS.email,   key: 'email' },
        ].map(({ label, value, key }) => (
          <div key={key} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
            <div className="flex-1"><div className="text-[11px] text-slate-400 font-semibold">{label}</div><div className="text-sm font-mono text-slate-800">{value}</div></div>
            <button onClick={() => copy(value, key)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#3CB52A] transition-colors">
              {copied === key ? <Check size={14} className="text-[#3CB52A]"/> : <Copy size={14}/>}
            </button>
          </div>
        ))}
        <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-4 text-sm text-[#166534]">
          <strong>To change the admin password:</strong> Open <code className="bg-[#dcfce7] px-1 rounded text-xs">src/lib/adminAuth.ts</code> and update the <code className="bg-[#dcfce7] px-1 rounded text-xs">hash</code>.
          Generate: <code className="bg-[#dcfce7] px-1 rounded text-xs">btoa("Password:iTechPortal2025")</code>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-3">Adding Clients</h3>
        <p className="text-sm text-slate-500 mb-3">Edit <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">src/lib/portalClients.ts</code> to add clients. Generate hashes with:</p>
        <div className="bg-slate-900 rounded-xl px-4 py-3 font-mono text-sm text-emerald-400">btoa("ClientPassword:iTechPortal2025")</div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-3">Data Storage</h3>
        <p className="text-sm text-slate-500">Invoices and support tickets are stored in the browser's <code className="bg-slate-100 px-1 rounded text-xs">localStorage</code>. They persist across sessions on the same device and browser.</p>
        <button onClick={() => { if (confirm('Clear all invoices and tickets? This cannot be undone.')) { localStorage.removeItem('itech_portal_invoices_v2'); localStorage.removeItem('itech_portal_tickets_v2'); window.location.reload(); } }}
          className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors">
          <Trash2 size={14}/> Clear all data
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  ADMIN LOGIN
// ─────────────────────────────────────────────────────────────────────────────

function AdminLoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault(); setError('');
    if (!email.trim() || !password) { setError('Enter email and password.'); return; }
    if (email.trim().toLowerCase() !== ADMIN_CREDENTIALS.email.toLowerCase()) { setError('Invalid admin credentials.'); return; }
    setLoading(true);
    setTimeout(() => {
      if (!verifyAdminPassword(password)) { setError('Invalid admin credentials.'); setLoading(false); return; }
      setLoading(false); onLogin();
    }, 600);
  }

  return (
    <div className="min-h-screen bg-[#060E18] flex flex-col items-center justify-center px-4"
      style={{ backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(60,181,42,0.08) 0%, transparent 55%)' }}>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#3CB52A]/15 border border-[#3CB52A]/30">
            <Shield size={13} className="text-[#3CB52A]"/>
            <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">Admin Access Only</span>
          </div>
        </div>
        <div className="text-center mb-7">
          <h1 className="text-3xl font-black text-white">Admin Dashboard</h1>
          <p className="text-white/40 text-sm mt-2">iTech Network Africa · Staff only</p>
        </div>
        <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-7 backdrop-blur-sm">
          {error && (
            <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} className="flex gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
              <AlertCircle size={15} className="shrink-0 mt-0.5"/>{error}
            </motion.div>
          )}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"/>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@itechnetworkafrica.com" autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#3CB52A]/60 transition-colors"/>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"/>
                <input type={showPw?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#3CB52A]/60 transition-colors"/>
                <button type="button" onClick={()=>setShowPw(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPw?<EyeOff size={15}/>:<Eye size={15}/>}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl font-bold text-white text-sm bg-[#3CB52A] hover:bg-[#2e911f] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/></svg>Signing in…</> : <>Sign In to Dashboard</>}
            </button>
          </form>
        </div>
        <p className="text-center text-white/20 text-xs mt-5 flex items-center justify-center gap-2"><Lock size={11}/> Restricted · Staff only</p>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  ADMIN SHELL
// ─────────────────────────────────────────────────────────────────────────────

const ADMIN_NAV = [
  { id: 'overview',  label: 'Overview',        icon: LayoutDashboard },
  { id: 'invoices',  label: 'Invoices',         icon: FileText        },
  { id: 'support',   label: 'Support',          icon: Headphones      },
  { id: 'clients',   label: 'Clients',          icon: Users           },
  { id: 'settings',  label: 'Settings',         icon: Settings        },
];

function AdminShell({ onLogout }: { onLogout: () => void }) {
  const [section, setSection]   = useState('overview');
  const [mobileNav, setMobileNav] = useState(false);
  const [unread, setUnread]     = useState(0);

  useEffect(() => {
    function refresh() { setUnread(getAdminUnread()); }
    refresh();
    const id = setInterval(refresh, 3000);
    return () => clearInterval(id);
  }, []);

  function navTo(s: string) { setSection(s); setMobileNav(false); }

  const sectionMap: Record<string,React.ReactNode> = {
    overview: <Overview onNav={navTo}/>,
    invoices: <InvoicesSection/>,
    support:  <SupportSection/>,
    clients:  <ClientsSection/>,
    settings: <AdminSettings/>,
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="h-16 bg-[#0A1929] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button className="lg:hidden w-9 h-9 rounded-xl text-white/60 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
            onClick={() => setMobileNav(v=>!v)}>{mobileNav?<X size={20}/>:<Menu size={20}/>}</button>
          <div className="w-8 h-8 rounded-lg bg-[#3CB52A] flex items-center justify-center shrink-0"><Shield size={16} className="text-white"/></div>
          <div>
            <span className="text-white font-bold text-sm leading-none block">Admin Dashboard</span>
            <span className="text-white/30 text-[10px]">iTech Network Africa</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {unread > 0 && (
            <button onClick={() => navTo('support')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 text-red-400 text-xs font-bold">
              <MessageSquare size={13}/> {unread} unread
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1.5 mr-1">
            <div className="w-2 h-2 rounded-full bg-[#3CB52A] animate-pulse"/>
            <span className="text-white/30 text-xs">Live</span>
          </div>
          <button onClick={onLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors text-xs font-semibold">
            <LogOut size={14}/> Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-52 bg-white border-r border-slate-100 sticky top-16 h-[calc(100vh-4rem)] pt-4 pb-6">
          <nav className="flex-1 px-3 space-y-0.5">
            {ADMIN_NAV.map(item => (
              <button key={item.id} onClick={() => navTo(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${section===item.id?'bg-[#f0fdf4] text-[#3CB52A]':'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
                <item.icon size={16} className={section===item.id?'text-[#3CB52A]':'text-slate-400'}/>
                {item.label}
                {item.id === 'support' && <Badge n={unread}/>}
                {item.id === 'clients' && PORTAL_CLIENTS.length > 0 && (
                  <span className="ml-auto text-[10px] font-bold bg-slate-100 text-slate-500 rounded-full px-1.5 py-0.5">{PORTAL_CLIENTS.length}</span>
                )}
              </button>
            ))}
          </nav>
          <div className="px-4">
            <a href="/portal" className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-[#3CB52A] transition-colors">
              <ExternalLink size={12}/> View Client Portal
            </a>
          </div>
        </aside>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileNav && (
            <>
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="lg:hidden fixed inset-0 bg-black/40 z-20 top-16" onClick={()=>setMobileNav(false)}/>
              <motion.aside initial={{x:-220}} animate={{x:0}} exit={{x:-220}} transition={{type:'spring',stiffness:320,damping:32}}
                className="lg:hidden fixed left-0 top-16 bottom-0 w-52 bg-white border-r border-slate-100 z-30 flex flex-col pt-4 pb-6">
                <nav className="flex-1 px-3 space-y-0.5">
                  {ADMIN_NAV.map(item => (
                    <button key={item.id} onClick={() => navTo(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${section===item.id?'bg-[#f0fdf4] text-[#3CB52A]':'text-slate-500 hover:bg-slate-50'}`}>
                      <item.icon size={16}/>{item.label}
                      {item.id==='support' && <Badge n={unread}/>}
                    </button>
                  ))}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 p-4 lg:p-8 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={section} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:0.18}}>
              {sectionMap[section]}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  ROOT
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [authed, setAuthed] = useState(false);
  return authed ? <AdminShell onLogout={() => setAuthed(false)}/> : <AdminLoginScreen onLogin={() => setAuthed(true)}/>;
}
