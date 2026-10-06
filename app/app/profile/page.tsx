import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { AppNav } from "@/components/AppNav";
import { AvatarEditor } from "./AvatarEditor";
import { ProfileForm } from "./ProfileForm";
import { PasswordForm } from "./PasswordForm";
import { DangerZone } from "./DangerZone";
import { panel } from "./parts";

const FOCUS: Record<string, string> = { BALANCED: "Toàn diện", LISTENING: "Nghe", SPEAKING: "Nói", READING: "Đọc", WRITING: "Viết" };

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: uid }, include: { profile: true } });
  if (!user) redirect("/login");

  const displayName = user.profile?.displayName ?? user.name ?? user.email.split("@")[0];
  const initial = displayName.slice(0, 1).toUpperCase();
  const stats = [
    ["Mục tiêu mỗi ngày", `${user.dailyGoalMinutes} phút`],
    ["Kỹ năng trọng tâm", FOCUS[user.focusSkill] ?? "Toàn diện"],
    ["Múi giờ", user.timezone],
  ];

  return (
    <div className="nq-workspace min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-sumi-950 dark:text-white">
      <AppNav />
      <main className="pb-16">
        <div className="relative h-28 overflow-hidden sm:h-40">
          <img src="/images/profile/japan-profile-hero.svg" alt="" aria-hidden="true" className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50 dark:to-sumi-950" />
        </div>

        <div className="mx-auto mt-6 grid max-w-6xl gap-6 px-4 sm:px-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start lg:gap-8 lg:px-10">
          <aside className={`${panel} p-6 text-center lg:sticky lg:top-24`}>
            <div className="flex flex-col items-center">
              <AvatarEditor src={user.profile?.avatar ?? null} initial={initial} />
            </div>
            <h1 className="mt-4 break-words text-xl font-bold tracking-tight">{displayName}</h1>
            <p className="mt-1 break-all text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
            <span className="mt-3 inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">JLPT {user.learningLevel ?? "N5"}</span>

            <dl className="mt-6 divide-y divide-slate-100 border-t border-slate-100 text-left text-sm dark:divide-slate-800 dark:border-slate-800">
              {stats.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-slate-500 dark:text-slate-400">{k}</dt>
                  <dd className="truncate font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </aside>

          <div className="min-w-0 space-y-6">
            <ProfileForm initial={{
              displayName: user.profile?.displayName ?? user.name ?? "",
              learningLevel: user.learningLevel,
              learningGoal: user.learningGoal,
              dailyGoalMinutes: user.dailyGoalMinutes,
              focusSkill: user.focusSkill,
              learningStyle: user.learningStyle,
              timezone: user.timezone,
              theme: user.theme,
              soundEnabled: user.soundEnabled,
            }} />
            <PasswordForm />
            <DangerZone />
          </div>
        </div>
      </main>
    </div>
  );
}