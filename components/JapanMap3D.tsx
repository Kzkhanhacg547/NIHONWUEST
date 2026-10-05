"use client";

import "./japan-map-3d.css";
import { useRef, type CSSProperties, type MouseEvent, type ReactNode } from "react";

export type MapTone = "done" | "open" | "next" | "locked";

export interface MapPin {
  id: string;
  slug: string;
  name: string;
  sub: string;
  tone: MapTone;
  icon: ReactNode;
}

/* ---------- Projection: kinh/vĩ độ thật -> toạ độ SVG ---------- */
const W = 860;
const H = 940;
const proj = (lon: number, lat: number): [number, number] => [
  (lon - 128.6) * 0.82 * 58 + 20, // 0.82 ≈ cos(35°) hiệu chỉnh co giãn kinh độ
  (46 - lat) * 58 + 20,
];

/* ---------- Đường bờ biển đơn giản hoá (lon, lat) ---------- */
const HONSHU: [number, number][] = [
  [141.4, 41.4], [141.45, 40.6], [142.05, 39.6], [141.9, 38.6], [141.0, 38.25], [140.95, 37.0],
  [140.6, 36.2], [140.85, 35.72], [140.35, 35.2], [139.85, 34.92], [139.8, 35.4], [139.65, 35.3],
  [139.15, 35.2], [138.85, 34.7], [138.2, 34.6], [137.3, 34.6], [136.95, 34.75], [136.85, 34.3],
  [136.3, 33.95], [135.76, 33.43], [135.15, 33.9], [135.1, 34.3], [135.4, 34.6], [134.6, 34.75],
  [133.9, 34.55], [132.5, 34.2], [132.1, 33.9], [130.9, 33.95], [131.25, 34.4], [131.85, 34.7],
  [133.0, 35.5], [134.2, 35.55], [134.8, 35.65], [135.7, 35.5], [136.05, 35.65], [136.7, 36.55],
  [136.75, 37.2], [137.0, 37.5], [137.3, 37.5], [137.0, 36.9], [138.2, 37.2], [139.0, 37.95],
  [139.6, 38.6], [140.0, 39.7], [139.7, 39.9], [140.0, 40.6], [140.25, 41.2], [140.8, 41.15],
  [141.1, 41.3],
];
const HOKKAIDO: [number, number][] = [
  [140.1, 41.4], [140.7, 41.8], [140.95, 42.3], [141.6, 42.3], [142.9, 42.0], [143.25, 41.9],
  [144.4, 43.0], [145.6, 43.3], [145.3, 44.3], [144.3, 44.0], [143.4, 44.35], [141.7, 45.5],
  [141.6, 43.9], [141.0, 43.2], [140.4, 43.3], [140.0, 42.6], [140.0, 41.8],
];
const SHIKOKU: [number, number][] = [
  [134.0, 34.3], [134.6, 34.2], [134.6, 33.8], [134.2, 33.25], [133.6, 33.5], [133.0, 32.75],
  [132.5, 33.1], [132.0, 33.35], [132.4, 33.85], [132.7, 33.95], [133.4, 34.1],
];
const KYUSHU: [number, number][] = [
  [130.95, 33.95], [131.7, 33.6], [131.9, 32.9], [131.7, 32.6], [131.5, 31.9], [131.1, 31.3],
  [130.65, 31.0], [130.55, 31.6], [130.2, 31.3], [130.2, 32.0], [130.4, 32.5], [129.8, 32.7],
  [129.7, 33.2], [129.9, 33.5], [130.4, 33.65],
];

