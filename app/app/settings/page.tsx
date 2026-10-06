import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { AppNav } from "@/components/AppNav";
import { SettingsClient } from "./SettingsClient";

export const metadata = { title: "Cài Đặt Hệ Thống — Nihon Quest" };

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: uid },
    include: { profile: true },
  });
  if (!user) redirect("/login");
  if (!user.onboardingCompleted) redirect("/onboarding");

  const displayName = user.profile?.displayName || user.name || user.email.split("@")[0];
  const registeredDate = `${user.createdAt.getDate().toString().padStart(2, "0")}/${(
    user.createdAt.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${user.createdAt.getFullYear()}`;

  return (
    <div className="nq-workspace min-h-screen bg-slate-50 text-slate-900 dark:bg-sumi-950 dark:text-white">
      <AppNav
        userName={displayName}
        avatar={user.profile?.avatar ?? null}
        userLevel={user.level}
        userXP={user.totalXP}
        streak={user.currentStreak}
        levelLabel={`Cấp ${user.level}`}
      />

      <main className="mx-auto max-w-[1320px] px-4 pt-4 sm:px-6 lg:px-8">
        <SettingsClient
          initial={{
            displayName: user.profile?.displayName || user.name || "",
            email: user.email,
            avatar: user.profile?.avatar ?? null,
            bio: user.profile?.bio || "",
            timezone: user.timezone || "Asia/Ho_Chi_Minh",
            learningLevel: user.learningLevel || "N5",
            learningGoal: user.learningGoal || "TRAVEL",
            dailyGoalMinutes: user.dailyGoalMinutes || 15,
            focusSkill: user.focusSkill || "BALANCED",
            learningStyle: user.learningStyle || "STRUCTURED",
            theme: (user.theme as "light" | "dark" | "system") || "system",
            soundEnabled: user.soundEnabled ?? true,
            registeredDate,
          }}
        />
      </main>
    </div>
  );
}
