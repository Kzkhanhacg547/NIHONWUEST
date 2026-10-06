import { localDateKey } from "./streak";

export interface DailyXpPoint {
  dateKey: string;
  dayLabel: string;
  shortDate: string;
  fullDate: string;
  xp: number;
}

export interface HeatmapDay {
  dateKey: string;
  dayOfWeek: number; // 0 = Mon, 6 = Sun
  dateNumber: number;
  month: number; // 0-11
  year: number;
  xp: number;
  activityCount: number;
  level: 0 | 1 | 2 | 3 | 4; // 0: 0, 1: 1-20 XP, 2: 21-50 XP, 3: 51-100 XP, 4: >100 XP
}

export interface ReviewMetrics {
  totalReviewItems: number;
  totalReviewsDone: number;
  accuracy: number | null;
  masteredCount: number;
  learningCount: number;
  needsReviewCount: number;
}

export interface PersonalRecords {
  longestStreak: number;
  currentStreak: number;
  mostXpInOneDay: number;
  bestDayDate: string | null;
  totalLessonsCompleted: number;
  totalReviewsDone: number;
  totalStudyTimeSeconds: number;
  formattedStudyTime: string;
}

/**
 * Chuyển số giây học tập thành chuỗi dễ đọc (ví dụ: "24h 35m", "1h 10m", "45m", "0m").
 */
export function formatStudyTime(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  if (seconds === 0) return "0m";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (hours > 0 && minutes === 0) {
    return `${hours}h`;
  }
  return `${Math.max(1, minutes)}m`;
}

const WEEKDAY_NAMES_VI = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const WEEKDAY_NAMES_MON_START = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

/**
 * Tổng hợp biểu đồ XP theo số ngày (7, 30, 90 ngày gần nhất).
 */
