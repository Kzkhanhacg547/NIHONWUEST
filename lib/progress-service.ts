import { prisma } from "@/lib/prisma";
import { calculateLevel } from "@/lib/level";
import { updateStreak, localDateKey } from "@/lib/streak";
import { canUnlockJourney, resolveJourneyStatus } from "@/lib/journey";
import { formatStudyTime } from "@/lib/stats";
import { todayKeyForUser } from "@/lib/missionDay";

export interface CanonicalUserProgress {
  userId: string;
  email: string;
  name: string | null;
  displayName: string;
  avatar: string | null;
  bio: string | null;
  timezone: string;
  learningLevel: string; // N5, N4, N3, etc.
  learningGoal: string;
  dailyGoalMinutes: number;
  focusSkill: string;
  learningStyle: string;
  theme: string;
  soundEnabled: boolean;
  onboardingCompleted: boolean;

  // XP and Level (Single canonical source of truth)
  totalXP: number;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  levelProgress: number; // 0..1

  // Streak & Activity
  currentStreak: number;
  longestStreak: number;
  lastActivityAt: string | null;

  // Aggregated Stats
  stats: {
    completedLessonsCount: number;
    totalLessonsInLevel: number;
    totalAllLessons: number;
    lessonProgressPercent: number;

    kanaMasteredCount: number;
    totalKanaCount: number;
    kanaPercent: number;

    vocabLearnedCount: number;
    totalVocabInLevel: number;
    totalAllVocab: number;

    grammarLearnedCount: number;
    totalGrammarInLevel: number;
    totalAllGrammar: number;

    totalReviewsDone: number;
    totalReviewItems: number;
    dueReviewCount: number;
    reviewAccuracy: number | null;

    completedJourneyCount: number;
    totalJourneyCount: number;
    journeyPercent: number;

    unlockedAchievementsCount: number;
    totalAchievementsCount: number;

    totalStudyTimeSeconds: number;
    formattedStudyTime: string;
  };
}

export interface AwardXpResult {
  xpAwarded: number;
  totalXP: number;
  level: number;
  leveledUp: boolean;
  streak: {
    currentStreak: number;
    longestStreak: number;
  };
  newlyUnlockedAchievements: string[];
  newlyUnlockedJourney: string[];
}

/**
 * Retrieves the canonical user progress model with synchronized metrics.
 */
