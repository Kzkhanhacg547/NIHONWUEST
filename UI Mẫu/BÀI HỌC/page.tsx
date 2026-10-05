import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { AppNav } from "@/components/AppNav";
import { JapanBackdrop, JapanScenicPanel } from "@/components/JapanIllustration";
import { QuizRunner } from "./QuizRunner";
import {
  DialogueSection,
  GrammarSection,
  LessonStepsBar,
  SectionShell,
  VocabSection,
  type DialogueLineView,
  type GrammarView,
  type VocabView,
} from "./LessonSections";
import { IconChart, IconClock, IconBook, IconHome, IconTarget } from "./LessonIcons";

const HAS_JAPANESE = /[ぁ-んァ-ン一-龯]/;

const LEVEL_LABEL: Record<string, string> = {
  N5: "Cơ bản (N5)",
  N4: "Sơ trung cấp (N4)",
  N3: "Trung cấp (N3)",
  N2: "Trung cao cấp (N2)",
  N1: "Cao cấp (N1)",
};

function cleanLessonTitle(title: string): string {
  if (!title) return "";
  return title.replace(/^(Minna\s+)?Bài\s*\d+(\s*\([^\)]+\))?:\s*/i, "").trim();
}

function scenicVariant(title: string): "konbini" | "ramen" | "street" | "kyoto" {
  const value = title.toLowerCase();
  if (value.includes("ramen") || value.includes("nhà hàng") || value.includes("ẩm thực")) return "ramen";
  if (value.includes("konbini") || value.includes("mua sắm") || value.includes("cửa hàng")) return "konbini";
  if (value.includes("du lịch") || value.includes("văn hóa")) return "kyoto";
  return "street";
}

