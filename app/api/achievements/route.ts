import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evaluateUserAchievements } from "@/lib/progress-service";

export const dynamic = "force-dynamic";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const all = await prisma.achievement.findMany({ orderBy: { title: "asc" } });
  const owned = await prisma.userAchievement.findMany({ where: { userId }, include: { achievement: true } });
  return NextResponse.json({ all, owned });
}

export async function POST() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const unlocked = await evaluateUserAchievements(userId);
  return NextResponse.json({ unlocked });
}

