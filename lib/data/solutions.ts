/**
 * Solutions page data — Nigeria.
 *
 * Source of truth: `content/nigeria/products.md`. Six packages across two
 * customer segments:
 *   - For Homes: LITE Essential Backup, HOME Standard, HOME High-spec
 *   - For Larger Homes & Small Businesses: BUSINESS Entry 3-Phase,
 *     BUSINESS Standard 3-Phase, BUSINESS Flagship 3-Phase
 *
 * Used by:
 *   - `<ProductSelector>` on the homepage and /solutions
 *   - `<Header>` Solutions dropdown (each card links to its detail block)
 *   - `/solutions/[slug]/` per-tier detail pages
 *   - `app/my-plan/_lib/calc.ts` (PLANS array reads `priceNgn` to feed the
 *     ROI engine — see comment on `priceNgn` below)
 *
 * Marketing surfaces (/, /solutions, dropdown menus, /solutions/[slug])
 * follow the NG rule and never display a price until business supplies
 * approved ₦ figures.
 *
 * Specs here mirror `lib/data/ng-products.ts` and `app/my-plan/_lib/calc.ts`
 * (the PLANS array). Keep all three surfaces in sync.
 */

/* ────────────────────────────────────────────────────────────────────────
   Simulated ₦ prices for my-plan ROI engine.

   The UK site's per-tier prices (e.g. £5,099 → £9,399) were carried over
   so my-plan could render quotes. NG has no approved ₦ prices yet, but
   the ROI engine on /my-plan needs a numeric input to function. The
   values below are placeholder / simulated — clearly distinct from any
   business-approved pricing — and MUST be replaced once the business
   confirms NG package prices.

   Round-number estimates roughly tracking the UK ladder in NGN (using
   a notional £1 ≈ ₦1,300 for placeholder purposes). Do not publish
   these numbers on the marketing surface.
   ──────────────────────────────────────────────────────────────────────── */
export const NG_SIMULATED_PRICE_NGN: Record<string, number> = {
  'lite-essential-backup': 3_800_000,
  'home-standard': 6_200_000,
  'home-high-spec': 9_500_000,
  'business-entry-3-phase': 11_500_000,
  'business-standard-3-phase': 17_500_000,
  'business-flagship-3-phase': 24_000_000,
}

/**
 * Map each product in the homepage Products section to the matching
 * detail section anchor on /solutions. Shared between:
 *   - `<Header>` Solutions dropdown (jumps to the right block on /solutions)
 *   - `<ProductSelector>` "Plan Details →" link on /solutions
 */
export const PRODUCT_TO_SOLUTION_ANCHOR: Record<string, string> = {
  'lite-essential-backup': 'lite-essential-backup',
  'home-standard': 'home-standard',
  'home-high-spec': 'home-high-spec',
  'business-entry-3-phase': 'business-entry-3-phase',
  'business-standard-3-phase': 'business-standard-3-phase',
  'business-flagship-3-phase': 'business-flagship-3-phase',
}

export type SolutionCategoryId =
  | 'lite-essential-backup'
  | 'home-standard'
  | 'home-high-spec'
  | 'business-entry-3-phase'
  | 'business-standard-3-phase'
  | 'business-flagship-3-phase'

/**
 * Long-tail SEO-friendly URL slug for the per-tier detail pages under
 * `/solutions/[slug]/`. Lives separately from `SolutionCategoryId` so
 * the marketing short id stays stable for anchor navigation while the
 * URL can be optimised for search engines.
 */
export type SolutionSlug =
  | 'lite-essential-backup'
  | 'home-standard'
  | 'home-high-spec'
  | 'business-entry-3-phase'
  | 'business-standard-3-phase'
  | 'business-flagship-3-phase'

export const SOLUTION_SLUGS: readonly SolutionSlug[] = [
  'lite-essential-backup',
  'home-standard',
  'home-high-spec',
  'business-entry-3-phase',
  'business-standard-3-phase',
  'business-flagship-3-phase',
] as const

export interface SolutionCategory {
  id: SolutionCategoryId
  /** Short label shown above the title in the hero pill / section heading. */
  eyebrow: string
  /** Card title - also becomes the link label. */
  title: string
  /** One-line description used in the grid card. */
  short: string
  /** Optional metric (e.g. "Reduce generator use"). Kept qualitative. */
  metric?: string
  /** Lucide-style icon key - resolved inside SolutionCategories. */
  icon: 'sun' | 'battery' | 'home' | 'plug'
  /** Long-tail URL slug for /solutions/[slug]/ detail pages. */
  slug: SolutionSlug
  /** Customer segment label used to group the grid. */
  segment: 'homes' | 'businesses'
}

/**
 * Six-tier solution ladder - LITE Essential Backup → ... → BUSINESS
 * Flagship 3-Phase. Two segments ("For Homes" / "For Larger Homes &
 * Small Businesses"). Each tier adds capability so the cards read as
 * "upgrade your system", not "six unrelated products".
 */
