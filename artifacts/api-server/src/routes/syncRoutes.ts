/**
 * Bulk sync endpoints — allows the frontend to push/pull all portal data at once.
 * Used for cross-device persistence: after login, fetch all data; after writes, push all data.
 */
import { Router, type Request, type Response } from "express";
import { query } from "../lib/db.js";
import { requireAuth, hasPermission } from "../middleware/requireAuth.js";

const router = Router();

function genId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// ─── Client bulk sync ─────────────────────────────────────────────────────────

// POST /api/portal/bulk-sync — client pushes all their data to the server
router.post("/portal/bulk-sync", requireAuth("client"), async (req: Request, res: Response) => {
  const clientId = req.user!.id;
  const { tickets, uploads, disputes, payments } = req.body as {
    tickets?: any[]; uploads?: any[]; disputes?: any[]; payments?: any[];
  };

  // Only sync client-side writable data (admin controls invoices, projects, etc.)
  const ops: Promise<any>[] = [];

  if (uploads?.length) {
    for (const f of uploads) {
      ops.push(
        query(
          `INSERT INTO client_uploads (id, client_id, name, file_type, size_label, data_url, description, status)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
           ON CONFLICT (id) DO UPDATE SET data_url=EXCLUDED.data_url, status=EXCLUDED.status, admin_note=EXCLUDED.admin_note`,
          [f.id || genId(), clientId, f.name, f.fileType || "", f.sizeLabel || "", f.dataUrl || "", f.description || "", f.status || "Pending Review"]
        )
      );
    }
  }

  if (disputes?.length) {
    for (const d of disputes) {
      ops.push(
        query(
          `INSERT INTO invoice_disputes (id, invoice_id, invoice_number, client_id, client_name, reason, details, status)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
           ON CONFLICT (id) DO NOTHING`,
          [d.id || genId(), d.invoiceId, d.invoiceNumber, clientId, req.user!.name, d.reason, d.details || "", d.status || "Open"]
        )
      );
    }
  }

  if (payments?.length) {
    for (const p of payments) {
      ops.push(
        query(
          `INSERT INTO payment_confirmations (id, invoice_id, invoice_number, client_id, client_name, reference, method, note, status)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
           ON CONFLICT (id) DO NOTHING`,
          [p.id || genId(), p.invoiceId, p.invoiceNumber, clientId, req.user!.name, p.reference, p.method, p.note || "", p.status || "Pending"]
        )
      );
    }
  }

  await Promise.all(ops);
  res.json({ ok: true });
});

// ─── Admin bulk sync ──────────────────────────────────────────────────────────

// GET /api/admin/data — fetch all admin data at once
router.get("/admin/data", requireAuth("admin"), async (req: Request, res: Response) => {
  const [invoices, tickets, projects, announcements, files, uploads, disputes, payments, clients, qrs, templates] = await Promise.all([
    query("SELECT * FROM invoices ORDER BY created_at DESC", []),
    query(`SELECT t.*, json_agg(m ORDER BY m.created_at ASC) FILTER (WHERE m.id IS NOT NULL) as messages
           FROM support_tickets t LEFT JOIN ticket_messages m ON m.ticket_id = t.id
           GROUP BY t.id ORDER BY t.updated_at DESC`, []),
    query("SELECT * FROM projects ORDER BY created_at DESC", []),
    query("SELECT * FROM announcements ORDER BY pinned DESC, created_at DESC", []),
    query("SELECT * FROM portal_files ORDER BY uploaded_at DESC", []),
    query("SELECT * FROM client_uploads ORDER BY uploaded_at DESC", []),
    query("SELECT * FROM invoice_disputes ORDER BY submitted_at DESC", []),
    query("SELECT * FROM payment_confirmations ORDER BY submitted_at DESC", []),
    query("SELECT id, name, email, organisation, role, phone, member_since, tier, is_active, created_at FROM portal_users WHERE user_type = 'client' ORDER BY created_at DESC", []),
    query("SELECT * FROM quick_replies ORDER BY created_at ASC", []),
    query("SELECT * FROM invoice_templates ORDER BY created_at ASC", []),
  ]);

  // Only return the sections this admin is allowed to see
  const can = (key: string) => hasPermission(req.user!, key);
  res.json({
    invoices: can("invoices") || can("overview") || can("reports") ? invoices.rows.map(mapInvoice) : [],
    tickets: can("support") || can("overview") ? tickets.rows.map(mapTicket) : [],
    projects: can("clients") ? projects.rows.map(mapProject) : [],
    announcements: can("announcements") ? announcements.rows.map(mapAnnouncement) : [],
    files: can("files") ? files.rows : [],
    uploads: can("files") ? uploads.rows : [],
    disputes: can("invoices") ? disputes.rows : [],
    payments: can("invoices") ? payments.rows : [],
    clients: can("clients") || can("overview") ? clients.rows.map(r => ({
      id: r.id, name: r.name, email: r.email, organisation: r.organisation,
      role: r.role, phone: r.phone, memberSince: r.member_since,
      tier: r.tier, isActive: r.is_active, createdAt: r.created_at,
    })) : [],
    quickReplies: can("support") || can("livechat") ? qrs.rows : [],
    invoiceTemplates: can("invoices") ? templates.rows.map(r => ({ id: r.id, name: r.name, items: r.items, notes: r.notes, paymentTerms: r.payment_terms, taxRate: parseFloat(r.tax_rate) })) : [],
  });
});

