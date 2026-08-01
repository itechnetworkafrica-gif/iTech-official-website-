# iTech Network Africa

A full company website for **iTech Network Africa** — a tech services and solutions provider. Built with React, Vite, TypeScript, and Tailwind CSS, it covers ~20 pages including Home, Services, AI Solutions, Blog, Careers, Contact, Pricing, and more.

## Stack

- **Frontend:** React 19 + Vite + TypeScript + Tailwind CSS v4
- **Routing:** Wouter (client-side SPA)
- **UI components:** shadcn/ui (Radix primitives)
- **Animations:** Framer Motion
- **API server:** Express 5 + TypeScript (separate artifact)
- **Package manager:** pnpm (workspace monorepo)

## Running the project

The frontend dev server starts automatically via the **iTech Network Africa** workflow:

```
PORT=8080 pnpm --filter @workspace/itech-network-africa run dev
```

If you need to restart it manually, use the workflow panel or run the above command.

## Project structure

```
artifacts/
  itech-network-africa/   # React/Vite frontend
    src/
      pages/              # ~20 page components
      components/         # Shared layout + UI components
      data/               # Static data files
  api-server/             # Express API backend
    src/
      routes/             # API route handlers
      middlewares/        # Express middleware
lib/                      # Shared workspace libraries
```

## User preferences

- Keep the existing project structure and stack — do not restructure or migrate.
