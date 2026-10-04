"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[NihonQuest Error]", error);
  }, [error]);

  // Developer diagnostics, not end-user copy.
  const showDigest = process.env.NODE_ENV !== "production";

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:p-8 bg-gradient-to-br from-rose-50 via-slate-50 to-sakura-50/30 dark:from-rose-950/30 dark:via-sumi-950 dark:to-slate-950">
      <div className="text-center max-w-md space-y-6">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-500 to-sakura-500 shadow-xl shadow-rose-500/30">
          <span className="text-3xl">⚠️</span>
        </div>

        {/* Message */}
        <div role="alert">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
            おっと！エラーが発生しました
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Đã xảy ra lỗi không mong đợi. Bạn có thể thử lại hoặc quay về Dashboard.
          </p>
          {showDigest && error.digest && (
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 font-mono">
              Mã lỗi: {error.digest}
            </p>
          )}
        </div>

        {/* Zen quote */}
        <div className="rounded-2xl bg-white/80 dark:bg-sumi-950/80 border border-slate-200 dark:border-slate-800 px-5 py-4">
          <p className="text-sm text-slate-600 dark:text-slate-300 font-bold">
            七転び八起き
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Thất bại bảy lần, đứng dậy tám lần. Cùng thử lại nhé！
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-sakura-500 to-rose-500 px-5 py-3 text-white font-black text-sm shadow-md shadow-sakura-500/30 hover:scale-[1.02] transition"
          >
            🔄 Thử lại
          </button>
          <Link
            href="/app"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border-2 border-slate-200 dark:border-slate-700 px-5 py-3 text-sm font-black text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-sumi-900 transition"
          >
            🏠 Về Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
