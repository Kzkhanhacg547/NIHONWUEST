export function localDateKey(d: Date, timeZone?: string): string {
  try {
    const fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: timeZone || "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return fmt.format(d);
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

export function diffDays(aKey: string, bKey: string): number {
  const a = new Date(aKey + "T00:00:00Z").getTime();
  const b = new Date(bKey + "T00:00:00Z").getTime();
  return Math.round((b - a) / 86400000);
}

export function updateStreak(args: {
  lastActivityAt: Date | null;
  currentStreak: number;
  longestStreak: number;
  now: Date;
  timezone?: string;
}): { currentStreak: number; longestStreak: number; lastActivityAt: Date } {
  const tz = args.timezone || "UTC";
  const todayKey = localDateKey(args.now, tz);
  if (!args.lastActivityAt) {
    return { currentStreak: 1, longestStreak: Math.max(1, args.longestStreak), lastActivityAt: args.now };
  }
  const lastKey = localDateKey(args.lastActivityAt, tz);
  const diff = diffDays(lastKey, todayKey);
  if (diff <= 0) {
    return { currentStreak: args.currentStreak || 1, longestStreak: args.longestStreak, lastActivityAt: args.now };
  }
  if (diff === 1) {
    const next = args.currentStreak + 1;
    return { currentStreak: next, longestStreak: Math.max(next, args.longestStreak), lastActivityAt: args.now };
  }
  return { currentStreak: 1, longestStreak: args.longestStreak, lastActivityAt: args.now };
}
