/**
 * Admin portal routes — all require admin auth
 */
import { Router, type Request, type Response } from "express";
import { query } from "../lib/db.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { hashPassword } from "../lib/auth.js";
import {
  mapInvoice, mapTicket, mapProject, mapAnnouncement,
  mapPortalFile, mapClientUpload, mapDispute, mapPayment,
} from "./portalRoutes.js";

const router = Router();
const auth = requireAuth("admin");

function genId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// ─── Overview / Dashboard ─────────────────────────────────────────────────────
router.get("/admin/overview", auth, async (_req: Request, res: Response) => {
  const [clients, invoices, tickets, disputes, payments] = await Promise.all([
    query("SELECT COUNT(*) FROM portal_users WHERE user_type = 'client' AND is_active = true", []),
    query("SELECT status, SUM(total) as total_amount FROM invoices GROUP BY status", []),
    query("SELECT status, COUNT(*) FROM support_tickets GROUP BY status", []),
    query("SELECT status, COUNT(*) FROM invoice_disputes GROUP BY status", []),
    query("SELECT status, COUNT(*) FROM payment_confirmations GROUP BY status", []),
  ]);

  const invoiceStats = invoices.rows.reduce((acc: any, r: any) => {
    acc[r.status] = { count: (acc[r.status]?.count || 0) + 1, amount: parseFloat(r.total_amount) };
    return acc;
  }, {});

  const allInvoices = await query("SELECT * FROM invoices ORDER BY created_at DESC", []);

  res.json({
    totalClients: parseInt(clients.rows[0].count),
    invoiceStats,
    ticketStats: tickets.rows.reduce((acc: any, r: any) => { acc[r.status] = parseInt(r.count); return acc; }, {}),
    disputeStats: disputes.rows.reduce((acc: any, r: any) => { acc[r.status] = parseInt(r.count); return acc; }, {}),
    paymentStats: payments.rows.reduce((acc: any, r: any) => { acc[r.status] = parseInt(r.count); return acc; }, {}),
  });
});

// ─── Revenue analytics ────────────────────────────────────────────────────────
router.get("/admin/revenue", auth, async (_req: Request, res: Response) => {
  const result = await query(
    `SELECT to_char(DATE_TRUNC('month', updated_at), 'Mon ''YY') as month,
            SUM(total) as revenue, COUNT(*) as invoices
     FROM invoices WHERE status = 'Paid'
     AND updated_at >= NOW() - INTERVAL '6 months'
     GROUP BY DATE_TRUNC('month', updated_at)
     ORDER BY DATE_TRUNC('month', updated_at) ASC`,
    []
  );
  res.json(result.rows.map(r => ({
    month: r.month,
    revenue: parseFloat(r.revenue),
    invoices: parseInt(r.invoices),
  })));
});

// ─── Clients CRUD ─────────────────────────────────────────────────────────────
router.get("/admin/clients", auth, async (_req: Request, res: Response) => {
  const result = await query(
    "SELECT id, name, email, organisation, role, phone, member_since, tier, is_active, created_at FROM portal_users WHERE user_type = 'client' ORDER BY created_at DESC",
    []
  );
  res.json(result.rows.map(r => ({
    id: r.id,
    name: r.name,
    email: r.email,
    organisation: r.organisation,
    role: r.role,
    phone: r.phone,
    memberSince: r.member_since,
    tier: r.tier,
    isActive: r.is_active,
    createdAt: r.created_at,
  })));
});

router.post("/admin/clients", auth, async (req: Request, res: Response) => {
  const { name, email, password, organisation, role, phone, tier } = req.body as {
    name: string; email: string; password: string;
    organisation?: string; role?: string; phone?: string; tier?: string;
  };

  if (!name || !email || !password) {
    res.status(400).json({ error: "Name, email, and password required" });
    return;
  }

  const existing = await query("SELECT id FROM portal_users WHERE email = $1", [email.toLowerCase()]);
  if (existing.rows[0]) {
    res.status(409).json({ error: "Email already registered" });
    return;
  }

  const id = `client-${genId()}`;
  const hash = hashPassword(password);
  const memberSince = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  await query(
    `INSERT INTO portal_users (id, name, email, password_hash, organisation, role, phone, member_since, tier, user_type)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'client')`,
    [id, name, email.toLowerCase(), hash, organisation || "", role || "Client", phone || "", memberSince, tier || "Standard"]
  );

  await logActivity(`Added client`, `${name} (${email})`, "Client");
  res.json({ ok: true, id });
});

