/** Session verification compatible with Edge (middleware). */

function decodeBase64Url(s: string): string {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return atob(b64);
}

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a[i] ^ b[i];
  return d === 0;
}

export async function verifySessionTokenEdge(
  token: string,
  secret: string,
): Promise<boolean> {
  try {
    const raw = decodeBase64Url(token);
    const lastDot = raw.lastIndexOf(".");
    if (lastDot === -1) return false;
    const payload = raw.slice(0, lastDot);
    const sigHex = raw.slice(lastDot + 1);
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
    const expectedHex = Array.from(new Uint8Array(sigBuf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    if (!timingSafeEqualBytes(hexToBytes(sigHex), hexToBytes(expectedHex))) {
      return false;
    }
    const { exp } = JSON.parse(payload) as { exp: number };
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}