// POST /api/admin/bulk-sync — admin pushes all data to the server
router.post("/admin/bulk-sync", requireAuth("admin"), async (req: Request, res: Response) => {
  const body = req.body as {
    invoices?: any[]; tickets?: any[]; projects?: any[]; announcements?: any[];
    files?: any[]; quickReplies?: any[]; invoiceTemplates?: any[];
  };
  // Drop any sections this admin has no permission to write
  const can = (key: string) => hasPermission(req.user!, key);
  const invoices = can("invoices") ? body.invoices : undefined;
  const tickets = can("support") ? body.tickets : undefined;
  const projects = can("clients") ? body.projects : undefined;
  const announcements = can("announcements") ? body.announcements : undefined;
  const quickReplies = can("support") ? body.quickReplies : undefined;
  const invoiceTemplates = can("invoices") ? body.invoiceTemplates : undefined;

  const ops: Promise<any>[] = [];

  if (invoices?.length) {
    for (const inv of invoices) {
      ops.push(query(
        `INSERT INTO invoices (id, invoice_number, client_id, client_name, client_email, client_org, issued_date, due_date, status, items, notes, payment_terms, tax_rate, discount_percent, discount_amount, subtotal, tax_amount, total, viewed_by_client)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
         ON CONFLICT (id) DO UPDATE SET status=EXCLUDED.status, items=EXCLUDED.items, notes=EXCLUDED.notes, payment_terms=EXCLUDED.payment_terms, tax_rate=EXCLUDED.tax_rate, subtotal=EXCLUDED.subtotal, tax_amount=EXCLUDED.tax_amount, total=EXCLUDED.total, updated_at=NOW()`,
        [inv.id || genId(), inv.invoiceNumber, inv.clientId, inv.clientName, inv.clientEmail, inv.clientOrg || "",
         inv.issuedDate, inv.dueDate, inv.status || "Draft", JSON.stringify(inv.items || []),
         inv.notes || "", inv.paymentTerms || "", inv.taxRate || 0, inv.discountPercent || 0,
         inv.discountAmount || 0, inv.subtotal || 0, inv.taxAmount || 0, inv.total || 0, inv.viewedByClient || false]
      ));
    }
  }

  if (tickets?.length) {
    for (const t of tickets) {
      await query(
        `INSERT INTO support_tickets (id, ticket_number, client_id, client_name, client_email, subject, category, priority, status, assigned_to, rating, rating_comment)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         ON CONFLICT (id) DO UPDATE SET status=EXCLUDED.status, priority=EXCLUDED.priority, assigned_to=EXCLUDED.assigned_to, rating=EXCLUDED.rating, rating_comment=EXCLUDED.rating_comment, updated_at=NOW()`,
        [t.id || genId(), t.ticketNumber, t.clientId, t.clientName, t.clientEmail, t.subject,
         t.category || "General", t.priority || "Medium", t.status || "Open",
         t.assignedTo || "", t.rating || null, t.ratingComment || null]
      );
      if (t.messages?.length) {
        for (const m of t.messages) {
          await query(
            `INSERT INTO ticket_messages (id, ticket_id, sender, sender_name, text, read, created_at)
             VALUES ($1,$2,$3,$4,$5,$6,$7)
             ON CONFLICT (id) DO NOTHING`,
            [m.id || genId(), t.id, m.sender, m.senderName, m.text, m.read || false, m.timestamp || new Date().toISOString()]
          );
        }
      }
    }
  }

  if (projects?.length) {
    for (const p of projects) {
      ops.push(query(
        `INSERT INTO projects (id, client_id, name, type, status, description, start_date, manager, progress, milestones)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, status=EXCLUDED.status, description=EXCLUDED.description, progress=EXCLUDED.progress, milestones=EXCLUDED.milestones, updated_at=NOW()`,
        [p.id || genId(), p.clientId, p.name, p.type || "", p.status || "Active", p.description || "",
         p.startDate || "", p.manager || "iTech Network Africa Team", p.progress || 0, JSON.stringify(p.milestones || [])]
      ));
    }
  }

  if (announcements?.length) {
    for (const a of announcements) {
      ops.push(query(
        `INSERT INTO announcements (id, title, body, type, target_clients, pinned, admin_name, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, body=EXCLUDED.body, pinned=EXCLUDED.pinned`,
        [a.id || genId(), a.title, a.body, a.type || "info",
         JSON.stringify(a.targetClients ?? "all"), a.pinned || false,
         a.adminName || "iTech Admin", a.createdAt || new Date().toISOString()]
      ));
    }
  }

  if (quickReplies?.length) {
    for (const qr of quickReplies) {
      ops.push(query(
        `INSERT INTO quick_replies (id, title, body, category) VALUES ($1,$2,$3,$4)
         ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, body=EXCLUDED.body, category=EXCLUDED.category`,
        [qr.id || genId(), qr.title, qr.body, qr.category || "General"]
      ));
    }
  }

  if (invoiceTemplates?.length) {
    for (const t of invoiceTemplates) {
      ops.push(query(
        `INSERT INTO invoice_templates (id, name, items, notes, payment_terms, tax_rate) VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, items=EXCLUDED.items, notes=EXCLUDED.notes`,
        [t.id || genId(), t.name, JSON.stringify(t.items || []), t.notes || "", t.paymentTerms || "", t.taxRate || 0]
      ));
    }
  }

  await Promise.all(ops);
  res.json({ ok: true });
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function mapInvoice(row: any) {
  return { id: row.id, invoiceNumber: row.invoice_number, clientId: row.client_id, clientName: row.client_name, clientEmail: row.client_email, clientOrg: row.client_org, issuedDate: row.issued_date, dueDate: row.due_date, status: row.status, items: row.items || [], notes: row.notes, paymentTerms: row.payment_terms, taxRate: parseFloat(row.tax_rate), discountPercent: parseFloat(row.discount_percent), discountAmount: parseFloat(row.discount_amount), subtotal: parseFloat(row.subtotal), taxAmount: parseFloat(row.tax_amount), total: parseFloat(row.total), viewedByClient: row.viewed_by_client, emailSentAt: row.email_sent_at, createdAt: row.created_at, updatedAt: row.updated_at };
}
function mapTicket(row: any) {
  return { id: row.id, ticketNumber: row.ticket_number, clientId: row.client_id, clientName: row.client_name, clientEmail: row.client_email, subject: row.subject, category: row.category, priority: row.priority, status: row.status, assignedTo: row.assigned_to, rating: row.rating, ratingComment: row.rating_comment, createdAt: row.created_at, updatedAt: row.updated_at, messages: (row.messages || []).map((m: any) => ({ id: m.id, sender: m.sender, senderName: m.sender_name, text: m.text, timestamp: m.created_at, read: m.read })) };
}
function mapProject(row: any) {
  return { id: row.id, clientId: row.client_id, name: row.name, type: row.type, status: row.status, description: row.description, startDate: row.start_date, manager: row.manager, progress: row.progress, milestones: row.milestones || [] };
}
function mapAnnouncement(row: any) {
  return { id: row.id, title: row.title, body: row.body, type: row.type, targetClients: row.target_clients, pinned: row.pinned, adminName: row.admin_name, createdAt: row.created_at };
}

export default router;
