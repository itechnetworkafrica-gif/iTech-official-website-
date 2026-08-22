/**
 * Quote management routes
 *
 * Admin (auth required):
 *   POST   /admin/quotes              — create a new quote
 *   GET    /admin/quotes              — list all quotes
 *   GET    /admin/quotes/:id          — single quote by id
 *   PUT    /admin/quotes/:id          — update quote
 *   DELETE /admin/quotes/:id          — delete quote
 *   POST   /admin/quotes/:id/send     — mark as sent (updates sent_at + status)
 *   POST   /admin/quotes/:id/duplicate — duplicate as new draft
 *
 * Public (no auth):
 *   GET    /quote/:token              — view quote by share token
 *   POST   /quote/:token/accept       — client accepts the quote
 */
import { Router, type Request, type Response } from "express";
import { query } from "../lib/db.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();
const auth = requireAuth("admin");

/* ─── helpers ───────────────────────────────────────────────────────────── */

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

function computeTotals(
  items: QuoteItem[],
  discountType: string,
  discountValue: number,
  taxRate: number
) {
  const subtotal = items.reduce(
    (s, it) => s + Number(it.quantity) * Number(it.unitPrice),
    0
  );
  const discountAmount =
    discountType === "percent"
      ? subtotal * (discountValue / 100)
      : Math.min(discountValue, subtotal);
  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const taxAmount = afterDiscount * (taxRate / 100);
  const total = afterDiscount + taxAmount;
  return { subtotal: round2(subtotal), total: round2(total) };
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function mapRow(row: Record<string, unknown>) {
  return {
    id: row.id,
    ref: row.ref,
    token: row.token,
    status: row.status,
    clientName: row.client_name,
    clientEmail: row.client_email,
    clientPhone: row.client_phone,
    clientCompany: row.client_company,
    clientAddress: row.client_address,
    title: row.title,
    items: row.items ?? [],
    notes: row.notes,
    terms: row.terms,
    validUntil: row.valid_until,
    currency: row.currency,
    subtotal: Number(row.subtotal),
    discountType: row.discount_type,
    discountValue: Number(row.discount_value),
    taxRate: Number(row.tax_rate),
    total: Number(row.total),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    sentAt: row.sent_at,
  };
}

/* ─── Admin: create ─────────────────────────────────────────────────────── */
router.post("/admin/quotes", auth, async (req: Request, res: Response) => {
  const b = req.body as Record<string, unknown>;
  const items: QuoteItem[] = Array.isArray(b.items) ? b.items : [];
  const discountType = String(b.discountType ?? "percent");
  const discountValue = Number(b.discountValue ?? 0);
  const taxRate = Number(b.taxRate ?? 0);
  const { subtotal, total } = computeTotals(items, discountType, discountValue, taxRate);

  const result = await query(
    `INSERT INTO quotes
      (client_name, client_email, client_phone, client_company, client_address,
       title, items, notes, terms, valid_until, currency,
       subtotal, discount_type, discount_value, tax_rate, total)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
     RETURNING *`,
    [
      String(b.clientName ?? "").trim(),
      String(b.clientEmail ?? "").trim().toLowerCase(),
      String(b.clientPhone ?? "").trim(),
      String(b.clientCompany ?? "").trim(),
      String(b.clientAddress ?? "").trim(),
      String(b.title ?? "").trim() || "Untitled Quote",
      JSON.stringify(items),
      String(b.notes ?? "").trim(),
      String(b.terms ?? "").trim(),
      b.validUntil || null,
      String(b.currency ?? "USD"),
      subtotal,
      discountType,
      discountValue,
      taxRate,
      total,
    ]
  );
  res.status(201).json(mapRow(result.rows[0]));
});

/* ─── Admin: list ───────────────────────────────────────────────────────── */
router.get("/admin/quotes", auth, async (_req: Request, res: Response) => {
  const result = await query(
    `SELECT * FROM quotes ORDER BY created_at DESC`,
    []
  );
  res.json(result.rows.map(mapRow));
});

/* ─── Admin: get by id ──────────────────────────────────────────────────── */
router.get("/admin/quotes/:id", auth, async (req: Request, res: Response) => {
  const result = await query(`SELECT * FROM quotes WHERE id = $1`, [req.params.id]);
  if (!result.rows.length) { res.status(404).json({ error: "Quote not found" }); return; }
  res.json(mapRow(result.rows[0]));
});

/* ─── Admin: update ─────────────────────────────────────────────────────── */
router.put("/admin/quotes/:id", auth, async (req: Request, res: Response) => {
  const b = req.body as Record<string, unknown>;
  const items: QuoteItem[] = Array.isArray(b.items) ? b.items : [];
  const discountType = String(b.discountType ?? "percent");
  const discountValue = Number(b.discountValue ?? 0);
  const taxRate = Number(b.taxRate ?? 0);
  const { subtotal, total } = computeTotals(items, discountType, discountValue, taxRate);

  const result = await query(
    `UPDATE quotes SET
      client_name=$1, client_email=$2, client_phone=$3, client_company=$4, client_address=$5,
      title=$6, items=$7, notes=$8, terms=$9, valid_until=$10, currency=$11,
      subtotal=$12, discount_type=$13, discount_value=$14, tax_rate=$15, total=$16,
      status=CASE WHEN status='draft' THEN $17::text ELSE status END,
      updated_at=NOW()
     WHERE id=$18 RETURNING *`,
    [
      String(b.clientName ?? "").trim(),
      String(b.clientEmail ?? "").trim().toLowerCase(),
      String(b.clientPhone ?? "").trim(),
      String(b.clientCompany ?? "").trim(),
      String(b.clientAddress ?? "").trim(),
      String(b.title ?? "").trim() || "Untitled Quote",
      JSON.stringify(items),
      String(b.notes ?? "").trim(),
      String(b.terms ?? "").trim(),
      b.validUntil || null,
      String(b.currency ?? "USD"),
      subtotal,
      discountType,
      discountValue,
      taxRate,
      total,
      String(b.status ?? "draft"),
      req.params.id,
    ]
  );
  if (!result.rows.length) { res.status(404).json({ error: "Quote not found" }); return; }
  res.json(mapRow(result.rows[0]));
});

/* ─── Admin: delete ─────────────────────────────────────────────────────── */
router.delete("/admin/quotes/:id", auth, async (req: Request, res: Response) => {
  await query(`DELETE FROM quotes WHERE id = $1`, [req.params.id]);
  res.json({ ok: true });
});

/* ─── Admin: mark as sent ───────────────────────────────────────────────── */
router.post("/admin/quotes/:id/send", auth, async (req: Request, res: Response) => {
  const result = await query(
    `UPDATE quotes SET status='sent', sent_at=NOW(), updated_at=NOW()
     WHERE id=$1 AND status IN ('draft','sent') RETURNING *`,
    [req.params.id]
  );
  if (!result.rows.length) { res.status(404).json({ error: "Quote not found or already processed" }); return; }
  res.json(mapRow(result.rows[0]));
});

/* ─── Admin: update status only ─────────────────────────────────────────── */
router.patch("/admin/quotes/:id/status", auth, async (req: Request, res: Response) => {
  const { status } = req.body as { status: string };
  const valid = ["draft", "sent", "viewed", "accepted", "declined", "expired"];
  if (!valid.includes(status)) { res.status(400).json({ error: "Invalid status" }); return; }
  const result = await query(
    `UPDATE quotes SET status=$1, updated_at=NOW(),
      sent_at=CASE WHEN $1='sent' AND sent_at IS NULL THEN NOW() ELSE sent_at END
     WHERE id=$2 RETURNING *`,
    [status, req.params.id]
  );
  if (!result.rows.length) { res.status(404).json({ error: "Quote not found" }); return; }
  res.json(mapRow(result.rows[0]));
});

/* ─── Admin: duplicate ──────────────────────────────────────────────────── */
router.post("/admin/quotes/:id/duplicate", auth, async (req: Request, res: Response) => {
  const src = await query(`SELECT * FROM quotes WHERE id=$1`, [req.params.id]);
  if (!src.rows.length) { res.status(404).json({ error: "Quote not found" }); return; }
  const r = src.rows[0];
  const result = await query(
    `INSERT INTO quotes
      (client_name, client_email, client_phone, client_company, client_address,
       title, items, notes, terms, valid_until, currency,
       subtotal, discount_type, discount_value, tax_rate, total)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
     RETURNING *`,
    [
      r.client_name, r.client_email, r.client_phone, r.client_company, r.client_address,
      r.title + " (Copy)", r.items, r.notes, r.terms, r.valid_until, r.currency,
      r.subtotal, r.discount_type, r.discount_value, r.tax_rate, r.total,
    ]
  );
  res.status(201).json(mapRow(result.rows[0]));
});

/* ─── Public: view by token ─────────────────────────────────────────────── */
router.get("/quote/:token", async (req: Request, res: Response) => {
  const result = await query(
    `SELECT * FROM quotes WHERE token=$1`,
    [req.params.token]
  );
  if (!result.rows.length) { res.status(404).json({ error: "Quote not found" }); return; }
  const q = result.rows[0];
  // Mark as viewed if it was sent but not yet viewed
  if (q.status === "sent") {
    await query(`UPDATE quotes SET status='viewed', updated_at=NOW() WHERE id=$1`, [q.id]);
    q.status = "viewed";
  }
  res.json(mapRow(q));
});

/* ─── Public: accept ────────────────────────────────────────────────────── */
router.post("/quote/:token/accept", async (req: Request, res: Response) => {
  const result = await query(
    `UPDATE quotes SET status='accepted', updated_at=NOW()
     WHERE token=$1 AND status IN ('sent','viewed') RETURNING *`,
    [req.params.token]
  );
  if (!result.rows.length) {
    // Check if it exists but is already accepted
    const check = await query(`SELECT status FROM quotes WHERE token=$1`, [req.params.token]);
    if (check.rows[0]?.status === "accepted") {
      res.json({ ok: true, message: "Already accepted" });
      return;
    }
    res.status(400).json({ error: "Quote cannot be accepted in its current state" });
    return;
  }
  res.json({ ok: true, quote: mapRow(result.rows[0]) });
});

export default router;
