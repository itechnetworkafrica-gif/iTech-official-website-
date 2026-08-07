---
name: Replit publish run-command resolution
description: How this repo's Publish resolves run/build config and the dual-mode fallback in place
---

Publish detection reads artifact configs (`artifacts/*/.replit-artifact/artifact.toml`) from the committed git tree; a `.gitignore` rule matching `.replit-artifact/` can make Publish treat the repl as legacy and fail with "Could not find run command".

**Why:** the imported project ignored `.replit-artifact/` and Publish failed before any build.

**How to apply:** keep `.replit-artifact/` out of `.gitignore`. The project is publishable in both modes: artifact mode (static frontend + api-server per artifact.toml) and legacy mode (`.replit [deployment]` build/run runs the api-server, which in production also serves the frontend's `dist/public` with an SPA fallback for non-`/api` routes). Don't remove the static-serving block from the api-server's app without reinstating another legacy run path.
