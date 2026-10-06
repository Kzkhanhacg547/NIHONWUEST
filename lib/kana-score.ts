import { sampleStroke, type GlyphStroke, type Pt } from "./kana-strokes";

/* ---- Tham số có thể chỉnh độ khó ---- */
export const PASS_SCORE = 70;
const GRID = 80; // độ phân giải lưới so khớp
const TOL = 9; // bán kính dung sai (px trên lưới) ≈ ±5% khung chữ — phải là số lẻ
const LINE = 3; // độ dày nét khi raster
const SHAPE_BAD = 0.17; // khoảng cách trung bình (chuẩn hóa) coi là sai hình
const SHAPE_OK = 0.12;
const DIR_MARGIN = 0.05;

export interface StrokeIssue {
  index: number; // 0-based
  kind: "order" | "direction" | "shape";
  message: string;
}
export interface ScoreResult {
  score: number; // 0..100
  passed: boolean;
  coverage: number; // % nét mẫu được phủ
  precision: number; // % nét viết nằm đúng vị trí
  expected: number;
  got: number;
  issues: StrokeIssue[];
  backend: string;
}

type TF = typeof import("@tensorflow/tfjs");
let tfPromise: Promise<TF> | null = null;
/** Tải TensorFlow.js một lần; gọi sớm (warmup) để lần chấm đầu không bị trễ. */
export function loadTf(): Promise<TF> {
  if (!tfPromise) {
    tfPromise = import("@tensorflow/tfjs").then(async (tf) => {
      await tf.ready();
      return tf;
    });
  }
  return tfPromise;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function bbox(strokes: Pt[][]) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const s of strokes) for (const p of s) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY, cx: (minX + maxX) / 2, cy: (minY + maxY) / 2 };
}

/** Căn chữ người viết vào đúng khung của chữ mẫu: không bị trừ điểm vì viết lệch/nhỏ/to. */
function fit(user: Pt[][], ref: Pt[][]): Pt[][] {
  const u = bbox(user);
  const r = bbox(ref);
  const us = Math.max(u.w, u.h, 0.05);
  const rs = Math.max(r.w, r.h);
  const k = clamp(rs / us, 0.4, 3);
  return user.map((s) => s.map((p) => ({ x: (p.x - u.cx) * k + r.cx, y: (p.y - u.cy) * k + r.cy })));
}

function raster(strokes: Pt[][]): Float32Array {
  const c = document.createElement("canvas");
  c.width = c.height = GRID;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.lineWidth = LINE;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = ctx.fillStyle = "#000";
  for (const s of strokes) {
    if (s.length === 0) continue;
    if (s.length === 1) {
      ctx.beginPath();
      ctx.arc(s[0].x * GRID, s[0].y * GRID, LINE / 2, 0, Math.PI * 2);
      ctx.fill();
      continue;
    }
    ctx.beginPath();
    ctx.moveTo(s[0].x * GRID, s[0].y * GRID);
    for (let i = 1; i < s.length; i++) ctx.lineTo(s[i].x * GRID, s[i].y * GRID);
    ctx.stroke();
  }
  const data = ctx.getImageData(0, 0, GRID, GRID).data;
  const out = new Float32Array(GRID * GRID);
  for (let i = 0; i < out.length; i++) out[i] = data[i * 4 + 3] / 255;
  return out;
}

/* ---------- phân tích từng nét (thứ tự + hướng) ---------- */
function resample(pts: Pt[], n = 20): Pt[] {
  if (pts.length === 1) return Array.from({ length: n }, () => pts[0]);
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  const total = cum[cum.length - 1];
  if (total < 1e-6) return Array.from({ length: n }, () => pts[0]);
  const out: Pt[] = [];
  let j = 0;
  for (let k = 0; k < n; k++) {
    const target = (total * k) / (n - 1);
    while (j < cum.length - 2 && cum[j + 1] < target) j++;
    const seg = cum[j + 1] - cum[j] || 1;
    const t = clamp((target - cum[j]) / seg, 0, 1);
    out.push({ x: pts[j].x + (pts[j + 1].x - pts[j].x) * t, y: pts[j].y + (pts[j + 1].y - pts[j].y) * t });
  }
  return out;
}
const avgDist = (a: Pt[], b: Pt[]) => a.reduce((s, p, i) => s + Math.hypot(p.x - b[i].x, p.y - b[i].y), 0) / a.length;
const pathLen = (pts: Pt[]) => pts.reduce((s, p, i) => (i ? s + Math.hypot(p.x - pts[i - 1].x, p.y - pts[i - 1].y) : 0), 0);

