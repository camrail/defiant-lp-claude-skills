---
name: fund-rollup-starter
description: >-
  One-time guided setup that takes a limited partner or family office from a
  folder of messy fund statements to a finished portfolio roll-up AND a reusable
  roll-up skill tailored to their own funds. Use this whenever someone wants to
  get started rolling up, aggregating or consolidating their private-markets
  fund statements (capital account statements, investor statements, quarterly LP
  reports) for the first time; whenever they say they want to set up, build, or
  create a portfolio roll-up, a family-office portfolio tracker, or "a skill for
  my fund statements"; or whenever a webinar attendee wants to turn their own LP
  statements into a working roll-up and their own personalised skill. This is
  the starting point — it builds the roll-up once and then writes the person a
  bespoke skill so every future quarter is one step.
---

# Fund Roll-Up Starter

## What this is

A **one-time, guided setup**. It walks a limited partner (LP) or family office
from a folder of fund statements to two finished things:

1. **Their portfolio roll-up** — a clean workbook consolidating every fund.
2. **Their own roll-up skill** — a bespoke skill, named for them and aware of
   their funds, so every quarter after this is a single step.

Think of it as doing the hard first quarter *with* them, and leaving behind a
tool that makes every quarter after it easy.

## Who you are talking to

The person running this may not be technical and may not live in spreadsheets.
Be warm. Explain what is about to happen before each step and why. Avoid jargon
("assertion", "JSON", "schema") — say "the source file", "their decision", "the
settings". Never show raw file paths that look like system internals. Move at
their pace and check in.

## What you will need from them

- A **folder of fund statements** for one reporting period — PDFs and/or Excel
  files, capital account statements / investor statements / quarterly reports.
- Their **entity name**, e.g. "Beacon Hill Family Office, L.P." — used to name
  the roll-up and the skill.

If you do not have access to a folder on their computer, ask them to point you
at one before going further.

## The flow — seven steps

Work through these in order. Tell the person which step you are on.

### 1 — Welcome and gather inputs

Briefly explain the whole flow (the seven steps, in plain terms). Then ask where
their fund statements are, and their entity name. List the statement files you
can see and confirm the set with them before reading anything. Also confirm they
are all for the **same reporting period** -- e.g. "these all look like Q1 2026,
as of March 31 -- is that right?" This skill does one period at a time, so a
mixed-period folder is worth catching now.

### 2 — Find or create their roll-up template

Look in their folder for a roll-up spreadsheet they already use (a filename
containing "roll-up" or "portfolio"). If there is a clear one, ask whether they
want to build on it.

If they do not have one, give them the bundled starter: copy
`assets/roll-up-template.xlsx` into their folder. Open the copy and set cell
**A1** of the "Portfolio Roll-Up" sheet to their entity name. This blank
template is what the first roll-up is built from.

### 3 — Read their fund statements

Read every statement. For each fund, pull out the nine roll-up figures.
`references/reading-statements.md` is the full method — how to find each figure
whatever the statement calls it, how to handle statements reported in thousands,
Fund-vs-Investor's-Share columns, and multiple period columns. **Read that
reference file now** and follow it. Most LP statement formats are unfamiliar the
first time; the reference shows how to decode any of them from first principles.

As you read, keep brief notes on *where* each figure came from on each
statement — you will need them in steps 5 and 6.

### 4 — Apply the standard conventions

No quiz here. A few normalisation choices have a clear standard answer — so apply
the standard automatically and just *tell* the person, in plain language, what
you did. They can always say "do it differently", but they should never be
stopped to adjudicate finance terminology before they have seen a result.

Apply these, and narrate them briefly and warmly as you go:

- **Unfunded Commitment = Commitment − Paid-In.** The build script already does
  this; it is the standard measure. Some statements report a larger "unfunded"
  figure because they add back *recallable distributions* (returned cash a fund
  is allowed to call again later) — do not raise that term with the person. Only
  if a fund actually has recallable distributions, record it in that fund's
  Reconciliation Key entry — e.g. "statement shows $2.25M unfunded, including
  $750k recallable, which this roll-up excludes" — so the nuance is documented
  for anyone who checks, without anyone being quizzed on it.
