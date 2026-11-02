/**
 * Case studies — Nigeria site.
 *
 * Source of truth: `docs/创维光伏海外案例2.0(1).pptx` (Skyworth PV overseas
 * cases, Nov 2026). The deck supersedes the figures previously taken from
 * `docs/修改建议(2).docx` — every capacity, date and system description
 * below now comes from the deck's own slide text.
 *
 * The deck carries 24 residential and 8 C&I references. Only the 16
 * installations already listed here are published — the deck's extra
 * references (Wesel, Düsseldorf, Rheinland-Pfalz, Udine, Breda, Manila,
 * Vietnam, Bukit Mertajam, Puchong and the four unbuilt Thai C&I sites)
 * are NOT added.
 *
 * The card format is unchanged:
 *
 *     ┌─────────────────────────────┐
 *     │  Residential                │  ← type badge
 *     │  21.59kW                    │  ← capacity
 *     │  Balakong, Malaysia         │  ← place, country
 *     └─────────────────────────────┘
 *
 * i.e. `annualGeneration` / `annualSaving` / `postcode` are gone —
 * capacity replaces generation as the headline number, and the location
 * renders as "place, country" on the homepage and "country, place" on the
 * /cases index (the two orders the docx uses). We store `country` and
 * `place` separately and let each surface pick its own order.
 *
 * Images: every photo is extracted from the deck slide that documents the
 * case and re-encoded to WebP under `public/images/cases/` (see the
 * slide → file mapping in the comment above each case). `imagePath` is
 * therefore set on all 16.
 *
 * Per ng-content-strategy: no fabricated results, savings or
 * testimonials. Each `description` states only what the deck states —
 * the system size, the completion date and the equipment mix.
 */

export type NgCaseType = 'residential' | 'commercial'

export interface NgCase {
  /** Stable slug — unique key, also the future /cases/[slug] id. */
  slug: string
  type: NgCaseType
  /** Badge text on the card. */
  typeLabel: string
  /** Headline capacity, e.g. "21.59kW" or "7.2kW / 11.52kWh". */
  capacity: string
  /** City / site name, e.g. "Balakong". */
  place: string
  /** Country, e.g. "Malaysia". */
  country: string
  /** One factual line about the system. */
  description: string
  /** Path under `public/`. Omitted when the photo is still pending. */
  imagePath?: string
  /** What the image should show — used by the placeholder. */
  imageDescription: string
  /** Marks the 4 cases the docx features on the homepage. */
  featured?: boolean
}

/** Badge label per type — kept as a constant so both surfaces agree. */
export const CASE_TYPE_LABELS: Record<NgCaseType, string> = {
  residential: 'Residential',
  commercial: 'Commercial & Industrial',
}

