"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSoundAndTheme } from "@/components/SoundAndThemeContext";
import { notifyProgressUpdated } from "@/components/UserProgressContext";
import { SectionHead, field, labelCls, btnPrimary, panel } from "./parts";

type Initial = { displayName: string; learningLevel: string; learningGoal: string; dailyGoalMinutes: number; focusSkill: string; learningStyle: string; timezone: string; theme: string; soundEnabled: boolean };

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="text-sm font-bold text-slate-900 dark:text-white">{title}</legend>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export function ProfileForm({ initial }: { initial: Initial }) {
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const { playClick, playCorrect, showToast } = useSoundAndTheme();
  const set = <K extends keyof Initial>(k: K, v: Initial[K]) => setForm((f) => ({ ...f, [k]: v }));

  function applyTheme(theme: string) {
    const dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    try { localStorage.setItem("nq_theme", theme); } catch {}
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    playClick();
    setBusy(true);
    try {
      const res = await fetch("/api/account", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { showToast({ title: json.error ?? "Lưu cài đặt thất bại", type: "error" }); return; }
      applyTheme(form.theme);
      notifyProgressUpdated();
      playCorrect();
      showToast({ title: "Đã lưu cài đặt", description: `Lộ trình học đã cập nhật theo cấp độ ${form.learningLevel}.`, type: "success" });
      router.refresh();
    } catch {
      showToast({ title: "Đã có lỗi xảy ra, vui lòng thử lại.", type: "error" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={panel}>
      <SectionHead icon="user" title="Hồ sơ & lộ trình học" desc="Thông tin cá nhân và mục tiêu học tập của bạn." />
      <form onSubmit={save} className="space-y-7 px-5 py-6 sm:px-6">
        <Group title="Thông tin cá nhân">
          <label className={labelCls}>Tên hiển thị
            <input value={form.displayName} onChange={(e) => set("displayName", e.target.value)} className={field} placeholder="Nhập tên của bạn" />
          </label>
          <label className={labelCls}>Múi giờ
            <input value={form.timezone} onChange={(e) => set("timezone", e.target.value)} className={field} placeholder="Asia/Ho_Chi_Minh" />
          </label>
        </Group>

        <Group title="Lộ trình học">
          <label className={labelCls}>Cấp độ JLPT
            <select value={form.learningLevel} onChange={(e) => set("learningLevel", e.target.value)} className={field}>
              <option value="N5">N5 – Cơ bản</option><option value="N4">N4 – Sơ trung cấp</option><option value="N3">N3 – Trung cấp</option>
            </select>
          </label>
          <label className={labelCls}>Mục tiêu chính
            <select value={form.learningGoal} onChange={(e) => set("learningGoal", e.target.value)} className={field}>
              <option value="JLPT">Thi đỗ chứng chỉ JLPT</option><option value="TRAVEL">Du lịch Nhật Bản</option><option value="CONVERSATION">Giao tiếp hằng ngày</option><option value="CULTURE">Văn hóa, anime &amp; manga</option>
            </select>
          </label>
          <label className={labelCls}>Thời gian học mỗi ngày (phút)
            <input type="number" inputMode="numeric" min={5} max={180} value={form.dailyGoalMinutes} onChange={(e) => set("dailyGoalMinutes", Number(e.target.value))} className={field} />
          </label>
          <label className={labelCls}>Kỹ năng trọng tâm
            <select value={form.focusSkill} onChange={(e) => set("focusSkill", e.target.value)} className={field}>
              <option value="BALANCED">Toàn diện</option><option value="LISTENING">Nghe</option><option value="SPEAKING">Nói</option><option value="READING">Đọc</option><option value="WRITING">Viết</option>
            </select>
          </label>
          <label className={`${labelCls} sm:col-span-2`}>Phong cách học
            <select value={form.learningStyle} onChange={(e) => set("learningStyle", e.target.value)} className={field}>
              <option value="STRUCTURED">Bài bản – trình tự khoa học, ôn SRS định kỳ</option><option value="IMMERSIVE">Nhập vai – học như đang sống tại Nhật</option><option value="GAMIFIED">Phiêu lưu – mở khóa địa danh &amp; streak</option><option value="PRACTICAL">Thực chiến – học kỹ năng sinh tồn ngay</option>
            </select>
          </label>
        </Group>

        <Group title="Giao diện & âm thanh">
          <label className={labelCls}>Giao diện
            <select value={form.theme} onChange={(e) => set("theme", e.target.value)} className={field}>
              <option value="light">Sáng</option><option value="dark">Tối</option><option value="system">Theo hệ thống</option>
            </select>
          </label>
          <label className="flex min-h-11 cursor-pointer items-center gap-3 self-end rounded-xl border border-slate-200 px-3.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
            <input type="checkbox" checked={form.soundEnabled} onChange={(e) => set("soundEnabled", e.target.checked)} className="h-5 w-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500" />
            Bật âm thanh hiệu ứng
          </label>
        </Group>

        <div className="flex justify-end border-t border-slate-100 pt-5 dark:border-slate-800">
          <button type="submit" disabled={busy} className={`${btnPrimary} w-full sm:w-auto`}>{busy ? "Đang lưu..." : "Lưu thay đổi"}</button>
        </div>
      </form>
    </section>
  );
}
