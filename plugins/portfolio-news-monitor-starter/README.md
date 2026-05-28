# Portfolio News Monitor Starter

For VCs, LPs, and anyone tracking a portfolio of companies. Sets up a daily intelligence dashboard that surfaces what's new across every portfolio company each morning — with valuation-sensitive items flagged at the top — and keeps itself refreshed automatically.

## What it produces

After one guided setup, the project folder contains a working monitor with day one already populated:

- **A styled HTML dashboard.** Opens in the browser. Material items (potentially valuation-affecting) at the top; Context items (useful background) below. Each company card shows the top 5 most recent items with a *Show all* control that reveals the full per-company history. Reads the latest data on every page load — no rebuild required.
- **A daily scheduled refresh.** `portfolio-news-daily` runs every weekday morning, searches the web per company, classifies each item as Material or Context, and rewrites the dashboard's data. Material items decay to Context after three days; seen items never resurface.

## What it saves

- **The morning scan.** Replaces opening twenty company sites and Twitter feeds with one dashboard, already triaged.
- **Triage fatigue.** Material vs Context classification is applied consistently every day, with the decay rule pushing yesterday's news down the page so today's signal stands out.
- **Setup time.** Supply a list of portfolio company websites (one per line, or attach a spreadsheet / PDF / portfolio screenshot); the setup skill fills in company names, sectors, founders, and summaries automatically by web lookup. Branding picks up the firm's logo and accent colour from a single URL.
- **Going-stale risk.** Edits to `companies.json` or `methodology.md` take effect on the next refresh — no plugin update, no redeploy.

## Installation

```
/plugin marketplace add camrail/defiant-lp-claude-skills
/plugin install portfolio-news-monitor-starter@defiant-lp-claude-skills
```

Then start a session and ask:

> Set up a portfolio news monitor.

Setup asks for portfolio company websites, enriches each one, runs the first refresh, and schedules the recurring one.

## What gets written to the project folder

A folder at the chosen path (e.g. `~/Documents/Claude/Projects/Portfolio News Monitor`):

| File | Purpose | Edit to change |
|---|---|---|
| `companies.json` | Top-level `settings` (firm name / domain / accent colour) + `companies` array | Add or remove companies; retune branding |
| `methodology.md` | Triage rules, Material / Context criteria, decay window, dashboard structure | Change classification logic or section layout |
| `dashboard.html` | Styled dashboard — constant template with an inline renderer; loads data on page open. **Never rewritten by the refresh.** | Restyle, swap colours, reorganise sections |
| `dashboard-data.example.js` | Sample-data fallback so the dashboard renders before the first refresh runs | — |
| `dashboard-data.js` | Written by every daily refresh — sets `window.DASHBOARD_DATA`. Carries the full per-company history (every item ever surfaced) plus computed display tiers. The renderer shows the top 5 by default with a "Show all" affordance for the rest. | Don't edit — rewritten every morning |

The daily task reads `companies.json` and `methodology.md` at runtime, so edits take effect on the next refresh — no plugin update needed.

## Components

| Component | Type | Description |
|---|---|---|
| `portfolio-news-setup` | Skill | Scaffolds the project folder, runs the first refresh, creates the scheduled task |

## Requirements

- Cowork with the **scheduled-tasks** MCP connector enabled (built-in)
- Web search available (built-in)

No additional connectors required.

## Customisation

A one-shot scaffolder. After setup, the workspace files and scheduled task live in the project folder — the easiest way to change anything is to chat to Claude:

> *"Add stripe.com to my portfolio."*
> *"Drop Rivia."*
> *"Make the dashboard background lighter."*
> *"Treat any podcast appearance as Material."*
> *"Push the daily refresh to 8am."*
> *"Pause the daily refresh for two weeks."*

Claude edits the right file (`companies.json`, `methodology.md`, `dashboard.html`) or scheduled task on request. The next refresh picks up the change.

Direct edits also work:

- **Add or remove companies** → `companies.json`
- **Retune Material / Context rules or decay window** → `methodology.md`
- **Restyle the dashboard** → `dashboard.html` (CSS at top, inline renderer at the bottom)
- **Change the schedule or pause** → Cowork's Scheduled Tasks UI

To run setup against a different folder (for a second portfolio), invoke the skill again and point it at a different project directory.

## License

MIT
