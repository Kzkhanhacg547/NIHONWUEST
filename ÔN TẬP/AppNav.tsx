"use client";

import "./AppNav.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NihonQuestLogo } from "./NihonQuestLogo";
import { useSoundAndTheme } from "./SoundAndThemeContext";
import { Icon, type IconName } from "./ui";

interface NavItem {
  href: string;
  label: string;
  icon?: IconName;
  /** Ký tự Nhật dùng thay icon (cho nhóm "Khám Phá"). */
  glyph?: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/app", label: "Dashboard", icon: "layout" },
  { href: "/app/practice", label: "Bài Học", icon: "book" },
  { href: "/app/review", label: "Ôn Tập", icon: "card" },
  { href: "/app/vocabulary", label: "Từ Vựng", icon: "kana" },
  { href: "/app/grammar", label: "Ngữ Pháp N5", icon: "bun", badge: "N5" },
  { href: "/app/journey", label: "Hành trình", icon: "route" },
];

const MORE_ITEMS: NavItem[] = [
  { href: "/app/learn", label: "Lộ trình học & Kana Lab", glyph: "学" },
  { href: "/app/survival", label: "Survival Mode", glyph: "食" },
  { href: "/app/sensei", label: "AI Kaiwa Sensei", glyph: "話" },
  { href: "/app/leaderboard", label: "Bảng xếp hạng", glyph: "杯" },
];

const RATES = [0.6, 0.75, 0.85, 1, 1.2];
const formatRate = (rate: number) => `${Number(rate.toFixed(2))}x`;

type MenuName = "explore" | "voice" | null;

