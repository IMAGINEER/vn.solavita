/**
 * Commercial & Industrial (C&I) page data — `/solutions/business-solar`.
 *
 * The page was rebuilt in Nov 2026 as a sales page for businesses
 * (factories, hotels, retail, agriculture) instead of a catalogue of
 * three packages. The structure follows the C&I brief:
 *
 *   1. Hero                    → business value, three core promises
 *   2. Solutions by business type → Small Business / Commercial / Industrial
 *   3. System packages        → PV / battery / inverter / application
 *   4. Business applications  → four industry scenarios, each with a config
 *   5. System architecture    → the four components + the system diagram
 *   6. Business benefits      → resilience / cost / reliable design
 *   7. Investment & ROI       → the savings estimator
 *   8. Project delivery       → four delivery steps
 *   9. Real projects          → the overseas C&I references we can publish
 *  10. Product details        → the four product families + datasheets
 *  11. Smart energy management→ desktop dashboard + app
 *  12. FAQ + final CTA
 *
 * Sources of truth — nothing here is invented:
 *  - Package specifications come from `lib/data/solutions.ts`
 *    (`solutionDetails`) — the published package data, which the
 *    per-tier detail pages used to render.
 *  - Product specifications come from `lib/data/products.ts`, which is
 *    transcribed from the manufacturer datasheets in
 *    `public/downloads/products/`.
 *  - Project references come from `lib/data/vn-cases.ts` (Skyworth PV
 *    overseas case deck). We hold no Vietnamese C&I case with verified
 *    capacity, so the project grid shows the overseas references and
 *    leaves the Vietnamese project slot open.
 *
 * Language: English. This page is the last English page on the Vietnam
 * site — the Vietnamese pass for the C&I copy is still an open item.
 *
 * Anything the business has not confirmed is rendered through
 * `<TbdText>` (visible red "TBD — …" placeholder) rather than guessed.
 */

import {
  solutionDetails,
  type SolutionCategoryId,
  type SolutionDetail,
} from './solutions'
import { vnCommercialCases } from './vn-cases'

/* ────────────────────────────────────────────────────────────────────────
   Packages — the three published business configurations.
   ──────────────────────────────────────────────────────────────────────── */

/** Which business size a package is aimed at. */
export type CniScaleId = 'small-business' | 'commercial' | 'industrial'

/** Look up a published solution, failing loudly if the id is wrong. */
function publishedSolution(id: SolutionCategoryId): SolutionDetail {
  const found = solutionDetails.find((s) => s.id === id)
  if (!found) throw new Error(`cni.ts: unknown solution id "${id}"`)
  return found
}

/** One row of a package's headline spec table. */
function specValue(solution: SolutionDetail, label: string): string {
  const row = solution.specSummary.find((r) => r.label === label)
  if (!row) throw new Error(`cni.ts: "${solution.id}" has no "${label}" spec`)
  return row.value
}

/** A business package plus the commercial framing around it. */
export interface CniPackage {
  /** The business size this package answers to. */
  scale: CniScaleId
  /** The published solution behind the package. */
  solution: SolutionDetail
  /** PV capacity, e.g. "11.78 kWp". */
  pv: string
  /** Battery capacity, e.g. "16 kWh". */
  battery: string
  /** Inverter rating, e.g. "10 kW". */
  inverter: string
  /** Where this configuration is typically deployed. */
  application: string
  /** The commercial reasons to pick this configuration. */
  benefits: string[]
  /**
   * Anchor of the package card in the "System packages" section — the
   * per-tier `/solutions/[slug]` detail pages were removed in the
   * SolaMate / SolaHome restructure, so the package card carries the
   * full configuration instead of linking to a dead route.
   */
  anchor: string
}

