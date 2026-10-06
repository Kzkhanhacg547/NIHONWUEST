import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { todayKeyForUser } from "@/lib/missionDay";
import { awardUserXP, touchUserActivity } from "@/lib/progress-service";

const ACTIVITY_TYPES = {
  REVIEW_COMPLETE: 20,
  KANA_PRACTICE: 5,
  SURVIVAL_COMPLETE: 30,
} as const;

const schema = z.object({
  type: z.enum(["REVIEW_COMPLETE", "KANA_PRACTICE", "SURVIVAL_COMPLETE"]),
  dayKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid activity payload." }, { status: 400 });
  }

  const now = new Date();
  const xpReward = ACTIVITY_TYPES[parsed.data.type];
  const referenceId = `${parsed.data.type}:${parsed.data.dayKey}`;

  const awardResult = await awardUserXP({
    userId,
    amount: xpReward,
    reason: "ACTIVITY_BONUS",
    referenceId,
    now,
  });

  if (awardResult.xpAwarded === 0) {
    await touchUserActivity(userId, now);
  }

  const todayKey = await todayKeyForUser(userId, now);
  const missionType = parsed.data.type === "REVIEW_COMPLETE" ? "REVIEW" : parsed.data.type === "KANA_PRACTICE" ? "KANA" : "LESSON";
  await prisma.userDailyMission.updateMany({
    where: { userId, date: todayKey, mission: { type: missionType }, status: "IN_PROGRESS" },
    data: { progress: { increment: 1 } },
  });

  return NextResponse.json({
    ok: true,
    xpAwarded: awardResult.xpAwarded,
    currentStreak: awardResult.streak.currentStreak,
    longestStreak: awardResult.streak.longestStreak,
    level: awardResult.level,
    totalXP: awardResult.totalXP,
    leveledUp: awardResult.leveledUp,
    newlyUnlockedAchievements: awardResult.newlyUnlockedAchievements,
    newlyUnlockedJourney: awardResult.newlyUnlockedJourney,
  });
}