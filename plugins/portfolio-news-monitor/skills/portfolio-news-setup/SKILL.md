---
name: portfolio-news-setup
description: >
  This skill should be used when the user asks to "set up a portfolio news monitor",
  "create a portfolio news dashboard", "scaffold portfolio tracking", "install
  portfolio news monitor", "set up daily VC news tracking", or otherwise wants
  to bootstrap a recurring news-and-signals dashboard for a list of companies
  (portfolio companies, competitors, accounts, watchlist). It scaffolds a
  styled HTML dashboard and an editable methodology file in the user's chosen
  project folder, then creates daily and weekly scheduled tasks that refresh
  the dashboard automatically.
metadata:
  version: "0.1.0"
  author: "Defiant"
---

# Portfolio News Setup

Scaffold a daily portfolio news monitor in the user's project folder. After this skill runs, the user has a working setup: an editable methodology, a styled dashboard template, a companies list, and two scheduled tasks (daily refresh + weekly digest) that run unattended.

The plugin's job ends after this skill runs. Everything the user might want to customize lives in their workspace files — dashboard styling, triage rules, company list, sections. They edit those files directly, not the plugin.

## What you're building

A folder in the user's workspace containing:

- `companies.json` — the portfolio list (populated from the user's answers)
- `methodology.md` — triage rules, Hot/Watch/Noise definitions, decay logic, dashboard structure
- `dashboard-template.html` — styled HTML shell with content regions marked by HTML comments
- `.state/seen-items.json` — initialized empty; the daily refresh appends to this
- `dashboard.html` — produced by the first refresh; rewritten each morning

Plus two scheduled tasks created via the scheduled-tasks MCP:

- `portfolio-news-daily` — runs every weekday morning, refreshes the dashboard
- `portfolio-news-weekly` — runs Friday afternoon, produces a digest of the week's Hot items

## Process

Follow these steps in order. Do not skip the elicitation step — the company list cannot be inferred.

### Step 1 — Identify the project folder

If the user has selected a working directory, use that. Otherwise ask them where to scaffold the monitor — they may want to create a new folder for it (e.g. `~/Documents/Claude/Projects/Portfolio News Monitor`). Confirm the absolute path before writing files. If the folder doesn't exist, create it.

### Step 2 — Elicit the portfolio

Show an elicitation form asking for each portfolio company. The form should collect, per company:

- **Name** (required)
- **Website** (required)
- **Category** — short tag like "AI / Developer Tools" or "HealthTech / Clinical AI" (required)
- **Founders** — comma-separated names (optional but useful — search uses these for podcast/video discovery)
- **One-line summary** — what they do, any colour worth carrying every day (optional)

Allow the user to skip the form and instead paste a JSON blob matching the companies.json schema. Show the example schema from `${CLAUDE_PLUGIN_ROOT}/skills/portfolio-news-setup/assets/companies.example.json` if they ask.

Aim for 3–10 companies on the first pass. Tell the user they can edit `companies.json` later to add or remove.

### Step 3 — Pick the daily refresh time

Ask what time they want the daily refresh to run. Default to **07:00 local time, Monday through Friday**. The weekly digest runs **Friday at 16:00 local time**.

### Step 4 — Write the workspace files

Copy these files from the plugin's assets directory into the project folder:

| Source (under `${CLAUDE_PLUGIN_ROOT}/skills/portfolio-news-setup/assets/`) | Destination (in project folder) |
|---|---|
| `methodology.md` | `methodology.md` |
| `dashboard-template.html` | `dashboard-template.html` |
| `seen-items.empty.json` | `.state/seen-items.json` |

Then synthesize `companies.json` from the user's elicitation answers and write it to the project folder. Use the same schema as `companies.example.json` — a top-level `companies` array with `name`, `website`, `category`, `founders` (array), and `summary` fields.

Create the `.state/` subdirectory if it doesn't exist.

### Step 5 — Create the scheduled tasks

Read the two prompt templates:

- `${CLAUDE_PLUGIN_ROOT}/skills/portfolio-news-setup/assets/daily-prompt.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/portfolio-news-setup/assets/weekly-prompt.md`

Use `mcp__scheduled-tasks__create_scheduled_task` to create two tasks:

**Daily task:**
- Name: `portfolio-news-daily`
- Schedule: chosen daily time, Mon–Fri
- Working directory: the project folder
- Prompt: contents of `daily-prompt.md` verbatim

**Weekly task:**
- Name: `portfolio-news-weekly`
- Schedule: Friday at 16:00 local
- Working directory: the project folder
- Prompt: contents of `weekly-prompt.md` verbatim

If the scheduled-tasks MCP exposes parameters with different names (e.g. `cron` vs `schedule`, `cwd` vs `working_directory`), adapt — list its tools first to confirm the schema. If creation fails, surface the error and ask the user how to proceed; do not silently swallow it.

### Step 6 — Offer to run the first refresh now

Ask whether the user wants to run the daily refresh immediately so they have a populated `dashboard.html` to look at before tomorrow morning. If yes, execute the same instructions from `daily-prompt.md` directly in the current session, with the project folder as context.

### Step 7 — Print the customization guide

Tell the user, in plain language, where each customizable knob lives:

- **Add or remove companies** → edit `companies.json`
- **Change triage rules / Hot vs Watch criteria / decay window** → edit `methodology.md`
- **Restyle the dashboard / change colors / add or remove sections** → edit `dashboard-template.html` (CSS at top, content regions marked with HTML comments)
- **Change the refresh schedule** → use the Scheduled Tasks UI to edit `portfolio-news-daily` or `portfolio-news-weekly`
- **Pause everything** → disable the scheduled tasks; files remain in place

Link the dashboard file with a `computer://` link so they can open it directly.

## Schema for companies.json

```json
{
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

## Schema for .state/seen-items.json

The refresh skill appends to this file. The setup skill only initializes it as `{"items": []}`. See `methodology.md` (in assets) for the item schema — it's documented there because the refresh skill is what actually mutates this file.

## Edge cases

- **User reruns the setup skill in a folder that already has these files**: ask whether to overwrite, merge (add companies to existing list), or abort. Default to abort.
- **User has fewer than 3 companies**: that's fine, proceed. The dashboard still works.
- **User declines to use scheduled tasks**: write the files anyway and tell them how to run a refresh manually ("ask Claude to refresh the portfolio news monitor in this folder").
- **scheduled-tasks MCP is not available**: tell the user they'll need that connector for the automatic refresh, write the files, and provide the prompt text so they can paste it into any scheduling tool they have.

## What not to do

- Do not embed the methodology rules inside the scheduled-task prompts. The prompts must reference `methodology.md` in the workspace so the user's edits take effect on the next run.
- Do not write the `dashboard.html` itself during setup — that's the daily refresh's job. Setup writes only the template.
- Do not modify any plugin files. All writes go into the user's project folder.
