import { describe, expect, it } from "vitest";
import { calculateLevel, xpForLevel } from "@/lib/level";
import { updateSrs } from "@/lib/srs";
import { updateStreak } from "@/lib/streak";
import { scoreQuiz } from "@/lib/quiz";
import { canUnlockJourney, resolveJourneyStatus } from "@/lib/journey";

describe("level", () => {
  it("starts at level 1", () => {
    expect(calculateLevel(0).level).toBe(1);
    expect(xpForLevel(1)).toBe(0);
    expect(xpForLevel(2)).toBe(100);
  });
});

describe("srs", () => {
  it("resets on AGAIN", () => {
    const r = updateSrs({ ease: 2.5, interval: 5, repetitions: 3 }, "AGAIN");
    expect(r.repetitions).toBe(0);
    expect(r.interval).toBe(0);
  });
});

describe("streak", () => {
  it("starts streak on first activity", () => {
    const r = updateStreak({ lastActivityAt: null, currentStreak: 0, longestStreak: 0, now: new Date("2026-01-02T00:00:00Z"), timezone: "UTC" });
    expect(r.currentStreak).toBe(1);
  });
  it("increments next day", () => {
    const r = updateStreak({ lastActivityAt: new Date("2026-01-01T00:00:00Z"), currentStreak: 2, longestStreak: 2, now: new Date("2026-01-02T12:00:00Z"), timezone: "UTC" });
    expect(r.currentStreak).toBe(3);
  });
  it("resets after missed day", () => {
    const r = updateStreak({ lastActivityAt: new Date("2026-01-01T00:00:00Z"), currentStreak: 5, longestStreak: 5, now: new Date("2026-01-05T00:00:00Z"), timezone: "UTC" });
    expect(r.currentStreak).toBe(1);
  });
});

describe("quiz", () => {
  it("scores quiz", () => {
    const s = scoreQuiz([{ isCorrect: true, points: 10 }, { isCorrect: false, points: 10 }]);
    expect(s.correctCount).toBe(1);
    expect(s.score).toBe(10);
  });
});

describe("journey", () => {
  it("unlocks first location", () => {
    expect(canUnlockJourney({ locationOrder: 0, requirementXp: 500, totalXP: 0, previousCompleted: false })).toBe(true);
  });

  it("opens the location once total XP meets the requirement", () => {
    expect(resolveJourneyStatus({
      currentStatus: "LOCKED",
      locationOrder: 1,
      requirementXp: 180,
      totalXP: 320,
      previousCompleted: false,
    })).toBe("AVAILABLE");

    expect(resolveJourneyStatus({
      currentStatus: "LOCKED",
      locationOrder: 2,
      requirementXp: 380,
      totalXP: 320,
      previousCompleted: false,
    })).toBe("LOCKED");
  });
});
