"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Badge, Button, Card } from "@/components/ui";
import { useSoundAndTheme } from "@/components/SoundAndThemeContext";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES (Compatible with cityData.ts + JourneyClient.tsx)
// ─────────────────────────────────────────────────────────────────────────────
export interface ScenicPhoto {
  url: string;
  caption: string;
  description?: string;
  location?: string;
}

export interface Delicacy {
  name: string;
  nameJa?: string;
  desc: string;
  icon: string;
  imageUrl?: string;
  taste?: string;
  orderingPhrase?: string;
}

export interface CulturalArtifact {
  title: string;
  titleJa: string;
  icon: string;
  imageUrl?: string;
  desc: string;
  significance: string;
}

export interface HistoricalMilestone {
  year: string;
  title: string;
  desc: string;
  figure?: string;
  impact?: string;
}

export interface HistoricalEra {
  eraName: string;
  summary: string;
  famousFigure?: string;
  milestones: HistoricalMilestone[];
  culturalLegacy?: string;
}

export interface CulturalFact {
  icon: string;
  label: string;
  value: string;
}

export interface LanguagePhrase {
  japanese: string;
  romaji: string;
  meaning: string;
}

export interface CulturalEtiquetteItem {
  title: string;
  desc: string;
  icon: string;
}

export interface CityRoomData {
  slug: string;
  name: string;
  nameJa: string;
  description: string;
  landmark3D: string;
  landmarkImage?: string;
  highlights: string[];
  history?: HistoricalEra;
  delicacies: Delicacy[];
  funFact: string;
  stampJa: string;
  scenicPhotos: ScenicPhoto[];
  culturalFacts: CulturalFact[];
  culturalArtifacts: CulturalArtifact[];
  language: LanguagePhrase[];
  culturalEtiquette?: CulturalEtiquetteItem[];
}

interface Japanese3DRoomProps {
  data: CityRoomData;
  isOpen: boolean;
  onClose: () => void;
  status: string | null;
  unlockable: boolean;
  requirementXp: number;
  xpReward: number;
  onAction: (action: "unlock" | "complete") => void;
  loadingAction: boolean;
  isStamped: boolean;
  onStamp: () => void;
  allCities?: Array<{ slug: string; name: string; nameJa: string; landmark3D: string }>;
  onSelectCity?: (slug: string) => void;
  locationId?: string;
  initialProgress?: number;
  onProgressUpdate?: (newPercent: number) => void;
}

type GallerySection = "GOURMET" | "HISTORY" | "LANDMARKS" | "ARTIFACTS" | "ETIQUETTE" | "LANGUAGE";

interface DetailModalItem {
  type: string;
  title: string;
  titleJa?: string;
  romaji?: string;
  imageUrl?: string;
  icon?: string;
  subtitle?: string;
  description: string;
  significance?: string;
  extraInfo?: string;
  audioText?: string;
  tag?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// OMIKUJI FORTUNE SLIPS
// ─────────────────────────────────────────────────────────────────────────────
const OMIKUJI_FORTUNES = [
  {
    kanji: "大吉",
    levelVi: "Đại Cát (May Mắn Lớn)",
    poem: "Trăng rằm soi tỏ vạn trùng non,\nbền lòng son sắt ắt công thành.",
    advice: "Thời cơ vàng son để bắt đầu hành trình học tập mới hoặc vượt qua các bài thi khó. Tinh thần hanh thông, vạn sự cát tường.",
    luckyItem: "Thanh kiếm Katana / Chén trà xanh Matcha",
    luckyColor: "Đỏ chu sa Torii (Shu-iro)",
  },
  {
    kanji: "中吉",
    levelVi: "Trung Cát (May Mắn Vừa)",
    poem: "Gió xuân mơn man nhành liễu biếc,\nbước chậm mà chắc tựa tùng thanh.",
    advice: "Tiến trình học tiếng Nhật đang vào giai đoạn tích lũy nội lực. Hãy duy trì nhịp ôn luyện đều đặn mỗi ngày.",
    luckyItem: "Thẻ gỗ Ema / Đèn lồng Chōchin",
    luckyColor: "Vàng hoàng yến (Yamabuki)",
  },
  {
    kanji: "吉",
    levelVi: "Cát (Bình An Thuận Lợi)",
    poem: "Nước chảy đá mềm lòng kiên định,\nhoa thơm quả ngọt đợi ngày sau.",
    advice: "Mọi nỗ lực ôn tập Kanji và từ vựng đều đang kết tinh âm thầm. Kiên nhẫn là chìa khóa của bậc danh sư.",
    luckyItem: "Chổi đánh trà Chasen / Bánh gạo Senbei",
    luckyColor: "Xanh ngọc bích Aoiro",
  },
  {
    kanji: "小吉",
    levelVi: "Tiểu Cát (Niềm Vui Nhỏ)",
    poem: "Mầm non đón giọt sương mai sớm,\ntương lai rộng mở tựa trùng dương.",
    advice: "Hãy dành thêm 10 phút luyện phát âm mỗi sáng để tạo bước ngoặt đột phá cho khả năng giao tiếp.",
    luckyItem: "Chuông gió Furin thủy tinh",
    luckyColor: "Hồng anh đào Sakura-iro",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// AUDIO SYNTHESIS & SOUND EFFECTS
// ─────────────────────────────────────────────────────────────────────────────
function playChimeSound() {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1760, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.6);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.7);
  } catch {}
}

