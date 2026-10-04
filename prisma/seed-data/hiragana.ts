export interface SeedKana {
  character: string;
  romaji: string;
  ipa: string;
  row: string;
  column: string;
  kind: string;
}

export const HIRAGANA_BASIC: SeedKana[] = [
  // Hàng A
  { character: "あ", romaji: "a", ipa: "a", row: "a", column: "a", kind: "BASIC" },
  { character: "い", romaji: "i", ipa: "i", row: "a", column: "i", kind: "BASIC" },
  { character: "う", romaji: "u", ipa: "ɯ", row: "a", column: "u", kind: "BASIC" },
  { character: "え", romaji: "e", ipa: "e", row: "a", column: "e", kind: "BASIC" },
  { character: "お", romaji: "o", ipa: "o", row: "a", column: "o", kind: "BASIC" },

  // Hàng Ka
  { character: "か", romaji: "ka", ipa: "ka", row: "ka", column: "a", kind: "BASIC" },
  { character: "き", romaji: "ki", ipa: "kʲi", row: "ka", column: "i", kind: "BASIC" },
  { character: "く", romaji: "ku", ipa: "kɯ", row: "ka", column: "u", kind: "BASIC" },
  { character: "け", romaji: "ke", ipa: "ke", row: "ka", column: "e", kind: "BASIC" },
  { character: "こ", romaji: "ko", ipa: "ko", row: "ka", column: "o", kind: "BASIC" },

  // Hàng Sa
  { character: "さ", romaji: "sa", ipa: "sa", row: "sa", column: "a", kind: "BASIC" },
  { character: "し", romaji: "shi", ipa: "ɕi", row: "sa", column: "i", kind: "BASIC" },
  { character: "す", romaji: "su", ipa: "sɯ", row: "sa", column: "u", kind: "BASIC" },
  { character: "せ", romaji: "se", ipa: "se", row: "sa", column: "e", kind: "BASIC" },
  { character: "そ", romaji: "so", ipa: "so", row: "sa", column: "o", kind: "BASIC" },

  // Hàng Ta
  { character: "た", romaji: "ta", ipa: "ta", row: "ta", column: "a", kind: "BASIC" },
  { character: "ち", romaji: "chi", ipa: "tɕi", row: "ta", column: "i", kind: "BASIC" },
  { character: "つ", romaji: "tsu", ipa: "tsɯ", row: "ta", column: "u", kind: "BASIC" },
  { character: "て", romaji: "te", ipa: "te", row: "ta", column: "e", kind: "BASIC" },
  { character: "と", romaji: "to", ipa: "to", row: "ta", column: "o", kind: "BASIC" },

  // Hàng Na
  { character: "な", romaji: "na", ipa: "na", row: "na", column: "a", kind: "BASIC" },
  { character: "に", romaji: "ni", ipa: "ɲi", row: "na", column: "i", kind: "BASIC" },
  { character: "ぬ", romaji: "nu", ipa: "nɯ", row: "na", column: "u", kind: "BASIC" },
  { character: "ね", romaji: "ne", ipa: "ne", row: "na", column: "e", kind: "BASIC" },
  { character: "の", romaji: "no", ipa: "no", row: "na", column: "o", kind: "BASIC" },

  // Hàng Ha
  { character: "は", romaji: "ha", ipa: "ha", row: "ha", column: "a", kind: "BASIC" },
  { character: "ひ", romaji: "hi", ipa: "çi", row: "ha", column: "i", kind: "BASIC" },
  { character: "ふ", romaji: "fu", ipa: "ɸɯ", row: "ha", column: "u", kind: "BASIC" },
  { character: "へ", romaji: "he", ipa: "he", row: "ha", column: "e", kind: "BASIC" },
  { character: "ほ", romaji: "ho", ipa: "ho", row: "ha", column: "o", kind: "BASIC" },

  // Hàng Ma
  { character: "ま", romaji: "ma", ipa: "ma", row: "ma", column: "a", kind: "BASIC" },
  { character: "み", romaji: "mi", ipa: "mʲi", row: "ma", column: "i", kind: "BASIC" },
  { character: "む", romaji: "mu", ipa: "mɯ", row: "ma", column: "u", kind: "BASIC" },
  { character: "め", romaji: "me", ipa: "me", row: "ma", column: "e", kind: "BASIC" },
  { character: "も", romaji: "mo", ipa: "mo", row: "ma", column: "o", kind: "BASIC" },

  // Hàng Ya
  { character: "や", romaji: "ya", ipa: "ja", row: "ya", column: "a", kind: "BASIC" },
  { character: "ゆ", romaji: "yu", ipa: "jɯ", row: "ya", column: "u", kind: "BASIC" },
  { character: "よ", romaji: "yo", ipa: "jo", row: "ya", column: "o", kind: "BASIC" },

  // Hàng Ra
  { character: "ら", romaji: "ra", ipa: "ɾa", row: "ra", column: "a", kind: "BASIC" },
  { character: "り", romaji: "ri", ipa: "ɾʲi", row: "ra", column: "i", kind: "BASIC" },
  { character: "る", romaji: "ru", ipa: "ɾɯ", row: "ra", column: "u", kind: "BASIC" },
  { character: "れ", romaji: "re", ipa: "ɾe", row: "ra", column: "e", kind: "BASIC" },
  { character: "ろ", romaji: "ro", ipa: "ɾo", row: "ra", column: "o", kind: "BASIC" },

  // Hàng Wa & N
  { character: "わ", romaji: "wa", ipa: "wa", row: "wa", column: "a", kind: "BASIC" },
  { character: "を", romaji: "wo", ipa: "o", row: "wa", column: "o", kind: "BASIC" },
  { character: "ん", romaji: "n", ipa: "ɴ", row: "n", column: "n", kind: "BASIC" },
];
