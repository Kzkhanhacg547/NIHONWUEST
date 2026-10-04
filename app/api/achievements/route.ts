import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const all = await prisma.achievement.findMany({ orderBy: { title: "asc" } });
  const owned = await prisma.userAchievement.findMany({ where: { userId }, include: { achievement: true } });
  const ownedKeys = new Set(owned.map((o) => o.achievementId));
  return NextResponse.json({ all, owned });
}

export async function POST() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { lessonProgress: true, journeyProgress: true } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const all = await prisma.achievement.findMany();
  const owned = await prisma.userAchievement.findMany({ where: { userId } });
  const ownedIds = new Set(owned.map((o) => o.achievementId));
  const unlocked: string[] = [];

  for (const a of all) {
    if (ownedIds.has(a.id)) continue;
    let eligible = false;
    if (a.key === "first-steps" && user.onboardingCompleted) eligible = true;
    if (a.key === "lesson-complete-1" && user.lessonProgress.some((l) => l.status === "COMPLETED")) eligible = true;
    if (a.key === "kana-starter" && (await prisma.reviewItem.count({ where: { userId, contentType: "KANA" } })) >= 5) eligible = true;
    if (a.key === "xp-500" && user.totalXP >= 500) eligible = true;
    if (a.key === "tokyo-unlocked") {
      const tokyo = await prisma.journeyLocation.findUnique({ where: { slug: "tokyo" } });
      if (tokyo) {
        const p = user.journeyProgress.find((j) => j.locationId === tokyo.id);
        if (p?.status === "COMPLETED") eligible = true;
      }
    }
    if (!eligible) continue;
    await prisma.userAchievement.create({ data: { userId, achievementId: a.id } });
    const prior = await prisma.xpTransaction.findFirst({ where: { userId, reason: "ACHIEVEMENT", referenceId: a.id } });
    if (!prior) {
      await prisma.xpTransaction.create({ data: { userId, amount: a.xpReward, reason: "ACHIEVEMENT", referenceId: a.id } });
      await prisma.user.update({ where: { id: userId }, data: { totalXP: { increment: a.xpReward } } });
    }
    unlocked.push(a.key);
  }
  return NextResponse.json({ unlocked });
}
