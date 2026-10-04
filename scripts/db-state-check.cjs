const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  for (const l of ['N5', 'N4', 'N3']) {
    const lessons = await p.lesson.count({ where: { level: l } });
    const exercises = await p.exercise.count({ where: { lesson: { level: l } } });
    const kanji = await p.kanji.count({ where: { jlptLevel: l } });
    const vocab = await p.vocabulary.count({ where: { jlptLevel: l } });
    const grammar = await p.grammar.count({ where: { level: l } });
    console.log(`${l}: ${lessons} lessons, ${exercises} exercises, ${kanji} kanji, ${vocab} vocab, ${grammar} grammar`);
  }
  
  // Check lesson titles for "Bài" prefix
  const allLessons = await p.lesson.findMany({
    select: { id: true, title: true, slug: true, level: true, order: true },
    orderBy: [{ level: 'asc' }, { order: 'asc' }]
  });
  
  console.log('\n--- All Lessons ---');
  for (const lesson of allLessons) {
    const exCount = await p.exercise.count({ where: { lessonId: lesson.id } });
    console.log(`[${lesson.level}] #${lesson.order} "${lesson.title}" (${exCount} exercises)`);
  }
  
  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
