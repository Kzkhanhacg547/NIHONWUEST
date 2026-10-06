import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { todayKeyForUser } from "@/lib/missionDay";
import { awardUserXP } from "@/lib/progress-service";

export const dynamic = "force-dynamic";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const now = new Date();
  const today = await todayKeyForUser(userId, now);
  let entries = await prisma.userDailyMission.findMany({
    where: { userId, date: today },
    include: { mission: true },
  });
  if (!entries.length) {
    const templates = await prisma.dailyMission.findMany();
    for (const t of templates) {
      await prisma.userDailyMission.upsert({
        where: { userId_missionId_date: { userId, missionId: t.id, date: today } },
        update: {},
        create: { userId, missionId: t.id, date: today, targetCount: t.targetCount },
      });
    }
    entries = await prisma.userDailyMission.findMany({ where: { userId, date: today }, include: { mission: true } });
  }

  // Complete already-met missions idempotently; award XP once.
  for (const e of entries) {
    if (e.status !== "COMPLETED" && e.progress >= e.targetCount) {
      await prisma.userDailyMission.update({
        where: { id: e.id },
        data: { status: "COMPLETED", completedAt: now },
      });
      await awardUserXP({
        userId,
        amount: e.mission.xpReward,
        reason: "MISSION_COMPLETE",
        referenceId: e.id,
        now,
      });
    }
  }
  const fresh = await prisma.userDailyMission.findMany({ where: { userId, date: today }, include: { mission: true } });
  return NextResponse.json(fresh);
}

