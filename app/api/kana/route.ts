import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const script = url.searchParams.get("script") ?? undefined;
  const kind = url.searchParams.get("kind") ?? undefined;
  const kana = await prisma.kana.findMany({
    where: { script, kind },
    orderBy: [{ row: "asc" }, { romaji: "asc" }],
  });
  return NextResponse.json(kana);
}
