import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, Check, X, Clock, Search, RefreshCw,
  ChevronDown, ChevronUp, Building2, Smartphone,
  Mail, Phone, FileText, DollarSign, Calendar, StickyNote,
  AlertCircle, CheckCircle2, Trash2, Filter,
} from 'lucide-react';
import { apiUrl } from '@/lib/apiBase';

/* ─── types ─────────────────────────────────────────────────────────────── */

interface BillingSubmission {
  id: string;
  ref: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  category: string;
  amount: string;
  currency: string;
  method: string;
  transactionId: string;
  paymentDate: string;
  notes: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  adminNotes: string;
  createdAt: string;
}

/* ─── helpers ────────────────────────────────────────────────────────────── */

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  Pending:  { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400'   },
  Verified: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Rejected: { bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-400'     },
};

function timeAgo(iso: string) {
  const diff  = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return 'just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function MethodBadge({ method }: { method: string }) {
  const isBank = method === 'bank_transfer';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${isBank ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
      {isBank ? <Building2 size={10} /> : <Smartphone size={10} />}
      {isBank ? 'Bank Transfer' : 'Mobile Money'}
    </span>
  );
}

/* ─── row component ──────────────────────────────────────────────────────── */

function SubmissionRow({
  s,
  onUpdate,
  onDelete,
}: {
  s: BillingSubmission;
  onUpdate: (id: string, status: string, notes?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [adminNotes, setAdminNotes] = useState(s.adminNotes);
  const [busy, setBusy] = useState(false);
  const st = STATUS_STYLES[s.status] || STATUS_STYLES.Pending;

  async function act(status: string) {
    setBusy(true);
    await onUpdate(s.id, status, adminNotes);
    setBusy(false);
  }

  return (
    <div className={`border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm ${s.status === 'Pending' ? 'ring-1 ring-amber-200' : ''}`}>
      {/* Main row */}
      <div
        className="flex flex-wrap items-center gap-3 px-5 py-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
        onClick={() => setExpanded(v => !v)}
      >
        <span className="font-mono text-[11px] font-bold text-[#3CB52A] bg-[#F0FBF0] px-2 py-0.5 rounded-lg">{s.ref}</span>

        <div className="flex-1 min-w-[160px]">
          <p className="font-semibold text-slate-800 text-sm leading-tight">{s.name}</p>
          <p className="text-slate-400 text-[11px]">{s.email}</p>
        </div>

        <div className="hidden sm:block min-w-[140px]">
          <p className="font-bold text-[#0A1929] text-sm">{s.plan}</p>
          <p className="text-slate-400 text-[11px]">{s.category}</p>
        </div>

        <div className="text-right">
          <p className="font-black text-[#0A1929] text-sm">{s.amount} {s.currency}</p>
          <MethodBadge method={s.method} />
        </div>

        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${st.bg} ${st.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
          {s.status}
        </span>

        <span className="text-slate-400 text-[10px]">{timeAgo(s.createdAt)}</span>

        {expanded ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
      </div>

      {/* Expanded detail */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-100 px-5 py-5 space-y-5">
              {/* Info grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: <FileText size={13} />, label: 'Transaction ID', value: s.transactionId, mono: true },
                  { icon: <DollarSign size={13} />, label: 'Amount Paid', value: `${s.amount} ${s.currency}` },
                  { icon: <Building2 size={13} />, label: 'Method', value: s.method === 'bank_transfer' ? 'Bank Transfer (CDB)' : 'Mobile Money' },
                  { icon: <Calendar size={13} />, label: 'Payment Date', value: s.paymentDate || 'Not provided' },
                  { icon: <Phone size={13} />, label: 'Phone', value: s.phone || 'Not provided' },
                  { icon: <Mail size={13} />, label: 'Email', value: s.email },
                ].map(row => (
                  <div key={row.label} className="bg-slate-50 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      {row.icon}
                      <span className="text-[10px] font-semibold uppercase tracking-wider">{row.label}</span>
                    </div>
                    <p className={`text-sm font-bold text-slate-800 ${row.mono ? 'font-mono' : ''}`}>{row.value}</p>
                  </div>
                ))}
              </div>

              {/* Notes from client */}
              {s.notes && (
                <div className="bg-blue-50 rounded-xl px-4 py-3 flex gap-3">
                  <StickyNote size={13} className="text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">Client Notes</p>
                    <p className="text-sm text-blue-800">{s.notes}</p>
                  </div>
                </div>
              )}

              {/* Admin notes */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Admin Notes (internal)</label>
                <textarea
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  rows={2}
                  placeholder="Add verification notes, discrepancies, or reason for rejection…"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A] resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                {s.status !== 'Verified' && (
                  <button
                    onClick={() => act('Verified')}
                    disabled={busy}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle2 size={14} /> Verify Payment
                  </button>
                )}
                {s.status !== 'Rejected' && (
                  <button
                    onClick={() => act('Rejected')}
                    disabled={busy}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 text-xs font-bold hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    <X size={14} /> Reject
                  </button>
                )}
                {s.status === 'Verified' && (
                  <button
                    onClick={() => act('Pending')}
                    disabled={busy}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold hover:bg-amber-100 transition-colors disabled:opacity-50"
                  >
                    <Clock size={14} /> Reset to Pending
                  </button>
                )}
                <button
                  onClick={() => act(s.status)} // save notes only
                  disabled={busy}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  <Check size={14} /> Save Notes
                </button>
                <button
                  onClick={() => onDelete(s.id)}
                  disabled={busy}
                  className="ml-auto flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-400 text-xs font-bold hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── main section ───────────────────────────────────────────────────────── */

export function BillingSection() {
  const [submissions, setSubmissions] = useState<BillingSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Verified' | 'Rejected'>('All');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await fetch(apiUrl('/api/admin/billing'), { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json() as BillingSubmission[];
      setSubmissions(data);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function onUpdate(id: string, status: string, notes?: string) {
    await fetch(apiUrl(`/api/admin/billing/${id}`), {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminNotes: notes ?? '' }),
    });
    await load();
  }

  async function onDelete(id: string) {
    if (!confirm('Delete this payment submission? This cannot be undone.')) return;
    await fetch(apiUrl(`/api/admin/billing/${id}`), { method: 'DELETE', credentials: 'include' });
    await load();
  }

  const pending  = submissions.filter(s => s.status === 'Pending').length;
  const verified = submissions.filter(s => s.status === 'Verified').length;

  const filtered = submissions.filter(s => {
    if (filter !== 'All' && s.status !== filter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.ref.toLowerCase().includes(q) ||
      s.plan.toLowerCase().includes(q) ||
      s.transactionId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <CreditCard size={20} className="text-[#3CB52A]" /> Payment Verifications
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">Review and verify client deposit submissions from the public billing page.</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending Review', value: pending, color: 'text-amber-600', bg: 'bg-amber-50', icon: <Clock size={16} /> },
          { label: 'Verified', value: verified, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <CheckCircle2 size={16} /> },
          { label: 'Total', value: submissions.length, color: 'text-slate-600', bg: 'bg-slate-50', icon: <CreditCard size={16} /> },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 flex items-center gap-3`}>
            <span className={s.color}>{s.icon}</span>
            <div>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs font-medium text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Alert for pending */}
      {pending > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-amber-800 text-sm">
            <strong>{pending} payment{pending !== 1 ? 's' : ''}</strong> waiting for verification. Click each row to expand and verify.
          </p>
        </div>
      )}

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, ref, plan or transaction ID…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A]"
          />
        </div>
        <div className="flex gap-1.5">
          {(['All', 'Pending', 'Verified', 'Rejected'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${filter === f ? 'bg-[#0A1929] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center gap-3 text-slate-400">
          <RefreshCw size={24} className="animate-spin" />
          <p className="text-sm">Loading submissions…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 flex flex-col items-center gap-3 text-slate-400">
          <CreditCard size={32} className="opacity-30" />
          <p className="text-sm font-semibold">{search || filter !== 'All' ? 'No matching submissions' : 'No payment submissions yet'}</p>
          <p className="text-xs text-slate-300">Submissions from the public billing page will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(s => (
            <SubmissionRow key={s.id} s={s} onUpdate={onUpdate} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
