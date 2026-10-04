import nodemailer from "nodemailer";

export interface SendOtpEmailParams {
  to: string;
  code: string;
  type: "REGISTER" | "RESET_PASSWORD";
}

export async function sendOtpEmail({ to, code, type }: SendOtpEmailParams): Promise<{ success: boolean; devPreview?: boolean; error?: string }> {
  const isRegister = type === "REGISTER";
  const title = isRegister ? "Xác nhận tạo tài khoản Nihon Quest 🌸" : "Mã xác nhận khôi phục mật khẩu 🔑";
  const actionText = isRegister ? "xác thực email để tạo tài khoản Nihon Quest" : "khôi phục mật khẩu tài khoản Nihon Quest của bạn";

  const html = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fdf2f8; margin: 0; padding: 24px; }
        .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 24px; border: 1px solid #fbcfe8; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(244, 63, 94, 0.1); }
        .header { background: linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #f59e0b 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
        .logo { font-size: 32px; font-weight: 900; margin-bottom: 8px; }
        .subtitle { font-size: 14px; opacity: 0.9; margin: 0; }
        .content { padding: 32px 28px; color: #334155; line-height: 1.6; }
        .greeting { font-size: 16px; font-weight: bold; margin-bottom: 12px; }
        .otp-box { background: #fff1f2; border: 2px dashed #f43f5e; border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0; }
        .otp-code { font-family: monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #e11d48; margin: 0; }
        .expiry { font-size: 12px; color: #881337; margin-top: 8px; font-weight: bold; }
        .note { font-size: 13px; color: #64748b; margin-top: 20px; }
        .footer { background: #f8fafc; padding: 18px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="logo">🌸 Nihon Quest</div>
          <p class="subtitle">Học Tiếng Nhật Thông Minh & Thú Vị</p>
        </div>
        <div class="content">
          <div class="greeting">Konnichiwa! (Xin chào) 👋</div>
          <p>Bạn nhận được email này vì đã gửi yêu cầu <strong>${actionText}</strong>.</p>
          <div class="otp-box">
            <p style="margin: 0 0 6px 0; font-size: 12px; color: #9f1239; font-weight: bold; text-transform: uppercase;">Mã xác thực OTP của bạn</p>
            <div class="otp-code">${code}</div>
            <div class="expiry">⏱️ Mã có hiệu lực trong vòng 10 phút</div>
          </div>
          <p class="note">⚠️ Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email hoặc đổi mật khẩu để bảo vệ an toàn cho tài khoản.</p>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} Nihon Quest. Chúc bạn học tập thật tốt trên hành trình chinh phục tiếng Nhật！🇯🇵
        </div>
      </div>
    </body>
    </html>
  `;

  const service = process.env.SMTP_SERVICE;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || (user ? `"Nihon Quest 🌸" <${user}>` : `"Nihon Quest" <noreply@nihonquest.local>`);

  // In test environment, skip real sending
  if (process.env.NODE_ENV === "test") {
    return { success: true, devPreview: true };
  }

  // Missing SMTP credentials used to return success:true and print the OTP to
  // stdout, so the user saw "OTP sent" and never received it. In production
  // this must fail loudly; only a real dev server may simulate delivery.
  if (!user || !pass) {
    if (process.env.NODE_ENV === "production") {
      console.error("[EMAIL] SMTP_USER/SMTP_PASS are not configured; refusing to simulate delivery.");
      return {
        success: false,
        error: "Máy chủ chưa cấu hình dịch vụ gửi email. Vui lòng thử lại sau.",
      };
    }
    console.log(`\n================== [DEV EMAIL SIMULATOR - NO CREDENTIALS] ==================`);
    console.log(`📩 TO: ${to}`);
    console.log(`📌 TYPE: ${type}`);
    console.log(`🔑 OTP CODE: [ ${code} ]`);
    console.log(`=============================================================================\n`);
    return { success: true, devPreview: true };
  }

  try {
    const transporter = service === "gmail" || (!host && user.includes("@gmail.com"))
      ? nodemailer.createTransport({
          service: "gmail",
          auth: { user, pass },
          // `logger`/`debug` printed the whole SMTP session, including the OTP,
          // to stdout in production.
          ...(process.env.NODE_ENV === "development" ? { logger: true, debug: true } : {}),
        })
      : nodemailer.createTransport({
          host: host || "smtp.gmail.com",
          port,
          secure: port === 465,
          auth: { user, pass },
        });

    await transporter.sendMail({
      from,
      to,
      subject: title,
      html,
    });

    console.log(`✅ [EMAIL SENT SUCCESSFULLY] to ${to}`);
    return { success: true };
  } catch (error: any) {
    console.error("❌ Failed to send email via SMTP:", error);
    // Never print the OTP on the failure path either.
    return { success: false, error: error?.message || "Lỗi gửi email qua máy chủ SMTP." };
  }
}
