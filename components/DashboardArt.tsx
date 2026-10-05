import React from "react";

/* Toàn bộ hình minh họa của Dashboard đều được vẽ bằng SVG/JSX — không có ảnh bitmap. */

const PINKS = ["#f9bcc4", "#f4909f", "#fbd5d9", "#ef7a8c"];
const serif = { fontFamily: "var(--nqd-serif)" } as const;

type BlossomProps = {
  n: number;
  x: (i: number) => number;
  y: (i: number) => number;
  r: (i: number) => number;
  opacity?: number;
};

/** Cụm hoa anh đào: các vòng tròn hồng, vị trí tính theo hàm để luôn cố định (không random → không lệch hydration). */
function Blossoms({ n, x, y, r, opacity = 0.92 }: BlossomProps) {
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => (
        <circle key={i} cx={x(i)} cy={y(i)} r={r(i)} fill={PINKS[i % PINKS.length]} opacity={opacity} />
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

export type IconName =
  | "home" | "book" | "chart" | "gear" | "rocket" | "target"
  | "trophy" | "train" | "headphones" | "shield" | "sakura" | "flame";

const STROKE_ICONS: Record<Exclude<IconName, "sakura" | "flame">, React.ReactNode> = {
  home: (<><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10v10h13V10" /><path d="M10 20v-5h4v5" /></>),
  book: (<><path d="M12 6.5C10 5 7 4.6 3.5 5v13c3.5-.4 6.5 0 8.5 1.5 2-1.5 5-1.9 8.5-1.5V5C17 4.6 14 5 12 6.5Z" /><path d="M12 6.5v13" /></>),
  chart: (<><path d="M3 20h18" /><path d="M6 20v-7M11 20V5M16 20v-9M20 20V8" /></>),
  gear: (<><circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="6.6" /><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1" /></>),
  rocket: (<><path d="M12 2.5c3.5 2 5.5 6 5 11l-3 3h-4l-3-3c-.5-5 1.5-9 5-11Z" /><circle cx="12" cy="9.5" r="1.8" /><path d="M7.2 14 4 17.5l3.2.8M16.8 14l3.2 3.5-3.2.8M10 19.5l2 2.5 2-2.5" /></>),
  target: (<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.2" fill="currentColor" /></>),
  trophy: (<><path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" /><path d="M7 6H4v1.5A3 3 0 0 0 7 10.5M17 6h3v1.5a3 3 0 0 1-3 3" /><path d="M12 14v4M8.5 20h7" /></>),
  train: (<><rect x="5" y="3.5" width="14" height="13" rx="4" /><path d="M5 11h14" /><circle cx="9" cy="14" r=".8" /><circle cx="15" cy="14" r=".8" /><path d="M8 20.5l2-4M16 20.5l-2-4" /></>),
  headphones: (<><path d="M4 15v-3a8 8 0 0 1 16 0v3" /><rect x="3" y="14" width="4" height="6" rx="1.6" /><rect x="17" y="14" width="4" height="6" rx="1.6" /></>),
  shield: (<><path d="M12 3 5 6v5.5c0 4.4 3 7.8 7 9.5 4-1.7 7-5.1 7-9.5V6l-7-3Z" /><path d="m12 8.5 1.1 2.3 2.5.3-1.8 1.7.5 2.5-2.3-1.2-2.3 1.2.5-2.5-1.8-1.7 2.5-.3L12 8.5Z" /></>),
};

export function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", "aria-hidden": true as const, focusable: false };
  if (name === "sakura") {
    return (
      <svg {...common}>
        <g fill="#f08a97">
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="12" cy="6.6" rx="3.6" ry="4.7" transform={`rotate(${a} 12 12)`} />
          ))}
        </g>
        <circle cx="12" cy="12" r="2" fill="#e5333f" />
      </svg>
    );
  }
  if (name === "flame") {
    return (
      <svg {...common}>
        <path d="M12 2.5c1.2 3.8 5.5 6 5.5 10.6a5.5 5.5 0 0 1-11 0c0-2.2 1-3.8 2.2-5 .1 1.8 1 2.8 2 2.8C10.2 8 10.8 5 12 2.5Z" fill="#f26a21" />
        <path d="M12 21a3 3 0 0 1-3-3c0-1.6 1.2-2.4 1.8-3.6.8.8 1.2 1.2 1.6 2 .6-.4 1-.9 1.2-1.6.7 1 1.4 1.8 1.4 3.2a3 3 0 0 1-3 3Z" fill="#ffc23d" />
      </svg>
    );
  }
  return (
    <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {STROKE_ICONS[name]}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Thẻ "Bài học hôm nay": phố đèn lồng lúc hoàng hôn                   */
/* ------------------------------------------------------------------ */

export function JapanStreetScene() {
  return (
    <svg viewBox="0 0 900 340" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="st-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#12122e" />
          <stop offset=".5" stopColor="#3a2a63" />
          <stop offset="1" stopColor="#b34a6c" />
        </linearGradient>
        <radialGradient id="st-glow">
          <stop offset="0" stopColor="#ffb25a" stopOpacity=".9" />
          <stop offset="1" stopColor="#ffb25a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="st-moon">
          <stop offset="0" stopColor="#ffb4b4" stopOpacity=".55" />
          <stop offset="1" stopColor="#ffb4b4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="st-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e39a74" stopOpacity=".75" />
          <stop offset="1" stopColor="#1a1020" />
        </linearGradient>
      </defs>
      <rect width="900" height="340" fill="url(#st-sky)" />
      {Array.from({ length: 22 }).map((_, i) => (
        <circle key={i} cx={(i * 211) % 900} cy={((i * 47) % 120) + 8} r={0.8 + (i % 3) * 0.5} fill="#fff" opacity={0.5 + (i % 4) * 0.12} />
      ))}
      <circle cx="620" cy="112" r="90" fill="url(#st-moon)" />
      <circle cx="620" cy="112" r="30" fill="#ff9d9d" />
      <path d="M300 250C400 200 470 230 560 215S760 205 900 240V340H300Z" fill="#2a2250" />
      {/* pagoda */}
      <g transform="translate(590 60)" fill="#120c1e">
        <rect x="58" y="0" width="4" height="26" />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={`translate(0 ${26 + i * 38})`}>
            <path d={`M${44 - i * 10} 0H${76 + i * 10}L${86 + i * 10} 12H${34 - i * 10}Z`} />
            <rect x={52 - i * 4} y="12" width={16 + i * 8} height="22" fill="#1e1330" />
            <rect x="56" y="17" width="8" height="10" fill="#ffc46b" opacity=".9" />
          </g>
        ))}
      </g>
      {/* nhà hai bên */}
      <path d="M360 340V160L470 190V340Z" fill="#150d1f" />
      <path d="M740 340V150L900 120V340Z" fill="#150d1f" />
      {[[380, 210], [404, 232], [428, 214], [770, 190], [800, 214], [840, 196], [870, 232]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="12" height="16" rx="2" fill="#ffc46b" opacity=".8" />
      ))}
      <path d="M440 340L545 262H640L740 340Z" fill="url(#st-road)" />
      {/* đèn lồng */}
      {[[420, 215], [452, 250], [500, 232], [780, 200], [815, 238], [858, 214], [700, 250]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle r="34" fill="url(#st-glow)" />
          <rect x="-6" y="-9" width="12" height="18" rx="5" fill="#ff7b3a" />
        </g>
      ))}
      {/* hoa anh đào */}
      <path d="M900 0C830 28 770 18 700 66M820 24c-10 20-4 36 8 52" stroke="#1a1020" strokeWidth="4" strokeLinecap="round" fill="none" />
      <Blossoms n={22} x={(i) => 690 + i * 10} y={(i) => 66 - Math.sin(i * 0.8) * 32 + (i % 3) * 7} r={(i) => 7 + (i % 3)} />
      <Blossoms n={14} x={(i) => 760 + i * 10} y={(i) => 20 + (i % 4) * 9} r={(i) => 6 + (i % 3)} opacity={0.85} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Dải Shinkansen                                                      */
/* ------------------------------------------------------------------ */

export function ShinkansenStrip() {
  return (
    <svg viewBox="0 0 440 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="sk-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f9dfe4" />
          <stop offset="1" stopColor="#fff6f3" />
        </linearGradient>
      </defs>
      <rect width="440" height="90" fill="url(#sk-sky)" />
      <path d="M0 62C60 40 110 56 180 44S330 30 440 52V90H0Z" fill="#d4dde6" />
      <path d="M0 74C90 62 170 76 260 66S390 64 440 70V90H0Z" fill="#7da093" />
      <path d="M0 80H440V90H0Z" fill="#6f8f86" />
      {/* cây anh đào */}
      {[[26, 40], [64, 34], [110, 46]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 1.5} y={y + 12} width="3" height="30" fill="#6a4a46" />
          <circle cx={x} cy={y} r="16" fill="#f4a6b3" />
          <circle cx={x - 10} cy={y + 8} r="11" fill="#f9c3cc" />
          <circle cx={x + 11} cy={y + 7} r="10" fill="#ef8fa0" />
        </g>
      ))}
      {/* tàu */}
      <g transform="translate(150 34)">
        <path d="M0 24C0 14 6 10 16 10H190C214 10 232 18 246 32L252 40H0Z" fill="#fff" />
        <rect x="0" y="26" width="250" height="4" fill="#1d4f9a" />
        <rect x="0" y="31" width="250" height="1.6" fill="#e5333f" />
        <g fill="#1d4f9a">
          {Array.from({ length: 13 }).map((_, i) => (
            <rect key={i} x={30 + i * 13} y="14" width="8" height="8" rx="1.5" />
          ))}
          <path d="M214 14h14l12 12h-26Z" />
        </g>
        <rect x="0" y="40" width="252" height="6" fill="#cfd8e3" />
        <rect x="0" y="46" width="252" height="2" fill="#97a3b3" />
      </g>
      {Array.from({ length: 9 }).map((_, i) => (
        <circle key={i} cx={30 + i * 48} cy={20 + (i % 3) * 8} r="3.5" fill="#ef7a8c" opacity=".8" />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Minh họa cho từng thẻ chế độ học                                    */
/* ------------------------------------------------------------------ */

export type ModeArtKind = "srs" | "kana" | "mountain" | "bird" | "torii";

export function ModeArt({ kind }: { kind: ModeArtKind }) {
  const common = { viewBox: "0 0 96 96", "aria-hidden": true as const, focusable: false };
  switch (kind) {
    case "srs":
      return (
        <svg {...common}>
          <g transform="rotate(-8 48 50)">
            <rect x="20" y="14" width="52" height="64" rx="8" fill="#fff" stroke="#e5333f" strokeWidth="4" />
            <rect x="26" y="20" width="40" height="52" rx="5" fill="#fff0f0" />
            <text x="46" y="58" textAnchor="middle" fontSize="34" fontWeight="700" fill="#e5333f" style={serif}>あ</text>
            <path d="M32 78v12l6-5 6 5V78Z" fill="#e5333f" />
          </g>
          <path d="M72 22a12 12 0 0 1 8 14" stroke="#e5333f" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M82 31l-3 8-6-4Z" fill="#e5333f" />
        </svg>
      );
    case "kana":
      return (
        <svg {...common}>
          <g stroke="#3f63d8" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 30V16h14M66 16h14v14M80 66v14H66M30 80H16V66" />
          </g>
          <text x="48" y="64" textAnchor="middle" fontSize="44" fontWeight="700" fill="#2c3f9c" style={serif}>あ</text>
        </svg>
      );
    case "mountain":
      return (
        <svg {...common}>
          <path d="M44 18c8-8 22-6 24 2-8 4-18 4-24-2Z" fill="#6cb77a" />
          <path d="M4 82 38 34Q44 26 50 34L92 82Z" fill="#4f9a60" />
          <path d="M52 52 66 34Q70 30 74 36L94 82H56Z" fill="#7cc08a" />
          <path d="M38 34Q44 26 50 34L56 43 49 40 43 48 37 40 31 43Z" fill="#fff" opacity=".9" />
        </svg>
      );
    case "bird":
      return (
        <svg {...common}>
          <path d="M26 74 10 90l26-8Z" fill="#d97c1a" />
          <path d="M16 58C28 42 52 36 76 44 66 50 62 58 60 66 48 63 36 64 26 74Z" fill="#f29a2e" />
          <path d="M34 54C44 44 60 44 70 50 60 56 48 60 34 54Z" fill="#f7bf5c" />
          <circle cx="72" cy="44" r="9" fill="#f29a2e" />
          <path d="M80 42l11 3-11 4Z" fill="#ffd36b" />
          <circle cx="74" cy="42" r="1.8" fill="#3b2a2a" />
        </svg>
      );
    case "torii":
    default:
      return (
        <svg {...common}>
          <rect x="22" y="38" width="8" height="46" fill="#e5333f" />
          <rect x="66" y="38" width="8" height="46" fill="#e5333f" />
          <path d="M10 24C34 34 62 34 86 24L90 33C62 44 34 44 6 33Z" fill="#d22f2f" />
          <rect x="26" y="50" width="44" height="6" fill="#e5333f" />
          <circle cx="78" cy="18" r="5" fill="#f08a97" />
          <circle cx="86" cy="26" r="3.5" fill="#f9bcc4" />
        </svg>
      );
  }
}

/* ------------------------------------------------------------------ */
/* Trang trí khác                                                      */
/* ------------------------------------------------------------------ */

/** Nét cọ đỏ gạch chân dưới tên người dùng. Co giãn theo bề rộng tên. */
export function BrushUnderline() {
  return (
    <svg className="brush" viewBox="0 0 400 20" preserveAspectRatio="none" aria-hidden="true">
      <path d="M4 12C60 4 140 17 220 8S330 11 396 5" stroke="#e5333f" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M40 17C120 12 220 18 330 13" stroke="#e5333f" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity=".6" />
    </svg>
  );
}

/** Trang trí mờ cho thẻ "Lộ trình": cổng torii + máy bay giấy + cánh hoa. */
export function PathDeco() {
  return (
    <svg viewBox="0 0 260 150" preserveAspectRatio="xMaxYMid meet" aria-hidden="true">
      <g fill="#d22f27" opacity=".13" transform="translate(140 36)">
        <rect x="14" y="22" width="8" height="88" />
        <rect x="86" y="22" width="8" height="88" />
        <path d="M-6 8C30 22 78 22 114 8L108 20C78 32 30 32 0 20Z" />
        <rect x="8" y="42" width="92" height="6" />
      </g>
      <g fill="none" stroke="#d22f27" strokeWidth="1.6" strokeLinejoin="round" opacity=".4">
        <path d="M110 40 170 18 146 62 136 46Z" />
        <path d="M136 46 170 18" />
        <path d="M10 92C50 82 80 62 106 44" strokeDasharray="3 5" strokeLinecap="round" />
      </g>
      {[[200, 26], [230, 70], [186, 110], [244, 118]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="5" ry="3" fill="#f4909f" opacity=".6" transform={`rotate(${i * 40} ${x} ${y})`} />
      ))}
    </svg>
  );
}

/** Búp bê Daruma cho thẻ chuỗi ngày học. */
export function Daruma() {
  return (
    <svg viewBox="0 0 60 64" aria-hidden="true">
      <ellipse cx="30" cy="40" rx="25" ry="23" fill="#d8262f" />
      <ellipse cx="30" cy="30" rx="16" ry="13" fill="#fff4e6" />
      <path d="M19 22q5-4 9-1M41 22q-5-4-9-1" stroke="#1c1917" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="24" cy="29" r="3" fill="#1c1917" />
      <circle cx="36" cy="29" r="3" fill="#1c1917" />
      <circle cx="25" cy="28" r="1" fill="#fff" />
      <circle cx="37" cy="28" r="1" fill="#fff" />
      <path d="M22 37q4 4 8 0q4 4 8 0" stroke="#1c1917" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M17 52q13 9 26 0" stroke="#f4c15a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M24 46h12" stroke="#f4c15a" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}