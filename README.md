# Forbidden Books Wiki

Static Astro site for a source-tracked index of books and texts banned by governments.

## Scripts

- `npm run generate-data`: rebuilds `src/content/*` from the curated seed files in `scripts/data/`.
- `npm run validate-data`: checks duplicate ids/slugs, missing references, qualifying sources for verified sections, and `SOURCES.md` coverage.
- `npm run dev`: regenerates data and starts the Astro dev server.
- `npm start`: same as `dev`, but bound to the usual `npm start` entrypoint and exposed on the local network.
- `npm run build`: regenerates data, validates it, and builds the static site into `dist/`.
- `npm run preview`: serves the existing built output from `dist/` through Astro preview.
- `npm run serve`: builds the static site and then runs `preview`.
- `npm run check`: runs generation, validation, and `astro check`.

## Data layout

- `scripts/data/works.mjs`: curated 100-work seed with short descriptions, theme tags, and ban-event seeds.
- `scripts/data/sources.mjs`: source registry used by both page generation and the repo ledger.
- `scripts/data/jurisdictions.mjs`: normalized jurisdiction list for countries and historical states.
- `scripts/data/counter-packs.mjs`: shared counter and critical reading packs.
- `src/content/works/`: generated work records.
- `src/content/ban-events/`: generated jurisdiction/time records.
- `src/content/jurisdictions/`: generated normalized jurisdiction records.
- `src/content/sources/`: generated normalized source records.
- `SOURCES.md`: human-readable harvest ledger.

## Notes

- v1 tracks government bans only.
- Images are limited to Wikimedia-hosted thumbnails when available from Wikipedia summaries.
- Amazon links are search URLs only in this version.
- The dataset is intentionally incomplete; the current priority is breadth plus explicit provenance.
- Do not open `dist/index.html` directly from the filesystem. Use `npm start` for live development or `npm run serve` to preview the built site over HTTP.

## License

This repository is licensed under the MIT License. See [LICENSE](/Users/hjort/code/forbidden-books/LICENSE).

Scope:

- The site code, generated JSON records, and original editorial text in this repository are MIT-licensed unless noted otherwise.
- Linked third-party source material, book covers, Wikipedia/Wikimedia pages, and Amazon pages remain under their own terms and are not relicensed by this repository.
