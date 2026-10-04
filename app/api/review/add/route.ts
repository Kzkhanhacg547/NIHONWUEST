import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  contentType: z.enum(["VOCAB", "KANJI", "KANA"]),
  contentId: z.string().min(1),
});

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });

  const { contentType, contentId } = parsed.data;

  // Verify item exists
  if (contentType === "VOCAB") {
    const v = await prisma.vocabulary.findUnique({ where: { id: contentId } });
    if (!v) return NextResponse.json({ error: "Không tìm thấy từ vựng." }, { status: 404 });
  } else if (contentType === "KANJI") {
    const k = await prisma.kanji.findUnique({ where: { id: contentId } });
    if (!k) return NextResponse.json({ error: "Không tìm thấy Hán tự." }, { status: 404 });
  }

  const now = new Date();
  const item = await prisma.reviewItem.upsert({
    where: {
      userId_contentType_contentId: {
        userId,
        contentType,
        contentId,
      },
    },
    update: {
      dueAt: now,
    },
    create: {
      userId,
      contentType,
      contentId,
      ease: 2.5,
      interval: 0,
      repetitions: 0,
      dueAt: now,
    },
  });

  return NextResponse.json({ ok: true, item });
}
