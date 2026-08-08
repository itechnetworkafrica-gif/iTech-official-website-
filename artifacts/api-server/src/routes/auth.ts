import { Router, type Request, type Response } from "express";
import { query } from "../lib/db.js";
import { hashPassword, verifyPassword, verifyLegacyPassword, generateSessionId } from "../lib/auth.js";
import { getSessionId } from "../middleware/requireAuth.js";

const router = Router();

const SESSION_TTL_DAYS = 30;
const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" || process.env.COOKIE_CROSS_SITE === "true",
  sameSite: (process.env.COOKIE_CROSS_SITE === "true" ? "none" : "lax") as "none" | "lax",
  maxAge: SESSION_TTL_DAYS * 24 * 60 * 60 * 1000,
  path: "/",
};

// POST /api/auth/login
router.post("/auth/login", async (req: Request, res: Response) => {
  const { email, password, userType } = req.body as {
    email: string;
    password: string;
    userType?: "client" | "admin";
  };

  if (!email || !password) {
    res.status(400).json({ error: "Email and password required" });
    return;
  }

  const result = await query(
    "SELECT * FROM portal_users WHERE email = $1 AND is_active = true",
    [email.trim().toLowerCase()]
  );

  const user = result.rows[0];
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  if (userType && user.user_type !== userType) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  // Check both new hash format and legacy btoa format
  const valid =
    (user.password_hash.includes(":") && user.password_hash.split(":").length === 2 && user.password_hash.split(":")[0].length === 64
      ? verifyPassword(password, user.password_hash)
      : false) ||
    verifyLegacyPassword(password, user.password_hash);

  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  // Create session
  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

  await query(
    `INSERT INTO portal_sessions (id, user_id, user_type, expires_at)
     VALUES ($1, $2, $3, $4)`,
    [sessionId, user.id, user.user_type, expiresAt.toISOString()]
  );

  res.cookie("portal_session", sessionId, COOKIE_OPTS);

  res.json({
    // Also returned as a bearer token: some browsers block cross-site cookies
    // when the frontend is hosted on a different domain than the API.
    token: sessionId,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      organisation: user.organisation,
      role: user.role,
      phone: user.phone,
      memberSince: user.member_since,
      tier: user.tier,
      userType: user.user_type,
    },
  });
});

// POST /api/auth/logout
router.post("/auth/logout", async (req: Request, res: Response) => {
  const sessionId = getSessionId(req);
  if (sessionId) {
    await query("DELETE FROM portal_sessions WHERE id = $1", [sessionId]);
  }
  res.clearCookie("portal_session", { path: "/" });
  res.json({ ok: true });
});

// GET /api/auth/me
router.get("/auth/me", async (req: Request, res: Response) => {
  const sessionId = getSessionId(req);
  if (!sessionId) {
    res.json({ user: null });
    return;
  }

  const result = await query(
    `SELECT s.user_id, s.user_type, u.name, u.email, u.organisation,
            u.role, u.phone, u.member_since, u.tier
     FROM portal_sessions s
     JOIN portal_users u ON u.id = s.user_id
     WHERE s.id = $1 AND s.expires_at > NOW() AND u.is_active = true`,
    [sessionId]
  );

  if (!result.rows[0]) {
    res.clearCookie("portal_session", { path: "/" });
    res.json({ user: null });
    return;
  }

  const row = result.rows[0];
  res.json({
    user: {
      id: row.user_id,
      name: row.name,
      email: row.email,
      organisation: row.organisation,
      role: row.role,
      phone: row.phone,
      memberSince: row.member_since,
      tier: row.tier,
      userType: row.user_type,
    },
  });
});

// POST /api/auth/change-password
router.post("/auth/change-password", async (req: Request, res: Response) => {
  const sessionId = getSessionId(req);
  if (!sessionId) { res.status(401).json({ error: "Not authenticated" }); return; }

  const { currentPassword, newPassword } = req.body as { currentPassword: string; newPassword: string };
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: "Both current and new password required" });
    return;
  }
  if (newPassword.length < 8) {
    res.status(400).json({ error: "New password must be at least 8 characters" });
    return;
  }

  const sessionResult = await query(
    `SELECT u.* FROM portal_sessions s JOIN portal_users u ON u.id = s.user_id
     WHERE s.id = $1 AND s.expires_at > NOW() AND u.is_active = true`,
    [sessionId]
  );

  const user = sessionResult.rows[0];
  if (!user) { res.status(401).json({ error: "Session expired" }); return; }

  const valid =
    (user.password_hash.includes(":") && user.password_hash.split(":").length === 2 && user.password_hash.split(":")[0].length === 64
      ? verifyPassword(currentPassword, user.password_hash)
      : false) ||
    verifyLegacyPassword(currentPassword, user.password_hash);

  if (!valid) { res.status(401).json({ error: "Current password is incorrect" }); return; }

  const newHash = hashPassword(newPassword);
  await query("UPDATE portal_users SET password_hash = $1, updated_at = NOW() WHERE id = $2", [newHash, user.id]);
  res.json({ ok: true });
});

export default router;
