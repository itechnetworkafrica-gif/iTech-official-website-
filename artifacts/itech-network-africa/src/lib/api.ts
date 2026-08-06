/**
 * iTech Network Africa — Portal API Client
 *
 * All portal data is fetched from / saved to the backend API.
 * This replaces the localStorage-only approach and enables cross-device sync.
 */

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

async function apiFetch(path: string, opts?: RequestInit): Promise<any> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...opts?.headers },
    ...opts,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `API error ${res.status}`);
  }
  return res.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (email: string, password: string, userType?: "client" | "admin") =>
    apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password, userType }) }),

  logout: () => apiFetch("/api/auth/logout", { method: "POST" }),

  me: () => apiFetch("/api/auth/me"),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiFetch("/api/auth/change-password", { method: "POST", body: JSON.stringify({ currentPassword, newPassword }) }),
};

// ─── Client Portal ────────────────────────────────────────────────────────────
export const portalAPI = {
  // Bulk data
  getData: () => apiFetch("/api/portal/data"),

  // Invoices
  getInvoices: () => apiFetch("/api/portal/invoices"),
  markInvoiceViewed: (id: string) => apiFetch(`/api/portal/invoices/${id}/viewed`, { method: "POST" }),

  // Tickets
  getTickets: () => apiFetch("/api/portal/tickets"),
  createTicket: (data: { subject: string; category: string; priority: string; message: string }) =>
    apiFetch("/api/portal/tickets", { method: "POST", body: JSON.stringify(data) }),
  addTicketMessage: (ticketId: string, text: string) =>
    apiFetch(`/api/portal/tickets/${ticketId}/messages`, { method: "POST", body: JSON.stringify({ text }) }),
  markTicketRead: (ticketId: string) =>
    apiFetch(`/api/portal/tickets/${ticketId}/read`, { method: "POST" }),
  rateTicket: (ticketId: string, rating: number, comment?: string) =>
    apiFetch(`/api/portal/tickets/${ticketId}/rate`, { method: "POST", body: JSON.stringify({ rating, comment }) }),

  // Projects
  getProjects: () => apiFetch("/api/portal/projects"),
  toggleMilestone: (projectId: string, milestoneId: string) =>
    apiFetch(`/api/portal/projects/${projectId}/milestone`, { method: "POST", body: JSON.stringify({ milestoneId }) }),

  // Announcements
  getAnnouncements: () => apiFetch("/api/portal/announcements"),

  // Files
  getFiles: () => apiFetch("/api/portal/files"),

  // Uploads
  getUploads: () => apiFetch("/api/portal/uploads"),
  uploadFile: (data: { name: string; fileType: string; sizeLabel: string; dataUrl: string; description?: string }) =>
    apiFetch("/api/portal/uploads", { method: "POST", body: JSON.stringify(data) }),
  deleteUpload: (id: string) => apiFetch(`/api/portal/uploads/${id}`, { method: "DELETE" }),

  // Disputes
  getDisputes: () => apiFetch("/api/portal/disputes"),
  submitDispute: (data: { invoiceId: string; invoiceNumber: string; reason: string; details?: string }) =>
    apiFetch("/api/portal/disputes", { method: "POST", body: JSON.stringify(data) }),

  // Payments
  getPayments: () => apiFetch("/api/portal/payments"),
  submitPayment: (data: { invoiceId: string; invoiceNumber: string; reference: string; method: string; note?: string }) =>
    apiFetch("/api/portal/payments", { method: "POST", body: JSON.stringify(data) }),

  // Unread counts
  getUnread: () => apiFetch("/api/portal/unread"),

  // Profile
  updateProfile: (data: { name?: string; phone?: string; organisation?: string }) =>
    apiFetch("/api/portal/profile", { method: "PUT", body: JSON.stringify(data) }),
};

