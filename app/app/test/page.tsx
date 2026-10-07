import Image from "next/image";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { AppNav } from "@/components/AppNav";
import { TestClient } from "./TestClient";

export const metadata = { title: "Bài Kiểm Tra Năng Lực JLPT — Nihon Quest" };
export const dynamic = "force-dynamic";

export default async function TestPage() {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: uid },
    select: {
      id: true,
      name: true,
      image: true,
      learningLevel: true,
      totalXP: true,
      currentStreak: true,
      profile: { select: { displayName: true, avatar: true } },
    },
  });

  const displayName = user?.profile?.displayName || user?.name || session?.user?.name || "Học viên";
  const userLevel = user?.learningLevel || "N5";
  const avatarUrl = user?.profile?.avatar || user?.image || null;

  return (
    <div className="nq-workspace min-h-screen bg-slate-50 dark:bg-sumi-950">
      <AppNav
        userName={displayName}
        userImage={avatarUrl}
        userLevel={userLevel === "N5" ? 1 : userLevel === "N4" ? 2 : userLevel === "N3" ? 3 : 4}
        userXP={user?.totalXP ?? 0}
        streak={user?.currentStreak ?? 0}
      />

      {/* HERO BANNER */}
      <section className="mx-auto mt-3 max-w-[1320px] px-4 sm:px-6">
        <div className="relative isolate overflow-hidden rounded-3xl bg-[#0b1230] shadow-xl">
          <Image
            src="/images/dashboard/fuji-hero.webp"
            alt=""
            fill
            priority
            sizes="(min-width: 1320px) 1320px, 100vw"
            className="-z-20 object-cover object-[70%_center]"
          />
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0b1230]/95 via-[#0b1230]/75 to-transparent"
            aria-hidden="true"
          />

          <div className="relative px-6 py-8 sm:px-10 sm:py-12 lg:py-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3.5 py-1 text-xs font-bold text-amber-300 ring-1 ring-amber-400/40 backdrop-blur-md">
              <span className="text-amber-400">★</span> BÀI KIỂM TRA NĂNG LỰC NIHON QUEST
            </div>
            <h1 className="mt-3 max-w-2xl text-[clamp(1.875rem,5vw,3.25rem)] font-black leading-tight tracking-tight text-white">
              Đánh Giá Trình Độ & <span className="text-amber-400">Năng Lực JLPT</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm sm:text-base leading-relaxed text-slate-200">
              Kiểm tra nhanh kỹ năng Hán tự (Kanji), Từ vựng (Goi), Ngữ pháp (Bunpou) và Đọc hiểu (Dokkai) để xác định trình độ chính xác và cập nhật lộ trình học tối ưu cho bạn!
            </p>
          </div>

          <p
            className="jp-text pointer-events-none absolute right-6 top-6 hidden text-2xl font-medium tracking-[0.35em] text-white/80 [writing-mode:vertical-rl] md:block"
            aria-hidden="true"
          >
            実力テスト
          </p>
        </div>
      </section>

      {/* MAIN CLIENT CONTAINER */}
      <main className="mx-auto max-w-[1320px] px-4 pb-24 pt-6 sm:px-6">
        <TestClient
          userLevel={userLevel}
          userXP={user?.totalXP ?? 0}
          displayName={displayName}
        />
      </main>
    </div>
  );
}

