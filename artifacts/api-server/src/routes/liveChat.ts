/**
 * Live agent support chat.
 *
 * Visitor endpoints (no login; each session carries a random visitor token):
 *   POST /live-chat/start                — create a session (from Sarah handoff)
 *   GET  /live-chat/:id                  — poll status + messages (token required)
 *   POST /live-chat/:id/message          — visitor sends a message
 *   POST /live-chat/:id/close            — visitor ends the chat
 *
 * Admin/agent endpoints (admin auth):
 *   GET  /admin/live-chats               — list sessions (waiting first)
 *   GET  /admin/live-chats/:id           — session detail + messages
 *   POST /admin/live-chats/:id/assign    — assign an agent (self or teammate)
 *   POST /admin/live-chats/:id/message   — agent replies
 *   POST /admin/live-chats/:id/close     — agent closes the chat
 *
 * Team management (admin auth):
 *   GET    /admin/agents                 — list team agents (admin users)
 *   POST   /admin/agents                 — add a team agent (can log into /admin)
 *   PUT    /admin/agents/:id             — update / deactivate / reset password
 *   DELETE /admin/agents/:id             — deactivate agent
 */
import { Router, type Request, type Response } from "express";
import crypto from "node:crypto";
import { query } from "../lib/db.js";
import { requireAuth, requirePermission, validatePermissionGrant } from "../middleware/requireAuth.js";
import { hashPassword } from "../lib/auth.js";

const router = Router();
const auth = requireAuth("admin");
const permLiveChat = requirePermission("livechat");
const permTeam = requirePermission("team");

function genId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/* Simple in-memory rate limiter for public session creation (per IP). */
const startAttempts = new Map<string, { count: number; resetAt: number }>();
const START_LIMIT = 5;
const START_WINDOW_MS = 10 * 60 * 1000;

function rateLimitStart(ip: string): boolean {
  const now = Date.now();
  const entry = startAttempts.get(ip);
  if (!entry || entry.resetAt < now) {
    startAttempts.set(ip, { count: 1, resetAt: now + START_WINDOW_MS });
    return true;
  }
  entry.count += 1;
  if (startAttempts.size > 10_000) {
    for (const [k, v] of startAttempts) if (v.resetAt < now) startAttempts.delete(k);
  }
  return entry.count <= START_LIMIT;
}

/* Visitor token comes from the X-Visitor-Token header (preferred) or body. */
function visitorToken(req: Request): string {
  const header = req.headers["x-visitor-token"];
  if (typeof header === "string" && header) return header;
  const body = (req.body as { token?: string } | undefined)?.token;
  return typeof body === "string" ? body : "";
}

function mapMessage(r: any) {
  return {
    id: Number(r.id),
    sender: r.sender,
    senderName: r.sender_name,
    text: r.text,
    createdAt: r.created_at,
  };
}

