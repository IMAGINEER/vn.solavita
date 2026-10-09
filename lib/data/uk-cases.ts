/**
 * UK site case studies.
 *
 * Source of truth: the same thirteen IT / DE installations that the IT
 * site showcases under "Solavita in Europe". The UK site reuses them
 * as reference installs - same addresses, same figures, same slugs -
 * with only the descriptive prose translated from Italian to English.
 *
 * Rules (2026-09 correction):
 *   - DO translate: `description`, `systemLabel`, `shortResult`,
 *     `featuredTestimonial.quote`, plus any user-facing label that is
 *     prose ("anno" → "year", "Italia" → "Italy", etc.).
 *   - DO NOT change: `slug`, `city`, `region`, `postcode`, `country`,
 *     `annualGeneration`, `annualSaving` (EUR source), `imagePath`,
 *     `systemType`. Those are the facts.
 *
 * Currency: `annualSaving` stays in € (the installs are in IT/DE —
 * these are the real savings reported on-site). The UK UI displays
 * a GBP-equivalent figure via the derived `annualSavingGbp` field,
 * converted once at module load from `EUR_TO_GBP_PLACEHOLDER` below.
 * Thousands stay `1.234` (IT/DE locale) on the EUR source. Country
 * stays `IT` / `DE`. The UK's own £ / comma / GB apply to new
 * UK-native cases, of which there are none in this set.
 *
 * Image assets: every entry maps 1:1 to public/images/cases/{1..13}.webp.
 */

export type CaseSystemType =
  | 'Residential Solar'
  | 'Solar + Storage'
  | 'Smart Home / HEMS'
  | 'Heat Pump + Solar'

export interface CaseStudy {
  /** Stable slug - the URL segment for /cases/[slug]. */
  slug: string
  city: string
  /** Region / state label - kept in the original locale (Italian or German). */
  region: string
  /** Sigla provincia / Bundesland code (LE, UD, DE-NW, DE-HE, ...). */
  postcode: string
  /** System label - prose, translated to English. */
  systemLabel: string
  /** System category - used for filtering and the card eyebrow tag. */
  systemType: CaseSystemType
  /** Brief result - prose, translated to English. */
  shortResult: string
  /** One-paragraph case description - prose, translated to English. */
  description: string
  /** Path to the hero / card image. */
  imagePath: string
  /** Annual generation figure - fact, kept in IT/DE thousands format. */
  annualGeneration?: string
  /** Annual saving figure - EUR source, kept as `€1,809`-style IT/DE
   *  locale string. UI surfaces read `annualSavingGbp` (derived) so
   *  the on-page figure is in £; this field stays untouched as the
   *  source of truth. */
  annualSaving?: string
  /** UK-display saving - derived from `annualSaving` × `EUR_TO_GBP_PLACEHOLDER`
   *  at module load. UI consumers should read THIS field, falling back
   *  to `annualSaving` when the source is empty or unparseable. For
   *  future UK-native cases, the author can skip the EUR source and
   *  fill this field directly with a `£1,xxx` string. */
  annualSavingGbp?: string
  /** ISO-3166-1 alpha-2 country code of the installation (IT or DE). */
  country: 'IT' | 'DE'
}

// ── EUR → GBP conversion (UK display) ────────────────────────────────────
//
// `annualSaving` is the EUR source-of-truth string from the IT/DE install
// reports. The UK UI never shows € to the user — it shows the GBP
// equivalent via the derived `annualSavingGbp` field, filled in once at
// module load from a single rate constant.
//
// Why a single constant (not a per-call conversion):
//   - One edit updates every surface (grid card, detail page, meta
//     description, future hero card, etc.) in lock-step.
//   - The EUR source string is preserved on every case, so reverting
//     to EUR display (e.g. if finance rejects a placeholder rate, or
//     the project moves to a different conversion policy) is a one-line
//     change at the consumer sites plus a removal of this section.
//
// PLACEHOLDER RATE: 0.85 EUR → GBP. Awaiting finance sign-off. Once the
// business confirms a real rate (or a 30-day rolling average), update
// the constant below — no other file needs to change.
//
// Initial conversion: 2026-10-09.
const EUR_TO_GBP_PLACEHOLDER = 0.85