export const cniPackages: CniPackage[] = [
  {
    scale: 'small-business',
    solution: publishedSolution('business-entry-3-phase'),
    pv: specValue(publishedSolution('business-entry-3-phase'), 'Solar'),
    battery: specValue(publishedSolution('business-entry-3-phase'), 'Battery'),
    inverter: specValue(publishedSolution('business-entry-3-phase'), 'Inverter'),
    application:
      'Retail shops, clinics, cafés, small workshops and offices on a three-phase supply.',
    benefits: [
      'Cuts the daytime portion of the electricity bill first',
      'Keeps refrigeration, lighting and POS running through a grid outage',
      'Three-phase from day one — no single-phase compromise later',
    ],
    anchor: 'business-entry-3-phase',
  },
  {
    scale: 'commercial',
    solution: publishedSolution('business-standard-3-phase'),
    pv: specValue(publishedSolution('business-standard-3-phase'), 'Solar'),
    battery: specValue(publishedSolution('business-standard-3-phase'), 'Battery'),
    inverter: specValue(publishedSolution('business-standard-3-phase'), 'Inverter'),
    application:
      'Supermarkets, restaurants and food production, hotels and mid-size offices.',
    benefits: [
      'Covers the working-day load that drives most of the bill',
      'Storage sized for evening peaks and shift changes',
      'Scales panel by panel as the site grows',
    ],
    anchor: 'business-standard-3-phase',
  },
  {
    scale: 'industrial',
    solution: publishedSolution('business-flagship-3-phase'),
    pv: specValue(publishedSolution('business-flagship-3-phase'), 'Solar'),
    battery: specValue(publishedSolution('business-flagship-3-phase'), 'Battery'),
    inverter: specValue(publishedSolution('business-flagship-3-phase'), 'Inverter'),
    application:
      'Factories, warehouses, cold stores and production lines with high continuous load.',
    benefits: [
      'Largest PV block of the three — the shortest payback on a big bill',
      'Supports shift work and production that cannot stop',
      'Pairs with the All-in-One ESS when the site needs more than 32 kWh',
    ],
    anchor: 'business-flagship-3-phase',
  },
]

/** The package for one business size. */
export function cniPackageForScale(scale: CniScaleId): CniPackage {
  const found = cniPackages.find((p) => p.scale === scale)
  if (!found) throw new Error(`cni.ts: unknown scale "${scale}"`)
  return found
}

/* ────────────────────────────────────────────────────────────────────────
   ② Solutions by business type — the first-level selector.
   ──────────────────────────────────────────────────────────────────────── */

export interface CniScale {
  id: CniScaleId
  /** Tab label, e.g. "Small Business". */
  label: string
  /** One line under the label. */
  tagline: string
  /** Who this size covers. */
  who: string
  /** The package the size maps to. */
  packageId: SolutionCategoryId
  /** Three things a buyer of this size should check. */
  points: string[]
}

export const cniScales: CniScale[] = [
  {
    id: 'small-business',
    label: 'Small Business',
    tagline: 'Shops, clinics, cafés, small offices',
    who:
      'Single-site businesses on a three-phase supply whose bill is driven by refrigeration, lighting, cooling and equipment running through the working day.',
    packageId: 'business-entry-3-phase',
    points: [
      'Three-phase supply already on site',
      'Roof or car-park area with clear southern exposure',
      'One or two loads that must not drop',
    ],
  },
  {
    id: 'commercial',
    label: 'Commercial',
    tagline: 'Retail, hospitality, food production, offices',
    who:
      'Businesses with a significant daytime load and an operating window that stretches into the evening — supermarkets, restaurants, hotels and mid-size offices.',
    packageId: 'business-standard-3-phase',
    points: [
      'Peak load during trading or production hours',
      'A bill that moves with the seasons or the shift pattern',
      'Storage that has to bridge the evening peak',
    ],
  },
  {
    id: 'industrial',
    label: 'Industrial',
    tagline: 'Factories, warehouses, cold stores',
    who:
      'Sites running continuous or multi-shift production, where an outage stops output and the roof can carry a large array.',
    packageId: 'business-flagship-3-phase',
    points: [
      'Continuous load across two or three shifts',
      'Roof area for a large array, or a ground-mounted structure',
      'Backup for critical lines rather than the whole site',
    ],
  },
]

/* ────────────────────────────────────────────────────────────────────────
   ④ Business applications — one scenario per industry, each with a
   configuration behind it.
   ──────────────────────────────────────────────────────────────────────── */

export type CniApplicationIcon = 'factory' | 'hotel' | 'store' | 'leaf'

export interface CniApplication {
  id: string
  icon: CniApplicationIcon
  title: string
  /** The operational problem the scenario solves. */
  body: string
  /** The package the scenario is usually built on. */
  packageId: SolutionCategoryId
  /** The load pattern that drives the design. */
  loadPattern: string
  /** What the system does for this scenario. */
  outcome: string
}

