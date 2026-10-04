import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { todayKeyForUser } from "@/lib/missionDay";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const today = await todayKeyForUser(userId);
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
      await prisma.userDailyMission.update({ where: { id: e.id }, data: { status: "COMPLETED", completedAt: new Date() } });
      const prior = await prisma.xpTransaction.findFirst({ where: { userId, reason: "MISSION_COMPLETE", referenceId: e.id } });
      if (!prior) {
        await prisma.xpTransaction.create({ data: { userId, amount: e.mission.xpReward, reason: "MISSION_COMPLETE", referenceId: e.id } });
        await prisma.user.update({ where: { id: userId }, data: { totalXP: { increment: e.mission.xpReward } } });
      }
    }
  }
  const fresh = await prisma.userDailyMission.findMany({ where: { userId, date: today }, include: { mission: true } });
  return NextResponse.json(fresh);
}
