# iTech Network Africa

A multi-page React website for iTech Network Africa — a global technology company offering enterprise software, AI solutions, cloud infrastructure, cybersecurity, and digital services worldwide.

## Stack
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4
- **Routing:** Wouter (client-side SPA)
- **UI components:** Radix UI + shadcn/ui
- **Animations:** Framer Motion
- **Data fetching:** TanStack Query
- **Monorepo:** pnpm workspace

## Project structure
```
artifacts/itech-network-africa/   ← main frontend app
  src/
    pages/        ← one file per route (HomePage, AboutPage, etc.)
    components/   ← shared UI components (Header, Footer, etc.)
    data/         ← static data files
    hooks/        ← custom React hooks
    lib/          ← utilities
  public/         ← static assets (images, logos, etc.)

artifacts/api-server/             ← Express API server (currently minimal)
```

## How to run
The app runs via the **iTech Network Africa** workflow, which starts the Vite dev server:
```
PORT=8080 pnpm --filter @workspace/itech-network-africa run dev
```
The app is served at port 8080 (mapped to the root `/` preview path).

## Pages
Home, About, Services, Service Detail, AI Solutions, Solutions, Products, Portfolio, Projects, Industries, Partners, Resources, Blog, News, Careers, Support, Contact, Pricing, Privacy Policy, Terms, Cookies, Client Portal, Team Member, Refund Policy, Sitemap.

## User preferences
<!-- Add any user preferences here -->
