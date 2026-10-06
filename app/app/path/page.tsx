import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import "./path.css";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { AppNav } from "@/components/AppNav";
import { JapanBackdrop } from "@/components/JapanIllustration";
import { PathDecor, PathIcon, type DecorTheme, type PathIconName } from "@/components/PathDecor";
import { buildLearningPath, sanitizeAnswers, LEVEL_LABELS, GOAL_LABELS, SKILL_LABELS, STYLE_LABELS, type PathModule } from "@/lib/personalization";

export const metadata = { title: "Lộ Trình Cá Nhân — Nihon Quest" };

type ModuleStatus = "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED" | "AVAILABLE";

interface EnrichedModule extends PathModule {
  status: ModuleStatus;
  exerciseCount: number | null;
}

/* ---------- Họa tiết & ký hiệu theo nhóm (không cần ảnh riêng cho từng bài) ---------- */

const KIND_THEME: Record<PathModule["kind"], DecorTheme> = {
  KANA: "sakura",
  LESSON: "lantern",
  VOCAB: "lantern",
  GRAMMAR: "wave",
  REVIEW: "wave",
  SURVIVAL: "train",
  JOURNEY: "torii",
  SENSEI: "sakura",
  MOCK: "torii",
};

const KIND_GLYPH: Record<PathModule["kind"], string> = {
  KANA: "あ",
  LESSON: "学",
  VOCAB: "語",
  GRAMMAR: "文",
  REVIEW: "復",
  SURVIVAL: "旅",
  JOURNEY: "道",
  SENSEI: "師",
  MOCK: "試",
};

/** Chọn họa tiết: ưu tiên từ khóa trong tiêu đề, sau đó theo nhóm. */
function pickTheme(m: PathModule): DecorTheme {
  const t = m.title.toLowerCase();
  if (/biến âm|dakuten|handakuten/.test(t)) return "sakura";
  if (/yoon|âm ghép|âm ngắt/.test(t)) return "lantern";
  if (/tàu|ga |konbini|nghe hiểu|sân bay|taxi/.test(t)) return "train";
  if (/lượng từ|đếm|đền|chùa/.test(t)) return "torii";
  return KIND_THEME[m.kind];
}

/** Tách tiêu đề: phần đầu (trắng) + phần cuối (đỏ). */
function splitTitle(name: string): [string, string] {
  const m = name.match(/^(.*?[–—-])\s+(.+)$/);
  if (m) return [m[1], m[2]];
  const words = name.trim().split(/\s+/);
  if (words.length < 2) return [name, ""];
  return [words.slice(0, -1).join(" "), words[words.length - 1]];
}

