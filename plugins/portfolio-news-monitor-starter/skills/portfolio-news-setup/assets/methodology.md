# Portfolio News Monitor — Methodology

This file is the active brain of the daily refresh. Edit it freely to change classification rules, sections, or output. Each refresh re-reads it.

## Architecture

The dashboard renders client-side. There are two files on disk that matter:

- **`dashboard.html`** — a constant template. CSS + structure + an inline JS renderer. **Never rewritten by the refresh.** Edit this file to change the dashboard's look or layout.
- **`dashboard-data.js`** — written by every daily refresh. Sets `window.DASHBOARD_DATA = {...}` with the full portfolio state — every item ever surfaced for every company. This is both the render payload AND the durable record (no separate seen-items log).

A small fallback file (`dashboard-data.example.js`) ships in the workspace too and provides sample data if `dashboard-data.js` is missing — useful before the first refresh runs.

## Inputs

- `companies.json` — top-level `settings` (firm name, firm domain, accent colour) + a `companies` array. Each company: `name`, `website`, `category`, `founders`, `summary`.
- The previous `dashboard-data.js` — read at the start of the run to recover prior state. Every item already there is preserved (with its original `first_seen_date` and `first_classification`); new items are appended.
- `dashboard.html` (read-only — reference for the renderer's expectations).
- `dashboard-data.example.js` (read-only — schema reference).

## What to do each run

1. Read the previous `dashboard-data.js` into memory. Its `companies[].items[]` arrays are the prior portfolio state — every item ever surfaced, with the durable fields `first_seen_date` and `first_classification`.
2. For every company in `companies.json`, search the web for items dated since `last_refresh`. Cover the relevant types: funding / M&A / exec changes / regulatory / customer + product news; analyst coverage; founder podcast or video appearances; hiring or product signals.
3. For each genuinely new item (URL not already in that company's prior items list), classify it (see Triage), capture the **event date** (when it happened — not when you found it), and append it to the company's items array with `first_seen_date = today` and `first_classification = chosen tier`.
4. For every item (new and previously seen), recompute the **current display tier** via the decay rule and set `tier` on the item. `first_classification` is durable and never mutated.
5. Write the full per-company items array (no slicing — the renderer handles the visibility window) back to `dashboard-data.js`.

Report a one-paragraph summary of what was new and what shifted tiers.

## Triage — Material / Context

**Material** — valuation-sensitive. Any of:

- Funding round (announced or leaked)
- M&A, exit, IPO filings, or related rumours
- Founder / C-suite / board change
- Material customer win, named reference, or marquee logo announcement
- Material product launch or platform shift
- Regulatory action or investigation
- Litigation that could affect the cap table or valuation
- Strategic investor or distribution partnership at scale

**Context** — useful background, not market-moving on its own:

- Analyst coverage and deep-dive articles
- Founder podcast or video appearances (these get a TL;DR + portfolio read-through — see Schema)
- Hiring signals, headcount growth, office expansions
- Vertical / partnership signals without a named customer
- Conference appearances and panel participation
- Incremental product updates

When in doubt between the two, pick Context. Drop background placeholders and re-posts entirely — don't ship them as Context.

## Decay rule

Items classified **Material** stay Material for **3 calendar days** from `first_seen_date`. On day 4 onward they decay to **Context** automatically. Context items do not decay further.

Implementation: never mutate `first_classification`. On every refresh, compute each item's current `tier` from `first_classification` + age and write it onto the item. The renderer reads `tier` directly.

## Visibility window

Each company card shows the most recent **5 items** by default (Material first, then Context, sorted by event date descending within tier). The renderer adds a **"Show all (N more)"** control on cards that have more — clicking it reveals every item ever surfaced for that company, in chronological order. `dashboard-data.js` carries the full history; the slice happens in the renderer, not the refresh.

## Dashboard sections

The dashboard has three top-level regions, in order:

1. **New since last refresh** — derived by the renderer. It scans every item in `companies[].items` and shows those whose **event date** is on or after `last_refresh`. Section heading is dynamic ("New since 3 days ago"). When there are no new items, the section stays visible and shows a muted "No new items since {date}" line — do not hide it.

2. **Flagged this week** — **curated by you** each refresh. List every item currently classified Material whose event date is within the last 7 days. Each entry needs a one-line "why it matters" framing, not just the item's source context. Items also appearing in "New since last refresh" should be marked `is_new: true` to drive the NEW pill. Hide the section only when there are zero flagged items.

3. **Companies grid** — one card per company in `companies.json`, in the order given. Each card has:
   - Header: favicon + name (linked to website) + category tag
   - One-line summary (from `companies.json`)
   - A unified **items feed** sorted by event date, most recent first. Material items get a small red dot prefix; Context items have no marker. Podcasts and videos get a TL;DR + portfolio read-through inline.

## Footer

A short legend explains the Material dot and the NEW pill. Plus a one-line pointer that the dashboard is rewritten daily.

## Schema for `dashboard-data.js`

A complete worked example lives in `dashboard-data.example.js`. The shape:

```js
window.DASHBOARD_DATA = {
  as_of: "Mon, May 25, 2026",          // today
  last_refresh: "Sun, May 24, 2026",   // previous refresh (yesterday in normal operation)

  settings: {                           // pulled verbatim from companies.json
    firm_name: "Skylark",
    firm_domain: "skylark.com",
    accent_color: "#2563eb"
  },

  flagged: [                            // curated — Material items in last ~7 days
    {
      company: "Vertex Labs",
      url: "https://...",
      title: "Vertex ships AI Agents Studio v2",
      why: "Major product shift; deepens the runtime positioning.",
      is_new: true                      // event happened today → also in "new since last refresh"
    }
  ],

  companies: [
    {
      name: "Vertex Labs",
      website: "https://vertexlabs.com/",
      domain: "vertexlabs.com",          // optional; renderer derives from website if absent
      category: "AI / Developer Tools",
      summary: "One-sentence summary from companies.json.",
      items: [
        // The full per-company history — every item ever surfaced. The renderer
        // shows the top 5 by default and exposes a "Show all (N more)" control
        // for the rest. Order doesn't matter (the renderer sorts by event date),
        // but newest-first is conventional.
        {
          tier: "material",              // current display tier (recomputed each refresh)
          first_classification: "material", // durable — set when first seen, never mutated
          first_seen_date: "2026-05-25",   // durable — drives the decay rule
          url: "https://...",
          title: "Vertex ships AI Agents Studio v2",
          source: "Vertex blog",
          date: "May 25, 2026",          // event date — when the thing happened
          context: "Major product shift; deepens runtime positioning."
        },
        {
          tier: "context",
          first_classification: "context",
          first_seen_date: "2026-05-12",
          url: "https://...",
          title: "Latent Space: Vertex on building enterprise AI agents",
          source: "Latent Space",
          date: "May 12, 2026",
          tldr: "2-3 sentence summary of the conversation.",
          read_through: "1-sentence portfolio read-through."
        }
      ]
    }
  ]
};
```

Notes:

- Item `date` is the **event date** — never the scrape date.
- `first_seen_date` is when the refresh first appended the item — drives the decay rule.
- `first_classification` is the tier the item was classified as on first sighting. Durable. Never mutated.
- `tier` is the current display tier, recomputed every refresh from `first_classification` + decay. Renderer reads this directly.
- URL is the de-dup key — never add an item whose URL is already in that company's items array.
- `last_refresh` is what makes the "New since last refresh" section work — set it to the previous refresh's date, not today's.
- `is_example` (boolean, optional) flips the on-page "Sample data" banner. Real refreshes omit it.
- The renderer is forgiving: missing `domain` is derived from `website`; missing `tldr`/`read_through` just don't render. Pass `null` or omit.
