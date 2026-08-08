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
}
