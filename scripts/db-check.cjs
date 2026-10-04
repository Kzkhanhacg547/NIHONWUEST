const { PrismaClient } = require("@prisma/client");

async function main() {
  const p = new PrismaClient();
  const result = {
    kana: await p.kana.count(),
    totalLessons: await p.lesson.count(),
    n5Lessons: await p.lesson.count({ where: { level: "N5" } }),
    n5Exercises: await p.exercise.count({ where: { lesson: { level: "N5" } } }),
    totalExercises: await p.exercise.count(),
    totalKanji: await p.kanji.count(),
    totalVocab: await p.vocabulary.count(),
    totalGrammar: await p.grammar.count(),
    sampleLessons: await p.lesson.findMany({
      where: { level: "N5" },
      orderBy: { order: "asc" },
      skip: 9,
      take: 6,
      select: { order: true, title: true }
    })
  };
  console.log(JSON.stringify(result, null, 2));
  await p.$disconnect();
}

main();
