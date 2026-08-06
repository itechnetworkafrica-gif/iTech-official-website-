/**
 * Client portal routes — all require client auth
 */
import { Router, type Request, type Response } from "express";
import { query } from "../lib/db.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();
const auth = requireAuth("client");

function genId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// ─── Bulk data sync ──────────────────────────────────────────────────────────
// GET /api/portal/data — fetch all data for the authenticated client
router.get("/portal/data", auth, async (req: Request, res: Response) => {
  const clientId = req.user!.id;

  const [invoices, tickets, projects, announcements, files, uploads, disputes, payments] = await Promise.all([
    query(
      "SELECT * FROM invoices WHERE client_id = $1 AND status != 'Draft' ORDER BY created_at DESC",
      [clientId]
    ),
    query(
      "SELECT t.*, json_agg(m ORDER BY m.created_at ASC) FILTER (WHERE m.id IS NOT NULL) as messages FROM support_tickets t LEFT JOIN ticket_messages m ON m.ticket_id = t.id WHERE t.client_id = $1 GROUP BY t.id ORDER BY t.updated_at DESC",
      [clientId]
    ),
    query("SELECT * FROM projects WHERE client_id = $1 ORDER BY created_at DESC", [clientId]),
    query(
      "SELECT * FROM announcements WHERE target_clients = '\"all\"' OR target_clients @> $1::jsonb ORDER BY pinned DESC, created_at DESC",
      [JSON.stringify([clientId])]
    ),
    query(
      "SELECT * FROM portal_files WHERE client_id = 'all' OR client_id = $1 ORDER BY uploaded_at DESC",
      [clientId]
    ),
    query("SELECT * FROM client_uploads WHERE client_id = $1 ORDER BY uploaded_at DESC", [clientId]),
    query("SELECT * FROM invoice_disputes WHERE client_id = $1 ORDER BY submitted_at DESC", [clientId]),
    query("SELECT * FROM payment_confirmations WHERE client_id = $1 ORDER BY submitted_at DESC", [clientId]),
  ]);

  res.json({
    invoices: invoices.rows.map(mapInvoice),
    tickets: tickets.rows.map(mapTicket),
    projects: projects.rows.map(mapProject),
    announcements: announcements.rows.map(mapAnnouncement),
    files: files.rows.map(mapPortalFile),
    uploads: uploads.rows.map(mapClientUpload),
    disputes: disputes.rows.map(mapDispute),
    payments: payments.rows.map(mapPayment),
  });
});

// ─── Invoices ────────────────────────────────────────────────────────────────
router.get("/portal/invoices", auth, async (req: Request, res: Response) => {
  const result = await query(
    "SELECT * FROM invoices WHERE client_id = $1 AND status != 'Draft' ORDER BY created_at DESC",
    [req.user!.id]
  );
  res.json(result.rows.map(mapInvoice));
});

router.post("/portal/invoices/:id/viewed", auth, async (req: Request, res: Response) => {
  await query(
    "UPDATE invoices SET viewed_by_client = true WHERE id = $1 AND client_id = $2",
    [req.params.id, req.user!.id]
  );
  res.json({ ok: true });
});

// ─── Tickets ─────────────────────────────────────────────────────────────────
router.get("/portal/tickets", auth, async (req: Request, res: Response) => {
  const result = await query(
    `SELECT t.*, json_agg(m ORDER BY m.created_at ASC) FILTER (WHERE m.id IS NOT NULL) as messages
     FROM support_tickets t
     LEFT JOIN ticket_messages m ON m.ticket_id = t.id
     WHERE t.client_id = $1
     GROUP BY t.id ORDER BY t.updated_at DESC`,
    [req.user!.id]
  );
  res.json(result.rows.map(mapTicket));
});

