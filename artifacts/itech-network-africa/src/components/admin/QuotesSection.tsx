/**
 * QuotesSection — Admin quote management panel.
 *
 * Create, edit, preview, download (PDF), share, and track quotes.
 * Quotes can be sent to clients via a unique shareable link.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Plus, Edit3, Trash2, Copy, Check, Send, Eye,
  Download, Link2, ChevronDown, X, AlertCircle, CheckCircle2,
  Clock, Building2, Mail, Phone, MapPin, Printer, RefreshCw,
  DollarSign, Percent, MoreHorizontal, ExternalLink, Receipt,
} from 'lucide-react';
import { apiUrl } from '@/lib/apiBase';

/* ─── Types ──────────────────────────────────────────────────────────────── */
export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}
export interface Quote {
  id: number;
  ref: string;
  token: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired';
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCompany: string;
  clientAddress: string;
  title: string;
  items: QuoteItem[];
  notes: string;
  terms: string;
  validUntil: string | null;
  currency: string;
  subtotal: number;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  taxRate: number;
  total: number;
  createdAt: string;
  sentAt: string | null;
}

/* ─── Constants ──────────────────────────────────────────────────────────── */
const CURRENCIES = ['USD', 'EUR', 'GBP', 'LRD'];
const UNITS      = ['project','page','hour','day','month','year','user','device','license','item'];
const SERVICES   = [
  'Website Design & Development',
  'Web Hosting (Monthly)',
  'Web Hosting (Annual)',
  'Domain Registration (Annual)',
  'Digital Marketing (Monthly)',
  'SEO Optimisation',
  'Google Ads Management',
  'Social Media Management',
  'Graphic Design',
  'Logo Design',
  'IT Consultancy',
  'Network Setup',
  'Cloud Infrastructure',
  'Mobile App Development',
  'AI Integration',
  'Email Setup & Hosting',
  'Website Maintenance',
  'Content Writing',
  'Photography & Video',
];

const DEFAULT_TERMS = `1. This quotation is valid for 30 days from the date of issue.
2. A 50% deposit is required before work commences.
3. The remaining balance is due upon project completion/delivery.
4. Any changes to agreed scope may result in additional charges.
5. All work remains the property of iTech Network Africa until full payment is received.
6. iTech Network Africa reserves the right to withdraw this quotation at any time.`;

const STATUS_UI: Record<string, { label: string; dot: string; bg: string; text: string }> = {
  draft:    { label: 'Draft',    dot: 'bg-slate-400',   bg: 'bg-slate-100',   text: 'text-slate-600'   },
  sent:     { label: 'Sent',     dot: 'bg-blue-500',    bg: 'bg-blue-50',     text: 'text-blue-700'    },
  viewed:   { label: 'Viewed',   dot: 'bg-violet-500',  bg: 'bg-violet-50',   text: 'text-violet-700'  },
  accepted: { label: 'Accepted', dot: 'bg-emerald-500', bg: 'bg-emerald-50',  text: 'text-emerald-700' },
  declined: { label: 'Declined', dot: 'bg-red-500',     bg: 'bg-red-50',      text: 'text-red-700'     },
  expired:  { label: 'Expired',  dot: 'bg-orange-400',  bg: 'bg-orange-50',   text: 'text-orange-700'  },
};

const CURRENCY_SYMBOL: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', LRD: 'L$' };

