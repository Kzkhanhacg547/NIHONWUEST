"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { NihonQuestLogo } from "@/components/NihonQuestLogo";
import { JapanBackdrop, JapanScenicPanel, NQIcon } from "@/components/JapanIllustration";

function RegisteredNotice() {
  const params = useSearchParams();
  if (!params.get("registered")) return null;
  return <div className="nq-notice nq-notice-ok">✓ Tài khoản đã tạo thành công. Hãy đăng nhập để bắt đầu hành trình.</div>;
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
            <span className={showPassword ? "" : "on"}>Hiện</span>/<span className={showPassword ? "on" : ""}>Ẩn</span>
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
  return (
    <div className="nq-auth">
      <JapanBackdrop />
      <div className="nq-auth-layout">
        <section className="nq-auth-story">
          <Link href="/" data-intro><NihonQuestLogo size="lg" /></Link>
          <div className="nq-auth-copy" data-intro>
            <span className="nq-eyebrow-dot">Học tiếng Nhật, mở ra thế giới.</span>
            <h1>Tiếng Nhật,<br />mở ra một<br /><em>thế giới mới.</em></h1>
            <p>Từ nét chữ đầu tiên đến cuộc trò chuyện bạn hằng mong đợi. Biến mỗi ngày học thành một bước khám phá Nhật Bản.</p>
            <div className="nq-auth-benefits">
              <div className="nq-auth-benefit"><span><NQIcon name="book" /></span><div><b>Học có lộ trình rõ ràng</b><small>Từ bảng chữ cái đến giao tiếp thực tế, thi JLPT và hơn thế nữa.</small></div></div>
              <div className="nq-auth-benefit"><span><NQIcon name="torii" /></span><div><b>Trải nghiệm văn hóa sống động</b><small>Khám phá đất nước, con người và những câu chuyện Nhật Bản.</small></div></div>
              <div className="nq-auth-benefit"><span><NQIcon name="people" /></span><div><b>Cộng đồng đồng hành</b><small>Cùng hàng ngàn người học, chia sẻ và tiến bộ mỗi ngày.</small></div></div>
            </div>
          </div>
          <div className="nq-auth-scene" data-parallax><JapanScenicPanel variant="kyoto" showLabel={false} /></div>
        </section>

        <section className="nq-auth-form-wrap">
          <div className="nq-login-card" data-intro>
            <NihonQuestLogo size="md" />
            <h2>Đăng nhập</h2>
            <p className="nq-login-sub">Đăng nhập an toàn để tiếp tục hành trình học tiếng Nhật của bạn.</p>
            <Suspense><RegisteredNotice /></Suspense>
            <LoginForm />
            <div className="nq-or"><span>Hoặc</span></div>
            <div className="nq-login-footer">Chưa có tài khoản? <Link href="/register">Tạo tài khoản <NQIcon name="arrow" /></Link></div>
          </div>
        </section>
      </div>

      <div className="nq-side-jp" aria-hidden="true">
        <span className="jp-text">日本への旅</span><i />
        <small>YOUR<br />NEXT<br />DESTINATION</small>
      </div>
      <div className="nq-foot-left" aria-hidden="true">NIHON QUEST — VOL. 01<i /></div>
      <div className="nq-foot-right" aria-hidden="true"><span className="jp-text">新しい自分へ、<br />一歩ずつ。</span><b className="nq-stamp">日</b></div>
    </div>
  );
}
