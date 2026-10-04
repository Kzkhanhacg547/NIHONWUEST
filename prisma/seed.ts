import { prisma } from "../lib/prisma";
import { HIRAGANA_BASIC } from "./seed-data/hiragana";
import { KATAKANA_BASIC } from "./seed-data/katakana";
import { DAKUTEN } from "./seed-data/dakuten";
import { ACHIEVEMENTS, DAILY_MISSIONS, JOURNEY_LOCATIONS } from "./seed-data/meta";
import { LESSONS as LESSONS_N5 } from "./seed-data/lessons";
import { SCENARIOS as SCENARIOS_N5 } from "./seed-data/scenarios";
import { KANJI_N5, VOCABULARY_N5 } from "./seed-data/kanji-vocab";
import { grammarData as GRAMMAR_N5 } from "./seed-data/grammar";
import { KANJI_N4, VOCABULARY_N4, GRAMMAR_N4, LESSONS_N4, SCENARIOS_N4 } from "./seed-data/n4-data";
import { KANJI_N3, VOCABULARY_N3, GRAMMAR_N3, LESSONS_N3, SCENARIOS_N3 } from "./seed-data/n3-data";

async function main() {
  for (const k of HIRAGANA_BASIC) {
    await prisma.kana.upsert({
      where: { character_script: { character: k.character, script: "HIRAGANA" } },
      update: { romaji: k.romaji, ipa: k.ipa, row: k.row, column: k.column, kind: k.kind },
      create: { character: k.character, script: "HIRAGANA", romaji: k.romaji, ipa: k.ipa, row: k.row, column: k.column, kind: k.kind },
    });
  }
  for (const k of KATAKANA_BASIC) {
    await prisma.kana.upsert({
      where: { character_script: { character: k.character, script: "KATAKANA" } },
      update: { romaji: k.romaji, ipa: k.ipa, row: k.row, column: k.column, kind: k.kind },
      create: { character: k.character, script: "KATAKANA", romaji: k.romaji, ipa: k.ipa, row: k.row, column: k.column, kind: k.kind },
    });
  }
  for (const k of DAKUTEN) {
    await prisma.kana.upsert({
      where: { character_script: { character: k.character, script: k.script } },
      update: { romaji: k.romaji, ipa: k.ipa, row: k.row, column: k.column, kind: k.kind },
      create: { character: k.character, script: k.script, romaji: k.romaji, ipa: k.ipa, row: k.row, column: k.column, kind: k.kind },
    });
  }
  for (const j of JOURNEY_LOCATIONS) {
    await prisma.journeyLocation.upsert({ where: { slug: j.slug }, update: j, create: j });
  }
  for (const a of ACHIEVEMENTS) {
    await prisma.achievement.upsert({ where: { key: a.key }, update: a, create: a });
  }
  for (const m of DAILY_MISSIONS) {
    await prisma.dailyMission.upsert({ where: { key: m.key }, update: m, create: m });
  }

  // Combine Lessons (N5 + N4 + N3)
  const ALL_LESSONS = [...LESSONS_N5, ...LESSONS_N4, ...LESSONS_N3];
  const validLessonSlugs = ALL_LESSONS.map((l) => l.slug);
  const obsoleteLessons = await prisma.lesson.findMany({
    where: { slug: { notIn: validLessonSlugs } },
    select: { id: true },
  });
  if (obsoleteLessons.length > 0) {
    const obsoleteIds = obsoleteLessons.map((l) => l.id);
    await prisma.exercise.deleteMany({ where: { lessonId: { in: obsoleteIds } } });
    await prisma.userLessonProgress.deleteMany({ where: { lessonId: { in: obsoleteIds } } });
    await prisma.lessonItem.deleteMany({ where: { lessonId: { in: obsoleteIds } } });
    await prisma.lesson.deleteMany({ where: { id: { in: obsoleteIds } } });
  }

  for (const l of ALL_LESSONS) {
    const lesson = await prisma.lesson.upsert({
      where: { slug: l.slug },
      update: { title: l.title, description: l.description, level: l.level, order: l.order, xpReward: l.xpReward },
      create: { slug: l.slug, title: l.title, description: l.description, level: l.level, order: l.order, xpReward: l.xpReward },
    });
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id } });
    for (let idx = 0; idx < l.exercises.length; idx += 1) {
      const ex = l.exercises[idx] as {
        type: string;
        question: string;
        correctAnswer: string;
        points: number;
        order?: number;
        options: Array<{ label?: string; text: string; isCorrect: boolean; order?: number }>;
      };
      await prisma.exercise.create({
        data: {
          lessonId: lesson.id,
          type: ex.type,
          question: ex.question,
          correctAnswer: ex.correctAnswer,
          points: ex.points,
          order: ex.order ?? idx,
          options: {
            create: ex.options.map((opt, optIdx) => ({
              label: opt.label ?? String.fromCharCode(65 + optIdx),
              text: opt.text,
              isCorrect: opt.isCorrect,
              order: opt.order ?? optIdx,
            })),
          },
        },
      });
    }
  }

  // Combine Scenarios (N5 + N4 + N3)
  const ALL_SCENARIOS = [...SCENARIOS_N5, ...SCENARIOS_N4, ...SCENARIOS_N3];
  for (const s of ALL_SCENARIOS) {
    const scenario = await prisma.scenario.upsert({
      where: { slug: s.slug },
      update: { title: s.title, description: s.description, level: s.level, xpReward: s.xpReward },
      create: { slug: s.slug, title: s.title, description: s.description, level: s.level, xpReward: s.xpReward },
    });

    await prisma.scenarioMessage.deleteMany({ where: { scenarioId: scenario.id } });
    await prisma.scenarioChoice.deleteMany({ where: { scenarioId: scenario.id } });

    for (const msg of s.messages) {
      await prisma.scenarioMessage.create({
        data: {
          scenarioId: scenario.id,
          order: msg.order,
          speaker: msg.speaker,
          japanese: msg.japanese,
          romaji: msg.romaji,
          meaning: msg.meaning,
        },
      });
    }

    for (const ch of s.choices) {
      await prisma.scenarioChoice.create({
        data: {
          scenarioId: scenario.id,
          optionText: ch.optionText,
          isIdeal: ch.isIdeal,
          xpReward: ch.xpReward,
        },
      });
    }
  }

  // Combine Kanji (N5 + N4 + N3)
  const ALL_KANJI = [...KANJI_N5, ...KANJI_N4, ...KANJI_N3];
  for (const k of ALL_KANJI) {
    const kanji = await prisma.kanji.upsert({
      where: { character: k.character },
      update: { meaning: k.meaning, strokeCount: k.strokeCount, jlptLevel: k.jlptLevel },
      create: { character: k.character, meaning: k.meaning, strokeCount: k.strokeCount, jlptLevel: k.jlptLevel },
    });
    await prisma.kanjiReading.deleteMany({ where: { kanjiId: kanji.id } });
    for (const r of k.readings) {
      await prisma.kanjiReading.create({
        data: { kanjiId: kanji.id, reading: r.reading, type: r.type },
      });
    }
  }

  // Combine Vocabulary (N5 + N4 + N3)
  //
  // Previously this deleted every Vocabulary row first. `ReviewItem.contentId`
  // is a plain String with no FK, so the delete succeeded and silently turned
  // every user's VOCAB/KANJI review cards into dangling pointers. Upsert by the
  // stable natural key (word + jlptLevel) so ids are preserved and re-seeding is
  // idempotent.
  const ALL_VOCABULARY = [...VOCABULARY_N5, ...VOCABULARY_N4, ...VOCABULARY_N3];
  for (const v of ALL_VOCABULARY) {
    const existingVocab = await prisma.vocabulary.findFirst({
      where: { word: v.word, jlptLevel: v.jlptLevel },
    });
    if (existingVocab) {
      await prisma.vocabulary.update({
        where: { id: existingVocab.id },
        data: {
          kana: v.kana,
          kanji: v.kanji,
          romaji: v.romaji,
          meaning: v.meaning,
          partOfSpeech: v.partOfSpeech,
          tags: v.tags ?? "",
        },
      });
      await prisma.vocabularyExample.deleteMany({ where: { vocabularyId: existingVocab.id } });
      await prisma.vocabularyExample.create({
        data: {
          vocabularyId: existingVocab.id,
          japanese: v.exampleJapanese,
          romaji: v.exampleRomaji,
          meaning: v.exampleMeaning,
        },
      });
    } else {
      await prisma.vocabulary.create({
        data: {
          word: v.word,
          kana: v.kana,
          kanji: v.kanji,
          romaji: v.romaji,
          meaning: v.meaning,
          partOfSpeech: v.partOfSpeech,
          jlptLevel: v.jlptLevel,
          tags: v.tags ?? "",
          examples: {
            create: [{
              japanese: v.exampleJapanese,
              romaji: v.exampleRomaji,
              meaning: v.exampleMeaning,
            }],
          },
        },
      });
    }
  }

  // Combine Grammar (N5 + N4 + N3)
  const ALL_GRAMMAR = [...GRAMMAR_N5, ...GRAMMAR_N4, ...GRAMMAR_N3];
  for (const g of ALL_GRAMMAR) {
    const existing = await prisma.grammar.findFirst({ where: { title: g.title } });
    const grammar = existing
      ? await prisma.grammar.update({
          where: { id: existing.id },
          data: { level: g.level, meaning: g.meaning, structure: g.structure, commonMistakes: g.commonMistakes },
        })
      : await prisma.grammar.create({
          data: { title: g.title, level: g.level, meaning: g.meaning, structure: g.structure, commonMistakes: g.commonMistakes },
        });

    await prisma.grammarExample.deleteMany({ where: { grammarId: grammar.id } });
    for (const ex of g.examples) {
      await prisma.grammarExample.create({
        data: { grammarId: grammar.id, japanese: ex.japanese, romaji: ex.romaji, meaning: ex.meaning },
      });
    }
  }

  console.log(`Seed completed: ${ALL_LESSONS.length} lessons, ${ALL_KANJI.length} kanji, ${ALL_VOCABULARY.length} vocabulary, ${ALL_GRAMMAR.length} grammar points.`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
