import Link from "next/link";
import { readdirSync } from "node:fs";
import path from "node:path";
import type { CSSProperties } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { AppNav } from "@/components/AppNav";
import { Icon, type IconName } from "@/components/ui";
import { JapanBackdrop } from "@/components/JapanIllustration";
import { ReviewClient, ReviewSettingsButton, SpeakButton } from "./ReviewClient";
import { resolveReviewItems } from "@/lib/review/resolveReviewItem";
import "./review.css";

const MODES: { href: string; icon: IconName; title: string; desc: string; tone: "red" | "blue"; active?: boolean }[] = [
  { href: "/app/review", icon: "card", title: "SRS Flashcard", desc: "Ôn tập theo tần suất lặp lại", tone: "red", active: true },
  { href: "/app/practice", icon: "quiz", title: "Quiz bài học", desc: "Kiểm tra kiến thức đã học", tone: "blue" },
  { href: "/app/survival", icon: "chat", title: "Hội thoại sinh tồn", desc: "Luyện phản xạ giao tiếp", tone: "blue" },
  { href: "/app/learn#kana-full", icon: "pen", title: "Xưởng viết Kana", desc: "Luyện viết Hiragana & Katakana", tone: "red" },
];

// 4 thẻ lối tắt dưới khung flashcard. Kiểm tra lại các href cho khớp route thật của dự án.
const PROMOS: { href: string; glyph: string; title: string; desc: string; tone: "red" | "blue" | "violet" | "teal" }[] = [
  { href: "/app/vocabulary", glyph: "語", title: "Từ vựng", desc: "Mở rộng vốn từ", tone: "red" },
  { href: "/app/grammar", glyph: "文", title: "Ngữ pháp", desc: "Hiểu sâu - Dùng chuẩn", tone: "blue" },
  { href: "/app/survival", glyph: "話", title: "Hội thoại", desc: "Tự tin giao tiếp", tone: "violet" },
  { href: "/app/explore", glyph: "和", title: "Khám phá", desc: "Văn hóa Nhật Bản", tone: "teal" },
];

// Quét thư mục ảnh nền flashcard. Thêm / bớt ảnh trong public/images/SRS_card/back/ là tự cập nhật.
function listCardBackgrounds(): string[] {
  try {
    const dir = path.join(process.cwd(), "public", "images", "SRS_card", "back");
    return readdirSync(dir)
      .filter((f) => /\.(png|jpe?g|webp|avif)$/i.test(f))
      .sort()
      .map((f) => `/images/SRS_card/back/${encodeURIComponent(f)}`);
  } catch {
    return [];
  }
}

function TrendIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 17l6-6 4 4 8-9" />
      <path d="M15 6h6v6" />
    </svg>
  );
}

function ToriiMini() {
  return (
    <svg width="22" height="20" viewBox="0 0 24 22" fill="currentColor" aria-hidden="true">
      <path d="M1 4Q12 8 23 4V1Q12 5 1 1Z" />
      <rect x="4" y="8" width="16" height="2" />
      <rect x="5" y="6" width="2" height="15" />
      <rect x="17" y="6" width="2" height="15" />
    </svg>
  );
}