router.post("/portal/tickets", auth, async (req: Request, res: Response) => {
  const client = req.user!;
  const { subject, category, priority, message } = req.body as {
    subject: string; category: string; priority: string; message: string;
  };

  const result = await query("SELECT COUNT(*) FROM support_tickets", []);
  const count = parseInt(result.rows[0].count) + 1;
  const ticketId = genId();
  const msgId = genId();

  await query(
    `INSERT INTO support_tickets (id, ticket_number, client_id, client_name, client_email, subject, category, priority, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Open')`,
    [ticketId, `TKT-${String(count).padStart(4, "0")}`, client.id, client.name, client.email, subject, category, priority]
  );
  await query(
    "INSERT INTO ticket_messages (id, ticket_id, sender, sender_name, text) VALUES ($1, $2, 'client', $3, $4)",
    [msgId, ticketId, client.name, message]
  );

  res.json({ ok: true, ticketId });
});

router.post("/portal/tickets/:id/messages", auth, async (req: Request, res: Response) => {
  const { text } = req.body as { text: string };
  const client = req.user!;

  // verify ownership
  const ticket = await query("SELECT * FROM support_tickets WHERE id = $1 AND client_id = $2", [req.params.id, client.id]);
  if (!ticket.rows[0]) { res.status(404).json({ error: "Not found" }); return; }

  await query(
    "INSERT INTO ticket_messages (id, ticket_id, sender, sender_name, text) VALUES ($1, $2, 'client', $3, $4)",
    [genId(), req.params.id, client.name, text]
  );
  await query("UPDATE support_tickets SET updated_at = NOW() WHERE id = $1", [req.params.id]);
  res.json({ ok: true });
});

router.post("/portal/tickets/:id/read", auth, async (req: Request, res: Response) => {
  await query(
    `UPDATE ticket_messages SET read = true WHERE ticket_id = $1
     AND sender = 'admin' AND read = false
     AND ticket_id IN (SELECT id FROM support_tickets WHERE client_id = $2)`,
    [req.params.id, req.user!.id]
  );
  res.json({ ok: true });
});

router.post("/portal/tickets/:id/rate", auth, async (req: Request, res: Response) => {
  const { rating, comment } = req.body as { rating: number; comment?: string };
  await query(
    "UPDATE support_tickets SET rating = $1, rating_comment = $2 WHERE id = $3 AND client_id = $4",
    [rating, comment || "", req.params.id, req.user!.id]
  );
  res.json({ ok: true });
});

// ─── Projects ────────────────────────────────────────────────────────────────
router.get("/portal/projects", auth, async (req: Request, res: Response) => {
  const result = await query(
    "SELECT * FROM projects WHERE client_id = $1 ORDER BY created_at DESC",
    [req.user!.id]
  );
  res.json(result.rows.map(mapProject));
});

router.post("/portal/projects/:id/milestone", auth, async (req: Request, res: Response) => {
  const { milestoneId } = req.body as { milestoneId: string };
  const proj = await query("SELECT * FROM projects WHERE id = $1 AND client_id = $2", [req.params.id, req.user!.id]);
  if (!proj.rows[0]) { res.status(404).json({ error: "Not found" }); return; }

  const milestones = (proj.rows[0].milestones || []).map((m: any) =>
    m.id === milestoneId ? { ...m, done: !m.done } : m
  );
  const progress = milestones.length
    ? Math.round((milestones.filter((m: any) => m.done).length / milestones.length) * 100)
    : 0;

  await query(
    "UPDATE projects SET milestones = $1, progress = $2, updated_at = NOW() WHERE id = $3",
    [JSON.stringify(milestones), progress, req.params.id]
  );
  res.json({ ok: true });
});

// ─── Announcements ────────────────────────────────────────────────────────────
router.get("/portal/announcements", auth, async (req: Request, res: Response) => {
  const clientId = req.user!.id;
  const result = await query(
    `SELECT * FROM announcements
     WHERE target_clients = '"all"' OR target_clients @> $1::jsonb
     ORDER BY pinned DESC, created_at DESC`,
    [JSON.stringify([clientId])]
  );
  res.json(result.rows.map(mapAnnouncement));
});

// ─── Files ────────────────────────────────────────────────────────────────────
router.get("/portal/files", auth, async (req: Request, res: Response) => {
  const result = await query(
    "SELECT * FROM portal_files WHERE client_id = 'all' OR client_id = $1 ORDER BY uploaded_at DESC",
    [req.user!.id]
  );
  res.json(result.rows.map(mapPortalFile));
});

