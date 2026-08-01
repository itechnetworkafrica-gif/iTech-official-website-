# iTech Network Africa

A full-stack React/Vite website for iTech Network Africa, with an Express API backend and shared TypeScript libraries.

## Stack

- **Frontend**: React 19 + Vite + Tailwind CSS v4 + shadcn/ui components (`artifacts/itech-network-africa`)
- **Backend**: Express 5 API server (`artifacts/api-server`)
- **Shared libs**: `lib/api-spec`, `lib/api-zod`, `lib/api-client-react`, `lib/db`
- **Package manager**: pnpm (monorepo via `pnpm-workspace.yaml`)

## Running the project

The frontend dev server is managed by the **iTech Network Africa** workflow:

```
PORT=8080 pnpm --filter @workspace/itech-network-africa run dev
```

To run the API server separately:

```
pnpm --filter @workspace/api-server run dev
```

## Pages

The frontend has a comprehensive set of pages: Home, About, Services, Products, AI, Pricing, Blog, News, Portfolio, Projects, Industries, Solutions, Partners, Careers, Team, Contact, Support, Client Portal, Resources, Sitemap, and legal pages (Privacy, Terms, Cookies, Refund Policy).

## User preferences

<!-- Add user preferences here as they are stated -->
