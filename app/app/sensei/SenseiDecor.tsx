import type { ReactNode } from "react";

/**
 * Thành phần trang trí + icon cho trang AI Kaiwa Sensei.
 * Không dùng hook / state → import được cả ở Server Component (page.tsx) lẫn Client Component.
 */

/* ───────────── Hoa anh đào (SVG) ───────────── */

function Blossom({ x, y, r, o = 1, rot = 0 }: { x: number; y: number; r: number; o?: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={o}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy={-r * 0.62} rx={r * 0.46} ry={r * 0.72} transform={`rotate(${a})`} fill="#ffc6d3" />
      ))}
      <circle r={r * 0.2} fill="#ff8fab" />
    </g>
  );
}

// Toạ độ cố định (không random) để SSR/CSR khớp nhau.
const LEFT_BLOSSOMS = [
  [30, 90, 34, 0.9, 10], [92, 40, 26, 0.8, 40], [60, 190, 30, 0.85, 70], [14, 300, 38, 0.9, 20],
  [120, 150, 22, 0.7, 5], [40, 430, 30, 0.75, 55], [18, 560, 36, 0.8, 30], [90, 700, 28, 0.7, 15],
  [30, 820, 34, 0.8, 60], [150, 20, 20, 0.6, 0],
] as const;
const RIGHT_BLOSSOMS = [
  [1410, 70, 36, 0.9, 25], [1340, 30, 26, 0.8, 5], [1380, 180, 30, 0.85, 50], [1426, 310, 34, 0.9, 15],
  [1320, 120, 22, 0.7, 35], [1400, 440, 30, 0.75, 65], [1424, 600, 36, 0.8, 0], [1360, 760, 28, 0.7, 45],
  [1410, 850, 34, 0.8, 20], [1290, 20, 20, 0.6, 10],
] as const;

export function SakuraBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-[#fff3f6] via-[#fdf1f4] to-[#f6edf3] dark:from-sumi-950 dark:via-sumi-950 dark:to-sumi-900"
    >
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMin slice" className="absolute inset-0 h-full w-full">
        {/* Phú Sĩ mờ phía sau */}
        <path
          d="M420 330 C520 300 600 220 660 175 Q720 140 780 175 C840 220 920 300 1020 330 Z"
          className="fill-[#e7e4f2] dark:fill-slate-800"
          opacity="0.7"
        />
        <path
          d="M660 175 Q720 140 780 175 C790 185 800 197 812 208 L778 196 L748 222 L718 190 L688 220 L660 198 C656 190 657 182 660 175 Z"
          className="fill-white dark:fill-slate-600"
          opacity="0.9"
        />
        <g className="dark:opacity-30">
          {LEFT_BLOSSOMS.map(([x, y, r, o, rot], i) => (
            <Blossom key={`l${i}`} x={x} y={y} r={r} o={o} rot={rot} />
          ))}
          {RIGHT_BLOSSOMS.map(([x, y, r, o, rot], i) => (
            <Blossom key={`r${i}`} x={x} y={y} r={r} o={o} rot={rot} />
          ))}
        </g>
      </svg>
    </div>
  );
}

/** Cảnh nền phía sau avatar ở thẻ Sensei: trời hồng–xanh, Phú Sĩ, chùa, hoa. */
export function HeroScene() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 300"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="nqHeroSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9d8f5" />
          <stop offset="0.55" stopColor="#f3d9e6" />
          <stop offset="1" stopColor="#ffe9ee" />
        </linearGradient>
      </defs>
      <rect width="320" height="300" fill="url(#nqHeroSky)" />
      <ellipse cx="80" cy="60" rx="60" ry="14" fill="#fff" opacity="0.55" />
      <ellipse cx="250" cy="40" rx="50" ry="11" fill="#fff" opacity="0.5" />
      <path d="M40 230 L120 150 Q160 118 200 150 L290 230 Z" fill="#a9b6e0" opacity="0.85" />
      <path d="M120 150 Q160 118 200 150 L186 150 L172 164 L160 146 L146 166 L132 152 Z" fill="#fff" opacity="0.95" />
      {/* Chùa */}
      <g opacity="0.8" fill="#e56b7f">
        <rect x="236" y="176" width="34" height="40" />
        <path d="M228 178 L253 160 L278 178 Z" fill="#b94a5e" />
        <path d="M232 160 L253 146 L274 160 Z" fill="#b94a5e" />
      </g>
      <g opacity="0.7" fill="#e56b7f">
        <rect x="6" y="186" width="30" height="40" />
        <path d="M0 188 L21 170 L42 188 Z" fill="#b94a5e" />
      </g>
      {[[20, 20, 18], [60, 56, 12], [296, 24, 20], [286, 80, 12], [12, 120, 14], [306, 150, 14]].map(([x, y, r], i) => (
        <Blossom key={i} x={x} y={y} r={r} o={0.9} rot={i * 20} />
      ))}
    </svg>
  );
}