export const cniApplications: CniApplication[] = [
  {
    id: 'manufacturing',
    icon: 'factory',
    title: 'Manufacturing',
    body:
      'Production lines, compressors and processing equipment draw power continuously. Daytime generation covers the base load, and storage carries the shift change instead of the grid.',
    packageId: 'business-flagship-3-phase',
    loadPattern:
      'Continuous base load with a sharp step at shift change.',
    outcome:
      'The base load runs on self-generated power for most of the working day, so the grid bill covers only the difference.',
  },
  {
    id: 'hotels',
    icon: 'hotel',
    title: 'Hotels & Hospitality',
    body:
      'Air-conditioning, hot water, lifts and kitchens run around the clock. Rooftop generation covers the daytime cooling load; the battery covers the evening peak and the critical circuits when the grid drops.',
    packageId: 'business-standard-3-phase',
    loadPattern:
      'Cooling and hot-water load from morning to night, peaking in the afternoon.',
    outcome:
      'Guest comfort is protected through an outage while the daytime cooling load is largely self-supplied.',
  },
  {
    id: 'retail',
    icon: 'store',
    title: 'Retail & Commercial',
    body:
      'Refrigeration, lighting and split units dominate the daytime bill for shops and supermarkets. Generation lands exactly when the store is open and the tariff is at its peak.',
    packageId: 'business-standard-3-phase',
    loadPattern:
      'Daytime-heavy, with refrigeration running overnight.',
    outcome:
      'The trading-hour bill drops while refrigeration stays on through an outage.',
  },
  {
    id: 'agriculture',
    icon: 'leaf',
    title: 'Agriculture & Processing',
    body:
      'Pumps, drying, milling and cold storage run on equipment that cannot wait for a grid restoration. A solar and storage package keeps the process line fed.',
    packageId: 'business-flagship-3-phase',
    loadPattern:
      'Seasonal, with long operating days and high motor starting demand.',
    outcome:
      'Processing runs on stored energy through the outage window instead of stopping.',
  },
]

/* ────────────────────────────────────────────────────────────────────────
   ⑥ Business benefits — three commercial outcomes, deliberately not
   promising zero downtime.
   ──────────────────────────────────────────────────────────────────────── */

export type CniBenefitIcon = 'shield' | 'wallet' | 'settings'

export interface CniBenefit {
  icon: CniBenefitIcon
  title: string
  body: string
  /** The mechanism behind the claim. */
  points: string[]
}

export const cniBenefits: CniBenefit[] = [
  {
    icon: 'shield',
    title: 'Energy Resilience',
    body:
      'Solar, storage and the right backup architecture keep critical circuits alive and reduce the operational impact of a grid interruption. Continuity depends on how the site is configured — it is designed, not assumed.',
    points: [
      'Critical loads are identified and prioritised during design',
      'Backup window is sized against the real load, not the battery label',
      'Optional standby generation or grid backup for extended outages',
    ],
  },
  {
    icon: 'wallet',
    title: 'Cost Optimisation',
    body:
      'Self-consumption, storage charge and discharge windows and tariff periods are scheduled so the site buys less energy at the hours it costs the most.',
    points: [
      'Generation is matched to the operating hours that dominate the bill',
      'Storage is scheduled around the peak-price window',
      'Every site has its own tariff and load curve — the survey sets the numbers',
    ],
  },
  {
    icon: 'settings',
    title: 'Reliable System Design',
    body:
      'The system is designed around the plant, the equipment and the operating environment: three-phase supply, motor starting demand, ambient temperature and the roof or ground structure that carries the array.',
    points: [
      'Inverter and battery sized for starting and surge currents',
      'Components specified for the site temperature and environment',
      'Structural and electrical design confirmed before installation',
    ],
  },
]

/* ────────────────────────────────────────────────────────────────────────
   ⑧ Project delivery — the four stages a business actually buys.
   ──────────────────────────────────────────────────────────────────────── */

export type CniDeliveryIcon =
  | 'clipboard'
  | 'blueprint'
  | 'wrench'
  | 'activity'

export interface CniDeliveryStep {
  id: string
  icon: CniDeliveryIcon
  title: string
  body: string
  points: string[]
}

