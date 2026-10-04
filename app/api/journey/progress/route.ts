import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canUnlockJourney } from "@/lib/journey";

const schema = z.object({
  locationId: z.string(),
  action: z.enum(["unlock", "complete", "stamp", "update_progress"]),
  progress: z.number().min(0).max(100).optional(),
});

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid action." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const locations = await prisma.journeyLocation.findMany({ orderBy: { order: "asc" } });
  const idx = locations.findIndex((l) => l.id === parsed.data.locationId);
  if (idx < 0) return NextResponse.json({ error: "Location not found." }, { status: 404 });
  const loc = locations[idx];
  const prev = idx === 0 ? null : locations[idx - 1];
  const prevProgress = prev ? await prisma.userJourneyProgress.findUnique({ where: { userId_locationId: { userId, locationId: prev.id } } }) : null;
  const unlockable = canUnlockJourney({
    locationOrder: loc.order,
    requirementXp: loc.requirementXp,
    totalXP: user.totalXP,
    previousCompleted: idx === 0 || prevProgress?.status === "COMPLETED",
  });
  if (!unlockable) return NextResponse.json({ error: "Location is locked." }, { status: 403 });

  if (parsed.data.action === "unlock") {
    const row = await prisma.userJourneyProgress.upsert({
      where: { userId_locationId: { userId, locationId: loc.id } },
      update: { status: "IN_PROGRESS" },
      create: { userId, locationId: loc.id, status: "IN_PROGRESS" },
    });
    return NextResponse.json(row);
  }

  if (parsed.data.action === "update_progress") {
    const progressVal = Math.min(100, Math.max(0, parsed.data.progress ?? 0));
    const existing = await prisma.userJourneyProgress.findUnique({
      where: { userId_locationId: { userId, locationId: loc.id } },
    });
    const currentStatus = existing?.status ?? "AVAILABLE";
    const newStatus = currentStatus === "COMPLETED" ? "COMPLETED" : (currentStatus === "LOCKED" ? "LOCKED" : "IN_PROGRESS");
    const row = await prisma.userJourneyProgress.upsert({
      where: { userId_locationId: { userId, locationId: loc.id } },
      update: {
        progress: Math.max(existing?.progress ?? 0, progressVal),
        status: newStatus,
      },
      create: {
        userId,
        locationId: loc.id,
        progress: progressVal,
        status: "IN_PROGRESS",
      },
    });
    return NextResponse.json(row);
  }

  if (parsed.data.action === "stamp") {
    const row = await prisma.userJourneyProgress.upsert({
      where: { userId_locationId: { userId, locationId: loc.id } },
      update: { isStamped: true, stampedAt: new Date() },
      create: { userId, locationId: loc.id, isStamped: true, stampedAt: new Date() },
    });
    return NextResponse.json(row);
  }

  const existing = await prisma.userJourneyProgress.findUnique({ where: { userId_locationId: { userId, locationId: loc.id } } });
  if (existing?.status === "COMPLETED") return NextResponse.json({ ok: true, idempotent: true });
  const row = await prisma.userJourneyProgress.upsert({
    where: { userId_locationId: { userId, locationId: loc.id } },
    update: { status: "COMPLETED", progress: 100, completedAt: new Date() },
    create: { userId, locationId: loc.id, status: "COMPLETED", progress: 100, completedAt: new Date() },
  });
  const prior = await prisma.xpTransaction.findFirst({ where: { userId, reason: "JOURNEY_COMPLETE", referenceId: loc.id } });
  if (!prior) {
    await prisma.xpTransaction.create({ data: { userId, amount: loc.xpReward, reason: "JOURNEY_COMPLETE", referenceId: loc.id } });
    await prisma.user.update({ where: { id: userId }, data: { totalXP: { increment: loc.xpReward } } });
  }
  return NextResponse.json(row);
}
