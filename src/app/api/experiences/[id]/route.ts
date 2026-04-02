import { NextResponse } from "next/server";
import type { Experience } from "@/lib/portfolio-types";
import { deleteExperience, updateExperience } from "@/lib/portfolio-data";
import { requireAdmin } from "@/lib/api-auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;

  try {
    const patch = (await request.json()) as Partial<Omit<Experience, "id">>;
    const data = await updateExperience(id, patch);
    return NextResponse.json(data);
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to update experience";
    const status = message.includes("not found") ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;

  try {
    const data = await deleteExperience(id);
    return NextResponse.json(data);
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to delete experience";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
