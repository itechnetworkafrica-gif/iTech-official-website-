/**
 * iTech Network Africa — Portal Data Layer
 *
 * localStorage is the shared store between Admin and Client portals.
 * Both run in the same browser so reads/writes are always in sync.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientOrg: string;
  issuedDate: string;
  dueDate: string;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  items: InvoiceItem[];
  notes: string;
  paymentTerms: string;
  taxRate: number;
  subtotal: number;
  taxAmount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  /** client has opened/viewed this invoice */
  viewedByClient: boolean;
}

export interface TicketMessage {
  id: string;
  sender: 'client' | 'admin';
  senderName: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  subject: string;
  category: 'Technical' | 'Billing' | 'General' | 'Feature Request';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
}

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const INVOICES_KEY = 'itech_portal_invoices_v2';
const TICKETS_KEY  = 'itech_portal_tickets_v2';

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function genId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export function addDays(days: number): string {
  return new Date(Date.now() + days * 86400000).toISOString().split('T')[0];
}

// ─── Invoice Operations ───────────────────────────────────────────────────────

export function getInvoices(): Invoice[] {
  try { return JSON.parse(localStorage.getItem(INVOICES_KEY) || '[]'); }
  catch { return []; }
}

export function getClientInvoices(clientId: string): Invoice[] {
  return getInvoices().filter(i => i.clientId === clientId && i.status !== 'Draft');
}

export function saveInvoice(data: Partial<Invoice> & { clientId: string }): Invoice {
  const all = getInvoices();
  const isNew = !data.id;
  const year  = new Date().getFullYear();
  const num   = String(all.length + 1).padStart(3, '0');

  const full: Invoice = {
    notes: '',
    paymentTerms: 'Payment due within 30 days of invoice date.',
    taxRate: 0,
    subtotal: 0,
    taxAmount: 0,
    total: 0,
    viewedByClient: false,
    ...data,
    id: data.id || genId(),
    invoiceNumber: data.invoiceNumber || `INV-${year}-${num}`,
    createdAt: data.createdAt || nowIso(),
    updatedAt: nowIso(),
  } as Invoice;

  if (isNew) {
    all.push(full);
  } else {
    const idx = all.findIndex(i => i.id === full.id);
    if (idx >= 0) all[idx] = full; else all.push(full);
  }
  localStorage.setItem(INVOICES_KEY, JSON.stringify(all));
  return full;
}

export function deleteInvoice(id: string): void {
  localStorage.setItem(INVOICES_KEY, JSON.stringify(getInvoices().filter(i => i.id !== id)));
}

export function updateInvoiceStatus(id: string, status: Invoice['status']): void {
  const all = getInvoices();
  const idx = all.findIndex(i => i.id === id);
  if (idx >= 0) { all[idx].status = status; all[idx].updatedAt = nowIso(); }
  localStorage.setItem(INVOICES_KEY, JSON.stringify(all));
}

export function markInvoiceViewed(id: string): void {
  const all = getInvoices();
  const idx = all.findIndex(i => i.id === id);
  if (idx >= 0) { all[idx].viewedByClient = true; }
  localStorage.setItem(INVOICES_KEY, JSON.stringify(all));
}

// ─── Support Ticket Operations ────────────────────────────────────────────────

export function getTickets(): SupportTicket[] {
  try { return JSON.parse(localStorage.getItem(TICKETS_KEY) || '[]'); }
  catch { return []; }
}

export function getClientTickets(clientId: string): SupportTicket[] {
  return getTickets().filter(t => t.clientId === clientId);
}

export function createTicket(data: {
  clientId: string; clientName: string; clientEmail: string;
  subject: string; category: SupportTicket['category'];
  priority: SupportTicket['priority']; message: string;
}): SupportTicket {
  const all = getTickets();
  const ticket: SupportTicket = {
    id: genId(),
    ticketNumber: `TKT-${String(all.length + 1).padStart(4, '0')}`,
    clientId: data.clientId,
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    subject: data.subject,
    category: data.category,
    priority: data.priority,
    status: 'Open',
    messages: [{
      id: genId(),
      sender: 'client',
      senderName: data.clientName,
      text: data.message,
      timestamp: nowIso(),
      read: false,
    }],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  all.push(ticket);
  localStorage.setItem(TICKETS_KEY, JSON.stringify(all));
  return ticket;
}

export function addTicketMessage(
  ticketId: string,
  sender: 'client' | 'admin',
  senderName: string,
  text: string,
): SupportTicket | null {
  const all = getTickets();
  const idx = all.findIndex(t => t.id === ticketId);
  if (idx < 0) return null;
  all[idx].messages.push({ id: genId(), sender, senderName, text, timestamp: nowIso(), read: false });
  all[idx].updatedAt = nowIso();
  if (sender === 'admin' && all[idx].status === 'Open') all[idx].status = 'In Progress';
  localStorage.setItem(TICKETS_KEY, JSON.stringify(all));
  return all[idx];
}

export function updateTicketStatus(ticketId: string, status: SupportTicket['status']): void {
  const all = getTickets();
  const idx = all.findIndex(t => t.id === ticketId);
  if (idx >= 0) { all[idx].status = status; all[idx].updatedAt = nowIso(); }
  localStorage.setItem(TICKETS_KEY, JSON.stringify(all));
}

export function markTicketMessagesRead(ticketId: string, readerRole: 'client' | 'admin'): void {
  const all = getTickets();
  const idx = all.findIndex(t => t.id === ticketId);
  if (idx < 0) return;
  const other = readerRole === 'client' ? 'admin' : 'client';
  all[idx].messages = all[idx].messages.map(m => m.sender === other ? { ...m, read: true } : m);
  localStorage.setItem(TICKETS_KEY, JSON.stringify(all));
}

// ─── Notification Counts ─────────────────────────────────────────────────────

/** Unread client→admin messages (admin badge) */
export function getAdminUnread(): number {
  return getTickets().reduce((n, t) => n + t.messages.filter(m => m.sender === 'client' && !m.read).length, 0);
}

/** New invoices + unread admin→client messages */
export function getClientUnread(clientId: string): { invoices: number; support: number } {
  const invoices = getClientInvoices(clientId).filter(i => !i.viewedByClient).length;
  const support  = getClientTickets(clientId).reduce(
    (n, t) => n + t.messages.filter(m => m.sender === 'admin' && !m.read).length, 0
  );
  return { invoices, support };
}

// ─── Format Helpers ───────────────────────────────────────────────────────────

export function fmt$(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export function fmtDate(iso: string): string {
  try { return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
  catch { return iso; }
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return 'just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  < 7)  return `${days}d ago`;
  return fmtDate(iso);
}
