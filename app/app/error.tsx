"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Scoped boundary for the learning modules.
 *
 * Without it, a throw anywhere under /app replaced the whole shell — including
 * the nav — so one broken module cost the user their place.
 */
export default function AppModuleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[NihonQuest /app error]", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-[1320px] flex-col items-center justify-center gap-6 px-4 py-16">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-3xl dark:bg-red-950/40" aria-hidden="true">
        ⚠️
      </span>
      <div role="alert" className="max-w-md text-center">
        <h1 className="text-xl font-black text-slate-900 dark:text-white">
          Ôi, phần này gặp sự cố
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Đã xảy ra lỗi khi tải nội dung. Phần còn lại của trang vẫn dùng được — bạn có thể thử lại.
        </p>
      </div>
      <div className="flex flex-col sm:flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700"
        >
          🔄 Thử lại
        </button>
        <Link
          href="/app"
          className="inline-flex min-h-12 items-center justify-center rounded-2xl border-2 border-slate-200 px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-sumi-900"
        >
          🏠 Về Dashboard
        </Link>
      </div>
    </div>
  );
}