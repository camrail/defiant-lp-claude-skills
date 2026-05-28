Refresh the portfolio news monitor in this project folder.

1. Read `methodology.md` — it's the source of truth for tiers (Material / Context), the decay rule, the dashboard sections, and the schema for `dashboard-data.js`.
2. Read `companies.json` for the current portfolio + firm `settings`.
3. Read the existing `dashboard-data.js` into memory. Its `companies[].items[]` arrays are the durable record — every item ever surfaced, with `first_seen_date` and `first_classification` on each. Note its `last_refresh` value (or `as_of` if no `last_refresh` is set) — that becomes this run's `last_refresh`. If `dashboard-data.js` does not exist yet (first refresh), start with empty per-company items arrays.
4. For each company in `companies.json`, search the web for items dated since `last_refresh`. Cover: funding / M&A / exec / regulatory / customer + product news, analyst coverage, founder podcast or video appearances, hiring or product signals.
5. For each genuinely new item (URL not already present in that company's items array from step 3):
   - Capture the **event date** (when the news happened — not when you found it). Verify from the primary source where possible.
   - Classify per methodology.md.
   - Build the full item record: `first_classification` = chosen tier, `first_seen_date` = today, plus the rendering fields (`url`, `title`, `source`, `date`, `context` or `tldr` + `read_through` for podcasts/videos).
   - Append it to that company's items array.
6. For every item in every company's items array (new and previously seen), recompute the current `tier` from `first_classification` + age using the decay rule and set it on the item. Never mutate `first_classification`.
7. Build the render JSON per the Schema section in `methodology.md`:
   - `as_of` = today
   - `last_refresh` = the previous refresh's date (from step 3)
   - `settings` = copied verbatim from `companies.json`
   - `flagged` = items currently classified Material with event date in the last 7 days, each with a one-line "why it matters" framing. Mark `is_new: true` on items where the event date is today.
   - `companies[].items` = the full per-company items array (no slicing — the renderer handles the 5-item visibility window and the Show all button)
   - Omit `is_example` — the sample-data banner is only for the bundled example.
8. Write `dashboard-data.js` with `window.DASHBOARD_DATA = { … };` (overwrite the previous file). Do NOT touch `dashboard.html` — it's a constant template and your edits would be lost the next time the plugin updates it.
9. Report a one-paragraph summary of what was new today, what shifted tiers via decay, and anything flagged.

Source-quality rules:

- Prefer primary sources (company blog, founder posts, the wire that broke it) over aggregator rewrites.
- Don't fabricate funding rounds, customers, or exec moves for real companies — easy to get visibly wrong and damages the dashboard's credibility.
- If a search yields nothing fresh for a company, that's fine — the existing items just decay further down the page. Don't pad with low-quality placeholders.
