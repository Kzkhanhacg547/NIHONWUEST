"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NihonQuestLogo } from "@/components/NihonQuestLogo";

function PasswordStrength({ password }: { password: string }) {
  const score = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  if (!password) return null;

  const levels = [
    { label: "Quá yếu", color: "bg-rose-500", textColor: "text-rose-500" },
    { label: "Yếu", color: "bg-orange-500", textColor: "text-orange-500" },
    { label: "Trung bình", color: "bg-amber-500", textColor: "text-amber-500" },
    { label: "Tốt", color: "bg-lime-500", textColor: "text-lime-500" },
    { label: "Mạnh！🔒", color: "bg-emerald-500", textColor: "text-emerald-500" },
  ];
  const level = levels[Math.min(score, 4)];

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i <= score ? level.color : "bg-slate-200 dark:bg-slate-700"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-bold ${level.textColor}`}>{level.label}</p>
    </div>
  );
}

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Timer cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Step 1: Request Reset OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          type: "RESET_PASSWORD",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Không thể gửi mã xác thực. Vui lòng kiểm tra lại email！");
        setLoading(false);
        return;
      }

      setStep(2);
      setResendCooldown(60);
    } catch {
      setError("Đã có lỗi xảy ra khi kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          type: "RESET_PASSWORD",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Không thể gửi lại mã.");
      } else {
        setOtpCode("");
        setResendCooldown(60);
      }
    } catch {
      setError("Lỗi kết nối khi gửi lại mã OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit Reset Password with OTP
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (newPassword.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự！");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          otpCode: otpCode.trim(),
          newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Đặt lại mật khẩu thất bại. Vui lòng kiểm tra mã OTP！");
        setLoading(false);
        return;
      }
      setStep(3);
    } catch {
      setError("Lỗi kết nối khi đặt lại mật khẩu.");
      setLoading(false);
    }
  };

  return (
    <div className="nq-auth min-h-[100dvh] flex items-center justify-center p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-gradient-to-br from-slate-50 via-fuji-50/20 to-sakura-50/20 dark:from-slate-950 dark:via-sumi-950 dark:to-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-fuji-300/20 dark:bg-fuji-900/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sakura-300/20 dark:bg-sakura-900/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 flex flex-col items-center">
          <Link href="/" className="inline-block mb-3 hover:scale-105 transition-transform">
            <NihonQuestLogo size="lg" />
          </Link>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Khôi Phục Mật Khẩu</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            {step === 1 && "Nhập email của bạn để nhận mã xác thực OTP đặt lại mật khẩu"}
            {step === 2 && <>Nhập mã OTP và mật khẩu mới cho <span className="break-all">{email}</span></>}
            {step === 3 && "Mật khẩu của bạn đã được cập nhật thành công"}
          </p>
        </div>

        <div className="bg-white/90 dark:bg-sumi-950/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl p-8 space-y-6">

          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label htmlFor="fp-email" className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">📧</span>
                  <input
                    id="fp-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-sumi-900 text-base sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-fuji-400 dark:focus:border-fuji-700 transition"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 px-4 py-3 flex items-center gap-2">
                  <span className="text-rose-500">⚠️</span>
                  <p role="alert" className="text-sm font-bold text-rose-700 dark:text-rose-300">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-fuji-500 to-sakura-500 text-white font-black text-sm tracking-wide shadow-lg shadow-fuji-500/30 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang gửi mã OTP...
                  </span>
                ) : (
                    "📧 Gửi Mã Xác Thực OTP"
                )}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label htmlFor="fp-otp" className="block text-center text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Nhập mã OTP 6 chữ số
                </label>
                <div className="relative">
                  <input
                    id="fp-otp"
                    type="text"
                    required
                    maxLength={6}
                    placeholder="••••••"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full text-center tracking-[12px] font-mono text-2xl font-black py-3 rounded-2xl border-2 border-fuji-300 dark:border-fuji-700 bg-fuji-50/50 dark:bg-sumi-900 text-slate-900 dark:text-white placeholder-slate-300 focus:outline-none focus:border-fuji-500 dark:focus:border-fuji-500 transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="fp-password" className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔒</span>
                  <input
                    id="fp-password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    placeholder="Tối thiểu 8 ký tự"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-sumi-900 text-base sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-fuji-400 dark:focus:border-fuji-700 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    aria-pressed={showPassword}
                    className="absolute right-0 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center text-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition active:scale-90"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                <PasswordStrength password={newPassword} />
              </div>

              <div>
                <label htmlFor="fp-confirm" className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔐</span>
                  <input
                    id="fp-confirm"
                    type={showConfirm ? "text" : "password"}
                    required
                    minLength={8}
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-sumi-900 text-base sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-fuji-400 dark:focus:border-fuji-700 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={showConfirm ? "Ẩn mật khẩu xác nhận" : "Hiện mật khẩu xác nhận"}
                    aria-pressed={showConfirm}
                    className="absolute right-0 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center text-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition active:scale-90"
                  >
                    {showConfirm ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 text-xs px-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="-ml-2 inline-flex min-h-11 items-center rounded-xl px-2 font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition"
                >
                  ← Đổi email khác
                </button>
                <button
                  type="button"
                  disabled={resendCooldown > 0 || loading}
                  onClick={handleResendOtp}
                  className="-mr-2 inline-flex min-h-11 items-center rounded-xl px-2 font-bold text-fuji-600 dark:text-fuji-400 hover:underline disabled:opacity-50 disabled:no-underline"
                >
                  {resendCooldown > 0 ? `Gửi lại sau (${resendCooldown}s)` : "Gửi lại mã OTP"}
                </button>
              </div>

              {error && (
                <div className="rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 px-4 py-3 flex items-center gap-2">
                  <span className="text-rose-500">⚠️</span>
                  <p role="alert" className="text-sm font-bold text-rose-700 dark:text-rose-300">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otpCode.length < 6}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-fuji-500 to-sakura-500 text-white font-black text-sm tracking-wide shadow-lg shadow-fuji-500/30 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang cập nhật mật khẩu...
                  </span>
                ) : (
                  "✨ Đặt Lại Mật Khẩu"
                )}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-3xl flex items-center justify-center mx-auto text-3xl text-emerald-500 shadow-xl shadow-emerald-500/20">
                ✅
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-xl">Đổi mật khẩu thành công！</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Mật khẩu mới của bạn đã được cập nhật an toàn. Hãy đăng nhập lại để tiếp tục hành trình học tập.
                </p>
              </div>
              <Link
                href="/login"
                className="inline-block w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-sm tracking-wide shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                ⛩️ Đăng Nhập Ngay
              </Link>
            </div>
          )}

          <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/login"
              className="inline-flex min-h-11 items-center text-sm font-bold text-sakura-500 hover:text-sakura-600 hover:underline transition"
            >
              ← Quay về Đăng Nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