export function AppNav() {
  const pathname = usePathname() ?? "";
  const {
    resolvedTheme,
    setTheme,
    soundEnabled,
    setSoundEnabled,
    playClick,
    speechRate,
    setSpeechRate,
    speechVoiceURI,
    setSpeechVoiceURI,
    availableVoices,
    speak,
  } = useSoundAndTheme();

  const [openMenu, setOpenMenu] = useState<MenuName>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onPointer = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest("[data-nqn-pop]")) setOpenMenu(null);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setDrawerOpen(false);
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
  const voiceLabel = availableVoices.find((v) => v.voiceURI === speechVoiceURI)?.name ?? "Mặc định hệ thống";
  const toggleMenu = (name: Exclude<MenuName, null>) => {
    playClick();
    setOpenMenu((current) => (current === name ? null : name));
  };

  return (
    <>
      <header className="nqn-header" data-intro>
        <div className="nqn-inner">
          <Link href="/app" className="nqn-brand" onClick={playClick} aria-label="Nihon Quest — về Dashboard">
            <NihonQuestLogo size="sm" />
            <span className="nqn-jp">JP</span>
          </Link>

          <nav className="nqn-links" aria-label="Điều hướng chính">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={playClick}
                aria-current={active(item.href) ? "page" : undefined}
                className={`nqn-link ${active(item.href) ? "is-active" : ""}`}
              >
                {item.icon && <Icon name={item.icon} size={17} />}
                <span>{item.label}</span>
                {item.badge && <small>{item.badge}</small>}
              </Link>
            ))}

            <div className="nqn-anchor" data-nqn-pop>
              <button
                type="button"
                className={`nqn-link ${moreActive || openMenu === "explore" ? "is-active" : ""}`}
                onClick={() => toggleMenu("explore")}
                aria-expanded={openMenu === "explore"}
                aria-haspopup="true"
              >
                <Icon name="compass" size={17} />
                <span>Khám Phá</span>
                <Icon name="chevronDown" size={14} className="nqn-caret" />
              </button>
              {openMenu === "explore" && (
                <div className="nqn-pop">
                  <p className="nqn-pop-title">Không gian khám phá</p>
                  {MORE_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        playClick();
                        setOpenMenu(null);
                      }}
                      className={`nqn-pop-item ${active(item.href) ? "is-active" : ""}`}
                    >
                      <span className="nqn-glyph jp-text">{item.glyph}</span>
                      <b>{item.label}</b>
                      <em>
                        <Icon name="arrowRight" size={15} />
                      </em>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="nqn-actions">
            <div className="nqn-anchor" data-nqn-pop>
              <button
                type="button"
                className="nqn-pill"
                onClick={() => toggleMenu("voice")}
                aria-expanded={openMenu === "voice"}
                aria-haspopup="dialog"
                title="Tốc độ và giọng đọc tiếng Nhật"
              >
                <Icon name="flame" size={15} className="nqn-flame" />
                <b>{formatRate(speechRate)}</b>
                <small>{voiceLabel}</small>
                <Icon name="speaker" size={14} />
              </button>

              {openMenu === "voice" && (
                <div className="nqn-pop nqn-pop--right" role="dialog" aria-label="Cài đặt giọng đọc">
                  <p className="nqn-pop-title">Giọng đọc tiếng Nhật</p>
                  <div className="nqn-rates" role="group" aria-label="Tốc độ đọc">
                    {RATES.map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        className={`nqn-rate ${Math.abs(rate - speechRate) < 0.001 ? "is-on" : ""}`}
                        aria-pressed={Math.abs(rate - speechRate) < 0.001}
                        onClick={() => {
                          setSpeechRate(rate);
                          speak("ありがとう", rate);
                        }}
                      >
                        {formatRate(rate)}
                      </button>
                    ))}
                  </div>
                  <label className="nqn-field">
                    <span>Giọng</span>
                    <select value={speechVoiceURI} onChange={(e) => setSpeechVoiceURI(e.target.value)}>
                      <option value="">Mặc định hệ thống</option>
                      {availableVoices.map((voice) => (
                        <option key={voice.voiceURI} value={voice.voiceURI}>
                          {voice.name} ({voice.lang})
                        </option>
                      ))}
                    </select>
                  </label>
                  <button type="button" className="nqn-test" onClick={() => speak("こんにちは、日本語を勉強しましょう")}>
                    <Icon name="speaker" size={16} />
                    Nghe thử
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              className={`nqn-iconbtn ${soundEnabled ? "is-on" : ""}`}
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) setTimeout(playClick, 30);
              }}
              aria-pressed={soundEnabled}
              aria-label={soundEnabled ? "Tắt âm thanh hiệu ứng" : "Bật âm thanh hiệu ứng"}
              title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
            >
              <Icon name={soundEnabled ? "speaker" : "speakerOff"} size={18} />
            </button>

            <button
              type="button"
              className="nqn-iconbtn"
              onClick={() => {
                playClick();
                setTheme(resolvedTheme === "dark" ? "light" : "dark");
              }}
              aria-label="Đổi giao diện sáng tối"
              title={resolvedTheme === "dark" ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
            >
              <Icon name={resolvedTheme === "dark" ? "moon" : "sun"} size={18} />
            </button>

            <button
              type="button"
              className="nqn-iconbtn"
              onClick={() => {
                playClick();
                setDrawerOpen(true);
              }}
              aria-label="Mở menu"
              aria-haspopup="dialog"
            >
              <Icon name="menu" size={18} />
            </button>
          </div>
        </div>
      </header>

      {drawerOpen && (
        <div className="nqn-drawer-backdrop" onMouseDown={() => setDrawerOpen(false)}>
          <div
            className="nqn-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="nqn-drawer-head">
              <NihonQuestLogo size="sm" />
              <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Đóng menu">
                <Icon name="close" size={16} />
              </button>
            </div>
            {[...NAV_ITEMS, ...MORE_ITEMS].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nqn-pop-item ${active(item.href) ? "is-active" : ""}`}
                onClick={() => {
                  playClick();
                  setDrawerOpen(false);
                }}
              >
                {item.icon ? <Icon name={item.icon} size={18} /> : <span className="nqn-glyph jp-text">{item.glyph}</span>}
                <b>{item.label}</b>
                <em>
                  <Icon name="arrowRight" size={15} />
                </em>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
