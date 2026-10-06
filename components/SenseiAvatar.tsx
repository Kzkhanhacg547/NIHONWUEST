"use client";

import { useEffect, useId, useRef, useState } from "react";
import { DEFAULT_SENSEI_ID, SENSEI_CHARACTERS, type SenseiCharacter } from "@/lib/senseiCharacters";

/**
 * Avatar chuyển động dựng thẳng từ ảnh minh hoạ (1 ảnh, nhiều lớp SVG):
 *  • Ảnh nền thở + đung đưa nhẹ, đổi dáng theo trạng thái (nghe / nói / suy nghĩ / vui / lo).
 *  • Chớp mắt tự động; mắt cười "^ ^" khi vui.
 *  • Khẩu hình: lớp miệng vẽ đè lên miệng gốc, chạy theo `viseme` của giọng đọc.
 *    Không có viseme (trình duyệt không cho boundary) → tự tạo nhịp mở/đóng theo lúc đang nói.
 *  • Hiệu ứng cảm xúc: má hồng, lấp lánh (vui), giọt mồ hôi (lo), dấu chấm "…" (đang nghĩ).
 * Tôn trọng prefers-reduced-motion (tắt chuyển động nền, vẫn giữ khẩu hình để biết Sensei đang nói).
 */

export type AvatarState = "IDLE" | "LISTENING" | "TALKING" | "THINKING" | "HAPPY" | "WORRIED";
export type AvatarEmotion = "NEUTRAL" | "HAPPY" | "WORRIED";

interface Props {
  state?: AvatarState;
  /** Cảm xúc nền, độc lập với việc đang nói/nghe. */
  emotion?: AvatarEmotion;
  isSpeaking?: boolean;
  isListening?: boolean;
  /** Bỏ trống → Aoi Sensei (an toàn cho nơi gọi cũ chưa truyền character). */
  character?: SenseiCharacter;
  /**
   * Khẩu hình từ useSenseiVoice. Chấp nhận: số 0..1, chuỗi nguyên âm ("a","i","u","e","o","あ"…),
   * hoặc object { open: number }. undefined/null → dùng nhịp mô phỏng.
   */
  viseme?: unknown;
  /** Giữ để tương thích code cũ — kích thước thật do khung cha quyết định. */
  size?: number;
  className?: string;
}

/* ───────────── Khẩu hình ───────────── */

