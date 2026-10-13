/**
 * Nigeria site case studies.
 *
 * The previous UK version of this file held 13 EU installations (Italian
 * and German) that the UK site displayed as reference installs. The
 * Nigeria site has no verified NG cases yet (per `content/nigeria/cases.md`
 * §2 — "No Nigerian customer case studies have been verified"), so this
 * file now exports an empty `caseStudies` list. The shape and type
 * identifiers are kept so that every existing consumer import still
 * typechecks; consumers should render a neutral empty state when
 * `caseStudies.length === 0`.
 *
 * To populate later, add a `NgCaseStudy[]` with the same `CaseStudy`
 * shape (slug, city, region, postcode, systemLabel, systemType,
 * shortResult, description, imagePath, annualGeneration, ...). Verified
 * NG cases must include customer permission and the verbatim or
 * derived-from-source data.
 *
 * The EUR → GBP conversion block from the UK version was removed — it
 * is not relevant for an NG audience and was the only piece of EU
 * currency logic in the file. If you reintroduce cases, add an
 * `annualSavingNgn` field (or similar) instead.
 *
 * Image assets: when NG cases exist, map each entry 1:1 to a real
 * `public/images/cases/{N}.webp` or use the unified
 * `components/ui/image-placeholder.tsx`.
 */

export type CaseSystemType =
  | 'Residential Solar'
  | 'Solar + Storage'
  | 'Smart Home / HEMS'
  | 'Heat Pump + Solar'
  | 'Small Commercial'

export interface CaseStudy {
  /** Stable slug - the URL segment for /cases/[slug]. */
  slug: string
  city: string
  /** Region / state label. */
  region: string
  /** State / LGA / postcode code. */
  postcode: string
  /** System label - prose. */
  systemLabel: string
  /** System category - used for filtering and the card eyebrow tag. */
  systemType: CaseSystemType
  /** Brief result - prose. */
  shortResult: string
  /** One-paragraph case description - prose. */
  description: string
  /** Path to the hero / card image. */
  imagePath: string
  /** Annual generation figure (kWh) - package-level estimate unless
   *  measured on a verified install. */
  annualGeneration?: string
  /** Annual saving figure - optional. NG consumer surface never
   *  displays this (per the user's directive: "don't show prices"). */
  annualSaving?: string
  /** ISO-3166-1 alpha-2 country code of the installation. NG, IT, DE
   *  accepted - the 13 EU cases (IT/DE) are reference installs. */
  country: 'NG' | 'IT' | 'DE'
}

/**
 * Reference case studies - 13 European installations (IT + DE) carried
 * over from the UK site per the user's directive:
 *   "use the previous UK website's European cases, don't show prices".
 *
 * The NG site has no verified NG cases yet. The 13 entries below are
 * displayed on the home page (Customer Stories section) and on the
 * /cases index as reference installs from the same product lineup,
 * with the price / annual-saving fields suppressed in the rendered
 * output.
 *
 * When real NG cases are added, the consumer components should
 *   1) Prefer the NG cases at the top of the list.
 *   2) Continue to suppress the `annualSaving` / `annualSavingGbp`
 *      fields (this codebase no longer has GBP pricing; only the
 *      EUR source is in the data and it is not rendered).
 */
export const caseStudies: CaseStudy[] = [
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
      'Reference installation. 6.56 kWp PV system with 11 kWh battery storage and a 6 kW single-phase inverter.',
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
      'Reference installation. 4.92 kWp PV system with 11 kWh battery storage and a 5 kW single-phase inverter.',
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
      'Reference installation. 8 kW hybrid inverter paired with 10 kWh battery storage.',
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
      'Reference installation. 6 kW hybrid inverter paired with 8 kWh battery storage.',
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
      'Reference installation. 4.1 kWp PV system with 11 kWh battery storage and a 5 kW single-phase inverter.',
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
      'Reference installation. Two 12 kW hybrid inverters with two 20 kWh battery storage units.',
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
      'Reference installation. 13.5 kWp PV system with 11.52 kWh battery storage.',
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
      'Reference installation. 12 kW hybrid inverter with 14 kWh battery storage.',
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
      'Reference installation. Two 10 kW hybrid inverters with two 11 kWh battery storage units.',
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
      'Reference installation. 10 kW hybrid inverter with 11 kWh battery storage.',
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
      'Reference installation. 11 kWp PV system with 11.52 kWh battery storage.',
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
      'Reference installation. Full-Black 450 W PV modules paired with a 5–15 kW hybrid inverter.',
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
      'Reference installation. 8.9 kWp PV system with a 20.48 kWh battery storage.',
    annualGeneration: '17,010 kWh',
    annualSaving: '€3,386',
    imagePath: '/images/cases/13.webp',
  },
]

/** Lookup a single case by slug. Returns undefined when no NG cases
 *  are available. Consumers should call `notFound()` on undefined. */
export function getCaseBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug)
}

/** All case slugs - used by generateStaticParams and the sitemap.
 *  Returns an empty array until NG cases are added. */
export function allCaseSlugs(): string[] {
  return caseStudies.map((c) => c.slug)
}

export interface FeaturedTestimonial {
  quote: string
  author: string
  role: string
  rating: number
}

/**
 * Featured testimonial - placeholder until a verified NG customer
 * approves a quote. The original UK testimonial was a translation of
 * an Italian installer's quote; not portable to NG.
 */
export const featuredTestimonial: FeaturedTestimonial = {
  quote:
    'TBD — Verified customer story. A site-specific, customer-approved testimonial will be displayed once a verified NG case is available.',
  author: 'TBD — Verified customer',
  role: 'TBD — Verified city · Verified package',
  rating: 0,
}
