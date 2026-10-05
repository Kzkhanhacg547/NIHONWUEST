"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

/** Các mức tốc độ đọc hiển thị trên nút "0.85x" ở thanh điều hướng. */
export const SPEECH_RATES = [0.6, 0.75, 0.85, 1, 1.25] as const;

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  type?: "success" | "error" | "xp" | "achievement" | "info";
  xp?: number;
}

export interface VoiceOption {
  name: string;
  lang: string;
  voiceURI: string;
}

interface SoundAndThemeContextType {
  theme: Theme;
  /** Theme thực tế đang áp dụng (đã giải quyết "system" thành light/dark). */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  playCorrect: () => void;
  playIncorrect: () => void;
  playClick: () => void;
  playFanfare: () => void;

  // Global Text-to-Speech Settings
  speechRate: number;
  setSpeechRate: (rate: number) => void;
  speechVoiceURI: string;
  setSpeechVoiceURI: (uri: string) => void;
  availableVoices: VoiceOption[];
  speak: (text: string, customRate?: number) => void;
  /** Đoạn text đang được đọc (null nếu không đọc) – dùng để làm nổi nút ▶ tương ứng. */
  speakingText: string | null;

  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
}

const SoundAndThemeContext = createContext<SoundAndThemeContextType | null>(null);