export const cniDeliverySteps: CniDeliveryStep[] = [
  {
    id: 'assessment',
    icon: 'clipboard',
    title: 'Energy Assessment',
    body:
      'We start from the electricity bill and the equipment, not from a product list. The site is measured, the load is assessed and the critical circuits are marked.',
    points: [
      'Bill analysis, load list and operating hours',
      'Site survey: roof or ground area, structure, shading, access',
      'Supply check — single or three-phase, and what the site can carry',
    ],
  },
  {
    id: 'engineering',
    icon: 'blueprint',
    title: 'System Engineering',
    body:
      'The survey turns into a design: array layout, inverter and battery sizing, protection, and a written configuration with the expected output.',
    points: [
      'Array layout, string design and mounting method',
      'Inverter, battery and protection sizing',
      'Configuration sheet with capacity and expected generation',
    ],
  },
  {
    id: 'installation',
    icon: 'wrench',
    title: 'Installation & Commissioning',
    body:
      'The build is done by our own installation team, then commissioned and handed over with the documentation your team needs to run it.',
    points: [
      'Installation, electrical connection and commissioning tests',
      'Grid connection and metering arrangements',
      'Handover pack, operation training and warranty documentation',
    ],
  },
  {
    id: 'monitoring',
    icon: 'activity',
    title: 'Monitoring & Maintenance',
    body:
      'The system stays supervised after it goes live: remote monitoring of generation, storage state and alerts, plus scheduled maintenance and fault response.',
    points: [
      'Remote monitoring with alarm and fault notifications',
      'Scheduled cleaning, inspection and battery health checks',
      'Fault response and spare-parts handling',
    ],
  },
]

/* ────────────────────────────────────────────────────────────────────────
   ⑨ Real projects — the overseas C&I references we can actually show.
   ──────────────────────────────────────────────────────────────────────── */

export interface CniProject {
  /** Slug of the source case, so the photos stay traceable. */
  slug: string
  /** Site name, e.g. "FCC Trading City". */
  site: string
  /** Country / region. */
  country: string
  /** The sector the project serves. */
  sector: string
  /** PV capacity as published, e.g. "4.7 MW". */
  pv: string
  /** Storage capacity as published, or an empty string. */
  storage: string
  /** Completion date as published, or an empty string. */
  completed: string
  /** One factual line about the project. */
  summary: string
  /** Photo path. */
  imagePath: string
  /** Photo description. */
  imageAlt: string
}

/** The published commercial cases, mapped to the C&I project card. */
export const cniProjects: CniProject[] = [
  {
    slug: 'myanmar-fcc-trading-city-4-7mw-9-4mwh',
    site: 'FCC Trading City',
    country: 'Myanmar',
    sector: 'Commercial complex — solar and storage',
    pv: '4.7 MW',
    storage: '9.4 MWh',
    completed: '',
    summary:
      'Commercial solar and storage project at FCC Trading City — 4.7 MW of output with 9.4 MWh of storage.',
    imagePath: '/images/cases/myanmar-fcc-4-7mw-9-4mwh.webp',
    imageAlt:
      'Ground-breaking ceremony of the FCC Trading City solar and energy storage project in Myanmar',
  },
  {
    slug: 'senegal-africa-1mw-3mwh',
    site: 'Senegal',
    country: 'Senegal',
    sector: 'Large-scale storage — industrial',
    pv: '—',
    storage: '3 MWh (1 MW output)',
    completed: '',
    summary:
      'Large-scale storage project in Senegal — 1 MW of output with 3 MWh of storage, installed by the Solavita crew.',
    imagePath: '/images/cases/senegal-1mw-3mwh.webp',
    imageAlt:
      'Solavita installation crew fitting panels on a commercial rooftop in Senegal',
  },
  {
    slug: 'hongkong-china-227kw',
    site: 'Len Shing Building',
    country: 'Hong Kong',
    sector: 'Commercial building — rooftop PV',
    pv: '227 kW',
    storage: '—',
    completed: '',
    summary:
      'Rooftop commercial solar project on the Len Shing building, Hong Kong — 227 kW installed on the roof.',
    imagePath: '/images/cases/hongkong-227kw.webp',
    imageAlt:
      'Aerial view of the 227 kW rooftop solar array on the Len Shing building in Hong Kong',
  },
  {
    slug: 'thailand-wathubrak-school-5-58kw',
    site: 'Wathubrak School',
    country: 'Thailand',
    sector: 'Campus — grid-tied PV',
    pv: '5.58 kWp',
    storage: '—',
    completed: 'April 2026',
    summary:
      'Campus system at Wathubrak School, Thailand — a 5.58 kWp array of nine 620 Wp modules with a grid-tied inverter.',
    imagePath: '/images/cases/thailand-wathubrak-school-5-58kw.webp',
    imageAlt:
      'Aerial view of the 5.58 kWp solar array on the Wathubrak School roof in Thailand',
  },
]

