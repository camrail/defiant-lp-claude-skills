# Fund Roll-Up Starter

A Claude Code plugin for limited partners and family offices. One-time guided setup that turns a folder of messy fund statements — capital account statements, investor statements, quarterly LP reports, in PDF or Excel from any administrator — into two finished things:

1. **A portfolio roll-up workbook** — current-state dashboard with a value-over-time chart, a quarterly History log, and a Reconciliation Key audit trail.
2. **Their own bespoke roll-up skill** — named for their entity and aware of their funds, so every quarter after this is a single step.

## What it does

One skill — `fund-rollup-starter` — walks the user through seven steps: gather inputs, find or create their roll-up template, read each fund statement (extracting the nine roll-up figures by *meaning*, not label), apply the standard LP conventions (units, Investor's Share, since-inception, NAV net of fees), build the workbook with a deterministic Python script, then generate a personalised `<org-slug>-fund-rollup.skill` file the user installs once. From next quarter on they invoke their own skill by name; this starter is not run again.

## Installation

In Claude Code, add the marketplace and install the plugin:

```
/plugin marketplace add camrail/defiant-lp-claude-skills
/plugin install fund-rollup-starter@defiant-lp-claude-skills
```

Then invoke the skill:

> Set up a fund roll-up for me.

Or any of: "build a portfolio roll-up", "consolidate my LP statements", "create a roll-up skill for my fund statements".

## What gets produced

In the user's project folder:

| File | Purpose |
|---|---|
| `<Org> - Portfolio Roll-Up.xlsx` | Living three-tab workbook (Portfolio Roll-Up dashboard, History, Reconciliation Key) |
| `<org-slug>-fund-rollup.skill` | Installable skill packaged for the user — drop into Claude to install |

The blank starter template ships inside this plugin and is copied into the user's folder on first run.

## Components

| Component | Type | Description |
|---|---|---|
| `fund-rollup-starter` | Skill | Guided setup that builds the first roll-up and generates the user's personal skill |

The skill bundles:

- `scripts/build_rollup.py` — deterministic builder for the three-tab workbook (refresh dashboard, append History, rebuild Reconciliation Key, run DPI/TVPI cross-check)
- `references/reading-statements.md` — the method for decoding any LP statement format (the nine fields, conventions, anatomy, first-principles decoding, build-spec schema)
- `assets/roll-up-template.xlsx` — the blank starter template
- `assets/generated-skill-template.md` — the SKILL.md template used to produce the user's bespoke skill

## Requirements

- Python 3 with `openpyxl` available for `build_rollup.py`
- Ability to read PDFs and Excel files from the user's folder

No external API or MCP connector required.

## Notes

- This is a **one-time** scaffolder. After running it once, the user has their own named skill (e.g. `beacon-hill-fund-rollup`) which they invoke each quarter. They don't re-run the starter.
- The generated skill carries the user's specific fund formats as worked examples in `references/your-fund-formats.md`, so statements they have seen before are recognised instantly next quarter.
- Roll-up updates are in-place: the workbook is a living document, not a new file per quarter.

## License

MIT