// ─── Client Uploads ───────────────────────────────────────────────────────────
router.get("/portal/uploads", auth, async (req: Request, res: Response) => {
  const result = await query(
    "SELECT * FROM client_uploads WHERE client_id = $1 ORDER BY uploaded_at DESC",
    [req.user!.id]
  );
  res.json(result.rows.map(mapClientUpload));
});

router.post("/portal/uploads", auth, async (req: Request, res: Response) => {
  const { name, fileType, sizeLabel, dataUrl, description } = req.body as {
    name: string; fileType: string; sizeLabel: string; dataUrl: string; description?: string;
  };
  const id = genId();
  await query(
    `INSERT INTO client_uploads (id, client_id, name, file_type, size_label, data_url, description, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'Pending Review')`,
    [id, req.user!.id, name, fileType, sizeLabel, dataUrl, description || ""]
  );
  res.json({ ok: true, id });
});

router.delete("/portal/uploads/:id", auth, async (req: Request, res: Response) => {
  await query("DELETE FROM client_uploads WHERE id = $1 AND client_id = $2", [req.params.id, req.user!.id]);
  res.json({ ok: true });
});

// ─── Disputes ────────────────────────────────────────────────────────────────
router.get("/portal/disputes", auth, async (req: Request, res: Response) => {
  const result = await query(
    "SELECT * FROM invoice_disputes WHERE client_id = $1 ORDER BY submitted_at DESC",
    [req.user!.id]
  );
  res.json(result.rows.map(mapDispute));
});

router.post("/portal/disputes", auth, async (req: Request, res: Response) => {
  const client = req.user!;
  const { invoiceId, invoiceNumber, reason, details } = req.body as {
    invoiceId: string; invoiceNumber: string; reason: string; details?: string;
  };

  // Verify invoice belongs to client
  const inv = await query("SELECT * FROM invoices WHERE id = $1 AND client_id = $2", [invoiceId, client.id]);
  if (!inv.rows[0]) { res.status(404).json({ error: "Invoice not found" }); return; }

  const id = genId();
  await query(
    `INSERT INTO invoice_disputes (id, invoice_id, invoice_number, client_id, client_name, reason, details, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'Open')`,
    [id, invoiceId, invoiceNumber, client.id, client.name, reason, details || ""]
  );
  res.json({ ok: true, id });
});

// ─── Payment Confirmations ────────────────────────────────────────────────────
router.get("/portal/payments", auth, async (req: Request, res: Response) => {
  const result = await query(
    "SELECT * FROM payment_confirmations WHERE client_id = $1 ORDER BY submitted_at DESC",
    [req.user!.id]
  );
  res.json(result.rows.map(mapPayment));
});

router.post("/portal/payments", auth, async (req: Request, res: Response) => {
  const client = req.user!;
  const { invoiceId, invoiceNumber, reference, method, note } = req.body as {
    invoiceId: string; invoiceNumber: string; reference: string; method: string; note?: string;
  };

  const inv = await query("SELECT * FROM invoices WHERE id = $1 AND client_id = $2", [invoiceId, client.id]);
  if (!inv.rows[0]) { res.status(404).json({ error: "Invoice not found" }); return; }

  const id = genId();
  await query(
    `INSERT INTO payment_confirmations (id, invoice_id, invoice_number, client_id, client_name, reference, method, note, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Pending')`,
    [id, invoiceId, invoiceNumber, client.id, client.name, reference, method, note || ""]
  );
  res.json({ ok: true, id });
});

// ─── Profile ─────────────────────────────────────────────────────────────────
router.put("/portal/profile", auth, async (req: Request, res: Response) => {
  const { name, phone, organisation } = req.body as { name?: string; phone?: string; organisation?: string };
  await query(
    "UPDATE portal_users SET name = COALESCE($1, name), phone = COALESCE($2, phone), organisation = COALESCE($3, organisation), updated_at = NOW() WHERE id = $4",
    [name, phone, organisation, req.user!.id]
  );
  res.json({ ok: true });
});

