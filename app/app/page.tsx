import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import "./dashboard.css";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { calculateLevel } from "@/lib/level";
import { localDateKey } from "@/lib/streak";
import { buildEnrichedLeaderboard } from "@/lib/rivalBots";
import { AppNav } from "@/components/AppNav";
import { JapanBackdrop } from "@/components/JapanIllustration";
import {
  BrushUnderline, Daruma, Icon, ModeArt, PathDeco, ShinkansenStrip, type ModeArtKind,
} from "@/components/DashboardArt";
import { ActivityButton } from "./ActivityButton";
import { buildLearningPath, sanitizeAnswers } from "@/lib/personalization";

export const metadata = { title: "Dashboard — Nihon Quest" };

const DAILY_INSPIRATIONS = [
  { kanji: "七転び八起き", romaji: "Nana korobi ya oki", meaning: "Ngã bảy lần, đứng dậy tám lần. Kiên trì là chìa khóa làm chủ Nhật ngữ." },
  { kanji: "継続は力なり", romaji: "Keizoku wa chikara nari", meaning: "Kiên trì tạo nên sức mạnh. Mỗi ngày 10 phút tích lũy thành thành công lớn." },
  { kanji: "一期一会", romaji: "Ichigo ichie", meaning: "Nhất kỳ nhất hội. Trân trọng từng khoảnh khắc và cơ hội học hỏi hôm nay." },
  { kanji: "千里の道も一歩から", romaji: "Senri no michi mo ippo kara", meaning: "Hành trình vạn dặm bắt đầu từ một bước chân. Hãy hoàn thành bài học hôm nay!" },
  { kanji: "日進月歩", romaji: "Nisshin geppo", meaning: "Mỗi ngày một bước tiến, mỗi tháng một bước nhảy vọt." },
  { kanji: "温故知新", romaji: "Onko chishin", meaning: "Ôn lại cái cũ để hiểu sâu cái mới. Ôn tập SRS đều đặn để nhớ mãi." },
];

const MODES: { tone: "rose" | "blue" | "green" | "amber"; art: ModeArtKind; title: string; body: string; href: string; cta: string }[] = [
  { tone: "rose", art: "srs", title: "Hàng đợi Ôn tập (SRS)", body: "Chống quên lãng với thuật toán SM-2. Ôn tập thông minh, ghi nhớ dài hạn.", href: "/app/review", cta: "Xem kho thẻ ôn tập" },
  { tone: "blue", art: "kana", title: "Kana Lab — Bảng Chữ Cái", body: "Luyện viết nét Hiragana & Katakana kèm âm thanh chuẩn và vẽ trên canvas.", href: "/app/learn", cta: "Luyện vẽ bảng chữ cái" },
  { tone: "green", art: "mountain", title: "Kho Từ Vựng & Hán Tự", body: "Tra cứu nghĩa, phát âm và ví dụ thực tế, kèm tính năng lưu SRS 1 chạm.", href: "/app/vocabulary", cta: "Tra cứu từ vựng & Kanji" },
  { tone: "amber", art: "bird", title: "Survival Mode — Sinh Tồn", body: "Thử thách phản xạ từ vựng và xử lý tình huống giao tiếp theo thời gian thực.", href: "/app/survival", cta: "Bắt đầu thử thách sinh tồn" },
  { tone: "rose", art: "torii", title: "Ngữ Pháp Cơ Bản", body: "Giải thích dễ hiểu, ví dụ minh họa rõ ràng, luyện tập ngay.", href: "/app/grammar", cta: "Học ngữ pháp" },
];

// Thanh điều hướng nhanh bên trái (chỉ hiện ≥ 1100px, dưới đó AppNav lo).
const RAIL = [
  { icon: "home", label: "Trang chủ", href: "/app", active: true },
  { icon: "book", label: "Học tập", href: "/app/learn", active: false },
  { icon: "chart", label: "Thống kê", href: "/app/stats", active: false },
  { icon: "gear", label: "Cài đặt", href: "/app/settings", active: false },
] as const;

