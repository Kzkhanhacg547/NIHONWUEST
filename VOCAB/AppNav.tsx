"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NihonQuestLogo } from "./NihonQuestLogo";
import { SPEECH_RATES, useSoundAndTheme } from "./SoundAndThemeContext";
import { Icon, IconButton, type IconName } from "./ui";

interface NavItem {
  href: string;
  label: string;
  /** Icon line (SVG) dùng chung từ ui.tsx */
  icon?: IconName;
  /** Hoặc một ký tự Nhật làm icon (あ, 文, 学...) */
  glyph?: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/app", label: "Dashboard", icon: "dashboard" },
  { href: "/app/practice", label: "Bài Học", icon: "book" },
  { href: "/app/review", label: "Ôn Tập", icon: "cards" },
  { href: "/app/vocabulary", label: "Từ Vựng", glyph: "あ" },
  { href: "/app/grammar", label: "Ngữ Pháp", glyph: "文" },
];

const MORE_ITEMS: NavItem[] = [
  { href: "/app/journey", label: "Hành trình", glyph: "⌁" },
  { href: "/app/learn", label: "Lộ trình học & Kana Lab", glyph: "学" },
  { href: "/app/survival", label: "Survival Mode", glyph: "食" },
  { href: "/app/sensei", label: "AI Kaiwa Sensei", glyph: "話" },
  { href: "/app/leaderboard", label: "Bảng xếp hạng", glyph: "杯" },
];

function NavGlyph({ item }: { item: NavItem }) {
  if (item.icon) return <Icon name={item.icon} className="h-[18px] w-[18px]" />;
  return (
    <span className="jp-text inline-flex h-[18px] w-[18px] items-center justify-center text-[15px] font-bold leading-none">
      {item.glyph}
    </span>
  );
}

/** Đóng popover khi click ra ngoài hoặc nhấn Escape. */
function useDismiss(ref: { current: HTMLElement | null }, open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) onClose();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [ref, open, onClose]);
}

function Avatar({ name, image }: { name?: string | null; image?: string | null }) {
  const initial = (name?.trim()?.[0] ?? "N").toUpperCase();
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={image} alt={name ?? "Tài khoản"} className="h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-sumi-800" />
    );
  }
  return (
    <span
      title={name ?? undefined}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-slate-800 to-red-900 text-sm font-black text-white ring-2 ring-white dark:ring-sumi-800"
    >
      {initial}
    </span>
  );
}

