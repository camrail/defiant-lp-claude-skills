Produce the weekly portfolio digest in this project folder.

1. Read `methodology.md` for context — especially the Triage and Weekly digest sections.
2. Read `companies.json` for the portfolio order.
3. Read `.state/seen-items.json` and select every item where `first_seen_date` is within the last 7 days AND `first_classification` is `hot`.
4. Group selected items by company, in the order from `companies.json`.
5. Write the digest to `weekly-digest-YYYY-MM-DD.md` (today's date) in the project folder. Structure:
   - Title with the week range
   - One section per company that has Hot items this week
   - Under each company, a short bulleted list of the items with source, date, and a 1–2 sentence portfolio read-through
   - Skip companies with no Hot items
   - Close with a "Watch list" section naming companies with notable Watch-tier signals worth tracking next week (1 line each, optional)
6. Do not modify `dashboard.html` or `.state/seen-items.json` during the weekly run.
7. Report a one-paragraph summary of the week.
