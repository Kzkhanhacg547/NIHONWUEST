import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildLearningPath, sanitizeAnswers, type PathModule } from "@/lib/personalization";

/**
 * GET /api/learning-path
 * Returns the personalized learning path (lộ trình cá nhân hóa) for the
 * current user, computed from their 5 onboarding answers and enriched
 * with real lesson rows + completion progress.
 */
export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      learningLevel: true,
      learningGoal: true,
      dailyGoalMinutes: true,
      levelChoice: true,
      focusSkill: true,
      learningStyle: true,
    },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const answers = sanitizeAnswers({
    level: user.levelChoice || user.learningLevel,
    goal: user.learningGoal,
    dailyGoalMinutes: user.dailyGoalMinutes,
    focusSkill: user.focusSkill,
    learningStyle: user.learningStyle,
  });

  const path = buildLearningPath(answers);

  // Resolve LESSON / MOCK modules against real DB content + progress.
  const slugs = path.modules
    .filter((m) => (m.kind === "LESSON" || m.kind === "MOCK") && m.slug)
    .map((m) => m.slug!)
    .filter((s, i, arr) => arr.indexOf(s) === i);

  const lessons = await prisma.lesson.findMany({
    where: { slug: { in: slugs }, isPublished: true },
    select: {
      slug: true,
      title: true,
      description: true,
      level: true,
      xpReward: true,
      progress: { where: { userId } },
      _count: { select: { exercises: true } },
    },
  });
  const bySlug = new Map(lessons.map((l) => [l.slug, l]));

  const modules: (PathModule & {
    status: "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED" | "AVAILABLE";
    exerciseCount: number | null;
  })[] = path.modules.map((m) => {
    const lesson = m.slug ? bySlug.get(m.slug) : undefined;
    const raw = lesson?.progress[0]?.status;
    const status: "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED" | "AVAILABLE" =
      lesson
        ? raw === "COMPLETED"
          ? "COMPLETED"
          : raw === "IN_PROGRESS"
            ? "IN_PROGRESS"
            : "NOT_STARTED"
        : "AVAILABLE";
    return {
      ...m,
      title: lesson?.title ?? m.title,
      description: lesson?.description ?? m.description,
      xp: lesson?.xpReward ?? m.xp,
      status,
      exerciseCount: lesson ? lesson._count.exercises : null,
    };
  });

  const completed = modules.filter((m) => m.status === "COMPLETED").length;
  const currentIdx = modules.findIndex((m) => m.status === "NOT_STARTED" || m.status === "IN_PROGRESS");

  return NextResponse.json({
    ...path,
    modules,
    progress: {
      completed,
      total: modules.length,
      percent: Math.round((completed / Math.max(1, modules.length)) * 100),
      currentIndex: currentIdx === -1 ? modules.length - 1 : currentIdx,
    },
  });
}
