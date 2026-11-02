/**
 * Products catalogue — Nigeria.
 *
 * Sources of truth, in order:
 *   1. The manufacturer datasheets in
 *      `docs/补充的图片和文件/Support-Download Files/ 产品规格书/` — copied
 *      to `public/downloads/products/` and linked from each product page.
 *   2. `docs/Modules&Inverter&Battery&All in One ESS.pptx` — the
 *      business-supplied product brief referenced from
 *      `docs/修改建议.docx` §"Products - … - 详情页" (Oct 2026).
 *
 * Structure of every product detail page (per the docx): image + the
 * advantage copy as the hero's selling points, configuration cards, then
 * the full spec table and the datasheet / warranty downloads.
 *
 * The datasheets landed in Nov 2026 and replaced the PPTX's blank
 * cells, so no spec row is a TBD any more. `null` is still supported in
 * `ProductSpecRow.values` — it renders through `<TbdText>` in red — for
 * any future series whose sheet is not in hand yet.
 *
 * Every spec value below is transcribed from the datasheet PDF that the
 * page offers for download, so the page and the PDF cannot disagree.
 */

export type ProductSlug =
  | 'module'
  | 'inverter'
  | 'battery'
  | 'all-in-one-ess'

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
  /**
   * One value per data column. A single value is rendered across every
   * column (`colSpan`) — use that for specs that are the same for all
   * models in the family.
   */
  values: (string | null)[]
}

/**
 * One model variant of a product. Module / Battery / All-in-One ESS
 * have a single variant; the Inverter page carries three (single-phase
 * hybrid, three-phase hybrid, off-grid single-phase).
 */
export interface ProductVariant {
  id: string
  /** Model family name, e.g. "SWH 3–12 kW". */
  name: string
  /** One-line positioning, e.g. "3–12 kW | Single Phase | Low Voltage". */
  subtitle: string
  /**
   * Selling points for THIS family only — rendered above its spec
   * table. The Inverter page carries one set per inverter family
   * (single-phase hybrid, three-phase hybrid, off-grid); products with
   * a single variant keep their selling points at product level.
   */
  advantages?: ProductAdvantage[]
  /** Model names across the top of the spec table. */
  columns: string[]
  /** Spec rows. */
  rows: ProductSpecRow[]
  /** Headline numbers for this variant. */
  stats: ProductStat[]
}

/**
 * Which visual a certification tile uses.
 *
 * `tuv` and `ce` point at the real marks the manufacturer supplied
 * (`/images/TUV.png`, `/images/CE.png`). We have no official artwork for
 * the IEC / ISO standards, so those fall back to a generic drawn glyph
 * per standard — the standard number is always spelled out underneath,
 * so the tile never depends on the mark alone.
 */
export type CertificationMark =
  | 'tuv'
  | 'ce'
  | 'shield'
  | 'zap'
  | 'badge'
  | 'leaf'
  | 'hardhat'

/** One certification / quality-system entry, rendered as an icon tile. */
export interface ProductCertification {
  /** Standard code, e.g. "IEC 61215 (2021)". */
  code: string
  /** One-line plain-English meaning of the standard. */
  note: string
  /** Which visual to use. */
  mark: CertificationMark
}


/** One product photo. The first image is the hero. */
export interface ProductImage {
  src: string
  alt: string
  /** Short description of the shot, e.g. "Left side". */
  caption: string
}

/**
 * One configuration card shown under the hero image — a model family
 * (inverter), a capacity (battery) or a power class (module), with the
 * two parameters a buyer compares first. The cards drive the hero
 * gallery: picking a configuration swaps the hero photo to that
 * configuration's render.
 */
export interface ProductConfig {
  /** Configuration or model name, e.g. "SWH 5–20 kW". */
  name: string
  /** One-line configuration, e.g. "Three Phase · Low Voltage". */
  summary: string
  /** Two core parameters for this configuration. */
  specs: ProductStat[]
  /**
   * Factory renders of this configuration. The first one is the hero
   * shot; the rest are extra angles, browsable through the small view
   * chips under the image.
   *
   * Empty when the factory supplied no render for that configuration
   * (the module series photo covers all five power classes; there is no
   * 10.24 kWh render). Those cards fall back to pointing the reader at
   * the matching column of the spec table.
   */
  views?: ProductImage[]
  /**
   * Index into `Product.variants` — the spec-table family this
   * configuration selects (the three inverter families).
   */
  variantIndex?: number
  /**
   * Index of the model column inside the spec table this configuration
   * highlights (module power classes, battery capacities).
   */
  columnIndex?: number
}

/** One downloadable file offered on the product page. */
export interface ProductDownload {
  label: string
  description: string
  href: string
  kind: 'Datasheet' | 'Warranty' | 'Manual'
  /** Human-readable file size, e.g. "1.4 MB". */
  size: string
}

export interface Product {
  slug: ProductSlug
  /** Page title, e.g. "PV Module". */
  name: string
  /** Short positioning line, e.g. "Higher Power, Higher Efficiency, Beat Blackouts". */
  tagline: string
  /** Lead paragraph. */
  description: string
  /**
   * The product's own hero photo, used when a configuration has no
   * render of its own (the module series photo).
   */
  hero?: ProductImage
  /**
   * A short brand film played in the hero before the photo fades in.
   * Muted and un-looped — the photo takes over when it ends.
   */
  video?: { src: string }
  /**
   * The main advantage cards — rendered as the hero's selling points.
   *
   * Optional: the Inverter page has three model families with
   * different selling points, so its lists live on each variant
   * instead and the hero carries no shared list.
   */
  advantages?: ProductAdvantage[]
  /** Configuration cards under the hero image. */
  configs: ProductConfig[]
  /** Model variants — one tab / section each. */
  variants: ProductVariant[]
  /**
   * Optional reliability paragraph — the ③可靠性 block on the module
   * page. Rendered in its own section above the technical data,
   * together with the quality-system tiles.
   */
  reliability?: string
  /** Optional quality-system / certification block. */
  certifications?: { title: string; items: ProductCertification[] }
  /** Datasheets and warranty documents. */
  downloads: ProductDownload[]
}

