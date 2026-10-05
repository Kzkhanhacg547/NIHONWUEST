export type SenseiCharacterId = "aoi" | "ren";
export type SenseiGender = "female" | "male";

export interface SenseiCharacter {
  id: SenseiCharacterId;
  gender: SenseiGender;
  nameJa: string;
  nameRomaji: string;
  /** Chữ trên con dấu hanko cạnh tin nhắn. */
  seal: string;
  /** Cách Sensei tự xưng trong lời thoại tiếng Việt. */
  viRef: "cô" | "thầy";
  genderLabel: string;
  greeting: { ja: string; reading: string; vi: string };
  voice: {
    /** Pitch khi có giọng đúng giới tính. */
    pitch: number;
    /** Pitch bù khi thiết bị không có giọng đúng giới tính (hạ/nâng tông giọng sẵn có). */
    fallbackPitch: number;
    // Tốc độ đọc lấy từ cài đặt âm thanh chung (nút loa trên navbar), không đặt riêng ở đây.
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
    viRef: "cô",
    genderLabel: "Nữ",
    greeting: {
      ja: "こんにちは、葵です。よろしくお願いします。",
      reading: "こんにちは、あおいです。よろしくおねがいします。",
      vi: "Xin chào, cô là Aoi. Rất mong được giúp em.",
    },
    voice: { pitch: 1.05, fallbackPitch: 1.15 },
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
    viRef: "thầy",
    genderLabel: "Nam",
    greeting: {
      ja: "こんにちは、蓮です。よろしくお願いします。",
      reading: "こんにちは、れんです。よろしくおねがいします。",
      vi: "Xin chào, thầy là Ren. Rất mong được giúp em.",
    },
    voice: { pitch: 0.85, fallbackPitch: 0.58 },
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