interface Shape {
  open: number;
  wide: number;
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const CLOSED = new Set(["", "x", "sil", "silence", "rest", "closed", "none", "idle", "m", "b", "p", "n"]);

function shapeOf(v: unknown): Shape | null {
  if (v === undefined || v === null) return null;
  if (typeof v === "number") return { open: clamp01(v), wide: 0.9 };
  if (typeof v === "object") {
    const o = v as Record<string, unknown>;
    const n = o.open ?? o.openness ?? o.amount ?? o.value;
    if (typeof n === "number") return { open: clamp01(n), wide: typeof o.wide === "number" ? o.wide : 0.9 };
    return shapeOf(o.viseme ?? o.shape ?? o.vowel);
  }
  const s = String(v).trim().toLowerCase();
  if (CLOSED.has(s)) return { open: 0.04, wide: 1 };
  const c = s[0];
  if ("aあアぁ".includes(c)) return { open: 0.95, wide: 0.85 };
  if ("iいイぃ".includes(c)) return { open: 0.35, wide: 1.18 };
  if ("uうウぅ".includes(c)) return { open: 0.4, wide: 0.62 };
  if ("eえエぇ".includes(c)) return { open: 0.6, wide: 1.05 };
  if ("oおオぉ".includes(c)) return { open: 0.78, wide: 0.68 };
  return { open: 0.5, wide: 0.9 };
}

/** Dựng path miệng (toạ độ cục bộ, gốc ở tâm miệng). */
function mouthGeometry(baseW: number, baseH: number, open: number, wide: number) {
  const w = baseW * 0.92 * wide;
  const c = -w * 0.05; // khoé miệng hơi nhếch lên
  const u = c + w * 0.2; // môi trên võng nhẹ (nụ cười)
  const d = baseH * 1.15 * open; // độ mở
  const outline = `M${-w / 2} ${c}Q0 ${u} ${w / 2} ${c}Q0 ${u + 2 * d} ${-w / 2} ${c}Z`;
  const topMid = (c + u) / 2;
  return {
    w,
    outline,
    teeth: { x: -w / 2, y: c - 2, width: w, height: topMid - c + 2 + Math.min(d * 0.55, 7), opacity: open > 0.12 ? 1 : 0 },
    tongue: { cx: 0, cy: topMid + d * 0.85, rx: w * 0.22, ry: Math.max(0.01, d * 0.32) },
  };
}

/* ───────────── CSS chuyển động ───────────── */

const CSS = `
.nqa-root{position:relative;width:100%;height:100%;overflow:hidden}
.nqa-fade{animation:nqa-in .4s ease both}
@keyframes nqa-in{from{opacity:0}to{opacity:1}}
.nqa-breath{transform-box:view-box;animation:nqa-breath 4.4s ease-in-out infinite}
@keyframes nqa-breath{0%,100%{transform:scale(1) translateY(0)}50%{transform:scale(1.012) translateY(-2px)}}
.nqa-body{transform-box:view-box}
.nqa-m-idle{animation:nqa-sway 6.5s ease-in-out infinite}
.nqa-m-talk{animation:nqa-talk .9s ease-in-out infinite alternate}
.nqa-m-listen{animation:nqa-listen 2.8s ease-in-out infinite}
.nqa-m-think{animation:nqa-think 3.6s ease-in-out infinite}
.nqa-m-happy{animation:nqa-hop .9s ease-in-out 2, nqa-sway 6.5s ease-in-out 1.8s infinite}
.nqa-m-worried{animation:nqa-worry 3.2s ease-in-out infinite}
@keyframes nqa-sway{0%,100%{transform:rotate(-.5deg)}50%{transform:rotate(.5deg)}}
@keyframes nqa-talk{from{transform:rotate(-.4deg) translateY(0)}to{transform:rotate(.5deg) translateY(-3px)}}
@keyframes nqa-listen{0%,100%{transform:rotate(-1.6deg) translateY(0)}45%{transform:rotate(-1.6deg) translateY(5px)}60%{transform:rotate(-1.6deg) translateY(0)}}
@keyframes nqa-think{0%,100%{transform:rotate(1.4deg)}50%{transform:rotate(.6deg) translateY(2px)}}
@keyframes nqa-hop{0%,100%{transform:translateY(0)}35%{transform:translateY(-12px)}65%{transform:translateY(-4px)}}
@keyframes nqa-worry{0%,100%{transform:rotate(-1deg) translateY(4px)}50%{transform:rotate(-1.4deg) translateY(6px)}}

.nqa-lid{transform-box:fill-box;transform-origin:50% 0%;transform:scaleY(0);transition:transform .16s ease-out}
.nqa-blink .nqa-lid{animation:nqa-blink 5.2s infinite;animation-delay:-1.7s}
@keyframes nqa-blink{0%,92%,100%{transform:scaleY(0)}94%,95.5%{transform:scaleY(1)}97%{transform:scaleY(0)}98.2%{transform:scaleY(1)}99.2%{transform:scaleY(0)}}
.nqa-eyes-happy .nqa-lid{transform:scaleY(1);animation:none}
.nqa-arc-happy{opacity:0;transition:opacity .12s}
.nqa-arc-shut{opacity:1}
.nqa-eyes-happy .nqa-arc-happy{opacity:1}
.nqa-eyes-happy .nqa-arc-shut{opacity:0}

.nqa-blush{opacity:0;transition:opacity .35s}
.nqa-show .nqa-blush{opacity:.5}
.nqa-twinkle{transform-box:fill-box;transform-origin:center;animation:nqa-twinkle 1.1s ease-in-out infinite}
@keyframes nqa-twinkle{0%,100%{transform:scale(.55);opacity:.35}50%{transform:scale(1.1);opacity:1}}
.nqa-dot{animation:nqa-dot 1.1s ease-in-out infinite}
@keyframes nqa-dot{0%,100%{transform:translateY(0);opacity:.45}40%{transform:translateY(-9px);opacity:1}}
.nqa-drop{animation:nqa-drop 1.8s ease-in infinite}
@keyframes nqa-drop{0%{transform:translateY(-6px);opacity:0}25%{opacity:1}100%{transform:translateY(26px);opacity:0}}
.nqa-petal{animation:nqa-petal linear infinite}
@keyframes nqa-petal{from{transform:translate(0,-40px) rotate(0)}to{transform:translate(-70px,960px) rotate(300deg)}}

@media (prefers-reduced-motion:reduce){
  .nqa-breath,.nqa-body,.nqa-lid,.nqa-twinkle,.nqa-dot,.nqa-drop,.nqa-petal{animation:none!important}
  .nqa-petal{display:none}
}
`;

const PETALS: ReadonlyArray<readonly [number, number, number, number]> = [
  // x, kích thước, thời lượng (s), độ trễ (s) — cố định để SSR/CSR khớp.
  [260, 12, 11, -2], [430, 9, 14, -7], [620, 11, 12, -4], [800, 8, 15, -10], [950, 12, 13, -1],
];

/* ───────────── Component ───────────── */

export function SenseiAvatar({
  state = "IDLE",
  emotion,
  isSpeaking,
  isListening,
  character: characterProp,
  viseme,
  size,
  className = "",
}: Props) {
  const character = characterProp ?? SENSEI_CHARACTERS[DEFAULT_SENSEI_ID];
  const art = character.art;
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const talking = isSpeaking ?? state === "TALKING";
  const listening = isListening ?? state === "LISTENING";
  const mood: AvatarEmotion = emotion ?? (state === "HAPPY" ? "HAPPY" : state === "WORRIED" ? "WORRIED" : "NEUTRAL");
  const thinking = state === "THINKING" && !talking && !listening;

  const mode = talking
    ? "talk"
    : listening
    ? "listen"
    : thinking
    ? "think"
    : mood === "HAPPY"
    ? "happy"
    : mood === "WORRIED"
    ? "worried"
    : "idle";
  const happyEyes = mood === "HAPPY" && !talking;

  /* Tải ảnh trước để không nháy khung trống */
  const [img, setImg] = useState<"loading" | "ok" | "error">("loading");
  useEffect(() => {
    if (!art) return;
    let alive = true;
    setImg("loading");
    const im = new Image();
    im.onload = () => alive && setImg("ok");
    im.onerror = () => alive && setImg("error");
    im.src = art.src;
    return () => {
      alive = false;
    };
  }, [art]);

  /* Khẩu hình — cập nhật DOM trực tiếp mỗi frame, không re-render React */
  const mouthRef = useRef<SVGPathElement | null>(null);
  const clipRef = useRef<SVGPathElement | null>(null);
  const outlineRef = useRef<SVGPathElement | null>(null);
  const teethRef = useRef<SVGRectElement | null>(null);
  const tongueRef = useRef<SVGEllipseElement | null>(null);
  const visemeRef = useRef<unknown>(viseme);
  const talkingRef = useRef(talking);
  visemeRef.current = viseme;
  talkingRef.current = talking;

  useEffect(() => {
    if (!art || img !== "ok") return;
    const cur = { open: 0, wide: 1 };
    let raf = 0;

    const paint = () => {
      const g = mouthGeometry(art.mouth.w, art.mouth.h, cur.open, cur.wide);
      mouthRef.current?.setAttribute("d", g.outline);
      clipRef.current?.setAttribute("d", g.outline);
      outlineRef.current?.setAttribute("d", g.outline);
      const t = teethRef.current;
      if (t) {
        t.setAttribute("x", String(g.teeth.x));
        t.setAttribute("y", String(g.teeth.y));
        t.setAttribute("width", String(g.teeth.width));
        t.setAttribute("height", String(g.teeth.height));
        t.setAttribute("opacity", String(g.teeth.opacity));
      }
      const tg = tongueRef.current;
      if (tg) {
        tg.setAttribute("cx", String(g.tongue.cx));
        tg.setAttribute("cy", String(g.tongue.cy));
        tg.setAttribute("rx", String(g.tongue.rx));
        tg.setAttribute("ry", String(g.tongue.ry));
      }
    };

    const tick = (now: number) => {
      const on = talkingRef.current;
      let target: Shape = { open: 0, wide: 1 };
      if (on) {
        const fromVoice = shapeOf(visemeRef.current);
        if (fromVoice) target = fromVoice;
        else {
          const t = now / 1000;
          target = {
            open: 0.18 + 0.72 * Math.abs(Math.sin(t * 8.5)) * (0.55 + 0.45 * Math.abs(Math.sin(t * 2.1 + 1))),
            wide: 0.75 + 0.35 * Math.abs(Math.sin(t * 3.3)),
          };
        }
      }
      cur.open += (target.open - cur.open) * (target.open > cur.open ? 0.45 : 0.3);
      cur.wide += (target.wide - cur.wide) * 0.3;
      paint();
      if (on || cur.open > 0.02) raf = requestAnimationFrame(tick);
      else raf = 0;
    };

    if (talking) raf = requestAnimationFrame(tick);
    else paint();
    return () => cancelAnimationFrame(raf);
  }, [art, img, talking]);

  /* Không có dữ liệu art hoặc ảnh lỗi → chân dung tĩnh, UI không vỡ */
  if (!art || img === "error") {
    return (
      <div className={`relative grid h-full w-full place-items-center ${className}`}>
        {character.portrait ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={character.portrait}
            alt={character.nameRomaji}
            className="h-32 w-32 rounded-full object-cover ring-4 ring-white shadow-lg"
          />
        ) : (
          <span
            aria-label={character.nameRomaji}
            className="grid h-28 w-28 place-items-center rounded-full bg-red-600 font-jp text-5xl font-black text-white shadow-lg ring-4 ring-white"
          >
            {character.seal}
          </span>
        )}
      </div>
    );
  }

