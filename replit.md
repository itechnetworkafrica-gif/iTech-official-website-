# iTech Network Africa

A full-service technology company website for iTech Network Africa, providing ICT solutions across Africa.

## Project Structure

This is a **pnpm monorepo** with two active artifacts and a shared API server:

| Package | Path | Purpose |
|---|---|---|
| `@workspace/itech-network-africa` | `artifacts/itech-network-africa/` | Main website (React + Vite + Tailwind) |
| `@workspace/api-server` | `artifacts/api-server/` | Express API backend (port 8000) |
| `@workspace/itech-network-africa-site` | `artifacts/itech-network-africa-site/` | Secondary site artifact (placeholder) |

## Running the Project

Two workflows must both be running:

1. **iTech Network Africa** — `PORT=5173 pnpm --filter @workspace/itech-network-africa run dev`
2. **API Server** — `PORT=8000 pnpm --filter @workspace/api-server run dev`

Install all dependencies from the root:
```bash
pnpm install
```

## Key Features

- **Sarah AI Chatbot** — floating chat widget powered by OpenAI (`gpt-4o-mini`), positioned above the scroll-to-top button. Auto-pops up every 30 seconds. Component: `artifacts/itech-network-africa/src/components/SarahChatbot.tsx`. Backend: `artifacts/api-server/src/routes/chat.ts` at `POST /api/chat`.
- **Consultation booking** — `POST /api/consultation` sends email via nodemailer (requires `EMAIL_USER` / `EMAIL_PASS` secrets)
- **WhatsApp widget**, **cookie banner**, **scroll-to-top** — all floating UI components

## Secrets & Environment Variables

| Secret | Required by | Notes |
|---|---|---|
| `SESSION_SECRET` | API server | Session signing |
| `OPENAI_API_KEY` | API server (`/api/chat`) | Powers Sarah chatbot |
| `EMAIL_USER` | API server (`/api/consultation`) | Gmail address for sending enquiries |
| `EMAIL_PASS` | API server (`/api/consultation`) | Gmail app password |

## Tech Stack

- **Frontend**: React 19, Vite 7, Tailwind CSS 4, Framer Motion, Wouter (routing), TanStack Query, shadcn/ui components
- **Backend**: Express 5, TypeScript, Pino logging, Nodemailer, OpenAI SDK
- **Styling**: Brand colours — green `#3CB52A`, dark navy `#0A1929`

## User Preferences

- Keep the project's existing structure and stack — do not restructure or migrate
