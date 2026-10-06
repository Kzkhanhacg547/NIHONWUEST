import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nextDueDate, updateSrs, type Grade } from "@/lib/srs";
import { todayKeyForUser } from "@/lib/missionDay";
import { touchUserActivity } from "@/lib/progress-service";

const schema = z.object({
  reviewItemId: z.string(),
  grade: z.enum(["AGAIN", "HARD", "GOOD", "EASY"]),
});

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await prisma.reviewItem.findMany({
    where: { userId, dueAt: { lte: new Date() } },
    orderBy: { dueAt: "asc" },
    take: 20,
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid review." }, { status: 400 });

  const item = await prisma.reviewItem.findFirst({ where: { id: parsed.data.reviewItemId, userId } });
  if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const grade = parsed.data.grade as Grade;
  const next = updateSrs({ ease: item.ease, interval: item.interval, repetitions: item.repetitions }, grade);
  const now = new Date();
  const dueAt = next.dueInDays <= 0 ? now : nextDueDate(now, next.dueInDays);
  const updated = await prisma.reviewItem.update({
    where: { id: item.id },
    data: { ease: next.ease, interval: next.interval, repetitions: next.repetitions, dueAt, lastReviewedAt: now },
  });
  await prisma.reviewHistory.create({
    data: { userId, reviewItemId: item.id, contentType: item.contentType, contentId: item.contentId, grade, createdAt: now },
  });

  await touchUserActivity(userId, now);

  const today = await todayKeyForUser(userId, now);
  await prisma.userDailyMission.updateMany({
    where: { userId, date: today, mission: { type: "REVIEW" }, status: "IN_PROGRESS" },
    data: { progress: { increment: 1 } },
  });

  return NextResponse.json(updated);
}

