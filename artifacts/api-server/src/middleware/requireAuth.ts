import { Request, Response, NextFunction } from "express";
import { query } from "../lib/db.js";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  organisation: string;
  role: string;
  phone: string;
  memberSince: string;
  tier: string;
  userType: "client" | "admin";
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      sessionId?: string;
    }
  }
}

async function resolveSession(req: Request): Promise<AuthUser | null> {
  const sessionId = req.cookies?.portal_session;
  if (!sessionId) return null;

  const result = await query(
    `SELECT s.id, s.user_id, s.user_type, u.name, u.email, u.organisation, u.role,
            u.phone, u.member_since, u.tier, u.is_active
     FROM portal_sessions s
     JOIN portal_users u ON u.id = s.user_id
     WHERE s.id = $1 AND s.expires_at > NOW() AND u.is_active = true`,
    [sessionId]
  );

  if (!result.rows[0]) return null;

  // Touch last_seen
  await query("UPDATE portal_sessions SET last_seen = NOW() WHERE id = $1", [sessionId]);

  const row = result.rows[0];
  return {
    id: row.user_id,
    name: row.name,
    email: row.email,
    organisation: row.organisation,
    role: row.role,
    phone: row.phone,
    memberSince: row.member_since,
    tier: row.tier,
    userType: row.user_type,
  };
}

export function requireAuth(userType?: "client" | "admin") {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = await resolveSession(req);
    if (!user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    if (userType && user.userType !== userType) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    req.user = user;
    req.sessionId = req.cookies?.portal_session;
    next();
  };
}

export { resolveSession };
