import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { AppNav } from "@/components/AppNav";
import { Button } from "@/components/ui";
import { JapanBackdrop, JapanScenicPanel } from "@/components/JapanIllustration";
import { PracticeClient, type UnitInfo, type PracticeLessonItem } from "./PracticeClient";
import Link from "next/link";

function cleanLessonTitle(title: string): string {
  if (!title) return "";
  return title.replace(/^(Minna\s+)?Bài\s*\d+(\s*\([^\)]+\))?:\s*/i, "").trim();
}

export const metadata = {
  title: "Khóa Học & Luyện Tập JLPT — Nihon Quest",
};

const UNITS_BY_LEVEL: Record<string, UnitInfo[]> = {
  N5: [
    { number: 1, title: "Unit 01: Nhập Môn, Kana & Chào Hỏi", description: "Bảng chữ cái Hiragana, Katakana, biến âm, ảo âm, văn hóa chào hỏi & làm quen giao tiếp", icon: "🌱", startIndex: 0, endIndex: 10 },
    { number: 2, title: "Unit 02: Đồ Vật, Nơi Chốn & Hoạt Động", description: "Chỉ thị từ Kore/Sore/Are, địa điểm, thời gian, động từ di chuyển & các cặp tính từ sơ cấp", icon: "🍱", startIndex: 10, endIndex: 20 },
    { number: 3, title: "Unit 03: Tồn Tại, So Sánh & Thể Te", description: "Tồn tại Arimasu/Imasu, số đếm, so sánh hơn nhất, nguyện vọng & bí quyết chia Thể Te", icon: "🏪", startIndex: 20, endIndex: 30 },
    { number: 4, title: "Unit 04: Thể Nai, Ta, Thể Thường & Định Ngữ", description: "Mẫu câu cấm đoán, bắt buộc làm, thể từ điển, kinh nghiệm từng trải & mệnh đề bổ ngữ danh từ", icon: "⛩️", startIndex: 30, endIndex: 40 },
    { number: 5, title: "Unit 05: Kanji Master & Mock Test JLPT N5", description: "100+ Kanji cốt lõi, 10 trợ từ then chốt, phản xạ 5 thể động từ, đọc hiểu & đề thi thử toàn diện", icon: "🏆", startIndex: 40, endIndex: 50 },
  ],
  N4: [
    { number: 1, title: "Unit 01: Biến Thể Động Từ & Thể Trạng Thái", description: "Thể てしまう, やすい/にくい, すぎる và các biến thể động từ sơ trung cấp", icon: "🗂️", startIndex: 0, endIndex: 5 },
    { number: 2, title: "Unit 02: Câu Điều Kiện & Giả Định", description: "Bốn dạng câu giả định: ば, たら, なら, と — phân biệt và sử dụng đúng ngữ cảnh", icon: "🔄", startIndex: 5, endIndex: 10 },
    { number: 3, title: "Unit 03: Bị Động, Sai Khiến & Xin Phép", description: "Thể Bị động (受身), Thể Sai khiến và Mẫu câu xin phép nơi công sở", icon: "🏢", startIndex: 10, endIndex: 15 },
    { number: 4, title: "Unit 04: Cho Nhận & Diễn Đạt Ý Định", description: "Mẫu câu cho nhận あげる/もらう/くれる, khuyên nhủ ほうがいい và suy đoán", icon: "🎁", startIndex: 15, endIndex: 20 },
    { number: 5, title: "Unit 05: Kanji N4 & Đề Thi Thử JLPT N4", description: "Kanji sơ trung cấp, tổng hợp ngữ pháp N4, đọc hiểu & đề thi thử JLPT N4 toàn diện", icon: "🏅", startIndex: 20, endIndex: 25 },
  ],
  N3: [
    { number: 1, title: "Unit 01: Giao Tiếp Công Sở & Khẳng Định Logic", description: "Văn hóa Horenso công sở, に関して, わけがない, に違いない và khẳng định chắc chắn", icon: "💼", startIndex: 0, endIndex: 5 },
    { number: 2, title: "Unit 02: Thời Điểm, Nguyên Nhân & Mức Độ", description: "たとたん, うちに, おかげで, せいで, に比べて và diễn đạt mức độ so sánh", icon: "⏳", startIndex: 5, endIndex: 10 },
    { number: 3, title: "Unit 03: Phủ Định, Trạng Thái & Kính Ngữ N3", description: "わけではない, つつある, っぱなし, thụ động sai khiến và kính ngữ giao tiếp N3", icon: "🎯", startIndex: 10, endIndex: 15 },
    { number: 4, title: "Unit 04: Kanji Master N3 (Xã Hội & Công Việc)", description: "Bộ Kanji N3 cốt lõi về chính trị, kinh tế, công sở, kỹ thuật và đăng ký", icon: "🈁", startIndex: 15, endIndex: 20 },
    { number: 5, title: "Unit 05: Từ Vựng, Đọc Hiểu & Đề Thi Thử N3", description: "Động từ N3 tần suất cao, tính từ, đọc hiểu email công việc & đề thi thử JLPT N3", icon: "🏆", startIndex: 20, endIndex: 25 },
  ],
};

