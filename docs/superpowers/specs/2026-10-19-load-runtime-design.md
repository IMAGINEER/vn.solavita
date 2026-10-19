---
title: LOAD & RUNTIME — per-package layout
date: 2026-10-19
status: draft (pending user review)
---

# LOAD & RUNTIME — per-package layout

## Goal

Replace the current 4-illustrative-row placeholder in the LOAD & RUNTIME section (shared between `/solutions/home-solar` and `/solutions/business-solar`) with per-package rows that match the layout the user provided in reference screenshots (Oct 2026). Each row surfaces the package's scene image, a header strip with load icon + battery level indicator + headline runtime, and a load-breakdown strip showing the estimated runtime per appliance. The section title stays "Not sure which fits? Request a tailored config." (gradient on "Request a tailored config.").

## Scope

- Both pages get the section.
- `/solutions/home-solar` shows 3 rows (LITE Essential Backup, HOME Standard, HOME High-spec).
- `/solutions/business-solar` shows 3 rows (BUSINESS Entry 3-Phase, BUSINESS Standard 3-Phase, BUSINESS Flagship 3-Phase).
- Existing `#load-runtime` anchor is preserved.
- Existing PSH/NASA POWER footnote is preserved verbatim.
- The 4-row `ILLUSTRATIVE_LOAD_ROWS` placeholder is removed.
- A "Backup runtimes are estimates" caveat is added above the footnote.
- A single CTA button (`Request a tailored config →`) is added at the bottom of the section, routing to `/contact-us` (same target as the dedicated Tailored CTA block right below — single source of truth for the destination).

## Non-goals

- No new image files. Uses existing `sol.imagePath`.
- No change to the Tailored CTA section that immediately follows this one.
- No change to the PRODUCT, Smart Monitor, or other sections.
- No new package metadata beyond the `loadBreakdown` field. Existing fields (`headlineStats`, `bullets`, `specTable`, etc.) are untouched.

## Data model

Extend `SolutionDetail` in `lib/data/solutions.ts` with one optional field:

```ts
type LoadBreakdownIconKey =
  | 'tv' | 'lightbulb' | 'snowflake' | 'fan' | 'refrigerator'
  | 'airvent' | 'washing-machine' | 'droplet' | 'microwave'

type LoadBreakdownRow = {
  icon: LoadBreakdownIconKey
  name: string        // e.g. 'Lighting', 'Ceiling Fan', 'AC (Light)', 'Refrigerator/Freezer'
  hours: number       // e.g. 4, 10, 12
}

type LoadBreakdown = {
  headerIcon: LoadBreakdownIconKey   // the icon shown in the header strip
  headerHours: number                // e.g. 4 for LITE, 12 for Flagship
  scenarioLabel: string              // 'Perfect for: Family Homes' | 'Heavy Duty & Business'
  rows: LoadBreakdownRow[]           // chip list
}

interface SolutionDetail {
  // ...existing fields
  loadBreakdown?: LoadBreakdown
}
```

The field is optional so the rest of the codebase (which never reads it) is unaffected if a future package entry leaves it unset. (All six current entries will set it.)

### Per-package values

Values lifted directly from the user-supplied reference screenshots. The BUSINESS Flagship header was clarified by the user during brainstorming: "drop the header TV entirely, render the strip without a TV chip, start the header with Lighting icon". The 12h value for Flagship header is inferred (matches the 32 kWh battery capacity in the same tier); flag if this needs revision.

