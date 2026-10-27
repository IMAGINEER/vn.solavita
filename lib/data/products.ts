/**
 * Products catalogue — Nigeria.
 *
 * Source of truth: `docs/Modules&Inverter&Battery&All in One ESS.pptx`
 * (the business-supplied product brief referenced from
 * `docs/修改建议.docx` §"Products - … - 详情页", Oct 2026).
 *
 * Structure of every product detail page (per the docx):
 *   ① image  ② advantage breakdown  ③ brief spec table
 *
 * The docx asks for "③简要参数" (brief parameters) and the PPTX supplies
 * the full technical data. Both are rendered.
 *
 * ── TBD handling ──────────────────────────────────────────────────────
 * Several spec cells in the source PPTX are BLANK (AC voltage, MPPT
 * voltage range, max efficiency, protection degree on the inverter
 * slides; nominal voltage and protection grade on the battery slide).
 * Blank cells are modelled as `null` and render through `<TbdText>` in
 * red, per the NG content strategy: never publish an unverified
 * technical figure. They are NOT left silently empty and they are NOT
 * invented.
 *
 * The certification standards on the Module page (IEC / ISO) come from
 * the manufacturer's own datasheet supplied in the same PPTX, so they
 * are the business's own claim rather than a UK-site carry-over.
 * Confirm with the business before launch.
 */

export type ProductSlug =
  | 'module'
  | 'inverter'
  | 'battery'
  | 'all-in-one-ess'

/** The two top-level entries of the "Products" nav dropdown. */
export type ProductCategory = 'module-inverter-battery' | 'all-in-one-ess'

/** One headline number on a product page. */
export interface ProductStat {
  value: string
  label: string
}

/** One advantage card (the "②优势拆解" block). */
export interface ProductAdvantage {
  title: string
  body: string
}

/** One row of a spec table. `null` in `values` = a TBD cell. */
export interface ProductSpecRow {
  label: string
  values: (string | null)[]
}

/**
 * One model variant of a product. Module / Battery / All-in-One ESS
 * have a single variant; the Inverter page carries three (single-phase
 * hybrid, three-phase hybrid, off-grid single-phase).
 */
export interface ProductVariant {
  id: string
  /** Model family name, e.g. "SWH 3.6/6/8/10/12kW". */
  name: string
  /** One-line positioning, e.g. "3.6-12kW | Single Phase | Low Voltage". */
  subtitle: string
  /** Model names across the top of the spec table. */
  columns: string[]
  /** Spec rows. */
  rows: ProductSpecRow[]
  /** Headline numbers for this variant. */
  stats: ProductStat[]
}

export interface Product {
  slug: ProductSlug
  /** Page title, e.g. "PV Module". */
  name: string
  /** Which nav dropdown entry the product belongs to. */
  category: ProductCategory
  /** Short positioning line, e.g. "Higher Power, Higher Efficiency, Beat Blackouts". */
  tagline: string
  /** Lead paragraph. */
  description: string
  /** What the hero image should show (used by the image placeholder). */
  imageDescription: string
  /** Headline numbers, rendered as a stat strip under the hero. */
  stats: ProductStat[]
  /** The main advantage cards. */
  advantages: ProductAdvantage[]
  /**
   * A second, smaller advantage group. Used by the off-grid inverter,
   * whose brief splits two large cards from six small ones.
   */
  extraAdvantages?: ProductAdvantage[]
  /** Model variants — one tab / section each. */
  variants: ProductVariant[]
  /** Optional quality-system / certification block. */
  certifications?: { title: string; items: string[] }
}

/**
 * Reason string reused for every blank cell in the source PPTX. Kept
 * short so it fits inside a narrow table column.
 */
export const PRODUCT_SPEC_TBD = 'Verified product datasheet'

