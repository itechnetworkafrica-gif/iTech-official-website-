---
name: Quotes feature
description: Admin quote management — create/edit/send quotes, public shareable link at /quote/:token, PDF via browser print.
---

# Quotes Feature

## Architecture
- Backend: `artifacts/api-server/src/routes/quotes.ts` — CRUD + public view + accept endpoint
- Schema: `quotes` table + `quote_ref_seq` sequence added to `ensureSchema.ts`
- Frontend admin: `artifacts/itech-network-africa/src/components/admin/QuotesSection.tsx`
- Frontend public: `artifacts/itech-network-africa/src/pages/QuotePage.tsx`
- Routes registered in `artifacts/api-server/src/routes/index.ts`
- Quote tab added to ADMIN_NAV (id: 'quotes', admin-only like billing)
- Public route `/quote/:token` added to FULLSCREEN_ROUTES in App.tsx

## Key decisions
- PDF download: opens `/quote/:token?print=1` in new tab, QuotePage auto-triggers `window.print()` — no library needed.
- Share link: `window.location.origin/quote/TOKEN` — client can view, accept, or print.
- Status flow: draft → sent → viewed (auto on public load) → accepted/declined/expired.
- Admin-only: quotes restricted to `permissions == null` (same as billing tab).

**Why:** Quote pages are standalone documents; FULLSCREEN_ROUTES ensures no site header/footer wraps them.
