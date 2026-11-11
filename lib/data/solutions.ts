/**
 * Solutions page data — Vietnam (copy still pending a dedicated VN pass).
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
 * follow the VN rule and never display a price until business supplies
 * approved ₦ figures.
 *
 * Specs here mirror `app/my-plan/_lib/calc.ts` (the PLANS array). Keep
 * both surfaces in sync.
 */

/* ────────────────────────────────────────────────────────────────────────
   Simulated ₦ prices for my-plan ROI engine.

   The UK site's per-tier prices (e.g. £5,099 → £9,399) were carried over
   so my-plan could render quotes. VN has no approved ₫ prices yet, but
   the ROI engine on /my-plan needs a numeric input to function. The
   values below are placeholder / simulated — clearly distinct from any
   business-approved pricing — and MUST be replaced once the business
   confirms VN package prices.

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
  /** Optional metric (e.g. "Reduce grid use"). Kept qualitative. */
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
  /** Highlighted on the collection page as the recommended tier. */
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
   * Customer segment, so the collection pages can filter
   * `solutionDetails` by `For Home` / `For Business`
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
    eyebrow: 'Essential Backup · Cut grid costs',
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
      { id: 'hems', label: 'Monitoring App', included: false },
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
      'Built for everyday families who want comfort without the top-up runs. Higher capacity to slash energy costs and blackouts.',
    shortIntro:
      'Comfort for families. Cut energy & blackout costs.',
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
      { id: 'hems', label: 'Monitoring App', included: false },
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
      'Built for larger homes, multi-appliances, and home-based businesses. Complete home energy independence.',
    shortIntro:
      'Complete home energy independence for large homes.',
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
      { id: 'hems', label: 'Monitoring App', included: false },
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
    eyebrow: 'Khởi điểm cho doanh nghiệp · Cắt giảm chi phí điện',
    title: 'BUSINESS Entry 3-Phase',
    intro:
      'Dành cho cửa hàng nhỏ, phòng khám và hộ gia đình có nhu cầu cao. Giữ các thiết bị thiết yếu hoạt động khi mất điện — đồng thời cắt giảm chi phí năng lượng.',
    shortIntro:
      'Cửa hàng, phòng khám, văn phòng, nhà hàng và khách sạn nhỏ. Vận hành sáng đèn, mát mẻ và liên tục.',
    metric: 'Khởi điểm ba pha',
    headlineStats: [
      { value: '11.78 kWp', label: 'Điện mặt trời', icon: 'solar' },
      { value: '16 kWh', label: 'Pin lưu trữ', icon: 'battery' },
    ],
    specSummary: [
      { label: 'Điện mặt trời', value: '11.78 kWp' },
      { label: 'Biến tần', value: '10 kW' },
      { label: 'Pin lưu trữ', value: '16 kWh' },
    ],
    highlights: [
      '19 × tấm pin 620 W — tổng 11.78 kWp',
      'Biến tần ba pha 10 kW',
      'Pin lưu trữ 16 kWh',
      'Dành cho biệt thự phụ tải cao và cửa hàng nhỏ dùng điện ba pha',
    ],
    addons: [
      { id: 'battery', label: 'Pin lưu trữ', included: true },
      { id: 'expansion', label: 'Mở rộng pin', included: true },
      { id: 'ev', label: 'Sạc xe điện', included: false },
      { id: 'hems', label: 'Ứng dụng giám sát', included: false },
    ],
    specTable: [
      { label: 'Tấm pin PV', value: '19 × 620 W đơn tinh thể' },
      { label: 'Tổng công suất PV định mức', value: '11.78 kWp' },
      { label: 'Biến tần', value: '10 kW, ba pha' },
      { label: 'Pin lưu trữ', value: '16 kWh' },
      { label: 'Loại pha', value: 'Ba pha' },
      { label: 'Sản lượng điện ước tính hằng năm', value: '15,000–16,000 kWh (ước tính)' },
    ],
    kpis: [
      { value: '15,000–16,000', label: 'Sản lượng kWh ước tính/năm' },
      { value: '16 kWh', label: 'Dung lượng pin' },
      { value: '11.78 kWp', label: 'Tổng công suất PV định mức' },
      { value: 'Ba pha', label: 'Pha' },
    ],
    boxContents: [
      '19 × tấm pin PV 620 W',
      '1 × biến tần ba pha 10 kW',
      'Pin lưu trữ 16 kWh',
      'Bộ khung lắp đặt phù hợp loại mái',
      'Khảo sát hiện trường và đánh giá phụ tải miễn phí',
    ],
    installationTime:
      'TBD — Phạm vi lắp đặt và thời gian bàn giao (chờ xác nhận)',
    warranty: 'TBD — Chính sách bảo hành tấm pin, biến tần, pin lưu trữ và thi công (chờ xác nhận)',
    bullets: [
      '19 × tấm pin 620 W (11.78 kWp)',
      'Biến tần ba pha 10 kW',
      'Pin lưu trữ 16 kWh',
    ],
    faqs: [
      {
        q: 'Giải pháp này có cần nguồn điện ba pha không?',
        a: 'Có — BUSINESS Entry được thiết kế cho công trình đã có nguồn ba pha. Nếu chỉ có một pha, hãy xem các giải pháp HOME Standard hoặc HOME High-spec.',
      },
      {
        q: 'Sản lượng điện ước tính hằng năm là bao nhiêu?',
        a: '15,000–16,000 kWh mỗi năm. Đây là ước tính ở cấp giải pháp — sản lượng thực tế phụ thuộc vị trí, thiết kế hệ thống, bóng râm, thời tiết và điều kiện vận hành.',
      },
      {
        q: 'Tôi có thể chạy tất cả thiết bị của cửa hàng cùng lúc không?',
        a: 'Điều này phụ thuộc công suất đầu ra của biến tần, dòng khởi động của thiết bị, thiết kế mạch và năng lượng khả dụng. Cần khảo sát phụ tải.',
      },
    ],
    loadProfile: {
      caption: '[ Cấp điện cho mọi thiết bị thiết yếu cùng lúc ]',
      appliances: [
        { icon: 'light', name: 'Đèn', duration: '24h' },
        { icon: 'pump', name: 'Máy bơm', duration: '1–2h' },
        { icon: 'refrigerator', name: 'Tủ lạnh', duration: '24h' },
        { icon: 'pc', name: 'Máy tính', duration: '6–8h' },
        { icon: 'ac', name: 'Điều hòa', duration: '8–10h' },
      ],
    },
    imagePath: '/images/BUSINESS-Entry-3-Phase.webp',
    imageAlt: 'BUSINESS Entry 3-Phase — 11.78 kWp điện mặt trời và pin 16 kWh',
    priceNgn: NG_SIMULATED_PRICE_NGN['business-entry-3-phase'],
    segment: 'businesses',
  },
  {
    id: 'business-standard-3-phase',
    slug: 'business-standard-3-phase',
    eyebrow: 'SME & F&B · Cắt giảm chi phí điện',
    title: 'BUSINESS Standard 3-Phase',
    intro:
      'Dành cho SME, F&B, nhà hàng và văn phòng. Cấp điện cho phụ tải ban ngày cùng dự phòng tin cậy để không bị gián đoạn.',
    shortIntro:
      'Nguồn điện tin cậy cho văn phòng & F&B.',
    metric: 'Điện ban ngày ổn định',
    headlineStats: [
      { value: '17.36 kWp', label: 'Điện mặt trời', icon: 'solar' },
      { value: '32 kWh', label: 'Pin lưu trữ', icon: 'battery' },
    ],
    specSummary: [
      { label: 'Điện mặt trời', value: '17.36 kWp' },
      { label: 'Biến tần', value: '15 kW' },
      { label: 'Pin lưu trữ', value: '32 kWh' },
    ],
    highlights: [
      '28 × tấm pin 620 W — tổng 17.36 kWp',
      'Biến tần ba pha 15 kW',
      'Pin lưu trữ danh định 32 kWh (2 × 16 kWh)',
      'Dành cho SME, nhà hàng, doanh nghiệp F&B và văn phòng',
    ],
    addons: [
      { id: 'battery', label: 'Pin lưu trữ', included: true },
      { id: 'expansion', label: 'Mở rộng pin', included: true },
      { id: 'ev', label: 'Sạc xe điện', included: false },
      { id: 'hems', label: 'Ứng dụng giám sát', included: false },
    ],
    specTable: [
      { label: 'Tấm pin PV', value: '28 × 620 W đơn tinh thể' },
      { label: 'Tổng công suất PV định mức', value: '17.36 kWp' },
      { label: 'Biến tần', value: '15 kW, ba pha' },
      { label: 'Pin lưu trữ', value: '2 × 16 kWh; tổng danh định 32 kWh' },
      { label: 'Loại pha', value: 'Ba pha' },
      { label: 'Sản lượng điện ước tính hằng năm', value: '22,000–23,000 kWh (ước tính)' },
    ],
    kpis: [
      { value: '22,000–23,000', label: 'Sản lượng kWh ước tính/năm' },
      { value: '32 kWh', label: 'Dung lượng pin' },
      { value: '17.36 kWp', label: 'Tổng công suất PV định mức' },
      { value: 'Ba pha', label: 'Pha' },
    ],
    boxContents: [
      '28 × tấm pin PV 620 W',
      '1 × biến tần ba pha 15 kW',
      '2 × pin lưu trữ 16 kWh (xếp chồng 32 kWh)',
      'Bộ khung lắp đặt phù hợp loại mái',
      'Khảo sát hiện trường và đánh giá phụ tải miễn phí',
    ],
    installationTime:
      'TBD — Phạm vi lắp đặt và thời gian bàn giao (chờ xác nhận)',
    warranty: 'TBD — Chính sách bảo hành tấm pin, biến tần, pin lưu trữ và thi công (chờ xác nhận)',
    bullets: [
      '28 × tấm pin 620 W (17.36 kWp)',
      'Biến tần ba pha 15 kW',
      'Pin lưu trữ 32 kWh (2 × 16 kWh)',
    ],
    faqs: [
      {
        q: 'BUSINESS Standard phù hợp với những loại hình doanh nghiệp nào?',
        a: 'SME, doanh nghiệp thực phẩm và đồ uống, nhà hàng và văn phòng có nhu cầu sử dụng điện ban ngày đều đặn và cần nguồn dự phòng tin cậy.',
      },
      {
        q: 'Sản lượng điện ước tính hằng năm là bao nhiêu?',
        a: '22,000–23,000 kWh mỗi năm. Đây là ước tính ở cấp giải pháp — sản lượng thực tế phụ thuộc vị trí, thiết kế hệ thống, bóng râm, thời tiết và điều kiện vận hành.',
      },
      {
        q: 'Pin lưu trữ có thể dự phòng trong bao lâu?',
        a: 'Thời gian chạy phụ thuộc dung lượng pin khả dụng và phụ tải kết nối. Không nên suy ra thời gian chạy chỉ từ dung lượng pin — hãy xác nhận qua khảo sát hiện trường.',
      },
    ],
    loadProfile: {
      caption: '[ Cấp điện cho mọi thiết bị thiết yếu cùng lúc ]',
      appliances: [
        { icon: 'light', name: 'Đèn', duration: '24h' },
        { icon: 'freezer', name: 'Tủ đông', duration: '6–8h' },
        { icon: 'pump', name: 'Máy bơm', duration: '2–4h' },
        { icon: 'pc', name: 'Máy tính', duration: '10–12h' },
        { icon: 'ac', name: 'Điều hòa (2 máy)', duration: '8–10h' },
      ],
    },
    imagePath: '/images/BUSINESS-Standard-3-Phase.webp',
    imageAlt: 'BUSINESS Standard 3-Phase — 17.36 kWp điện mặt trời và pin 32 kWh',
    priceNgn: NG_SIMULATED_PRICE_NGN['business-standard-3-phase'],
    segment: 'businesses',
  },
  {
    id: 'business-flagship-3-phase',
    slug: 'business-flagship-3-phase',
    eyebrow: 'Công trình lớn · Vượt giới hạn lưới điện',
    title: 'BUSINESS Flagship 3-Phase',
    intro:
      'Công suất cao hơn cho siêu thị vừa, khách sạn và chế biến nhẹ. Bước tiến vững chắc tới chủ động năng lượng.',
    shortIntro:
      'Siêu thị, khách sạn lớn, nhà máy, kho bãi. Năng lượng cấp công nghiệp cho sản lượng và tiết kiệm tối đa.',
    metric: 'Nhu cầu năng lượng lớn',
    headlineStats: [
      { value: '23.56 kWp', label: 'Điện mặt trời', icon: 'solar' },
      { value: '32 kWh', label: 'Pin lưu trữ', icon: 'battery' },
    ],
    specSummary: [
      { label: 'Điện mặt trời', value: '23.56 kWp' },
      { label: 'Biến tần', value: '20 kW' },
      { label: 'Pin lưu trữ', value: '32 kWh' },
    ],
    highlights: [
      '38 × tấm pin 620 W — tổng 23.56 kWp',
      'Biến tần ba pha 20 kW',
      'Pin lưu trữ danh định 32 kWh (2 × 16 kWh)',
      'Thiết kế cho siêu thị vừa, khách sạn và chế biến nhẹ',
    ],
    addons: [
      { id: 'battery', label: 'Pin lưu trữ', included: true },
      { id: 'expansion', label: 'Mở rộng pin', included: true },
      { id: 'ev', label: 'Sạc xe điện', included: false },
      { id: 'hems', label: 'Ứng dụng giám sát', included: false },
    ],
    specTable: [
      { label: 'Tấm pin PV', value: '38 × 620 W đơn tinh thể' },
      { label: 'Tổng công suất PV định mức', value: '23.56 kWp' },
      { label: 'Biến tần', value: '20 kW, ba pha' },
      { label: 'Pin lưu trữ', value: '2 × 16 kWh; tổng danh định 32 kWh' },
      { label: 'Loại pha', value: 'Ba pha' },
      { label: 'Sản lượng điện ước tính hằng năm', value: '30,000–32,000 kWh (ước tính)' },
    ],
    kpis: [
      { value: '30,000–32,000', label: 'Sản lượng kWh ước tính/năm' },
      { value: '32 kWh', label: 'Dung lượng pin' },
      { value: '23.56 kWp', label: 'Tổng công suất PV định mức' },
      { value: 'Ba pha', label: 'Pha' },
    ],
    boxContents: [
      '38 × tấm pin PV 620 W',
      '1 × biến tần ba pha 20 kW',
      '2 × pin lưu trữ 16 kWh (xếp chồng 32 kWh)',
      'Bộ khung lắp đặt phù hợp loại mái',
      'Khảo sát hiện trường và đánh giá phụ tải miễn phí',
    ],
    installationTime:
      'TBD — Phạm vi lắp đặt và thời gian bàn giao (chờ xác nhận)',
    warranty: 'TBD — Chính sách bảo hành tấm pin, biến tần, pin lưu trữ và thi công (chờ xác nhận)',
    bullets: [
      '38 × tấm pin 620 W (23.56 kWp)',
      'Biến tần ba pha 20 kW',
      'Pin lưu trữ 32 kWh (2 × 16 kWh)',
    ],
    faqs: [
      {
        q: 'BUSINESS Flagship được thiết kế cho đối tượng nào?',
        a: 'Siêu thị vừa, khách sạn và cơ sở chế biến nhẹ có nhu cầu năng lượng lớn và nguồn điện ba pha.',
      },
      {
        q: 'Sản lượng điện ước tính hằng năm là bao nhiêu?',
        a: '30,000–32,000 kWh mỗi năm. Đây là ước tính ở cấp giải pháp — sản lượng thực tế phụ thuộc vị trí, thiết kế hệ thống, bóng râm, thời tiết và điều kiện vận hành.',
      },
      {
        q: 'Pin lưu trữ có thể dự phòng trong bao lâu?',
        a: 'Thời gian chạy phụ thuộc dung lượng pin khả dụng và phụ tải kết nối. Không nên suy ra thời gian chạy chỉ từ dung lượng pin — hãy xác nhận qua khảo sát hiện trường.',
      },
      {
        q: 'Tôi có thể mở rộng vượt 32 kWh không?',
        a: 'TBD — Giới hạn mở rộng được hỗ trợ cho biến tần và mô hình pin Flagship đang chờ đội kỹ thuật xác nhận trước khi công bố chính thức.',
      },
    ],
    loadProfile: {
      caption: '[ Cấp điện cho mọi thiết bị thiết yếu cùng lúc ]',
      appliances: [
        { icon: 'light', name: 'Đèn', duration: '24h' },
        { icon: 'freezer', name: 'Tủ đông', duration: '8–10h' },
        { icon: 'pump', name: 'Máy bơm', duration: '4–6h' },
        { icon: 'pc', name: 'Máy tính', duration: '10–12h' },
        { icon: 'ac', name: 'Điều hòa (2 máy)', duration: '10–12h' },
      ],
    },
    imagePath: '/images/BUSINESS-Flagship-3-Phase.webp',
    imageAlt: 'BUSINESS Flagship 3-Phase — 23.56 kWp điện mặt trời và pin 32 kWh',
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
      'TBD — Verified Vietnamese installation, customer service and after-sales arrangements.',
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
   files so other surfaces can reuse the BUSINESS set, as the docx
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
    a: "Yes. You'll use less expensive grid power and cut your daily energy bills. Most families see their monthly bills drop significantly, making it a smart investment.",
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
    q: 'Giải pháp này có thực sự giúp tôi tiết kiệm không?',
    a: 'Có. Bạn sẽ dùng điện lưới với chi phí thấp hơn và cắt giảm hóa đơn năng lượng hằng ngày. Nhiều doanh nghiệp thấy hóa đơn hằng tháng giảm rõ rệt, khiến đây trở thành khoản đầu tư hợp lý.',
  },
  {
    q: 'Điều gì xảy ra khi mất điện?',
    a: 'Các hệ thống thiết yếu vẫn hoạt động. Với khả năng tự động chuyển sang pin tức thời, doanh nghiệp tránh được thời gian chết, giữ dữ liệu và vận hành an toàn, duy trì hiệu suất cao cả ngày lẫn đêm.',
  },
  {
    q: 'Pin lưu trữ dùng được bao lâu?',
    a: 'Được thiết kế bền bỉ. Với bảo hành 5 năm và 6,000 chu kỳ, pin có thể cấp điện cho doanh nghiệp của bạn hơn 10 năm — kể cả khi dùng hằng ngày.',
  },
  {
    q: 'Hệ thống có khó bảo trì không?',
    a: 'Hoàn toàn không. Chỉ cần giữ tấm pin sạch sẽ. Chúng tôi giám sát hệ thống từ xa và có chuyên gia địa phương sẵn sàng hỗ trợ khi cần.',
  },
]
