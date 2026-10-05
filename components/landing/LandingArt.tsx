/**
 * Minh hoạ + icon riêng cho landing page (app/page.tsx).
 * Toàn bộ vẽ bằng SVG/CSS — không dùng file ảnh.
 * File mới, độc lập: không import/ghi đè ui.tsx hay JapanIllustration.tsx.
 */
import type { CSSProperties } from "react";

/* ============================ ICONS ============================ */
type IconProps = { size?: number };

const S = (size: number) => ({ width: size, height: size, viewBox: "0 0 24 24", "aria-hidden": true as const });
const ST = { fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const IconArrow = ({ size = 16 }: IconProps) => (
  <svg {...S(size)} {...ST}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const IconArrowUR = ({ size = 16 }: IconProps) => (
  <svg {...S(size)} {...ST}><path d="M7 17 17 7M8 7h9v9" /></svg>
);
export const IconCompass = ({ size = 18 }: IconProps) => (
  <svg {...S(size)} {...ST}><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></svg>
);
export const IconDash = ({ size = 20 }: IconProps) => (
  <svg {...S(size)} {...ST}><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M3 9h18M7 14h5" /></svg>
);
export const IconBook = ({ size = 20 }: IconProps) => (
  <svg {...S(size)} {...ST}><path d="M12 6.5C10.5 5 8 4.5 4 4.5v14c4 0 6.5.5 8 2 1.5-1.5 4-2 8-2v-14c-4 0-6.5.5-8 2zM12 6.5v14" /></svg>
);
export const IconPen = ({ size = 20 }: IconProps) => (
  <svg {...S(size)} {...ST}><path d="M4 20l1-4L16 5l3 3L8 19zM14 7l3 3" /></svg>
);
export const IconSpark = ({ size = 20 }: IconProps) => (
  <svg {...S(size)} {...ST}><path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" /></svg>
);
export const IconTrain = ({ size = 20 }: IconProps) => (
  <svg {...S(size)} {...ST}><rect x="5" y="3" width="14" height="14" rx="4" /><path d="M5 11h14M9 21l2-4M15 21l-2-4M9 14h.01M15 14h.01" /></svg>
);
export const IconUser = ({ size = 18 }: IconProps) => (
  <svg {...S(size)} {...ST}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" /></svg>
);
export const IconCards = ({ size = 22 }: IconProps) => (
  <svg {...S(size)} {...ST}><rect x="5" y="3" width="14" height="18" rx="3" /><path d="M9 8h6M9 12h6M9 16h3" /></svg>
);
export const IconPin = ({ size = 22 }: IconProps) => (
  <svg {...S(size)} {...ST}><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.800 12 21 12 21z" /><circle cx="12" cy="9.500" r="2.500" /></svg>
);
export const IconChat = ({ size = 22 }: IconProps) => (
  <svg {...S(size)} {...ST}><path d="M4 5h16v11H9l-5 4z" /><path d="M8 9.500h8M8 12.500h5" /></svg>
);
export const IconFlame = ({ size = 22 }: IconProps) => (
  <svg {...S(size)} {...ST}><path d="M12 3c1 4 5 5.500 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 .5 1.500 1.500 2 2 2 0-3-1-5 1-8z" /></svg>
);
export const ToriiMark = ({ size = 20 }: IconProps) => (
  <svg {...S(size)} fill="currentColor"><path d="M2 4.500c4 1.400 16 1.400 20 0v2.400c-4 1.200-16 1.200-20 0zM5 9h14v2H5zM7 7h2.200v14H7zM14.800 7H17v14h-2.200z" /></svg>
);
export const IconYouTube = ({ size = 22 }: IconProps) => (
  <svg {...S(size)} fill="currentColor"><path d="M21.600 7.200a2.500 2.500 0 0 0-1.800-1.800C18.200 5 12 5 12 5s-6.200 0-7.800.4A2.500 2.500 0 0 0 2.400 7.200C2 8.800 2 12 2 12s0 3.200.4 4.800a2.500 2.500 0 0 0 1.800 1.800C5.800 19 12 19 12 19s6.200 0 7.800-.4a2.500 2.500 0 0 0 1.800-1.800c.4-1.600.4-4.800.4-4.800s0-3.200-.4-4.800zM10 15V9l5.200 3z" /></svg>
);
export const IconDiscord = ({ size = 22 }: IconProps) => (
  <svg {...S(size)} fill="currentColor"><path d="M19.300 5.400A16 16 0 0 0 15.400 4l-.5 1a14.800 14.800 0 0 0-5.800 0l-.5-1a16 16 0 0 0-3.900 1.400C2.200 9 1.500 12.500 1.800 16a16 16 0 0 0 4.800 2.400l1-1.600a10 10 0 0 1-1.600-.8l.4-.3a11.500 11.500 0 0 0 9.200 0l.4.300c-.5.300-1 .600-1.600.800l1 1.600A16 16 0 0 0 20.200 16c.4-4-.700-7.500-.900-10.600zM8.700 14c-.9 0-1.600-.8-1.600-1.800s.7-1.800 1.600-1.800 1.600.8 1.600 1.800-.7 1.800-1.600 1.800zm6.600 0c-.9 0-1.600-.8-1.600-1.800s.7-1.800 1.600-1.800 1.600.8 1.600 1.800-.7 1.800-1.600 1.800z" /></svg>
);
export const IconTelegram = ({ size = 22 }: IconProps) => (
  <svg {...S(size)} fill="currentColor"><path d="M21.500 4.300 2.700 11.500c-.8.300-.8.800-.1 1l4.800 1.500 1.800 5.500c.2.600.4.800.9.800.4 0 .6-.2.900-.4l2.300-2.200 4.700 3.500c.9.500 1.500.2 1.700-.8L22.600 5.500c.3-1.200-.5-1.700-1.100-1.200zM9 13.600l9.300-5.800c.4-.3.800-.1.500.2l-7.700 6.900-.3 3.200z" /></svg>
);

/* ============================ SMALL PIECES ============================ */
function Blossom({ x, y, r, tone = 0 }: { x: number; y: number; r: number; tone?: number }) {
  const fills = ["#ff9db8", "#ffb7cb", "#ff7fa6"];
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={fills[tone % 3]} opacity=".95" />
      <circle cx={x + r * 0.45} cy={y - r * 0.3} r={r * 0.58} fill="#ffe1ea" opacity=".9" />
      <circle cx={x - r * 0.1} cy={y + r * 0.1} r={r * 0.18} fill="#d6386a" />
    </g>
  );
}

function Pine({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#0d0720">
      <rect x="-3" y="-4" width="6" height="22" />
      <path d="M0-92 L22-50 H9 L28-16 H10 L34 18 H-34 L-10-16 H-28 L-9-50 H-22Z" />
    </g>
  );
}

/** Mascot cáo — đầu + khăn đỏ, hệ toạ độ 100x100 */
function Fox() {
  return (
    <g>
      <path d="M14 8 L38 36 L10 46Z" fill="#ef8a2b" />
      <path d="M86 8 L62 36 L90 46Z" fill="#ef8a2b" />
      <path d="M19 20 L32 35 L18 40Z" fill="#4a2417" />
      <path d="M81 20 L68 35 L82 40Z" fill="#4a2417" />
      <path d="M12 46C12 31 29 24 50 24S88 31 88 46C88 68 71 86 50 86S12 68 12 46Z" fill="#f59a36" />
      <path d="M12 54C21 62 34 67 50 67S79 62 88 54C86 72 71 86 50 86S14 72 12 54Z" fill="#fff6ea" />
      <ellipse cx="35" cy="50" rx="4.200" ry="5.400" fill="#3a1f14" />
      <ellipse cx="65" cy="50" rx="4.200" ry="5.400" fill="#3a1f14" />
      <circle cx="36.500" cy="48" r="1.500" fill="#fff" />
      <circle cx="66.500" cy="48" r="1.500" fill="#fff" />
      <ellipse cx="50" cy="65" rx="4.500" ry="3.200" fill="#3a1f14" />
      <path d="M50 68Q46 74 41 72M50 68Q54 74 59 72" stroke="#3a1f14" strokeWidth="1.800" strokeLinecap="round" fill="none" />
      <path d="M27 82Q50 96 73 82L76 92Q50 108 24 92Z" fill="#d6382b" />
    </g>
  );
}

/* ============================ BRUSH EDGE ============================ */
/** Nét cọ rách mép. Màu lấy từ CSS var --brush (xem landing.css). */
export function BrushEdge({ className = "" }: { className?: string }) {
  return (
    <svg className={`hp-brush ${className}`} viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 78C70 52 130 86 210 62S350 74 440 58 580 82 670 60 830 78 920 56 1080 80 1170 58 1340 70 1440 50V120H0Z" />
      <path opacity=".55" d="M0 94C120 70 200 100 330 80S560 96 700 78 960 98 1100 76 1330 94 1440 74V120H0Z" />
      <path className="hp-brush__streak" d="M60 70L180 65M300 62L384 67M520 64L650 59M830 62L940 57M1100 60L1230 55M1300 66L1400 62" />
    </svg>
  );
}

/* ============================ PETALS (hero) ============================ */
export function Petals({ count = 10 }: { count?: number }) {
  return (
    <div className="hp-petals" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => {
        const style = {
          "--x": `${(i * 37 + 11) % 100}%`,
          "--y": `${(i * 53) % 70}%`,
          "--dx": `${(i % 2 ? 1 : -1) * (60 + i * 14)}px`,
          "--t": `${11 + (i % 4) * 3}s`,
          "--d": `-${(i * 1.7).toFixed(1)}s`,
          "--s": `${10 + (i % 3) * 4}px`,
        } as CSSProperties;
        return <span key={i} style={style} />;
      })}
    </div>
  );
}