// ─── Unread counts ────────────────────────────────────────────────────────────
router.get("/portal/unread", auth, async (req: Request, res: Response) => {
  const clientId = req.user!.id;
  const [invRes, ticketRes] = await Promise.all([
    query("SELECT COUNT(*) FROM invoices WHERE client_id = $1 AND status != 'Draft' AND viewed_by_client = false", [clientId]),
    query(
      `SELECT COUNT(*) FROM ticket_messages m
       JOIN support_tickets t ON t.id = m.ticket_id
       WHERE t.client_id = $1 AND m.sender = 'admin' AND m.read = false`,
      [clientId]
    ),
  ]);
  res.json({
    invoices: parseInt(invRes.rows[0].count),
    support: parseInt(ticketRes.rows[0].count),
  });
});

// ─── Mappers ──────────────────────────────────────────────────────────────────
function mapInvoice(row: any) {
  return {
    id: row.id,
    invoiceNumber: row.invoice_number,
    clientId: row.client_id,
    clientName: row.client_name,
    clientEmail: row.client_email,
    clientOrg: row.client_org,
    issuedDate: row.issued_date,
    dueDate: row.due_date,
    status: row.status,
    items: row.items || [],
    notes: row.notes,
    paymentTerms: row.payment_terms,
    taxRate: parseFloat(row.tax_rate),
    discountPercent: parseFloat(row.discount_percent),
    discountAmount: parseFloat(row.discount_amount),
    subtotal: parseFloat(row.subtotal),
    taxAmount: parseFloat(row.tax_amount),
    total: parseFloat(row.total),
    viewedByClient: row.viewed_by_client,
    emailSentAt: row.email_sent_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapTicket(row: any) {
  return {
    id: row.id,
    ticketNumber: row.ticket_number,
    clientId: row.client_id,
    clientName: row.client_name,
    clientEmail: row.client_email,
    subject: row.subject,
    category: row.category,
    priority: row.priority,
    status: row.status,
    assignedTo: row.assigned_to,
    rating: row.rating,
    ratingComment: row.rating_comment,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    messages: (row.messages || []).map((m: any) => ({
      id: m.id,
      sender: m.sender,
      senderName: m.sender_name,
      text: m.text,
      timestamp: m.created_at,
      read: m.read,
    })),
  };
}

function mapProject(row: any) {
  return {
    id: row.id,
    clientId: row.client_id,
    name: row.name,
    type: row.type,
    status: row.status,
    description: row.description,
    startDate: row.start_date,
    manager: row.manager,
    progress: row.progress,
    milestones: row.milestones || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapAnnouncement(row: any) {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    type: row.type,
    targetClients: row.target_clients,
    pinned: row.pinned,
    adminName: row.admin_name,
    createdAt: row.created_at,
  };
}

function mapPortalFile(row: any) {
  return {
    id: row.id,
    clientId: row.client_id,
    name: row.name,
    sizeLabel: row.size_label,
    fileType: row.file_type,
    category: row.category,
    downloadUrl: row.download_url,
    dataUrl: row.data_url,
    uploadedAt: row.uploaded_at,
    uploadedBy: row.uploaded_by,
  };
}

function mapClientUpload(row: any) {
  return {
    id: row.id,
    clientId: row.client_id,
    name: row.name,
    fileType: row.file_type,
    sizeLabel: row.size_label,
    dataUrl: row.data_url,
    description: row.description,
    status: row.status,
    adminNote: row.admin_note,
    uploadedAt: row.uploaded_at,
  };
}

function mapDispute(row: any) {
  return {
    id: row.id,
    invoiceId: row.invoice_id,
    invoiceNumber: row.invoice_number,
    clientId: row.client_id,
    clientName: row.client_name,
    reason: row.reason,
    details: row.details,
    status: row.status,
    adminNote: row.admin_note,
    submittedAt: row.submitted_at,
    resolvedAt: row.resolved_at,
  };
}

function mapPayment(row: any) {
  return {
    id: row.id,
    invoiceId: row.invoice_id,
    invoiceNumber: row.invoice_number,
    clientId: row.client_id,
    clientName: row.client_name,
    reference: row.reference,
    method: row.method,
    note: row.note,
    status: row.status,
    submittedAt: row.submitted_at,
  };
}

export { mapInvoice, mapTicket, mapProject, mapAnnouncement, mapPortalFile, mapClientUpload, mapDispute, mapPayment };
export default router;
