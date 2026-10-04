"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui";

export function DangerZone() {
  const router = useRouter();
  const [msg, setMsg] = useState("");

  async function logout() {
    await signOut({ redirect: false });
    router.push("/login");
  }

  async function remove() {
    if (!confirm("Bạn có chắc chắn muốn xóa tài khoản và toàn bộ dữ liệu học tập không? Thao tác này không thể hoàn tác.")) return;
    const res = await fetch("/api/account", { method: "DELETE" });
    if (!res.ok) {
      setMsg("Xóa tài khoản thất bại.");
      return;
    }
    await signOut({ redirect: false });
    router.push("/register");
  }

  return (
    <Card className="p-6 border-red-200 dark:border-red-950/40">
      <h3 className="text-base font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
        <span>⚠️</span> Quản Lý Tài Khoản
      </h3>
      <p className="text-xs text-slate-500 mb-4">
        Đăng xuất khỏi phiên hiện tại hoặc xoá vĩnh viễn toàn bộ tiến trình học tập của bạn.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={logout}
          className="rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-sumi-800 transition"
        >
          🚪 Đăng xuất
        </button>
        <button
          onClick={remove}
          className="rounded-xl bg-red-600 hover:bg-red-700 px-5 py-2.5 text-sm font-bold text-white transition shadow-sm"
        >
          🗑️ Xóa tài khoản
        </button>
      </div>
      {msg ? <p role="alert" className="mt-3 text-sm font-semibold text-red-600">{msg}</p> : null}
    </Card>
  );
}
