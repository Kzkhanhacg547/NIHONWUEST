import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { calculateLevel } from "@/lib/level";
import { AppNav } from "@/components/AppNav";
import {
  aggregateXpHistory,
  aggregateHeatmap,
  calculateReviewMetrics,
  calculatePersonalRecords,
  formatStudyTime,
} from "@/lib/stats";
import { StatsClient, type RecentActivityItem, type LearningBreakdownData } from "./StatsClient";

export const metadata = { title: "Thống Kê Học Tập — Nihon Quest" };

function formatRelativeTime(date: Date, now: Date = new Date()): string {
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHour / 24);

  if (diffMin < 1) return "Vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;
  if (diffHour < 24) return `${diffHour} giờ trước`;
  if (diffDays === 1) return "Hôm qua";
  if (diffDays < 7) return `${diffDays} ngày trước`;

  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;
}

export default async function StatsPage() {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: uid },
    include: { profile: true },
  });
  if (!user) redirect("/login");
  if (!user.onboardingCompleted) redirect("/onboarding");

  const userLevel = user.learningLevel || "N5";
  const levelInfo = calculateLevel(user.totalXP);
  const levelProgressPercent = Math.round(levelInfo.progress * 100);

  // 1. Study time from exercise attempts
  const timeAggregate = await prisma.exerciseAttempt.aggregate({
    where: { userId: uid },
    _sum: { timeSpent: true },
  });
  const totalStudyTimeSeconds = timeAggregate._sum.timeSpent || 0;
  const studyTimeFormatted = formatStudyTime(totalStudyTimeSeconds);

  // 2. Lessons counts & completed progress
  const [completedLessonsCount, totalLessonsInLevel, totalAllLessons] = await Promise.all([
    prisma.userLessonProgress.count({
      where: { userId: uid, status: "COMPLETED" },
    }),
    prisma.lesson.count({
      where: { isPublished: true, level: userLevel },
    }),
    prisma.lesson.count({
      where: { isPublished: true },
    }),
  ]);

  // 3. Kana counts & mastered progress
  const [kanaMasteredCount, totalKanaCount] = await Promise.all([
    prisma.reviewItem.count({
      where: { userId: uid, contentType: "KANA" },
    }),
    prisma.kana.count(),
  ]);

  // 4. Vocabulary counts & learned in SRS
  const [vocabLearnedCount, totalVocabCount] = await Promise.all([
    prisma.reviewItem.count({
      where: { userId: uid, contentType: "VOCAB" },
    }),
    prisma.vocabulary.count({
      where: { jlptLevel: userLevel },
    }),
  ]);

  // 5. Grammar points count
  const [totalGrammarCount, grammarReviewCount] = await Promise.all([
    prisma.grammar.count({
      where: { level: userLevel },
    }),
    prisma.reviewItem.count({
      where: { userId: uid, contentType: "GRAMMAR" },
    }),
  ]);

  // 6. Achievements count
  const [unlockedAchievementsCount, totalAchievementsCount] = await Promise.all([
    prisma.userAchievement.count({
      where: { userId: uid },
    }),
    prisma.achievement.count(),
  ]);

  // 7. Review Items & History for SRS Metrics
  const [reviewItems, reviewHistory] = await Promise.all([
    prisma.reviewItem.findMany({
      where: { userId: uid },
      select: { repetitions: true, interval: true, dueAt: true },
    }),
    prisma.reviewHistory.findMany({
      where: { userId: uid },
      select: { grade: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const reviewMetrics = calculateReviewMetrics(reviewItems, reviewHistory);

  // 8. XP Transactions for Chart & Heatmap
  const allXpTransactions = await prisma.xpTransaction.findMany({
    where: { userId: uid },
    orderBy: { createdAt: "asc" },
  });

  const now = new Date();
  const xp7Days = aggregateXpHistory(allXpTransactions, 7, user.timezone, now);
  const xp30Days = aggregateXpHistory(allXpTransactions, 30, user.timezone, now);
  const xp90Days = aggregateXpHistory(allXpTransactions, 90, user.timezone, now);

  // Timestamps for heatmap
  const attemptTimestamps = await prisma.exerciseAttempt.findMany({
    where: { userId: uid },
    select: { createdAt: true },
  });
  const allTimestamps = [
    ...attemptTimestamps.map((a) => a.createdAt),
    ...reviewHistory.map((r) => r.createdAt),
  ];

  const heatmapWeeks = aggregateHeatmap(
    allXpTransactions,
    allTimestamps,
    user.timezone,
    20,
    now
  );

  // 9. Personal Records
  const personalRecords = calculatePersonalRecords({
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    transactions: allXpTransactions,
    totalLessonsCompleted: completedLessonsCount,
    totalReviewsDone: reviewHistory.length,
    totalStudyTimeSeconds,
    timezone: user.timezone,
  });

  // 10. Learning Breakdown calculation
  const safeTotalKana = totalKanaCount || 104;
  const safeTotalVocab = totalVocabCount || 100;
  const safeTotalGrammar = totalGrammarCount || 40;
  const safeTotalLessons = totalLessonsInLevel || 20;

  const breakdown: LearningBreakdownData = {
    kana: {
      mastered: kanaMasteredCount,
      total: safeTotalKana,
      percent: Math.min(100, Math.round((kanaMasteredCount / safeTotalKana) * 100)),
    },
    vocabulary: {
      learned: vocabLearnedCount,
      total: safeTotalVocab,
      percent: Math.min(100, Math.round((vocabLearnedCount / safeTotalVocab) * 100)),
    },
    grammar: {
      learned: Math.min(safeTotalGrammar, Math.max(grammarReviewCount, Math.round(completedLessonsCount * 1.5))),
      total: safeTotalGrammar,
      percent: Math.min(100, Math.round((Math.min(safeTotalGrammar, Math.max(grammarReviewCount, Math.round(completedLessonsCount * 1.5))) / safeTotalGrammar) * 100)),
    },
    lessons: {
      completed: completedLessonsCount,
      total: safeTotalLessons,
      percent: Math.min(100, Math.round((completedLessonsCount / safeTotalLessons) * 100)),
    },
  };

  // 11. Recent Activities Feed
  const recentTransactions = await prisma.xpTransaction.findMany({
    where: { userId: uid },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  const recentCompletedLessons = await prisma.userLessonProgress.findMany({
    where: { userId: uid, status: "COMPLETED" },
    include: { lesson: true },
    orderBy: { updatedAt: "desc" },
    take: 5,
  });

  const recentAchievements = await prisma.userAchievement.findMany({
    where: { userId: uid },
    include: { achievement: true },
    orderBy: { unlockedAt: "desc" },
    take: 5,
  });

  const recentActivities: RecentActivityItem[] = [];

  for (const tx of recentTransactions) {
    let type: RecentActivityItem["type"] = "OTHER";
    let title = "Hoạt động học tập";

    if (tx.reason === "LESSON_COMPLETE") {
      type = "LESSON";
      const matchLesson = recentCompletedLessons.find((l) => l.lessonId === tx.referenceId);
      title = matchLesson ? `Hoàn thành bài học: ${matchLesson.lesson.title}` : "Hoàn thành bài học";
    } else if (tx.reason === "KANA_PRACTICE") {
      type = "KANA";
      const char = tx.referenceId ? tx.referenceId.split(":")[1] || tx.referenceId : "";
      title = char ? `Luyện viết ký tự Kana: ${char}` : "Luyện viết bảng chữ cái Kana";
    } else if (tx.reason === "ACTIVITY_BONUS") {
      if (tx.referenceId?.startsWith("REVIEW_COMPLETE")) {
        type = "REVIEW";
        title = "Hoàn thành phiên ôn tập thẻ SRS";
      } else if (tx.referenceId?.startsWith("SURVIVAL_COMPLETE")) {
        type = "SURVIVAL";
        title = "Vượt qua thử thách Survival Mode";
      } else {
        type = "OTHER";
        title = "Thưởng rèn luyện hàng ngày";
      }
    } else if (tx.reason === "JOURNEY_COMPLETE") {
      type = "JOURNEY";
      title = "Mở khóa địa danh trên Bản đồ Nhật Bản";
    }

    recentActivities.push({
      id: tx.id,
      type,
      title,
      xpAwarded: tx.amount,
      dateStr: tx.createdAt.toISOString().slice(0, 10),
      relativeTime: formatRelativeTime(tx.createdAt, now),
    });
  }

  // Also include recent unlocked achievements if not in tx
  for (const ach of recentAchievements) {
    if (!recentActivities.some((a) => a.title.includes(ach.achievement.title))) {
      recentActivities.push({
        id: ach.id,
        type: "ACHIEVEMENT",
        title: `Mở khóa thành tựu: ${ach.achievement.title}`,
        description: ach.achievement.description,
        xpAwarded: ach.achievement.xpReward,
        dateStr: ach.unlockedAt.toISOString().slice(0, 10),
        relativeTime: formatRelativeTime(ach.unlockedAt, now),
      });
    }
  }

  const displayName = user.profile?.displayName || user.name || user.email.split("@")[0];

  return (
    <div className="nq-workspace min-h-screen bg-slate-50 text-slate-900 dark:bg-sumi-950 dark:text-white">
      <AppNav
        userName={displayName}
        avatar={user.profile?.avatar ?? null}
        userLevel={user.level}
        userXP={user.totalXP}
        streak={user.currentStreak}
        levelLabel={`Cấp ${user.level}`}
      />

      <main className="mx-auto max-w-[1320px] px-4 pt-4 sm:px-6 lg:px-8">
        <StatsClient
          user={{
            displayName,
            level: levelInfo.level,
            currentLevelXP: levelInfo.currentLevelXP,
            nextLevelXP: levelInfo.nextLevelXP,
            levelProgressPercent,
            totalXP: user.totalXP,
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak,
            learningLevel: userLevel,
          }}
          studyTimeFormatted={studyTimeFormatted}
          achievementsCount={{
            unlocked: unlockedAchievementsCount,
            total: totalAchievementsCount,
          }}
          xp7Days={xp7Days}
          xp30Days={xp30Days}
          xp90Days={xp90Days}
          heatmapWeeks={heatmapWeeks}
          breakdown={breakdown}
          reviewMetrics={reviewMetrics}
          personalRecords={personalRecords}
          recentActivities={recentActivities}
        />
      </main>
    </div>
  );
}
