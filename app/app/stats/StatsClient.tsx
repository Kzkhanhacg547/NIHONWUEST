"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useSoundAndTheme } from "@/components/SoundAndThemeContext";
import type { DailyXpPoint, HeatmapDay, ReviewMetrics, PersonalRecords } from "@/lib/stats";

export interface RecentActivityItem {
  id: string;
  type: "LESSON" | "KANA" | "VOCAB" | "REVIEW" | "ACHIEVEMENT" | "JOURNEY" | "SURVIVAL" | "OTHER";
  title: string;
  description?: string;
  xpAwarded: number;
  dateStr: string;
  relativeTime: string;
}

export interface LearningBreakdownData {
  kana: {
    mastered: number;
    total: number;
    percent: number;
  };
  vocabulary: {
    learned: number;
    total: number;
    percent: number;
  };
  grammar: {
    learned: number;
    total: number;
    percent: number;
  };
  lessons: {
    completed: number;
    total: number;
    percent: number;
  };
}

export interface StatsClientProps {
  user: {
    displayName: string;
    level: number;
    currentLevelXP: number;
    nextLevelXP: number;
    levelProgressPercent: number;
    totalXP: number;
    currentStreak: number;
    longestStreak: number;
    learningLevel: string;
  };
  studyTimeFormatted: string;
  achievementsCount: {
    unlocked: number;
    total: number;
  };
  xp7Days: DailyXpPoint[];
  xp30Days: DailyXpPoint[];
  xp90Days: DailyXpPoint[];
  heatmapWeeks: HeatmapDay[][];
  breakdown: LearningBreakdownData;
  reviewMetrics: ReviewMetrics;
  personalRecords: PersonalRecords;
  recentActivities: RecentActivityItem[];
}

const MONTH_NAMES = [
  "Th1", "Th2", "Th3", "Th4", "Th5", "Th6",
  "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"
];

