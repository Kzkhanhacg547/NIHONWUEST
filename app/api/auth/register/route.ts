import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyAndConsumeOtp } from "@/lib/otp";
import { enforceRateLimit } from "@/lib/rateLimit";

const schema = z.object({
  email: z.string().email("Địa chỉ email không hợp lệ."),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự."),
  displayName: z.string().min(1, "Tên hiển thị không được để trống.").max(50),
  otpCode: z.string().min(6, "Mã xác thực OTP gồm 6 chữ số."),
  learningLevel: z.string().optional().default("N5"),
  learningGoal: z.string().optional().default("TRAVEL"),
  levelChoice: z.string().optional().default("N5"),
  focusSkill: z.string().optional().default("BALANCED"),
  learningStyle: z.string().optional().default("STRUCTURED"),
  dailyGoalMinutes: z.number().min(5).max(180).optional().default(15),
});

export async function POST(req: Request) {
  const limited = enforceRateLimit(req, "register", 5, 15 * 60_000);
  if (limited) return limited;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Dữ liệu đăng ký không hợp lệ." },
      { status: 400 }
    );
  }
  const email = parsed.data.email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email này đã được đăng ký tài khoản." }, { status: 409 });
  }

  const otpCheck = await verifyAndConsumeOtp(email, "REGISTER", parsed.data.otpCode);
  if (!otpCheck.valid) {
    return NextResponse.json(
      { error: otpCheck.error || "Mã xác thực OTP không chính xác hoặc đã hết hạn." },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: parsed.data.displayName,
      emailVerified: new Date(),
      learningLevel: parsed.data.learningLevel,
      learningGoal: parsed.data.learningGoal,
      levelChoice: parsed.data.levelChoice,
      focusSkill: parsed.data.focusSkill,
      learningStyle: parsed.data.learningStyle,
      dailyGoalMinutes: parsed.data.dailyGoalMinutes,
      profile: { create: { displayName: parsed.data.displayName } },
    },
  });
  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}
