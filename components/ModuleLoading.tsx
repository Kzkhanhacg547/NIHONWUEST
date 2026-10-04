import type { ReactNode } from "react";

const PHRASES = [
  "頑張れ！— Cố lên nào！",
  "一歩一歩。— Từng bước một.",
  "継続は力なり。— Kiên trì là sức mạnh.",
  "夢は逃げない。— Ước mơ không bỏ chạy。",
  "今日も頑張りましょう！— Hôm nay cũng cố gắng nhé！",
];

function hashToIndex(value: string, length: number): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % length;
}

/**
 * In-module loading placeholder.
 *
 * Deliberately NOT `fixed inset-0`: a full-screen overlay covered the sticky nav
 * on every navigation and flashed white. It also has to stay out of
 * `app/app/loading.tsx`, because a loading boundary at that level streams before
 * `notFound()` runs, which silently turns every unknown `/app` URL into a 200.
 */
export function ModuleLoading({ label = "nội dung" }: { label?: string }) {
  // Math.random() in a Server Component causes a hydration mismatch, so the
  // phrase is derived from a stable string instead.
  const phrase = PHRASES[hashToIndex(label, PHRASES.length)];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Đang tải ${label}`}
      className="mx-auto flex min-h-[60vh] w-full max-w-[1320px] flex-col items-center justify-center gap-6 px-4 py-16"
    >
      <div className="relative">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border-2 border-sakura-400/50 bg-sakura-50 shadow-2xl shadow-sakura-500/30 motion-safe:animate-pulse sm:h-28 sm:w-28">
          <span className="jp-text text-5xl leading-none" aria-hidden="true">
            日
          </span>
        </div>
        <div
          className="absolute -inset-3 rounded-[36px] border-2 border-sakura-400/60 motion-safe:animate-spin dark:border-sakura-500/60"
          style={{ animationDuration: "3s" }}
          aria-hidden="true"
        />
        <div
          className="absolute -inset-5 rounded-[44px] border border-amber-400/40 motion-safe:animate-spin dark:border-amber-500/40"
          style={{ animationDuration: "6s", animationDirection: "reverse" }}
          aria-hidden="true"
        />
      </div>

      <div className="space-y-1 text-center">
        <h2 className="bg-gradient-to-r from-sakura-600 via-rose-600 to-amber-500 bg-clip-text text-2xl font-black tracking-tight text-transparent">
          Nihon Quest
        </h2>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          日本 • Đang tải {label}...
        </p>
      </div>

      <p className="max-w-xs rounded-2xl border border-sakura-200 bg-white/80 px-5 py-3 text-center text-sm font-bold text-slate-700 backdrop-blur motion-safe:animate-pulse dark:border-sakura-900 dark:bg-sumi-950/80 dark:text-slate-200">
        {phrase}
      </p>

      <div className="flex gap-2" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-sakura-400 motion-safe:animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export function ModuleLoadingBoundary({ label, children }: { label: string; children: ReactNode }) {
  return <>{children}</>;
}