# iTech Network Africa

A full-stack web application for iTech Network Africa — a technology services company. The project is a pnpm monorepo with a React + Vite frontend, an Express + TypeScript API server, and shared libraries.

## Project Structure

```
artifacts/
  itech-network-africa/   # Main React + Vite frontend (port 5173)
  api-server/             # Express + TypeScript API (port 8000)
  itech-network-africa-site/  # Public marketing site (not currently configured as a workflow)
  mockup-sandbox/         # UI prototype sandbox
lib/
  api-client-react/       # Generated React Query hooks
  api-spec/               # OpenAPI spec + codegen
  api-zod/                # Generated Zod schemas
  db/                     # Drizzle ORM schema + database client
```

## How to Run

Both services start automatically via workflows:

- **Frontend** — `PORT=5173 pnpm --filter @workspace/itech-network-africa run dev`
- **API Server** — `PORT=8000 pnpm --filter @workspace/api-server run dev`

The Vite dev server proxies `/api` requests to `http://localhost:8000`.

## Database

The Replit workspace has a managed PostgreSQL database. The full schema (all 15 portal tables) is
initialized and ready. A reference copy of the schema is in `schema.sql` at the project root —
use this file to set up any external PostgreSQL provider.

### Default admin account

| Field | Value |
|---|---|
| Email | `admin@itechnetworkafrica.com` |
| Password | `Admin@iTech2025!` |
| Type | `admin` |

**Change this password immediately after your first login via the Admin Dashboard → Settings.**

### Tables created

`portal_users`, `portal_sessions`, `invoices`, `support_tickets`, `ticket_messages`,
`projects`, `announcements`, `portal_files`, `client_uploads`, `invoice_disputes`,
`payment_confirmations`, `quick_replies`, `client_notes`, `invoice_templates`, `activity_log`

## Environment Variables / Secrets Required

The API server owns the PostgreSQL connection. **Never** put `DATABASE_URL` in
Vercel frontend variables or in any browser-side code.

The following secrets are needed for optional/full functionality (set them in Replit Secrets):

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Auto-managed by Replit — do not set manually |
| `OPENAI_API_KEY` | Powers the "Sarah" AI chatbot (`/api/chat`) |
| `EMAIL_USER` | Email address for sending consultation form submissions |
| `EMAIL_PASS` | Password / app password for the email account |
| `SESSION_SECRET` | Already set — used for session signing |

### Architecture: Vercel frontend + separate API server

```
Browser → Vercel (React frontend) → API Server (Express) → PostgreSQL
```

The Vercel site is **static frontend only** (`vercel.json` has no serverless functions).
The API server must be deployed separately (e.g. Replit Deploy, Railway, Render).

**Vercel environment variables** (set in Vercel project settings):

| Variable | Value |
|---|---|
| `VITE_API_URL` | Public URL of your deployed API server, no trailing slash — e.g. `https://your-api.up.railway.app` |
| `VITE_SITE_URL` | Your production website domain — e.g. `https://itechnetworkafrica.com` |

**API server environment variables** (set wherever the API is hosted):

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your PostgreSQL connection string (see below for getting it) |
| `PORT` | Port to listen on (usually assigned by the host) |
| `SESSION_SECRET` | A long random secret for cookie signing |
| `CORS_ORIGINS` | Exact Vercel origin — e.g. `https://your-site.vercel.app` |
| `COOKIE_CROSS_SITE` | `true` (required since frontend and API are on different domains) |
| `OPENAI_API_KEY` | Optional — for the AI chatbot |
| `EMAIL_USER` | Optional — for consultation emails |
| `EMAIL_PASS` | Optional — for consultation emails |

### Getting the DATABASE_URL for external deployment

The Replit-managed `DATABASE_URL` is only available inside this Replit workspace.
For deploying the API server externally, use one of:
- **Neon** (https://neon.tech) — free PostgreSQL, copy the connection string
- **Supabase** (https://supabase.com) — free PostgreSQL, use the "connection string" URI
- **Railway** — provision a PostgreSQL plugin, copy the `DATABASE_URL` variable

Then run `schema.sql` against your external database to create all the tables.

## Tech Stack

- **Frontend**: React 19, Vite 7, Tailwind CSS v4, Wouter (routing), Framer Motion, shadcn/ui components, React Query
- **Backend**: Express 5, tsx, pino (logging)
- **Database**: PostgreSQL via Drizzle ORM
- **AI**: OpenAI SDK
- **Email**: Nodemailer

## User Preferences

_None recorded yet._
