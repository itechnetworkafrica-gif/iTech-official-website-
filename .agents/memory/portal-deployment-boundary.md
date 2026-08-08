---
name: Portal deployment boundary
description: Secure deployment boundary between the static frontend, API server, and PostgreSQL database.
---

The browser must never receive or use the PostgreSQL connection string. The supported production flow is `frontend -> API server -> PostgreSQL`; a separately hosted frontend uses a public API origin configured at build time, while the API keeps database credentials server-side.

**Why:** Exposing a database URL in Vercel/browser code would bypass the API's authentication and authorization boundary and could allow direct database access.

**How to apply:** Keep `DATABASE_URL` only on the API deployment. Configure the frontend with an API-origin variable, and configure exact CORS origins plus cross-site secure cookies when frontend and API are on different sites.
**CSRF origin allowlist:** With `COOKIE_CROSS_SITE=true`, the api-server origin validator rejects unsafe POSTs from any origin not allowlisted. The app's own Replit domains (`REPLIT_DOMAINS`, `REPLIT_DEV_DOMAIN`) are auto-trusted in `app.ts`; any separately hosted frontend (Vercel) must be added to `CORS_ORIGINS` or login/chat return 403 "Origin not allowed". Never bypass the check when the allowlist is empty — that reopens CSRF.