export function aggregateXpHistory(
  transactions: Array<{ amount: number; createdAt: Date }>,
  daysCount: number,
  timezone: string = "UTC",
  now: Date = new Date()
): DailyXpPoint[] {
  const xpByDate = new Map<string, number>();

  for (const tx of transactions) {
    const key = localDateKey(tx.createdAt, timezone);
    xpByDate.set(key, (xpByDate.get(key) || 0) + tx.amount);
  }

  const result: DailyXpPoint[] = [];
  const msPerDay = 86400000;

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * msPerDay);
    const key = localDateKey(d, timezone);
    const dayOfWeek = d.getDay();
    const dayLabel = WEEKDAY_NAMES_VI[dayOfWeek];
    const shortDate = `${d.getDate()}/${d.getMonth() + 1}`;
    const fullDate = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${d.getFullYear()}`;

    result.push({
      dateKey: key,
      dayLabel,
      shortDate,
      fullDate,
      xp: xpByDate.get(key) || 0,
    });
  }

  return result;
}

/**
 * Tổng hợp dữ liệu Heatmap dạng calendar (Mon -> Sun) trong N tuần gần nhất.
 */
export function aggregateHeatmap(
  transactions: Array<{ amount: number; createdAt: Date }>,
  activityTimestamps: Date[],
  timezone: string = "UTC",
  weeksCount: number = 20,
  now: Date = new Date()
): HeatmapDay[][] {
  const dailyXp = new Map<string, number>();
  const dailyCount = new Map<string, number>();

  for (const tx of transactions) {
    const key = localDateKey(tx.createdAt, timezone);
    dailyXp.set(key, (dailyXp.get(key) || 0) + tx.amount);
    dailyCount.set(key, (dailyCount.get(key) || 0) + 1);
  }

  for (const ts of activityTimestamps) {
    const key = localDateKey(ts, timezone);
    dailyCount.set(key, (dailyCount.get(key) || 0) + 1);
  }

  // Tìm ngày Chủ nhật gần nhất sau hoặc đúng bằng ngày hôm nay để kết thúc tuần hiện tại
  const currentDayOfWeek = (now.getDay() + 6) % 7; // 0: Mon, 6: Sun
  const daysToEndOfWeek = 6 - currentDayOfWeek;
  const endSunday = new Date(now.getTime() + daysToEndOfWeek * 86400000);

  const totalDays = weeksCount * 7;
  const startMonday = new Date(endSunday.getTime() - (totalDays - 1) * 86400000);

  const weeks: HeatmapDay[][] = [];
  let currentWeek: HeatmapDay[] = [];

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(startMonday.getTime() + i * 86400000);
    const key = localDateKey(d, timezone);
    const dayOfWeek = (d.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
    const xp = dailyXp.get(key) || 0;
    const count = dailyCount.get(key) || 0;

    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (xp > 100 || count >= 8) level = 4;
    else if (xp >= 50 || count >= 5) level = 3;
    else if (xp >= 20 || count >= 2) level = 2;
    else if (xp > 0 || count >= 1) level = 1;

    const dayObj: HeatmapDay = {
      dateKey: key,
      dayOfWeek,
      dateNumber: d.getDate(),
      month: d.getMonth(),
      year: d.getFullYear(),
      xp,
      activityCount: count,
      level,
    };

    currentWeek.push(dayObj);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  return weeks;
}

/**
 * Tính toán độ chính xác và chỉ số SRS từ ReviewItem và ReviewHistory.
 */
export function calculateReviewMetrics(
  items: Array<{ repetitions: number; interval: number; dueAt: Date }>,
  history: Array<{ grade: string }>
): ReviewMetrics {
  const totalReviewItems = items.length;
  const totalReviewsDone = history.length;

  let accuracy: number | null = null;
  if (totalReviewsDone > 0) {
    const correct = history.filter((h) => h.grade === "GOOD" || h.grade === "EASY").length;
    accuracy = Math.round((correct / totalReviewsDone) * 100);
  }

  const now = new Date();
  let masteredCount = 0;
  let learningCount = 0;
  let needsReviewCount = 0;

  for (const item of items) {
    if (item.repetitions >= 3 && item.interval >= 7) {
      masteredCount++;
    } else if (item.repetitions > 0) {
      learningCount++;
    }

    if (item.dueAt <= now || item.interval === 0) {
      needsReviewCount++;
    }
  }

  return {
    totalReviewItems,
    totalReviewsDone,
    accuracy,
    masteredCount,
    learningCount,
    needsReviewCount,
  };
}

/**
 * Tính toán kỷ lục cá nhân (Personal Records).
 */
export function calculatePersonalRecords(args: {
  currentStreak: number;
  longestStreak: number;
  transactions: Array<{ amount: number; createdAt: Date }>;
  totalLessonsCompleted: number;
  totalReviewsDone: number;
  totalStudyTimeSeconds: number;
  timezone?: string;
}): PersonalRecords {
  const { currentStreak, longestStreak, transactions, totalLessonsCompleted, totalReviewsDone, totalStudyTimeSeconds, timezone = "UTC" } = args;

  const dailyXpMap = new Map<string, number>();
  for (const tx of transactions) {
    const key = localDateKey(tx.createdAt, timezone);
    dailyXpMap.set(key, (dailyXpMap.get(key) || 0) + tx.amount);
  }

  let mostXpInOneDay = 0;
  let bestDayDate: string | null = null;

  for (const [dateKey, xp] of dailyXpMap.entries()) {
    if (xp > mostXpInOneDay) {
      mostXpInOneDay = xp;
      bestDayDate = dateKey;
    }
  }

  return {
    longestStreak: Math.max(longestStreak, currentStreak),
    currentStreak,
    mostXpInOneDay,
    bestDayDate,
    totalLessonsCompleted,
    totalReviewsDone,
    totalStudyTimeSeconds,
    formattedStudyTime: formatStudyTime(totalStudyTimeSeconds),
  };
}