/* ============================ HERO SCENE ============================ */
const STARS: [number, number, number][] = [
  [60, 50, 1.4], [140, 90, 1], [220, 40, 1.6], [310, 120, 1], [400, 60, 1.2], [480, 30, 1],
  [540, 110, 1.4], [620, 70, 1], [700, 38, 1.3], [90, 170, 1], [260, 190, 1.2], [430, 170, 1],
];
const TIERS = [
  { w: 156, y: 560 }, { w: 132, y: 504 }, { w: 110, y: 452 }, { w: 90, y: 404 }, { w: 70, y: 362 },
];
const BRANCH_BLOSSOMS: [number, number, number][] = [
  [1396, 42, 22], [1338, 70, 18], [1292, 54, 16], [1244, 92, 20], [1196, 122, 15], [1410, 112, 17],
  [1356, 138, 14], [1150, 152, 12], [1100, 172, 10], [1278, 132, 13], [1224, 150, 11], [1420, 168, 12],
];

export function HeroScene() {
  return (
    <svg viewBox="0 0 1440 760" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="hp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d0926" />
          <stop offset=".32" stopColor="#2a1a55" />
          <stop offset=".6" stopColor="#8b407c" />
          <stop offset=".8" stopColor="#e2727c" />
          <stop offset="1" stopColor="#fbb47d" />
        </linearGradient>
        <radialGradient id="hp-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffe0a8" stopOpacity=".95" />
          <stop offset=".45" stopColor="#ff9f86" stopOpacity=".45" />
          <stop offset="1" stopColor="#ff9f86" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hp-fuji" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4d3f86" />
          <stop offset=".7" stopColor="#8a5a9e" />
          <stop offset="1" stopColor="#d4799a" />
        </linearGradient>
        <linearGradient id="hp-torii" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2603f" />
          <stop offset="1" stopColor="#a91f26" />
        </linearGradient>
        <filter id="hp-blur" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="16" /></filter>
        <filter id="hp-blur-s" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>

      <rect width="1440" height="760" fill="url(#hp-sky)" />
      {STARS.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity=".75" />)}

      <ellipse cx="1000" cy="470" rx="540" ry="310" fill="url(#hp-glow)" />

      {/* mây */}
      <g filter="url(#hp-blur)">
        <ellipse cx="1180" cy="120" rx="260" ry="46" fill="#3b2a70" opacity=".75" />
        <ellipse cx="820" cy="210" rx="220" ry="34" fill="#4a2f80" opacity=".6" />
        <ellipse cx="1240" cy="330" rx="260" ry="40" fill="#ff9aa8" opacity=".55" />
        <ellipse cx="760" cy="420" rx="260" ry="34" fill="#ffb083" opacity=".5" />
        <ellipse cx="1100" cy="520" rx="420" ry="40" fill="#ffc590" opacity=".55" />
      </g>

      {/* Phú Sĩ */}
      <path d="M620 610C750 566 880 420 968 348Q1010 318 1052 348C1140 420 1270 566 1400 610Z" fill="url(#hp-fuji)" />
      <path d="M936 372C962 350 986 336 1010 334 1034 336 1060 352 1084 374L1062 366 1046 384 1022 366 1004 388 986 368 962 386 948 368Z" fill="#fde9ef" />
      <ellipse cx="1000" cy="614" rx="720" ry="54" fill="#ffd1a0" opacity=".55" filter="url(#hp-blur-s)" />

      {/* chùa năm tầng */}
      <g transform="translate(1345 0)">
        <rect x="-50" y="560" width="100" height="150" fill="#2a1744" />
        {TIERS.map(({ w, y }, i) => (
          <g key={i}>
            <path d={`M${-w / 2 - 10} ${y}Q${-w / 4} ${y - 6} 0 ${y - 24}Q${w / 4} ${y - 6} ${w / 2 + 10} ${y}Z`} fill="#38205e" />
            <rect x={-w * 0.3} y={y} width={w * 0.6} height="32" fill="#2a1744" />
            <rect x="-5" y={y + 8} width="10" height="14" fill="#ffb15c" opacity=".85" />
          </g>
        ))}
        <rect x="-2" y="300" width="4" height="62" fill="#2a1744" />
        <circle cx="0" cy="318" r="3.500" fill="#2a1744" />
      </g>

      {/* torii lớn */}
      <g>
        <rect x="830" y="420" width="26" height="290" fill="url(#hp-torii)" />
        <rect x="1064" y="420" width="26" height="290" fill="url(#hp-torii)" />
        <rect x="822" y="690" width="42" height="20" fill="#26121a" />
        <rect x="1056" y="690" width="42" height="20" fill="#26121a" />
        <rect x="806" y="470" width="308" height="18" fill="url(#hp-torii)" />
        <rect x="950" y="440" width="20" height="34" fill="#c92d2a" />
        <path d="M716 424Q960 450 1204 424L1222 396Q960 426 698 396Z" fill="#e24a35" />
        <path d="M690 380Q960 410 1230 380L1222 398Q960 428 698 398Z" fill="#1d1020" />
      </g>

      {/* mặt đất + thông */}
      <path d="M0 700C200 670 380 700 560 690S900 680 1100 700 1350 690 1440 680V760H0Z" fill="#120a24" />
      <Pine x={1230} y={710} s={1.25} />
      <Pine x={1300} y={716} s={0.95} />
      <Pine x={1385} y={712} s={1.4} />
      <Pine x={640} y={712} s={0.8} />
      <Pine x={700} y={716} s={1} />

      {/* cành anh đào */}
      <g>
        <path d="M1440 18C1360 40 1300 70 1230 105S1120 160 1040 190" stroke="#20142e" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M1290 60c-20 24-30 44-34 70M1180 130c-16 16-24 34-26 52" stroke="#20142e" strokeWidth="3" fill="none" strokeLinecap="round" />
        {BRANCH_BLOSSOMS.map(([x, y, r], i) => <Blossom key={i} x={x} y={y} r={r} tone={i} />)}
      </g>
    </svg>
  );
}