export default async function AppHome() {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: uid }, include: { profile: true } });
  if (!user) redirect("/login");
  if (!user.onboardingCompleted) redirect("/onboarding");

  const level = calculateLevel(user.totalXP);
  const userLevel = user.learningLevel ?? "N5";

  const allLessons = await prisma.lesson.findMany({
    where: { isPublished: true, level: userLevel },
    orderBy: { order: "asc" },
    include: { progress: { where: { userId: uid } } },
  });
  const completed = allLessons.filter((l) => l.progress[0]?.status === "COMPLETED").length;
  const currentLesson = allLessons.find((l) => l.progress[0]?.status !== "COMPLETED") || allLessons[0];
  const lessonPercent = Math.round((completed / Math.max(1, allLessons.length)) * 100);

  const journeyLocations = await prisma.journeyLocation.findMany({
    orderBy: { order: "asc" },
    include: { userProgress: { where: { userId: uid } } },
    take: 5,
  });

  const dueReviewCount = await prisma.reviewItem.count({
    where: { userId: uid, dueAt: { lte: new Date() } },
  });

  const today = localDateKey(new Date(), user.timezone || "UTC");
  let missions = await prisma.userDailyMission.findMany({ where: { userId: uid, date: today }, include: { mission: true } });
  if (!missions.length) {
    const templates = await prisma.dailyMission.findMany();
    for (const t of templates) {
      await prisma.userDailyMission.upsert({
        where: { userId_missionId_date: { userId: uid, missionId: t.id, date: today } },
        update: {},
        create: { userId: uid, missionId: t.id, date: today, targetCount: t.targetCount },
      });
    }
    missions = await prisma.userDailyMission.findMany({ where: { userId: uid, date: today }, include: { mission: true } });
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  // Scoped to this user: previously loaded every user's XP ledger into one
  // user's dashboard request.
  const tx = await prisma.xpTransaction.findMany({
    where: { userId: uid, createdAt: { gte: sevenDaysAgo } },
    select: { userId: true, amount: true },
  });
  const weeklyXp = new Map<string, number>();
  tx.forEach((t) => weeklyXp.set(t.userId, (weeklyXp.get(t.userId) || 0) + t.amount));

  const users = await prisma.user.findMany({
    select: { id: true, name: true, totalXP: true, level: true, currentStreak: true, profile: { select: { displayName: true, avatar: true } } },
    orderBy: [{ totalXP: "desc" }, { currentStreak: "desc" }],
    take: 20,
  });
  const formatted = users.map((u) => ({
    id: u.id, name: u.name, totalXP: u.totalXP, level: u.level, currentStreak: u.currentStreak,
    displayName: u.profile?.displayName || u.name, avatar: u.profile?.avatar || null, weeklyXp: weeklyXp.get(u.id) || 0,
  }));
  const { weeklyList } = buildEnrichedLeaderboard(formatted, uid);

  const isBeginner = userLevel === "N5" && completed < 2;
  const intro = isBeginner
    ? "Hãy bắt đầu với bảng chữ cái và các câu chào hỏi căn bản nhất. Mỗi bước nhỏ hôm nay sẽ đưa bạn đến gần hơn với Nhật Bản."
    : user.learningGoal === "TRAVEL"
      ? "Tiếp tục tích lũy từ vựng du lịch, mở khóa bài học và những chặng Shinkansen mới."
      : user.learningGoal === "CONVERSATION"
        ? "Củng cố phản xạ đối đáp và biến kiến thức thành giao tiếp thực tế."
        : "Tiếp tục nhịp học đều đặn để biến tiếng Nhật thành một phần tự nhiên trong ngày của bạn.";

  // Personalized learning path (lộ trình cá nhân hóa) from the 5
  // onboarding answers, with per-module completion resolved from lessons.
  const pathAnswers = sanitizeAnswers({
    level: user.levelChoice || user.learningLevel,
    goal: user.learningGoal,
    dailyGoalMinutes: user.dailyGoalMinutes,
    focusSkill: user.focusSkill,
    learningStyle: user.learningStyle,
  });
  const myPath = buildLearningPath(pathAnswers);
  const pathSlugs = myPath.modules
    .filter((m) => m.slug)
    .map((m) => m.slug!)
    .filter((s, i, arr) => arr.indexOf(s) === i);
  const pathLessons = await prisma.lesson.findMany({
    where: { slug: { in: pathSlugs }, isPublished: true },
    select: { slug: true, title: true, progress: { where: { userId: uid } } },
  });
  const pathDone = new Set(
    pathLessons.filter((l) => l.progress[0]?.status === "COMPLETED").map((l) => l.slug),
  );
  const pathCompleted = myPath.modules.filter((m) => !m.slug || pathDone.has(m.slug)).length;
  const pathPercent = Math.round((pathCompleted / Math.max(1, myPath.modules.length)) * 100);
  const nextPathModule = myPath.modules.find((m) => m.slug && !pathDone.has(m.slug)) ?? myPath.modules[0];
  const focusSkillLine: Record<string, string> = {
    LISTENING: "Kỹ năng trọng tâm của bạn là Nghe — ưu tiên nghe hiểu mỗi ngày.",
    SPEAKING: "Kỹ năng trọng tâm của bạn là Nói — đừng ngại nói chuyện với AI Sensei.",
    READING: "Kỹ năng trọng tâm của bạn là Đọc — đọc báo & thực đơn mỗi ngày.",
    WRITING: "Kỹ năng trọng tâm của bạn là Viết — luyện viết Hán tự qua SRS.",
  };
  const skillIntro = focusSkillLine[user.focusSkill] ?? "";

  const quote = DAILY_INSPIRATIONS[new Date().getDate() % DAILY_INSPIRATIONS.length];
  const displayName = user.profile?.displayName || user.name || user.email.split("@")[0];
  const xpPercent = Math.min(100, Math.round((user.totalXP / Math.max(1, level.nextLevelXP)) * 100));
  const doneJourney = journeyLocations.filter((l) => l.userProgress[0]?.status === "COMPLETED").length;

  // Bài chưa từng mở → hiện nhãn "New" như trong thiết kế.
  const isNewLesson = !!currentLesson && !currentLesson.progress[0];
  const journeyPercent = Math.round((doneJourney / Math.max(1, journeyLocations.length)) * 100);

  return (
    <div className="nqd">
      <JapanBackdrop />
      <div className="nqd-footer" aria-hidden="true">
        <Image src="/images/dashboard/footer-sakura.webp" alt="" fill sizes="100vw" />
      </div>
      <div className="nqd-cheer" aria-hidden="true">一緒にがんばろう!</div>

      <div className="nqd-wrap">
        <AppNav userName={displayName} userLevel={level.level} userXP={user.totalXP} avatar={user.profile?.avatar} />

        <div className="nqd-shell">
          <div className="nqd-rail-wrap">
            <nav className="nqd-rail" aria-label="Điều hướng nhanh">
              {RAIL.map((r) => (
                <Link key={r.href} href={r.href} className={`nqd-rail-item ${r.active ? "is-active" : ""}`} aria-current={r.active ? "page" : undefined}>
                  <Icon name={r.icon} size={26} />
                  <span>{r.label}</span>
                </Link>
              ))}
            </nav>
            <div className="nqd-mascot" aria-hidden="true">
              <span className="cheer">がんばろう!</span>
              <Image src="/images/dashboard/maneki-neko.webp" alt="" width={480} height={518} />
            </div>
          </div>

          <div className="nqd-main">
            <section className="nqd-hero" aria-labelledby="dashboard-title">
              <div className="nqd-hero-copy">
                <span className="nqd-greet">こんにちは、</span>
                <h1 id="dashboard-title" className="nqd-name">
                  {displayName}!
                  <BrushUnderline />
                </h1>
                <p>{intro}{skillIntro ? ` ${skillIntro}` : ""}</p>
              </div>
              <div className="nqd-hero-scene" aria-hidden="true">
                <Image src="/images/dashboard/fuji-hero.webp" alt="" fill priority sizes="(max-width: 1100px) 100vw, 800px" />
              </div>
              <div className="nqd-stamp-wrap" aria-hidden="true">
                <div className="nqd-stamp"><span>一歩ずつ</span><span>夢に近づく</span></div>
                <span className="nqd-stamp-flower"><Icon name="sakura" size={26} /></span>
              </div>
              <aside className="nqd-card nqd-hero-quote" aria-label="Câu nói hôm nay">
                <b>{quote.kanji}</b>
                <em>{quote.romaji}</em>
                <p>{quote.meaning}</p>
                <span className="dash" aria-hidden="true" />
                <span className="chev" aria-hidden="true">›</span>
              </aside>
            </section>

            <div className="nqd-grid">
              <div className="nqd-col">
                <section className="nqd-path-spotlight">
                  <div className="nqd-path-deco" aria-hidden="true"><PathDeco /></div>
                  <div className="nqd-path-head">
                    <span className="nqd-pill-soft">
                      <span className="rk"><Icon name="rocket" size={14} /></span>
                      LỘ TRÌNH CỦA BẠN
                    </span>
                    <div className="nqd-path-prog">
                      <span className="nqd-pct">{pathPercent}% hoàn thành</span>
                      <div className="nqd-bar"><span style={{ width: `${pathPercent}%` }} /></div>
                    </div>
                  </div>
                  <h2>{myPath.name}</h2>
                  <p>{myPath.tagline}</p>
                  <div className="nqd-path-meta">
                    <span>{myPath.modules.length} chủ đề</span>
                    <span>{myPath.estWeeks} tuần</span>
                    <span>{myPath.answers.dailyMinutes} phút/ngày</span>
                    <span className="nqd-path-tags">
                      {myPath.answers.goalLabel} - {myPath.answers.skillLabel} - {myPath.answers.styleLabel}
                    </span>
                  </div>
                  <div className="nqd-btns">
                    <Link className="nqd-btn-red" href="/app/path">Xem lộ trình cá nhân →</Link>
                    {nextPathModule && (
                      <Link className="nqd-btn-outline" href={nextPathModule.target}>
                        Mở khóa tiếp theo: {nextPathModule.title}
                      </Link>
                    )}
                  </div>
                </section>

                <section className="nqd-focus">
                  <div className="nqd-focus-bg" aria-hidden="true">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="nqd-bg-light" src="/dash/light.png" alt="" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="nqd-bg-dark" src="/dash/dark.png" alt="" />
                  </div>
                  <div className="nqd-focus-top">
                    {isNewLesson && <span className="nqd-new">New</span>}
                    <span className="nqd-pill">BÀI HỌC HÔM NAY</span>
                    <span>
                      {allLessons.length
                        ? `Bài ${Math.min(completed + 1, allLessons.length)} / ${allLessons.length}`
                        : "Chưa có bài học"}
                    </span>
                    <span className="nqd-focus-pct">{lessonPercent}% hoàn thành</span>
                  </div>
                  <h2>{currentLesson?.title || "Hoàn thành lộ trình hôm nay"}</h2>
                  <p>{currentLesson?.description || `Bạn đã hoàn thành toàn bộ bài học ${userLevel}. Hãy ôn tập SRS hoặc tiếp tục hành trình.`}</p>
                  <div className="nqd-btns">
                    <Link className="nqd-btn-red" href={currentLesson ? `/app/practice/${currentLesson.slug}` : "/app/review"}>
                      {currentLesson ? "Tiếp tục bài học" : "Ôn tập SRS"} →
                    </Link>
                    <Link className="nqd-btn-ghost" href="/app/practice">Xem tất cả bài học</Link>
                  </div>
                  <div className="nqd-focus-vert" aria-hidden="true">
                    <div>日本語</div>
                    <div>が好き<i>♥</i></div>
                  </div>
                </section>

                <section className="nqd-explore">
                  <div className="nqd-sec-title">
                    <h2><Icon name="sakura" size={26} />Khám phá các chủ đề học tập</h2>
                    <span>Mỗi chủ đề là một bước tiến gần hơn đến mục tiêu của bạn!</span>
                  </div>
                  <div className="nqd-modes">
                    {MODES.map((m) => (
                      <article key={m.href} className="nqd-card nqd-mode">
                        <span className={`art ${m.tone}`} aria-hidden="true"><ModeArt kind={m.art} /></span>
                        <div className="body">
                          <h3>{m.title}</h3>
                          <p>{m.body}</p>
                          <Link href={m.href}>{m.cta} →</Link>
                        </div>
                        {m.href === "/app/review" && dueReviewCount === 0 && <span className="nqd-tag">Đã ôn hết hôm nay</span>}
                      </article>
                    ))}
                  </div>
                </section>
              </div>

              <aside className="nqd-col nqd-aside">
                <div className="nqd-mini-row">
                  <div className="nqd-card nqd-mini nqd-streak">
                    <div className="nqd-mini-top"><Icon name="flame" size={30} /><small>Chuỗi ngày học</small></div>
                    <b className="big">{user.currentStreak}</b>
                    <span className="unit">ngày</span>
                    <p className="foot">Kỷ lục: {user.longestStreak} ngày</p>
                    <span className="act"><ActivityButton /></span>
                    <span className="daruma"><Daruma /></span>
                  </div>
                  <div className="nqd-card nqd-mini nqd-level">
                    <div className="nqd-mini-top"><span className="badge"><Icon name="shield" size={28} /></span><small>Cấp độ học viên</small></div>
                    <b className="lv">Level {level.level}</b>
                    <div className="nqd-bar"><span style={{ width: `${xpPercent}%` }} /></div>
                    <p className="foot">{user.totalXP} / {level.nextLevelXP} XP</p>
                  </div>
                </div>

                <section className="nqd-card nqd-side-card">
                  <div className="nqd-side-head">
                    <h3><span className="hico red"><Icon name="target" size={24} /></span>Nhiệm vụ hôm nay</h3>
                    <Link href="/app/practice">Xem tất cả →</Link>
                  </div>
                  {missions.slice(0, 3).map((m, i) => {
                    // Progress can exceed the target (e.g. 2 lessons done for a
                    // "1 lesson" mission), which rendered as "2 / 1".
                    const target = Math.max(1, m.targetCount);
                    const done = Math.min(Math.max(0, m.progress), target);
                    const pct = Math.round((done / target) * 100);
                    return (
                      <div className="nqd-mission" key={m.id}>
                        <span className={`chk ${pct >= 100 ? "done" : ""}`} />
                        <span className={`mi m${i}`} aria-hidden="true">
                          {i === 0 ? "あ" : <Icon name={i === 1 ? "book" : "headphones"} size={20} />}
                        </span>
                        <div>
                          <b>{m.mission.title}</b>
                          <div className="nqd-bar"><span style={{ width: `${pct}%` }} /></div>
                          <small>{done} / {target}</small>
                        </div>
                        <em>+{m.mission.xpReward} XP</em>
                      </div>
                    );
                  })}
                </section>

                <section className="nqd-card nqd-side-card">
                  <div className="nqd-side-head">
                    <h3><span className="hico orange"><Icon name="trophy" size={24} /></span>Bảng xếp hạng tuần này</h3>
                    <Link href="/app/leaderboard">Xem tất cả →</Link>
                  </div>
                  {weeklyList.slice(0, 4).map((row, i) => {
                    const label = row.displayName || row.name || "Học viên";
                    return (
                      <div className={`nqd-rank ${row.id === uid ? "me" : ""}`} key={row.id}>
                        <span className={`n ${i < 3 ? `r${i + 1}` : ""}`}>{i + 1}</span>
                        <span className="av">
                          {row.avatar && (row.avatar.startsWith("http") || row.avatar.startsWith("/")) ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={row.avatar} alt="" width={36} height={36} />
                          ) : (
                            row.avatar || label.slice(0, 1).toUpperCase()
                          )}
                        </span>
                        <b>
                          <span className="nqd-rank-name">{label}</span>
                          {row.isBot && <span className="nqd-bot-badge"></span>}
                        </b>
                        <em>{row.xp.toLocaleString("vi-VN")} XP</em>
                      </div>
                    );
                  })}
                  {/*weeklyList.some((row) => row.isBot) && (
                    <p className="nqd-bot-note">Học viên ảo (BOT) do hệ thống tạo để luyện cạnh tranh — không phải người dùng thật.</p>
                  )*/}
                </section>

                <section className="nqd-card nqd-side-card">
                  <div className="nqd-side-head">
                    <h3><span className="hico blue"><Icon name="train" size={24} /></span>Hành trình Shinkansen</h3>
                    <Link href="/app/journey">Bản đồ →</Link>
                  </div>
                  <div className="nqd-train"><ShinkansenStrip /></div>
                  <div className="nqd-track">
                    {journeyLocations.map((loc) => (
                      <div key={loc.id} className={`nqd-station ${loc.userProgress[0]?.status === "COMPLETED" ? "is-done" : ""}`}>
                        <i /><span>{loc.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="nqd-bar thick"><span style={{ width: `${journeyPercent}%` }} /></div>
                  {/* Progress was screen-reader only, so sighted users saw a train
                      with no indication of how far along they were. */}
                  <p className="nqd-journey-count">
                    <b>{doneJourney}</b> / {journeyLocations.length} địa danh đã mở khóa
                  </p>
                </section>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}