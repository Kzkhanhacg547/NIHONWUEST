import React from "react";

type SceneVariant = "fuji" | "kyoto" | "street" | "konbini" | "ramen" | "map";

const FILLS = ["#ef5b5f", "#f4868a", "#e84a50"];
const BLOSSOMS_LOGIN: [number, number, number][] = [
  [20, 24, 1], [60, 32, 0.9], [100, 40, 1.1], [140, 60, 1], [150, 100, 0.9], [140, 140, 1.1],
  [182, 58, 0.8], [205, 30, 1], [222, 8, 0.9], [245, 88, 1.1], [280, 66, 1], [310, 44, 0.9],
  [342, 36, 1.1], [300, 118, 1], [330, 134, 1.2], [348, 170, 1], [342, 225, 1], [380, 146, 0.9],
  [420, 160, 1.1], [450, 150, 1], [490, 128, 1], [530, 120, 1.1], [565, 130, 0.9], [500, 176, 1],
  [540, 196, 1.1], [548, 240, 1], [540, 275, 0.9], [580, 215, 1], [610, 245, 0.9], [470, 172, 1.2],
];

function Blossom({ x, y, s = 1, i = 0 }: { x: number; y: number; s?: number; i?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${(i * 37) % 72})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <path key={a} d="M0 0C-8-4-9-14 0-16C9-14 8-4 0 0Z" transform={`rotate(${a})`} fill={FILLS[i % 3]} />
      ))}
      <circle r="2.4" fill="#b4221c" />
    </g>
  );
}

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
      <span className="nq-floating-petal p5">◆</span>
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
          const cx = parseFloat(x.toFixed(3));
          const cy = parseFloat(y.toFixed(3));
          return <circle key={i} cx={cx} cy={cy} r={6 + (i % 3)} fill={i % 2 ? "#ef7778" : "#e64f53"} opacity=".93" />;
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

const BLOSSOMS_MAP: Array<[number, number, number]> = [
  [380, 330, 9], [356, 352, 7], [330, 372, 10], [300, 398, 8], [262, 420, 9], [232, 448, 7],
  [205, 478, 10], [182, 500, 8], [430, 262, 8], [452, 226, 7], [470, 190, 9], [496, 150, 7],
  [405, 305, 6], [318, 345, 6], [248, 392, 6], [150, 540, 8], [120, 562, 7],
];

export function JapanMapArt({
  className = "",
  reached = 1,
}: {
  className?: string;
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
        {BLOSSOMS_MAP.map(([x, y, r], i) => (
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
        {Array.from({ length: 16 }).map((_, i) => {
          const cx = 14 + i * 20;
          const cy = parseFloat((34 - Math.sin(i * 0.9) * 18).toFixed(3));
          return <circle key={i} cx={cx} cy={cy} r={6 + (i % 3)} fill={i % 2 ? "#ef7778" : "#e64f53"} opacity=".92" />;
        })}
      </svg>
    </div>
  );
}

export type ChoiceArtKind = "torii" | "sprout" | "fuji" | "sakura";

export function ChoiceArt({ kind }: { kind: ChoiceArtKind }) {
  return (
    <svg viewBox="0 0 160 90" className="nq-choice-svg" aria-hidden="true">
      {kind === "torii" && (
        <>
          <path d="M10 78C30 62 50 70 70 64C90 58 110 72 150 76V80H10Z" fill="#c9cfcc" opacity=".7" />
          <g fill="#c8281f"><path d="M58 28Q80 34 102 28L100 35Q80 41 60 35Z" /><rect x="66" y="38" width="5" height="34" /><rect x="89" y="38" width="5" height="34" /><rect x="62" y="47" width="36" height="4" /></g>
        </>
      )}
      {kind === "sprout" && (
        <>
          <path d="M10 60C40 52 120 52 150 62" stroke="#e8e3dc" strokeWidth="22" strokeLinecap="round" />
          <path d="M80 80V52" stroke="#c8281f" strokeWidth="3" />
          <path d="M80 54C60 54 50 42 52 28C68 28 80 38 80 54ZM80 54C100 52 112 40 112 24C94 26 80 38 80 54Z" fill="#c8281f" />
        </>
      )}
      {kind === "fuji" && (
        <>
          <circle cx="96" cy="30" r="14" fill="#e8574e" />
          <path d="M20 78L72 36C78 32 84 32 90 36L146 78Z" fill="#3f5a58" />
          <path d="M60 46L72 36C78 32 84 32 90 36L100 46L90 43L82 49L74 43Z" fill="#fff" />
        </>
      )}
      {kind === "sakura" && (
        <>
          <path d="M20 70C50 60 80 50 140 30" stroke="#3a302b" strokeWidth="2.5" strokeLinecap="round" />
          {BLOSSOMS_LOGIN.slice(0, 7).map(([x, y], i) => <Blossom key={i} x={x * 0.25} y={y * 0.25} s={0.7} i={i} />)}
        </>
      )}
    </svg>
  );
}

export function NQIcon({ name }: { name: "mail" | "lock" | "eye" | "book" | "torii" | "people" | "arrow" | "arrowUR" | "back" }) {
  const s = { width: 22, height: 22, viewBox: "0 0 24 24", "aria-hidden": true } as const;
  const st = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  switch (name) {
    case "mail": return <svg {...s} {...st}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;
    case "lock": return <svg {...s} {...st}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>;
    case "eye": return <svg {...s} {...st}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>;
    case "book": return <svg {...s} {...st}><path d="M12 6C10 4.5 7 4 4 4.5v13C7 17 10 17.5 12 19c2-1.500 5-2 8-1.500v-13C17 4 14 4.500 12 6ZM12 6v13" /></svg>;
    case "arrow": return <svg {...s} {...st}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case "back": return <svg {...s} {...st}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>;
    case "arrowUR": return <svg {...s} {...st}><path d="M7 17 17 7M8 7h9v9" /></svg>;
    case "torii": return <svg {...s} fill="currentColor"><path d="M2 4.500c4 1.400 16 1.400 20 0v2.400c-4 1.200-16 1.200-20 0zM5 9h14v2H5zM7 7h2.200v14H7zM14.800 7H17v14h-2.200z" /></svg>;
    case "people": return <svg {...s} fill="currentColor"><circle cx="12" cy="8" r="3" /><circle cx="5.500" cy="10" r="2.200" /><circle cx="18.500" cy="10" r="2.200" /><path d="M6.500 19c0-3.300 2.500-5.500 5.500-5.500s5.500 2.200 5.500 5.500zM1.500 18c0-2.300 1.500-4 4-4h.5c-1 1-1.500 2.500-1.500 4zM22.500 18c0-2.300-1.500-4-4-4H18c1 1 1.500 2.500 1.500 4z" /></svg>;
  }
}

