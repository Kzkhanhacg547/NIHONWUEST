import React from "react";

type SceneVariant = "fuji" | "kyoto" | "street" | "konbini" | "ramen" | "map";

export function JapanBackdrop({ className = "" }: { className?: string }) {
  return (
    <div className={`nq-page-backdrop ${className}`} aria-hidden="true">
      <svg className="nq-bg-sakura nq-bg-sakura-left" viewBox="0 0 520 360" fill="none">
        <path d="M-12 287C96 239 142 157 202 111C272 58 360 34 520 4" stroke="#252525" strokeWidth="5" strokeLinecap="round" />
        <path d="M77 235c58-20 104-9 151 18M169 135c50-7 94 9 132 39M272 79c48-2 92 14 132 49" stroke="#3a302b" strokeWidth="3" strokeLinecap="round" />
        {[
          [61, 241], [92, 218], [122, 203], [150, 180], [181, 151], [210, 122], [245, 105], [282, 86], [320, 68], [361, 52], [402, 39], [445, 25],
          [180, 247], [214, 253], [252, 254], [301, 171], [336, 181], [370, 191]
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <ellipse rx="13" ry="8" transform="rotate(-20)" fill="#eb5f61" opacity=".9" />
            <ellipse rx="11" ry="7" transform="rotate(34) translate(9 -2)" fill="#f29a9b" />
            <circle r="3" fill="#b4221c" />
          </g>
        ))}
      </svg>
      <svg className="nq-bg-sakura nq-bg-sakura-right" viewBox="0 0 520 360" fill="none">
        <path d="M532 287C424 239 378 157 318 111C248 58 160 34 0 4" stroke="#252525" strokeWidth="5" strokeLinecap="round" />
        <path d="M443 235c-58-20-104-9-151 18M351 135c-50-7-94 9-132 39M248 79c-48-2-92 14-132 49" stroke="#3a302b" strokeWidth="3" strokeLinecap="round" />
        {[
          [459, 241], [428, 218], [398, 203], [370, 180], [339, 151], [310, 122], [275, 105], [238, 86], [200, 68], [159, 52], [118, 39], [75, 25],
          [340, 247], [306, 253], [268, 254], [219, 171], [184, 181], [150, 191]
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <ellipse rx="13" ry="8" transform="rotate(20)" fill="#eb5f61" opacity=".9" />
            <ellipse rx="11" ry="7" transform="rotate(-34) translate(-9 -2)" fill="#f29a9b" />
            <circle r="3" fill="#b4221c" />
          </g>
        ))}
      </svg>
      <div className="nq-bg-mist nq-bg-mist-left" />
      <div className="nq-bg-mist nq-bg-mist-right" />
      <span className="nq-floating-petal p1">◆</span>
      <span className="nq-floating-petal p2">◆</span>
      <span className="nq-floating-petal p3">◆</span>
      <span className="nq-floating-petal p4">◆</span>
    </div>
  );
}