export const solutionCategories: SolutionCategory[] = [
  {
    id: 'lite-essential-backup',
    eyebrow: 'Single phase · Essential backup',
    title: 'LITE Essential Backup',
    short:
      'Compact solar and battery system for essential household electricity needs.',
    metric: 'Start with the essentials',
    icon: 'sun',
    slug: 'lite-essential-backup',
    segment: 'homes',
  },
  {
    id: 'home-standard',
    eyebrow: 'Single phase · Everyday home',
    title: 'HOME Standard',
    short:
      'Higher-capacity solution for households running refrigerators, air conditioners and other everyday appliances.',
    metric: 'Power everyday living',
    icon: 'battery',
    slug: 'home-standard',
    segment: 'homes',
  },
  {
    id: 'home-high-spec',
    eyebrow: 'Single phase · Higher capacity',
    title: 'HOME High-spec',
    short:
      'Designed for larger homes and multi-appliance households with higher simultaneous demand.',
    metric: 'More appliances, more hours',
    icon: 'home',
    slug: 'home-high-spec',
    segment: 'homes',
  },
  {
    id: 'business-entry-3-phase',
    eyebrow: 'Three phase · Entry commercial',
    title: 'BUSINESS Entry 3-Phase',
    short:
      'Three-phase solar and storage option for higher-demand residences and small commercial applications.',
    metric: 'Three-phase starter',
    icon: 'plug',
    slug: 'business-entry-3-phase',
    segment: 'businesses',
  },
  {
    id: 'business-standard-3-phase',
    eyebrow: 'Three phase · Standard commercial',
    title: 'BUSINESS Standard 3-Phase',
    short:
      'Designed for SMEs, food and beverage businesses, restaurants and offices with regular daytime use.',
    metric: 'Dependable daytime power',
    icon: 'battery',
    slug: 'business-standard-3-phase',
    segment: 'businesses',
  },
  {
    id: 'business-flagship-3-phase',
    eyebrow: 'Three phase · Flagship commercial',
    title: 'BUSINESS Flagship 3-Phase',
    short:
      'Higher-capacity configuration for medium-sized supermarkets, hotels and light-processing operations.',
    metric: 'Substantial energy needs',
    icon: 'plug',
    slug: 'business-flagship-3-phase',
    segment: 'businesses',
  },
]

/** Inline icon used in buy-box headline numbers (kWp / kWh). */
export type SolutionStatIcon = 'solar' | 'battery'

/** One row in the "Technical Details" spec table. */
export interface SolutionSpecRow {
  label: string
  value: string
}

/** One entry in the buy-box headline spec strip. */
export interface SolutionStat {
  /** Headline number e.g. "4.34 kWp". */
  value: string
  /** Caption underneath. */
  label: string
  /** Which icon to render to the left of the number. */
  icon: SolutionStatIcon
}

/**
 * One row of the 3-item spec table rendered on the collection-page
 * package cards (Solar / Inverter / Battery), per `docs/修改建议.docx`
 * §"①三张套餐卡片 ③表格数量3个" (Oct 2026).
 */
export interface SolutionSpecSummaryRow {
  /** Row label — "Solar", "Inverter" or "Battery". */
  label: string
  /** Row value, e.g. "4.34 kWp", "3.6 kW", "5 kWh". */
  value: string
}

/** Add-on chip in the buy box. */
export interface SolutionAddon {
  id: string
  label: string
  /** "Included" gets a green check; "excluded" renders dim with a dot. */
  included: boolean
}

/** One large performance number with a caption. */
export interface SolutionKpi {
  value: string
  label: string
}

/** Single FAQ item used by the per-tier TierFAQ accordion. */
export interface SolutionFaq {
  q: string
  a: string
}

/** Lucide icon key used by an appliance row in the LOAD & RUNTIME card. */
export type LoadApplianceIconKey =
  | 'tv'
  | 'light'
  | 'fan'
  | 'refrigerator'
  | 'ac'
  | 'washer'
  | 'microwave'
  | 'pump'
  | 'pc'
  | 'freezer'

/** One appliance row in the LOAD & RUNTIME card. */
export interface LoadAppliance {
  icon: LoadApplianceIconKey
  /** Short label as printed on the card, e.g. "AC (1HP)", "AC (2units)". */
  name: string
  /** Estimated runtime, e.g. "2–4h" (unit included). */
  duration: string
}

/**
 * Per-package appliance-load profile rendered by the LOAD & RUNTIME
 * card. Source of truth: `docs/套餐组合-负载及运行时间-参考示意.pptx`,
 * referenced from `docs/修改建议.docx` §"②电器负载" (Oct 2026).
 */
export interface LoadProfile {
  /** Caption printed under the package name, e.g. "[ Powers all essentials together ]". */
  caption: string
  /** One row per appliance, in print order. */
  appliances: LoadAppliance[]
}

/** One image in the gallery (main + thumbnail strip + lifestyle gallery). */
export interface SolutionGalleryImage {
  src: string
  alt: string
  label?: string
}

export interface SolutionDetail {
  id: SolutionCategoryId
  eyebrow: string
  title: string
  intro: string
  /** One-sentence summary used by the collection-page card. Shorter than
   *  `intro` (which still drives the per-tier detail pages). Optional so
   *  older call-sites that pre-date the card work. */
  shortIntro?: string
  bullets: string[]
  imagePath: string
  imageAlt: string

  // -- Extended for /solutions/[slug]/ Amazon-style detail pages --------

  /** Long-tail URL slug, drives /solutions/[slug]/ routing. */
  slug: SolutionSlug
  /** Mirrors `NgProduct.popular` from ng-products.ts. */
  popular?: boolean
  /** Headline metric surfaced in the buy box. Kept qualitative. */
  metric?: string
  /** Buy-box headline spec strip — 1–2 large numbers (kWp + kWh). */
  headlineStats: SolutionStat[]
  /**
   * 3-row spec table shown on the collection-page package card
   * (Solar / Inverter / Battery). Per `docs/修改建议.docx` §"③表格数量3个".
   */
  specSummary: SolutionSpecSummaryRow[]
  /** Main image + thumbnail strip (drives the left column gallery). */
  galleryImages: SolutionGalleryImage[]
  /** 4 short bullets for the "About this item" icon row. */
  highlights: string[]
  /** Add-on chips shown in the buy box. */
  addons: SolutionAddon[]
  /** Amazon-style 2-col "Technical Details" spec table. */
  specTable: SolutionSpecRow[]
  /** KPI strip — 3–4 large numbers (generation, battery, ...). */
  kpis: SolutionKpi[]
  /** "What's in the box" checklist (physical + service items). */
  boxContents: string[]
  /** Headline install time, shown in the buy-box delivery strip. */
  installationTime: string
  /** Headline warranty, shown in the buy-box trust strip. */
  warranty: string
  /** Per-tier FAQ, rendered by TierFAQ. */
  faqs: SolutionFaq[]
  /** Lifestyle gallery (full-width image strip, 3–4 images). */
  lifestyleGallery: SolutionGalleryImage[]
  /**
   * Per-package appliance-load profile. Drives the LOAD & RUNTIME card
   * on the collection pages; see `LoadProfile` below.
   */
  loadProfile?: LoadProfile
  /**
   * Simulated ₦ price for the my-plan ROI engine. NOT surfaced on the
   * marketing surface — see NG_SIMULATED_PRICE_NGN block above. Remove
   * this comment when business supplies approved pricing.
   */
  priceNgn: number
  /**
   * Customer segment. Mirrors `NgProduct.segment` so the collection
   * pages can filter `solutionDetails` by `For Home` / `For Business`
   * per `content/nigeria/solutions.md` (the collection-pages brief).
   */
  segment: 'homes' | 'businesses'
}