export default async function PracticePage() {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: uid }, select: { learningLevel: true } });
  const userLevel = user?.learningLevel ?? "N5";

  const allLessons = await prisma.lesson.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    include: { progress: { where: { userId: uid } }, _count: { select: { exercises: true } } },
  });

  // Filter lessons for user's current level
  const lessons = allLessons.filter((l) => l.level === userLevel);
  const completedCount = lessons.filter((l) => l.progress[0]?.status === "COMPLETED").length;
  const progressPercent = Math.round((completedCount / Math.max(1, lessons.length)) * 100);
  const nextLesson = lessons.find((l) => l.progress[0]?.status !== "COMPLETED") || lessons[0];

  const UNITS = UNITS_BY_LEVEL[userLevel] ?? UNITS_BY_LEVEL["N5"];

  const LEVEL_DESCS: Record<string, string> = {
    N5: "Hệ thống bài học cơ bản từ Kana đến giao tiếp hàng ngày kèm trắc nghiệm phản xạ.",
    N4: "Lộ trình sơ trung cấp: Biến thể động từ, câu điều kiện, bị động và sai khiến thực chiến.",
    N3: "Ngữ pháp trung cấp: Diễn đạt sắc thái, thời điểm và giao tiếp nơi công sở chuyên nghiệp.",
  };

  const serializedLessons: PracticeLessonItem[] = lessons.map((l) => ({
    id: l.id,
    order: l.order,
    slug: l.slug,
    title: l.title,
    description: l.description,
    xpReward: l.xpReward,
    level: l.level,
    exercisesCount: l._count.exercises,
    progressStatus: l.progress[0]?.status as "COMPLETED" | "IN_PROGRESS" | undefined,
    score: l.progress[0]?.score,
  }));

  return (
    <div className="nq-workspace">
      <JapanBackdrop />
      <AppNav />

      {/* HERO */}
      <section className="relative mx-auto mt-2 grid max-w-[1320px] items-center gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="relative z-10 py-8 lg:py-12" data-intro>
          <div className="mb-4 flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] text-slate-500 dark:text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600" aria-hidden="true" />
            BÀI HỌC &nbsp;›&nbsp; LỘ TRÌNH JLPT {userLevel}
          </div>
          <h1 className="text-[clamp(1.75rem,7.5vw,40px)] font-black leading-[1.08] tracking-tight text-balance text-slate-900 dark:text-white sm:text-5xl">
            Học theo <span className="text-red-600">hành trình thực tế.</span>
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
            {LEVEL_DESCS[userLevel] ?? LEVEL_DESCS["N5"]}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2 sm:gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-sumi-800">
              ▤ {lessons.length} bài học
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-sumi-800">
              ◷ ~15 phút / bài
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-sumi-800">
              ▥ {progressPercent}% hoàn thành
            </span>
          </div>
        </div>

        <div className="relative hidden h-[230px] overflow-hidden rounded-3xl shadow-lg md:block lg:h-[260px]" data-intro data-parallax>
          <JapanScenicPanel variant="konbini" showLabel={false} />
        </div>
      </section>

      {/* COURSE SUMMARY */}
      <section className="mx-auto max-w-[1320px] px-4 sm:px-6 mb-8" data-reveal>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8 rounded-3xl bg-white/80 dark:bg-sumi-900/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
          <div className="flex-1 w-full">
            <small className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 mb-2 block">
              TIẾN ĐỘ LỘ TRÌNH JLPT {userLevel}
            </small>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
              {progressPercent === 100 ? `Bạn đã hoàn thành khóa học ${userLevel}.` : "Tiếp tục hành trình học tập."}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Đã hoàn thành {completedCount} / {lessons.length} bài học.
            </p>
            <div className="h-3 w-full max-w-md overflow-hidden rounded-full bg-slate-100 dark:bg-sumi-800 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-600 transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          
          {nextLesson && (
            <div className="shrink-0 w-full md:w-auto flex flex-col items-start md:items-end p-5 rounded-2xl bg-slate-50 dark:bg-sumi-950 border border-slate-100 dark:border-slate-800">
              <small className="text-[10px] font-bold tracking-wider text-red-500 dark:text-red-400 mb-1">
                BÀI HỌC TIẾP THEO
              </small>
              <b className="text-base text-slate-900 dark:text-white mb-4 line-clamp-1">
                {cleanLessonTitle(nextLesson.title)}
              </b>
              <Link href={`/app/practice/${nextLesson.slug}`} className="w-full">
                <Button variant="sakura" size="sm" className="w-full shadow-lg shadow-red-500/20">
                  Học bài này ngay →
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 pb-20" data-reveal>
        <PracticeClient lessons={serializedLessons} units={UNITS} userLevel={userLevel} />
      </div>
    </div>
  );
}
