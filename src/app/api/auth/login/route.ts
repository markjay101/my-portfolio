import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createSessionToken,
  MAX_AGE_SEC,
} from "@/lib/auth";

export async function POST(request: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const user = process.env.ADMIN_USERNAME;
  const pass = process.env.ADMIN_PASSWORD;

  if (!user || !pass) {
    return NextResponse.json(
      { error: "Server is not configured for admin login" },
      { status: 500 },
    );
  }

  if (body.username !== user || body.password !== pass) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  let token: string;
  try {
    token = createSessionToken();
  } catch {
    return NextResponse.json(
      { error: "Server is not configured for admin login" },
      { status: 500 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SEC,
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
