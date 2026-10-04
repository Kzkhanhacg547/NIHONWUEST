// Realistic Rival Bots System for Nihon Quest Leaderboard
// Generates realistic student personas who climb XP steadily and compete directly with the user.

export interface RivalBot {
  id: string;
  name: string;
  displayName: string;
  avatar: string;
  level: number;
  currentStreak: number;
  studyPace: "EARLY_BIRD" | "NIGHT_OWL" | "CONSISTENT" | "SPRINTER";
  baseWeeklyXp: number;
  baseAllTimeXp: number;
  quote: string;
}

export const RIVAL_BOTS: RivalBot[] = [
  {
    id: "bot_sakura_linh",
    name: "sakura_linh",
    displayName: "Khánh Linh 🌸",
    avatar: "🌸",
    level: 4,
    currentStreak: 7,
    studyPace: "CONSISTENT",
    baseWeeklyXp: 180,
    baseAllTimeXp: 850,
    quote: "Mỗi ngày 15 phút cùng Nihon Quest là thói quen của mình!",
  },
  {
    id: "bot_duy_nihongo",
    name: "duy_nihongo",
    displayName: "Đức Duy ⚡",
    avatar: "⚡",
    level: 5,
    currentStreak: 12,
    studyPace: "NIGHT_OWL",
    baseWeeklyXp: 260,
    baseAllTimeXp: 1420,
    quote: "Quyết tâm thi đỗ JLPT N4 cuối năm nay!",
  },
  {
    id: "bot_minh_tokyo99",
    name: "minh_tokyo99",
    displayName: "Minh Tuấn 🍜",
    avatar: "🍜",
    level: 6,
    currentStreak: 21,
    studyPace: "EARLY_BIRD",
    baseWeeklyXp: 320,
    baseAllTimeXp: 2100,
    quote: "Vừa ôn xong 30 thẻ SRS buổi sáng.",
  },
  {
    id: "bot_an_chan_jp",
    name: "an_chan_jp",
    displayName: "Bảo An 🐱",
    avatar: "🐱",
    level: 3,
    currentStreak: 5,
    studyPace: "CONSISTENT",
    baseWeeklyXp: 140,
    baseAllTimeXp: 520,
    quote: "Đang tập vẽ Hiragana, chữ đẹp dần rồi nè.",
  },
  {
    id: "bot_kaito_kun",
    name: "kaito_kun",
    displayName: "Quang Huy ⛩️",
    avatar: "⛩️",
    level: 4,
    currentStreak: 9,
    studyPace: "SPRINTER",
    baseWeeklyXp: 210,
    baseAllTimeXp: 980,
    quote: "Chặng đường Shinkansen sắp đến Kyoto rồi!",
  },
  {
    id: "bot_viet_shinkansen",
    name: "viet_shinkansen",
    displayName: "Hoàng Việt 🚅",
    avatar: "🚅",
    level: 7,
    currentStreak: 30,
    studyPace: "CONSISTENT",
    baseWeeklyXp: 390,
    baseAllTimeXp: 2950,
    quote: "Streak 30 ngày không bỏ bữa nào!",
  },
  {
    id: "bot_mai_origami",
    name: "mai_origami",
    displayName: "Thanh Mai 🎴",
    avatar: "🎴",
    level: 3,
    currentStreak: 4,
    studyPace: "NIGHT_OWL",
    baseWeeklyXp: 110,
    baseAllTimeXp: 460,
    quote: "Học từ vựng qua flashcard nhớ lâu thật sự.",
  },
  {
    id: "bot_hieu_ramen",
    name: "hieu_ramen",
    displayName: "Trung Hiếu 🍥",
    avatar: "🍥",
    level: 5,
    currentStreak: 15,
    studyPace: "EARLY_BIRD",
    baseWeeklyXp: 230,
    baseAllTimeXp: 1250,
    quote: "Survival mode gọi mì Ramen đỉnh ghê.",
  },
];

/**
 * Calculates time-based dynamic progression for a bot so their XP climbs
 * realistically depending on the day of the week and current hour of the day.
 */
export function getBotDynamicXp(bot: RivalBot, userWeeklyXp: number, userAllTimeXp: number) {
  const now = new Date();
  const dayOfWeek = (now.getDay() + 6) % 7; // Monday = 0, Sunday = 6
  const hour = now.getHours();

  // Progress fraction through the week (0 to 1)
  const weekProgress = Math.min(1, Math.max(0.05, (dayOfWeek * 24 + hour) / (7 * 24)));

  // Time-of-day bonus based on personality
  let timeOfDayBonus = 0;
  if (bot.studyPace === "EARLY_BIRD" && hour >= 6 && hour <= 12) {
    timeOfDayBonus = 25;
  } else if (bot.studyPace === "NIGHT_OWL" && hour >= 18 && hour <= 23) {
    timeOfDayBonus = 35;
  } else if (bot.studyPace === "SPRINTER" && (dayOfWeek === 5 || dayOfWeek === 6)) {
    timeOfDayBonus = 45;
  }

  // Base calculation
  let calculatedWeeklyXp = Math.round(bot.baseWeeklyXp * weekProgress + timeOfDayBonus);
  let calculatedAllTimeXp = bot.baseAllTimeXp + calculatedWeeklyXp;

  // Adaptive Competitive Scaling:
  // If this bot is designated as a "Direct Rival" (e.g., sakura_linh or duy_nihongo),
  // adapt their score slightly relative to the user's score to keep the competition thrilling!
  if (bot.id === "bot_sakura_linh" && userWeeklyXp > 0) {
    // Stays closely competitive: slightly ahead (+15 to +35 XP) or slightly behind (-15 XP)
    const offset = (dayOfWeek % 2 === 0) ? 25 : -15;
    calculatedWeeklyXp = Math.max(35, userWeeklyXp + offset);
    calculatedAllTimeXp = Math.max(bot.baseAllTimeXp, userAllTimeXp + offset * 2);
  } else if (bot.id === "bot_duy_nihongo" && userWeeklyXp > 50) {
    const offset = (hour >= 18) ? 40 : -20;
    calculatedWeeklyXp = Math.max(45, userWeeklyXp + offset);
    calculatedAllTimeXp = Math.max(bot.baseAllTimeXp, userAllTimeXp + offset);
  }

  return {
    weeklyXp: calculatedWeeklyXp,
    allTimeXp: calculatedAllTimeXp,
  };
}

