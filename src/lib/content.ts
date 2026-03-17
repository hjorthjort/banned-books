import { getCollection } from "astro:content";

export async function getPublishedWorks() {
  const works = await getCollection("works", ({ data }) => data.published);
  return works.sort((left, right) => {
    if (left.data.featured !== right.data.featured) {
      return left.data.featured ? -1 : 1;
    }

    return right.data.ranking.copiesSoldEstimate - left.data.ranking.copiesSoldEstimate;
  });
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

