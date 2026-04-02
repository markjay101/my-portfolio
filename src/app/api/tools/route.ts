import { NextResponse } from "next/server";
import type { Skill } from "@/lib/portfolio-types";
import { addTool } from "@/lib/portfolio-data";
import { requireAdmin } from "@/lib/api-auth";

export async function POST(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const body = (await request.json()) as Skill;
    if (!body?.id || !body?.name || !body?.level || !body?.icon) {
      return NextResponse.json(
        { error: "Missing required tool fields" },
        { status: 400 },
      );
    }
    const data = await addTool(body);
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to add tool";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
