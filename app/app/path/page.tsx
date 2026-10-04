import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import "./path.css";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { AppNav } from "@/components/AppNav";
import { JapanBackdrop, JapanScenicPanel } from "@/components/JapanIllustration";
import { buildLearningPath, sanitizeAnswers, LEVEL_LABELS, GOAL_LABELS, SKILL_LABELS, STYLE_LABELS, type PathModule } from "@/lib/personalization";

export const metadata = { title: "Lộ Trình Cá Nhân — Nihon Quest" };

type ModuleStatus = "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED" | "AVAILABLE";

interface EnrichedModule extends PathModule {
  status: ModuleStatus;
  exerciseCount: number | null;
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

  const answerChips = [
    { label: "Trình độ", value: LEVEL_LABELS[answers.level] },
    { label: "Mục tiêu", value: GOAL_LABELS[answers.goal] },
    { label: "Kỹ năng", value: SKILL_LABELS[answers.focusSkill] },
    { label: "Phong cách", value: STYLE_LABELS[answers.learningStyle] },
    { label: "Mỗi ngày", value: `${answers.dailyGoalMinutes} phút` },
  ];

  return (
    <div className="nqp">
      <JapanBackdrop />
      <div className="nqp-wrap">
        <AppNav userName={displayName} levelLabel={answers.level} />

        {/* HERO */}
        <section className="nqp-hero">
          <div className="nqp-hero-copy">
            <span className="nqp-eyebrow">LỘ TRÌNH CÁ NHÂN HÓA</span>
            <h1 className="nqp-title">{path.name}</h1>
            <p className="nqp-tagline">{path.tagline}</p>
            <div className="nqp-chips">
              {answerChips.map((c) => (
                <span key={c.label} className="nqp-chip">
                  <small>{c.label}</small>
                  <b>{c.value}</b>
                </span>
              ))}
            </div>
            <div className="nqp-hero-actions">
              {current ? (
                <Link className="nqp-btn-red" href={current.target}>
                  {current.status === "IN_PROGRESS" ? "Tiếp tục: " : "Bắt đầu: "}
                  {current.title} →
                </Link>
              ) : (
                <Link className="nqp-btn-red" href="/app/review">
                  Hoàn thành lộ trình — Ôn tập SRS →
                </Link>
              )}
              <Link className="nqp-btn-ghost" href="/app/profile">
                Thay đổi lựa chọn
              </Link>
            </div>
          </div>
          <div className="nqp-hero-scene">
            <JapanScenicPanel variant="fuji" showLabel={false} />
          </div>
        </section>

        {/* STATS */}
        <section className="nqp-stats">
          <div className="nqp-stat">
            <b>{modules.length}</b>
            <small>Mô-đun kiến thức</small>
          </div>
          <div className="nqp-stat">
            <b>{path.totalMinutes} phút</b>
            <small>Tổng thời lượng</small>
          </div>
          <div className="nqp-stat">
            <b>{path.modulesPerWeek}/tuần</b>
            <small>Nhịp học ({path.answers.dailyMinutes} phút/ngày)</small>
          </div>
          <div className="nqp-stat">
            <b>~{path.estWeeks} tuần</b>
            <small>Hoàn thành dự kiến</small>
          </div>
          <div className="nqp-stat nqp-stat-wide">
            <div className="nqp-stat-top">
              <b>{percent}%</b>
              <small>{completed}/{modules.length} mô-đun đã hoàn thành</small>
            </div>
            <div className="nqp-bar"><span style={{ width: `${percent}%` }} /></div>
          </div>
        </section>

        <div className="nqp-grid">
          {/* TIMELINE */}
          <div className="nqp-main">
            <div className="nqp-sec-title">
              <h2>Khóa kiến thức của bạn</h2>
              <span>Được sắp xếp riêng theo 5 lựa chọn khi tạo tài khoản — khác với danh sách Bài học chung.</span>
            </div>
            <ol className="nqp-timeline">
              {modules.map((m, i) => {
                const isCurrent = i === currentIdx;
                return (
                  <li
                    key={m.id}
                    className={`nqp-module ${m.status === "COMPLETED" ? "is-done" : ""} ${isCurrent ? "is-current" : ""}`}
                  >
                    <span className="nqp-node" aria-hidden="true">
                      {m.status === "COMPLETED" ? "✓" : i + 1}
                    </span>
                    <div className="nqp-module-body">
                      <div className="nqp-module-top">
                        <span className={`nqp-kind k-${m.kind.toLowerCase()}`}>{kindLabel(m.kind)}</span>
                        <span className="nqp-meta">
                          {m.minutes} phút · +{m.xp} XP
                          {m.exerciseCount != null ? ` · ${m.exerciseCount} bài tập` : ""}
                        </span>
                        {m.status === "COMPLETED" && <span className="nqp-done">Đã hoàn thành</span>}
                        {isCurrent && <span className="nqp-now">Đang học</span>}
                      </div>
                      <h3>{m.title}</h3>
                      <p>{m.description}</p>
                      <div className="nqp-module-foot">
                        <span className="nqp-why" title="Lý do mô-đun này nằm trong lộ trình của bạn">
                          💡 {m.why}
                        </span>
                        <div className="nqp-skills">
                          {m.skills.map((s) => (
                            <span key={s} className="nqp-skill">{s}</span>
                          ))}
                        </div>
                      </div>
                      {m.target && (
                        <Link
                          className={`nqp-go ${isCurrent ? "is-current" : ""}`}
                          href={m.target}
                        >
                          {m.status === "COMPLETED" ? "Học lại" : isCurrent ? "Tiếp tục ngay" : "Mở mô-đun"} →
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* SIDEBAR */}
          <aside className="nqp-side">
            <section className="nqp-card">
              <h3>Vì sao lộ trình này phù hợp bạn?</h3>
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

            <section className="nqp-card">
              <h3>Đang học mô-đun {currentIdx >= 0 ? currentIdx + 1 : modules.length} / {modules.length}</h3>
              {current ? (
                <>
                  <p className="nqp-current-title">{current.title}</p>
                  <div className="nqp-bar"><span style={{ width: `${percent}%` }} /></div>
                  <Link className="nqp-btn-red nqp-btn-block" href={current.target}>
                    Học ngay →
                  </Link>
                </>
              ) : (
                <p>Bạn đã hoàn thành toàn bộ lộ trình！🎉 Hãy ôn tập SRS để giữ kiến thức lâu dài.</p>
              )}
            </section>

            <section className="nqp-card nqp-card-plain">
              <h3>Lộ trình ≠ Bài học</h3>
              <p>
                <b>Bài học</b> là kho nội dung chung theo cấp độ. <b>Lộ trình cá nhân</b> là chuỗi mô-đun được chọn và sắp xếp riêng cho bạn — xen kẽ bài học, từ vựng, sinh tồn, hội thoại AI và ôn tập SRS theo đúng mục tiêu của bạn.
              </p>
              <Link className="nqp-link" href="/app/practice">Xem toàn bộ Bài học →</Link>
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