// ─── Admin Portal ─────────────────────────────────────────────────────────────
export const adminAPI = {
  // Overview
  getOverview: () => apiFetch("/api/admin/overview"),
  getRevenue: () => apiFetch("/api/admin/revenue"),

  // Clients
  getClients: () => apiFetch("/api/admin/clients"),
  createClient: (data: { name: string; email: string; password: string; organisation?: string; role?: string; phone?: string; tier?: string }) =>
    apiFetch("/api/admin/clients", { method: "POST", body: JSON.stringify(data) }),
  updateClient: (id: string, data: any) =>
    apiFetch(`/api/admin/clients/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deactivateClient: (id: string) => apiFetch(`/api/admin/clients/${id}`, { method: "DELETE" }),

  // Invoices
  getInvoices: () => apiFetch("/api/admin/invoices"),
  createInvoice: (data: any) => apiFetch("/api/admin/invoices", { method: "POST", body: JSON.stringify(data) }),
  updateInvoice: (id: string, data: any) => apiFetch(`/api/admin/invoices/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  updateInvoiceStatus: (id: string, status: string) =>
    apiFetch(`/api/admin/invoices/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  deleteInvoice: (id: string) => apiFetch(`/api/admin/invoices/${id}`, { method: "DELETE" }),

  // Tickets
  getTickets: () => apiFetch("/api/admin/tickets"),
  addTicketMessage: (ticketId: string, text: string) =>
    apiFetch(`/api/admin/tickets/${ticketId}/messages`, { method: "POST", body: JSON.stringify({ text }) }),
  updateTicketStatus: (ticketId: string, status: string) =>
    apiFetch(`/api/admin/tickets/${ticketId}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  updateTicketPriority: (ticketId: string, priority: string) =>
    apiFetch(`/api/admin/tickets/${ticketId}/priority`, { method: "PATCH", body: JSON.stringify({ priority }) }),
  assignTicket: (ticketId: string, assignedTo: string) =>
    apiFetch(`/api/admin/tickets/${ticketId}/assign`, { method: "PATCH", body: JSON.stringify({ assignedTo }) }),
  markTicketRead: (ticketId: string) =>
    apiFetch(`/api/admin/tickets/${ticketId}/read`, { method: "POST" }),

  // Projects
  getProjects: () => apiFetch("/api/admin/projects"),
  createProject: (data: any) => apiFetch("/api/admin/projects", { method: "POST", body: JSON.stringify(data) }),
  updateProject: (id: string, data: any) => apiFetch(`/api/admin/projects/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProject: (id: string) => apiFetch(`/api/admin/projects/${id}`, { method: "DELETE" }),
  toggleMilestone: (projectId: string, milestoneId: string) =>
    apiFetch(`/api/admin/projects/${projectId}/milestone`, { method: "POST", body: JSON.stringify({ milestoneId }) }),

  // Announcements
  getAnnouncements: () => apiFetch("/api/admin/announcements"),
  createAnnouncement: (data: any) => apiFetch("/api/admin/announcements", { method: "POST", body: JSON.stringify(data) }),
  updateAnnouncement: (id: string, data: any) => apiFetch(`/api/admin/announcements/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteAnnouncement: (id: string) => apiFetch(`/api/admin/announcements/${id}`, { method: "DELETE" }),

  // Files
  getFiles: () => apiFetch("/api/admin/files"),
  uploadFile: (data: any) => apiFetch("/api/admin/files", { method: "POST", body: JSON.stringify(data) }),
  deleteFile: (id: string) => apiFetch(`/api/admin/files/${id}`, { method: "DELETE" }),

  // Client uploads
  getUploads: () => apiFetch("/api/admin/uploads"),
  updateUploadStatus: (id: string, status: string, adminNote?: string) =>
    apiFetch(`/api/admin/uploads/${id}`, { method: "PATCH", body: JSON.stringify({ status, adminNote }) }),
  deleteUpload: (id: string) => apiFetch(`/api/admin/uploads/${id}`, { method: "DELETE" }),

  // Payments
  getPayments: () => apiFetch("/api/admin/payments"),
  updatePaymentStatus: (id: string, status: string) =>
    apiFetch(`/api/admin/payments/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),

  // Disputes
  getDisputes: () => apiFetch("/api/admin/disputes"),
  updateDisputeStatus: (id: string, status: string, adminNote?: string) =>
    apiFetch(`/api/admin/disputes/${id}`, { method: "PATCH", body: JSON.stringify({ status, adminNote }) }),

  // Quick replies
  getQuickReplies: () => apiFetch("/api/admin/quick-replies"),
  createQuickReply: (data: { title: string; body: string; category: string }) =>
    apiFetch("/api/admin/quick-replies", { method: "POST", body: JSON.stringify(data) }),
  deleteQuickReply: (id: string) => apiFetch(`/api/admin/quick-replies/${id}`, { method: "DELETE" }),

  // Client notes
  getNotes: (clientId: string) => apiFetch(`/api/admin/notes/${clientId}`),
  createNote: (data: { clientId: string; text: string; authorName?: string; pinned?: boolean }) =>
    apiFetch("/api/admin/notes", { method: "POST", body: JSON.stringify(data) }),
  deleteNote: (id: string) => apiFetch(`/api/admin/notes/${id}`, { method: "DELETE" }),

  // Invoice templates
  getInvoiceTemplates: () => apiFetch("/api/admin/invoice-templates"),
  createInvoiceTemplate: (data: any) => apiFetch("/api/admin/invoice-templates", { method: "POST", body: JSON.stringify(data) }),
  deleteInvoiceTemplate: (id: string) => apiFetch(`/api/admin/invoice-templates/${id}`, { method: "DELETE" }),

  // Activity log
  getActivity: () => apiFetch("/api/admin/activity"),

  // Unread
  getUnread: () => apiFetch("/api/admin/unread"),
};

// ─── Shared helpers ───────────────────────────────────────────────────────────
export function fmt$(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return fmtDate(iso);
}

export function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

export function addDays(days: number): string {
  return new Date(Date.now() + days * 86400000).toISOString().split("T")[0];
}

export function genId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function playNotificationSound(type: "message" | "invoice" | "upload" = "message"): void {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    if (type === "message") {
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.45);
    } else if (type === "invoice") {
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, i) => {
        const o2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        o2.connect(g2); g2.connect(ctx.destination);
        o2.type = "sine"; o2.frequency.value = freq;
        g2.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
        g2.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.1 + 0.02);
        g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.3);
        o2.start(ctx.currentTime + i * 0.1);
        o2.stop(ctx.currentTime + i * 0.1 + 0.3);
      });
    } else {
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(550, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    }
    setTimeout(() => ctx.close(), 1000);
  } catch { /* AudioContext not available */ }
}
