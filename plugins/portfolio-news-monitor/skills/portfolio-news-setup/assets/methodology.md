# Portfolio News Monitor — Methodology

This file is the active brain of the daily refresh. Edit it freely to change classification rules, sections, or output format. Each scheduled refresh re-reads this file.

## Inputs

- `companies.json` — the portfolio list. Each entry: `name`, `website`, `category`, `founders`, `summary`.
- `.state/seen-items.json` — every item ever surfaced, with `url`, `title`, `company`, `category`, `first_seen_date`, `first_classification`, and optional `summary`.
- `dashboard-template.html` — the styled shell. Use its CSS and section structure verbatim; replace only the content regions marked in HTML comments.

## What to do each run

For every company in `companies.json`:

1. Search the web for items published or surfaced since the last run. Cover three categories:
   - **News** — funding rounds, M&A, exec changes, regulatory developments, material customer/product announcements, press coverage.
   - **Podcasts & video** — new podcast episodes or video appearances featuring the founders or company.
   - **Signals** — hiring announcements, product launches, market positioning shifts, public commentary by founders.
2. For each new item not already in `seen-items.json`, classify it (see Triage below), write a 1–2 sentence portfolio-read-through note, and append it to the state file with today as `first_seen_date` and the chosen tier as `first_classification`.
3. For every existing item, apply the **decay rule** (see below) to determine its current display tier.
4. Rewrite `dashboard.html` using `dashboard-template.html` as the layout. Replace the content regions.

After the run, report a one-paragraph summary of what was new and what shifted tiers.

## Triage — Hot / Watch / Noise

**Hot** — valuation-sensitive. Any of:
- Funding round (announced or leaked)
- M&A, exit, IPO filings, or related rumors
- Founder / C-suite / board change
- Material customer win, named reference, or marquee logo announcement
- Material product launch or platform shift
- Regulatory action or investigation
- Litigation that could affect the cap table or valuation

**Watch** — useful context, not market-moving on its own:
- Analyst coverage and deep-dive articles
- Founder podcast / video appearances
- Hiring signals, headcount growth, office expansions
- Vertical or partnership signals without a named customer
- Conference appearances and panel participation

**Noise** — background coverage, placeholders, brief mentions:
- Roundups that mention the company in passing
- Reposts of older news
- Paywalled snippets with no substantive content
- Search placeholders ("no new items this cycle")

When in doubt between two tiers, pick the lower one.

## Decay rule

Items classified **Hot** stay Hot for **3 calendar days** from `first_seen_date`. On day 4 onward they decay to **Watch** automatically. Watch items do not decay further — they remain Watch until the entry ages out of the dashboard's visible window (see Visibility window).

Implementation note: do not mutate `first_classification` in the state file. Compute the current display tier each run from `first_classification` + age.

## Visibility window

- **News** and **Podcasts & video**: show items where the current display tier is Hot or Watch. Drop Noise from the per-company cards unless there are zero non-Noise items, in which case show a single "Search" placeholder so the section isn't empty.
- **Signals**: show the most recent 1–2 per company.

## Dashboard sections

The dashboard has three top-level regions, in order:

1. **New since yesterday** — every item where `first_seen_date` equals the current run date. Show as a horizontal strip with company name + linked headline + 1-line "why it matters." Hide the strip entirely if there are no new items today.

2. **Flagged this week — market-sensitive** — every item currently classified as Hot. Show with a "NEW" pill if `first_seen_date` is today. Hide the section if there are no Hot items.

3. **Per-company cards** — one card per company in `companies.json`, in the order given. Each card has:
   - Header: company name (linked to website) + category tag
   - One-line summary (from `companies.json`)
   - **News** subsection
   - **Podcasts & video** subsection
   - **Signals** subsection
   - Items within each subsection are sorted by current tier (Hot → Watch → Noise), then by `first_seen_date` descending.

Each item shows: tier badge, headline (linked), source + date + 1-line context. Podcast items include a TL;DR and a "Portfolio read-through" line when available.

## Footer

Always include a legend explaining the three tiers and the NEW pill, plus a one-line pointer that the dashboard is rewritten by the scheduled task.

## Weekly digest

Once a week (Friday), produce a separate digest in `weekly-digest-YYYY-MM-DD.md` alongside `dashboard.html`. The digest summarizes the week's Hot items grouped by company, with portfolio-read-through commentary. Do not modify the daily dashboard during the weekly run.