/**
 * Reason string reused for every blank cell. Kept short so it fits
 * inside a narrow table column. No row currently uses it — every spec
 * is transcribed from a datasheet — but the render path stays.
 */
export const PRODUCT_SPEC_TBD = 'Verified product datasheet'

/** Shared warranty documents (used by inverter / battery / ESS). */
const STANDARD_WARRANTY: ProductDownload = {
  label: 'Standard Warranty Document',
  description:
    'Warranty terms and claim procedure for Solavita inverters, batteries and energy storage systems.',
  href: '/downloads/products/standard-warranty.pdf',
  kind: 'Warranty',
  size: '160 KB',
}

export const products: Product[] = [
  /* ────────────────────────────────────────────────────────────────────
     PV Module — QM210THCD-620-640-66 High Efficiency Series
     ──────────────────────────────────────────────────────────────────── */
  {
    slug: 'module',
    name: 'PV Module',
    tagline: 'Higher Power, Higher Efficiency, Beat Blackouts',
    description:
      'The QM210THCD High Efficiency Series-66 runs from 620 W to 640 W with up to 23.7% conversion efficiency. N-type TOPCon cells, 80% bifaciality and a 30-year linear power warranty make it a fit for hot, dusty Nigerian rooftops and ground mounts alike.',
    hero: {
      src: '/images/products/module/qm210-thcd-620-640-66-front-back.webp',
      alt: 'Solavita QM210THCD-620-640-66 TOPCon module, front view above rear view',
      caption: 'Front and rear view',
    },
    // Rooftop brand film — plays in the hero, then hands over to the
    // product render.
    video: { src: '/videos/video_1aada56d.mp4' },
    advantages: [
      {
        title: 'High Power Output',
        body: 'Up to 23.7% efficiency — more energy from the same roof space.',
      },
      {
        title: 'Low Degradation in Heat',
        body: '−0.29%/°C Pmax coefficient and only 0.4% annual degradation from year 2.',
      },
      {
        title: 'Long-Term Reliability',
        body: '15-year product & 30-year linear power output warranty for total peace of mind.',
      },
      {
        title: 'Bifacial Extra Yield',
        body: 'Up to 80% bifaciality captures reflected light for up to 10% more power.',
      },
    ],
    configs: [
      // Three cards for a five-model series: entry, mid and flagship.
      // The 625 W and 635 W models stay in the spec table below.
      {
        name: '620 W',
        summary: 'QM210THCD-620-66',
        specs: [
          { value: '23.0%', label: 'Efficiency' },
          { value: '41.40 V', label: 'Vmp' },
        ],
      },
      {
        name: '630 W',
        summary: 'QM210THCD-630-66',
        specs: [
          { value: '23.4%', label: 'Efficiency' },
          { value: '42.00 V', label: 'Vmp' },
        ],
      },
      {
        name: '640 W',
        summary: 'QM210THCD-640-66',
        specs: [
          { value: '23.7%', label: 'Efficiency' },
          { value: '42.60 V', label: 'Vmp' },
        ],
      },
    ],
    reliability:
      'Engineered for extreme climates, TOPCon module cuts diesel costs with 10% extra bifacial yield, backed by a 30-year warranty for reliable ROI.',
    certifications: {
      title: 'Quality System',
      items: [
        {
          code: 'IEC 61215 (2021)',
          note: 'Module design qualification and type approval',
          mark: 'shield',
        },
        {
          code: 'IEC 61730 (2018)',
          note: 'Electrical safety and performance',
          mark: 'zap',
        },
        {
          code: 'ISO 9001:2015',
          note: 'Quality management systems',
          mark: 'badge',
        },
        {
          code: 'ISO 14001:2015',
          note: 'Environmental management systems',
          mark: 'leaf',
        },
        {
          code: 'ISO 45001:2018',
          note: 'Occupational health and safety management',
          mark: 'hardhat',
        },
        {
          code: 'TÜV SÜD',
          note: 'Certified quality management system',
          mark: 'tuv',
        },
        {
          code: 'CE',
          note: 'European conformity marking',
          mark: 'ce',
        },
      ],
    },
    variants: [
      {
        id: 'qm210thcd-620-640-66',
        name: 'QM210THCD-620-640-66',
        subtitle: '620–640 W | N-type TOPCon | 132 half-cells',
        columns: [
          'Specification',
          'QM210THCD-620-66',
          'QM210THCD-625-66',
          'QM210THCD-630-66',
          'QM210THCD-635-66',
          'QM210THCD-640-66',
        ],
        stats: [
          { value: '620–640 W', label: 'Rated power' },
          { value: '23.0–23.7%', label: 'Module efficiency' },
          { value: '30 years', label: 'Performance warranty' },
        ],
        rows: [
          {
            label: 'Maximum Power (STC)',
            values: ['620 W', '625 W', '630 W', '635 W', '640 W'],
          },
          {
            label: 'Maximum Power Voltage',
            values: ['41.40 V', '41.70 V', '42.00 V', '42.30 V', '42.60 V'],
          },
          {
            label: 'Maximum Power Current',
            values: ['14.99 A', '15.00 A', '15.01 A', '15.02 A', '15.03 A'],
          },
          {
            label: 'Open Circuit Voltage',
            values: ['49.60 V', '49.90 V', '50.20 V', '50.50 V', '50.80 V'],
          },
          {
            label: 'Short Circuit Current',
            values: ['15.91 A', '15.92 A', '15.93 A', '15.94 A', '15.95 A'],
          },
          {
            label: 'Module Efficiency',
            values: ['23.0%', '23.2%', '23.4%', '23.6%', '23.7%'],
          },
          { label: 'Power Tolerance', values: ['0 ~ +5 W'] },
          { label: 'Maximum System Voltage', values: ['DC 1500 V'] },
          { label: 'Maximum Series Fuse Rating', values: ['25 A / 30 A'] },
          { label: 'Operating Temperature', values: ['−40 ~ +85 °C'] },
          { label: 'Nominal Operating Cell Temperature', values: ['45 ± 2 °C'] },
          { label: 'Voc Temperature Coefficient', values: ['−0.28%/°C'] },
          { label: 'Pmax Temperature Coefficient', values: ['−0.29%/°C'] },
          { label: 'Isc Temperature Coefficient', values: ['+0.04%/°C'] },
          { label: 'Bifaciality', values: ['80% ± 5%'] },
          { label: 'Solar Cells', values: ['132 (66 × 2)'] },
          { label: 'Dimension', values: ['2382 × 1134 × 30 mm'] },
          { label: 'Weight', values: ['32.5 kg'] },
          {
            label: 'Front Glass',
            values: ['2.0 mm AR-coated heat-strengthened glass'],
          },
          { label: 'Back Glass', values: ['2.0 mm heat-strengthened glass'] },
          { label: 'Frame', values: ['Anodised aluminium alloy'] },
          { label: 'Junction Box', values: ['IP68 / 3 diodes'] },
          {
            label: 'Output Cables',
            values: ['4 mm² (IEC), +300 mm / −200 mm'],
          },
          { label: 'Fire Performance', values: ['Class C'] },
          { label: 'Security Protection', values: ['Class II'] },
          {
            label: 'Packing',
            values: ['36 pcs / pallet — 720 pcs / 40HQ container'],
          },
          { label: 'Product warranty', values: ['15 years'] },
          { label: 'Performance warranty', values: ['30 years, 0.4%/yr from year 2'] },
        ],
      },
    ],
    downloads: [
      {
        label: 'QM210THCD-620-640-66 Datasheet',
        description:
          'Full electrical and mechanical data for the 620–640 W High Efficiency Series-66 module.',
        href: '/downloads/products/module-qm210-thcd-620-640-66-datasheet.pdf',
        kind: 'Datasheet',
        size: '1.4 MB',
      },
      {
        label: 'Limited Warranty — Solar Modules',
        description:
          '15-year product and 30-year linear power output warranty terms.',
        href: '/downloads/products/module-limited-warranty.pdf',
        kind: 'Warranty',
        size: '420 KB',
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────────────
     Inverter — single-phase hybrid, three-phase hybrid, off-grid
     ──────────────────────────────────────────────────────────────────── */
  {
    slug: 'inverter',
    name: 'Inverter',
    tagline: 'Hybrid and Off-Grid Inverters for Every Load',
    description:
      'Three inverter families cover the whole range: a single-phase hybrid from 3 kW to 12 kW for homes, a three-phase hybrid from 5 kW to 20 kW for commercial sites, and a dedicated 6 kW off-grid unit for pure backup.',
    // The three families have different selling points, so they live on
    // each variant and render with the spec table. The hero carries no
    // shared list for this product.
    configs: [
      {
        name: 'SWH 3–12 kW',
        summary: 'Single Phase · Low Voltage',
        specs: [
          { value: '3–12 kW', label: 'Rated output' },
          { value: '200%', label: 'PV oversizing' },
        ],
        variantIndex: 0,
        views: [
          {
            src: '/images/products/inverter/swh-single-phase-1.webp',
            alt: 'Solavita SWH single-phase hybrid inverter, angled front view',
            caption: 'Angled view',
          },
          {
            src: '/images/products/inverter/swh-single-phase-2.webp',
            alt: 'Solavita SWH single-phase hybrid inverter, straight front view',
            caption: 'Front view',
          },
          {
            src: '/images/products/inverter/swh-single-phase-3.webp',
            alt: 'Solavita SWH single-phase hybrid inverter, angled from the opposite side',
            caption: 'Side angle',
          },
        ],
      },
      {
        name: 'SWH 5–20 kW',
        summary: 'Three Phase · Low Voltage',
        specs: [
          { value: '5–20 kW', label: 'Rated output' },
          { value: '40 kW', label: 'Max. PV input' },
        ],
        variantIndex: 1,
        views: [
          {
            src: '/images/products/inverter/swh-three-phase-1.webp',
            alt: 'Solavita SWH three-phase hybrid inverter, angled front view',
            caption: 'Angled view',
          },
          {
            src: '/images/products/inverter/swh-three-phase-2.webp',
            alt: 'Solavita SWH three-phase hybrid inverter, straight front view',
            caption: 'Front view',
          },
          {
            src: '/images/products/inverter/swh-three-phase-3.webp',
            alt: 'Solavita SWH three-phase hybrid inverter, angled from the opposite side',
            caption: 'Side angle',
          },
        ],
      },
      {
        name: 'SWO 6000W',
        summary: 'Single Phase · Off-grid',
        specs: [
          { value: '6 kW', label: 'Rated output' },
          { value: '10 ms', label: 'Switch time' },
        ],
        variantIndex: 2,
        views: [
          {
            src: '/images/products/inverter/swo-6000w.webp',
            alt: 'Solavita SWO 6000 W off-grid inverter, front view',
            caption: 'Front view',
          },
        ],
      },
    ],
    variants: [
      {
        id: 'swh-single-phase',
        name: 'SWH 3–12 kW',
        subtitle: '3–12 kW | Single Phase | Low Voltage',
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
        columns: [
          'Parameter',
          'SWH3000L-S1-G2',
          'SWH3600L-S1-G2',
          'SWH5000L-S1-G2',
          'SWH6000L-S1-G2',
          'SWH8000L-S1-G2',
          'SWH010KL-S1-G2',
          'SWH012KL-S1-G2',
        ],
        stats: [
          { value: '3–12 kW', label: 'Rated AC output' },
          { value: '200%', label: 'PV oversizing' },
          { value: 'IP66', label: 'Protection' },
        ],
        rows: [
          { label: 'Battery Type', values: ['Li-Ion / Lead-acid'] },
          { label: 'Nominal Battery Voltage', values: ['48 V'] },
          { label: 'Battery Voltage Range', values: ['40 ~ 60 V'] },
          { label: 'Number of Battery Inputs', values: ['1'] },
          {
            label: 'Max. Continuous Charge / Discharge Current',
            values: ['70 A', '90 A', '120 A', '140 A', '160 A', '200 A', '240 A'],
          },
          {
            label: 'Max. PV Input Power',
            values: ['6.0 kW', '7.2 kW', '10 kW', '12 kW', '16 kW', '20 kW', '24 kW'],
          },
          { label: 'Max. PV Input Voltage', values: ['600 V'] },
          { label: 'MPPT Operating Voltage Range', values: ['60 ~ 550 V'] },
          {
            label: 'Max. Input Current per MPPT',
            values: [
              '20 A',
              '20 A',
              '20 A',
              '20 A',
              '32 / 16 A',
              '32 / 32 A',
              '32 / 32 A',
            ],
          },
          {
            label: 'Max. Short Circuit Current per MPPT',
            values: ['26 A', '26 A', '26 A', '26 A', '48 / 24 A', '48 / 48 A', '48 / 48 A'],
          },
          {
            label: 'No. of MPPT Trackers',
            values: ['1', '2', '2', '2', '2', '2', '2'],
          },
          {
            label: 'No. of Strings per MPPT',
            values: ['1', '1', '1', '1', '2 / 1', '2 / 2', '2 / 2'],
          },
          {
            label: 'Rated AC Output Power',
            values: ['3.0 kW', '3.6 kW', '5.0 kW', '6.0 kW', '8.0 kW', '10.0 kW', '12.0 kW'],
          },
          {
            label: 'Max. AC Output Power',
            values: ['3.3 kW', '3.96 kW', '5.5 kW', '6.6 kW', '8.8 kW', '11.0 kW', '13.2 kW'],
          },
          { label: 'Rated AC Output Voltage', values: ['220 / 230 / 240 V'] },
          { label: 'AC Output Voltage Range', values: ['170 ~ 280 V'] },
          { label: 'Rated AC Grid Frequency', values: ['50 / 60 Hz'] },
          {
            label: 'Max. AC Current Output to Grid',
            values: ['15 A', '18 A', '25 A', '30 A', '40 A', '50 A', '60 A'],
          },
          { label: 'Max. AC Current from Grid', values: ['32 A', '32 A', '40 A', '70 A', '75 A', '75 A', '75 A'] },
          { label: 'Power Factor', values: ['~1 (0.8 leading to 0.8 lagging)'] },
          { label: 'Max. Total Harmonic Distortion', values: ['<3%'] },
          { label: 'Backup Switching Time', values: ['<4 ms'] },
          { label: 'Max. Efficiency', values: ['97.6%'] },
          { label: 'European Efficiency', values: ['96.2%'] },
          { label: 'Max. Battery to AC Efficiency', values: ['95.5%'] },
          { label: 'MPPT Efficiency', values: ['99.9%'] },
          { label: 'DC / AC Surge Protection', values: ['Type II / Type II'] },
          { label: 'Operating Temperature Range', values: ['−35 ~ +60 °C'] },
          { label: 'Relative Humidity', values: ['0 ~ 95%'] },
          { label: 'Max. Operating Altitude', values: ['3000 m'] },
          { label: 'Cooling Method', values: ['Natural convection / smart fan cooling'] },
          { label: 'User Interface', values: ['LCD, WLAN + App'] },
          {
            label: 'Communication',
            values: ['RS485, WiFi + LAN + Bluetooth, Modbus-RTU/TCP'],
          },
          {
            label: 'Weight',
            values: ['14.5 kg', '15.5 kg', '15.5 kg', '15.5 kg', '27.0 kg', '29.0 kg', '29.0 kg'],
          },
          {
            label: 'Dimension (W × H × D)',
            values: [
              '560 × 415 × 204 mm',
              '560 × 415 × 204 mm',
              '560 × 415 × 204 mm',
              '560 × 415 × 204 mm',
              '560 × 444.5 × 226 mm',
              '560 × 444.5 × 226 mm',
              '560 × 444.5 × 226 mm',
            ],
          },
          { label: 'Topology', values: ['Non-isolated'] },
          { label: 'Ingress Protection Rating', values: ['IP66'] },
          { label: 'Mounting Method', values: ['Wall mounted'] },
        ],
      },
      {
        id: 'swh-three-phase',
        name: 'SWH 5–20 kW',
        subtitle: '5–20 kW | Three Phase | Low Voltage',
        advantages: [
          {
            title: 'Three-Phase Hybrid + Pure Sine',
            body: '230/400V inverter for self-use, backup, and grid feed-in.',
          },
          {
            title: '4 PV Inputs + 2 MPPT',
            body: 'Supports up to 1.6x PV oversizing for maximum yield.',
          },
          {
            title: 'Smart Export & 240A Power',
            body: 'Zero Export control; up to 240A battery charge/discharge.',
          },
          {
            title: '<10ms Switch & IP65',
            body: 'Fast off-grid switching; 6-unit parallel; IP65 for harsh sites.',
          },
        ],
        columns: [
          'Parameter',
          'SWH5000L-T1-G2',
          'SWH6000L-T1-G2',
          'SWH8000L-T1-G2',
          'SWH010KL-T1-G2',
          'SWH012KL-T1-G2',
          'SWH015KL-T1-G2',
          'SWH020KL-T1-G2',
        ],
        stats: [
          { value: '5–20 kW', label: 'Rated AC output' },
          { value: '40 kW', label: 'Max. PV input' },
          { value: 'IP66', label: 'Protection' },
        ],
        rows: [
          { label: 'Battery Type', values: ['LFP / Lead-acid'] },
          { label: 'Nominal Battery Voltage', values: ['48 V'] },
          { label: 'Battery Voltage Range', values: ['40 ~ 60 V'] },
          {
            label: 'Number of Battery Inputs',
            values: ['1', '1', '1', '1', '1', '2', '2'],
          },
          {
            label: 'Max. Continuous Charge / Discharge Current',
            values: [
              '125 A',
              '135 A',
              '175 A',
              '220 A',
              '250 A',
              '165 A',
              '208 / 208 A',
            ],
          },
          {
            label: 'Max. PV Input Power',
            values: [
              '10 kW',
              '12 kW',
              '16 kW',
              '20 kW',
              '24 kW',
              '30 kW',
              '40 kW',
            ],
          },
          { label: 'Max. PV Input Voltage', values: ['1000 V'] },
          { label: 'MPPT Operating Voltage Range', values: ['150 ~ 850 V'] },
          { label: 'Max. MPPT Current', values: ['20 A per MPPT'] },
          {
            label: 'No. of MPPTs',
            values: ['2', '2', '2', '3', '3', '4', '4'],
          },
          {
            label: 'No. of Strings per MPPT',
            values: ['1', '1', '1', '1', '1', '1', '1'],
          },
          {
            label: 'Rated AC Power',
            values: ['5.0 kW', '6.0 kW', '8.0 kW', '10.0 kW', '12.0 kW', '15.0 kW', '20.0 kW'],
          },
          {
            label: 'Max. AC Power',
            values: ['5.5 kW', '6.6 kW', '8.8 kW', '11.0 kW', '13.2 kW', '16.5 kW', '22.0 kW'],
          },
          { label: 'Rated Output Voltage', values: ['400 / 380 V, 3L / N / PE'] },
          { label: 'Rated Frequency', values: ['50 / 60 Hz'] },
          { label: 'Max. Total Harmonic Distortion (THDI)', values: ['<3%'] },
          { label: 'Power Factor', values: ['~1 (0.8 leading to 0.8 lagging)'] },
          {
            label: 'Max. Efficiency',
            values: ['97.8%', '97.8%', '97.8%', '97.8%', '97.8%', '97.9%', '97.8%'],
          },
          {
            label: 'European Efficiency',
            values: ['97.0%', '97.0%', '97.1%', '97.3%', '97.3%', '97.3%', '97.4%'],
          },
          { label: 'Max. Battery to AC Efficiency', values: ['95.5%'] },
          { label: 'MPPT Efficiency', values: ['99.9%'] },
          { label: 'DC / AC Surge Protection', values: ['Type II / Type II'] },
          { label: 'Operating Temperature Range', values: ['−35 ~ +60 °C'] },
          { label: 'Max. Operating Altitude', values: ['4000 m'] },
          { label: 'Cooling Method', values: ['Smart fan cooling'] },
          {
            label: 'Communication',
            values: [
              'WiFi + LAN + Bluetooth, 4G, RS485, CAN; Modbus RTU / TCP',
            ],
          },
          {
            label: 'Weight',
            values: [
              '42.2 kg',
              '42.2 kg',
              '42.2 kg',
              '45.3 kg',
              '45.3 kg',
              '49.7 kg',
              '51.2 kg',
            ],
          },
          { label: 'Dimension (W × H × D)', values: ['756 × 551 × 258 mm'] },
          { label: 'Noise Emission', values: ['<45 dB'] },
          { label: 'Ingress Protection Rating', values: ['IP66'] },
          { label: 'Anti-corrosion Class', values: ['C4'] },
          { label: 'Mounting Method', values: ['Wall mounted'] },
        ],
      },
      {
        id: 'swo-off-grid',
        name: 'SWO 6000W',
        subtitle: '6 kW | Single Phase | Off-grid',
        advantages: [
          {
            title: 'High Performance',
            body: 'Dual MPPT (99.9% eff., 22A max), generator peak-shaving.',
          },
          {
            title: 'Superb Safety',
            body: 'IP65 rated, ideal for outdoor use.',
          },
          {
            title: 'Smart Control',
            body: 'PV-only & hybrid modes; time-sharing, anti-backflow, lithium activation.',
          },
          {
            title: 'Energy Saving',
            body: 'Reduces no-load loss; optimized self-consumption.',
          },
        ],
        columns: ['Parameter', 'SWO6000L-S1-SR'],
        stats: [
          { value: '6000 W', label: 'Rated output' },
          { value: '99.9%', label: 'MPPT efficiency' },
          { value: 'IP65', label: 'Protection degree' },
        ],
        rows: [
          { label: 'Rated Output Power', values: ['6000 W'] },
          {
            label: 'Max. Peak Power',
            values: ['2 × rated power, 10 s'],
          },
          {
            label: 'Rated Output Voltage',
            values: ['230 Vac (200/208/220/230/240 Vac settable)'],
          },
          { label: 'Rated Output Current', values: ['26.1 Aac'] },
          { label: 'Rated Frequency', values: ['50 / 60 Hz'] },
          { label: 'Waveform', values: ['Pure sine wave'] },
          { label: 'Switch Time', values: ['10 ms (typical)'] },
          {
            label: 'Battery Type',
            values: ['Lithium-ion / Lead-acid / User-defined'],
          },
          { label: 'Rated Battery Voltage', values: ['48 Vdc'] },
          { label: 'Battery Voltage Range', values: ['40 ~ 60 Vdc'] },
          { label: 'Max. Discharging Current', values: ['135 Adc'] },
          { label: 'Max. Grid / Generator Charging Current', values: ['135 Adc'] },
          { label: 'Max. PV Charging Current', values: ['135 Adc'] },
          { label: 'No. of MPPT Trackers', values: ['2'] },
          { label: 'Max. PV Input Power', values: ['6000 W + 6000 W'] },
          { label: 'Max. PV Input Current', values: ['22 Adc + 22 Adc'] },
          { label: 'Max. Input Short-Circuit Current', values: ['33 Adc + 33 Adc'] },
          { label: 'Max. PV Input Voltage', values: ['500 Vdc'] },
          { label: 'PV Start-up Voltage', values: ['60 Vdc'] },
          {
            label: 'MPPT Operating Voltage Range',
            values: ['65 ~ 450 Vdc'],
          },
          { label: 'Rated Input Voltage', values: ['220 / 230 Vac'] },
          {
            label: 'Input Voltage Range',
            values: ['170 ~ 280 Vac (±2%)'],
          },
          {
            label: 'Input Frequency Range',
            values: ['50 Hz: 47 ~ 55 Hz | 60 Hz: 57 ~ 65 Hz'],
          },
          { label: 'Bypass Overload Current', values: ['40 Aac'] },
          { label: 'MPPT Tracking Efficiency', values: ['99.9%'] },
          { label: 'Max. Efficiency', values: ['97.5%'] },
          { label: 'Parallel Capacity', values: ['1 ~ 6 units'] },
          { label: 'Dimension (W × H × D)', values: ['300 × 460 × 217.5 mm'] },
          { label: 'Weight', values: ['17.5 kg'] },
          { label: 'Operating Temperature', values: ['−40 ~ +60 °C (>45 °C derated)'] },
          { label: 'Cooling Method', values: ['Heat sink + intelligent air cooling'] },
          { label: 'Noise', values: ['<55 dB'] },
          { label: 'Protection Degree', values: ['IP65'] },
          { label: 'Built-in Interface', values: ['RS485 / CAN / USB / Dry contact'] },
          {
            label: 'Certification',
            values: ['RoHS, IEC 62109-1/-2, EN 61000'],
          },
          { label: 'Warranty', values: ['5 years'] },
        ],
      },
    ],
    downloads: [
      {
        label: 'SWH 3–12 kW Single Phase Hybrid Datasheet',
        description:
          'Full technical data for the single-phase hybrid family, SWH3000L to SWH012KL.',
        href: '/downloads/products/inverter-swh-single-phase-hybrid-datasheet.pdf',
        kind: 'Datasheet',
        size: '3.3 MB',
      },
      {
        label: 'SWH 5–20 kW Three Phase Hybrid Datasheet',
        description:
          'Full technical data for the three-phase hybrid family, SWH5000L-T1 to SWH020KL-T1.',
        href: '/downloads/products/inverter-swh-three-phase-hybrid-datasheet.pdf',
        kind: 'Datasheet',
        size: '2.2 MB',
      },
      {
        label: 'SWO 6000W Off-Grid Datasheet',
        description:
          'Technical data for the SWO6000L-S1-SR single-phase off-grid inverter.',
        href: '/downloads/products/inverter-swo-off-grid-datasheet.pdf',
        kind: 'Datasheet',
        size: '2.7 MB',
      },
      STANDARD_WARRANTY,
    ],
  },

  /* ────────────────────────────────────────────────────────────────────
     Battery — SWR 5.12 / 10.24 / 16.08 kWh
     ──────────────────────────────────────────────────────────────────── */
  {
    slug: 'battery',
    name: 'Battery',
    tagline: 'Modular LiFePO₄ Storage That Scales With You',
    description:
      'SWR modules come in 5.12, 10.24 and 16.08 kWh blocks that combine freely up to 16 units in parallel — enough to size a single home or a whole site. 1C continuous charge and discharge, IP65 for outdoor installation and a 10-year warranty.',
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
        body: 'Automatic self-heating (−20 °C to 55 °C optional). Fearless of outdoor installation, strong environmental adaptability.',
      },
    ],
    configs: [
      {
        name: '5.12 kWh',
        summary: 'SWR5.12-L1-WW',
        specs: [
          { value: '100 Ah', label: 'Capacity' },
          { value: '100 A', label: 'Max. current' },
        ],
        columnIndex: 0,
        views: [
          {
            src: '/images/products/battery/swr-5-12-front.webp',
            alt: 'Solavita SWR5.12-L1-WW LiFePO₄ battery, front view',
            caption: 'Front view',
          },
          {
            src: '/images/products/battery/swr-5-12-left.webp',
            alt: 'Solavita SWR5.12-L1-WW LiFePO₄ battery, left side view',
            caption: 'Left view',
          },
          {
            src: '/images/products/battery/swr-5-12-right.webp',
            alt: 'Solavita SWR5.12-L1-WW LiFePO₄ battery, right side view',
            caption: 'Right view',
          },
        ],
      },
      {
        name: '10.24 kWh',
        summary: 'SWR10.24-L1-WW',
        specs: [
          { value: '200 Ah', label: 'Capacity' },
          { value: '150 A', label: 'Max. current' },
        ],
        // The factory supplied renders for the 5.12 and 16.08 kWh
        // cabinets only — there is no 10.24 kWh photo, so this card
        // stays a plain spec summary.
      },
      {
        name: '16.08 kWh',
        summary: 'SWR16.08-L1-WW',
        specs: [
          { value: '314 Ah', label: 'Capacity' },
          { value: '200 A', label: 'Max. current' },
        ],
        columnIndex: 2,
        views: [
          {
            src: '/images/products/battery/swr-16-08-front.webp',
            alt: 'Solavita SWR16.08-L1-WW LiFePO₄ battery, front view',
            caption: 'Front view',
          },
          {
            src: '/images/products/battery/swr-16-08-left.webp',
            alt: 'Solavita SWR16.08-L1-WW LiFePO₄ battery, left side view',
            caption: 'Left view',
          },
          {
            src: '/images/products/battery/swr-16-08-right.webp',
            alt: 'Solavita SWR16.08-L1-WW LiFePO₄ battery, right side view',
            caption: 'Right view',
          },
        ],
      },
    ],
    certifications: {
      title: 'Protection',
      items: [
        {
          code: 'IP65',
          note: 'Indoor and outdoor enclosure protection',
          mark: 'shield',
        },
        {
          code: 'Short-circuit lockout',
          note: 'Surge-resistant, safe and reliable',
          mark: 'zap',
        },
      ],
    },
    variants: [
      {
        id: 'swr-l1-ww',
        name: 'SWR 5.12 / 10.24 / 16.08 kWh',
        subtitle: '51.2 V | Low Voltage | LiFePO₄',
        columns: [
          'Parameter',
          'SWR5.12-L1-WW',
          'SWR10.24-L1-WW',
          'SWR16.08-L1-WW',
        ],
        stats: [
          { value: '5.12–16.08 kWh', label: 'Rated energy' },
          { value: '100–314 Ah', label: 'Rated capacity' },
          { value: '100–200 A', label: 'Max. charge / discharge' },
        ],
        rows: [
          { label: 'Rated Voltage', values: ['51.2 V'] },
          {
            label: 'Rated Capacity',
            values: ['100 Ah', '200 Ah', '314 Ah'],
          },
          {
            label: 'Rated Energy',
            values: ['5.12 kWh', '10.24 kWh', '16.08 kWh'],
          },
          { label: 'Standard Charge Voltage', values: ['56.8 V'] },
          { label: 'Discharge Cut-Off Voltage', values: ['44.8 V'] },
          {
            label: 'Max. Charging Current',
            values: ['100 A', '150 A', '200 A'],
          },
          {
            label: 'Max. Discharging Current',
            values: ['100 A', '150 A', '200 A'],
          },
          {
            label: 'Dimension (L × W × H)',
            values: [
              '600 × 480 × 180 mm',
              '650 × 480 × 245 mm',
              '840 × 490 × 250 mm',
            ],
          },
          {
            label: 'Weight',
            values: ['52 kg', '98 kg', '128 kg'],
          },
          { label: 'Charge Temperature', values: ['0 ~ 55 °C'] },
          { label: 'Discharging Temperature', values: ['−20 ~ 55 °C'] },
          {
            label: 'Cycle Life',
            values: [
              '>8000 cycles (0.5C, 90% DOD)',
              '≥10000 cycles (0.35C, 90% DOD)',
              '≥10000 cycles (0.35C, 90% DOD)',
            ],
          },
          { label: 'Installation Method', values: ['Wall-mounted / floor standing'] },
          { label: 'Protection Grade', values: ['IP65'] },
          { label: 'Communication Interface', values: ['RS485, RS232, CAN'] },
          {
            label: 'Optional',
            values: [
              'Automatic heating, fire extinguishing module, WiFi remote monitoring',
            ],
          },
          { label: 'Max. Units in Parallel', values: ['16'] },
          { label: 'Warranty', values: ['10 years'] },
        ],
      },
    ],
    downloads: [
      {
        label: 'SWR LiFePO₄ Battery Datasheet',
        description:
          'Full technical data for the 5.12, 10.24 and 16.08 kWh low-voltage modules.',
        href: '/downloads/products/battery-swr-lifepo4-datasheet.pdf',
        kind: 'Datasheet',
        size: '1.9 MB',
      },
      STANDARD_WARRANTY,
    ],
  },

  /* ────────────────────────────────────────────────────────────────────
     All-in-One ESS — SWS-P125E261-HC-G2
     ──────────────────────────────────────────────────────────────────── */
  {
    slug: 'all-in-one-ess',
    name: 'All-in-One ESS',
    tagline: 'C&I Energy Storage System',
    description:
      'A single cabinet that stores 261.25 kWh and delivers 125 kW — one box for a factory, a supermarket or a community mini-grid. Five LFP packs, liquid cooling and 98.6% PCS efficiency, factory-assembled and plug-and-play.',
    advantages: [
      {
        title: 'Stop Diesel Waste',
        body: 'Use solar & storage. Cut daily fuel bills with 125 kW of dispatchable power.',
      },
      {
        title: 'Power When Grid Fails',
        body: 'Strong backup. Keep your business running 24/7 with <60 ms switching.',
      },
      {
        title: 'Built Tough Outdoors',
        body: 'All-in-one, IP54, C4 anti-corrosion. Easy to install & run.',
      },
      {
        title: 'Safe & Simple',
        body: 'Remote control and aerosol + water-based fire suppression on board.',
      },
    ],
    configs: [
      {
        name: 'SWS 261 kWh',
        summary: 'SWS-P125E261-HC-G2',
        specs: [
          { value: '125 kW', label: 'Output power' },
          { value: '98.6%', label: 'PCS efficiency' },
        ],
        views: [
          {
            src: '/images/products/all-in-one-ess/sws-261-1.webp',
            alt: 'Solavita SWS 261 kWh C&I energy storage cabinet, front view',
            caption: 'Front view',
          },
          {
            src: '/images/products/all-in-one-ess/sws-261-2.webp',
            alt: 'Solavita SWS 261 kWh C&I energy storage cabinet, three-quarter view',
            caption: 'Three-quarter view',
          },
          {
            src: '/images/products/all-in-one-ess/sws-261-3.webp',
            alt: 'Solavita SWS 261 kWh C&I energy storage cabinet, side view',
            caption: 'Side view',
          },
        ],
      },
    ],
    variants: [
      {
        id: 'sws-p125e261-hc-g2',
        name: 'SWS 261 kWh',
        subtitle: '125 kW | 261.25 kWh | Three Phase',
        columns: ['Parameter', 'SWS-P125E261-HC-G2'],
        stats: [
          { value: '125 kW', label: 'Nominal output power' },
          { value: '261.25 kWh', label: 'Usable energy' },
          { value: '98.6%', label: 'Max. PCS efficiency' },
        ],
        rows: [
          { label: 'Cell Type', values: ['LFP (LiFePO₄)'] },
          { label: 'Cell Capacity', values: ['314 Ah'] },
          { label: 'Module Nominal Energy', values: ['52.25 kWh'] },
          { label: 'Number of Packs', values: ['5'] },
          { label: 'Rack Nominal Energy', values: ['261.25 kWh'] },
          { label: 'Rack Usable Energy', values: ['261.25 kWh'] },
          { label: 'Nominal Voltage', values: ['832 V'] },
          { label: 'Operating Voltage Range', values: ['676 ~ 936 V'] },
          { label: 'Max. Continuous Charge / Discharge Current', values: ['188 A'] },
          { label: 'Max. Charge / Discharge Current', values: ['198.5 A'] },
          { label: 'Max. Charge / Discharge Rate', values: ['0.5P'] },
          {
            label: 'Depth of Discharge',
            values: ['90% ~ 100% (90% recommended)'],
          },
          { label: 'Nominal Output Power', values: ['125 kW'] },
          {
            label: 'Max. Output Power',
            values: ['137.5 kW @ 400 V AC | 130.6 kW @ 380 V AC'],
          },
          { label: 'Nominal Output Voltage', values: ['400 / 380 V, 3L / N / PE'] },
          {
            label: 'Output Voltage Range',
            values: ['340 ~ 440 V | 323 ~ 418 V'],
          },
          { label: 'Nominal AC Grid Frequency', values: ['50 / 60 Hz'] },
          { label: 'Max. AC Output Current', values: ['198.5 A'] },
          { label: 'Power Factor', values: ['~1 (0.8 lag to 0.8 lead)'] },
          { label: 'Max. Total Harmonic Distortion', values: ['<3%'] },
          { label: 'Max. PCS Efficiency', values: ['98.6%'] },
          { label: 'System Efficiency', values: ['92.0%'] },
          { label: 'Charge / Discharge Switching Time', values: ['<60 ms'] },
          {
            label: 'Operation Temperature Range',
            values: ['−25 ~ +55 °C (derating at 45 °C)'],
          },
          { label: 'Relative Humidity', values: ['10% ~ 95%'] },
          {
            label: 'Max. Operating Altitude',
            values: ['4000 m (2000 m derating)'],
          },
          {
            label: 'Cooling Method',
            values: ['Pack: liquid cooling | PCS: smart fan cooling'],
          },
          {
            label: 'Configuration of Safety',
            values: [
              'Aerosol + water-based fire suppression, explosion-proof fan + plates (optional)',
            ],
          },
          { label: 'Weight', values: ['2580 kg'] },
          { label: 'Dimension (W × H × D)', values: ['1050 × 2250 × 1400 mm'] },
          { label: 'Noise Emission', values: ['≤70 dB'] },
          { label: 'Topology', values: ['Non-isolated'] },
          { label: 'Ingress Protection Rating', values: ['IP54'] },
          { label: 'Anti-Corrosion', values: ['C4 (C5 optional)'] },
          { label: 'Communication Protocol', values: ['Modbus TCP, Modbus RTU'] },
        ],
      },
    ],
    downloads: [
      {
        label: 'SWS 261 kWh Datasheet',
        description:
          'Full technical data for the SWS-P125E261-HC-G2 C&I energy storage system.',
        href: '/downloads/products/all-in-one-ess-sws-261kwh-datasheet.pdf',
        kind: 'Datasheet',
        size: '2.9 MB',
      },
      STANDARD_WARRANTY,
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
 * The product's lead image — the series photo when it has one, else the
 * first configuration's first render. Used for the social card.
 */
export function getProductHeroImage(product: Product): string | undefined {
  if (product.hero) return product.hero.src
  for (const config of product.configs) {
    if (config.views?.length) return config.views[0].src
  }
  return undefined
}

/**
 * The download entries surfaced on the Support page's "Download" section.
 * Per the product PPTX slide 7 ("Product Specs, manuals and downloads for
 * panels, batteries and inverters." + "Download Files →"), now backed by
 * the real PDFs in `public/downloads/products/`.
 */
export interface ProductDownloadEntry {
  id: string
  /** Document title, e.g. "High Efficiency Series-66 TOPCon Module Datasheet". */
  title: string
  /** Category chip, e.g. "Module". */
  category: string
  /** Direct link to the PDF. */
  href: string
  /** Card thumbnail. Omit for documents with no matching product render. */
  image?: string
  /** File size label. */
  size: string
}

export const productDownloads: ProductDownloadEntry[] = [
  {
    id: 'module-datasheet',
    title: 'High Efficiency Series-66 TOPCon Module Datasheet',
    category: 'Module',
    href: '/downloads/products/module-qm210-thcd-620-640-66-datasheet.pdf',
    image: '/images/products/module/qm210-thcd-620-640-66-front-back.webp',
    size: '1.4 MB',
  },
  {
    id: 'inverter-single-phase',
    title: 'Single Phase Hybrid Inverter — SWH 3–12 kW',
    category: 'Inverter',
    href: '/downloads/products/inverter-swh-single-phase-hybrid-datasheet.pdf',
    image: '/images/products/inverter/swh-single-phase-1.webp',
    size: '3.3 MB',
  },
  {
    id: 'inverter-three-phase',
    title: 'Three Phase Hybrid Inverter — SWH 5–20 kW',
    category: 'Inverter',
    href: '/downloads/products/inverter-swh-three-phase-hybrid-datasheet.pdf',
    image: '/images/products/inverter/swh-three-phase-1.webp',
    size: '2.2 MB',
  },
  {
    id: 'inverter-off-grid',
    title: 'Off-Grid Inverter — SWO 6000W',
    category: 'Inverter',
    href: '/downloads/products/inverter-swo-off-grid-datasheet.pdf',
    image: '/images/products/inverter/swo-6000w.webp',
    size: '2.7 MB',
  },
  {
    id: 'battery',
    title: 'LiFePO₄ Battery — SWR 5.12 / 10.24 / 16.08 kWh',
    category: 'Battery',
    href: '/downloads/products/battery-swr-lifepo4-datasheet.pdf',
    image: '/images/products/battery/swr-16-08-front.webp',
    size: '1.9 MB',
  },
  {
    id: 'all-in-one-ess',
    title: 'All-in-One ESS — SWS 261 kWh / 125 kW',
    category: 'All-in-One ESS',
    href: '/downloads/products/all-in-one-ess-sws-261kwh-datasheet.pdf',
    image: '/images/products/all-in-one-ess/sws-261-1.webp',
    size: '2.9 MB',
  },
  {
    id: 'module-warranty',
    title: 'Limited Warranty — Skyworth Solar Modules',
    category: 'Warranty',
    href: '/downloads/products/module-limited-warranty.pdf',
    size: '420 KB',
  },
  {
    id: 'standard-warranty',
    title: 'Skyworth Standard Warranty Document',
    category: 'Warranty',
    href: '/downloads/products/standard-warranty.pdf',
    size: '160 KB',
  },
]