import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { AppNav } from "@/components/AppNav";
import { JapanBackdrop } from "@/components/JapanIllustration";
import { SceneArt } from "@/components/SceneArt";
import { IcoArrow, IcoBolt, IcoBook, IcoChart, IcoChevron, IcoClock, IcoHeadphones, IcoLock, IcoRoute, IcoTarget } from "@/components/LearnIcons";
import { KanaLab } from "./KanaLab";
import { LearnKanaPanel } from "./LearnKanaPanel";
import { CulturePromo } from "./CulturePromo";
import "./learn.css";

export default async function LearnPage() {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: uid }, select: { learningLevel: true } });
  const level = user?.learningLevel || "N5";
  const kana = await prisma.kana.findMany({ orderBy: [{ script: "asc" }, { row: "asc" }, { romaji: "asc" }] });
  const practiced = await prisma.reviewItem.findMany({ where: { userId: uid, contentType: "KANA" } });
  const done = new Set(practiced.map((p) => p.contentId));
  const lessons = await prisma.lesson.findMany({
    where: { isPublished: true, level },
    orderBy: { order: "asc" },
    include: { progress: { where: { userId: uid } }, _count: { select: { exercises: true } } },
    take: 6,
  });
  const currentIndex = lessons.findIndex((l) => l.progress[0]?.status !== "COMPLETED");
  const current = currentIndex >= 0 ? lessons[currentIndex] : null;

  const [vocabCount, kanjiCount, grammarCount, grammarExampleCount, scenarioCount, lessonCount, levelLessonTotal, levelLessonDone] =
    await Promise.all([
      prisma.vocabulary.count(),
      prisma.kanji.count(),
      prisma.grammar.count(),
      prisma.grammarExample.count(),
      prisma.scenario.count({ where: { isPublished: true } }),
      prisma.lesson.count({ where: { isPublished: true } }),
      prisma.lesson.count({ where: { isPublished: true, level } }),
      prisma.lesson.count({
        where: { isPublished: true, level, progress: { some: { userId: uid, status: "COMPLETED" } } },
      }),
    ]);

  const availableLevels = (await prisma.vocabulary.findMany({ distinct: ["jlptLevel"], select: { jlptLevel: true } }))
    .map((v) => v.jlptLevel)
    .sort();
  const levelRange = availableLevels.length ? availableLevels.join(" → ") : level;
  const overallPct = levelLessonTotal ? Math.round((levelLessonDone / levelLessonTotal) * 100) : 0;
  const startHref = current ? `/app/practice/${current.slug}` : "/app/practice";

  return (
    <div className="nq-workspace">
      <JapanBackdrop />
      <AppNav userName={session?.user?.name ?? undefined} levelLabel={level} />

      <div className="lp-root">
        <div className="lp-page">
          {/* ============ HERO ============ */}
          <header className="lp-hero">
            <div className="lp-hero-bg" aria-hidden="true" />
            <div className="lp-hero-inner">
              <div className="lp-hero-copy" data-intro>
                <span className="lp-script">Bắt đầu từ hôm nay</span>
                <h1>
                  Lộ trình <em>học tập</em>
                </h1>
                <p>Học kana, từ vựng, ngữ pháp theo lộ trình khoa học để chinh phục tiếng Nhật một cách tự tin và hiệu quả.</p>
                <Link href={startHref} className="lp-btn-red">
                  <IcoTarget width={16} height={16} /> Bắt đầu học ngay <IcoArrow width={16} height={16} />
                </Link>
                <ul className="lp-feats">
                  <li><span><IcoRoute /></span>Lộ trình rõ ràng<br />theo từng cấp độ</li>
                  <li><span><IcoClock /></span>Học mọi lúc<br />mọi nơi</li>
                  <li><span><IcoChart /></span>Theo dõi tiến độ<br />cá nhân</li>
                </ul>
              </div>

              <Link href={startHref} className="lp-spot">
                <span className="lp-spot-tag">● {current ? "Bài tiếp theo" : "Nổi bật hôm nay"}</span>
                <b>{current ? current.title : "Khám phá bảng chữ cái Kana"}</b>
                <small>{current ? current.description : "Nền tảng quan trọng để bắt đầu hành trình học tiếng Nhật."}</small>
                <span className="lp-spot-go" aria-hidden="true"><IcoArrow width={16} height={16} /></span>
              </Link>
            </div>
          </header>

          {/* ============ 3 CỘT ============ */}
          <section id="roadmap" className="lp-layout">
            <LearnKanaPanel kana={kana} practiced={Array.from(done)} />

            {/* Cột 2 — Lộ trình */}
            <div className="lp-pane" data-reveal>
              <div className="lp-pane-head">
                <div className="lp-title">
                  <span className="lp-title-ico"><IcoRoute /></span>
                  <div>
                    <h2>Lộ trình học tập của bạn</h2>
                    <p>Tiếp tục hành trình JLPT {level} — chinh phục từng bài học một!</p>
                  </div>
                </div>
                <div className="lp-overall" aria-label={`${levelLessonDone} trên ${levelLessonTotal} bài hoàn thành`}>
                  <span><b>{levelLessonDone}/{levelLessonTotal}</b> bài hoàn thành</span>
                  <div className="lp-bar"><i style={{ width: `${overallPct}%` }} /></div>
                </div>
              </div>

              <div className="lp-timeline">
                {lessons.length === 0 && <div className="lp-empty">Chưa có bài học nào cho cấp độ {level}.</div>}
                {lessons.map((lesson, index) => {
                  const isDone = lesson.progress[0]?.status === "COMPLETED";
                  const isCurrent = !isDone && index === currentIndex;
                  const accuracy = lesson.progress[0]?.accuracy;
                  const pct = isDone ? 100 : accuracy != null ? Math.max(0, Math.min(100, Math.round(accuracy * 100))) : 0;
                  const state = isDone ? "is-done" : isCurrent ? "is-current" : "";
                  return (
                    <article key={lesson.id} className={`lp-unit ${state}`}>
                      <span className="lp-node" aria-hidden="true">{isDone ? "✓" : index + 1}</span>
                      <div className="lp-card">
                        <div className="lp-thumb"><SceneArt index={index} /></div>
                        <div className="lp-copy">
                          <h3>{lesson.title}</h3>
                          <p>{lesson.description}</p>
                          <div className="lp-chips">
                            <span>▤ {lesson._count.exercises} bài luyện tập</span>
                            <span>✦ +{lesson.xpReward} XP</span>
                          </div>
                          <div className="lp-bar" role="progressbar" aria-label={`Tiến độ ${lesson.title}`} aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                            <i style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                        <div className="lp-status">
                          <span className="lp-pill">{isDone ? "Đã hoàn thành" : isCurrent ? "Đang học" : "Chưa học"}</span>
                          {pct > 0 && <span className="lp-pct">{pct}%</span>}
                          {isCurrent ? (
                            <Link href={`/app/practice/${lesson.slug}`} className="lp-continue">Tiếp tục <IcoArrow width={13} height={13} /></Link>
                          ) : isDone ? (
                            <IcoChevron className="lp-go" />
                          ) : (
                            <span className="lp-lock" title="Hoàn thành bài trước để mở"><IcoLock width={15} height={15} /><span className="sr-only">Hoàn thành bài trước để mở</span></span>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Cột 3 — Công cụ */}
            <aside className="lp-pane" data-reveal>
              <div className="lp-title">
                <span className="lp-title-ico t-red"><IcoBolt /></span>
                <h2>Truy cập nhanh</h2>
              </div>

              <Link href="/app/vocabulary" className="lp-tool t-red">
                <span className="lp-tool-icon jp-text">あ</span>
                <div className="lp-tool-body">
                  <h3>Từ vựng &amp; Hán tự</h3>
                  <p>Tra cứu, học và ôn tập từ vựng kèm Hán tự theo từng chủ đề.</p>
                  <div className="lp-stats">
                    <div><b>{vocabCount.toLocaleString("vi-VN")}</b><span>Từ vựng</span></div>
                    <div><b>{kanjiCount.toLocaleString("vi-VN")}</b><span>Hán tự</span></div>
                    <div><b>{availableLevels.length}</b><span>Cấp độ</span></div>
                  </div>
                </div>
                <IcoChevron className="chev" />
              </Link>

              <Link href="/app/grammar" className="lp-tool t-blue">
                <span className="lp-tool-icon"><IcoBook /></span>
                <div className="lp-tool-body">
                  <h3>Sổ tay Ngữ pháp</h3>
                  <p>Ngữ pháp {levelRange} với giải thích dễ hiểu và ví dụ thực tế.</p>
                  <div className="lp-stats">
                    <div><b>{grammarCount.toLocaleString("vi-VN")}</b><span>Cấu trúc</span></div>
                    <div><b>{grammarExampleCount.toLocaleString("vi-VN")}</b><span>Ví dụ</span></div>
                  </div>
                </div>
                <IcoChevron className="chev" />
              </Link>

              <Link href="/app/sensei" className="lp-tool t-amber">
                <span className="lp-tool-icon"><IcoHeadphones /></span>
                <div className="lp-tool-body">
                  <h3>Luyện nghe &amp; Hội thoại</h3>
                  <p>Rèn kỹ năng nghe và phản xạ qua các tình huống thực tế.</p>
                  <div className="lp-stats">
                    <div><b>{scenarioCount.toLocaleString("vi-VN")}</b><span>Kịch bản</span></div>
                    <div><b>{lessonCount.toLocaleString("vi-VN")}</b><span>Bài học</span></div>
                  </div>
                </div>
                <IcoChevron className="chev" />
              </Link>

              <CulturePromo />
            </aside>
          </section>

          {/* ============ KANA LAB ĐẦY ĐỦ ============ */}
          <section id="kana-full" className="lp-lab" data-reveal>
            <div className="lp-title">
              <span className="lp-title-ico t-red"><IcoTarget /></span>
              <div>
                <h2>Luyện bảng chữ cái tương tác</h2>
                <p>Thực hành, ghi nhớ và kiểm tra ngay với hệ thống bài tập trực quan.</p>
              </div>
            </div>
            <KanaLab kana={kana} practiced={Array.from(done)} />
          </section>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="lp-footer" src="/learn/footer.jpg" alt="Tiếng Nhật không khó, chỉ cần bạn bắt đầu đúng cách!" />
      </div>
    </div>
  );
}