/* ============================ FEATURE CARD ART ============================ */
const JP = "var(--nq-jp), 'Yu Mincho', 'Hiragino Mincho ProN', serif";

export function KanaArt() {
  return (
    <svg viewBox="0 0 220 200" preserveAspectRatio="xMaxYMax meet" aria-hidden="true">
      <path d="M120 6C150 24 180 20 220 40" stroke="#4a3140" strokeWidth="3.500" fill="none" strokeLinecap="round" />
      <Blossom x={140} y={14} r={10} />
      <Blossom x={168} y={30} r={9} tone={1} />
      <Blossom x={198} y={44} r={11} tone={2} />
      <Blossom x={118} y={30} r={7} tone={1} />
      <g transform="rotate(7 120 120)">
        <rect x="52" y="44" width="124" height="142" rx="8" fill="#fffdf8" stroke="#ecdccf" />
        <path d="M114 52V178M60 115H168" stroke="#f3c6cf" strokeDasharray="4 5" />
        <text x="114" y="148" textAnchor="middle" fontFamily={JP} fontWeight="700" fontSize="104" fill="#2a2230">あ</text>
      </g>
      <g transform="rotate(38 176 150)">
        <rect x="170" y="96" width="9" height="84" rx="4" fill="#7a4a35" />
        <path d="M170 96 174.500 66 179 96Z" fill="#2a2230" />
      </g>
      <Blossom x={40} y={168} r={8} />
      <Blossom x={64} y={184} r={6} tone={1} />
    </svg>
  );
}

