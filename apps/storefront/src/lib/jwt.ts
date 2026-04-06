export interface JWTPayload {
  user_id: string;
  email: string;
  name: string;
  role: "customer" | "wholesaler" | "admin";
  exp: number;
  iat: number;
}

/**
 * Decodes the payload of a JWT without verifying the signature.
 * Signature verification happens server-side (Go API) and in the
 * Next.js middleware via jose. This is safe to use client-side to
 * extract user info from a trusted, already-issued token.
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const padded = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(padded.padEnd(padded.length + ((4 - (padded.length % 4)) % 4), "="));
    return JSON.parse(json) as JWTPayload;
  } catch {
    return null;
  }
}

/** Returns true if the token's exp claim is in the future. */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload) return true;
  return Date.now() / 1000 >= payload.exp;
}

/**
 * Sets the auth_token cookie readable by Next.js middleware.
 * SameSite=Strict prevents CSRF. Secure flag added in production.
 */
export function setAuthCookie(token: string, expiresInSeconds: number): void {
  if (typeof document === "undefined") return;
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  document.cookie = `auth_token=${token}; path=/; max-age=${expiresInSeconds}; SameSite=Strict${secure}`;
}

/** Clears the auth_token cookie. */
export function clearAuthCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = "auth_token=; path=/; max-age=0; SameSite=Strict";
}
