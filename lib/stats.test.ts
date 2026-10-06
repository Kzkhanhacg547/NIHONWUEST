import { describe, expect, it } from "vitest";
import {
  formatStudyTime,
  aggregateXpHistory,
  aggregateHeatmap,
  calculateReviewMetrics,
  calculatePersonalRecords,
} from "./stats";

describe("lib/stats.ts", () => {
  describe("formatStudyTime", () => {
    it("formats zero seconds as 0m", () => {
      expect(formatStudyTime(0)).toBe("0m");
    });

    it("formats minutes correctly", () => {
      expect(formatStudyTime(60)).toBe("1m");
      expect(formatStudyTime(35 * 60)).toBe("35m");
    });

    it("formats hours and minutes correctly", () => {
      expect(formatStudyTime(3600)).toBe("1h");
      expect(formatStudyTime(3600 + 45 * 60)).toBe("1h 45m");
      expect(formatStudyTime(24 * 3600 + 35 * 60)).toBe("24h 35m");
    });
  });

  describe("aggregateXpHistory", () => {
    it("aggregates XP points by day for 7 days", () => {
      const fixedNow = new Date("2026-10-06T12:00:00Z");
      const txs = [
        { amount: 50, createdAt: new Date("2026-10-06T10:00:00Z") },
        { amount: 30, createdAt: new Date("2026-10-06T11:00:00Z") },
        { amount: 20, createdAt: new Date("2026-10-05T09:00:00Z") },
      ];

      const history = aggregateXpHistory(txs, 7, "UTC", fixedNow);
      expect(history.length).toBe(7);

      const todayPoint = history[history.length - 1];
      expect(todayPoint.dateKey).toBe("2026-10-06");
      expect(todayPoint.xp).toBe(80);

      const yesterdayPoint = history[history.length - 2];
      expect(yesterdayPoint.dateKey).toBe("2026-10-05");
      expect(yesterdayPoint.xp).toBe(20);
    });
  });

  describe("aggregateHeatmap", () => {
    it("generates a matrix of weeks with 7 days each", () => {
      const fixedNow = new Date("2026-10-06T12:00:00Z");
      const txs = [
        { amount: 50, createdAt: new Date("2026-10-06T10:00:00Z") },
      ];

      const weeks = aggregateHeatmap(txs, [], "UTC", 4, fixedNow);
      expect(weeks.length).toBe(4);
      weeks.forEach((w) => expect(w.length).toBe(7));
    });
  });

  describe("calculateReviewMetrics", () => {
    it("handles empty review history gracefully", () => {
      const metrics = calculateReviewMetrics([], []);
      expect(metrics.totalReviewItems).toBe(0);
      expect(metrics.totalReviewsDone).toBe(0);
      expect(metrics.accuracy).toBeNull();
      expect(metrics.masteredCount).toBe(0);
      expect(metrics.learningCount).toBe(0);
      expect(metrics.needsReviewCount).toBe(0);
    });

    it("calculates accuracy and mastery states accurately", () => {
      const now = new Date();
      const past = new Date(now.getTime() - 86400000);
      const future = new Date(now.getTime() + 86400000 * 5);

      const items = [
        { repetitions: 4, interval: 10, dueAt: future }, // Mastered
        { repetitions: 1, interval: 1, dueAt: future }, // Learning
        { repetitions: 2, interval: 0, dueAt: past }, // Needs Review + Learning
      ];

      const history = [
        { grade: "GOOD" },
        { grade: "EASY" },
        { grade: "HARD" },
        { grade: "AGAIN" },
      ];

      const metrics = calculateReviewMetrics(items, history);
      expect(metrics.totalReviewItems).toBe(3);
      expect(metrics.totalReviewsDone).toBe(4);
      expect(metrics.accuracy).toBe(50); // 2 out of 4 (GOOD, EASY)
      expect(metrics.masteredCount).toBe(1);
      expect(metrics.learningCount).toBe(2);
      expect(metrics.needsReviewCount).toBe(1);
    });
  });

  describe("calculatePersonalRecords", () => {
    it("finds best XP day and formats personal records", () => {
      const txs = [
        { amount: 100, createdAt: new Date("2026-10-01T10:00:00Z") },
        { amount: 220, createdAt: new Date("2026-10-02T10:00:00Z") },
        { amount: 100, createdAt: new Date("2026-10-02T15:00:00Z") }, // total on 10-02: 320 XP
        { amount: 50, createdAt: new Date("2026-10-03T10:00:00Z") },
      ];

      const records = calculatePersonalRecords({
        currentStreak: 7,
        longestStreak: 14,
        transactions: txs,
        totalLessonsCompleted: 32,
        totalReviewsDone: 486,
        totalStudyTimeSeconds: 24 * 3600 + 35 * 60,
        timezone: "UTC",
      });

      expect(records.longestStreak).toBe(14);
      expect(records.currentStreak).toBe(7);
      expect(records.mostXpInOneDay).toBe(320);
      expect(records.bestDayDate).toBe("2026-10-02");
      expect(records.totalLessonsCompleted).toBe(32);
      expect(records.totalReviewsDone).toBe(486);
      expect(records.formattedStudyTime).toBe("24h 35m");
    });
  });
});
