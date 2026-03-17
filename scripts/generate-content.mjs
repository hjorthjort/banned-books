import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { counterPacks } from "./data/counter-packs.mjs";
import { jurisdictions } from "./data/jurisdictions.mjs";
import { sources } from "./data/sources.mjs";
import { works } from "./data/works.mjs";

const ROOT = process.cwd();
const OUTPUT = path.join(ROOT, "src", "content");
const USER_AGENT = "ForbiddenBooksWiki/1.0 (+https://forbidden-books.example)";

const unique = (values) => [...new Set(values.filter(Boolean))];

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function buildAmazonSearchUrl(work) {
  return `https://www.amazon.com/s?k=${encodeURIComponent(`${work.title} ${work.authors[0] ?? ""}`.trim())}`;
}

function formatList(values) {
  if (values.length === 0) {
    return "";
  }
  if (values.length === 1) {
    return values[0];
  }
  if (values.length === 2) {
    return `${values[0]} and ${values[1]}`;
  }
  return `${values.slice(0, -1).join(", ")}, and ${values.at(-1)}`;
}

function buildCounterReadings(themeIds) {
  const selected = [];
  const seen = new Set();

  for (const themeId of themeIds) {
    for (const item of counterPacks[themeId] ?? []) {
      const key = `${item.title}|${item.author}`;
      if (!seen.has(key)) {
        selected.push(item);
        seen.add(key);
      }
      if (selected.length >= 4) {
        return selected;
      }
    }
  }

  return selected;
}

function buildBanningParagraphs(work, banEvents, jurisdictionMap) {
  const reasons = unique(banEvents.flatMap((event) => event.reasonTags)).map((tag) => tag.replace(/-/g, " "));
  const placeNames = unique(
    banEvents.map((event) => jurisdictionMap.get(event.jurisdictionId)?.name ?? event.jurisdictionId),
  );
  const firstEvent = banEvents[0];
  const firstJurisdiction = jurisdictionMap.get(firstEvent.jurisdictionId)?.name ?? firstEvent.jurisdictionId;
  const paragraphs = [];

  paragraphs.push(
    `${work.title} entered censorship debates as a ${work.workType.toLowerCase()} associated with ${formatList(
      work.contentTags.map((tag) => tag.replace(/-/g, " ")),
    )}. In the current dossier, the main state objections cluster around ${formatList(reasons)}.`,
  );

  paragraphs.push(
    `The earliest event currently captured here is ${firstEvent.dateText} in ${firstJurisdiction}, where ${firstEvent.governingBody} ${firstEvent.actionType.toLowerCase()}. ${firstEvent.reasonSummary} ${firstEvent.note}`.trim(),
  );

  if (banEvents.length > 1) {
    paragraphs.push(
      `The record already stretches across ${formatList(placeNames)}, which is why the page should be read as a cross-border censorship trail rather than a single isolated dispute.`,
    );
  } else {
    paragraphs.push("This entry is still incomplete: more jurisdictions, court orders, and translated justifications should be added over time.");
  }

  return paragraphs;
}

async function fetchSummary(wikipediaTitle) {
  if (!wikipediaTitle) {
    return null;
  }

  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikipediaTitle)}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
      },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

