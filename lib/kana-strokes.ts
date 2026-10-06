/**
 * Dữ liệu thứ tự nét kana lấy từ KanjiVG (CC BY-SA 3.0, https://kanjivg.tagaini.net).
 * `kana-strokes.json`: { "あ": { s: [path d...], n: [[x,y]...] } }  — viewBox 109x109,
 * `s` đã sắp theo thứ tự nét, `n` là vị trí số thứ tự của từng nét.
 * Âm ghép (きゃ, しゃ...) được ghép từ 2 ký tự: chữ lớn + chữ nhỏ.
 */
export const VIEW = 109;

export interface Pt {
  x: number; // 0..1
  y: number; // 0..1
}
export interface GlyphStroke {
  d: string;
  s: number; // scale
  tx: number;
  ty: number;
  num: [number, number]; // vị trí số nét (đã biến đổi, hệ 109)
}
export interface ArrowMark {
  x: number;
  y: number;
  angle: number; // độ
}

interface RawGlyph {
  s: string[];
  n: number[][];
}
type RawData = Record<string, RawGlyph>;

let rawCache: Promise<RawData> | null = null;
function loadRaw(): Promise<RawData> {
  if (!rawCache) {
    rawCache = import("./kana-strokes.json").then(
      (m) => ((m as unknown as { default?: RawData }).default ?? (m as unknown as RawData)),
    );
  }
  return rawCache;
}

function layoutFor(count: number): { s: number; tx: number; ty: number }[] {
  if (count === 1) return [{ s: 1, tx: 0, ty: 0 }];
  if (count === 2) {
    // chữ lớn bên trái-trên, chữ nhỏ (ゃゅょ) bên phải-dưới
    return [
      { s: 0.68, tx: 1, ty: 5 },
      { s: 0.5, tx: 55, ty: 47 },
    ];
  }
  const s = 1 / count;
  return Array.from({ length: count }, (_, i) => ({ s, tx: (i * VIEW) / count, ty: (VIEW - VIEW * s) / 2 }));
}

/** Trả về null nếu thiếu dữ liệu nét cho ký tự (khi đó chỉ cho tập viết tự do). */
export async function loadGlyph(character: string): Promise<GlyphStroke[] | null> {
  const raw = await loadRaw();
  const chars = Array.from(character);
  const layout = layoutFor(chars.length);
  const out: GlyphStroke[] = [];
  for (let i = 0; i < chars.length; i++) {
    const g = raw[chars[i]];
    if (!g) return null;
    const L = layout[i];
    g.s.forEach((d, k) => {
      const n = g.n[k] ?? [12, 12];
      out.push({ d, s: L.s, tx: L.tx, ty: L.ty, num: [n[0] * L.s + L.tx, n[1] * L.s + L.ty] });
    });
  }
  return out;
}

/* ---------- đo hình học bằng SVG (chỉ chạy ở client) ---------- */
const NS = "http://www.w3.org/2000/svg";
let measureSvg: SVGSVGElement | null = null;
function measurePath(d: string): SVGPathElement {
  if (!measureSvg) {
    measureSvg = document.createElementNS(NS, "svg");
    measureSvg.setAttribute("width", "0");
    measureSvg.setAttribute("height", "0");
    measureSvg.style.cssText = "position:absolute;left:-9999px;top:0;visibility:hidden";
    document.body.appendChild(measureSvg);
  }
  const p = document.createElementNS(NS, "path");
  p.setAttribute("d", d);
  measureSvg.replaceChildren(p);
  return p;
}

/** Lấy mẫu một nét thành polyline chuẩn hóa 0..1. */
export function sampleStroke(g: GlyphStroke, step = 1.2): Pt[] {
  const p = measurePath(g.d);
  const len = p.getTotalLength();
  const n = Math.max(6, Math.ceil((len * g.s) / step));
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const q = p.getPointAtLength((len * i) / n);
    pts.push({ x: (q.x * g.s + g.tx) / VIEW, y: (q.y * g.s + g.ty) / VIEW });
  }
  return pts;
}

/** Vị trí + góc các mũi tên chỉ hướng dọc theo nét (hệ toạ độ 109). */
export function arrowMarks(g: GlyphStroke): ArrowMark[] {
  const p = measurePath(g.d);
  const len = p.getTotalLength();
  const worldLen = len * g.s;
  const count = Math.max(1, Math.min(3, Math.round(worldLen / 26)));
  const fracs = count === 1 ? [0.6] : Array.from({ length: count }, (_, i) => 0.3 + (i * 0.56) / (count - 1));
  return fracs.map((f) => {
    const at = len * f;
    const a = p.getPointAtLength(Math.max(0, at - 0.6));
    const b = p.getPointAtLength(Math.min(len, at + 0.6));
    const c = p.getPointAtLength(at);
    return {
      x: c.x * g.s + g.tx,
      y: c.y * g.s + g.ty,
      angle: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI,
    };
  });
}
