import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { AppNav } from "@/components/AppNav";
import { SenseiKaiwaClient } from "./SenseiKaiwaClient";
import { SakuraBackdrop } from "./SenseiDecor";

export const metadata = {
  title: "AI Kaiwa Sensei N3 — Nihon Quest",
  description: "Trò chuyện trực tiếp cùng Aoi Sensei bằng giọng nói và chữ viết với khẩu hình tự nhiên.",
};

export default async function SenseiPage() {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) redirect("/login");

  const recentProgress = await prisma.userLessonProgress.findMany({
    where: { userId: uid },
    include: { lesson: true },
    orderBy: { updatedAt: "desc" },
    take: 3,
  });

  const recentLessons = recentProgress.map((p) => {
    const diffDays = Math.floor((Date.now() - new Date(p.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
    const timeText = diffDays === 0 ? "Hôm nay" : `${diffDays} ngày trước`;
    return {
      id: p.lesson.id,
      title: p.lesson.title,
      meta: `Điểm ${p.score ?? 100}% · ${timeText}`,
      href: `/app/practice/${p.lesson.slug}`,
    };
  });

  return (
    <div className="nq-workspace relative isolate space-y-5">
      <SakuraBackdrop />
      <AppNav />
      <SenseiKaiwaClient recentLessons={recentLessons} />
    </div>
  );
}