router.put("/admin/clients/:id", auth, async (req: Request, res: Response) => {
  const { name, email, organisation, role, phone, tier, isActive, newPassword } = req.body as {
    name?: string; email?: string; organisation?: string; role?: string;
    phone?: string; tier?: string; isActive?: boolean; newPassword?: string;
  };

  if (email) {
    const existing = await query("SELECT id FROM portal_users WHERE email = $1 AND id != $2", [email.toLowerCase(), req.params.id]);
    if (existing.rows[0]) { res.status(409).json({ error: "Email already in use" }); return; }
  }

  let hashUpdate = "";
  const params: any[] = [name, email?.toLowerCase(), organisation, role, phone, tier, isActive, req.params.id];
  if (newPassword) {
    hashUpdate = ", password_hash = $9";
    params.push(hashPassword(newPassword));
    params[params.length - 1] = req.params.id; // shift id to last
    params.splice(7, 0, hashPassword(newPassword));
    // rebuild properly
    const hashStr = hashPassword(newPassword);
    await query(
      `UPDATE portal_users SET
        name = COALESCE($1, name), email = COALESCE($2, email), organisation = COALESCE($3, organisation),
        role = COALESCE($4, role), phone = COALESCE($5, phone), tier = COALESCE($6, tier),
        is_active = COALESCE($7, is_active), password_hash = $8, updated_at = NOW()
       WHERE id = $9`,
      [name, email?.toLowerCase(), organisation, role, phone, tier, isActive, hashStr, req.params.id]
    );
  } else {
    await query(
      `UPDATE portal_users SET
        name = COALESCE($1, name), email = COALESCE($2, email), organisation = COALESCE($3, organisation),
        role = COALESCE($4, role), phone = COALESCE($5, phone), tier = COALESCE($6, tier),
        is_active = COALESCE($7, is_active), updated_at = NOW()
       WHERE id = $8`,
      [name, email?.toLowerCase(), organisation, role, phone, tier, isActive, req.params.id]
    );
  }

  await logActivity("Updated client", req.params.id, "Client");
  res.json({ ok: true });
});

router.delete("/admin/clients/:id", auth, async (req: Request, res: Response) => {
  await query("UPDATE portal_users SET is_active = false WHERE id = $1", [req.params.id]);
  await logActivity("Deactivated client", req.params.id, "Client");
  res.json({ ok: true });
});

// ─── Invoices CRUD ────────────────────────────────────────────────────────────
router.get("/admin/invoices", auth, async (_req: Request, res: Response) => {
  const result = await query("SELECT * FROM invoices ORDER BY created_at DESC", []);
  res.json(result.rows.map(mapInvoice));
});

router.post("/admin/invoices", auth, async (req: Request, res: Response) => {
  const data = req.body as any;
  const countResult = await query("SELECT COUNT(*) FROM invoices", []);
  const count = parseInt(countResult.rows[0].count) + 1;
  const id = genId();
  const invoiceNumber = `INV-${new Date().getFullYear()}-${String(count).padStart(3, "0")}`;

  await query(
    `INSERT INTO invoices (id, invoice_number, client_id, client_name, client_email, client_org,
      issued_date, due_date, status, items, notes, payment_terms, tax_rate, discount_percent,
      discount_amount, subtotal, tax_amount, total, email_sent_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)`,
    [
      id, invoiceNumber, data.clientId, data.clientName, data.clientEmail, data.clientOrg || "",
      data.issuedDate, data.dueDate, data.status || "Draft",
      JSON.stringify(data.items || []), data.notes || "", data.paymentTerms || "Payment due within 30 days.",
      data.taxRate || 0, data.discountPercent || 0, data.discountAmount || 0,
      data.subtotal || 0, data.taxAmount || 0, data.total || 0,
      data.status === "Sent" ? new Date().toISOString() : null,
    ]
  );

  await logActivity("Created invoice", `${invoiceNumber} for ${data.clientName}`, "Invoice");
  res.json({ ok: true, id, invoiceNumber });
});

