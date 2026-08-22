# iTech Network Africa

A React + Vite marketing/landing site for iTech Network Africa — a tech community and services platform based in Africa.

## Stack
- **Frontend:** React 19, Vite 7, TypeScript, Tailwind CSS v4, Radix UI, Framer Motion, Wouter (routing)
- **Backend:** Express API server (`artifacts/api-server`)
- **Monorepo:** pnpm workspaces

## Project structure
```
artifacts/
  itech-network-africa/   # Main web app (React + Vite)
  api-server/             # Shared Express API server
  mockup-sandbox/         # Design/mockup sandbox
```

## How to run

The **iTech Network Africa** workflow starts the dev server automatically:
```
PORT=8080 pnpm --filter @workspace/itech-network-africa run dev
```

The app is served at `/` on port 8080.

## User preferences
