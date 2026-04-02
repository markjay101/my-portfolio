import { NextResponse } from "next/server";
import type { Experience } from "@/lib/portfolio-types";
import { addExperience } from "@/lib/portfolio-data";
import { requireAdmin } from "@/lib/api-auth";

export async function POST(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const body = (await request.json()) as Experience;
    if (
      !body?.id ||
      !body?.title ||
      !body?.company ||
      !body?.startDate ||
      !body?.endDate ||
      !body?.description
    ) {
      return NextResponse.json(
        { error: "Missing required experience fields" },
        { status: 400 },
      );
    }
    const data = await addExperience(body);
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to add experience";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
