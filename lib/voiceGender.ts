/**
 * Đoán giới tính của giọng đọc theo tên. Web Speech API không có trường giới tính,
 * nên đây là heuristic. Dùng chung cho Sensei và navbar để hai nơi hiển thị giống nhau.
 */
export type VoiceGuess = "female" | "male" | "unknown";

// Tên giọng tiếng Nhật phổ biến trên macOS/iOS, Windows/Edge, Chrome, Android.
const FEMALE_RE =
  /\b(kyoko|haruka|ayumi|sayaka|nanami|mizuki|shiori|aoi|kazuha|tomoka|mayu|asuka|akane|sakura|hana|yui|rin|o-ren|oren|female|女性|nữ)\b|\b(voice\s*2|female|nữ)\b|google\s*(日本語|japanese)|ja-jp-(standard-[ab]|wavenet-[ab]|neural2-b)/i;

const MALE_RE =
  /\b(otoya|hattori|ichiro|keita|takumi|naoki|daichi|kenji|hiroshi|taro|kazuki|masahiro|osamu|kenta|sho|shin|ryo|daiki|sota|taichi|yuto|kazuya|tomoya|nobu|male|男性|nam)\b|\b(voice\s*1|male|nam)\b|ja-jp-(standard-[cd]|wavenet-[cd]|neural2-[cd])/i;

export function guessVoiceGender(name: string): VoiceGuess {
  // "female" chứa "male": kiểm tra nữ trước.
  if (FEMALE_RE.test(name)) return "female";
  if (MALE_RE.test(name)) return "male";
  return "unknown";
}

export function voiceGenderLabel(g: VoiceGuess): string {
  return g === "female" ? "nữ" : g === "male" ? "nam" : "chưa rõ";
}
