import { importJapaneseCurriculum } from "../scripts/import-japanese-curriculum";

async function main() {
  await importJapaneseCurriculum();
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
