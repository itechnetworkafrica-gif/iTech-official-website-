import crypto from "crypto";

const SALT_ITERATIONS = 100_000;
const SALT_LENGTH = 32;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

export function hashPassword(plain: string): string {
  const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
  const hash = crypto
    .pbkdf2Sync(plain, salt, SALT_ITERATIONS, KEY_LENGTH, DIGEST)
    .toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(plain: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash) return false;
    const derived = crypto
      .pbkdf2Sync(plain, salt, SALT_ITERATIONS, KEY_LENGTH, DIGEST)
      .toString("hex");
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(derived, "hex"));
  } catch {
    return false;
  }
}

// Also handle the old btoa-based hash for backward compatibility
export function verifyLegacyPassword(plain: string, hash: string): boolean {
  try {
    return Buffer.from(plain + ":iTechPortal2025").toString("base64") === hash;
  } catch {
    return false;
  }
}

export function generateSessionId(): string {
  return crypto.randomBytes(48).toString("hex");
}
