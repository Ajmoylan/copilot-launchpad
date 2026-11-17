# COPILOT // LAUNCHPAD

**An interactive GitHub Copilot partner enablement dashboard: size the opportunity, plan the
pilot, track adoption and run a 30/60/90-day programme.**

[![ci](https://github.com/Ajmoylan/copilot-launchpad/actions/workflows/ci.yml/badge.svg)](https://github.com/Ajmoylan/copilot-launchpad/actions/workflows/ci.yml)
[![codeql](https://github.com/Ajmoylan/copilot-launchpad/actions/workflows/codeql.yml/badge.svg)](https://github.com/Ajmoylan/copilot-launchpad/actions/workflows/codeql.yml)
[![pages](https://github.com/Ajmoylan/copilot-launchpad/actions/workflows/pages.yml/badge.svg)](https://github.com/Ajmoylan/copilot-launchpad/actions/workflows/pages.yml)

### ▶ [Open the live dashboard](https://ajmoylan.github.io/copilot-launchpad/)

> **Independent demonstration.** This is a portfolio project, not an official GitHub,
> Microsoft or Arrow product. All organisations and adoption figures are fictional, and all
> prices and margins are adjustable assumptions, not commercial terms.

## The business problem

Organisations considering GitHub Copilot, and the partners and resellers who support them, need
answers to the same questions early on: *which customers are ready, how many licences could they
adopt, what is that worth, and how do we get from a pilot to a confident rollout?* That work is
often spread across spreadsheets, slide decks and email. A solutions specialist needs to combine
the commercial story (opportunity size, spend, partner margin) with the technical one (pilot
design, governance, enablement and adoption measurement) in one conversation.

## What the dashboard demonstrates

| Section | What it does |
|---|---|
| **01 Overview** | A pipeline of five fictional customers: eligible developers, potential licences, illustrative spend and partner margin, licences by customer (chart), pilot-to-rollout progression and an opportunity table with next steps. |
| **02 Revenue Calculator** | Adjust eligible developers, adoption %, monthly licence cost and partner margin %. See adopted licences, monthly and annual customer spend and annual partner gross margin, with the formulas and a worked calculation. Invalid input is rejected with a clear message. |
| **03 Adoption Dashboard** | A 12-week example programme for one fictional customer: eligible developers, pilot participants, adopted licences and adoption %, adoption against target over time (two charts) and a week picker. Explains how real adoption would be measured. |
| **04 30/60/90 Roadmap** | Discover and Prepare, Pilot and Enable, Evaluate and Expand: 15 activities with expandable guidance, completion checkboxes and per-phase and overall progress. |

**Target audience:** Microsoft and GitHub solutions specialists, channel partner managers and
resellers supporting organisations that are evaluating or rolling out GitHub Copilot.

## Technology and architecture

- **React 19 + TypeScript 7**, built with **Vite 8**; charts with **Recharts**.
- **Vitest + Testing Library** for unit and UI tests (jsdom).
- **GitHub Actions** for CI and deployment; hosted on **GitHub Pages** (free, static).
- No backend, database, accounts, cookies, analytics or external requests: everything runs in
  the browser.

```
src/
  lib/revenue.ts        revenue model: input parsing and validation, calculation, formatting
  lib/adoption.ts       adoption % and target-vs-actual from programme snapshots
  lib/opportunities.ts  sizes each fictional opportunity with the revenue model
  data/demo.ts          DEMONSTRATION DATA: fictional customers and a 12-week programme
  data/roadmap.ts       the 30/60/90-day programme content
  sections/             Overview, RevenueCalculator, AdoptionDashboard, Roadmap
  navigation.ts         sections and hash-based routing (#calculator, #roadmap, …)
```

Calculation logic is plain TypeScript with no React, so it's tested directly. Sections are
linkable through the URL hash, which also works with the browser's back button and on GitHub
Pages without server routing.

## How the calculations work

All inputs are user assumptions. The defaults (500 developers, 60% adoption, 19 per user per month
and 10% margin) are placeholders for a demonstration, **not** official prices or programme terms.

```
Adopted licences             = round down(eligible developers × adoption %)
Monthly customer spend       = adopted licences × monthly cost per user
Annual customer spend        = monthly customer spend × 12
Annual partner gross margin  = annual customer spend × partner margin %
```

- Licences are rounded down to whole seats (conservative); money is rounded to cents.
- Inputs are validated before calculating: empty, non-numeric, infinite, negative, out-of-range
  and fractional developer counts are rejected with a message, and no estimate is shown until
  they're fixed. Limits: developers 0–1,000,000; percentages 0–100; cost 0–10,000.
- Not modelled: discounts, taxes, currency conversion, contract terms, ramp-up timing and
  services revenue. The currency selector changes the display only.
- **Adoption %** = adopted licences ÷ eligible developers (one decimal place). A week is "on
  track" when adoption is within 5 percentage points of the target.

## Synthetic data and real GitHub Copilot metrics

Everything on the Overview and Adoption pages is **fictional demonstration data**, labelled on
screen. The organisation names are Microsoft's well-known fictional sample companies (Contoso,
Fabrikam, Northwind Traders, Tailspin Toys and Woodgrove Bank). The app **doesn't connect to
GitHub, hold tokens or retrieve real Copilot usage**.

In a real implementation, adoption would be measured with the customer's permission from:

- **Copilot seat management:** which members have a seat assigned and when each seat was last
  active.
- **GitHub's Copilot usage metrics** (in the product and through the REST API), such as active
  and engaged users and feature-level usage for organisations and enterprises.
- **Customer-owned measures:** developer surveys and existing delivery metrics, compared with the
  success criteria agreed before the pilot.

That integration would need a backend so credentials never reach the browser. It isn't part of
this MVP. See [GitHub's Copilot documentation](https://docs.github.com/en/copilot) for current
features and terminology.

## Security, privacy and accessibility

- Static site with a **Content-Security-Policy** limited to the site's own files; no third-party
  scripts, fonts, cookies, storage or tracking. Roadmap progress lives in memory only.
- No personal data is collected. Inputs are numeric, parsed and range-checked.
- Repository controls: CI (audit, lint, typecheck, tests, build) on every PR; CodeQL for
  TypeScript and workflows; dependency review; Dependabot for npm and Actions; secret scanning
  with push protection; a ruleset on `main` requiring a pull request and passing checks; every
  action pinned to a full commit SHA with minimal `permissions`.
- Accessibility: semantic landmarks and headings, skip link, keyboard-operable navigation,
  inputs, checkboxes and disclosure buttons, visible focus, `aria-current`, `aria-expanded`,
  labelled progress bars and inputs with error messages, dark theme contrast, and reduced-motion
  support.

## Run it locally

```bash
git clone https://github.com/Ajmoylan/copilot-launchpad && cd copilot-launchpad
npm ci
npm run dev          # http://localhost:5173
npm test             # Vitest unit and UI tests
npm run lint && npm run typecheck
npm run build && npm run preview   # production build at /copilot-launchpad/
```

Requires Node.js 22 (see `.nvmrc`).

## Tests

42 Vitest tests in 6 files: revenue calculations (defaults, rounding, floating-point edge cases,
zero and boundary values, invalid inputs), input parsing and error messages, adoption
percentages and status, the example data's consistency, the calculator UI (recalculation,
validation errors, reset, currency), the adoption week picker, roadmap interactions (expand,
collapse, complete, progress, reset, keyboard) and navigation (sections, URL hash, focus
management, demonstration labels).

## Known limitations and future development

- Demonstration data only; no live GitHub data. A future version could read the Copilot usage
  metrics and seat APIs for a consenting organisation through a small backend with OAuth.
- Roadmap progress isn't saved between visits (by design for the MVP); export to PDF or CSV and
  saved plans would be natural next steps.
- One currency at a time and no discounts, taxes or multi-year terms in the calculator.
- The production JavaScript bundle is about 194 KB gzipped, mostly the charting library; code
  splitting per section would reduce the initial load.
- Not a CRM, pricing tool or official methodology.

## Development note

This project was developed using AI-assisted coding tools. Its functionality is supported by
automated tests, CI and security scanning, and its data and financial figures are clearly
labelled as illustrative.

## License

[MIT](LICENSE)
