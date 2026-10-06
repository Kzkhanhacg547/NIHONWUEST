import { useId } from "react";

/** Tranh phong cảnh vẽ bằng SVG — thay cho ảnh minh họa từng bài học. */
const P = [
  { a: "#f8dccd", b: "#fdf3ea", sun: "#d6322a", far: "#c9d1d8", mid: "#8097a6", near: "#44596a", water: "#d3e0e5", torii: "#d6322a", snow: "#fff" },
  { a: "#f4c3ae", b: "#fbe4d3", sun: "#e2573b", far: "#cdbfc0", mid: "#8d7f8c", near: "#4d4358", water: "#e8d5cc", torii: "#c5281f", snow: "#fff8f2" },
  { a: "#e1e7ea", b: "#f5f6f2", sun: "#cb4a40", far: "#cfd8dc", mid: "#9aa9b3", near: "#5a6d79", water: "#dfe8eb", torii: "#d6322a", snow: "#fff" },
  { a: "#f7dadd", b: "#fdf1ee", sun: "#d6322a", far: "#d4c7cf", mid: "#9a8da2", near: "#554b63", water: "#ead9de", torii: "#d6322a", snow: "#fff" },
  { a: "#1f2c47", b: "#46526d", sun: "#f3ead0", far: "#4c5a76", mid: "#33425e", near: "#1b263c", water: "#2c3b57", torii: "#e0463c", snow: "#dfe5ee" },
];

export function SceneArt({ index = 0, className }: { index?: number; className?: string }) {
  const id = useId().replace(/:/g, "");
  const c = P[((index % P.length) + P.length) % P.length];
  const showTorii = index % 2 === 0 || index % 5 === 4;
  return (
    <svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label="Tranh phong cảnh Nhật Bản">
      <defs>
        <linearGradient id={`s${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.a} />
          <stop offset="1" stopColor={c.b} />
        </linearGradient>
      </defs>
      <rect width="160" height="120" fill={`url(#s${id})`} />
      <circle cx="62" cy="42" r="19" fill={c.sun} />
      <path d="M0 92 Q28 70 56 88 T118 84 T160 90 V120 H0Z" fill={c.far} />
      <path d="M8 100 L60 40 Q70 35 80 40 L140 100Z" fill={c.mid} />
      <path d="M60 40 Q70 35 80 40 L86 48 L77 44 L70 50 L63 44 L55 49Z" fill={c.snow} />
      <rect y="98" width="160" height="22" fill={c.water} />
      <path d="M0 104 Q24 86 52 108 L40 120 H0Z" fill={c.near} />
      <path d="M160 100 Q140 92 118 112 L124 120 H160Z" fill={c.near} />
      {showTorii && (
        <g fill={c.torii}>
          <rect x="106" y="70" width="3.2" height="30" />
          <rect x="125" y="70" width="3.2" height="30" />
          <path d="M101 67 Q117 62 133 67 L132 72 H102Z" />
          <rect x="107" y="77" width="21" height="2.6" />
        </g>
      )}
      <g fill="#f4a6b0" opacity=".85">
        <circle cx="16" cy="22" r="2" /><circle cx="30" cy="14" r="1.6" /><circle cx="140" cy="26" r="2" />
        <circle cx="128" cy="12" r="1.5" /><circle cx="146" cy="48" r="1.6" />
      </g>
    </svg>
  );
}
