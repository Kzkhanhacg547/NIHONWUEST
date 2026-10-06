import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { getUserProgress } from "@/lib/progress-service";

export const dynamic = "force-dynamic";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const progress = await getUserProgress(userId);
  if (!progress) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(progress);
}

