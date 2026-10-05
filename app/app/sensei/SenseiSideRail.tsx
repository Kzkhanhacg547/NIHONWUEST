"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  BannerScene,
  BookIcon,
  CalendarIcon,
  ChevronRight,
  ClockIcon,
  DocIcon,
  PlayIcon,
} from "./SenseiDecor";
import { Icon } from "@/components/ui";


export const SENSEI_ROUTES = {
  lessons: "/lessons",
  vocabulary: "/vocabulary",
  grammar: "/grammar",
  listening: "/listening",
};

export interface RecentLesson {
  id: string;
  title: string;
  /** Ví dụ: "12 phút · 3 ngày trước" */
  meta: string;
  href?: string;
}

interface Props {
  /** Mẫu ngữ pháp trọng tâm của chủ đề đang chọn (lấy từ scenario.keyGrammar). */
  grammarPatterns: string[];
  onOpenGrammar: () => void;
  recentLessons?: RecentLesson[];
}

const card =
  "rounded-3xl border border-white/80 bg-white/85 p-4 shadow-[0_10px_30px_-12px_rgba(244,63,94,0.18)] backdrop-blur dark:border-slate-800 dark:bg-sumi-900/85";

const rowBase =
  "group flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white/90 p-2.5 text-left transition hover:border-rose-200 hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 dark:border-slate-800 dark:bg-sumi-800";

function TodayRow({
  tone,
  icon,
  title,
  sub,
  href,
  onClick,
}: {
  tone: string;
  icon: ReactNode;
  title: string;
  sub: string;
  href?: string;
  onClick?: () => void;
}) {
  const inner = (
    <>
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-white ${tone}`}>{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-extrabold text-slate-800 dark:text-white">{title}</span>
        <span lang="ja" className="block truncate font-jp text-[11px] text-slate-500 dark:text-slate-400">
          {sub}
        </span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-rose-500" />
    </>
  );
  return href ? (
    <Link href={href} className={rowBase}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={rowBase}>
      {inner}
    </button>
  );
}

export function SenseiSideRail({ grammarPatterns, onOpenGrammar, recentLessons = [] }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
      {/* Hôm nay học gì? */}
      <section aria-labelledby="today-heading" className={card}>
        <div className="mb-3 flex items-center justify-between">
          <h2 id="today-heading" className="flex items-center gap-2 text-[15px] font-extrabold text-slate-900 dark:text-white">
            <CalendarIcon className="h-5 w-5 text-rose-500" />
            Hôm nay học gì?
          </h2>
          <Link href={SENSEI_ROUTES.lessons} className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:underline dark:text-rose-400">
            Xem tất cả <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-2">
          <TodayRow
            tone="bg-rose-300"
            icon={<BookIcon className="h-5 w-5" />}
            title="Từ vựng hôm nay"
            sub="Ôn từ mới theo chủ đề"
            href={SENSEI_ROUTES.vocabulary}
          />
          <TodayRow
            tone="bg-violet-400"
            icon={<DocIcon className="h-5 w-5" />}
            title="Ngữ pháp hôm nay"
            sub={grammarPatterns.slice(0, 2).join("・") || "Mẫu câu N3 trọng tâm"}
            onClick={onOpenGrammar}
          />
          <TodayRow
            tone="bg-emerald-500"
            icon={<Icon name="speaker" className="h-5 w-5" />}
            title="Luyện nghe"
            sub="Hội thoại thực tế"
            href={SENSEI_ROUTES.listening}
          />
        </div>
      </section>

      {/* Banner động lực */}
      <section
        aria-label="Lời nhắn động lực"
        className="relative min-h-[150px] overflow-hidden rounded-3xl border border-white/10 bg-[#1b2243] text-white shadow-[0_10px_30px_-12px_rgba(27,34,67,0.6)]"
      >
        <BannerScene />
        <div className="relative flex h-full flex-col justify-center p-5">
          <p lang="ja" className="font-jp text-xl font-medium leading-snug tracking-wide">
            コツコツが、
            <br />
            夢をつくる。
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-200">
            Từng bước nhỏ,
            <br />
            tạo nên ước mơ lớn.
          </p>
          <span aria-hidden="true" className="mt-3 h-0.5 w-12 rounded-full bg-rose-400" />
        </div>
      </section>

      {/* Bài học gần đây */}
      <section aria-labelledby="recent-heading" className={card}>
        <div className="mb-3 flex items-center justify-between">
          <h2 id="recent-heading" className="flex items-center gap-2 text-[15px] font-extrabold text-slate-900 dark:text-white">
            <ClockIcon className="h-5 w-5 text-rose-500" />
            Bài học gần đây
          </h2>
          <Link href={SENSEI_ROUTES.lessons} className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:underline dark:text-rose-400">
            Xem tất cả <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {recentLessons.length === 0 ? (
          <p className="rounded-2xl bg-slate-50 px-3 py-4 text-center text-xs leading-relaxed text-slate-500 dark:bg-sumi-800 dark:text-slate-400">
            Chưa có bài học nào gần đây. Hoàn thành một bài để thấy nó ở đây.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentLessons.map((l) => {
              const body = (
                <>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-rose-50 text-rose-500 dark:bg-rose-950/40">
                    <PlayIcon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-bold text-slate-800 dark:text-slate-100">{l.title}</span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400">{l.meta}</span>
                  </span>
                </>
              );
              return (
                <li key={l.id}>
                  {l.href ? (
                    <Link href={l.href} className="flex items-center gap-3 py-2.5 hover:opacity-80">
                      {body}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 py-2.5">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
