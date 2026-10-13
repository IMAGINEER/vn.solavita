/**
 * About Us page data — Nigeria.
 *
 * Built from `content/nigeria/About Us.md` (the brief is the source of
 * truth). All copy is placeholders / TBDs until business supplies the
 * verified facts. Section-by-section mapping:
 *   - Section 1 Hero: tagline + body
 *   - Section 2 Why We Exist: lede
 *   - Section 3 Our Approach: 4 cards
 *   - Section 4 Our Brand: SKYWORTH association + verified corporate
 *     facts TBD
 *   - Section 5 Our Commitment: service coverage / warranty TBD
 *   - Section 6 Local Presence: address / coverage TBD
 *
 * No UK-specific facts, no SKYWORTH-only claims, no fabricated
 * corporate history / factory capacity / project counts.
 */

export interface AboutStat {
  value: string
  unit: string
  label: string
}

/**
 * Stats block on the About page. Until verified corporate facts are
 * supplied, every entry is a TBD placeholder; the consumer renders
 * them with a `TbdText` so the page can be reviewed without
 * fabricating numbers.
 */
export const aboutStats: AboutStat[] = [
  {
    value: 'TBD',
    unit: '',
    label: 'TBD — Verified SKYWORTH Nigerian launch date / presence',
  },
  {
    value: 'TBD',
    unit: '',
    label: 'TBD — Verified Nigerian installation coverage',
  },
  {
    value: 'TBD',
    unit: '',
    label: 'TBD — Verified global SKYWORTH footprint',
  },
  {
    value: 'TBD',
    unit: '',
    label: 'TBD — Verified Solavita household figures',
  },
]

export interface AboutApproach {
  title: string
  description: string
}

export const aboutApproach: AboutApproach[] = [
  {
    title: 'Designed Around Real Energy Needs',
    description:
      'We organise our solutions around different power requirements, from essential backup to higher-capacity household and commercial systems.',
  },
  {
    title: 'Clear System Configurations',
    description:
      'We explain solar module capacity, inverter ratings and battery storage so customers can compare solutions more confidently.',
  },
  {
    title: 'Technology With a Long-Term Perspective',
    description:
      'We combine solar generation and battery storage into systems designed to support more flexible energy use.',
  },
  {
    title: 'Local Service and Support',
    description:
      'TBD — Verified Nigerian installation, customer service and after-sales arrangements.',
  },
]

export interface AboutCertification {
  label: string
  description: string
}

/**
 * Certification list. Every entry is a TBD placeholder. Do not add
 * MCS / NICEIC / RECC / TUV / CE / 25-year / DARES / Nigerian
 * regulatory claims until business confirms the certification applies
 * to Solavita Nigeria.
 */
export const aboutCertifications: AboutCertification[] = [
  {
    label: 'TBD',
    description: 'TBD — Verified international or Nigerian certification',
  },
  {
    label: 'TBD',
    description: 'TBD — Verified international or Nigerian certification',
  },
  {
    label: 'TBD',
    description: 'TBD — Verified international or Nigerian certification',
  },
  {
    label: 'TBD',
    description: 'TBD — Verified international or Nigerian certification',
  },
]

export interface AboutRegion {
  city: string
  country: string
  role: string
}

/**
 * Region / office list. Only SKYWORTH Group HQ is verifiable from
 * public sources; every Nigerian entry is a TBD until the local
 * presence is confirmed.
 */
export const aboutRegions: AboutRegion[] = [
  { city: 'TBD', country: 'Nigeria', role: 'TBD — Verified Nigerian office and service locations' },
  { city: 'TBD', country: 'Nigeria', role: 'TBD — Verified installation coverage areas' },
  { city: 'Shenzhen', country: 'China', role: 'Group HQ · SKYWORTH R&D' },
]