// Lấy field tuỳ chọn (schema có thể có hoặc không có) mà không làm vỡ type-check
function pick(source: unknown, keys: string[]): string | undefined {
  if (!source || typeof source !== "object") return undefined;
  const record = source as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

export default async function LessonRunnerPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) redirect("/login");

  const lesson = await prisma.lesson.findUnique({
    where: { slug: params.slug },
    include: {
      items: { orderBy: { order: "asc" } },
      exercises: { orderBy: { order: "asc" }, include: { options: { orderBy: { order: "asc" } } } },
    },
  });
  if (!lesson) notFound();

  // Bài kế tiếp cùng cấp độ + số thứ tự "Unit" của bài trong cấp độ đó
  const [nextLesson, lessonsBefore] = await Promise.all([
    prisma.lesson.findFirst({
      where: { isPublished: true, level: lesson.level, order: { gt: lesson.order } },
      orderBy: { order: "asc" },
      select: { id: true, slug: true, title: true, level: true, xpReward: true },
    }),
    prisma.lesson.count({ where: { isPublished: true, level: lesson.level, order: { lt: lesson.order } } }),
  ]);
  const unitLabel = String(lessonsBefore + 1).padStart(2, "0");

  const vocabIds = new Set<string>();
  const grammarIds = new Set<string>();
  for (const item of lesson.items) {
    if (item.contentType === "VOCAB") vocabIds.add(item.contentId);
    if (item.contentType === "GRAMMAR") grammarIds.add(item.contentId);
  }
  for (const exercise of lesson.exercises) {
    if (exercise.contentType === "VOCAB" && exercise.contentId) vocabIds.add(exercise.contentId);
    if (exercise.contentType === "GRAMMAR" && exercise.contentId) grammarIds.add(exercise.contentId);
  }

  const [resolvedVocabulary, resolvedGrammar] = await Promise.all([
    vocabIds.size
      ? prisma.vocabulary.findMany({ where: { id: { in: Array.from(vocabIds) } }, include: { examples: true }, take: 12 })
      : prisma.vocabulary.findMany({ where: { jlptLevel: lesson.level }, include: { examples: true }, orderBy: { word: "asc" }, take: 8 }),
    grammarIds.size
      ? prisma.grammar.findMany({ where: { id: { in: Array.from(grammarIds) } }, include: { examples: true }, take: 3 })
      : prisma.grammar.findMany({ where: { level: lesson.level }, include: { examples: true }, orderBy: { title: "asc" }, take: 2 }),
  ]);

  // ── Serialize cho client components ──
  const vocab: VocabView[] = resolvedVocabulary.map((w) => ({
    id: w.id,
    word: w.word,
    kana: w.kana,
    romaji: w.romaji,
    meaning: w.meaning,
    kanji: w.kanji || undefined,
    imageUrl: pick(w, ["imageUrl", "image", "imagePath"]),
  }));

  const grammar: GrammarView[] = resolvedGrammar.map((g) => ({
    id: g.id,
    title: g.title,
    romaji: pick(g, ["romaji", "reading"]),
    meaning: g.meaning,
    usage: pick(g, ["usage", "explanation", "note", "notes"]),
    structure: g.structure,
    examples: g.examples.slice(0, 2).map((e) => ({
      japanese: e.japanese,
      translation: pick(e, ["vietnamese", "translation", "meaning", "english"]),
    })),
  }));

  // Hội thoại: ưu tiên câu ví dụ ngữ pháp (câu tiếng Nhật thật), fallback sang câu hỏi của bài tập
  const grammarSentences = resolvedGrammar.flatMap((g) =>
    g.examples.map((e) => ({
      japanese: e.japanese,
      romaji: pick(e, ["romaji"]),
      translation: pick(e, ["vietnamese", "translation", "meaning", "english"]),
    }))
  );

  let dialogue: DialogueLineView[];
  if (grammarSentences.length >= 2) {
    dialogue = grammarSentences.slice(0, 2).map((s, i) => ({
      id: `grammar-${i}`,
      side: i % 2 === 0 ? "a" : "b",
      ...s,
    }));
  } else {
    const fromExercises = lesson.exercises.filter((ex) => ex.prompt || HAS_JAPANESE.test(ex.question));
    dialogue = (fromExercises.length ? fromExercises : lesson.exercises).slice(0, 2).map((ex, i) => ({
      id: ex.id,
      side: i % 2 === 0 ? "a" : "b",
      japanese: ex.question,
      translation: ex.prompt ?? undefined,
    }));
  }

  const heroLine = dialogue.find((line) => HAS_JAPANESE.test(line.japanese));
  const title = cleanLessonTitle(lesson.title);
  const levelLabel = LEVEL_LABEL[lesson.level] ?? lesson.level;

  return (
    <div className="nq-workspace">
      <JapanBackdrop />
      <AppNav />

      <div className="mx-auto w-full max-w-[1240px] space-y-6">
        {/* ───────── Hero ───────── */}
        <section data-intro className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div className="min-w-0">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Link href="/app" aria-label="Trang chủ" className="hover:text-slate-900 dark:hover:text-white">
                <IconHome width={18} height={18} />
              </Link>
              <span aria-hidden>›</span>
              <Link href="/app/practice" className="hover:text-slate-900 dark:hover:text-white">
                Bài Học
              </Link>
              <span aria-hidden>›</span>
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                Unit {unitLabel}: {title}
              </span>
            </nav>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-bold text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                JLPT {lesson.level}
              </span>
              <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-bold text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                Unit {unitLabel}
              </span>
            </div>

            <h1 className="mt-3 font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white">
              <span className="text-4xl sm:text-5xl">Unit {unitLabel}:</span>{" "}
              <span className="text-3xl sm:text-4xl">{title}</span>
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300">{lesson.description}</p>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center gap-2"><IconBook width={18} height={18} /> 4 phần học</span>
              <span className="inline-flex items-center gap-2"><IconClock width={18} height={18} /> ~15 phút</span>
              <span className="inline-flex items-center gap-2"><IconChart width={18} height={18} /> {levelLabel}</span>
            </div>
          </div>

          <div className="relative min-h-[200px] overflow-hidden rounded-3xl shadow-lg">
            <JapanScenicPanel variant={scenicVariant(lesson.title)} showLabel={false} />
            {heroLine && (
              <div className="absolute left-4 top-4 max-w-[58%] rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur dark:bg-sumi-900/90 sm:left-6 sm:top-6">
                <p className="jp-text text-lg font-black leading-snug text-slate-900 dark:text-white sm:text-2xl">{heroLine.japanese}</p>
                {heroLine.romaji && <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{heroLine.romaji}</p>}
              </div>
            )}
          </div>
        </section>

        {/* ───────── Thanh 4 bước ───────── */}
        <LessonStepsBar />

        {/* ───────── Nội dung + Quiz ───────── */}
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(340px,1fr)]">
          <div className="min-w-0 space-y-6">
            <VocabSection words={vocab} />
            <GrammarSection items={grammar} />
            <DialogueSection lines={dialogue} />
          </div>

          <SectionShell
            id="quick-practice"
            icon={<IconTarget />}
            title="4. Luyện tập nhanh"
            subtitle="Làm bài quiz để củng cố kiến thức đã học."
            action={
              <span className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-black text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
                🔥 +{lesson.xpReward} XP
              </span>
            }
            className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto"
          >
            <QuizRunner
              key={lesson.id}
              lesson={JSON.parse(JSON.stringify(lesson))}
              nextLesson={nextLesson ? JSON.parse(JSON.stringify(nextLesson)) : null}
            />
          </SectionShell>
        </div>
      </div>
    </div>
  );
}