export const ngCases: NgCase[] = [
  /* ── Residential ────────────────────────────────────────────────────── */
  {
    // Deck slide 21 — 亚洲户用案例— 泰国 Jrokul Villa
    slug: 'thailand-bangkok-5-28kw',
    type: 'residential',
    typeLabel: CASE_TYPE_LABELS.residential,
    capacity: '5.28kWp',
    place: 'Bangkok',
    country: 'Thailand',
    description:
      'Jrokul Villa residence — 5.28 kWp rooftop array built from eight 660 Wp modules with a hybrid inverter. Completed April 2026.',
    imagePath: '/images/cases/bangkok-5-28kw.webp',
    imageDescription:
      'Aerial view of the Jrokul Villa rooftop array in Bangkok, Thailand',
  },
  {
    // Deck slide 6 — 欧洲户用案例— 德国 法兰克福
    slug: 'germany-frankfurt-12kw-14kwh',
    type: 'residential',
    typeLabel: CASE_TYPE_LABELS.residential,
    capacity: '12kW / 14kWh',
    place: 'Frankfurt',
    country: 'Germany',
    description:
      'Residential hybrid system in Frankfurt — 12 kW hybrid inverter with 14 kWh of storage. Completed April 2023.',
    imagePath: '/images/cases/frankfurt-12kw-14kwh.webp',
    imageDescription:
      'Rooftop solar array on a flat-roof home in Frankfurt, Germany',
  },
  {
    // Deck slide 26 — 亚洲户用案例— 马来西亚 Johor
    slug: 'malaysia-johor-16-51kw',
    type: 'residential',
    typeLabel: CASE_TYPE_LABELS.residential,
    capacity: '16.51kW',
    place: 'Johor',
    country: 'Malaysia',
    description:
      'Residential rooftop system in Johor, Malaysia — 16.51 kW installed capacity.',
    imagePath: '/images/cases/johor-16-51kw.webp',
    imageDescription:
      'Aerial view of a residential rooftop array in Johor, Malaysia',
  },
  {
    // Deck slide 16 — 欧洲户用案例— 意大利 Lecce
    slug: 'italy-lecce-4-6kw-11kwh',
    type: 'residential',
    typeLabel: CASE_TYPE_LABELS.residential,
    capacity: '4.6kW / 11kWh',
    place: 'Lecce',
    country: 'Italy',
    description:
      'Residential hybrid system in Lecce — 4.6 kW hybrid inverter with 11 kWh of storage. Completed May 2023.',
    imagePath: '/images/cases/lecce-4-6kw-11kwh.webp',
    imageDescription:
      'Rooftop solar array on a home in Lecce, Italy',
  },
  {
    // Deck slide 30 — 非洲户用案例— 多哥共和国 洛美 (Lomé)
    slug: 'togo-lome-5kw',
    type: 'residential',
    typeLabel: CASE_TYPE_LABELS.residential,
    capacity: '5kW',
    place: 'Lomé',
    country: 'Togo',
    description:
      'Residential rooftop system in Lomé, Togo — 5 kW installed capacity.',
    imagePath: '/images/cases/togo-lome-5kw.webp',
    imageDescription:
      'Installers fitting a rooftop array in Lomé, Togo',
  },
  {
    // Deck slide 20 — 亚洲户用案例— 伊拉克 苏莱曼尼亚（Sulaimaniyah）
    slug: 'iraq-sulaimaniyah-25-5kw',
    type: 'residential',
    typeLabel: CASE_TYPE_LABELS.residential,
    capacity: '25.5kW',
    place: 'Sulaimaniyah',
    country: 'Iraq',
    description:
      'Rooftop system in Sulaimaniyah, Iraq — 25.5 kW installed capacity.',
    imagePath: '/images/cases/iraq-sulaimaniyah-25-5kw.webp',
    imageDescription:
      'Solar installation overlooking the city in Sulaimaniyah, Iraq',
  },
  {
    // Deck slide 4 — 欧洲户用案例— 德国 法兰克福
    slug: 'germany-frankfurt-20kw-22kwh',
    type: 'residential',
    typeLabel: CASE_TYPE_LABELS.residential,
    capacity: '20kW / 22kWh',
    place: 'Frankfurt',
    country: 'Germany',
    description:
      'Residential system in Frankfurt built on two 10 kW hybrid inverters with 22 kWh of storage. Completed February 2023.',
    imagePath: '/images/cases/frankfurt-20kw-22kwh.webp',
    imageDescription:
      'Aerial view of a fully roofed home with solar in Frankfurt, Germany',
  },
  {
    // Deck slide 5 — 欧洲户用案例— 德国 法兰克福
    slug: 'germany-frankfurt-10kw-11kwh',
    type: 'residential',
    typeLabel: CASE_TYPE_LABELS.residential,
    capacity: '10kW / 11kWh',
    place: 'Frankfurt',
    country: 'Germany',
    description:
      'Residential hybrid system in Frankfurt — 10 kW hybrid inverter with 11 kWh of storage.',
    imagePath: '/images/cases/frankfurt-10kw-11kwh.webp',
    imageDescription:
      'Aerial view of a residential rooftop array in Frankfurt, Germany',
  },
  {
    // Deck slide 28 — 亚洲户用案例— 马来西亚 Balakong，Selangor
    slug: 'malaysia-balakong-21-59kw',
    type: 'residential',
    typeLabel: CASE_TYPE_LABELS.residential,
    capacity: '21.59kW',
    place: 'Balakong',
    country: 'Malaysia',
    description:
      'Residential rooftop system in Balakong, Selangor, Malaysia — 21.59 kW installed capacity.',
    imagePath: '/images/cases/balakong-21-59kw.webp',
    imageDescription:
      'Aerial view of a rooftop array in Balakong, Selangor, Malaysia',
    featured: true,
  },
  {
    // Deck slide 15 — 欧洲户用案例— 意大利 Lecce
    slug: 'italy-lecce-5kw-11kwh',
    type: 'residential',
    typeLabel: CASE_TYPE_LABELS.residential,
    capacity: '5kW / 11kWh',
    place: 'Lecce',
    country: 'Italy',
    description:
      'Residential hybrid system in Lecce — 5 kW hybrid inverter with 11 kWh of storage. Completed June 2023.',
    imagePath: '/images/cases/lecce-5kw-11kwh.webp',
    imageDescription:
      'Rooftop solar array on a home in Lecce, Italy',
  },
  {
    // Deck slide 14 — 欧洲户用案例— 意大利 Lecce
    slug: 'italy-lecce-6kw-11kwh',
    type: 'residential',
    typeLabel: CASE_TYPE_LABELS.residential,
    capacity: '6kW / 11kWh',
    place: 'Lecce',
    country: 'Italy',
    description:
      'Residential hybrid system in Lecce — 6 kW hybrid inverter with 11 kWh of storage. Completed July 2023.',
    imagePath: '/images/cases/lecce-6kw-11kwh.webp',
    imageDescription:
      'Aerial view of a residential rooftop array in Lecce, Italy',
  },
  {
    // Deck slide 12 — 欧洲户用案例— 德国Taunus
    slug: 'germany-taunus-7-2kw-11-52kwh',
    type: 'residential',
    typeLabel: CASE_TYPE_LABELS.residential,
    capacity: '7.2kW / 11.52kWh',
    place: 'Taunus',
    country: 'Germany',
    description:
      'Residential system in Taunus — 7.2 kWp installed capacity, 10 kW inverter and 11.52 kWh of storage.',
    imagePath: '/images/cases/taunus-7-2kw-11-52kwh.webp',
    imageDescription:
      'Solar array on a flat-roof home in Taunus, Germany',
    featured: true,
  },

  /* ── Commercial & Industrial ────────────────────────────────────────── */
  {
    // Deck slide 35 — 非洲工商业案例—非洲 塞内加尔
    slug: 'senegal-africa-1mw-3mwh',
    type: 'commercial',
    typeLabel: CASE_TYPE_LABELS.commercial,
    capacity: '1MW / 3MWh',
    place: 'Senegal',
    country: 'Africa',
    description:
      'Utility-scale storage project in Senegal — 1 MW output with 3 MWh of capacity.',
    imagePath: '/images/cases/senegal-1mw-3mwh.webp',
    imageDescription:
      'Crews installing panels on a commercial rooftop in Senegal',
    featured: true,
  },
  {
    // Deck slide 32 — 亚洲EPC案例— 香港 联升工贸大厦 Hongkong Len Shing
    slug: 'hongkong-china-227kw',
    type: 'commercial',
    typeLabel: CASE_TYPE_LABELS.commercial,
    capacity: '227kW',
    place: 'Hongkong',
    country: 'China',
    description:
      '227 kW commercial rooftop PV project at the Len Shing building in Hong Kong.',
    imagePath: '/images/cases/hongkong-227kw.webp',
    imageDescription:
      'Aerial view of the Len Shing rooftop solar arrays in Hong Kong',
    featured: true,
  },
  {
    // Deck slide 33 — 亚洲工商业案例— 泰国 Wathubrak School
    slug: 'thailand-wathubrak-school-5-58kw',
    type: 'commercial',
    typeLabel: CASE_TYPE_LABELS.commercial,
    capacity: '5.58kWp',
    place: 'Wathubrak School',
    country: 'Thailand',
    description:
      'School campus system in Wathubrak, Thailand — 5.58 kWp array built from nine 620 Wp modules with a grid-connected inverter. Completed April 2026.',
    imagePath: '/images/cases/thailand-wathubrak-school-5-58kw.webp',
    imageDescription:
      'Solar panels on a school roof in Wathubrak, Thailand',
  },
  {
    // Deck slide 34 — 亚洲工商业案例— 缅甸 FCC商贸城
    slug: 'myanmar-fcc-trading-city-4-7mw-9-4mwh',
    type: 'commercial',
    typeLabel: CASE_TYPE_LABELS.commercial,
    capacity: '4.7MW / 9.4MWh',
    place: 'FCC Trading City',
    country: 'Myanmar',
    description:
      'Commercial solar and energy storage project at FCC Trading City, Myanmar — 4.7 MW output with 9.4 MWh of capacity.',
    imagePath: '/images/cases/myanmar-fcc-4-7mw-9-4mwh.webp',
    imageDescription:
      'Commencement ceremony for the FCC Trading City solar and storage project in Myanmar',
  },
]

/** All residential cases, in the deck's listed order. */
export const ngResidentialCases: NgCase[] = ngCases.filter(
  (c) => c.type === 'residential',
)

/** All commercial & industrial cases, in the deck's listed order. */
export const ngCommercialCases: NgCase[] = ngCases.filter(
  (c) => c.type === 'commercial',
)

/**
 * The 4 cases featured on the homepage:
 * ① Residential 21.59kW Balakong, Malaysia
 * ② Residential 7.2kW / 11.52kWh Taunus, Germany
 * ③ Commercial & Industrial 227kW Hongkong, China
 * ④ Commercial & Industrial 1MW / 3MWh Senegal, Africa
 */
export const featuredNgCases: NgCase[] = ngCases.filter((c) => c.featured)

/** Look up a single case by slug. */
export function getNgCaseBySlug(slug: string): NgCase | undefined {
  return ngCases.find((c) => c.slug === slug)
}
