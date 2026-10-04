import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { localDateKey } from "@/lib/streak";

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

  const { score, answers } = parsed.data;
  const now = new Date();
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { timezone: true } });
  const dateKey = localDateKey(now, user?.timezone ?? "UTC");

  const referenceId = `dungeon_${dateKey}`;

  // Check if already completed today to prevent duplicate XP exploit
  const existingXp = await prisma.xpTransaction.findFirst({
    where: { userId, reason: "SENSEI_DAILY_DUNGEON", referenceId },
  });

  let xpEarned = 0;
  if (!existingXp) {
    // Base 50 XP for clearing dungeon + 10 XP per correct answer
    xpEarned = 50 + score * 10;

    await prisma.$transaction([
      prisma.xpTransaction.create({
        data: {
          userId,
          amount: xpEarned,
          reason: "SENSEI_DAILY_DUNGEON",
          referenceId,
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { totalXP: { increment: xpEarned } },
      }),
    ]);
  }

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
      await prisma.user.update({
        where: { id: userId },
        data: { totalXP: { increment: achievement.xpReward } },
      });
      achievementUnlocked = true;
    }
  }

  return NextResponse.json({
    success: true,
    xpEarned,
    score,
    streak: currentStreak,
    achievementUnlocked,
    isFirstCompletionToday: !existingXp,
  });
}
