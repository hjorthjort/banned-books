export const SITE_TITLE = "Forbidden Books Wiki";
export const SITE_DESCRIPTION =
  "A growing, source-backed index of books and texts banned by governments across time.";

export const REVIEW_LABELS = {
  seeded: "Seeded",
  reviewed: "Reviewed",
  verified: "Verified",
} as const;

export const REVIEW_DESCRIPTIONS = {
  seeded: "Included in the dataset, but still lightly reviewed.",
  reviewed: "Edited and checked against the current source set.",
  verified: "Includes at least one qualifying non-Wikipedia source for the section.",
} as const;

