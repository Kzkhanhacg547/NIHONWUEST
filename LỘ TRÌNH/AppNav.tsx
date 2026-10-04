"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NihonQuestLogo } from "./NihonQuestLogo";
import { useSoundAndTheme } from "./SoundAndThemeContext";
import "./AppNav.css";

interface NavItem {
  href: string;
  label: string;
  icon?: string;
  /** các tiền tố đường dẫn cũng được coi là "đang ở mục này" */
  match?: string[];
}

// Thanh chính: Trải nghiệm · Hành trình · Học tập · Khám phá (dropdown) · Cộng đồng
const PRIMARY_BEFORE: NavItem[] = [
  { href: "/app", label: "Trải nghiệm", icon: "◫" },
  { href: "/app/journey", label: "Hành trình", icon: "⌁" },
  { href: "/app/learn", label: "Học tập", icon: "学", match: ["/app/learn", "/app/practice", "/app/review"] },
];
const PRIMARY_AFTER: NavItem[] = [{ href: "/app/leaderboard", label: "Cộng đồng", icon: "杯" }];

// Dropdown "Khám phá": các công cụ học còn lại
const EXPLORE_ITEMS: NavItem[] = [
  { href: "/app/practice", label: "Bài học", icon: "▣" },
  { href: "/app/review", label: "Ôn tập", icon: "▤" },
  { href: "/app/vocabulary", label: "Từ vựng & Hán tự", icon: "あ" },
  { href: "/app/grammar", label: "Ngữ pháp N5", icon: "文" },
  { href: "/app/survival", label: "Survival Mode", icon: "食" },
  { href: "/app/sensei", label: "AI Kaiwa Sensei", icon: "話" },
];

export function AppNav({ userName = "Học viên", levelLabel = "N5" }: { userName?: string; levelLabel?: string }) {
  const pathname = usePathname();
  const { theme, setTheme, soundEnabled, setSoundEnabled, playClick } = useSoundAndTheme();
  const [menu, setMenu] = useState<null | "explore" | "user">(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onPointer = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-popover]")) setMenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
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

  const isActive = (item: NavItem) => {
    const prefixes = item.match ?? [item.href];
    return prefixes.some((p) => (p === "/app" ? pathname === "/app" : pathname === p || pathname.startsWith(`${p}/`)));
  };
  const exploreActive = EXPLORE_ITEMS.some((i) => pathname === i.href || pathname.startsWith(`${i.href}/`)) && !PRIMARY_BEFORE.some(isActive);
  const initial = (userName.trim()[0] || "H").toUpperCase();

  const renderLink = (item: NavItem) => (
    <Link
      key={item.href}
      href={item.href}
      onClick={playClick}
      aria-current={isActive(item) ? "page" : undefined}
      className={`an-link ${isActive(item) ? "is-active" : ""}`}
    >
      {item.label}
    </Link>
  );

  return (
    <>
      <header className="an-header" data-intro>
        <div className="an-bar">
          <Link href="/app" className="an-brand" onClick={playClick} aria-label="Nihon Quest — trang chủ">
            <NihonQuestLogo size="sm" />
          </Link>

          <nav className="an-links" aria-label="Điều hướng chính">
            {PRIMARY_BEFORE.map(renderLink)}

            <div className="an-explore" data-popover>
              <button
                type="button"
                className={`an-link ${exploreActive || menu === "explore" ? "is-active" : ""}`}
                aria-expanded={menu === "explore"}
                aria-haspopup="menu"
                onClick={() => {
                  playClick();
                  setMenu(menu === "explore" ? null : "explore");
                }}
              >
                Khám phá
              </button>
              {menu === "explore" && (
                <div className="an-popover" role="menu">
                  <p>KHÔNG GIAN KHÁM PHÁ</p>
                  {EXPLORE_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={pathname.startsWith(item.href) ? "is-active" : ""}
                      onClick={() => {
                        playClick();
                        setMenu(null);
                      }}
                    >
                      <span>{item.icon}</span>
                      <b>{item.label}</b>
                      <em>→</em>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {PRIMARY_AFTER.map(renderLink)}
          </nav>

          <div className="an-right">
            <Link href="/app/vocabulary" className="an-icon" aria-label="Tìm kiếm từ vựng" onClick={playClick}>
              ⌕
            </Link>
            <button type="button" className="an-icon" aria-label="Thông báo" onClick={playClick}>
              🔔<span className="an-dot" />
            </button>

            <div className="an-user" data-popover>
              <button
                type="button"
                className="an-user-btn"
                aria-expanded={menu === "user"}
                aria-haspopup="menu"
                onClick={() => {
                  playClick();
                  setMenu(menu === "user" ? null : "user");
                }}
              >
                <span className="an-avatar">{initial}</span>
                <span className="an-user-meta">
                  <b>{userName}</b>
                  <small>{levelLabel}</small>
                </span>
              </button>
              {menu === "user" && (
                <div className="an-popover" role="menu">
                  <p>CÀI ĐẶT NHANH</p>
                  <button
                    type="button"
                    className="an-row"
                    aria-pressed={soundEnabled}
                    onClick={() => {
                      setSoundEnabled(!soundEnabled);
                      if (!soundEnabled) setTimeout(playClick, 30);
                    }}
                  >
                    <span>{soundEnabled ? "🔊" : "🔇"}</span>
                    <b>{soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}</b>
                  </button>
                  <button
                    type="button"
                    className="an-row"
                    onClick={() => {
                      playClick();
                      setTheme(theme === "dark" ? "light" : "dark");
                    }}
                  >
                    <span>{theme === "dark" ? "☀" : "◉"}</span>
                    <b>{theme === "dark" ? "Giao diện sáng" : "Giao diện tối"}</b>
                  </button>
                </div>
              )}
            </div>

            <button type="button" className="an-icon an-menu-btn" onClick={() => setMobileOpen(true)} aria-label="Mở menu">
              ☰
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="an-mobile-backdrop" onMouseDown={() => setMobileOpen(false)}>
          <div className="an-mobile" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
            <div className="an-mobile-head">
              <NihonQuestLogo size="sm" />
              <button type="button" className="an-icon" onClick={() => setMobileOpen(false)} aria-label="Đóng menu">
                ×
              </button>
            </div>
            {[...PRIMARY_BEFORE, ...EXPLORE_ITEMS, ...PRIMARY_AFTER].map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className={isActive(item) ? "is-active" : ""}
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
