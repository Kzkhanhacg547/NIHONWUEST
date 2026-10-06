"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SectionHead, btnGhost, panel } from "./parts";

export function DangerZone() {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    await signOut({ redirect: false });
    router.push("/login");
  }

  async function remove() {
    if (!confirm("Bạn có chắc chắn muốn xóa tài khoản và toàn bộ dữ liệu học tập không? Thao tác này không thể hoàn tác.")) return;
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      if (!res.ok) throw new Error();
      await signOut({ redirect: false });
      router.push("/register");
    } catch {
      setBusy(false);
      setMsg("Xóa tài khoản thất bại. Vui lòng thử lại.");
    }
  }

  return (
    <section className={`${panel} border-red-200/70 dark:border-red-900/50`}>
      <SectionHead icon="alert" tone="red" title="Quản lý tài khoản" desc="Đăng xuất hoặc xóa vĩnh viễn tài khoản của bạn." />
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        <div className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-sm font-semibold">Đăng xuất</p>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Kết thúc phiên đăng nhập trên thiết bị này.</p>
          </div>
          <button disabled={busy} onClick={logout} className={`${btnGhost} w-full sm:w-auto`}>Đăng xuất</button>
        </div>
        <div className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">Xóa tài khoản</p>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Toàn bộ tiến trình học sẽ bị xóa và không thể khôi phục.</p>
          </div>
          <button disabled={busy} onClick={remove} className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-500/30 disabled:opacity-50 sm:w-auto">Xóa tài khoản</button>
        </div>
      </div>
      {msg ? <p role="alert" className="border-t border-red-100 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 sm:px-6 dark:border-red-900/50 dark:bg-red-500/10 dark:text-red-300">{msg}</p> : null}
    </section>
  );
}
