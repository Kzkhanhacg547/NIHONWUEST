import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requestOtp } from "@/lib/otp";
import { enforceRateLimit } from "@/lib/rateLimit";

const schema = z.object({
  email: z.string().email("Địa chỉ email không hợp lệ."),
  type: z.enum(["REGISTER", "RESET_PASSWORD"]),
});

export async function POST(req: Request) {
  const limited = enforceRateLimit(req, "otp-send", 5, 10 * 60_000);
  if (limited) return limited;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[parsed.error.issues.length - 1]?.message || "Dữ liệu yêu cầu không hợp lệ." },
      { status: 400 }
    );
  }

  const { email, type } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();

  // Per-email cap on top of the per-IP one, so one address cannot be spammed
  // from rotating IPs.
  const emailLimited = enforceRateLimit(
    new Request("http://local", { headers: { "x-forwarded-for": normalizedEmail } }),
    "otp-send-email",
    3,
    10 * 60_000
  );
  if (emailLimited) return emailLimited;

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  // Previously this returned 409 for a known REGISTER address and 404 for an
  // unknown RESET address, which let anyone enumerate registered accounts.
  // The response is now identical either way.
  if ((type === "REGISTER" && user) || (type === "RESET_PASSWORD" && !user)) {
    return NextResponse.json({
      success: true,
      message: "Mã xác thực OTP đã được gửi đến email của bạn.",
    });
  }

  const result = await requestOtp(normalizedEmail, type);
  if (!result.success) {
    return NextResponse.json({ error: result.error || "Không thể gửi mã OTP." }, { status: 429 });
  }

  return NextResponse.json({
    success: true,
    message: "Mã xác thực OTP đã được gửi đến email của bạn.",
    // devCode only exposed in test environment (NODE_ENV=test), never in development or production
    ...(process.env.NODE_ENV === "test" && result.devCode ? { devCode: result.devCode } : {}),
  });
}
