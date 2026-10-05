export interface SenseiMessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
  furigana?: string;
  meaning?: string;
  createdAt: string;
}

/** Trạng thái hiển thị của Sensei, suy ra từ state đã có ở SenseiKaiwaClient. */
export type SenseiMood = "idle" | "listening" | "thinking" | "speaking" | "happy";

export type SenseiTab = "KAIWA" | "DUNGEON";
