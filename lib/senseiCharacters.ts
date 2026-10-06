export type SenseiCharacterId = "aoi" | "ren";
export type SenseiGender = "female" | "male";

/**
 * Dữ liệu dựng avatar chuyển động từ ảnh gốc 1264×1264.
 * Mọi toạ độ tính theo pixel của ảnh gốc → thay ảnh khác chỉ cần đo lại các số này.
 */
export interface SenseiArt {
  /** Ảnh nền trong public/ (webp). */
  src: string;
  /** Cạnh ảnh gốc (px). */
  size: number;
  /** Vùng cắt hiển thị: [x, y, rộng, cao]. Mặt nên nằm ở ~1/3 phía trên. */
  viewBox: [number, number, number, number];
  /** Độ nghiêng đầu (độ) — mắt/miệng xoay theo. */
  tilt: number;
  /** [mắt trái, mắt phải] theo hướng nhìn của người xem. */
  eyes: [Eye, Eye];
  mouth: { cx: number; cy: number; w: number; h: number };
  /** Màu da lấy mẫu từ ảnh để che mắt/miệng gốc khi hoạt hình. */
  skin: { eyes: [string, string]; mouth: string };
  /** Màu viền môi + khoang miệng. */
  lip: { line: string; inner: string; tongue: string };
  blush: { cx: number; cy: number; rx: number; ry: number }[];
  /** Tâm của hiệu ứng thở/đung đưa (thường là đáy ảnh, giữa người). */
  pivot: [number, number];
  /** Vị trí hiệu ứng lấp lánh/mồ hôi/dấu hỏi quanh đầu. */
  fx: { x: number; y: number };
}
export interface Eye {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

export interface SenseiCharacter {
  id: SenseiCharacterId;
  gender: SenseiGender;
  nameJa: string;
  nameRomaji: string;
  /** Chữ trên con dấu hanko cạnh tin nhắn. */
  seal: string;
  /** Ảnh chân dung tròn (vd. "/sensei/aoi.png" đặt trong public/). Bỏ trống → dùng con dấu hanko. */
  portrait?: string;
  /** Dữ liệu avatar chuyển động từ ảnh. Thiếu → SenseiAvatar tự hiện chân dung tĩnh. */
  art?: SenseiArt;
  /** Cách Sensei tự xưng trong lời thoại tiếng Việt. */
  viRef: "cô" | "thầy";
  genderLabel: string;
  greeting: { ja: string; reading: string; vi: string };
  voice: {
    /** Pitch khi có giọng đúng giới tính. */
    pitch: number;
    /** Pitch bù khi thiết bị không có giọng đúng giới tính (hạ/nâng tông giọng sẵn có). */
    fallbackPitch: number;
    rate: number;
  };
  palette: {
    hair: [string, string, string];
    skin: [string, string];
    neck: [string, string];
    blazer: [string, string];
    lapel: [string, string];
    accent: string;
    accentDark: string;
  };
}

export const SENSEI_CHARACTERS: Record<SenseiCharacterId, SenseiCharacter> = {
  aoi: {
    id: "aoi",
    gender: "female",
    nameJa: "葵先生",
    nameRomaji: "Aoi Sensei",
    seal: "葵",
    portrait: "/sensei/aoi-portrait.webp",
    art: {
      src: "/sensei/aoi.webp",
      size: 1264,
      viewBox: [170, 120, 900, 820],
      tilt: -15,
      eyes: [
        { cx: 548, cy: 316, rx: 36, ry: 17 },
        { cx: 657, cy: 282, rx: 33, ry: 16 },
      ],
      mouth: { cx: 619, cy: 380, w: 60, h: 25 },
      skin: { eyes: ["#ecc0b2", "#e8b8aa"], mouth: "#e8c6b6" },
      lip: { line: "#c4586a", inner: "#6e2234", tongue: "#e5788a" },
      blush: [
        { cx: 520, cy: 345, rx: 30, ry: 12 },
        { cx: 700, cy: 318, rx: 26, ry: 11 },
      ],
      pivot: [640, 1264],
      fx: { x: 640, y: 150 },
    },
    viRef: "cô",
    genderLabel: "Nữ",
    greeting: {
      ja: "こんにちは、葵です。よろしくお願いします。",
      reading: "こんにちは、あおいです。よろしくおねがいします。",
      vi: "Xin chào, cô là Aoi. Rất mong được giúp em.",
    },
    voice: { pitch: 1.05, fallbackPitch: 1.15, rate: 0.95 },
    palette: {
      hair: ["#3a3350", "#262238", "#15121f"],
      skin: ["#fff3ee", "#ffe2dc"],
      neck: ["#f2c3c0", "#ffe2dc"],
      blazer: ["#2b3550", "#1a2136"],
      lapel: ["#3a4666", "#242d47"],
      accent: "#dc2626",
      accentDark: "#b91c1c",
    },
  },
  ren: {
    id: "ren",
    gender: "male",
    nameJa: "蓮先生",
    nameRomaji: "Ren Sensei",
    seal: "蓮",
    portrait: "/sensei/ren-portrait.webp",
    art: {
      src: "/sensei/ren.webp",
      size: 1264,
      viewBox: [190, 80, 900, 820],
      tilt: -13,
      eyes: [
        { cx: 572, cy: 268, rx: 29, ry: 14 },
        { cx: 680, cy: 243, rx: 27, ry: 13 },
      ],
      mouth: { cx: 645, cy: 337, w: 66, h: 25 },
      skin: { eyes: ["#e2bca6", "#dcb39d"], mouth: "#d9b5a0" },
      lip: { line: "#b0606a", inner: "#5e1f2e", tongue: "#d9707f" },
      blush: [
        { cx: 600, cy: 310, rx: 28, ry: 11 },
        { cx: 715, cy: 285, rx: 24, ry: 10 },
      ],
      pivot: [640, 1264],
      fx: { x: 650, y: 120 },
    },
    viRef: "thầy",
    genderLabel: "Nam",
    greeting: {
      ja: "こんにちは、蓮です。よろしくお願いします。",
      reading: "こんにちは、れんです。よろしくおねがいします。",
      vi: "Xin chào, thầy là Ren. Rất mong được giúp em.",
    },
    voice: { pitch: 0.88, fallbackPitch: 0.62, rate: 0.92 },
    palette: {
      hair: ["#2f3a4a", "#1f2733", "#11161f"],
      skin: ["#fbe9df", "#f6d5c6"],
      neck: ["#e8b9a6", "#f6d5c6"],
      blazer: ["#3a3f4b", "#23272f"],
      lapel: ["#4a5060", "#2c313c"],
      accent: "#b91c1c",
      accentDark: "#7f1d1d",
    },
  },
};

export const DEFAULT_SENSEI_ID: SenseiCharacterId = "aoi";