import { NextResponse } from "next/server";
import { getSessionFromRequest } from "./auth";

export function requireAdmin(request: Request): NextResponse | null {
  if (!getSessionFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