/** Cảnh đêm cho banner động lực: trăng, Phú Sĩ, cổng torii, hoa. */
export function BannerScene() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 160"
      preserveAspectRatio="xMaxYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="nqBannerSky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1b2243" />
          <stop offset="0.6" stopColor="#2a2a55" />
          <stop offset="1" stopColor="#5a3a63" />
        </linearGradient>
      </defs>
      <rect width="300" height="160" fill="url(#nqBannerSky)" />
      <circle cx="270" cy="34" r="10" fill="#f6b8c8" opacity="0.9" />
      <path d="M120 130 L190 66 Q210 52 230 66 L300 130 Z" fill="#3b3f7a" />
      <path d="M190 66 Q210 52 230 66 L222 68 L214 76 L208 64 L200 78 L194 70 Z" fill="#e9e6ff" opacity="0.9" />
      <path d="M0 130 H300 V160 H0 Z" fill="#171b36" />
      {/* Torii */}
      <g fill="#d9304f">
        <rect x="196" y="82" width="5" height="52" />
        <rect x="236" y="82" width="5" height="52" />
        <path d="M188 82 Q218 74 250 82 L250 88 Q218 80 188 88 Z" />
        <rect x="194" y="96" width="50" height="4" />
      </g>
      {[[262, 20, 12], [284, 66, 16], [250, 112, 10], [150, 18, 8]].map(([x, y, r], i) => (
        <Blossom key={i} x={x} y={y} r={r} o={0.85} rot={i * 25} />
      ))}
    </svg>
  );
}

/* ───────────── Icon nhỏ ───────────── */

type IconProps = { className?: string };

function Svg({ className = "h-5 w-5", children, fill = "none" }: IconProps & { children: ReactNode; fill?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill={fill}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export const SakuraFlower = ({ className = "h-7 w-7" }: IconProps) => (
  <svg aria-hidden="true" viewBox="-20 -20 40 40" className={className}>
    {[0, 72, 144, 216, 288].map((a) => (
      <ellipse key={a} cx="0" cy="-8" rx="6.5" ry="10" transform={`rotate(${a})`} fill="#ff9db5" />
    ))}
    <circle r="3.4" fill="#ff5c85" />
  </svg>
);

export const WaveIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2" />
  </Svg>
);
export const SendIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M21 3 10 14M21 3l-7 18-4-7-7-4 18-7Z" />
  </Svg>
);
export const DoubleCheckIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="m2 13 4 4L14 8M10 15l2 2 8-9" />
  </Svg>
);
export const StarIcon = ({ className, filled }: IconProps & { filled?: boolean }) => (
  <Svg className={className} fill={filled ? "currentColor" : "none"}>
    <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z" />
  </Svg>
);
export const KebabIcon = ({ className }: IconProps) => (
  <Svg className={className} fill="currentColor">
    <circle cx="12" cy="5" r="1.6" />
    <circle cx="12" cy="12" r="1.6" />
    <circle cx="12" cy="19" r="1.6" />
  </Svg>
);
export const UserIcon = ({ className }: IconProps) => (
  <Svg className={className} fill="currentColor">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7H4Z" />
  </Svg>
);
export const ChevronRight = ({ className = "h-4 w-4" }: IconProps) => (
  <Svg className={className}>
    <path d="m9 6 6 6-6 6" />
  </Svg>
);
export const BookIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M12 6c-1.8-1.3-4.2-2-7-2v14c2.8 0 5.2.7 7 2m0-14c1.8-1.3 4.2-2 7-2v14c-2.8 0-5.2.7-7 2m0-14v14" />
  </Svg>
);
export const DocIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M7 3h7l5 5v13H7V3Z M14 3v5h5M10 13h6M10 17h6" />
  </Svg>
);
export const CalendarIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <rect x="3.5" y="5" width="17" height="15" rx="3" />
    <path d="M8 3v4M16 3v4M3.5 10h17" />
  </Svg>
);
export const ClockIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Svg>
);
export const PlayIcon = ({ className }: IconProps) => (
  <Svg className={className} fill="currentColor">
    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
  </Svg>
);
export const SparkleIcon = ({ className }: IconProps) => (
  <Svg className={className} fill="currentColor">
    <path d="M12 3c.6 4.4 2.6 6.4 7 7-4.4.6-6.4 2.6-7 7-.6-4.4-2.6-6.4-7-7 4.4-.6 6.4-2.6 7-7Z" />
  </Svg>
);
export const BriefcaseIcon = ({ className }: IconProps) => (
  <Svg className={className} fill="currentColor">
    <path d="M9 4h6a2 2 0 0 1 2 2v1h2.5A1.5 1.5 0 0 1 21 8.5V12H3V8.5A1.5 1.5 0 0 1 4.5 7H7V6a2 2 0 0 1 2-2Zm0 2v1h6V6H9ZM3 13.5h18V19a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19v-5.5Z" />
  </Svg>
);
export const BulbIcon = ({ className }: IconProps) => (
  <Svg className={className} fill="currentColor">
    <path d="M12 2.5a6.5 6.5 0 0 0-3.8 11.8c.5.4.8 1 .8 1.7v.5h6V16c0-.7.3-1.3.8-1.7A6.5 6.5 0 0 0 12 2.5ZM9.5 18.5h5v1a2.5 2.5 0 0 1-5 0v-1Z" />
  </Svg>
);
