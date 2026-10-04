"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { NihonQuestLogo } from "./NihonQuestLogo";
import { useSoundAndTheme } from "./SoundAndThemeContext";

interface NavItem {
  href: string;
  label: string;
  icon?: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/app", label: "Trang chủ" },
  { href: "/app/practice", label: "Bài học" },
  { href: "/app/review", label: "Ôn tập (SRS)" },
  { href: "/app/vocabulary", label: "Từ vựng & Hán tự" },
  { href: "/app/survival", label: "Thử thách" },
];

const MORE_ITEMS: NavItem[] = [
  { href: "/app/learn", label: "Kana Lab & Lộ trình", icon: "学" },
  { href: "/app/grammar", label: "Ngữ pháp N5", icon: "文" },
  { href: "/app/journey", label: "Hành trình Shinkansen", icon: "⌁" },
  { href: "/app/sensei", label: "AI Kaiwa Sensei", icon: "話" },
  { href: "/app/leaderboard", label: "Bảng xếp hạng", icon: "杯" },
];

export function AppNav({
  userName,
  userLevel,
  userXP,
  avatar,
}: {
  userName?: string;
  userLevel?: number;
  userXP?: number;
  avatar?: string | null;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { playClick } = useSoundAndTheme();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const popRef = useRef<HTMLDivElement | null>(null);

  const name = userName || session?.user?.name || "Học viên";

  useEffect(() => {
    const onPointer = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
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
  const moreActive = MORE_ITEMS.some((i) => active(i.href));

  return (
    <>
      <header className="nqd-nav">
        <Link href="/app" onClick={playClick} aria-label="Nihon Quest">
          <NihonQuestLogo size="sm" />
        </Link>

        <nav className="nqd-links" aria-label="Điều hướng chính">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={playClick}
              aria-current={active(item.href) ? "page" : undefined}
              className={`nqd-link ${active(item.href) ? "is-active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
          <div className="nqd-more" ref={popRef}>
            <button
              type="button"
              className={`nqd-link ${moreActive || open ? "is-active" : ""}`}
              aria-expanded={open}
              onClick={() => {
                playClick();
                setOpen((v) => !v);
              }}
            >
              Khám phá
            </button>
            {open && (
              <div className="nqd-pop">
                {MORE_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={active(item.href) ? "is-active" : ""}
                    onClick={() => {
                      playClick();
                      setOpen(false);
                    }}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="nqd-nav-right">
          <button type="button" className="nqd-ic" aria-label="Tìm kiếm" onClick={playClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </button>
          <button type="button" className="nqd-ic" aria-label="Thông báo" onClick={playClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 1112 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 003.4 0" />
            </svg>
            <span className="dot" />
          </button>
          <div className="nqd-user">
            <div className="nqd-avatar">
              {avatar ? <img src={avatar} alt="" width={38} height={38} /> : name.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <b>{name}</b>
              <small>Level {userLevel ?? 1} · {userXP ?? 0} XP</small>
            </div>
          </div>
          <button type="button" className="nqd-ic nqd-burger" onClick={() => setMobileOpen(true)} aria-label="Mở menu">
            ☰
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="nqd-drawer" onMouseDown={() => setMobileOpen(false)}>
          <div role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
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
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
