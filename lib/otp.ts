import { randomInt } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rateLimit";

export type OtpType = "REGISTER" | "RESET_PASSWORD";

/** Wrong-code attempts allowed per identifier before a temporary lockout. */
const MAX_VERIFY_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60_000;

function getIdentifier(type: OtpType, email: string): string {
  return `${type}:${email.trim().toLowerCase()}`;
}

export async function requestOtp(email: string, type: OtpType): Promise<{ success: boolean; error?: string; devCode?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const identifier = getIdentifier(type, normalizedEmail);

  // Check if there is an active unexpired token created recently (< 60 seconds ago)
  const existing = await prisma.verificationToken.findFirst({
    where: { identifier },
  });

  if (existing) {
    const timeUntilExpiry = existing.expires.getTime() - Date.now();
    // Expiration is 10 min (600,000 ms). If remaining time > 9 min (540,000 ms), it was sent less than 60s ago.
    if (timeUntilExpiry > 9 * 60 * 1000) {
      const waitSec = Math.ceil((timeUntilExpiry - 9 * 60 * 1000) / 1000);
      return {
        success: false,
        error: `Vui lòng đợi ${waitSec} giây trước khi yêu cầu gửi lại mã mới.`,
      };
    }

    // Delete old tokens for this identifier
    await prisma.verificationToken.deleteMany({
      where: { identifier },
    });
  }

  // Math.random() is not cryptographically secure. A 6-digit OTP guarding
  // account registration and password reset must be.
  const code = randomInt(100000, 1000000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.verificationToken.create({
    data: {
      identifier,
      token: code,
      expires,
    },
  });

  const mailRes = await sendOtpEmail({
    to: normalizedEmail,
    code,
    type,
  });

  return {
    success: mailRes.success,
    error: mailRes.error,
    devCode: (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test" || mailRes.devPreview) ? code : undefined,
  };
}

export async function verifyAndConsumeOtp(email: string, type: OtpType, code?: string): Promise<{ valid: boolean; error?: string }> {
  const normalizedEmail = (email || "").trim().toLowerCase();
  const identifier = getIdentifier(type, normalizedEmail);

  // Unlimited guesses against a 6-digit code inside a 10-minute window is an
  // account-takeover path, so wrong attempts lock the identifier out.
  const attempt = rateLimit(`otp-verify:${identifier}`, MAX_VERIFY_ATTEMPTS, LOCKOUT_MS);
  if (!attempt.ok) {
    return {
      valid: false,
      error: `Bạn đã thử quá nhiều lần. Vui lòng yêu cầu mã OTP mới sau ${Math.ceil(
        attempt.retryAfterSeconds / 60,
      )} phút.`,
    };
  }

  if (!code || typeof code !== "string") {
    return { valid: false, error: "Mã xác thực OTP không đúng hoặc đã hết hạn." };
  }
  const cleanCode = code.trim();

  const record = await prisma.verificationToken.findFirst({
    where: {
      identifier,
      token: cleanCode,
    },
  });

  if (!record) {
    return { valid: false, error: "Mã xác thực OTP không đúng hoặc đã hết hạn." };
  }

  if (record.expires.getTime() < Date.now()) {
    // Delete expired token
    await prisma.verificationToken.deleteMany({ where: { identifier } });
    return { valid: false, error: "Mã xác thực OTP đã hết hạn. Vui lòng nhận mã mới." };
  }

  // Valid -> consume token and reset the attempt counter.
  await prisma.verificationToken.deleteMany({ where: { identifier } });

  return { valid: true };
}
