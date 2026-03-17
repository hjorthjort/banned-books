import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { counterPacks } from "./data/counter-packs.mjs";
import { criticismTargetOverrides } from "./data/criticism-target-overrides.mjs";
import { descriptionOverrides } from "./data/description-overrides.mjs";
import { jurisdictions } from "./data/jurisdictions.mjs";
import { sources } from "./data/sources.mjs";
import { normalizeBanReasonTags } from "./data/tag-taxonomy.mjs";
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

function humanizeTag(tag) {
  return tag.replace(/-/g, " ");
}

function buildFormParagraph(work, themes) {
  const lowerType = work.workType.toLowerCase();

  if (lowerType.includes("religious text")) {
    return `${work.title} is best approached as a scriptural work rather than a single continuous plot. Its language and authority come from recitation, commentary, and repeated interpretation, with central concerns that include ${themes}.`;
  }

  if (
    lowerType.includes("manifesto") ||
    lowerType.includes("pamphlet") ||
    lowerType.includes("tract") ||
    lowerType.includes("study") ||
    lowerType.includes("manual") ||
    lowerType.includes("history") ||
    lowerType.includes("essay")
  ) {
    return `${work.title} is organized less as a story than as an argument. As a ${lowerType}, it tries to persuade readers through selection, emphasis, and direct claims about ${themes}.`;
  }

  if (lowerType.includes("memoir") || lowerType.includes("autobiography")) {
    return `${work.title} filters ${themes} through personal memory and self-presentation. As a ${lowerType}, it asks readers to judge not just events but the voice that arranges and interprets them.`;
  }

  if (lowerType.includes("poem") || lowerType.includes("poetry")) {
    return `${work.title} approaches ${themes} through voice, rhythm, and compression rather than plot alone. Its poetic form lets feeling, argument, and public speech overlap in a way prose often cannot.`;
  }

  if (lowerType.includes("play")) {
    return `${work.title} stages ${themes} through conflict, speech, and performance. As a dramatic work, much of its force comes from what characters say in public, conceal in private, and embody on the stage.`;
  }

  if (lowerType.includes("story collection")) {
    return `Across its separate pieces, ${work.title} returns again and again to ${themes}. The collection form lets the work test the same pressures from multiple angles instead of reducing them to a single plot line.`;
  }

  return `${work.title} is usually read through its treatment of ${themes}. As a ${lowerType}, it turns those concerns into conflicts of character, voice, setting, and social pressure rather than leaving them as abstract ideas.`;
}

function buildLegacyParagraph(work, themes) {
  const lowerType = work.workType.toLowerCase();

  if (lowerType.includes("religious text")) {
    return "What gives the work lasting importance is not only doctrine but interpretive range. Readers return to it as a source of law, story, devotion, identity, and dispute, which is why arguments over the text rarely stay purely literary.";
  }

  if (
    lowerType.includes("manifesto") ||
    lowerType.includes("pamphlet") ||
    lowerType.includes("tract") ||
    lowerType.includes("study") ||
    lowerType.includes("manual") ||
    lowerType.includes("history") ||
    lowerType.includes("essay")
  ) {
    return `Its significance lies in the way it compresses large claims into memorable formulas and positions. Even readers who reject the work usually have to reckon with how sharply it frames questions about ${themes}.`;
  }

  if (lowerType.includes("memoir") || lowerType.includes("autobiography")) {
    return "The work endures because it links private experience to larger public structures. Readers come to it not only for events but for a way of seeing how identity, power, and history press on a single life.";
  }

  if (lowerType.includes("poem") || lowerType.includes("poetry")) {
    return `Its staying power comes from the fit between subject and form. The language itself becomes part of the argument, so the work matters not just for what it says about ${themes} but for how it sounds and moves on the page.`;
  }

  if (lowerType.includes("play")) {
    return "What keeps the work alive is the way argument becomes performance. Its themes stay vivid because they are enacted through timing, irony, confrontation, and the tension between private desire and public order.";
  }

  if (lowerType.includes("story collection")) {
    return `What makes the work memorable is the cumulative effect of repetition and variation. By circling the same tensions through different stories, it builds a larger picture of how ${themes} shape ordinary conduct and imagination.`;
  }

  return `Part of the work's durability lies in the way its form intensifies its themes. Readers return to it not only for subject matter but for the distinctive voice, structure, and atmosphere through which it makes ${themes} feel immediate.`;
}

function buildDescriptionParagraphs(work) {
  if (descriptionOverrides[work.id]) {
    return descriptionOverrides[work.id];
  }

  const themes = formatList(unique(work.contentTags).map(humanizeTag));

  return [work.description, buildFormParagraph(work, themes), buildLegacyParagraph(work, themes)];
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
    const descriptionParagraphs = buildDescriptionParagraphs(work);
    const criticismTargets = unique([...(work.criticismTargets ?? []), ...(criticismTargetOverrides[work.id] ?? [])]);
    const banEvents = work.banEvents.map((event, index) => ({
      id: `${work.id}--${index + 1}`,
      workId: work.id,
      jurisdictionId: event.jurisdictionId,
      governingBody: event.governingBody,
      dateText: event.dateText,
      startYear: event.startYear ?? null,
      endYear: event.endYear ?? null,
      actionType: event.actionType,
      reasonTags: normalizeBanReasonTags(event.reasonTags),
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
      descriptionParagraphs,
      descriptionSourceIds: unique(work.descriptionSourceIds ?? ["wikipedia-summary-api", "encyclopedia-censorship-2005"]),
      cover,
      ranking: {
        copiesSoldEstimate: work.copiesSoldEstimate,
        basis: "copies_sold_estimate",
      },
      contentTags: work.contentTags,
      criticismTargets,
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
