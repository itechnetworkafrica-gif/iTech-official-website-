/**
 * iTech Network Africa — Portal Data Layer
 *
 * localStorage is the shared store between Admin and Client portals.
 * Both run in the same browser so reads/writes are always in sync.
 */

// ─── Core Types ───────────────────────────────────────────────────────────────

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
  assignedTo?: string;
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
  rating?: number;       // 1-5 stars, client-submitted
  ratingComment?: string;
}

// ─── Extended Types ───────────────────────────────────────────────────────────

export interface Milestone {
  id: string;
  label: string;
  done: boolean;
  dueDate?: string;
}

export interface ManagedProject {
  id: string;
  clientId: string;
  name: string;
  type: string;
  status: 'Active' | 'Completed' | 'On Hold';
  description: string;
  startDate: string;
  manager: string;
  progress: number;       // 0–100
  milestones: Milestone[];
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  type: 'info' | 'warning' | 'success' | 'maintenance';
  targetClients: 'all' | string[];
  pinned: boolean;
  adminName: string;
  createdAt: string;
}

export interface PortalFile {
  id: string;
  clientId: string | 'all';
  name: string;
  sizeLabel: string;
  fileType: string;
  category: 'Contract' | 'Report' | 'Design' | 'Invoice' | 'Proposal' | 'Other';
  downloadUrl: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface PaymentConfirmation {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  reference: string;
  method: 'Bank Transfer' | 'Mobile Money' | 'Credit Card' | 'Cash' | 'Crypto' | 'Other';
  note: string;
  submittedAt: string;
  status: 'Pending' | 'Verified' | 'Rejected';
}

export interface QuickReplyTemplate {
  id: string;
  title: string;
  body: string;
  category: string;
}

export interface ClientNote {
  id: string;
  clientId: string;
  text: string;
  authorName: string;
  createdAt: string;
  pinned: boolean;
}

export interface ActivityLogEntry {
  id: string;
  action: string;
  detail: string;
  entity: 'Invoice' | 'Ticket' | 'Client' | 'Project' | 'System' | 'File' | 'Announcement';
  adminName: string;
  timestamp: string;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  items: InvoiceItem[];
  notes: string;
  paymentTerms: string;
  taxRate: number;
}

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const INVOICES_KEY       = 'itech_portal_invoices_v2';
const TICKETS_KEY        = 'itech_portal_tickets_v2';
const PROJECTS_KEY       = 'itech_portal_projects_v1';
const ANNOUNCEMENTS_KEY  = 'itech_portal_announcements_v1';
const FILES_KEY          = 'itech_portal_files_v1';
const PAYMENTS_KEY       = 'itech_portal_payments_v1';
const QUICK_REPLIES_KEY  = 'itech_portal_quick_replies_v1';
const CLIENT_NOTES_KEY   = 'itech_portal_notes_v1';
const ACTIVITY_LOG_KEY   = 'itech_portal_activity_v1';
const INV_TEMPLATES_KEY  = 'itech_portal_inv_templates_v1';

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function genId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
export function nowIso(): string { return new Date().toISOString(); }
export function todayStr(): string { return new Date().toISOString().split('T')[0]; }
export function addDays(days: number): string {
  return new Date(Date.now() + days * 86400000).toISOString().split('T')[0];
}
function load<T>(key: string, def: T[] = []): T[] {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? def; } catch { return def; }
}
function save(key: string, data: unknown): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── Invoice Operations ───────────────────────────────────────────────────────

