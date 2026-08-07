/**
 * API origin used by the browser.
 *
 * Leave VITE_API_URL empty for the Replit workspace proxy (the Vite dev
 * server forwards /api to the local API service). Set it to the public API
 * origin when the static frontend is hosted separately, such as on Vercel.
 */
const configuredApiUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

export const API_BASE = configuredApiUrl.replace(/\/$/, "");

export function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}