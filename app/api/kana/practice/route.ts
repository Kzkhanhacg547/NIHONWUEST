import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { localDateKey } from "@/lib/streak";
import { awardUserXP, touchUserActivity } from "@/lib/progress-service";

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

  const awardResult = await awardUserXP({
    userId,
    amount: 10,
    reason: "KANA_PRACTICE",
    referenceId: contentId,
    now,
  });

  if (awardResult.xpAwarded === 0) {
    await touchUserActivity(userId, now);
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { timezone: true } });
  const dateKey = localDateKey(now, user?.timezone || "UTC");
  await prisma.userDailyMission.updateMany({
    where: { userId, date: dateKey, mission: { type: "KANA" } },
    data: { progress: { increment: 1 } },
  });

  return NextResponse.json({
    ok: true,
    contentId,
    xpAwarded: awardResult.xpAwarded,
    newLevel: awardResult.level,
    newTotalXP: awardResult.totalXP,
    leveledUp: awardResult.leveledUp,
    newlyUnlockedAchievements: awardResult.newlyUnlockedAchievements,
    newlyUnlockedJourney: awardResult.newlyUnlockedJourney,
  });
}

