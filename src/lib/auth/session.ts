import { jwtVerify, SignJWT } from "jose";

/**
 * Edge-safe session helpers (used by proxy.ts and server code).
 * A session is a signed JWT in an httpOnly cookie. Demo only — there is no
 * refresh-token rotation or server-side revocation list.
 */

export const SESSION_COOKIE = "la_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type SessionPayload = {
  userId: string;
  role: "CUSTOMER" | "ADMIN";
  name?: string | null;
};

function secretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    if (process.env.NODE_ENV === "production") throw new Error("SESSION_SECRET is not configured");
    return new TextEncoder().encode("lushaura-dev-only-insecure-secret");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey());
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    if (typeof payload.userId !== "string") return null;
    return {
      userId: payload.userId,
      role: payload.role === "ADMIN" ? "ADMIN" : "CUSTOMER",
      name: (payload.name as string | null | undefined) ?? null,
    };
  } catch {
    return null;
  }
}
