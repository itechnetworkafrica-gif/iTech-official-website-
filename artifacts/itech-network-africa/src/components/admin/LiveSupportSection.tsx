import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Headset, Send, RefreshCw, X, Plus, UserCheck, UserX, ChevronLeft,
  Clock, CheckCircle2, AlertCircle, Users, Mail, Phone, Lock, Eye, EyeOff,
} from 'lucide-react';
import { apiUrl } from '@/lib/apiBase';

/* ─── Types ─── */
interface LiveSession {
  id: string;
  visitorName: string;
  visitorEmail: string;
  topic: string;
  status: 'waiting' | 'active' | 'closed';
  agentId: string | null;
  agentName: string | null;
  createdAt: string;
  updatedAt: string;
  lastMessage: string;
  visitorMessages: number;
}
interface LiveMessage {
  id: number;
  sender: 'visitor' | 'agent' | 'system';
  senderName: string;
  text: string;
  createdAt: string;
}
interface Agent {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  permissions: string[] | null; // null = full access
  online?: boolean;
  lastSeenAt?: string | null;
}

/* Dashboard sections a team member can be granted access to */
const PERMISSION_OPTIONS = [
  { id: 'overview',      label: 'Overview' },
  { id: 'invoices',      label: 'Invoices' },
  { id: 'support',       label: 'Support' },
  { id: 'livechat',      label: 'Live Chat' },
  { id: 'clients',       label: 'Clients' },
  { id: 'partnerships',  label: 'Partnerships' },
  { id: 'team',          label: 'Team' },
  { id: 'announcements', label: 'Announcements' },
  { id: 'reports',       label: 'Reports' },
  { id: 'files',         label: 'Files' },
  { id: 'settings',      label: 'Settings' },
];

function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

const api = (path: string, init?: RequestInit) =>
  fetch(apiUrl(path), { credentials: 'include', ...init });

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  waiting: { bg: 'bg-amber-50',   text: 'text-amber-700',   label: 'Waiting' },
  active:  { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Active'  },
  closed:  { bg: 'bg-slate-100',  text: 'text-slate-500',   label: 'Closed'  },
};

/* ═══════════════════════════════════════════════
   LIVE CHAT SECTION
   ═══════════════════════════════════════════════ */
