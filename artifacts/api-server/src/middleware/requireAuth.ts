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
  /** Admin-only: allowed dashboard sections. null = full access. */
  permissions: string[] | null;
}

/** Known admin dashboard permission keys. */
export const ADMIN_PERMISSIONS = [
  "overview", "invoices", "support", "livechat", "clients",
  "team", "announcements", "reports", "files", "settings",
] as const;

export function hasPermission(user: AuthUser, key: string): boolean {
  if (user.userType !== "admin") return false;
  if (user.permissions == null) return true; // full access
  return user.permissions.includes(key);
}

/**
 * Validate a permissions grant coming from a request.
 * Returns an error message, or null when the grant is acceptable.
 * Rules: null = full access (only a full-access actor may grant it);
 * arrays must contain only known keys, and the actor may only grant
 * permissions they themselves hold.
 */
export function validatePermissionGrant(actor: AuthUser, permissions: unknown): string | null {
  if (permissions === null) {
    return actor.permissions == null ? null : "Only a full-access admin can grant full access";
  }
  if (!Array.isArray(permissions) || permissions.some((p) => typeof p !== "string")) {
    return "Invalid permissions";
  }
  if (permissions.length === 0) return "Select at least one section";
  const unknown = permissions.filter((p) => !(ADMIN_PERMISSIONS as readonly string[]).includes(p));
  if (unknown.length) return `Unknown permissions: ${unknown.join(", ")}`;
  if (actor.permissions != null) {
    const beyond = permissions.filter((p) => !actor.permissions!.includes(p));
    if (beyond.length) return "You can only grant sections you have access to yourself";
  }
  return null;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      sessionId?: string;
    }
  }
}

/**
 * Session id comes from the httpOnly cookie (same-site) or, as a fallback for
 * browsers that block cross-site cookies (frontend hosted on another domain),
 * from an Authorization: Bearer header.
 */
export function getSessionId(req: Request): string | null {
  const cookie = req.cookies?.portal_session;
  if (cookie) return cookie;
  const auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer ")) return auth.slice(7).trim() || null;
  return null;
}

async function resolveSession(req: Request): Promise<AuthUser | null> {
  const sessionId = getSessionId(req);
  if (!sessionId) return null;

  const result = await query(
    `SELECT s.id, s.user_id, s.user_type, u.name, u.email, u.organisation, u.role,
            u.phone, u.member_since, u.tier, u.is_active, u.permissions
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
    permissions: Array.isArray(row.permissions) ? row.permissions : null,
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
    req.sessionId = getSessionId(req) || undefined;
    next();
  };
}

/**
 * Admin auth + section-level permission check. An admin whose `permissions`
 * array doesn't include the section is rejected with 403.
 */
export function requirePermission(...sections: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = await resolveSession(req);
    if (!user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    if (user.userType !== "admin" || !sections.some((s) => hasPermission(user, s))) {
      res.status(403).json({ error: "You don't have access to this section" });
      return;
    }
    req.user = user;
    req.sessionId = getSessionId(req) || undefined;
    next();
  };
}

export { resolveSession };
