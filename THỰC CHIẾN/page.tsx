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
    <section className="nq-survival-hero" data-intro>
      <div className="nq-survival-copy">
        <div className="crumb">Khám phá &nbsp;›&nbsp; Survival Mode</div>
        <span>● SURVIVAL MODE &nbsp;·&nbsp; TÌNH HUỐNG THỰC TẾ</span>
        <h1>Giao tiếp <em>sinh tồn.</em></h1>
        <p>Rèn luyện phản xạ tiếng Nhật trong nhà hàng, nhà ga, konbini và những tình huống bạn thực sự gặp khi tới Nhật.</p>
        <div className="nq-lessons-meta"><span>◉ Hội thoại tương tác</span><span>♪ Phát âm tiếng Nhật</span><span>🎙 Luyện phản xạ nói</span></div>
      </div>
      <div className="nq-survival-scene"><JapanScenicPanel variant="ramen" showLabel={false} /></div>
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