export function getInvoices(): Invoice[] { return load<Invoice>(INVOICES_KEY); }
export function getClientInvoices(clientId: string): Invoice[] {
  return getInvoices().filter(i => i.clientId === clientId && i.status !== 'Draft');
}
export function saveInvoice(data: Partial<Invoice> & { clientId: string }): Invoice {
  const all = getInvoices();
  const isNew = !data.id;
  const year  = new Date().getFullYear();
  const num   = String(all.length + 1).padStart(3, '0');
  const full: Invoice = {
    notes: '', paymentTerms: 'Payment due within 30 days of invoice date.',
    taxRate: 0, subtotal: 0, taxAmount: 0, total: 0, viewedByClient: false,
    ...data,
    id: data.id || genId(),
    invoiceNumber: data.invoiceNumber || `INV-${year}-${num}`,
    createdAt: data.createdAt || nowIso(),
    updatedAt: nowIso(),
  } as Invoice;
  if (isNew) all.push(full);
  else { const idx = all.findIndex(i => i.id === full.id); if (idx >= 0) all[idx] = full; else all.push(full); }
  save(INVOICES_KEY, all);
  logActivity('Created invoice', `${full.invoiceNumber} for ${full.clientName}`, 'Invoice');
  return full;
}
export function deleteInvoice(id: string): void {
  const inv = getInvoices().find(i => i.id === id);
  save(INVOICES_KEY, getInvoices().filter(i => i.id !== id));
  if (inv) logActivity('Deleted invoice', inv.invoiceNumber, 'Invoice');
}
export function updateInvoiceStatus(id: string, status: Invoice['status']): void {
  const all = getInvoices();
  const idx = all.findIndex(i => i.id === id);
  if (idx >= 0) { all[idx].status = status; all[idx].updatedAt = nowIso(); }
  save(INVOICES_KEY, all);
  logActivity('Updated invoice status', `${all[idx]?.invoiceNumber} → ${status}`, 'Invoice');
}
export function markInvoiceViewed(id: string): void {
  const all = getInvoices();
  const idx = all.findIndex(i => i.id === id);
  if (idx >= 0) all[idx].viewedByClient = true;
  save(INVOICES_KEY, all);
}

// ─── Support Ticket Operations ────────────────────────────────────────────────

export function getTickets(): SupportTicket[] { return load<SupportTicket>(TICKETS_KEY); }
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
    clientId: data.clientId, clientName: data.clientName, clientEmail: data.clientEmail,
    subject: data.subject, category: data.category, priority: data.priority,
    status: 'Open',
    messages: [{ id: genId(), sender: 'client', senderName: data.clientName, text: data.message, timestamp: nowIso(), read: false }],
    createdAt: nowIso(), updatedAt: nowIso(),
  };
  all.push(ticket);
  save(TICKETS_KEY, all);
  return ticket;
}
export function addTicketMessage(ticketId: string, sender: 'client' | 'admin', senderName: string, text: string): SupportTicket | null {
  const all = getTickets();
  const idx = all.findIndex(t => t.id === ticketId);
  if (idx < 0) return null;
  all[idx].messages.push({ id: genId(), sender, senderName, text, timestamp: nowIso(), read: false });
  all[idx].updatedAt = nowIso();
  if (sender === 'admin' && all[idx].status === 'Open') all[idx].status = 'In Progress';
  save(TICKETS_KEY, all);
  if (sender === 'admin') logActivity('Replied to ticket', all[idx].subject, 'Ticket');
  return all[idx];
}
export function updateTicketStatus(ticketId: string, status: SupportTicket['status']): void {
  const all = getTickets();
  const idx = all.findIndex(t => t.id === ticketId);
  if (idx >= 0) { all[idx].status = status; all[idx].updatedAt = nowIso(); }
  save(TICKETS_KEY, all);
  logActivity('Updated ticket status', `${all[idx]?.subject} → ${status}`, 'Ticket');
}
export function updateTicketPriority(ticketId: string, priority: SupportTicket['priority']): void {
  const all = getTickets();
  const idx = all.findIndex(t => t.id === ticketId);
  if (idx >= 0) { all[idx].priority = priority; all[idx].updatedAt = nowIso(); }
  save(TICKETS_KEY, all);
}
export function assignTicket(ticketId: string, assignedTo: string): void {
  const all = getTickets();
  const idx = all.findIndex(t => t.id === ticketId);
  if (idx >= 0) { all[idx].assignedTo = assignedTo; all[idx].updatedAt = nowIso(); }
  save(TICKETS_KEY, all);
}
export function rateTicket(ticketId: string, rating: number, comment: string): void {
  const all = getTickets();
  const idx = all.findIndex(t => t.id === ticketId);
  if (idx >= 0) { all[idx].rating = rating; all[idx].ratingComment = comment; }
  save(TICKETS_KEY, all);
}
export function markTicketMessagesRead(ticketId: string, readerRole: 'client' | 'admin'): void {
  const all = getTickets();
  const idx = all.findIndex(t => t.id === ticketId);
  if (idx < 0) return;
  const other = readerRole === 'client' ? 'admin' : 'client';
  all[idx].messages = all[idx].messages.map(m => m.sender === other ? { ...m, read: true } : m);
  save(TICKETS_KEY, all);
}

// ─── Managed Projects ─────────────────────────────────────────────────────────

