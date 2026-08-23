-- iTech Network Africa — Portal Database Schema
-- Run this against any PostgreSQL database (Replit, Supabase, Neon, Railway, etc.)
-- This creates all tables needed for the client portal and admin dashboard.

-- ─── Users & Sessions ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS portal_users (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  organisation  TEXT NOT NULL DEFAULT '',
  role          TEXT NOT NULL DEFAULT 'Client',
  phone         TEXT NOT NULL DEFAULT '',
  member_since  TEXT NOT NULL DEFAULT '',
  tier          TEXT NOT NULL DEFAULT 'Standard',
  user_type     TEXT NOT NULL CHECK (user_type IN ('client', 'admin')),
  -- Admin-only: JSON array of dashboard sections this admin may access
  -- (e.g. '["livechat","support"]'). NULL = full access (owner/administrator).
  permissions   JSONB,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portal_sessions (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES portal_users(id) ON DELETE CASCADE,
  user_type   TEXT NOT NULL CHECK (user_type IN ('client', 'admin')),
  expires_at  TIMESTAMPTZ NOT NULL,
  last_seen   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portal_sessions_user_id ON portal_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_portal_sessions_expires_at ON portal_sessions(expires_at);

-- ─── Invoices ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS invoices (
  id                TEXT PRIMARY KEY,
  invoice_number    TEXT NOT NULL UNIQUE,
  client_id         TEXT NOT NULL,
  client_name       TEXT NOT NULL,
  client_email      TEXT NOT NULL,
  client_org        TEXT NOT NULL DEFAULT '',
  issued_date       TEXT NOT NULL DEFAULT '',
  due_date          TEXT NOT NULL DEFAULT '',
  status            TEXT NOT NULL DEFAULT 'Draft',
  items             JSONB NOT NULL DEFAULT '[]',
  notes             TEXT NOT NULL DEFAULT '',
  payment_terms     TEXT NOT NULL DEFAULT 'Payment due within 30 days.',
  tax_rate          NUMERIC(5,2) NOT NULL DEFAULT 0,
  discount_percent  NUMERIC(5,2) NOT NULL DEFAULT 0,
  discount_amount   NUMERIC(12,2) NOT NULL DEFAULT 0,
  subtotal          NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_amount        NUMERIC(12,2) NOT NULL DEFAULT 0,
  total             NUMERIC(12,2) NOT NULL DEFAULT 0,
  viewed_by_client  BOOLEAN NOT NULL DEFAULT false,
  email_sent_at     TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- ─── Support Tickets & Messages ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS support_tickets (
  id            TEXT PRIMARY KEY,
  ticket_number TEXT NOT NULL UNIQUE,
  client_id     TEXT NOT NULL,
  client_name   TEXT NOT NULL,
  client_email  TEXT NOT NULL,
  subject       TEXT NOT NULL,
  category      TEXT NOT NULL DEFAULT 'General',
  priority      TEXT NOT NULL DEFAULT 'Medium',
  status        TEXT NOT NULL DEFAULT 'Open',
  assigned_to   TEXT,
  rating        INTEGER,
  rating_comment TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_client_id ON support_tickets(client_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);

CREATE TABLE IF NOT EXISTS ticket_messages (
  id          TEXT PRIMARY KEY,
  ticket_id   TEXT NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender      TEXT NOT NULL CHECK (sender IN ('client', 'admin')),
  sender_name TEXT NOT NULL,
  text        TEXT NOT NULL,
  read        BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);

-- ─── Projects ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS projects (
  id          TEXT PRIMARY KEY,
  client_id   TEXT NOT NULL,
  name        TEXT NOT NULL,
  type        TEXT NOT NULL DEFAULT '',
  status      TEXT NOT NULL DEFAULT 'Active',
  description TEXT NOT NULL DEFAULT '',
  start_date  TEXT NOT NULL DEFAULT '',
  manager     TEXT NOT NULL DEFAULT 'iTech Network Africa Team',
  progress    INTEGER NOT NULL DEFAULT 0,
  milestones  JSONB NOT NULL DEFAULT '[]',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);

-- ─── Announcements ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS announcements (
  id             TEXT PRIMARY KEY,
  title          TEXT NOT NULL,
  body           TEXT NOT NULL,
  type           TEXT NOT NULL DEFAULT 'info',
  target_clients JSONB NOT NULL DEFAULT '"all"',
  pinned         BOOLEAN NOT NULL DEFAULT false,
  admin_name     TEXT NOT NULL DEFAULT 'iTech Admin',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Portal Files (admin-shared) ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS portal_files (
  id           TEXT PRIMARY KEY,
  client_id    TEXT NOT NULL DEFAULT 'all',
  name         TEXT NOT NULL,
  size_label   TEXT NOT NULL DEFAULT '—',
  file_type    TEXT NOT NULL DEFAULT 'PDF',
  category     TEXT NOT NULL DEFAULT 'Other',
  download_url TEXT NOT NULL DEFAULT '#',
  data_url     TEXT,
  uploaded_by  TEXT NOT NULL DEFAULT 'iTech Admin',
  uploaded_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portal_files_client_id ON portal_files(client_id);

-- ─── Client Uploads ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS client_uploads (
  id          TEXT PRIMARY KEY,
  client_id   TEXT NOT NULL,
  name        TEXT NOT NULL,
  file_type   TEXT NOT NULL DEFAULT '',
  size_label  TEXT NOT NULL DEFAULT '',
  data_url    TEXT,
  description TEXT NOT NULL DEFAULT '',
  status      TEXT NOT NULL DEFAULT 'Pending Review',
  admin_note  TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_client_uploads_client_id ON client_uploads(client_id);

-- ─── Invoice Disputes ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS invoice_disputes (
  id             TEXT PRIMARY KEY,
  invoice_id     TEXT NOT NULL,
  invoice_number TEXT NOT NULL,
  client_id      TEXT NOT NULL,
  client_name    TEXT NOT NULL,
  reason         TEXT NOT NULL,
  details        TEXT NOT NULL DEFAULT '',
  status         TEXT NOT NULL DEFAULT 'Open',
  admin_note     TEXT,
  submitted_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_invoice_disputes_client_id ON invoice_disputes(client_id);

-- ─── Payment Confirmations ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS payment_confirmations (
  id             TEXT PRIMARY KEY,
  invoice_id     TEXT NOT NULL,
  invoice_number TEXT NOT NULL,
  client_id      TEXT NOT NULL,
  client_name    TEXT NOT NULL,
  reference      TEXT NOT NULL,
  method         TEXT NOT NULL,
  note           TEXT NOT NULL DEFAULT '',
  status         TEXT NOT NULL DEFAULT 'Pending',
  submitted_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_confirmations_client_id ON payment_confirmations(client_id);

-- ─── Quick Replies ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS quick_replies (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  category   TEXT NOT NULL DEFAULT 'General',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Client Notes ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS client_notes (
  id          TEXT PRIMARY KEY,
  client_id   TEXT NOT NULL,
  text        TEXT NOT NULL,
  author_name TEXT NOT NULL DEFAULT 'Admin',
  pinned      BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_client_notes_client_id ON client_notes(client_id);

-- ─── Invoice Templates ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS invoice_templates (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  items         JSONB NOT NULL DEFAULT '[]',
  notes         TEXT NOT NULL DEFAULT '',
  payment_terms TEXT NOT NULL DEFAULT 'Payment due within 30 days.',
  tax_rate      NUMERIC(5,2) NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Activity Log ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS activity_log (
  id         TEXT PRIMARY KEY,
  action     TEXT NOT NULL,
  detail     TEXT NOT NULL,
  entity     TEXT NOT NULL,
  admin_name TEXT NOT NULL DEFAULT 'iTech Admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
