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
 * marketing surfaces (/, /solutions, dropdown menus, /solutions/[slug])
 * show specs only.
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

/**
 * Long-tail SEO-friendly URL slug for the per-tier detail pages under
 * `/solutions/[slug]/`. Lives separately from `SolutionCategoryId` so
 * the marketing short id stays stable for anchor navigation while the
 * URL can be optimised for search engines.
 */
export type SolutionSlug =
  | 'home-energy-one'
  | 'home-energy-pro'
  | 'home-energy-max'
  | 'home-energy-ultra'

export const SOLUTION_SLUGS: readonly SolutionSlug[] = [
  'home-energy-one',
  'home-energy-pro',
  'home-energy-max',
  'home-energy-ultra',
] as const

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
  /** Long-tail URL slug for /solutions/[slug]/ detail pages. */
  slug: SolutionSlug
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
    slug: 'home-energy-one',
  },
  {
    id: 'pro',
    eyebrow: 'Solar + Storage',
    title: 'Home Energy Pro',
    short:
      'Add a 5.12 kWh battery and HEMS so your solar powers your home day and night.',
    metric: 'Use 80%+ of your solar',
    icon: 'battery',
    slug: 'home-energy-pro',
  },
  {
    id: 'max',
    eyebrow: 'Solar + Storage + EV',
    title: 'Home Energy Max',
    short:
      'Solar, battery and EV charger in one HEMS-managed system - charge your car with solar.',
    metric: 'Drive on sunshine',
    icon: 'home',
    slug: 'home-energy-max',
  },
  {
    id: 'ultra',
    eyebrow: 'Whole-home energy',
    title: 'Home Energy Ultra',
    short:
      'Solar, battery, EV and heat pump working as one - one installer, one warranty, one app.',
    metric: 'Every source of energy',
    icon: 'plug',
    slug: 'home-energy-ultra',
  },
]

/** Inline icon used in buy-box headline numbers (kWp / kWh). */
export type SolutionStatIcon = 'solar' | 'battery'

/** One row in the "Technical Details" spec table. */
export interface SolutionSpecRow {
  label: string
  value: string
}

/** One entry in the buy-box headline spec strip (Amazon-style price slot). */
export interface SolutionStat {
  /** Headline number e.g. "3.68 kWp". */
  value: string
  /** Caption underneath. */
  label: string
  /** Which icon to render to the left of the number. */
  icon: SolutionStatIcon
}

/** Add-on chip in the buy box (HEMS, EV charger, heat pump, expansion). */
export interface SolutionAddon {
  id: string
  label: string
  /** "Included" gets a green check; "excluded" renders dim with a dot. */
  included: boolean
}

/** One large performance number with a caption (savings, payback, etc). */
export interface SolutionKpi {
  value: string
  label: string
}

/** Single FAQ item used by the per-tier TierFAQ accordion. */
export interface SolutionFaq {
  q: string
  a: string
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
  bullets: string[]
  imagePath: string
  imageAlt: string

  // -- Extended for /solutions/[slug]/ Amazon-style detail pages --------

  /** Long-tail URL slug, drives /solutions/[slug]/ routing. */
  slug: SolutionSlug
  /** Mirrors `UkProduct.popular` from uk-products.ts (Pro is the popular one). */
  popular?: boolean
  /** Headline metric surfaced in the buy box (e.g. "Save up to £1,200/yr"). */
  metric?: string
  /** Buy-box headline spec strip — 1–2 large numbers (kWp + kWh). */
  headlineStats: SolutionStat[]
  /** Main image + thumbnail strip (drives the left column gallery). */
  galleryImages: SolutionGalleryImage[]
  /** 4 short bullets for the "About this item" icon row. */
  highlights: string[]
  /** Add-on chips shown in the buy box (HEMS / EV / heat pump / expansion). */
  addons: SolutionAddon[]
  /** Amazon-style 2-col "Technical Details" spec table. */
  specTable: SolutionSpecRow[]
  /** KPI strip — 3–4 large numbers (savings, payback, warranty, install). */
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
}

