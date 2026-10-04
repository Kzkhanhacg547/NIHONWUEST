import React, { type ReactNode, forwardRef } from "react";

// ======================== BUTTON ========================
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "sakura" | "secondary" | "ghost" | "outline" | "danger" | "gold" | "matcha" | "fuji" | "torii";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = "", variant = "primary", size = "md", loading = false, disabled, ...props }, ref) => {
    const sizeClasses = {
      sm: "px-3.5 py-1.5 text-xs rounded-xl font-bold tracking-tight",
      md: "px-5 py-2.5 text-sm rounded-xl font-bold tracking-tight",
      lg: "px-6 py-3.5 text-base rounded-2xl font-black tracking-tight",
    }[size];

    const variantClasses = {
      primary:
        "bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98] shadow-sm dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100",
      sakura:
        "bg-gradient-to-r from-sakura-500 via-rose-500 to-sakura-600 text-white hover:from-sakura-600 hover:to-rose-600 active:scale-[0.98] shadow-md shadow-sakura-500/25 hover:shadow-lg hover:shadow-sakura-500/30",
      secondary:
        "bg-slate-100 text-slate-800 hover:bg-slate-200 active:scale-[0.98] dark:bg-sumi-800 dark:text-slate-200 dark:hover:bg-sumi-700 border border-slate-200/60 dark:border-slate-700/60",
      ghost:
        "bg-transparent text-slate-700 hover:bg-slate-100 active:scale-[0.98] dark:text-slate-300 dark:hover:bg-sumi-800",
      outline:
        "border border-slate-300 bg-transparent text-slate-800 hover:bg-slate-100 active:scale-[0.98] dark:border-slate-700 dark:text-slate-200 dark:hover:bg-sumi-800",
      danger:
        "bg-rose-600 text-white hover:bg-rose-700 active:scale-[0.98] shadow-sm shadow-rose-600/20",
      gold:
        "bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-black hover:from-amber-500 hover:to-yellow-600 active:scale-[0.98] shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/35",
      matcha:
        "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 active:scale-[0.98] shadow-md shadow-emerald-500/25",
      fuji:
        "bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:from-indigo-600 hover:to-violet-700 active:scale-[0.98] shadow-md shadow-indigo-500/25",
      torii:
        "bg-red-700 text-white hover:bg-red-800 active:scale-[0.98] shadow-md shadow-red-700/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600",
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`nq-button inline-flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer select-none ${sizeClasses} ${variantClasses} ${className}`}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

// ======================== CARD ========================
export function Card({
  children,
  className = "",
  hover = false,
  glow = false,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`nq-card rounded-3xl border border-slate-200/80 bg-white/95 p-5 sm:p-6 shadow-sm transition-all duration-200 dark:border-slate-800/80 dark:bg-sumi-900/90 ${
        hover ? "hover:-translate-y-1 hover:shadow-card-hover hover:border-slate-300 dark:hover:border-slate-700" : ""
      } ${glow ? "border-sakura-300/80 dark:border-sakura-800/80 shadow-glow" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

// ======================== BADGE ========================
export function Badge({
  children,
  variant = "slate",
  dot = false,
  className = "",
}: {
  children: ReactNode;
  variant?: "sakura" | "fuji" | "matcha" | "amber" | "slate" | "torii";
  dot?: boolean;
  className?: string;
}) {
  const variantStyles = {
    sakura: "bg-sakura-50 text-sakura-700 dark:bg-sakura-950/60 dark:text-sakura-300 border border-sakura-200/80 dark:border-sakura-800/80",
    fuji: "bg-indigo-50 text-fuji-600 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80",
    matcha: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80",
    amber: "bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80",
    slate: "bg-slate-100 text-slate-700 dark:bg-sumi-800 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80",
    torii: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/80",
  }[variant];

  const dotColors = {
    sakura: "bg-sakura-500",
    fuji: "bg-indigo-500",
    matcha: "bg-emerald-500",
    amber: "bg-amber-500",
    slate: "bg-slate-500",
    torii: "bg-rose-500",
  }[variant];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-tight ${variantStyles} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors}`} />}
      {children}
    </span>
  );
}

// ======================== XP BAR ========================
export function XPBar({
  currentXP,
  nextLevelXP,
  level,
  className = "",
}: {
  currentXP: number;
  nextLevelXP: number;
  level: number;
  className?: string;
}) {
  const percent = Math.min(100, Math.max(0, Math.round((currentXP / Math.max(1, nextLevelXP)) * 100)));

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-xs font-bold">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-amber-500 text-sumi-950 text-[10px] font-black shadow-sm">
            L{level}
          </span>
          <span className="text-slate-700 dark:text-slate-200">Level {level}</span>
        </div>
        <span className="text-amber-600 dark:text-amber-400 font-extrabold">
          {currentXP} / {nextLevelXP} XP
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-sumi-800 p-0.5 border border-slate-200/50 dark:border-slate-700/50">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 transition-all duration-500 shadow-sm"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

// ======================== STREAK BADGE ========================
export function StreakFlame({ streak, activeToday = false }: { streak: number; activeToday?: boolean }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-900/80 text-orange-600 dark:text-orange-400 font-black text-xs shadow-sm">
      <span className={`text-sm ${activeToday ? "animate-bounce" : ""}`}>🔥</span>
      <span>{streak} {streak === 1 ? "ngày" : "ngày liên tiếp"}</span>
    </div>
  );
}

// ======================== PAGE TITLE ========================
export function PageTitle({
  title,
  subtitle,
  badge,
  action,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  action?: ReactNode;
}) {
  return (
    <div data-reveal className="nq-page-title flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200/60 dark:border-slate-800/80 pb-5">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          {badge && <Badge variant="sakura">{badge}</Badge>}
        </div>
        {subtitle && <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
    </div>
  );
}

// ======================== SKELETON ========================
export function Skeleton({ className = "h-4 w-full" }: { className?: string }) {
  return <div aria-hidden className={`animate-pulse rounded-xl bg-slate-200 dark:bg-sumi-800 ${className}`} />;
}

// ======================== EMPTY STATE ========================
export function EmptyState({
  title,
  body,
  icon = "🌸",
  action,
}: {
  title: string;
  body: string;
  icon?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-slate-200 p-10 text-center dark:border-slate-800 bg-white/50 dark:bg-sumi-900/30">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-bold text-lg text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ======================== ERROR STATE ========================
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-red-200 bg-red-50/80 p-6 text-center dark:border-red-900/60 dark:bg-red-950/40"
    >
      <div className="text-2xl mb-2">⛩️⚠️</div>
      <p className="font-bold text-red-700 dark:text-red-300">Something went wrong.</p>
      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{message}</p>
      {onRetry ? (
        <Button onClick={onRetry} variant="danger" size="sm" className="mt-4">
          Retry
        </Button>
      ) : null}
    </div>
  );
}

// ======================== MODAL / DIALOG ========================
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "lg",
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
}) {
  if (!isOpen) return null;

  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
  }[maxWidth];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full ${maxWidthClass} rounded-3xl bg-white dark:bg-sumi-900 p-6 sm:p-8 shadow-2xl border border-slate-200/90 dark:border-slate-800 animate-in zoom-in-95 duration-150 overflow-hidden`}
      >
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800/80">
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-sumi-800 transition"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