function mapSession(r: any) {
  return {
    id: r.id,
    visitorName: r.visitor_name,
    visitorEmail: r.visitor_email,
    topic: r.topic,
    status: r.status,
    agentId: r.agent_id,
    agentName: r.agent_name,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

async function getSessionForVisitor(id: string, token: string) {
  const result = await query(
    "SELECT * FROM live_chat_sessions WHERE id = $1 AND visitor_token = $2",
    [id, token]
  );
  return result.rows[0] || null;
}

// ─── Visitor: start a live chat ───────────────────────────────────────────────
router.post("/live-chat/start", async (req: Request, res: Response) => {
  if (!rateLimitStart(req.ip || "unknown")) {
    res.status(429).json({ error: "Too many chat requests. Please try again in a few minutes." });
    return;
  }
  const { visitorName, visitorEmail, topic, transcript } = req.body as {
    visitorName?: string;
    visitorEmail?: string;
    topic?: string;
    transcript?: { role: string; content: string }[];
  };

  const id = `chat-${genId()}`;
  const token = crypto.randomBytes(24).toString("hex");
  const name = (visitorName || "").trim().slice(0, 80) || "Website Visitor";
  const email = (visitorEmail || "").trim().slice(0, 120);
  const cleanTopic = (topic || "").trim().slice(0, 200);

  await query(
    `INSERT INTO live_chat_sessions (id, visitor_token, visitor_name, visitor_email, topic)
     VALUES ($1, $2, $3, $4, $5)`,
    [id, token, name, email, cleanTopic]
  );

  // Preserve the last few lines of the AI conversation as context for the agent
  if (Array.isArray(transcript) && transcript.length > 0) {
    const recent = transcript.slice(-8);
    const lines = recent
      .filter((m) => m && typeof m.content === "string" && m.content.trim())
      .map((m) => `${m.role === "user" ? name : "Sarah (AI)"}: ${m.content.trim().slice(0, 500)}`)
      .join("\n");
    if (lines) {
      await query(
        `INSERT INTO live_chat_messages (session_id, sender, sender_name, text)
         VALUES ($1, 'system', 'Chat transcript', $2)`,
        [id, `Conversation with Sarah before handoff:\n\n${lines}`]
      );
    }
  }

  await query(
    `INSERT INTO live_chat_messages (session_id, sender, sender_name, text)
     VALUES ($1, 'system', 'System', $2)`,
    [id, `${name} requested a human agent. Waiting for a team member to join…`]
  );

  res.json({ sessionId: id, token });
});

// ─── Visitor: poll session ────────────────────────────────────────────────────
router.get("/live-chat/:id", async (req: Request, res: Response) => {
  const token = visitorToken(req) || String(req.query.token || "");
  const after = Number(req.query.after || 0);
  const session = await getSessionForVisitor(String(req.params.id), token);
  if (!session) { res.status(404).json({ error: "Session not found" }); return; }

  const msgs = await query(
    `SELECT * FROM live_chat_messages
     WHERE session_id = $1 AND id > $2
       AND NOT (sender = 'system' AND sender_name = 'Chat transcript')
     ORDER BY id ASC LIMIT 200`,
    [session.id, after]
  );

  res.json({
    status: session.status,
    agentName: session.agent_name,
    messages: msgs.rows.map(mapMessage),
  });
});

// ─── Respectful-language guard (server-side, cannot be bypassed) ──────────────
const OFFENSIVE_PATTERNS: RegExp[] = [
  /\b(f+u+c*k+\w*|s+h+i+t+\w*|b+i+t+c+h+\w*|a+s+s+h+o+l+e+\w*|bastard\w*|d+i+c+k+h+e+a+d+|c+u+n+t+\w*|motherf\w*|dumbass|jackass|wanker|slut\w*|whore\w*|n+i+g+g+(a|e+r)\w*|fag+ot*\w*|retard\w*)\b/i,
  /\b(stupid|idiot|useless|dumb)\s+(bot|ai|assistant|chatbot|thing|website|company|people|team|agent)\b/i,
  /\b(kill|hurt|attack)\s+(you|yourself|myself)\b/i,
];
function isOffensive(text: string): boolean {
  return OFFENSIVE_PATTERNS.some((re) => re.test(text));
}

// ─── Visitor: send message ────────────────────────────────────────────────────
router.post("/live-chat/:id/message", async (req: Request, res: Response) => {
  const { text } = req.body as { text?: string };
  const clean = (text || "").trim().slice(0, 4000);
  if (!clean) { res.status(400).json({ error: "Message required" }); return; }
  if (isOffensive(clean)) {
    res.status(422).json({
      error: "offensive_language",
      message: "Please keep the conversation respectful so our team can help you.",
    });
    return;
  }

  const session = await getSessionForVisitor(String(req.params.id), visitorToken(req));
  if (!session) { res.status(404).json({ error: "Session not found" }); return; }
  if (session.status === "closed") { res.status(409).json({ error: "Chat is closed" }); return; }

  const inserted = await query(
    `INSERT INTO live_chat_messages (session_id, sender, sender_name, text)
     VALUES ($1, 'visitor', $2, $3) RETURNING *`,
    [session.id, session.visitor_name, clean]
  );
  await query("UPDATE live_chat_sessions SET updated_at = NOW() WHERE id = $1", [session.id]);
  res.json({ ok: true, message: mapMessage(inserted.rows[0]) });
});

// ─── Visitor: close ───────────────────────────────────────────────────────────
router.post("/live-chat/:id/close", async (req: Request, res: Response) => {
  const session = await getSessionForVisitor(String(req.params.id), visitorToken(req));
  if (!session) { res.status(404).json({ error: "Session not found" }); return; }

  await query(
    "UPDATE live_chat_sessions SET status = 'closed', closed_at = NOW(), updated_at = NOW() WHERE id = $1",
    [session.id]
  );
  await query(
    `INSERT INTO live_chat_messages (session_id, sender, sender_name, text)
     VALUES ($1, 'system', 'System', 'The visitor ended the chat.')`,
    [session.id]
  );
  res.json({ ok: true });
});

// ─── Admin: list sessions ─────────────────────────────────────────────────────
router.get("/admin/live-chats", permLiveChat, async (_req: Request, res: Response) => {
  const result = await query(
    `SELECT s.*,
            (SELECT text FROM live_chat_messages m
              WHERE m.session_id = s.id AND m.sender != 'system'
              ORDER BY m.id DESC LIMIT 1) AS last_message,
            (SELECT COUNT(*) FROM live_chat_messages m
              WHERE m.session_id = s.id AND m.sender = 'visitor') AS visitor_messages
     FROM live_chat_sessions s
     WHERE s.status != 'closed' OR s.updated_at > NOW() - INTERVAL '7 days'
     ORDER BY CASE s.status WHEN 'waiting' THEN 0 WHEN 'active' THEN 1 ELSE 2 END,
              s.updated_at DESC
     LIMIT 100`,
    []
  );
  res.json(result.rows.map((r) => ({
    ...mapSession(r),
    lastMessage: r.last_message || "",
    visitorMessages: Number(r.visitor_messages || 0),
  })));
});

// ─── Admin: session detail + messages ─────────────────────────────────────────
router.get("/admin/live-chats/:id", permLiveChat, async (req: Request, res: Response) => {
  const after = Number(req.query.after || 0);
  const s = await query("SELECT * FROM live_chat_sessions WHERE id = $1", [req.params.id]);
  if (!s.rows[0]) { res.status(404).json({ error: "Not found" }); return; }

  const msgs = await query(
    "SELECT * FROM live_chat_messages WHERE session_id = $1 AND id > $2 ORDER BY id ASC LIMIT 500",
    [req.params.id, after]
  );
  res.json({ session: mapSession(s.rows[0]), messages: msgs.rows.map(mapMessage) });
});

// ─── Admin: assign agent ──────────────────────────────────────────────────────
router.post("/admin/live-chats/:id/assign", permLiveChat, async (req: Request, res: Response) => {
  // Only full-access admins can assign (or reassign) chats to team members.
  if (req.user!.permissions != null) {
    res.status(403).json({ error: "Only an admin can assign chats to team members" });
    return;
  }
  const { agentId } = req.body as { agentId?: string };
  const targetId = agentId || req.user!.id;

  const agent = await query(
    "SELECT id, name FROM portal_users WHERE id = $1 AND user_type = 'admin' AND is_active = true",
    [targetId]
  );
  if (!agent.rows[0]) { res.status(404).json({ error: "Agent not found" }); return; }

  const s = await query("SELECT * FROM live_chat_sessions WHERE id = $1", [req.params.id]);
  if (!s.rows[0]) { res.status(404).json({ error: "Session not found" }); return; }
  if (s.rows[0].status === "closed") { res.status(409).json({ error: "Chat is closed" }); return; }

  const updated = await query(
    `UPDATE live_chat_sessions
     SET agent_id = $1, agent_name = $2, status = 'active', updated_at = NOW()
     WHERE id = $3 AND status != 'closed'
     RETURNING id`,
    [agent.rows[0].id, agent.rows[0].name, req.params.id]
  );
  if (!updated.rows[0]) { res.status(409).json({ error: "Chat is closed" }); return; }
  await query(
    `INSERT INTO live_chat_messages (session_id, sender, sender_name, text)
     VALUES ($1, 'system', 'System', $2)`,
    [req.params.id, `${agent.rows[0].name} joined the chat.`]
  );
  res.json({ ok: true, agentName: agent.rows[0].name });
});

// ─── Admin: agent message ─────────────────────────────────────────────────────
router.post("/admin/live-chats/:id/message", permLiveChat, async (req: Request, res: Response) => {
  const { text } = req.body as { text?: string };
  const clean = (text || "").trim().slice(0, 4000);
  if (!clean) { res.status(400).json({ error: "Message required" }); return; }

  const s = await query("SELECT * FROM live_chat_sessions WHERE id = $1", [req.params.id]);
  if (!s.rows[0]) { res.status(404).json({ error: "Session not found" }); return; }
  if (s.rows[0].status === "closed") { res.status(409).json({ error: "Chat is closed" }); return; }

  const isFullAdmin = req.user!.permissions == null;
  if (!s.rows[0].agent_id) {
    // Team members must be assigned by an admin before they can respond.
    if (!isFullAdmin) {
      res.status(403).json({ error: "An admin must assign this chat to you before you can respond." });
      return;
    }
    // A full-access admin's first reply auto-claims the chat — atomically,
    // so two admins replying at once can't both claim it.
    const claimed = await query(
      `UPDATE live_chat_sessions
       SET agent_id = $1, agent_name = $2, status = 'active', updated_at = NOW()
       WHERE id = $3 AND agent_id IS NULL
       RETURNING id`,
      [req.user!.id, req.user!.name, req.params.id]
    );
    if (!claimed.rows[0]) {
      res.status(409).json({ error: "Another agent just claimed this chat. Refresh to see who." });
      return;
    }
    await query(
      `INSERT INTO live_chat_messages (session_id, sender, sender_name, text)
       VALUES ($1, 'system', 'System', $2)`,
      [req.params.id, `${req.user!.name} joined the chat.`]
    );
  } else if (s.rows[0].agent_id !== req.user!.id && !isFullAdmin) {
    // Only the assigned member (or a full-access admin) can reply.
    res.status(403).json({
      error: `This chat is assigned to ${s.rows[0].agent_name || "another team member"}. Ask an admin to reassign it to you.`,
    });
    return;
  }

  const inserted = await query(
    `INSERT INTO live_chat_messages (session_id, sender, sender_name, text)
     VALUES ($1, 'agent', $2, $3) RETURNING *`,
    [req.params.id, req.user!.name, clean]
  );
  await query(
    "UPDATE live_chat_sessions SET status = 'active', updated_at = NOW() WHERE id = $1",
    [req.params.id]
  );
  res.json({ ok: true, message: mapMessage(inserted.rows[0]) });
});

// ─── Admin: close chat ────────────────────────────────────────────────────────
router.post("/admin/live-chats/:id/close", permLiveChat, async (req: Request, res: Response) => {
  await query(
    "UPDATE live_chat_sessions SET status = 'closed', closed_at = NOW(), updated_at = NOW() WHERE id = $1",
    [req.params.id]
  );
  await query(
    `INSERT INTO live_chat_messages (session_id, sender, sender_name, text)
     VALUES ($1, 'system', 'System', $2)`,
    [req.params.id, `${req.user!.name} closed the chat.`]
  );
  res.json({ ok: true });
});

// ─── Team agents CRUD ─────────────────────────────────────────────────────────
router.get("/admin/agents", permTeam, async (_req: Request, res: Response) => {
  // Presence: a member is "online" when one of their sessions was seen in the
  // last 2 minutes (last_seen is touched on every authenticated request).
  const result = await query(
    `SELECT u.id, u.name, u.email, u.role, u.phone, u.is_active, u.created_at, u.permissions,
            MAX(s.last_seen) AS last_seen
     FROM portal_users u
     LEFT JOIN portal_sessions s
       ON s.user_id = u.id AND s.user_type = 'admin' AND s.expires_at > NOW()
     WHERE u.user_type = 'admin'
     GROUP BY u.id ORDER BY u.created_at ASC`,
    []
  );
  res.json(result.rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    role: r.role,
    phone: r.phone,
    isActive: r.is_active,
    createdAt: r.created_at,
    permissions: Array.isArray(r.permissions) ? r.permissions : null,
    lastSeenAt: r.last_seen,
    online: r.last_seen != null && Date.now() - new Date(r.last_seen).getTime() < 2 * 60 * 1000,
  })));
});

