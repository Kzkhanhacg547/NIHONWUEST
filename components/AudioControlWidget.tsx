"use client";

import { useState, useRef, useEffect } from "react";
import { useSoundAndTheme } from "@/components/SoundAndThemeContext";

export function AudioControlWidget() {
  const {
    speechRate,
    setSpeechRate,
    speechVoiceURI,
    setSpeechVoiceURI,
    availableVoices,
    speak,
    playClick,
  } = useSoundAndTheme();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    // Nghe cả touchstart: chạm ra ngoài trên iOS không luôn sinh mousedown
    // đúng lúc, khiến popover dễ bị "dính".
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const rates = [
    { label: "0.5x Chậm", value: 0.5 },
    { label: "0.75x Vừa", value: 0.75 },
    { label: "1.0x Chuẩn", value: 1.0 },
    { label: "1.25x Nhanh", value: 1.25 },
  ];

  const currentVoiceName = availableVoices.find((v) => v.voiceURI === speechVoiceURI)?.name || "Mặc định hệ thống";

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Trigger Pill Button */}
      <button
        onClick={() => {
          playClick();
          setIsOpen(!isOpen);
        }}
        className="min-h-11 px-3 py-2.5 rounded-2xl bg-white/80 dark:bg-sumi-800/80 hover:bg-sakura-50 dark:hover:bg-sumi-700 border border-slate-200/80 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1.5 shadow-sm"
        title="Tùy chỉnh tốc độ & giọng đọc tiếng Nhật"
      >
        <span>🔊</span>
        <span className="font-extrabold text-sakura-600 dark:text-sakura-400">{speechRate}x</span>
        <span className="text-[10px] text-slate-400 max-w-[90px] truncate hidden sm:inline">
          {currentVoiceName}
        </span>
        <span className="text-[10px] text-slate-400">⚙️</span>
      </button>

      {/* Glassmorphic Control Panel Popover */}
      {isOpen && (
        <div className="fixed left-4 right-4 top-[calc(4.5rem+env(safe-area-inset-top))] sm:absolute sm:top-full sm:left-auto sm:right-0 sm:mt-2 sm:w-80 p-4 rounded-3xl bg-white/95 dark:bg-sumi-900/95 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl z-50 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
              <span>🔊</span> Giọng Đọc & Tốc Độ Phát Âm
            </h4>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Đóng"
              className="grid h-11 w-11 shrink-0 place-items-center text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          </div>

          {/* 1. Speech Speed Selection */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              ⚡ Tốc độ đọc ({speechRate}x)
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {rates.map((r) => (
                <button
                  key={r.value}
                  onClick={() => {
                    playClick();
                    setSpeechRate(r.value);
                  }}
                  className={`min-h-11 px-2.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    speechRate === r.value
                      ? "bg-sakura-600 text-white shadow-sm font-extrabold"
                      : "bg-slate-100 dark:bg-sumi-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-sumi-700"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Voice Selection */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              🎙️ Chọn giọng đọc tiếng Nhật ({availableVoices.length} giọng)
            </label>
            <select
              value={speechVoiceURI}
              onChange={(e) => {
                playClick();
                setSpeechVoiceURI(e.target.value);
              }}
              className="w-full px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-sumi-950 text-slate-800 dark:text-slate-100 outline-none focus:border-sakura-500"
            >
              <option value="">Giọng chuẩn thiết bị (Mặc định)</option>
              {availableVoices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
            {availableVoices.length <= 1 && (
              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium leading-tight bg-amber-50 dark:bg-amber-950/40 p-2 rounded-xl border border-amber-200/60 dark:border-amber-900/60">
                💡 <strong>Lưu ý về điện thoại:</strong> Trình duyệt di động dùng giọng tiếng Nhật mặc định của hệ điều hành. Để cài thêm giọng đọc khác, bạn vào <em>Cài đặt điện thoại ➔ Quản lý hệ thống ➔ Chuyển văn bản thành giọng nói (Google TTS / iOS Voice)</em> để tải gói giọng tiếng Nhật mới.
              </p>
            )}
          </div>

          {/* 3. Preview Audio Button */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                speak("こんにちは！日本語の勉強を頑張りましょう！");
              }}
              className="w-full py-2 rounded-2xl bg-gradient-to-r from-sakura-500 to-rose-500 hover:from-sakura-600 hover:to-rose-600 text-white text-xs font-extrabold shadow-md transition flex items-center justify-center gap-1.5"
            >
              <span>🔊</span> Nghe Thử Giọng Này
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
