import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { calculateLevel } from "@/lib/level";
import { localDateKey } from "@/lib/streak";
import { buildEnrichedLeaderboard } from "@/lib/rivalBots";
import { AppNav } from "@/components/AppNav";
import { JapanBackdrop, JapanScenicPanel } from "@/components/JapanIllustration";
import { JapanStreetScene, ShinkansenStrip } from "@/components/DashboardArt";
import { ActivityButton } from "./ActivityButton";

export const metadata = { title: "Dashboard — Nihon Quest" };

const DAILY_INSPIRATIONS = [
  { kanji: "七転び八起き", romaji: "Nana korobi ya oki", meaning: "Ngã bảy lần, đứng dậy tám lần. Kiên trì là chìa khóa làm chủ Nhật ngữ." },
  { kanji: "継続は力なり", romaji: "Keizoku wa chikara nari", meaning: "Kiên trì tạo nên sức mạnh. Mỗi ngày 10 phút tích lũy thành thành công lớn." },
  { kanji: "一期一会", romaji: "Ichigo ichie", meaning: "Nhất kỳ nhất hội. Trân trọng từng khoảnh khắc và cơ hội học hỏi hôm nay." },
  { kanji: "千里の道も一歩から", romaji: "Senri no michi mo ippo kara", meaning: "Hành trình vạn dặm bắt đầu từ một bước chân. Hãy hoàn thành bài học hôm nay!" },
  { kanji: "日進月歩", romaji: "Nisshin geppo", meaning: "Mỗi ngày một bước tiến, mỗi tháng một bước nhảy vọt." },
  { kanji: "温故知新", romaji: "Onko chishin", meaning: "Ôn lại cái cũ để hiểu sâu cái mới. Ôn tập SRS đều đặn để nhớ mãi." },
];

