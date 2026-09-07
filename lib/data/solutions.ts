/**
 * Solutions page data.
 *
 * All copy here is placeholder English - easy to swap to final content
 * without touching the page structure. Image paths reuse existing assets
 * under /images so the page renders end-to-end without
 * any new uploads.
 *
 * Pricing is intentionally NOT part of this file: per the product brief,
 * prices are surfaced only on /my-plan (and feed the ROI engine). The
 * marketing surfaces (/, /solutions, dropdown menus) show specs only.
 */

/**
 * Map each product in the homepage Products section to the matching
 * detail section anchor on /solutions. Shared between:
 *   - `<Header>` Solutions dropdown (jumps to the right block on /solutions)
 *   - `<ProductSelector>` "Plan Details →" link on /solutions
 *
 * IDs are 1:1 today (the marketing id *is* the anchor id), but we keep
 * the indirection so a future product rename can detach label from anchor.
 */
export const PRODUCT_TO_SOLUTION_ANCHOR: Record<string, string> = {
  one: 'one',
  pro: 'pro',
  max: 'max',
  ultra: 'ultra',
}

export type SolutionCategoryId = 'one' | 'pro' | 'max' | 'ultra'

export interface SolutionCategory {
  id: SolutionCategoryId
  /** Short label shown above the title in the hero pill / section heading. */
  eyebrow: string
  /** Card title - also becomes the link label. */
  title: string
  /** One-line description used in the grid card. */
  short: string
  /** Optional metric (e.g. "Save up to £1,200/yr"). */
  metric?: string
  /** Lucide-style icon key - resolved inside SolutionCategories. */
  icon: 'sun' | 'battery' | 'home' | 'plug'
}

/**
 * Four-tier solution ladder - Home Energy One → Pro → Max → Ultra.
 * Each tier adds capability (storage → EV charging → whole-home) so the
 * cards read as "upgrade your system", not "four unrelated products".
 */
export const solutionCategories: SolutionCategory[] = [
  {
    id: 'one',
    eyebrow: 'Solar only',
    title: 'Home Energy One',
    short:
      'Generate your own electricity with 8 high-efficiency panels sized for typical UK homes.',
    metric: 'Save from day one',
    icon: 'sun',
  },
  {
    id: 'pro',
    eyebrow: 'Solar + Storage',
    title: 'Home Energy Pro',
    short:
      'Add a 5.12 kWh battery and HEMS so your solar powers your home day and night.',
    metric: 'Use 80%+ of your solar',
    icon: 'battery',
  },
  {
    id: 'max',
    eyebrow: 'Solar + Storage + EV',
    title: 'Home Energy Max',
    short:
      'Solar, battery and EV charger in one HEMS-managed system - charge your car with solar.',
    metric: 'Drive on sunshine',
    icon: 'home',
  },
  {
    id: 'ultra',
    eyebrow: 'Whole-home energy',
    title: 'Home Energy Ultra',
    short:
      'Solar, battery, EV and heat pump working as one - one installer, one warranty, one app.',
    metric: 'Every source of energy',
    icon: 'plug',
  },
]

export interface SolutionDetail {
  id: SolutionCategoryId
  eyebrow: string
  title: string
  intro: string
  bullets: string[]
  imagePath: string
  imageAlt: string
}

/**
 * Per-tier long-form copy for the detail sections on /solutions. Specs
 * here mirror the marketing product cards and the /my-plan plans so the
 * three surfaces tell the same story. Panels are 460 W (the unit wattage
 * declared on the spec sheet) - 8 panels → 3.68 kWp, 12 panels → 5.52 kWp.
 */
export const solutionDetails: SolutionDetail[] = [
  {
    id: 'one',
    eyebrow: 'Solar only',
    title: 'Home Energy One',
    intro:
      'A complete roof-mounted solar PV system sized for typical UK homes. MCS-certified components, G98/G100 compliant and installed in around two weeks.',
    bullets: [
      '8 × 460 W monocrystalline modules (3.68 kWp)',
      '3.6 kW string or micro inverter',
      'Roof-type-matched mounting kit (tile / slate / flat)',
      'Smart Export Guarantee (SEG) ready',
      'MCS-certified installation with a 10-year workmanship warranty',
    ],
    imagePath: '/images/solution_1.webp',
    imageAlt:
      'Home Energy One - 8-panel roof-mounted solar PV system for UK homes',
  },
  {
    id: 'pro',
    eyebrow: 'Solar + Storage',
    title: 'Home Energy Pro',
    intro:
      'Add a Solavita LiFePO₄ battery to store your daytime solar and use it in the evening - and keep the lights on during a power cut. HEMS automates charge / discharge around your tariff.',
    bullets: [
      '8 × 460 W monocrystalline modules (3.68 kWp)',
      '5.12 kWh LiFePO₄ stackable battery (expandable to 20 kWh)',
      '3.6 kW hybrid inverter',
      'HEMS scheduling, time-of-use optimisation and app control',
      'Backup power for essential circuits',
    ],
    imagePath: '/images/solution_2.webp',
    imageAlt:
      'Home Energy Pro - 8 panels paired with a 5.12 kWh Solavita home battery',
  },
  {
    id: 'max',
    eyebrow: 'Solar + Storage + EV',
    title: 'Home Energy Max',
    intro:
      'Solar + battery + EV charger in one HEMS-managed system. Solar powers your home, charges your car and tops up the battery - all routed to minimise grid imports.',
    bullets: [
      '12 × 460 W monocrystalline modules (5.52 kWp)',
      '5.12 kWh LiFePO₄ stackable battery',
      '6 kW hybrid inverter',
      'EV charger ready (Pod Point, Easee, Andersen and others)',
      'Smart load balancing, peak shaving and dynamic tariffs',
      'HEMS app control with appliance-level scheduling',
    ],
    imagePath: '/images/solution_3.webp',
    imageAlt:
      'Home Energy Max - solar, battery and EV charger managed by a single HEMS app',
  },
  {
    id: 'ultra',
    eyebrow: 'Whole-home energy',
    title: 'Home Energy Ultra',
    intro:
      'Future-ready whole-home energy. Solar, battery, EV charging and heat pump support - designed, installed and managed by one Solavita team for the lifetime of the system.',
    bullets: [
      '12 × 460 W monocrystalline modules (5.52 kWp)',
      '10.24 kWh LiFePO₄ stackable battery',
      '6 kW hybrid inverter',
      'EV charger + heat pump integrated (SG Ready / EEBUS)',
      'Whole-home load balancing and dynamic tariffs',
      'One installer, one warranty, one app - 10-year programme',
    ],
    imagePath: '/images/solution_4.webp',
    imageAlt:
      'Home Energy Ultra - whole-home solar, battery, EV and heat pump system',
  },
]

export interface WhySolavitaPoint {
  title: string
  description: string
}

export const whySolavita: WhySolavitaPoint[] = [
  {
    title: 'UK-first engineering',
    description:
      'Every system is sized for British roofs, weather and grid requirements - not adapted from elsewhere.',
  },
  {
    title: 'Two-week install',
    description:
      'From signed contract to commissioned system in around 14 days, with one project manager for the whole journey.',
  },
  {
    title: 'Backed by SKYWORTH',
    description:
      'Solavita is the UK residential solar brand of the SKYWORTH Group - a £10bn global electronics company.',
  },
  {
    title: '10-year warranty',
    description:
      'Product, performance and workmanship - backed by a UK-based service team for the lifetime of the system.',
  },
]