export function SrsArt() {
  return (
    <svg viewBox="0 0 220 170" preserveAspectRatio="xMaxYMid meet" aria-hidden="true">
      <rect x="62" y="22" width="132" height="86" rx="12" fill="#ffe8a6" transform="rotate(10 128 65)" />
      <rect x="56" y="28" width="132" height="86" rx="12" fill="#f6bfdf" transform="rotate(5 122 71)" />
      <rect x="44" y="38" width="136" height="92" rx="12" fill="#fff" stroke="#e1d9fb" />
      <text x="112" y="88" textAnchor="middle" fontFamily={JP} fontWeight="700" fontSize="30" fill="#2a2230">たべる</text>
      <text x="112" y="110" textAnchor="middle" fontSize="12" fill="#7c7a96">(ăn)</text>
      <circle cx="30" cy="126" r="5" fill="#ffd2de" />
    </svg>
  );
}

export function MapArt() {
  return (
    <svg viewBox="0 0 240 200" preserveAspectRatio="xMaxYMax meet" aria-hidden="true">
      <defs>
        <linearGradient id="hp-land" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fd0a6" />
          <stop offset="1" stopColor="#4aa07c" />
        </linearGradient>
        <linearGradient id="hp-sea" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d6f0f7" />
          <stop offset="1" stopColor="#b7dcec" />
        </linearGradient>
      </defs>
      <ellipse cx="140" cy="108" rx="96" ry="84" fill="url(#hp-sea)" opacity=".7" />
      <path d="M150 26C176 36 196 60 188 92C181 120 156 134 128 148C100 162 70 168 56 150C46 134 70 118 92 100C112 84 114 66 126 48C132 38 140 30 150 26Z" fill="url(#hp-land)" />
      <path d="M92 138 120 92 148 138Z" fill="#6c8fb4" />
      <path d="M110 108 120 92 130 108 124 105 120 111 116 105Z" fill="#fff" />
      <path d="M62 168C84 128 120 128 130 100S154 70 170 46" stroke="#fff" strokeWidth="2.500" strokeDasharray="3 6" fill="none" strokeLinecap="round" />
      <g transform="translate(166 40)">
        <path d="M0 22C-9 11-12 4-12-3a12 12 0 0 1 24 0c0 7-3 14-12 25z" fill="#e8402f" />
        <circle cy="-3" r="4.500" fill="#fff" />
      </g>
      <circle cx="170" cy="46" r="0" />
      <Blossom x={74} y={118} r={7} />
      <Blossom x={150} y={116} r={6} tone={1} />
      <g transform="translate(22 148) rotate(-12)">
        <rect width="86" height="22" rx="11" fill="#fff" />
        <rect y="11" width="86" height="4" fill="#2b6fd0" />
        <path d="M62 0h12a11 11 0 0 1 11 11v0H62z" fill="#e4ecf5" />
        <rect x="12" y="4" width="8" height="5" rx="1.500" fill="#2b6fd0" />
        <rect x="26" y="4" width="8" height="5" rx="1.500" fill="#2b6fd0" />
        <rect x="40" y="4" width="8" height="5" rx="1.500" fill="#2b6fd0" />
      </g>
    </svg>
  );
}