/**
 * Guard: the project cards must stay in step with the published case
 * list, so a photo can never point at a case that was removed.
 */
const publishedCaseSlugs = new Set(vnCommercialCases.map((c) => c.slug))
for (const project of cniProjects) {
  if (!publishedCaseSlugs.has(project.slug)) {
    throw new Error(`cni.ts: project "${project.slug}" has no published case`)
  }
}

/* ────────────────────────────────────────────────────────────────────────
   ⑩ Product details — the four families behind a Solavita system.
   Specifications are transcribed from the manufacturer datasheets in
   `lib/data/products.ts` / `public/downloads/products/`.
   ──────────────────────────────────────────────────────────────────────── */

export interface CniProductTab {
  id: string
  label: string
  title: string
  subtitle: string
  imagePath: string
  imageAlt: string
  /** Core parameters shown under the product photo. */
  specs: { label: string; value: string }[]
  /** The commercial reasons to specify this product. */
  advantages: string[]
  /** The product page. */
  href: string
  /** The datasheet download. */
  datasheet: { label: string; href: string }
}

export const cniProductTabs: CniProductTab[] = [
  {
    id: 'module',
    label: 'PV Modules',
    title: 'High-Efficiency TOPCon PV Modules',
    subtitle: '620–640 W · up to 23.7% efficiency · 30-year performance warranty',
    imagePath: '/images/products/module/qm210-thcd-620-640-66-front-back.webp',
    imageAlt:
      'Solavita QM210THCD High Efficiency Series-66 TOPCon module, front and back',
    specs: [
      { label: 'Rated power', value: '620–640 W per module' },
      { label: 'Module efficiency', value: '23.0–23.7%' },
      { label: 'Cell technology', value: 'N-type TOPCon, bifacial 80%' },
      { label: 'Performance warranty', value: '30 years linear' },
      { label: 'Dimensions', value: '2382 × 1134 × 30 mm' },
    ],
    advantages: [
      'More power per square metre of roof — the constraint on every industrial site',
      'Bifacial gain on ground-mounted and elevated arrays',
      'Degradation and output warranty that matches the 25–30 year horizon of a C&I asset',
    ],
    href: '/products/module',
    datasheet: {
      label: 'Module datasheet (PDF)',
      href: '/downloads/products/module-qm210-thcd-620-640-66-datasheet.pdf',
    },
  },
  {
    id: 'inverter',
    label: 'Inverters',
    title: 'Hybrid and Off-Grid Inverters',
    subtitle: '5–20 kW three-phase hybrid · 6 kW off-grid · up to 97.9% efficiency',
    imagePath: '/images/products/inverter/swh-three-phase-1.webp',
    imageAlt: 'Solavita SWH three-phase hybrid inverter',
    specs: [
      { label: 'Rated AC output', value: '5–20 kW (three phase)' },
      { label: 'Max. PV input', value: '40 kW' },
      { label: 'Max. efficiency', value: '97.9%' },
      { label: 'Protection', value: 'IP66, C4 corrosion class' },
      { label: 'Operating range', value: '−35 ~ +60 °C' },
      { label: 'Communication', value: 'WiFi, LAN, Bluetooth, 4G, RS485, CAN, Modbus' },
    ],
    advantages: [
      'Three-phase hybrid from 5 kW to 20 kW — the range C&I sites actually run',
      'Grid-tied and off-grid modes on the same hardware',
      'Open Modbus communication for site energy management',
    ],
    href: '/products/inverter',
    datasheet: {
      label: 'Three-phase inverter datasheet (PDF)',
      href: '/downloads/products/inverter-swh-three-phase-hybrid-datasheet.pdf',
    },
  },
  {
    id: 'battery',
    label: 'Battery Storage',
    title: 'LiFePO₄ Modular Storage',
    subtitle: '5.12–16.08 kWh cabinets · up to 16 units in parallel · 10-year warranty',
    imagePath: '/images/products/battery/swr-16-08-front.webp',
    imageAlt: 'Solavita SWR 16.08 kWh LiFePO₄ battery cabinet',
    specs: [
      { label: 'Rated energy', value: '5.12 / 16.08 kWh per cabinet' },
      { label: 'Capacity', value: '100 Ah / 314 Ah' },
      { label: 'Max. charge / discharge', value: '100 A / 200 A (1C)' },
      { label: 'Max. units in parallel', value: '16' },
      { label: 'Protection', value: 'IP65, outdoor installation' },
      { label: 'Warranty', value: '10 years' },
    ],
    advantages: [
      'Scales from one cabinet to sixteen — storage grows with the site',
      '1C continuous charge and discharge handles production starting currents',
      'Optional self-heating for cold-weather operation',
    ],
    href: '/products/battery',
    datasheet: {
      label: 'Battery datasheet (PDF)',
      href: '/downloads/products/battery-swr-lifepo4-datasheet.pdf',
    },
  },
  {
    id: 'ess',
    label: 'All-in-One ESS',
    title: 'SWS 261 kWh / 125 kW All-in-One ESS',
    subtitle: 'One cabinet for a factory, a supermarket or a community mini-grid',
    imagePath: '/images/products/all-in-one-ess/sws-261-1.webp',
    imageAlt: 'Solavita SWS 261 kWh all-in-one energy storage cabinet',
    specs: [
      { label: 'Rated output', value: '125 kW (three phase)' },
      { label: 'Usable energy', value: '261.25 kWh' },
      { label: 'PCS efficiency', value: '98.6%' },
      { label: 'Battery', value: '5 LFP packs, liquid-cooled' },
      { label: 'Enclosure', value: '1050 × 2250 × 1400 mm' },
      { label: 'Delivery', value: 'Factory-assembled, ready for site installation' },
    ],
    advantages: [
      'One cabinet instead of a separate inverter, container stack and site logistics',
      '125 kW of power for factory loads, chillers or a mini-grid',
      'Liquid-cooled packs and a 98.6% PCS in a single enclosure',
    ],
    href: '/products/all-in-one-ess',
    datasheet: {
      label: 'All-in-One ESS datasheet (PDF)',
      href: '/downloads/products/all-in-one-ess-sws-261kwh-datasheet.pdf',
    },
  },
]

