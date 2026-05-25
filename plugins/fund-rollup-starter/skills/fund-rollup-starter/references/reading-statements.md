# Reading any fund statement

How to pull the nine roll-up figures out of a limited-partner fund statement,
whatever its format. This is the shared method used both to build a roll-up and
to keep one current each quarter.

## Contents

- [The nine fields](#fields)
- [Conventions — the judgment calls](#conventions)
- [Anatomy of a statement](#anatomy)
- [Decoding an unfamiliar statement](#decoding)
- [The build spec](#spec)

---

## The nine fields {#fields}

The roll-up has one row per fund. Five figures are keyed from the statement; the
build script computes the rest.

**Keyed from the statement:** Commitment, Paid-In Capital, Cumulative
Distributions, Current NAV, Net IRR — plus Strategy and Vintage.
**Calculated:** Unfunded Commitment, Total Value, DPI, TVPI.

Identify each field by what it *means*, not by a fixed label:

- **Commitment** — total capital the LP has committed to the fund, since
  inception. Labels: "Total Commitment", "Capital Commitment", "Commitment".
- **Paid-In Capital** — cumulative capital actually contributed/called since
  inception. Labels: "Capital Contributed to Date", "Cumulative Capital Drawn",
  "Called Capital", "Drawn to Date", "Contributed Capital". Use the cumulative
  figure, not the current quarter's call.
- **Cumulative Distributions** — total cash returned to the LP since inception.
  Labels: "Distributions" (in a since-inception column), "Cumulative
  Distributions", "Distributions to Date". If split into return of capital /
  gains / income, use the total.
- **Current NAV** — the LP's capital account fair value at period end. Labels:
  "Ending Balance", "Closing Balance", "Partners' Capital, End of Period", "Net
  Asset Value", "Capital Account at Fair Value".
- **Net IRR** — the since-inception net internal rate of return, as reported.
  Labels: "Net IRR", "Net Internal Rate of Return". Enter as a decimal
  (13.9% → 0.139).
- **Strategy** and **Vintage** — see Conventions; Vintage is the vintage year as
  stated.

Computed: Unfunded = Commitment − Paid-In · Total Value = NAV + Distributions ·
DPI = Distributions / Paid-In · TVPI = Total Value / Paid-In.

---

## Conventions — the judgment calls {#conventions}

These keep the roll-up comparable across fund administrators. Apply them
consistently.

1. **Units.** If a statement says figures are in thousands ("$'000s", "USD
   thousands", "in thousands"), multiply every monetary figure by 1,000; if in
   millions, by 1,000,000. The roll-up holds full dollars. The units line hides
   in the header or a footnote — check every statement.

2. **Fund vs Investor's Share.** Some statements show a whole-Fund column beside
   an Investor's Share (or "Limited Partner's Share") column. Always use the
   Investor's Share — the roll-up is this LP's position, not the fund's. A figure
   that looks an order of magnitude too large usually means the Fund column was
   taken by mistake.

3. **Period columns.** A statement may show several periods side by side
   (Current Quarter, Last 12 Months, Since Inception). Every roll-up figure is a
   since-inception or period-end figure, so take Paid-In, Distributions and NAV
   from the **Since Inception** column. If there is no Since Inception column,
   the cumulative figures live in a separate "Commitment Summary" / "Commitment
   & Funding" block, and NAV is the closing balance of the activity table.

4. **Unfunded Commitment.** Computed as Commitment − Paid-In. A statement's own
   "Unfunded" / "Remaining" / "Undrawn" figure sometimes adds back recallable
   distributions and will be larger. The standard convention excludes recallable
   distributions; note the recallable amount in the reconciliation so the
   difference is explained. (If the LP chose to include recallable, follow their
   choice instead and say so.)

5. **Strategy.** Normalise to a short standard label: Venture Capital, Growth
   Equity, Buyout, Secondaries, Private Credit, Real Estate, Infrastructure,
   Fund-of-Funds. If the statement states a strategy, normalise it. If it states
   none, infer from the fund name and commentary and flag the inference.

6. **Net of fees.** NAV must be the net capital account value — net of
   management fees, fund/partnership expenses and carried interest.

7. **Net IRR** is entered per fund as reported and is never aggregated. The
   portfolio IRR is left blank — IRR is not additive across funds.

---

## Anatomy of a statement {#anatomy}

Almost every LP statement, whatever it is called, has the same three parts:

1. **A header** — fund name, the LP's name, vintage, currency, and crucially the
   **units** and the **reporting period**.
2. **A commitment / funding summary** — Commitment, capital called to date,
   unfunded. Usually where since-inception Commitment and Paid-In live.
3. **A capital account roll-forward** — opening balance, contributions,
   distributions, fees, gains/losses, closing balance. The **closing balance is
   NAV**. May have one period column or several.

Plus a **performance** block (DPI, TVPI/multiple, Net IRR).

Map every line to one of the nine fields by meaning. The label is a hint, not
the truth.

---

## Decoding an unfamiliar statement {#decoding}

When a statement matches nothing you have seen, work from first principles:

1. **Units and currency** — header line and footnotes. Thousands? Millions? A
   currency other than USD? Resolve this before reading any number.
2. **Whose figures?** — is there a Fund column and an Investor's / LP's Share
   column? Take the Investor's Share.
3. **Where are the cumulatives?** — look for a "Since Inception" column; if there
   is none, find the commitment/funding summary block. NAV is the closing/ending
   balance of the capital account.
4. **Map by meaning** — opening balance + contributions − distributions ± fees ±
   gains = closing balance. The closing balance is NAV. The line meaning
   "everything the LP has put in" is Paid-In, whatever it is called.
5. **Cross-check** — recompute DPI = Distributions / Paid-In and TVPI = (NAV +
   Distributions) / Paid-In, and compare to any multiple the statement prints
   ("TVPI", "Net Multiple", "Total Value to Paid-In", "Investment Multiple"). A
   mismatch almost always means a missed units conversion or a Fund-vs-Investor
   mix-up. Put the statement's reported multiples into the spec's `reported_dpi`
   / `reported_tvpi` so the build script runs this check automatically.

New structures — a Luxembourg SCSp, an in-kind distribution, a secondaries
fund's "acquired interests" language, a fund reporting in EUR — change the
vocabulary, not the method. Find the units, find whose figures, find the
cumulatives, map by meaning, cross-check.

---

## The build spec {#spec}

`scripts/build_rollup.py` takes one JSON file. Assemble it after reading the
statements. Shape:

```json
{
  "template_path": "/abs/path/to the blank roll-up template.xlsx",
  "existing_rollup_path": "/abs/path/to the living roll-up.xlsx",
  "output_path": "/abs/path/to the living roll-up.xlsx",
  "as_of": "March 31, 2026",
  "quarter_label": "Q1 2026",
  "reporting_currency": "USD",
  "funds": [
    {
      "name": "Example Ventures Fund III, L.P.",
      "strategy": "Venture Capital",
      "vintage": "2021",
      "commitment": 10000000,
      "paid_in": 7250000,
      "distributions": 0,
      "nav": 10900000,
      "net_irr": 0.168,
      "reported_dpi": 0.00,
      "reported_tvpi": 1.50,
      "source_file": "Example Ventures Fund III - Q1 2026.pdf  (PDF)",
      "reported_in": "US dollars (actual) -- no conversion needed.",
      "field_notes": {
        "Commitment": "Commitment Summary > Total Commitment.",
        "Paid-In Capital": "Commitment Summary > Capital Contributed to Date.",
        "Unfunded Commitment": "Formula: Commitment - Paid-In.",
        "Cumulative Distributions": "Since-Inception column > Distributions.",
        "Current NAV": "Since-Inception column > Ending Balance.",
        "Total Value": "Formula: NAV + Distributions.",
        "DPI": "Formula. Statement reports 0.00 -- ties out.",
        "TVPI": "Formula. Statement reports 1.50 -- ties out.",
        "Net IRR": "Performance section."
      },
      "watch_outs": "Two period columns; Since-Inception used."
    }
  ]
}
```

Key points:

- **First run ever:** omit `existing_rollup_path`. The run creates a fresh
  workbook from `template_path`.
- **Every later run:** set `existing_rollup_path` to the living workbook. The run
  updates it — refreshes the dashboard, appends this quarter's snapshot to the
  History tab. `output_path` is normally the same path (updated in place).
- Money fields are full dollars (already unit-converted). `net_irr` and the
  `reported_*` multiples are decimals.
- `field_notes` give a one-line source for each of the nine fields; they populate
  the Reconciliation Key. `reported_dpi` / `reported_tvpi` are the multiples the
  statement prints — the script cross-checks them and warns on a mismatch.
- Funds are matched to existing rows by exact name. When updating, use a fund's
  name exactly as it already appears in the roll-up.

After running, read the script's verification output. A WARNING means a
recomputed multiple disagrees with the statement — re-check that extraction
before sharing.
