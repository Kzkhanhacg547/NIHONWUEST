import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkAnswer, scoreQuiz } from "@/lib/quiz";
import { todayKeyForUser } from "@/lib/missionDay";
import { awardUserXP, touchUserActivity } from "@/lib/progress-service";

/** Below this accuracy the lesson stays IN_PROGRESS and pays no XP. */
const PASS_THRESHOLD = 0.6;

const schema = z.object({
  lessonId: z.string(),
  answers: z.array(
    z.object({
      exerciseId: z.string(),
      answer: z.string(),
      timeSpent: z.number().min(0).max(3600).default(0),
    })
  ),
});

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid submission." }, { status: 400 });

  const lesson = await prisma.lesson.findUnique({
    where: { id: parsed.data.lessonId },
    include: { exercises: true },
  });
  if (!lesson) return NextResponse.json({ error: "Lesson not found." }, { status: 404 });

  const existing = await prisma.userLessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId: lesson.id } },
  });

  const byId = new Map(lesson.exercises.map((e) => [e.id, e]));
  const graded = parsed.data.answers
    .map((a) => {
      const ex = byId.get(a.exerciseId);
      if (!ex) return null;
      const isCorrect = checkAnswer(ex.correctAnswer, a.answer);
      return { exerciseId: ex.id, isCorrect, points: ex.points, answer: a.answer, timeSpent: a.timeSpent };
    })
    .filter(Boolean) as Array<{ exerciseId: string; isCorrect: boolean; points: number; answer: string; timeSpent: number }>;

  const now = new Date();

  for (const g of graded) {
    await prisma.exerciseAttempt.create({
      data: {
        userId,
        exerciseId: g.exerciseId,
        lessonId: lesson.id,
        isCorrect: g.isCorrect,
        userAnswer: g.answer,
        timeSpent: g.timeSpent,
        createdAt: now,
      },
    });

    if (!g.isCorrect) {
      const ex = byId.get(g.exerciseId);
      const contentType = ex?.contentType || "EXERCISE";
      const contentId = ex?.contentId || g.exerciseId;

      await prisma.reviewItem.upsert({
        where: {
          userId_contentType_contentId: {
            userId,
            contentType,
            contentId,
          },
        },
        update: {
          dueAt: now,
          interval: 0,
          repetitions: 0,
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
    }
  }

  if (graded.length !== lesson.exercises.length) {
    return NextResponse.json(
      {
        error: "Incomplete submission.",
        expected: lesson.exercises.length,
        received: graded.length,
      },
      { status: 400 }
    );
  }

  const summary = scoreQuiz(graded);
  const score = Math.round(summary.accuracy * 100);
  const passed = summary.accuracy >= PASS_THRESHOLD;
  const bestScore = existing?.score != null ? Math.max(existing.score, score) : score;
  const bestAccuracy = existing?.accuracy != null ? Math.max(existing.accuracy, summary.accuracy) : summary.accuracy;

  const status = passed ? "COMPLETED" : "IN_PROGRESS";

  const progress = await prisma.userLessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId: lesson.id } },
    update: {
      status,
      score: bestScore,
      accuracy: bestAccuracy,
      completedAt: passed ? now : null,
    },
    create: {
      userId,
      lessonId: lesson.id,
      status,
      score,
      accuracy: summary.accuracy,
      completedAt: passed ? now : null,
    },
  });

  const isPriorCompleted = existing?.status === "COMPLETED";
  let xpAwarded = 0;
  let awardResult = null;

  if (passed) {
    awardResult = await awardUserXP({
      userId,
      amount: lesson.xpReward,
      reason: "LESSON_COMPLETE",
      referenceId: lesson.id,
      now,
    });
    xpAwarded = awardResult.xpAwarded;
  } else {
    await touchUserActivity(userId, now);
  }

  // Update daily mission
  const todayKey = await todayKeyForUser(userId, now);
  await prisma.userDailyMission.updateMany({
    where: { userId, date: todayKey, mission: { type: "LESSON" }, status: "IN_PROGRESS" },
    data: { progress: { increment: 1 } },
  });

  return NextResponse.json({
    ok: true,
    passed,
    summary,
    score,
    bestScore,
    xpAwarded,
    isPriorCompleted,
    progressId: progress.id,
    newLevel: awardResult?.level,
    newTotalXP: awardResult?.totalXP,
    leveledUp: awardResult?.leveledUp ?? false,
    newlyUnlockedAchievements: awardResult?.newlyUnlockedAchievements ?? [],
    newlyUnlockedJourney: awardResult?.newlyUnlockedJourney ?? [],
  });
}

