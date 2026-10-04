import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const lessons = await prisma.lesson.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    include: {
      _count: { select: { exercises: true } },
      progress: { where: { userId } },
    },
  });
  return NextResponse.json(
    lessons.map((l) => ({
      id: l.id,
      slug: l.slug,
      title: l.title,
      description: l.description,
      level: l.level,
      order: l.order,
      xpReward: l.xpReward,
      exerciseCount: l._count.exercises,
      status: l.progress[0]?.status ?? "NOT_STARTED",
      score: l.progress[0]?.score ?? null,
    }))
  );
}
