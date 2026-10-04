export interface EnrichedReviewItem {
  id: string;
  contentType: string;
  contentId: string;
  title: string;
  subtitle: string;
  reading: string;
  /** Romaji bridge for the Japanese text. Previously never populated. */
  romaji: string;
  extra: string;
  /** Actual JLPT level of the underlying content, e.g. "N3". */
  level: string;
  interval: number;
  repetitions: number;
  ease: number;
}

// Minimal types matching Prisma models to avoid importing heavy generic Prisma types
type ReviewItem = {
  id: string;
  contentType: string;
  contentId: string;
  interval: number;
  repetitions: number;
  ease: number;
};

export type ContentMaps = {
  kanaMap: Map<string, { character: string; script: string; romaji: string; ipa: string | null }>;
  vocabMap: Map<string, { word: string; kana: string; romaji: string; meaning: string; partOfSpeech: string; jlptLevel: string }>;
  kanjiMap: Map<string, { character: string; meaning: string; jlptLevel: string; readings: { reading: string }[] }>;
  grammarMap: Map<string, { title: string; meaning: string; structure: string; level: string }>;
  exerciseMap: Map<string, { question: string; correctAnswer: string; prompt: string | null; level: string }>;
};

/**
 * Resolves raw ReviewItems into EnrichedReviewItems.
 * Filters out any orphan items where the underlying content no longer exists.
 */
export function resolveReviewItems(items: ReviewItem[], maps: ContentMaps): EnrichedReviewItem[] {
  const { kanaMap, vocabMap, kanjiMap, grammarMap, exerciseMap } = maps;

  const enriched: EnrichedReviewItem[] = [];

  for (const item of items) {
    let title = "";
    let subtitle = item.contentType;
    let reading = "";
    let romaji = "";
    let extra = "";
    let level = "";
    let isValid = false;

    if (item.contentType === "KANA") {
      const kanaDetail = kanaMap.get(item.contentId);
      if (kanaDetail) {
        title = kanaDetail.character;
        subtitle = kanaDetail.script;
        reading = kanaDetail.romaji;
        romaji = kanaDetail.romaji;
        extra = kanaDetail.ipa ? `/${kanaDetail.ipa}/` : "";
        isValid = true;
      }
    } else if (item.contentType === "VOCAB") {
      const vocabDetail = vocabMap.get(item.contentId);
      if (vocabDetail) {
        title = vocabDetail.word;
        subtitle = `Từ Vựng · ${vocabDetail.partOfSpeech}`;
        reading = vocabDetail.kana;
        romaji = vocabDetail.romaji;
        extra = vocabDetail.meaning;
        level = vocabDetail.jlptLevel;
        isValid = true;
      }
    } else if (item.contentType === "KANJI") {
      const kanjiDetail = kanjiMap.get(item.contentId);
      if (kanjiDetail) {
        title = kanjiDetail.character;
        subtitle = "Hán Tự";
        reading = kanjiDetail.readings.map((r) => r.reading).join(" · ");
        romaji = kanjiDetail.readings[0]?.reading ?? "";
        extra = kanjiDetail.meaning;
        level = kanjiDetail.jlptLevel;
        isValid = true;
      }
    } else if (item.contentType === "GRAMMAR") {
      const grammarDetail = grammarMap.get(item.contentId);
      if (grammarDetail) {
        title = grammarDetail.title;
        subtitle = "Ngữ Pháp";
        reading = grammarDetail.structure;
        extra = grammarDetail.meaning;
        level = grammarDetail.level;
        isValid = true;
      }
    } else if (item.contentType === "EXERCISE") {
      const exerciseDetail = exerciseMap.get(item.contentId);
      if (exerciseDetail) {
        title = exerciseDetail.question;
        subtitle = "Câu Hỏi Luyện Tập";
        reading = "";
        extra = `Đáp án: ${exerciseDetail.correctAnswer}`;
        level = exerciseDetail.level;
        isValid = true;
      }
    }

    // Anything else is an orphan: the referenced row no longer exists, so the
    // item is dropped instead of surfacing a garbage title from a composite id.
    if (isValid) {
      enriched.push({
        id: item.id,
        contentType: item.contentType,
        contentId: item.contentId,
        title,
        subtitle,
        reading,
        romaji,
        extra,
        level,
        interval: item.interval,
        repetitions: item.repetitions,
        ease: item.ease,
      });
    }
  }

  return enriched;
}