function playStampThud() {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.15);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  } catch {}
}

function speakJapanese(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[（(].*?[)）]/g, "").trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "ja-JP";
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
  } catch {}
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export function Japanese3DRoom({
  data,
  isOpen,
  onClose,
  status,
  unlockable,
  requirementXp,
  xpReward,
  onAction,
  loadingAction,
  isStamped,
  onStamp,
  allCities,
  onSelectCity,
  locationId,
  initialProgress = 0,
  onProgressUpdate,
}: Japanese3DRoomProps) {
  const { playClick, playFanfare, showToast } = useSoundAndTheme();

  const [activeSection, setActiveSection] = useState<GallerySection>("GOURMET");
  const [detailItem, setDetailItem] = useState<DetailModalItem | null>(null);
  const [omikujiResult, setOmikujiResult] = useState<(typeof OMIKUJI_FORTUNES)[0] | null>(null);
  const [isShakingOmikuji, setIsShakingOmikuji] = useState(false);
  const [stampPounded, setStampPounded] = useState(false);
  const [exploredItems, setExploredItems] = useState<Set<string>>(new Set());
  const [recentlyExploredId, setRecentlyExploredId] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const viewTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Load saved progress from localStorage on open / city change
  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(`nihon_journey_explored_${data.slug}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setExploredItems(new Set(parsed));
          return;
        }
      }
    } catch {}
    setExploredItems(new Set());
  }, [data.slug, isOpen]);

  // Calculate exploration percentage
  const totalCount =
    data.delicacies.length +
    (data.history?.milestones.length || 0) +
    data.scenicPhotos.length +
    data.culturalArtifacts.length +
    (data.culturalEtiquette?.length || 0) +
    data.language.length;
  
  const rawPercent = Math.round((exploredItems.size / Math.max(1, totalCount)) * 100);
  const exploredPercent = Math.min(100, Math.max(status === "COMPLETED" ? 100 : (initialProgress || 0), rawPercent));

  // Auto-save & sync progress to server & localStorage
  const persistProgress = useCallback(
    (nextSet: Set<string>) => {
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(`nihon_journey_explored_${data.slug}`, JSON.stringify(Array.from(nextSet)));
        } catch {}
      }

      const nextPercent = Math.min(100, Math.round((nextSet.size / Math.max(1, totalCount)) * 100));
      onProgressUpdate?.(nextPercent);

      if (locationId) {
        if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
        syncTimeoutRef.current = setTimeout(async () => {
          try {
            await fetch("/api/journey/progress", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                locationId,
                action: "update_progress",
                progress: nextPercent,
              }),
            });
          } catch {}
        }, 400);
      }
    },
    [data.slug, totalCount, locationId, onProgressUpdate]
  );

  const markExplored = useCallback(
    (id: string, announce = false) => {
      setExploredItems((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        persistProgress(next);
        return next;
      });
      if (announce) {
        setRecentlyExploredId(id);
        setTimeout(() => setRecentlyExploredId((curr) => (curr === id ? null : curr)), 2500);
      }
    },
    [persistProgress]
  );

  // 3-Second Visibility Tracker via IntersectionObserver
  useEffect(() => {
    if (!isOpen) return;

    const currentTimers = viewTimersRef.current;
    currentTimers.forEach((t) => clearTimeout(t));
    currentTimers.clear();

    const container = scrollContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const exploreId = entry.target.getAttribute("data-explore-id");
          if (!exploreId) return;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            if (exploredItems.has(exploreId)) return;
            if (currentTimers.has(exploreId)) return;

            // Start 3-second dwell timer
            const timer = setTimeout(() => {
              markExplored(exploreId, true);
              currentTimers.delete(exploreId);
            }, 3000);

            currentTimers.set(exploreId, timer);
          } else {
            // User scrolled away before 3s -> cancel
            if (currentTimers.has(exploreId)) {
              clearTimeout(currentTimers.get(exploreId));
              currentTimers.delete(exploreId);
            }
          }
        });
      },
      {
        root: container,
        threshold: [0.3],
      }
    );

    const elements = container.querySelectorAll("[data-explore-id]");
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      currentTimers.forEach((t) => clearTimeout(t));
      currentTimers.clear();
    };
  }, [isOpen, activeSection, exploredItems, markExplored]);

  const openDetail = useCallback(
    (item: DetailModalItem, id: string) => {
      playChimeSound();
      markExplored(id, true);
      setDetailItem(item);
    },
    [markExplored]
  );

  const drawOmikuji = () => {
    if (isShakingOmikuji) return;
    setIsShakingOmikuji(true);
    playChimeSound();
    setTimeout(() => {
      const f = OMIKUJI_FORTUNES[Math.floor(Math.random() * OMIKUJI_FORTUNES.length)];
      setOmikujiResult(f);
      setIsShakingOmikuji(false);
      markExplored("omikuji", true);
    }, 700);
  };

  const triggerStamp = () => {
    setStampPounded(true);
    playStampThud();
    onStamp();
    setTimeout(() => setStampPounded(false), 500);
  };

  if (!isOpen) return null;

  // ── Access check: Locked status ──
  const isLocked = !status && !unlockable;

  if (isLocked) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200/80 bg-white/95 dark:border-slate-800 dark:bg-sumi-900/95 p-8 text-center shadow-2xl space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 flex items-center justify-center text-4xl shadow-inner">
            🔒
          </div>
          <div>
            <Badge variant="amber" className="mb-2">
              Khu Vực Triển Lãm Đang Khóa
            </Badge>
            <h2 className="text-2xl font-black font-jp text-slate-900 dark:text-white">
              {data.nameJa} • {data.name}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Bạn cần tích lũy tối thiểu{" "}
              <strong className="text-amber-600 dark:text-amber-400 font-bold">{requirementXp} XP</strong> từ các bài học
              để được cấp vé thông hành vào tham quan không gian văn hóa thành phố này.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-sumi-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 space-y-1">
            <p>💡 Hoàn thành các bài tập Kana, Kanji và bài học ngữ cảnh để tích lũy XP.</p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={onClose}>
              Quay lại bản đồ
            </Button>
            <Button
              variant="sakura"
              className="flex-1"
              onClick={() => {
                onClose();
                window.location.href = "/app/learn";
              }}
            >
              Học bài ngay 🚀
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const SECTIONS: Array<{ id: GallerySection; label: string; icon: string; count: number }> = [
    { id: "GOURMET", label: "Ẩm Thực Đặc Sản", icon: "🍱", count: data.delicacies.length },
    { id: "HISTORY", label: "Lịch Sử & Niên Đại", icon: "📜", count: data.history?.milestones.length || 0 },
    { id: "LANDMARKS", label: "Danh Thắng", icon: "⛩️", count: data.scenicPhotos.length },
    { id: "ARTIFACTS", label: "Bảo Vật & Di Sản", icon: "🏺", count: data.culturalArtifacts.length },
    { id: "ETIQUETTE", label: "Nghi Thức & Ứng Xử", icon: "🙏", count: data.culturalEtiquette?.length || 0 },
    { id: "LANGUAGE", label: "Tiếng Nhật Bản Địa", icon: "🗣️", count: data.language.length },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex flex-col items-center justify-start p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-6xl my-auto rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-slate-50 dark:bg-sumi-950 shadow-2xl overflow-hidden flex flex-col max-h-[94dvh]">
        {/* ── STICKY TOP APP BAR: Unified, Airy & Modern ────────────────── */}
        <header className="glass-panel sticky top-0 z-30 px-3 sm:px-6 py-2.5 sm:py-3 border-b border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3 bg-white/95 dark:bg-sumi-900/95 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl sm:text-3xl select-none shrink-0 p-1.5 rounded-2xl bg-white dark:bg-sumi-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              {data.landmark3D}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black font-jp text-slate-900 dark:text-white tracking-wide truncate">
                  {data.nameJa}
                </h2>
                <Badge variant="sakura" className="font-bold text-xs uppercase tracking-wider shrink-0">
                  {data.name}
                </Badge>
                
                {/* Live Exploration Progress Bar & Badge */}
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-sumi-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 shrink-0">
                  <div className="w-14 sm:w-20 h-1.5 bg-slate-200 dark:bg-sumi-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sakura-500 to-emerald-500 transition-all duration-500 rounded-full"
                      style={{ width: `${exploredPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-black text-slate-700 dark:text-slate-200">
                    {exploredPercent}%
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5" title="Tiến trình được lưu tự động theo thời gian thực">
                    💾 Tự lưu
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-lg mt-0.5">
                {data.description}
              </p>
            </div>
          </div>

          {/* Interactive Utility Controls (Omikuji, Stamp, City Switcher & Close) */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-between sm:justify-end w-full md:w-auto pt-1.5 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              {/* Omikuji Button */}
              <button
                type="button"
                onClick={drawOmikuji}
                disabled={isShakingOmikuji}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 dark:text-amber-200 border border-amber-200 dark:border-amber-900/60 flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                title="Rút quẻ may mắn Omikuji"
              >
                <span>🎋</span>
                <span>{isShakingOmikuji ? "Đang lắc..." : "Rút quẻ"}</span>
              </button>

              {/* Eki-Stamp Button */}
              <button
                type="button"
                onClick={triggerStamp}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold font-jp border transition-all active:scale-95 flex items-center gap-1.5 shadow-sm ${
                  isStamped
                    ? "border-red-500/80 text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-300 shadow-red-500/10"
                    : "border-slate-200 bg-white text-slate-600 hover:border-red-300 hover:text-red-600 dark:border-slate-700 dark:bg-sumi-900 dark:text-slate-300"
                } ${stampPounded ? "scale-110" : ""}`}
                title="Đóng con dấu kỷ niệm ga tàu"
              >
                <span>⛩️</span>
                <span>{isStamped ? `${data.nameJa.slice(0, 3)} 済` : "Đóng dấu ga"}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 ml-auto sm:ml-0">
              {/* City switcher */}
              {allCities && allCities.length > 1 && onSelectCity && (
                <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-sumi-900 border border-slate-200 dark:border-slate-800">
                  {allCities.slice(0, 5).map((c) => {
                    const isCurrent = c.slug === data.slug;
                    return (
                      <button
                        key={c.slug}
                        onClick={() => onSelectCity(c.slug)}
                        className={`px-2 py-0.5 rounded-lg text-xs font-jp font-bold transition-all ${
                          isCurrent
                            ? "bg-white dark:bg-sumi-800 text-sakura-600 dark:text-sakura-400 shadow-sm"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {c.nameJa}
                      </button>
                    );
                  })}
                </div>
              )}

              <button
                onClick={onClose}
                aria-label="Đóng Không Gian Văn Hóa"
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-sumi-800 dark:hover:bg-sumi-700 dark:text-slate-300 flex items-center justify-center font-bold text-base transition-all active:scale-95 border border-slate-200/80 dark:border-slate-700"
              >
                ✕
              </button>
            </div>
          </div>
        </header>

        {/* ── SUBTLE CULTURAL CONTEXT STRIP ─────────────────────────────────── */}
        <div className="px-4 sm:px-6 py-2 bg-gradient-to-r from-amber-50/70 via-rose-50/30 to-amber-50/70 dark:from-sumi-900 dark:via-sakura-950/20 dark:to-sumi-900 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 text-xs text-slate-700 dark:text-slate-300 flex-wrap">
          <div className="flex items-center gap-2 truncate">
            <span className="font-bold text-amber-700 dark:text-amber-400 shrink-0">💡 Bạn có biết:</span>
            <span className="truncate">{data.funFact}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            {data.highlights.slice(0, 2).map((h, i) => (
              <span
                key={i}
                className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-sumi-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              >
                ✨ {h}
              </span>
            ))}
          </div>
        </div>

        {/* ── SECTION NAVIGATION TABS ───────────────────────────────────────── */}
        <nav className="px-4 sm:px-6 py-2.5 bg-white/80 dark:bg-sumi-900/80 border-b border-slate-200/80 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  playClick();
                  setActiveSection(sec.id);
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all whitespace-nowrap active:scale-95 cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white dark:bg-white dark:text-sumi-950 shadow-sm"
                    : "bg-slate-100/80 dark:bg-sumi-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-sumi-700 border border-slate-200/60 dark:border-slate-800"
                }`}
              >
                <span>{sec.icon}</span>
                <span>{sec.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isActive
                      ? "bg-white/25 dark:bg-sumi-950/25 text-white dark:text-sumi-950"
                      : "bg-slate-200 dark:bg-sumi-700 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {sec.count}
                </span>
              </button>
            );
          })}
        </nav>

        {/* ── EXHIBITION MAIN DISPLAY WITH SCROLL OBSERVER ──────────────────── */}
        <main ref={scrollContainerRef} className="flex-1 p-5 sm:p-8 overflow-y-auto space-y-6">
          {/* 1. GOURMET TAB (Real verified food images & culinary culture) */}
          {activeSection === "GOURMET" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>🍱</span> Tinh Hoa Ẩm Thực Bản Địa ({data.name})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Hình ảnh chân thực các món ăn truyền thống danh tiếng, hồ sơ hương vị và mẫu câu gọi món bằng tiếng Nhật.
                  </p>
                </div>
                <Badge variant="amber" className="self-start sm:self-center font-bold">
                  {data.delicacies.length} Món Trứ Danh
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.delicacies.map((item, idx) => {
                  const exploreId = `food-${idx}`;
                  const isExplored = exploredItems.has(exploreId);
                  const isRecent = recentlyExploredId === exploreId;

                  return (
                    <Card
                      key={idx}
                      data-explore-id={exploreId}
                      hover
                      className={`overflow-hidden p-0 border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-sumi-900/90 flex flex-col group relative transition-all duration-300 ${
                        isRecent ? "ring-2 ring-emerald-500 shadow-lg scale-[1.01]" : isExplored ? "border-emerald-300/80 dark:border-emerald-800/80" : ""
                      }`}
                    >
                      {/* Real food image banner */}
                      <div className="relative aspect-[16/10] w-full bg-slate-100 dark:bg-sumi-800 overflow-hidden">
                        {/* 3s view / explored status indicator tag */}
                        <div className="absolute top-3 left-3 z-10">
                          {isExplored ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600/95 text-white backdrop-blur-md shadow-md animate-in fade-in duration-300">
                              ✓ Đã khám phá
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/60 text-slate-200 backdrop-blur-md border border-white/20">
                              ⏱️ Lướt 3s nhận %
                            </span>
                          )}
                        </div>

                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            unoptimized
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-6xl">
                            {item.icon}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                          <div>
                            <p className="font-jp font-black text-lg drop-shadow-md text-amber-300">
                              {item.nameJa || item.name}
                            </p>
                            <p className="font-bold text-sm drop-shadow-md">{item.name}</p>
                          </div>
                          <span className="text-2xl drop-shadow-md bg-white/20 backdrop-blur-md p-1.5 rounded-xl">
                            {item.icon}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {item.desc}
                        </p>

                        {item.taste && (
                          <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 leading-snug">
                            <strong className="font-bold text-amber-700 dark:text-amber-400 mr-1">Vị đặc trưng:</strong>
                            {item.taste}
                          </div>
                        )}

                        {item.orderingPhrase && (
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-sumi-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-[10px] uppercase font-bold text-slate-400">Cách gọi món tại quán:</p>
                              <p className="font-jp text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                {item.orderingPhrase}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                playChimeSound();
                                speakJapanese(item.orderingPhrase || item.nameJa || item.name);
                                markExplored(exploreId, true);
                              }}
                              title="Phát âm tiếng Nhật"
                              className="p-1.5 rounded-lg bg-white dark:bg-sumi-800 hover:bg-sakura-50 text-sakura-600 dark:text-sakura-400 transition shrink-0 border border-slate-200 dark:border-slate-700"
                            >
                              🔊
                            </button>
                          </div>
                        )}

                        <Button
                          variant={isExplored ? "secondary" : "sakura"}
                          size="sm"
                          className="w-full mt-2 text-xs font-bold"
                          onClick={() =>
                            openDetail(
                              {
                                type: "Món ngon trứ danh",
                                title: item.name,
                                titleJa: item.nameJa,
                                imageUrl: item.imageUrl,
                                icon: item.icon,
                                description: item.desc,
                                significance: item.taste,
                                extraInfo: item.orderingPhrase ? `Mẫu câu gọi món: "${item.orderingPhrase}"` : undefined,
                                audioText: item.nameJa || item.name,
                                tag: "Ẩm thực",
                              },
                              exploreId
                            )
                          }
                        >
                          Khám phá câu chuyện món ăn 📖
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. HISTORY TAB (Deep historical epochs, timeline & figures) */}
          {activeSection === "HISTORY" && (
            <div className="space-y-6">
              {data.history ? (
                <>
                  {/* Historical Epoch Summary Banner */}
                  <div
                    data-explore-id="hist-epoch"
                    className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-slate-50 dark:from-sumi-900 dark:via-sumi-950 dark:to-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/50 shadow-sm space-y-4 relative"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-100 dark:border-indigo-900/40 pb-3">
                      <div>
                        <Badge variant="fuji" className="font-bold text-xs uppercase tracking-wider mb-1">
                          Thời kỳ Lịch sử Trọng yếu
                        </Badge>
                        <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-jp">
                          {data.history.eraName}
                        </h4>
                      </div>
                      {data.history.famousFigure && (
                        <div className="text-right">
                          <p className="text-[10px] uppercase font-bold text-slate-400">Nhân vật vĩ đại gắn liền:</p>
                          <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                            {data.history.famousFigure}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {data.history.summary}
                    </div>
                  </div>

                  {/* Chronological Timeline */}
                  <div className="space-y-4">
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>⏳</span> Dòng Thời Gian Lịch Sử Hào Hùng ({data.history.milestones.length} Cột Mốc)
                    </h4>

                    <div className="relative border-l-2 border-indigo-200 dark:border-indigo-900 ml-4 pl-6 space-y-6">
                      {data.history.milestones.map((m, i) => {
                        const exploreId = `hist-${i}`;
                        const isExplored = exploredItems.has(exploreId);

                        return (
                          <div key={i} className="relative group">
                            {/* Dot marker */}
                            <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white dark:border-sumi-950 shadow-sm group-hover:scale-125 transition-transform" />

                            <Card
                              data-explore-id={exploreId}
                              hover
                              className={`p-5 border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-sumi-900/90 space-y-2 cursor-pointer transition-all duration-300 ${
                                isExplored ? "border-emerald-300/80 dark:border-emerald-800/80" : ""
                              }`}
                              onClick={() =>
                                openDetail(
                                  {
                                    type: "Cột mốc lịch sử",
                                    title: m.title,
                                    subtitle: m.year,
                                    description: m.desc,
                                    icon: "📜",
                                    tag: "Lịch sử",
                                  },
                                  exploreId
                                )
                              }
                            >
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                    {m.year}
                                  </span>
                                  {isExplored ? (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                      ✓ Đã xem
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-medium text-slate-400">⏱️ Lướt 3s</span>
                                  )}
                                </div>
                                <span className="text-[11px] text-slate-400">Bấm để đọc chi tiết →</span>
                              </div>
                              <h5 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                                {m.title}
                              </h5>
                              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                {m.desc}
                              </p>
                            </Card>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-slate-400 text-sm">
                  Đang cập nhật thêm tư liệu sử học cho thành phố này...
                </div>
              )}
            </div>
          )}

          {/* 3. LANDMARKS TAB (Scenic photos & architectural heritage) */}
          {activeSection === "LANDMARKS" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>⛩️</span> Danh Thắng & Biểu Tượng Kiến Trúc
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Những công trình kiến trúc đền đài, chùa chiền và biểu tượng linh thiêng của {data.name}.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {data.scenicPhotos.map((photo, i) => {
                  const exploreId = `landmark-${i}`;
                  const isExplored = exploredItems.has(exploreId);

                  return (
                    <Card
                      key={i}
                      data-explore-id={exploreId}
                      hover
                      className={`overflow-hidden p-0 border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-sumi-900/90 flex flex-col group cursor-pointer transition-all duration-300 ${
                        isExplored ? "border-emerald-300/80 dark:border-emerald-800/80" : ""
                      }`}
                      onClick={() =>
                        openDetail(
                          {
                            type: "Danh thắng biểu tượng",
                            title: photo.caption,
                            subtitle: photo.location,
                            imageUrl: photo.url,
                            description: photo.description || photo.caption,
                            icon: "⛩️",
                            tag: "Danh thắng",
                          },
                          exploreId
                        )
                      }
                    >
                      <div className="relative aspect-[16/11] bg-slate-100 dark:bg-sumi-800 overflow-hidden">
                        <div className="absolute top-3 left-3 z-10">
                          {isExplored ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600/95 text-white backdrop-blur-md shadow-md">
                              ✓ Đã xem
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/60 text-slate-200 backdrop-blur-md border border-white/20">
                              ⏱️ Lướt 3s
                            </span>
                          )}
                        </div>

                        <Image
                          src={photo.url}
                          alt={photo.caption}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        {photo.location && (
                          <div className="absolute bottom-3 left-3 text-white text-xs font-medium flex items-center gap-1">
                            <span>📍</span> {photo.location}
                          </div>
                        )}
                      </div>
                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <h5 className="font-bold text-sm text-slate-900 dark:text-white">{photo.caption}</h5>
                          {photo.description && (
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-3">
                              {photo.description}
                            </p>
                          )}
                        </div>
                        <span className="text-[11px] font-bold text-sakura-600 dark:text-sakura-400 pt-1">
                          Xem ảnh lớn & tư liệu →
                        </span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. ARTIFACTS TAB (Cultural treasures & handicrafts) */}
          {activeSection === "ARTIFACTS" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>🏺</span> Bảo Vật Quốc Gia & Nghệ Thuật Thủ Công
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Di sản mỹ nghệ tinh xảo, kiếm đạo Samurai, gốm sứ và trang phục truyền thống của {data.name}.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {data.culturalArtifacts.map((art, i) => {
                  const exploreId = `art-${i}`;
                  const isExplored = exploredItems.has(exploreId);

                  return (
                    <Card
                      key={i}
                      data-explore-id={exploreId}
                      hover
                      className={`overflow-hidden p-0 border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-sumi-900/90 flex flex-col group cursor-pointer transition-all duration-300 ${
                        isExplored ? "border-emerald-300/80 dark:border-emerald-800/80" : ""
                      }`}
                      onClick={() =>
                        openDetail(
                          {
                            type: "Bảo vật di sản",
                            title: art.title,
                            titleJa: art.titleJa,
                            imageUrl: art.imageUrl,
                            icon: art.icon,
                            description: art.desc,
                            significance: art.significance,
                            audioText: art.titleJa,
                            tag: "Bảo vật",
                          },
                          exploreId
                        )
                      }
                    >
                      {art.imageUrl && (
                        <div className="relative aspect-[16/10] bg-slate-100 dark:bg-sumi-800 overflow-hidden">
                          <div className="absolute top-3 left-3 z-10">
                            {isExplored ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600/95 text-white backdrop-blur-md shadow-md">
                                ✓ Đã xem
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/60 text-slate-200 backdrop-blur-md border border-white/20">
                                ⏱️ Lướt 3s
                              </span>
                            )}
                          </div>

                          <Image
                            src={art.imageUrl}
                            alt={art.title}
                            fill
                            unoptimized
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-3 right-3 text-2xl p-1.5 rounded-xl bg-white/30 backdrop-blur-md shadow-sm">
                            {art.icon}
                          </span>
                        </div>
                      )}
                      <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="font-jp text-xs font-bold text-amber-600 dark:text-amber-400">
                            {art.titleJa}
                          </p>
                          <h5 className="font-bold text-sm text-slate-900 dark:text-white">{art.title}</h5>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-3">
                            {art.desc}
                          </p>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-sumi-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                          <strong className="text-slate-700 dark:text-slate-300">Ý nghĩa:</strong>{" "}
                          {art.significance}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. ETIQUETTE TAB (Customs, manners & shrine rituals) */}
          {activeSection === "ETIQUETTE" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>🙏</span> Phong Tục, Nghi Thức & Phép Xã Giao
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Cẩm nang ứng xử lịch thiệp khi chiêm bái đền chùa, tắm suối nước nóng và giao tiếp với người bản xứ.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(data.culturalEtiquette || []).map((etq, i) => {
                  const exploreId = `etq-${i}`;
                  const isExplored = exploredItems.has(exploreId);

                  return (
                    <Card
                      key={i}
                      data-explore-id={exploreId}
                      hover
                      className={`p-5 border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-sumi-900/90 flex items-start gap-4 cursor-pointer transition-all duration-300 ${
                        isExplored ? "border-emerald-300/80 dark:border-emerald-800/80" : ""
                      }`}
                      onClick={() =>
                        openDetail(
                          {
                            type: "Nghi thức văn hóa",
                            title: etq.title,
                            icon: etq.icon,
                            description: etq.desc,
                            tag: "Nghi thức",
                          },
                          exploreId
                        )
                      }
                    >
                      <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-2xl shrink-0">
                        {etq.icon}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h5 className="font-bold text-sm text-slate-900 dark:text-white">{etq.title}</h5>
                          {isExplored ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                              ✓ Đã xem
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">⏱️ Lướt 3s</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{etq.desc}</p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* 6. LANGUAGE TAB (Dialect, everyday phrases with audio) */}
          {activeSection === "LANGUAGE" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>🗣️</span> Tiếng Nhật Bản Địa & Phương Ngữ {data.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Học các câu giao tiếp thực tế và phương ngữ đặc sắc, nhấn nút loa để nghe giọng đọc chuẩn bản ngữ.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {data.language.map((lang, i) => {
                  const exploreId = `lng-${i}`;
                  const isExplored = exploredItems.has(exploreId);

                  return (
                    <Card
                      key={i}
                      data-explore-id={exploreId}
                      hover
                      className={`p-5 border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-sumi-900/90 space-y-3 flex flex-col justify-between transition-all duration-300 ${
                        isExplored ? "border-emerald-300/80 dark:border-emerald-800/80" : ""
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-jp font-black text-base text-slate-900 dark:text-white leading-snug">
                            {lang.japanese}
                          </p>
                          <div className="flex items-center gap-1.5">
                            {isExplored ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                ✓ Đã học
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">⏱️ Lướt 3s</span>
                            )}
                            <button
                              onClick={() => {
                                playChimeSound();
                                speakJapanese(lang.japanese);
                                markExplored(exploreId, true);
                              }}
                              title="Nghe phát âm"
                              className="p-2 rounded-xl bg-slate-100 hover:bg-sakura-50 text-sakura-600 dark:bg-sumi-800 dark:hover:bg-sumi-700 dark:text-sakura-400 transition shrink-0 border border-slate-200 dark:border-slate-700 active:scale-95"
                            >
                              🔊
                            </button>
                          </div>
                        </div>
                        <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 italic">
                          {lang.romaji}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                        <strong>Ý nghĩa:</strong> {lang.meaning}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </main>

        {/* ── FOOTER ACTIONS ────────────────────────────────────────────────── */}
        <footer className="glass-panel px-6 py-4 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/95 dark:bg-sumi-900/95 backdrop-blur-md">
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>Trạng thái chặng:</span>
            {status === "COMPLETED" ? (
              <Badge variant="matcha" className="font-bold">
                ✓ Đã hoàn thành ({xpReward} XP)
              </Badge>
            ) : status === "IN_PROGRESS" ? (
              <Badge variant="sakura" className="font-bold">
                Đang khám phá ({exploredPercent}%)
              </Badge>
            ) : (
              <Badge variant="amber" className="font-bold">
                Có thể mở khóa
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {status !== "COMPLETED" && (
              <Button
                variant="sakura"
                size="md"
                loading={loadingAction}
                onClick={() => onAction(status === "IN_PROGRESS" ? "complete" : "unlock")}
                className="w-full sm:w-auto"
              >
                {status === "IN_PROGRESS" ? "Đánh dấu hoàn thành chặng 🏆" : "Bắt đầu chặng khám phá ⛩️"}
              </Button>
            )}
            <Button variant="secondary" size="md" onClick={onClose} className="w-full sm:w-auto">
              Đóng
            </Button>
          </div>
        </footer>
      </div>

      {/* ── DETAIL INSPECTION MODAL ───────────────────────────────────────── */}
      {detailItem && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setDetailItem(null)}
        >
          <div
            className="w-full max-w-xl rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-sumi-900 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {detailItem.imageUrl && (
              <div className="relative aspect-[16/10] w-full bg-slate-100 dark:bg-sumi-800 overflow-hidden">
                <Image
                  src={detailItem.imageUrl}
                  alt={detailItem.title}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <button
                  onClick={() => setDetailItem(null)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center font-bold text-sm transition"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="p-6 space-y-4">
              {!detailItem.imageUrl && (
                <div className="flex justify-between items-start">
                  <span className="text-4xl">{detailItem.icon || "📖"}</span>
                  <button
                    onClick={() => setDetailItem(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-sumi-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold text-xs transition"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div>
                {detailItem.tag && (
                  <Badge variant="sakura" className="mb-2 text-[10px] font-bold">
                    {detailItem.tag}
                  </Badge>
                )}
                {detailItem.titleJa && (
                  <p className="font-jp font-black text-amber-600 dark:text-amber-400 text-base">
                    {detailItem.titleJa}
                  </p>
                )}
                <h4 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  {detailItem.title}
                </h4>
                {detailItem.subtitle && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{detailItem.subtitle}</p>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-sumi-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {detailItem.description}
              </div>

              {detailItem.significance && (
                <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                  <strong className="font-bold text-amber-700 dark:text-amber-400 mr-1">
                    Ý nghĩa văn hóa / Hương vị:
                  </strong>
                  {detailItem.significance}
                </div>
              )}

              {detailItem.extraInfo && (
                <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed">
                  {detailItem.extraInfo}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                {detailItem.audioText && (
                  <Button
                    variant="sakura"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => {
                      playChimeSound();
                      speakJapanese(detailItem.audioText || detailItem.titleJa || detailItem.title);
                    }}
                  >
                    🔊 Nghe phát âm tiếng Nhật
                  </Button>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => setDetailItem(null)}
                >
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── OMIKUJI RESULT MODAL ─────────────────────────────────────────── */}
      {omikujiResult && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setOmikujiResult(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-amber-300 dark:border-amber-700/60 bg-gradient-to-b from-amber-50 to-white dark:from-sumi-900 dark:to-sumi-950 p-6 shadow-2xl space-y-4 text-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-3xl">
              🎋
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                Quẻ Xăm Đền Thần Đạo (おみくじ)
              </p>
              <h3 className="text-4xl font-black font-jp text-red-600 dark:text-red-400 mt-1">
                {omikujiResult.kanji}
              </h3>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                {omikujiResult.levelVi}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-100/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-xs italic text-amber-900 dark:text-amber-200 leading-relaxed whitespace-pre-line">
              &ldquo;{omikujiResult.poem}&rdquo;
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-sumi-900 border border-slate-200 dark:border-slate-800 text-left space-y-2 text-xs">
              <p className="font-bold text-amber-600 dark:text-amber-400">💡 Lời Khuyên Học Tập:</p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{omikujiResult.advice}</p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] text-slate-500">
                <span>Vật may mắn: <strong className="text-slate-800 dark:text-slate-200">{omikujiResult.luckyItem}</strong></span>
                <span>Màu: <strong className="text-amber-600 dark:text-amber-400">{omikujiResult.luckyColor}</strong></span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="gold" size="sm" className="flex-1 text-xs" onClick={drawOmikuji}>
                🔄 Lắc lại
              </Button>
              <Button variant="secondary" size="sm" className="flex-1 text-xs" onClick={() => setOmikujiResult(null)}>
                Cất quẻ
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Japanese3DRoom;
