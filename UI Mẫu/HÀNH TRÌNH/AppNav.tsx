"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { NihonQuestLogo } from "./NihonQuestLogo";
import { useSoundAndTheme } from "./SoundAndThemeContext";

interface NavItem {
  href: string;
  label: string;
  icon?: ReactNode;
  badge?: string;
}

function LineIcon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

const ICONS = {
  dashboard: <LineIcon><rect x="4" y="4" width="6.5" height="6.5" rx="1.4" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.4" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.4" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.4" /></LineIcon>,
  lesson: <LineIcon><path d="M5 5.5A2.5 2.5 0 017.5 3H19v15H7.5A2.5 2.5 0 005 20.5z" /><path d="M5 20.5A2.5 2.5 0 007.5 23H19" /></LineIcon>,
  review: <LineIcon><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V3h6v1M9 11h6M9 15h4" /></LineIcon>,
  journey: <LineIcon><path d="M3 19l6-10 4 6 3-4 5 8z" /></LineIcon>,
  explore: <LineIcon><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></LineIcon>,
};

const NAV_ITEMS: NavItem[] = [
  { href: "/app", label: "Dashboard", icon: ICONS.dashboard },
  { href: "/app/practice", label: "Bài Học", icon: ICONS.lesson },
  { href: "/app/review", label: "Ôn Tập", icon: ICONS.review },
  { href: "/app/vocabulary", label: "Từ Vựng", icon: "あ" },
  { href: "/app/grammar", label: "Ngữ Pháp N5", icon: "文", badge: "N5" },
  { href: "/app/journey", label: "Hành trình", icon: ICONS.journey },
];

const MORE_ITEMS: NavItem[] = [
  { href: "/app/learn", label: "Lộ trình học & Kana Lab", icon: "学" },
  { href: "/app/survival", label: "Survival Mode", icon: "食" },
  { href: "/app/sensei", label: "AI Kaiwa Sensei", icon: "話" },
  { href: "/app/leaderboard", label: "Bảng xếp hạng", icon: "杯" },
];

export function AppNav({ streak }: { streak?: number }) {
  const pathname = usePathname();
  const { theme, setTheme, soundEnabled, setSoundEnabled, playClick, speechRate } = useSoundAndTheme();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onPointer = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const active = (href: string) => pathname === href || (href !== "/app" && pathname.startsWith(`${href}/`));
  const moreActive = MORE_ITEMS.some((item) => active(item.href));

  return (
    <>
      <header className="nq-app-nav" data-intro>
        <div className="nq-app-nav-inner">
          <Link href="/app" className="nq-app-brand" onClick={playClick}>
            <NihonQuestLogo size="sm" />
            <span className="nq-jp-pill">JP</span>
          </Link>

          <nav className="nq-desktop-nav" aria-label="Điều hướng chính">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={playClick}
                aria-current={active(item.href) ? "page" : undefined}
                className={`nq-nav-link ${active(item.href) ? "is-active" : ""}`}
              >
                <span className="nq-nav-icon" aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && <small>{item.badge}</small>}
              </Link>
            ))}
            <div className="nq-nav-more" ref={popoverRef}>
              <button
                type="button"
                className={`nq-nav-link ${moreActive || open ? "is-active" : ""}`}
                onClick={() => {
                  playClick();
                  setOpen((value) => !value);
                }}
                aria-expanded={open}
              >
                <span className="nq-nav-icon" aria-hidden="true">{ICONS.explore}</span>
                <span>Khám Phá</span>
                <span className="nq-caret">⌄</span>
              </button>
              {open && (
                <div className="nq-nav-popover">
                  <p>KHÔNG GIAN KHÁM PHÁ</p>
                  {MORE_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        playClick();
                        setOpen(false);
                      }}
                      className={active(item.href) ? "is-active" : ""}
                    >
                      <span>{item.icon}</span>
                      <b>{item.label}</b>
                      <em>→</em>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="nq-nav-actions">
            {typeof streak === "number" && (
              <span className="nq-streak-pill" title="Chuỗi ngày học liên tiếp">
                <span aria-hidden="true">🔥</span>
                <b>{streak} ngày</b>
              </span>
            )}
            <button
              type="button"
              className="nq-speed-pill"
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) setTimeout(playClick, 30);
              }}
              aria-pressed={soundEnabled}
              title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
            >
              <span aria-hidden="true">{soundEnabled ? "🪙" : "🔇"}</span>
              <b>{speechRate}x</b>
            </button>
            <button
              type="button"
              className="nq-icon-button"
              onClick={() => {
                playClick();
                setTheme(theme === "dark" ? "light" : "dark");
              }}
              aria-label="Đổi giao diện sáng tối"
            >
              {theme === "dark" ? "☀" : "◉"}
            </button>
            <button
              type="button"
              className="nq-icon-button nq-mobile-menu-button"
              onClick={() => setMobileOpen(true)}
              aria-label="Mở menu"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="nq-mobile-nav-backdrop" onMouseDown={() => setMobileOpen(false)}>
          <div className="nq-mobile-nav" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
            <div className="nq-mobile-nav-head">
              <NihonQuestLogo size="sm" />
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Đóng menu">×</button>
            </div>
            {[...NAV_ITEMS, ...MORE_ITEMS].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={active(item.href) ? "is-active" : ""}
                onClick={() => {
                  playClick();
                  setMobileOpen(false);
                }}
              >
                <span>{item.icon}</span>
                <b>{item.label}</b>
                <em>→</em>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
