"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Sriracha } from "next/font/google";
import "./login.css";
import { NihonQuestLogo } from "@/components/NihonQuestLogo";
import { NQIcon } from "@/components/JapanIllustration";

const brush = Sriracha({ subsets: ["latin", "vietnamese"], weight: "400", display: "swap" });

function RegisteredNotice() {
  const params = useSearchParams();
  if (!params.get("registered")) return null;
  return <div className="nq-notice nq-notice-ok">✓ Tài khoản đã tạo thành công. Hãy đăng nhập để bắt đầu hành trình.</div>;
}

const AUTH_ERRORS: Record<string, string> = {
  OAuthAccountNotLinked: "Email này đã đăng ký bằng mật khẩu. Hãy đăng nhập bằng email và mật khẩu.",
  OAuthSignin: "Không thể bắt đầu đăng nhập Google. Kiểm tra GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET.",
  OAuthCallback: "Google trả về lỗi. Kiểm tra Authorized redirect URI trong Google Cloud Console.",
  OAuthCreateAccount: "Không tạo được tài khoản từ Google. Kiểm tra database / adapter.",
  Configuration: "Cấu hình NextAuth chưa đúng (thiếu provider Google, NEXTAUTH_SECRET hoặc NEXTAUTH_URL).",
  AccessDenied: "Bạn không có quyền đăng nhập bằng tài khoản này.",
  Callback: "Có lỗi trong bước xác thực. Vui lòng thử lại.",
};

function AuthErrorNotice() {
  const params = useSearchParams();
  const code = params.get("error");
  if (!code) return null;
  return (
    <div role="alert" className="nq-notice nq-notice-err" style={{ marginBottom: 14 }}>
      {AUTH_ERRORS[code] ?? "Đăng nhập không thành công. Vui lòng thử lại."} <small>({code})</small>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
      <path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      redirect: false,
      email: String(data.get("email") || ""),
      password: String(data.get("password") || ""),
    });
    if (res?.error) {
      setError("Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
      setLoading(false);
      return;
    }
    router.push("/app");
  }

  return (
    <form onSubmit={onSubmit} className="nq-login-form">
      <div className="nq-field">
        <label htmlFor="login-email">Email</label>
        <div className="nq-input-wrap">
          <span className="nq-input-icon"><NQIcon name="mail" /></span>
          <input id="login-email" autoComplete="email" name="email" type="email" required placeholder="Nhập địa chỉ email của bạn" />
        </div>
      </div>

      <div className="nq-field">
        <label htmlFor="login-password">Mật khẩu</label>
        <div className="nq-input-wrap">
          <span className="nq-input-icon"><NQIcon name="lock" /></span>
          <input id="login-password" autoComplete="current-password" name="password" type={showPassword ? "text" : "password"} required placeholder="Nhập mật khẩu" />
          <button type="button" className="nq-password-toggle" aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} onClick={() => setShowPassword((v) => !v)}>
            <NQIcon name="eye" />
            <span>{showPassword ? "Ẩn" : "Hiện"}</span>
          </button>
        </div>
      </div>

      <div className="nq-remember">
        <label><input type="checkbox" defaultChecked /> Ghi nhớ đăng nhập</label>
        <Link href="/forgot-password">Quên mật khẩu?</Link>
      </div>

      {error && <div role="alert" className="nq-notice nq-notice-err">{error}</div>}

      <button type="submit" disabled={loading} className="nq-submit-red" data-magnetic>
        <span>{loading ? "Đang đăng nhập..." : "Đăng nhập"}</span>
        <NQIcon name="arrow" />
      </button>
    </form>
  );
}

export default function LoginPage() {
  const [googleLoading, setGoogleLoading] = useState(false);

  return (
    <div className="nq-auth">
      <div
        className="nq-auth-bg"
        aria-hidden="true"
        style={{ backgroundImage: "url(/images/auth/login-bg.jpg)" }}
      />

      <div className="nq-auth-layout">
        <section className="nq-auth-story">
          <Link href="/" data-intro><NihonQuestLogo size="md" /></Link>

          <div className="nq-auth-copy" data-intro>
            <span className="nq-eyebrow-dot">Học tiếng Nhật, mở ra thế giới.</span>
            <h1 className={brush.className}>Tiếng Nhật,<br />mở ra một<br /><em></em></h1>
            <p>Từ nét chữ đầu tiên đến cuộc trò chuyện bạn hằng mong đợi. Biến mỗi ngày học thành một bước khám phá Nhật Bản.</p>
          </div>

          <div className="nq-auth-benefits" data-intro>
            <div className="nq-auth-benefit"><span><NQIcon name="book" /></span><div><b>Học có lộ trình<br />rõ ràng</b><small>Từ bảng chữ cái đến giao tiếp thực tế, thi JLPT và hơn thế nữa.</small></div></div>
            <div className="nq-auth-benefit"><span><NQIcon name="torii" /></span><div><b>Trải nghiệm<br />văn hóa sống động</b><small>Khám phá đất nước, con người và những câu chuyện Nhật Bản.</small></div></div>
            <div className="nq-auth-benefit"><span><NQIcon name="people" /></span><div><b>Cộng đồng<br />đồng hành</b><small>Cùng hàng ngàn người học, chia sẻ và tiến bộ mỗi ngày.</small></div></div>
          </div>
        </section>

        <section className="nq-auth-form-wrap">
          <div className="nq-login-card" data-intro>
            <NihonQuestLogo size="md" />
            <h2>Đăng nhập</h2>
            <p className="nq-login-sub">Đăng nhập an toàn để tiếp tục hành trình học tiếng Nhật của bạn.</p>
            <Suspense><RegisteredNotice /><AuthErrorNotice /></Suspense>
            <LoginForm />
            <div className="nq-or"><span>Hoặc</span></div>
            <button
              type="button"
              className="nq-google"
              disabled={googleLoading}
              onClick={() => {
                setGoogleLoading(true);
                signIn("google", { callbackUrl: "/app" }).catch(() => setGoogleLoading(false));
              }}
            >
              <GoogleIcon />
              <span>Đăng nhập bằng Google</span>
            </button>
            <div className="nq-login-footer">Chưa có tài khoản? <Link href="/register">Tạo tài khoản <NQIcon name="arrow" /></Link></div>
          </div>
        </section>
      </div>
    </div>
  );
}