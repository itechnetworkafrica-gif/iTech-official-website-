/**
 * Bearer-token fallback for portal authentication.
 *
 * The API sets an httpOnly session cookie, which works when the site and API
 * share an origin. When the frontend is hosted on a different domain (e.g. a
 * Vercel copy), modern browsers often block that cross-site cookie. The API
 * therefore also returns the session id as `token` on login; we keep it in
 * localStorage and attach it as an Authorization header on every API request.
 */
import { API_BASE } from './apiBase';

const KEY = 'portal_auth_token';

export function saveAuthToken(token: string | undefined | null): void {
  try { if (token) localStorage.setItem(KEY, token); } catch { /* private mode */ }
}

export function clearAuthToken(): void {
  try { localStorage.removeItem(KEY); } catch { /* private mode */ }
}

function getAuthToken(): string | null {
  try { return localStorage.getItem(KEY); } catch { return null; }
}

function isApiRequest(url: string): boolean {
  if (API_BASE && url.startsWith(`${API_BASE}/api/`)) return true;
  return url.startsWith('/api/') || url.startsWith(`${window.location.origin}/api/`);
}

let installed = false;

/** Patch window.fetch once so all API calls carry the bearer token. */
export function installAuthFetch(): void {
  if (installed) return;
  installed = true;
  const original = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    const token = getAuthToken();
    if (token && isApiRequest(url)) {
      const headers = new Headers(
        init?.headers || (input instanceof Request ? input.headers : undefined)
      );
      if (!headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`);
      return original(input, { ...init, headers });
    }
    return original(input, init);
  };
}