export function SurvivalArt() {
  return (
    <svg viewBox="0 0 240 200" preserveAspectRatio="xMaxYMax meet" aria-hidden="true">
      <g fill="#e1493a" opacity=".9">
        <rect x="150" y="62" width="64" height="7" rx="2" />
        <rect x="156" y="76" width="52" height="5" rx="2" />
        <rect x="160" y="68" width="6" height="64" />
        <rect x="198" y="68" width="6" height="64" />
      </g>
      <path d="M142 56Q182 66 222 56L218 64Q182 74 146 64Z" fill="#a82426" />
      <g>
        <rect x="14" y="30" width="92" height="42" rx="14" fill="#fff" stroke="#f1c6cf" />
        <path d="M44 72l-6 12 18-12z" fill="#fff" stroke="#f1c6cf" />
        <text x="60" y="57" textAnchor="middle" fontFamily={JP} fontSize="16" fontWeight="700" fill="#2a2230">すみません…</text>
      </g>
      <g>
        <rect x="104" y="94" width="58" height="34" rx="14" fill="#fff4f6" stroke="#f1c6cf" />
        <path d="M148 128l8 10-4-10z" fill="#fff4f6" stroke="#f1c6cf" />
        <circle cx="122" cy="111" r="2.500" fill="#c9a2ad" />
        <circle cx="133" cy="111" r="2.500" fill="#c9a2ad" />
        <circle cx="144" cy="111" r="2.500" fill="#c9a2ad" />
      </g>
      <path d="M120 150H206C206 182 186 194 163 194S120 182 120 150Z" fill="#fff" stroke="#e5614a" strokeWidth="3" />
      <path d="M132 150c6-8 12 4 18-4s12 4 18-4 12 4 18-2" stroke="#f2c36b" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M140 138c-4-6 4-8 0-14M162 138c-4-6 4-8 0-14M184 138c-4-6 4-8 0-14" stroke="#e9d5da" strokeWidth="2.500" fill="none" strokeLinecap="round" />
      <Blossom x={30} y={150} r={8} />
      <Blossom x={52} y={170} r={6} tone={1} />
    </svg>
  );
}

