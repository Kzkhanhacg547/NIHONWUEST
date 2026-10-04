import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateSrs, nextDueDate, type Grade } from "@/lib/srs";
import { localDateKey } from "@/lib/streak";

const schema = z.object({
  results: z.array(
    z.object({
      kanaId: z.string().min(1),
      character: z.string().min(1),
      script: z.string().min(1),
      isCorrect: z.boolean(),
      timeMs: z.number().int().nonnegative(),
    })
  ).min(1).max(20),
});

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  const { results } = parsed.data;
  const now = new Date();
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { timezone: true } });
  const dateKey = localDateKey(now, user?.timezone ?? "UTC");

  // --- Calculate XP with combo multiplier ---
  let totalXP = 0;
  let currentCombo = 0;
  let maxCombo = 0;
  let correctCount = 0;
  const xpBreakdown: { kanaId: string; baseXP: number; multiplier: number; earned: number }[] = [];

  for (const r of results) {
    if (r.isCorrect) {
      currentCombo++;
      maxCombo = Math.max(maxCombo, currentCombo);
      correctCount++;
      const baseXP = 10;
      // Speed bonus: under 1.5s → +5 XP
      const speedBonus = r.timeMs < 1500 ? 5 : 0;
      const effectiveBase = baseXP + speedBonus;
      // Combo multiplier: x2 khi combo >= 5
      const multiplier = currentCombo >= 5 ? 2 : 1;
      const earned = effectiveBase * multiplier;
      totalXP += earned;
      xpBreakdown.push({ kanaId: r.kanaId, baseXP: effectiveBase, multiplier, earned });
    } else {
      currentCombo = 0;
      xpBreakdown.push({ kanaId: r.kanaId, baseXP: 0, multiplier: 1, earned: 0 });
    }
  }

  // Perfect round bonus
  const isPerfect = correctCount === results.length;
  if (isPerfect) totalXP += 50;

  // --- SRS Updates ---
  for (const r of results) {
    const contentId = `${r.script}:${r.character}`;
    const grade: Grade = r.isCorrect ? "GOOD" : "AGAIN";

    const existing = await prisma.reviewItem.findUnique({
      where: { userId_contentType_contentId: { userId, contentType: "KANA", contentId } },
    });

    if (existing) {
      const next = updateSrs({ ease: existing.ease, interval: existing.interval, repetitions: existing.repetitions }, grade);
      const dueAt = next.dueInDays <= 0 ? now : nextDueDate(now, next.dueInDays);
      await prisma.reviewItem.update({
        where: { id: existing.id },
        data: { ease: next.ease, interval: next.interval, repetitions: next.repetitions, dueAt, lastReviewedAt: now },
      });
      await prisma.reviewHistory.create({
        data: { userId, reviewItemId: existing.id, contentType: "KANA", contentId, grade },
      });
    } else {
      // Create new ReviewItem
      const next = updateSrs({ ease: 2.5, interval: 0, repetitions: 0 }, grade);
      const dueAt = next.dueInDays <= 0 ? now : nextDueDate(now, next.dueInDays);
      const newItem = await prisma.reviewItem.create({
        data: { userId, contentType: "KANA", contentId, ease: next.ease, interval: next.interval, repetitions: next.repetitions, dueAt, lastReviewedAt: now },
      });
      await prisma.reviewHistory.create({
        data: { userId, reviewItemId: newItem.id, contentType: "KANA", contentId, grade },
      });
    }
  }

  // --- Award XP ---
  if (totalXP > 0) {
    await prisma.xpTransaction.create({
      data: { userId, amount: totalXP, reason: "KANA_BATTLE", referenceId: `battle_${now.getTime()}` },
    });
    await prisma.user.update({
      where: { id: userId },
      data: { totalXP: { increment: totalXP }, lastActivityAt: now },
    });
  } else {
    await prisma.user.update({ where: { id: userId }, data: { lastActivityAt: now } });
  }

  // --- Update daily missions (KANA type) ---
  await prisma.userDailyMission.updateMany({
    where: { userId, date: dateKey, mission: { type: "KANA" } },
    data: { progress: { increment: correctCount } },
  });

  return NextResponse.json({
    ok: true,
    totalXP,
    isPerfect,
    correctCount,
    totalCount: results.length,
    maxCombo,
    xpBreakdown,
  });
}
