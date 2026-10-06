import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { AppNav } from "@/components/AppNav";
import { JourneyClient } from "./JourneyClient";
import { canUnlockJourney, resolveJourneyStatus } from "@/lib/journey";
import { JapanBackdrop } from "@/components/JapanIllustration";
import "./journey.css";

export default async function JourneyPage() {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: uid } });
  if (!user) redirect("/login");
  const locations = await prisma.journeyLocation.findMany({ orderBy: { order: "asc" } });
  const progress = await prisma.userJourneyProgress.findMany({ where: { userId: uid } });
  const byId = new Map(progress.map((p) => [p.locationId, p]));

  // Sync journey status to the real XP gate so all pages use the same source of truth.
  for (const loc of locations) {
    const currentStatus = byId.get(loc.id)?.status ?? "LOCKED";
    const resolvedStatus = resolveJourneyStatus({
      currentStatus,
      locationOrder: loc.order,
      requirementXp: loc.requirementXp,
      totalXP: user.totalXP,
      previousCompleted: true,
    });

    if (!byId.has(loc.id)) {
      const created = await prisma.userJourneyProgress.create({
        data: { userId: uid, locationId: loc.id, status: resolvedStatus },
      });
      byId.set(loc.id, created);
      continue;
    }

    if (byId.get(loc.id)?.status !== resolvedStatus && resolvedStatus !== "IN_PROGRESS" && resolvedStatus !== "COMPLETED") {
      const updated = await prisma.userJourneyProgress.update({
        where: { userId_locationId: { userId: uid, locationId: loc.id } },
        data: { status: resolvedStatus },
      });
      byId.set(loc.id, updated);
    }
  }

  const achievements = await prisma.userAchievement.findMany({ where: { userId: uid }, include: { achievement: true } });

  const rows = locations.map((loc, i) => {
    const prev = i === 0 ? null : locations[i - 1];
    const prevStatus = prev ? byId.get(prev.id)?.status : null;
    return {
      location: JSON.parse(JSON.stringify(loc)),
      progress: byId.get(loc.id) ? JSON.parse(JSON.stringify(byId.get(loc.id))) : null,
      unlockable: canUnlockJourney({
        locationOrder: loc.order,
        requirementXp: loc.requirementXp,
        totalXP: user.totalXP,
        previousCompleted: i === 0 || prevStatus === "COMPLETED",
      }),
    };
  });

  // Streak: đọc an toàn từ field có sẵn trong schema (đổi tên field nếu schema của bạn khác).
  const u = user as unknown as Record<string, unknown>;
  const streak = typeof u.streak === "number" ? u.streak : typeof u.currentStreak === "number" ? u.currentStreak : undefined;

  return (
    <div className="nq-workspace jy-page">
      <JapanBackdrop />
      <AppNav streak={streak} />
      <JourneyClient rows={rows} totalXP={user.totalXP} achievements={JSON.parse(JSON.stringify(achievements))} />
    </div>
  );
}