/* ────────────────────────────────────────────────────────────────────────
   Per-tier long-form copy for the detail sections on /solutions and the
   standalone /solutions/[slug]/ detail pages.

   The image paths below are placeholders — every image is replaced by
   the unified `ImagePlaceholder` component on the public surface, but
   we still keep stable paths so the gallery component doesn't need
   special-casing for the marketing vs. detail pages.

   Annual generation figures are PACKAGE-LEVEL ESTIMATES per
   `content/nigeria/products.md` and must be labelled "estimate" with
   a note that actual output depends on location, system design,
   shading, weather and operating conditions. Do not present these as
   guaranteed generation, household consumption or backup runtime.
   ──────────────────────────────────────────────────────────────────────── */

export const solutionDetails: SolutionDetail[] = [
  {
    id: 'lite-essential-backup',
    slug: 'lite-essential-backup',
    eyebrow: 'Essential Backup · Ditch the diesel',
    title: 'LITE Essential Backup',
    intro:
      'Built for essential homes, from apartments to starter families. Compact solar and battery for everyday peace of mind.',
    shortIntro:
      'Compact power for apartments & starters.',
    metric: 'Start with the essentials',
    headlineStats: [
      { value: '4.34 kWp', label: 'Solar PV', icon: 'solar' },
      { value: '5 kWh', label: 'Battery', icon: 'battery' },
    ],
    specSummary: [
      { label: 'Solar', value: '4.34 kWp' },
      { label: 'Inverter', value: '3.6 kW' },
      { label: 'Battery', value: '5 kWh' },
    ],
    galleryImages: [
      { src: '/images/solution_1.webp', alt: 'LITE Essential Backup — compact solar and battery system', label: 'System' },
      { src: '/images/product-module-1.webp', alt: 'Solavita PV module', label: 'Modules' },
      { src: '/images/product-inverter-1.webp', alt: 'Solavita inverter', label: 'Inverter' },
      { src: '/images/product-battery-1.webp', alt: 'Solavita battery module', label: 'Battery' },
    ],
    highlights: [
      '7 × 620 W PV modules — 4.34 kWp total rated PV capacity',
      '3.6 kW single-phase inverter',
      '5 kWh battery storage for essential-circuit backup',
      'Right-sized for small homes, rentals and temporary power',
    ],
    addons: [
      { id: 'battery', label: 'Battery storage', included: true },
      { id: 'expansion', label: 'Battery expansion', included: false },
      { id: 'ev', label: 'EV charging', included: false },
      { id: 'hems', label: 'HEMS app', included: false },
    ],
    specTable: [
      { label: 'PV modules', value: '7 × 620 W monocrystalline' },
      { label: 'Total rated PV capacity', value: '4.34 kWp' },
      { label: 'Inverter', value: '3.6 kW, single phase' },
      { label: 'Battery storage', value: '5 kWh' },
      { label: 'Phase type', value: 'Single phase' },
      { label: 'Estimated annual generation', value: '5,500–6,000 kWh (estimate)' },
    ],
    kpis: [
      { value: '5,500–6,000', label: 'Estimated annual kWh' },
      { value: '5 kWh', label: 'Battery capacity' },
      { value: '4.34 kWp', label: 'Total rated PV' },
      { value: 'Single phase', label: 'Phase' },
    ],
    boxContents: [
      '7 × 620 W PV modules',
      '1 × 3.6 kW single-phase inverter',
      '1 × 5 kWh battery',
      'Roof-type-matched mounting kit',
      'Free site survey and load assessment',
    ],
    installationTime:
      'TBD — Confirmed installation scope and lead time',
    warranty: 'TBD — Approved module, inverter, battery and workmanship warranty',
    bullets: [
      '7 × 620 W PV modules (4.34 kWp total)',
      '3.6 kW single-phase inverter',
      '5 kWh battery storage',
    ],
    faqs: [
      {
        q: 'Who is LITE designed for?',
        a: 'Smaller homes, rental properties and any site where a compact system can cover essential circuits (lighting, refrigeration, connectivity, fans).',
      },
      {
        q: 'Can I expand the system later?',
        a: 'TBD — Confirm supported expansion limits for the LITE inverter and battery model with the engineering team before public launch.',
      },
      {
        q: 'What is the estimated annual generation?',
        a: '5,500–6,000 kWh per year. This is a solution-level estimate — actual output depends on location, system design, shading, weather and operating conditions.',
      },
      {
        q: 'How long will the battery last during an outage?',
        a: 'Runtime depends on usable battery capacity and the appliances drawing power. A larger load uses stored energy more quickly. A site-specific assessment is required for a reliable estimate.',
      },
    ],
    lifestyleGallery: [
      { src: '/images/solution_1.webp', alt: 'LITE Essential Backup system' },
      { src: '/images/Solar_Essential.webp', alt: 'LITE Essential Backup lifestyle render' },
      { src: '/images/product-module-1.webp', alt: 'Solavita PV module close-up' },
    ],
    loadProfile: {
      caption: '[ Powers all essentials together ]',
      appliances: [
        { icon: 'tv', name: 'TV', duration: '2–4h' },
        { icon: 'light', name: 'Light', duration: '8–10h' },
        { icon: 'fan', name: 'Fan', duration: '10–12h' },
        { icon: 'refrigerator', name: 'Refrigerator', duration: '24h' },
        { icon: 'ac', name: 'AC (1HP)', duration: '4–6h' },
      ],
    },
    imagePath: '/images/LITE-Essential-Backup.webp',
    imageAlt: 'LITE Essential Backup — 4.34 kWp solar and 5 kWh battery',
    priceNgn: NG_SIMULATED_PRICE_NGN['lite-essential-backup'],
    segment: 'homes',
  },
  {
    id: 'home-standard',
    slug: 'home-standard',
    popular: true,
    eyebrow: 'Everyday Home · 24/7 Stable Power',
    title: 'HOME Standard',
    intro:
      'Built for everyday families who want comfort without the fuel runs. Higher capacity to slash fuel costs and blackouts.',
    shortIntro:
      'Comfort for families. Cut fuel & blackout costs.',
    metric: 'Power everyday living',
    headlineStats: [
      { value: '7.44 kWp', label: 'Solar PV', icon: 'solar' },
      { value: '10 kWh', label: 'Battery', icon: 'battery' },
    ],
    specSummary: [
      { label: 'Solar', value: '7.44 kWp' },
      { label: 'Inverter', value: '6 kW (incl. off-grid)' },
      { label: 'Battery', value: '10 kWh' },
    ],
    galleryImages: [
      { src: '/images/solution_2.webp', alt: 'HOME Standard — 7.44 kWp solar and 10 kWh battery', label: 'System' },
      { src: '/images/product-module-1.webp', alt: 'Solavita PV module', label: 'Modules' },
      { src: '/images/product-inverter-1.webp', alt: 'Solavita hybrid inverter', label: 'Inverter' },
      { src: '/images/product-battery-1.webp', alt: 'Solavita LiFePO₄ battery stack', label: 'Battery' },
    ],
    highlights: [
      '12 × 620 W PV modules — 7.44 kWp total',
      '6 kW single-phase inverter with off-grid capability',
      '10 kWh nominal battery storage (2 × 5 kWh modules)',
      'Designed for households with refrigerators, ACs and everyday appliances',
    ],
    addons: [
      { id: 'battery', label: 'Battery storage', included: true },
      { id: 'expansion', label: 'Battery expansion', included: true },
      { id: 'ev', label: 'EV charging', included: false },
      { id: 'hems', label: 'HEMS app', included: false },
    ],
    specTable: [
      { label: 'PV modules', value: '12 × 620 W monocrystalline' },
      { label: 'Total rated PV capacity', value: '7.44 kWp' },
      { label: 'Inverter', value: '6 kW, single phase, with off-grid capability' },
      { label: 'Battery storage', value: '2 × 5 kWh modules; 10 kWh nominal total' },
      { label: 'Phase type', value: 'Single phase' },
      { label: 'Estimated annual generation', value: '9,500–10,500 kWh (estimate)' },
    ],
    kpis: [
      { value: '9,500–10,500', label: 'Estimated annual kWh' },
      { value: '10 kWh', label: 'Battery capacity' },
      { value: '7.44 kWp', label: 'Total rated PV' },
      { value: 'Single phase', label: 'Phase' },
    ],
    boxContents: [
      '12 × 620 W PV modules',
      '1 × 6 kW single-phase inverter (off-grid capable)',
      '2 × 5 kWh battery modules (10 kWh stackable)',
      'Roof-type-matched mounting kit',
      'Free site survey and load assessment',
    ],
    installationTime:
      'TBD — Confirmed installation scope and lead time',
    warranty: 'TBD — Approved module, inverter, battery and workmanship warranty',
    bullets: [
      '12 × 620 W PV modules (7.44 kWp)',
      '6 kW single-phase inverter with off-grid capability',
      '10 kWh battery storage (2 × 5 kWh)',
    ],
    faqs: [
      {
        q: 'Will HOME Standard run an air conditioner?',
        a: 'Compatibility depends on the AC unit\'s rated power, starting demand and the other appliances running at the same time. Confirm with a site assessment.',
      },
      {
        q: 'What is the estimated annual generation?',
        a: '9,500–10,500 kWh per year. This is a solution-level estimate — actual output depends on location, system design, shading, weather and operating conditions.',
      },
      {
        q: 'Is the inverter off-grid capable?',
        a: 'The HOME Standard inverter is single-phase with off-grid capability, meaning it can supply your home from the battery during an outage once configured at install.',
      },
      {
        q: 'Can I add an EV charger later?',
        a: 'TBD — Confirm supported expansion limits for the HOME Standard inverter with the engineering team before public launch.',
      },
    ],
    lifestyleGallery: [
      { src: '/images/solution_2.webp', alt: 'HOME Standard system' },
      { src: '/images/Storage_core.webp', alt: 'HOME Standard lifestyle render' },
      { src: '/images/product-battery-1.webp', alt: 'Solavita battery stack' },
    ],
    loadProfile: {
      caption: '[ Powers all essentials together ]',
      appliances: [
        { icon: 'tv', name: 'TV', duration: '6–8h' },
        { icon: 'light', name: 'Light', duration: '10–12h' },
        { icon: 'washer', name: 'Washer', duration: '2–4h' },
        { icon: 'refrigerator', name: 'Refrigerator', duration: '24h' },
        { icon: 'ac', name: 'AC (1HP)', duration: '6–8h' },
      ],
    },
    imagePath: '/images/HOME-Standard.webp',
    imageAlt: 'HOME Standard — 7.44 kWp solar and 10 kWh battery',
    priceNgn: NG_SIMULATED_PRICE_NGN['home-standard'],
    segment: 'homes',
  },
  {
    id: 'home-high-spec',
    slug: 'home-high-spec',
    eyebrow: 'Higher Capacity · Built for Yours',
    title: 'HOME High-spec',
    intro:
      'Built for larger homes, multi-appliances, and home-based businesses. Ultimate diesel replacement.',
    shortIntro:
      'Ultimate diesel replacement for large homes.',
    metric: 'More appliances, more hours',
    headlineStats: [
      { value: '9.92–12.40 kWp', label: 'Solar PV', icon: 'solar' },
      { value: '16 kWh', label: 'Battery', icon: 'battery' },
    ],
    specSummary: [
      { label: 'Solar', value: '9.92–12.40 kWp' },
      { label: 'Inverter', value: '8–12 kW (incl. off-grid)' },
      { label: 'Battery', value: '16 kWh' },
    ],
    galleryImages: [
      { src: '/images/solution_3.webp', alt: 'HOME High-spec — 16 modules and 16 kWh battery', label: 'System' },
      { src: '/images/product-module-1.webp', alt: 'Solavita PV module', label: 'Modules' },
      { src: '/images/product-inverter-2.webp', alt: 'Solavita 8–12 kW inverter', label: 'Inverter' },
      { src: '/images/product-battery-2.webp', alt: 'Solavita 16 kWh battery stack', label: 'Battery' },
    ],
    highlights: [
      '16–20 × 620 W PV modules — 9.92–12.40 kWp total',
      '8–12 kW single-phase inverter',
      '16 kWh battery storage for sustained operation',
      'Designed for larger homes and multi-appliance households',
    ],
    addons: [
      { id: 'battery', label: 'Battery storage', included: true },
      { id: 'expansion', label: 'Battery expansion', included: true },
      { id: 'ev', label: 'EV charging', included: false },
      { id: 'hems', label: 'HEMS app', included: false },
    ],
    specTable: [
      { label: 'PV modules', value: '16–20 × 620 W monocrystalline' },
      { label: 'Total rated PV capacity', value: '9.92–12.40 kWp' },
      { label: 'Inverter', value: '8–12 kW, single phase' },
      { label: 'Battery storage', value: '16 kWh' },
      { label: 'Phase type', value: 'Single phase' },
      { label: 'Estimated annual generation', value: '15,000–16,000 kWh (estimate)' },
    ],
    kpis: [
      { value: '15,000–16,000', label: 'Estimated annual kWh' },
      { value: '16 kWh', label: 'Battery capacity' },
      { value: '9.92–12.40 kWp', label: 'Total rated PV' },
      { value: 'Single phase', label: 'Phase' },
    ],
    boxContents: [
      '16–20 × 620 W PV modules',
      '1 × 8–12 kW single-phase inverter',
      '16 kWh battery storage',
      'Roof-type-matched mounting kit',
      'Free site survey and load assessment',
    ],
    installationTime:
      'TBD — Confirmed installation scope and lead time',
    warranty: 'TBD — Approved module, inverter, battery and workmanship warranty',
    bullets: [
      '16–20 × 620 W PV modules (9.92–12.40 kWp)',
      '8–12 kW single-phase inverter',
      '16 kWh battery storage',
    ],
    faqs: [
      {
        q: 'How many appliances can HOME High-spec run at once?',
        a: 'That depends on the inverter output rating, appliance starting demand and circuit design. A load assessment is required for a definitive answer.',
      },
      {
        q: 'What is the estimated annual generation?',
        a: '15,000–16,000 kWh per year. This is a solution-level estimate — actual output depends on location, system design, shading, weather and operating conditions.',
      },
      {
        q: 'Why is the module count a range, not a single number?',
        a: 'The number of 620 W modules is selected at design stage based on available roof area, shading analysis and the load assessment. 16, 18 or 20 modules all fall within the solution.',
      },
      {
        q: 'Can I keep my generator as a fallback?',
        a: 'Whether a generator can be integrated into the system depends on the equipment and installation design. The team can advise on the appropriate topology for your site.',
      },
    ],
    lifestyleGallery: [
      { src: '/images/solution_3.webp', alt: 'HOME High-spec system' },
      { src: '/images/Premium_backup.webp', alt: 'HOME High-spec lifestyle render' },
      { src: '/images/product-battery-2.webp', alt: 'Solavita 16 kWh battery stack' },
    ],
    loadProfile: {
      caption: '[ Powers all essentials together ]',
      appliances: [
        { icon: 'tv', name: 'TV', duration: '8–10h' },
        { icon: 'washer', name: 'Washer', duration: '2–4h' },
        { icon: 'microwave', name: 'Microwave', duration: '2–4h' },
        { icon: 'refrigerator', name: 'Refrigerator', duration: '24h' },
        { icon: 'ac', name: 'AC (1HP)', duration: '6–8h' },
      ],
    },
    imagePath: '/images/HOME-High-spec.webp',
    imageAlt: 'HOME High-spec — 9.92–12.40 kWp solar and 16 kWh battery',
    priceNgn: NG_SIMULATED_PRICE_NGN['home-high-spec'],
    segment: 'homes',
  },
  {
    id: 'business-entry-3-phase',
    slug: 'business-entry-3-phase',
    eyebrow: 'Starter Commercial · Cutting Fuel Runs',
    title: 'BUSINESS Entry 3-Phase',
    intro:
      'Built for small shops, clinics, and higher-demand households. Keeps essentials running through outages—while cutting fuel runs.',
    shortIntro:
      'Power for shops & clinics. Beat outages.',
    metric: 'Three-phase starter',
    headlineStats: [
      { value: '11.78 kWp', label: 'Solar PV', icon: 'solar' },
      { value: '16 kWh', label: 'Battery', icon: 'battery' },
    ],
    specSummary: [
      { label: 'Solar', value: '11.78 kWp' },
      { label: 'Inverter', value: '10 kW' },
      { label: 'Battery', value: '16 kWh' },
    ],
    galleryImages: [
      { src: '/images/solution_3.webp', alt: 'BUSINESS Entry 3-Phase — three-phase starter', label: 'System' },
      { src: '/images/product-module-1.webp', alt: 'Solavita PV module', label: 'Modules' },
      { src: '/images/product-inverter-2.webp', alt: 'Solavita 10 kW three-phase inverter', label: 'Inverter' },
      { src: '/images/product-battery-2.webp', alt: 'Solavita battery stack', label: 'Battery' },
    ],
    highlights: [
      '19 × 620 W PV modules — 11.78 kWp total',
      '10 kW three-phase inverter',
      '16 kWh battery storage',
      'For high-load villas and small shops on three-phase supply',
    ],
    addons: [
      { id: 'battery', label: 'Battery storage', included: true },
      { id: 'expansion', label: 'Battery expansion', included: true },
      { id: 'ev', label: 'EV charging', included: false },
      { id: 'hems', label: 'HEMS app', included: false },
    ],
    specTable: [
      { label: 'PV modules', value: '19 × 620 W monocrystalline' },
      { label: 'Total rated PV capacity', value: '11.78 kWp' },
      { label: 'Inverter', value: '10 kW, three phase' },
      { label: 'Battery storage', value: '16 kWh' },
      { label: 'Phase type', value: 'Three phase' },
      { label: 'Estimated annual generation', value: '15,000–16,000 kWh (estimate)' },
    ],
    kpis: [
      { value: '15,000–16,000', label: 'Estimated annual kWh' },
      { value: '16 kWh', label: 'Battery capacity' },
      { value: '11.78 kWp', label: 'Total rated PV' },
      { value: 'Three phase', label: 'Phase' },
    ],
    boxContents: [
      '19 × 620 W PV modules',
      '1 × 10 kW three-phase inverter',
      '16 kWh battery storage',
      'Roof-type-matched mounting kit',
      'Free site survey and load assessment',
    ],
    installationTime:
      'TBD — Confirmed installation scope and lead time',
    warranty: 'TBD — Approved module, inverter, battery and workmanship warranty',
    bullets: [
      '19 × 620 W PV modules (11.78 kWp)',
      '10 kW three-phase inverter',
      '16 kWh battery storage',
    ],
    faqs: [
      {
        q: 'Do I need three-phase supply for this solution?',
        a: 'Yes — BUSINESS Entry is designed for sites with an existing three-phase supply. If you only have single-phase, look at the HOME Standard or HOME High-spec solutions.',
      },
      {
        q: 'What is the estimated annual generation?',
        a: '15,000–16,000 kWh per year. This is a solution-level estimate — actual output depends on location, system design, shading, weather and operating conditions.',
      },
      {
        q: 'Can I run all my shop appliances at once?',
        a: 'That depends on the inverter\'s output rating, appliance starting demand, circuit design and available energy. A load assessment is required.',
      },
      {
        q: 'Can I keep my generator as a fallback?',
        a: 'Whether a generator can be integrated into the system depends on the equipment and installation design. The team can advise on the appropriate topology for your site.',
      },
    ],
    lifestyleGallery: [
      { src: '/images/solution_3.webp', alt: 'BUSINESS Entry 3-Phase system' },
      { src: '/images/electronic.webp', alt: 'Three-phase electrical equipment' },
      { src: '/images/product-battery-2.webp', alt: 'Solavita battery stack' },
    ],
    loadProfile: {
      caption: '[ Powers all essentials together ]',
      appliances: [
        { icon: 'light', name: 'Light', duration: '24h' },
        { icon: 'pump', name: 'Pump', duration: '1–2h' },
        { icon: 'refrigerator', name: 'Refrigerator', duration: '24h' },
        { icon: 'pc', name: 'PC', duration: '6–8h' },
        { icon: 'ac', name: 'AC', duration: '8–10h' },
      ],
    },
    imagePath: '/images/BUSINESS-Entry-3-Phase.webp',
    imageAlt: 'BUSINESS Entry 3-Phase — 11.78 kWp solar and 16 kWh battery',
    priceNgn: NG_SIMULATED_PRICE_NGN['business-entry-3-phase'],
    segment: 'businesses',
  },
  {
    id: 'business-standard-3-phase',
    slug: 'business-standard-3-phase',
    eyebrow: 'SMEs & F&B · Slash Diesel Bills',
    title: 'BUSINESS Standard 3-Phase',
    intro:
      'Built for SMEs, F&B, restaurants, and offices. Power daytime loads with reliable backup to stay ahead of outages.',
    shortIntro:
      'Reliable power for offices & F&B.',
    metric: 'Dependable daytime power',
    headlineStats: [
      { value: '17.36 kWp', label: 'Solar PV', icon: 'solar' },
      { value: '32 kWh', label: 'Battery', icon: 'battery' },
    ],
    specSummary: [
      { label: 'Solar', value: '17.36 kWp' },
      { label: 'Inverter', value: '15 kW' },
      { label: 'Battery', value: '32 kWh' },
    ],
    galleryImages: [
      { src: '/images/solution_4.webp', alt: 'BUSINESS Standard 3-Phase — 17.36 kWp solar and 32 kWh battery', label: 'System' },
      { src: '/images/product-module-1.webp', alt: 'Solavita PV module', label: 'Modules' },
      { src: '/images/product-inverter-2.webp', alt: 'Solavita 15 kW three-phase inverter', label: 'Inverter' },
      { src: '/images/product-battery-2.webp', alt: 'Solavita 16 kWh battery module', label: 'Battery' },
    ],
    highlights: [
      '28 × 620 W PV modules — 17.36 kWp total',
      '15 kW three-phase inverter',
      '32 kWh nominal battery storage (2 × 16 kWh modules)',
      'For SMEs, restaurants, F&B businesses and offices',
    ],
    addons: [
      { id: 'battery', label: 'Battery storage', included: true },
      { id: 'expansion', label: 'Battery expansion', included: true },
      { id: 'ev', label: 'EV charging', included: false },
      { id: 'hems', label: 'HEMS app', included: false },
    ],
    specTable: [
      { label: 'PV modules', value: '28 × 620 W monocrystalline' },
      { label: 'Total rated PV capacity', value: '17.36 kWp' },
      { label: 'Inverter', value: '15 kW, three phase' },
      { label: 'Battery storage', value: '2 × 16 kWh modules; 32 kWh nominal total' },
      { label: 'Phase type', value: 'Three phase' },
      { label: 'Estimated annual generation', value: '22,000–23,000 kWh (estimate)' },
    ],
    kpis: [
      { value: '22,000–23,000', label: 'Estimated annual kWh' },
      { value: '32 kWh', label: 'Battery capacity' },
      { value: '17.36 kWp', label: 'Total rated PV' },
      { value: 'Three phase', label: 'Phase' },
    ],
    boxContents: [
      '28 × 620 W PV modules',
      '1 × 15 kW three-phase inverter',
      '2 × 16 kWh battery modules (32 kWh stackable)',
      'Roof-type-matched mounting kit',
      'Free site survey and load assessment',
    ],
    installationTime:
      'TBD — Confirmed installation scope and lead time',
    warranty: 'TBD — Approved module, inverter, battery and workmanship warranty',
    bullets: [
      '28 × 620 W PV modules (17.36 kWp)',
      '15 kW three-phase inverter',
      '32 kWh battery storage (2 × 16 kWh)',
    ],
    faqs: [
      {
        q: 'What kinds of businesses is BUSINESS Standard sized for?',
        a: 'SMEs, food and beverage businesses, restaurants and offices with regular daytime energy use and a need for dependable backup power.',
      },
      {
        q: 'What is the estimated annual generation?',
        a: '22,000–23,000 kWh per year. This is a solution-level estimate — actual output depends on location, system design, shading, weather and operating conditions.',
      },
      {
        q: 'How long can the battery provide backup?',
        a: 'Runtime depends on usable battery capacity and the connected load. Do not infer runtime from battery capacity alone — confirm with a site assessment.',
      },
      {
        q: 'Can I keep my generator as a fallback?',
        a: 'Whether a generator can be integrated into the system depends on the equipment and installation design.',
      },
    ],
    lifestyleGallery: [
      { src: '/images/solution_4.webp', alt: 'BUSINESS Standard 3-Phase system' },
      { src: '/images/Smart_home.webp', alt: 'BUSINESS Standard lifestyle render' },
      { src: '/images/product-battery-2.webp', alt: 'Solavita 16 kWh battery module' },
    ],
    loadProfile: {
      caption: '[ Powers all essentials together ]',
      appliances: [
        { icon: 'light', name: 'Light', duration: '24h' },
        { icon: 'freezer', name: 'Freezer', duration: '6–8h' },
        { icon: 'pump', name: 'Pump', duration: '2–4h' },
        { icon: 'pc', name: 'PC', duration: '10–12h' },
        { icon: 'ac', name: 'AC (2units)', duration: '8–10h' },
      ],
    },
    imagePath: '/images/BUSINESS-Standard-3-Phase.webp',
    imageAlt: 'BUSINESS Standard 3-Phase — 17.36 kWp solar and 32 kWh battery',
    priceNgn: NG_SIMULATED_PRICE_NGN['business-standard-3-phase'],
    segment: 'businesses',
  },
  {
    id: 'business-flagship-3-phase',
    slug: 'business-flagship-3-phase',
    eyebrow: 'Large Sites · A Step Beyond Diesel',
    title: 'BUSINESS Flagship 3-Phase',
    intro:
      'Higher capacity for medium supermarkets, hotels, and light-processing. A strong step toward ditching diesel.',
    shortIntro:
      'High capacity for supermarkets & hotels.',
    metric: 'Substantial energy needs',
    headlineStats: [
      { value: '23.56 kWp', label: 'Solar PV', icon: 'solar' },
      { value: '32 kWh', label: 'Battery', icon: 'battery' },
    ],
    specSummary: [
      { label: 'Solar', value: '23.56 kWp' },
      { label: 'Inverter', value: '20 kW' },
      { label: 'Battery', value: '32 kWh' },
    ],
    galleryImages: [
      { src: '/images/solution_4.webp', alt: 'BUSINESS Flagship 3-Phase — 23.56 kWp solar and 32 kWh battery', label: 'System' },
      { src: '/images/product-module-1.webp', alt: 'Solavita PV module', label: 'Modules' },
      { src: '/images/product-inverter-2.webp', alt: 'Solavita 20 kW three-phase inverter', label: 'Inverter' },
      { src: '/images/product-battery-2.webp', alt: 'Solavita 16 kWh battery module', label: 'Battery' },
    ],
    highlights: [
      '38 × 620 W PV modules — 23.56 kWp total',
      '20 kW three-phase inverter',
      '32 kWh nominal battery storage (2 × 16 kWh modules)',
      'Sized for medium-sized supermarkets, hotels and light-processing',
    ],
    addons: [
      { id: 'battery', label: 'Battery storage', included: true },
      { id: 'expansion', label: 'Battery expansion', included: true },
      { id: 'ev', label: 'EV charging', included: false },
      { id: 'hems', label: 'HEMS app', included: false },
    ],
    specTable: [
      { label: 'PV modules', value: '38 × 620 W monocrystalline' },
      { label: 'Total rated PV capacity', value: '23.56 kWp' },
      { label: 'Inverter', value: '20 kW, three phase' },
      { label: 'Battery storage', value: '2 × 16 kWh modules; 32 kWh nominal total' },
      { label: 'Phase type', value: 'Three phase' },
      { label: 'Estimated annual generation', value: '30,000–32,000 kWh (estimate)' },
    ],
    kpis: [
      { value: '30,000–32,000', label: 'Estimated annual kWh' },
      { value: '32 kWh', label: 'Battery capacity' },
      { value: '23.56 kWp', label: 'Total rated PV' },
      { value: 'Three phase', label: 'Phase' },
    ],
    boxContents: [
      '38 × 620 W PV modules',
      '1 × 20 kW three-phase inverter',
      '2 × 16 kWh battery modules (32 kWh stackable)',
      'Roof-type-matched mounting kit',
      'Free site survey and load assessment',
    ],
    installationTime:
      'TBD — Confirmed installation scope and lead time',
    warranty: 'TBD — Approved module, inverter, battery and workmanship warranty',
    bullets: [
      '38 × 620 W PV modules (23.56 kWp)',
      '20 kW three-phase inverter',
      '32 kWh battery storage (2 × 16 kWh)',
    ],
    faqs: [
      {
        q: 'Who is BUSINESS Flagship designed for?',
        a: 'Medium-sized supermarkets, hotels and light-processing operations with substantial energy needs and a three-phase supply.',
      },
      {
        q: 'What is the estimated annual generation?',
        a: '30,000–32,000 kWh per year. This is a solution-level estimate — actual output depends on location, system design, shading, weather and operating conditions.',
      },
      {
        q: 'How long can the battery provide backup?',
        a: 'Runtime depends on usable battery capacity and the connected load. Do not infer runtime from battery capacity alone — confirm with a site assessment.',
      },
      {
        q: 'Can I expand beyond 32 kWh?',
        a: 'TBD — Confirm supported expansion limits for the Flagship inverter and battery model with the engineering team before public launch.',
      },
    ],
    lifestyleGallery: [
      { src: '/images/solution_4.webp', alt: 'BUSINESS Flagship 3-Phase system' },
      { src: '/images/Smart_home.webp', alt: 'BUSINESS Flagship lifestyle render' },
      { src: '/images/product-battery-2.webp', alt: 'Solavita 16 kWh battery module' },
    ],
    loadProfile: {
      caption: '[ Powers all essentials together ]',
      appliances: [
        { icon: 'light', name: 'Light', duration: '24h' },
        { icon: 'freezer', name: 'Freezer', duration: '8–10h' },
        { icon: 'pump', name: 'Pump', duration: '4–6h' },
        { icon: 'pc', name: 'PC', duration: '10–12h' },
        { icon: 'ac', name: 'AC (2units)', duration: '10–12h' },
      ],
    },
    imagePath: '/images/BUSINESS-Flagship-3-Phase.webp',
    imageAlt: 'BUSINESS Flagship 3-Phase — 23.56 kWp solar and 32 kWh battery',
    priceNgn: NG_SIMULATED_PRICE_NGN['business-flagship-3-phase'],
    segment: 'businesses',
  },
]