export async function getUserProgress(userId: string): Promise<CanonicalUserProgress | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!user) return null;

  const userLevel = user.learningLevel || "N5";
  const levelInfo = calculateLevel(user.totalXP);

  // Self-heal DB level if out of sync with calculateLevel(totalXP)
  if (user.level !== levelInfo.level) {
    await prisma.user.update({
      where: { id: userId },
      data: { level: levelInfo.level },
    });
    user.level = levelInfo.level;
  }

  const now = new Date();

  const [
    completedLessonsCount,
    totalLessonsInLevel,
    totalAllLessons,
    kanaMasteredCount,
    totalKanaCount,
    vocabLearnedCount,
    totalVocabInLevel,
    totalAllVocab,
    grammarLearnedCount,
    totalGrammarInLevel,
    totalAllGrammar,
    totalReviewItems,
    dueReviewCount,
    reviewHistory,
    completedJourneyCount,
    totalJourneyCount,
    unlockedAchievementsCount,
    totalAchievementsCount,
    timeAggregate,
  ] = await Promise.all([
    prisma.userLessonProgress.count({
      where: { userId, status: "COMPLETED" },
    }),
    prisma.lesson.count({
      where: { isPublished: true, level: userLevel },
    }),
    prisma.lesson.count({
      where: { isPublished: true },
    }),
    prisma.reviewItem.count({
      where: { userId, contentType: "KANA" },
    }),
    prisma.kana.count(),
    prisma.reviewItem.count({
      where: { userId, contentType: "VOCAB" },
    }),
    prisma.vocabulary.count({
      where: { jlptLevel: userLevel },
    }),
    prisma.vocabulary.count(),
    prisma.reviewItem.count({
      where: { userId, contentType: "GRAMMAR" },
    }),
    prisma.grammar.count({
      where: { level: userLevel },
    }),
    prisma.grammar.count(),
    prisma.reviewItem.count({
      where: { userId },
    }),
    prisma.reviewItem.count({
      where: { userId, dueAt: { lte: now } },
    }),
    prisma.reviewHistory.findMany({
      where: { userId },
      select: { grade: true },
    }),
    prisma.userJourneyProgress.count({
      where: { userId, status: "COMPLETED" },
    }),
    prisma.journeyLocation.count(),
    prisma.userAchievement.count({
      where: { userId },
    }),
    prisma.achievement.count(),
    prisma.exerciseAttempt.aggregate({
      where: { userId },
      _sum: { timeSpent: true },
    }),
  ]);

  const totalReviewsDone = reviewHistory.length;
  let reviewAccuracy: number | null = null;
  if (totalReviewsDone > 0) {
    const correctReviews = reviewHistory.filter((h) => h.grade === "GOOD" || h.grade === "EASY").length;
    reviewAccuracy = Math.round((correctReviews / totalReviewsDone) * 100);
  }

  const lessonProgressPercent = totalLessonsInLevel > 0
    ? Math.min(100, Math.round((completedLessonsCount / totalLessonsInLevel) * 100))
    : 0;

  const kanaPercent = totalKanaCount > 0
    ? Math.min(100, Math.round((kanaMasteredCount / totalKanaCount) * 100))
    : 0;

  const journeyPercent = totalJourneyCount > 0
    ? Math.min(100, Math.round((completedJourneyCount / totalJourneyCount) * 100))
    : 0;

  const totalStudyTimeSeconds = timeAggregate._sum.timeSpent || 0;
  const formattedStudyTime = formatStudyTime(totalStudyTimeSeconds);

  const displayName = user.profile?.displayName || user.name || user.email.split("@")[0];
  const avatar = user.profile?.avatar || user.image || null;

  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    displayName,
    avatar,
    bio: user.profile?.bio || null,
    timezone: user.timezone || "UTC",
    learningLevel: user.learningLevel || "N5",
    learningGoal: user.learningGoal || "TRAVEL",
    dailyGoalMinutes: user.dailyGoalMinutes || 15,
    focusSkill: user.focusSkill || "BALANCED",
    learningStyle: user.learningStyle || "STRUCTURED",
    theme: user.theme || "system",
    soundEnabled: user.soundEnabled ?? true,
    onboardingCompleted: user.onboardingCompleted,

    totalXP: user.totalXP,
    level: levelInfo.level,
    currentLevelXP: levelInfo.currentLevelXP,
    nextLevelXP: levelInfo.nextLevelXP,
    levelProgress: levelInfo.progress,

    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    lastActivityAt: user.lastActivityAt ? user.lastActivityAt.toISOString() : null,

    stats: {
      completedLessonsCount,
      totalLessonsInLevel,
      totalAllLessons,
      lessonProgressPercent,

      kanaMasteredCount,
      totalKanaCount,
      kanaPercent,

      vocabLearnedCount,
      totalVocabInLevel,
      totalAllVocab,

      grammarLearnedCount,
      totalGrammarInLevel,
      totalAllGrammar,

      totalReviewsDone,
      totalReviewItems,
      dueReviewCount,
      reviewAccuracy,

      completedJourneyCount,
      totalJourneyCount,
      journeyPercent,

      unlockedAchievementsCount,
      totalAchievementsCount,

      totalStudyTimeSeconds,
      formattedStudyTime,
    },
  };
}

/**
 * Central service function to award XP atomically, recalculate Level,
 * update streak, update lastActivityAt, and evaluate achievements & journey unlocks.
 */