- **Strategy.** Use the strategy the statement states. Where none is stated,
  infer it from the fund name and commentary (Venture Capital, Buyout, Growth
  Equity, Secondaries, Private Credit, Real Estate, Infrastructure,
  Fund-of-Funds) and flag the inference in the Reconciliation Key. Mention in
  passing which ones you inferred.
- **Reconciliation tab.** Always include the audit-trail tab — it records the
  source of every figure and is a strictly-additive extra tab.
- **Units and Investor's Share.** Convert any statement reported in thousands or
  millions to full dollars; where a statement shows both a whole-fund column and
  an Investor's Share column, use the Investor's Share. Just say you did.

If the person volunteers a specific preference — they want unfunded to include
recallable, or a strategy left blank — honour it. But lead with the standard;
do not ask.

### 5 — Build their roll-up

Assemble a build spec — one JSON file, one entry per fund, with the normalised
figures and a one-line source note for each figure. The exact spec format, with
a worked example, is in `references/reading-statements.md`. Save the spec as a
working file in their project folder (it is scratch, not a deliverable); the
copied blank template from step 2 also lives in their project folder. Then run:

```bash
python scripts/build_rollup.py <spec.json>
```

It produces a three-tab workbook — a current-state **dashboard** with a
value-over-time chart, a **History** log, and a **Reconciliation Key** — and
prints a verification table. Read that output; resolve any WARNING before
sharing. Then walk the person through the finished workbook, tab by tab, so they
understand what they have. When you walk the dashboard, pre-empt one thing a
financially literate person will notice: the portfolio-total row has **no Net
IRR** — that cell is intentionally blank because IRR cannot be added up across
funds. Say so before they wonder whether something is broken.

### 6 — Generate their personal skill

This is the payoff. Create a new skill folder named `<org-slug>-fund-rollup`
(e.g. `beacon-hill-fund-rollup` — lower-case, hyphenated form of their entity
name) containing:

- **`SKILL.md`** — copy `assets/generated-skill-template.md` and save it as
  `SKILL.md` in the new folder, then replace every `{{PLACEHOLDER}}`: their
  entity name (`{{ORG_NAME}}`), the org slug (`{{ORG_SLUG}}`), the roll-up
  filename (`{{ROLLUP_FILE}}`), and a one-line summary of the conventions applied
  (`{{CONVENTIONS_NOTE}}`) — normally the standard set; if the person asked for a
  non-standard choice, reflect that here.
- **`scripts/build_rollup.py`** — copy this skill's `scripts/build_rollup.py`
  unchanged. It is the generic engine; it needs no edits.
- **`references/reading-statements.md`** — copy this skill's reference unchanged.
- **`references/your-fund-formats.md`** — **write this fresh.** For each of the
  person's funds, document the statement you just read as a worked example:
  the administrator/format, where each of the nine figures sat, the units, and
  any quirk (Fund-vs-Investor columns, missing since-inception column, a
  multiple labelled "Net Multiple", etc.). Next quarter their skill reads this
  and recognises their funds instantly.

Then package the folder into an installable file: a `.skill` file is simply a
zip archive of the skill folder. Zip `<org-slug>-fund-rollup/` and name the
archive `<org-slug>-fund-rollup.skill`. Save it into the person's folder.

### 7 — Hand off

Present two files: the finished roll-up workbook and the `.skill` file. Explain,
simply:

- Install the `.skill` file (the app has a "Save skill" button on it).
- From next quarter on, they drop the new statements into a folder and ask for
  their roll-up by name (e.g. "update the Beacon Hill fund roll-up"). Their skill
  refreshes the dashboard, adds a new point to the History chart, and rebuilds
  the audit trail — no need to run this starter again.

Congratulate them — they now have both the roll-up and the tool.

## Notes

- One reporting period at a time. If they hand you several quarters, do the most
  recent for the build, and mention their new skill can backfill the others.
- If a statement is genuinely unreadable or a figure cannot be found, say so
  plainly and ask the person rather than guessing.
- The generated skill is theirs — named for them, aware of their funds. It is not
  a copy of anyone else's.
