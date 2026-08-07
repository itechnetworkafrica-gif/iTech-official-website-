import { Request, Response, NextFunction } from "express";

/**
 * CSRF defence via server-side Origin validation.
 *
 * When COOKIE_CROSS_SITE=true the session cookie is SameSite=None, which means
 * the browser will attach it to cross-origin requests.  CORS alone does NOT
 * prevent a malicious site from submitting a form or fetch with credentials
 * included, because the browser's preflight check only guards XHR/fetch with
 * custom headers — simple form POSTs bypass it entirely.
 *
 * This middleware blocks unsafe methods (POST, PUT, PATCH, DELETE) whose
 * Origin header is absent or not in the CORS allowlist, providing the missing
 * layer of protection.
 *
 * Safe methods (GET, HEAD, OPTIONS) are always allowed — they should be
 * idempotent and carry no side effects.
 *
 * When COOKIE_CROSS_SITE is NOT set (dev / same-site mode), Origin validation
 * is still applied whenever an Origin header is present, but missing Origins
 * are allowed (same-origin requests from browser navigations often omit it).
 */

const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function buildOriginValidator(allowedOrigins: string[], crossSite: boolean) {
  return function validateOrigin(req: Request, res: Response, next: NextFunction): void {
    if (!UNSAFE_METHODS.has(req.method)) {
      next();
      return;
    }

    const origin = req.headers.origin as string | undefined;

    if (!origin) {
      if (crossSite) {
        // Cross-site mode: all browser-initiated unsafe requests carry an Origin.
        // A missing Origin on an unsafe request is suspicious — reject it unless
        // it looks like a same-host server-to-server call (no Host mismatch).
        // In practice this blocks malicious form submissions that spoof same-origin.
        res.status(403).json({ error: "Origin header required for this request" });
        return;
      }
      // Same-site mode: Origin is sometimes omitted for same-origin navigations; allow it.
      next();
      return;
    }

    // Strip any trailing slash for comparison.
    const normalised = origin.replace(/\/$/, "");

    if (allowedOrigins.includes(normalised)) {
      next();
    } else {
      res.status(403).json({ error: "Origin not allowed" });
    }
  };
}
