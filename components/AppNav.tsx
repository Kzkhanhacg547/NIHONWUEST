"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NihonQuestLogo } from "./NihonQuestLogo";
import { SPEECH_RATES, useSoundAndTheme } from "./SoundAndThemeContext";
import { useUserProgress } from "./UserProgressContext";
import { guessVoiceGender, voiceGenderLabel } from "@/lib/voiceGender";
import { Icon, IconButton, type IconName } from "./ui";

interface NavItem {
  href: string;
  label: string;
  /** Icon line (SVG) dùng chung từ ui.tsx */
  icon?: IconName;
  /** Hoặc một ký tự Nhật làm icon (あ, 文, 学...) */
  glyph?: string;
  /** Nhãn rút gọn cho tab bar dưới màn hình */
  short: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/app", label: "Dashboard", icon: "dashboard", short: "Home" },
  { href: "/app/path", label: "Lộ trình", glyph: "道", short: "Đường" },
  { href: "/app/practice", label: "Bài Học", icon: "book", short: "Học" },
  { href: "/app/review", label: "Ôn Tập", icon: "cards", short: "Ôn" },
  { href: "/app/vocabulary", label: "Từ Vựng", glyph: "あ", short: "Từ" },
  { href: "/app/grammar", label: "Ngữ Pháp", glyph: "文", short: "Ngữ" },
];

