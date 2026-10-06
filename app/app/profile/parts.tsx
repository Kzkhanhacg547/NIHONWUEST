import type { ReactNode } from "react";

export const panel = "overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-sumi-900";
export const panelBody = "px-5 py-5 sm:px-6";
export const labelCls = "block text-sm font-semibold text-slate-700 dark:text-slate-300";
export const field = "mt-1.5 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 dark:border-slate-700 dark:bg-sumi-950 dark:text-white";
export const btnPrimary = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/30 disabled:cursor-not-allowed disabled:opacity-50";
export const btnGhost = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-400/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-sumi-950 dark:text-slate-200 dark:hover:bg-sumi-800";

const paths: Record<string, ReactNode> = {
  user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.7-3.4 3-5 7-5s6.3 1.6 7 5" /></>,
  book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20V5.5Z" /><path d="M4 20c.7-1.3 1.5-2 3-2h13" /></>,
  lock: <><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  alert: <><path d="M12 3 21 19H3L12 3Z" /><path d="M12 9v4M12 16h.01" /></>,
  camera: <><path d="M4 8h3l1.5-2h7L17 8h3v11H4V8Z" /><circle cx="12" cy="13" r="3.5" /></>,
};

export function Icon({ name, className = "h-5 w-5" }: { name: keyof typeof paths; className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export function SectionHead({ icon, title, desc, tone = "rose" }: { icon: keyof typeof paths; title: string; desc: string; tone?: "rose" | "red" }) {
  const t = tone === "red" ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300" : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300";
  return (
    <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-4 sm:px-6 dark:border-slate-800">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${t}`}><Icon name={icon} /></span>
      <div className="min-w-0">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">{title}</h2>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{desc}</p>
      </div>
    </div>
  );
}
