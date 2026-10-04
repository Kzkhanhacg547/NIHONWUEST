"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSoundAndTheme } from "@/components/SoundAndThemeContext";

export function ActivityButton() {
  const router = useRouter();
  const { playCorrect, showToast } = useSoundAndTheme();
  const [loading, setLoading] = useState(false);

  async function touch() {
    setLoading(true);
    try {
      const res = await fetch("/api/activity", { method: "POST" });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        playCorrect();
        showToast({
          title: "Điểm danh hôm nay thành công! 🔥",
          description: `Chuỗi hiện tại: ${json.currentStreak} ngày · Cấp độ: ${json.level}!`,
          type: "xp",
        });
        router.refresh();
      }
    } catch {}
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={touch}
      disabled={loading}
      aria-label="Điểm danh chuỗi ngày"
      title="Điểm danh chuỗi ngày"
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-lg text-stone-500 transition hover:bg-red-50 hover:text-red-600 active:scale-90 disabled:opacity-50 dark:text-stone-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
    >
      {loading ? "…" : "›"}
    </button>
  );
}