/* ────────────────────────────────────────────────────────────────────────
   ⑤ System architecture — the four blocks of a Solavita system and
   what each one is responsible for.
   ──────────────────────────────────────────────────────────────────────── */

export type CniComponentIcon = 'panel' | 'inverter' | 'battery' | 'cpu'

export interface CniComponent {
  id: string
  icon: CniComponentIcon
  title: string
  /** The role the block plays in the system. */
  focus: string
  /** Two or three headline parameters. */
  stats: { value: string; label: string }[]
}

export const cniComponents: CniComponent[] = [
  {
    id: 'pv',
    icon: 'panel',
    title: 'PV Modules',
    focus:
      'Turn the roof area into the output that carries the daytime load.',
    stats: [
      { value: '620–640 W', label: 'Rated power per module' },
      { value: '23.7%', label: 'Peak module efficiency' },
    ],
  },
  {
    id: 'inverter',
    icon: 'inverter',
    title: 'Inverters',
    focus:
      'Convert and condition the array output, and switch the site between grid and storage.',
    stats: [
      { value: '5–20 kW', label: 'Three-phase rated output' },
      { value: '97.9%', label: 'Maximum conversion efficiency' },
    ],
  },
  {
    id: 'battery',
    icon: 'battery',
    title: 'Battery Storage',
    focus:
      'Hold the energy that covers the peak window and the outages.',
    stats: [
      { value: '5.12–16.08 kWh', label: 'Capacity per cabinet' },
      { value: '16 units', label: 'Maximum cabinets in parallel' },
    ],
  },
  {
    id: 'management',
    icon: 'cpu',
    title: 'Energy Management',
    focus:
      'Watch the system, schedule the storage and push the output to where it is worth most.',
    stats: [
      { value: 'Real time', label: 'Generation, load and state of charge' },
      { value: 'Remote', label: 'Alerts and management from anywhere' },
    ],
  },
]

