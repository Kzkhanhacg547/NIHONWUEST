"use client";

import React, { useState, useEffect, useId, useRef } from "react";
import { SENSEI_CHARACTERS, type SenseiCharacter } from "@/lib/senseiCharacters";

export type AvatarState = "IDLE" | "TALKING" | "LISTENING" | "HAPPY";
export type MouthShape = "closed" | "a" | "i" | "u" | "e" | "o";

export interface SenseiAvatarProps {
  state?: AvatarState;
  isSpeaking?: boolean;
  isListening?: boolean;
  className?: string;
  /** Chiều rộng tối đa (px). Avatar co theo khung chứa nếu khung nhỏ hơn. */
  size?: number;
  /** Nhân vật (mặc định: Aoi). Chỉ đổi diện mạo; hình miệng dùng chung nên khẩu hình luôn khớp. */
  character?: SenseiCharacter;
  /**
   * Khẩu hình điều khiển từ ngoài (từ useSenseiVoice, bám âm thanh thật).
   * Không truyền → dùng chu kỳ nhép miệng cũ.
   */
  viseme?: MouthShape;
}

/**
 * Cánh hoa rơi: chỉ 5 cánh, chỉ animate transform/opacity (không gây layout),
 * và bị ẩn hoàn toàn khi người dùng bật "giảm chuyển động".
 */
const PETALS = [
  { left: "10%", size: 9, delay: "0s", dur: "10s" },
  { left: "32%", size: 7, delay: "3.5s", dur: "12s" },
  { left: "58%", size: 10, delay: "1.5s", dur: "11s" },
  { left: "80%", size: 8, delay: "6s", dur: "13s" },
  { left: "92%", size: 6, delay: "8s", dur: "10.5s" },
];

const AVATAR_CSS = `
.nq-sa{--px:0;--py:0}
.nq-sa-tilt{transform:perspective(900px) rotateY(calc(var(--px)*3deg)) rotateX(calc(var(--py)*-2.5deg));transition:transform .25s ease-out}
.nq-sa-layer{transform:translate3d(calc(var(--px)*var(--d)*1px),calc(var(--py)*var(--d)*.6px),0);transition:transform .25s ease-out}
@keyframes nq-sa-breathe{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-1.2%) scale(1.008)}}
.nq-sa-breathe{transform-origin:50% 100%;animation:nq-sa-breathe 5.5s ease-in-out infinite}
@keyframes nq-sa-float{0%,100%{transform:translateY(0) rotate(var(--r))}50%{transform:translateY(-6px) rotate(var(--r))}}
.nq-sa-card{animation:nq-sa-float 6s ease-in-out infinite}
@keyframes nq-sa-fall{0%{transform:translate3d(0,-12%,0);opacity:0}10%{opacity:.85}100%{transform:translate3d(-36px,112%,0);opacity:0}}
@keyframes nq-sa-spin{to{transform:rotate(320deg)}}
.nq-sa-track{position:absolute;top:0;height:100%;opacity:0;animation:nq-sa-fall linear infinite}
.nq-sa-petal{display:block;border-radius:100% 0 100% 0;background:#f9a8c0;animation:nq-sa-spin linear infinite}
@media (prefers-reduced-motion:reduce){
  .nq-sa-tilt,.nq-sa-layer{transform:none!important;transition:none}
  .nq-sa-breathe,.nq-sa-card{animation:none}
  .nq-sa-track{display:none}
}
`;

