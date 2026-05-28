---
name: portfolio-news-setup
description: >
  This skill should be used when the user asks to "set up a portfolio news monitor",
  "create a portfolio news dashboard", "scaffold portfolio tracking", "install
  portfolio news monitor", "set up daily VC news tracking", or otherwise wants
  to bootstrap a recurring news-and-signals dashboard for a list of companies
  (portfolio companies, competitors, accounts, watchlist). It scaffolds a
  styled HTML dashboard and an editable methodology file in the user's chosen
  project folder, then creates a daily scheduled task that refreshes the
  dashboard automatically.
metadata:
  version: "0.3.0"
  author: "Defiant"
---

# Portfolio News Setup

Scaffold a daily portfolio news monitor in the user's project folder. After this skill runs, the user has a working setup: an editable methodology, a styled dashboard, a companies list, and a daily scheduled refresh that runs unattended.

The plugin's job ends after this skill runs. Everything the user might want to customize lives in their workspace files — dashboard styling, triage rules, company list. They edit those files directly, not the plugin.

## What you're building

A folder in the user's workspace containing:

- `companies.json` — top-level `settings` (firm name, firm domain, accent colour) + a `companies` array (the portfolio).
- `methodology.md` — triage rules (Material / Context), decay logic, dashboard structure, render schema.
- `dashboard.html` — the styled dashboard. Constant template with an inline JS renderer; reads `dashboard-data.js` on load. **Never rewritten by the refresh.**
- `dashboard-data.example.js` — sample data fallback so the dashboard renders before the first refresh runs.
- `.state/seen-items.json` — initialized empty; the daily refresh appends to this.

After the first refresh, also:

- `dashboard-data.js` — written by every daily refresh. Sets `window.DASHBOARD_DATA = {…}` with the current portfolio state.

Plus one scheduled task created via the scheduled-tasks MCP:

- `portfolio-news-daily` — runs every weekday morning, rewrites `dashboard-data.js`.

## Process

Follow these steps in order. Do not skip the elicitation step — the company list cannot be inferred.

### Step 1 — Identify the project folder

If the user has selected a Cowork directory, use that. Otherwise ask them where to scaffold the monitor — they may want to create a new folder for it (e.g. `~/Documents/Claude/Projects/Portfolio News Monitor`). Confirm the absolute path before writing files. If the folder doesn't exist, create it.

### Step 2 — Elicit the portfolio (keep it minimal — just enough to enrich)

The fast path is a tiny elicitation form. Users who already have their portfolio in a spreadsheet, PDF, or pitch-deck export shouldn't be forced through it — see the "Alternative inputs" note below.

Show an elicitation form with exactly three fields. The first field is the only required one.

- **Portfolio company websites** — a single textarea. Label: **"Portfolio company websites — one per line"**. Placeholder text: literally three example domains on their own lines, nothing else:

  ```
  anthropic.com
  openai.com
  cursor.com
  ```

  Keep this input box clean and simple — it's the quick-start path. Don't pack alternative formats (pipe-separated rows, JSON, comma lists) into the placeholder or label; that just overwhelms the user. The textarea accepts one website per line. Every non-blank line: strip whitespace, lowercase, drop any leading `http://` or `https://` or trailing slash, and treat what remains as the domain. Skip blank lines. Everything else — name, sector, founders, summary — gets filled in by enrichment in Step 3.

- **Your firm's website** (optional) — used to brand the dashboard with the firm's logo and accent colour. Single-line input. If blank, skip branding and use the default palette.
- **Refresh time** — what time the daily refresh should run. Default to **07:00 local time, Monday through Friday**.

Do not ask for name, category, founders, or summary in the form. Those get filled in by enrichment (Step 3) — that is the whole point.

**Alternative inputs (outside the form).** Before showing the form, if the user has already attached or pasted a portfolio source — an Excel/CSV file, a PDF (e.g. an LP report or pitch deck), a screenshot of a portfolio page, a chunk of HTML from their website, etc. — extract the company websites from that source first and skip straight to confirming the resulting list. If they mention having such a file but haven't attached it yet, invite them to attach it instead of typing into the textarea. You only need a website per company; ignore any other columns or fields, since enrichment will re-derive that data. After extraction, show the list back to the user for a quick confirm/edit before continuing to Step 3.

