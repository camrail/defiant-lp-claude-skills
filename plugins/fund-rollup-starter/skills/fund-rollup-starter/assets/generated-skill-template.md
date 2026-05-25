---
name: {{ORG_SLUG}}-fund-rollup
description: >-
  Normalize {{ORG_NAME}}'s limited-partner fund statements -- capital account
  statements, investor statements, quarterly LP reports, in PDF or Excel from any
  fund administrator -- into the {{ORG_NAME}} portfolio roll-up: a living
  workbook with a current-state dashboard and value chart, a quarterly History
  log, and a reconciliation/audit-trail tab. Use this whenever {{ORG_NAME}} wants
  to roll up, aggregate, consolidate, normalize, refresh or update fund
  statements or capital account statements into their roll-up; whenever they
  mention a portfolio roll-up, a quarterly private-markets roll-up, or a new
  batch or new fund of statements to process; and whenever they point at a folder
  of fund statements and want the figures pulled into one sheet. Handles both
  familiar fund-administrator formats and brand-new ones, and updates the
  existing roll-up in place rather than starting over.
---

# {{ORG_NAME}} — Fund Roll-Up

## What this does

Turns {{ORG_NAME}}'s limited-partner fund statements -- PDF or Excel, from any
fund administrator -- into their portfolio roll-up, and keeps that roll-up
current quarter after quarter. No two administrators format a statement the same
way; this skill carries the method to read any of them and a script that builds
the workbook deterministically.

## The living workbook -- three tabs

The roll-up is **one living workbook**, updated each quarter, never a new file:

1. **Portfolio Roll-Up** -- a current-state dashboard, one row per fund with the
   latest figures, plus a "Portfolio Value Over Time" chart that extends itself
   each quarter.
2. **History** -- a frozen quarterly log: every run appends one row per fund plus
   a portfolio-total row, tagged with the quarter.
3. **Reconciliation Key** -- the audit trail, tracing every current figure back
   to its source line.

Each run **refreshes** the dashboard and **appends** to History.

## Inputs

- **The statements** -- a folder of fund statements to process this run.
- **The living roll-up workbook**, if one exists -- look for
  `{{ROLLUP_FILE}}` in the project folder. If it exists, this run updates it.
- **The blank template** -- a roll-up `.xlsx` whose filename contains "Template"
  -- used only on the first run, when no living workbook exists yet. Ignore any
  prior-quarter or superseded copy; if you cannot tell which file is the live
  one, ask.

## Workflow

1. Find the statements and the template; check whether a living roll-up exists.
2. Read each statement and extract the nine roll-up figures. **Read
   `references/reading-statements.md`** for the full method, and
   **`references/your-fund-formats.md`** for worked examples of {{ORG_NAME}}'s
   own funds -- statements you have seen before will match those.
3. Assemble a build spec (one JSON file) -- one entry per fund, with normalised
   figures and a one-line source note for each figure. The spec format is in
   `references/reading-statements.md`.
4. Run `python scripts/build_rollup.py <spec.json>`.
5. Read the verification output; resolve any WARNING before sharing.
6. Tell the person what changed -- funds refreshed, funds carried forward, and
   anything needing their attention.

Funds you supply a statement for are updated; funds already in the roll-up that
you do not supply are carried forward unchanged; new funds are appended. A fund
is matched to its row by exact name. Re-running the same quarter replaces that
quarter's History block, so running twice is safe.

## Conventions

{{CONVENTIONS_NOTE}}

The full set of conventions -- unit conversion, using the Investor's Share
column, taking Since-Inception figures for cumulative amounts, the Unfunded
Commitment formula, strategy normalisation, NAV net of fees, and never
aggregating Net IRR -- is in `references/reading-statements.md`. Apply them
consistently; they are why the roll-up stays comparable across administrators.

## Build and verify

`scripts/build_rollup.py` refreshes the dashboard, appends the quarter's History
snapshot, rebuilds the Reconciliation Key, recalculates, and prints a
verification table with a DPI/TVPI cross-check. A **WARNING** means a recomputed
multiple disagrees with the statement -- re-open that statement and find the
error before sharing. Also spot-check two or three figures yourself.

## Output

The living workbook, updated in place:

```
{{ROLLUP_FILE}}
```

in {{ORG_NAME}}'s project folder. Leave the blank template untouched. Tell the
person what changed this run and flag anything from the verification worth their
attention.
