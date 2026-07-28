# iTech Network Africa

A full-featured enterprise website for iTech Network Africa — a technology company serving businesses, governments, and communities across Africa with software, AI solutions, and digital transformation services.

## Run & Operate

- `pnpm --filter @workspace/itech-network-africa run dev` — run the frontend dev server (PORT=8080)
- `pnpm --filter @workspace/itech-network-africa run build` — production build → `artifacts/itech-network-africa/dist/public/`
- `pnpm --filter @workspace/api-server run dev` — run the API server (requires DATABASE_URL)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env (API only): `DATABASE_URL` — Postgres connection string

## Deployment (Vercel — frontend only)

Import `artifacts/itech-network-africa/` as the Vercel project root:

| Setting | Value |
|---|---|
| Root Directory | `artifacts/itech-network-africa` |
| Build Command | `pnpm run build` |
| Output Directory | `dist/public` |
| Install Command | `pnpm install` |

SPA routing and asset caching are pre-configured in `artifacts/itech-network-africa/vercel.json`.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