async function writeJson(targetPath, value) {
  await writeFile(targetPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function resetOutput() {
  await rm(path.join(OUTPUT, "works"), { recursive: true, force: true });
  await rm(path.join(OUTPUT, "ban-events"), { recursive: true, force: true });
  await rm(path.join(OUTPUT, "jurisdictions"), { recursive: true, force: true });
  await rm(path.join(OUTPUT, "sources"), { recursive: true, force: true });

  await mkdir(path.join(OUTPUT, "works"), { recursive: true });
  await mkdir(path.join(OUTPUT, "ban-events"), { recursive: true });
  await mkdir(path.join(OUTPUT, "jurisdictions"), { recursive: true });
  await mkdir(path.join(OUTPUT, "sources"), { recursive: true });
}

async function main() {
  const jurisdictionMap = new Map(jurisdictions.map((jurisdiction) => [jurisdiction.id, jurisdiction]));

  await resetOutput();

  for (const source of sources) {
    await writeJson(path.join(OUTPUT, "sources", `${source.id}.json`), source);
  }

  for (const jurisdiction of jurisdictions) {
    await writeJson(path.join(OUTPUT, "jurisdictions", `${jurisdiction.id}.json`), jurisdiction);
  }

  for (const work of works) {
    const summary = await fetchSummary(work.wikipediaTitle);
    const counterReadings = buildCounterReadings(work.counterThemes);
    const banEvents = work.banEvents.map((event, index) => ({
      id: `${work.id}--${index + 1}`,
      workId: work.id,
      jurisdictionId: event.jurisdictionId,
      governingBody: event.governingBody,
      dateText: event.dateText,
      startYear: event.startYear ?? null,
      endYear: event.endYear ?? null,
      actionType: event.actionType,
      reasonTags: event.reasonTags,
      reasonSummary: event.reasonSummary,
      note: event.note,
      quotation: event.quotation ?? null,
      sourceIds: unique(event.sourceIds),
      reviewStatus: event.reviewStatus ?? "verified",
    }));

    const cover =
      summary?.thumbnail?.source && summary?.content_urls?.desktop?.page
        ? {
            sourceUrl: summary.thumbnail.source,
            width: summary.thumbnail.width ?? 0,
            height: summary.thumbnail.height ?? 0,
            alt: `${work.title} cover thumbnail from Wikipedia`,
            pageUrl: summary.content_urls.desktop.page,
            licenseLabel: "Wikimedia-hosted thumbnail",
          }
        : null;

    const workRecord = {
      id: work.id,
      slug: work.slug ?? slugify(work.title),
      title: work.title,
      authors: work.authors,
      workType: work.workType,
      originalLanguage: work.originalLanguage,
      publishedYearText: work.publishedYearText,
      wikipediaTitle: work.wikipediaTitle ?? null,
      wikipediaUrl: work.wikipediaTitle ? `https://en.wikipedia.org/wiki/${work.wikipediaTitle}` : null,
      description: work.description,
      descriptionSourceIds: unique(work.descriptionSourceIds ?? ["wikipedia-summary-api", "encyclopedia-censorship-2005"]),
      cover,
      ranking: {
        copiesSoldEstimate: work.copiesSoldEstimate,
        basis: "copies_sold_estimate",
      },
      contentTags: work.contentTags,
      reasonTags: unique(banEvents.flatMap((event) => event.reasonTags)),
      overview: {
        englishDescription: work.description,
        banningParagraphs: buildBanningParagraphs(work, banEvents, jurisdictionMap),
      },
      counterReadings,
      sourceIds: unique([
        "wikipedia-government-list",
        "wikipedia-summary-api",
        ...(work.sourceIds ?? []),
        ...banEvents.flatMap((event) => event.sourceIds),
        ...counterReadings.flatMap((item) => item.sourceIds),
      ]),
      sectionStatus: work.sectionStatus ?? {
        bibliographic: "verified",
        description: "reviewed",
        banningOverview: "verified",
        counterReadings: "reviewed",
      },
      reviewStatus: work.reviewStatus ?? "reviewed",
      published: work.published ?? true,
      incompleteCoverage: work.incompleteCoverage ?? true,
      featured: work.featured ?? false,
      addedOn: work.addedOn ?? "2026-03-17",
      amazonSearchUrl: buildAmazonSearchUrl(work),
    };

    await writeJson(path.join(OUTPUT, "works", `${work.id}.json`), workRecord);

    for (const event of banEvents) {
      await writeJson(path.join(OUTPUT, "ban-events", `${event.id}.json`), event);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

