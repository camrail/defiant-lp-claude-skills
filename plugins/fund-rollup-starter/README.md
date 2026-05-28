# Fund Roll-Up Starter

For limited partners and family offices drowning in quarterly statements. Takes a folder of capital account PDFs and investor statements — any administrator, any layout — and produces two things: a finished portfolio roll-up workbook, and a personalised skill that handles every future quarter in a single step.

## What it produces

After one guided session, the project folder contains:

- **A living portfolio roll-up workbook** — `<Org> - Portfolio Roll-Up.xlsx`. Three tabs: a current-state dashboard with a value-over-time chart, a quarterly History log, and a Reconciliation Key audit trail. Updates in place every quarter; same file forever.
- **A bespoke roll-up skill** — `<org-slug>-fund-rollup.skill`. Named for the entity and aware of its specific funds. Installed once, then invoked by name every quarter (*"update the Beacon Hill roll-up"*) — no need to re-run this starter.

## What it saves

- **Hours of statement parsing.** Reads each PDF or Excel file and extracts the nine roll-up figures by *meaning*, not by hard-coded label. New administrator next quarter? Still works.
- **Reconciliation effort.** Every figure carries a Reconciliation Key entry showing which file and which page it came from. Audit-ready by default.
- **Setup time.** Run the guided starter once; from then on every quarter is a single ask to the personalised skill.
- **Convention drift.** Standard LP conventions (units, Investor's Share, since-inception, NAV net of fees) are applied consistently every quarter.

## Installation

Add the marketplace and install the plugin:

```
/plugin marketplace add camrail/defiant-lp-claude-skills
/plugin install fund-rollup-starter@defiant-lp-claude-skills
```

Then start a session and ask:

> Set up a fund roll-up for me.

Other phrasings also trigger it: *"build a portfolio roll-up"*, *"consolidate my LP statements"*, *"create a roll-up skill for my fund statements"*.

## What gets written to the project folder

| File | Purpose |
|---|---|
| `<Org> - Portfolio Roll-Up.xlsx` | Living three-tab workbook (Portfolio Roll-Up dashboard, History, Reconciliation Key) |
| `<org-slug>-fund-rollup.skill` | Installable bespoke skill — drop into Claude to install, then invoke every quarter |

The blank starter template ships inside this plugin and is copied across on first run.

## How the starter works under the hood

The setup skill walks through seven steps: gather the inputs, find or create the roll-up template, read each fund statement by meaning, apply LP conventions, build the workbook with a deterministic Python script, then generate the personalised skill. After that, the starter is done — every future quarter runs through the personalised skill instead.

The skill bundles:

- `scripts/build_rollup.py` — deterministic builder for the three-tab workbook (refresh dashboard, append History, rebuild Reconciliation Key, run DPI/TVPI cross-check)
- `references/reading-statements.md` — the method for decoding any LP statement format (the nine fields, conventions, anatomy, first-principles decoding, build-spec schema)
- `assets/roll-up-template.xlsx` — the blank starter template
- `assets/generated-skill-template.md` — the SKILL.md template used to generate the personalised skill

## Requirements

- Python 3 with `openpyxl` available
- Read access to a folder of fund statements (PDF or Excel)

No external API or MCP connector required.

## Notes

- **One-time scaffolder.** Don't re-run the starter each quarter — the generated personalised skill (e.g. `beacon-hill-fund-rollup`) handles every quarter after the first.
- **Recognises fund formats it has seen before.** The personalised skill carries the first run's specific fund formats as worked examples in `references/your-fund-formats.md`, so repeat statements are recognised instantly next quarter.
- **In-place updates.** The workbook is a living document, not a new file per quarter.

## License

MIT