export function SenseiAvatar({
  state = "IDLE",
  isSpeaking = false,
  isListening = false,
  className = "",
  size = 180,
  character = SENSEI_CHARACTERS.aoi,
  viseme,
}: SenseiAvatarProps) {
  const pal = character.palette;
  const male = character.gender === "male";
  const [mouthShape, setMouthShape] = useState<MouthShape>("closed");
  const [isBlinking, setIsBlinking] = useState(false);
  const talkingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  // id gradient riêng cho từng instance; bỏ dấu ":" của useId để dùng trong url(#...).
  const uid = useId().replace(/:/g, "");

  // Determine current active state
  const effectiveState: AvatarState = isSpeaking
    ? "TALKING"
    : isListening
    ? "LISTENING"
    : state;

  // Natural Blinking Effect (Blinks every 3.5 - 5.5 seconds)
  useEffect(() => {
    let blinkTimeout: ReturnType<typeof setTimeout>;
    let openTimeout: ReturnType<typeof setTimeout>;

    const scheduleBlink = () => {
      const nextDelay = 3500 + Math.random() * 2000;
      blinkTimeout = setTimeout(() => {
        setIsBlinking(true);
        openTimeout = setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 150);
      }, nextDelay);
    };

    scheduleBlink();
    return () => {
      clearTimeout(blinkTimeout);
      clearTimeout(openTimeout);
    };
  }, []);

  // Natural Lip-sync Animation when speaking
  useEffect(() => {
    if (viseme !== undefined) return; // đang được điều khiển từ ngoài
    if (effectiveState === "TALKING") {
      const shapes: MouthShape[] = ["a", "o", "i", "e", "u", "a", "closed", "o", "i"];
      let idx = 0;

      talkingIntervalRef.current = setInterval(() => {
        setMouthShape(shapes[idx % shapes.length]);
        idx++;
      }, 110);
    } else if (effectiveState === "HAPPY") {
      setMouthShape("i");
    } else {
      setMouthShape("closed");
      if (talkingIntervalRef.current) {
        clearInterval(talkingIntervalRef.current);
        talkingIntervalRef.current = null;
      }
    }

    return () => {
      if (talkingIntervalRef.current) {
        clearInterval(talkingIntervalRef.current);
      }
    };
  }, [effectiveState, viseme]);

  // Hình miệng thực tế: ưu tiên viseme từ ngoài khi đang nói.
  const shownMouth: MouthShape =
    viseme !== undefined
      ? effectiveState === "TALKING"
        ? viseme
        : effectiveState === "HAPPY"
        ? "i"
        : "closed"
      : mouthShape;

  // Parallax nhẹ theo con trỏ chuột. Ghi thẳng CSS variable, không setState nên
  // không re-render. Cảm ứng (điện thoại) bỏ qua hoàn toàn.
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = rootRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    el.style.setProperty("--px", x.toFixed(3));
    el.style.setProperty("--py", y.toFixed(3));
  };
  const onPointerLeave = () => {
    const el = rootRef.current;
    if (!el) return;
    el.style.setProperty("--px", "0");
    el.style.setProperty("--py", "0");
  };

  // Mouth SVG paths for different visemes
  const renderMouth = () => {
    switch (shownMouth) {
      case "a":
        // Wide open mouth for A / Ha / Ka
        return (
          <g transform="translate(100, 140)">
            <ellipse cx="0" cy="0" rx="9" ry="8" fill="#e11d48" />
            <path d="M -7 -1 Q 0 -4 7 -1 Q 0 7 -7 -1" fill="#be123c" />
            <ellipse cx="0" cy="4" rx="5" ry="3" fill="#fb7185" />
            <path d="M -9 0 Q 0 -6 9 0" stroke="#881337" strokeWidth="1.5" fill="none" />
          </g>
        );
      case "i":
        // Stretched smiling mouth for I / Ki / Shi
        return (
          <g transform="translate(100, 140)">
            <path d="M -11 -1 Q 0 -5 11 -1 Q 0 5 -11 -1" fill="#e11d48" />
            <path d="M -10 -1 Q 0 -2 10 -1" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M -12 -1 Q 0 -6 12 -1" stroke="#881337" strokeWidth="1.5" fill="none" />
          </g>
        );
      case "u":
        // Small puckered mouth for U / Ku / Su
        return (
          <g transform="translate(100, 140)">
            <ellipse cx="0" cy="1" rx="5" ry="5" fill="#e11d48" />
            <path d="M -4 0 Q 0 -3 4 0" stroke="#881337" strokeWidth="1.5" fill="none" />
          </g>
        );
      case "e":
        // Semi-open mouth for E / Ke / Se
        return (
          <g transform="translate(100, 140)">
            <ellipse cx="0" cy="0" rx="8" ry="6" fill="#e11d48" />
            <path d="M -7 -1 Q 0 -3 7 -1" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M -8 0 Q 0 -4 8 0" stroke="#881337" strokeWidth="1.5" fill="none" />
          </g>
        );
      case "o":
        // Rounded mouth for O / Ko / So
        return (
          <g transform="translate(100, 140)">
            <ellipse cx="0" cy="1" rx="6" ry="7" fill="#e11d48" />
            <ellipse cx="0" cy="4" rx="4" ry="3" fill="#fb7185" />
            <path d="M -6 0 Q 0 -3 6 0" stroke="#881337" strokeWidth="1.5" fill="none" />
          </g>
        );
      case "closed":
      default:
        // Gentle smiling closed lips
        return (
          <g transform="translate(100, 140)">
            <path d="M -7 -1 Q 0 4 7 -1" stroke="#be123c" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="-8" cy="-2" r="0.8" fill="#fda4af" />
            <circle cx="8" cy="-2" r="0.8" fill="#fda4af" />
          </g>
        );
    }
  };

  // Đầu + tóc sau nghiêng/nhấc nhẹ theo trạng thái (cùng một transform để không lệch nhau).
  const headStyle: React.CSSProperties = {
    transformOrigin: "100px 160px",
    transition: "transform 0.4s ease",
    transform:
      effectiveState === "LISTENING"
        ? "rotate(-2deg)"
        : effectiveState === "HAPPY"
        ? "rotate(1.5deg) translateY(-1px)"
        : effectiveState === "TALKING"
        ? "translateY(-1px)"
        : "none",
  };

  const g = (name: string) => `url(#${uid}-${name})`;

  // Viền trạng thái: lắng nghe = đỏ nhịp chậm, đang nói = đỏ nhạt cố định.
  const stateRing =
    effectiveState === "LISTENING"
      ? "ring-2 ring-inset ring-red-500/60 motion-safe:animate-pulse"
      : effectiveState === "TALKING"
      ? "ring-2 ring-inset ring-red-400/40"
      : "";

  return (
    <div
      ref={rootRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`nq-sa relative mx-auto select-none ${className}`}
      style={{ width: "100%", maxWidth: size }}
    >
      <style>{AVATAR_CSS}</style>

      <div className="nq-sa-tilt relative aspect-[10/11] overflow-hidden rounded-[28px] border border-red-100/80 bg-gradient-to-b from-[#fff8f5] via-[#fff1ee] to-[#ffe3df] shadow-[0_18px_40px_-20px_rgba(127,29,29,0.4)] dark:border-slate-700 dark:from-sumi-900 dark:via-sumi-900 dark:to-sumi-950">
        {/* Lớp 1 (sâu nhất): mặt trời đỏ + khung shoji */}
        <svg
          aria-hidden="true"
          viewBox="0 0 200 220"
          className="nq-sa-layer absolute inset-0 h-full w-full"
          style={{ "--d": -5 } as React.CSSProperties}
          preserveAspectRatio="xMidYMid slice"
        >
          <circle cx="100" cy="118" r="66" className="fill-red-600/10 dark:fill-red-500/15" />
          <circle cx="100" cy="118" r="66" fill="none" strokeWidth="1" className="stroke-red-600/20 dark:stroke-red-400/25" />
          <g className="stroke-slate-400/30 dark:stroke-slate-500/20" strokeWidth="0.8">
            <line x1="50" y1="0" x2="50" y2="220" />
            <line x1="100" y1="0" x2="100" y2="220" />
            <line x1="150" y1="0" x2="150" y2="220" />
            <line x1="0" y1="55" x2="200" y2="55" />
            <line x1="0" y1="110" x2="200" y2="110" />
            <line x1="0" y1="165" x2="200" y2="165" />
          </g>
        </svg>

        {/* Lớp 2: thẻ học tiếng Nhật lơ lửng (trang trí) */}
        <div aria-hidden="true" className="nq-sa-layer pointer-events-none absolute inset-0" style={{ "--d": -9 } as React.CSSProperties}>
          <span
            className="nq-sa-card absolute left-[7%] top-[12%] grid h-[15%] w-[13%] place-items-center rounded-lg border border-slate-200 bg-white font-jp text-xs font-bold text-red-600 shadow-sm sm:text-sm dark:border-slate-700 dark:bg-sumi-800 dark:text-red-400"
            style={{ "--r": "-8deg" } as React.CSSProperties}
          >
            あ
          </span>
          <span
            className="nq-sa-card absolute right-[7%] top-[30%] grid h-[15%] w-[13%] place-items-center rounded-lg border border-slate-200 bg-white font-jp text-xs font-bold text-slate-700 shadow-sm sm:text-sm dark:border-slate-700 dark:bg-sumi-800 dark:text-slate-200"
            style={{ "--r": "7deg", animationDelay: "-2.5s" } as React.CSSProperties}
          >
            文
          </span>
        </div>

        {/* Lớp 3: nhân vật (2.5D, nhiều lớp SVG) */}
        <div
          className="nq-sa-layer absolute inset-x-0 bottom-0"
          style={{
            "--d": 4,
          } as React.CSSProperties}
        >
          <div
            style={{
              transition: "transform 0.3s ease",
              transformOrigin: "50% 100%",
              transform: effectiveState === "TALKING" || effectiveState === "HAPPY" ? "scale(1.02)" : "none",
            }}
          >
            <svg viewBox="0 0 200 200" className="nq-sa-breathe block h-auto w-full" role="img" aria-label={`${character.nameRomaji}, giáo viên tiếng Nhật AI`}>
              <defs>
                <linearGradient id={`${uid}-hair`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={pal.hair[0]} />
                  <stop offset="60%" stopColor={pal.hair[1]} />
                  <stop offset="100%" stopColor={pal.hair[2]} />
                </linearGradient>
                <linearGradient id={`${uid}-skin`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={pal.skin[0]} />
                  <stop offset="100%" stopColor={pal.skin[1]} />
                </linearGradient>
                <linearGradient id={`${uid}-neck`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={pal.neck[0]} />
                  <stop offset="100%" stopColor={pal.neck[1]} />
                </linearGradient>
                <linearGradient id={`${uid}-eye`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#9a4a3c" />
                  <stop offset="100%" stopColor="#3b1d1a" />
                </linearGradient>
                <linearGradient id={`${uid}-blazer`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={pal.blazer[0]} />
                  <stop offset="100%" stopColor={pal.blazer[1]} />
                </linearGradient>
                <linearGradient id={`${uid}-lapel`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={pal.lapel[0]} />
                  <stop offset="100%" stopColor={pal.lapel[1]} />
                </linearGradient>
                <filter id={`${uid}-blur`} x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" />
                </filter>
              </defs>

              {/* Tóc sau (nằm sau vai) */}
              {!male && (
                <g style={headStyle}>
                  <path d="M 50 80 C 40 130 50 170 70 185 C 130 185 150 170 160 80 Z" fill={g("hair")} />
                </g>
              )}

              {/* Áo blazer giáo viên */}
              <path d="M 24 200 C 26 170 56 152 84 149 L 116 149 C 144 152 174 170 176 200 Z" fill={g("blazer")} />
              {/* Cổ */}
              {male ? (
                <path d="M 86 132 L 86 154 C 91 163 109 163 114 154 L 114 132 Z" fill={g("neck")} />
              ) : (
                <path d="M 89 132 L 89 154 C 93 162 107 162 111 154 L 111 132 Z" fill={g("neck")} />
              )}
              {/* Áo sơ mi trắng */}
              <path d="M 85 150 L 100 186 L 115 150 C 108 156 92 156 85 150 Z" fill="#ffffff" />
              {/* Ve áo */}
              <path d="M 84 149 L 100 188 L 84 200 L 46 200 C 50 174 66 157 84 149 Z" fill={g("lapel")} />
              <path d="M 116 149 L 100 188 L 116 200 L 154 200 C 150 174 134 157 116 149 Z" fill={g("lapel")} />
              {/* Nơ đỏ / Cà vạt */}
              {male ? (
                <g>
                  <path d="M 100 160 L 106 166 L 103 172 L 106 196 L 100 200 L 94 196 L 97 172 L 94 166 Z" fill={pal.accent} />
                  <path d="M 94 154 L 106 154 L 107 162 L 100 166 L 93 162 Z" fill={pal.accentDark} />
                </g>
              ) : (
                <g transform="translate(100, 166)">
                  <path d="M 0 0 L -14 -7 L -14 7 Z" fill={pal.accent} />
                  <path d="M 0 0 L 14 -7 L 14 7 Z" fill={pal.accent} />
                  <rect x="-3" y="-3.5" width="6" height="7" rx="2" fill={pal.accentDark} />
                </g>
              )}

              {/* Đầu */}
              <g style={headStyle}>
                <ellipse cx="100" cy="105" rx={male ? 43 : 42} ry={male ? 47 : 46} fill={g("skin")} />

                {/* Má hồng */}
                <circle cx="76" cy="116" r="8" fill="#fb7185" opacity={male ? 0.16 : 0.4} filter={g("blur")} />
                <circle cx="124" cy="116" r="8" fill="#fb7185" opacity={male ? 0.16 : 0.4} filter={g("blur")} />

                {/* Mắt (chớp mắt + biểu cảm) */}
                {isBlinking ? (
                  <g stroke="#3b1d1a" strokeWidth="2.5" strokeLinecap="round" fill="none">
                    <path d="M 72 104 Q 80 108 88 104" />
                    <path d="M 112 104 Q 120 108 128 104" />
                  </g>
                ) : effectiveState === "HAPPY" ? (
                  <g stroke="#3b1d1a" strokeWidth="3" strokeLinecap="round" fill="none">
                    <path d="M 72 104 Q 80 96 88 104" />
                    <path d="M 112 104 Q 120 96 128 104" />
                  </g>
                ) : (
                  <g>
                    <g transform="translate(80, 102)">
                      <ellipse cx="0" cy="0" rx="8" ry="11" fill={g("eye")} />
                      <ellipse cx="0" cy="2" rx="6" ry="7" fill="#1f1010" />
                      <circle cx="-2" cy="-4" r="3" fill="#ffffff" />
                      <circle cx="2" cy="3" r="1.5" fill="#ffffff" />
                      <path d="M -10 -10 Q 0 -13 9 -7" stroke="#1f1010" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    </g>
                    <g transform="translate(120, 102)">
                      <ellipse cx="0" cy="0" rx="8" ry="11" fill={g("eye")} />
                      <ellipse cx="0" cy="2" rx="6" ry="7" fill="#1f1010" />
                      <circle cx="-2" cy="-4" r="3" fill="#ffffff" />
                      <circle cx="2" cy="3" r="1.5" fill="#ffffff" />
                      <path d="M -9 -7 Q 0 -13 10 -10" stroke="#1f1010" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    </g>
                  </g>
                )}

                {/* Lông mày */}
                <g stroke="#3b2f45" strokeWidth={male ? 3 : 2} strokeLinecap="round" fill="none">
                  <path d={male ? "M 71 88 Q 80 85 89 87" : "M 72 88 Q 80 84 88 88"} />
                  <path d={male ? "M 111 87 Q 120 85 129 88" : "M 112 88 Q 120 84 128 88"} />
                </g>

                <circle cx="100" cy="124" r="1" fill="#f0a3a8" />

                {/* Miệng (lip-sync) */}
                {renderMouth()}

                {/* Bóng đổ của mái lên trán — tạo chiều sâu */}
                <ellipse cx="100" cy="86" rx="34" ry="9" fill="#262238" opacity="0.12" filter={g("blur")} />

                {male ? (
                  <>
                    {/* Tóc ngắn gọn gàng */}
                    <path
                      d="M 56 100 C 48 58 70 44 100 44 C 130 44 152 58 144 100 C 142 86 136 76 126 74 C 116 69 108 77 98 72 C 88 78 78 71 70 75 C 62 78 58 88 56 100 Z"
                      fill={g("hair")}
                    />
                    <path d="M 70 62 C 84 52 110 51 128 58" stroke="#ffffff" strokeOpacity="0.14" strokeWidth="3" strokeLinecap="round" fill="none" />
                  </>
                ) : (
                  <>
                    {/* Mái */}
                    <path
                      d="M 58 75 C 65 50 135 50 142 75 C 135 105 125 115 120 95 C 110 115 90 115 80 95 C 75 115 65 105 58 75 Z"
                      fill={g("hair")}
                    />
                    <path d="M 72 68 C 84 58 108 56 124 62" stroke="#ffffff" strokeOpacity="0.16" strokeWidth="3" strokeLinecap="round" fill="none" />

                    {/* Tóc hai bên */}
                    <path d="M 58 75 C 50 100 52 140 60 150 C 65 140 62 100 68 85 Z" fill={g("hair")} />
                    <path d="M 142 75 C 150 100 148 140 140 150 C 135 140 138 100 132 85 Z" fill={g("hair")} />
                  </>
                )}

                {/* Kính mảnh — dấu hiệu "giáo viên" */}
                <g stroke="#475569" strokeWidth="1.5" strokeLinecap="round" fill="none">
                  <rect x="66" y="89" width="28" height="25" rx={male ? 5 : 10} fill="#ffffff" fillOpacity="0.1" />
                  <rect x="106" y="89" width="28" height="25" rx={male ? 5 : 10} fill="#ffffff" fillOpacity="0.1" />
                  <path d="M 94 100 Q 100 96 106 100" />
                  <path d="M 66 98 L 58 96" />
                  <path d="M 134 98 L 142 96" />
                </g>
                <g stroke="#ffffff" strokeOpacity="0.55" strokeWidth="1.2" strokeLinecap="round">
                  <path d="M 71 106 L 76 96" />
                  <path d="M 111 106 L 116 96" />
                </g>

                {!male && (
                  <g transform="translate(136, 68) scale(0.9)">
                    <path d="M 0 0 C -4 -10 4 -10 0 0" fill="#f9a8c0" />
                    <path d="M 0 0 C 10 -4 10 4 0 0" fill="#f9a8c0" />
                    <path d="M 0 0 C 4 10 -4 10 0 0" fill="#f9a8c0" />
                    <path d="M 0 0 C -10 4 -10 -4 0 0" fill="#f9a8c0" />
                    <circle cx="0" cy="0" r="2.5" fill="#fbbf24" />
                  </g>
                )}
              </g>
            </svg>
          </div>
        </div>

        {/* Lớp 4 (gần nhất): cánh hoa anh đào rơi */}
        <div aria-hidden="true" className="nq-sa-layer pointer-events-none absolute inset-0 overflow-hidden" style={{ "--d": 12 } as React.CSSProperties}>
          {PETALS.map((p, i) => (
            <span key={i} className="nq-sa-track" style={{ left: p.left, width: p.size, animationDuration: p.dur, animationDelay: p.delay }}>
              <span className="nq-sa-petal" style={{ width: p.size, height: p.size, animationDuration: p.dur, animationDelay: p.delay }} />
            </span>
          ))}
        </div>

        {/* Ánh sáng mềm di chuyển theo con trỏ */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70 dark:opacity-20"
          style={{
            background:
              "radial-gradient(circle at calc(50% + var(--px) * 18%) calc(28% + var(--py) * 12%), rgba(255,255,255,0.45), transparent 55%)",
          }}
        />

        {/* Viền trạng thái */}
        <div aria-hidden="true" className={`pointer-events-none absolute inset-0 rounded-[28px] ${stateRing}`} />
      </div>
    </div>
  );
}