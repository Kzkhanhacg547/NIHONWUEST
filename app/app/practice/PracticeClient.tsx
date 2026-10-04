"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, Button, Badge } from "@/components/ui";
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
  const [selectedUnit, setSelectedUnit] = useState<number | "ALL">(1);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "COMPLETED" | "UNFINISHED">("ALL");
  const [query, setQuery] = useState("");
  const { playClick } = useSoundAndTheme();

  const currentUnitInfo = useMemo(() => {
    if (selectedUnit === "ALL") return null;
    return units.find((u) => u.number === selectedUnit) || units[0];
  }, [selectedUnit, units]);

  const displayedLessons = useMemo(() => {
    let result = lessons;

    // Filter by unit
    if (selectedUnit !== "ALL") {
      const u = units.find((item) => item.number === selectedUnit);
      if (u) {
        result = lessons.slice(u.startIndex, u.endIndex);
      }
    }

    // Filter by status
    if (statusFilter === "COMPLETED") {
      result = result.filter((l) => l.progressStatus === "COMPLETED");
    } else if (statusFilter === "UNFINISHED") {
      result = result.filter((l) => l.progressStatus !== "COMPLETED");
    }

    // Filter by search query
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (l) => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [lessons, units, selectedUnit, statusFilter, query]);

  return (
    <div className="space-y-6">
      {/* ── Main Tab Switcher ── */}
      <div className="flex items-center gap-2 bg-white dark:bg-sumi-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-full sm:w-fit">
        <button
          type="button"
          id="practice-tab-lessons"
          onClick={() => { playClick(); setMainTab("LESSONS"); }}
          aria-pressed={mainTab === "LESSONS"}
          className={`flex min-h-11 flex-1 sm:flex-none items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black transition-all active:scale-[0.98] ${
            mainTab === "LESSONS"
              ? "bg-sakura-500 text-white shadow-md shadow-sakura-500/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-sumi-800"
          }`}
        >
          📚 Bài Học
        </button>
        <button
          type="button"
          id="practice-tab-battle"
          onClick={() => { playClick(); setMainTab("BATTLE"); }}
          aria-pressed={mainTab === "BATTLE"}
          className={`flex min-h-11 flex-1 sm:flex-none items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black transition-all active:scale-[0.98] ${
            mainTab === "BATTLE"
              ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-sumi-800"
          }`}
        >
          🃏 Kana Battle
          <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded-full">NEW</span>
        </button>
      </div>

      {/* ── Kana Battle Game ── */}
      {mainTab === "BATTLE" && (
        <div className="rounded-3xl bg-gradient-to-br from-violet-950/80 via-indigo-950/60 to-slate-900/80 border border-violet-700/20 shadow-xl overflow-hidden p-4">
          <KanaBattleCard />
        </div>
      )}

      {/* ── Lessons browser (hidden when on BATTLE tab) ── */}
      {mainTab === "LESSONS" && (
        <>
          {/* Unit Selector Bar (Tabs / Pills) */}
          <div className="bg-white dark:bg-sumi-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => {
              playClick();
              setSelectedUnit("ALL");
            }}
            className={`px-3.5 py-2.5 rounded-xl text-[13px] font-bold shrink-0 transition-all active:scale-[0.98] ${
              selectedUnit === "ALL"
                ? "bg-sakura-500 text-white shadow-md shadow-sakura-500/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-sumi-800"
            }`}
          >
            📚 Tất cả ({lessons.length} bài)
          </button>

          {units.map((u) => {
            const unitLessons = lessons.slice(u.startIndex, u.endIndex);
            const completedCount = unitLessons.filter((l) => l.progressStatus === "COMPLETED").length;
            const isAllDone = completedCount === unitLessons.length && unitLessons.length > 0;
            const active = selectedUnit === u.number;

            return (
              <button
                key={u.number}
                type="button"
                onClick={() => {
                  playClick();
                  setSelectedUnit(u.number);
                }}
                className={`flex min-h-11 items-center gap-2 px-3.5 py-2.5 rounded-xl text-[13px] font-bold shrink-0 transition-all active:scale-[0.98] ${
                  active
                    ? "bg-sakura-500 text-white shadow-md shadow-sakura-500/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-sumi-800 border border-transparent"
                }`}
              >
                <span>{u.icon}</span>
                <span>Unit 0{u.number}</span>
                {isAllDone ? (
                  <span className={`text-[10px] ${active ? "text-white" : "text-emerald-500"}`}>✓</span>
                ) : (
                  <span className={`text-[10px] ${active ? "text-rose-100" : "text-slate-400"}`}>
                    {completedCount}/{unitLessons.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Unit Header Banner & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-100/70 dark:bg-sumi-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-3xl p-2 rounded-2xl bg-white dark:bg-sumi-800 shadow-sm shrink-0">
            {currentUnitInfo ? currentUnitInfo.icon : "📖"}
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {currentUnitInfo ? currentUnitInfo.title : `Tất cả bài học ${userLevel}`}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {currentUnitInfo
                ? currentUnitInfo.description
                : `Danh sách toàn bộ ${lessons.length} bài học theo lộ trình chuẩn JLPT ${userLevel}`}
            </p>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 w-full sm:w-auto sm:shrink-0">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm bài học..."
            aria-label="Tìm bài học"
            className="min-h-11 px-3 py-2.5 rounded-xl text-base sm:text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-sumi-800 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-sakura-500 w-full sm:w-44"
          />

          <div className="flex items-center gap-1 bg-white dark:bg-sumi-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setStatusFilter("ALL")}
              aria-pressed={statusFilter === "ALL"}
              className={`flex-1 sm:flex-none min-h-11 px-3 py-2 rounded-lg text-xs font-bold transition active:scale-[0.97] ${
                statusFilter === "ALL"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-sumi-950"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("UNFINISHED")}
              aria-pressed={statusFilter === "UNFINISHED"}
              className={`flex-1 sm:flex-none min-h-11 px-3 py-2 rounded-lg text-xs font-bold transition active:scale-[0.97] ${
                statusFilter === "UNFINISHED"
                  ? "bg-sakura-500 text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              Chưa xong
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("COMPLETED")}
              aria-pressed={statusFilter === "COMPLETED"}
              className={`flex-1 sm:flex-none min-h-11 px-3 py-2 rounded-lg text-xs font-bold transition active:scale-[0.97] ${
                statusFilter === "COMPLETED"
                  ? "bg-emerald-500 text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              Đã xong
            </button>
          </div>
        </div>
      </div>

      {/* Lesson Cards Grid */}
      {displayedLessons.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-sumi-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <span className="text-3xl">🔍</span>
          <p className="font-bold text-sm text-slate-700 dark:text-slate-300 mt-2">
            Không tìm thấy bài học phù hợp
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Thử thay đổi bộ lọc trạng thái hoặc từ khóa tìm kiếm
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayedLessons.map((l) => {
            const isCompleted = l.progressStatus === "COMPLETED";
            const isInProgress = l.progressStatus === "IN_PROGRESS";

            return (
              <Card
                key={l.id}
                hover
                className={`flex flex-col justify-between overflow-hidden border-2 transition-all p-5 ${
                  isCompleted
                    ? "border-emerald-200 dark:border-emerald-800/60 bg-gradient-to-br from-white to-emerald-50/20 dark:from-sumi-900 dark:to-emerald-950/20"
                    : isInProgress
                    ? "border-amber-200 dark:border-amber-800/60 bg-gradient-to-br from-white to-amber-50/20 dark:from-sumi-900 dark:to-amber-950/20"
                    : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-sumi-900"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-slate-100 dark:bg-sumi-800 text-xs font-black text-slate-600 dark:text-slate-300">
                      #{l.order + 1}
                    </span>
                    {isCompleted ? (
                      <Badge variant="matcha">✓ Đã học</Badge>
                    ) : isInProgress ? (
                      <Badge variant="amber">⏳ Đang học</Badge>
                    ) : (
                      <Badge variant="slate">Mới</Badge>
                    )}
                  </div>

                  <h4 className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                    {cleanLessonTitle(l.title)}
                  </h4>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {l.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs font-bold text-slate-500">
                    <span className="flex items-center gap-1">
                      📝 {l.exercisesCount} câu hỏi
                    </span>
                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                      ✨ +{l.xpReward} XP
                    </span>
                    {l.score !== undefined && l.score !== null && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-black">
                        {l.score}% điểm
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Link href={`/app/practice/${l.slug}`} className="block">
                    <Button
                      variant={isCompleted ? "secondary" : "sakura"}
                      size="sm"
                      className="w-full justify-center font-bold text-xs"
                    >
                      {isCompleted ? "🔄 Luyện tập lại" : "🚀 Bắt đầu bài học"}
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  )}
</div>
  );
}