/** Parse a EUR display string and convert to a UK-locale `£N,NNN` string.
 *  Returns undefined when the input is empty or unparseable.
 *
 *  Three accepted shapes (in order of detection):
 *    1. English-style thousands:  `1,809`  /  `12,345,678`     → 1809
 *    2. IT/DE thousands+decimal:  `1.234,56` (`.` = thousands, `,` = decimal)
 *    3. Plain decimal:            `1234.56` or single-comma form
 *
 *  Today all 13 source strings in this file are shape #1 (the data
 *  uses English-style thousands despite the IT/DE country codes — a
 *  holdover from how the figures were originally written). The other
 *  shapes are here for any future EUR source with a fractional part. */
function eurStringToGbpString(eur: string | undefined): string | undefined {
  if (!eur) return undefined
  const match = eur.match(/€\s*([\d][\d.,\s]*)/)
  if (!match) return undefined
  const s = match[1].replace(/\s/g, '')

  let numeric: number
  if (/^\d{1,3}(,\d{3})+$/.test(s)) {
    // Shape #1: English thousands (`,` only, no decimal)
    numeric = Number(s.replace(/,/g, ''))
  } else if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) {
    // Shape #2: IT/DE thousands + decimal
    numeric = Number(s.replace(/\./g, '').replace(',', '.'))
  } else {
    // Shape #3: plain decimal (or fall-through)
    numeric = Number(s.replace(',', '.'))
  }

  if (!Number.isFinite(numeric)) return undefined
  return `£${Math.round(numeric * EUR_TO_GBP_PLACEHOLDER).toLocaleString('en-GB')}`
}

/**
 * Thirteen representative Solavita installations, ordered 1:1 with
 * public/images/cases/{1..13}.webp. Five Italian sites (Lecce ×3,
 * Udine ×2) reflect the active Italian product lineup. Eight German
 * sites (Wesel / Königstein im Taunus / Frankfurt ×3 / Worms /
 * Düsseldorf / Jesteburg) appear under "Solavita in Europe" as
 * reference installations.
 *
 * Source list — `annualSaving` here is the raw EUR string. The exported
 * `caseStudies` below is the post-mapped version with `annualSavingGbp`
 * derived from the EUR_TO_GBP_PLACEHOLDER rate.
 */