export function getManagedProjects(): ManagedProject[] { return load<ManagedProject>(PROJECTS_KEY); }
export function getClientManagedProjects(clientId: string): ManagedProject[] {
  return getManagedProjects().filter(p => p.clientId === clientId);
}
export function saveProject(data: Partial<ManagedProject> & { clientId: string }): ManagedProject {
  const all = getManagedProjects();
  const isNew = !data.id;
  const proj: ManagedProject = {
    name: '', type: '', status: 'Active', description: '', startDate: todayStr(),
    manager: 'iTech Network Africa Team', progress: 0, milestones: [],
    ...data,
    id: data.id || genId(),
  } as ManagedProject;
  if (isNew) all.push(proj);
  else { const idx = all.findIndex(p => p.id === proj.id); if (idx >= 0) all[idx] = proj; else all.push(proj); }
  save(PROJECTS_KEY, all);
  logActivity(isNew ? 'Created project' : 'Updated project', `${proj.name} for client`, 'Project');
  return proj;
}
export function deleteProject(id: string): void {
  save(PROJECTS_KEY, getManagedProjects().filter(p => p.id !== id));
  logActivity('Deleted project', id, 'Project');
}
export function toggleMilestone(projectId: string, milestoneId: string): void {
  const all = getManagedProjects();
  const idx = all.findIndex(p => p.id === projectId);
  if (idx < 0) return;
  all[idx].milestones = all[idx].milestones.map(m => m.id === milestoneId ? { ...m, done: !m.done } : m);
  // auto-recalculate progress
  const ms = all[idx].milestones;
  if (ms.length > 0) all[idx].progress = Math.round((ms.filter(m => m.done).length / ms.length) * 100);
  save(PROJECTS_KEY, all);
}

// ─── Announcements ────────────────────────────────────────────────────────────

export function getAnnouncements(): Announcement[] { return load<Announcement>(ANNOUNCEMENTS_KEY); }
export function getClientAnnouncements(clientId: string): Announcement[] {
  return getAnnouncements().filter(a => a.targetClients === 'all' || (a.targetClients as string[]).includes(clientId))
    .sort((a, b) => { if (a.pinned !== b.pinned) return a.pinned ? -1 : 1; return b.createdAt.localeCompare(a.createdAt); });
}
export function saveAnnouncement(data: Partial<Announcement>): Announcement {
  const all = getAnnouncements();
  const isNew = !data.id;
  const ann: Announcement = {
    title: '', body: '', type: 'info', targetClients: 'all', pinned: false, adminName: 'iTech Admin',
    ...data, id: data.id || genId(), createdAt: data.createdAt || nowIso(),
  } as Announcement;
  if (isNew) all.push(ann);
  else { const idx = all.findIndex(a => a.id === ann.id); if (idx >= 0) all[idx] = ann; else all.push(ann); }
  save(ANNOUNCEMENTS_KEY, all);
  logActivity(isNew ? 'Posted announcement' : 'Updated announcement', ann.title, 'Announcement');
  return ann;
}
export function deleteAnnouncement(id: string): void {
  save(ANNOUNCEMENTS_KEY, getAnnouncements().filter(a => a.id !== id));
}

// ─── Portal Files ─────────────────────────────────────────────────────────────

export function getFiles(): PortalFile[] { return load<PortalFile>(FILES_KEY); }
export function getClientFiles(clientId: string): PortalFile[] {
  return getFiles().filter(f => f.clientId === 'all' || f.clientId === clientId);
}
export function saveFile(data: Partial<PortalFile> & { clientId: string }): PortalFile {
  const all = getFiles();
  const isNew = !data.id;
  const file: PortalFile = {
    name: '', sizeLabel: '—', fileType: 'PDF', category: 'Other',
    downloadUrl: '#', uploadedAt: nowIso(), uploadedBy: 'iTech Admin',
    ...data, id: data.id || genId(),
  } as PortalFile;
  if (isNew) all.push(file);
  else { const idx = all.findIndex(f => f.id === file.id); if (idx >= 0) all[idx] = file; else all.push(file); }
  save(FILES_KEY, all);
  logActivity('Uploaded file', file.name, 'File');
  return file;
}
export function deleteFile(id: string): void {
  save(FILES_KEY, getFiles().filter(f => f.id !== id));
}

// ─── Payment Confirmations ────────────────────────────────────────────────────

