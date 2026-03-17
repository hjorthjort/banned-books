import { getCollection, type CollectionEntry } from "astro:content";

export type WorkEntry = CollectionEntry<"works">;

const titleCollator = new Intl.Collator("en", { sensitivity: "base" });

function compareTitles(left: string, right: string) {
  return titleCollator.compare(left, right);
}

export function getPrimaryAuthorLabel(work: WorkEntry) {
  return work.data.authors.join(", ");
}

export function getPrimaryAuthorSortKey(work: WorkEntry) {
  const primaryAuthor = work.data.authors[0]?.trim() ?? "";

  if (!primaryAuthor) {
    return "";
  }

  const parts = primaryAuthor.split(/\s+/);
  const surname = parts.at(-1) ?? primaryAuthor;
  return `${surname} ${primaryAuthor}`.toLowerCase();
}

export function getSortablePublicationYear(yearText?: string | null) {
  const normalized = yearText?.trim().toLowerCase() ?? "";

  if (!normalized) {
    return Number.MAX_SAFE_INTEGER;
  }

  if (normalized.includes("ancient")) {
    return -10000;
  }

  const centuryMatch = normalized.match(/(\d+)(st|nd|rd|th)\s+century/);
  if (centuryMatch) {
    const century = Number.parseInt(centuryMatch[1], 10);
    const year = (century - 1) * 100;
    return /\bbce\b|\bbc\b/.test(normalized) ? -year : year;
  }

  const yearMatch = normalized.match(/(\d{1,4})/);
  if (!yearMatch) {
    return Number.MAX_SAFE_INTEGER;
  }

  const year = Number.parseInt(yearMatch[1], 10);
  return /\bbce\b|\bbc\b/.test(normalized) ? -year : year;
}

export function sortWorksByRanking(works: WorkEntry[]) {
  return [...works].sort((left, right) => {
    return (
      right.data.ranking.copiesSoldEstimate - left.data.ranking.copiesSoldEstimate ||
      compareTitles(left.data.title, right.data.title)
    );
  });
}

export function sortWorksByTitle(works: WorkEntry[]) {
  return [...works].sort((left, right) => {
    return compareTitles(left.data.title, right.data.title);
  });
}

export function sortWorksByPrimaryAuthor(works: WorkEntry[]) {
  return [...works].sort((left, right) => {
    return (
      compareTitles(getPrimaryAuthorSortKey(left), getPrimaryAuthorSortKey(right)) ||
      compareTitles(left.data.title, right.data.title)
    );
  });
}

export function sortWorksByPublicationDate(works: WorkEntry[]) {
  return [...works].sort((left, right) => {
    return (
      getSortablePublicationYear(left.data.publishedYearText) - getSortablePublicationYear(right.data.publishedYearText) ||
      compareTitles(left.data.title, right.data.title)
    );
  });
}

export async function getPublishedWorks() {
  const works = await getCollection("works", ({ data }) => data.published);
  return sortWorksByRanking(works);
}

export async function getAllSources() {
  const sources = await getCollection("sources");
  return new Map(sources.map((entry) => [entry.id, entry.data]));
}

export async function getAllJurisdictions() {
  const jurisdictions = await getCollection("jurisdictions");
  return new Map(jurisdictions.map((entry) => [entry.id, entry.data]));
}

export async function getBanEventsForWork(workId: string) {
  const events = await getCollection("banEvents", ({ data }) => data.workId === workId);
  return events.sort((left, right) => {
    const leftYear = left.data.startYear ?? Number.MAX_SAFE_INTEGER;
    const rightYear = right.data.startYear ?? Number.MAX_SAFE_INTEGER;
    return leftYear - rightYear || left.data.dateText.localeCompare(right.data.dateText);
  });
}

export function getUniqueSourceIds(workSourceIds: string[], banEventSourceIds: string[]) {
  return [...new Set([...workSourceIds, ...banEventSourceIds])];
}
