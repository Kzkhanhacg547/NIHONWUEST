export interface SeedDakuten {
  character: string;
  romaji: string;
  ipa: string;
  row: string;
  column: string;
  kind: "DAKUTEN" | "HANDAKUTEN" | "COMBO";
  script: "HIRAGANA" | "KATAKANA";
}

export const DAKUTEN: SeedDakuten[] = [
  // HIRAGANA DAKUTEN
  // Ga
  { character: "が", romaji: "ga", ipa: "ɡa", row: "ga", column: "a", kind: "DAKUTEN", script: "HIRAGANA" },
  { character: "ぎ", romaji: "gi", ipa: "ɡʲi", row: "ga", column: "i", kind: "DAKUTEN", script: "HIRAGANA" },
  { character: "ぐ", romaji: "gu", ipa: "ɡɯ", row: "ga", column: "u", kind: "DAKUTEN", script: "HIRAGANA" },
  { character: "げ", romaji: "ge", ipa: "ɡe", row: "ga", column: "e", kind: "DAKUTEN", script: "HIRAGANA" },
  { character: "ご", romaji: "go", ipa: "ɡo", row: "ga", column: "o", kind: "DAKUTEN", script: "HIRAGANA" },

  // Za
  { character: "ざ", romaji: "za", ipa: "za", row: "za", column: "a", kind: "DAKUTEN", script: "HIRAGANA" },
  { character: "じ", romaji: "ji", ipa: "dʑi", row: "za", column: "i", kind: "DAKUTEN", script: "HIRAGANA" },
  { character: "ず", romaji: "zu", ipa: "zɯ", row: "za", column: "u", kind: "DAKUTEN", script: "HIRAGANA" },
  { character: "ぜ", romaji: "ze", ipa: "ze", row: "za", column: "e", kind: "DAKUTEN", script: "HIRAGANA" },
  { character: "ぞ", romaji: "zo", ipa: "zo", row: "za", column: "o", kind: "DAKUTEN", script: "HIRAGANA" },

  // Da
  { character: "だ", romaji: "da", ipa: "da", row: "da", column: "a", kind: "DAKUTEN", script: "HIRAGANA" },
  { character: "ぢ", romaji: "ji", ipa: "dʑi", row: "da", column: "i", kind: "DAKUTEN", script: "HIRAGANA" },
  { character: "づ", romaji: "zu", ipa: "zɯ", row: "da", column: "u", kind: "DAKUTEN", script: "HIRAGANA" },
  { character: "で", romaji: "de", ipa: "de", row: "da", column: "e", kind: "DAKUTEN", script: "HIRAGANA" },
  { character: "ど", romaji: "do", ipa: "do", row: "da", column: "o", kind: "DAKUTEN", script: "HIRAGANA" },

  // Ba
  { character: "ば", romaji: "ba", ipa: "ba", row: "ba", column: "a", kind: "DAKUTEN", script: "HIRAGANA" },
  { character: "び", romaji: "bi", ipa: "bʲi", row: "ba", column: "i", kind: "DAKUTEN", script: "HIRAGANA" },
  { character: "ぶ", romaji: "bu", ipa: "bɯ", row: "ba", column: "u", kind: "DAKUTEN", script: "HIRAGANA" },
  { character: "べ", romaji: "be", ipa: "be", row: "ba", column: "e", kind: "DAKUTEN", script: "HIRAGANA" },
  { character: "ぼ", romaji: "bo", ipa: "bo", row: "ba", column: "o", kind: "DAKUTEN", script: "HIRAGANA" },

  // Pa (Handakuten)
  { character: "ぱ", romaji: "pa", ipa: "pa", row: "pa", column: "a", kind: "HANDAKUTEN", script: "HIRAGANA" },
  { character: "ぴ", romaji: "pi", ipa: "pʲi", row: "pa", column: "i", kind: "HANDAKUTEN", script: "HIRAGANA" },
  { character: "ぷ", romaji: "pu", ipa: "pɯ", row: "pa", column: "u", kind: "HANDAKUTEN", script: "HIRAGANA" },
  { character: "ぺ", romaji: "pe", ipa: "pe", row: "pa", column: "e", kind: "HANDAKUTEN", script: "HIRAGANA" },
  { character: "ぽ", romaji: "po", ipa: "po", row: "pa", column: "o", kind: "HANDAKUTEN", script: "HIRAGANA" },

  // KATAKANA DAKUTEN
  // Ga
  { character: "ガ", romaji: "ga", ipa: "ɡa", row: "ga", column: "a", kind: "DAKUTEN", script: "KATAKANA" },
  { character: "ギ", romaji: "gi", ipa: "ɡʲi", row: "ga", column: "i", kind: "DAKUTEN", script: "KATAKANA" },
  { character: "グ", romaji: "gu", ipa: "ɡɯ", row: "ga", column: "u", kind: "DAKUTEN", script: "KATAKANA" },
  { character: "ゲ", romaji: "ge", ipa: "ɡe", row: "ga", column: "e", kind: "DAKUTEN", script: "KATAKANA" },
  { character: "ゴ", romaji: "go", ipa: "ɡo", row: "ga", column: "o", kind: "DAKUTEN", script: "KATAKANA" },

  // Za
  { character: "ザ", romaji: "za", ipa: "za", row: "za", column: "a", kind: "DAKUTEN", script: "KATAKANA" },
  { character: "ジ", romaji: "ji", ipa: "dʑi", row: "za", column: "i", kind: "DAKUTEN", script: "KATAKANA" },
  { character: "ズ", romaji: "zu", ipa: "zɯ", row: "za", column: "u", kind: "DAKUTEN", script: "KATAKANA" },
  { character: "ゼ", romaji: "ze", ipa: "ze", row: "za", column: "e", kind: "DAKUTEN", script: "KATAKANA" },
  { character: "ゾ", romaji: "zo", ipa: "zo", row: "za", column: "o", kind: "DAKUTEN", script: "KATAKANA" },

  // Da
  { character: "ダ", romaji: "da", ipa: "da", row: "da", column: "a", kind: "DAKUTEN", script: "KATAKANA" },
  { character: "ヂ", romaji: "ji", ipa: "dʑi", row: "da", column: "i", kind: "DAKUTEN", script: "KATAKANA" },
  { character: "ヅ", romaji: "zu", ipa: "zɯ", row: "da", column: "u", kind: "DAKUTEN", script: "KATAKANA" },
  { character: "デ", romaji: "de", ipa: "de", row: "da", column: "e", kind: "DAKUTEN", script: "KATAKANA" },
  { character: "ド", romaji: "do", ipa: "do", row: "da", column: "o", kind: "DAKUTEN", script: "KATAKANA" },

  // Ba
  { character: "バ", romaji: "ba", ipa: "ba", row: "ba", column: "a", kind: "DAKUTEN", script: "KATAKANA" },
  { character: "ビ", romaji: "bi", ipa: "bʲi", row: "ba", column: "i", kind: "DAKUTEN", script: "KATAKANA" },
  { character: "ブ", romaji: "bu", ipa: "bɯ", row: "ba", column: "u", kind: "DAKUTEN", script: "KATAKANA" },
  { character: "ベ", romaji: "be", ipa: "be", row: "ba", column: "e", kind: "DAKUTEN", script: "KATAKANA" },
  { character: "ボ", romaji: "bo", ipa: "bo", row: "ba", column: "o", kind: "DAKUTEN", script: "KATAKANA" },

  // Pa (Handakuten)
  { character: "パ", romaji: "pa", ipa: "pa", row: "pa", column: "a", kind: "HANDAKUTEN", script: "KATAKANA" },
  { character: "ピ", romaji: "pi", ipa: "pʲi", row: "pa", column: "i", kind: "HANDAKUTEN", script: "KATAKANA" },
  { character: "プ", romaji: "pu", ipa: "pɯ", row: "pa", column: "u", kind: "HANDAKUTEN", script: "KATAKANA" },
  { character: "ペ", romaji: "pe", ipa: "pe", row: "pa", column: "e", kind: "HANDAKUTEN", script: "KATAKANA" },
  { character: "ポ", romaji: "po", ipa: "po", row: "pa", column: "o", kind: "HANDAKUTEN", script: "KATAKANA" },

  // YŌON COMBINATION SOUNDS (HIRAGANA)
  { character: "きゃ", romaji: "kya", ipa: "kʲa", row: "kya", column: "a", kind: "COMBO", script: "HIRAGANA" },
  { character: "きゅ", romaji: "kyu", ipa: "kʲɯ", row: "kya", column: "u", kind: "COMBO", script: "HIRAGANA" },
  { character: "きょ", romaji: "kyo", ipa: "kʲo", row: "kya", column: "o", kind: "COMBO", script: "HIRAGANA" },

  { character: "しゃ", romaji: "sha", ipa: "ɕa", row: "sha", column: "a", kind: "COMBO", script: "HIRAGANA" },
  { character: "しゅ", romaji: "shu", ipa: "ɕɯ", row: "sha", column: "u", kind: "COMBO", script: "HIRAGANA" },
  { character: "しょ", romaji: "sho", ipa: "ɕo", row: "sha", column: "o", kind: "COMBO", script: "HIRAGANA" },

  { character: "ちゃ", romaji: "cha", ipa: "tɕa", row: "cha", column: "a", kind: "COMBO", script: "HIRAGANA" },
  { character: "ちゅ", romaji: "chu", ipa: "tɕɯ", row: "cha", column: "u", kind: "COMBO", script: "HIRAGANA" },
  { character: "ちょ", romaji: "cho", ipa: "tɕo", row: "cha", column: "o", kind: "COMBO", script: "HIRAGANA" },

  { character: "にゃ", romaji: "nya", ipa: "ɲa", row: "nya", column: "a", kind: "COMBO", script: "HIRAGANA" },
  { character: "にゅ", romaji: "nyu", ipa: "ɲɯ", row: "nya", column: "u", kind: "COMBO", script: "HIRAGANA" },
  { character: "にょ", romaji: "nyo", ipa: "ɲo", row: "nya", column: "o", kind: "COMBO", script: "HIRAGANA" },

  { character: "ひゃ", romaji: "hya", ipa: "ça", row: "hya", column: "a", kind: "COMBO", script: "HIRAGANA" },
  { character: "ひゅ", romaji: "hyu", ipa: "çɯ", row: "hya", column: "u", kind: "COMBO", script: "HIRAGANA" },
  { character: "ひょ", romaji: "hyo", ipa: "ço", row: "hya", column: "o", kind: "COMBO", script: "HIRAGANA" },

  { character: "みゃ", romaji: "mya", ipa: "mʲa", row: "mya", column: "a", kind: "COMBO", script: "HIRAGANA" },
  { character: "みゅ", romaji: "myu", ipa: "mʲɯ", row: "mya", column: "u", kind: "COMBO", script: "HIRAGANA" },
  { character: "みょ", romaji: "myo", ipa: "mʲo", row: "mya", column: "o", kind: "COMBO", script: "HIRAGANA" },

  { character: "りゃ", romaji: "rya", ipa: "ɾʲa", row: "rya", column: "a", kind: "COMBO", script: "HIRAGANA" },
  { character: "りゅ", romaji: "ryu", ipa: "ɾʲɯ", row: "rya", column: "u", kind: "COMBO", script: "HIRAGANA" },
  { character: "りょ", romaji: "ryo", ipa: "ɾʲo", row: "rya", column: "o", kind: "COMBO", script: "HIRAGANA" },

  { character: "ぎゃ", romaji: "gya", ipa: "ɡʲa", row: "gya", column: "a", kind: "COMBO", script: "HIRAGANA" },
  { character: "ぎゅ", romaji: "gyu", ipa: "ɡʲɯ", row: "gya", column: "u", kind: "COMBO", script: "HIRAGANA" },
  { character: "ぎょ", romaji: "gyo", ipa: "ɡʲo", row: "gya", column: "o", kind: "COMBO", script: "HIRAGANA" },

  { character: "じゃ", romaji: "ja", ipa: "dʑa", row: "ja", column: "a", kind: "COMBO", script: "HIRAGANA" },
  { character: "じゅ", romaji: "ju", ipa: "dʑɯ", row: "ja", column: "u", kind: "COMBO", script: "HIRAGANA" },
  { character: "じょ", romaji: "jo", ipa: "dʑo", row: "ja", column: "o", kind: "COMBO", script: "HIRAGANA" },

  { character: "びゃ", romaji: "bya", ipa: "bʲa", row: "bya", column: "a", kind: "COMBO", script: "HIRAGANA" },
  { character: "びゅ", romaji: "byu", ipa: "bʲɯ", row: "bya", column: "u", kind: "COMBO", script: "HIRAGANA" },
  { character: "びょ", romaji: "byo", ipa: "bʲo", row: "bya", column: "o", kind: "COMBO", script: "HIRAGANA" },

  { character: "ぴゃ", romaji: "pya", ipa: "pʲa", row: "pya", column: "a", kind: "COMBO", script: "HIRAGANA" },
  { character: "ぴゅ", romaji: "pyu", ipa: "pʲɯ", row: "pya", column: "u", kind: "COMBO", script: "HIRAGANA" },
  { character: "ぴょ", romaji: "pyo", ipa: "pʲo", row: "pya", column: "o", kind: "COMBO", script: "HIRAGANA" },
];