const rawCases: Omit<CaseStudy, 'annualSavingGbp'>[] = [
  // ─── Real-install photoset · 1.webp..13.webp ────────────────────────
  // Each entry maps 1:1 to public/images/cases/{N}.webp. Order is the
  // displayed order on /cases.

  {
    slug: 'lecce-6kwp-11kwh',
    city: 'Lecce',
    region: 'Apulia',
    postcode: 'LE',
    country: 'IT',
    systemLabel: '6.56 kWp + 11 kWh + Single-Phase Inverter 6 kW',
    systemType: 'Solar + Storage',
    shortResult: 'Lecce · 6.56 kWp + 11 kWh · 9,840 kWh/year',
    description:
      'Installation in Lecce, Italy. 6.56 kWp PV system with 11 kWh battery storage and a 6 kW single-phase inverter.',
    annualGeneration: '9,840 kWh',
    annualSaving: '€1,809',
    imagePath: '/images/cases/1.webp',
  },
  {
    slug: 'lecce-5kwp-11kwh',
    city: 'Lecce',
    region: 'Apulia',
    postcode: 'LE',
    country: 'IT',
    systemLabel: '4.92 kWp + 11 kWh + Single-Phase Inverter 5 kW',
    systemType: 'Solar + Storage',
    shortResult: 'Lecce · 4.92 kWp + 11 kWh · 7,380 kWh/year',
    description:
      'Installation in Lecce, Italy. 4.92 kWp PV system with 11 kWh battery storage and a 5 kW single-phase inverter.',
    annualGeneration: '7,380 kWh',
    annualSaving: '€1,413',
    imagePath: '/images/cases/2.webp',
  },
  {
    slug: 'udine-ibrido-8kw-10kwh',
    city: 'Udine',
    region: 'Friuli-Venezia Giulia',
    postcode: 'UD',
    country: 'IT',
    systemLabel: 'Hybrid Inverter 8 kW + 10 kWh',
    systemType: 'Solar + Storage',
    shortResult: 'Udine · Hybrid Inverter 8 kW + 10 kWh · 9,200 kWh/year',
    description:
      'Installation in Udine, Italy. 8 kW hybrid inverter paired with 10 kWh battery storage.',
    annualGeneration: '9,200 kWh',
    annualSaving: '€1,745',
    imagePath: '/images/cases/3.webp',
  },
  {
    slug: 'udine-ibrido-6kw-8kwh',
    city: 'Udine',
    region: 'Friuli-Venezia Giulia',
    postcode: 'UD',
    country: 'IT',
    systemLabel: 'Hybrid Inverter 6 kW + 8 kWh',
    systemType: 'Solar + Storage',
    shortResult: 'Udine · Hybrid Inverter 6 kW + 8 kWh · 6,900 kWh/year',
    description:
      'Installation in Udine, Italy. 6 kW hybrid inverter paired with 8 kWh battery storage.',
    annualGeneration: '6,900 kWh',
    annualSaving: '€1,365',
    imagePath: '/images/cases/4.webp',
  },
  {
    slug: 'lecce-4kwp-11kwh',
    city: 'Lecce',
    region: 'Apulia',
    postcode: 'LE',
    country: 'IT',
    systemLabel: '4.1 kWp + 11 kWh + Single-Phase Inverter 5 kW',
    systemType: 'Solar + Storage',
    shortResult: 'Lecce · 4.1 kWp + 11 kWh · 6,900 kWh/year',
    description:
      'Installation in Lecce, Italy. 4.1 kWp PV system with 11 kWh battery storage and a 5 kW single-phase inverter.',
    annualGeneration: '6,900 kWh',
    annualSaving: '€1,365',
    imagePath: '/images/cases/5.webp',
  },
  {
    slug: 'wesel-2x-ibrido-12kw-20kwh',
    city: 'Wesel',
    region: 'Nordrhein-Westfalen',
    postcode: 'DE-NW',
    country: 'DE',
    systemLabel: '2 × Hybrid Inverter 12 kW + 2 × 20 kWh',
    systemType: 'Solar + Storage',
    shortResult: 'Wesel · 2 × Hybrid 12 kW + 2 × 20 kWh · 22,800 kWh/year',
    description:
      'Installation in Wesel, Germany. Two 12 kW hybrid inverters with two 20 kWh battery storage units.',
    annualGeneration: '22,800 kWh',
    annualSaving: '€4,862',
    imagePath: '/images/cases/6.webp',
  },
  {
    slug: 'koenigstein-13kwp-12kwh',
    city: 'Königstein im Taunus',
    region: 'Hessen',
    postcode: 'DE-HE',
    country: 'DE',
    systemLabel: '13.5 kWp + 11.52 kWh',
    systemType: 'Solar + Storage',
    shortResult: 'Königstein · 13.5 kWp + 11.52 kWh · 13,500 kWh/year',
    description:
      'Installation in Königstein im Taunus, Germany. 13.5 kWp PV system with 11.52 kWh battery storage.',
    annualGeneration: '13,500 kWh',
    annualSaving: '€2,700',
    imagePath: '/images/cases/7.webp',
  },
  {
    slug: 'francoforte-ibrido-12kw-14kwh',
    city: 'Frankfurt',
    region: 'Hessen',
    postcode: 'DE-HE',
    country: 'DE',
    systemLabel: 'Hybrid Inverter 12 kW + 14 kWh',
    systemType: 'Solar + Storage',
    shortResult: 'Frankfurt · Hybrid Inverter 12 kW + 14 kWh · 12,000 kWh/year',
    description:
      'Installation in Frankfurt, Germany. 12 kW hybrid inverter with 14 kWh battery storage.',
    annualGeneration: '12,000 kWh',
    annualSaving: '€2,378',
    imagePath: '/images/cases/8.webp',
  },
  {
    slug: 'francoforte-2x-ibrido-10kw-11kwh',
    city: 'Frankfurt',
    region: 'Hessen',
    postcode: 'DE-HE',
    country: 'DE',
    systemLabel: '2 × Hybrid Inverter 10 kW + 2 × 11 kWh',
    systemType: 'Solar + Storage',
    shortResult: 'Frankfurt · 2 × Hybrid 10 kW + 2 × 11 kWh · 20,000 kWh/year',
    description:
      'Installation in Frankfurt, Germany. Two 10 kW hybrid inverters with two 11 kWh battery storage units.',
    annualGeneration: '20,000 kWh',
    annualSaving: '€4,030',
    imagePath: '/images/cases/9.webp',
  },
  {
    slug: 'francoforte-ibrido-10kw-11kwh',
    city: 'Frankfurt',
    region: 'Hessen',
    postcode: 'DE-HE',
    country: 'DE',
    systemLabel: 'Hybrid Inverter 10 kW + 11 kWh',
    systemType: 'Solar + Storage',
    shortResult: 'Frankfurt · Hybrid Inverter 10 kW + 11 kWh · 10,000 kWh/year',
    description:
      'Installation in Frankfurt, Germany. 10 kW hybrid inverter with 11 kWh battery storage.',
    annualGeneration: '10,000 kWh',
    annualSaving: '€2,015',
    imagePath: '/images/cases/10.webp',
  },
  {
    slug: 'worms-11kwp-12kwh',
    city: 'Worms',
    region: 'Rheinland-Pfalz',
    postcode: 'DE-RP',
    country: 'DE',
    systemLabel: '11 kWp + 11.52 kWh',
    systemType: 'Solar + Storage',
    shortResult: 'Worms · 11 kWp + 11.52 kWh · 11,550 kWh/year',
    description:
      'Installation in Worms (Rheinland-Pfalz), Germany. 11 kWp PV system with 11.52 kWh battery storage.',
    annualGeneration: '11,550 kWh',
    annualSaving: '€2,240',
    imagePath: '/images/cases/11.webp',
  },
  {
    slug: 'duesseldorf-fullblack-450w-ibrido',
    city: 'Düsseldorf',
    region: 'Nordrhein-Westfalen',
    postcode: 'DE-NW',
    country: 'DE',
    systemLabel: 'Full-Black 450 W Modules + Hybrid Inverter 5–15 kW',
    systemType: 'Solar + Storage',
    shortResult: 'Düsseldorf · Full-Black 450 W + Hybrid 5–15 kW · 9,500 kWh/year',
    description:
      'Installation in Düsseldorf, Germany. Full-Black 450 W PV modules paired with a 5–15 kW hybrid inverter.',
    annualGeneration: '9,500 kWh',
    annualSaving: '€1,975',
    imagePath: '/images/cases/12.webp',
  },
  {
    slug: 'jesteburg-9kwp-20kwh',
    city: 'Jesteburg',
    region: 'Niedersachsen',
    postcode: 'DE-NI',
    country: 'DE',
    systemLabel: '8.9 kWp + 20.48 kWh',
    systemType: 'Solar + Storage',
    shortResult: 'Jesteburg · 8.9 kWp + 20.48 kWh · 17,010 kWh/year',
    description:
      'Installation in Jesteburg, Germany. 8.9 kWp PV system with a 20.48 kWh battery storage.',
    annualGeneration: '17,010 kWh',
    annualSaving: '€3,386',
    imagePath: '/images/cases/13.webp',
  },
]

