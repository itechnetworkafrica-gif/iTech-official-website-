/**
 * Idempotent schema setup for the live-chat feature.
 * Runs at server startup so dev and production stay in sync.
 */
import { query } from "./db.js";
import { logger } from "./logger.js";

export async function ensureLiveChatSchema(): Promise<void> {
  await query(
      `CREATE TABLE IF NOT EXISTS live_chat_sessions (
        id            TEXT PRIMARY KEY,
        visitor_token TEXT NOT NULL,
        visitor_name  TEXT NOT NULL DEFAULT 'Website Visitor',
        visitor_email TEXT NOT NULL DEFAULT '',
        topic         TEXT NOT NULL DEFAULT '',
        status        TEXT NOT NULL DEFAULT 'waiting', -- waiting | active | closed
        agent_id      TEXT,
        agent_name    TEXT,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        closed_at     TIMESTAMPTZ
      )`,
      []
    );
    await query(
      `CREATE TABLE IF NOT EXISTS live_chat_messages (
        id          BIGSERIAL PRIMARY KEY,
        session_id  TEXT NOT NULL REFERENCES live_chat_sessions(id) ON DELETE CASCADE,
        sender      TEXT NOT NULL, -- visitor | agent | system
        sender_name TEXT NOT NULL DEFAULT '',
        text        TEXT NOT NULL,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`,
      []
    );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_live_chat_messages_session
     ON live_chat_messages (session_id, id)`,
    []
  );
  logger.info("Live chat schema ready");

  // Admin permissions column (NULL = full access). Guarded so it is a no-op
  // when portal_users doesn't exist yet (schema.sql not applied).
  await query(
    `DO $$ BEGIN
       IF to_regclass('portal_users') IS NOT NULL THEN
         ALTER TABLE portal_users ADD COLUMN IF NOT EXISTS permissions JSONB;
       END IF;
     END $$`,
    []
  );

  // Partnership applications (public form → admin portal)
  await query(
    `CREATE TABLE IF NOT EXISTS partnership_applications (
      id            TEXT PRIMARY KEY,
      name          TEXT NOT NULL,
      email         TEXT NOT NULL,
      phone         TEXT NOT NULL DEFAULT '',
      organisation  TEXT NOT NULL DEFAULT '',
      website       TEXT NOT NULL DEFAULT '',
      country       TEXT NOT NULL DEFAULT '',
      partnership_type TEXT NOT NULL DEFAULT 'General',
      message       TEXT NOT NULL,
      status        TEXT NOT NULL DEFAULT 'New', -- New | In Review | Approved | Declined
      admin_notes   TEXT NOT NULL DEFAULT '',
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    []
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_partnership_applications_created
     ON partnership_applications (created_at DESC)`,
    []
  );

  // Billing payment submissions (public deposit verification)
  await query(
    `CREATE TABLE IF NOT EXISTS billing_submissions (
      id              TEXT PRIMARY KEY,
      ref             TEXT NOT NULL,
      name            TEXT NOT NULL,
      email           TEXT NOT NULL,
      phone           TEXT NOT NULL DEFAULT '',
      plan            TEXT NOT NULL,
      category        TEXT NOT NULL DEFAULT '',
      amount          TEXT NOT NULL,
      currency        TEXT NOT NULL DEFAULT 'USD',
      method          TEXT NOT NULL DEFAULT 'bank_transfer',
      transaction_id  TEXT NOT NULL,
      payment_date    TEXT NOT NULL DEFAULT '',
      notes           TEXT NOT NULL DEFAULT '',
      status          TEXT NOT NULL DEFAULT 'Pending',
      admin_notes     TEXT NOT NULL DEFAULT '',
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    []
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_billing_submissions_created
     ON billing_submissions (created_at DESC)`,
    []
  );
  await query(`CREATE SEQUENCE IF NOT EXISTS billing_ref_seq`, []);

  // AI fraud-detection columns (added after initial release — safe to re-run)
  for (const ddl of [
    `ALTER TABLE billing_submissions ADD COLUMN IF NOT EXISTS ai_risk_level     TEXT NOT NULL DEFAULT 'pending'`,
    `ALTER TABLE billing_submissions ADD COLUMN IF NOT EXISTS ai_risk_score      INTEGER`,
    `ALTER TABLE billing_submissions ADD COLUMN IF NOT EXISTS ai_flags           JSONB NOT NULL DEFAULT '[]'`,
    `ALTER TABLE billing_submissions ADD COLUMN IF NOT EXISTS ai_summary         TEXT NOT NULL DEFAULT ''`,
    `ALTER TABLE billing_submissions ADD COLUMN IF NOT EXISTS ai_recommendation  TEXT NOT NULL DEFAULT ''`,
    `ALTER TABLE billing_submissions ADD COLUMN IF NOT EXISTS ai_reviewed_at     TIMESTAMPTZ`,
  ]) {
    await query(ddl, []);
  }

  // Atomic ticket-number allocator. Seeded past the highest existing
  // TKT-NNNN so concurrent submissions never collide with old tickets.
  await query(`CREATE SEQUENCE IF NOT EXISTS support_ticket_number_seq`, []);
  await query(
    `DO $$
     DECLARE max_n BIGINT;
     BEGIN
       IF to_regclass('support_tickets') IS NOT NULL THEN
         SELECT COALESCE(MAX((substring(ticket_number from 'TKT-(\\d+)'))::bigint), 0)
           INTO max_n FROM support_tickets WHERE ticket_number ~ '^TKT-\\d+$';
         IF max_n > 0 AND max_n >= (SELECT COALESCE(last_value, 0) FROM support_ticket_number_seq) THEN
           PERFORM setval('support_ticket_number_seq', max_n, true);
         END IF;
       END IF;
     END $$`,
    []
  );
}
