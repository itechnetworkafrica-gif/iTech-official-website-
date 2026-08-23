/**
 * Public shareable quote page — /quote/:token
 *
 * Viewed by prospective clients via the link the admin shares.
 * Supports ?print=1 URL param to trigger the print dialog immediately
 * (used by the admin "Download PDF" button).
 */
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'wouter';
import { motion } from 'framer-motion';
import {
  CheckCircle2, AlertCircle, Clock, Download, Mail, ArrowLeft,
  Phone, Building2, MapPin, Calendar, FileText, Printer,
} from 'lucide-react';
import { apiUrl } from '@/lib/apiBase';
import { useSEO } from '@/hooks/useSEO';

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}
interface Quote {
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

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const CURRENCY_SYMBOL: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', LRD: 'L$' };

function fmt$(currency: string, amount: number) {
  const sym = CURRENCY_SYMBOL[currency] ?? currency + ' ';
  return sym + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function fmtDate(iso: string | null | undefined) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function isExpired(validUntil: string | null) {
  if (!validUntil) return false;
  return new Date(validUntil) < new Date(new Date().toDateString());
}

function computeDiscount(q: Quote) {
  return q.discountType === 'percent'
    ? q.subtotal * (q.discountValue / 100)
    : Math.min(q.discountValue, q.subtotal);
}

const STATUS_UI: Record<string, { label: string; cls: string }> = {
  draft:    { label: 'Draft',    cls: 'bg-slate-100 text-slate-600' },
  sent:     { label: 'Sent',     cls: 'bg-blue-50 text-blue-700' },
  viewed:   { label: 'Viewed',   cls: 'bg-violet-50 text-violet-700' },
  accepted: { label: 'Accepted', cls: 'bg-emerald-50 text-emerald-700' },
  declined: { label: 'Declined', cls: 'bg-red-50 text-red-700' },
  expired:  { label: 'Expired',  cls: 'bg-orange-50 text-orange-700' },
};

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function QuotePage() {
  useSEO({ title: 'Your Quote — iTech Network Africa', description: 'View your personalised quotation from iTech Network Africa.', noindex: true });

  const params = useParams<{ token: string }>();
  const token = params.token ?? '';

  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const isPrint = new URLSearchParams(window.location.search).get('print') === '1';

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(apiUrl(`/api/quote/${token}`));
        if (!res.ok) { setError('Quote not found or the link has expired.'); setLoading(false); return; }
        const data = await res.json();
        setQuote(data);
        if (data.status === 'accepted') setAccepted(true);
      } catch {
        setError('Unable to load quote. Please check the link and try again.');
      }
      setLoading(false);
    }
    load();
  }, [token]);

  // Auto-print when ?print=1
  useEffect(() => {
    if (isPrint && quote) {
      setTimeout(() => window.print(), 600);
    }
  }, [isPrint, quote]);

  async function handleAccept() {
    if (!quote || accepting) return;
    setAccepting(true);
    try {
      const res = await fetch(apiUrl(`/api/quote/${token}/accept`), { method: 'POST' });
      if (res.ok) {
        setAccepted(true);
        setQuote(q => q ? { ...q, status: 'accepted' } : q);
      }
    } catch { /* ignore */ }
    setAccepting(false);
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-[#3CB52A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-400 text-sm">Loading your quote…</p>
      </div>
    </div>
  );

  if (error || !quote) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <AlertCircle size={40} className="text-slate-300 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-slate-700 mb-2">Quote Not Found</h1>
        <p className="text-slate-400 text-sm mb-6">{error}</p>
        <Link href="/" className="inline-flex items-center gap-2 text-[#3CB52A] text-sm font-semibold hover:underline">
          <ArrowLeft size={14} /> Back to iTech Network Africa
        </Link>
      </div>
    </div>
  );

  const discountAmount = computeDiscount(quote);
  const afterDiscount  = Math.max(0, quote.subtotal - discountAmount);
  const taxAmount      = afterDiscount * (quote.taxRate / 100);
  const expired        = isExpired(quote.validUntil) && quote.status !== 'accepted';
  const statusUI       = STATUS_UI[quote.status] ?? STATUS_UI.draft;

  return (
    <>
      {/* Print-only styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-shadow { box-shadow: none !important; }
          @page { margin: 15mm; size: A4; }
        }
      `}</style>

      <div className="min-h-screen bg-slate-100 py-8 px-4 print:bg-white print:py-0">
        {/* Actions bar — hidden on print */}
        <div className="no-print max-w-3xl mx-auto mb-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-sm transition-colors">
            <ArrowLeft size={14} /> iTech Network Africa
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open(`/quote/${token}?print=1`, '_blank')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm"
            >
              <Printer size={14} /> Download PDF
            </button>
            {!accepted && !expired && (quote.status === 'sent' || quote.status === 'viewed') && (
              <button
                onClick={handleAccept}
                disabled={accepting}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#3CB52A] text-white text-sm font-bold hover:bg-[#2e911f] transition-all shadow-sm disabled:opacity-50"
              >
                <CheckCircle2 size={14} />
                {accepting ? 'Accepting…' : 'Accept This Quote'}
              </button>
            )}
          </div>
        </div>

        {/* Accepted banner */}
        {accepted && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="no-print max-w-3xl mx-auto mb-4 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-emerald-800 text-sm">Quote Accepted!</p>
              <p className="text-emerald-600 text-xs">Our team will be in touch shortly to proceed. Thank you for choosing iTech Network Africa.</p>
            </div>
          </motion.div>
        )}

        {/* Expired banner */}
        {expired && !accepted && (
          <div className="no-print max-w-3xl mx-auto mb-4 bg-orange-50 border border-orange-200 rounded-2xl px-5 py-4 flex items-center gap-3">
            <Clock size={18} className="text-orange-500 shrink-0" />
            <p className="text-orange-700 text-sm font-medium">This quote expired on {fmtDate(quote.validUntil)}. Please contact us for a renewed quotation.</p>
          </div>
        )}

        {/* ── Quote Document ───────────────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl print-shadow overflow-hidden print:rounded-none print:shadow-none">

          {/* Header */}
          <div className="bg-[#060E18] px-8 pt-8 pb-6 print:px-6 print:pt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#3CB52A] flex items-center justify-center">
                    <FileText size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-black text-lg leading-none">iTech Network Africa</p>
                    <p className="text-white/40 text-[11px] mt-0.5">Technology Company · Liberia & West Africa</p>
                  </div>
                </div>
                <div className="text-white/40 text-xs space-y-0.5 mt-2">
                  <p className="flex items-center gap-1.5"><MapPin size={10} /> Sinkor, Monrovia, Liberia</p>
                  <p className="flex items-center gap-1.5"><Phone size={10} /> +231 761 978 796</p>
                  <p className="flex items-center gap-1.5"><Mail size={10} /> itechnetworkafrica@gmail.com</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-1">Quotation</div>
                <div className="text-white font-black text-2xl">{quote.ref}</div>
                <div className="mt-2 space-y-1 text-white/40 text-xs">
                  <p>Date: {fmtDate(quote.createdAt)}</p>
                  {quote.validUntil && <p>Valid until: {fmtDate(quote.validUntil)}</p>}
                </div>
                <div className={`mt-3 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusUI.cls}`}>
                  {statusUI.label}
                </div>
              </div>
            </div>
          </div>

          {/* Client info + Title */}
          <div className="px-8 py-6 border-b border-slate-100 print:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Prepared For</p>
                <p className="font-bold text-slate-800 text-base">{quote.clientName}</p>
                {quote.clientCompany && <p className="text-slate-500 text-sm flex items-center gap-1.5 mt-0.5"><Building2 size={12} />{quote.clientCompany}</p>}
                {quote.clientEmail && <p className="text-slate-500 text-sm flex items-center gap-1.5 mt-0.5"><Mail size={12} />{quote.clientEmail}</p>}
                {quote.clientPhone && <p className="text-slate-500 text-sm flex items-center gap-1.5 mt-0.5"><Phone size={12} />{quote.clientPhone}</p>}
                {quote.clientAddress && <p className="text-slate-500 text-sm flex items-center gap-1.5 mt-0.5 leading-snug"><MapPin size={12} className="shrink-0" />{quote.clientAddress}</p>}
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Quote Title</p>
                <p className="font-bold text-slate-800 text-base leading-snug">{quote.title}</p>
                {quote.sentAt && (
                  <p className="text-slate-400 text-xs flex items-center gap-1.5 mt-2">
                    <Calendar size={11} /> Sent on {fmtDate(quote.sentAt)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Line items */}
          <div className="px-8 py-6 print:px-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Services & Pricing</p>
            <div className="rounded-2xl overflow-hidden border border-slate-100 print:border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                    <th className="text-left px-4 py-3">Description</th>
                    <th className="px-3 py-3 text-center w-14">Qty</th>
                    <th className="px-3 py-3 text-center w-20">Unit</th>
                    <th className="px-3 py-3 text-right w-28">Unit Price</th>
                    <th className="px-4 py-3 text-right w-28">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {quote.items.map((item, i) => (
                    <tr key={item.id ?? i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3.5 text-slate-700 font-medium leading-snug">{item.description}</td>
                      <td className="px-3 py-3.5 text-center text-slate-500">{item.quantity}</td>
                      <td className="px-3 py-3.5 text-center text-slate-400 text-xs capitalize">{item.unit}</td>
                      <td className="px-3 py-3.5 text-right text-slate-600">{fmt$(quote.currency, item.unitPrice)}</td>
                      <td className="px-4 py-3.5 text-right font-semibold text-slate-800">{fmt$(quote.currency, Number(item.quantity) * Number(item.unitPrice))}</td>
                    </tr>
                  ))}
                  {quote.items.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-300 text-xs">No line items</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-5 flex justify-end">
              <div className="w-72 space-y-2">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span>{fmt$(quote.currency, quote.subtotal)}</span>
                </div>
                {quote.discountValue > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span>Discount {quote.discountType === 'percent' ? `(${quote.discountValue}%)` : ''}</span>
                    <span>-{fmt$(quote.currency, discountAmount)}</span>
                  </div>
                )}
                {quote.taxRate > 0 && (
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Tax ({quote.taxRate}%)</span>
                    <span>{fmt$(quote.currency, taxAmount)}</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-lg text-slate-800">
                  <span>Total</span>
                  <span className="text-[#3CB52A]">{fmt$(quote.currency, quote.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {quote.notes && (
            <div className="px-8 py-5 border-t border-slate-100 print:px-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Notes</p>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{quote.notes}</p>
            </div>
          )}

          {/* Terms */}
          {quote.terms && (
            <div className="px-8 py-5 border-t border-slate-100 print:px-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Terms & Conditions</p>
              <p className="text-slate-500 text-xs leading-relaxed whitespace-pre-line">{quote.terms}</p>
            </div>
          )}

          {/* Footer */}
          <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 print:px-6 flex items-center justify-between gap-4">
            <p className="text-slate-400 text-xs">
              {quote.validUntil
                ? `This quotation is valid until ${fmtDate(quote.validUntil)}.`
                : 'Contact us to discuss this quote.'}
            </p>
            <p className="text-slate-400 text-xs flex items-center gap-1"><Download size={10} /> {quote.ref}</p>
          </div>

          {/* Print-only accept footer */}
          <div className="hidden print:block px-6 py-4 bg-[#f0fdf4] border-t border-emerald-100">
            <p className="text-emerald-700 text-xs font-medium text-center">
              To accept this quote, visit: {window.location.origin}/quote/{token}
            </p>
          </div>
        </div>

        {/* Contact CTA — not on print */}
        <div className="no-print max-w-3xl mx-auto mt-6 text-center">
          <p className="text-slate-400 text-sm">
            Questions about this quote?{' '}
            <a href={`mailto:itechnetworkafrica@gmail.com?subject=Re: Quote ${quote.ref}&body=Hi iTech Network Africa,%0A%0AI have a question about quotation ${quote.ref}.%0A%0A`}
              className="text-[#3CB52A] font-semibold hover:underline">
              Email us
            </a>
            {' '}or call{' '}
            <a href="tel:+231761978796" className="text-[#3CB52A] font-semibold hover:underline">+231 761 978 796</a>
          </p>
        </div>
      </div>
    </>
  );
}