export function getPaymentConfirmations(): PaymentConfirmation[] { return load<PaymentConfirmation>(PAYMENTS_KEY); }
export function getClientPayments(clientId: string): PaymentConfirmation[] {
  return getPaymentConfirmations().filter(p => p.clientId === clientId);
}
export function submitPaymentConfirmation(data: Omit<PaymentConfirmation, 'id' | 'submittedAt' | 'status'>): PaymentConfirmation {
  const all = getPaymentConfirmations();
  const conf: PaymentConfirmation = { ...data, id: genId(), submittedAt: nowIso(), status: 'Pending' };
  all.push(conf);
  save(PAYMENTS_KEY, all);
  return conf;
}
export function updatePaymentStatus(id: string, status: PaymentConfirmation['status']): void {
  const all = getPaymentConfirmations();
  const idx = all.findIndex(p => p.id === id);
  if (idx >= 0) all[idx].status = status;
  save(PAYMENTS_KEY, all);
  logActivity('Updated payment status', `→ ${status}`, 'Invoice');
}

// ─── Quick Reply Templates ────────────────────────────────────────────────────

function defaultQuickReplies(): QuickReplyTemplate[] {
  return [
    { id: 'qr-1', title: 'Acknowledge Receipt', category: 'General', body: "Thank you for reaching out. We've received your message and a member of our team will get back to you within 24 hours." },
    { id: 'qr-2', title: 'Working on It', category: 'Technical', body: "We're currently investigating the issue you reported. We'll update you as soon as we have more information." },
    { id: 'qr-3', title: 'Request More Info', category: 'General', body: "To help resolve your issue faster, could you please provide more details? Specifically: steps to reproduce the problem, any error messages, and your browser/device information." },
    { id: 'qr-4', title: 'Issue Resolved', category: 'Technical', body: "We're happy to let you know that the issue has been resolved. Please let us know if you experience anything further." },
    { id: 'qr-5', title: 'Invoice Confirmation', category: 'Billing', body: "Thank you for your payment confirmation. We'll verify and mark your invoice as paid within one business day." },
    { id: 'qr-6', title: 'Follow Up', category: 'General', body: "We wanted to follow up on your ticket. Have you had a chance to test the solution? Please let us know if everything is working as expected." },
  ];
}
export function getQuickReplies(): QuickReplyTemplate[] {
  const stored = load<QuickReplyTemplate>(QUICK_REPLIES_KEY);
  return stored.length > 0 ? stored : defaultQuickReplies();
}
export function saveQuickReply(data: Partial<QuickReplyTemplate>): QuickReplyTemplate {
  const all = getQuickReplies();
  const isNew = !data.id;
  const qr: QuickReplyTemplate = { title: '', body: '', category: 'General', ...data, id: data.id || genId() };
  if (isNew) all.push(qr);
  else { const idx = all.findIndex(q => q.id === qr.id); if (idx >= 0) all[idx] = qr; else all.push(qr); }
  save(QUICK_REPLIES_KEY, all);
  return qr;
}
export function deleteQuickReply(id: string): void {
  save(QUICK_REPLIES_KEY, getQuickReplies().filter(q => q.id !== id));
}

// ─── Client Notes ─────────────────────────────────────────────────────────────

export function getClientNotes(clientId: string): ClientNote[] {
  return load<ClientNote>(CLIENT_NOTES_KEY).filter(n => n.clientId === clientId)
    .sort((a, b) => { if (a.pinned !== b.pinned) return a.pinned ? -1 : 1; return b.createdAt.localeCompare(a.createdAt); });
}
export function saveClientNote(data: Partial<ClientNote> & { clientId: string }): ClientNote {
  const all = load<ClientNote>(CLIENT_NOTES_KEY);
  const isNew = !data.id;
  const note: ClientNote = { text: '', authorName: 'Admin', pinned: false, ...data, id: data.id || genId(), createdAt: data.createdAt || nowIso() } as ClientNote;
  if (isNew) all.push(note);
  else { const idx = all.findIndex(n => n.id === note.id); if (idx >= 0) all[idx] = note; else all.push(note); }
  save(CLIENT_NOTES_KEY, all);
  return note;
}
export function deleteClientNote(id: string): void {
  save(CLIENT_NOTES_KEY, load<ClientNote>(CLIENT_NOTES_KEY).filter(n => n.id !== id));
}

// ─── Activity Log ─────────────────────────────────────────────────────────────

