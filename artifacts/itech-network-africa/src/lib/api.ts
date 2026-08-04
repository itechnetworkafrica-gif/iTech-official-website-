/**
 * Returns the correct URL for an API call.
 * Vite's dev proxy forwards /api/* to the API server (port 8000).
 * In production the same path routing applies.
 */
export function getApiUrl(path: string): string {
  // Strip any leading slash from path, then always use absolute /api/... path
  // so Vite's proxy rule (/api → localhost:8000) is triggered correctly.
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return cleanPath;
}
