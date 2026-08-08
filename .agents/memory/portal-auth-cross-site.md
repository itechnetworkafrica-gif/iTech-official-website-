---
name: Portal auth across domains
description: Why portal auth uses a bearer-token fallback alongside the session cookie.
---

Browsers (Chrome/Safari) block third-party cookies, so the httpOnly `portal_session` cookie is silently dropped when the frontend is served from a different domain (e.g. the Vercel copy) than the api-server. Symptom: login returns 200 and the UI appears signed in, but every subsequent authenticated call returns 401.

**Why:** Cross-site cookie blocking is browser policy; SameSite=None + Secure is not sufficient anymore.

**How to apply:** Login also returns the session id as `token`; the frontend stores it in localStorage and a global fetch patch attaches `Authorization: Bearer` on API requests. The backend accepts cookie OR bearer everywhere (single `getSessionId` helper). Any new authenticated endpoint must use that helper, not read the cookie directly. Never remove the bearer path while a separately hosted frontend exists.
