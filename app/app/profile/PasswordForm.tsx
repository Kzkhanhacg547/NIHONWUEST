"use client";

import { useState } from "react";
import { Card } from "@/components/ui";

export function PasswordForm() {
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function change(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const data = new FormData(e.currentTarget);
    const res = await fetch("/api/account/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: String(data.get("current") || ""),
        newPassword: String(data.get("next") || ""),
      }),
    });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    setMsg(res.ok ? "Password changed." : (json.error ?? "Change failed."));
    if (res.ok) e.currentTarget.reset();
  }

  return (
    <Card className="p-6">
      <h3 className="text-base font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
        <span>🔑</span> Đổi Mật Khẩu
      </h3>
      <form onSubmit={change} className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Mật khẩu hiện tại
          <input
            name="current"
            type="password"
            required
            minLength={8}
            className="mt-1 w-full min-h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-sumi-900 p-2.5 text-base sm:text-sm text-slate-900 dark:text-white outline-none focus:border-sakura-500"
            placeholder="••••••••"
          />
        </label>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Mật khẩu mới
          <input
            name="next"
            type="password"
            required
            minLength={8}
            className="mt-1 w-full min-h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-sumi-900 p-2.5 text-base sm:text-sm text-slate-900 dark:text-white outline-none focus:border-sakura-500"
            placeholder="Tối thiểu 8 ký tự"
          />
        </label>
        <div className="sm:col-span-2 flex items-center gap-4 pt-2">
          <button
            disabled={busy}
            type="submit"
            className="min-h-11 rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-sumi-800 transition disabled:opacity-50"
          >
            {busy ? "Đang đổi..." : "Cập nhật mật khẩu"}
          </button>
          {msg ? <p role="status" className="text-sm font-semibold text-sakura-600 dark:text-sakura-400">{msg === "Password changed." ? "Đã đổi mật khẩu thành công! ✅" : (msg === "Change failed." ? "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại." : msg)}</p> : null}
        </div>
      </form>
    </Card>
  );
}
