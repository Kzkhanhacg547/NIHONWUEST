import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { AppNav } from "@/components/AppNav";
import { JapanBackdrop } from "@/components/JapanIllustration";
import { SurvivalClient } from "./SurvivalClient";
import { SafeImg } from "./SafeImg";

const HERO_FEATURES = [
  { icon: "💬", title: "Hội thoại tương tác", sub: "Thực hành như thật", cls: "bg-rose-100 text-rose-500" },
  { icon: "♪", title: "Phát âm tiếng Nhật", sub: "Nghe - Nhắc lại - Chuẩn hơn", cls: "bg-indigo-100 text-indigo-500" },
  { icon: "🎙", title: "Luyện phản xạ nói", sub: "Tự tin giao tiếp mỗi ngày", cls: "bg-sky-100 text-sky-600" },
];

export default async function SurvivalPage() {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) redirect("/login");

  const scenarios = await prisma.scenario.findMany({
    where: { isPublished: true },
    include: {
      messages: { orderBy: { order: "asc" } },
      choices: true,
      progress: { where: { userId: uid } },
    },
  });

  const formattedScenarios = scenarios.map((sc) => ({
    id: sc.id,
    slug: sc.slug,
    title: sc.title,
    description: sc.description,
    level: sc.level,
    xpReward: sc.xpReward,
    messages: sc.messages.map((m) => ({
      id: m.id,
      order: m.order,
      speaker: m.speaker,
      japanese: m.japanese,
      romaji: m.romaji,
      meaning: m.meaning,
    })),
    choices: sc.choices.map((c) => ({
      id: c.id,
      optionText: c.optionText,
      isIdeal: c.isIdeal,
      xpReward: c.xpReward,
    })),
    isCompleted: sc.progress.some((p) => p.status === "COMPLETED"),
  }));

  // XP của riêng Survival Mode (tính từ các thử thách đã hoàn thành).
  const totalXp = formattedScenarios.reduce((sum, s) => sum + s.xpReward, 0);
  const earnedXp = formattedScenarios.filter((s) => s.isCompleted).reduce((sum, s) => sum + s.xpReward, 0);
  const doneCount = formattedScenarios.filter((s) => s.isCompleted).length;
  const xpPct = totalXp > 0 ? Math.round((earnedXp / totalXp) * 100) : 0;
  const remainingXp = Math.max(totalXp - earnedXp, 0);

  const hero = (
    <section className="relative mx-auto mb-10 mt-2 max-w-[1320px] px-4 sm:px-6">
      <div className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-sky-400 via-indigo-400 to-pink-300 shadow-2xl shadow-indigo-900/20 ring-1 ring-white/40">
        {/* Ảnh nền + lớp phủ giúp chữ dễ đọc */}
        <SafeImg
          src="/images/survival/hero-banner.webp"
          alt="Cô gái ngắm núi Phú Sĩ giữa mùa hoa anh đào"
          priority
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[68%_center]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-950/75 via-indigo-950/40 to-indigo-950/10 lg:bg-gradient-to-r lg:from-indigo-950/80 lg:via-indigo-900/30 lg:to-transparent" />

        <div className="relative z-10 flex min-h-[400px] flex-col justify-center gap-5 px-6 py-10 sm:px-10 lg:min-h-[440px] lg:max-w-[64%]">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/40 bg-white/15 px-4 py-2 text-xs font-bold tracking-wide text-white backdrop-blur-md">
            <span className="text-rose-300" aria-hidden>⛩</span>
            KHÁM PHÁ &amp; SURVIVAL MODE
          </div>

          <h1 className="text-[clamp(2.4rem,7vw,4rem)] font-black leading-[1.05] tracking-tight text-white drop-shadow-[0_4px_12px_rgba(15,23,42,0.35)]">
            Giao tiếp{" "}
            <span className="bg-gradient-to-r from-pink-300 to-pink-500 bg-clip-text text-transparent">sinh tồn.</span>
          </h1>

          <p className="max-w-lg text-[15px] leading-relaxed text-white/90 drop-shadow">
            Rèn luyện phản xạ tiếng Nhật trong nhà hàng, nhà ga, konbini và những tình huống bạn thực sự gặp khi tới Nhật.
          </p>

          <div className="flex flex-wrap gap-3">
            {HERO_FEATURES.map((f) => (
              <div
                key={f.title}
                className="flex items-center gap-3 rounded-full border border-white/40 bg-white/15 py-2 pl-2 pr-5 backdrop-blur-md"
              >
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg ${f.cls}`} aria-hidden>
                  {f.icon}
                </span>
                <span>
                  <span className="block text-sm font-bold text-white">{f.title}</span>
                  <span className="block text-[11px] text-white/75">{f.sub}</span>
                </span>
              </div>
            ))}
          </div>

          <a
            href="#thu-thach"
            className="mt-1 inline-flex min-h-12 w-fit items-center gap-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-8 py-3.5 text-lg font-black text-white shadow-lg shadow-rose-500/40 transition hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span aria-hidden>🎮</span> Bắt đầu thử thách <span aria-hidden>›</span>
          </a>
        </div>

        {/* Thẻ XP */}
        <div className="relative z-10 mx-6 mb-6 rounded-3xl border border-white/30 bg-indigo-950/55 p-5 text-white shadow-xl backdrop-blur-md sm:mx-10 md:absolute md:bottom-6 md:right-6 md:m-0 md:w-[340px]">
          <div className="flex items-center gap-4">
            <span className="text-5xl drop-shadow-lg" aria-hidden>⭐</span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white/80">XP Survival</p>
              <p className="text-3xl font-black leading-none tabular-nums">{earnedXp.toLocaleString("vi-VN")}</p>
            </div>
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black">
              {doneCount}/{formattedScenarios.length}
            </span>
          </div>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/25" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={xpPct}>
            <div className="h-full rounded-full bg-gradient-to-r from-pink-400 to-rose-500" style={{ width: `${xpPct}%` }} />
          </div>
          <p className="mt-2 text-xs text-white/80">
            {totalXp === 0
              ? "Chưa có thử thách nào được mở."
              : remainingXp === 0
              ? "Bạn đã chinh phục toàn bộ thử thách!"
              : `Còn ${remainingXp.toLocaleString("vi-VN")} XP để chinh phục tất cả`}
          </p>
        </div>
      </div>
    </section>
  );

  // Hero chỉ hiện ở màn danh sách; khi vào hội thoại, SurvivalClient ẩn hero và hiển thị giao diện chơi toàn màn.
  return (
    <div className="nq-workspace">
      <JapanBackdrop />
      <AppNav />
      <SurvivalClient scenarios={formattedScenarios} hero={hero} />
    </div>
  );
}