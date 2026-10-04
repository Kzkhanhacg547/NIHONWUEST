import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { AppNav } from "@/components/AppNav";
import { PageTitle } from "@/components/ui";
import { LeaderboardClient } from "./LeaderboardClient";
import { buildEnrichedLeaderboard } from "@/lib/rivalBots";
import { JapanBackdrop } from "@/components/JapanIllustration";

export const metadata = { title: "Bảng Xếp Hạng & Giải Đấu — Nihon Quest" };

export default async function LeaderboardPage() {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) redirect("/login");

  // Fetch all real users with profile
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      totalXP: true,
      level: true,
      currentStreak: true,
      profile: { select: { displayName: true, avatar: true } },
    },
    orderBy: { totalXP: "desc" },
    take: 50,
  });

  // Calculate Weekly XP (Last 7 days transactions)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const weeklyTransactions = await prisma.xpTransaction.findMany({
    where: { createdAt: { gte: sevenDaysAgo } },
    select: { userId: true, amount: true },
  });

  const weeklyXpMap = new Map<string, number>();
  weeklyTransactions.forEach((t) => {
    weeklyXpMap.set(t.userId, (weeklyXpMap.get(t.userId) || 0) + t.amount);
  });

  const realUsersFormatted = allUsers.map((u) => ({
    id: u.id,
    name: u.name,
    totalXP: u.totalXP,
    level: u.level,
    currentStreak: u.currentStreak,
    displayName: u.profile?.displayName || u.name,
    avatar: u.profile?.avatar || null,
    weeklyXp: weeklyXpMap.get(u.id) || 0,
  }));

  const { weeklyList, allTimeList, directRival } = buildEnrichedLeaderboard(
    realUsersFormatted,
    uid
  );

  // weeklyList mixes real users with synthetic rivals, so counting it directly
  // claimed dozens of "học viên tham gia" when only a handful are real.
  const realCount = weeklyList.filter((u) => !u.isBot).length;
  const botCount = weeklyList.length - realCount;

  return (
    <div className="nq-workspace bg-slate-50 dark:bg-sumi-950">
      <JapanBackdrop />
      <AppNav />
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 space-y-6">
        <PageTitle
          title="Bảng Xếp Hạng & Giải Đấu 🏆"
          subtitle="Thi đua học tập công bằng mỗi tuần. Càng kiên trì rèn luyện, thứ hạng càng thăng tiến！"
          badge={
            botCount > 0
              ? `${realCount} học viên · +${botCount} đối thủ BOT`
              : `${realCount} học viên tham gia`
          }
        />
        <LeaderboardClient
          currentUserId={uid}
          weeklyUsers={weeklyList}
          allTimeUsers={allTimeList}
          directRival={directRival}
        />
      </div>
    </div>
  );
}
