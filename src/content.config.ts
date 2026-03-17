import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const verificationStatus = z.enum(["seeded", "reviewed", "verified"]);
const harvestStatus = z.enum(["not started", "partial", "complete"]);

const sourceCollection = defineCollection({
  loader: glob({ base: "./src/content/sources", pattern: "**/*.json" }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    url: z.string().url(),
    sourceType: z.enum(["reference", "news", "official", "book", "scholarship", "database", "article"]),
    scope: z.string(),
    harvestStatus,
    qualifiesForVerification: z.boolean(),
    notes: z.string(),
  }),
});

const jurisdictionCollection = defineCollection({
  loader: glob({ base: "./src/content/jurisdictions", pattern: "**/*.json" }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    jurisdictionType: z.enum(["country", "empire", "state", "religious-state", "province", "historical-state"]),
    region: z.string(),
    historicalFrom: z.number().nullable().optional(),
    historicalTo: z.number().nullable().optional(),
    notes: z.string().optional(),
  }),
});

const workCollection = defineCollection({
  loader: glob({ base: "./src/content/works", pattern: "**/*.json" }),
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    title: z.string(),
    authors: z.array(z.string()),
    workType: z.string(),
    originalLanguage: z.string(),
    publishedYearText: z.string(),
    wikipediaTitle: z.string().nullable().optional(),
    wikipediaUrl: z.string().url().nullable().optional(),
    description: z.string(),
    descriptionParagraphs: z.array(z.string()).min(2),
    descriptionSourceIds: z.array(z.string()),
    cover: z
      .object({
        sourceUrl: z.string().url(),
        width: z.number(),
        height: z.number(),
        alt: z.string(),
        pageUrl: z.string().url(),
        licenseLabel: z.string(),
      })
      .nullable(),
    ranking: z.object({
      copiesSoldEstimate: z.number(),
      basis: z.literal("copies_sold_estimate"),
    }),
    contentTags: z.array(z.string()),
    criticismTargets: z.array(z.string()),
    reasonTags: z.array(z.string()),
    overview: z.object({
      englishDescription: z.string(),
      banningParagraphs: z.array(z.string()).min(1),
    }),
    counterReadings: z.array(
      z.object({
        type: z.enum(["article", "book"]),
        title: z.string(),
        author: z.string(),
        url: z.string().url().nullable().optional(),
        note: z.string(),
        sourceIds: z.array(z.string()),
      }),
    ),
    sourceIds: z.array(z.string()),
    amazonSearchUrl: z.string().url(),
    sectionStatus: z.object({
      bibliographic: verificationStatus,
      description: verificationStatus,
      banningOverview: verificationStatus,
      counterReadings: verificationStatus,
    }),
    reviewStatus: verificationStatus,
    published: z.boolean(),
    incompleteCoverage: z.boolean(),
    featured: z.boolean(),
    addedOn: z.string(),
  }),
});

const banEventCollection = defineCollection({
  loader: glob({ base: "./src/content/ban-events", pattern: "**/*.json" }),
  schema: z.object({
    id: z.string(),
    workId: z.string(),
    jurisdictionId: z.string(),
    governingBody: z.string(),
    dateText: z.string(),
    startYear: z.number().nullable().optional(),
    endYear: z.number().nullable().optional(),
    actionType: z.string(),
    reasonTags: z.array(z.string()),
    reasonSummary: z.string(),
    note: z.string(),
    quotation: z
      .object({
        text: z.string(),
        attribution: z.string(),
      })
      .nullable()
      .optional(),
    sourceIds: z.array(z.string()),
    reviewStatus: verificationStatus,
  }),
});

export const collections = {
  works: workCollection,
  banEvents: banEventCollection,
  jurisdictions: jurisdictionCollection,
  sources: sourceCollection,
};