Aim for 3–10 companies on the first pass. Tell the user they can edit `companies.json` later to add or remove.

### Step 3 — Auto-enrich each company

For each entry the user provided, do a quick web search to fill in the fields the form skipped. Goal: produce a `companies.json` that's ready to use without the user editing anything.

For every company, find and record:

- **`name`** — the company's actual name. Use the casing they use themselves.
- **`website`** — canonical URL with `https://` and trailing slash. Fix common variations (e.g. `blitzy.com` → `https://blitzy.com/`).
- **`category`** — short tag describing what they do (e.g. "AI / Developer Tools", "HealthTech / Clinical AI"). Two to four words. Pull from how the company describes itself.
- **`founders`** — array of founder names. If you can find one or two via web search, include them. If you cannot find any with reasonable confidence, leave the array empty rather than guessing.
- **`summary`** — one sentence: what they do, plus any standing colour worth carrying every day (founded year, last round, notable customers). No more than ~30 words.

If a company is ambiguous (multiple companies match the domain or name), pick the one whose site matches the URL the user gave. If you genuinely can't find a company, surface that to the user before proceeding — do not write a placeholder.

Do enrichment in parallel where possible. Do not run more than ~3 searches per company.

### Step 3b — Brand the dashboard (only if a firm website was given)

If the user provided a firm website in Step 2, populate the `settings` block of `companies.json`. Branding is **data-driven** — the dashboard reads these fields at render time. Do NOT edit `dashboard.html` itself.

For the firm domain provided:

1. **`firm_name`** — pull a clean name from the firm's site `<title>` or `<meta property="og:site_name">`. Strip any tagline. If you can't get a clean name, use the domain itself (e.g. `"Skylark"` from `skylark.com`).
2. **`firm_domain`** — the bare domain (lowercased, no scheme, no path, no trailing slash). The renderer uses this for the firm's favicon in the header.
3. **`accent_color`** — try one `WebFetch` on `https://{firm_domain}/`. Look for (in order): a `<meta name="theme-color" content="#…">` tag, then a primary colour referenced in inline CSS (`--primary`, `--brand`, `--accent`, or a strong colour on the main nav or hero). Validate: valid hex, not near-white, not near-black. If it passes, use it; if not, leave `accent_color` unset (the dashboard uses its default blue).

Do not spend more than one `WebFetch` on this step. If anything fails, fall back to the default silently — branding is a nice-to-have, not a blocker.

If no firm website was provided in Step 2, omit the `settings` block entirely from `companies.json`. The dashboard renders with default styling and a generic title.

### Step 4 — Write the workspace files

Copy these files from the plugin's assets directory into the project folder:

| Source (under `${CLAUDE_PLUGIN_ROOT}/skills/portfolio-news-setup/assets/`) | Destination (in project folder) |
|---|---|
| `methodology.md` | `methodology.md` |
| `dashboard.html` | `dashboard.html` |
| `dashboard-data.example.js` | `dashboard-data.example.js` |
| `seen-items.empty.json` | `.state/seen-items.json` |

Then synthesize `companies.json` from the user's elicitation answers + enrichment + branding (Steps 2–3b) and write it to the project folder. Use the schema in `companies.example.json` as the reference: top-level `settings` (optional) + `companies` array (required).

Create the `.state/` subdirectory if it doesn't exist.

### Step 5 — Create the scheduled task

Read the daily prompt template:

- `${CLAUDE_PLUGIN_ROOT}/skills/portfolio-news-setup/assets/daily-prompt.md`

Use `mcp__scheduled-tasks__create_scheduled_task` to create the task:

**Daily task:**
- Name: `portfolio-news-daily`
- Schedule: chosen daily time, Mon–Fri
- Working directory: the project folder
- Prompt: contents of `daily-prompt.md` verbatim

