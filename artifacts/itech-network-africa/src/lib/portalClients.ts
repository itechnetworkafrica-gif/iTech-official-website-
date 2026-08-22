/**
 * iTech Network Africa — Client Portal Registry
 *
 * HOW TO ADD A NEW CLIENT
 * ────────────────────────
 * 1. Generate the password hash:
 *      Open your browser console and run:
 *      btoa("YourPassword:iTechPortal2025")
 *
 * 2. Add a new entry to the PORTAL_CLIENTS array below.
 *
 * 3. Send the client their email and the plain-text password you chose.
 *
 * NOTE: This is a lightweight frontend auth system.
 *       For production-grade security, connect to the backend API
 *       (see Task #2: "Connect the API server so forms and dynamic content actually work").
 */

export interface PortalProject {
  id: string;
  name: string;
  type: string;
  status: 'Active' | 'Completed' | 'On Hold';
  description: string;
  startDate: string;
  manager: string;
}

export interface PortalClient {
  id: string;
  name: string;
  email: string;
  /** btoa(password + ":iTechPortal2025") */
  passwordHash: string;
  organisation: string;
  role: string;
  phone: string;
  memberSince: string;
  tier: 'Standard' | 'Business' | 'Enterprise';
  projects: PortalProject[];
}

/** Verify a plain-text password against the stored hash */
export function verifyPassword(plain: string, hash: string): boolean {
  try {
    return btoa(plain + ':iTechPortal2025') === hash;
  } catch {
    return false;
  }
}

/** Look up a client by email (case-insensitive) */
export function findClient(email: string): PortalClient | undefined {
  return PORTAL_CLIENTS.find(
    (c) => c.email.toLowerCase() === email.trim().toLowerCase()
  );
}

// ─────────────────────────────────────────────
//  REGISTERED CLIENTS
//  Add new clients here. Admin eyes only.
// ─────────────────────────────────────────────

export const PORTAL_CLIENTS: PortalClient[] = [

  // ── Client #1: Kerkula Wilmot ──────────────
  // Service: Website Development
  // Credentials: kerkulahwilmot492@gmail.com / Welcome@iTech25
  {
    id: 'client-001',
    name: 'Kerkula Wilmot',
    email: 'kerkulahwilmot492@gmail.com',
    passwordHash: 'V2VsY29tZUBpVGVjaDI1OmlUZWNoUG9ydGFsMjAyNQ==',
    organisation: 'Personal / Business',
    role: 'Client',
    phone: '—',
    memberSince: 'July 2025',
    tier: 'Standard',
    projects: [
      {
        id: 'P-KW-001',
        name: 'Business Website Development',
        type: 'Web Development',
        status: 'Active',
        description: 'Full design and development of a professional business website, including hosting setup and domain configuration.',
        startDate: 'July 2025',
        manager: 'iTech Network Africa Team',
      },
    ],
  },

  // ── Add more clients below this line ────────
  // {
  //   id: 'client-002',
  //   name: 'Jane Doe',
  //   email: 'jane@example.com',
  //   passwordHash: 'PASTE_HASH_HERE',
  //   organisation: 'Example Corp',
  //   role: 'CEO',
  //   phone: '+1 234 567 8901',
  //   memberSince: 'August 2025',
  //   tier: 'Business',
  //   projects: [],
  // },
];