router.put("/admin/invoices/:id", auth, async (req: Request, res: Response) => {
  const data = req.body as any;
  await query(
    `UPDATE invoices SET client_id=$1, client_name=$2, client_email=$3, client_org=$4,
     issued_date=$5, due_date=$6, status=$7, items=$8, notes=$9, payment_terms=$10,
     tax_rate=$11, discount_percent=$12, discount_amount=$13, subtotal=$14, tax_amount=$15,
     total=$16, email_sent_at=COALESCE($17, email_sent_at), updated_at=NOW()
     WHERE id=$18`,
    [
      data.clientId, data.clientName, data.clientEmail, data.clientOrg || "",
      data.issuedDate, data.dueDate, data.status,
      JSON.stringify(data.items || []), data.notes || "", data.paymentTerms || "",
      data.taxRate || 0, data.discountPercent || 0, data.discountAmount || 0,
      data.subtotal || 0, data.taxAmount || 0, data.total || 0,
      data.status === "Sent" ? new Date().toISOString() : null,
      req.params.id,
    ]
  );
  await logActivity("Updated invoice", req.params.id, "Invoice");
  res.json({ ok: true });
});

router.patch("/admin/invoices/:id/status", auth, async (req: Request, res: Response) => {
  const { status } = req.body as { status: string };
  await query("UPDATE invoices SET status = $1, updated_at = NOW() WHERE id = $2", [status, req.params.id]);
  await logActivity("Updated invoice status", `→ ${status}`, "Invoice");
  res.json({ ok: true });
});

router.delete("/admin/invoices/:id", auth, async (req: Request, res: Response) => {
  const inv = await query("SELECT invoice_number FROM invoices WHERE id = $1", [req.params.id]);
  await query("DELETE FROM invoices WHERE id = $1", [req.params.id]);
  await logActivity("Deleted invoice", inv.rows[0]?.invoice_number || req.params.id, "Invoice");
  res.json({ ok: true });
});

// ─── Support Tickets ──────────────────────────────────────────────────────────
router.get("/admin/tickets", auth, async (_req: Request, res: Response) => {
  const result = await query(
    `SELECT t.*, json_agg(m ORDER BY m.created_at ASC) FILTER (WHERE m.id IS NOT NULL) as messages
     FROM support_tickets t
     LEFT JOIN ticket_messages m ON m.ticket_id = t.id
     GROUP BY t.id ORDER BY t.updated_at DESC`,
    []
  );
  res.json(result.rows.map(mapTicket));
});

router.post("/admin/tickets/:id/messages", auth, async (req: Request, res: Response) => {
  const { text } = req.body as { text: string };
  const ticket = await query("SELECT status FROM support_tickets WHERE id = $1", [req.params.id]);
  if (!ticket.rows[0]) { res.status(404).json({ error: "Not found" }); return; }

  await query(
    "INSERT INTO ticket_messages (id, ticket_id, sender, sender_name, text) VALUES ($1, $2, 'admin', 'iTech Support Team', $3)",
    [genId(), req.params.id, text]
  );

  // Auto-progress status
  if (ticket.rows[0].status === "Open") {
    await query("UPDATE support_tickets SET status = 'In Progress', updated_at = NOW() WHERE id = $1", [req.params.id]);
  } else {
    await query("UPDATE support_tickets SET updated_at = NOW() WHERE id = $1", [req.params.id]);
  }

  await logActivity("Replied to ticket", req.params.id, "Ticket");
  res.json({ ok: true });
});

router.patch("/admin/tickets/:id/status", auth, async (req: Request, res: Response) => {
  const { status } = req.body as { status: string };
  await query("UPDATE support_tickets SET status = $1, updated_at = NOW() WHERE id = $2", [status, req.params.id]);
  await logActivity("Updated ticket status", `→ ${status}`, "Ticket");
  res.json({ ok: true });
});