export async function awardUserXP(params: {
  userId: string;
  amount: number;
  reason: string;
  referenceId?: string | null;
  now?: Date;
  timezone?: string;
}): Promise<AwardXpResult> {
  const { userId, amount, reason, referenceId, now = new Date() } = params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      totalXP: true,
      level: true,
      currentStreak: true,
      longestStreak: true,
      lastActivityAt: true,
      timezone: true,
    },
  });

  if (!user) {
    throw new Error(`User not found: ${userId}`);
  }

  const tz = params.timezone || user.timezone || "UTC";

  // Check idempotency if referenceId is given
  if (referenceId) {
    const existing = await prisma.xpTransaction.findFirst({
      where: { userId, reason, referenceId },
    });
    if (existing) {
      return {
        xpAwarded: 0,
        totalXP: user.totalXP,
        level: user.level,
        leveledUp: false,
        streak: {
          currentStreak: user.currentStreak,
          longestStreak: user.longestStreak,
        },
        newlyUnlockedAchievements: [],
        newlyUnlockedJourney: [],
      };
    }
  }

  const newTotalXP = user.totalXP + Math.max(0, amount);
  const { level: newLevel } = calculateLevel(newTotalXP);
  const leveledUp = newLevel > user.level;

  const updatedStreak = updateStreak({
    lastActivityAt: user.lastActivityAt,
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    now,
    timezone: tz,
  });

  await prisma.$transaction(async (tx) => {
    if (amount > 0) {
      await tx.xpTransaction.create({
        data: {
          userId,
          amount,
          reason,
          referenceId: referenceId ?? null,
          createdAt: now,
        },
      });
    }

    await tx.user.update({
      where: { id: userId },
      data: {
        totalXP: newTotalXP,
        level: newLevel,
        currentStreak: updatedStreak.currentStreak,
        longestStreak: updatedStreak.longestStreak,
        lastActivityAt: now,
      },
    });
  });

  // Check achievements & journey unlocks
  const newlyUnlockedAchievements = await evaluateUserAchievements(userId);
  const newlyUnlockedJourney = await evaluateUserJourneyUnlocks(userId, newTotalXP);

  return {
    xpAwarded: amount,
    totalXP: newTotalXP,
    level: newLevel,
    leveledUp,
    streak: {
      currentStreak: updatedStreak.currentStreak,
      longestStreak: updatedStreak.longestStreak,
    },
    newlyUnlockedAchievements,
    newlyUnlockedJourney,
  };
}

/**
 * Updates streak and lastActivityAt without giving XP if no XP transaction occurred.
 */
export async function touchUserActivity(userId: string, now: Date = new Date()): Promise<{
  currentStreak: number;
  longestStreak: number;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      currentStreak: true,
      longestStreak: true,
      lastActivityAt: true,
      timezone: true,
    },
  });

  if (!user) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const updatedStreak = updateStreak({
    lastActivityAt: user.lastActivityAt,
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    now,
    timezone: user.timezone || "UTC",
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      currentStreak: updatedStreak.currentStreak,
      longestStreak: updatedStreak.longestStreak,
      lastActivityAt: now,
    },
  });

  return {
    currentStreak: updatedStreak.currentStreak,
    longestStreak: updatedStreak.longestStreak,
  };
}

/**
 * Evaluates achievement criteria and awards XP for unlocked achievements.
 */