export interface WhySolavitaPoint {
  title: string
  description: string
}

export const whySolavita: WhySolavitaPoint[] = [
  {
    title: 'Defined solutions',
    description:
      'Compare panel counts, inverter ratings and battery capacities in one place across six solutions for homes, larger residences and small businesses.',
  },
  {
    title: 'Sized for real energy needs',
    description:
      'From essential backup to higher-load homes and selected small commercial applications — every solution is designed around a specific energy profile.',
  },
  {
    title: 'Backed by the SKYWORTH brand',
    description:
      'Solar and energy solutions backed by the SKYWORTH Group, presented with clear configuration data and a transparent path from enquiry to installation.',
  },
  {
    title: 'Local support arrangements',
    description:
      'TBD — Verified Nigerian installation, customer service and after-sales arrangements.',
  },
]

/* ────────────────────────────────────────────────────────────────────────
   Per-slug helpers used by app/solutions/[slug]/page.tsx (Next.js
   generateStaticParams / getSolutionBySlug).
   ──────────────────────────────────────────────────────────────────────── */

/** All long-tail slugs - feeds `generateStaticParams()`. */
export function allSolutionSlugs(): SolutionSlug[] {
  return [...SOLUTION_SLUGS]
}

/** Look up a detail by its long-tail slug. Returns undefined on miss so
 *  callers can call `notFound()` from a Next.js server component. */
