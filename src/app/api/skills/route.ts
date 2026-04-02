import { NextResponse } from "next/server";
import type { Skill } from "@/lib/portfolio-types";
import { addSkill } from "@/lib/portfolio-data";
import { requireAdmin } from "@/lib/api-auth";

export async function POST(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const body = (await request.json()) as Skill;
    if (!body?.id || !body?.name || !body?.level || !body?.icon) {
      return NextResponse.json(
        { error: "Missing required skill fields" },
        { status: 400 },
      );
    }
    const data = await addSkill(body);
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to add skill";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