export default async function ReviewPage() {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) redirect("/login");

  const dueWhere = { userId: uid, dueAt: { lte: new Date() } };

  const items = await prisma.reviewItem.findMany({
    where: dueWhere,
    orderBy: { dueAt: "asc" },
    take: 30,
  });
  const totalDue = await prisma.reviewItem.count({ where: dueWhere });

  // Fetch only the content this session actually references. The previous full
  // 5-table scan (kana + vocabulary + kanji + grammar + 1500 exercises) shipped
  // ~464 KB to render at most 30 cards.
  const idsOf = (type: string) =>
    Array.from(new Set(items.filter((i) => i.contentType === type).map((i) => i.contentId)));

  const kanaIds = idsOf("KANA");
  const vocabIds = idsOf("VOCAB");
  const kanjiIds = idsOf("KANJI");
  const grammarIds = idsOf("GRAMMAR");
  const exerciseIds = idsOf("EXERCISE");

  // Kana rows are keyed by a composite `SCRIPT:CHARACTER` id in some paths and by
  // the bare character in others, so both forms are looked up.
  const kanaKeys = kanaIds.flatMap((id) => [id, id.replace(/^HIRAGANA:/, "").replace(/^KATAKANA:/, "")]);
  const kanaScripts = Array.from(
    new Set(kanaIds.map((id) => (id.includes(":") ? id.split(":")[0] : null))),
  );

  const [kanaRows, vocabRows, kanjiRows, grammarRows, exerciseRows] = await Promise.all([
    kanaKeys.length
      ? prisma.kana.findMany({
          where: {
            OR: [
              { character: { in: kanaKeys } },
              ...(kanaScripts.length
                ? [{ script: { in: kanaScripts as never[] }, character: { in: kanaKeys } }]
                : []),
            ],
          },
          select: { character: true, script: true, romaji: true, ipa: true },
        })
      : Promise.resolve([]),
    vocabIds.length
      ? prisma.vocabulary.findMany({
          where: { id: { in: vocabIds } },
          select: { id: true, word: true, kana: true, romaji: true, meaning: true, partOfSpeech: true, jlptLevel: true },
        })
      : Promise.resolve([]),
    kanjiIds.length
      ? prisma.kanji.findMany({
          where: { id: { in: kanjiIds } },
          select: { id: true, character: true, meaning: true, jlptLevel: true, readings: true },
        })
      : Promise.resolve([]),
    grammarIds.length
      ? prisma.grammar.findMany({
          where: { id: { in: grammarIds } },
          select: { id: true, title: true, meaning: true, structure: true, level: true },
        })
      : Promise.resolve([]),
    exerciseIds.length
      ? prisma.exercise.findMany({
          where: { id: { in: exerciseIds } },
          // Exercise has no level column; the JLPT level comes from its lesson.
          select: { id: true, question: true, correctAnswer: true, prompt: true, lesson: { select: { level: true } } },
        })
      : Promise.resolve([]),
  ]);

  const kanaMap = new Map<string, { character: string; script: string; romaji: string; ipa: string | null }>();
  kanaRows.forEach((k) => {
    kanaMap.set(`${k.script}:${k.character}`, k);
    kanaMap.set(k.character, k);
  });
  const vocabMap = new Map(vocabRows.map((v) => [v.id, v]));
  const kanjiMap = new Map(kanjiRows.map((k) => [k.id, k]));
  const grammarMap = new Map(grammarRows.map((g) => [g.id, g]));
  const exerciseMap = new Map(
    exerciseRows.map((e) => [
      e.id,
      {
        question: e.question,
        correctAnswer: e.correctAnswer,
        prompt: e.prompt,
        level: e.lesson?.level ?? "",
      },
    ]),
  );

  const enrichedItems = resolveReviewItems(items, {
    kanaMap,
    vocabMap,
    kanjiMap,
    grammarMap,
    exerciseMap,
  });

  const queue = enrichedItems.slice(0, 5);
  const sessionCount = enrichedItems.length;
  const duePercent = totalDue ? Math.min(100, Math.round((sessionCount / totalDue) * 100)) : 0;
  const matureCount = enrichedItems.filter((item) => item.repetitions >= 3 || item.interval >= 7).length;

  // Retention is measured from the real review ledger instead of being
  // invented as 68% + a ratio of "mature" cards.
  const [goodGrades, totalGrades] = await Promise.all([
    prisma.reviewHistory.count({
      where: { userId: uid, grade: { in: ["GOOD", "EASY"] } },
    }),
    prisma.reviewHistory.count({ where: { userId: uid } }),
  ]);
  const forgottenCount = await prisma.reviewHistory.count({
    where: { userId: uid, grade: "AGAIN" },
  });
  const retention = totalGrades ? Math.round((goodGrades / totalGrades) * 100) : 0;

  return (
    <div className="nq-workspace rv-page">
      <JapanBackdrop />
      {/* Ảnh nền dưới header (full-bleed, phía sau AppNav) */}
      <div className="rv-banner" aria-hidden="true" />
      <AppNav />

      <div className="rv-container">
        <section className="rv-hero" data-intro>
          <div className="rv-hero-copy">
            <span className="rv-hero-kicker jp-text">一歩ずつ、夢に近づく。</span>
            <h1>
              Đấu trường <em>luyện tập</em>
            </h1>
            <p>Luyện tập chủ động. Củng cố trí nhớ. Biến kiến thức thành kỹ năng thực tế.</p>
          </div>
          <div className="rv-quote" data-parallax="0.08">
            <span className="jp-text">継続は力なり</span>
            <small>“Kiên trì sẽ thành sức mạnh.”</small>
            <i className="rv-quote-more" aria-hidden="true">»</i>
          </div>
        </section>

        <nav className="rv-tabs" aria-label="Chế độ luyện tập" data-reveal>
          {MODES.map((mode) => (
            <Link
              key={mode.href}
              href={mode.href}
              data-tone={mode.tone}
              className={`rv-tab ${mode.active ? "is-active" : ""}`}
              aria-current={mode.active ? "page" : undefined}
            >
              <span className="rv-tab-icon">
                <Icon name={mode.icon} size={22} />
              </span>
              <span className="rv-tab-text">
                <b>{mode.title}</b>
                <small>{mode.desc}</small>
              </span>
              <span className="rv-tab-go" aria-hidden="true">›</span>
            </Link>
          ))}
        </nav>

        <div className="rv-shell" data-reveal>
          <div className="rv-main">
            <section className="rv-panel" aria-labelledby="rv-title">
              <div className="rv-panel-head">
                <span className="rv-panel-icon">
                  <Icon name="card" size={26} />
                </span>
                <div>
                  <h2 id="rv-title">SRS Flashcard</h2>
                  <p>Ôn tập thông minh theo thuật toán Spaced Repetition System (SRS).</p>
                </div>
                <ReviewSettingsButton />
              </div>
              <div id="review-card">
                <ReviewClient initial={enrichedItems} backgrounds={listCardBackgrounds()} />
              </div>
            </section>

            <nav className="rv-promos" aria-label="Khám phá thêm">
              {PROMOS.map((p) => (
                <Link key={p.href} href={p.href} className="rv-promo" data-tone={p.tone}>
                  <span className="rv-promo-art jp-text" aria-hidden="true">{p.glyph}</span>
                  <b>{p.title}</b>
                  <small>{p.desc}</small>
                  <span className="rv-promo-go" aria-hidden="true">
                    <Icon name="arrowRight" size={18} />
                  </span>
                </Link>
              ))}
            </nav>

            <p className="rv-footline">
              <ToriiMini />
              <span className="jp-text">また、がんばりましょう！</span>
              <i aria-hidden="true" />
              <span>Cố gắng lên nhé!</span>
            </p>
          </div>

          <aside className="rv-aside" aria-label="Thống kê ôn tập">
            <section className="rv-stat is-due">
              <svg className="rv-due-torii" viewBox="0 0 120 100" aria-hidden="true">
                <g fill="#e8453b">
                  <path d="M4 20Q60 38 116 20L120 8Q60 26 0 8Z" />
                  <rect x="18" y="34" width="84" height="7" />
                  <rect x="26" y="30" width="9" height="68" rx="1.5" />
                  <rect x="85" y="30" width="9" height="68" rx="1.5" />
                </g>
              </svg>
              <div className="rv-stat-head">
                <span className="rv-stat-icon">
                  <Icon name="calendar" size={22} />
                </span>
                <div>
                  <b>Hôm nay đến hạn</b>
                  <small>Các thẻ từ cần ôn tập theo lịch SRS</small>
                </div>
              </div>
              <div className="rv-due-row">
                <strong>{sessionCount}</strong>
                <span>/ {totalDue} thẻ</span>
                <b>{duePercent}%</b>
              </div>
              <div className="rv-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={duePercent}>
                <i style={{ width: `${duePercent}%` }} />
              </div>
              <a className="rv-cta" href="#review-card">
                <span>
                  <Icon name="play" size={16} />
                  Bắt đầu ôn tập
                </span>
                <Icon name="arrowRight" size={18} />
              </a>
            </section>

            <section className="rv-stat">
              <div className="rv-stat-head">
                <span className="rv-stat-icon is-green">
                  <TrendIcon />
                </span>
                <div>
                  <b>Tỉ lệ ghi nhớ</b>
                  <small>Dựa trên {totalGrades} lượt ôn đã ghi nhận</small>
                </div>
                <span className="rv-stat-trend" aria-hidden="true">
                  <TrendIcon size={18} />
                </span>
              </div>
              <div className="rv-retention">
                <div className="rv-ring" style={{ "--retention": `${retention * 3.6}deg` } as CSSProperties}>
                  <strong>{retention}%</strong>
                  <small>Đúng</small>
                </div>
                <ul className="rv-legend">
                  <li data-tone="good">
                    <i />
                    Đúng ngay <b>{matureCount}</b>
                  </li>
                  <li data-tone="hard">
                    <i />
                    Cần ôn lại <b>{Math.max(0, sessionCount - matureCount)}</b>
                  </li>
                  <li data-tone="again">
                    <i />
                    Quên <b>{forgottenCount}</b>
                  </li>
                </ul>
              </div>
            </section>

            <section className="rv-stat">
              <div className="rv-queue-head">
                <div>
                  <span className="rv-stat-icon is-indigo">
                    <Icon name="quiz" size={22} />
                  </span>
                  <b>Hàng đợi ôn tập</b>
                </div>
                <Link href="/app/vocabulary">
                  Xem tất cả <Icon name="arrowRight" size={15} />
                </Link>
              </div>
              {queue.length ? (
                queue.map((item, index) => (
                  <div className="rv-queue-row" key={item.id}>
                    <span>{index + 1}</span>
                    <strong className="jp-text">{item.title}</strong>
                    <small className="jp-text">{item.reading || item.subtitle}</small>
                    <em className="rv-pill">{item.contentType === "KANA" ? "KANA" : `JLPT ${item.level || "N5"}`}</em>
                    <SpeakButton text={item.title} />
                  </div>
                ))
              ) : (
                <p className="rv-queue-empty">Không có thẻ đến hạn. Hẹn bạn ở phiên ôn tiếp theo.</p>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}