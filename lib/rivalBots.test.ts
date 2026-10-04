import { describe, it, expect } from "vitest";
import { RIVAL_BOTS, getBotDynamicXp, buildEnrichedLeaderboard } from "./rivalBots";

describe("Rival Bots System", () => {
  it("has a valid list of realistic bot personas", () => {
    expect(RIVAL_BOTS.length).toBeGreaterThanOrEqual(5);
    RIVAL_BOTS.forEach((bot) => {
      expect(bot.name).toBeTruthy();
      expect(bot.displayName).toBeTruthy();
      expect(bot.avatar).toBeTruthy();
      expect(bot.baseWeeklyXp).toBeGreaterThan(0);
      expect(bot.baseAllTimeXp).toBeGreaterThan(0);
    });
  });

  it("calculates realistic time-based dynamic XP", () => {
    const bot = RIVAL_BOTS[0];
    const { weeklyXp, allTimeXp } = getBotDynamicXp(bot, 100, 500);
    expect(weeklyXp).toBeGreaterThanOrEqual(10);
    expect(allTimeXp).toBeGreaterThanOrEqual(bot.baseAllTimeXp);
  });

  it("builds enriched leaderboard and matches a direct rival for the user", () => {
    const mockRealUsers = [
      {
        id: "user_123",
        name: "Test Learner",
        totalXP: 500,
        level: 3,
        currentStreak: 5,
        displayName: "Test Learner",
        avatar: "🌸",
        weeklyXp: 120,
      },
    ];

    const { weeklyList, allTimeList, directRival } = buildEnrichedLeaderboard(mockRealUsers, "user_123");

    expect(weeklyList.length).toBeGreaterThan(1);
    expect(allTimeList.length).toBeGreaterThan(1);
    expect(directRival).not.toBeNull();
    if (directRival) {
      expect(directRival.bot.name).toBeTruthy();
      expect(directRival.message).toBeTruthy();
    }
  });
});
