import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, X, MessageSquare, CreditCard, Megaphone,
  Handshake, Activity, CheckCircle2, BellOff, BellRing, Trash2,
} from 'lucide-react';
import type { PortalNotif, NotifType, UsePortalNotificationsReturn } from '@/hooks/usePortalNotifications';

/* ─── helpers ────────────────────────────────────────────────────────────── */

function typeIcon(type: NotifType) {
  switch (type) {
    case 'ticket':       return <MessageSquare size={14} className="text-blue-400" />;
    case 'chat':         return <Activity      size={14} className="text-green-400" />;
    case 'partnership':  return <Handshake     size={14} className="text-purple-400" />;
    case 'invoice':      return <CreditCard    size={14} className="text-amber-400" />;
    case 'announcement': return <Megaphone     size={14} className="text-sky-400" />;
    case 'status':       return <CheckCircle2  size={14} className="text-emerald-400" />;
  }
}

function typeBg(type: NotifType) {
  switch (type) {
    case 'ticket':       return 'bg-blue-500/15';
    case 'chat':         return 'bg-green-500/15';
    case 'partnership':  return 'bg-purple-500/15';
    case 'invoice':      return 'bg-amber-500/15';
    case 'announcement': return 'bg-sky-500/15';
    case 'status':       return 'bg-emerald-500/15';
  }
}

function timeAgoShort(iso: string): string {
  const diff  = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return 'just now';
  if (mins  < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

/* ─── NotificationBell ───────────────────────────────────────────────────── */

interface Props {
  hook: UsePortalNotificationsReturn;
  onNavigate?: (section: string) => void;
  /** Dark header vs light header */
  dark?: boolean;
}

export function NotificationBell({ hook, onNavigate, dark = true }: Props) {
  const { notifications, unreadCount, permission, requestPermission, markRead, markAllRead, clearAll } = hook;
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Mark visible items read when panel opens
  useEffect(() => {
    if (!open || unreadCount === 0) return;
    // small delay so user sees the unread state briefly
    const t = setTimeout(markAllRead, 1200);
    return () => clearTimeout(t);
  }, [open, unreadCount, markAllRead]);

  const btnBase = dark
    ? 'text-white/60 hover:text-white hover:bg-white/10'
    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100';

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(v => !v)}
        className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${btnBase}`}
        title="Notifications"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        {/* Shake animation when there are unread */}
        <motion.span
          animate={unreadCount > 0 ? { rotate: [0, -15, 15, -12, 12, -6, 6, 0] } : {}}
          transition={{ duration: 0.6, repeat: unreadCount > 0 ? Infinity : 0, repeatDelay: 3 }}
          className="flex"
        >
          <Bell size={18} />
        </motion.span>

        {/* Unread badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center leading-none"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-11 w-[340px] bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-[#0A1929]">
              <div className="flex items-center gap-2">
                <BellRing size={15} className="text-[#3CB52A]" />
                <span className="text-white font-bold text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-black">{unreadCount}</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {notifications.length > 0 && (
                  <button onClick={clearAll} title="Clear all" className="w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-red-400 hover:bg-white/10 transition-colors">
                    <Trash2 size={13} />
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Permission prompt */}
            {permission !== 'granted' && permission !== 'unsupported' && (
              <div className="px-4 py-3 bg-amber-50 border-b border-amber-100 flex items-start gap-3">
                <BellOff size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-amber-800">Allow desktop notifications</p>
                  <p className="text-[11px] text-amber-600 mt-0.5 leading-relaxed">Get alerts on your screen even when you're in another tab.</p>
                </div>
                <button
                  onClick={requestPermission}
                  className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-amber-500 text-white text-[11px] font-bold hover:bg-amber-600 transition-colors"
                >
                  Enable
                </button>
              </div>
            )}

            {/* Notification list */}
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-12 flex flex-col items-center gap-3 text-slate-400">
                  <Bell size={28} className="opacity-30" />
                  <p className="text-sm font-medium">No notifications yet</p>
                  <p className="text-xs text-slate-300">New activity will appear here</p>
                </div>
              ) : (
                <div>
                  {notifications.map((n: PortalNotif, i: number) => (
                    <NotifRow
                      key={n.id}
                      notif={n}
                      isLast={i === notifications.length - 1}
                      onClick={() => {
                        markRead(n.id);
                        if (n.section && onNavigate) onNavigate(n.section);
                        setOpen(false);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50">
                <button onClick={markAllRead} className="text-[11px] font-semibold text-[#3CB52A] hover:text-[#2da822] transition-colors">
                  Mark all as read
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NotifRow({ notif, isLast, onClick }: { notif: PortalNotif; isLast: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${!isLast ? 'border-b border-slate-50' : ''} ${!notif.read ? 'bg-blue-50/40' : ''}`}
    >
      {/* Icon */}
      <span className={`flex-shrink-0 w-7 h-7 rounded-lg ${typeBg(notif.type)} flex items-center justify-center mt-0.5`}>
        {typeIcon(notif.type)}
      </span>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className={`text-[13px] leading-snug ${notif.read ? 'font-medium text-slate-600' : 'font-bold text-slate-800'}`}>
          {notif.title}
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed line-clamp-2">{notif.body}</p>
      </div>

      {/* Time + unread dot */}
      <div className="flex-shrink-0 flex flex-col items-end gap-1.5 pt-0.5">
        <span className="text-[10px] text-slate-400">{timeAgoShort(notif.ts)}</span>
        {!notif.read && <span className="w-2 h-2 rounded-full bg-blue-500" />}
      </div>
    </button>
  );
}
