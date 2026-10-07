"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { NihonQuestLogo } from "@/components/NihonQuestLogo";

/* ───────────────────────── Icons ───────────────────────── */

const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const UserIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);
const MailIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </svg>
);
const LockIcon = () => (
  <svg {...iconProps}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
  </svg>
);
const EyeIcon = () => (
  <svg {...iconProps} width={20} height={20}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
  <svg {...iconProps} width={20} height={20}>
    <path d="M3 3l18 18" />
    <path d="M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.5 6.6C3.8 8.4 2 12 2 12s3.6 7 10 7c1.6 0 3-.4 4.3-1" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  </svg>
);
const CheckIcon = () => (
  <svg {...iconProps} width={18} height={18} strokeWidth={2.75}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
const ShieldIcon = () => (
  <svg {...iconProps} width={13} height={13} strokeWidth={2.25}>
    <path d="M12 3 5 6v5c0 4.5 3 8.2 7 10 4-1.8 7-5.5 7-10V6l-7-3Z" />
    <path d="m9 12 2.2 2.2L15 10.4" />
  </svg>
);

/* ───────────────────────── Password strength ───────────────────────── */

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
    { label: "Quá yếu", textColor: "text-rose-500" },
    { label: "Yếu", textColor: "text-orange-500" },
    { label: "Trung bình", textColor: "text-amber-500" },
    { label: "Tốt", textColor: "text-pink-500" },
    { label: "Mạnh!", textColor: "text-rose-500" },
  ];
  const level = levels[Math.min(Math.max(score - 1, 0), 4)];

  return (
    <div className="mt-2.5">
      <div className="flex gap-1.5 mb-1.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i <= score
                ? "bg-gradient-to-r from-rose-400 to-pink-500"
                : "bg-rose-100 dark:bg-slate-700"
            }`}
          />
        ))}
      </div>
      <p className={`flex items-center gap-1 text-xs font-bold ${level.textColor}`}>
        {level.label}
        {score === 5 && <ShieldIcon />}
      </p>
    </div>
  );
}

/* ───────────────────────── Shared UI ───────────────────────── */

const fieldWrap =
  "relative flex items-center rounded-2xl border border-rose-100 dark:border-slate-700 bg-white/80 dark:bg-sumi-900 shadow-[0_2px_10px_-4px_rgba(244,114,182,0.25)] transition focus-within:border-sakura-400 focus-within:ring-4 focus-within:ring-sakura-200/50 dark:focus-within:ring-sakura-900/30";
const inputCls =
  "w-full bg-transparent py-3.5 pl-12 text-base sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none";
const labelCls =
  "mb-1.5 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-700/80 dark:text-slate-400";
const leftIcon =
  "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-rose-400 dark:text-sakura-400";
const rightCheck =
  "pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500";
const eyeBtn =
  "absolute right-1 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center text-slate-500 hover:text-rose-500 dark:hover:text-slate-200 transition active:scale-90";
const primaryBtn =
  "relative w-full overflow-hidden py-4 rounded-full bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 text-white font-black text-[15px] tracking-wide shadow-lg shadow-rose-400/40 hover:shadow-xl hover:shadow-rose-400/50 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:hover:scale-100";

const FEATURES = [
  { icon: "⏰", title: "Học mọi lúc", sub: "Linh hoạt thời gian", tint: "bg-orange-100" },
  { icon: "🧭", title: "Lộ trình cá nhân hóa", sub: "Phù hợp với bạn", tint: "bg-violet-100" },
  { icon: "👥", title: "Cộng đồng năng động", sub: "Cùng bạn bè", tint: "bg-rose-100" },
  { icon: "📈", title: "Tiến bộ mỗi ngày", sub: "Chinh phục mục tiêu", tint: "bg-sky-100" },
];

/* ───────────────────────── Page ───────────────────────── */

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

  const nameOk = displayName.trim().length > 0;
  const emailOk = /^\S+@\S+\.\S+$/.test(email.trim());
  const confirmOk = confirm.length > 0 && confirm === password;

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
      setError("Mật khẩu phải có ít nhất 8 ký tự!");
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
        setError(data.error || "Không thể gửi mã xác nhận. Vui lòng thử lại!");
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
        setError(json.error || "Đăng ký thất bại. Vui lòng kiểm tra mã OTP!");
        setLoading(false);
        return;
      }
      router.push("/login?registered=1");
    } catch {
      setError("Lỗi kết nối khi tạo tài khoản. Vui lòng thử lại.");
      setLoading(false);
    }
  }

  const errorBox = error && (
    <div className="rounded-2xl bg-rose-50/90 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 px-4 py-3 flex items-center gap-2">
      <span className="text-rose-500">⚠️</span>
      <p role="alert" className="text-sm font-bold text-rose-700 dark:text-rose-300">
        {error}
      </p>
    </div>
  );

  return (
    <div className="nq-auth relative min-h-[100dvh] overflow-x-hidden bg-rose-50 dark:bg-slate-950">
      {/* ── Background illustration ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/images/auth/register-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* soft veil so the card & text stay readable */}
        <div className="absolute inset-0 bg-white/25 sm:bg-white/10 dark:bg-slate-950/60" />
      </div>

      {/* ── Logo (top-left on desktop) ── */}
      <header className="absolute left-4 top-4 z-20 hidden md:block lg:left-9 lg:top-7">
        <Link
          href="/"
          className="inline-flex items-center rounded-2xl border border-white/80 bg-white/85 px-4 py-2.5 shadow-lg shadow-rose-300/30 backdrop-blur-md transition-transform hover:scale-105 dark:border-slate-700 dark:bg-sumi-950/85"
        >
          <NihonQuestLogo size="lg" />
        </Link>
      </header>

      <main className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-4 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:py-10">
        {/* Logo (mobile) */}
        <Link
          href="/"
          className="mb-4 inline-flex items-center rounded-2xl border border-white/80 bg-white/85 px-4 py-2.5 shadow-lg shadow-rose-300/30 backdrop-blur-md md:hidden dark:border-slate-700 dark:bg-sumi-950/85"
        >
          <NihonQuestLogo size="lg" />
        </Link>

        {/* ── Card ── */}
        <div className="relative w-full max-w-[520px] rounded-[2rem] border border-white/80 dark:border-slate-800/80 bg-white/75 dark:bg-sumi-950/85 p-4 shadow-[0_30px_80px_-20px_rgba(244,63,94,0.35)] backdrop-blur-xl sm:p-5">
          {/* Heading */}
          <div className="px-2 pb-4 pt-3 text-center">
            <h1 className="flex items-center justify-center gap-3 text-[1.7rem] font-black leading-tight text-[#7a1f3d] dark:text-white sm:text-[1.9rem]">
              <span aria-hidden className="text-xl opacity-90">🌸</span>
              {step === 1 ? "Tạo Tài Khoản" : "Xác Thực Email"}
              <span aria-hidden className="text-xl opacity-90">🌸</span>
            </h1>
            <p className="mt-1.5 break-words text-xs text-slate-500 dark:text-slate-400">
              {step === 1 ? (
                "Bắt đầu hành trình chinh phục tiếng Nhật của bạn ngay hôm nay! 🌸"
              ) : (
                <>
                  Mã OTP đã được gửi đến <span className="break-all font-bold text-rose-600">{email}</span>
                </>
              )}
            </p>
          </div>

          {/* Inner panel */}
          <div className="rounded-3xl border border-rose-100/80 dark:border-slate-800 bg-white/70 dark:bg-sumi-950/60 p-4 sm:p-5">
            {step === 1 ? (
              /* ───────── STEP 1 ───────── */
              <form onSubmit={handleSendOtp} className="space-y-4">
                {/* Display name */}
                <div>
                  <label htmlFor="reg-name" className={labelCls}>
                    <span className="text-rose-500"><UserIcon /></span>
                    Tên hiển thị
                  </label>
                  <div className={fieldWrap}>
                    <span className={leftIcon}>😊</span>
                    <input
                      id="reg-name"
                      name="displayName"
                      required
                      autoComplete="nickname"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Tên của bạn"
                      className={`${inputCls} pr-12`}
                    />
                    {nameOk && <span className={rightCheck}><CheckIcon /></span>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="reg-email" className={labelCls}>
                    <span className="text-rose-500"><MailIcon /></span>
                    Email xác nhận
                  </label>
                  <div className={fieldWrap}>
                    <span className={`${leftIcon}`}><MailIcon /></span>
                    <input
                      id="reg-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className={`${inputCls} pr-12`}
                    />
                    {emailOk && <span className={rightCheck}><CheckIcon /></span>}
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="reg-password" className={labelCls}>
                    <span className="text-rose-500"><LockIcon /></span>
                    Mật khẩu
                  </label>
                  <div className={fieldWrap}>
                    <span className={leftIcon}><LockIcon /></span>
                    <input
                      id="reg-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="Tối thiểu 8 ký tự"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${inputCls} pr-14`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      aria-pressed={showPassword}
                      className={eyeBtn}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  <PasswordStrength password={password} />
                </div>

                {/* Confirm password */}
                <div>
                  <label htmlFor="reg-confirm" className={labelCls}>
                    <span className="text-rose-500"><LockIcon /></span>
                    Xác nhận mật khẩu
                  </label>
                  <div className={fieldWrap}>
                    <span className={leftIcon}><LockIcon /></span>
                    <input
                      id="reg-confirm"
                      name="confirm"
                      type={showConfirm ? "text" : "password"}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="Nhập lại mật khẩu"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className={`${inputCls} ${confirmOk ? "pr-24" : "pr-14"}`}
                    />
                    {confirmOk && (
                      <span className="pointer-events-none absolute right-12 top-1/2 -translate-y-1/2 text-emerald-500">
                        <CheckIcon />
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      aria-label={showConfirm ? "Ẩn mật khẩu xác nhận" : "Hiện mật khẩu xác nhận"}
                      aria-pressed={showConfirm}
                      className={eyeBtn}
                    >
                      {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                {errorBox}

                <button type="submit" disabled={loading} className={primaryBtn}>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Đang gửi mã OTP qua Email...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      <span aria-hidden className="text-white/70">✦</span>
                      Tiếp Tục &amp; Nhận Mã OTP 📧
                      <span aria-hidden className="text-white/70">✦</span>
                    </span>
                  )}
                </button>
              </form>
            ) : (
              /* ───────── STEP 2 ───────── */
              <form onSubmit={handleCompleteRegister} className="space-y-4">
                <div className="py-1 text-center">
                  <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 text-2xl shadow-inner dark:from-sakura-950 dark:to-sakura-950">
                    📬
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Vui lòng kiểm tra hộp thư đến (hoặc hòm thư Spam/Rác) của <br />
                    <strong className="break-all text-slate-800 dark:text-slate-200">{email}</strong>
                  </p>
                </div>

                <div>
                  <label htmlFor="reg-otp" className="mb-2 block text-center text-xs font-black uppercase tracking-wider text-rose-700/80 dark:text-slate-400">
                    Nhập mã xác thực 6 chữ số
                  </label>
                  <input
                    id="reg-otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                    maxLength={6}
                    placeholder="••••••"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full rounded-2xl border-2 border-rose-200 bg-white/90 py-3.5 text-center font-mono text-2xl font-black tracking-[12px] text-slate-900 placeholder-slate-300 shadow-[0_2px_10px_-4px_rgba(244,114,182,0.35)] transition focus:border-sakura-500 focus:outline-none focus:ring-4 focus:ring-sakura-200/50 dark:border-sakura-700 dark:bg-sumi-900 dark:text-white"
                  />
                  <p className="mt-1.5 text-center text-[11px] text-slate-400">
                    Mã xác nhận có hiệu lực trong vòng 10 phút
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 px-1 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setStep(1);
                    }}
                    className="-ml-2 inline-flex min-h-11 items-center rounded-xl px-2 font-bold text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    ← Đổi thông tin
                  </button>
                  <button
                    type="button"
                    disabled={resendCooldown > 0 || loading}
                    onClick={handleResendOtp}
                    className="-mr-2 inline-flex min-h-11 items-center rounded-xl px-2 font-bold text-rose-600 hover:underline disabled:no-underline disabled:opacity-50 dark:text-sakura-400"
                  >
                    {resendCooldown > 0 ? `Gửi lại sau (${resendCooldown}s)` : "Gửi lại mã OTP"}
                  </button>
                </div>

                {errorBox}

                <button type="submit" disabled={loading || otpCode.length < 6} className={primaryBtn}>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Đang xác thực &amp; tạo tài khoản...
                    </span>
                  ) : (
                    "🌸 Xác Nhận & Tạo Tài Khoản"
                  )}
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="relative mt-5 mb-3 flex items-center">
              <div className="h-px flex-1 bg-rose-100 dark:bg-slate-800" />
              <span className="px-3 text-[11px] text-rose-300">hoặc</span>
              <div className="h-px flex-1 bg-rose-100 dark:bg-slate-800" />
            </div>

            <p className="text-center text-sm text-slate-500">
              Đã có tài khoản?{" "}
              <Link href="/login" className="font-black text-rose-500 transition hover:text-rose-600 hover:underline">
                Đăng nhập ngay ⛩️
              </Link>
            </p>
          </div>
        </div>

        {/* ── Feature strip (desktop) ── */}
        <ul className="mt-6 hidden w-full max-w-4xl grid-cols-4 gap-2 rounded-[1.75rem] border border-white/80 bg-white/70 p-3 shadow-lg shadow-rose-200/40 backdrop-blur-md lg:grid dark:border-slate-800 dark:bg-sumi-950/70">
          {FEATURES.map((f) => (
            <li key={f.title} className="flex items-center gap-3 rounded-2xl px-3 py-2">
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-xl ${f.tint}`}>
                {f.icon}
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block truncate text-[13px] font-bold text-slate-700 dark:text-slate-200">{f.title}</span>
                <span className="block truncate text-[11px] text-slate-400">{f.sub}</span>
              </span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}