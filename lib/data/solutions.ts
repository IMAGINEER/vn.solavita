/**
 * Solutions page data.
 *
 * All copy here is placeholder English - easy to swap to final content
 * without touching the page structure. Image paths reuse existing assets
 * under /images and /static/images so the page renders end-to-end without
 * any new uploads.
 */

/**
 * Map each product in the homepage Products section to the matching
 * detail section anchor on /solutions. Shared between:
 *   - `<Header>` Solutions dropdown (jumps to the right block on /solutions)
 *   - `<ProductSelector>` "Plan Details →" link on /solutions
 */
export const PRODUCT_TO_SOLUTION_ANCHOR: Record<string, string> = {
  essential: 'residential-solar',
  'storage-core': 'solar-storage',
  'smart-home': 'smart-home',
  'premium-backup': 'energy-integration',
}

export type SolutionCategoryId =
  | 'residential-solar'
  | 'solar-storage'
  | 'smart-home'
  | 'energy-integration'

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

export const solutionCategories: SolutionCategory[] = [
  {
    id: 'residential-solar',
    eyebrow: 'Solar PV',
    title: 'Residential Solar',
    short:
      'Generate your own electricity with high-efficiency panels designed for UK roofs.',
    metric: 'Cut bills by up to 70%',
    icon: 'sun',
  },
  {
    id: 'solar-storage',
    eyebrow: 'Solar + Storage',
    title: 'Solar + Battery',
    short:
      'Store daytime solar to power your home in the evening and during peak rates.',
    metric: 'Use 80%+ of your solar',
    icon: 'battery',
  },
  {
    id: 'smart-home',
    eyebrow: 'HEMS',
    title: 'Smart Home / HEMS',
    short:
      'Monitor and automate your energy use from a single Solavita app.',
    metric: 'Real-time control',
    icon: 'home',
  },
  {
    id: 'energy-integration',
    eyebrow: 'Whole-home',
    title: 'Heat Pump · EV · Energy',
    short:
      'Bring solar, battery, heat pump and EV charging into one optimised system.',
    metric: 'Whole-home energy',
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

export const solutionDetails: SolutionDetail[] = [
  {
    id: 'residential-solar',
    eyebrow: 'Solar Essential',
    title: 'Solar Essential',
    intro:
      'A complete roof-mounted solar PV system sized for your home. MCS-certified components, G98/G100 compliant and installed in around two weeks.',
    bullets: [
      'High-efficiency monocrystalline modules',
      'String inverter or micro-inverter options',
      'Roof type matched mounting kit (tile / slate / flat)',
      'Smart Export Guarantee (SEG) ready',
    ],
    imagePath: '/images/solution_1.webp',
    imageAlt: 'Solar Essential package - roof-mounted solar PV system',
  },
  {
    id: 'solar-storage',
    eyebrow: 'Storage Core',
    title: 'Storage Core',
    intro:
      'Add a Solavita battery to store your solar energy and use it when the sun is not shining - and protect your home during a power cut.',
    bullets: [
      '5 kWh - 20 kWh battery options',
      'Backup power for essential circuits',
      'Time-of-use optimisation',
      'App-controlled charge / discharge',
    ],
    imagePath: '/images/solution_2.webp',
    imageAlt: 'Storage Core package - solar panels paired with a Solavita home battery',
  },
  {
    id: 'smart-home',
    eyebrow: 'Smart Home',
    title: 'Smart Home',
    intro:
      'A Home Energy Management System (HEMS) that connects solar, battery and major appliances - and lets you automate everything from a single app.',
    bullets: [
      'Live generation & consumption',
      'Appliance-level scheduling',
      'Smart tariffs & peak shaving',
      'Voice & IFTTT integrations',
    ],
    imagePath: '/images/solution_3.webp',
    imageAlt: 'Smart Home package - energy management system dashboard',
  },
  {
    id: 'energy-integration',
    eyebrow: 'Premium Backup',
    title: 'Premium Backup',
    intro:
      'Future-ready whole-home energy. Combine solar, battery, a heat pump and EV charging into a single optimised system - designed and installed by one team.',
    bullets: [
      'Heat pump readiness planning',
      'EV charger integration (Pod Point / Easee / others)',
      'Load balancing & dynamic tariffs',
      'One app, one installer, one warranty',
    ],
    imagePath: '/images/solution_4.webp',
    imageAlt: 'Premium Backup package - whole-home energy system with heat pump and EV charging',
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
    title: '15-year warranty',
    description:
      'Product, performance and workmanship - backed by a UK-based service team for the lifetime of the system.',
  },
]