If the scheduled-tasks MCP exposes parameters with different names (e.g. `cron` vs `schedule`, `cwd` vs `working_directory`), adapt — list its tools first to confirm the schema. If creation fails, surface the error and ask the user how to proceed; do not silently swallow it.

### Step 6 — Run the first refresh now (do not ask)

Immediately execute the instructions from `daily-prompt.md` against the project folder. This produces the first `dashboard-data.js`. Do not ask the user whether they want this — the goal is that when setup finishes, day one is already done and the dashboard is populated with real data (not just the example fallback).

If the refresh fails partway through (e.g. a search times out), still write a best-effort `dashboard-data.js` with whatever was gathered, save what's in `.state/seen-items.json`, and surface the partial failure to the user.

### Step 7 — Hand off with a launch link

End the conversation with a clear, short handoff. The structure:

1. One line confirming setup is done and day one ran.
2. A `computer://` link to `dashboard.html` in the project folder. Phrase it as "Open your dashboard". This is the most important element — it should be obvious where to click.
3. A brief "next refresh: tomorrow at HH:MM" line so the user knows when to expect updates.
4. A short paragraph telling them they can customize by just chatting to Claude — they don't need to touch files unless they want to. Give 3–4 example asks they could send right now, phrased as natural-language requests rather than instructions:
   - *"Add stripe.com to my portfolio."*
   - *"Drop Rivia."*
   - *"Treat any podcast appearance as Material."*
   - *"Push the daily refresh to 8am."*

   Make clear that Claude will edit `companies.json`, `methodology.md`, `dashboard.html`, or the scheduled task on their behalf — they don't need to know which file holds what.

Do not dump a long summary of what was written. The handoff is a launch pad, not a status report.

## Schema for `companies.json`

```json
{
  "settings": {
    "firm_name": "Skylark Capital",
    "firm_domain": "skylark.com",
    "accent_color": "#2563eb"
  },
  "companies": [
    {
      "name": "Company Name",
      "website": "https://example.com/",
      "category": "Sector / Theme",
      "founders": ["Founder One", "Founder Two"],
      "summary": "One sentence — what they do, any colour worth carrying every day."
    }
  ]
}
```

`settings` is optional. All three settings fields are optional within it — anything you omit falls back to the dashboard's defaults.

## Schema for `.state/seen-items.json`

The refresh skill appends to this file. The setup skill only initializes it as `{"items": []}`. See `methodology.md` for the item schema — it's documented there because the refresh skill is what mutates this file.

## Edge cases

- **User reruns the setup skill in a folder that already has these files**: ask whether to overwrite, merge (add companies to the existing list), or abort. Default to abort.
- **User has fewer than 3 companies**: that's fine, proceed. The dashboard still works.
- **User declines to use the scheduled task**: write the files anyway and tell them how to run a refresh manually ("ask Claude to refresh the portfolio news monitor in this folder").
- **scheduled-tasks MCP is not available**: tell the user they'll need that connector for the automatic refresh, write the files, and provide the prompt text so they can paste it into any scheduling tool they have.

## What not to do

- Do not embed the methodology rules inside the scheduled-task prompts. The prompts must reference `methodology.md` in the workspace so the user's edits take effect on the next run.
- Do not modify any plugin files. All writes go into the user's project folder.
- Do not edit `dashboard.html` to inject the firm logo or accent colour. Branding is data — it lives in `companies.json.settings` and the renderer applies it at load time.
- Do not ask the user for company details that you can look up. The whole point of enrichment is that they hand you a list of websites and get a working monitor back.
- Do not cram alternative input formats into the textarea's placeholder or label (no pipe-separated rows, no pasted JSON examples, no "any of these formats works" framing). The textarea is the clean, one-website-per-line quick-start path. Richer inputs — spreadsheets, PDFs, screenshots — are handled outside the form (see Step 2's "Alternative inputs" note); the user attaches the file and you parse out the websites.
- Do not ask the user whether to run the first refresh. Run it.
- Do not leave placeholder summaries or "TBD" categories in `companies.json`. If enrichment genuinely fails for a company, raise it with the user before writing the file rather than shipping a placeholder.