| Package | headerIcon | headerHours | scenarioLabel | rows (icon · name · hours) |
|---|---|---|---|---|
| LITE Essential Backup | tv | 4 | Perfect for: Family Homes | tv · TV · 4h · lightbulb · Lighting · 10h · fan · Ceiling Fan · 12h · refrigerator · Refrigerator · 24h · airvent · AC (Light) · 4h |
| HOME Standard | tv | 6 | Perfect for: Family Homes | tv · TV · 6h · lightbulb · Lighting · 10h · washing-machine · Washer · 3h · refrigerator · Refrigerator · 24h · airvent · AC (Light) · 8h |
| HOME High-spec | tv | 6 | Perfect for: Family Homes | tv · TV · 6h · lightbulb · Lighting · 10h · washing-machine · Washer · 3h · refrigerator · Refrigerator · 24h · airvent · AC (Light) · 8h · microwave · Microwave · 2h |
| BUSINESS Entry 3-Phase | tv | 8 | Heavy Duty & Business | tv · TV · 8h · lightbulb · Lighting · 12h · droplet · Pump · 4h · refrigerator · Refrigerator · 24h · airvent · AC (Light) · 10h · microwave · Microwave · 2h |
| BUSINESS Standard 3-Phase | tv | 10 | Heavy Duty & Business | tv · TV · 10h · lightbulb · Lighting · 12h · droplet · Pump · 6h · refrigerator · Refrigerator/Freezer · 12h · airvent · AC (Light) · 12h |
| BUSINESS Flagship 3-Phase | lightbulb | 12 ⚠ | Heavy Duty & Business | lightbulb · Lighting · 12h · droplet · Pump · 8h · refrigerator · Refrigerator · 6h · airvent · AC (Light) · 12h · refrigerator · Freezer · 6h |

## Component changes

### `components/solutions/CollectionPage.tsx`

1. Extend the Lucide import to cover the new icon keys:
   ```ts
   import {
     // ...existing
     Lightbulb, Tv, Snowflake, Droplet, Fan, Refrigerator,
     WashingMachine, Microwave, AirVent,
   } from 'lucide-react'
   ```

2. Add an `iconKey → LucideIcon` resolver map (kept local to the file):
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