function logActivity(action: string, detail: string, entity: ActivityLogEntry['entity'], adminName = 'iTech Admin'): void {
  const all = load<ActivityLogEntry>(ACTIVITY_LOG_KEY);
  all.unshift({ id: genId(), action, detail, entity, adminName, timestamp: nowIso() });
  save(ACTIVITY_LOG_KEY, all.slice(0, 100)); // keep last 100
}
export function getActivityLog(): ActivityLogEntry[] { return load<ActivityLogEntry>(ACTIVITY_LOG_KEY); }
export function clearActivityLog(): void { save(ACTIVITY_LOG_KEY, []); }

// ─── Invoice Templates ────────────────────────────────────────────────────────

function defaultInvoiceTemplates(): InvoiceTemplate[] {
  return [
    {
      id: 'tpl-1', name: 'Web Development Package',
      items: [
        { id: '1', description: 'Website Design & Development', qty: 1, rate: 1500, amount: 1500 },
        { id: '2', description: 'Domain & Hosting Setup (1 Year)', qty: 1, rate: 150, amount: 150 },
        { id: '3', description: 'SEO Setup & Optimisation', qty: 1, rate: 200, amount: 200 },
      ],
      notes: 'Thank you for choosing iTech Network Africa.', paymentTerms: 'Payment due within 30 days.', taxRate: 0,
    },
    {
      id: 'tpl-2', name: 'Monthly Maintenance',
      items: [
        { id: '1', description: 'Monthly Website Maintenance & Updates', qty: 1, rate: 200, amount: 200 },
        { id: '2', description: 'Security Monitoring & Backups', qty: 1, rate: 50, amount: 50 },
      ],
      notes: 'Recurring monthly service.', paymentTerms: 'Due on the 1st of each month.', taxRate: 0,
    },
    {
      id: 'tpl-3', name: 'AI & Automation Setup',
      items: [
        { id: '1', description: 'AI Integration & Automation Setup', qty: 1, rate: 2500, amount: 2500 },
        { id: '2', description: 'Training & Documentation', qty: 1, rate: 500, amount: 500 },
      ],
      notes: 'Includes 30 days post-delivery support.', paymentTerms: '50% upfront, 50% on delivery.', taxRate: 0,
    },
  ];
}
export function getInvoiceTemplates(): InvoiceTemplate[] {
  const stored = load<InvoiceTemplate>(INV_TEMPLATES_KEY);
  return stored.length > 0 ? stored : defaultInvoiceTemplates();
}
export function saveInvoiceTemplate(data: Partial<InvoiceTemplate>): InvoiceTemplate {
  const all = getInvoiceTemplates();
  const isNew = !data.id;
  const tpl: InvoiceTemplate = { name: '', items: [], notes: '', paymentTerms: '', taxRate: 0, ...data, id: data.id || genId() };
  if (isNew) all.push(tpl);
  else { const idx = all.findIndex(t => t.id === tpl.id); if (idx >= 0) all[idx] = tpl; else all.push(tpl); }
  save(INV_TEMPLATES_KEY, all);
  return tpl;
}
export function deleteInvoiceTemplate(id: string): void {
  save(INV_TEMPLATES_KEY, getInvoiceTemplates().filter(t => t.id !== id));
}

// ─── Notification Counts ─────────────────────────────────────────────────────

export function getAdminUnread(): number {
  return getTickets().reduce((n, t) => n + t.messages.filter(m => m.sender === 'client' && !m.read).length, 0);
}
export function getClientUnread(clientId: string): { invoices: number; support: number; announcements: number } {
  const invoices     = getClientInvoices(clientId).filter(i => !i.viewedByClient).length;
  const support      = getClientTickets(clientId).reduce((n, t) => n + t.messages.filter(m => m.sender === 'admin' && !m.read).length, 0);
  const announcements = getClientAnnouncements(clientId).length; // simplified; could track read state
  return { invoices, support, announcements };
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
  const diff  = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return 'just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  < 7)  return `${days}d ago`;
  return fmtDate(iso);
}

// ─── Revenue Analytics Helpers ────────────────────────────────────────────────

export interface MonthRevenue { month: string; revenue: number; invoices: number; }

export function getMonthlyRevenue(months = 6): MonthRevenue[] {
  const invoices = getInvoices().filter(i => i.status === 'Paid');
  const result: MonthRevenue[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    const bucket = invoices.filter(inv => inv.updatedAt.startsWith(key));
    result.push({ month: label, revenue: bucket.reduce((s, inv) => s + inv.total, 0), invoices: bucket.length });
  }
  return result;
}
