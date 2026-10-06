"use client";

import { useState } from "react";
import { SectionHead, field, labelCls, btnGhost, panel } from "./parts";

export function PasswordForm() {
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  async function change(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true);
    setMsg(null);
    const data = new FormData(form);
    try {
      const res = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: String(data.get("current") || ""), newPassword: String(data.get("next") || "") }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) { setMsg({ text: "Đã đổi mật khẩu thành công.", ok: true }); form.reset(); }
      else setMsg({ text: json.error ?? "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại.", ok: false });
    } catch {
      setMsg({ text: "Không thể kết nối. Vui lòng thử lại.", ok: false });
    } finally {
      setBusy(false);
    }
  }

  const type = show ? "text" : "password";

  return (
    <section className={panel}>
      <SectionHead icon="lock" title="Đổi mật khẩu" desc="Dùng mật khẩu dài ít nhất 8 ký tự để bảo vệ tài khoản." />
      <form onSubmit={change} className="grid gap-4 px-5 py-6 sm:grid-cols-2 sm:px-6">
        <label className={labelCls}>Mật khẩu hiện tại
          <input name="current" type={type} required minLength={8} autoComplete="current-password" className={field} placeholder="••••••••" />
        </label>
        <label className={labelCls}>Mật khẩu mới
          <input name="next" type={type} required minLength={8} autoComplete="new-password" className={field} placeholder="Tối thiểu 8 ký tự" />
        </label>
        <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500" />
            Hiện mật khẩu
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {msg ? <p role="status" className={`text-sm font-semibold ${msg.ok ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>{msg.text}</p> : null}
            <button type="submit" disabled={busy} className={btnGhost}>{busy ? "Đang đổi..." : "Cập nhật mật khẩu"}</button>
          </div>
        </div>
      </form>
    </section>
  );
}
