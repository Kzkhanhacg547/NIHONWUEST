import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { AppNav } from "@/components/AppNav";
import { JapanBackdrop, JapanScenicPanel } from "@/components/JapanIllustration";
import { KanaLab } from "./KanaLab";
import { LearnKanaPanel } from "./LearnKanaPanel";
import "./learn.css";

const UNIT_SCENES = ["kyoto", "street", "konbini", "ramen", "map"] as const;

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
    take: 5,
  });
  const currentIndex = lessons.findIndex((l) => l.progress[0]?.status !== "COMPLETED");

  // Content statistics come from the database. These were hardcoded marketing
  // numbers that the DB could not produce (e.g. "1,200+ vocabulary" vs 340 rows).
  const [vocabCount, kanjiCount, grammarCount, grammarExampleCount, scenarioCount, lessonCount] =
    await Promise.all([
      prisma.vocabulary.count(),
      prisma.kanji.count(),
      prisma.grammar.count(),
      prisma.grammarExample.count(),
      prisma.scenario.count({ where: { isPublished: true } }),
      prisma.lesson.count({ where: { isPublished: true } }),
    ]);

  const availableLevels = (
    await prisma.vocabulary.findMany({ distinct: ["jlptLevel"], select: { jlptLevel: true } })
  )
    .map((v) => v.jlptLevel)
    .sort();
  const levelRange = availableLevels.length
    ? availableLevels.join(" → ")
    : level;

  return (
    <div className="nq-workspace">
      <JapanBackdrop />
      <AppNav userName={session?.user?.name ?? undefined} levelLabel={level} />

      <div className="lp-page">
        {/* ============ HERO ============ */}
        <section className="lp-hero">
          <div data-intro>
            <div className="lp-crumb">
              Học tập &nbsp;›&nbsp; <b>Lộ trình học tập</b>
            </div>
            <h1>
              Lộ trình <em>học tập</em>
            </h1>
            <p>
              Từ những nét chữ đầu tiên đến khả năng giao tiếp thực tế. Một hành trình rõ ràng, khoa học và đầy cảm hứng.
            </p>
            <div className="lp-hero-actions">
              <Link href={currentIndex >= 0 ? `/app/practice/${lessons[currentIndex].slug}` : "/app/practice"} className="lp-btn-red">
                Tiếp tục học ngay <span aria-hidden="true">→</span>
              </Link>
              <Link href="#roadmap" className="lp-link-plain">
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <rect x="2" y="8" width="3" height="6" rx="1" fill="currentColor" />
                  <rect x="6.5" y="3" width="3" height="11" rx="1" fill="currentColor" />
                  <rect x="11" y="6" width="3" height="8" rx="1" fill="currentColor" />
                </svg>
                Xem tổng quan lộ trình
              </Link>
            </div>
          </div>

          <div className="lp-hero-art" data-intro data-parallax>
            <JapanScenicPanel variant="fuji" showLabel={false} />
            <div className="lp-quote">
              <div className="jp jp-text">学</div>
              <p>
                Học không chỉ
                <br />
                là ghi nhớ, mà là
                <br />
                mở ra một thế giới mới.
              </p>
              <small>GAKU • MANABU</small>
            </div>
            <div className="lp-vertical" aria-hidden="true">
              <span className="jp jp-text">学びの旅</span>
              <small>HÀNH TRÌNH HỌC TẬP</small>
            </div>
          </div>
        </section>

        {/* ============ 3 CỘT ============ */}
        <section id="roadmap" className="lp-layout">
          {/* Cột 1 — Kana (client) */}
          <LearnKanaPanel kana={kana} practiced={Array.from(done)} />

          {/* Cột 2 — Lộ trình */}
          <div className="lp-pane" data-reveal>
            <div className="lp-pane-head">
              <div>
                <span className="lp-eyebrow">02 / LỘ TRÌNH HỌC TẬP</span>
                <h2>Từ nền tảng đến giao tiếp thực tế</h2>
                <p>Lộ trình được thiết kế khoa học, kết hợp chữ viết, từ vựng, ngữ pháp và bài luyện nghe nói.</p>
              </div>
              <span className="lp-level-pill">
                <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true">
                  <rect x="2" y="8" width="3" height="6" rx="1" fill="currentColor" />
                  <rect x="6.5" y="3" width="3" height="11" rx="1" fill="currentColor" />
                  <rect x="11" y="6" width="3" height="8" rx="1" fill="currentColor" />
                </svg>
                Lộ trình JLPT {level}
              </span>
            </div>

            <div className="lp-timeline">
              {lessons.length === 0 && <div className="lp-empty">Chưa có bài học nào cho cấp độ {level}.</div>}
              {lessons.map((lesson, index) => {
                const isDone = lesson.progress[0]?.status === "COMPLETED";
                const isCurrent = !isDone && index === currentIndex;
                // Real progress: completed lessons are 100%, anything else has no
                // partial data in the schema. A hardcoded 40% was announced to
                // screen readers as if it were measured.
                const accuracy = lesson.progress[0]?.accuracy;
                const pct = isDone
                  ? 100
                  : accuracy != null
                    ? Math.max(0, Math.min(100, Math.round(accuracy * 100)))
                    : 0;
                const state = isDone ? "is-done" : isCurrent ? "is-current" : "";
                return (
                  <article key={lesson.id} className={`lp-unit ${state}`}>
                    <span className="lp-node" aria-hidden="true">
                      {isDone ? "✓" : isCurrent ? "●" : "🔒"}
                    </span>
                    <div className="lp-card">
                      <div className="lp-card-main">
                        <div className="lp-thumb">
                          <JapanScenicPanel variant={UNIT_SCENES[index % UNIT_SCENES.length]} showLabel={false} />
                        </div>
                        <div className="lp-copy">
                          <small>Unit {String(index + 1).padStart(2, "0")}</small>
                          <h3>{lesson.title}</h3>
                          <p>{lesson.description}</p>
                        </div>
                        <div className="lp-status">
                          <span className="lp-pill">{isDone ? "✓ Đã hoàn thành" : isCurrent ? "Đang học" : "🔒 Hoàn bài trước để mở"}</span>
                          {pct > 0 && <span className="lp-pct">{pct}%</span>}
                          <div
                            className="lp-bar"
                            role="progressbar"
                            aria-label={`Tiến độ ${lesson.title}`}
                            aria-valuenow={pct}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          >
                            <i style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </div>
                      <div className="lp-card-foot">
                        <div className="lp-chips">
                          <span>▤ {lesson._count.exercises} bài luyện tập</span>
                          <span>✦ +{lesson.xpReward} XP</span>
                        </div>
                        {isCurrent ? (
                          <Link href={`/app/practice/${lesson.slug}`} className="lp-continue">
                            Tiếp tục học →
                          </Link>
                        ) : (
                          <span aria-hidden="true">›</span>
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
            <span className="lp-eyebrow">03 / CÔNG CỤ HỌC TẬP</span>
            <h2>Truy cập nhanh</h2>
            <p>Các công cụ hỗ trợ giúp bạn học hiệu quả hơn dọc theo lộ trình.</p>

            <Link href="/app/vocabulary" className="lp-tool t-red">
              <span className="lp-tool-icon jp-text">あ</span>
              <span className="chev" aria-hidden="true">›</span>
              <h3>Từ vựng &amp; Hán tự</h3>
              <p>Tra cứu, học và ôn tập từ vựng kèm Hán tự theo từng chủ đề.</p>
              <div className="lp-stats">
                <div><b>{vocabCount.toLocaleString("vi-VN")}</b><span>Từ vựng</span></div>
                <div><b>{kanjiCount.toLocaleString("vi-VN")}</b><span>Hán tự</span></div>
                <div><b>{availableLevels.length}</b><span>Cấp độ JLPT</span></div>
              </div>
            </Link>

            <Link href="/app/grammar" className="lp-tool t-blue">
              <span className="lp-tool-icon">📖</span>
              <span className="chev" aria-hidden="true">›</span>
              <h3>Sổ tay Ngữ pháp</h3>
              <p>Tổng hợp ngữ pháp từ {levelRange} với giải thích dễ hiểu và ví dụ thực tế.</p>
              <div className="lp-stats">
                <div><b>{grammarCount.toLocaleString("vi-VN")}</b><span>Cấu trúc</span></div>
                <div><b>{grammarExampleCount.toLocaleString("vi-VN")}</b><span>Ví dụ</span></div>
                <div><b>Ngữ cảnh</b><span>Ứng dụng</span></div>
              </div>
            </Link>

            <Link href="/app/sensei" className="lp-tool t-amber">
              <span className="lp-tool-icon">🎧</span>
              <span className="chev" aria-hidden="true">›</span>
              <h3>Luyện nghe &amp; Hội thoại</h3>
              <p>Luyện kỹ năng nghe và phản xạ với các tình huống thực tế.</p>
              <div className="lp-stats">
                <div><b>{scenarioCount.toLocaleString("vi-VN")}</b><span>Kịch bản hội thoại</span></div>
                <div><b>{lessonCount.toLocaleString("vi-VN")}</b><span>Bài học</span></div>
                <div><b>{levelRange}</b><span>Cấp độ</span></div>
              </div>
            </Link>

            <Link href="/app/journey" className="lp-promo">
              <small>TIẾN XA HƠN</small>
              <h3>Khám phá Văn hóa Nhật Bản</h3>
              <p>Hiểu thêm về con người, phong tục và những câu chuyện đằng sau ngôn ngữ.</p>
            </Link>
          </aside>
        </section>

        {/* ============ KANA LAB ĐẦY ĐỦ (giữ nguyên logic) ============ */}
        <section id="kana-full" className="lp-lab" data-reveal>
          <span className="lp-eyebrow">KANA LAB ĐẦY ĐỦ</span>
          <h2>Luyện bảng chữ cái tương tác</h2>
          <p>Toàn bộ logic luyện nghe, luyện viết, đánh dấu đã nhớ và lưu SRS vẫn được giữ nguyên.</p>
          <KanaLab kana={kana} practiced={Array.from(done)} />
        </section>
      </div>
    </div>
  );
}