export async function evaluateUserAchievements(userId: string): Promise<string[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { lessonProgress: true, journeyProgress: true },
  });

  if (!user) return [];

  const allAchievements = await prisma.achievement.findMany();
  const owned = await prisma.userAchievement.findMany({ where: { userId } });
  const ownedAchievementIds = new Set(owned.map((o) => o.achievementId));

  const newlyUnlocked: string[] = [];

  const kanaCount = await prisma.reviewItem.count({
    where: { userId, contentType: "KANA" },
  });

  for (const a of allAchievements) {
    if (ownedAchievementIds.has(a.id)) continue;

    let eligible = false;
    if (a.key === "first-steps" && user.onboardingCompleted) {
      eligible = true;
    } else if (a.key === "lesson-complete-1" && user.lessonProgress.some((l) => l.status === "COMPLETED")) {
      eligible = true;
    } else if (a.key === "kana-starter" && kanaCount >= 5) {
      eligible = true;
    } else if (a.key === "xp-500" && user.totalXP >= 500) {
      eligible = true;
    } else if (a.key === "tokyo-unlocked") {
      const tokyo = await prisma.journeyLocation.findUnique({ where: { slug: "tokyo" } });
      if (tokyo) {
        const p = user.journeyProgress.find((j) => j.locationId === tokyo.id);
        if (p?.status === "COMPLETED") eligible = true;
      }
    }

    if (!eligible) continue;

    // Award achievement
    await prisma.userAchievement.create({
      data: { userId, achievementId: a.id },
    });

    const prior = await prisma.xpTransaction.findFirst({
      where: { userId, reason: "ACHIEVEMENT", referenceId: a.id },
    });

    if (!prior && a.xpReward > 0) {
      await prisma.xpTransaction.create({
        data: {
          userId,
          amount: a.xpReward,
          reason: "ACHIEVEMENT",
          referenceId: a.id,
        },
      });
      const newXP = user.totalXP + a.xpReward;
      const { level: newLevel } = calculateLevel(newXP);
      await prisma.user.update({
        where: { id: userId },
        data: {
          totalXP: newXP,
          level: newLevel,
        },
      });
      user.totalXP = newXP;
    }

    newlyUnlocked.push(a.key);
  }

  return newlyUnlocked;
}

/**
 * Evaluates journey location unlocks based on real user progress (XP / location order / previous location).
 */
export async function evaluateUserJourneyUnlocks(
  userId: string,
  currentXP?: number
): Promise<string[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { totalXP: true },
  });

  if (!user) return [];
  const effectiveXP = currentXP !== undefined ? currentXP : user.totalXP;

  const locations = await prisma.journeyLocation.findMany({
    orderBy: { order: "asc" },
  });

  const progressRecords = await prisma.userJourneyProgress.findMany({
    where: { userId },
  });
  const progressMap = new Map(progressRecords.map((p) => [p.locationId, p]));

  const newlyUnlocked: string[] = [];

  for (let i = 0; i < locations.length; i++) {
    const loc = locations[i];
    const prevLoc = i === 0 ? null : locations[i - 1];
    const prevProgress = prevLoc ? progressMap.get(prevLoc.id) : null;
    const previousCompleted = i === 0 || prevProgress?.status === "COMPLETED";

    const existingProgress = progressMap.get(loc.id);
    const currentStatus = existingProgress?.status ?? "LOCKED";

    const resolvedStatus = resolveJourneyStatus({
      currentStatus,
      locationOrder: loc.order,
      requirementXp: loc.requirementXp,
      totalXP: effectiveXP,
      previousCompleted,
    });

    if (!existingProgress) {
      const created = await prisma.userJourneyProgress.create({
        data: {
          userId,
          locationId: loc.id,
          status: resolvedStatus,
        },
      });
      progressMap.set(loc.id, created);
      if (resolvedStatus === "AVAILABLE" || resolvedStatus === "IN_PROGRESS") {
        newlyUnlocked.push(loc.slug);
      }
    } else if (
      existingProgress.status === "LOCKED" &&
      (resolvedStatus === "AVAILABLE" || resolvedStatus === "IN_PROGRESS")
    ) {
      const updated = await prisma.userJourneyProgress.update({
        where: { userId_locationId: { userId, locationId: loc.id } },
        data: { status: resolvedStatus },
      });
      progressMap.set(loc.id, updated);
      newlyUnlocked.push(loc.slug);
    }
  }

  return newlyUnlocked;
}