/* ────────────────────────────────────────────────────────────────────────
   ⑦ Investment & ROI — the planning assumptions behind the estimator.
   ──────────────────────────────────────────────────────────────────────── */

/**
 * Daily yield used by the estimator, in kWh per kWp per day.
 *
 * Derived from the site's own published C&I package estimates: the
 * three business packages publish 15,000–16,000 kWh/year for 11.78 kWp,
 * 22,000–23,000 kWh/year for 17.36 kWp and 30,000–32,000 kWh/year for
 * 23.56 kWp — every one of them works out at about 3.5 kWh per kWp per
 * day. It is a planning figure for Vietnam, not a guarantee: real
 * output depends on location, tilt, shading, soiling and weather.
 */
export const CNI_SPECIFIC_YIELD_KWH_PER_KWP_PER_DAY = 3.5

/**
 * Usable roof area needed per kWp of array, in m² per kWp.
 *
 * The published sizing table (`solaHomeRoofTable`) puts 15 kWp on a
 * 67–77 ㎡ roof and 30 kWp on a 135–150 ㎡ roof — about 0.21 kWp per
 * square metre of roof including walkways and setbacks. We round down to
 * 0.2 so the estimate never promises array the roof cannot carry.
 */
export const CNI_ROOF_SQM_PER_KWP = 5

/** Years used for the long-term saving projection. */
export const CNI_LONG_TERM_YEARS = 25

/**
 * The electricity price is deliberately NOT defaulted.
 *
 * A C&I tariff is not the residential tier ladder, so publishing a
 * default price here would overstate the saving. The visitor enters the
 * average price from their own bill — total amount divided by total
 * kWh — and every figure below is calculated from that number.
 */
export const CNI_TARIFF_PLACEHOLDER = 'VD/kWh'

/* ────────────────────────────────────────────────────────────────────────
   ⑫ FAQ — the business questions the page has to answer.
   ──────────────────────────────────────────────────────────────────────── */

export interface CniFaq {
  q: string
  a: string
}

export const cniFaqs: CniFaq[] = [
  {
    q: 'Do I need three-phase power for a business system?',
    a: 'All three published business configurations are three-phase. If your site is single-phase, the site survey will tell you what is possible there — the phase requirement is a property of the building, not of the product.',
  },
  {
    q: 'Will the system guarantee zero downtime?',
    a: 'No. Solar and storage cannot promise uninterrupted supply on their own. Continuity is designed: we size the backup around your critical loads, and where the business needs longer cover we add standby generation or grid backup. The design defines the result.',
  },
  {
    q: 'How is the annual saving calculated?',
    a: 'From the reference yield published with the business packages, applied to the array size your roof can carry. The money figure is then calculated at the electricity price from your own bill — it is your tariff, not an average. The final number comes out of the site survey, where your real load curve and tariff structure are applied.',
  },
  {
    q: 'How long does payback take?',
    a: 'It is confirmed at quotation, because it depends on the system price for your configuration, the tariff you actually pay and how much of the generation your site can consume directly. We publish the assumptions behind every estimate so the number can be checked.',
  },
  {
    q: 'What happens during a grid outage?',
    a: 'The inverter switches to the storage and the critical circuits you defined keep running for as long as the stored energy lasts. How long that is depends on the load you protect — it is calculated during the assessment, not read off the battery label.',
  },
  {
    q: 'What is included in the handover?',
    a: 'A configuration sheet for the installed system, commissioning records, operating and monitoring guidance, warranty documentation and training for your team. The monitoring platform stays available after handover for supervision and fault response.',
  },
  {
    q: 'Who maintains the system after installation?',
    a: 'The Solavita service team: remote monitoring with fault alerts, scheduled inspection and maintenance, and on-site response when an issue needs a technician.',
  },
  {
    q: 'Can the system be expanded later?',
    a: 'In most cases yes — the battery cabinets are designed to run up to sixteen units in parallel, and the array is extended panel by panel as capacity allows. The engineering team confirms the limits for the specific inverter and battery model during design.',
  },
]
