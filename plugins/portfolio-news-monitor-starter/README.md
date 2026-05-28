# Portfolio News Monitor Starter

A Cowork plugin that scaffolds a daily portfolio-news intelligence dashboard. Designed for VCs and LPs (or anyone tracking a list of companies) who want a single page that surfaces what's new across their portfolio every morning, with valuation-sensitive items flagged at the top.

## What it does

One skill — `portfolio-news-setup` — that asks for one domain per line, looks up each company itself (name, category, founders, summary), runs the first refresh immediately, and creates two scheduled tasks:

- **`portfolio-news-daily`** — runs every weekday morning. Searches the web for new news, podcast appearances, and video coverage per company. Classifies each item as **Material** (valuation-sensitive) or **Context** (useful background). Material decays to Context after three days. Writes a fresh `dashboard-data.js`.
- **`portfolio-news-weekly`** — runs Friday afternoon. Produces a digest of the week's Material items with portfolio read-throughs.

When setup finishes you get a link to your dashboard with day one already populated. To change anything afterward — add companies, restyle the dashboard, retune what counts as Material — just chat to Claude. No file editing required.

## Installation

In Cowork:

```
/plugin add https://github.com/camrail/defiant-lp-claude-skills
```

Then invoke the skill:

> Set up a portfolio news monitor.

The skill will ask for your portfolio companies, scaffold the workspace files, and create the scheduled tasks.

## What gets written to your workspace

In the project folder you choose (e.g. `~/Documents/Claude/Projects/Portfolio News Monitor`):

| File | Purpose | Edit to change |
|---|---|---|
| `companies.json` | Top-level `settings` (firm name / domain / accent colour) + your `companies` array | Add or remove companies, retune branding |
| `methodology.md` | Triage rules, Material / Context criteria, decay window, dashboard structure | Change classification logic or section layout |
| `dashboard.html` | Styled dashboard. Constant template with an inline renderer; loads data on page open. **Never rewritten by the refresh.** | Restyle the dashboard, swap colours, reorganise sections |
| `dashboard-data.example.js` | Sample-data fallback so the dashboard renders before the first refresh runs | — |
| `dashboard-data.js` | Written fresh by every daily refresh — sets `window.DASHBOARD_DATA` | Don't edit — it's rewritten every morning |
| `.state/seen-items.json` | Every item ever surfaced (initialised empty) | Hand-curate the history, if you ever need to |

The daily and weekly scheduled tasks read `companies.json` and `methodology.md` at runtime, so your edits take effect on the next refresh — no plugin update needed.

## Components

| Component | Type | Description |
|---|---|---|
| `portfolio-news-setup` | Skill | Scaffolds the project folder and creates the scheduled tasks |

## Requirements

- Cowork with the **scheduled-tasks** MCP connector enabled (built-in)
- Web search available (built-in)

No additional connectors required.

## Customisation

This plugin is intentionally a one-shot scaffolder. After setup, you own the workspace files and the running scheduled tasks. The easiest way to change anything is to just chat to Claude:

> *"Add stripe.com to my portfolio."*
> *"Drop Rivia."*
> *"Make the dashboard background lighter."*
> *"Treat any podcast appearance as Material."*
> *"Move the weekly digest to Mondays."*
> *"Pause the daily refresh for two weeks."*

Claude will edit the right file (`companies.json`, `methodology.md`, `dashboard.html`) or the scheduled task on your behalf. The next refresh picks up the change.

If you'd rather edit the files directly:

- **Add or remove companies** → `companies.json`
- **Retune Material / Context rules or the decay window** → `methodology.md`
- **Restyle the dashboard** → `dashboard.html` (CSS at top, inline renderer at the bottom)
- **Change the schedule or pause** → Cowork's Scheduled Tasks UI

To run setup against a different folder (for a second portfolio), invoke the skill again and point it at a different project directory.

## License

MIT
