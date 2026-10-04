"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Form inputs
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Step 1: Send OTP to email
  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự！");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          type: "REGISTER",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Không thể gửi mã xác nhận. Vui lòng thử lại！");
        setLoading(false);
        return;
      }

      setStep(2);
      setResendCooldown(60);
    } catch {
      setError("Đã có lỗi xảy ra khi kết nối máy chủ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  // Resend OTP
  async function handleResendOtp() {
    if (resendCooldown > 0 || loading) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          type: "REGISTER",
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
  }

  // Step 2: Verify OTP and create account
  async function handleCompleteRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim(),
          email: email.trim(),
          password,
          otpCode: otpCode.trim(),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "Đăng ký thất bại. Vui lòng kiểm tra mã OTP！");
        setLoading(false);
        return;
      }
      router.push("/login?registered=1");
    } catch {
      setError("Lỗi kết nối khi tạo tài khoản. Vui lòng thử lại.");
      setLoading(false);
    }
  }

  return (
    <div className="nq-auth min-h-[100dvh] flex items-center justify-center p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-gradient-to-br from-slate-50 via-sakura-50/30 to-fuji-50/20 dark:from-slate-950 dark:via-sumi-950 dark:to-slate-950">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-sakura-300/20 dark:bg-sakura-900/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-fuji-300/20 dark:bg-fuji-900/10 rounded-full blur-3xl" />
        {["桜", "日", "本", "語", "夢"].map((char, i) => (
          <div
            key={i}
            className="absolute text-sakura-200 dark:text-sakura-900/40 font-black opacity-30 select-none"
            style={{
              fontSize: `${50 + i * 20}px`,
              top: `${12 + i * 18}%`,
              left: `${8 + i * 20}%`,
              transform: `rotate(${-15 + i * 10}deg)`,
            }}
          >
            {char}
          </div>
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-6 flex flex-col items-center">
          <Link href="/" className="inline-block mb-2 hover:scale-105 transition-transform">
            <NihonQuestLogo size="lg" />
          </Link>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {step === 1 ? "Tạo Tài Khoản" : "Xác Thực Email"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 break-words">
            {step === 1
              ? "Bắt đầu hành trình tiếng Nhật của bạn hôm nay！🌸"
              : <>Mã OTP đã được gửi đến <span className="break-all">{email}</span></>}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/90 dark:bg-sumi-950/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl p-5 sm:p-8 space-y-5">

          {step === 1 ? (
            /* STEP 1: Registration info */
            <form onSubmit={handleSendOtp} className="space-y-4">
              {/* Display Name */}
              <div>
                <label htmlFor="reg-name" className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Tên hiển thị
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">😊</span>
                  <input
                    id="reg-name"
                    name="displayName"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Tên của bạn"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-sumi-900 text-base sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sakura-400 dark:focus:border-sakura-700 transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="reg-email" className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Email xác nhận
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">📧</span>
                  <input
                    id="reg-email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-sumi-900 text-base sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sakura-400 dark:focus:border-sakura-700 transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="reg-password" className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Mật khẩu
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔒</span>
                  <input
                    id="reg-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    placeholder="Tối thiểu 8 ký tự"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-sumi-900 text-base sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sakura-400 dark:focus:border-sakura-700 transition"
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
                <PasswordStrength password={password} />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="reg-confirm" className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔐</span>
                  <input
                    id="reg-confirm"
                    name="confirm"
                    type={showConfirm ? "text" : "password"}
                    required
                    minLength={8}
                    placeholder="Nhập lại mật khẩu"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-sumi-900 text-base sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sakura-400 dark:focus:border-sakura-700 transition"
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

              {error && (
                <div className="rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 px-4 py-3 flex items-center gap-2">
                  <span className="text-rose-500">⚠️</span>
                  <p role="alert" className="text-sm font-bold text-rose-700 dark:text-rose-300">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sakura-500 via-rose-500 to-sakura-600 text-white font-black text-sm tracking-wide shadow-lg shadow-sakura-500/30 hover:shadow-xl hover:shadow-sakura-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang gửi mã OTP qua Email...
                  </span>
                ) : (
                  "Tiếp Tục & Nhận Mã OTP 📧"
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: Input OTP */
            <form onSubmit={handleCompleteRegister} className="space-y-4">
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-2xl bg-sakura-100 dark:bg-sakura-950 text-sakura-600 dark:text-sakura-400 flex items-center justify-center mx-auto mb-2 text-2xl font-black">
                  📬
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Vui lòng kiểm tra hộp thư đến (hoặc hòm thư Spam/Rác) của <br />
                  <strong className="text-slate-800 dark:text-slate-200 break-all">{email}</strong>
                </p>
              </div>

              <div>
                <label htmlFor="reg-otp" className="block text-center text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Nhập mã xác thực 6 chữ số
                </label>
                <div className="relative">
                  <input
                    id="reg-otp"
                    type="text"
                    required
                    maxLength={6}
                    placeholder="••••••"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full text-center tracking-[12px] font-mono text-2xl font-black py-3 rounded-2xl border-2 border-sakura-300 dark:border-sakura-700 bg-sakura-50/50 dark:bg-sumi-900 text-slate-900 dark:text-white placeholder-slate-300 focus:outline-none focus:border-sakura-500 dark:focus:border-sakura-500 transition"
                  />
                </div>
                <p className="text-[11px] text-center text-slate-400 mt-1">Mã xác nhận có hiệu lực trong vòng 10 phút</p>
              </div>

              <div className="flex items-center justify-between gap-2 text-xs px-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="-ml-2 inline-flex min-h-11 items-center rounded-xl px-2 font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition"
                >
                  ← Đổi thông tin
                </button>
                <button
                  type="button"
                  disabled={resendCooldown > 0 || loading}
                  onClick={handleResendOtp}
                  className="-mr-2 inline-flex min-h-11 items-center rounded-xl px-2 font-bold text-sakura-600 dark:text-sakura-400 hover:underline disabled:opacity-50 disabled:no-underline"
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
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sakura-500 via-rose-500 to-sakura-600 text-white font-black text-sm tracking-wide shadow-lg shadow-sakura-500/30 hover:shadow-xl hover:shadow-sakura-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang xác thực & tạo tài khoản...
                  </span>
                ) : (
                  "🌸 Xác Nhận & Tạo Tài Khoản"
                )}
              </button>
            </form>
          )}

          <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-500">
              Đã có tài khoản？{" "}
              <Link href="/login" className="font-black text-sakura-500 hover:text-sakura-600 hover:underline transition">
                Đăng nhập ngay ⛩️
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
