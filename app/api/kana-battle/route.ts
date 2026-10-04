import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function GET(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const scriptParam = url.searchParams.get("script") ?? "mixed";
  const countParam = parseInt(url.searchParams.get("count") ?? "10", 10);
  const kindParam = url.searchParams.get("kind") ?? undefined;

  let scripts: string[] = [];
  const sLower = scriptParam.toLowerCase();
  if (sLower === "hiragana") {
    scripts = ["HIRAGANA", "hiragana"];
  } else if (sLower === "katakana") {
    scripts = ["KATAKANA", "katakana"];
  } else {
    scripts = ["HIRAGANA", "KATAKANA", "hiragana", "katakana"];
  }

  const allKana = await prisma.kana.findMany({
    where: {
      script: { in: scripts },
      ...(kindParam ? { kind: kindParam } : {}),
    },
    select: { id: true, character: true, script: true, romaji: true, audioUrl: true, kind: true, row: true },
  });

  if (allKana.length === 0) {
    return NextResponse.json({ error: "No kana found" }, { status: 404 });
  }

  const selected = shuffle(allKana).slice(0, Math.min(countParam, allKana.length));
  return NextResponse.json({ kana: selected, total: allKana.length });
}
