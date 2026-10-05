/**
 * Lip-sync theo mora cho tiếng Nhật. Thuần hàm, không phụ thuộc React/DOM.
 *
 * Tiếng Nhật gần như đồng nhịp theo mora (mỗi kana ≈ 1 nhịp), nên có thể dựng
 * timeline khẩu hình từ chữ: nguyên âm của mỗi kana quyết định hình miệng,
 * ん/っ/dấu câu thì ngậm miệng, ー kéo dài nguyên âm trước, âm môi
 * (ま・ば・ぱ…) ngậm miệng ngắn trước khi mở.
 */
export type Viseme = "closed" | "a" | "i" | "u" | "e" | "o";

export interface Mora {
  v: Viseme;
  /** Độ dài tương đối (1 = một mora thường). */
  w: number;
  /** Âm môi: miệng ngậm ở đầu mora. */
  lip: boolean;
}

export interface Timeline {
  moras: Mora[];
  /** Mốc bắt đầu (đơn vị trọng số) của từng mora. */
  starts: number[];
  total: number;
  /** Trọng số tại đầu mỗi ký tự của chuỗi nguồn (để neo theo onboundary). */
  charStart: number[];
  /** true nếu timeline dựng từ cách đọc kana (độ chính xác cao hơn kanji). */
  fromReading: boolean;
}

const ROWS: Array<[Viseme, string]> = [
  ["a", "あかさたなはまやらわがざだばぱぁゃゎ"],
  ["i", "いきしちにひみりぎじぢびぴぃ"],
  ["u", "うくすつぬふむゆるぐずづぶぷぅゅゔ"],
  ["e", "えけせてねへめれげぜでべぺぇ"],
  ["o", "おこそとのほもよろをごぞどぼぽぉょ"],
];
const ROW_OF = new Map<string, Viseme>();
for (const [v, chars] of ROWS) for (const c of chars) ROW_OF.set(c, v);

const LIP = new Set("まみむめもばびぶべぼぱぴぷぺぽ");
const SMALL = new Map<string, Viseme>([
  ["ゃ", "a"], ["ゅ", "u"], ["ょ", "o"],
  ["ぁ", "a"], ["ぃ", "i"], ["ぅ", "u"], ["ぇ", "e"], ["ぉ", "o"], ["ゎ", "a"],
]);
const PSEUDO: Viseme[] = ["a", "o", "i", "u", "e"];

const toHira = (c: string) => {
  const code = c.charCodeAt(0);
  return code >= 0x30a1 && code <= 0x30f6 ? String.fromCharCode(code - 0x60) : c;
};
const isKanji = (c: string) => /[\u4e00-\u9fff々〆]/.test(c);

export function buildTimeline(text: string, reading?: string): Timeline {
  const useReading = !!reading && /[\u3040-\u30ff]/.test(reading);
  const src = useReading ? (reading as string) : text;

  const moras: Mora[] = [];
  const charStart: number[] = [];
  let weight = 0;
  const push = (m: Mora) => {
    moras.push(m);
    weight += m.w;
  };

  const chars = Array.from(src);
  chars.forEach((raw) => {
    charStart.push(weight);
    const c = toHira(raw);
    const prev = moras[moras.length - 1];

    if (SMALL.has(c) && prev && prev.v !== "closed") {
      prev.v = SMALL.get(c)!;
      prev.lip = false;
    } else if (ROW_OF.has(c)) {
      push({ v: ROW_OF.get(c)!, w: 1, lip: LIP.has(c) });
    } else if (c === "ん") {
      push({ v: "closed", w: 1, lip: false });
    } else if (c === "っ") {
      push({ v: "closed", w: 0.7, lip: false });
    } else if (c === "ー") {
      let last: Viseme = "a";
      for (let i = moras.length - 1; i >= 0; i--) {
        if (moras[i].v !== "closed") {
          last = moras[i].v;
          break;
        }
      }
      push({ v: last, w: 1, lip: false });
    } else if (/[、，,]/.test(c)) {
      push({ v: "closed", w: 1.2, lip: false });
    } else if (/[。！？!?．.\n]/.test(c)) {
      push({ v: "closed", w: 2.2, lip: false });
    } else if (c === "…" || c === "　") {
      push({ v: "closed", w: 1.2, lip: false });
    } else if (isKanji(raw) || /[0-9０-９]/.test(raw)) {
      // Không biết cách đọc: mỗi chữ ≈ 2 mora, nguyên âm suy ra ổn định từ mã ký tự
      // (cùng chữ → cùng khẩu hình, nhìn tự nhiên hơn ngẫu nhiên).
      const code = raw.charCodeAt(0);
      push({ v: PSEUDO[code % 5], w: 1, lip: false });
      push({ v: PSEUDO[(code >> 2) % 5], w: 1, lip: false });
    }
    // Khoảng trắng, chữ Latin, ký hiệu khác: bỏ qua.
  });

  const starts: number[] = [];
  let acc = 0;
  for (const m of moras) {
    starts.push(acc);
    acc += m.w;
  }
  return { moras, starts, total: acc, charStart, fromReading: useReading };
}

/** Khẩu hình tại vị trí `pos` (đơn vị trọng số) trên timeline. */
export function visemeAt(tl: Timeline, pos: number): Viseme {
  const n = tl.moras.length;
  if (!n || pos < 0) return "closed";
  if (pos >= tl.total) {
    // Âm thanh dài hơn ước lượng: lặp nhẹ các mora cuối thay vì đứng yên.
    const tail = Math.min(8, n);
    const i = n - tail + (Math.floor(pos - tl.total) % tail);
    return tl.moras[i].v;
  }
  let lo = 0;
  let hi = n - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (tl.starts[mid] <= pos) lo = mid;
    else hi = mid - 1;
  }
  const m = tl.moras[lo];
  if (m.v === "closed") return "closed";
  const phase = (pos - tl.starts[lo]) / m.w;
  if (m.lip && phase < 0.35) return "closed";
  return m.v;
}

/** Trọng số tại ký tự `charIndex` của văn bản gốc (dùng để neo theo onboundary). */
export function weightAtChar(tl: Timeline, charIndex: number, textLength: number): number {
  if (tl.fromReading) {
    // Chuỗi kana khác chuỗi đọc: neo theo tỉ lệ.
    return textLength > 0 ? (Math.min(charIndex, textLength) / textLength) * tl.total : 0;
  }
  const i = Math.max(0, Math.min(charIndex, tl.charStart.length - 1));
  return tl.charStart[i] ?? 0;
}

/** Tách văn bản theo câu (giữ dấu kết câu) để mỗi câu là một utterance riêng. */
export function splitSentences(text: string): string[] {
  const out = text.match(/[^。！？!?\n]+[。！？!?]*|[。！？!?]+/g) ?? [];
  return out.map((s) => s.trim()).filter(Boolean);
}
