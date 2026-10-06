import { describe, expect, it } from "vitest";
import { calculateLevel, xpForLevel } from "@/lib/level";
import { updateSrs } from "@/lib/srs";
import { updateStreak } from "@/lib/streak";
import { scoreQuiz } from "@/lib/quiz";
import { canUnlockJourney, resolveJourneyStatus } from "@/lib/journey";

describe("level calculations", () => {
  it("starts at level 1 with 0 XP", () => {
    const res = calculateLevel(0);
    expect(res.level).toBe(1);
    expect(res.currentLevelXP).toBe(0);
    expect(res.nextLevelXP).toBe(100);
    expect(res.progress).toBe(0);
    expect(xpForLevel(1)).toBe(0);
    expect(xpForLevel(2)).toBe(100);
  });

  it("calculates partial progress within level 1", () => {
    const res = calculateLevel(50);
    expect(res.level).toBe(1);
    expect(res.currentLevelXP).toBe(0);
    expect(res.nextLevelXP).toBe(100);
    expect(res.progress).toBe(0.5);
  });

  it("advances to level 2 at exactly 100 XP", () => {
    const res = calculateLevel(100);
    expect(res.level).toBe(2);
    expect(res.currentLevelXP).toBe(100);
    expect(res.nextLevelXP).toBe(300);
    expect(res.progress).toBe(0);
  });

  it("advances to level 3 at 300 XP and handles higher levels monotonically", () => {
    expect(calculateLevel(299).level).toBe(2);
    expect(calculateLevel(300).level).toBe(3);
    expect(calculateLevel(599).level).toBe(3);
    expect(calculateLevel(600).level).toBe(4);
    expect(calculateLevel(1000).level).toBe(5);
  });

  it("handles negative XP gracefully", () => {
    const res = calculateLevel(-50);
    expect(res.level).toBe(1);
    expect(res.progress).toBe(0);
  });
});

describe("srs algorithm", () => {
  it("resets repetitions and interval on AGAIN", () => {
    const r = updateSrs({ ease: 2.5, interval: 5, repetitions: 3 }, "AGAIN");
    expect(r.repetitions).toBe(0);
    expect(r.interval).toBe(0);
    expect(r.dueInDays).toBe(0);
  });

  it("advances interval on GOOD with increasing repetitions", () => {
    const first = updateSrs({ ease: 2.5, interval: 0, repetitions: 0 }, "GOOD");
    expect(first.repetitions).toBe(1);
    expect(first.interval).toBe(1);

    const second = updateSrs({ ease: 2.5, interval: first.interval, repetitions: first.repetitions }, "GOOD");
    expect(second.repetitions).toBe(2);
    expect(second.interval).toBe(3);

    const third = updateSrs({ ease: 2.5, interval: second.interval, repetitions: second.repetitions }, "GOOD");
    expect(third.repetitions).toBe(3);
    expect(third.interval).toBe(8);
  });

  it("increases ease on EASY and decreases ease on HARD", () => {
    const hard = updateSrs({ ease: 2.5, interval: 6, repetitions: 2 }, "HARD");
    expect(hard.ease).toBeLessThan(2.5);

    const easy = updateSrs({ ease: 2.5, interval: 6, repetitions: 2 }, "EASY");
    expect(easy.ease).toBeGreaterThan(2.5);
  });
});

describe("streak system", () => {
  it("starts streak on first activity", () => {
    const r = updateStreak({ lastActivityAt: null, currentStreak: 0, longestStreak: 0, now: new Date("2026-01-02T00:00:00Z"), timezone: "UTC" });
    expect(r.currentStreak).toBe(1);
    expect(r.longestStreak).toBe(1);
  });

  it("does not increment on same day activity", () => {
    const morning = new Date("2026-01-02T08:00:00Z");
    const evening = new Date("2026-01-02T20:00:00Z");
    const r = updateStreak({ lastActivityAt: morning, currentStreak: 3, longestStreak: 5, now: evening, timezone: "UTC" });
    expect(r.currentStreak).toBe(3);
    expect(r.longestStreak).toBe(5);
  });

  it("increments on consecutive day", () => {
    const r = updateStreak({ lastActivityAt: new Date("2026-01-01T12:00:00Z"), currentStreak: 2, longestStreak: 2, now: new Date("2026-01-02T12:00:00Z"), timezone: "UTC" });
    expect(r.currentStreak).toBe(3);
    expect(r.longestStreak).toBe(3);
  });

  it("resets after missed day", () => {
    const r = updateStreak({ lastActivityAt: new Date("2026-01-01T00:00:00Z"), currentStreak: 5, longestStreak: 5, now: new Date("2026-01-05T00:00:00Z"), timezone: "UTC" });
    expect(r.currentStreak).toBe(1);
    expect(r.longestStreak).toBe(5);
  });
});

describe("quiz scoring", () => {
  it("scores quiz correctly with weighted points", () => {
    const s = scoreQuiz([
      { isCorrect: true, points: 15 },
      { isCorrect: false, points: 10 },
      { isCorrect: true, points: 25 },
    ]);
    expect(s.correctCount).toBe(2);
    expect(s.score).toBe(40);
  });
});

describe("journey gating", () => {
  it("always unlocks the first location (order 0)", () => {
    expect(canUnlockJourney({ locationOrder: 0, requirementXp: 500, totalXP: 0, previousCompleted: false })).toBe(true);
  });

  it("opens the location once total XP meets the requirement and previous is completed", () => {
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

  it("preserves COMPLETED and IN_PROGRESS states", () => {
    expect(resolveJourneyStatus({
      currentStatus: "COMPLETED",
      locationOrder: 1,
      requirementXp: 180,
      totalXP: 320,
      previousCompleted: true,
    })).toBe("COMPLETED");

    expect(resolveJourneyStatus({
      currentStatus: "IN_PROGRESS",
      locationOrder: 1,
      requirementXp: 180,
      totalXP: 320,
      previousCompleted: true,
    })).toBe("IN_PROGRESS");
  });
});
