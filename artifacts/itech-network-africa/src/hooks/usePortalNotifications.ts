import { useState, useCallback, useRef } from 'react';
import { playNotificationSound } from '@/lib/portalData';

export type NotifType = 'ticket' | 'chat' | 'partnership' | 'invoice' | 'announcement' | 'status';

export interface PortalNotif {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  ts: string;     // ISO
  read: boolean;
  section?: string; // optional portal section to navigate to
}

export interface UsePortalNotificationsReturn {
  notifications: PortalNotif[];
  unreadCount: number;
  permission: NotificationPermission | 'unsupported';
  requestPermission: () => Promise<void>;
  notify: (opts: {
    type: NotifType;
    title: string;
    body: string;
    sound?: Parameters<typeof playNotificationSound>[0];
    section?: string;
    onClick?: () => void;
  }) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

function supportsNotifications() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

function getPermission(): NotificationPermission | 'unsupported' {
  if (!supportsNotifications()) return 'unsupported';
  return Notification.permission;
}

let notifIdCounter = 0;
function newId() { return `n-${Date.now()}-${++notifIdCounter}`; }

export function usePortalNotifications(): UsePortalNotificationsReturn {
  const [notifications, setNotifications] = useState<PortalNotif[]>([]);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(getPermission);

  // Keep latest onClick handlers accessible without stale closures
  const clickHandlers = useRef<Record<string, () => void>>({});

  const requestPermission = useCallback(async () => {
    if (!supportsNotifications()) return;
    const result = await Notification.requestPermission();
    setPermission(result);
  }, []);

  const notify = useCallback((opts: {
    type: NotifType;
    title: string;
    body: string;
    sound?: Parameters<typeof playNotificationSound>[0];
    section?: string;
    onClick?: () => void;
  }) => {
    const id = newId();
    const notif: PortalNotif = {
      id,
      type: opts.type,
      title: opts.title,
      body: opts.body,
      ts: new Date().toISOString(),
      read: false,
      section: opts.section,
    };

    // Add to in-app list (cap at 30)
    setNotifications(prev => [notif, ...prev].slice(0, 30));

    // Play sound
    playNotificationSound(opts.sound ?? (opts.type === 'invoice' ? 'invoice' : 'message'));

    // Fire OS-level browser notification if permitted
    const perm = getPermission();
    if (perm === 'granted') {
      try {
        const osNotif = new Notification(opts.title, {
          body: opts.body,
          icon: '/logo-icon.png',
          badge: '/logo-icon.png',
          tag: `itech-${opts.type}`,   // replaces same-type notif instead of stacking
          requireInteraction: opts.type === 'chat', // live chat stays until dismissed
        });
        if (opts.onClick) {
          clickHandlers.current[id] = opts.onClick;
          osNotif.onclick = () => {
            window.focus();
            clickHandlers.current[id]?.();
            osNotif.close();
          };
        } else {
          osNotif.onclick = () => { window.focus(); osNotif.close(); };
        }
      } catch { /* browser may block silent fail */ }
    }
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, unreadCount, permission, requestPermission, notify, markRead, markAllRead, clearAll };
}
