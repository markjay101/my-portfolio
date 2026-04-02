import { createHmac, timingSafeEqual } from "crypto";
import { ADMIN_SESSION_COOKIE, MAX_AGE_SEC } from "./auth-constants";

export { ADMIN_SESSION_COOKIE, MAX_AGE_SEC } from "./auth-constants";

function requireSecret(): string {
  const s = process.env.ADMIN_SECRET_KEY;
  if (!s) {
    throw new Error("ADMIN_SECRET_KEY is not set");
  }
  return s;
}

export function createSessionToken(): string {
  const secret = requireSecret();
  const exp = Date.now() + MAX_AGE_SEC * 1000;
  const payload = JSON.stringify({ exp });
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return Buffer.from(`${payload}.${sig}`).toString("base64url");
}

export function verifySessionToken(token: string): boolean {
  try {
    const secret = process.env.ADMIN_SECRET_KEY;
    if (!secret) return false;
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const lastDot = raw.lastIndexOf(".");
    if (lastDot === -1) return false;
    const payload = raw.slice(0, lastDot);
    const sig = raw.slice(lastDot + 1);
    const expected = createHmac("sha256", secret).update(payload).digest("hex");
    const a = Buffer.from(sig, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
    const { exp } = JSON.parse(payload) as { exp: number };
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

export function getSessionFromRequest(request: Request): boolean {
  const cookie = request.headers.get("cookie");
  if (!cookie) return false;
  const match = cookie.match(
    new RegExp(`(?:^|;\\s*)${ADMIN_SESSION_COOKIE}=([^;]+)`),
  );
  if (!match?.[1]) return false;
  return verifySessionToken(decodeURIComponent(match[1]));
}

