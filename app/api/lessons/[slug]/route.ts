import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const lesson = await prisma.lesson.findUnique({
    where: { slug: params.slug },
    include: { exercises: { orderBy: { order: "asc" }, include: { options: { orderBy: { order: "asc" } } } } },
  });
  if (!lesson || !lesson.isPublished) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const progress = await prisma.userLessonProgress.findUnique({ where: { userId_lessonId: { userId, lessonId: lesson.id } } });
  const attempts = await prisma.exerciseAttempt.findMany({ where: { userId, lessonId: lesson.id } });
  return NextResponse.json({ lesson, progress, attempts });
}
