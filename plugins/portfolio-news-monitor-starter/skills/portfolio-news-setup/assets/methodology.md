# Portfolio News Monitor — Methodology

This file is the active brain of the daily refresh. Edit it freely to change classification rules, sections, or output. Each refresh re-reads it.

## Architecture

The dashboard renders client-side. There are two files on disk that matter:

- **`dashboard.html`** — a constant template. CSS + structure + an inline JS renderer. **Never rewritten by the refresh.** Edit this file to change the dashboard's look or layout.
- **`dashboard-data.js`** — written fresh by every daily refresh. Sets `window.DASHBOARD_DATA = {...}` with the current portfolio state. This is what changes between days.

A small fallback file (`dashboard-data.example.js`) ships in the workspace too and provides sample data if `dashboard-data.js` is missing — useful before the first refresh runs.

## Inputs

- `companies.json` — top-level `settings` (firm name, firm domain, accent colour) + a `companies` array. Each company: `name`, `website`, `category`, `founders`, `summary`.
- `.state/seen-items.json` — every item ever surfaced, with `url`, `title`, `company`, `first_seen_date`, `first_classification`. Used only for de-duplication and the decay rule — never for display filtering.
- `dashboard.html` (read-only — reference for the renderer's expectations).
- `dashboard-data.example.js` (read-only — schema reference).

## What to do each run

For every company in `companies.json`:

1. Search the web for items dated since the last refresh. Cover the relevant types: funding / M&A / exec changes / regulatory / customer + product news; analyst coverage; founder podcast or video appearances; hiring or product signals.
2. For each item not already in `seen-items.json`, classify it (see Triage), record the **event date** (when it happened — not when you found it), and append it to `seen-items.json` with today as `first_seen_date`.
3. For every existing item, apply the **decay rule** to determine its current display tier.
4. Build the render JSON (see Schema) and write it to `dashboard-data.js`.

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

Implementation: never mutate `first_classification` in the state file. Compute the current display tier each run from `first_classification` + age.

## Visibility window

Each company card shows the most recent **5–8 items** (Material first, then Context, sorted by event date descending within tier). Drop older items from view — they stay in `seen-items.json` for the decay calculation but don't render.

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
        {
          tier: "material",              // "material" or "context"
          url: "https://...",
          title: "Vertex ships AI Agents Studio v2",
          source: "Vertex blog",
          date: "May 25, 2026",          // event date
          context: "Major product shift; deepens runtime positioning."
        },
        {
          tier: "context",
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
- `last_refresh` is what makes the "New since last refresh" section work — set it to the previous refresh's date, not today's.
- `is_example` (boolean, optional) flips the on-page "Sample data" banner. Real refreshes omit it.
- The renderer is forgiving: missing `domain` is derived from `website`; missing `tldr`/`read_through` just don't render. Pass `null` or omit.

## Schema for `.state/seen-items.json`

```json
{
  "items": [
    {
      "url": "https://...",
      "title": "...",
      "company": "Vertex Labs",
      "first_seen_date": "2026-05-25",
      "first_classification": "material"
    }
  ]
}
```

Used only for de-duplication and the decay rule. Not read by the renderer.
