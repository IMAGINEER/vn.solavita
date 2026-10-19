# LOAD & RUNTIME per-package layout — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current 4-illustrative-row placeholder in the LOAD & RUNTIME section with per-package rows that match the user's reference screenshots (Oct 2026), so `/solutions/home-solar` shows 3 HOME rows and `/solutions/business-solar` shows 3 BUSINESS rows.

**Architecture:** Extend `SolutionDetail` with an optional `loadBreakdown` field holding per-package runtime values. Rewrite the shared `LoadRuntimeSection` in `CollectionPage.tsx` to render one `<LoadRow>` per package, plus a single CTA button and a "Backup runtimes are estimates" caveat above the existing PSH/NASA POWER footnote.

**Tech Stack:** Next.js 15 (per `AGENTS.md` warning: APIs may differ from training data), React 19, TypeScript strict mode, Tailwind CSS, Lucide icons (`lucide-react`), Motion (`motion/react`). Existing patterns in `components/solutions/CollectionPage.tsx` (shared component used by both `/solutions/home-solar` and `/solutions/business-solar`).

## Global Constraints

- NG content strategy applies: no fabricated facts; runtime values are labeled "Est." with a "Backup runtimes are estimates" caveat. (Memory: [ng-content-strategy.md](../projects/d--NG-solavita/memory/ng-content-strategy.md).)
- Single source of truth for the package list is `solutionDetails` in `lib/data/solutions.ts`. All six entries must set `loadBreakdown`.
- Existing `#load-runtime` anchor, existing `py-16 md:py-20 bg-white scroll-mt-24` section spacing, and existing PSH/NASA POWER footnote paragraph (lines 412–420 in the current `CollectionPage.tsx`) are preserved verbatim.
- Single CTA target is `/contact-us` (matches the existing Tailored CTA block immediately below this section).
- Icons resolve via Lucide (`lucide-react`); new icons added to the existing import: `Fan`, `Refrigerator`, `WashingMachine`, `Microwave`, `AirVent`.
- No new image files. Uses existing `sol.imagePath` (already in `solutionDetails`).
- TypeScript strict mode. `npx tsc --noEmit` must pass after every change.
- Conventional Commits message format (matches existing log: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`).
- Per `AGENTS.md`: "This is NOT the Next.js you know. This version has breaking changes." Before writing App Router code, read `node_modules/next/dist/docs/` if any pattern is unclear. (This plan only modifies an existing client component — no new routes or App Router patterns introduced.)

### Why no formal unit tests

The project has no test infrastructure (no `vitest.config`, no `jest.config`, no `__tests__/` directories). Adding a test runner for this single UI/data change would be larger than the change itself and conflicts with YAGNI. TypeScript compilation is the type-correctness check; visual verification in Task 3 is the runtime correctness check. If a future change adds a test runner, the per-package data values in Task 1 are an obvious candidate for unit tests.

---

### Task 1: Add `loadBreakdown` to `SolutionDetail` and populate on all six entries

**Files:**
- Modify: `lib/data/solutions.ts` (add 3 new exported types, 1 new field on `SolutionDetail`, 6 new object literals on existing entries)

**Interfaces:**
- Produces: `LoadBreakdownIconKey`, `LoadBreakdownRow`, `LoadBreakdown` exported types; `solutionDetails[i].loadBreakdown?: LoadBreakdown` populated on all six entries.

- [ ] **Step 1: Add the new types after the `SolutionFaq` interface**

Locate the `SolutionFaq` interface (around line 220–224 of `lib/data/solutions.ts`). Insert the following block immediately after it, before `/** One image in the gallery... */`:

```ts
/** Lucide icon key used by a LOAD & RUNTIME row chip. */
export type LoadBreakdownIconKey =
  | 'tv'
  | 'lightbulb'
  | 'snowflake'
  | 'fan'
  | 'refrigerator'
  | 'airvent'
  | 'washing-machine'
  | 'droplet'
  | 'microwave'

/** One appliance chip in the LOAD & RUNTIME breakdown strip. */
export interface LoadBreakdownRow {
  icon: LoadBreakdownIconKey
  /** Display name (e.g. "Lighting", "AC (Light)", "Refrigerator/Freezer"). */
  name: string
  /** Estimated runtime in hours. */
  hours: number
}

/** Per-package LOAD & RUNTIME data consumed by `<LoadRow>`. */
export interface LoadBreakdown {
  /** Icon shown in the row's header strip. */
  headerIcon: LoadBreakdownIconKey
  /** Headline est. runtime (e.g. 4 for LITE, 12 for Flagship). */
  headerHours: number
  /** Pill label at the top of the row. */
  scenarioLabel: string
  /** One chip per appliance. */
  rows: LoadBreakdownRow[]
}
```

- [ ] **Step 2: Add `loadBreakdown?: LoadBreakdown` to the `SolutionDetail` interface**

In the `SolutionDetail` interface (around line 233), add the field after `lifestyleGallery` (and before the `priceNgn` comment block):

```ts
  /**
   * Per-package LOAD & RUNTIME data. Drives the LOAD & RUNTIME section
   * on the collection pages; see `LoadBreakdown` below.
   */
  loadBreakdown?: LoadBreakdown
```

- [ ] **Step 3: Populate `loadBreakdown` on LITE Essential Backup**

In the `solutionDetails` array, find the `lite-essential-backup` entry (starts at the `id: 'lite-essential-backup',` line). Add `loadBreakdown` after the `lifestyleGallery: [...]` block and before `imagePath`:

```ts
    loadBreakdown: {
      headerIcon: 'tv',
      headerHours: 4,
      scenarioLabel: 'Perfect for: Family Homes',
      rows: [
        { icon: 'tv', name: 'TV', hours: 4 },
        { icon: 'lightbulb', name: 'Lighting', hours: 10 },
        { icon: 'fan', name: 'Ceiling Fan', hours: 12 },
        { icon: 'refrigerator', name: 'Refrigerator', hours: 24 },
        { icon: 'airvent', name: 'AC (Light)', hours: 4 },
      ],
    },
```

- [ ] **Step 4: Populate `loadBreakdown` on HOME Standard**

Find the `home-standard` entry and add after `lifestyleGallery`:

```ts
    loadBreakdown: {
      headerIcon: 'tv',
      headerHours: 6,
      scenarioLabel: 'Perfect for: Family Homes',
      rows: [
        { icon: 'tv', name: 'TV', hours: 6 },
        { icon: 'lightbulb', name: 'Lighting', hours: 10 },
        { icon: 'washing-machine', name: 'Washer', hours: 3 },
        { icon: 'refrigerator', name: 'Refrigerator', hours: 24 },
        { icon: 'airvent', name: 'AC (Light)', hours: 8 },
      ],
    },
```

- [ ] **Step 5: Populate `loadBreakdown` on HOME High-spec**

Find the `home-high-spec` entry and add after `lifestyleGallery`:

```ts
    loadBreakdown: {
      headerIcon: 'tv',
      headerHours: 6,
      scenarioLabel: 'Perfect for: Family Homes',
      rows: [
        { icon: 'tv', name: 'TV', hours: 6 },
        { icon: 'lightbulb', name: 'Lighting', hours: 10 },
        { icon: 'washing-machine', name: 'Washer', hours: 3 },
        { icon: 'refrigerator', name: 'Refrigerator', hours: 24 },
        { icon: 'airvent', name: 'AC (Light)', hours: 8 },
        { icon: 'microwave', name: 'Microwave', hours: 2 },
      ],
    },
```

- [ ] **Step 6: Populate `loadBreakdown` on BUSINESS Entry 3-Phase**

Find the `business-entry-3-phase` entry and add after `lifestyleGallery`:

```ts
    loadBreakdown: {
      headerIcon: 'tv',
      headerHours: 8,
      scenarioLabel: 'Heavy Duty & Business',
      rows: [
        { icon: 'tv', name: 'TV', hours: 8 },
        { icon: 'lightbulb', name: 'Lighting', hours: 12 },
        { icon: 'droplet', name: 'Pump', hours: 4 },
        { icon: 'refrigerator', name: 'Refrigerator', hours: 24 },
        { icon: 'airvent', name: 'AC (Light)', hours: 10 },
        { icon: 'microwave', name: 'Microwave', hours: 2 },
      ],
    },
```

- [ ] **Step 7: Populate `loadBreakdown` on BUSINESS Standard 3-Phase**

Find the `business-standard-3-phase` entry and add after `lifestyleGallery`:

```ts
    loadBreakdown: {
      headerIcon: 'tv',
      headerHours: 10,
      scenarioLabel: 'Heavy Duty & Business',
      rows: [
        { icon: 'tv', name: 'TV', hours: 10 },
        { icon: 'lightbulb', name: 'Lighting', hours: 12 },
        { icon: 'droplet', name: 'Pump', hours: 6 },
        { icon: 'refrigerator', name: 'Refrigerator/Freezer', hours: 12 },
        { icon: 'airvent', name: 'AC (Light)', hours: 12 },
      ],
    },
```

- [ ] **Step 8: Populate `loadBreakdown` on BUSINESS Flagship 3-Phase**

Find the `business-flagship-3-phase` entry and add after `lifestyleGallery`:

```ts
    loadBreakdown: {
      headerIcon: 'lightbulb',
      headerHours: 12,
      scenarioLabel: 'Heavy Duty & Business',
      rows: [
        { icon: 'lightbulb', name: 'Lighting', hours: 12 },
        { icon: 'droplet', name: 'Pump', hours: 8 },
        { icon: 'refrigerator', name: 'Refrigerator', hours: 6 },
        { icon: 'airvent', name: 'AC (Light)', hours: 12 },
        { icon: 'refrigerator', name: 'Freezer', hours: 6 },
      ],
    },
```

- [ ] **Step 9: Verify TypeScript compiles**

Run from repo root: `npx tsc --noEmit`
Expected: no output, exit code 0. If errors, fix them before continuing.

- [ ] **Step 10: Commit**

```bash
git add lib/data/solutions.ts
git commit -m "feat: add loadBreakdown to SolutionDetail for LOAD & RUNTIME section"
```

---

### Task 2: Rewrite `LoadRuntimeSection` to render per-package rows

**Files:**
- Modify: `components/solutions/CollectionPage.tsx` (extend Lucide imports, add icon resolver, rewrite `LoadRuntimeSection`, add `<LoadRow>`, add CTA + caveat, remove `ILLUSTRATIVE_LOAD_ROWS`)

**Interfaces:**
- Consumes: `props.solutions` (already in `CollectionPageProps`), `LoadBreakdown` / `LoadBreakdownIconKey` / `LoadBreakdownRow` types from Task 1, `SolutionDetail`, `LucideIcon`.
- Produces: updated `<LoadRuntimeSection>` rendering per-package rows + CTA + caveat + footnote.

- [ ] **Step 1: Extend the Lucide import**

Current import (top of file):
```ts
import {
  Check,
  ChevronDown,
  Lightbulb,
  Tv,
  Snowflake,
  Droplet,
  PanelTop,
  Zap,
  Battery,
  Construction,
} from 'lucide-react'
```

Replace with:
```ts
import {
  Check,
  ChevronDown,
  Lightbulb,
  Tv,
  Snowflake,
  Droplet,
  PanelTop,
  Zap,
  Battery,
  Construction,
  Fan,
  Refrigerator,
  WashingMachine,
  Microwave,
  AirVent,
} from 'lucide-react'
```

- [ ] **Step 2: Extend the React import to include `Fragment`**

Current import (line 3):
```ts
import { useEffect, useRef, useState, type ReactNode } from 'react'
```

Replace with:
```ts
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'
```

- [ ] **Step 3: Update the `@/lib/data/solutions` type import**

Find the existing line:
```ts
import type { SolutionDetail } from '@/lib/data/solutions'
```

Replace with:
```ts
import type {
  LoadBreakdown,
  LoadBreakdownIconKey,
  SolutionDetail,
} from '@/lib/data/solutions'
```

- [ ] **Step 4: Add `LOAD_BREAKDOWN_ICONS` resolver near the top of the file**

Find the existing `const ILLUSTRATIVE_LOAD_ROWS: LoadRow[] = [...]` block (around line 368) and replace it (and the `interface LoadRow` block just above it) with:

```ts
const LOAD_BREAKDOWN_ICONS: Record<LoadBreakdownIconKey, LucideIcon> = {
  tv: Tv,
  lightbulb: Lightbulb,
  snowflake: Snowflake,
  fan: Fan,
  refrigerator: Refrigerator,
  airvent: AirVent,
  'washing-machine': WashingMachine,
  droplet: Droplet,
  microwave: Microwave,
}
```

- [ ] **Step 5: Replace `LoadRuntimeSection` and add `<LoadRow>`**

Find the existing `function LoadRuntimeSection() { ... }` block (around lines 375–424, ending just before the `Components in Detail` section comment). Replace it with:

```tsx
function LoadRuntimeSection({ solutions }: { solutions: SolutionDetail[] }) {
  const rows = solutions.filter((s) => s.loadBreakdown)
  return (
    <section
      id="load-runtime"
      className="relative py-16 md:py-20 bg-white scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <SectionEyebrow>LOAD &amp; RUNTIME</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
            Not sure which fits?{' '}
            <span className="text-gradient">Request a tailored config.</span>
          </h2>
        </div>
        <div className="space-y-4">
          {rows.map((sol) => (
            <LoadRow
              key={sol.id}
              sol={sol}
              breakdown={sol.loadBreakdown!}
            />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/contact-us"
            className="btn-gradient px-6 py-3 rounded-full text-sm font-cw-bold text-white"
          >
            Request a tailored config →
          </Link>
        </div>
        <p className="mt-8 text-xs text-uk-slate font-cw-regular leading-relaxed max-w-4xl mx-auto">
          <strong className="font-cw-bold text-uk-navy">Backup runtimes are estimates.</strong>{' '}
          Actual runtime depends on connected load and operating conditions.
        </p>
        <p className="mt-3 text-xs text-uk-slate font-cw-regular leading-relaxed max-w-4xl mx-auto">
          Based on average 5.5 peak sun hours/day for representative
          Nigerian off-grid towns (Lagos/Abuja/North-Central band, NASA
          POWER / GVE 10-yr monitoring avg), after 5.9% system losses,
          96% inverter efficiency, clipping and battery round-trip losses.
          Wet-season worst-month PSH ~3.5–4.0h in Lagos / ~4.0–4.5h in
          Abuja — actual savings may run 10–20% lower in peak rainy
          months, higher in dry season.
        </p>
      </div>
    </section>
  )
}

function LoadRow({
  sol,
  breakdown,
}: {
  sol: SolutionDetail
  breakdown: LoadBreakdown
}) {
  const HeaderIcon = LOAD_BREAKDOWN_ICONS[breakdown.headerIcon]
  const filledCells = Math.min(5, Math.round(breakdown.headerHours / 3))
  return (
    <article className="rounded-2xl border border-uk-line bg-white overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Left: scene image */}
        <div className="aspect-[4/3] md:aspect-auto bg-uk-line/30 overflow-hidden">
          <img
            src={sol.imagePath}
            alt={sol.imageAlt}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right: content */}
        <div className="p-5 md:p-6 flex flex-col gap-4">
          {/* scenarioLabel pill */}
          <div className="self-start">
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-uk-line bg-uk-line/30 text-[10px] font-cw-bold uppercase tracking-wider text-uk-teal-dark">
              {breakdown.scenarioLabel}
            </span>
          </div>

          {/* Header strip: icon + 5-cell battery + Est. hours */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-uk-emerald/10 text-uk-emerald flex items-center justify-center flex-shrink-0">
              <HeaderIcon className="w-5 h-5" strokeWidth={1.8} />
            </div>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-6 h-3 ${
                    i < filledCells ? 'bg-uk-emerald' : 'bg-uk-line/60'
                  } rounded-sm`}
                />
              ))}
            </div>
            <span className="text-sm font-cw-bold text-uk-navy">
              Est. {breakdown.headerHours}h
            </span>
          </div>

          {/* Load breakdown chips */}
          <div className="flex flex-wrap items-center gap-2">
            {breakdown.rows.map((row, i) => {
              const RowIcon = LOAD_BREAKDOWN_ICONS[row.icon]
              return (
                <Fragment key={i}>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-uk-line/40 text-xs text-uk-navy">
                    <RowIcon
                      className="w-3.5 h-3.5 text-uk-emerald"
                      strokeWidth={1.8}
                    />
                    <span className="font-cw-regular">{row.name}</span>
                    <span className="font-cw-bold text-uk-teal-dark">
                      ×{row.hours}h
                    </span>
                  </span>
                  {i < breakdown.rows.length - 1 && (
                    <span className="text-uk-slate text-xs">+</span>
                  )}
                </Fragment>
              )
            })}
          </div>
        </div>
      </div>
    </article>
  )
}
```

- [ ] **Step 6: Update the `<LoadRuntimeSection />` call site**

Find the line in `CollectionPage` that renders the section (around line 108):
```tsx
<LoadRuntimeSection />
```

Replace with:
```tsx
<LoadRuntimeSection solutions={props.solutions} />
```

- [ ] **Step 7: Verify TypeScript compiles**

Run from repo root: `npx tsc --noEmit`
Expected: no output, exit code 0. If errors, fix them before continuing.

- [ ] **Step 8: Commit**

```bash
git add components/solutions/CollectionPage.tsx
git commit -m "feat: render per-package LOAD & RUNTIME rows on collection pages"
```

---

### Task 3: Visual verification on both pages

**Files:**
- Read only: `app/solutions/home-solar/PageClient.tsx`, `app/solutions/business-solar/PageClient.tsx`
- No edits expected; if any visual mismatch is found, fix it in `components/solutions/CollectionPage.tsx` and commit with `fix:` or `style:` prefix.

- [ ] **Step 1: Start the Next.js dev server**

Run from repo root: `npm run dev`
Expected: dev server starts on a port (typically 3000). Leave it running.

- [ ] **Step 2: Open `/solutions/home-solar` in a browser and verify**

Open `http://localhost:3000/solutions/home-solar`. Check that:
- [ ] Section eyebrow reads `LOAD & RUNTIME`
- [ ] Heading reads `Not sure which fits? Request a tailored config.` with the second clause in gradient color
- [ ] 3 rows appear in this order: LITE Essential Backup, HOME Standard, HOME High-spec
- [ ] Each row has the scene image on the left (mobile: stacked above content)
- [ ] Each row's scenarioLabel pill reads `Perfect for: Family Homes`
- [ ] Each row's header strip: TV icon + filled battery cells (1 for LITE / 2 for HOME Standard / 2 for HOME High-spec) + `Est. 4h` / `Est. 6h` / `Est. 6h` text
- [ ] Each row's load chips match the spec values (e.g. LITE shows TV ×4h + Lighting ×10h + Ceiling Fan ×12h + Refrigerator ×24h + AC (Light) ×4h)
- [ ] CTA button `Request a tailored config →` appears below the rows, styled as a gradient pill
- [ ] "Backup runtimes are estimates." caveat appears above the existing PSH/NASA POWER footnote
- [ ] Existing PSH/NASA POWER footnote paragraph is unchanged from before

- [ ] **Step 3: Open `/solutions/business-solar` and verify**

Open `http://localhost:3000/solutions/business-solar`. Check that:
- [ ] Same section header and CTA structure as the HOME page
- [ ] 3 rows appear: BUSINESS Entry 3-Phase, BUSINESS Standard 3-Phase, BUSINESS Flagship 3-Phase
- [ ] Each row's scenarioLabel pill reads `Heavy Duty & Business`
- [ ] BUSINESS Entry: TV icon, 3 battery cells, `Est. 8h`, strip TV ×8h + Lighting ×12h + Pump ×4h + Refrigerator ×24h + AC (Light) ×10h + Microwave ×2h
- [ ] BUSINESS Standard: TV icon, 3 battery cells, `Est. 10h`, strip TV ×10h + Lighting ×12h + Pump ×6h + Refrigerator/Freezer ×12h + AC (Light) ×12h
- [ ] BUSINESS Flagship: **Lighting** icon (not TV), 4 battery cells (12h / 3 → 4), `Est. 12h`, strip starts with Lighting ×12h (no TV chip)

- [ ] **Step 4: Check the browser console for errors**

Open DevTools → Console. There should be no React, Next.js, or hydration errors.

- [ ] **Step 5: Commit any visual fixes if needed**

If Step 2 or Step 3 revealed any visual mismatch (e.g. wrong icon, wrong chip order, wrong battery cell count), edit `components/solutions/CollectionPage.tsx` to correct it, then:
```bash
git add components/solutions/CollectionPage.tsx
git commit -m "fix: <short description of what was corrected>"
```

If everything looks correct, skip this step — the section is done.

- [ ] **Step 6: Stop the dev server**

Press `Ctrl+C` in the terminal where `npm run dev` is running.

---

## Self-Review Checklist (run after all 3 tasks)

- [ ] Both `/solutions/home-solar` and `/solutions/business-solar` show the new section
- [ ] Each row has scene image, scenarioLabel pill, header strip, load chips
- [ ] CTA `Request a tailored config →` links to `/contact-us`
- [ ] "Backup runtimes are estimates" caveat + PSH/NASA POWER footnote preserved
- [ ] No new image files added (uses existing `sol.imagePath`)
- [ ] No change to other sections (PRODUCT, Smart Monitor, Tailored CTA, FAQ)
- [ ] `tsc --noEmit` passes after both commits
- [ ] Conventional Commits format used on every commit
- [ ] All 6 `solutionDetails` entries have `loadBreakdown` set
- [ ] `ILLUSTRATIVE_LOAD_ROWS` constant removed from `CollectionPage.tsx`
- [ ] Lucide import extended with `Fan`, `Refrigerator`, `WashingMachine`, `Microwave`, `AirVent`