router.post("/admin/agents", permTeam, async (req: Request, res: Response) => {
  const { name, email, password, role, phone, permissions } = req.body as {
    name?: string; email?: string; password?: string; role?: string; phone?: string;
    permissions?: string[] | null;
  };
  // Delegation ceiling: an admin can only grant access they hold themselves,
  // and only full-access admins may create full-access accounts. Omitting
  // permissions means full access, so validate it the same way.
  const grantError = validatePermissionGrant(req.user!, permissions === undefined ? null : permissions);
  if (grantError) { res.status(403).json({ error: grantError }); return; }
  if (!name || !email || !password) {
    res.status(400).json({ error: "Name, email, and password required" });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters" });
    return;
  }

  const existing = await query("SELECT id FROM portal_users WHERE email = $1", [email.toLowerCase()]);
  if (existing.rows[0]) { res.status(409).json({ error: "Email already registered" }); return; }

  const id = `agent-${genId()}`;
  const memberSince = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
  await query(
    `INSERT INTO portal_users (id, name, email, password_hash, organisation, role, phone, member_since, tier, user_type, permissions)
     VALUES ($1, $2, $3, $4, 'iTech Network Africa', $5, $6, $7, 'Standard', 'admin', $8)`,
    [id, name, email.toLowerCase(), hashPassword(password), role || "Support Agent", phone || "", memberSince,
     permissions == null ? null : JSON.stringify(permissions)]
  );
  res.json({ ok: true, id });
});