/* Okinawa nằm quá xa -> vẽ trong khung inset ở góc dưới phải */
const insetProj = (lon: number, lat: number): [number, number] => [660 + (lon - 127.4) * 130, 770 + (27.1 - lat) * 130];
const OKINAWA: [number, number][] = [
  [128.27, 26.87], [128.0, 26.62], [127.9, 26.45], [127.7, 26.2], [127.65, 26.08], [127.8, 26.1],
  [127.95, 26.25], [128.05, 26.4], [128.2, 26.6],
];
const toPath = (pts: [number, number][], p = proj) =>
  pts.map(([lo, la], i) => {
    const [x, y] = p(lo, la);
    return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join("") + "Z";

const LAND_D = [HONSHU, HOKKAIDO, SHIKOKU, KYUSHU].map((p) => toPath(p)).join(" ") + " " + toPath(OKINAWA, insetProj);

/* ---------- Vị trí thật của các thành phố (lon, lat) ---------- */
const GEO: Record<string, [number, number]> = {
  tokyo: [139.69, 35.68], kyoto: [135.77, 35.01], nara: [135.8, 34.69], osaka: [135.5, 34.69],
  nagoya: [136.9, 35.18], fuji: [138.73, 35.36], hiroshima: [132.46, 34.39], hokkaido: [141.35, 43.06],
  okinawa: [127.68, 26.21],
};
/* vị trí thẻ tên so với điểm (px màn hình) — tránh chồng nhau ở vùng Kansai/Kanto */
const LABEL: Record<string, [number, number]> = {
  tokyo: [95, -30], fuji: [85, 58], nagoya: [0, -62], kyoto: [-88, -40], nara: [55, 50],
  osaka: [-92, 34], hiroshima: [-10, 54], hokkaido: [-95, 12], okinawa: [-10, -46],
};

function posOf(slug: string, i: number, fallback?: { x: number; y: number }[]) {
  const g = GEO[slug];
  if (g) {
    const [x, y] = slug === "okinawa" ? insetProj(g[0], g[1]) : proj(g[0], g[1]);
    return { x, y, left: (x / W) * 100, top: (y / H) * 100 };
  }
  const f = fallback?.[i] ?? { x: 50, y: 50 };
  return { x: (f.x / 100) * W, y: (f.y / 100) * H, left: f.x, top: f.y };
}

function Land({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <path d={LAND_D} />
    </svg>
  );
}

const LAYERS = 9;

export function JapanMap3D({
  pins,
  activeIndex,
  onSelect,
  fallback,
  night,
  children,
}: {
  pins: MapPin[];
  activeIndex: number;
  onSelect: (i: number) => void;
  fallback?: { x: number; y: number }[];
  night?: boolean;
  children?: ReactNode;
}) {
  const stageRef = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${48 - ny * 10}deg`);
    el.style.setProperty("--rz", `${-4 + nx * 12}deg`);
  };
  const onLeave = () => {
    stageRef.current?.style.setProperty("--rx", "48deg");
    stageRef.current?.style.setProperty("--rz", "-4deg");
  };

  const placed = pins.map((p, i) => ({ ...p, ...posOf(p.slug, i, fallback), off: (LABEL[p.slug] ?? [0, -48]) as [number, number] }));
  const route = placed.filter((p) => p.tone !== "locked").map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");

  return (
    <div className={`jm-scene ${night ? "is-night" : ""}`} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="jm-sun" aria-hidden="true" />
      <div className="jm-stage" ref={stageRef}>
        <div className="jm-shadow" />

        {/* biển + lưới kinh vĩ tuyến */}
        <svg className="jm-sea" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          <defs>
            <linearGradient id="jmSea" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#24406f" />
              <stop offset="1" stopColor="#12213f" />
            </linearGradient>
          </defs>
          <rect width={W} height={H} rx="26" fill="url(#jmSea)" />
          {Array.from({ length: 9 }, (_, i) => (
            <path key={`h${i}`} d={`M0 ${(i + 1) * 94}H${W}`} className="jm-grid" />
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <path key={`v${i}`} d={`M${(i + 1) * 95} 0V${H}`} className="jm-grid" />
          ))}
          <rect x="640" y="752" width="190" height="170" rx="14" className="jm-inset" />
          <text x="652" y="774" className="jm-inset-label">沖縄</text>
          {[0, 1, 2].map((i) => (
            <path key={`w${i}`} className="jm-wave" d={`M${60 + i * 40} ${830 - i * 36}q30 -16 60 0t60 0t60 0`} />
          ))}
        </svg>

        {/* khối đất: xếp lớp để tạo độ dày thật */}
        {Array.from({ length: LAYERS }, (_, i) => (
          <div key={i} className="jm-layer" style={{ transform: `translateZ(${(i + 1) * 1.7}px)` }}>
            <Land className="jm-side" />
          </div>
        ))}
        <div className="jm-layer" style={{ transform: `translateZ(${(LAYERS + 1) * 1.7}px)` }}>
          <Land className="jm-top" />
        </div>

        {/* tuyến đường hành trình */}
        <div className="jm-layer" style={{ transform: `translateZ(${(LAYERS + 2) * 1.7}px)` }}>
          <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
            <path d={route} className="jm-route" />
          </svg>
        </div>

        {/* ghim đứng thẳng, luôn hướng về người xem */}
        {placed.map((p, i) => (
          <div
            key={p.id}
            className={`jm-pin is-${p.tone} ${i === activeIndex ? "is-selected" : ""}`}
            style={{ left: `${p.left}%`, top: `${p.top}%` }}
          >
            <span className="jm-ring" />
            <div className="jm-board">
              <span className="jm-lead" style={{ width: Math.hypot(...p.off) - 16, transform: `rotate(${Math.atan2(p.off[1], p.off[0])}rad)` } as CSSProperties} />
              <button type="button" className="jm-card" style={{ "--dx": `${p.off[0]}px`, "--dy": `${p.off[1]}px` } as CSSProperties} onClick={() => onSelect(i)} aria-label={p.name}>
                <span className="jm-ico">{p.icon}</span>
                <span className="jm-txt">
                  <strong>{p.name}</strong>
                  <small>{p.sub}</small>
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
      {children}
    </div>
  );
}