/**
 * Partnership applications
 *  - Public POST /partnerships/apply     (website form, rate-limited)
 *  - Admin  GET   /admin/partnerships    (list, requires 'partnerships' permission)
 *  - Admin  PATCH /admin/partnerships/:id (status / notes)
 */
import { Router, type Request, type Response } from "express";
import { query } from "../lib/db.js";
import { requirePermission } from "../middleware/requireAuth.js";

const router: ReturnType<typeof Router> = Router();
const permPartnerships = requirePermission("partnerships");

function genId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/* Per-IP in-memory rate limiter (mirrors the public ticket endpoint). */
const attempts = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  entry.count += 1;
  if (attempts.size > 10_000) {
    for (const [k, v] of attempts) if (v.resetAt < now) attempts.delete(k);
  }
  return entry.count <= LIMIT;
}

const PARTNERSHIP_TYPES = [
  "Technology Partner", "Reseller / Channel Partner", "NGO / Non-Profit",
  "Training & Education", "Government / Public Sector", "Investor / Strategic", "General",
];

// ─── Public: submit a partnership application ────────────────────────────────
router.post("/partnerships/apply", async (req: Request, res: Response) => {
  if (!rateLimit(req.ip || "unknown")) {
    res.status(429).json({ error: "Too many submissions. Please try again later." });
    return;
  }
  const { name, email, phone, organisation, website, country, partnershipType, message } =
    req.body as Record<string, string | undefined>;

  const cleanName = (name || "").trim().slice(0, 120);
  const cleanEmail = (email || "").trim().toLowerCase().slice(0, 200);
  const cleanMessage = (message || "").trim().slice(0, 5000);
  const cleanOrg = (organisation || "").trim().slice(0, 160);
  if (!cleanName || !cleanEmail || !cleanMessage || !cleanOrg) {
    res.status(400).json({ error: "Name, email, organisation, and message are required" });
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    res.status(400).json({ error: "Valid email required" });
    return;
  }
  const type = PARTNERSHIP_TYPES.includes((partnershipType || "").trim())
    ? (partnershipType as string).trim()
    : "General";

  const id = genId();
  await query(
    `INSERT INTO partnership_applications
       (id, name, email, phone, organisation, website, country, partnership_type, message)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      id, cleanName, cleanEmail,
      (phone || "").trim().slice(0, 40),
      cleanOrg,
      (website || "").trim().slice(0, 200),
      (country || "").trim().slice(0, 80),
      type, cleanMessage,
    ]
  );
  res.json({ ok: true, id });
});

function mapApplication(r: Record<string, unknown>) {
  return {
    id: r.id, name: r.name, email: r.email, phone: r.phone,
    organisation: r.organisation, website: r.website, country: r.country,
    partnershipType: r.partnership_type, message: r.message, status: r.status,
    adminNotes: r.admin_notes, createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

// ─── Admin: list applications ────────────────────────────────────────────────
router.get("/admin/partnerships", permPartnerships, async (_req: Request, res: Response) => {
  const result = await query(
    "SELECT * FROM partnership_applications ORDER BY created_at DESC",
    []
  );
  res.json(result.rows.map(mapApplication));
});

// ─── Admin: update status / notes ────────────────────────────────────────────
const STATUSES = ["New", "In Review", "Approved", "Declined"];

router.patch("/admin/partnerships/:id", permPartnerships, async (req: Request, res: Response) => {
  const { status, adminNotes } = req.body as { status?: string; adminNotes?: string };
  const sets: string[] = [];
  const params: unknown[] = [];
  if (status !== undefined) {
    if (!STATUSES.includes(status)) {
      res.status(400).json({ error: "Invalid status" });
      return;
    }
    params.push(status);
    sets.push(`status = $${params.length}`);
  }
  if (adminNotes !== undefined) {
    params.push(String(adminNotes).slice(0, 5000));
    sets.push(`admin_notes = $${params.length}`);
  }
  if (!sets.length) {
    res.status(400).json({ error: "Nothing to update" });
    return;
  }
  params.push(req.params.id);
  const result = await query(
    `UPDATE partnership_applications SET ${sets.join(", ")}, updated_at = NOW()
     WHERE id = $${params.length} RETURNING *`,
    params
  );
  if (!result.rows[0]) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(mapApplication(result.rows[0]));
});

export default router;