export function KanjiArt() {
  return (
    <svg viewBox="0 0 240 200" preserveAspectRatio="xMaxYMax meet" aria-hidden="true">
      <path d="M40 150 110 70 152 108 184 76 240 150Z" fill="#9fcde0" opacity=".9" />
      <path d="M96 84 110 70 124 84 116 82 110 90 104 82Z" fill="#fff" />
      <g fill="#e1493a">
        <rect x="14" y="92" width="52" height="6" rx="2" />
        <rect x="19" y="104" width="42" height="4" rx="2" />
        <rect x="22" y="98" width="5" height="46" />
        <rect x="53" y="98" width="5" height="46" />
      </g>
      <g transform="rotate(6 140 122)">
        <rect x="84" y="46" width="120" height="146" rx="10" fill="#fffdf8" stroke="#d6e9e3" strokeWidth="1.500" />
        <text x="144" y="130" textAnchor="middle" fontFamily={JP} fontWeight="700" fontSize="82" fill="#2a2230">夢</text>
        <text x="144" y="156" textAnchor="middle" fontFamily={JP} fontSize="16" fill="#2a2230">ゆめ</text>
        <text x="144" y="176" textAnchor="middle" fontSize="11" fill="#7a8a88">(giấc mơ)</text>
      </g>
      <Blossom x={212} y={40} r={9} />
      <Blossom x={30} y={176} r={7} tone={1} />
    </svg>
  );
}

export function StreakArt() {
  return (
    <svg viewBox="0 0 240 200" preserveAspectRatio="xMaxYMax meet" aria-hidden="true">
      <Blossom x={60} y={26} r={9} />
      <Blossom x={214} y={22} r={8} tone={1} />
      <g transform="translate(112 22) scale(1.1)"><Fox /></g>
      <g transform="translate(176 120)">
        <rect width="56" height="56" rx="14" fill="#3b2368" />
        <rect x="2" y="2" width="52" height="52" rx="12" fill="none" stroke="#8d6ad6" strokeWidth="1.500" />
        <path d="M10 18c12 4 24 4 36 0v6c-12 3-24 3-36 0zM16 28h24v4H16zM19 24h5v22h-5zM32 24h5v22h-5z" fill="#ff5a4c" />
      </g>
      <g transform="translate(14 132)">
        <rect width="124" height="50" rx="25" fill="#fff" stroke="#ffd9b0" strokeWidth="1.500" />
        <g transform="translate(14 10) scale(1.300)">
          <path d="M12 3c1 4 5 5.500 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 .5 1.500 1.500 2 2 2 0-3-1-5 1-8z" fill="#ff8a1f" />
          <path d="M12 11c.6 2 2.500 2.800 2.500 5a2.500 2.500 0 0 1-5 0c0-1.200.6-1.800 1.200-2.400.3.800.8 1 1.300 1 0-1.600-.6-2.400 0-3.600z" fill="#ffd25a" />
        </g>
        <text x="50" y="22" fontSize="10.500" fill="#8a7a6a">Streak</text>
        <text x="50" y="40" fontSize="15" fontWeight="800" fill="#e0680f">12 ngày</text>
      </g>
    </svg>
  );
}

/* ============================ FOOTER SCENE ============================ */
export function FooterScene() {
  return (
    <svg viewBox="0 0 320 170" preserveAspectRatio="xMinYMax meet" aria-hidden="true">
      <defs>
        <radialGradient id="hp-moon" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffd9c4" stopOpacity=".8" />
          <stop offset="1" stopColor="#ffd9c4" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="210" cy="64" r="58" fill="url(#hp-moon)" />
      <path d="M0 150C60 132 120 150 190 142S290 134 320 144V170H0Z" fill="#0d0719" />
      <g fill="#120a22">
        <rect x="112" y="70" width="12" height="82" />
        <rect x="190" y="70" width="12" height="82" />
        <rect x="102" y="92" width="110" height="9" />
        <path d="M86 70Q157 84 228 70L222 58Q157 72 92 58Z" />
      </g>
      <Pine x={34} y={152} s={0.8} />
      <Pine x={64} y={156} s={0.6} />
      <Pine x={270} y={152} s={0.9} />
    </svg>
  );
}