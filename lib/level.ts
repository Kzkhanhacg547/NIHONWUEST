export function calculateLevel(totalXP: number): {
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  progress: number;
} {
  const xp = Math.max(0, Math.floor(totalXP));
  // Deterministic curve: threshold(level) = 100 * level * (level - 1) / 2 * 2?
  // Keep simple triangular curve: xpForLevel(n) = 100 * n * (n - 1) / 2 + 100 * (n - 1)
  // Equivalent: level 1 -> 0, level 2 -> 100, level 3 -> 300, level 4 -> 600 ...
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level += 1;
  const currentLevelXP = xpForLevel(level);
  const nextLevelXP = xpForLevel(level + 1);
  const progress = nextLevelXP === currentLevelXP ? 1 : (xp - currentLevelXP) / (nextLevelXP - currentLevelXP);
  return { level, currentLevelXP, nextLevelXP, progress };
}

export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  const n = level - 1;
  return 100 * n + (100 * n * (n - 1)) / 2;
}