function analyzeStrokes(user: Pt[][], ref: Pt[][]): StrokeIssue[] {
  const n = Math.min(user.length, ref.length);
  const U = user.map((s) => resample(s));
  const R = ref.map((s) => resample(s));
  const issues: StrokeIssue[] = [];
  for (let i = 0; i < n; i++) {
    const fwd = R.map((r) => avgDist(U[i], r));
    const rev = R.map((r) => avgDist(U[i], [...r].reverse()));
    const cost = fwd.map((f, j) => Math.min(f, rev[j]));
    let best = 0;
    cost.forEach((c, j) => { if (c < cost[best]) best = j; });
    if (cost[i] > SHAPE_BAD) {
      if (best !== i && cost[best] < SHAPE_OK) {
        issues.push({ index: i, kind: "order", message: `Nét ${i + 1} của bạn giống nét ${best + 1} của mẫu — kiểm tra lại thứ tự nét.` });
      } else {
        issues.push({ index: i, kind: "shape", message: `Nét ${i + 1} chưa khớp hình dạng của chữ mẫu.` });
      }
    } else if (pathLen(R[i]) > 0.1 && rev[i] + DIR_MARGIN < fwd[i]) {
      issues.push({ index: i, kind: "direction", message: `Nét ${i + 1} đang viết ngược hướng — hãy làm theo mũi tên.` });
    }
  }
  return issues;
}

/**
 * Chấm điểm bằng TensorFlow.js:
 *  1. Raster nét mẫu (KanjiVG) và nét người viết lên lưới 80x80.
 *  2. Dilate bằng tf.maxPool để tạo vùng dung sai.
 *  3. coverage = nét mẫu nằm trong vùng nét viết;  precision = nét viết nằm trong vùng nét mẫu.
 *  4. F1(coverage, precision) × hệ số số-nét × thứ tự/hướng nét.
 * Đây là so khớp mẫu (template matching) trên tensor, không phải mô hình học sâu.
 */
export async function scoreKana(userStrokes: Pt[][], glyph: GlyphStroke[]): Promise<ScoreResult> {
  const tf = await loadTf();
  const refStrokes = glyph.map((g) => sampleStroke(g));
  const fitted = fit(userStrokes, refStrokes);

  const refData = raster(refStrokes);
  const usrData = raster(fitted);

  const stats = tf.tidy(() => {
    const ref = tf.tensor4d(refData, [1, GRID, GRID, 1]);
    const usr = tf.tensor4d(usrData, [1, GRID, GRID, 1]);
    const dil = (t: ReturnType<typeof tf.tensor4d>) => tf.maxPool(t, [TOL, TOL], [1, 1], "same");
    const coverage = ref.mul(dil(usr)).sum().div(ref.sum().add(1e-6));
    const precision = usr.mul(dil(ref)).sum().div(usr.sum().add(1e-6));
    return tf.stack([coverage, precision]);
  });
  const [coverage, precision] = Array.from(await stats.data());
  const backend = tf.getBackend();
  stats.dispose();

  const f1 = coverage + precision > 0 ? (2 * coverage * precision) / (coverage + precision) : 0;
  const shape = clamp((f1 - 0.4) / 0.45, 0, 1);

  const issues = analyzeStrokes(fitted, refStrokes);
  const n = Math.min(fitted.length, refStrokes.length);
  const bad = issues.filter((i) => i.kind !== "shape").length;
  const orderDir = n ? 1 - bad / n : 0;

  const diff = Math.abs(fitted.length - refStrokes.length);
  const countFactor = diff === 0 ? 1 : Math.max(0.6, 1 - 0.12 * diff);
  if (fitted.length > refStrokes.length) {
    issues.push({ index: -1, kind: "shape", message: `Bạn viết thừa ${diff} nét (chữ này có ${refStrokes.length} nét).` });
  } else if (fitted.length < refStrokes.length) {
    issues.push({ index: -1, kind: "shape", message: `Bạn còn thiếu ${diff} nét (chữ này có ${refStrokes.length} nét).` });
  }

  const score = Math.round(100 * (0.7 * shape + 0.3 * orderDir) * countFactor);
  return {
    score,
    passed: score >= PASS_SCORE,
    coverage: Math.round(coverage * 100),
    precision: Math.round(precision * 100),
    expected: refStrokes.length,
    got: fitted.length,
    issues,
    backend,
  };
}
