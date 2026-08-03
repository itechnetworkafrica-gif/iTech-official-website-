/**
 * iTech Network Africa — Admin Portal Auth
 *
 * Admin Credentials
 * ─────────────────
 * URL:      /admin
 * Email:    admin@itechnetworkafrica.com
 * Password: iTechAdmin@2025
 *
 * To change the password, open browser console and run:
 *   btoa("YourNewPassword:iTechPortal2025")
 * Then paste the result as ADMIN_HASH below.
 */

export const ADMIN_CREDENTIALS = {
  email: 'admin@itechnetworkafrica.com',
  // iTechAdmin@2025
  hash: 'aVRlY2hBZG1pbkAyMDI1OmlUZWNoUG9ydGFsMjAyNQ==',
};

export function verifyAdminPassword(plain: string): boolean {
  try {
    return btoa(plain + ':iTechPortal2025') === ADMIN_CREDENTIALS.hash;
  } catch {
    return false;
  }
}

/** Decode a portal client password hash back to the plain-text password */
export function decodeClientPassword(hash: string): string {
  try {
    return atob(hash).replace(':iTechPortal2025', '');
  } catch {
    return '—';
  }
}
