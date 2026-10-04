import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { localDateKey } from "@/lib/streak";

const schema = z.object({
  character: z.string().min(1),
  script: z.string().min(1),
});

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid kana." }, { status: 400 });

  const kana = await prisma.kana.findUnique({
    where: { character_script: { character: parsed.data.character, script: parsed.data.script } },
  });
  if (!kana) return NextResponse.json({ error: "Kana not found." }, { status: 404 });

  const contentId = `${kana.script}:${kana.character}`;
  const now = new Date();

  await prisma.reviewItem.upsert({
    where: { userId_contentType_contentId: { userId, contentType: "KANA", contentId } },
    update: { lastReviewedAt: now, repetitions: { increment: 1 }, dueAt: new Date(now.getTime() + 86400000) },
    create: { userId, contentType: "KANA", contentId, repetitions: 1, interval: 1, dueAt: new Date(now.getTime() + 86400000), lastReviewedAt: now },
  });

  // Award XP (+10 XP) for mastering kana
  const priorXp = await prisma.xpTransaction.findFirst({
    where: { userId, reason: "KANA_PRACTICE", referenceId: contentId },
  });

  let xpAwarded = 0;
  if (!priorXp) {
    xpAwarded = 10;
    await prisma.xpTransaction.create({
      data: { userId, amount: 10, reason: "KANA_PRACTICE", referenceId: contentId },
    });
    await prisma.user.update({
      where: { id: userId },
      data: { totalXP: { increment: 10 }, lastActivityAt: now },
    });
  } else {
    await prisma.user.update({ where: { id: userId }, data: { lastActivityAt: now } });
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { timezone: true } });
  const dateKey = localDateKey(now, user?.timezone || "UTC");
  await prisma.userDailyMission.updateMany({
    where: { userId, date: dateKey, mission: { type: "KANA" } },
    data: { progress: { increment: 1 } },
  });

  return NextResponse.json({ ok: true, contentId, xpAwarded });
}
