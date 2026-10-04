import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting ReviewItem cleanup script...");

  // Fetch all review items
  const reviewItems = await prisma.reviewItem.findMany();
  console.log(`Total ReviewItems found: ${reviewItems.length}`);

  let totalOrphaned = 0;
  const orphansIds: string[] = [];
  const stats = new Map<string, { checked: number; orphaned: number }>();

  // Helper to init stats
  const getStats = (type: string) => {
    if (!stats.has(type)) {
      stats.set(type, { checked: 0, orphaned: 0 });
    }
    return stats.get(type)!;
  };

  // Group items by contentType to optimize DB calls
  const itemsByType = new Map<string, typeof reviewItems>();
  for (const item of reviewItems) {
    if (!itemsByType.has(item.contentType)) {
      itemsByType.set(item.contentType, []);
    }
    itemsByType.get(item.contentType)!.push(item);
  }

  // Check Vocabulary
  const vocabItems = itemsByType.get("VOCAB") || [];
  if (vocabItems.length > 0) {
    const vocabIds = vocabItems.map((i) => i.contentId);
    const existingVocabs = await prisma.vocabulary.findMany({
      where: { id: { in: vocabIds } },
      select: { id: true },
    });
    const existingSet = new Set(existingVocabs.map((v) => v.id));

    const s = getStats("VOCAB");
    s.checked = vocabItems.length;

    for (const item of vocabItems) {
      if (!existingSet.has(item.contentId)) {
        s.orphaned++;
        totalOrphaned++;
        orphansIds.push(item.id);
      }
    }
  }

  // Check Kana
  const kanaItems = itemsByType.get("KANA") || [];
  if (kanaItems.length > 0) {
    const kanaIds = kanaItems.map((i) => i.contentId); // Format could be "Hira:あ" or "a"
    // Fetch all kanas
    const existingKanas = await prisma.kana.findMany({
      select: { character: true, script: true },
    });
    const existingSet = new Set<string>();
    existingKanas.forEach((k) => {
      existingSet.add(`${k.script}:${k.character}`);
      existingSet.add(k.character);
    });

    const s = getStats("KANA");
    s.checked = kanaItems.length;

    for (const item of kanaItems) {
      if (!existingSet.has(item.contentId)) {
        s.orphaned++;
        totalOrphaned++;
        orphansIds.push(item.id);
      }
    }
  }

  // Check Kanji
  const kanjiItems = itemsByType.get("KANJI") || [];
  if (kanjiItems.length > 0) {
    const kanjiIds = kanjiItems.map((i) => i.contentId);
    const existingKanjis = await prisma.kanji.findMany({
      where: { id: { in: kanjiIds } },
      select: { id: true },
    });
    const existingSet = new Set(existingKanjis.map((k) => k.id));

    const s = getStats("KANJI");
    s.checked = kanjiItems.length;

    for (const item of kanjiItems) {
      if (!existingSet.has(item.contentId)) {
        s.orphaned++;
        totalOrphaned++;
        orphansIds.push(item.id);
      }
    }
  }

  // Check Grammar
  const grammarItems = itemsByType.get("GRAMMAR") || [];
  if (grammarItems.length > 0) {
    const grammarIds = grammarItems.map((i) => i.contentId);
    const existingGrammars = await prisma.grammar.findMany({
      where: { id: { in: grammarIds } },
      select: { id: true },
    });
    const existingSet = new Set(existingGrammars.map((g) => g.id));

    const s = getStats("GRAMMAR");
    s.checked = grammarItems.length;

    for (const item of grammarItems) {
      if (!existingSet.has(item.contentId)) {
        s.orphaned++;
        totalOrphaned++;
        orphansIds.push(item.id);
      }
    }
  }

  // Check Exercise
  const exerciseItems = itemsByType.get("EXERCISE") || [];
  if (exerciseItems.length > 0) {
    const exerciseIds = exerciseItems.map((i) => i.contentId);
    const existingExercises = await prisma.exercise.findMany({
      where: { id: { in: exerciseIds } },
      select: { id: true },
    });
    const existingSet = new Set(existingExercises.map((e) => e.id));

    const s = getStats("EXERCISE");
    s.checked = exerciseItems.length;

    for (const item of exerciseItems) {
      if (!existingSet.has(item.contentId)) {
        s.orphaned++;
        totalOrphaned++;
        orphansIds.push(item.id);
      }
    }
  }

  // Report results
  console.log("\n--- ReviewItem Cleanup Report ---");
  for (const [type, stat] of stats.entries()) {
    console.log(`${type}:`);
    console.log(`  checked: ${stat.checked}`);
    console.log(`  orphaned: ${stat.orphaned}`);
  }
  console.log(`\nTotal orphaned: ${totalOrphaned}`);

  // Execute deletion if flag is provided
  const args = process.argv.slice(2);
  const isExecute = args.includes("--execute");

  if (totalOrphaned === 0) {
    console.log("No orphaned records to delete. You are all set!");
  } else if (!isExecute) {
    console.log("\nDry run: no records deleted. Run with '--execute' flag to perform deletion.");
  } else {
    console.log(`\nExecuting deletion for ${orphansIds.length} records...`);
    const deleteResult = await prisma.reviewItem.deleteMany({
      where: { id: { in: orphansIds } },
    });
    console.log(`Successfully deleted ${deleteResult.count} orphaned ReviewItem records.`);
    
    // Cleanup related ReviewHistory if needed (though onDelete: Cascade might handle it if FK was setup, 
    // but schema shows ReviewHistory.reviewItemId has onDelete: SetNull. We might want to clear history that has no review item, but that's optional).
    const historyCleanup = await prisma.reviewHistory.deleteMany({
      where: { reviewItemId: null }
    });
    console.log(`Cleaned up ${historyCleanup.count} orphan ReviewHistory records.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
