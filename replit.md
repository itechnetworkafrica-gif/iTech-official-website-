# iTech Network Africa

A full-stack web application for iTech Network Africa — a technology company serving African markets. The site includes pages for services, solutions, AI offerings, portfolio, blog, careers, pricing, contact, and a client portal.

## Stack

- **Frontend**: React 19 + Vite 7 + TypeScript + Tailwind CSS v4 + shadcn/ui + Framer Motion + Wouter (routing) — located in `artifacts/itech-network-africa/`
- **Backend**: Express 5 + TypeScript — located in `artifacts/api-server/`
- **Monorepo**: pnpm workspace (`pnpm-workspace.yaml`)

## How to run

The frontend dev server starts automatically via the **iTech Network Africa** workflow:

```
PORT=8080 pnpm --filter @workspace/itech-network-africa run dev
```

To start the API server separately (not yet wired to a workflow):

```
pnpm --filter @workspace/api-server run dev
```

## Key directories

- `artifacts/itech-network-africa/src/pages/` — all page components
- `artifacts/itech-network-africa/src/components/` — shared UI components (Header, Footer, etc.)
- `artifacts/itech-network-africa/public/` — static assets (images, logos)
- `artifacts/api-server/src/routes/` — Express API routes
- `artifacts/api-server/src/lib/` — server utilities (logger, etc.)

## User preferences

_None recorded yet._