const MODES = [
  { icon: "↻", tone: "blue", title: "Hàng đợi Ôn tập (SRS)", body: "Chống quên lãng với thuật toán SM-2. Ôn tập thông minh, ghi nhớ dài hạn.", href: "/app/review", cta: "Xem kho thẻ ôn tập", art: "記" },
  { icon: "あ", tone: "rose", title: "Kana Lab — Bảng Chữ Cái", body: "Luyện viết nét Hiragana & Katakana kèm âm thanh chuẩn và vẽ trên canvas.", href: "/app/learn", cta: "Luyện vẽ bảng chữ cái", art: "あ" },
  { icon: "漢", tone: "amber", title: "Kho Từ Vựng & Hán Tự", body: "Tra cứu nghĩa, phát âm và ví dụ thực tế, kèm tính năng lưu SRS 1 chạm.", href: "/app/vocabulary", cta: "Tra cứu từ vựng & Kanji", art: "山" },
  { icon: "✕", tone: "green", title: "Survival Mode — Sinh Tồn", body: "Thử thách phản xạ từ vựng và xử lý tình huống giao tiếp theo thời gian thực.", href: "/app/survival", cta: "Bắt đầu thử thách sinh tồn", art: "鳥居" },
];

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
  const tx = await prisma.xpTransaction.findMany({ where: { createdAt: { gte: sevenDaysAgo } }, select: { userId: true, amount: true } });
  const weeklyXp = new Map<string, number>();
  tx.forEach((t) => weeklyXp.set(t.userId, (weeklyXp.get(t.userId) || 0) + t.amount));

  const users = await prisma.user.findMany({
    select: { id: true, name: true, totalXP: true, level: true, currentStreak: true, profile: { select: { displayName: true, avatar: true } } },
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

  const quote = DAILY_INSPIRATIONS[new Date().getDate() % DAILY_INSPIRATIONS.length];
  const displayName = user.profile?.displayName || user.name || user.email.split("@")[0];
  const xpPercent = Math.min(100, Math.round((user.totalXP / Math.max(1, level.nextLevelXP)) * 100));
  const doneJourney = journeyLocations.filter((l) => l.userProgress[0]?.status === "COMPLETED").length;

  return (
    <div className="nqd">
      <JapanBackdrop />
      <div className="nqd-wrap">
        <AppNav userName={displayName} userLevel={level.level} userXP={user.totalXP} avatar={user.profile?.avatar} />

        <section className="nqd-hero" aria-labelledby="dashboard-title">
          <div className="nqd-hero-copy">
            <span className="nqd-greet">こんにちは、</span>
            <h1 id="dashboard-title" className="nqd-name">{displayName}!</h1>
            <p>{intro}</p>
          </div>
          <div className="nqd-hero-scene"><JapanScenicPanel variant="fuji" /></div>
          <div className="nqd-vertical" aria-hidden="true">
            <span className="big">日本への旅</span>
            <span className="small">一歩ずつ、もっと遠くへ</span>
            <span className="nqd-seal">日本</span>
          </div>
        </section>

        <div className="nqd-grid">
          <div className="nqd-col">
            <div className="nqd-card nqd-proverb">
              <span className="q">“</span>
              <div>
                <b>{quote.kanji}</b><em>({quote.romaji})</em>
                <p>{quote.meaning}</p>
              </div>
            </div>

            <section className="nqd-focus">
              <div className="nqd-focus-bg"><JapanStreetScene /></div>
              <div className="nqd-focus-top">
                <span className="nqd-pill">— BÀI HỌC HÔM NAY</span>
                <span>Bài {Math.min(completed + 1, Math.max(1, allLessons.length))} / {Math.max(1, allLessons.length)}</span>
              </div>
              <span className="nqd-focus-pct">{lessonPercent}% hoàn thành</span>
              <h2>{currentLesson?.title || "Hoàn thành lộ trình hôm nay"}</h2>
              <p>{currentLesson?.description || `Bạn đã hoàn thành toàn bộ bài học ${userLevel}. Hãy ôn tập SRS hoặc tiếp tục hành trình.`}</p>
              <div className="nqd-btns">
                <Link className="nqd-btn-red" href={currentLesson ? `/app/practice/${currentLesson.slug}` : "/app/review"}>
                  {currentLesson ? "Tiếp tục bài học" : "Ôn tập SRS"} →
                </Link>
                <Link className="nqd-btn-ghost" href="/app/practice">Xem tất cả bài học</Link>
              </div>
            </section>

            <div className="nqd-sec-title">
              <h2>Khám phá các chế độ học tập</h2>
              <span>Mỗi con đường đều dẫn bạn đến gần hơn với Nhật Bản.</span>
            </div>
            <div className="nqd-modes">
              {MODES.map((m) => (
                <article key={m.href} className="nqd-card nqd-mode">
                  <span className={`ico ${m.tone}`}>{m.icon}</span>
                  <div>
                    <h3>{m.title}</h3>
                    <p>{m.body}</p>
                    <Link href={m.href}>{m.cta} →</Link>
                  </div>
                  {m.href === "/app/review" && totalDone(allLessons.length) && <span className="nqd-tag">Đã hoàn thành</span>}
                  <span className="art" aria-hidden="true">{m.art}</span>
                </article>
              ))}
            </div>
          </div>

          <aside className="nqd-col">
            <div className="nqd-mini-row">
              <div className="nqd-card nqd-mini">
                <span className="glyph">🔥</span>
                <div style={{ flex: 1 }}>
                  <small>Chuỗi ngày học liên tiếp</small>
                  <b>{user.currentStreak} ngày</b>
                  <p>Kỷ lục: {user.longestStreak} ngày</p>
                </div>
                <ActivityButton />
              </div>
              <div className="nqd-card nqd-mini">
                <span className="glyph">⛩</span>
                <div style={{ flex: 1 }}>
                  <small style={{ color: "#78716c" }}>Cấp độ học viên</small>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <b>Level {level.level}</b>
                    <p>{user.totalXP} XP</p>
                  </div>
                  <div className="nqd-bar" style={{ margin: "6px 0 4px" }}><span style={{ width: `${xpPercent}%` }} /></div>
                  <p style={{ textAlign: "right" }}>{user.totalXP} / {level.nextLevelXP} XP</p>
                </div>
              </div>
            </div>

            <section className="nqd-card nqd-side-card">
              <div className="nqd-side-head"><h3>Nhiệm vụ hôm nay</h3><Link href="/app/practice">Xem tất cả →</Link></div>
              {missions.slice(0, 3).map((m, i) => {
                const pct = Math.min(100, Math.round((m.progress / Math.max(1, m.targetCount)) * 100));
                return (
                  <div className="nqd-mission" key={m.id}>
                    <span className={`chk ${pct >= 100 ? "done" : ""}`} />
                    <span className={`mi m${i}`}>{["あ", "📖", "🎧"][i] ?? "◉"}</span>
                    <div>
                      <b>{m.mission.title}</b>
                      <div className="nqd-bar"><span style={{ width: `${pct}%` }} /></div>
                      <small>{m.progress} / {m.targetCount}</small>
                    </div>
                    <em>+{m.mission.xpReward} XP</em>
                  </div>
                );
              })}
            </section>

            <section className="nqd-card nqd-side-card">
              <div className="nqd-side-head"><h3>🏆 Bảng xếp hạng tuần này</h3><Link href="/app/leaderboard">Xem tất cả →</Link></div>
              {weeklyList.slice(0, 4).map((row: any, i: number) => {
                const label = row.displayName || row.name || "Học viên";
                return (
                  <div className={`nqd-rank ${row.id === uid ? "me" : ""}`} key={row.id}>
                    <span className={`n ${i < 3 ? `r${i + 1}` : ""}`}>{i + 1}</span>
                    <span className="av">{row.avatar ? <img src={row.avatar} alt="" width={34} height={34} /> : label.slice(0, 1).toUpperCase()}</span>
                    <b>{label}</b>
                    <em>{row.weeklyXp ?? row.xp ?? 0} XP</em>
                  </div>
                );
              })}
            </section>

            <section className="nqd-card nqd-side-card">
              <div className="nqd-side-head"><h3>🚄 Hành trình Shinkansen</h3><Link href="/app/journey">Bản đồ →</Link></div>
              <div className="nqd-track">
                {journeyLocations.map((loc) => (
                  <div key={loc.id} className={`nqd-station ${loc.userProgress[0]?.status === "COMPLETED" ? "is-done" : ""}`}>
                    <i /><span>{loc.name}</span>
                  </div>
                ))}
              </div>
              <div className="nqd-train"><ShinkansenStrip /></div>
              <span className="sr-only">{doneJourney}/{journeyLocations.length} địa danh đã mở khóa</span>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

function totalDone(total: number) {
  return total === 0;
}