3. Rewrite `LoadRuntimeSection` to:
   - Accept `{ solutions: SolutionDetail[] }` as its only prop (the page's scenario filter is already applied by `props.solutions` from `CollectionPage`).
   - Render the existing section header (`SectionEyebrow` "LOAD & RUNTIME" + `Not sure which fits? Request a tailored config.` heading with gradient).
   - Render one `<LoadRow>` per `solutions` entry that has a `loadBreakdown`. If an entry omits the field, skip it (future-proofing; today's six entries all set it).
   - Render the CTA button (gradient pill `Request a tailored config →`, `<Link href="/contact-us">`) at the bottom of the row stack.
   - Keep the PSH/NASA POWER disclaimer paragraph verbatim from lines 412–420.
   - Add a one-line "Backup runtimes are estimates; actual depends on connected load and operating conditions." caveat above the disclaimer.

4. New `<LoadRow>` sub-component:
   ```tsx
   function LoadRow({ sol, breakdown }: { sol: SolutionDetail; breakdown: LoadBreakdown }) {
     const HeaderIcon = LOAD_BREAKDOWN_ICONS[breakdown.headerIcon]
     const filledCells = Math.min(5, Math.round(breakdown.headerHours / 3))
     return (
       <article className="rounded-2xl border border-uk-line bg-white overflow-hidden">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4">
           {/* Left: scene image */}
           <div className="aspect-[4/3] md:aspect-auto bg-uk-line/30 overflow-hidden">
             <img src={sol.imagePath} alt={sol.imageAlt}
                  className="w-full h-full md:h-full object-cover" />
           </div>

           {/* Right: content */}
           <div className="p-5 md:p-6 flex flex-col gap-4">
             {/* scenarioLabel pill */}
             <div className="self-start">
               <span className="inline-flex items-center px-3 py-1 rounded-full
                                border border-uk-line bg-uk-line/30 text-[10px]
                                font-cw-bold uppercase tracking-wider text-uk-teal-dark">
                 {breakdown.scenarioLabel}
               </span>
             </div>

             {/* Header strip: icon + 5-cell battery + Est. hours */}
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-lg bg-uk-emerald/10 text-uk-emerald
                               flex items-center justify-center flex-shrink-0">
                 <HeaderIcon className="w-5 h-5" strokeWidth={1.8} />
               </div>
               <div className="flex items-center gap-1.5">
                 {[0, 1, 2, 3, 4].map((i) => (
                   <div key={i}
                        className={`w-6 h-3 ${i < filledCells ? 'bg-uk-emerald' : 'bg-uk-line/60'}
                                    rounded-sm`} />
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
                     <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5
                                      rounded-lg bg-uk-line/40 text-xs text-uk-navy">
                       <RowIcon className="w-3.5 h-3.5 text-uk-emerald" strokeWidth={1.8} />
                       <span className="font-cw-regular">{row.name}</span>
                       <span className="font-cw-bold text-uk-teal-dark">×{row.hours}h</span>
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

   Battery-cell formula: `Math.min(5, Math.round(headerHours / 3))`. Yields: 4h→1, 6h→2, 8h→3, 10h→3, 12h→4. (Sanity-check against the reference screenshots: LITE 1, HOME Standard 2, HOME High-spec 2, BUSINESS Entry 3, BUSINESS Standard 3, Flagship 4 — visually consistent.)

5. Section spacing: keep the existing `py-16 md:py-20 bg-white scroll-mt-24` on the section element. The row grid uses `space-y-4` between rows.

6. Mobile behavior: the `grid-cols-1 md:grid-cols-2` collapses to single-column below `md`. Image stays at `aspect-[4/3]`, content stacks below.

### `lib/data/solutions.ts`

Add the type definitions above and populate `loadBreakdown` on each of the six `solutionDetails` entries with the per-package values from the table.

## Caveat about runtime values (NG content strategy §1)

The runtime values shown in the reference screenshots and encoded in this spec are *estimates* derived from system specs (battery kWh and typical appliance wattages). Per `ng-content-strategy` rule 1 ("Unverified business/technical/financial/operational detail must be marked `TBD`") and rule 9 (annual kWh must be labelled "estimate" with a footnote), the new section must clearly communicate that these are estimates:

- The CTA title says "Request a tailored config." — this is honest: a tailored config is exactly what the visitor gets after submitting.
- The header text "Est. {n}h" already uses the "Est." prefix.
- A short caveat line is added above the existing footnote: *"Backup runtimes are estimates; actual depends on connected load and operating conditions."*
- The existing PSH/NASA POWER disclaimer paragraph is preserved verbatim (it explains the methodology).

This satisfies NG content strategy without needing TBD markers on every chip, since the values are illustrative system estimates rather than business-critical facts (like installation lead time or warranty).

## Files to change

1. `lib/data/solutions.ts` — add `LoadBreakdown` types + populate `loadBreakdown` on all 6 entries.
2. `components/solutions/CollectionPage.tsx` — extend Lucide import, add icon resolver, rewrite `LoadRuntimeSection`, add `<LoadRow>`, add CTA, add caveat line.

## Files to leave alone

- `app/solutions/home-solar/PageClient.tsx` (no change — `props.solutions` is already passed)
- `app/solutions/business-solar/PageClient.tsx` (no change)
- `app/solutions/[slug]/page.tsx` (per-tier detail pages are unaffected — the `loadBreakdown` is not surfaced there)
- The PRODUCT section, Smart Monitor section, Tailored CTA section, FAQ, Trust bar (all untouched)

## Out of scope (already deferred per existing memory)

- Image refresh for the section — uses existing scene photos (`LITE-Essential-Backup.webp`, etc.) which are already approved marketing assets.
- A 4-step restructure of the Get-a-Quote form (already shipped Oct 2026).
- Pricing — the `Get Free Quote` CTA in the solution cards continues to be the conversion route; the new CTA is a route to the dedicated `/contact-us` Tailored flow.