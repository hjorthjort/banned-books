import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();

async function readJsonDirectory(dirPath) {
  const files = (await readdir(dirPath)).filter((file) => file.endsWith(".json"));
  const values = [];

  for (const file of files) {
    const raw = await readFile(path.join(dirPath, file), "utf8");
    values.push(JSON.parse(raw));
  }

  return values;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function hasQualifyingSource(sourceIds, sourceMap) {
  return sourceIds.some((sourceId) => sourceMap.get(sourceId)?.qualifiesForVerification);
}

async function main() {
  const works = await readJsonDirectory(path.join(ROOT, "src/content/works"));
  const banEvents = await readJsonDirectory(path.join(ROOT, "src/content/ban-events"));
  const jurisdictions = await readJsonDirectory(path.join(ROOT, "src/content/jurisdictions"));
  const sources = await readJsonDirectory(path.join(ROOT, "src/content/sources"));
  const sourcesMd = await readFile(path.join(ROOT, "SOURCES.md"), "utf8");

  const workIds = new Set();
  const slugs = new Set();
  const jurisdictionIds = new Set(jurisdictions.map((jurisdiction) => jurisdiction.id));
  const sourceMap = new Map(sources.map((source) => [source.id, source]));

  for (const work of works) {
    assert(!workIds.has(work.id), `Duplicate work id: ${work.id}`);
    assert(!slugs.has(work.slug), `Duplicate work slug: ${work.slug}`);
    workIds.add(work.id);
    slugs.add(work.slug);

    if (work.published) {
      assert(Boolean(work.overview?.englishDescription), `Published work missing description: ${work.id}`);
      assert((work.descriptionParagraphs ?? []).length >= 2, `Published work missing expanded description: ${work.id}`);
      assert((work.overview?.banningParagraphs ?? []).length > 0, `Published work missing banning overview: ${work.id}`);
      assert((work.counterReadings ?? []).length > 0, `Published work missing counter readings: ${work.id}`);
      assert((work.sourceIds ?? []).length > 0, `Published work missing sources: ${work.id}`);
    }

    const workSourceIds = new Set(work.sourceIds ?? []);
    const readingSourceIds = new Set(work.counterReadings.flatMap((item) => item.sourceIds ?? []));

    for (const sourceId of [...workSourceIds, ...readingSourceIds, ...(work.descriptionSourceIds ?? [])]) {
      assert(sourceMap.has(sourceId), `Unknown source id ${sourceId} referenced by work ${work.id}`);
    }

    if (work.sectionStatus.bibliographic === "verified") {
      assert(hasQualifyingSource(work.sourceIds, sourceMap), `Verified bibliographic section without qualifying source: ${work.id}`);
    }

    if (work.sectionStatus.description === "verified") {
      assert(
        hasQualifyingSource(work.descriptionSourceIds ?? [], sourceMap) || hasQualifyingSource(work.sourceIds, sourceMap),
        `Verified description without qualifying source: ${work.id}`,
      );
    }

    if (work.sectionStatus.banningOverview === "verified") {
      assert(hasQualifyingSource(work.sourceIds, sourceMap), `Verified banning overview without qualifying source: ${work.id}`);
    }

    if (work.sectionStatus.counterReadings === "verified") {
      assert(
        hasQualifyingSource(work.counterReadings.flatMap((item) => item.sourceIds ?? []), sourceMap),
        `Verified counter readings without qualifying source: ${work.id}`,
      );
    }
  }

  for (const event of banEvents) {
    assert(workIds.has(event.workId), `Ban event ${event.id} references missing work ${event.workId}`);
    assert(jurisdictionIds.has(event.jurisdictionId), `Ban event ${event.id} references missing jurisdiction ${event.jurisdictionId}`);

    for (const sourceId of event.sourceIds ?? []) {
      assert(sourceMap.has(sourceId), `Ban event ${event.id} references unknown source ${sourceId}`);
    }
  }

  for (const source of sources) {
    assert(sourcesMd.includes(`\`${source.id}\``), `SOURCES.md is missing entry for source id ${source.id}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
