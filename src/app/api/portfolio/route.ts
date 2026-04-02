import { NextResponse } from "next/server";
import { readPortfolio } from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await readPortfolio();
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to read portfolio";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