/* ─── Utilities ──────────────────────────────────────────────────────────── */
function fmt$(currency: string, amount: number) {
  const sym = CURRENCY_SYMBOL[currency] ?? currency + ' ';
  return sym + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function fmtDate(iso: string | null | undefined) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
function genId() { return Math.random().toString(36).slice(2, 10) + Date.now().toString(36); }
function quoteUrl(token: string) { return `${window.location.origin}/quote/${token}`; }

function computeTotals(items: QuoteItem[], discountType: string, discountValue: number, taxRate: number) {
  const subtotal      = items.reduce((s, it) => s + Number(it.quantity) * Number(it.unitPrice), 0);
  const discountAmount = discountType === 'percent'
    ? subtotal * (discountValue / 100)
    : Math.min(discountValue, subtotal);
  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const taxAmount     = afterDiscount * (taxRate / 100);
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    afterDiscount: Math.round(afterDiscount * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    total: Math.round((afterDiscount + taxAmount) * 100) / 100,
  };
}

/* ─── Status chip ────────────────────────────────────────────────────────── */
function StatusChip({ status }: { status: string }) {
  const ui = STATUS_UI[status] ?? STATUS_UI.draft;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${ui.bg} ${ui.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${ui.dot}`} />
      {ui.label}
    </span>
  );
}

/* ─── Toast ──────────────────────────────────────────────────────────────── */
function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-slate-800 text-white text-sm px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 pointer-events-none">
      <CheckCircle2 size={15} className="text-[#3CB52A]" /> {msg}
    </motion.div>
  );
}

/* ─── Confirm Delete Modal ───────────────────────────────────────────────── */
function ConfirmDelete({ quote, onConfirm, onCancel }: { quote: Quote; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={20} className="text-red-500" />
        </div>
        <h3 className="font-bold text-slate-800 text-center text-lg">Delete {quote.ref}?</h3>
        <p className="text-slate-500 text-sm text-center mt-2 mb-6">
          This will permanently delete the quote for <strong>{quote.clientName}</strong>. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors">Delete</button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Quote Form Modal ───────────────────────────────────────────────────── */
interface FormState {
  title: string;
  currency: string;
  validUntil: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCompany: string;
  clientAddress: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  taxRate: number;
  notes: string;
  terms: string;
}

const EMPTY_FORM: FormState = {
  title: '', currency: 'USD', validUntil: '',
  clientName: '', clientEmail: '', clientPhone: '', clientCompany: '', clientAddress: '',
  discountType: 'percent', discountValue: 0, taxRate: 0,
  notes: '', terms: DEFAULT_TERMS,
};

function QuoteFormModal({
  initial, onSave, onClose,
}: {
  initial: Quote | null;
  onSave: (q: Quote) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormState>(initial
    ? {
        title: initial.title, currency: initial.currency, validUntil: initial.validUntil ?? '',
        clientName: initial.clientName, clientEmail: initial.clientEmail,
        clientPhone: initial.clientPhone, clientCompany: initial.clientCompany,
        clientAddress: initial.clientAddress,
        discountType: initial.discountType, discountValue: initial.discountValue, taxRate: initial.taxRate,
        notes: initial.notes, terms: initial.terms,
      }
    : EMPTY_FORM);
  const [items, setItems] = useState<QuoteItem[]>(initial?.items ?? []);
  const [tab, setTab] = useState<'client' | 'items' | 'pricing' | 'notes'>('client');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof FormState, v: string | number) =>
    setForm(f => ({ ...f, [k]: v }));

  /* Item helpers */
  function addItem() {
    setItems(its => [...its, { id: genId(), description: '', quantity: 1, unit: 'project', unitPrice: 0, total: 0 }]);
    setTab('items');
  }
  function removeItem(id: string) { setItems(its => its.filter(it => it.id !== id)); }
  function updateItem(id: string, key: keyof QuoteItem, value: string | number) {
    setItems(its => its.map(it => {
      if (it.id !== id) return it;
      const updated = { ...it, [key]: value };
      if (key === 'quantity' || key === 'unitPrice') {
        updated.total = Number(updated.quantity) * Number(updated.unitPrice);
      }
      return updated;
    }));
  }

  /* Totals */
  const totals = computeTotals(items, form.discountType, form.discountValue, form.taxRate);

  /* Save */
  async function save(status?: string) {
    setError('');
    if (!form.clientName.trim()) { setError('Client name is required.'); setTab('client'); return; }
    if (!form.title.trim()) { setError('Quote title is required.'); setTab('client'); return; }
    if (items.length === 0) { setError('Add at least one line item.'); setTab('items'); return; }
    setSaving(true);
    try {
      const payload = { ...form, items, status: status ?? (initial?.status ?? 'draft') };
      const url  = initial ? apiUrl(`/api/admin/quotes/${initial.id}`) : apiUrl('/api/admin/quotes');
      const method = initial ? 'PUT' : 'POST';
      const res  = await fetch(url, { method, credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Failed to save quote.'); setSaving(false); return; }
      onSave(await res.json());
    } catch { setError('Connection error. Please try again.'); }
    setSaving(false);
  }

  const TABS = [
    { id: 'client', label: 'Client & Title' },
    { id: 'items',  label: `Line Items${items.length ? ` (${items.length})` : ''}` },
    { id: 'pricing', label: 'Pricing' },
    { id: 'notes', label: 'Notes & Terms' },
  ] as const;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full md:max-w-2xl md:rounded-3xl rounded-t-3xl shadow-2xl max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="font-black text-slate-800 text-lg">{initial ? `Edit ${initial.ref}` : 'New Quote'}</h2>
            {totals.total > 0 && (
              <p className="text-[#3CB52A] font-bold text-sm mt-0.5">
                Total: {fmt$(form.currency, totals.total)}
              </p>
            )}
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Tab nav */}
        <div className="flex border-b border-slate-100 shrink-0 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 min-w-max px-4 py-3 text-xs font-semibold transition-all whitespace-nowrap ${tab === t.id ? 'text-[#3CB52A] border-b-2 border-[#3CB52A] -mb-px' : 'text-slate-400 hover:text-slate-600'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mt-4 flex gap-2 bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl shrink-0">
            <AlertCircle size={14} className="shrink-0 mt-0.5" /> {error}
          </div>
        )}

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

          {/* ── Client & Title ─────────────────────────────────────────────── */}
          {tab === 'client' && (
            <div className="space-y-4">
              <div>
                <label className="label">Quote Title *</label>
                <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Website Design & Hosting Package" className="input" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Currency</label>
                  <select value={form.currency} onChange={e => set('currency', e.target.value)} className="input">
                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Valid Until</label>
                  <input type="date" value={form.validUntil} onChange={e => set('validUntil', e.target.value)} className="input" />
                </div>
              </div>
              <hr className="border-slate-100" />
              <div>
                <label className="label">Client Name *</label>
                <input value={form.clientName} onChange={e => set('clientName', e.target.value)} placeholder="Full name" className="input" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Email Address</label>
                  <input type="email" value={form.clientEmail} onChange={e => set('clientEmail', e.target.value)} placeholder="client@example.com" className="input" />
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input value={form.clientPhone} onChange={e => set('clientPhone', e.target.value)} placeholder="+231 XX XXX XXXX" className="input" />
                </div>
              </div>
              <div>
                <label className="label">Company / Organisation</label>
                <input value={form.clientCompany} onChange={e => set('clientCompany', e.target.value)} placeholder="Company name (optional)" className="input" />
              </div>
              <div>
                <label className="label">Address</label>
                <textarea value={form.clientAddress} onChange={e => set('clientAddress', e.target.value)} placeholder="Client address (optional)" rows={2} className="input resize-none" />
              </div>
            </div>
          )}

          {/* ── Line Items ─────────────────────────────────────────────────── */}
          {tab === 'items' && (
            <div className="space-y-3">
              {items.length === 0 && (
                <div className="text-center py-8 text-slate-300">
                  <Receipt size={32} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No items yet. Add your first service below.</p>
                </div>
              )}
              {items.map((item, i) => (
                <div key={item.id} className="bg-slate-50 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Item {i + 1}</span>
                    <button onClick={() => removeItem(item.id)} className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-red-50 transition-all">
                      <X size={13} />
                    </button>
                  </div>
                  {/* Description with datalist */}
                  <div>
                    <input
                      value={item.description}
                      onChange={e => updateItem(item.id, 'description', e.target.value)}
                      list={`svc-${item.id}`}
                      placeholder="Service description…"
                      className="input text-sm"
                    />
                    <datalist id={`svc-${item.id}`}>
                      {SERVICES.map(s => <option key={s} value={s} />)}
                    </datalist>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="label text-[10px]">Qty</label>
                      <input type="number" min="0" step="any"
                        value={item.quantity}
                        onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        className="input text-sm text-center" />
                    </div>
                    <div>
                      <label className="label text-[10px]">Unit</label>
                      <select value={item.unit} onChange={e => updateItem(item.id, 'unit', e.target.value)} className="input text-sm capitalize">
                        {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label text-[10px]">Unit Price</label>
                      <input type="number" min="0" step="0.01"
                        value={item.unitPrice}
                        onChange={e => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="input text-sm" />
                    </div>
                    <div>
                      <label className="label text-[10px]">Total</label>
                      <div className="input text-sm font-semibold text-slate-700 bg-white border-slate-200 text-right cursor-default">
                        {fmt$(form.currency, Number(item.quantity) * Number(item.unitPrice))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addItem}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-[#3CB52A] hover:text-[#3CB52A] text-sm font-semibold transition-all flex items-center justify-center gap-2">
                <Plus size={15} /> Add Line Item
              </button>
            </div>
          )}

          {/* ── Pricing ────────────────────────────────────────────────────── */}
          {tab === 'pricing' && (
            <div className="space-y-5">
              {/* Running totals */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-2 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-semibold text-slate-700">{fmt$(form.currency, totals.subtotal)}</span>
                </div>
                {form.discountValue > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>-{fmt$(form.currency, totals.discountAmount)}</span>
                  </div>
                )}
                {form.taxRate > 0 && (
                  <div className="flex justify-between text-slate-500">
                    <span>Tax ({form.taxRate}%)</span>
                    <span>{fmt$(form.currency, totals.taxAmount)}</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-base">
                  <span>Total</span>
                  <span className="text-[#3CB52A]">{fmt$(form.currency, totals.total)}</span>
                </div>
              </div>

              {/* Discount */}
              <div>
                <label className="label">Discount</label>
                <div className="flex gap-2">
                  <div className="flex rounded-xl border border-slate-200 overflow-hidden text-sm font-semibold shrink-0">
                    <button
                      onClick={() => set('discountType', 'percent')}
                      className={`px-3 py-2.5 flex items-center gap-1.5 transition-colors ${form.discountType === 'percent' ? 'bg-[#3CB52A] text-white' : 'text-slate-400 hover:bg-slate-50'}`}>
                      <Percent size={13} /> %
                    </button>
                    <button
                      onClick={() => set('discountType', 'fixed')}
                      className={`px-3 py-2.5 flex items-center gap-1.5 transition-colors ${form.discountType === 'fixed' ? 'bg-[#3CB52A] text-white' : 'text-slate-400 hover:bg-slate-50'}`}>
                      <DollarSign size={13} /> Fixed
                    </button>
                  </div>
                  <input type="number" min="0" step="any" value={form.discountValue}
                    onChange={e => set('discountValue', parseFloat(e.target.value) || 0)}
                    placeholder={form.discountType === 'percent' ? '0' : '0.00'}
                    className="input flex-1" />
                </div>
              </div>

              {/* Tax */}
              <div>
                <label className="label">Tax Rate (%)</label>
                <input type="number" min="0" max="100" step="0.1" value={form.taxRate}
                  onChange={e => set('taxRate', parseFloat(e.target.value) || 0)}
                  placeholder="0" className="input" />
              </div>
            </div>
          )}

          {/* ── Notes & Terms ──────────────────────────────────────────────── */}
          {tab === 'notes' && (
            <div className="space-y-4">
              <div>
                <label className="label">Notes for Client</label>
                <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
                  placeholder="Any special notes, payment instructions, or messages for the client…"
                  rows={4} className="input resize-none" />
              </div>
              <div>
                <label className="label">Terms & Conditions</label>
                <textarea value={form.terms} onChange={e => set('terms', e.target.value)}
                  rows={7} className="input resize-none font-mono text-xs" />
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-100 shrink-0 flex gap-2 justify-between">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm font-semibold hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <div className="flex gap-2">
            <button onClick={() => save('draft')} disabled={saving}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50">
              Save Draft
            </button>
            <button onClick={() => save()} disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-[#3CB52A] text-white text-sm font-bold hover:bg-[#2e911f] transition-colors disabled:opacity-50 flex items-center gap-2">
              {saving ? <><RefreshCw size={13} className="animate-spin" /> Saving…</> : <><CheckCircle2 size={14} /> Save Quote</>}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Global input styles via JSX hack — scoped to this modal */}
      <style>{`
        .label { display: block; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 5px; }
        .input { width: 100%; padding: 10px 12px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 14px; color: #1e293b; background: white; outline: none; transition: border-color 0.15s; }
        .input:focus { border-color: #3CB52A; }
        select.input { cursor: pointer; }
      `}</style>
    </div>
  );
}

/* ─── Actions Dropdown ───────────────────────────────────────────────────── */
function ActionsMenu({ quote, onEdit, onDuplicate, onDelete, onStatusChange }: {
  quote: Quote;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onStatusChange: (s: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const statuses = ['draft', 'sent', 'viewed', 'accepted', 'declined', 'expired'].filter(s => s !== quote.status);

  return (
    <div className="relative">
      <button onClick={() => setOpen(v => !v)}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all">
        <MoreHorizontal size={15} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 top-9 z-20 bg-white rounded-2xl shadow-2xl border border-slate-100 py-1.5 w-44 text-sm">
              <button onClick={() => { onEdit(); setOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors">
                <Edit3 size={13} className="text-slate-400" /> Edit
              </button>
              <button onClick={() => { onDuplicate(); setOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors">
                <Copy size={13} className="text-slate-400" /> Duplicate
              </button>
              <div className="border-t border-slate-100 my-1" />
              {statuses.map(s => {
                const ui = STATUS_UI[s];
                return (
                  <button key={s} onClick={() => { onStatusChange(s); setOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors">
                    <span className={`w-2 h-2 rounded-full ${ui.dot}`} /> Mark {ui.label}
                  </button>
                );
              })}
              <div className="border-t border-slate-100 my-1" />
              <button onClick={() => { onDelete(); setOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2 text-red-500 hover:bg-red-50 transition-colors">
                <Trash2 size={13} /> Delete
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main Section ───────────────────────────────────────────────────────── */
export function QuotesSection() {
  const [quotes, setQuotes]   = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Quote | null>(null);
  const [deleting, setDeleting] = useState<Quote | null>(null);
  const [toast, setToast]     = useState('');
  const [copied, setCopied]   = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(apiUrl('/api/admin/quotes'), { credentials: 'include' });
      if (res.ok) setQuotes(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  /* Actions */
  function openCreate() { setEditing(null); setShowForm(true); }
  function openEdit(q: Quote) { setEditing(q); setShowForm(true); }

  function handleSaved(q: Quote) {
    setQuotes(qs => {
      const idx = qs.findIndex(x => x.id === q.id);
      return idx >= 0 ? qs.map(x => x.id === q.id ? q : x) : [q, ...qs];
    });
    setShowForm(false);
    setToast(editing ? `${q.ref} updated.` : `${q.ref} created!`);
  }

  async function handleSend(q: Quote) {
    try {
      const res = await fetch(apiUrl(`/api/admin/quotes/${q.id}/send`), { method: 'POST', credentials: 'include' });
      if (res.ok) {
        const updated = await res.json();
        setQuotes(qs => qs.map(x => x.id === q.id ? updated : x));
        // Open mailto
        const subject = encodeURIComponent(`Your Quote from iTech Network Africa — ${q.ref}`);
        const body = encodeURIComponent(`Hi ${q.clientName},\n\nPlease find your personalised quote below:\n\n${quoteUrl(q.token)}\n\nThis quote is for: ${q.title}\nTotal: ${fmt$(q.currency, q.total)}\n\nKind regards,\niTech Network Africa\n+231 761 978 796`);
        window.open(`mailto:${q.clientEmail || ''}?subject=${subject}&body=${body}`);
        setToast(`${q.ref} marked as sent.`);
      }
    } catch { setToast('Failed to mark as sent.'); }
  }

  async function handleStatusChange(q: Quote, status: string) {
    try {
      const res = await fetch(apiUrl(`/api/admin/quotes/${q.id}/status`), {
        method: 'PATCH', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setQuotes(qs => qs.map(x => x.id === q.id ? updated : x));
        setToast(`Status updated to ${STATUS_UI[status]?.label}.`);
      }
    } catch { /* ignore */ }
  }

  async function handleDuplicate(q: Quote) {
    try {
      const res = await fetch(apiUrl(`/api/admin/quotes/${q.id}/duplicate`), { method: 'POST', credentials: 'include' });
      if (res.ok) {
        const copy = await res.json();
        setQuotes(qs => [copy, ...qs]);
        setToast(`Duplicated as ${copy.ref}.`);
      }
    } catch { /* ignore */ }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await fetch(apiUrl(`/api/admin/quotes/${deleting.id}`), { method: 'DELETE', credentials: 'include' });
      setQuotes(qs => qs.filter(x => x.id !== deleting.id));
      setToast(`${deleting.ref} deleted.`);
    } catch { /* ignore */ }
    setDeleting(null);
  }

  async function copyLink(q: Quote) {
    await navigator.clipboard.writeText(quoteUrl(q.token));
    setCopied(q.token);
    setTimeout(() => setCopied(null), 2000);
    setToast('Link copied to clipboard!');
  }

  function openPreview(q: Quote) {
    window.open(`/quote/${q.token}`, '_blank');
  }
  function openPDF(q: Quote) {
    window.open(`/quote/${q.token}?print=1`, '_blank');
  }

  /* Filters */
  const FILTERS = ['all', 'draft', 'sent', 'viewed', 'accepted', 'declined', 'expired'];
  const visible = filter === 'all' ? quotes : quotes.filter(q => q.status === filter);

  /* Stats */
  const stats = {
    total:    quotes.length,
    draft:    quotes.filter(q => q.status === 'draft').length,
    sent:     quotes.filter(q => q.status === 'sent' || q.status === 'viewed').length,
    accepted: quotes.filter(q => q.status === 'accepted').length,
    totalValue: quotes.filter(q => q.status === 'accepted').reduce((s, q) => s + q.total, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Quotes</h2>
          <p className="text-slate-400 text-sm mt-0.5">Create, manage and share professional quotes with clients.</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3CB52A] text-white text-sm font-bold hover:bg-[#2e911f] transition-all shadow-sm shrink-0">
          <Plus size={15} /> New Quote
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Quotes', value: stats.total, icon: FileText, color: 'text-slate-600 bg-slate-100' },
          { label: 'Awaiting Response', value: stats.sent, icon: Send, color: 'text-blue-600 bg-blue-50' },
          { label: 'Accepted', value: stats.accepted, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Won Revenue', value: `$${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, icon: DollarSign, color: 'text-[#3CB52A] bg-[#f0fdf4]' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
              <s.icon size={18} />
            </div>
            <div>
              <div className="font-black text-slate-800 text-xl leading-none">{s.value}</div>
              <div className="text-slate-400 text-xs mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 overflow-x-auto">
        {FILTERS.map(f => {
          const count = f === 'all' ? quotes.length : quotes.filter(q => q.status === f).length;
          return (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap ${filter === f ? 'bg-[#3CB52A] text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
              {f === 'all' ? 'All' : STATUS_UI[f]?.label ?? f}
              {count > 0 && <span className={`text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ${filter === f ? 'bg-white/30' : 'bg-slate-100 text-slate-500'}`}>{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-300 text-sm">
            <RefreshCw size={24} className="animate-spin mx-auto mb-2 opacity-50" />
            Loading quotes…
          </div>
        ) : visible.length === 0 ? (
          <div className="py-16 text-center">
            <FileText size={36} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-semibold text-sm">
              {filter === 'all' ? 'No quotes yet.' : `No ${STATUS_UI[filter]?.label.toLowerCase()} quotes.`}
            </p>
            {filter === 'all' && (
              <button onClick={openCreate} className="mt-4 px-5 py-2.5 rounded-xl bg-[#3CB52A] text-white text-sm font-bold hover:bg-[#2e911f] transition-all">
                Create First Quote
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Quote</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Client</th>
                  <th className="text-right px-4 py-3">Total</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell">Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {visible.map(q => (
                  <tr key={q.id} className="hover:bg-slate-50/50 transition-colors group">
                    {/* Ref + Title */}
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-800 text-xs">{q.ref}</div>
                      <div className="text-slate-500 text-xs mt-0.5 truncate max-w-[160px]">{q.title}</div>
                    </td>
                    {/* Client */}
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <div className="font-semibold text-slate-700 text-xs">{q.clientName}</div>
                      {q.clientCompany && <div className="text-slate-400 text-[11px]">{q.clientCompany}</div>}
                    </td>
                    {/* Total */}
                    <td className="px-4 py-3.5 text-right font-black text-slate-800">
                      {fmt$(q.currency, q.total)}
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3.5 text-center">
                      <StatusChip status={q.status} />
                    </td>
                    {/* Date */}
                    <td className="px-4 py-3.5 hidden lg:table-cell text-slate-400 text-xs">{fmtDate(q.createdAt)}</td>
                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 justify-end">
                        {/* Preview */}
                        <button onClick={() => openPreview(q)} title="Preview"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#3CB52A] hover:bg-[#f0fdf4] transition-all">
                          <ExternalLink size={13} />
                        </button>
                        {/* PDF */}
                        <button onClick={() => openPDF(q)} title="Download PDF"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                          <Download size={13} />
                        </button>
                        {/* Copy link */}
                        <button onClick={() => copyLink(q)} title="Copy share link"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all">
                          {copied === q.token ? <Check size={13} className="text-[#3CB52A]" /> : <Link2 size={13} />}
                        </button>
                        {/* Send */}
                        {(q.status === 'draft' || q.status === 'sent') && (
                          <button onClick={() => handleSend(q)} title="Send via email"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
                            <Send size={13} />
                          </button>
                        )}
                        {/* More */}
                        <ActionsMenu
                          quote={q}
                          onEdit={() => openEdit(q)}
                          onDuplicate={() => handleDuplicate(q)}
                          onDelete={() => setDeleting(q)}
                          onStatusChange={s => handleStatusChange(q, s)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showForm && (
          <QuoteFormModal
            initial={editing}
            onSave={handleSaved}
            onClose={() => setShowForm(false)}
          />
        )}
        {deleting && (
          <ConfirmDelete
            quote={deleting}
            onConfirm={handleDelete}
            onCancel={() => setDeleting(null)}
          />
        )}
        {toast && <Toast key={toast + Date.now()} msg={toast} onDone={() => setToast('')} />}
      </AnimatePresence>
    </div>
  );
}