export function getSolutionBySlug(slug: string): SolutionDetail | undefined {
  return solutionDetails.find((d) => d.slug === slug)
}

/* ────────────────────────────────────────────────────────────────────────
   Shared FAQ copy.

   The four Q&A come from `docs/修改建议.docx` §6 (Oct 2026). The HOME
   set and the BUSINESS set are kept here rather than in the two page
   files so the microgrid page can reuse the BUSINESS set, as the docx
   asks ("⑤FAQ（沿用Business套餐详情页的FAQ）").
   ──────────────────────────────────────────────────────────────────────── */

/** One Q&A pair on a solution collection page. */
export interface SolutionFaqItem {
  q: string
  a: string
}

export const homeSolutionFaqs: SolutionFaqItem[] = [
  {
    q: 'Will this really save me money?',
    a: "Yes. You'll use less expensive grid power and buy far less diesel for your generator. Most families see their monthly bills drop significantly, making it a smart investment.",
  },
  {
    q: 'What happens when the power goes out?',
    a: 'Your lights, fridge, and Wi-Fi stay on. The system automatically switches to battery power instantly, so your family stays comfortable and safe, day or night.',
  },
  {
    q: 'How long will the battery last?',
    a: "It's built to last. With a 5-year warranty and 6,000 cycles, this battery can power your home for over 10 years-even with daily use.",
  },
  {
    q: 'Is it hard to maintain?',
    a: 'Not at all. Just keep the panels clean. We monitor your system remotely and have local experts ready to help if you need us.',
  },
]

export const businessSolutionFaqs: SolutionFaqItem[] = [
  {
    q: 'Will this really save me money?',
    a: "Yes. You'll use less expensive grid power and buy far less diesel for your generator. Most families see their monthly bills drop significantly, making it a smart investment.",
  },
  {
    q: 'What happens when the power goes out?',
    a: 'Essential systems stay on. With an instant automatic switch to battery power, your business avoids downtime, keeps data and operations secure, and maintains peak efficiency day or night.',
  },
  {
    q: 'How long will the battery last?',
    a: "It's built to last. With a 5-year warranty and 6,000 cycles, this battery can power your home for over 10 years-even with daily use.",
  },
  {
    q: 'Is it hard to maintain?',
    a: 'Not at all. Just keep the panels clean. We monitor your system remotely and have local experts ready to help if you need us.',
  },
]
