/**
 * Cases page data.
 *
 * Each case study is fully typed so the page (and any future detail
 * pages) can iterate it without ever hardcoding copy inside JSX. The
 * homepage already shows a 3-card slice of these via CasesSection - the
 * /cases page uses the full set and adds a single "Featured Case" panel
 * at the top.
 */

export type CaseSystemType =
  | 'Residential Solar'
  | 'Solar + Storage'
  | 'Smart Home / HEMS'
  | 'Heat Pump + Solar'

export interface CaseStudy {
  /** Stable slug - will become the URL segment for /cases/[slug]. */
  slug: string
  city: string
  region: string // "England" | "Wales" | "Scotland" | "Northern Ireland"
  postcode: string
  /** System label (e.g. "7.8kWp + 10kWh"). */
  systemLabel: string
  /** System category - used for filtering and the card eyebrow tag. */
  systemType: CaseSystemType
  /** Brief result (e.g. "Saved £1,180/yr · 8,310 kWh generated"). */
  shortResult: string
  /** One-paragraph case description (longer than `shortResult`). */
  description: string
  /** Path to the hero / card image. */
  imagePath: string
  /** Optional generation figure for the data row. */
  annualGeneration?: string
  /** Optional saving figure for the data row. */
  annualSaving?: string
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'leeds-ls6',
    city: 'Leeds',
    region: 'England',
    postcode: 'LS6',
    systemLabel: '7.8 kWp · 10 kWh',
    systemType: 'Solar + Storage',
    shortResult: 'Saved £1,180/yr · 8,310 kWh generated',
    description:
      'Detached 4-bed in Yorkshire. South-east pitched roof, slate tiles. Installed in 11 working days.',
    imagePath: '/images/banner_uk.webp',
    annualGeneration: '8,310 kWh',
    annualSaving: '£1,180',
  },
  {
    slug: 'manchester-m14',
    city: 'Manchester',
    region: 'England',
    postcode: 'M14',
    systemLabel: '6.2 kWp · 5 kWh',
    systemType: 'Solar + Storage',
    shortResult: 'Saved £910/yr · 6,480 kWh generated',
    description:
      'Semi-detached home with mixed tile roof. Compact battery to maximise self-consumption.',
    imagePath: '/images/banner_uk.webp',
    annualGeneration: '6,480 kWh',
    annualSaving: '£910',
  },
  {
    slug: 'bristol-bs8',
    city: 'Bristol',
    region: 'England',
    postcode: 'BS8',
    systemLabel: '9.6 kWp · 10 kWh',
    systemType: 'Solar + Storage',
    shortResult: 'Saved £1,520/yr · 10,560 kWh generated',
    description:
      'Detached home with large south-facing roof. High-yield array paired with 10 kWh battery.',
    imagePath: '/images/banner_uk.webp',
    annualGeneration: '10,560 kWh',
    annualSaving: '£1,520',
  },
  {
    slug: 'london-se21',
    city: 'London',
    region: 'England',
    postcode: 'SE21',
    systemLabel: '4.4 kWp · 5 kWh',
    systemType: 'Smart Home / HEMS',
    shortResult: 'HEMS-managed · 4,200 kWh generated',
    description:
      'Terraced Victorian home. HEMS routes solar to heat pump and EV charger automatically.',
    imagePath: '/images/banner_uk.webp',
    annualGeneration: '4,200 kWh',
  },
  {
    slug: 'edinburgh-eh12',
    city: 'Edinburgh',
    region: 'Scotland',
    postcode: 'EH12',
    systemLabel: '6.0 kWp',
    systemType: 'Residential Solar',
    shortResult: 'Saved £780/yr · 5,940 kWh generated',
    description:
      'Bungalow with east/west split roof. Optimised for morning + afternoon generation.',
    imagePath: '/images/banner_uk.webp',
    annualGeneration: '5,940 kWh',
    annualSaving: '£780',
  },
  {
    slug: 'cardiff-cf14',
    city: 'Cardiff',
    region: 'Wales',
    postcode: 'CF14',
    systemLabel: '8.4 kWp · 10 kWh · HP-ready',
    systemType: 'Heat Pump + Solar',
    shortResult: 'Heat pump + solar · 8,820 kWh generated',
    description:
      'Detached retrofit. Solar + battery sized to cover a new air-source heat pump.',
    imagePath: '/images/banner_uk.webp',
    annualGeneration: '8,820 kWh',
  },
]

/** Returns the first case flagged as "featured". */
export function getFeaturedCase(): CaseStudy {
  return caseStudies[0]
}

export interface FeaturedTestimonial {
  quote: string
  author: string
  role: string
  rating: number
}

export const featuredTestimonial: FeaturedTestimonial = {
  quote:
    'From consultation to installation, the whole experience was fantastic. Our bills dropped significantly and the app tells us exactly what we are using.',
  author: 'Sarah M.',
  role: 'Leeds · Solar + Storage',
  rating: 5,
}
