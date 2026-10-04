import { prisma } from "./prisma";
import { localDateKey } from "./streak";

/**
 * Single source of truth for the "which learning day is it" key.
 *
 * Writers previously hardcoded UTC while readers used `user.timezone`, so for a
 * UTC+7 learner between 17:00 and 24:00 UTC progress landed on a row nobody
 * displayed. Every mission/review/survival writer and reader goes through here.
 */
export async function todayKeyForUser(
  userId: string,
  now: Date = new Date(),
): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { timezone: true },
  });
  return localDateKey(now, user?.timezone ?? "UTC");
}