export function LiveChatSection() {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [agents, setAgents]     = useState<Agent[]>([]);
  const [me, setMe]             = useState<{ id: string; permissions: string[] | null } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [session, setSession]   = useState<LiveSession | null>(null);
  const [reply, setReply]       = useState('');
  const [sending, setSending]   = useState(false);
  const [filter, setFilter]     = useState<'All' | 'waiting' | 'active' | 'closed'>('All');
  const msgEndRef               = useRef<HTMLDivElement>(null);
  const lastIdRef               = useRef(0);
  const prevWaitingRef          = useRef(0);
  const detailInFlightRef       = useRef(false);

  const loadSessions = useCallback(async () => {
    try {
      const res = await api('/api/admin/live-chats');
      if (!res.ok) return;
      const data = await res.json() as LiveSession[];
      setSessions(data);
      const waiting = data.filter(s => s.status === 'waiting').length;
      prevWaitingRef.current = waiting;
    } catch { /* keep last state */ }
  }, []);

  const loadDetail = useCallback(async (id: string, reset: boolean) => {
    if (detailInFlightRef.current) return; // avoid overlapping polls duplicating messages
    detailInFlightRef.current = true;
    try {
      const after = reset ? 0 : lastIdRef.current;
      const res = await api(`/api/admin/live-chats/${id}?after=${after}`);
      if (!res.ok) return;
      const data = await res.json() as { session: LiveSession; messages: LiveMessage[] };
      setSession(prev => ({ ...(prev || data.session), ...data.session } as LiveSession));
      if (data.messages.length > 0) {
        lastIdRef.current = Math.max(lastIdRef.current, data.messages[data.messages.length - 1].id);
        setMessages(prev => {
          if (reset) return data.messages;
          const seen = new Set(prev.map(m => m.id));
          const fresh = data.messages.filter(m => !seen.has(m.id));
          return fresh.length > 0 ? [...prev, ...fresh] : prev;
        });
      } else if (reset) {
        setMessages([]);
      }
    } catch { /* keep last state */ }
    finally { detailInFlightRef.current = false; }
  }, []);

  /* Poll session list */
  useEffect(() => {
    loadSessions();
    api('/api/auth/me').then(r => r.ok ? r.json() : null)
      .then(d => d?.user && setMe({ id: d.user.id, permissions: Array.isArray(d.user.permissions) ? d.user.permissions : null }))
      .catch(() => {});
    const loadAgents = () => api('/api/admin/agents').then(r => r.ok ? r.json() : []).then(setAgents).catch(() => {});
    loadAgents();
    const id = setInterval(loadSessions, 5000);
    const agentsId = setInterval(loadAgents, 20000); // keep online status fresh
    return () => { clearInterval(id); clearInterval(agentsId); };
  }, [loadSessions]);

  /* Poll selected conversation */
  useEffect(() => {
    if (!selected) return;
    lastIdRef.current = 0;
    setSession(null);
    loadDetail(selected, true);
    const id = setInterval(() => loadDetail(selected, false), 3000);
    return () => clearInterval(id);
  }, [selected, loadDetail]);

  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function sendReply() {
    if (!reply.trim() || !selected || sending) return;
    setSending(true);
    try {
      const res = await api(`/api/admin/live-chats/${selected}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: reply.trim() }),
      });
      if (res.ok) {
        setReply('');
        await loadDetail(selected, false);
        loadSessions();
      } else {
        const data = await res.json().catch(() => ({} as { error?: string }));
        alert(data.error || 'Could not send the reply.');
        await loadDetail(selected, false);
      }
    } finally { setSending(false); }
  }

  async function assign(agentId: string) {
    if (!selected || !agentId) return;
    const res = await api(`/api/admin/live-chats/${selected}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({} as { error?: string }));
      alert(data.error || 'Could not assign the agent.');
    }
    await loadDetail(selected, false);
    loadSessions();
  }

  async function closeChat() {
    if (!selected) return;
    await api(`/api/admin/live-chats/${selected}/close`, { method: 'POST' });
    await loadDetail(selected, false);
    loadSessions();
  }

  const filtered = filter === 'All' ? sessions : sessions.filter(s => s.status === filter);
  const waitingCount = sessions.filter(s => s.status === 'waiting').length;
  const activeAgents = agents.filter(a => a.isActive);
  const isFullAdmin = me != null && me.permissions == null;
  // Team members can only reply once an admin has assigned the chat to them
  const canReply = session != null && (isFullAdmin || (me != null && session.agentId === me.id));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">Live Support</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {waitingCount > 0
              ? <span className="text-amber-600 font-semibold">{waitingCount} visitor{waitingCount > 1 ? 's' : ''} waiting for an agent</span>
              : 'Real-time chats from website visitors'}
          </p>
        </div>
        <button onClick={loadSessions} className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700"><RefreshCw size={15} /></button>
      </div>

      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit flex-wrap">
        {(['All', 'waiting', 'active', 'closed'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${filter === f ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {f} <span className="opacity-60">({f === 'All' ? sessions.length : sessions.filter(s => s.status === f).length})</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:h-[600px]">
        {/* Session list — hidden on mobile when a chat is open */}
        <div className={`${selected ? 'hidden lg:flex' : 'flex'} w-full lg:w-80 shrink-0 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex-col h-[480px] lg:h-auto`}>
          <div className="p-3 border-b border-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider">Conversations ({filtered.length})</div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {filtered.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-sm px-4">
                <Headset size={28} className="mx-auto mb-2 text-slate-200" />
                No live chats yet. When a visitor asks Sarah for a human agent, the request appears here.
              </div>
            )}
            {filtered.map(s => {
              const st = STATUS_STYLE[s.status];
              return (
                <button key={s.id} onClick={() => setSelected(s.id)}
                  className={`w-full text-left px-4 py-3.5 hover:bg-slate-50 transition-colors ${selected === s.id ? 'bg-[#f0fdf4] lg:border-r-2 border-[#3CB52A]' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-sm text-slate-800 truncate flex-1">{s.visitorName}</span>
                    {s.status === 'waiting' && <span className="shrink-0 w-2 h-2 mt-1.5 rounded-full bg-amber-400 animate-pulse" />}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 truncate">{s.lastMessage || 'New request'}</div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.bg} ${st.text}`}>{st.label}</span>
                    {s.agentName && <span className="text-[10px] text-slate-400 truncate">{s.agentName}</span>}
                    <span className="text-[10px] text-slate-300 ml-auto">{timeAgo(s.updatedAt)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conversation pane */}
        <div className={`${selected ? 'flex' : 'hidden lg:flex'} flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm flex-col overflow-hidden h-[70vh] lg:h-auto`}>
          {!selected || !session ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 p-6 text-center">
              <Headset size={40} className="mb-3" />
              <p className="text-sm font-semibold">Select a conversation to join</p>
            </div>
          ) : (
            <>
              <div className="px-4 lg:px-5 py-3 lg:py-4 border-b border-slate-100 flex flex-wrap items-center gap-2 lg:gap-3">
                <button onClick={() => setSelected(null)} className="lg:hidden w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 shrink-0"><ChevronLeft size={18} /></button>
                <div className="min-w-0 flex-1">
                  <div className="font-black text-slate-900 truncate">{session.visitorName}</div>
                  <div className="text-xs text-slate-400 truncate">
                    {session.visitorEmail || 'No email'} {session.topic && `· from ${session.topic}`}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                  {isFullAdmin ? (
                    <select
                      value={session.agentId || ''}
                      onChange={e => assign(e.target.value)}
                      disabled={session.status === 'closed'}
                      className="text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#3CB52A] bg-white text-slate-700 disabled:opacity-50 max-w-[150px]">
                      <option value="">Assign member…</option>
                      {activeAgents.map(a => <option key={a.id} value={a.id}>{a.online ? '🟢' : '⚪'} {a.name}{a.online ? ' — online' : ' — offline'}</option>)}
                    </select>
                  ) : (
                    session.agentName && <span className="text-xs font-bold px-2.5 py-1.5 rounded-xl bg-slate-50 text-slate-500">Assigned: {session.agentName}</span>
                  )}
                  {session.status !== 'closed' && (
                    <button onClick={closeChat} className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 transition-colors">End chat</button>
                  )}
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${STATUS_STYLE[session.status].bg} ${STATUS_STYLE[session.status].text}`}>{STATUS_STYLE[session.status].label}</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 lg:p-5 space-y-3">
                {messages.map(m => m.sender === 'system' ? (
                  <div key={m.id} className="text-center">
                    <span className="inline-block text-[11px] text-slate-400 bg-slate-50 rounded-full px-3 py-1 whitespace-pre-wrap text-left">{m.text}</span>
                  </div>
                ) : (
                  <div key={m.id} className={`flex ${m.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${m.sender === 'agent' ? 'bg-[#0A1929] text-white rounded-br-md' : 'bg-slate-100 text-slate-800 rounded-bl-md'}`}>
                      <div className="text-[11px] font-bold mb-1 opacity-60">{m.senderName}</div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{m.text}</p>
                      <div className="text-[10px] mt-1.5 opacity-40 text-right">{timeAgo(m.createdAt)}</div>
                    </div>
                  </div>
                ))}
                <div ref={msgEndRef} />
              </div>

              {session.status !== 'closed' && (
                canReply ? (
                  <div className="px-3 lg:px-5 py-3 border-t border-slate-100 flex gap-2 items-end">
                    <textarea value={reply} onChange={e => setReply(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                      rows={2} placeholder="Reply as support agent… (Enter to send)"
                      className="flex-1 resize-none text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#3CB52A] transition-colors min-w-0" />
                    <button onClick={sendReply} disabled={!reply.trim() || sending}
                      className="w-10 h-10 rounded-xl bg-[#3CB52A] hover:bg-[#2e911f] flex items-center justify-center text-white disabled:opacity-40 transition-colors shrink-0"><Send size={16} /></button>
                  </div>
                ) : (
                  <div className="px-3 lg:px-5 py-4 border-t border-slate-100 text-center text-xs text-slate-400 bg-slate-50">
                    {session.agentId
                      ? <>This chat is assigned to <span className="font-bold text-slate-500">{session.agentName}</span>. Ask an admin to reassign it to you to reply.</>
                      : 'Waiting for an admin to assign this chat to a team member before replies can be sent.'}
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TEAM (AGENTS) SECTION
   ═══════════════════════════════════════════════ */
export function TeamSection() {
  const [agents, setAgents]   = useState<Agent[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [busy, setBusy]       = useState(false);
  const [err, setErr]         = useState('');
  const [form, setForm]       = useState({ name: '', email: '', password: '', role: 'Support Agent', phone: '' });
  const [showPw, setShowPw]   = useState(false);
  const [fullAccess, setFullAccess] = useState(false);
  const [perms, setPerms]     = useState<string[]>(['livechat', 'support']);
  const [editAgent, setEditAgent] = useState<Agent | null>(null);
  const [editFull, setEditFull]   = useState(false);
  const [editPerms, setEditPerms] = useState<string[]>([]);

  const togglePerm = (list: string[], set: (v: string[]) => void, id: string) =>
    set(list.includes(id) ? list.filter(p => p !== id) : [...list, id]);

  const load = useCallback(() => {
    api('/api/admin/agents').then(r => r.ok ? r.json() : []).then(setAgents).catch(() => {});
  }, []);
  useEffect(() => {
    load();
    const id = setInterval(load, 20000); // keep online status fresh
    return () => clearInterval(id);
  }, [load]);

  async function addAgent(e: React.FormEvent) {
    e.preventDefault(); setErr('');
    if (!form.name.trim() || !form.email.trim() || !form.password) { setErr('Name, email, and password are required.'); return; }
    if (form.password.length < 8) { setErr('Password must be at least 8 characters.'); return; }
    if (!fullAccess && perms.length === 0) { setErr('Select at least one section, or grant full access.'); return; }
    setBusy(true);
    try {
      const res = await api('/api/admin/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, permissions: fullAccess ? null : perms }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error || 'Could not add agent.'); return; }
      setShowAdd(false);
      setForm({ name: '', email: '', password: '', role: 'Support Agent', phone: '' });
      setFullAccess(false); setPerms(['livechat', 'support']);
      load();
    } catch { setErr('Connection error. Please try again.'); }
    finally { setBusy(false); }
  }

  async function toggleActive(agent: Agent) {
    const res = await api(`/api/admin/agents/${agent.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !agent.isActive }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Could not update agent.');
    }
    load();
  }

  function openEditAccess(agent: Agent) {
    setEditAgent(agent);
    setEditFull(agent.permissions == null);
    setEditPerms(agent.permissions ?? []);
    setErr('');
  }

  async function saveAccess(e: React.FormEvent) {
    e.preventDefault();
    if (!editAgent) return;
    if (!editFull && editPerms.length === 0) { setErr('Select at least one section, or grant full access.'); return; }
    setBusy(true);
    try {
      const res = await api(`/api/admin/agents/${editAgent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions: editFull ? null : editPerms }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setErr(data.error || 'Could not update access.'); return; }
      setEditAgent(null);
      load();
    } catch { setErr('Connection error. Please try again.'); }
    finally { setBusy(false); }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">Team Agents</h2>
          <p className="text-sm text-slate-400 mt-0.5">Agents sign in at <span className="font-mono text-slate-500">/admin</span> to answer live chats and tickets</p>
        </div>
        <button onClick={() => { setShowAdd(true); setErr(''); }}
          className="flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2e911f] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors">
          <Plus size={15} /> Add Agent
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {agents.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 text-sm bg-white rounded-2xl border border-slate-100">
            <Users size={28} className="mx-auto mb-2 text-slate-200" /> No team agents yet.
          </div>
        )}
        {agents.map(a => (
          <div key={a.id} className={`bg-white rounded-2xl border shadow-sm p-5 ${a.isActive ? 'border-slate-100' : 'border-slate-100 opacity-60'}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-10 h-10 rounded-xl bg-[#f0fdf4] flex items-center justify-center shrink-0">
                  <Headset size={17} className="text-[#3CB52A]" />
                  <span
                    title={a.online ? 'Online now' : 'Offline'}
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${a.online ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 truncate">{a.name}</div>
                  <div className="text-xs text-slate-400 truncate">
                    {a.role} · {a.online ? <span className="text-emerald-600 font-semibold">Online</span> : 'Offline'}
                  </div>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${a.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                {a.isActive ? 'Active' : 'Disabled'}
              </span>
            </div>
            <div className="mt-4 space-y-1.5 text-xs text-slate-500">
              <div className="flex items-center gap-2 truncate"><Mail size={12} className="text-slate-300 shrink-0" /> {a.email}</div>
              {a.phone && <div className="flex items-center gap-2"><Phone size={12} className="text-slate-300 shrink-0" /> {a.phone}</div>}
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {a.permissions == null ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0A1929] text-white">Full access</span>
              ) : a.permissions.length === 0 ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">No access</span>
              ) : (
                a.permissions.map(p => (
                  <span key={p} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {PERMISSION_OPTIONS.find(o => o.id === p)?.label ?? p}
                  </span>
                ))
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 flex flex-wrap gap-2">
              <button onClick={() => toggleActive(a)}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors ${a.isActive ? 'bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-600' : 'bg-[#f0fdf4] text-[#3CB52A] hover:bg-[#3CB52A] hover:text-white'}`}>
                {a.isActive ? <><UserX size={13} /> Disable access</> : <><UserCheck size={13} /> Re-enable</>}
              </button>
              <button onClick={() => openEditAccess(a)}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-50 text-slate-500 hover:bg-[#f0fdf4] hover:text-[#3CB52A] transition-colors">
                <Lock size={12} /> Edit access
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add agent modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl my-6">
              <div className="flex items-center justify-between px-6 pt-5">
                <h3 className="font-black text-slate-900">Add Team Agent</h3>
                <button onClick={() => setShowAdd(false)} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400"><X size={16} /></button>
              </div>
              <form onSubmit={addAgent} className="p-6 pt-4 space-y-4">
                {err && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl"><AlertCircle size={14} className="shrink-0" /> {err}</div>}
                <div><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Full name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. James O." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A]" /></div>
                <div><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="agent@itechnetworkafrica.com" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A]" /></div>
                <div><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Password * <span className="normal-case text-slate-400">(min 8 chars)</span></label>
                  <div className="relative">
                    <Lock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Temporary password" className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A]" />
                    <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">{showPw ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                  </div></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Role</label>
                    <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A] bg-white">
                      {['Support Agent', 'Senior Agent', 'Team Lead', 'Administrator'].map(r => <option key={r}>{r}</option>)}
                    </select></div>
                  <div><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Phone</label>
                    <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+231…" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3CB52A]" /></div>
                </div>
                {/* Access permissions */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Dashboard access</label>
                  <label className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-200 cursor-pointer mb-2">
                    <input type="checkbox" checked={fullAccess} onChange={e => setFullAccess(e.target.checked)} className="accent-[#3CB52A]" />
                    <span className="text-sm font-semibold text-slate-700">Full access (entire admin dashboard)</span>
                  </label>
                  {!fullAccess && (
                    <div className="grid grid-cols-2 gap-1.5">
                      {PERMISSION_OPTIONS.map(o => (
                        <label key={o.id} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${perms.includes(o.id) ? 'border-[#3CB52A] bg-[#f0fdf4] text-[#3CB52A]' : 'border-slate-200 text-slate-500'}`}>
                          <input type="checkbox" checked={perms.includes(o.id)} onChange={() => togglePerm(perms, setPerms, o.id)} className="accent-[#3CB52A]" />
                          {o.label}
                        </label>
                      ))}
                    </div>
                  )}
                  <p className="text-[11px] text-slate-400 mt-1.5">They will only see the sections you select here.</p>
                </div>
                <button type="submit" disabled={busy} className="w-full py-3 rounded-xl bg-[#3CB52A] hover:bg-[#2e911f] text-white text-sm font-bold disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                  {busy ? 'Adding…' : <><Plus size={15} /> Add Agent</>}
                </button>
                <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1"><Clock size={11} /> The agent can sign in right away at /admin with these credentials.</p>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit access modal */}
      <AnimatePresence>
        {editAgent && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl my-6">
              <div className="flex items-center justify-between px-6 pt-5">
                <h3 className="font-black text-slate-900">Access for {editAgent.name}</h3>
                <button onClick={() => setEditAgent(null)} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400"><X size={16} /></button>
              </div>
              <form onSubmit={saveAccess} className="p-6 pt-4 space-y-4">
                {err && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl"><AlertCircle size={14} className="shrink-0" /> {err}</div>}
                <label className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-200 cursor-pointer">
                  <input type="checkbox" checked={editFull} onChange={e => setEditFull(e.target.checked)} className="accent-[#3CB52A]" />
                  <span className="text-sm font-semibold text-slate-700">Full access (entire admin dashboard)</span>
                </label>
                {!editFull && (
                  <div className="grid grid-cols-2 gap-1.5">
                    {PERMISSION_OPTIONS.map(o => (
                      <label key={o.id} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${editPerms.includes(o.id) ? 'border-[#3CB52A] bg-[#f0fdf4] text-[#3CB52A]' : 'border-slate-200 text-slate-500'}`}>
                        <input type="checkbox" checked={editPerms.includes(o.id)} onChange={() => togglePerm(editPerms, setEditPerms, o.id)} className="accent-[#3CB52A]" />
                        {o.label}
                      </label>
                    ))}
                  </div>
                )}
                <button type="submit" disabled={busy} className="w-full py-3 rounded-xl bg-[#3CB52A] hover:bg-[#2e911f] text-white text-sm font-bold disabled:opacity-50 transition-colors">
                  {busy ? 'Saving…' : 'Save Access'}
                </button>
                <p className="text-[11px] text-slate-400 text-center">Changes apply the next time they load the dashboard.</p>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