  const [vx, vy, vw, vh] = art.viewBox;
  const [px, py] = art.pivot;
  const skinEyes = art.skin.eyes;
  const g0 = mouthGeometry(art.mouth.w, art.mouth.h, 0, 1);
  const showFx = mood === "HAPPY";

  return (
    <div className={`nqa-root ${className}`} data-state={mode} style={size ? { minHeight: size } : undefined}>
      <style>{CSS}</style>
      {/* Nền chờ tải ảnh */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-[#c9d8f5] via-[#f3d9e6] to-[#ffe9ee] dark:from-sumi-800 dark:to-sumi-900" />

      <div key={character.id} className={`absolute inset-0 ${img === "ok" ? "nqa-fade" : "opacity-0"}`}>
        <svg
          role="img"
          aria-label={`${character.nameRomaji} đang ${
            talking ? "nói" : listening ? "lắng nghe" : thinking ? "suy nghĩ" : mood === "HAPPY" ? "vui" : mood === "WORRIED" ? "lo lắng" : "chờ"
          }`}
          viewBox={`${vx} ${vy} ${vw} ${vh}`}
          preserveAspectRatio="xMidYMin slice"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            {skinEyes.map((c, i) => (
              <radialGradient key={i} id={`${uid}e${i}`}>
                <stop offset="0" stopColor={c} />
                <stop offset="0.7" stopColor={c} />
                <stop offset="1" stopColor={c} stopOpacity="0" />
              </radialGradient>
            ))}
            <radialGradient id={`${uid}m`}>
              <stop offset="0" stopColor={art.skin.mouth} />
              <stop offset="0.72" stopColor={art.skin.mouth} />
              <stop offset="1" stopColor={art.skin.mouth} stopOpacity="0" />
            </radialGradient>
            <clipPath id={`${uid}c`}>
              <path ref={clipRef} d={g0.outline} />
            </clipPath>
          </defs>

          <g className="nqa-breath" style={{ transformOrigin: `${px}px ${py}px` }}>
            <g
              className={`nqa-body nqa-m-${mode} ${showFx ? "nqa-show" : ""}`}
              style={{ transformOrigin: `${px}px ${py}px` }}
            >
              <image href={art.src} x="0" y="0" width={art.size} height={art.size} />

              {/* Má hồng (vui) */}
              <g className="nqa-blush">
                {art.blush.map((b, i) => (
                  <ellipse key={i} cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} fill="#ff7a93" transform={`rotate(${art.tilt} ${b.cx} ${b.cy})`} />
                ))}
              </g>

              {/* Mắt: chớp + mắt cười */}
              <g className={`${happyEyes ? "nqa-eyes-happy" : "nqa-blink"}`}>
                {art.eyes.map((e, i) => (
                  <g key={i} transform={`translate(${e.cx} ${e.cy}) rotate(${art.tilt})`}>
                    <g className="nqa-lid">
                      <ellipse cx="0" cy="1" rx={e.rx * 1.1} ry={e.ry * 1.3} fill={`url(#${uid}e${i})`} />
                      {/* mắt nhắm ‿ */}
                      <path
                        className="nqa-arc-shut"
                        d={`M${-e.rx} ${-1}Q0 ${e.ry * 0.95} ${e.rx} ${-1}`}
                        fill="none"
                        stroke="#2a1a22"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                      />
                      {/* mắt cười ^ */}
                      <path
                        className="nqa-arc-happy"
                        d={`M${-e.rx * 0.95} ${e.ry * 0.45}Q0 ${-e.ry * 1.15} ${e.rx * 0.95} ${e.ry * 0.45}`}
                        fill="none"
                        stroke="#2a1a22"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                    </g>
                  </g>
                ))}
              </g>

              {/* Miệng: chỉ hiện đè lên miệng gốc khi đang nói */}
              <g
                transform={`translate(${art.mouth.cx} ${art.mouth.cy}) rotate(${art.tilt})`}
                style={{ opacity: talking ? 1 : 0, transition: "opacity .14s" }}
              >
                <ellipse cx="0" cy="2" rx={art.mouth.w * 0.74} ry={art.mouth.h * 1.1} fill={`url(#${uid}m)`} />
                <path ref={mouthRef} d={g0.outline} fill={art.lip.inner} />
                <g clipPath={`url(#${uid}c)`}>
                  <rect ref={teethRef} x={g0.teeth.x} y={g0.teeth.y} width={g0.teeth.width} height={g0.teeth.height} fill="#fff" opacity="0" />
                  <ellipse ref={tongueRef} cx={g0.tongue.cx} cy={g0.tongue.cy} rx={g0.tongue.rx} ry={g0.tongue.ry} fill={art.lip.tongue} />
                </g>
                <path ref={outlineRef} d={g0.outline} fill="none" stroke={art.lip.line} strokeWidth="3.2" strokeLinejoin="round" strokeLinecap="round" />
              </g>

              {/* Hiệu ứng cảm xúc */}
              {showFx && (
                <g aria-hidden="true" fill="#ffd86b" stroke="#fff" strokeWidth="2">
                  {[
                    [-120, 20, 26, 0],
                    [140, -20, 20, 0.35],
                    [-170, 120, 16, 0.7],
                  ].map(([dx, dy, r, delay], i) => (
                    <path
                      key={i}
                      className="nqa-twinkle"
                      style={{ animationDelay: `${delay}s` }}
                      transform={`translate(${art.fx.x + dx} ${art.fx.y + dy}) scale(${r / 12})`}
                      d="M0 -12C1.6 -4 4 -1.6 12 0 4 1.6 1.6 4 0 12-1.6 4-4 1.6-12 0-4-1.6-1.6-4 0-12Z"
                    />
                  ))}
                </g>
              )}
              {thinking && (
                <g aria-hidden="true" fill="#fff" stroke="#c9b6d9" strokeWidth="3">
                  {[0, 1, 2].map((i) => (
                    <circle key={i} className="nqa-dot" style={{ animationDelay: `${i * 0.18}s` }} cx={art.fx.x + 150 + i * 34} cy={art.fx.y + 30} r={10 + i * 2} />
                  ))}
                </g>
              )}
              {mood === "WORRIED" && !talking && (
                <path
                  aria-hidden="true"
                  className="nqa-drop"
                  d={`M${art.fx.x + 190} ${art.fx.y + 90}c-12 18-18 28-18 38a18 18 0 0 0 36 0c0-10-6-20-18-38Z`}
                  fill="#a5d8ff"
                  stroke="#fff"
                  strokeWidth="3"
                />
              )}

              {/* Cánh hoa rơi nhẹ */}
              <g aria-hidden="true" fill="#ffc6d3" opacity="0.85">
                {PETALS.map(([x, s, dur, delay], i) => (
                  <ellipse key={i} className="nqa-petal" style={{ animationDuration: `${dur}s`, animationDelay: `${delay}s` }} cx={x} cy={vy} rx={s} ry={s * 0.62} />
                ))}
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}