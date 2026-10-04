import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { AppNav } from "@/components/AppNav";
import { JapanBackdrop, JapanScenicPanel } from "@/components/JapanIllustration";
import { SurvivalClient } from "./SurvivalClient";

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

  const hero = (
    <section className="relative mx-auto mt-2 grid max-w-[1320px] items-center gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] mb-8">
      <div className="relative z-10 py-8 lg:py-12">
        <div className="mb-4 flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] text-slate-500 dark:text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-red-600" aria-hidden="true" />
          KHÁM PHÁ &nbsp;›&nbsp; SURVIVAL MODE
        </div>
        <h1 className="text-[clamp(1.75rem,7.5vw,40px)] font-black leading-[1.08] tracking-tight text-balance text-slate-900 dark:text-white sm:text-5xl">
          Giao tiếp <span className="text-red-600">sinh tồn.</span>
        </h1>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
          Rèn luyện phản xạ tiếng Nhật trong nhà hàng, nhà ga, konbini và những tình huống bạn thực sự gặp khi tới Nhật.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-300">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-sumi-800">
            ◉ Hội thoại tương tác
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-sumi-800">
            ♪ Phát âm tiếng Nhật
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-sumi-800">
            🎙 Luyện phản xạ nói
          </span>
        </div>
      </div>
      <div className="relative hidden h-[230px] overflow-hidden rounded-3xl shadow-lg md:block lg:h-[260px]">
        <JapanScenicPanel variant="ramen" showLabel={false} />
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