export function JapanScenicPanel({
  variant = "fuji",
  className = "",
  showLabel = true,
}: {
  variant?: SceneVariant;
  className?: string;
  showLabel?: boolean;
}) {
  const warm = variant === "kyoto" || variant === "street" || variant === "konbini" || variant === "ramen";
  return (
    <div className={`nq-scenic-panel nq-scene-${variant} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 900 390" preserveAspectRatio="xMidYMid slice" className="nq-scenic-svg">
        <defs>
          <linearGradient id={`sky-${variant}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={warm ? "#f2c7a8" : "#fbfaf1"} />
            <stop offset="0.58" stopColor={warm ? "#e9cab8" : "#e8ece3"} />
            <stop offset="1" stopColor={warm ? "#c7d2c5" : "#b7c8bc"} />
          </linearGradient>
          <linearGradient id={`mountain-${variant}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#526f6e" />
            <stop offset="1" stopColor="#1f403d" />
          </linearGradient>
          <linearGradient id={`mist-${variant}`} x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#ffffff" stopOpacity=".88" />
            <stop offset=".5" stopColor="#ffffff" stopOpacity=".12" />
            <stop offset="1" stopColor="#ffffff" stopOpacity=".75" />
          </linearGradient>
          <filter id={`soft-${variant}`} x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="2.4" />
          </filter>
        </defs>
        <rect width="900" height="390" fill={`url(#sky-${variant})`} />
        <circle cx="645" cy="126" r="82" fill="#d92f25" opacity=".92" />
        <path d="M0 260C105 188 190 205 273 239C353 272 427 239 500 201C582 160 654 164 753 218C812 251 853 260 900 252V390H0Z" fill="#9aaca2" opacity=".9" />
        <path d="M103 290L430 112L748 294H103Z" fill={`url(#mountain-${variant})`} />
        <path d="M430 112L354 160L395 154L428 177L459 151L504 165Z" fill="#f8f5ec" />
        <path d="M0 303C170 257 255 317 377 297C518 274 589 236 702 261C786 280 844 289 900 274V390H0Z" fill="#476b64" opacity=".82" />
        <path d="M0 343C171 305 284 356 430 329C572 303 716 332 900 304V390H0Z" fill="#23433f" opacity=".92" />
        <path d="M-30 326C159 288 313 314 489 321C659 329 779 293 930 306" stroke={`url(#mist-${variant})`} strokeWidth="26" opacity=".55" filter={`url(#soft-${variant})`} />
        <g transform="translate(610 202)" fill="#b62b24">
          <rect x="0" y="0" width="158" height="13" rx="2" />
          <rect x="18" y="24" width="124" height="10" rx="2" />
          <rect x="28" y="7" width="11" height="104" />
          <rect x="120" y="7" width="11" height="104" />
          <path d="M-8 -10H166L151 5H7Z" fill="#8f211c" />
        </g>
        {(variant === "kyoto" || variant === "street") && (
          <g transform="translate(742 172)" fill="#172f2e">
            <rect x="30" y="50" width="10" height="94" />
            <path d="M0 55H70L58 40H12Z" />
            <path d="M9 37H61L50 24H20Z" />
            <path d="M20 20H50L42 10H28Z" />
          </g>
        )}
        {variant === "map" && (
          <g transform="translate(520 76)" fill="none" stroke="#17473f" strokeWidth="10" strokeLinecap="round">
            <path d="M98 2C119 31 92 49 110 76C126 102 108 125 87 143C65 163 72 186 49 208C32 225 41 248 21 278" />
            <path d="M118 65c25 13 31 32 29 53M69 183c22 2 38 15 42 34" strokeWidth="7" />
          </g>
        )}
        <g stroke="#392d28" strokeWidth="3.5" strokeLinecap="round">
          <path d="M0 73C97 95 134 57 210 39C288 19 354 12 425 -8" />
          <path d="M75 80c24 2 40 14 60 31M166 55c26 8 40 20 56 39M274 27c27 9 42 25 56 43" />
        </g>
        {Array.from({ length: 22 }).map((_, i) => {
          const x = 18 + i * 19.2;
          const y = 58 - Math.sin(i * 0.9) * 22;
          return <circle key={i} cx={x} cy={y} r={6 + (i % 3)} fill={i % 2 ? "#ef7778" : "#e64f53"} opacity=".93" />;
        })}
      </svg>
      {showLabel && (
        <div className="nq-scenic-callout">
          <span className="jp-text">旅</span>
          <small>Mỗi từ mới,<br />một chân trời rộng hơn.</small>
        </div>
      )}
    </div>
  );
}

/** Vị trí (%) của 5 điểm đến trên bản đồ, theo thứ tự lộ trình: Tokyo → … → Sapporo. */
export const JAPAN_MAP_SLOTS = [
  { x: 27, y: 83 },
  { x: 46, y: 68 },
  { x: 67, y: 58 },
  { x: 61, y: 47 },
  { x: 87, y: 16 },
] as const;

function routePath(pts: ReadonlyArray<{ x: number; y: number }>) {
  const p = pts.map(({ x, y }) => [x * 6, y * 6]);
  if (p.length < 2) return "";
  let d = `M${p[0][0]} ${p[0][1]}`;
  for (let i = 1; i < p.length - 1; i++) {
    const mx = (p[i][0] + p[i + 1][0]) / 2;
    const my = (p[i][1] + p[i + 1][1]) / 2;
    d += ` Q${p[i][0]} ${p[i][1]} ${mx} ${my}`;
  }
  const last = p[p.length - 1];
  return `${d} L${last[0]} ${last[1]}`;
}

const BLOSSOMS: Array<[number, number, number]> = [
  [380, 330, 9], [356, 352, 7], [330, 372, 10], [300, 398, 8], [262, 420, 9], [232, 448, 7],
  [205, 478, 10], [182, 500, 8], [430, 262, 8], [452, 226, 7], [470, 190, 9], [496, 150, 7],
  [405, 305, 6], [318, 345, 6], [248, 392, 6], [150, 540, 8], [120, 562, 7],
];

/** Bản đồ Nhật Bản cách điệu (viewBox 600x600, khung vuông để pin % khớp). */
export function JapanMapArt({
  className = "",
  reached = 1,
}: {
  className?: string;
  /** số điểm đến đã mở (vẽ đoạn đường đỏ liền tới đó) */
  reached?: number;
}) {
  const slots = JAPAN_MAP_SLOTS;
  const full = routePath(slots);
  const done = routePath(slots.slice(0, Math.max(0, Math.min(reached, slots.length))));
  const land =
    "M505 100C510 170 440 215 420 262C402 304 410 332 395 352C362 388 320 396 280 416C240 440 200 470 165 500C130 530 110 560 70 592";
  return (
    <div className={`nq-japan-map-art jy-map-art ${className}`} aria-hidden="true">
      <svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="jy-land-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#07201c" floodOpacity=".3" />
          </filter>
          <radialGradient id="jy-mist" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#fff" stopOpacity=".85" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="330" cy="330" rx="260" ry="90" fill="url(#jy-mist)" opacity=".55" transform="rotate(-38 330 330)" />
        <g filter="url(#jy-land-shadow)">
          <ellipse cx="506" cy="82" rx="64" ry="46" transform="rotate(-24 506 82)" fill="#12403a" />
          <path d={land} fill="none" stroke="#12403a" strokeWidth="78" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="82" cy="574" rx="40" ry="30" transform="rotate(-30 82 574)" fill="#12403a" />
          <ellipse cx="238" cy="470" rx="34" ry="16" transform="rotate(-35 238 470)" fill="#12403a" />
        </g>
        <path d={land} fill="none" stroke="#1d5a4c" strokeWidth="44" strokeLinecap="round" opacity=".75" />
        <path d={land} fill="none" stroke="#2b7a66" strokeWidth="14" strokeLinecap="round" opacity=".35" strokeDasharray="2 18" />
        {BLOSSOMS.map(([x, y, r], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={r} fill="#f08a92" opacity=".92" />
            <circle cx={x + r * 0.5} cy={y - r * 0.3} r={r * 0.6} fill="#f7b4b8" />
          </g>
        ))}
        <path d={full} fill="none" stroke="#f7efe2" strokeWidth="3.5" strokeDasharray="3 11" strokeLinecap="round" />
        {done && <path d={done} fill="none" stroke="#e24a3f" strokeWidth="4.5" strokeLinecap="round" />}
        {slots.map((s, i) => (
          <g key={i} transform={`translate(${s.x * 6} ${s.y * 6})`}>
            <circle r="9" fill="#fffaf1" stroke={i < reached ? "#d43128" : "#9aa7a0"} strokeWidth="4" />
            <circle r="3" fill={i < reached ? "#d43128" : "#9aa7a0"} />
          </g>
        ))}
        {/* Shinkansen nhỏ giữa Tokyo và Hakone */}
        <g transform="translate(205 456) rotate(-33)">
          <rect x="-34" y="-8" width="68" height="16" rx="8" fill="#fff" />
          <path d="M20 -8h8a8 8 0 010 16h-8z" fill="#e8ecef" />
          <rect x="-30" y="0" width="58" height="3" fill="#d43128" />
          <rect x="-26" y="-5" width="6" height="4" rx="1" fill="#2a5aa8" />
          <rect x="-16" y="-5" width="6" height="4" rx="1" fill="#2a5aa8" />
          <rect x="-6" y="-5" width="6" height="4" rx="1" fill="#2a5aa8" />
        </g>
      </svg>
    </div>
  );
}

/** Nền cảnh hero: mặt trời đỏ, Phú Sĩ, núi mực, mặt nước sương và cổng torii. */
export function JapanHeroScene({ className = "" }: { className?: string }) {
  return (
    <div className={`jy-hero-scene ${className}`} aria-hidden="true">
      <svg viewBox="0 0 850 540" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="jy-fuji" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7f9490" />
            <stop offset="1" stopColor="#2f4f4a" />
          </linearGradient>
          <linearGradient id="jy-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#dfe6df" stopOpacity="0" />
            <stop offset="1" stopColor="#bccbc4" stopOpacity=".9" />
          </linearGradient>
          <filter id="jy-blur"><feGaussianBlur stdDeviation="6" /></filter>
        </defs>
        <circle cx="520" cy="170" r="98" fill="#e2453b" opacity=".95" />
        <path d="M330 330C390 250 440 205 480 195C520 205 580 255 700 330Z" fill="url(#jy-fuji)" opacity=".9" />
        <path d="M480 195C455 205 430 228 405 262C425 252 440 262 455 250C470 262 490 252 505 262C520 250 535 262 550 248C525 222 505 205 480 195Z" fill="#f8f5ec" />
        <path d="M0 330C90 290 170 300 250 330C340 360 440 300 520 320C610 342 700 300 850 330V540H0Z" fill="#9db0a6" opacity=".7" />
        <path d="M0 380C120 340 220 392 340 376C470 358 560 330 700 350C770 360 820 372 850 366V540H0Z" fill="#35564f" opacity=".85" />
        <rect x="0" y="420" width="850" height="120" fill="url(#jy-water)" />
        <ellipse cx="300" cy="418" rx="360" ry="18" fill="#fff" opacity=".6" filter="url(#jy-blur)" />
        <g fill="#18302d" opacity=".85">
          <rect x="285" y="380" width="8" height="46" /><path d="M262 384h54l-9-12h-36zM270 370h38l-8-10h-22z" />
          <rect x="740" y="360" width="8" height="52" /><path d="M716 366h56l-9-12h-38zM724 352h40l-8-10h-24z" />
        </g>
        <g transform="translate(60 380)" fill="#c9302a">
          <rect x="0" y="0" width="150" height="12" rx="2" /><rect x="14" y="24" width="122" height="9" rx="2" />
          <rect x="26" y="6" width="11" height="116" /><rect x="113" y="6" width="11" height="116" />
          <path d="M-9 -10H159L145 4H5Z" fill="#8f211c" />
        </g>
        <g stroke="#352a25" strokeWidth="3.5" strokeLinecap="round" fill="none">
          <path d="M0 40C80 62 120 30 190 14C250 0 300 -4 350 -16" />
        </g>
        {Array.from({ length: 16 }).map((_, i) => (
          <circle key={i} cx={14 + i * 20} cy={34 - Math.sin(i * 0.9) * 18} r={6 + (i % 3)} fill={i % 2 ? "#ef7778" : "#e64f53"} opacity=".92" />
        ))}
      </svg>
    </div>
  );
}
