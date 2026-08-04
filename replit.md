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

## Environment Variables / Secrets Required

The following secrets are needed for full functionality (set them in Replit Secrets):

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Drizzle ORM) |
| `OPENAI_API_KEY` | Powers the "Sarah" AI chatbot (`/api/chat`) |
| `EMAIL_USER` | Email address for sending consultation form submissions |
| `EMAIL_PASS` | Password / app password for the email account |
| `SESSION_SECRET` | Already set — used for session signing |

## Tech Stack

- **Frontend**: React 19, Vite 7, Tailwind CSS v4, Wouter (routing), Framer Motion, shadcn/ui components, React Query
- **Backend**: Express 5, tsx, pino (logging)
- **Database**: PostgreSQL via Drizzle ORM
- **AI**: OpenAI SDK
- **Email**: Nodemailer

## User Preferences

_None recorded yet._
