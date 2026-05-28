Refresh the portfolio news monitor in this project folder.

1. Read `methodology.md` — it's the source of truth for tiers (Material / Context), the decay rule, the dashboard sections, and the schema for `dashboard-data.js`.
2. Read `companies.json` for the current portfolio + firm `settings`.
3. Read `.state/seen-items.json` to know what you've already surfaced (used for de-duplication and the decay rule — NOT for display filtering).
4. Read the existing `dashboard-data.js` if it exists and note its `last_refresh` value (or its `as_of` if no `last_refresh` is set) — that becomes this run's `last_refresh`.
5. For each company in `companies.json`, search the web for items dated since the last refresh. Cover: funding / M&A / exec / regulatory / customer + product news, analyst coverage, founder podcast or video appearances, hiring or product signals.
6. For each genuinely new item:
   - Capture the **event date** (when the news happened — not when you found it). Verify the date from the primary source where possible.
   - Classify per methodology.md.
   - Append to `.state/seen-items.json` with today as `first_seen_date` and the chosen tier as `first_classification`.
7. Build the render JSON per the Schema section in `methodology.md`:
   - `as_of` = today
   - `last_refresh` = the previous refresh's date (from step 4)
   - `settings` = copied verbatim from `companies.json`
   - `flagged` = the items currently classified Material with event date in the last 7 days, each with a one-line "why it matters" framing. Mark `is_new: true` on items where the event date is today.
   - `companies[].items` = each company's most recent 5–8 items (Material first, then Context, by event date desc within tier). Podcasts and videos get `tldr` + `read_through`.
   - Omit `is_example` — the sample-data banner is only for the bundled example.
8. Write `dashboard-data.js` with `window.DASHBOARD_DATA = { … };` (overwrite the previous file). Do NOT touch `dashboard.html` — it's a constant template and your edits would be lost the next time the plugin updates it.
9. Report a one-paragraph summary of what was new today, what shifted tiers via decay, and anything flagged.

Source-quality rules:

- Prefer primary sources (company blog, founder posts, the wire that broke it) over aggregator rewrites.
- Don't fabricate funding rounds, customers, or exec moves for real companies — easy to get visibly wrong and damages the dashboard's credibility.
- If a search yields nothing fresh for a company, that's fine — the card just shows older items decayed to Context. Don't pad with low-quality placeholders.
