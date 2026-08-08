import React, { useState, useEffect, useCallback } from 'react';
import { Handshake, RefreshCw, Loader2, Globe, Mail, Phone, MapPin, X } from 'lucide-react';
import { apiUrl } from '@/lib/apiBase';

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  organisation: string;
  website: string;
  country: string;
  partnershipType: string;
  message: string;
  status: string;
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
}

const api = (path: string, init?: RequestInit) =>
  fetch(apiUrl(path), { credentials: 'include', ...init });

const STATUSES = ['New', 'In Review', 'Approved', 'Declined'];

const STATUS_STYLE: Record<string, string> = {
  'New':       'bg-blue-50 text-blue-700',
  'In Review': 'bg-amber-50 text-amber-700',
  'Approved':  'bg-emerald-50 text-emerald-700',
  'Declined':  'bg-rose-50 text-rose-600',
};

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function PartnershipsSection() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'All' | string>('All');
  const [selected, setSelected] = useState<Application | null>(null);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await api('/api/admin/partnerships');
      if (!res.ok) {
        setError(res.status === 403 ? "You don't have access to partnerships." : 'Failed to load applications.');
        return;
      }
      setApps(await res.json() as Application[]);
      setError('');
    } catch {
      setError('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); const id = setInterval(load, 30000); return () => clearInterval(id); }, [load]);

  async function updateStatus(id: string, status: string) {
    const res = await api(`/api/admin/partnerships/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json() as Application;
      setApps(prev => prev.map(a => a.id === id ? updated : a));
      setSelected(prev => (prev && prev.id === id ? updated : prev));
    }
  }

  async function saveNotes() {
    if (!selected) return;
    setSavingNotes(true);
    try {
      const res = await api(`/api/admin/partnerships/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes: notes }),
      });
      if (res.ok) {
        const updated = await res.json() as Application;
        setApps(prev => prev.map(a => a.id === updated.id ? updated : a));
        setSelected(updated);
      }
    } finally {
      setSavingNotes(false);
    }
  }

  const shown = filter === 'All' ? apps : apps.filter(a => a.status === filter);
  const counts = STATUSES.reduce<Record<string, number>>((m, s) => {
    m[s] = apps.filter(a => a.status === s).length; return m;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Handshake size={22} className="text-[#3CB52A]" /> Partnership Applications
          </h2>
          <p className="text-sm text-slate-500">Submissions from the public Partner With Us page.</p>
        </div>
        <button
          onClick={() => { setLoading(true); load(); }}
          className="flex items-center gap-2 text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['All', ...STATUSES] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filter === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {s}{s !== 'All' ? ` (${counts[s] ?? 0})` : ` (${apps.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-500 py-12 justify-center">
          <Loader2 size={18} className="animate-spin" /> Loading applications…
        </div>
      ) : error ? (
        <div className="text-rose-600 bg-rose-50 rounded-lg p-4 text-sm">{error}</div>
      ) : shown.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Handshake size={36} className="mx-auto mb-3 opacity-40" />
          No partnership applications{filter !== 'All' ? ` with status "${filter}"` : ' yet'}.
        </div>
      ) : (
        <div className="grid gap-3">
          {shown.map(a => (
            <button
              key={a.id}
              onClick={() => { setSelected(a); setNotes(a.adminNotes); }}
              className="text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-[#3CB52A]/50 hover:shadow-sm transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold text-slate-900">{a.organisation}</div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLE[a.status] ?? 'bg-slate-100 text-slate-500'}`}>
                  {a.status}
                </span>
              </div>
              <div className="text-sm text-slate-500 mt-1">
                {a.name} · {a.partnershipType}{a.country ? ` · ${a.country}` : ''} · {fmtDate(a.createdAt)}
              </div>
              <div className="text-sm text-slate-600 mt-2 line-clamp-2">{a.message}</div>
            </button>
          ))}
        </div>
      )}

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-6" onClick={() => setSelected(null)}>
          <div
            className="bg-white w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl p-6 space-y-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selected.organisation}</h3>
                <p className="text-sm text-slate-500">{selected.partnershipType} · Applied {fmtDate(selected.createdAt)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-slate-700"><Mail size={15} className="text-slate-400" /> <a className="hover:underline" href={`mailto:${selected.email}`}>{selected.email}</a></div>
              {selected.phone && <div className="flex items-center gap-2 text-slate-700"><Phone size={15} className="text-slate-400" /> {selected.phone}</div>}
              {selected.website && <div className="flex items-center gap-2 text-slate-700"><Globe size={15} className="text-slate-400" /> <a className="hover:underline" href={selected.website.startsWith('http') ? selected.website : `https://${selected.website}`} target="_blank" rel="noreferrer">{selected.website}</a></div>}
              {selected.country && <div className="flex items-center gap-2 text-slate-700"><MapPin size={15} className="text-slate-400" /> {selected.country}</div>}
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Contact person</div>
              <div className="text-slate-800">{selected.name}</div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Proposal / Profile</div>
              <div className="text-slate-700 whitespace-pre-wrap text-sm bg-slate-50 rounded-lg p-4">{selected.message}</div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Status</div>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map(s => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selected.id, s)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      selected.status === s
                        ? `${STATUS_STYLE[s]} border-transparent ring-1 ring-slate-300`
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Internal notes</div>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder="Notes visible only to the team…"
                className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3CB52A]/40"
              />
              <button
                onClick={saveNotes}
                disabled={savingNotes}
                className="mt-2 bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-60 flex items-center gap-2"
              >
                {savingNotes && <Loader2 size={14} className="animate-spin" />} Save notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