/**
 * Per-tier long-form copy for the detail sections on /solutions and the
 * standalone /solutions/[slug]/ detail pages. Specs here mirror the
 * marketing product cards and the /my-plan plans so the three surfaces
 * tell the same story. Panels are 460 W (the unit wattage declared on
 * the spec sheet) - 8 panels → 3.68 kWp, 12 panels → 5.52 kWp.
 *
 * Extended fields (galleryImages, addons, specTable, kpis, boxContents,
 * faqs, ...) power the Amazon-style layout on the per-slug pages. They
 * are ignored by the legacy /solutions overview render.
 */
export const solutionDetails: SolutionDetail[] = [
  {
    id: 'one',
    slug: 'home-energy-one',
    eyebrow: 'Solar only',
    title: 'Home Energy One',
    intro:
      'A complete roof-mounted solar PV system sized for typical UK homes. MCS-certified components, G98/G99 compliant and installed in around two weeks.',
    metric: 'Save from day one',
    headlineStats: [
      { value: '3.68 kWp', label: 'Solar PV', icon: 'solar' },
      { value: '—', label: 'Battery', icon: 'battery' },
    ],
    galleryImages: [
      { src: '/images/Solar_Essential.webp', alt: 'Home Energy One — solar panel system on a UK roof', label: 'Lifestyle' },
      { src: '/images/solution_1.webp', alt: 'Home Energy One — 8-panel roof-mounted solar PV system', label: 'System' },
      { src: '/images/product-module-1.webp', alt: 'Solavita all-black n-Type PV module', label: 'Modules' },
      { src: '/images/product-inverter-1.webp', alt: 'Solavita hybrid inverter', label: 'Inverter' },
      { src: '/images/product-mounting-1.webp', alt: 'Universal tile / slate mounting kit', label: 'Mounting' },
    ],
    highlights: [
      '8 high-efficiency 460 W modules — 3.68 kWp total',
      'G98/G99 compliant — UK-grid ready, SEG eligible',
      'Roof-matched mounting — tile / slate / flat',
      '10-year workmanship warranty, MCS certified',
    ],
    addons: [
      { id: 'hems', label: 'HEMS scheduling', included: false },
      { id: 'battery', label: 'Battery storage', included: false },
      { id: 'ev', label: 'EV charger', included: false },
      { id: 'expansion', label: 'Battery expansion', included: false },
    ],
    specTable: [
      { label: 'PV modules', value: '8 × 460 W all-black n-Type monocrystalline' },
      { label: 'System size', value: '3.68 kWp DC' },
      { label: 'Inverter', value: '3.6 kW string or micro inverter' },
      { label: 'Inverter type', value: 'Single-phase, 230 V AC' },
      { label: 'Mounting', value: 'Anodised aluminium + A2 stainless, tile / slate / flat' },
      { label: 'Module efficiency', value: 'Up to 22.5%' },
      { label: 'Expected annual yield', value: '~3,200 kWh (UK south-facing roof)' },
      { label: 'Grid connection', value: 'G98 / G99 compliant' },
      { label: 'SEG ready', value: 'Yes — export tariff eligible' },
      { label: 'Backup power', value: 'Not included (solar-only)' },
      { label: 'Monitoring', value: 'Solavita app — generation & export' },
      { label: 'Installation time', value: '~2 weeks from signed contract' },
      { label: 'Certifications', value: 'MCS-012, IEC 61215, IEC 61730' },
      { label: 'Warranty', value: '10-year workmanship · 25-year module performance' },
    ],
    kpis: [
      { value: '£750–£1,000', label: 'Estimated annual saving' },
      { value: '6–8 yrs', label: 'Typical payback' },
      { value: '25 yrs', label: 'Module performance warranty' },
      { value: '2 wks', label: 'Install time' },
    ],
    boxContents: [
      '8 × Solavita 460 W all-black PV modules',
      '1 × 3.6 kW string or micro inverter',
      'Tile / slate / flat-roof matched mounting kit',
      'DC & AC isolators + cabling',
      'Solavita monitoring app — iOS & Android',
      'Free site survey and roof assessment',
      'MCS-certified installation & commissioning',
      '10-year workmanship warranty documents',
    ],
    installationTime: 'Two-week install',
    warranty: '10-year workmanship warranty',
    bullets: [
      '8 × 460 W monocrystalline modules (3.68 kWp)',
      '3.6 kW string or micro inverter',
      'Roof-type-matched mounting kit (tile / slate / flat)',
      'Smart Export Guarantee (SEG) ready',
      'MCS-certified installation with a 10-year workmanship warranty',
    ],
    faqs: [
      {
        q: 'How long does installation take?',
        a: 'From your signed contract to a commissioned system in around two weeks. The on-roof work itself usually takes a single day; the rest of the timeline covers the design survey, scaffold, DNO sign-off and commissioning.',
      },
      {
        q: 'Is the system MCS-certified?',
        a: 'Yes. Every Solavita system is installed by MCS-certified engineers using MCS-listed components, so your installation qualifies for the Smart Export Guarantee (SEG) payments from your energy supplier.',
      },
      {
        q: 'Do I need planning permission?',
        a: 'In most cases, no. Roof-mounted solar on a residential property is covered by permitted development rights in England, Wales and Scotland. We confirm this as part of your free design survey.',
      },
      {
        q: 'How much will I save on my energy bill?',
        a: 'A typical 3.68 kWp system in central or southern England generates around 3,200 kWh per year — enough to offset £750–£1,000 of grid electricity at 2026 prices. Exact savings depend on your usage profile and tariff.',
      },
      {
        q: 'Can I add battery storage later?',
        a: 'Yes. Home Energy One is designed to be upgradeable — your inverter and roof layout leave room for a future 5.12 kWh Solavita battery. We can retrofit a battery without redoing the solar install.',
      },
      {
        q: 'What happens during a power cut?',
        a: 'Home Energy One is a solar-only system, so during a grid outage the inverter shuts down for safety (anti-islanding). If backup power is important, look at Home Energy Pro or above, which include battery + essential-circuit backup.',
      },
      {
        q: 'Do you handle the SEG registration?',
        a: 'Yes — we register your system with your chosen SEG licensee (Octopus, EDF, OVO, etc.) and submit the MCS certificate on your behalf. Most customers start earning export payments within 4–6 weeks of commissioning.',
      },
      {
        q: 'What warranty do I get?',
        a: '10-year workmanship warranty on the installation itself, plus the manufacturer warranties on the modules (25-year linear performance) and inverter (10-year product). SKYWORTH-backed service team for the lifetime of the system.',
      },
    ],
    lifestyleGallery: [
      { src: '/images/solution_1.webp', alt: 'Home Energy One system on a UK roof' },
      { src: '/images/hero-system-render.webp', alt: 'Solavita system overview render' },
      { src: '/images/product-module-1.webp', alt: 'Solavita PV module close-up' },
      { src: '/images/drone-3d.webp', alt: 'Drone-view of a Solavita installation' },
    ],
    imagePath: '/images/solution_1.webp',
    imageAlt:
      'Home Energy One - 8-panel roof-mounted solar PV system for UK homes',
  },
  {
    id: 'pro',
    slug: 'home-energy-pro',
    popular: true,
    eyebrow: 'Solar + Storage',
    title: 'Home Energy Pro',
    intro:
      'Add a Solavita LiFePO₄ battery to store your daytime solar and use it in the evening - and keep the lights on during a power cut. HEMS automates charge / discharge around your tariff.',
    metric: 'Use 80%+ of your solar',
    headlineStats: [
      { value: '3.68 kWp', label: 'Solar PV', icon: 'solar' },
      { value: '5.12 kWh', label: 'Battery', icon: 'battery' },
    ],
    galleryImages: [
      { src: '/images/Storage_core.webp', alt: 'Home Energy Pro — solar plus 5.12 kWh battery stack', label: 'Lifestyle' },
      { src: '/images/solution_2.webp', alt: 'Home Energy Pro — 8 panels paired with a 5.12 kWh Solavita home battery', label: 'System' },
      { src: '/images/product-module-1.webp', alt: 'Solavita all-black n-Type PV module', label: 'Modules' },
      { src: '/images/product-inverter-1.webp', alt: 'Solavita hybrid inverter', label: 'Inverter' },
      { src: '/images/product-battery-1.webp', alt: 'Solavita LiFePO₄ high-voltage battery stack', label: 'Battery' },
      { src: '/images/product-mounting-1.webp', alt: 'Universal tile / slate mounting kit', label: 'Mounting' },
    ],
    highlights: [
      '5.12 kWh LiFePO₄ battery — expandable to 20 kWh',
      'Backup power for essential circuits during outages',
      'HEMS app — time-of-use tariff automation',
      '10-year workmanship warranty, MCS certified',
    ],
    addons: [
      { id: 'hems', label: 'HEMS scheduling', included: true },
      { id: 'battery', label: 'Battery storage', included: true },
      { id: 'ev', label: 'EV charger', included: false },
      { id: 'expansion', label: 'Battery expansion', included: true },
    ],
    specTable: [
      { label: 'PV modules', value: '8 × 460 W all-black n-Type monocrystalline' },
      { label: 'System size', value: '3.68 kWp DC' },
      { label: 'Inverter', value: '3.6 kW hybrid (PV + battery)' },
      { label: 'Battery chemistry', value: 'LiFePO₄ (lithium iron phosphate)' },
      { label: 'Battery capacity', value: '5.12 kWh per module · expandable to 20.48 kWh' },
      { label: 'Battery voltage', value: '102.4–409.6 V DC (high voltage stack)' },
      { label: 'Round-trip efficiency', value: '> 96%' },
      { label: 'Cycle life', value: '> 6,000 cycles at 90% DoD' },
      { label: 'Backup power', value: 'Yes — automatic, essential circuits' },
      { label: 'HEMS features', value: 'Time-of-use scheduling, dynamic tariffs, app control' },
      { label: 'Monitoring', value: 'Solavita app — generation, storage & export' },
      { label: 'SEG ready', value: 'Yes — export tariff eligible' },
      { label: 'Installation time', value: '~2 weeks from signed contract' },
      { label: 'Certifications', value: 'MCS-012, IEC 62619, BS 7671, UN38.3' },
      { label: 'Warranty', value: '10-year workmanship · 10-year battery · 25-year module performance' },
    ],
    kpis: [
      { value: '£900–£1,200', label: 'Estimated annual saving' },
      { value: '5–7 yrs', label: 'Typical payback' },
      { value: '10 yrs', label: 'Battery warranty' },
      { value: '2 wks', label: 'Install time' },
    ],
    boxContents: [
      '8 × Solavita 460 W all-black PV modules',
      '1 × 3.6 kW Solavita hybrid inverter',
      '1 × 5.12 kWh LiFePO₄ battery module (stackable)',
      'Tile / slate / flat-roof matched mounting kit',
      'Backup gateway + essential-circuits panel',
      'Solavita HEMS app — iOS & Android',
      'Free site survey and tariff analysis',
      'MCS-certified installation & commissioning',
      '10-year workmanship + battery warranty documents',
    ],
    installationTime: 'Two-week install',
    warranty: '10-year workmanship + 10-year battery',
    bullets: [
      '8 × 460 W monocrystalline modules (3.68 kWp)',
      '5.12 kWh LiFePO₄ stackable battery (expandable to 20 kWh)',
      '3.6 kW hybrid inverter',
      'HEMS scheduling, time-of-use optimisation and app control',
      'Backup power for essential circuits',
    ],
    faqs: [
      {
        q: 'How long does installation take?',
        a: 'Around two weeks end-to-end from signed contract. The on-site work (scaffold, panels, inverter, battery, commissioning) typically fits inside two consecutive days.',
      },
      {
        q: 'What can I run during a power cut?',
        a: 'Home Energy Pro delivers automatic backup power to your essential circuits — typically fridge, lighting, internet/router, and a couple of sockets. Total sustained load around 3 kW. The system detects an outage and switches over in under a second.',
      },
      {
        q: 'Can I expand the battery later?',
        a: 'Yes. The Solavita battery is modular — you can stack up to four 5.12 kWh modules (20.48 kWh total) at any time, mixing old and new modules. No need to replace what you have.',
      },
      {
        q: 'How does the HEMS app help me save?',
        a: 'HEMS (Home Energy Management System) learns your usage pattern and your tariff, then schedules charge and discharge to minimise grid imports. With a time-of-use tariff like Intelligent Octopus, it shifts charging to the cheapest overnight window and exports peak solar at the most expensive daytime rate.',
      },
      {
        q: 'Is the system MCS-certified?',
        a: 'Yes. Every Solavita system is MCS-certified and uses MCS-listed components, so your installation qualifies for Smart Export Guarantee payments.',
      },
      {
        q: 'Do I need a smart meter?',
        a: 'Not for installation, but a smart meter helps the HEMS app read your real-time import/export and optimise around time-of-use tariffs. We can arrange one through your supplier if you don\'t already have one.',
      },
      {
        q: 'Can I add an EV charger later?',
        a: 'Yes. If you think an EV is on the horizon, look at Home Energy Max — it adds a 6 kW inverter and EV-charger-ready load balancing. Pro can be retrofitted with an EV charger, but Max is sized for it from day one.',
      },
      {
        q: 'What warranty do I get?',
        a: '10-year workmanship warranty on the installation, 10-year product warranty on the battery (including capacity retention), and 25-year linear performance warranty on the modules. SKYWORTH-backed UK service team for the lifetime of the system.',
      },
    ],
    lifestyleGallery: [
      { src: '/images/solution_2.webp', alt: 'Home Energy Pro system on a UK home' },
      { src: '/images/product-battery-1.webp', alt: 'Solavita battery stack' },
      { src: '/images/cloud-app-data.webp', alt: 'Solavita HEMS app dashboard' },
      { src: '/images/electronic.webp', alt: 'Solavita hardware detail' },
    ],
    imagePath: '/images/solution_2.webp',
    imageAlt:
      'Home Energy Pro - 8 panels paired with a 5.12 kWh Solavita home battery',
  },
  {
    id: 'max',
    slug: 'home-energy-max',
    eyebrow: 'Solar + Storage + EV',
    title: 'Home Energy Max',
    intro:
      'Solar + battery + EV charger in one HEMS-managed system. Solar powers your home, charges your car and tops up the battery - all routed to minimise grid imports.',
    metric: 'Drive on sunshine',
    headlineStats: [
      { value: '5.52 kWp', label: 'Solar PV', icon: 'solar' },
      { value: '5.12 kWh', label: 'Battery', icon: 'battery' },
    ],
    galleryImages: [
      { src: '/images/Premium_backup.webp', alt: 'Home Energy Max — solar, battery and EV-ready system', label: 'Lifestyle' },
      { src: '/images/solution_3.webp', alt: 'Home Energy Max — solar, battery and EV charger managed by a single HEMS app', label: 'System' },
      { src: '/images/product-module-1.webp', alt: 'Solavita all-black n-Type PV module', label: 'Modules' },
      { src: '/images/product-inverter-2.webp', alt: 'Solavita 6 kW hybrid inverter', label: 'Inverter' },
      { src: '/images/product-battery-1.webp', alt: 'Solavita LiFePO₄ battery stack', label: 'Battery' },
      { src: '/images/product-mounting-2.webp', alt: 'Universal mounting kit detail', label: 'Mounting' },
    ],
    highlights: [
      '12 modules — 5.52 kWp — for higher yield & EV charging',
      '6 kW hybrid inverter — solar, battery, EV on one platform',
      'EV charger ready — Pod Point, Easee, Andersen and more',
      '10-year workmanship warranty, MCS certified',
    ],
    addons: [
      { id: 'hems', label: 'HEMS scheduling', included: true },
      { id: 'battery', label: 'Battery storage', included: true },
      { id: 'ev', label: 'EV charger', included: true },
      { id: 'expansion', label: 'Battery expansion', included: true },
    ],
    specTable: [
      { label: 'PV modules', value: '12 × 460 W all-black n-Type monocrystalline' },
      { label: 'System size', value: '5.52 kWp DC' },
      { label: 'Inverter', value: '6 kW hybrid (PV + battery)' },
      { label: 'Battery chemistry', value: 'LiFePO₄ (lithium iron phosphate)' },
      { label: 'Battery capacity', value: '5.12 kWh per module · expandable to 20.48 kWh' },
      { label: 'Battery voltage', value: '102.4–409.6 V DC (high voltage stack)' },
      { label: 'EV charger support', value: 'Pod Point, Easee, Andersen, Wallbox, Ohme' },
      { label: 'Load balancing', value: 'Smart dynamic — up to 6 kW charger headroom' },
      { label: 'Peak shaving', value: 'Yes — protects main fuse during EV charging' },
      { label: 'Backup power', value: 'Yes — automatic, essential circuits' },
      { label: 'HEMS features', value: 'Time-of-use, peak shaving, dynamic tariffs, appliance scheduling' },
      { label: 'Monitoring', value: 'Solavita app — solar, battery, EV & export' },
      { label: 'Installation time', value: '~2 weeks from signed contract' },
      { label: 'Certifications', value: 'MCS-012, IEC 62619, BS 7671, UN38.3, OZEV EVHS ready' },
      { label: 'Warranty', value: '10-year workmanship · 10-year battery · 25-year module performance' },
    ],
    kpis: [
      { value: '£1,200–£1,800', label: 'Estimated annual saving' },
      { value: '5–7 yrs', label: 'Typical payback' },
      { value: '10 yrs', label: 'Battery & inverter warranty' },
      { value: '2 wks', label: 'Install time' },
    ],
    boxContents: [
      '12 × Solavita 460 W all-black PV modules',
      '1 × 6 kW Solavita hybrid inverter',
      '1 × 5.12 kWh LiFePO₄ battery module (stackable)',
      'Tile / slate / flat-roof matched mounting kit',
      'EV charger (Pod Point / Easee / Andersen / Wallbox — choose at design stage)',
      'Backup gateway + essential-circuits panel',
      'Solavita HEMS app — iOS & Android',
      'Free site survey + EV-charging load assessment',
      'MCS-certified installation & commissioning',
      '10-year workmanship + battery + inverter warranty documents',
    ],
    installationTime: 'Two-week install',
    warranty: '10-year workmanship + 10-year battery + inverter',
    bullets: [
      '12 × 460 W monocrystalline modules (5.52 kWp)',
      '5.12 kWh LiFePO₄ stackable battery',
      '6 kW hybrid inverter',
      'EV charger ready (Pod Point, Easee, Andersen and others)',
      'Smart load balancing, peak shaving and dynamic tariffs',
      'HEMS app control with appliance-level scheduling',
    ],
    faqs: [
      {
        q: 'Will solar charge my EV?',
        a: 'Yes — HEMS routes surplus solar to your EV charger first, then to the battery, then exports the rest. On a sunny day a typical UK driver covers 20–30 miles of commuting on solar alone.',
      },
      {
        q: 'Which EV chargers are supported?',
        a: 'Home Energy Max is brand-agnostic: Pod Point, Easee, Andersen, Wallbox, Ohme, and any OZEV-approved smart charger. Pick at design stage and we supply + install as part of the same project.',
      },
      {
        q: 'Will charging an EV trip my fuse?',
        a: 'No. HEMS continuously monitors household load and dynamically throttles EV charging to keep total draw under your fuse rating (typically 60–80 A). You never see a tripped main fuse, even when the oven, tumble dryer and EV charger are running together.',
      },
      {
        q: 'How much will I save on fuel?',
        a: 'A typical UK driver does ~7,000 miles/year. At 4 mi/kWh and home-charging from solar/battery, that\'s roughly 1,750 kWh of EV demand covered by your own generation — £350–£450/yr saved on petrol/diesel, on top of the household offset.',
      },
      {
        q: 'Is the system MCS-certified?',
        a: 'Yes. The solar + battery side is MCS-certified for SEG payments. The EV charger is OZEV-approved under the EVHS / EVCS grant schemes where eligible.',
      },
      {
        q: 'Do I need a 3-phase supply?',
        a: 'No — Home Energy Max works on single-phase UK supplies (the most common). The 6 kW inverter is sized for single-phase draw limits. If your home is already 3-phase, we\'ll match the install accordingly.',
      },
      {
        q: 'Can I expand to add a heat pump?',
        a: 'Look at Home Energy Ultra for full heat-pump integration (SG Ready / EEBUS). Max can be retrofitted with a heat pump interface, but Ultra is the package designed around whole-home energy from day one.',
      },
      {
        q: 'What warranty do I get?',
        a: '10-year workmanship warranty on the install, 10-year product warranty on the battery and inverter, and 25-year linear performance warranty on the modules. UK-based service team for the lifetime of the system.',
      },
    ],
    lifestyleGallery: [
      { src: '/images/solution_3.webp', alt: 'Home Energy Max full system' },
      { src: '/images/Premium_backup.webp', alt: 'Home Energy Max lifestyle render' },
      { src: '/images/cloud-app-data.webp', alt: 'Solavita HEMS app — solar, battery and EV dashboard' },
      { src: '/images/drone-3d.webp', alt: 'Drone view of a Solavita installation' },
    ],
    imagePath: '/images/solution_3.webp',
    imageAlt:
      'Home Energy Max - solar, battery and EV charger managed by a single HEMS app',
  },
  {
    id: 'ultra',
    slug: 'home-energy-ultra',
    eyebrow: 'Whole-home energy',
    title: 'Home Energy Ultra',
    intro:
      'Future-ready whole-home energy. Solar, battery, EV charging and heat pump support - designed, installed and managed by one Solavita team for the lifetime of the system.',
    metric: 'Every source of energy',
    headlineStats: [
      { value: '5.52 kWp', label: 'Solar PV', icon: 'solar' },
      { value: '10.24 kWh', label: 'Battery', icon: 'battery' },
    ],
    galleryImages: [
      { src: '/images/Smart_home.webp', alt: 'Home Energy Ultra — whole-home solar, battery, EV and heat pump', label: 'Lifestyle' },
      { src: '/images/solution_4.webp', alt: 'Home Energy Ultra — whole-home solar, battery, EV and heat pump system', label: 'System' },
      { src: '/images/product-module-1.webp', alt: 'Solavita all-black n-Type PV module', label: 'Modules' },
      { src: '/images/product-inverter-2.webp', alt: 'Solavita 6 kW hybrid inverter', label: 'Inverter' },
      { src: '/images/product-battery-2.webp', alt: 'Solavita 10.24 kWh LiFePO₄ battery stack', label: 'Battery' },
      { src: '/images/product-mounting-3.webp', alt: 'Universal mounting kit detail', label: 'Mounting' },
    ],
    highlights: [
      '10.24 kWh battery — whole-home evening & outage autonomy',
      'EV + heat pump integrated — SG Ready / EEBUS protocols',
      'Whole-home load balancing with dynamic tariffs',
      '10-year programme — one installer, one warranty, one app',
    ],
    addons: [
      { id: 'hems', label: 'HEMS Pro scheduling', included: true },
      { id: 'battery', label: 'Battery storage', included: true },
      { id: 'ev', label: 'EV + heat pump', included: true },
      { id: 'expansion', label: 'Battery expansion', included: true },
    ],
    specTable: [
      { label: 'PV modules', value: '12 × 460 W all-black n-Type monocrystalline' },
      { label: 'System size', value: '5.52 kWp DC' },
      { label: 'Inverter', value: '6 kW hybrid (PV + battery)' },
      { label: 'Battery chemistry', value: 'LiFePO₄ (lithium iron phosphate)' },
      { label: 'Battery capacity', value: '10.24 kWh (2× stackable 5.12 kWh modules) · expandable to 20.48 kWh' },
      { label: 'Battery voltage', value: '102.4–409.6 V DC (high voltage stack)' },
      { label: 'Heat pump integration', value: 'SG Ready / EEBUS — modulates heat pump around solar yield' },
      { label: 'EV charger support', value: 'Pod Point, Easee, Andersen, Wallbox, Ohme' },
      { label: 'Whole-home load balancing', value: 'Yes — across solar, battery, EV, heat pump and grid' },
      { label: 'Dynamic tariff support', value: 'Intelligent Octopus / Go / Flux / Agile ready' },
      { label: 'Backup power', value: 'Yes — automatic, essential + selected heavy loads' },
      { label: 'HEMS features', value: 'Whole-home scheduling, peak shaving, weather forecast, tariff-aware' },
      { label: 'Monitoring', value: 'Solavita app — generation, storage, EV, heat pump & export' },
      { label: 'Installation time', value: '~2 weeks from signed contract' },
      { label: 'Certifications', value: 'MCS-012, IEC 62619, BS 7671, UN38.3, OZEV EVHS / EVCS' },
      { label: 'Warranty', value: '10-year programme — install + battery + inverter + module performance' },
    ],
    kpis: [
      { value: '£1,800–£2,400', label: 'Estimated annual saving' },
      { value: '5–7 yrs', label: 'Typical payback' },
      { value: '10 yrs', label: 'Whole-programme warranty' },
      { value: '2 wks', label: 'Install time' },
    ],
    boxContents: [
      '12 × Solavita 460 W all-black PV modules',
      '1 × 6 kW Solavita hybrid inverter',
      '2 × 5.12 kWh LiFePO₄ battery modules (10.24 kWh stackable)',
      'Tile / slate / flat-roof matched mounting kit',
      'EV charger (Pod Point / Easee / Andersen / Wallbox)',
      'Heat-pump interface module (SG Ready / EEBUS)',
      'Whole-home backup gateway + load panel',
      'Solavita HEMS Pro app — iOS & Android',
      'Free site survey + whole-home energy audit',
      'MCS-certified installation & commissioning',
      '10-year programme warranty documents',
      'Annual system health check (years 1–10)',
    ],
    installationTime: 'Two-week install',
    warranty: '10-year programme warranty',
    bullets: [
      '12 × 460 W monocrystalline modules (5.52 kWp)',
      '10.24 kWh LiFePO₄ stackable battery',
      '6 kW hybrid inverter',
      'EV charger + heat pump integrated (SG Ready / EEBUS)',
      'Whole-home load balancing and dynamic tariffs',
      'One installer, one warranty, one app - 10-year programme',
    ],
    faqs: [
      {
        q: 'How does the heat pump integration work?',
        a: 'The Solavita inverter speaks SG Ready and EEBUS to your heat pump. HEMS modulates the heat pump\'s compressor around your solar yield — running hardest when there\'s surplus sun, and throttling back when the battery needs to prioritise other loads. Most customers see a further £300–£500/yr saving on top of the solar/battery offset.',
      },
      {
        q: 'Can the battery power my whole home?',
        a: 'The 10.24 kWh stack covers an average UK evening (5–9 pm) and provides automatic backup for essential circuits during a power cut. With a heat pump on the same network, HEMS will pre-warm the home and the hot-water cylinder during the day so the heat pump can coast through the evening on stored thermal energy.',
      },
      {
        q: 'What\'s included in the 10-year programme?',
        a: 'One installer, one warranty, one app for the lifetime of the system. Every Solavita component (modules, inverter, battery, mounting, EV charger interface, heat-pump interface) is covered for 10 years — product, performance and workmanship — plus an annual system health check during the programme.',
      },
      {
        q: 'How is Ultra different from Max?',
        a: 'Max is sized for solar + battery + EV (the average UK home). Ultra adds heat-pump integration, double the battery (10.24 vs 5.12 kWh), whole-home load balancing, dynamic-tariff automation and the 10-year programme — making it the right answer for homes moving away from gas.',
      },
      {
        q: 'Is the system MCS-certified?',
        a: 'Yes — MCS-certified for SEG payments and OZEV-approved for EVHS / EVCS grants where eligible. Heat-pump integration is via SG Ready / EEBUS open standards, so it works with the major UK heat-pump brands.',
      },
      {
        q: 'Do I need 3-phase power?',
        a: 'Not necessarily. The 6 kW inverter is sized for single-phase UK supplies. If your home is already 3-phase (common in some larger properties), we\'ll match the install accordingly.',
      },
      {
        q: 'Will this future-proof my home?',
        a: 'Yes — Home Energy Ultra is designed as a 10-year platform. Modular batteries can be expanded to 20 kWh, new HEMS features arrive over-the-air, and SKYWORTH\'s UK service team supports the system for its full lifetime.',
      },
      {
        q: 'What warranty do I get?',
        a: '10-year whole-programme warranty covering product, performance and workmanship — modules, inverter, battery, mounting, EV-charger interface and heat-pump interface, all from one installer. Annual system health check included years 1–10.',
      },
    ],
    lifestyleGallery: [
      { src: '/images/solution_4.webp', alt: 'Home Energy Ultra whole-home system' },
      { src: '/images/Smart_home.webp', alt: 'Home Energy Ultra lifestyle render' },
      { src: '/images/product-battery-2.webp', alt: 'Solavita 10.24 kWh battery stack' },
      { src: '/images/cloud-app-data.webp', alt: 'Solavita HEMS Pro app dashboard' },
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
      'Solavita is the UK residential solar brand of the SKYWORTH Group - a £7.7bn global electronics company.',
  },
  {
    title: '10-year warranty',
    description:
      'Product, performance and workmanship - backed by a UK-based service team for the lifetime of the system.',
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