const WEEKDAY_SHORT = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export function StatsClient({
  user,
  studyTimeFormatted,
  achievementsCount,
  xp7Days,
  xp30Days,
  xp90Days,
  heatmapWeeks,
  breakdown,
  reviewMetrics,
  personalRecords,
  recentActivities,
}: StatsClientProps) {
  const [chartRange, setChartRange] = useState<"7d" | "30d" | "90d">("7d");
  const [activeChartPoint, setActiveChartPoint] = useState<DailyXpPoint | null>(null);
  const [hoveredHeatmapDay, setHoveredHeatmapDay] = useState<HeatmapDay | null>(null);
  const { playClick } = useSoundAndTheme();

  // Current active chart data
  const currentChartData = useMemo(() => {
    if (chartRange === "7d") return xp7Days;
    if (chartRange === "30d") return xp30Days;
    return xp90Days;
  }, [chartRange, xp7Days, xp30Days, xp90Days]);

  const totalRangeXp = useMemo(() => {
    return currentChartData.reduce((sum, d) => sum + d.xp, 0);
  }, [currentChartData]);

  const maxChartXp = useMemo(() => {
    const max = Math.max(...currentChartData.map((d) => d.xp), 0);
    return max === 0 ? 50 : Math.ceil(max * 1.2 / 10) * 10;
  }, [currentChartData]);

  // Overall is New User Check
  const isNewUser = user.totalXP === 0 && breakdown.lessons.completed === 0 && reviewMetrics.totalReviewsDone === 0;

  return (
    <div className="space-y-8 pb-12">
      {/* ================= 1. HEADER ================= */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0b1230] p-6 text-white sm:p-8 md:p-10 shadow-xl">
        <div
          className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-red-600/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-rose-500/15 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold tracking-wider text-rose-300 backdrop-blur-sm">
              <span>📊 BÁO CÁO HỌC TẬP</span>
              <span className="opacity-50">·</span>
              <span>JLPT {user.learningLevel}</span>
            </div>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Thống Kê <span className="text-red-500">Học Tập</span>
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">
              Theo dõi tiến độ, hiệu suất ôn tập và hành trình chinh phục tiếng Nhật của bạn.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/app/practice"
              onClick={playClick}
              className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-900/40 transition hover:brightness-110 active:scale-95"
            >
              <span>📖 Học bài tiếp theo</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/app/review"
              onClick={playClick}
              className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-95"
            >
              <span>🧠 Ôn tập SRS</span>
            </Link>
          </div>
        </div>

        {/* Quick Highlights Strip */}
        <div className="relative z-10 mt-8 grid grid-cols-2 gap-3 border-t border-white/10 pt-6 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-2xl bg-white/5 p-3.5 backdrop-blur-sm border border-white/10">
            <p className="text-xs font-semibold text-slate-400">Cấp độ hiện tại</p>
            <p className="mt-1 text-xl font-black text-white sm:text-2xl">Level {user.level}</p>
            <p className="mt-0.5 text-[11px] text-amber-400 font-medium">{user.levelProgressPercent}% tới Level {user.level + 1}</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-3.5 backdrop-blur-sm border border-white/10">
            <p className="text-xs font-semibold text-slate-400">Tổng kinh nghiệm</p>
            <p className="mt-1 text-xl font-black text-rose-400 sm:text-2xl">{user.totalXP.toLocaleString()} XP</p>
            <p className="mt-0.5 text-[11px] text-slate-400 font-medium">Tích lũy từ bài học</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-3.5 backdrop-blur-sm border border-white/10">
            <p className="text-xs font-semibold text-slate-400">Chuỗi học tập</p>
            <p className="mt-1 text-xl font-black text-orange-400 sm:text-2xl">
              🔥 {user.currentStreak} {user.currentStreak === 1 ? "ngày" : "ngày"}
            </p>
            <p className="mt-0.5 text-[11px] text-slate-400 font-medium">Kỷ lục: {user.longestStreak} ngày</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-3.5 backdrop-blur-sm border border-white/10">
            <p className="text-xs font-semibold text-slate-400">Thời gian học tập</p>
            <p className="mt-1 text-xl font-black text-emerald-400 sm:text-2xl">⏱️ {studyTimeFormatted}</p>
            <p className="mt-0.5 text-[11px] text-slate-400 font-medium">Luyện tập thực tế</p>
          </div>
        </div>
      </section>

      {/* ================= 2. OVERVIEW CARDS ================= */}
      <section aria-labelledby="overview-title">
        <h2 id="overview-title" className="text-lg font-black text-slate-900 dark:text-white">
          Tổng quan chỉ số
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Dữ liệu được cập nhật theo thời gian thực từ tài khoản của bạn</p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-4">
          {/* Total XP */}
          <div className="group rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-sumi-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Tổng XP</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                ✨
              </span>
            </div>
            <p className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {user.totalXP.toLocaleString()}
            </p>
            <span className="mt-1 inline-block text-xs font-semibold text-rose-600 dark:text-rose-400">
              Điểm kinh nghiệm
            </span>
          </div>

          {/* Current Level */}
          <div className="group rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-sumi-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Cấp độ</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                🏆
              </span>
            </div>
            <p className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Cấp {user.level}
            </p>
            <span className="mt-1 inline-block text-xs font-semibold text-amber-600 dark:text-amber-400">
              {user.currentLevelXP} / {user.nextLevelXP} XP
            </span>
          </div>

          {/* Streak */}
          <div className="group rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-sumi-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Chuỗi học</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400">
                🔥
              </span>
            </div>
            <p className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {user.currentStreak} ngày
            </p>
            <span className="mt-1 inline-block text-xs font-semibold text-orange-600 dark:text-orange-400">
              Kỷ lục: {user.longestStreak} ngày
            </span>
          </div>

          {/* Study Time */}
          <div className="group rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-sumi-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Thời gian học</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                ⏱️
              </span>
            </div>
            <p className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {studyTimeFormatted}
            </p>
            <span className="mt-1 inline-block text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Tổng thời gian làm bài
            </span>
          </div>

          {/* Lessons Completed */}
          <div className="group rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-sumi-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Bài học xong</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                📖
              </span>
            </div>
            <p className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {breakdown.lessons.completed}
            </p>
            <span className="mt-1 inline-block text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              / {breakdown.lessons.total} bài {user.learningLevel}
            </span>
          </div>

          {/* Vocabulary Learned */}
          <div className="group rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-sumi-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Từ vựng đã học</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400">
                あ
              </span>
            </div>
            <p className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {breakdown.vocabulary.learned}
            </p>
            <span className="mt-1 inline-block text-xs font-semibold text-teal-600 dark:text-teal-400">
              Lưu trong kho SRS
            </span>
          </div>

          {/* Kana Mastered */}
          <div className="group rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-sumi-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Kana thành thạo</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                字
              </span>
            </div>
            <p className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {breakdown.kana.mastered} <span className="text-base font-bold text-slate-400">/ {breakdown.kana.total}</span>
            </p>
            <span className="mt-1 inline-block text-xs font-semibold text-rose-600 dark:text-rose-400">
              Hiragana &amp; Katakana
            </span>
          </div>

          {/* Achievements */}
          <div className="group rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-sumi-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Thành tựu</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-600 dark:bg-yellow-950/50 dark:text-yellow-400">
                🎖️
              </span>
            </div>
            <p className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {achievementsCount.unlocked} <span className="text-base font-bold text-slate-400">/ {achievementsCount.total}</span>
            </p>
            <span className="mt-1 inline-block text-xs font-semibold text-yellow-600 dark:text-yellow-400">
              Huy hiệu đạt được
            </span>
          </div>
        </div>
      </section>

      {/* ================= 3. XP / LEARNING ACTIVITY CHART ================= */}
      <section className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-sm dark:border-slate-800 dark:bg-sumi-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Biểu đồ kinh nghiệm (XP)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tổng tích lũy: <strong className="text-slate-900 dark:text-white font-bold">{totalRangeXp.toLocaleString()} XP</strong> trong giai đoạn này
            </p>
          </div>

          <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100 p-1 dark:bg-sumi-800 self-start sm:self-auto">
            {(["7d", "30d", "90d"] as const).map((range) => {
              const label = range === "7d" ? "7 ngày" : range === "30d" ? "30 ngày" : "90 ngày";
              const on = chartRange === range;
              return (
                <button
                  key={range}
                  onClick={() => {
                    playClick();
                    setChartRange(range);
                    setActiveChartPoint(null);
                  }}
                  aria-pressed={on}
                  className={`min-h-9 rounded-xl px-3 text-xs font-bold transition ${
                    on
                      ? "bg-white text-slate-900 shadow-sm dark:bg-sumi-900 dark:text-white"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Chart Container */}
        <div className="mt-6">
          {totalRangeXp === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-12 text-center dark:border-slate-800 dark:bg-sumi-950/40">
              <span className="text-3xl">🌱</span>
              <p className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                Chưa có dữ liệu XP trong {chartRange === "7d" ? "7 ngày" : chartRange === "30d" ? "30 ngày" : "90 ngày"} qua
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                Hãy hoàn thành một bài học hoặc ôn tập thẻ nhớ để bắt đầu ghi lại biểu đồ hoạt động.
              </p>
              <Link
                href="/app/practice"
                onClick={playClick}
                className="mt-4 inline-flex min-h-9 items-center gap-2 rounded-xl bg-red-600 px-4 text-xs font-bold text-white transition hover:bg-red-700"
              >
                Vào học ngay →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Active point hover indicator */}
              <div className="flex min-h-6 items-center justify-between text-xs">
                {activeChartPoint ? (
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
                    <span className="inline-block h-2 w-2 rounded-full bg-red-600" />
                    <span>Ngày {activeChartPoint.fullDate} ({activeChartPoint.dayLabel}):</span>
                    <strong className="text-red-600 dark:text-red-400 font-black">+{activeChartPoint.xp} XP</strong>
                  </div>
                ) : (
                  <span className="text-slate-400 italic text-[11px]">Rê chuột hoặc chạm vào cột để xem chi tiết từng ngày</span>
                )}
                <span className="text-slate-400 text-[11px]">Đỉnh: {maxChartXp} XP</span>
              </div>

              {/* Bar/Area chart visualisation */}
              <div className="relative flex h-48 w-full items-end gap-1 sm:gap-2 pt-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                {/* Horizontal Guide Lines */}
                <div className="pointer-events-none absolute inset-x-0 top-6 border-t border-dashed border-slate-200/70 dark:border-slate-800" />
                <div className="pointer-events-none absolute inset-x-0 top-1/2 border-t border-dashed border-slate-200/70 dark:border-slate-800" />

                {currentChartData.map((d, i) => {
                  const heightPercent = maxChartXp > 0 ? Math.max(d.xp > 0 ? 6 : 2, Math.round((d.xp / maxChartXp) * 100)) : 2;
                  const isHovered = activeChartPoint?.dateKey === d.dateKey;
                  const isToday = i === currentChartData.length - 1;

                  return (
                    <div
                      key={d.dateKey}
                      className="group relative flex flex-1 flex-col items-center justify-end h-full cursor-pointer"
                      onMouseEnter={() => setActiveChartPoint(d)}
                      onTouchStart={() => setActiveChartPoint(d)}
                    >
                      {/* Bar */}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-lg transition-all duration-300 ${
                          d.xp > 0
                            ? isHovered
                              ? "bg-red-500 shadow-md shadow-red-500/30 ring-2 ring-red-400"
                              : isToday
                              ? "bg-gradient-to-t from-red-600 to-rose-400"
                              : "bg-gradient-to-t from-slate-300 to-slate-400 dark:from-sumi-800 dark:to-sumi-700 hover:from-red-500 hover:to-rose-400"
                            : "bg-slate-100 dark:bg-sumi-950/60"
                        }`}
                      />

                      {/* X-axis date labels */}
                      {chartRange === "7d" ? (
                        <span className={`mt-2 text-[11px] font-bold ${isToday ? "text-red-600 dark:text-red-400" : "text-slate-500"}`}>
                          {d.dayLabel}
                        </span>
                      ) : chartRange === "30d" && (i % 5 === 0 || isToday) ? (
                        <span className="mt-2 text-[10px] text-slate-400 whitespace-nowrap">
                          {d.shortDate}
                        </span>
                      ) : chartRange === "90d" && (i % 15 === 0 || isToday) ? (
                        <span className="mt-2 text-[10px] text-slate-400 whitespace-nowrap">
                          {d.shortDate}
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ================= 4. STUDY ACTIVITY HEATMAP ================= */}
      <section className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-sm dark:border-slate-800 dark:bg-sumi-900">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Lịch học tập &amp; Điểm chuyên cần (Heatmap)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hoạt động rèn luyện trong 20 tuần gần đây
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-2 sm:pt-0">
            <span>Ít</span>
            <span className="h-3 w-3 rounded-sm bg-slate-100 dark:bg-sumi-800" title="0 XP" />
            <span className="h-3 w-3 rounded-sm bg-rose-200 dark:bg-rose-950" title="1-20 XP" />
            <span className="h-3 w-3 rounded-sm bg-rose-400 dark:bg-rose-800" title="21-50 XP" />
            <span className="h-3 w-3 rounded-sm bg-red-500 dark:bg-red-600" title="51-100 XP" />
            <span className="h-3 w-3 rounded-sm bg-red-700 dark:bg-red-400" title=">100 XP" />
            <span>Nhiều</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="mt-5 overflow-x-auto pb-2">
          <div className="min-w-[640px]">
            {/* Weekday indicators & columns */}
            <div className="flex gap-1.5">
              {/* Day Labels Column */}
              <div className="flex flex-col justify-between pr-2 text-[10px] font-bold text-slate-400 h-[116px]">
                <span>T2</span>
                <span>T4</span>
                <span>T6</span>
                <span>CN</span>
              </div>

              {/* Weeks matrix */}
              <div className="flex flex-1 gap-1.5">
                {heatmapWeeks.map((week, wIdx) => {
                  // Show month label above first week of month
                  const firstDayOfWeek = week[0];
                  const showMonth = wIdx === 0 || firstDayOfWeek.dateNumber <= 7;

                  return (
                    <div key={wIdx} className="flex flex-1 flex-col gap-1.5">
                      {/* Month header */}
                      <span className="h-4 text-[10px] font-bold text-slate-400 truncate">
                        {showMonth ? MONTH_NAMES[firstDayOfWeek.month] : ""}
                      </span>

                      {/* 7 Days of the Week */}
                      {week.map((day) => {
                        const bgLevel = {
                          0: "bg-slate-100 hover:ring-slate-300 dark:bg-sumi-800/80 dark:hover:ring-slate-600",
                          1: "bg-rose-200 hover:ring-rose-400 dark:bg-rose-950 dark:hover:ring-rose-600",
                          2: "bg-rose-400 hover:ring-rose-500 dark:bg-rose-800 dark:hover:ring-rose-500",
                          3: "bg-red-500 hover:ring-red-400 dark:bg-red-600 dark:hover:ring-red-400",
                          4: "bg-red-700 hover:ring-red-500 dark:bg-red-500 dark:hover:ring-red-300",
                        }[day.level];

                        return (
                          <div
                            key={day.dateKey}
                            onMouseEnter={() => setHoveredHeatmapDay(day)}
                            onMouseLeave={() => setHoveredHeatmapDay(null)}
                            onTouchStart={() => setHoveredHeatmapDay(day)}
                            className={`h-3 w-full rounded-sm transition cursor-pointer hover:ring-2 ${bgLevel}`}
                            title={`${day.dateKey}: +${day.xp} XP (${day.activityCount} hoạt động)`}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Heatmap Tooltip info */}
        <div className="mt-3 min-h-6 text-xs text-slate-600 dark:text-slate-300 font-medium">
          {hoveredHeatmapDay ? (
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white">Ngày {hoveredHeatmapDay.dateKey}:</span>
              <span className="text-red-600 dark:text-red-400 font-extrabold">+{hoveredHeatmapDay.xp} XP</span>
              <span className="text-slate-400">·</span>
              <span>{hoveredHeatmapDay.activityCount} bài học &amp; lượt ôn tập</span>
            </div>
          ) : (
            <span className="text-slate-400 text-[11px] italic">Di chuột lên từng ô để xem chi tiết hoạt động của ngày đó</span>
          )}
        </div>
      </section>

      {/* ================= 5. LEARNING PROGRESS BREAKDOWN ================= */}
      <section aria-labelledby="breakdown-title">
        <h2 id="breakdown-title" className="text-lg font-black text-slate-900 dark:text-white">
          Tiến độ học tập theo chuyên mục
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Được đồng bộ chính xác với kho dữ liệu Kana, Từ vựng, Ngữ pháp và Bài học</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {/* Kana */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-sumi-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-base font-black text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                  あ
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Bảng chữ cái (Kana)</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Hiragana &amp; Katakana</p>
                </div>
              </div>
              <span className="text-sm font-black text-rose-600 dark:text-rose-400">
                {breakdown.kana.percent}%
              </span>
            </div>

            <div className="mt-5 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span>Đã thành thạo</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {breakdown.kana.mastered} / {breakdown.kana.total} ký tự
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 dark:bg-sumi-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-500 to-red-600 transition-all duration-500"
                  style={{ width: `${breakdown.kana.percent}%` }}
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">Luyện viết &amp; phát âm</span>
              <Link href="/app/learn" onClick={playClick} className="text-xs font-bold text-rose-600 hover:underline dark:text-rose-400">
                Vào Kana Lab →
              </Link>
            </div>
          </div>

          {/* Vocabulary */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-sumi-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-base font-black text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
                  語
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Từ vựng &amp; Hán tự</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Kho từ đã nạp vào SRS</p>
                </div>
              </div>
              <span className="text-sm font-black text-teal-600 dark:text-teal-400">
                {breakdown.vocabulary.learned} từ
              </span>
            </div>

            <div className="mt-5 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span>Tiến trình JLPT {user.learningLevel}</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {breakdown.vocabulary.learned} / {breakdown.vocabulary.total} từ
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 dark:bg-sumi-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 transition-all duration-500"
                  style={{ width: `${breakdown.vocabulary.percent}%` }}
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">Tra cứu từ vựng &amp; Kanji</span>
              <Link href="/app/vocabulary" onClick={playClick} className="text-xs font-bold text-teal-600 hover:underline dark:text-teal-400">
                Tra từ vựng →
              </Link>
            </div>
          </div>

          {/* Grammar */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-sumi-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-base font-black text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  文
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Ngữ pháp JLPT</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Cấu trúc mẫu câu &amp; ví dụ</p>
                </div>
              </div>
              <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                {breakdown.grammar.percent}%
              </span>
            </div>

            <div className="mt-5 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span>Số điểm ngữ pháp</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {breakdown.grammar.learned} / {breakdown.grammar.total} mẫu câu
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 dark:bg-sumi-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-500"
                  style={{ width: `${breakdown.grammar.percent}%` }}
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">Khám phá mẫu câu</span>
              <Link href="/app/grammar" onClick={playClick} className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400">
                Học ngữ pháp →
              </Link>
            </div>
          </div>

          {/* Lessons */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-sumi-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-base font-black text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                  ⛩️
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Bài học lộ trình</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Chương trình chuẩn JLPT {user.learningLevel}</p>
                </div>
              </div>
              <span className="text-sm font-black text-amber-600 dark:text-amber-400">
                {breakdown.lessons.percent}%
              </span>
            </div>

            <div className="mt-5 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span>Đã hoàn thành</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {breakdown.lessons.completed} / {breakdown.lessons.total} bài học
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 dark:bg-sumi-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                  style={{ width: `${breakdown.lessons.percent}%` }}
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">Tiếp tục chặng học</span>
              <Link href="/app/practice" onClick={playClick} className="text-xs font-bold text-amber-600 hover:underline dark:text-amber-400">
                Làm bài tập →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 6. REVIEW PERFORMANCE & MASTERY ================= */}
      <section className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-sm dark:border-slate-800 dark:bg-sumi-900">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Hiệu suất Ôn tập (SRS Review Performance)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Thuật toán lặp lại ngắt quãng SM-2 giúp ghi nhớ kiến thức dài hạn
            </p>
          </div>
          <Link
            href="/app/review"
            onClick={playClick}
            className="mt-2 inline-flex min-h-9 items-center gap-2 rounded-xl bg-red-50 px-4 text-xs font-bold text-red-600 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-300 sm:mt-0"
          >
            Mở hàng đợi ôn tập →
          </Link>
        </div>

        {reviewMetrics.totalReviewsDone === 0 && reviewMetrics.totalReviewItems === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-10 text-center dark:border-slate-800 dark:bg-sumi-950/40">
            <span className="text-3xl">🧠</span>
            <p className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-200">
              Chưa có đủ dữ liệu ôn tập (Not enough data yet)
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              Khi bạn học từ vựng, Kana hoặc làm sai câu hỏi trong bài tập, hệ thống sẽ tự động đưa vào hàng đợi SRS để ôn tập.
            </p>
            <Link
              href="/app/vocabulary"
              onClick={playClick}
              className="mt-4 inline-flex min-h-9 items-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900"
            >
              Xem từ vựng để lưu vào SRS
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-[200px_minmax(0,1fr)] items-center">
            {/* Accuracy Circular Score */}
            <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 p-6 text-center dark:bg-sumi-950">
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-inner dark:bg-sumi-900">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {reviewMetrics.accuracy !== null ? `${reviewMetrics.accuracy}%` : "—"}
                </span>
              </div>
              <p className="mt-3 text-sm font-bold text-slate-900 dark:text-white">Độ chính xác</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{reviewMetrics.totalReviewsDone} lượt trả lời</p>
            </div>

            {/* SRS Status Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 text-center dark:border-emerald-900/60 dark:bg-emerald-950/30">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {reviewMetrics.masteredCount}
                </span>
                <p className="mt-1 text-xs font-bold text-emerald-900 dark:text-emerald-200">Đã làm chủ</p>
                <p className="mt-0.5 text-[10px] text-emerald-700/70 dark:text-emerald-400/70">Nhớ vững vàng</p>
              </div>

              <div className="rounded-2xl border border-blue-200/80 bg-blue-50/50 p-4 text-center dark:border-blue-900/60 dark:bg-blue-950/30">
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  {reviewMetrics.learningCount}
                </span>
                <p className="mt-1 text-xs font-bold text-blue-900 dark:text-blue-200">Đang học</p>
                <p className="mt-0.5 text-[10px] text-blue-700/70 dark:text-blue-400/70">Đang lặp lại SRS</p>
              </div>

              <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 text-center dark:border-amber-900/60 dark:bg-amber-950/30">
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                  {reviewMetrics.needsReviewCount}
                </span>
                <p className="mt-1 text-xs font-bold text-amber-900 dark:text-amber-200">Cần ôn tập</p>
                <p className="mt-0.5 text-[10px] text-amber-700/70 dark:text-amber-400/70">Đến hạn hôm nay</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ================= 7. PERSONAL RECORDS & RECENT ACTIVITY ================= */}
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        {/* Personal Records */}
        <section className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-sm dark:border-slate-800 dark:bg-sumi-900">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            Kỷ Lục Cá Nhân (Personal Records)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Những dấu mốc ấn tượng trên hành trình của bạn</p>

          <dl className="mt-5 divide-y divide-slate-100 border-t border-slate-100 text-sm dark:divide-slate-800 dark:border-slate-800">
            <div className="flex items-center justify-between py-3.5">
              <dt className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <span>🔥</span>
                <span>Chuỗi học dài nhất</span>
              </dt>
              <dd className="font-black text-orange-600 dark:text-orange-400">
                {personalRecords.longestStreak} ngày liên tục
              </dd>
            </div>

            <div className="flex items-center justify-between py-3.5">
              <dt className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <span>⚡</span>
                <span>XP cao nhất trong 1 ngày</span>
              </dt>
              <dd className="font-black text-rose-600 dark:text-rose-400">
                {personalRecords.mostXpInOneDay.toLocaleString()} XP
                {personalRecords.bestDayDate ? (
                  <span className="ml-1 text-[11px] font-normal text-slate-400">({personalRecords.bestDayDate})</span>
                ) : null}
              </dd>
            </div>

            <div className="flex items-center justify-between py-3.5">
              <dt className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <span>📖</span>
                <span>Tổng số bài học đã hoàn thành</span>
              </dt>
              <dd className="font-black text-slate-900 dark:text-white">
                {personalRecords.totalLessonsCompleted} bài
              </dd>
            </div>

            <div className="flex items-center justify-between py-3.5">
              <dt className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <span>🧠</span>
                <span>Tổng số lượt ôn tập thẻ</span>
              </dt>
              <dd className="font-black text-slate-900 dark:text-white">
                {personalRecords.totalReviewsDone} lượt
              </dd>
            </div>

            <div className="flex items-center justify-between py-3.5">
              <dt className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <span>⏱️</span>
                <span>Tổng thời gian luyện tập</span>
              </dt>
              <dd className="font-black text-emerald-600 dark:text-emerald-400">
                {personalRecords.formattedStudyTime}
              </dd>
            </div>
          </dl>
        </section>

        {/* Recent Activity Feed */}
        <section className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-sm dark:border-slate-800 dark:bg-sumi-900">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            Hoạt động gần đây (Recent Activity)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Nhật ký quá trình học tập thực tế</p>

          {recentActivities.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-200 p-6 text-center dark:border-slate-800 bg-slate-50/50 dark:bg-sumi-950/30">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                Chưa có hoạt động nào được ghi nhận.
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Hãy bắt đầu bài học đầu tiên để thấy hoạt động tại đây!
              </p>
            </div>
          ) : (
            <ul className="mt-5 space-y-3">
              {recentActivities.map((act) => {
                const badgeInfo = {
                  LESSON: { icon: "📖", color: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300" },
                  KANA: { icon: "あ", color: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300" },
                  VOCAB: { icon: "語", color: "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300" },
                  REVIEW: { icon: "🧠", color: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300" },
                  ACHIEVEMENT: { icon: "🏆", color: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-300" },
                  JOURNEY: { icon: "⛩️", color: "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300" },
                  SURVIVAL: { icon: "⚔️", color: "bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300" },
                  OTHER: { icon: "✨", color: "bg-slate-50 text-slate-700 dark:bg-sumi-800 dark:text-slate-300" },
                }[act.type];

                return (
                  <li
                    key={act.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 transition hover:bg-slate-100/70 dark:border-slate-800 dark:bg-sumi-950/40 dark:hover:bg-sumi-950"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${badgeInfo.color}`}>
                        {badgeInfo.icon}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                          {act.title}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {act.relativeTime || act.dateStr}
                        </p>
                      </div>
                    </div>

                    {act.xpAwarded > 0 && (
                      <span className="shrink-0 rounded-full bg-rose-100/80 px-2.5 py-1 text-xs font-black text-rose-700 dark:bg-rose-950/80 dark:text-rose-300">
                        +{act.xpAwarded} XP
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {/* Empty State Banner if completely new */}
      {isNewUser && (
        <section className="rounded-3xl border border-dashed border-red-200 bg-red-50/50 p-8 text-center dark:border-red-900/60 dark:bg-red-950/20">
          <span className="text-4xl">🌸</span>
          <h3 className="mt-3 text-lg font-black text-slate-900 dark:text-white">
            Hành trình vạn dặm bắt đầu từ một bước chân!
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-300">
            Chào mừng bạn đến với Nihon Quest. Hãy hoàn thành bài học đầu tiên để bắt đầu xây dựng kho dữ liệu và biểu đồ học tập của riêng mình.
          </p>
          <Link
            href="/app/practice"
            onClick={playClick}
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-2xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-red-600/30 transition hover:bg-red-700 active:scale-95"
          >
            Bắt đầu bài học đầu tiên ➔
          </Link>
        </section>
      )}
    </div>
  );
}
