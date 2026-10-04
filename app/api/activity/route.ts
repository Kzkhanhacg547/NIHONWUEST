import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateLevel } from "@/lib/level";
import { updateStreak } from "@/lib/streak";
import { todayKeyForUser } from "@/lib/missionDay";

const ACTIVITY_TYPES = {
  REVIEW_COMPLETE: 20,
  KANA_PRACTICE: 5,
  SURVIVAL_COMPLETE: 30,
} as const;

const schema = z.object({
  type: z.enum(["REVIEW_COMPLETE", "KANA_PRACTICE", "SURVIVAL_COMPLETE"]),
  // Once per UTC day per activity type; keeps the reward from being farmable.
  dayKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

/**
 * Records a study activity: updates the streak and, for the types above, grants
 * a small daily XP bonus. The client used to send `{ xp: 20 }` and the handler
 * ignored the body entirely, so the UI promised XP that never landed.
 */
export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid activity payload." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const now = new Date();
  const streak = updateStreak({
    lastActivityAt: user.lastActivityAt,
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    now,
    timezone: user.timezone,
  });

  const xpReward = ACTIVITY_TYPES[parsed.data.type];
  const referenceId = `${parsed.data.type}:${parsed.data.dayKey}`;

  const existingReward = await prisma.xpTransaction.findFirst({
    where: { userId, reason: "ACTIVITY_BONUS", referenceId },
  });
  const xpAwarded = existingReward ? 0 : xpReward;

  const nextXp = user.totalXP + xpAwarded;
  const level = calculateLevel(nextXp).level;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        lastActivityAt: now,
        level,
        ...(xpAwarded > 0 ? { totalXP: { increment: xpAwarded } } : {}),
      },
    }),
    ...(xpAwarded > 0
      ? [
          prisma.xpTransaction.create({
            data: { userId, amount: xpAwarded, reason: "ACTIVITY_BONUS", referenceId },
          }),
        ]
      : []),
  ]);

  const todayKey = await todayKeyForUser(userId, now);
  await prisma.userDailyMission.updateMany({
    where: { userId, date: todayKey, mission: { type: "REVIEW" }, status: "IN_PROGRESS" },
    data: { progress: { increment: 1 } },
  });

  return NextResponse.json({
    ok: true,
    xpAwarded,
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    level,
  });
}