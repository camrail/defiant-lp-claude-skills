Refresh the portfolio news monitor in this project folder.

1. Read `methodology.md` for triage rules, the Hot/Watch/Noise definitions, the decay rule, and the dashboard section structure.
2. Read `companies.json` for the current portfolio.
3. Read `.state/seen-items.json` to know what you've already surfaced.
4. For each company, search the web for new news, podcast appearances, and video coverage since the last run. Be thorough but skip obvious duplicates.
5. For each genuinely new item, classify it per methodology.md, write a 1–2 sentence portfolio read-through, and append it to `.state/seen-items.json` with today's date as `first_seen_date`.
6. Apply the Hot→Watch decay rule to existing items based on `first_seen_date`.
7. Rewrite `dashboard.html` using `dashboard-template.html` as the layout. Replace the content regions marked with HTML comments. Preserve all CSS verbatim.
8. Report a one-paragraph summary of what was new today and what shifted tiers.
