"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useSoundAndTheme } from "@/components/SoundAndThemeContext";
import {
  IconBook,
  IconChat,
  IconChevronDown,
  IconCube,
  IconPlay,
  IconPlus,
  IconSpeaker,
} from "./LessonIcons";

// ─────────────────────────── Types (dữ liệu đã serialize từ page.tsx) ───────────────────────────
export interface VocabView {
  id: string;
  word: string;
  kana: string;
  romaji: string;
  meaning: string;
  kanji?: string;
  imageUrl?: string;
}

export interface GrammarExampleView {
  japanese: string;
  translation?: string;
}

export interface GrammarView {
  id: string;
  title: string;
  romaji?: string;
  meaning: string;
  usage?: string;
  structure: string;
  examples: GrammarExampleView[];
}

export interface DialogueLineView {
  id: string;
  side: "a" | "b";
  japanese: string;
  romaji?: string;
  translation?: string;
}

const HAS_JAPANESE = /[ぁ-んァ-ン一-龯]/;

// ─────────────────────────── Shared pieces ───────────────────────────
export function SectionShell({
  id,
  icon,
  title,
  subtitle,
  action,
  children,
  className = "",
}: {
  id?: string;
  icon: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      data-reveal
      className={`scroll-mt-24 rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-sumi-900/80 sm:p-6 ${className}`}
    >
      <header className="mb-4 flex flex-wrap items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white sm:text-xl">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">{subtitle}</p>}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

export function SpeakButton({
  onClick,
  label = "Nghe phát âm",
  size = "md",
}: {
  onClick: () => void;
  label?: string;
  size?: "sm" | "md";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`grid shrink-0 place-items-center rounded-full bg-rose-50 text-red-600 transition-colors hover:bg-rose-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950/70 ${
        size === "sm" ? "h-8 w-8" : "h-10 w-10"
      }`}
    >
      <IconSpeaker width={size === "sm" ? 15 : 18} height={size === "sm" ? 15 : 18} />
    </button>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-md bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-red-700 dark:bg-red-950/50 dark:text-red-300">
      {children}
    </span>
  );
}

// ─────────────────────────── Thanh 4 bước + tiến độ ───────────────────────────
const STEPS = [
  { id: "lesson-vocab", label: "Từ vựng" },
  { id: "lesson-grammar", label: "Ngữ pháp" },
  { id: "lesson-dialogue", label: "Hội thoại" },
  { id: "quick-practice", label: "Luyện tập" },
];

export function LessonStepsBar() {
  const [active, setActive] = useState(0);
  const quizStarted = useRef(false);

  useEffect(() => {
    const update = () => {
      const line = window.innerHeight * 0.4;
      const isWide = window.matchMedia("(min-width: 1024px)").matches;
      let idx = 0;
      STEPS.forEach((step, i) => {
        // Trên desktop quiz nằm cạnh nội dung nên không tính theo vị trí cuộn
        if (i === 3 && isWide) return;
        const el = document.getElementById(step.id);
        if (el && el.getBoundingClientRect().top <= line) idx = i;
      });
      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80;
      if (quizStarted.current || nearBottom) idx = 3;
      setActive(idx);
    };

    const onQuiz = () => {
      quizStarted.current = true;
      update();
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("nq:quiz-progress", onQuiz);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("nq:quiz-progress", onQuiz);
    };
  }, []);

  const percent = ((active + 1) / STEPS.length) * 100;

  return (
    <nav
      aria-label="Các phần của bài học"
      data-reveal
      className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-sumi-900/80 lg:flex-row lg:items-center lg:gap-8 lg:px-6"
    >
      <ol className="flex flex-1 items-center gap-2 sm:gap-3">
        {STEPS.map((step, i) => {
          const isActive = i === active;
          const isPast = i < active;
          return (
            <li key={step.id} className="flex flex-1 items-center gap-2 last:flex-none sm:gap-3">
              <a
                href={`#${step.id}`}
                aria-current={isActive ? "step" : undefined}
                className="flex items-center gap-2 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500"
              >
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-black transition-colors ${
                    isActive
                      ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                      : isPast
                      ? "bg-rose-100 text-red-700 dark:bg-red-950/60 dark:text-red-300"
                      : "bg-slate-100 text-slate-500 dark:bg-sumi-800 dark:text-slate-400"
                  }`}
                >
                  {i + 1}
                </span>
                <span
                  className={`text-sm font-bold ${isActive ? "inline text-red-700 dark:text-red-300" : "hidden text-slate-500 dark:text-slate-400 sm:inline"}`}
                >
                  {step.label}
                </span>
              </a>
              {i < STEPS.length - 1 && <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" aria-hidden />}
            </li>
          );
        })}
      </ol>

      <div className="lg:w-72">
        <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Tiến độ bài học</span>
          <span className="font-black text-slate-800 dark:text-slate-100">
            {active + 1} / {STEPS.length} phần
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-rose-100 dark:bg-sumi-800">
          <div className="h-full rounded-full bg-red-600 transition-all duration-300" style={{ width: `${percent}%` }} />
        </div>
      </div>
    </nav>
  );
}

// ─────────────────────────── 1. Từ vựng ───────────────────────────
const VOCAB_LIMIT = 6;

function VocabArt({ word }: { word: VocabView }) {
  if (word.imageUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={word.imageUrl} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" loading="lazy" />;
  }
  return (
    <div className="jp-text grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-rose-50 to-amber-50 text-2xl font-black text-red-700/80 dark:from-sumi-800 dark:to-sumi-900 dark:text-red-300/80">
      {word.kanji || word.word.slice(0, 1)}
    </div>
  );
}

export function VocabSection({ words }: { words: VocabView[] }) {
  const { speak, speakAll } = useSoundAndTheme();
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? words : words.slice(0, VOCAB_LIMIT);
  const remaining = words.length - VOCAB_LIMIT;

  return (
    <SectionShell
      id="lesson-vocab"
      icon={<IconCube />}
      title="1. Từ vựng chủ đề"
      subtitle="Nghe, lặp lại và ghi nhớ các từ thường gặp trong bài."
      action={
        words.length > 0 ? (
          <button
            type="button"
            onClick={() => speakAll(words.map((w) => w.kana || w.word))}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-rose-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/70"
          >
            <IconPlay width={14} height={14} />
            Nghe tất cả
          </button>
        ) : null
      }
    >
      {words.length === 0 ? (
        <p className="rounded-2xl bg-slate-50 p-5 text-center text-sm text-slate-500 dark:bg-sumi-800/60 dark:text-slate-400">
          Bài học này chưa có từ vựng riêng.
        </p>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((w) => (
              <article
                key={w.id}
                className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 dark:border-slate-800 dark:bg-sumi-900"
              >
                <VocabArt word={w} />
                <div className="min-w-0 flex-1">
                  <b className="jp-text block truncate text-[15px] font-black text-slate-900 dark:text-white">{w.word}</b>
                  {w.kana && w.kana !== w.word && (
                    <span className="jp-text block truncate text-xs text-slate-400">{w.kana}</span>
                  )}
                  <span className="block truncate text-xs text-slate-600 dark:text-slate-300" title={w.romaji}>
                    {w.meaning}
                  </span>
                </div>
                <SpeakButton onClick={() => speak(w.kana || w.word)} label={`Nghe từ ${w.word}`} />
              </article>
            ))}
          </div>

          {remaining > 0 && (
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded((v) => !v)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/70 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-rose-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-950/50"
            >
              {expanded ? (
                <>Thu gọn</>
              ) : (
                <>
                  <IconPlus width={16} height={16} />
                  Xem thêm từ vựng ({remaining} từ)
                </>
              )}
              <IconChevronDown width={16} height={16} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
          )}
        </>
      )}
    </SectionShell>
  );
}

// ─────────────────────────── 2. Ngữ pháp ───────────────────────────
export function GrammarSection({ items }: { items: GrammarView[] }) {
  const { speak } = useSoundAndTheme();

  return (
    <SectionShell
      id="lesson-grammar"
      icon={<IconBook />}
      title="2. Ngữ pháp trọng tâm"
      subtitle="Các mẫu câu cần dùng đúng trong tình huống của bài học."
    >
      {items.length === 0 ? (
        <p className="rounded-2xl bg-slate-50 p-5 text-center text-sm text-slate-500 dark:bg-sumi-800/60 dark:text-slate-400">
          Bài học này chưa có mẫu ngữ pháp riêng.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((g) => (
            <article
              key={g.id}
              className="grid gap-4 rounded-2xl bg-rose-50/60 p-4 dark:bg-sumi-800/50 sm:p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]"
            >
              <div className="min-w-0">
                <Chip>Mẫu câu cơ bản</Chip>
                <div className="mt-2 flex items-start gap-3">
                  <h3 className="jp-text text-2xl font-black leading-tight text-red-700 dark:text-red-400">{g.title}</h3>
                  <SpeakButton onClick={() => speak(g.title)} label="Nghe mẫu câu" size="sm" />
                </div>
                {g.romaji && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{g.romaji}</p>}
                <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">
                  <b>Ý nghĩa:</b> {g.meaning}
                </p>
                {g.usage && (
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                    <b>Cách dùng:</b> {g.usage}
                  </p>
                )}
              </div>

              <div className="min-w-0 rounded-xl bg-white/80 p-4 dark:bg-sumi-900/60">
                <Chip>Công thức</Chip>
                <p className="jp-text mt-2 text-sm font-bold text-slate-800 dark:text-slate-100">{g.structure}</p>
                {g.examples.length > 0 && (
                  <div className="mt-3 text-xs">
                    <p className="font-semibold text-slate-500 dark:text-slate-400">Ví dụ:</p>
                    <ul className="mt-1.5 space-y-1.5">
                      {g.examples.map((ex, i) => (
                        <li key={i} className="flex gap-2 text-slate-700 dark:text-slate-200">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red-500" aria-hidden />
                          <span>
                            <span className="jp-text text-sm font-semibold">{ex.japanese}</span>
                            {ex.translation && (
                              <span className="block text-slate-500 dark:text-slate-400">({ex.translation})</span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </SectionShell>
  );
}

// ─────────────────────────── 3. Hội thoại ───────────────────────────
export function DialogueSection({ lines }: { lines: DialogueLineView[] }) {
  const { speak } = useSoundAndTheme();

  return (
    <SectionShell
      id="lesson-dialogue"
      icon={<IconChat />}
      title="3. Hội thoại mẫu"
      subtitle="Xem và nghe cách kiến thức xuất hiện trong tình huống thực tế."
    >
      {lines.length === 0 ? (
        <p className="rounded-2xl bg-slate-50 p-5 text-center text-sm text-slate-500 dark:bg-sumi-800/60 dark:text-slate-400">
          Bài học này chưa có hội thoại mẫu.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {lines.map((line) => (
            <article
              key={line.id}
              className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 dark:border-slate-800 dark:bg-sumi-900"
            >
              <span
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-2xl ${
                  line.side === "a" ? "bg-amber-100 dark:bg-amber-950/50" : "bg-rose-100 dark:bg-red-950/50"
                }`}
                aria-hidden
              >
                {line.side === "a" ? "🙋‍♂️" : "🙋‍♀️"}
              </span>
              {HAS_JAPANESE.test(line.japanese) && (
                <SpeakButton onClick={() => speak(line.japanese)} label="Nghe câu hội thoại" size="sm" />
              )}
              <div className="min-w-0 flex-1">
                <b className="jp-text block text-[15px] font-black leading-snug text-slate-900 dark:text-white">{line.japanese}</b>
                {line.romaji && <small className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{line.romaji}</small>}
                {line.translation && (
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{line.translation}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </SectionShell>
  );
}
