/**
 * Marketing product list.
 *
 * Used by:
 *   - <ProductSelector> on the homepage and /solutions
 *   - <Header> Solutions dropdown (each card links to its detail block)
 *
 * Specs here mirror `lib/data/solutions.ts` and `app/my-plan/_lib/calc.ts`
 * (the PLANS array). Keep all three surfaces in sync.
 *
 * Pricing is intentionally NOT in this file: per the product brief, prices
 * are surfaced only on /my-plan (and feed the ROI engine). The marketing
 * site shows specs only.
 */

export interface UkProduct {
  id: 'one' | 'pro' | 'max' | 'ultra'
  name: string
  subtitle: string
  /** Headline spec shown in the dropdown + product card (e.g. "3.68 kWp"). */
  power: string
  /** Battery headline, or '-' for solar-only tiers. */
  storage: string
  features: string[]
  popular?: boolean
  imagePath: string
}

/**
 * Four-tier product ladder - Home Energy One → Pro → Max → Ultra.
 * Panels are 460 W per module: 8 panels = 3.68 kWp, 12 panels = 5.52 kWp.
 */
export const ukProducts: UkProduct[] = [
  {
    id: 'one',
    name: 'Home Energy One',
    subtitle: 'Solar only',
    power: '3.68 kWp',
    storage: '-',
    features: [
      'Solar: 8 × 460W modules',
      'Inverter: 3.6 kW',
      'MCS-certified install',
    ],
    imagePath: '/images/Solar_Essential.webp',
  },
  {
    id: 'pro',
    name: 'Home Energy Pro',
    subtitle: 'Solar + Storage',
    power: '3.68 kWp',
    storage: '5.12 kWh',
    features: [
      'Solar: 8 × 460W modules',
      'Battery: 5.12 kWh',
      'Inverter: 3.6 kW',
      'HEMS scheduling',
    ],
    popular: true,
    imagePath: '/images/Storage_core.webp',
  },
  {
    id: 'max',
    name: 'Home Energy Max',
    subtitle: 'Solar + Storage + EV',
    power: '5.52 kWp',
    storage: '5.12 kWh',
    features: [
      'Solar: 12 × 460W modules',
      'Battery: 5.12 kWh',
      'Inverter: 6 kW',
      'EV charger ready',
      'HEMS control',
    ],
    imagePath: '/images/Premium_backup.webp',
  },
  {
    id: 'ultra',
    name: 'Home Energy Ultra',
    subtitle: 'Whole-home energy',
    power: '5.52 kWp',
    storage: '10.24 kWh',
    features: [
      'Solar: 12 × 460W modules',
      'Battery: 10.24 kWh',
      'Inverter: 6 kW',
      'EV charger + heat pump ready',
      'HEMS control',
    ],
    imagePath: '/images/Smart_home.webp',
  },
]