export default async function LearningPathPage() {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: uid },
    select: {
      learningLevel: true,
      learningGoal: true,
      dailyGoalMinutes: true,
      levelChoice: true,
      focusSkill: true,
      learningStyle: true,
      onboardingCompleted: true,
      profile: { select: { displayName: true } },
    },
  });
  if (!user) redirect("/login");
  if (!user.onboardingCompleted) redirect("/onboarding");

  const answers = sanitizeAnswers({
    level: user.levelChoice || user.learningLevel,
    goal: user.learningGoal,
    dailyGoalMinutes: user.dailyGoalMinutes,
    focusSkill: user.focusSkill,
    learningStyle: user.learningStyle,
  });
  const path = buildLearningPath(answers);

  // Enrich LESSON / MOCK modules with real content + progress.
  const slugs = path.modules
    .filter((m) => (m.kind === "LESSON" || m.kind === "MOCK") && m.slug)
    .map((m) => m.slug!)
    .filter((s, i, arr) => arr.indexOf(s) === i);

  const lessons = await prisma.lesson.findMany({
    where: { slug: { in: slugs }, isPublished: true },
    select: {
      slug: true,
      title: true,
      description: true,
      xpReward: true,
      progress: { where: { userId: uid } },
      _count: { select: { exercises: true } },
    },
  });
  const bySlug = new Map(lessons.map((l) => [l.slug, l]));

  const modules: EnrichedModule[] = path.modules.map((m) => {
    const lesson = m.slug ? bySlug.get(m.slug) : undefined;
    const raw = lesson?.progress[0]?.status;
    const status: ModuleStatus = lesson
      ? raw === "COMPLETED"
        ? "COMPLETED"
        : raw === "IN_PROGRESS"
          ? "IN_PROGRESS"
          : "NOT_STARTED"
      : "AVAILABLE";
    return {
      ...m,
      title: lesson?.title ?? m.title,
      description: lesson?.description ?? m.description,
      xp: lesson?.xpReward ?? m.xp,
      status,
      exerciseCount: lesson ? lesson._count.exercises : null,
    };
  });

  const completed = modules.filter((m) => m.status === "COMPLETED").length;
  const currentIdx = modules.findIndex((m) => m.status === "NOT_STARTED" || m.status === "IN_PROGRESS");
  const percent = Math.round((completed / Math.max(1, modules.length)) * 100);
  const current = currentIdx >= 0 ? modules[currentIdx] : null;
  const displayName = user.profile?.displayName || session?.user?.name || "Bạn";
  const [titleHead, titleTail] = splitTitle(path.name);

  const answerChips: { label: string; value: string; icon: PathIconName }[] = [
    { label: "Trình độ", value: LEVEL_LABELS[answers.level], icon: "level" },
    { label: "Mục tiêu", value: GOAL_LABELS[answers.goal], icon: "goal" },
    { label: "Kỹ năng", value: SKILL_LABELS[answers.focusSkill], icon: "skill" },
    { label: "Phong cách", value: STYLE_LABELS[answers.learningStyle], icon: "style" },
    { label: "Thời gian", value: `${answers.dailyGoalMinutes} phút`, icon: "clock" },
  ];

  return (
    <div className="nqp">
      <JapanBackdrop />
      <div className="nqp-wrap">
        <AppNav userName={displayName} levelLabel={answers.level} />

        {/* ===== HERO ===== */}
        <section className="nqp-hero">
          <div className="nqp-hero-main">
            <div className="nqp-hero-scene" aria-hidden="true">
              <Image
                src="/images/dashboard/fuji-hero.webp"
                alt=""
                fill
                priority
                sizes="(max-width: 1320px) 100vw, 1320px"
                className="nqp-hero-img"
              />
            </div>
            <div className="nqp-vtext" aria-hidden="true">
              <span>日本へ行こう</span>
              <i className="nqp-seal">旅</i>
            </div>

            <div className="nqp-hero-copy">
              <span className="nqp-eyebrow">
                <span className="nqp-eyebrow-ico"><PathIcon name="goal" /></span>
                LỘ TRÌNH CÁ NHÂN HÓA
              </span>
              <h1 className="nqp-title">
                {titleHead}
                {titleTail && <em>{titleTail}</em>}
              </h1>
              <p className="nqp-tagline">{path.tagline}</p>

              {current && (
                <p className="nqp-next">
                  <small>{current.status === "IN_PROGRESS" ? "Đang học dở" : "Mô-đun tiếp theo"}</small>
                  <b>{current.title}</b>
                </p>
              )}

              <div className="nqp-hero-actions">
                {current ? (
                  <Link className="nqp-btn-red" href={current.target}>
                    <span className="nqp-btn-ico"><PathIcon name="flame" /></span>
                    {current.status === "IN_PROGRESS" ? "Tiếp tục học" : "Bắt đầu học"}
                    <span aria-hidden="true">→</span>
                  </Link>
                ) : (
                  <Link className="nqp-btn-red" href="/app/review">
                    <span className="nqp-btn-ico"><PathIcon name="flame" /></span>
                    Hoàn thành lộ trình — Ôn tập SRS
                    <span aria-hidden="true">→</span>
                  </Link>
                )}
                <Link className="nqp-btn-ghost" href="/app/profile">
                  <span className="nqp-btn-ico"><PathIcon name="refresh" /></span>
                  Thay đổi lộ trình
                </Link>
              </div>
            </div>
          </div>

          <div className="nqp-summary" aria-label="Lựa chọn cá nhân hóa của bạn">
            {answerChips.map((c) => (
              <div key={c.label} className="nqp-chip">
                <span className="nqp-chip-ico"><PathIcon name={c.icon} /></span>
                <span className="nqp-chip-txt">
                  <small>{c.label}</small>
                  <b>{c.value}</b>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="nqp-stats" aria-label="Thống kê lộ trình">
          <div className="nqp-stat s-blue">
            <span className="nqp-stat-ico"><PathIcon name="cap" /></span>
            <div><b>{modules.length}</b><small>Mô-đun kiến thức</small></div>
          </div>
          <div className="nqp-stat s-violet">
            <span className="nqp-stat-ico"><PathIcon name="layers" /></span>
            <div><b>{path.totalMinutes} phút</b><small>Tổng thời lượng</small></div>
          </div>
          <div className="nqp-stat s-green">
            <span className="nqp-stat-ico"><PathIcon name="target" /></span>
            <div>
              <b>{path.modulesPerWeek}/tuần</b>
              <small>Nhịp học ({path.answers.dailyMinutes} phút/ngày)</small>
            </div>
          </div>
          <div className="nqp-stat s-amber">
            <span className="nqp-stat-ico"><PathIcon name="flame" /></span>
            <div><b>~{path.estWeeks} tuần</b><small>Hoàn thành dự kiến</small></div>
          </div>
        </section>

        <div className="nqp-grid">
          {/* ===== CỘT TRÁI: THỐNG KÊ + TIMELINE ===== */}
          <div className="nqp-main">
            <div className="nqp-sec-title">
              <h2>
                <span className="nqp-sakura" aria-hidden="true">✿</span>
                Khóa kiến thức của bạn
              </h2>
              <span>Được sắp xếp riêng theo 5 lựa chọn khi tạo tài khoản — khác với danh sách Bài học chung.</span>
            </div>

            <ol className="nqp-timeline">
              {modules.map((m, i) => {
                const isCurrent = i === currentIdx;
                const theme = pickTheme(m);
                return (
                  <li
                    key={m.id}
                    className={[
                      "nqp-module",
                      `k-${m.kind.toLowerCase()}`,
                      m.status === "COMPLETED" ? "is-done" : "",
                      isCurrent ? "is-current" : "",
                    ].join(" ")}
                  >
                    <span className="nqp-node" aria-hidden="true">
                      {m.status === "COMPLETED" ? "✓" : i + 1}
                    </span>

                    <div className="nqp-module-body">
                      <PathDecor theme={theme} />

                      <div className="nqp-module-content">
                        <div className="nqp-module-top">
                          <span className={`nqp-kind k-${m.kind.toLowerCase()}`}>
                            <i aria-hidden="true">{KIND_GLYPH[m.kind]}</i>
                            {kindLabel(m.kind)}
                          </span>
                          <span className="nqp-meta">
                            {m.minutes} phút • +{m.xp} XP
                            {m.exerciseCount != null ? ` • ${m.exerciseCount} bài tập` : ""}
                          </span>
                          {m.status === "COMPLETED" && <span className="nqp-done">Đã hoàn thành</span>}
                          {isCurrent && <span className="nqp-now">Đang học</span>}
                        </div>

                        <h3>{m.title}</h3>
                        <p>{m.description}</p>

                        <div className="nqp-module-foot">
                          <span className="nqp-why" title="Lý do mô-đun này nằm trong lộ trình của bạn">
                            <span aria-hidden="true">💡</span> {m.why}
                          </span>
                          <div className="nqp-skills">
                            {m.skills.map((s) => (
                              <span key={s} className="nqp-skill">{s}</span>
                            ))}
                          </div>
                        </div>

                        {m.target && (
                          <Link className={`nqp-go ${isCurrent ? "is-current" : ""}`} href={m.target}>
                            {m.status === "COMPLETED" ? "Học lại" : isCurrent ? "Tiếp tục ngay" : "Mở mô-đun"}
                            <span aria-hidden="true">→</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* ===== CỘT PHẢI ===== */}
          <aside className="nqp-side">
            <section className="nqp-card nqp-card-why">
              <div className="nqp-card-head">
                <span className="nqp-card-ico"><PathIcon name="torii" /></span>
                <h3>Vì sao lộ trình này phù hợp bạn?</h3>
              </div>
              <p className="nqp-side-note">
                Engine cá nhân hóa phân tích 5 lựa chọn của bạn khi tạo tài khoản và xây dựng trình tự nội dung riêng.
              </p>
              <ul className="nqp-rationale">
                {path.rationale.map((r, i) => (
                  <li key={i}>
                    <span className="nqp-r-ico" aria-hidden="true">
                      {["レ", "目", "技", "式", "時"][i] ?? "道"}
                    </span>
                    <p>{r}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="nqp-card nqp-card-now">
              <h3>
                Đang học: mô-đun {currentIdx >= 0 ? currentIdx + 1 : modules.length} / {modules.length}
              </h3>
              {current ? (
                <>
                  <p className="nqp-current-title">{current.title}</p>
                  <div className="nqp-progress-row">
                    <div className="nqp-bar"><span style={{ width: `${percent}%` }} /></div>
                    <small>{percent}% • {completed}/{modules.length}</small>
                  </div>
                  <Link className="nqp-btn-red nqp-btn-block" href={current.target}>
                    Học ngay <span aria-hidden="true">→</span>
                  </Link>
                </>
              ) : (
                <p>Bạn đã hoàn thành toàn bộ lộ trình！🎉 Hãy ôn tập SRS để giữ kiến thức lâu dài.</p>
              )}
            </section>

            <section className="nqp-card nqp-card-plain">
              <div className="nqp-card-head">
                <span className="nqp-card-ico is-red"><PathIcon name="style" /></span>
                <h3>Lộ trình + Bài học</h3>
              </div>
              <p>
                <b>Bài học</b> là kho nội dung chung theo cấp độ. <b>Lộ trình cá nhân</b> là chuỗi mô-đun được chọn và sắp xếp riêng cho bạn — xen kẽ bài học, từ vựng, sinh tồn, hội thoại AI và ôn tập SRS theo đúng mục tiêu của bạn.
              </p>
              <Link className="nqp-link" href="/app/practice">
                Xem toàn bộ Bài học <span aria-hidden="true">→</span>
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

function kindLabel(kind: PathModule["kind"]): string {
  switch (kind) {
    case "KANA": return "Kana Lab";
    case "LESSON": return "Bài học";
    case "VOCAB": return "Từ vựng";
    case "GRAMMAR": return "Ngữ pháp";
    case "REVIEW": return "Ôn tập SRS";
    case "SURVIVAL": return "Sinh tồn";
    case "JOURNEY": return "Hành trình";
    case "SENSEI": return "AI Sensei";
    case "MOCK": return "Thi thử";
  }
}