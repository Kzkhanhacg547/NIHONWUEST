/**
 * Đoán giới tính của giọng đọc theo tên. Web Speech API không có trường giới tính,
 * nên đây là heuristic. Dùng chung cho Sensei và navbar để hai nơi hiển thị giống nhau.
 */
export type VoiceGuess = "female" | "male" | "unknown";

// Tên giọng tiếng Nhật phổ biến trên macOS/iOS, Windows/Edge, Chrome.
const FEMALE_RE = /kyoko|o-?ren|haruka|ayumi|sayaka|nanami|mizuki|shiori|aoi|female|女性|google\s*(日本語|japanese)/i;
const MALE_RE = /otoya|hattori|ichiro|keita|takumi|naoki|daichi|kenji|hiroshi|male|男性/i;

export function guessVoiceGender(name: string): VoiceGuess {
  // "female" chứa "male": kiểm tra nữ trước.
  if (FEMALE_RE.test(name)) return "female";
  if (MALE_RE.test(name)) return "male";
  return "unknown";
}

export function voiceGenderLabel(g: VoiceGuess): string {
  return g === "female" ? "nữ" : g === "male" ? "nam" : "chưa rõ";
}