export interface EnrichedLeaderboardUser {
  id: string;
  name: string | null;
  displayName: string | null;
  avatar: string | null;
  xp: number;
  level: number;
  currentStreak: number;
  isBot?: boolean;
  quote?: string;
  studyPace?: "EARLY_BIRD" | "NIGHT_OWL" | "CONSISTENT" | "SPRINTER";
}

export interface DirectRivalInfo {
  bot: EnrichedLeaderboardUser;
  rankDiff: number; // positive = bot ahead, negative = user ahead
  xpDiff: number;   // positive = bot has more XP, negative = user has more XP
  message: string;
}

/**
 * Merges real database users with realistic bots and identifies the direct rival for the current user.
 */
export function buildEnrichedLeaderboard(
  realUsers: Array<{
    id: string;
    name: string | null;
    totalXP: number;
    level: number;
    currentStreak: number;
    displayName: string | null;
    avatar: string | null;
    weeklyXp: number;
  }>,
  currentUserId: string,
  includeBots: boolean = true
) {
  const currentUser = realUsers.find((u) => u.id === currentUserId);
  const userWeeklyXp = currentUser?.weeklyXp || 0;
  const userAllTimeXp = currentUser?.totalXP || 0;

  // Generate bot items only if includeBots is true
  const botItems = includeBots
    ? RIVAL_BOTS.map((bot) => {
        const { weeklyXp, allTimeXp } = getBotDynamicXp(bot, userWeeklyXp, userAllTimeXp);
        return {
          bot,
          weeklyXp,
          allTimeXp,
        };
      })
    : [];

  // Weekly Leaderboard
  const weeklyList: EnrichedLeaderboardUser[] = [
    ...realUsers.map((u) => ({
      id: u.id,
      name: u.name,
      displayName: u.displayName || u.name,
      avatar: u.avatar || null,
      xp: u.weeklyXp,
      level: u.level,
      currentStreak: u.currentStreak,
      isBot: false,
    })),
    ...botItems.map(({ bot, weeklyXp }) => ({
      id: bot.id,
      name: bot.name,
      displayName: bot.displayName,
      avatar: bot.avatar,
      xp: weeklyXp,
      level: bot.level,
      currentStreak: bot.currentStreak,
      isBot: true,
      quote: bot.quote,
      studyPace: bot.studyPace,
    })),
  ].sort((a, b) => b.xp - a.xp);

  // All-time Leaderboard
  const allTimeList: EnrichedLeaderboardUser[] = [
    ...realUsers.map((u) => ({
      id: u.id,
      name: u.name,
      displayName: u.displayName || u.name,
      avatar: u.avatar || null,
      xp: u.totalXP,
      level: u.level,
      currentStreak: u.currentStreak,
      isBot: false,
    })),
    ...botItems.map(({ bot, allTimeXp }) => ({
      id: bot.id,
      name: bot.name,
      displayName: bot.displayName,
      avatar: bot.avatar,
      xp: allTimeXp,
      level: bot.level,
      currentStreak: bot.currentStreak,
      isBot: true,
      quote: bot.quote,
      studyPace: bot.studyPace,
    })),
  ].sort((a, b) => b.xp - a.xp);

  // Identify direct rival in Weekly League
  const userWeeklyRank = weeklyList.findIndex((u) => u.id === currentUserId) + 1;
  let directRival: DirectRivalInfo | null = null;

  if (userWeeklyRank > 0) {
    // Look for the closest bot ahead or behind
    const botsInWeekly = weeklyList.filter((u) => u.isBot);
    // Find closest bot ahead
    const botAhead = [...weeklyList.slice(0, userWeeklyRank - 1)].reverse().find((u) => u.isBot);
    // Find closest bot behind
    const botBehind = weeklyList.slice(userWeeklyRank).find((u) => u.isBot);

    const targetBot = botAhead || botBehind || botsInWeekly[0];

    if (targetBot) {
      const botRank = weeklyList.findIndex((u) => u.id === targetBot.id) + 1;
      const rankDiff = userWeeklyRank - botRank;
      const xpDiff = targetBot.xp - userWeeklyXp;

      let message = "";
      if (xpDiff > 0) {
        message = `⚔️ ${targetBot.displayName} đang đứng trước bạn #${botRank} (+${xpDiff} XP). Chỉ cần 1 bài học là bạn sẽ vượt mặt!`;
      } else if (xpDiff === 0) {
        message = `🔥 Bạn và ${targetBot.displayName} đang hòa điểm! Hãy làm 1 bài để bứt phá lên trên!`;
      } else {
        message = `🛡️ ${targetBot.displayName} đang bám sát phía sau #${botRank} (kém bạn ${Math.abs(xpDiff)} XP). Tiếp tục duy trì phong độ!`;
      }

      directRival = {
        bot: targetBot,
        rankDiff,
        xpDiff,
        message,
      };
    }
  }

  return {
    weeklyList,
    allTimeList,
    directRival,
  };
}