export const products: Product[] = [
  /* ────────────────────────────────────────────────────────────────────
     PV Module — slide 1 of the product PPTX
     ──────────────────────────────────────────────────────────────────── */
  {
    slug: 'module',
    name: 'PV Module',
    category: 'module-inverter-battery',
    tagline: 'Higher Power, Higher Efficiency, Beat Blackouts',
    description:
      'Engineered for extreme climates, TOPCon module cuts diesel costs with 10% extra bifacial yield, backed by a 30-year warranty for reliable ROI.',
    imageDescription:
      'Solavita all-black TOPCon 620 W photovoltaic module, front and rear view showing the bifacial cell layout',
    stats: [
      { value: '620Wp', label: 'Module Power' },
      { value: '23.0%', label: 'Module Efficiency' },
      { value: '30 years', label: 'Power Output Warranty' },
    ],
    advantages: [
      {
        title: 'High Power Output',
        body: 'Up to 23.0% efficiency, more energy from the same roof space.',
      },
      {
        title: 'Low Degradation in Heat',
        body: 'Stays efficient even under intense sun, less power loss over time.',
      },
      {
        title: 'Long-Term Reliability',
        body: '15-year product & 30-year performance warranty for total peace of mind.',
      },
      {
        title: 'Bifacial Extra Yield',
        body: 'Up to 80% bifaciality captures reflected light for up to 10% more power.',
      },
    ],
    certifications: {
      title: 'Quality System',
      items: [
        'IEC 61215 (2021)',
        'IEC 61730 (2018)',
        'ISO 9001:2015 — Quality management systems',
        'ISO 14001:2015 — Environmental management systems',
        'ISO 45001:2018 — Occupational health and safety management systems',
      ],
    },
    variants: [
      {
        id: 'qm210thcd-620-66',
        name: 'QM210THCD-620-66',
        subtitle: 'Series-66 TOPCon Module',
        columns: ['Specification'],
        stats: [
          { value: '620 Wp', label: 'Rated power' },
          { value: '23.00%', label: 'Rated efficiency' },
          { value: '30 years', label: 'Performance warranty' },
        ],
        rows: [
          { label: 'Module Type', values: ['QM210THCD-620-66'] },
          { label: 'Rated power', values: ['620 Wp'] },
          { label: 'Rated efficiency', values: ['23.00%'] },
          { label: 'Max. Power Current', values: ['14.99 A'] },
          { label: 'Max. Circuit Voltage', values: ['41.40 V'] },
          { label: 'Dimension', values: ['2382 × 1134 × 30 mm'] },
          { label: 'Weight', values: ['32.5 kg'] },
          { label: 'Bifaciality', values: ['80 ± 5%'] },
          { label: 'Product warranty', values: ['15 years'] },
          { label: 'Performance warranty', values: ['30 years'] },
          { label: 'Protection class', values: ['IP68 junction box'] },
        ],
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────────────
     Inverter — slides 2, 3 and 4 of the product PPTX
     ──────────────────────────────────────────────────────────────────── */
  {
    slug: 'inverter',
    name: 'Inverter',
    category: 'module-inverter-battery',
    tagline: 'Hybrid and Off-Grid Inverters for Every Load',
    description:
      'Three inverter families cover the whole range: a single-phase hybrid for homes, a three-phase hybrid for commercial sites, and a dedicated off-grid unit for pure backup.',
    imageDescription:
      'Solavita hybrid inverter unit, front and rear views showing the display panel and DC/AC terminals',
    stats: [
      { value: '3.6–20 kW', label: 'Power range' },
      { value: '1 / 3 phase', label: 'Phase options' },
      { value: '<4 ms', label: 'Backup switchover' },
    ],
    advantages: [
      {
        title: 'High Power & Oversizing',
        body: '20 A per string & 200% PV oversizing; dual battery inputs (416 A).',
      },
      {
        title: 'Smart Control & <4 ms Backup',
        body: 'Seamless UPS switching <4 ms; smart load & generator control.',
      },
      {
        title: 'Superb Safety & IP66',
        body: 'AI-driven AFCI & Type II SPD; IP66 ingress protection.',
      },
      {
        title: 'Max Flexibility & ROI',
        body: '150% unbalanced output; compatible with Li-ion / lead-acid.',
      },
    ],
    extraAdvantages: [
      {
        title: 'Three-Phase Hybrid + Pure Sine',
        body: '230/400 V inverter for self-use, backup, and grid feed-in.',
      },
      {
        title: '4 PV Inputs + 2 MPPT',
        body: 'Supports up to 1.6x PV oversizing for maximum yield.',
      },
      {
        title: 'Smart Export & 240 A Power',
        body: 'Zero Export control; up to 240 A battery charge/discharge.',
      },
      {
        title: '<10 ms Switch & IP65',
        body: 'Fast off-grid switching; 6-unit parallel; IP65 for harsh sites.',
      },
    ],
    variants: [
      {
        id: 'swh-single-phase',
        name: 'SWH 3.6/6/8/10/12kW',
        subtitle: '3.6–12 kW | Single Phase | Low Voltage',
        columns: [
          'Parameter',
          'SWH3600L-S1-G2',
          'SWH6000L-S1-G2',
          'SWH8000L-S1-G2',
          'SWH010KL-S1-G2',
          'SWH012KL-S1-G2',
        ],
        stats: [
          { value: '3.6–12 kW', label: 'Rated AC output' },
          { value: '200%', label: 'PV oversizing' },
          { value: 'IP66', label: 'Protection' },
        ],
        rows: [
          {
            label: 'Rated AC Output Power',
            values: ['3600 W', '6000 W', '8000 W', '10000 W', '12000 W'],
          },
          { label: 'Rated AC Voltage', values: [null, null, null, null, null] },
          { label: 'MPPT Voltage Range', values: [null, null, null, null, null] },
          {
            label: 'No. of MPPT Trackers',
            values: ['2', '2', '2', '2', '2'],
          },
          {
            label: 'No. of Strings per MPPT',
            values: ['1', '1', '2/1', '2/2', '2/2'],
          },
          { label: 'Max. Efficiency', values: [null, null, null, null, null] },
          {
            label: 'Weight',
            values: ['15.5 kg', '15.5 kg', '27.0 kg', '29.0 kg', null],
          },
          { label: 'Dimension (W*H*D)', values: [null, null, null, null, null] },
          { label: 'Protection Degree', values: [null, null, null, null, null] },
        ],
      },
      {
        id: 'swh-three-phase',
        name: 'SWH 10/15/20kW',
        subtitle: '10–20 kW | Three Phase | Low Voltage',
        columns: [
          'Parameter',
          'SWH010KL-T1-G2',
          'SWH015KL-T1-G2',
          'SWH020KL-T1-G2',
        ],
        stats: [
          { value: '10–20 kW', label: 'Rated AC output' },
          { value: '1.6x', label: 'PV oversizing' },
          { value: 'IP65', label: 'Protection' },
        ],
        rows: [
          {
            label: 'Rated AC Output Power',
            values: ['10000 W', '15000 W', '20000 W'],
          },
          { label: 'Rated AC Voltage', values: [null, null, null] },
          { label: 'MPPT Voltage Range', values: [null, null, null] },
          {
            label: 'No. of MPPT Trackers',
            values: ['3', '4', '4'],
          },
          {
            label: 'No. of Strings per MPPT',
            values: ['1/1/1', '1/1/1/1', '1/1/1/1'],
          },
          { label: 'Max. Efficiency', values: [null, null, null] },
          {
            label: 'Weight',
            values: ['45.3 kg', '49.7 kg', '51.2 kg'],
          },
          { label: 'Dimension (W*H*D)', values: [null, null, null] },
          { label: 'Protection Degree', values: [null, null, null] },
        ],
      },
      {
        id: 'swo-off-grid',
        name: 'SWO 6000W',
        subtitle: '6000 W | Single Phase | Low Voltage',
        columns: ['Parameter', 'SWO6000L-S1-SR'],
        stats: [
          { value: '6000 W', label: 'Rated output' },
          { value: '99.9%', label: 'Max. efficiency' },
          { value: 'IP 65', label: 'Protection degree' },
        ],
        rows: [
          { label: 'Rated Output Power', values: ['6000 W'] },
          {
            label: 'Rated Output Voltage',
            values: ['230 Vac (200/208/220/230/240 Vac settable)'],
          },
          { label: 'MPPT Voltage Range', values: ['65 Vdc ~ 450 Vdc'] },
          { label: 'No. of MPPT Trackers', values: ['2'] },
          { label: 'Max. Efficiency', values: ['99.90%'] },
          { label: 'Weight', values: ['17.5 kg'] },
          { label: 'Dimension (W*H*D)', values: ['300 * 460 * 217.5 mm'] },
          { label: 'Protection Degree', values: ['IP 65'] },
        ],
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────────────
     Battery — slide 5 of the product PPTX
     ──────────────────────────────────────────────────────────────────── */
  {
    slug: 'battery',
    name: 'Battery',
    category: 'module-inverter-battery',
    tagline: 'Modular LiFePO₄ Storage That Scales With You',
    description:
      'A modular lithium-iron-phosphate storage stack sized to your backup needs. Blocks combine freely, so capacity grows with the home or the site.',
    imageDescription:
      'Solavita LiFePO₄ battery module stack, front and rear views showing the BMS panel and connector ports',
    stats: [
      { value: '5.12 / 16.08 kWh', label: 'Nominal energy' },
      { value: '51.2 V', label: 'Nominal voltage' },
      { value: '16', label: 'Max. parallel modules' },
    ],
    advantages: [
      {
        title: 'High-Efficiency Charge & Parallel Capability',
        body: 'Max. 16 modules parallel for scalable energy storage. 1C/1C continuous charge and discharge.',
      },
      {
        title: 'Flexible Installation & Equalization',
        body: 'Flexible installation saving time and effort. Supports mixing modules under different SOC to ensure battery life.',
      },
      {
        title: 'Long-Term Safety & Warranty',
        body: 'All-round safety with short-circuit lockout, surge-resistant, safe and reliable. 10-year standard warranty.',
      },
      {
        title: 'All-Weather Adaptability',
        body: 'Automatic self-heating (-20 °C to 55 °C optional). Fearless of outdoor installation, strong environmental adaptability.',
      },
    ],
    certifications: {
      title: 'Protection',
      items: ['IP65 Protection'],
    },
    variants: [
      {
        id: 'swr-l1-ww',
        name: 'SWR 5.12 / 16.08 kWh',
        subtitle: '5.12 kWh / 16.08 kWh | 51.2 V | Low Voltage',
        columns: ['Model', 'SWR5.12-L1-WW', 'SWR16.08-L1-WW'],
        stats: [
          { value: '5.12 / 16.08 kWh', label: 'Nominal energy' },
          { value: '100 Ah / 314 Ah', label: 'Nominal capacity' },
          { value: '100 A / 200 A', label: 'Max. charge / discharge' },
        ],
        rows: [
          { label: 'Nominal Voltage', values: [null, null] },
          { label: 'Nominal Energy', values: ['5.12 kWh', '16.08 kWh'] },
          { label: 'Nominal Capacity', values: ['100 Ah', '314 Ah'] },
          {
            label: 'Max. Charge / Discharge Current',
            values: ['100 A', '200 A'],
          },
          { label: 'Weight', values: ['52 kg', '128 kg'] },
          {
            label: 'Dimension (W*H*D)',
            values: ['600 * 480 * 180 mm', '840 * 490 * 250 mm'],
          },
          { label: 'Protection Grade', values: [null, null] },
        ],
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────────────
     All-in-One ESS — slide 6 of the product PPTX
     ──────────────────────────────────────────────────────────────────── */
  {
    slug: 'all-in-one-ess',
    name: 'All-in-One ESS',
    category: 'all-in-one-ess',
    tagline: 'C&I Energy Storage System',
    description:
      'A single cabinet that stores 261 kWh and pushes 125 kW — one box for a factory, a supermarket or a community mini-grid.',
    imageDescription:
      'Solavita all-in-one C&I energy storage cabinet standing in front of a utility-scale solar array',
    stats: [
      { value: '125 kW', label: 'Nominal output power' },
      { value: '261 kWh', label: 'Nominal energy' },
      { value: 'IP54', label: 'Ingress protection' },
    ],
    advantages: [
      {
        title: 'Stop Diesel Waste',
        body: 'Use solar & storage. Cut daily fuel bills.',
      },
      {
        title: 'Power When Grid Fails',
        body: 'Strong backup. Keep your business running 24/7.',
      },
      {
        title: 'Built Tough Outdoors',
        body: 'All-in-one, weather-proof. Easy to install & run.',
      },
      {
        title: 'Safe & Simple',
        body: 'Remote control. Protects itself automatically.',
      },
    ],
    variants: [
      {
        id: 'sws-p125e261-hc-g2',
        name: 'SWS 261 kWh',
        subtitle: '125 kW | 261 kWh',
        columns: ['Model', 'SWS-P125E261-HC-G2'],
        stats: [
          { value: '125 kW', label: 'Nominal output power' },
          { value: '261.25 kWh', label: 'Rank usable energy' },
          { value: '90–100%', label: 'Depth of discharge' },
        ],
        rows: [
          { label: 'Rank Nominal Energy', values: ['261.25 kWh'] },
          { label: 'Rank Usable Energy', values: ['261.25 kWh'] },
          { label: 'Nominal Output Power', values: ['125 kW'] },
          { label: 'Operating Voltage Range', values: ['676 – 936 V'] },
          { label: 'Module Nominal Energy', values: ['52.25 kWh'] },
          {
            label: 'Depth of Discharge',
            values: ['90% ~ 100% (90% recommended)'],
          },
          { label: 'Weight', values: ['2580 kg'] },
          { label: 'Dimension (W*H*D)', values: ['1050 * 2250 * 1400 mm'] },
          { label: 'Anti-Corrosion', values: ['C4 (C5 optional)'] },
          { label: 'Ingress Protection Rating', values: ['IP54'] },
        ],
      },
    ],
  },
]

/** Look up a product by slug. Returns undefined on miss so callers can `notFound()`. */
export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

/** All product slugs — feeds `generateStaticParams()`. */
export function allProductSlugs(): ProductSlug[] {
  return products.map((p) => p.slug)
}

/**
 * The download entries surfaced on the Support page's "Download" section.
 * Per the product PPTX slide 7 ("Product Specs, manuals and downloads for
 * panels, batteries and inverters." + "Download Files →").
 */
export interface ProductDownload {
  id: string
  /** Product family label, e.g. "High Efficiency Series-66 TOPCon Module". */
  title: string
  /** Category chip, e.g. "Module". */
  category: string
  /** What the entry links to. */
  href: string
  /** What the image should show. */
  imageDescription: string
}

export const productDownloads: ProductDownload[] = [
  {
    id: 'module',
    title: 'High Efficiency Series-66 TOPCon Module',
    category: 'Module',
    href: '/products/module',
    imageDescription:
      'Solavita Series-66 TOPCon photovoltaic module product sheet cover image',
  },
  {
    id: 'inverter',
    title: 'Single Phase Hybrid Inverter — SWH 3.6/6/8/10/12kW',
    category: 'Inverter',
    href: '/products/inverter',
    imageDescription:
      'Solavita single-phase hybrid inverter product sheet cover image',
  },
  {
    id: 'battery',
    title: 'LiFePO₄ Battery — SWR 5.12 / 16.08 kWh',
    category: 'Battery',
    href: '/products/battery',
    imageDescription:
      'Solavita LiFePO₄ battery module product sheet cover image',
  },
  {
    id: 'all-in-one-ess',
    title: 'All-in-One ESS — SWS 261 kWh / 125 kW',
    category: 'All-in-One ESS',
    href: '/products/all-in-one-ess',
    imageDescription:
      'Solavita all-in-one C&I energy storage system product sheet cover image',
  },
]
