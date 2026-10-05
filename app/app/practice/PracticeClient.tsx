"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSoundAndTheme } from "@/components/SoundAndThemeContext";
import { KanaBattleCard } from "@/components/KanaBattleCard";

export function cleanLessonTitle(title: string): string {
  if (!title) return "";
  return title.replace(/^(Minna\s+)?Bài\s*\d+(\s*\([^\)]+\))?:\s*/i, "").trim();
}

export interface UnitInfo {
  number: number;
  title: string;
  description: string;
  icon: string;
  startIndex: number;
  endIndex: number;
}

export interface PracticeLessonItem {
  id: string;
  order: number;
  slug: string;
  title: string;
  description: string;
  xpReward: number;
  level: string;
  exercisesCount: number;
  progressStatus?: "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED";
  score?: number | null;
}

type MainTab = "LESSONS" | "BATTLE";
type SortKey = "ORDER" | "SCORE" | "XP";

const LEVEL_TONE: Record<string, string> = {
  N5: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60",
  N4: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900/60",
  N3: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60",
};

export function PracticeClient({
  lessons,
  units,
  userLevel,
}: {
  lessons: PracticeLessonItem[];
  units: UnitInfo[];
  userLevel: string;
}) {
  const [mainTab, setMainTab] = useState<MainTab>("LESSONS");
  const [selectedUnit, setSelectedUnit] = useState<number | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "COMPLETED" | "UNFINISHED">("ALL");
  const [sort, setSort] = useState<SortKey>("ORDER");
  const [query, setQuery] = useState("");
  const { playClick } = useSoundAndTheme();

  const currentUnit = useMemo(
    () => (selectedUnit === "ALL" ? null : units.find((u) => u.number === selectedUnit) ?? null),
    [selectedUnit, units]
  );

  const displayedLessons = useMemo(() => {
    let result = lessons;
    if (currentUnit) result = lessons.slice(currentUnit.startIndex, currentUnit.endIndex);

    if (statusFilter === "COMPLETED") result = result.filter((l) => l.progressStatus === "COMPLETED");
    else if (statusFilter === "UNFINISHED") result = result.filter((l) => l.progressStatus !== "COMPLETED");

    const q = query.trim().toLowerCase();
    if (q) result = result.filter((l) => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q));

    const sorted = [...result];
    if (sort === "SCORE") sorted.sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
    if (sort === "XP") sorted.sort((a, b) => b.xpReward - a.xpReward);
    return sorted;
  }, [lessons, currentUnit, statusFilter, query, sort]);

  const pill = (active: boolean) =>
    `flex min-h-12 shrink-0 items-center gap-2.5 rounded-2xl border px-3 py-2 text-[13px] font-bold transition active:scale-[0.98] ${
      active
        ? "border-red-600 bg-red-600 text-white shadow-md shadow-red-600/25"
        : "border-slate-200 bg-white text-slate-700 hover:border-red-200 hover:bg-rose-50 dark:border-slate-800 dark:bg-sumi-900 dark:text-slate-300 dark:hover:bg-sumi-800"
    }`;

  return (
    <div className="space-y-6">
      {/* ── Main tab ── */}
      <div className="flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm dark:border-slate-800 dark:bg-sumi-900 sm:w-fit">
        <button
          type="button"
          id="practice-tab-lessons"
          onClick={() => { playClick(); setMainTab("LESSONS"); }}
          aria-pressed={mainTab === "LESSONS"}
          className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-black transition active:scale-[0.98] sm:flex-none ${
            mainTab === "LESSONS" ? "bg-red-600 text-white shadow-md shadow-red-600/25" : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-sumi-800"
          }`}
        >
          📚 Bài Học
        </button>
        <button
          type="button"
          id="practice-tab-battle"
          onClick={() => { playClick(); setMainTab("BATTLE"); }}
          aria-pressed={mainTab === "BATTLE"}
          className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-black transition active:scale-[0.98] sm:flex-none ${
            mainTab === "BATTLE" ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25" : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-sumi-800"
          }`}
        >
          🃏 Kana Battle
          <span className="rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-black text-slate-900">NEW</span>
        </button>
      </div>

      {mainTab === "BATTLE" && (
        <div className="overflow-hidden rounded-3xl border border-violet-700/20 bg-gradient-to-br from-violet-950/80 via-indigo-950/60 to-slate-900/80 p-4 shadow-xl">
          <KanaBattleCard />
        </div>
      )}

      {mainTab === "LESSONS" && (
        <>
          {/* ── Unit tabs (giống thanh danh mục ở ảnh mẫu) ── */}
          <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-2 shadow-sm dark:border-slate-800 dark:bg-sumi-900/80">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              <button type="button" onClick={() => { playClick(); setSelectedUnit("ALL"); }} className={pill(selectedUnit === "ALL")}>
                <span className={`flex h-8 w-8 items-center justify-center rounded-xl text-base ${selectedUnit === "ALL" ? "bg-white/20" : "bg-slate-100 dark:bg-sumi-800"}`}>▦</span>
                Tất cả <span className="text-[11px] opacity-70">({lessons.length} bài)</span>
              </button>
              {units.map((u) => {
                const list = lessons.slice(u.startIndex, u.endIndex);
                const done = list.filter((l) => l.progressStatus === "COMPLETED").length;
                const active = selectedUnit === u.number;
                return (
                  <button key={u.number} type="button" onClick={() => { playClick(); setSelectedUnit(u.number); }} className={pill(active)}>
                    <span className={`flex h-8 w-8 items-center justify-center rounded-xl text-base ${active ? "bg-white/20" : "bg-slate-100 dark:bg-sumi-800"}`}>{u.icon}</span>
                    Unit 0{u.number}
                    <span className={`text-[11px] ${active ? "text-rose-100" : "text-slate-400"}`}>
                      {list.length > 0 && done === list.length ? "✓" : `(${done}/${list.length})`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Tiêu đề danh sách + tìm kiếm + sắp xếp ── */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-2xl text-white shadow-md shadow-red-600/25">
                {currentUnit ? currentUnit.icon : "📖"}
              </span>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {currentUnit ? currentUnit.title : "Danh sách khóa học"}
                </h3>
                <p className="mt-0.5 max-w-2xl text-xs text-slate-500 dark:text-slate-400">
                  {currentUnit ? currentUnit.description : `Khám phá ${lessons.length} bài học JLPT ${userLevel} được sắp xếp theo trình độ, dễ học, dễ nhớ`}
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto">
              <div className="flex min-h-11 flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-sumi-800 sm:w-64 sm:flex-none">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm kiếm bài học..."
                  aria-label="Tìm bài học"
                  className="min-w-0 flex-1 bg-transparent px-3 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-slate-200 sm:text-sm"
                />
                <span className="flex w-11 items-center justify-center bg-slate-900 text-sm text-white dark:bg-white dark:text-sumi-950" aria-hidden>🔍</span>
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                aria-label="Sắp xếp"
                className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-base text-slate-700 dark:border-slate-700 dark:bg-sumi-800 dark:text-slate-200 sm:text-sm"
              >
                <option value="ORDER">Sắp xếp: Theo lộ trình</option>
                <option value="SCORE">Điểm cao nhất</option>
                <option value="XP">Nhiều XP nhất</option>
              </select>
              <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-sumi-800">
                {([["ALL", "Tất cả"], ["UNFINISHED", "Chưa xong"], ["COMPLETED", "Đã xong"]] as const).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setStatusFilter(key)}
                    aria-pressed={statusFilter === key}
                    className={`min-h-9 flex-1 rounded-lg px-3 text-xs font-bold transition sm:flex-none ${
                      statusFilter === key ? "bg-red-600 text-white" : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Lưới thẻ bài học ── */}
          {displayedLessons.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-sumi-900">
              <span className="text-3xl">🔍</span>
              <p className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-300">Không tìm thấy bài học phù hợp</p>
              <p className="mt-1 text-xs text-slate-400">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayedLessons.map((l) => {
                const done = l.progressStatus === "COMPLETED";
                const doing = l.progressStatus === "IN_PROGRESS";
                const unit = units.find((u) => l.order >= u.startIndex && l.order < u.endIndex) ?? units[0];
                const pct = done ? 100 : l.score ?? 0;

                return (
                  <article
                    key={l.id}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-sumi-900"
                  >
                    <div className="pointer-events-none absolute -right-3 -top-3 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-transparent text-5xl opacity-80 dark:from-red-950/40" aria-hidden>
                      {unit.icon}
                    </div>

                    <span className={`relative w-fit rounded-lg border px-2.5 py-1 text-xs font-black ${LEVEL_TONE[l.level] ?? LEVEL_TONE.N5}`}>
                      {l.level}
                    </span>

                    <h4 className="relative mt-3 text-[15px] font-black leading-snug text-slate-900 dark:text-white">
                      {cleanLessonTitle(l.title)}
                    </h4>
                    <p className="relative mt-1 line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {l.description}
                    </p>

                    <div className="relative mt-3 flex items-center gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      <span>📝 {l.exercisesCount} câu</span>
                      <span className="text-red-500">◔ {pct}%</span>
                      <span className="ml-auto rounded-md bg-amber-50 px-2 py-0.5 font-bold text-amber-600 dark:bg-amber-950/40 dark:text-amber-300">+{l.xpReward} XP</span>
                    </div>

                    <Link
                      href={`/app/practice/${l.slug}`}
                      className={`relative mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border text-[13px] font-black transition active:scale-[0.98] ${
                        doing
                          ? "border-red-600 bg-red-600 text-white shadow-md shadow-red-600/25 hover:bg-red-700"
                          : "border-red-500 bg-white text-red-600 hover:bg-red-50 dark:bg-transparent dark:hover:bg-red-950/30"
                      }`}
                    >
                      <span aria-hidden>▶</span>
                      {done ? "Luyện tập lại" : doing ? "Tiếp tục học" : "Bắt đầu học"}
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}