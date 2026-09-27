/** Only allow same-site relative return paths (blocks open redirects like //evil.com or /\evil.com). */
export function safeNext(raw: unknown, fallback = "/account") {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return fallback;
  if (value.startsWith("/login")) return fallback;
  return value;
}
