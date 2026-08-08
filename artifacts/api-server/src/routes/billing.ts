/**
 * Billing / payment-verification routes
 *
 * Public:
 *   POST /billing/submit  — visitor submits deposit transaction ID for review
 *
 * Admin:
 *   GET  /admin/billing          — list all submissions
 *   PATCH /admin/billing/:id     — update status (Verified | Rejected)
 */
import { Router, type Request, type Response } from "express";
import { query } from "../lib/db.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { runAIPaymentReview } from "../lib/aiPaymentReview.js";

const router = Router();
const auth = requireAuth("admin");

// ─── Rate limiting (public endpoint) ─────────────────────────────────────────
const rateMap = new Map<string, number>();
function rateLimit(ip: string): boolean {
  const now = Date.now();
  const last = rateMap.get(ip) ?? 0;
  if (now - last < 60_000) return false; // 1 submission per minute per IP
  rateMap.set(ip, now);
  return true;
}

function genId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// ─── Public: submit payment verification ─────────────────────────────────────
router.post("/billing/submit", async (req: Request, res: Response) => {
  if (!rateLimit(req.ip || "unknown")) {
    res.status(429).json({ error: "Too many submissions. Please wait a minute and try again." });
    return;
  }

  const {
    name, email, phone, plan, category,
    amount, currency, method, transaction_id, payment_date, notes,
  } = req.body as Record<string, string | undefined>;

  // Validate required fields
  const cleanName = (name || "").trim().slice(0, 150);
  const cleanEmail = (email || "").trim().toLowerCase().slice(0, 200);
  const cleanPlan = (plan || "").trim().slice(0, 200);
  const cleanAmount = (amount || "").trim().slice(0, 50);
  const cleanMethod = (method || "").trim().slice(0, 50);
  const cleanTxId = (transaction_id || "").trim().slice(0, 200);

  if (!cleanName || !cleanEmail || !cleanPlan || !cleanAmount || !cleanMethod || !cleanTxId) {
    res.status(400).json({ error: "Name, email, plan, amount, payment method and transaction ID are all required." });
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    res.status(400).json({ error: "Please enter a valid email address." });
    return;
  }

  // Generate human-readable reference
  const seqRes = await query("SELECT nextval('billing_ref_seq') AS n", []);
  const n = parseInt(seqRes.rows[0].n);
  const ref = `BIL-${String(n).padStart(4, "0")}`;
  const id = genId();

  const cleanPhone    = (phone        || "").trim().slice(0, 40);
  const cleanCat      = (category     || "").trim().slice(0, 100);
  const cleanCurrency = (currency     || "USD").trim().slice(0, 10);
  const cleanDate     = (payment_date || "").trim().slice(0, 30);
  const cleanNotes    = (notes        || "").trim().slice(0, 1000);

  await query(
    `INSERT INTO billing_submissions
       (id, ref, name, email, phone, plan, category, amount, currency, method, transaction_id, payment_date, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
    [id, ref, cleanName, cleanEmail, cleanPhone, cleanPlan, cleanCat, cleanAmount, cleanCurrency, cleanMethod, cleanTxId, cleanDate, cleanNotes]
  );

  // Fire AI review asynchronously — don't block the client response
  setImmediate(() => {
    runAIPaymentReview({
      id, name: cleanName, email: cleanEmail, phone: cleanPhone,
      plan: cleanPlan, amount: cleanAmount, currency: cleanCurrency,
      method: cleanMethod, transaction_id: cleanTxId,
      payment_date: cleanDate, notes: cleanNotes,
    }).catch(() => { /* logged inside runAIPaymentReview */ });
  });

  res.json({ ok: true, ref });
});

// ─── Admin: list all submissions ──────────────────────────────────────────────
router.get("/admin/billing", auth, async (_req: Request, res: Response) => {
  const result = await query(
    "SELECT * FROM billing_submissions ORDER BY created_at DESC",
    []
  );
  res.json(result.rows.map((r: any) => ({
    id: r.id,
    ref: r.ref,
    name: r.name,
    email: r.email,
    phone: r.phone,
    plan: r.plan,
    category: r.category,
    amount: r.amount,
    currency: r.currency,
    method: r.method,
    transactionId: r.transaction_id,
    paymentDate: r.payment_date,
    notes: r.notes,
    status: r.status,
    adminNotes: r.admin_notes,
    createdAt: r.created_at,
    // AI fraud detection fields
    aiRiskLevel:     r.ai_risk_level     ?? "pending",
    aiRiskScore:     r.ai_risk_score     ?? null,
    aiFlags:         r.ai_flags          ?? [],
    aiSummary:       r.ai_summary        ?? "",
    aiRecommendation:r.ai_recommendation ?? "",
    aiReviewedAt:    r.ai_reviewed_at    ?? null,
  })));
});

// ─── Admin: manually re-trigger AI review ────────────────────────────────────
router.post("/admin/billing/:id/ai-review", auth, async (req: Request, res: Response) => {
  const row = await query(
    "SELECT * FROM billing_submissions WHERE id = $1",
    [req.params.id]
  );
  if (!row.rows.length) { res.status(404).json({ error: "Not found" }); return; }
  const r = row.rows[0];

  // Reset to pending so UI shows spinner
  await query(
    `UPDATE billing_submissions SET ai_risk_level = 'pending', ai_reviewed_at = NULL WHERE id = $1`,
    [r.id]
  );

  setImmediate(() => {
    runAIPaymentReview({
      id: r.id, name: r.name, email: r.email, phone: r.phone,
      plan: r.plan, amount: r.amount, currency: r.currency,
      method: r.method, transaction_id: r.transaction_id,
      payment_date: r.payment_date, notes: r.notes,
    }).catch(() => {});
  });

  res.json({ ok: true, message: "AI review started — refresh in a moment." });
});

// ─── Admin: update submission status ─────────────────────────────────────────
router.patch("/admin/billing/:id", auth, async (req: Request, res: Response) => {
  const { status, adminNotes } = req.body as { status?: string; adminNotes?: string };
  const allowed = ["Pending", "Verified", "Rejected"];
  if (!status || !allowed.includes(status)) {
    res.status(400).json({ error: "Status must be Pending, Verified, or Rejected." });
    return;
  }
  await query(
    `UPDATE billing_submissions
     SET status = $1, admin_notes = $2, updated_at = NOW()
     WHERE id = $3`,
    [status, (adminNotes || "").trim().slice(0, 1000), req.params.id]
  );
  res.json({ ok: true });
});

// ─── Admin: delete submission ─────────────────────────────────────────────────
router.delete("/admin/billing/:id", auth, async (req: Request, res: Response) => {
  await query("DELETE FROM billing_submissions WHERE id = $1", [req.params.id]);
  res.json({ ok: true });
});

export default router;