router.patch("/admin/tickets/:id/priority", auth, async (req: Request, res: Response) => {
  const { priority } = req.body as { priority: string };
  await query("UPDATE support_tickets SET priority = $1, updated_at = NOW() WHERE id = $2", [priority, req.params.id]);
  res.json({ ok: true });
});

router.patch("/admin/tickets/:id/assign", auth, async (req: Request, res: Response) => {
  const { assignedTo } = req.body as { assignedTo: string };
  await query("UPDATE support_tickets SET assigned_to = $1, updated_at = NOW() WHERE id = $2", [assignedTo, req.params.id]);
  res.json({ ok: true });
});

router.post("/admin/tickets/:id/read", auth, async (req: Request, res: Response) => {
  await query(
    "UPDATE ticket_messages SET read = true WHERE ticket_id = $1 AND sender = 'client' AND read = false",
    [req.params.id]
  );
  res.json({ ok: true });
});

// ─── Projects CRUD ────────────────────────────────────────────────────────────
router.get("/admin/projects", auth, async (_req: Request, res: Response) => {
  const result = await query("SELECT * FROM projects ORDER BY created_at DESC", []);
  res.json(result.rows.map(mapProject));
});

router.post("/admin/projects", auth, async (req: Request, res: Response) => {
  const data = req.body as any;
  const id = genId();
  await query(
    `INSERT INTO projects (id, client_id, name, type, status, description, start_date, manager, progress, milestones)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [id, data.clientId, data.name, data.type || "", data.status || "Active",
     data.description || "", data.startDate || "", data.manager || "iTech Network Africa Team",
     data.progress || 0, JSON.stringify(data.milestones || [])]
  );
  await logActivity("Created project", data.name, "Project");
  res.json({ ok: true, id });
});

router.put("/admin/projects/:id", auth, async (req: Request, res: Response) => {
  const data = req.body as any;
  await query(
    `UPDATE projects SET client_id=$1, name=$2, type=$3, status=$4, description=$5,
     start_date=$6, manager=$7, progress=$8, milestones=$9, updated_at=NOW()
     WHERE id=$10`,
    [data.clientId, data.name, data.type || "", data.status, data.description || "",
     data.startDate || "", data.manager || "", data.progress || 0,
     JSON.stringify(data.milestones || []), req.params.id]
  );
  await logActivity("Updated project", data.name, "Project");
  res.json({ ok: true });
});

router.delete("/admin/projects/:id", auth, async (req: Request, res: Response) => {
  await query("DELETE FROM projects WHERE id = $1", [req.params.id]);
  await logActivity("Deleted project", req.params.id, "Project");
  res.json({ ok: true });
});

router.post("/admin/projects/:id/milestone", auth, async (req: Request, res: Response) => {
  const { milestoneId } = req.body as { milestoneId: string };
  const proj = await query("SELECT milestones FROM projects WHERE id = $1", [req.params.id]);
  if (!proj.rows[0]) { res.status(404).json({ error: "Not found" }); return; }

  const milestones = (proj.rows[0].milestones || []).map((m: any) =>
    m.id === milestoneId ? { ...m, done: !m.done } : m
  );
  const progress = milestones.length
    ? Math.round((milestones.filter((m: any) => m.done).length / milestones.length) * 100)
    : 0;

  await query("UPDATE projects SET milestones = $1, progress = $2, updated_at = NOW() WHERE id = $3",
    [JSON.stringify(milestones), progress, req.params.id]);
  res.json({ ok: true });
});

// ─── Announcements CRUD ───────────────────────────────────────────────────────
router.get("/admin/announcements", auth, async (_req: Request, res: Response) => {
  const result = await query("SELECT * FROM announcements ORDER BY pinned DESC, created_at DESC", []);
  res.json(result.rows.map(mapAnnouncement));
});

router.post("/admin/announcements", auth, async (req: Request, res: Response) => {
  const { title, body, type, targetClients, pinned } = req.body as any;
  const id = genId();
  await query(
    `INSERT INTO announcements (id, title, body, type, target_clients, pinned, admin_name)
     VALUES ($1, $2, $3, $4, $5, $6, 'iTech Admin')`,
    [id, title, body, type || "info",
     JSON.stringify(targetClients ?? "all"), pinned || false]
  );
  await logActivity("Posted announcement", title, "Announcement");
  res.json({ ok: true, id });
});

router.put("/admin/announcements/:id", auth, async (req: Request, res: Response) => {
  const { title, body, type, targetClients, pinned } = req.body as any;
  await query(
    "UPDATE announcements SET title=$1, body=$2, type=$3, target_clients=$4, pinned=$5 WHERE id=$6",
    [title, body, type, JSON.stringify(targetClients ?? "all"), pinned || false, req.params.id]
  );
  await logActivity("Updated announcement", title, "Announcement");
  res.json({ ok: true });
});

router.delete("/admin/announcements/:id", auth, async (req: Request, res: Response) => {
  await query("DELETE FROM announcements WHERE id = $1", [req.params.id]);
  res.json({ ok: true });
});

// ─── Files ────────────────────────────────────────────────────────────────────
router.get("/admin/files", auth, async (_req: Request, res: Response) => {
  const result = await query("SELECT * FROM portal_files ORDER BY uploaded_at DESC", []);
  res.json(result.rows.map(mapPortalFile));
});

router.post("/admin/files", auth, async (req: Request, res: Response) => {
  const { clientId, name, sizeLabel, fileType, category, downloadUrl, dataUrl } = req.body as any;
  const id = genId();
  await query(
    `INSERT INTO portal_files (id, client_id, name, size_label, file_type, category, download_url, data_url, uploaded_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'iTech Admin')`,
    [id, clientId || "all", name, sizeLabel || "—", fileType || "PDF", category || "Other", downloadUrl || "#", dataUrl || null]
  );
  await logActivity("Uploaded file", name, "File");
  res.json({ ok: true, id });
});

router.delete("/admin/files/:id", auth, async (req: Request, res: Response) => {
  await query("DELETE FROM portal_files WHERE id = $1", [req.params.id]);
  res.json({ ok: true });
});

// ─── Client Uploads ───────────────────────────────────────────────────────────
router.get("/admin/uploads", auth, async (_req: Request, res: Response) => {
  const result = await query("SELECT * FROM client_uploads ORDER BY uploaded_at DESC", []);
  res.json(result.rows.map(mapClientUpload));
});

router.patch("/admin/uploads/:id", auth, async (req: Request, res: Response) => {
  const { status, adminNote } = req.body as { status: string; adminNote?: string };
  await query(
    "UPDATE client_uploads SET status = $1, admin_note = COALESCE($2, admin_note) WHERE id = $3",
    [status, adminNote, req.params.id]
  );
  await logActivity("Updated upload status", `→ ${status}`, "File");
  res.json({ ok: true });
});

router.delete("/admin/uploads/:id", auth, async (req: Request, res: Response) => {
  await query("DELETE FROM client_uploads WHERE id = $1", [req.params.id]);
  res.json({ ok: true });
});

// ─── Payment Confirmations ────────────────────────────────────────────────────
router.get("/admin/payments", auth, async (_req: Request, res: Response) => {
  const result = await query("SELECT * FROM payment_confirmations ORDER BY submitted_at DESC", []);
  res.json(result.rows.map(mapPayment));
});

router.patch("/admin/payments/:id", auth, async (req: Request, res: Response) => {
  const { status } = req.body as { status: string };
  await query("UPDATE payment_confirmations SET status = $1 WHERE id = $2", [status, req.params.id]);
  if (status === "Verified") {
    const payment = await query("SELECT invoice_id FROM payment_confirmations WHERE id = $1", [req.params.id]);
    if (payment.rows[0]) {
      await query("UPDATE invoices SET status = 'Paid', updated_at = NOW() WHERE id = $1", [payment.rows[0].invoice_id]);
    }
  }
  await logActivity("Updated payment status", `→ ${status}`, "Invoice");
  res.json({ ok: true });
});

// ─── Disputes ────────────────────────────────────────────────────────────────
router.get("/admin/disputes", auth, async (_req: Request, res: Response) => {
  const result = await query("SELECT * FROM invoice_disputes ORDER BY submitted_at DESC", []);
  res.json(result.rows.map(mapDispute));
});

router.patch("/admin/disputes/:id", auth, async (req: Request, res: Response) => {
  const { status, adminNote } = req.body as { status: string; adminNote?: string };
  await query(
    `UPDATE invoice_disputes SET status = $1, admin_note = COALESCE($2, admin_note),
     resolved_at = CASE WHEN $1 = 'Resolved' THEN NOW() ELSE resolved_at END
     WHERE id = $3`,
    [status, adminNote, req.params.id]
  );
  await logActivity("Updated dispute status", `→ ${status}`, "Invoice");
  res.json({ ok: true });
});

// ─── Quick Replies ────────────────────────────────────────────────────────────
router.get("/admin/quick-replies", auth, async (_req: Request, res: Response) => {
  const result = await query("SELECT * FROM quick_replies ORDER BY created_at ASC", []);
  if (result.rows.length === 0) {
    // Seed defaults
    const defaults = [
      { id: "qr-1", title: "Acknowledge Receipt", category: "General", body: "Thank you for reaching out. We've received your message and a member of our team will get back to you within 24 hours." },
      { id: "qr-2", title: "Working on It", category: "Technical", body: "We're currently investigating the issue you reported. We'll update you as soon as we have more information." },
      { id: "qr-3", title: "Request More Info", category: "General", body: "To help resolve your issue faster, could you please provide more details? Specifically: steps to reproduce the problem, any error messages, and your browser/device information." },
      { id: "qr-4", title: "Issue Resolved", category: "Technical", body: "We're happy to let you know that the issue has been resolved. Please let us know if you experience anything further." },
      { id: "qr-5", title: "Invoice Confirmation", category: "Billing", body: "Thank you for your payment confirmation. We'll verify and mark your invoice as paid within one business day." },
    ];
    for (const d of defaults) {
      await query("INSERT INTO quick_replies (id, title, body, category) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING",
        [d.id, d.title, d.body, d.category]);
    }
    res.json(defaults);
    return;
  }
  res.json(result.rows.map(r => ({ id: r.id, title: r.title, body: r.body, category: r.category })));
});

router.post("/admin/quick-replies", auth, async (req: Request, res: Response) => {
  const { title, body, category } = req.body as { title: string; body: string; category: string };
  const id = genId();
  await query("INSERT INTO quick_replies (id, title, body, category) VALUES ($1, $2, $3, $4)", [id, title, body, category || "General"]);
  res.json({ ok: true, id });
});

router.delete("/admin/quick-replies/:id", auth, async (req: Request, res: Response) => {
  await query("DELETE FROM quick_replies WHERE id = $1", [req.params.id]);
  res.json({ ok: true });
});

// ─── Client Notes ─────────────────────────────────────────────────────────────
router.get("/admin/notes/:clientId", auth, async (req: Request, res: Response) => {
  const result = await query(
    "SELECT * FROM client_notes WHERE client_id = $1 ORDER BY pinned DESC, created_at DESC",
    [req.params.clientId]
  );
  res.json(result.rows.map(r => ({
    id: r.id, clientId: r.client_id, text: r.text, authorName: r.author_name, pinned: r.pinned, createdAt: r.created_at,
  })));
});

router.post("/admin/notes", auth, async (req: Request, res: Response) => {
  const { clientId, text, authorName, pinned } = req.body as { clientId: string; text: string; authorName?: string; pinned?: boolean };
  const id = genId();
  await query(
    "INSERT INTO client_notes (id, client_id, text, author_name, pinned) VALUES ($1, $2, $3, $4, $5)",
    [id, clientId, text, authorName || "Admin", pinned || false]
  );
  res.json({ ok: true, id });
});

router.delete("/admin/notes/:id", auth, async (req: Request, res: Response) => {
  await query("DELETE FROM client_notes WHERE id = $1", [req.params.id]);
  res.json({ ok: true });
});

// ─── Invoice Templates ────────────────────────────────────────────────────────
router.get("/admin/invoice-templates", auth, async (_req: Request, res: Response) => {
  const result = await query("SELECT * FROM invoice_templates ORDER BY created_at ASC", []);
  if (result.rows.length === 0) {
    const defaults = [
      { id: "tpl-1", name: "Web Development Package", items: JSON.stringify([{ id: "1", description: "Website Design & Development", qty: 1, rate: 1500, amount: 1500 }, { id: "2", description: "Domain & Hosting Setup (1 Year)", qty: 1, rate: 150, amount: 150 }]), notes: "Thank you for choosing iTech Network Africa.", payment_terms: "Payment due within 30 days.", tax_rate: 0 },
      { id: "tpl-2", name: "Monthly Maintenance", items: JSON.stringify([{ id: "1", description: "Monthly Website Maintenance & Updates", qty: 1, rate: 200, amount: 200 }]), notes: "Recurring monthly service.", payment_terms: "Due on the 1st of each month.", tax_rate: 0 },
      { id: "tpl-3", name: "AI & Automation Setup", items: JSON.stringify([{ id: "1", description: "AI Integration & Automation Setup", qty: 1, rate: 2500, amount: 2500 }]), notes: "Includes 30 days post-delivery support.", payment_terms: "50% upfront, 50% on delivery.", tax_rate: 0 },
    ];
    for (const d of defaults) {
      await query("INSERT INTO invoice_templates (id, name, items, notes, payment_terms, tax_rate) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING",
        [d.id, d.name, d.items, d.notes, d.payment_terms, d.tax_rate]);
    }
    res.json(defaults.map(d => ({ id: d.id, name: d.name, items: JSON.parse(d.items), notes: d.notes, paymentTerms: d.payment_terms, taxRate: d.tax_rate })));
    return;
  }
  res.json(result.rows.map(r => ({ id: r.id, name: r.name, items: r.items, notes: r.notes, paymentTerms: r.payment_terms, taxRate: parseFloat(r.tax_rate) })));
});

router.post("/admin/invoice-templates", auth, async (req: Request, res: Response) => {
  const { name, items, notes, paymentTerms, taxRate } = req.body as any;
  const id = genId();
  await query("INSERT INTO invoice_templates (id, name, items, notes, payment_terms, tax_rate) VALUES ($1,$2,$3,$4,$5,$6)",
    [id, name, JSON.stringify(items || []), notes || "", paymentTerms || "", taxRate || 0]);
  res.json({ ok: true, id });
});

router.delete("/admin/invoice-templates/:id", auth, async (req: Request, res: Response) => {
  await query("DELETE FROM invoice_templates WHERE id = $1", [req.params.id]);
  res.json({ ok: true });
});

// ─── Activity Log ─────────────────────────────────────────────────────────────
router.get("/admin/activity", auth, async (_req: Request, res: Response) => {
  const result = await query("SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 100", []);
  res.json(result.rows.map(r => ({
    id: r.id, action: r.action, detail: r.detail, entity: r.entity,
    adminName: r.admin_name, timestamp: r.created_at,
  })));
});

// ─── Unread count ─────────────────────────────────────────────────────────────
router.get("/admin/unread", auth, async (_req: Request, res: Response) => {
  const result = await query(
    `SELECT COUNT(*) FROM ticket_messages m
     JOIN support_tickets t ON t.id = m.ticket_id
     WHERE m.sender = 'client' AND m.read = false`,
    []
  );
  res.json({ unread: parseInt(result.rows[0].count) });
});

// ─── Helper ───────────────────────────────────────────────────────────────────
async function logActivity(action: string, detail: string, entity: string) {
  await query(
    "INSERT INTO activity_log (id, action, detail, entity, admin_name) VALUES ($1, $2, $3, $4, 'iTech Admin')",
    [genId(), action, detail, entity]
  );
}

export default router;
