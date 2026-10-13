/**
 * Marketing product list — Nigeria.
 *
 * Used by:
 *   - <ProductSelector> on the homepage and /solutions
 *   - <Header> Solutions dropdown (each card links to its detail block)
 *
 * Specs here mirror `lib/data/solutions.ts` (the per-tier detail cards)
 * and the `PLANS` array in `app/my-plan/_lib/calc.ts` (which reads the
 * simulated `priceNgn` from each solution detail). Keep all three
 * surfaces in sync.
 *
 * Pricing is intentionally NOT surfaced in this file: per the NG rule
 * (₦ only with verified approved pricing), prices are surfaced only on
 * /my-plan (and feed the ROI engine). The marketing site shows specs
 * only.
 *
 * Replaces the previous `lib/data/uk-products.ts` file. The four UK
 * products (one / pro / max / ultra) are no longer used anywhere in the
 * NG repo; all consumers now import from this file.
 */

export type NgProductId =
  | 'lite-essential-backup'
  | 'home-standard'
  | 'home-high-spec'
  | 'business-entry-3-phase'
  | 'business-standard-3-phase'
  | 'business-flagship-3-phase'

export interface NgProduct {
  id: NgProductId
  name: string
  /** Short strapline (e.g. "Single phase · Essential backup"). */
  subtitle: string
  /** Headline spec shown in the dropdown + product card (e.g. "4.34 kWp"). */
  power: string
  /** Battery headline, or '-' for solar-only tiers. */
  storage: string
  features: string[]
  popular?: boolean
  imagePath: string
  /** Customer segment - drives the grouping on the homepage grid. */
  segment: 'homes' | 'businesses'
}

/**
 * Six-tier product ladder for Nigeria, grouped into two customer
 * segments (see `content/nigeria/products.md`):
 *   - For Homes: LITE Essential Backup, HOME Standard, HOME High-spec
 *   - For Larger Homes & Small Businesses:
 *     BUSINESS Entry 3-Phase, BUSINESS Standard 3-Phase,
 *     BUSINESS Flagship 3-Phase
 *
 * Panel wattage (620 W) and module counts come straight from
 * `content/nigeria/products.md`; total rated PV capacity is the
 * manufacturer-quoted figure on the source.
 */
export const ngProducts: NgProduct[] = [
  {
    id: 'lite-essential-backup',
    name: 'LITE Essential Backup',
    subtitle: 'Single phase · Essential backup',
    power: '4.34 kWp',
    storage: '5 kWh',
    features: [
      'Solar: 7 × 620W modules',
      'Inverter: 3.6 kW, single phase',
      'Battery: 5 kWh',
    ],
    imagePath: '/images/Solar_Essential.webp',
    segment: 'homes',
  },
  {
    id: 'home-standard',
    name: 'HOME Standard',
    subtitle: 'Single phase · Everyday home',
    power: '7.44 kWp',
    storage: '10 kWh',
    features: [
      'Solar: 12 × 620W modules',
      'Inverter: 6 kW, single phase, off-grid capable',
      'Battery: 10 kWh (2 × 5 kWh)',
    ],
    popular: true,
    imagePath: '/images/Storage_core.webp',
    segment: 'homes',
  },
  {
    id: 'home-high-spec',
    name: 'HOME High-spec',
    subtitle: 'Single phase · Higher capacity',
    power: '9.92–12.40 kWp',
    storage: '16 kWh',
    features: [
      'Solar: 16–20 × 620W modules',
      'Inverter: 8–12 kW, single phase',
      'Battery: 16 kWh',
    ],
    imagePath: '/images/Premium_backup.webp',
    segment: 'homes',
  },
  {
    id: 'business-entry-3-phase',
    name: 'BUSINESS Entry 3-Phase',
    subtitle: 'Three phase · Entry commercial',
    power: '11.78 kWp',
    storage: '16 kWh',
    features: [
      'Solar: 19 × 620W modules',
      'Inverter: 10 kW, three phase',
      'Battery: 16 kWh',
    ],
    imagePath: '/images/Smart_home.webp',
    segment: 'businesses',
  },
  {
    id: 'business-standard-3-phase',
    name: 'BUSINESS Standard 3-Phase',
    subtitle: 'Three phase · Standard commercial',
    power: '17.36 kWp',
    storage: '32 kWh',
    features: [
      'Solar: 28 × 620W modules',
      'Inverter: 15 kW, three phase',
      'Battery: 32 kWh (2 × 16 kWh)',
    ],
    imagePath: '/images/Smart_home.webp',
    segment: 'businesses',
  },
  {
    id: 'business-flagship-3-phase',
    name: 'BUSINESS Flagship 3-Phase',
    subtitle: 'Three phase · Flagship commercial',
    power: '23.56 kWp',
    storage: '32 kWh',
    features: [
      'Solar: 38 × 620W modules',
      'Inverter: 20 kW, three phase',
      'Battery: 32 kWh (2 × 16 kWh)',
    ],
    imagePath: '/images/Smart_home.webp',
    segment: 'businesses',
  },
]
