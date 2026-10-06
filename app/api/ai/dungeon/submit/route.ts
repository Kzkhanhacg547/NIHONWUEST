import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { localDateKey } from "@/lib/streak";
import { awardUserXP } from "@/lib/progress-service";

const submitSchema = z.object({
  score: z.number().int().min(0).max(5),
  answers: z.array(
    z.object({
      questionId: z.string(),
      selectedIndex: z.number().int(),
      isCorrect: z.boolean(),
    })
  ).min(1),
});

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  const { score } = parsed.data;
  const now = new Date();
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { timezone: true } });
  const dateKey = localDateKey(now, user?.timezone ?? "UTC");

  const referenceId = `dungeon_${dateKey}`;

  // Base 50 XP for clearing dungeon + 10 XP per correct answer
  const xpEarned = 50 + score * 10;

  const awardResult = await awardUserXP({
    userId,
    amount: xpEarned,
    reason: "SENSEI_DAILY_DUNGEON",
    referenceId,
    now,
  });

  // Update Daily Mission if any KANA or LESSON mission exists
  const missions = await prisma.dailyMission.findMany({
    take: 5,
  });
  if (missions.length > 0) {
    const firstMission = missions[0];
    await prisma.userDailyMission.upsert({
      where: {
        userId_missionId_date: {
          userId,
          missionId: firstMission.id,
          date: dateKey,
        },
      },
      update: {
        progress: { increment: 1 },
        status: "COMPLETED",
        completedAt: now,
      },
      create: {
        userId,
        missionId: firstMission.id,
        date: dateKey,
        progress: 1,
        targetCount: 1,
        status: "COMPLETED",
        completedAt: now,
      },
    });
  }

  // Calculate new streak
  const recentDungeonTxs = await prisma.xpTransaction.findMany({
    where: { userId, reason: "SENSEI_DAILY_DUNGEON" },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  const dates = Array.from(
    new Set(
      recentDungeonTxs.map((tx) =>
        localDateKey(new Date(tx.createdAt), user?.timezone ?? "UTC")
      )
    )
  );

  let currentStreak = 0;
  let checkDate = new Date(now);
  for (let i = 0; i < 30; i++) {
    const dKey = localDateKey(checkDate, user?.timezone ?? "UTC");
    if (dates.includes(dKey)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Check 7-day streak achievement
  let achievementUnlocked = false;
  if (currentStreak >= 7) {
    const achievementKey = "DUNGEON_MASTER";
    let achievement = await prisma.achievement.findUnique({
      where: { key: achievementKey },
    });

    if (!achievement) {
      achievement = await prisma.achievement.create({
        data: {
          key: achievementKey,
          title: "🏯 Kẻ Chinh Phục Ngục Tối",
          description: "Hoàn thành Sensei's Daily Dungeon 7 ngày liên tiếp!",
          icon: "castle",
          xpReward: 200,
        },
      });
    }

    const userAch = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: { userId, achievementId: achievement.id },
      },
    });

    if (!userAch) {
      await prisma.userAchievement.create({
        data: { userId, achievementId: achievement.id },
      });
      await awardUserXP({
        userId,
        amount: achievement.xpReward,
        reason: "ACHIEVEMENT",
        referenceId: achievement.id,
        now,
      });
      achievementUnlocked = true;
    }
  }

  return NextResponse.json({
    success: true,
    xpEarned: awardResult.xpAwarded,
    score,
    streak: awardResult.streak.currentStreak,
    achievementUnlocked: achievementUnlocked || awardResult.newlyUnlockedAchievements.length > 0,
    isFirstCompletionToday: awardResult.xpAwarded > 0,
    newLevel: awardResult.level,
    newTotalXP: awardResult.totalXP,
    leveledUp: awardResult.leveledUp,
    newlyUnlockedAchievements: awardResult.newlyUnlockedAchievements,
    newlyUnlockedJourney: awardResult.newlyUnlockedJourney,
  });
}

