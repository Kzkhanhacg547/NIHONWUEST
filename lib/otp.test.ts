import { describe, it, expect, beforeEach } from "vitest";
import { requestOtp, verifyAndConsumeOtp } from "@/lib/otp";
import { prisma } from "@/lib/prisma";

describe("OTP Service Unit Tests", () => {
  const testEmail = "test_otp_flow@nihonquest.local";

  beforeEach(async () => {
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: {
          contains: testEmail,
        },
      },
    });
  });

  it("generates and verifies OTP code correctly", async () => {
    const res = await requestOtp(testEmail, "REGISTER");
    expect(res.success).toBe(true);
    expect(res.devCode).toBeDefined();

    const code = res.devCode!;
    expect(code).toHaveLength(6);

    // Verify invalid code
    const invalidRes = await verifyAndConsumeOtp(testEmail, "REGISTER", "000000");
    expect(invalidRes.valid).toBe(false);

    // Verify valid code
    const validRes = await verifyAndConsumeOtp(testEmail, "REGISTER", code);
    expect(validRes.valid).toBe(true);

    // Verify consumed code cannot be reused
    const reusedRes = await verifyAndConsumeOtp(testEmail, "REGISTER", code);
    expect(reusedRes.valid).toBe(false);
  });

  it("handles forgot-password OTP isolation", async () => {
    const res = await requestOtp(testEmail, "RESET_PASSWORD");
    expect(res.success).toBe(true);
    const code = res.devCode!;

    // Cannot verify with wrong type
    const wrongType = await verifyAndConsumeOtp(testEmail, "REGISTER", code);
    expect(wrongType.valid).toBe(false);

    // Can verify with right type
    const rightType = await verifyAndConsumeOtp(testEmail, "RESET_PASSWORD", code);
    expect(rightType.valid).toBe(true);
  });
});
