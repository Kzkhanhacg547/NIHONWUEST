export type Grade = "AGAIN" | "HARD" | "GOOD" | "EASY";

export interface ReviewState {
  ease: number;
  interval: number;
  repetitions: number;
}

/** Deterministic SM-2 inspired update. Pure function for unit testing. */
export function updateSrs(state: ReviewState, grade: Grade): ReviewState & { dueInDays: number } {
  let { ease, interval, repetitions } = state;
  if (grade === "AGAIN") {
    return { ease: Math.max(1.3, ease - 0.2), interval: 0, repetitions: 0, dueInDays: 0 };
  }
  if (grade === "HARD") {
    ease = Math.max(1.3, ease - 0.15);
    repetitions += 1;
    interval = repetitions === 1 ? 1 : Math.max(1, Math.round(interval * 1.2));
  } else if (grade === "GOOD") {
    repetitions += 1;
    interval = repetitions === 1 ? 1 : repetitions === 2 ? 3 : Math.round(interval * ease);
  } else {
    ease += 0.15;
    repetitions += 1;
    interval = repetitions === 1 ? 2 : repetitions === 2 ? 5 : Math.round(interval * ease * 1.3);
  }
  return { ease, interval, repetitions, dueInDays: interval };
}

export function nextDueDate(from: Date, days: number): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d;
}