export function SoundAndThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Speech TTS State
  const [speechRate, setSpeechRateState] = useState<number>(0.85);
  const [speechVoiceURI, setSpeechVoiceURIState] = useState<string>("");
  const [availableVoices, setAvailableVoices] = useState<VoiceOption[]>([]);
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const speakIdRef = useRef(0);

  // Initialize from localStorage & load voices
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem("nq_theme") as Theme | null;
      if (storedTheme && ["light", "dark", "system"].includes(storedTheme)) {
        setThemeState(storedTheme);
      }
      const storedSound = localStorage.getItem("nq_sound");
      if (storedSound !== null) {
        setSoundEnabledState(storedSound === "true");
      }
      const storedRate = localStorage.getItem("nq_speech_rate");
      if (storedRate) {
        setSpeechRateState(parseFloat(storedRate) || 0.85);
      }
      const storedVoice = localStorage.getItem("nq_speech_voice");
      if (storedVoice) {
        setSpeechVoiceURIState(storedVoice);
      }
    } catch {
      // Ignore
    }

    // Load Web Speech Voices
    const updateVoices = () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const voices = window.speechSynthesis.getVoices();
        const jaVoices = voices
          .filter((v) => {
            const lang = (v.lang || "").toLowerCase();
            const name = (v.name || "").toLowerCase();
            return (
              lang.startsWith("ja") ||
              lang.includes("jp") ||
              name.includes("japanese") ||
              name.includes("日本語") ||
              name.includes("haruka") ||
              name.includes("kyoko") ||
              name.includes("otoya") ||
              name.includes("keita")
            );
          })
          .map((v) => ({
            name: v.name,
            lang: v.lang,
            voiceURI: v.voiceURI,
          }));

        // If no strict Japanese match, list all voices as fallback
        const finalVoices = jaVoices.length > 0 ? jaVoices : voices.slice(0, 15).map((v) => ({
          name: v.name,
          lang: v.lang,
          voiceURI: v.voiceURI,
        }));

        setAvailableVoices(finalVoices);
      }
    };

    updateVoices();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Sync theme with HTML document class
  useEffect(() => {
    const root = document.documentElement;
    const applyDark = () => {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
      setResolvedTheme("dark");
    };
    const applyLight = () => {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
      setResolvedTheme("light");
    };

    if (theme === "dark") {
      applyDark();
    } else if (theme === "light") {
      applyLight();
    } else {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      if (media.matches) applyDark();
      else applyLight();

      const listener = (e: MediaQueryListEvent) => {
        if (e.matches) applyDark();
        else applyLight();
      };
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
  }, [theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    try {
      localStorage.setItem("nq_theme", t);
    } catch {}
  };

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  const setSoundEnabled = (s: boolean) => {
    setSoundEnabledState(s);
    try {
      localStorage.setItem("nq_sound", String(s));
    } catch {}
  };

  const setSpeechRate = (r: number) => {
    setSpeechRateState(r);
    try {
      localStorage.setItem("nq_speech_rate", String(r));
    } catch {}
  };

  const setSpeechVoiceURI = (uri: string) => {
    setSpeechVoiceURIState(uri);
    try {
      localStorage.setItem("nq_speech_voice", uri);
    } catch {}
  };

  // Global Speech Function with Speech Synthesis & Audio Fallback
  const speak = useCallback(
    (text: string, customRate?: number) => {
      if (!text || typeof window === "undefined") return;
      const cleanText = text.replace(/[\(\[\{].*?[\)\]\}]/g, "").trim();
      if (!cleanText) return;

      const speakId = ++speakIdRef.current;
      const finish = () => {
        if (speakIdRef.current === speakId) setSpeakingText(null);
      };
      setSpeakingText(text);

      const playAudioFallback = (t: string) => {
        try {
          const encoded = encodeURIComponent(t.slice(0, 200));
          const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=ja&client=tw-ob`;
          const audio = new Audio(url);
          audio.onended = finish;
          audio.onerror = finish;
          audio.play().catch(finish);
        } catch {
          finish();
        }
      };

      try {
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          const allSystemVoices = window.speechSynthesis.getVoices();
          const hasJaVoice = allSystemVoices.some(
            (v) => v.lang.startsWith("ja") || v.lang.includes("JP") || v.lang.includes("ja")
          );

          if (hasJaVoice) {
            const u = new SpeechSynthesisUtterance(cleanText);
            u.lang = "ja-JP";
            u.rate = customRate ?? speechRate;

            let matchedVoice = null;
            if (speechVoiceURI) {
              matchedVoice = allSystemVoices.find(
                (v) => v.voiceURI === speechVoiceURI || v.name === speechVoiceURI
              );
            }
            if (!matchedVoice) {
              matchedVoice = allSystemVoices.find(
                (v) => v.lang.startsWith("ja") || v.lang.includes("JP") || v.lang.includes("ja")
              );
            }
            if (matchedVoice) {
              u.voice = matchedVoice;
            }

            u.onend = finish;
            u.onerror = () => {
              // cancel() của lần đọc trước cũng bắn onerror – chỉ fallback nếu đây vẫn là lần đọc hiện tại
              if (speakIdRef.current === speakId) playAudioFallback(cleanText);
            };

            window.speechSynthesis.speak(u);
            return;
          }
        }
      } catch {}

      playAudioFallback(cleanText);
    },
    [speechRate, speechVoiceURI]
  );

  // Web Audio Synthesizer (Instant Chimes)
  const getAudioContext = useCallback(() => {
    if (typeof window === "undefined") return null;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    return new AudioCtx();
  }, []);

  const playCorrect = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [659.25, 783.99, 987.77];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.36);
      });
    } catch {}
  }, [soundEnabled, getAudioContext]);

  const playIncorrect = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.25);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.27);
    } catch {}
  }, [soundEnabled, getAudioContext]);

  const playClick = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }, [soundEnabled, getAudioContext]);

  const playFanfare = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const chord = [523.25, 659.25, 783.99, 1046.5];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.001, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.18, now + idx * 0.06 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.85);
      });
    } catch {}
  }, [soundEnabled, getAudioContext]);

  const showToast = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <SoundAndThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
        soundEnabled,
        setSoundEnabled,
        playCorrect,
        playIncorrect,
        playClick,
        playFanfare,
        speechRate,
        setSpeechRate,
        speechVoiceURI,
        setSpeechVoiceURI,
        availableVoices,
        speak,
        speakingText,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </SoundAndThemeContext.Provider>
  );
}

export function useSoundAndTheme() {
  const ctx = useContext(SoundAndThemeContext);
  if (!ctx) throw new Error("useSoundAndTheme must be used within SoundAndThemeProvider");
  return ctx;
}

function ToastContainer({ toasts, removeToast }: { toasts: ToastItem[]; removeToast: (id: string) => void }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 pointer-events-none sm:bottom-6 sm:right-6 max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all transform translate-y-0 animate-in fade-in slide-in-from-bottom-3 ${
            t.type === "xp"
              ? "bg-amber-500/95 text-white border-amber-400 shadow-glow-gold"
              : t.type === "achievement"
              ? "bg-fuji-600/95 text-white border-fuji-400 shadow-lg"
              : t.type === "error"
              ? "bg-red-600/95 text-white border-red-400"
              : "bg-sumi-900/95 text-white border-slate-700 dark:bg-white/95 dark:text-sumi-950 dark:border-slate-200"
          }`}
        >
          <div className="text-xl">
            {t.type === "xp" ? "✨" : t.type === "achievement" ? "🏆" : t.type === "error" ? "⚠️" : "🌸"}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm tracking-wide">{t.title}</h4>
            {t.description && <p className="text-xs opacity-90 mt-0.5">{t.description}</p>}
          </div>
          <button
            onClick={() => removeToast(t.id)}
            className="text-xs opacity-70 hover:opacity-100 p-1"
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
