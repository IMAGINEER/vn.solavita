/**
 * Danh mục sản phẩm — Việt Nam.
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
  /** Ý nghĩa tiếng Việt một dòng của tiêu chuẩn. */
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
   * (the module series photo covers all five power classes). Those
   * cards fall back to pointing the reader at the matching column of
   * the spec table.
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
  kind: 'Tài liệu kỹ thuật' | 'Bảo hành' | 'Hướng dẫn lắp đặt'
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
export const PRODUCT_SPEC_TBD = 'TBD — Thông số đầy đủ từ tài liệu kỹ thuật (chờ xác nhận)'

/** Shared warranty documents (used by inverter / battery / ESS). */
const STANDARD_WARRANTY: ProductDownload = {
  label: 'Tài liệu bảo hành tiêu chuẩn',
  description:
    'Điều khoản bảo hành và quy trình yêu cầu bảo hành cho bộ biến tần, pin lưu trữ và hệ thống lưu trữ năng lượng Solavita.',
  href: '/downloads/products/standard-warranty.pdf',
  kind: 'Bảo hành',
  size: '160 KB',
}

export const products: Product[] = [
  /* ────────────────────────────────────────────────────────────────────
     PV Module — QM210THCD-620-640-66 High Efficiency Series
     ──────────────────────────────────────────────────────────────────── */
  {
    slug: 'module',
    name: 'Tấm quang năng',
    tagline: 'Công suất cao, suy giảm thấp, bảo hành 30 năm',
    description:
      'Dòng QM210THCD High Efficiency Series-66 có công suất 620–640 W, hiệu suất chuyển đổi lên tới 23,7%. Tế bào N-type TOPCon, hệ số hai mặt 80% và bảo hành công suất tuyến tính 30 năm — phù hợp cho mái nhà và hệ lắp mặt đất tại Việt Nam, kể cả điều kiện nóng và nhiều bụi.',
    hero: {
      src: '/images/products/module/qm210-thcd-620-640-66-front-back.webp',
      alt: 'Tấm quang năng TOPCon Solavita QM210THCD-620-640-66, mặt trước phía trên mặt sau',
      caption: 'Mặt trước và mặt sau',
    },
    // Rooftop brand film — plays in the hero, then hands over to the
    // product render.
    video: { src: '/videos/video_1aada56d.mp4' },
    advantages: [
      {
        title: 'Công suất đầu ra cao',
        body: 'Hiệu suất lên tới 23,7% — tạo ra nhiều điện hơn trên cùng diện tích mái.',
      },
      {
        title: 'Suy giảm thấp trong điều kiện nhiệt độ cao',
        body: 'Hệ số Pmax −0,29%/°C và chỉ suy giảm 0,4% mỗi năm từ năm thứ 2.',
      },
      {
        title: 'Độ tin cậy lâu dài',
        body: 'Bảo hành sản phẩm 15 năm và bảo hành công suất tuyến tính 30 năm.',
      },
      {
        title: 'Sản lượng bổ sung nhờ hai mặt',
        body: 'Hệ số hai mặt lên tới 80% tận dụng ánh sáng phản xạ để tăng tới 10% sản lượng.',
      },
    ],
    configs: [
      // Three cards for a five-model series: entry, mid and flagship.
      // The 625 W and 635 W models stay in the spec table below.
      {
        name: '620 W',
        summary: 'QM210THCD-620-66',
        specs: [
          { value: '23.0%', label: 'Hiệu suất' },
          { value: '41.40 V', label: 'Vmp' },
        ],
      },
      {
        name: '630 W',
        summary: 'QM210THCD-630-66',
        specs: [
          { value: '23.4%', label: 'Hiệu suất' },
          { value: '42.00 V', label: 'Vmp' },
        ],
      },
      {
        name: '640 W',
        summary: 'QM210THCD-640-66',
        specs: [
          { value: '23.7%', label: 'Hiệu suất' },
          { value: '42.60 V', label: 'Vmp' },
        ],
      },
    ],
    reliability:
      'Thiết kế cho khí hậu khắc nghiệt: tế bào TOPCon, hệ số hai mặt 80% giúp tăng sản lượng, kèm bảo hành công suất 30 năm.',
    certifications: {
      title: 'Hệ thống chất lượng',
      items: [
        {
          code: 'IEC 61215 (2021)',
          note: 'Chứng nhận thiết kế và phê duyệt mẫu tấm pin',
          mark: 'shield',
        },
        {
          code: 'IEC 61730 (2018)',
          note: 'An toàn điện và hiệu suất',
          mark: 'zap',
        },
        {
          code: 'ISO 9001:2015',
          note: 'Hệ thống quản lý chất lượng',
          mark: 'badge',
        },
        {
          code: 'ISO 14001:2015',
          note: 'Hệ thống quản lý môi trường',
          mark: 'leaf',
        },
        {
          code: 'ISO 45001:2018',
          note: 'Quản lý an toàn và sức khỏe nghề nghiệp',
          mark: 'hardhat',
        },
        {
          code: 'TÜV SÜD',
          note: 'Hệ thống quản lý chất lượng được chứng nhận',
          mark: 'tuv',
        },
        {
          code: 'CE',
          note: 'Dấu chứng nhận hợp quy châu Âu',
          mark: 'ce',
        },
      ],
    },
    variants: [
      {
        id: 'qm210thcd-620-640-66',
        name: 'QM210THCD-620-640-66',
        subtitle: '620–640 W | N-type TOPCon | 132 tế bào nửa cắt',
        columns: [
          'Thông số',
          'QM210THCD-620-66',
          'QM210THCD-625-66',
          'QM210THCD-630-66',
          'QM210THCD-635-66',
          'QM210THCD-640-66',
        ],
        stats: [
          { value: '620–640 W', label: 'Công suất định mức' },
          { value: '23.0–23.7%', label: 'Hiệu suất tấm pin mặt trời' },
          { value: '30 năm', label: 'Bảo hành hiệu suất' },
        ],
        rows: [
          {
            label: 'Công suất tối đa (STC)',
            values: ['620 W', '625 W', '630 W', '635 W', '640 W'],
          },
          {
            label: 'Điện áp tại công suất tối đa',
            values: ['41.40 V', '41.70 V', '42.00 V', '42.30 V', '42.60 V'],
          },
          {
            label: 'Dòng điện tại công suất tối đa',
            values: ['14.99 A', '15.00 A', '15.01 A', '15.02 A', '15.03 A'],
          },
          {
            label: 'Điện áp hở mạch',
            values: ['49.60 V', '49.90 V', '50.20 V', '50.50 V', '50.80 V'],
          },
          {
            label: 'Dòng điện ngắn mạch',
            values: ['15.91 A', '15.92 A', '15.93 A', '15.94 A', '15.95 A'],
          },
          {
            label: 'Hiệu suất tấm pin mặt trời',
            values: ['23.0%', '23.2%', '23.4%', '23.6%', '23.7%'],
          },
          { label: 'Dung sai công suất', values: ['0 ~ +5 W'] },
          { label: 'Điện áp hệ thống tối đa', values: ['DC 1500 V'] },
          { label: 'Định mức cầu chì chuỗi tối đa', values: ['25 A / 30 A'] },
          { label: 'Nhiệt độ vận hành', values: ['−40 ~ +85 °C'] },
          { label: 'Nhiệt độ tế bào vận hành danh định', values: ['45 ± 2 °C'] },
          { label: 'Hệ số nhiệt điện áp Voc', values: ['−0.28%/°C'] },
          { label: 'Hệ số nhiệt Pmax', values: ['−0.29%/°C'] },
          { label: 'Hệ số nhiệt dòng Isc', values: ['+0.04%/°C'] },
          { label: 'Hệ số hai mặt', values: ['80% ± 5%'] },
          { label: 'Tế bào quang năng', values: ['132 (66 × 2)'] },
          { label: 'Kích thước', values: ['2382 × 1134 × 30 mm'] },
          { label: 'Khối lượng', values: ['32.5 kg'] },
          {
            label: 'Kính mặt trước',
            values: ['2.0 mm kính tôi cường lực phủ AR'],
          },
          { label: 'Kính mặt sau', values: ['2.0 mm kính tôi cường lực'] },
          { label: 'Khung', values: ['Hợp kim nhôm anod hóa'] },
          { label: 'Hộp đấu nối', values: ['IP68 / 3 đi-ốt'] },
          {
            label: 'Cáp đầu ra',
            values: ['4 mm² (IEC), +300 mm / −200 mm'],
          },
          { label: 'Tính năng chống cháy', values: ['Cấp C'] },
          { label: 'Bảo vệ an toàn', values: ['Cấp II'] },
          {
            label: 'Đóng gói',
            values: ['36 tấm / pallet — 720 tấm / container 40HQ'],
          },
          { label: 'Bảo hành sản phẩm', values: ['15 năm'] },
          { label: 'Bảo hành hiệu suất', values: ['30 năm, 0.4%/năm từ năm thứ 2'] },
        ],
      },
    ],
    downloads: [
      {
        label: 'Tài liệu kỹ thuật QM210THCD-620-640-66',
        description:
          'Thông số điện và cơ khí đầy đủ cho tấm pin mặt trời High Efficiency Series-66 620–640 W.',
        href: '/downloads/products/module-qm210-thcd-620-640-66-datasheet.pdf',
        kind: 'Tài liệu kỹ thuật',
        size: '1.4 MB',
      },
      {
        label: 'Bảo hành có giới hạn — Tấm quang năng',
        description:
          'Điều khoản bảo hành sản phẩm 15 năm và bảo hành công suất tuyến tính 30 năm.',
        href: '/downloads/products/module-limited-warranty.pdf',
        kind: 'Bảo hành',
        size: '420 KB',
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────────────
     Inverter — single-phase hybrid, three-phase hybrid, off-grid
     ──────────────────────────────────────────────────────────────────── */
  {
    slug: 'inverter',
    name: 'Bộ biến tần',
    tagline: 'Bộ biến tần hybrid và độc lập lưới cho mọi phụ tải',
    description:
      'Ba dòng bộ biến tần đáp ứng mọi nhu cầu: bộ biến tần hybrid một pha từ 3 kW đến 12 kW cho hộ gia đình, bộ biến tần hybrid ba pha từ 5 kW đến 20 kW cho công trình thương mại và bộ biến tần độc lập lưới (off-grid) 6 kW chuyên dụng cho nhu cầu dự phòng.',
    // The three families have different selling points, so they live on
    // each variant and render with the spec table. The hero carries no
    // shared list for this product.
    configs: [
      {
        name: 'SWH 3–12 kW',
        summary: 'Một pha · Điện áp thấp',
        specs: [
          { value: '3–12 kW', label: 'Công suất đầu ra định mức' },
          { value: '200%', label: 'Công suất tấm pin / công suất ra' },
        ],
        variantIndex: 0,
        views: [
          {
            src: '/images/products/inverter/swh-single-phase-1.webp',
            alt: 'Bộ biến tần hybrid một pha Solavita SWH, nhìn góc chéo phía trước',
            caption: 'Góc chéo',
          },
          {
            src: '/images/products/inverter/swh-single-phase-2.webp',
            alt: 'Bộ biến tần hybrid một pha Solavita SWH, nhìn chính diện',
            caption: 'Mặt trước',
          },
          {
            src: '/images/products/inverter/swh-single-phase-3.webp',
            alt: 'Bộ biến tần hybrid một pha Solavita SWH, nhìn góc chéo từ phía đối diện',
            caption: 'Góc bên',
          },
        ],
      },
      {
        name: 'SWH 5–20 kW',
        summary: 'Ba pha · Điện áp thấp',
        specs: [
          { value: '5–20 kW', label: 'Công suất đầu ra định mức' },
          { value: '40 kW', label: 'Đầu vào PV tối đa' },
        ],
        variantIndex: 1,
        views: [
          {
            src: '/images/products/inverter/swh-three-phase-1.webp',
            alt: 'Bộ biến tần hybrid ba pha Solavita SWH, nhìn góc chéo phía trước',
            caption: 'Góc chéo',
          },
          {
            src: '/images/products/inverter/swh-three-phase-2.webp',
            alt: 'Bộ biến tần hybrid ba pha Solavita SWH, nhìn chính diện',
            caption: 'Mặt trước',
          },
          {
            src: '/images/products/inverter/swh-three-phase-3.webp',
            alt: 'Bộ biến tần hybrid ba pha Solavita SWH, nhìn góc chéo từ phía đối diện',
            caption: 'Góc bên',
          },
        ],
      },
      {
        name: 'SWO 6000W',
        summary: 'Một pha · Độc lập lưới (off-grid)',
        specs: [
          { value: '6 kW', label: 'Công suất đầu ra định mức' },
          { value: '10 ms', label: 'Thời gian chuyển mạch' },
        ],
        variantIndex: 2,
        views: [
          {
            src: '/images/products/inverter/swo-6000w.webp',
            alt: 'Bộ biến tần độc lập lưới Solavita SWO 6000 W, nhìn chính diện',
            caption: 'Mặt trước',
          },
        ],
      },
    ],
    variants: [
      {
        id: 'swh-single-phase',
        name: 'SWH 3–12 kW',
        subtitle: '3–12 kW | Một pha | Điện áp thấp',
        advantages: [
          {
            title: 'Công suất cao, đấu được nhiều tấm pin',
            body: 'Mỗi chuỗi chịu 20 A, công suất tấm pin tối đa gấp đôi công suất ra; hai cổng đấu pin lưu trữ (416 A).',
          },
          {
            title: 'Chuyển sang pin dự phòng dưới 4 ms',
            body: 'Chuyển mạch UPS liền mạch, không ngắt thiết bị đang chạy; quản lý phụ tải thông minh.',
          },
          {
            title: 'An toàn, kín nước IP66',
            body: 'AFCI điều khiển bằng AI, chống sét SPD Type II; vỏ kín đạt IP66.',
          },
          {
            title: 'Lắp linh hoạt, dùng được nhiều loại pin',
            body: 'Chịu lệch tải giữa các pha tới 150%; tương thích pin Li-ion và axit-chì.',
          },
        ],
        columns: [
          'Thông số',
          'SWH3000L-S1-G2',
          'SWH3600L-S1-G2',
          'SWH5000L-S1-G2',
          'SWH6000L-S1-G2',
          'SWH8000L-S1-G2',
          'SWH010KL-S1-G2',
          'SWH012KL-S1-G2',
        ],
        stats: [
          { value: '3–12 kW', label: 'Công suất đầu ra AC định mức' },
          { value: '200%', label: 'Công suất tấm pin / công suất ra' },
          { value: 'IP66', label: 'Bảo vệ' },
        ],
        rows: [
          { label: 'Loại pin lưu trữ', values: ['Li-Ion / axit-chì'] },
          { label: 'Điện áp pin lưu trữ danh định', values: ['48 V'] },
          { label: 'Dải điện áp pin lưu trữ', values: ['40 ~ 60 V'] },
          { label: 'Số đầu vào pin lưu trữ', values: ['1'] },
          {
            label: 'Dòng sạc / xả liên tục tối đa',
            values: ['70 A', '90 A', '120 A', '140 A', '160 A', '200 A', '240 A'],
          },
          {
            label: 'Công suất đầu vào PV tối đa',
            values: ['6.0 kW', '7.2 kW', '10 kW', '12 kW', '16 kW', '20 kW', '24 kW'],
          },
          { label: 'Điện áp đầu vào PV tối đa', values: ['600 V'] },
          { label: 'Dải điện áp vận hành MPPT', values: ['60 ~ 550 V'] },
          {
            label: 'Dòng đầu vào tối đa mỗi MPPT',
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
            label: 'Dòng ngắn mạch tối đa mỗi MPPT',
            values: ['26 A', '26 A', '26 A', '26 A', '48 / 24 A', '48 / 48 A', '48 / 48 A'],
          },
          {
            label: 'Số bộ theo dõi MPPT',
            values: ['1', '2', '2', '2', '2', '2', '2'],
          },
          {
            label: 'Số chuỗi mỗi MPPT',
            values: ['1', '1', '1', '1', '2 / 1', '2 / 2', '2 / 2'],
          },
          {
            label: 'Công suất đầu ra AC định mức',
            values: ['3.0 kW', '3.6 kW', '5.0 kW', '6.0 kW', '8.0 kW', '10.0 kW', '12.0 kW'],
          },
          {
            label: 'Công suất đầu ra AC tối đa',
            values: ['3.3 kW', '3.96 kW', '5.5 kW', '6.6 kW', '8.8 kW', '11.0 kW', '13.2 kW'],
          },
          { label: 'Điện áp đầu ra AC định mức', values: ['220 / 230 / 240 V'] },
          { label: 'Dải điện áp đầu ra AC', values: ['170 ~ 280 V'] },
          { label: 'Tần số lưới AC định mức', values: ['50 / 60 Hz'] },
          {
            label: 'Dòng AC tối đa phát lên lưới',
            values: ['15 A', '18 A', '25 A', '30 A', '40 A', '50 A', '60 A'],
          },
          { label: 'Dòng AC tối đa từ lưới', values: ['32 A', '32 A', '40 A', '70 A', '75 A', '75 A', '75 A'] },
          { label: 'Hệ số công suất', values: ['~1 (0.8 sớm đến 0.8 trễ)'] },
          { label: 'Tổng méo hài tối đa', values: ['<3%'] },
          { label: 'Thời gian chuyển mạch dự phòng', values: ['<4 ms'] },
          { label: 'Hiệu suất tối đa', values: ['97.6%'] },
          { label: 'Hiệu suất châu Âu', values: ['96.2%'] },
          { label: 'Hiệu suất pin lưu trữ sang AC tối đa', values: ['95.5%'] },
          { label: 'Hiệu suất MPPT', values: ['99.9%'] },
          { label: 'Bảo vệ quá áp DC / AC', values: ['Type II / Type II'] },
          { label: 'Dải nhiệt độ vận hành', values: ['−35 ~ +60 °C'] },
          { label: 'Độ ẩm tương đối', values: ['0 ~ 95%'] },
          { label: 'Độ cao vận hành tối đa', values: ['3000 m'] },
          { label: 'Phương thức làm mát', values: ['Đối lưu tự nhiên / làm mát bằng quạt thông minh'] },
          { label: 'Giao diện người dùng', values: ['LCD, WLAN + Ứng dụng'] },
          {
            label: 'Giao tiếp',
            values: ['RS485, WiFi + LAN + Bluetooth, Modbus-RTU/TCP'],
          },
          {
            label: 'Khối lượng',
            values: ['14.5 kg', '15.5 kg', '15.5 kg', '15.5 kg', '27.0 kg', '29.0 kg', '29.0 kg'],
          },
          {
            label: 'Kích thước (R × C × S)',
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
          { label: 'Cấu trúc', values: ['Không cách ly'] },
          { label: 'Cấp bảo vệ xâm nhập', values: ['IP66'] },
          { label: 'Phương thức lắp đặt', values: ['Treo tường'] },
        ],
      },
      {
        id: 'swh-three-phase',
        name: 'SWH 5–20 kW',
        subtitle: '5–20 kW | Ba pha | Điện áp thấp',
        advantages: [
          {
            title: 'Hybrid ba pha, sóng sin chuẩn',
            body: 'Biến tần 230/400 V phục vụ tự dùng, dự phòng và phát lên lưới.',
          },
          {
            title: 'Bốn cổng vào PV, hai MPPT',
            body: 'Đấu được lượng tấm pin gấp 1,6 lần công suất ra để tăng sản lượng.',
          },
          {
            title: 'Kiểm soát phát lưới, sạc/xả tới 240 A',
            body: 'Chặn phát lên lưới khi cần; sạc và xả pin lưu trữ tới 240 A.',
          },
          {
            title: 'Chuyển nguồn dưới 10 ms, vỏ IP65',
            body: 'Chuyển sang chạy độc lập nhanh, ghép song song 6 thiết bị; IP65 cho công trình khắc nghiệt.',
          },
        ],
        columns: [
          'Thông số',
          'SWH5000L-T1-G2',
          'SWH6000L-T1-G2',
          'SWH8000L-T1-G2',
          'SWH010KL-T1-G2',
          'SWH012KL-T1-G2',
          'SWH015KL-T1-G2',
          'SWH020KL-T1-G2',
        ],
        stats: [
          { value: '5–20 kW', label: 'Công suất đầu ra AC định mức' },
          { value: '40 kW', label: 'Đầu vào PV tối đa' },
          { value: 'IP66', label: 'Bảo vệ' },
        ],
        rows: [
          { label: 'Loại pin lưu trữ', values: ['LFP / axit-chì'] },
          { label: 'Điện áp pin lưu trữ danh định', values: ['48 V'] },
          { label: 'Dải điện áp pin lưu trữ', values: ['40 ~ 60 V'] },
          {
            label: 'Số đầu vào pin lưu trữ',
            values: ['1', '1', '1', '1', '1', '2', '2'],
          },
          {
            label: 'Dòng sạc / xả liên tục tối đa',
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
            label: 'Công suất đầu vào PV tối đa',
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
          { label: 'Điện áp đầu vào PV tối đa', values: ['1000 V'] },
          { label: 'Dải điện áp vận hành MPPT', values: ['150 ~ 850 V'] },
          { label: 'Dòng MPPT tối đa', values: ['20 A mỗi MPPT'] },
          {
            label: 'Số MPPT',
            values: ['2', '2', '2', '3', '3', '4', '4'],
          },
          {
            label: 'Số chuỗi mỗi MPPT',
            values: ['1', '1', '1', '1', '1', '1', '1'],
          },
          {
            label: 'Công suất AC định mức',
            values: ['5.0 kW', '6.0 kW', '8.0 kW', '10.0 kW', '12.0 kW', '15.0 kW', '20.0 kW'],
          },
          {
            label: 'Công suất AC tối đa',
            values: ['5.5 kW', '6.6 kW', '8.8 kW', '11.0 kW', '13.2 kW', '16.5 kW', '22.0 kW'],
          },
          { label: 'Điện áp đầu ra định mức', values: ['400 / 380 V, 3L / N / PE'] },
          { label: 'Tần số định mức', values: ['50 / 60 Hz'] },
          { label: 'Tổng méo hài tối đa (THDI)', values: ['<3%'] },
          { label: 'Hệ số công suất', values: ['~1 (0.8 sớm đến 0.8 trễ)'] },
          {
            label: 'Hiệu suất tối đa',
            values: ['97.8%', '97.8%', '97.8%', '97.8%', '97.8%', '97.9%', '97.8%'],
          },
          {
            label: 'Hiệu suất châu Âu',
            values: ['97.0%', '97.0%', '97.1%', '97.3%', '97.3%', '97.3%', '97.4%'],
          },
          { label: 'Hiệu suất pin lưu trữ sang AC tối đa', values: ['95.5%'] },
          { label: 'Hiệu suất MPPT', values: ['99.9%'] },
          { label: 'Bảo vệ quá áp DC / AC', values: ['Type II / Type II'] },
          { label: 'Dải nhiệt độ vận hành', values: ['−35 ~ +60 °C'] },
          { label: 'Độ cao vận hành tối đa', values: ['4000 m'] },
          { label: 'Phương thức làm mát', values: ['Làm mát bằng quạt thông minh'] },
          {
            label: 'Giao tiếp',
            values: [
              'WiFi + LAN + Bluetooth, 4G, RS485, CAN; Modbus RTU / TCP',
            ],
          },
          {
            label: 'Khối lượng',
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
          { label: 'Kích thước (R × C × S)', values: ['756 × 551 × 258 mm'] },
          { label: 'Độ ồn phát thải', values: ['<45 dB'] },
          { label: 'Cấp bảo vệ xâm nhập', values: ['IP66'] },
          { label: 'Cấp chống ăn mòn', values: ['C4'] },
          { label: 'Phương thức lắp đặt', values: ['Treo tường'] },
        ],
      },
      {
        id: 'swo-off-grid',
        name: 'SWO 6000W',
        subtitle: '6 kW | Một pha | Độc lập lưới (off-grid)',
        advantages: [
          {
            title: 'Hiệu năng cao',
            body: 'Hai bộ MPPT (hiệu suất 99,9%, tối đa 22 A) và chế độ cắt đỉnh phụ tải thông minh.',
          },
          {
            title: 'An toàn ngoài trời',
            body: 'Vỏ đạt IP65, phù hợp lắp đặt ngoài trời.',
          },
          {
            title: 'Điều khiển thông minh',
            body: 'Chạy được chế độ chỉ PV hoặc hybrid; hẹn giờ, chống dòng ngược, kích hoạt pin lithium.',
          },
          {
            title: 'Tiết kiệm năng lượng',
            body: 'Giảm tổn thất khi không tải; tăng tỷ lệ điện tự dùng.',
          },
        ],
        columns: ['Thông số', 'SWO6000L-S1-SR'],
        stats: [
          { value: '6000 W', label: 'Công suất đầu ra định mức' },
          { value: '99.9%', label: 'Hiệu suất MPPT' },
          { value: 'IP65', label: 'Cấp bảo vệ' },
        ],
        rows: [
          { label: 'Công suất đầu ra định mức', values: ['6000 W'] },
          {
            label: 'Công suất đỉnh tối đa',
            values: ['2 × công suất định mức, 10 s'],
          },
          {
            label: 'Điện áp đầu ra định mức',
            values: ['230 Vac (200/208/220/230/240 Vac có thể cài đặt)'],
          },
          { label: 'Dòng đầu ra định mức', values: ['26.1 Aac'] },
          { label: 'Tần số định mức', values: ['50 / 60 Hz'] },
          { label: 'Dạng sóng', values: ['Sóng sin thuần'] },
          { label: 'Thời gian chuyển mạch', values: ['10 ms (điển hình)'] },
          {
            label: 'Loại pin lưu trữ',
            values: ['Lithium-ion / axit-chì / người dùng tự định nghĩa'],
          },
          { label: 'Điện áp pin lưu trữ định mức', values: ['48 Vdc'] },
          { label: 'Dải điện áp pin lưu trữ', values: ['40 ~ 60 Vdc'] },
          { label: 'Dòng xả tối đa', values: ['135 Adc'] },
          { label: 'Dòng sạc từ lưới / máy phát tối đa', values: ['135 Adc'] },
          { label: 'Dòng sạc PV tối đa', values: ['135 Adc'] },
          { label: 'Số bộ theo dõi MPPT', values: ['2'] },
          { label: 'Công suất đầu vào PV tối đa', values: ['6000 W + 6000 W'] },
          { label: 'Dòng đầu vào PV tối đa', values: ['22 Adc + 22 Adc'] },
          { label: 'Dòng ngắn mạch đầu vào tối đa', values: ['33 Adc + 33 Adc'] },
          { label: 'Điện áp đầu vào PV tối đa', values: ['500 Vdc'] },
          { label: 'Điện áp khởi động PV', values: ['60 Vdc'] },
          {
            label: 'Dải điện áp vận hành MPPT',
            values: ['65 ~ 450 Vdc'],
          },
          { label: 'Điện áp đầu vào định mức', values: ['220 / 230 Vac'] },
          {
            label: 'Dải điện áp đầu vào',
            values: ['170 ~ 280 Vac (±2%)'],
          },
          {
            label: 'Dải tần số đầu vào',
            values: ['50 Hz: 47 ~ 55 Hz | 60 Hz: 57 ~ 65 Hz'],
          },
          { label: 'Dòng quá tải bypass', values: ['40 Aac'] },
          { label: 'Hiệu suất theo dõi MPPT', values: ['99.9%'] },
          { label: 'Hiệu suất tối đa', values: ['97.5%'] },
          { label: 'Khả năng song song', values: ['1 ~ 6 thiết bị'] },
          { label: 'Kích thước (R × C × S)', values: ['300 × 460 × 217.5 mm'] },
          { label: 'Khối lượng', values: ['17.5 kg'] },
          { label: 'Nhiệt độ vận hành', values: ['−40 ~ +60 °C (giảm công suất khi >45 °C)'] },
          { label: 'Phương thức làm mát', values: ['Tản nhiệt + làm mát khí thông minh'] },
          { label: 'Độ ồn', values: ['<55 dB'] },
          { label: 'Cấp bảo vệ', values: ['IP65'] },
          { label: 'Giao diện tích hợp', values: ['RS485 / CAN / USB / Tiếp điểm khô'] },
          {
            label: 'Chứng nhận',
            values: ['RoHS, IEC 62109-1/-2, EN 61000'],
          },
          { label: 'Bảo hành', values: ['5 năm'] },
        ],
      },
    ],
    downloads: [
      {
        label: 'Tài liệu kỹ thuật bộ biến tần hybrid một pha SWH 3–12 kW',
        description:
          'Thông số kỹ thuật đầy đủ cho dòng hybrid một pha, từ SWH3000L đến SWH012KL.',
        href: '/downloads/products/inverter-swh-single-phase-hybrid-datasheet.pdf',
        kind: 'Tài liệu kỹ thuật',
        size: '3.3 MB',
      },
      {
        label: 'Tài liệu kỹ thuật bộ biến tần hybrid ba pha SWH 5–20 kW',
        description:
          'Thông số kỹ thuật đầy đủ cho dòng hybrid ba pha, từ SWH5000L-T1 đến SWH020KL-T1.',
        href: '/downloads/products/inverter-swh-three-phase-hybrid-datasheet.pdf',
        kind: 'Tài liệu kỹ thuật',
        size: '2.2 MB',
      },
      {
        label: 'Tài liệu kỹ thuật bộ biến tần độc lập lưới SWO 6000W',
        description:
          'Thông số kỹ thuật cho bộ biến tần độc lập lưới một pha SWO6000L-S1-SR.',
        href: '/downloads/products/inverter-swo-off-grid-datasheet.pdf',
        kind: 'Tài liệu kỹ thuật',
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
    name: 'Pin lưu trữ',
    tagline: 'Lưu trữ LiFePO₄ dạng mô-đun, mở rộng linh hoạt theo nhu cầu',
    description:
      'Các mô-đun SWR có dung lượng 5.12, 10.24 và 16.08 kWh, kết hợp tự do tối đa 16 thiết bị song song — đủ cho một hộ gia đình hoặc cả một công trình. Sạc và xả liên tục 1C, IP65 cho lắp đặt ngoài trời và bảo hành 10 năm.',
    advantages: [
      {
        title: 'Sạc nhanh, ghép song song tối đa 16 mô-đun',
        body: 'Ghép tối đa 16 mô-đun song song để mở rộng dung lượng; sạc và xả liên tục 1C/1C.',
      },
      {
        title: 'Lắp nhanh, ghép được pin lệch dung lượng',
        body: 'Lắp đặt nhanh, ít tốn công. Có thể ghép các mô-đun ở mức SOC khác nhau mà vẫn đảm bảo tuổi thọ pin.',
      },
      {
        title: 'An toàn, bảo hành 10 năm',
        body: 'Bảo vệ toàn diện: khóa ngắn mạch, chống quá áp. Bảo hành tiêu chuẩn 10 năm.',
      },
      {
        title: 'Chịu được thời tiết khắc nghiệt',
        body: 'Có tùy chọn tự sưởi, hoạt động từ −20 °C đến 55 °C; lắp được ngoài trời.',
      },
    ],
    configs: [
      {
        name: '5.12 kWh',
        summary: 'SWR5.12-L1-WW',
        specs: [
          { value: '100 Ah', label: 'Dung lượng' },
          { value: '100 A', label: 'Dòng tối đa' },
        ],
        columnIndex: 0,
        views: [
          {
            src: '/images/products/battery/swr-5-12-front.webp',
            alt: 'Pin lưu trữ LiFePO₄ Solavita SWR5.12-L1-WW, nhìn chính diện',
            caption: 'Mặt trước',
          },
          {
            src: '/images/products/battery/swr-5-12-left.webp',
            alt: 'Pin lưu trữ LiFePO₄ Solavita SWR5.12-L1-WW, nhìn mặt trái',
            caption: 'Mặt trái',
          },
          {
            src: '/images/products/battery/swr-5-12-right.webp',
            alt: 'Pin lưu trữ LiFePO₄ Solavita SWR5.12-L1-WW, nhìn mặt phải',
            caption: 'Mặt phải',
          },
        ],
      },
      {
        name: '16.08 kWh',
        summary: 'SWR16.08-L1-WW',
        specs: [
          { value: '314 Ah', label: 'Dung lượng' },
          { value: '200 A', label: 'Dòng tối đa' },
        ],
        columnIndex: 2,
        views: [
          {
            src: '/images/products/battery/swr-16-08-front.webp',
            alt: 'Pin lưu trữ LiFePO₄ Solavita SWR16.08-L1-WW, nhìn chính diện',
            caption: 'Mặt trước',
          },
          {
            src: '/images/products/battery/swr-16-08-left.webp',
            alt: 'Pin lưu trữ LiFePO₄ Solavita SWR16.08-L1-WW, nhìn mặt trái',
            caption: 'Mặt trái',
          },
          {
            src: '/images/products/battery/swr-16-08-right.webp',
            alt: 'Pin lưu trữ LiFePO₄ Solavita SWR16.08-L1-WW, nhìn mặt phải',
            caption: 'Mặt phải',
          },
        ],
      },
    ],
    certifications: {
      title: 'Bảo vệ',
      items: [
        {
          code: 'IP65',
          note: 'Bảo vệ vỏ trong nhà và ngoài trời',
          mark: 'shield',
        },
        {
          code: 'Khóa ngắn mạch',
          note: 'Chống quá áp, an toàn và tin cậy',
          mark: 'zap',
        },
      ],
    },
    variants: [
      {
        id: 'swr-l1-ww',
        name: 'SWR 5.12 / 10.24 / 16.08 kWh',
        subtitle: '51.2 V | Điện áp thấp | LiFePO₄',
        columns: [
          'Thông số',
          'SWR5.12-L1-WW',
          'SWR10.24-L1-WW',
          'SWR16.08-L1-WW',
        ],
        stats: [
          { value: '5.12–16.08 kWh', label: 'Năng lượng định mức' },
          { value: '100–314 Ah', label: 'Dung lượng định mức' },
          { value: '100–200 A', label: 'Sạc / xả tối đa' },
        ],
        rows: [
          { label: 'Điện áp định mức', values: ['51.2 V'] },
          {
            label: 'Dung lượng định mức',
            values: ['100 Ah', '200 Ah', '314 Ah'],
          },
          {
            label: 'Năng lượng định mức',
            values: ['5.12 kWh', '10.24 kWh', '16.08 kWh'],
          },
          { label: 'Điện áp sạc tiêu chuẩn', values: ['56.8 V'] },
          { label: 'Điện áp ngắt xả', values: ['44.8 V'] },
          {
            label: 'Dòng sạc tối đa',
            values: ['100 A', '150 A', '200 A'],
          },
          {
            label: 'Dòng xả tối đa',
            values: ['100 A', '150 A', '200 A'],
          },
          {
            label: 'Kích thước (D × R × C)',
            values: [
              '600 × 480 × 180 mm',
              '650 × 480 × 245 mm',
              '840 × 490 × 250 mm',
            ],
          },
          {
            label: 'Khối lượng',
            values: ['52 kg', '98 kg', '128 kg'],
          },
          { label: 'Nhiệt độ sạc', values: ['0 ~ 55 °C'] },
          { label: 'Nhiệt độ xả', values: ['−20 ~ 55 °C'] },
          {
            label: 'Tuổi thọ chu kỳ',
            values: [
              '>8000 chu kỳ (0.5C, 90% DOD)',
              '≥10000 chu kỳ (0.35C, 90% DOD)',
              '≥10000 chu kỳ (0.35C, 90% DOD)',
            ],
          },
          { label: 'Phương thức lắp đặt', values: ['Treo tường / đặt sàn'] },
          { label: 'Cấp bảo vệ', values: ['IP65'] },
          { label: 'Giao diện giao tiếp', values: ['RS485, RS232, CAN'] },
          {
            label: 'Tùy chọn',
            values: [
              'Tự động sưởi ấm, mô-đun chữa cháy, giám sát từ xa qua WiFi',
            ],
          },
          { label: 'Số thiết bị song song tối đa', values: ['16'] },
          { label: 'Bảo hành', values: ['10 năm'] },
        ],
      },
    ],
    downloads: [
      {
        label: 'Tài liệu kỹ thuật pin lưu trữ LiFePO₄ SWR',
        description:
          'Thông số kỹ thuật đầy đủ cho các mô-đun điện áp thấp 5.12, 10.24 và 16.08 kWh.',
        href: '/downloads/products/battery-swr-lifepo4-datasheet.pdf',
        kind: 'Tài liệu kỹ thuật',
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
    name: 'ESS tất cả trong một',
    tagline: 'Hệ thống lưu trữ năng lượng cho doanh nghiệp và công nghiệp (C&I)',
    description:
      'Một tủ duy nhất lưu trữ 261.25 kWh và cung cấp 125 kW — một giải pháp cho nhà máy, siêu thị hoặc lưới điện mini cộng đồng. Năm pack LFP, làm mát bằng chất lỏng và hiệu suất PCS 98.6%, lắp ráp tại nhà máy, sẵn sàng sử dụng.',
    advantages: [
      {
        title: 'Cắt giảm chi phí điện',
        body: 'Kết hợp điện mặt trời với pin lưu trữ, cắt chi phí điện hằng ngày nhờ 125 kW công suất điều độ.',
      },
      {
        title: 'Có điện khi lưới mất',
        body: 'Khi lưới gặp sự cố, hệ thống chuyển sang pin trong dưới 60 ms, giữ doanh nghiệp vận hành liên tục.',
      },
      {
        title: 'Bền bỉ ngoài trời',
        body: 'Một tủ liền khối đạt IP54, chống ăn mòn cấp C4; lắp đặt và vận hành đơn giản.',
      },
      {
        title: 'An toàn & đơn giản',
        body: 'Giám sát từ xa; tích hợp hệ chữa cháy dạng bình xịt và gốc nước.',
      },
    ],
    configs: [
      {
        name: 'SWS 261 kWh',
        summary: 'SWS-P125E261-HC-G2',
        specs: [
          { value: '125 kW', label: 'Công suất đầu ra' },
          { value: '98.6%', label: 'Hiệu suất PCS' },
        ],
        views: [
          {
            src: '/images/products/all-in-one-ess/sws-261-1.webp',
            alt: 'Tủ lưu trữ năng lượng C&I Solavita SWS 261 kWh, nhìn chính diện',
            caption: 'Mặt trước',
          },
          {
            src: '/images/products/all-in-one-ess/sws-261-2.webp',
            alt: 'Tủ lưu trữ năng lượng C&I Solavita SWS 261 kWh, nhìn góc ba phần tư',
            caption: 'Góc ba phần tư',
          },
          {
            src: '/images/products/all-in-one-ess/sws-261-3.webp',
            alt: 'Tủ lưu trữ năng lượng C&I Solavita SWS 261 kWh, nhìn mặt bên',
            caption: 'Mặt bên',
          },
        ],
      },
    ],
    variants: [
      {
        id: 'sws-p125e261-hc-g2',
        name: 'SWS 261 kWh',
        subtitle: '125 kW | 261.25 kWh | Ba pha',
        columns: ['Thông số', 'SWS-P125E261-HC-G2'],
        stats: [
          { value: '125 kW', label: 'Công suất đầu ra danh định' },
          { value: '261.25 kWh', label: 'Năng lượng khả dụng' },
          { value: '98.6%', label: 'Hiệu suất PCS tối đa' },
        ],
        rows: [
          { label: 'Loại tế bào', values: ['LFP (LiFePO₄)'] },
          { label: 'Dung lượng tế bào', values: ['314 Ah'] },
          { label: 'Năng lượng danh định của mô-đun', values: ['52.25 kWh'] },
          { label: 'Số pack', values: ['5'] },
          { label: 'Năng lượng danh định của rack', values: ['261.25 kWh'] },
          { label: 'Năng lượng khả dụng của rack', values: ['261.25 kWh'] },
          { label: 'Điện áp danh định', values: ['832 V'] },
          { label: 'Dải điện áp vận hành', values: ['676 ~ 936 V'] },
          { label: 'Dòng sạc / xả liên tục tối đa', values: ['188 A'] },
          { label: 'Dòng sạc / xả tối đa', values: ['198.5 A'] },
          { label: 'Tốc độ sạc / xả tối đa', values: ['0.5P'] },
          {
            label: 'Độ sâu xả',
            values: ['90% ~ 100% (khuyến nghị 90%)'],
          },
          { label: 'Công suất đầu ra danh định', values: ['125 kW'] },
          {
            label: 'Công suất đầu ra tối đa',
            values: ['137.5 kW @ 400 V AC | 130.6 kW @ 380 V AC'],
          },
          { label: 'Điện áp đầu ra danh định', values: ['400 / 380 V, 3L / N / PE'] },
          {
            label: 'Dải điện áp đầu ra',
            values: ['340 ~ 440 V | 323 ~ 418 V'],
          },
          { label: 'Tần số lưới AC danh định', values: ['50 / 60 Hz'] },
          { label: 'Dòng đầu ra AC tối đa', values: ['198.5 A'] },
          { label: 'Hệ số công suất', values: ['~1 (0.8 trễ đến 0.8 sớm)'] },
          { label: 'Tổng méo hài tối đa', values: ['<3%'] },
          { label: 'Hiệu suất PCS tối đa', values: ['98.6%'] },
          { label: 'Hiệu suất hệ thống', values: ['92.0%'] },
          { label: 'Thời gian chuyển mạch sạc / xả', values: ['<60 ms'] },
          {
            label: 'Dải nhiệt độ vận hành',
            values: ['−25 ~ +55 °C (giảm công suất ở 45 °C)'],
          },
          { label: 'Độ ẩm tương đối', values: ['10% ~ 95%'] },
          {
            label: 'Độ cao vận hành tối đa',
            values: ['4000 m (giảm công suất ở 2000 m)'],
          },
          {
            label: 'Phương thức làm mát',
            values: ['Pack: làm mát bằng chất lỏng | PCS: làm mát bằng quạt thông minh'],
          },
          {
            label: 'Cấu hình an toàn',
            values: [
              'Chữa cháy bằng bình xịt + gốc nước, quạt + tấm chống nổ (tùy chọn)',
            ],
          },
          { label: 'Khối lượng', values: ['2580 kg'] },
          { label: 'Kích thước (R × C × S)', values: ['1050 × 2250 × 1400 mm'] },
          { label: 'Độ ồn phát thải', values: ['≤70 dB'] },
          { label: 'Cấu trúc', values: ['Không cách ly'] },
          { label: 'Cấp bảo vệ xâm nhập', values: ['IP54'] },
          { label: 'Chống ăn mòn', values: ['C4 (C5 tùy chọn)'] },
          { label: 'Giao thức giao tiếp', values: ['Modbus TCP, Modbus RTU'] },
        ],
      },
    ],
    downloads: [
      {
        label: 'Tài liệu kỹ thuật SWS 261 kWh',
        description:
          'Thông số kỹ thuật đầy đủ cho hệ thống lưu trữ năng lượng C&I SWS-P125E261-HC-G2.',
        href: '/downloads/products/all-in-one-ess-sws-261kwh-datasheet.pdf',
        kind: 'Tài liệu kỹ thuật',
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
 * Pre-rendered 1200×630 JPEG social card for each product page.
 *
 * The raw product renders are portrait (or square) and sit on a
 * transparent or white background — sharing one directly would make
 * every platform advert to a 1.91:1 box and crop the product. These
 * cards are generated from the same renders, centred on white, so the
 * declared OG dimensions are always truthful.
 */
const PRODUCT_OG_IMAGES: Partial<Record<ProductSlug, string>> = {
  module: '/images/og-product-module.jpg',
  inverter: '/images/og-product-inverter.jpg',
  battery: '/images/og-product-battery.jpg',
  'all-in-one-ess': '/images/og-product-all-in-one-ess.jpg',
}

export function getProductOgImage(product: Product): string {
  return PRODUCT_OG_IMAGES[product.slug] ?? '/images/og-default.jpg'
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
    title: 'Tài liệu kỹ thuật tấm pin mặt trời TOPCon High Efficiency Series-66',
    category: 'Tấm quang năng',
    href: '/downloads/products/module-qm210-thcd-620-640-66-datasheet.pdf',
    image: '/images/products/module/qm210-thcd-620-640-66-front-back.webp',
    size: '1.4 MB',
  },
  {
    id: 'inverter-single-phase',
    title: 'Bộ biến tần hybrid một pha — SWH 3–12 kW',
    category: 'Bộ biến tần',
    href: '/downloads/products/inverter-swh-single-phase-hybrid-datasheet.pdf',
    image: '/images/products/inverter/swh-single-phase-1.webp',
    size: '3.3 MB',
  },
  {
    id: 'inverter-three-phase',
    title: 'Bộ biến tần hybrid ba pha — SWH 5–20 kW',
    category: 'Bộ biến tần',
    href: '/downloads/products/inverter-swh-three-phase-hybrid-datasheet.pdf',
    image: '/images/products/inverter/swh-three-phase-1.webp',
    size: '2.2 MB',
  },
  {
    id: 'inverter-off-grid',
    title: 'Bộ biến tần độc lập lưới — SWO 6000W',
    category: 'Bộ biến tần',
    href: '/downloads/products/inverter-swo-off-grid-datasheet.pdf',
    image: '/images/products/inverter/swo-6000w.webp',
    size: '2.7 MB',
  },
  {
    id: 'battery',
    title: 'Pin lưu trữ LiFePO₄ — SWR 5.12 / 10.24 / 16.08 kWh',
    category: 'Pin lưu trữ',
    href: '/downloads/products/battery-swr-lifepo4-datasheet.pdf',
    image: '/images/products/battery/swr-16-08-front.webp',
    size: '1.9 MB',
  },
  {
    id: 'all-in-one-ess',
    title: 'ESS tất cả trong một — SWS 261 kWh / 125 kW',
    category: 'ESS tất cả trong một',
    href: '/downloads/products/all-in-one-ess-sws-261kwh-datasheet.pdf',
    image: '/images/products/all-in-one-ess/sws-261-1.webp',
    size: '2.9 MB',
  },
  {
    id: 'module-warranty',
    title: 'Bảo hành có giới hạn — Tấm quang năng Skyworth',
    category: 'Bảo hành',
    href: '/downloads/products/module-limited-warranty.pdf',
    size: '420 KB',
  },
  {
    id: 'standard-warranty',
    title: 'Tài liệu bảo hành tiêu chuẩn Skyworth',
    category: 'Bảo hành',
    href: '/downloads/products/standard-warranty.pdf',
    size: '160 KB',
  },
]