const MORE_ITEMS: NavItem[] = [
  { href: "/app/journey", label: "Hành trình", glyph: "⌁", short: "Trình" },
  { href: "/app/learn", label: "Lộ trình học & Kana Lab", glyph: "学", short: "Lộ trình" },
  { href: "/app/survival", label: "Survival Mode", glyph: "食", short: "Sinh tồn" },
  { href: "/app/sensei", label: "AI Kaiwa Sensei", glyph: "話", short: "Sensei" },
  { href: "/app/leaderboard", label: "Bảng xếp hạng", glyph: "杯", short: "BXH" },
  { href: "/app/stats", label: "Thống kê học tập", glyph: "計", short: "Thống kê" },
  { href: "/app/settings", label: "Cài đặt hệ thống", glyph: "設", short: "Cài đặt" },
  { href: "/app/profile", label: "Hồ sơ cá nhân", glyph: "人", short: "Hồ sơ" },
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
      aria-hidden="true"
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
  avatar,
  userLevel,
  userXP,
  streak,
  levelLabel,
  unreadCount = 0,
}: {
  userName?: string | null;
  userImage?: string | null;
  avatar?: string | null;
  userLevel?: number;
  userXP?: number;
  streak?: number;
  levelLabel?: string;
  /** > 0 thì hiện chấm đỏ trên chuông thông báo */
  unreadCount?: number;
}) {
  const { progress } = useUserProgress();
  const effectiveName = progress?.displayName || userName;
  const effectiveAvatar = progress?.avatar || avatar || userImage;
  const effectiveLevel = progress?.level ?? userLevel;
  const effectiveStreak = progress?.currentStreak ?? streak;
  const effectiveXP = progress?.totalXP ?? userXP;
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
  const drawerRef = useRef<HTMLDivElement | null>(null);

  useDismiss(moreRef, moreOpen, () => setMoreOpen(false));
  useDismiss(speedRef, speedOpen, () => setSpeedOpen(false));

  // Đổi trang thì đóng mọi menu
  useEffect(() => {
    setMoreOpen(false);
    setSpeedOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // Drawer mở thì khoá cuộn trang + khoá cuộn nền, và Escape đóng.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Đưa tiêu điểm vào drawer để bàn phím không trượt ra ngoài.
    drawerRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
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
      {/* Thanh trên: logo + hành động. Link chính chỉ hiện từ xl trở lên;
          dưới đó dùng tab bar đáy màn hình + drawer. */}
      <header
        className="sticky z-40 px-2 sm:px-6"
        style={{ top: "max(0.75rem, env(safe-area-inset-top))" }}
        data-intro
      >
        <div className="mx-auto flex max-w-[1320px] items-center gap-1.5 sm:gap-2 rounded-[22px] border border-slate-200/70 bg-white/90 px-2 sm:px-3 py-1.5 sm:py-2 shadow-[0_10px_40px_rgba(15,23,42,0.07)] backdrop-blur-xl dark:border-slate-800 dark:bg-sumi-900/90 lg:gap-3 lg:px-4">
          <Link
            href="/app"
            className="mr-0.5 flex shrink-0 items-center sm:mr-1 max-[360px]:[&_.nq-brand-type]:hidden"
            onClick={playClick}
            aria-label="NihonQuest – về Dashboard"
          >
            <NihonQuestLogo size="sm" />
          </Link>

          {/* Desktop links carried ~1040px of content into a 944px box at 1024px, and
                overflow-x-hidden clipped the overflow instead of scrolling it. */}
          <nav className="hidden flex-1 items-center gap-1 xl:flex" aria-label="Điều hướng chính">
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

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
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
                className="inline-flex h-9 sm:h-10 items-center gap-1 rounded-full border border-slate-200 bg-white pl-2 sm:pl-3 pr-1.5 sm:pr-2 text-[13px] font-extrabold text-red-600 shadow-sm transition hover:border-slate-300 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:border-slate-700 dark:bg-sumi-900"
              >
                <Icon name="speaker" className={`h-4 w-4 ${soundEnabled ? "text-slate-500" : "text-slate-300"}`} />
                <span className="hidden sm:inline">{speechRate}x</span>
                <Icon name="chevron" className="hidden h-3.5 w-3.5 text-slate-400 sm:block" />
              </button>

              {speedOpen && (
                <div className="absolute right-0 top-12 z-50 w-[min(19rem,calc(100vw-1.5rem))] space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-sumi-900">
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
                          className={`min-h-11 rounded-full border px-4 text-sm font-extrabold transition ${
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
                        className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-base font-semibold text-slate-700 outline-none focus:border-red-400 dark:border-slate-700 dark:bg-sumi-950 dark:text-slate-200"
                      >
                        <option value="">Tự động (tiếng Nhật)</option>
                        {availableVoices.map((voice) => (
                          <option key={voice.voiceURI} value={voice.voiceURI}>
                            {voice.name} ({voice.lang}) · {voiceGenderLabel(guessVoiceGender(voice.name))}
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
                    className="flex min-h-11 w-full items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 text-left text-sm font-bold text-slate-700 dark:bg-sumi-950 dark:text-slate-200"
                  >
                    <span>Âm thanh hiệu ứng</span>
                    <span
                      className={`relative h-6 w-11 shrink-0 rounded-full transition ${soundEnabled ? "bg-red-600" : "bg-slate-300 dark:bg-slate-700"}`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${soundEnabled ? "left-5" : "left-0.5"}`}
                      />
                    </span>
                  </button>
                </div>
              )}
            </div>

            <IconButton
              label={resolvedTheme === "dark" ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
              className="h-9 w-9 sm:h-10 sm:w-10"
              onClick={() => {
                playClick();
                toggleTheme();
              }}
            >
              <Icon name={resolvedTheme === "dark" ? "moon" : "sun"} className="h-[18px] w-[18px]" />
            </IconButton>

            <IconButton
              label="Thông báo"
              className="relative h-9 w-9 sm:h-10 sm:w-10"
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

            <Link
              href="/app/profile"
              onClick={playClick}
              aria-label="Hồ sơ và cài đặt tài khoản"
              className="hidden rounded-full transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 sm:block"
            >
              <Avatar name={effectiveName} image={effectiveAvatar} />
            </Link>

            <IconButton label="Mở menu" className="h-9 w-9 sm:h-10 sm:w-10 xl:hidden" onClick={() => setMobileOpen(true)}>
              <Icon name="menu" className="h-5 w-5" />
            </IconButton>
          </div>
        </div>
      </header>

      {/* Tab bar đáy màn hình — chỉ dưới xl. Đây là điều hướng chính trên điện thoại:
          nằm trong tầm ngón cái thay vì nấp sau nút menu. */}
      <nav
        aria-label="Điều hướng nhanh"
        className="nq-tabbar fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl dark:border-slate-800 dark:bg-sumi-900/95 xl:hidden"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-6">
          {NAV_ITEMS.map((item) => {
            const on = active(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={playClick}
                  aria-current={on ? "page" : undefined}
                  className={`flex min-h-[56px] min-w-0 flex-col items-center justify-center gap-1 px-0.5 py-1.5 text-[10px] font-bold transition active:scale-95 ${
                    on ? "text-red-600 dark:text-red-400" : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  <span
                    className={`grid h-7 w-9 shrink-0 place-items-center rounded-full transition ${
                      on ? "bg-red-50 dark:bg-red-950/50" : ""
                    }`}
                  >
                    <NavGlyph item={item} />
                  </span>
                  <span className="min-w-0 max-w-full truncate leading-none">{item.short}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm xl:hidden"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
          onMouseDown={() => setMobileOpen(false)}
        >
          <div
            ref={drawerRef}
            tabIndex={-1}
            className="ml-auto flex h-full w-[min(88vw,360px)] flex-col overflow-y-auto overscroll-contain bg-white p-4 shadow-2xl outline-none dark:bg-sumi-900"
            role="dialog"
            aria-modal="true"
            aria-label="Menu điều hướng"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
              <NihonQuestLogo size="sm" />
              <IconButton label="Đóng menu" className="h-11 w-11 shrink-0" onClick={() => setMobileOpen(false)}>
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
                className={`flex min-h-[52px] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition active:scale-[0.98] ${
                  active(item.href)
                    ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                    : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-sumi-800"
                }`}
              >
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center">
                  <NavGlyph item={item} />
                </span>
                <span className="flex-1">{item.label}</span>
                <Icon name="arrow" className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              </Link>
            ))}
            <div className="mt-auto pt-2">
              <Link
                href="/app/profile"
                onClick={() => {
                  playClick();
                  setMobileOpen(false);
                }}
                className="flex min-h-[52px] items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition active:scale-[0.98] dark:border-slate-700 dark:text-slate-200 dark:hover:bg-sumi-800"
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center">
                  <Avatar name={effectiveName} image={effectiveAvatar} />
                </span>
                <span className="flex-1 truncate">{effectiveName || "Hồ sơ & Cài đặt"}</span>
                <Icon name="arrow" className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}