/** Derived list with `annualSavingGbp` filled in from the EUR source.
 *  Consumers (grid card, detail page, CasesSection, meta description)
 *  read `caseStudies`, not `rawCases`. */
export const caseStudies: CaseStudy[] = rawCases.map((c) => ({
  ...c,
  annualSavingGbp: eurStringToGbpString(c.annualSaving),
}))

/** Lookup a single case by slug. Used by /cases/[slug] page.tsx and
 *  the sitemap builder. Returns undefined when the slug doesn't match
 *  any published entry - callers should `notFound()` on undefined. */
export function getCaseBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug)
}

/** All case slugs - used by generateStaticParams and the sitemap so
 *  every detail page is pre-built at compile time and present in the
 *  sitemap. Slugs are stable identifiers (see `slug` field in the
 *  CaseStudy interface). */
export function allCaseSlugs(): string[] {
  return caseStudies.map((c) => c.slug)
}

export interface FeaturedTestimonial {
  quote: string
  author: string
  role: string
  rating: number
}

export const featuredTestimonial: FeaturedTestimonial = {
  quote:
    'From consultation to installation, the whole experience was impeccable. Our bills dropped noticeably and the app shows us exactly what we are using.',
  author: '- R. family, Udine',
  role: 'Udine · Solar + Storage',
  rating: 5,
}