export function AppNav({
  userName,
  userImage,
  unreadCount = 0,
}: {
  userName?: string | null;
  userImage?: string | null;
  /** > 0 thì hiện chấm đỏ trên chuông thông báo */
  unreadCount?: number;
}) {
  const pathname = usePathname();
  const {
    resolvedTheme,
    toggleTheme,
    soundEnabled,
    setSoundEnabled,
    playClick,
    speechRate,
    setSpeechRate,
    speechVoiceURI,
    setSpeechVoiceURI,
    availableVoices,
    speak,
    showToast,
  } = useSoundAndTheme();

  const [moreOpen, setMoreOpen] = useState(false);
  const [speedOpen, setSpeedOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement | null>(null);
  const speedRef = useRef<HTMLDivElement | null>(null);

  useDismiss(moreRef, moreOpen, () => setMoreOpen(false));
  useDismiss(speedRef, speedOpen, () => setSpeedOpen(false));

  // Đổi trang thì đóng mọi menu
  useEffect(() => {
    setMoreOpen(false);
    setSpeedOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const active = (href: string) => pathname === href || (href !== "/app" && pathname.startsWith(`${href}/`));
  const moreActive = MORE_ITEMS.some((item) => active(item.href));

  const linkBase =
    "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500";
  const linkIdle =
    "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-sumi-800 dark:hover:text-white";
  const linkActive =
    "bg-slate-50 font-bold text-slate-900 shadow-sm ring-1 ring-slate-200/80 [&_svg]:text-red-600 [&_.jp-text]:text-red-600 dark:bg-sumi-800 dark:text-white dark:ring-slate-700";

  return (
    <>
      <header className="sticky top-3 z-40 px-3 sm:px-6" data-intro>
        <div className="mx-auto flex max-w-[1320px] items-center gap-2 rounded-[22px] border border-slate-200/70 bg-white/90 px-3 py-2 shadow-[0_10px_40px_rgba(15,23,42,0.07)] backdrop-blur-xl dark:border-slate-800 dark:bg-sumi-900/90 lg:gap-3 lg:px-4">
          <Link href="/app" className="mr-1 flex shrink-0 items-center" onClick={playClick} aria-label="NihonQuest – về Dashboard">
            <NihonQuestLogo size="sm" />
          </Link>

          <nav className="hidden flex-1 items-center gap-1 lg:flex" aria-label="Điều hướng chính">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={playClick}
                aria-current={active(item.href) ? "page" : undefined}
                className={`${linkBase} ${active(item.href) ? linkActive : linkIdle}`}
              >
                <NavGlyph item={item} />
                <span>{item.label}</span>
              </Link>
            ))}

            <div className="relative" ref={moreRef}>
              <button
                type="button"
                className={`${linkBase} ${moreActive || moreOpen ? linkActive : linkIdle}`}
                onClick={() => {
                  playClick();
                  setMoreOpen((v) => !v);
                }}
                aria-expanded={moreOpen}
                aria-haspopup="true"
              >
                <Icon name="bookmark" className="h-[18px] w-[18px]" />
                <span>Khám Phá</span>
                <Icon name="chevron" className={`h-3.5 w-3.5 transition ${moreOpen ? "rotate-180" : ""}`} />
              </button>
              {moreOpen && (
                <div className="absolute left-0 top-12 z-50 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-sumi-900">
                  <p className="px-3 pb-1.5 pt-2 text-[11px] font-bold tracking-wider text-slate-400">Không gian khám phá</p>
                  {MORE_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        playClick();
                        setMoreOpen(false);
                      }}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                        active(item.href)
                          ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                          : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-sumi-800"
                      }`}
                    >
                      <span className="jp-text inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold dark:bg-sumi-800">
                        {item.glyph}
                      </span>
                      <b className="flex-1 font-semibold">{item.label}</b>
                      <Icon name="arrow" className="h-3.5 w-3.5 text-slate-400" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {/* Tốc độ đọc + âm thanh */}
            <div className="relative" ref={speedRef}>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setSpeedOpen((v) => !v);
                }}
                aria-expanded={speedOpen}
                aria-haspopup="true"
                aria-label={`Tốc độ đọc ${speechRate}x – mở cài đặt âm thanh`}
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-slate-200 bg-white pl-3 pr-2.5 text-[13px] font-extrabold text-red-600 shadow-sm transition hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:border-slate-700 dark:bg-sumi-900"
              >
                <Icon name="speaker" className={`h-4 w-4 ${soundEnabled ? "text-slate-500" : "text-slate-300"}`} />
                <span>{speechRate}x</span>
                <Icon name="chevron" className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {speedOpen && (
                <div className="absolute right-0 top-12 z-50 w-72 space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-sumi-900">
                  <div>
                    <p className="mb-2 text-xs font-bold text-slate-500">Tốc độ đọc</p>
                    <div className="flex flex-wrap gap-1.5">
                      {SPEECH_RATES.map((rate) => (
                        <button
                          key={rate}
                          type="button"
                          onClick={() => {
                            setSpeechRate(rate);
                            speak("こんにちは", rate);
                          }}
                          aria-pressed={speechRate === rate}
                          className={`rounded-full border px-3 py-1.5 text-xs font-extrabold transition ${
                            speechRate === rate
                              ? "border-red-600 bg-red-600 text-white"
                              : "border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-600 dark:border-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {availableVoices.length > 0 && (
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-bold text-slate-500">Giọng đọc</span>
                      <select
                        value={speechVoiceURI}
                        onChange={(e) => setSpeechVoiceURI(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-red-400 dark:border-slate-700 dark:bg-sumi-950 dark:text-slate-200"
                      >
                        <option value="">Tự động (tiếng Nhật)</option>
                        {availableVoices.map((voice) => (
                          <option key={voice.voiceURI} value={voice.voiceURI}>
                            {voice.name} ({voice.lang})
                          </option>
                        ))}
                      </select>
                    </label>
                  )}

                  <button
                    type="button"
                    role="switch"
                    aria-checked={soundEnabled}
                    onClick={() => {
                      setSoundEnabled(!soundEnabled);
                      if (!soundEnabled) setTimeout(playClick, 30);
                    }}
                    className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 text-left text-xs font-bold text-slate-700 dark:bg-sumi-950 dark:text-slate-200"
                  >
                    <span>Âm thanh hiệu ứng</span>
                    <span
                      className={`relative h-5 w-9 rounded-full transition ${soundEnabled ? "bg-red-600" : "bg-slate-300 dark:bg-slate-700"}`}
                    >
                      <span
                        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${soundEnabled ? "left-[18px]" : "left-0.5"}`}
                      />
                    </span>
                  </button>
                </div>
              )}
            </div>

            <IconButton
              label={resolvedTheme === "dark" ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
              className="h-10 w-10"
              onClick={() => {
                playClick();
                toggleTheme();
              }}
            >
              <Icon name={resolvedTheme === "dark" ? "moon" : "sun"} className="h-[18px] w-[18px]" />
            </IconButton>

            <IconButton
              label="Thông báo"
              className="relative hidden h-10 w-10 sm:inline-flex"
              onClick={() => {
                playClick();
                showToast({ title: unreadCount > 0 ? `Bạn có ${unreadCount} thông báo mới` : "Chưa có thông báo mới", type: "info" });
              }}
            >
              <Icon name="bell" className="h-[18px] w-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-sumi-900" />
              )}
            </IconButton>

            <div className="hidden sm:block">
              <Avatar name={userName} image={userImage} />
            </div>

            <IconButton label="Mở menu" className="h-10 w-10 lg:hidden" onClick={() => setMobileOpen(true)}>
              <Icon name="menu" className="h-5 w-5" />
            </IconButton>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm lg:hidden" onMouseDown={() => setMobileOpen(false)}>
          <div
            className="ml-auto h-full w-[min(88vw,360px)] space-y-1 overflow-y-auto bg-white p-4 shadow-2xl dark:bg-sumi-900"
            role="dialog"
            aria-modal="true"
            aria-label="Menu điều hướng"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <NihonQuestLogo size="sm" />
              <IconButton label="Đóng menu" onClick={() => setMobileOpen(false)}>
                <Icon name="close" className="h-4 w-4" />
              </IconButton>
            </div>
            {[...NAV_ITEMS, ...MORE_ITEMS].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active(item.href) ? "page" : undefined}
                onClick={() => {
                  playClick();
                  setMobileOpen(false);
                }}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  active(item.href)
                    ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                    : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-sumi-800"
                }`}
              >
                <span className="inline-flex h-7 w-7 items-center justify-center">
                  <NavGlyph item={item} />
                </span>
                <span className="flex-1">{item.label}</span>
                <Icon name="arrow" className="h-3.5 w-3.5 text-slate-400" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
