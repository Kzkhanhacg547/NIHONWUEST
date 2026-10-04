import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { AppNav } from "@/components/AppNav";
import { Card, PageTitle } from "@/components/ui";
import { ProfileForm } from "./ProfileForm";
import { PasswordForm } from "./PasswordForm";
import { DangerZone } from "./DangerZone";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: uid }, include: { profile: true } });
  if (!user) redirect("/login");

  const displayName = user.profile?.displayName ?? user.name ?? user.email.split("@")[0];

  return (
    <div className="nq-workspace min-h-screen bg-slate-50/50 dark:bg-sumi-950">
      <AppNav />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 pb-20 space-y-6">
        <PageTitle
          title="Hồ Sơ & Cài Đặt ⚙️"
          subtitle="Cá nhân hoá lộ trình học tập, mục tiêu JLPT và giao diện theo sở thích của bạn."
        />

        <Card className="p-5 bg-gradient-to-r from-sakura-50 via-rose-50 to-amber-50 dark:from-sumi-900 dark:to-sumi-950 border-2 border-sakura-200 dark:border-sakura-900 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sakura-500 to-rose-600 flex items-center justify-center text-white font-black text-2xl shadow-md shrink-0">
              {displayName.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-black text-slate-900 dark:text-white truncate">{displayName}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sakura-500 text-white shadow-xs">
                  Cấp độ {user.learningLevel ?? "N5"}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                📧 Email: <span className="font-bold text-slate-700 dark:text-slate-200">{user.email}</span>
              </p>
            </div>
          </div>
        </Card>

        <ProfileForm
          initial={{
            displayName: user.profile?.displayName ?? user.name ?? "",
            learningLevel: user.learningLevel,
            learningGoal: user.learningGoal,
            dailyGoalMinutes: user.dailyGoalMinutes,
            focusSkill: user.focusSkill,
            learningStyle: user.learningStyle,
            timezone: user.timezone,
            theme: user.theme,
            soundEnabled: user.soundEnabled,
          }}
        />
        <PasswordForm />
        <DangerZone />
      </div>
    </div>
  );
}
