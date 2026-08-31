/**
 * Solutions page data.
 *
 * All copy here is placeholder English — easy to swap to final content
 * without touching the page structure. Image paths reuse existing assets
 * under /images and /static/images so the page renders end-to-end without
 * any new uploads.
 */

export type SolutionCategoryId =
  | 'residential-solar'
  | 'solar-storage'
  | 'smart-home'
  | 'energy-integration'

export interface SolutionCategory {
  id: SolutionCategoryId
  /** Short label shown above the title in the hero pill / section heading. */
  eyebrow: string
  /** Card title — also becomes the link label. */
  title: string
  /** One-line description used in the grid card. */
  short: string
  /** Optional metric (e.g. "Save up to £1,200/yr"). */
  metric?: string
  /** Lucide-style icon key — resolved inside SolutionCategories. */
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
    eyebrow: 'Solar PV',
    title: 'Residential Solar',
    intro:
      'A complete roof-mounted solar PV system sized for your home. MCS-certified components, G98/G100 compliant and installed in around two weeks.',
    bullets: [
      'High-efficiency monocrystalline modules',
      'String inverter or micro-inverter options',
      'Roof type matched mounting kit (tile / slate / flat)',
      'Smart Export Guarantee (SEG) ready',
    ],
    imagePath: '/images/Solar_Essential.webp',
    imageAlt: 'Residential solar panel system on a UK home',
  },
  {
    id: 'solar-storage',
    eyebrow: 'Solar + Storage',
    title: 'Solar + Storage',
    intro:
      'Add a Solavita battery to store your solar energy and use it when the sun is not shining — and protect your home during a power cut.',
    bullets: [
      '5 kWh – 20 kWh battery options',
      'Backup power for essential circuits',
      'Time-of-use optimisation',
      'App-controlled charge / discharge',
    ],
    imagePath: '/images/Storage_core.webp',
    imageAlt: 'Solar panels paired with a Solavita home battery',
  },
  {
    id: 'smart-home',
    eyebrow: 'Smart Home / HEMS',
    title: 'Smart Home · HEMS',
    intro:
      'A Home Energy Management System (HEMS) that connects solar, battery and major appliances — and lets you automate everything from a single app.',
    bullets: [
      'Live generation & consumption',
      'Appliance-level scheduling',
      'Smart tariffs & peak shaving',
      'Voice & IFTTT integrations',
    ],
    imagePath: '/images/Premium_backup.webp',
    imageAlt: 'Smart home energy management system dashboard',
  },
  {
    id: 'energy-integration',
    eyebrow: 'Heat Pump · EV · Energy',
    title: 'Heat Pump · EV · Energy',
    intro:
      'Future-ready whole-home energy. Combine solar, battery, a heat pump and EV charging into a single optimised system — designed and installed by one team.',
    bullets: [
      'Heat pump readiness planning',
      'EV charger integration (Pod Point / Easee / others)',
      'Load balancing & dynamic tariffs',
      'One app, one installer, one warranty',
    ],
    imagePath: '/images/Smart_home.webp',
    imageAlt: 'Whole-home energy system with heat pump and EV charging',
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
      'Every system is sized for British roofs, weather and grid requirements — not adapted from elsewhere.',
  },
  {
    title: 'Two-week install',
    description:
      'From signed contract to commissioned system in around 14 days, with one project manager for the whole journey.',
  },
  {
    title: 'Backed by SKYWORTH',
    description:
      'Solavita is the UK residential solar brand of the SKYWORTH Group — a £10bn global electronics company.',
  },
  {
    title: '15-year warranty',
    description:
      'Product, performance and workmanship — backed by a UK-based service team for the lifetime of the system.',
  },
]
