import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:p-8 bg-gradient-to-br from-slate-50 via-fuji-50/20 to-sakura-50/10 dark:from-slate-950 dark:via-sumi-950 dark:to-slate-950">
      {/* Decorative circles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-fuji-200/20 dark:bg-fuji-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-sakura-200/20 dark:bg-sakura-900/10 rounded-full blur-3xl" />
      </div>

      <div className="text-center max-w-md space-y-8 relative z-10">
        {/* 404 Text */}
        <div>
          <div className="text-[clamp(4rem,22vw,8rem)] font-black text-transparent bg-clip-text bg-gradient-to-br from-fuji-400 via-sakura-500 to-rose-400 leading-none mb-2">
            404
          </div>
          <div className="text-2xl font-black text-slate-800 dark:text-white jp-text">見つかりません</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">(Không tìm thấy trang này)</div>
        </div>

        {/* Zen Garden illustration */}
        <div className="relative mx-auto w-full max-w-[192px] h-32 rounded-3xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-sumi-900 dark:to-sumi-800 border-2 border-amber-200 dark:border-amber-900 overflow-hidden flex items-end justify-center pb-4">
          {/* Sand waves */}
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute w-full h-0.5 bg-amber-300/60 dark:bg-amber-700/40 rounded-full"
              style={{ bottom: `${16 + i * 12}px`, transform: `scaleX(${0.6 + i * 0.1})` }}
            />
          ))}
          {/* Rocks */}
          <div className="absolute top-4 left-8 w-8 h-6 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 shadow-md" />
          <div className="absolute top-8 right-10 w-5 h-4 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 shadow-sm" />
          {/* Torii */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-1 bg-rose-500 rounded mb-0.5" />
            <div className="w-10 h-0.5 bg-rose-500 rounded mb-1" />
            <div className="flex gap-3">
              <div className="w-1 h-8 bg-rose-500 rounded" />
              <div className="w-1 h-8 bg-rose-500 rounded" />
            </div>
          </div>
        </div>

        {/* Haiku */}
        <div className="rounded-2xl bg-white/80 dark:bg-sumi-950/80 backdrop-blur border border-slate-200 dark:border-slate-800 px-6 py-4 space-y-1">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200 jp-text">
            道に迷いても
          </p>
          <p className="text-xs text-fuji-500 dark:text-fuji-400 italic">Dù lạc đường</p>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200 jp-text">
            また始められる
          </p>
          <p className="text-xs text-fuji-500 dark:text-fuji-400 italic">Vẫn có thể bắt đầu lại</p>
        </div>

        {/* Actions */}
        {/* 2 CTA xếp hàng ngang cần ~300px, vượt quá 296px khả dụng ở 360px. */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/app"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-sakura-500 via-rose-500 to-sakura-600 px-6 py-3 text-white font-black text-sm shadow-lg shadow-sakura-500/30 hover:scale-[1.02] active:scale-[0.99] transition-all"
          >
            ⛩️ Về Dashboard
          </Link>
          <Link
            href="/app/learn"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border-2 border-slate-200 dark:border-slate-700 px-6 py-3 text-sm font-black text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-sumi-900 transition"
          >
            あ Học Kana
          </Link>
        </div>
      </div>
    </div>
  );
}
