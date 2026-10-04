import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Constrained to real values. `learningLevel`, `learningGoal`, `theme` and
 * `timezone` were free-form strings, so a garbage `learningLevel` made every
 * level-filtered query return zero rows and the dashboard showed "Bài 1 / 1"
 * with an empty roadmap.
 */
const JLPT_LEVELS = ["BEGINNER", "N5", "N4", "N3", "N2", "N1"] as const;
const LEVEL_CHOICES = ["BEGINNER", "N5", "N4", "N3", "N2", "N1"] as const;
const LEARNING_GOALS = ["TRAVEL", "CONVERSATION", "EXAM", "WORK", "ANIME", "JLPT", "CULTURE"] as const;
const FOCUS_SKILLS = ["BALANCED", "LISTENING", "SPEAKING", "READING", "WRITING"] as const;
const LEARNING_STYLES = ["STRUCTURED", "IMMERSIVE", "GAMIFIED", "PRACTICAL"] as const;
const THEMES = ["light", "dark", "system"] as const;

const schema = z.object({
  displayName: z.string().trim().max(50).optional(),
  learningLevel: z.enum(JLPT_LEVELS).optional(),
  levelChoice: z.enum(LEVEL_CHOICES).optional(),
  learningGoal: z.enum(LEARNING_GOALS).optional(),
  focusSkill: z.enum(FOCUS_SKILLS).optional(),
  learningStyle: z.enum(LEARNING_STYLES).optional(),
  dailyGoalMinutes: z.number().int().min(5).max(180).optional(),
  // Validated against the runtime's own list so localDateKey can format with it.
  timezone: z
    .string()
    .max(64)
    .refine(
      (tz) => {
        if (!tz) return true;
        try {
          new Intl.DateTimeFormat("en-CA", { timeZone: tz });
          return true;
        } catch {
          return false;
        }
      },
      { message: "Múi giờ không hợp lệ." },
    )
    .optional(),
  theme: z.enum(THEMES).optional(),
  soundEnabled: z.boolean().optional(),
  onboardingCompleted: z.boolean().optional(),
});

export async function PATCH(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    console.error("[PATCH /api/account] Validation failed:", parsed.error.format(), "Received body:", body);
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ." },
      { status: 400 },
    );
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name: parsed.data.displayName,
      learningLevel: parsed.data.learningLevel,
      levelChoice: parsed.data.levelChoice,
      learningGoal: parsed.data.learningGoal,
      focusSkill: parsed.data.focusSkill,
      learningStyle: parsed.data.learningStyle,
      dailyGoalMinutes: parsed.data.dailyGoalMinutes,
      timezone: parsed.data.timezone,
      theme: parsed.data.theme,
      soundEnabled: parsed.data.soundEnabled,
      onboardingCompleted: parsed.data.onboardingCompleted,
      profile: parsed.data.displayName
        ? { upsert: { create: { displayName: parsed.data.displayName }, update: { displayName: parsed.data.displayName } } }
        : undefined,
    },
    include: { profile: true },
  });
  const { passwordHash: _omit, ...safe } = user;
  return NextResponse.json(safe);
}

export async function DELETE() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.user.delete({ where: { id: userId } });
  return NextResponse.json({ ok: true });
}
