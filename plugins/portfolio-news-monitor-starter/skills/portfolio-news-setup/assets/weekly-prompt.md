Produce the weekly portfolio digest in this project folder.

1. Read `methodology.md` for context — especially the Triage and Weekly digest sections.
2. Read `companies.json` for the portfolio order.
3. Read `.state/seen-items.json` and select every item where `first_seen_date` is within the last 7 days AND `first_classification` is `material`.
4. Group selected items by company, in the order from `companies.json`.
5. Write the digest to `weekly-digest-YYYY-MM-DD.md` (today's date) in the project folder. Structure:
   - Title with the week range
   - One section per company that has Material items this week
   - Under each company, a short bulleted list of the items with source, event date, and a 1–2 sentence portfolio read-through
   - Skip companies with no Material items
   - Close with a short "Watch list" section naming companies with notable Context-tier signals worth tracking next week (1 line each, optional)
6. Do NOT modify `dashboard.html`, `dashboard-data.js`, or `.state/seen-items.json` during the weekly run.
7. Report a one-paragraph summary of the week.