router.put("/admin/agents/:id", permTeam, async (req: Request, res: Response) => {
  const { name, role, phone, isActive, newPassword, permissions } = req.body as {
    name?: string; role?: string; phone?: string; isActive?: boolean; newPassword?: string;
    permissions?: string[] | null;
  };

  // Don't let an admin deactivate their own account
  if (isActive === false && req.params.id === req.user!.id) {
    res.status(400).json({ error: "You cannot deactivate your own account" });
    return;
  }
  // Don't let an admin restrict their own access
  if (permissions !== undefined && req.params.id === req.user!.id) {
    res.status(400).json({ error: "You cannot change your own access level" });
    return;
  }
  if (permissions !== undefined) {
    const grantError = validatePermissionGrant(req.user!, permissions);
    if (grantError) { res.status(403).json({ error: grantError }); return; }
  }
  // A limited admin cannot modify a full-access admin's account at all
  if (req.user!.permissions != null) {
    const target = await query(
      "SELECT permissions FROM portal_users WHERE id = $1 AND user_type = 'admin'",
      [req.params.id]
    );
    if (target.rows[0] && !Array.isArray(target.rows[0].permissions)) {
      res.status(403).json({ error: "Only a full-access admin can modify this account" });
      return;
    }
  }
  if (newPassword && newPassword.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters" });
    return;
  }

  if (newPassword) {
    await query(
      `UPDATE portal_users SET name = COALESCE($1, name), role = COALESCE($2, role),
        phone = COALESCE($3, phone), is_active = COALESCE($4, is_active),
        password_hash = $5, updated_at = NOW()
       WHERE id = $6 AND user_type = 'admin'`,
      [name, role, phone, isActive, hashPassword(newPassword), req.params.id]
    );
  } else {
    await query(
      `UPDATE portal_users SET name = COALESCE($1, name), role = COALESCE($2, role),
        phone = COALESCE($3, phone), is_active = COALESCE($4, is_active), updated_at = NOW()
       WHERE id = $5 AND user_type = 'admin'`,
      [name, role, phone, isActive, req.params.id]
    );
  }
  if (permissions !== undefined) {
    await query(
      `UPDATE portal_users SET permissions = $1, updated_at = NOW() WHERE id = $2 AND user_type = 'admin'`,
      [permissions == null ? null : JSON.stringify(permissions), req.params.id]
    );
  }
  res.json({ ok: true });
});

router.delete("/admin/agents/:id", permTeam, async (req: Request, res: Response) => {
  if (req.params.id === req.user!.id) {
    res.status(400).json({ error: "You cannot remove your own account" });
    return;
  }
  // A limited admin cannot remove a full-access admin
  if (req.user!.permissions != null) {
    const target = await query(
      "SELECT permissions FROM portal_users WHERE id = $1 AND user_type = 'admin'",
      [req.params.id]
    );
    if (target.rows[0] && !Array.isArray(target.rows[0].permissions)) {
      res.status(403).json({ error: "Only a full-access admin can remove this account" });
      return;
    }
  }
  await query(
    "UPDATE portal_users SET is_active = false WHERE id = $1 AND user_type = 'admin'",
    [req.params.id]
  );
  res.json({ ok: true });
});

export default router;
