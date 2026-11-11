/**
 * SolaHome — rooftop PV for villas & houses (Vietnam).
 *
 * Two installation types:
 *   - SolaRoof — panels mounted straight onto the existing roof.
 *   - SolaLoft — panels on a 2.7–2.8 m architectural steel frame, turning
 *     the roof into a usable "sky loft" / garden.
 *
 * Four packages: 5 kWp 1-phase, 10 kWp 1-phase, 10 kWp 3-phase,
 * 15 kWp 3-phase. Each package can be built as SolaRoof or SolaLoft
 * (the loft frame costs more to build), and two optional backup
 * solutions that pair a battery with a hybrid inverter.
 *
 * Sources (official Skyworth VN / CN material, Nov 2026):
 *   - `docs/Vietnam SolaRoof & SolaLoft Flyer_CN.pdf`
 *   - `docs/Vietnam SolaHome Integrated Solar System Flyer_VN 20260911.pdf`
 *   - `docs/Vietnam SolaHome Residential Flyer V2_VN 20260914.pdf`
 *   - https://vn.skyworth-pv.com/residential/solahome-pro/sola-home-pro
 *
 * Package and battery prices are deliberately not part of this data set:
 * the site quotes per configuration after the site survey, so every plan
 * card shows "Liên hệ để nhận báo giá" instead of a number.
 */

/** Lucide icon key for a benefit tile. */
export type SolaHomeBenefitIconKey =
  | 'heat'
  | 'gauge'
  | 'install'
  | 'factory'
  | 'design'

/** One benefit tile — icon + title + a single supporting line. */
export interface SolaHomeBenefit {
  icon: SolaHomeBenefitIconKey
  title: string
  body: string
}

/** The two ways to install SolaHome on a roof. */
export interface SolaHomeMount {
  id: 'solaroof' | 'solaloft'
  name: string
  /** Headline positioning. */
  headline: string
  /** One-paragraph description. */
  body: string
  /** Published benefits, as a title + supporting line. */
  benefits: SolaHomeBenefit[]
  /** Where this mounting type fits best. */
  bestFor: string
  /** Published technical highlights. */
  specs: { label: string; value: string }[]
  /** Installation photo. */
  imagePath: string
  imageAlt: string
}

export const solaHomeMounts: SolaHomeMount[] = [
  {
    id: 'solaroof',
    name: 'SolaRoof',
    headline: 'Nâng tầm mái nhà — mái cũ thành mái phát điện',
    body:
      'Tấm pin lắp thẳng lên mái nhà sẵn có.',
    benefits: [
      { icon: 'heat', title: 'Chống nóng, chống thấm', body: 'Panel chống nhiệt, mái mát hơn.' },
      { icon: 'gauge', title: 'Quản lý thông minh', body: 'Theo dõi sản lượng, tối ưu tự tiêu thụ.' },
      { icon: 'install', title: 'Lắp đặt không phá hủy', body: 'Giữ nguyên mái cũ, không đục lợp.' },
      { icon: 'factory', title: 'Sản xuất chính hãng', body: 'Đồng bộ với ngoại thất ngôi nhà.' },
    ],
    bestFor:
      'Nhà phố và biệt thự — muốn giữ nguyên mái và bắt đầu nhanh.',
    specs: [
      { label: 'Tương thích mái', value: 'Tôn, ngói, đá phiến, mái bằng có ballast' },
      { label: 'Biến tần', value: 'Hybrid 1 pha / 3 pha' },
      { label: 'Pin lưu trữ', value: 'LiFePO₄ 5–20 kWh, xếp chồng & mở rộng linh hoạt' },
      { label: 'Dự phòng', value: 'Mất lưới tự chuyển sang pin, giữ tủ lạnh, đèn, quạt' },
    ],
    imagePath: '/images/solahome/scene-solaroof-villa.webp',
    imageAlt:
      'Biệt thự lắp tấm pin SolaHome trực tiếp trên mái nghiêng, giữ nguyên cấu trúc mái',
  },
  {
    id: 'solaloft',
    name: 'SolaLoft',
    headline: 'Khoảng vườn trên cao — mái thành không gian sống',
    body:
      'Tấm pin đặt trên dàn khung thép kiến trúc dựng cao trên mái.',
    benefits: [
      { icon: 'heat', title: 'Chống nóng, chống thấm', body: 'Khung thép che mưa, bảo vệ mái.' },
      { icon: 'gauge', title: 'Quản lý thông minh', body: 'Khung và pin trong một hệ thống.' },
      { icon: 'design', title: 'Mỗi ngôi nhà một thiết kế', body: 'Bố cục khung và góc nghiêng riêng.' },
      { icon: 'factory', title: 'Sản xuất chính hãng', body: 'Khung thép chuẩn TÜV Rheinland.' },
    ],
    bestFor:
      'Biệt thự, nhà có khuôn viên rộng — muốn có chỗ sống trên mái.',
    specs: [
      { label: 'Khung thép', value: 'Cao tầng 2,7–2,8 m, tấm pin nghiêng 5°' },
      { label: 'Chịu gió bão', value: 'Cấp 12' },
      { label: 'Bảo hành chống ăn mòn', value: '30 năm' },
      { label: 'Pin tích hợp', value: 'LiFePO₄ 10–20 kWh tích hợp dưới khung' },
      { label: 'Sẵn sàng cho xe điện', value: 'Chuẩn bị bộ sạc AC' },
    ],
    imagePath: '/images/solahome/scene-solaloft-canopy.webp',
    imageAlt:
      'Dàn khung thép SolaLoft cao tầng trên mái biệt thự, kết hợp vườn trên cao',
  },
]

/**
 * The three Vietnamese installations shown on the SolaHome page.
 *
 * Source: the Skyworth PV overseas case deck
 * (`docs/20260921_创维光伏海外案例.pptx`) — the three Vietnamese
 * projects it documents. Every figure below is the deck's own slide
 * text; nothing is estimated. Each photo is the slide's own photo,
 * re-encoded to WebP under `public/images/solahome/`.
 *
 * The previous three entries (5 kWp Bình Dương −79% / 10 kWp Đồng
 * Nai −82% / 20 kWp TP.HCM −72%, each with a customer name) were not
 * published by Skyworth and did not match any project in the deck —
 * they have been removed rather than re-labelled.
 */
export interface SolaHomeCase {
  id: string
  /** Project name, as the deck prints it. */
  name: string
  /** Which SolaHome system the project uses. */
  system: 'SolaRoof' | 'SolaLoft'
  /** Installed PV capacity, as printed on the deck slide. */
  capacity: string
  /** City / province. */
  location: string
  /** One line about the installation and the system it uses. */
  note: string
  /** The deck's own rows for this project (equipment, output, payback…). */
  facts?: { label: string; value: string }[]
  /** Photo path — the deck slide's own photo. */
  imagePath?: string
  imageAlt: string
}

export const solaHomeCases: SolaHomeCase[] = [
  {
    id: 'qili-xiang-restaurant',
    name: 'Nhà hàng Qili Xiang',
    system: 'SolaLoft',
    capacity: '11,16 kWp',
    location: 'TP. Hồ Chí Minh · Quận 1',
    note:
      'Hệ SolaLoft — khung thép dựng trên mái, tấm pin nghiêng tối ưu bức xạ, mái thành không gian sống.',
    facts: [
      { label: 'Địa chỉ', value: '18 Phan Ke Binh, Tân Định, Quận 1, TP. Hồ Chí Minh' },
      { label: 'Tấm pin', value: '18 tấm × 620 Wp' },
      { label: 'Biến tần hybrid', value: '1 bộ' },
      { label: 'Sản lượng 25 năm', value: '400.354 kWh' },
      { label: 'Thời gian hoàn vốn', value: '3,25 năm' },
      { label: 'Lợi ích 25 năm', value: '1.000.885.000 ₫' },
    ],
    imagePath: '/images/solahome/case-hcm.webp',
    imageAlt:
      'Dàn SolaLoft bằng khung thép trên mái nhà hàng Qili Xiang tại TP. Hồ Chí Minh',
  },
  {
    id: 'binh-duong-solaroof',
    name: 'Nhà phố tại Bình Dương',
    system: 'SolaRoof',
    capacity: '7,44 kWp',
    location: 'TP. Hồ Chí Minh · Bình Dương',
    note:
      'Hệ SolaRoof trên mái dốc — dàn pin 7,44 kWp, biến tần lưu trữ 3 pha 5 kW và pin 14,3 kWh.',
    facts: [
      { label: 'Công suất lắp đặt', value: '7,44 kWp' },
      { label: 'Biến tần lưu trữ', value: '5 kW · 3 pha' },
      { label: 'Pin lưu trữ', value: '14,3 kWh' },
      { label: 'Loại mái', value: 'Mái dốc (SolaRoof)' },
    ],
    imagePath: '/images/solahome/case-binhduong.webp',
    imageAlt:
      'Hệ điện mặt trời SolaRoof lắp trên mái dốc của một nhà phố tại Bình Dương',
  },
  {
    id: 'bac-ninh-sunroom',
    name: 'Nhà kính Bắc Ninh',
    system: 'SolaLoft',
    capacity: '9,92 kWp',
    location: 'Bắc Ninh',
    note:
      'Hệ SolaLoft mái kính — dàn pin 9,92 kWp, biến tần lưu trữ 1 pha 10 kW và pin 14,3 kWh.',
    facts: [
      { label: 'Công suất lắp đặt', value: '9,92 kWp' },
      { label: 'Biến tần lưu trữ', value: '10 kW · 1 pha' },
      { label: 'Pin lưu trữ', value: '14,3 kWh' },
      { label: 'Loại mái', value: 'Mái kính (sunroom)' },
    ],
    imagePath: '/images/solahome/case-bacninh.webp',
    imageAlt:
      'Hệ SolaLoft mái kính trên mái nhà tại Bắc Ninh',
  },
]

/** One of the four packages. */
export interface SolaHomePackage {
  id: string
  name: string
  /** Nameplate capacity, kWp. */
  capacity: string
  /** Phase of the hybrid inverter. */
  phase: '1 pha' | '3 pha'
  /** Hybrid inverter model series. */
  inverter: string
  /** DC array window, kWp. */
  dcRange: string
  /** Roof area the package expects, m². */
  roofArea: string
  /** Panel count + wattage from the published sizing table. */
  panels: string
  /**
   * Average daily production for this package's roof area, taken from
   * the published sizing table (`solaHomeRoofTable`): 25–30 ㎡ → 20 kWh,
   * 45–52 ㎡ → 40 kWh, 67–77 ㎡ → 60 kWh. Not an estimate of our own.
   */
  dailyOutput: string
  /** Published monthly saving for the same sizing-table row. */
  monthlySaving: string
  /** Which storage pairing the published packages allow. */
  storage: string
  /** One-line positioning. */
  summary: string
  /** Which customers this package suits. */
  fits: string
}

export const solaHomePackages: SolaHomePackage[] = [
  {
    id: 'solahome-5kwp',
    name: 'Gói Cơ Bản',
    capacity: '5 kWp',
    phase: '1 pha',
    inverter: 'SWH 3-6KH/KL-S1',
    dcRange: '4,96 – 6,20 kWp',
    roofArea: '25 – 30 ㎡',
    panels: '9 tấm × 620 W',
    dailyOutput: '20 kWh/ngày',
    monthlySaving: '1.766.500 VND/tháng',
    storage: 'Tùy chọn — pin 5 kWh + hybrid 1 pha',
    summary: 'Mở đầu với mái 25–30 ㎡, ưu tiên tiết kiệm điện ban ngày.',
    fits: 'Hộ gia đình 1 pha, hóa đơn điện vừa phải, muốn bắt đầu nhẹ nhàng.',
  },
  {
    id: 'solahome-10kwp',
    name: 'Gói Phổ Biến',
    capacity: '10 kWp',
    phase: '1 pha',
    inverter: 'SWH series hybrid',
    dcRange: '7,44 – 11,16 kWp',
    roofArea: '45 – 52 ㎡',
    panels: '16 tấm × 620 W',
    dailyOutput: '40 kWh/ngày',
    monthlySaving: '3.842.500 VND/tháng',
    storage: 'Tùy chọn — pin 10 hoặc 16 kWh + hybrid 1 pha',
    summary: 'Mái 45–52 ㎡, đáp ứng gia đình nhiều thiết bị cùng lúc.',
    fits: 'Biệt thự và nhà phố 1 pha, nhiều điều hòa, tủ lạnh và thiết bị chạy cả ngày.',
  },
  {
    id: 'solahome-10kwp-3p',
    name: 'Gói 10 kWp Ba Pha',
    capacity: '10 kWp',
    phase: '3 pha',
    inverter: 'SWH 5-15KH-T1',
    dcRange: '9,92 – 12,40 kWp',
    roofArea: '45 – 52 ㎡',
    panels: '16 tấm × 620 W',
    dailyOutput: '40 kWh/ngày',
    monthlySaving: '3.842.500 VND/tháng',
    storage: 'Tùy chọn — pin 10 hoặc 16 kWh + hybrid 3 pha',
    summary: 'Cùng công suất 10 kWp nhưng cấp điện ba pha, ưu tiên tải lớn.',
    fits: 'Nhà có tải ba pha (điều hòa trung tâm, bơm, thang máy), văn phòng tư nhân.',
  },
  {
    id: 'solahome-15kwp-3p',
    name: 'Gói Gia Đình Lớn',
    capacity: '15 kWp',
    phase: '3 pha',
    inverter: 'SWH 5-15KH-T1',
    dcRange: '13,64 – 17,36 kWp',
    roofArea: '67 – 77 ㎡',
    panels: '24 tấm × 620 W',
    dailyOutput: '60 kWh/ngày',
    monthlySaving: '5.918.500 VND/tháng',
    storage: 'Tùy chọn — pin 16 kWh + hybrid 3 pha',
    summary: 'Mái lớn 67–77 ㎡, công suất cao nhất trong dòng SolaHome.',
    fits: 'Biệt thự lớn, nhà 3 pha cần vừa phát điện vừa cấp điện dự phòng.',
  },
]

/**
 * The reference loads the site's own savings model is built on.
 *
 * Published verbatim in the footnote under the roof-sizing table
 * (`solaHomeRoofTableNote`): "Công suất tải tham chiếu: điều hòa
 * trung tâm 1 kW, điều hòa 800 W, tủ lạnh 150 W, quạt 50 W." The
 * package cards reuse them so the hover panel shows the same loads the
 * published economics assume — no per-package runtime figures are
 * invented here.
 */
export interface SolaHomeLoad {
  icon: 'ac' | 'refrigerator' | 'fan'
  /** Rated power of the reference load. */
  value: string
  /** Device name. */
  label: string
}

export const solaHomeLoadReference: SolaHomeLoad[] = [
  { icon: 'ac', value: '1 kW', label: 'Điều hòa trung tâm' },
  { icon: 'ac', value: '800 W', label: 'Điều hòa' },
  { icon: 'refrigerator', value: '150 W', label: 'Tủ lạnh' },
  { icon: 'fan', value: '50 W', label: 'Quạt' },
]

/** The two optional backup (bổ sung pin) solutions. */
export interface SolaHomeBackup {
  id: string
  name: string
  /** Which homes this pairing suits. */
  fits: string
  /** Product photo of the battery in this pairing. */
  imagePath: string
  imageAlt: string
  /**
   * How the photo sits in the frame. Scene shots fill the frame
   * ("cover"); studio shots are cut on white and are blended into the
   * panel ("contain").
   */
  imageFit?: 'cover' | 'contain'
  battery: { model: string; capacity: string }
  inverter: { model: string; note: string }
  /** What the customer gets from the pairing. */
  benefits: string[]
}

export const solaHomeBackups: SolaHomeBackup[] = [
  {
    id: 'backup-modular',
    name: 'Phương án A — Pin xếp chồng + Hybrid 1 pha',
    fits: 'Gia đình 1 pha, cần pin mở rộng linh hoạt theo nhu cầu tăng dần.',
    imagePath: '/images/product-battery-2.webp',
    imageAlt:
      'Pin lưu trữ LiFePO₄ dạng mô-đun xếp chồng, lắp đặt trong không gian sống',
    imageFit: 'cover',
    battery: {
      model: 'Pin LiFePO₄ dạng mô-đun xếp chồng',
      capacity: '5 kWh (mở rộng lên 10 kWh hoặc 20 kWh)',
    },
    inverter: {
      model: 'Biến tần hybrid 1 pha SWH 3-6KH/KL-S1',
      note: 'Cùng dòng SW 3-12KTL-S1 của Solavita — hiệu suất tối đa 98,6%, siêu tải DC 1,5 lần.',
    },
    benefits: [
      'Mất lưới tự động chuyển sang pin, giữ đèn, quạt, tủ lạnh',
      'Bắt đầu từ 5 kWh, thêm mô-đun khi nhu cầu tăng',
      'Phù hợp hộ gia đình 1 pha với hóa đơn điện vừa phải',
    ],
  },
  {
    id: 'backup-allinone',
    name: 'Phương án B — Pin All-in-one + Hybrid 3 pha',
    fits: 'Biệt thự và nhà 3 pha, muốn một khối pin gọn gàng dưới khung hoặc trong khu vực kỹ thuật.',
    imagePath: '/images/products/inverter/swh-three-phase-1.webp',
    imageAlt:
      'Bộ biến tần hybrid ba pha SKYWORTH SWH đi kèm pin All-in-one, nhìn góc chéo phía trước',
    imageFit: 'contain',
    battery: {
      model: 'Pin All-in-one LiFePO₄',
      capacity: '14,3 kWh',
    },
    inverter: {
      model: 'Biến tần hybrid 3 pha SWH 5-15KH-T1',
      note: 'Cùng dòng SW 5-20KTL-T1 của Solavita — dành cho tải lớn và hệ ba pha.',
    },
    benefits: [
      'Mất lưới tự động chuyển pin, duy trì điều hòa và thiết bị thiết yếu',
      'Một khối trụ gọn, không chiếm thêm không gian sinh hoạt',
      'Sẵn sàng cho bộ sạc AC của xe điện',
    ],
  },
]

/**
 * Roof-area → capacity lookup, published in the CN flyer.
 *
 * Both the display strings and the numeric fields come from the same
 * published table. The numeric fields drive the sizing matcher and the
 * bill estimator; they are not a second estimate of our own.
 */
export interface SolaHomeRoofRow {
  area: string
  /** Lower bound of the published roof-area band, m². */
  areaMin: number
  /** Upper bound of the published roof-area band, m². */
  areaMax: number
  capacity: string
  /** Nameplate capacity as a number, kW — the matcher's sort key. */
  kW: number
  panels: string
  dailyKwh: number
  dailyOutput: string
  monthlySavingVnd: number
  monthlySaving: string
  /** The four-package line-up row this sizing row maps to. */
  packageId: string | null
}

export const solaHomeRoofTable: SolaHomeRoofRow[] = [
  { area: '25 – 30 ㎡', areaMin: 25, areaMax: 30, capacity: '5 kW', kW: 5, panels: '9 tấm (620 W)', dailyKwh: 20, dailyOutput: '20 kWh', monthlySavingVnd: 1_766_500, monthlySaving: '1.766.500 VND', packageId: 'solahome-5kwp' },
  { area: '28 – 33 ㎡', areaMin: 28, areaMax: 33, capacity: '6 kW', kW: 6, panels: '10 tấm (620 W)', dailyKwh: 24, dailyOutput: '24 kWh', monthlySavingVnd: 2_181_700, monthlySaving: '2.181.700 VND', packageId: 'solahome-5kwp' },
  { area: '36 – 42 ㎡', areaMin: 36, areaMax: 42, capacity: '8 kW', kW: 8, panels: '13 tấm (620 W)', dailyKwh: 32, dailyOutput: '32 kWh', monthlySavingVnd: 3_012_100, monthlySaving: '3.012.100 VND', packageId: 'solahome-10kwp' },
  { area: '45 – 52 ㎡', areaMin: 45, areaMax: 52, capacity: '10 kW', kW: 10, panels: '16 tấm (620 W)', dailyKwh: 40, dailyOutput: '40 kWh', monthlySavingVnd: 3_842_500, monthlySaving: '3.842.500 VND', packageId: 'solahome-10kwp' },
  { area: '67 – 77 ㎡', areaMin: 67, areaMax: 77, capacity: '15 kW', kW: 15, panels: '24 tấm (620 W)', dailyKwh: 60, dailyOutput: '60 kWh', monthlySavingVnd: 5_918_500, monthlySaving: '5.918.500 VND', packageId: 'solahome-15kwp-3p' },
  { area: '135 – 150 ㎡', areaMin: 135, areaMax: 150, capacity: '30 kW', kW: 30, panels: '48 tấm (620 W)', dailyKwh: 120, dailyOutput: '120 kWh', monthlySavingVnd: 12_146_500, monthlySaving: '12.146.500 VND', packageId: null },
]

/** The footnote published under the roof table. */
export const solaHomeRoofTableNote =
  'Mức tiết kiệm mỗi tháng = 4 giờ nắng hiệu dụng/ngày × sản lượng/ngày × 30 ngày × đơn giá điện theo bậc thang. Công suất tải tham chiếu: điều hòa trung tâm 1 kW, điều hòa 800 W, tủ lạnh 150 W, quạt 50 W.'

/**
 * Roof-type picker — the first decision a homeowner can actually answer.
 *
 * The compatibility list is the published SolaRoof spec ("Tôn, ngói,
 * đá phiến, mái bằng có ballast"). Each roof type therefore lists the
 * schemes that the published material supports for it: SolaRoof for
 * every roof in the compatibility list, and SolaLoft as a second route
 * only on the flat roof, where the published material positions it as a
 * steel frame with a usable space below the panels. No new mounting
 * hardware claims are made here.
 *
 * The scene photos are the site's own SolaHome images; the roof-material
 * thumbnails come from the SolaMate asset set.
 */
export interface SolaHomeScheme {
  /** The mounting type behind the scheme — the product name on the card. */
  mountId: 'solaroof' | 'solaloft'
  /** How the scheme is named in sales language ("chống ballast", "khung cao tầng"). */
  name: string
  /** One short paragraph. */
  body: string
  /**
   * Two or three differentiators — what sets this scheme apart from the
   * other one on the same roof type. On a flat roof the two schemes share
   * the same panels, inverter and battery, so without these lines the two
   * cards look like the same product twice.
   */
  points?: string[]
  /** Scene image of the finished installation. */
  imagePath: string
  imageAlt: string
}

export interface SolaHomeRoofOption {
  id: 'tile' | 'metal' | 'flat'
  label: string
  /** One line under the selector. */
  short: string
  /** Thumbnail for the selector tab — a photo of the roof material. */
  thumbPath: string
  thumbAlt: string
  headline: string
  /** Structure of this roof type — the left column. */
  structure: string
  /** How the system is mounted on this roof — the left column. */
  method: string
  /** What the homeowner should check before the survey — the left column. */
  check: string
  /** The installation schemes — the right-hand cards. */
  schemes: SolaHomeScheme[]
}

/**
 * The three things a technician has to confirm before quoting any
 * roof — the same three for every roof type, so they live here once
 * instead of being repeated per option.
 */
export const solaHomeRoofChecks: string[] = [
  'Diện tích mái khả dụng',
  'Kết cấu chịu lực của mái',
  'Khoảng lùi và không gian lắp đặt',
]

export const solaHomeRoofOptions: SolaHomeRoofOption[] = [
  {
    id: 'tile',
    label: 'Mái ngói',
    short: 'Lắp trực tiếp lên mái, giữ nguyên cấu trúc',
    thumbPath: '/images/solamate/clay-tiles.webp',
    thumbAlt: 'Mái ngói xếp chồng trên hệ rường',
    headline: 'Mái ngói — SolaRoof lắp trực tiếp lên mái',
    structure:
      'Mái ngói có độ dốc lớn, bề mặt gồm các viên ngói xếp chồng trên hệ rường.',
    method:
      'Tấm pin và khung đỡ gắn thẳng lên mái sẵn có — giữ nguyên cấu trúc mái, không đục lợp lại.',
    check:
      'Kỹ thuật viên kiểm tra độ dốc, hướng mái và tải trọng mái khi khảo sát.',
    schemes: [
      {
        mountId: 'solaroof',
        name: 'Lắp trực tiếp trên mái',
        body: 'Tấm pin bám theo mái ngói, không thay đổi cấu trúc mái và không cần tháo lợp.',
        points: [
          'Không tháo lợp, giữ nguyên ngói và hệ rường',
          'Tấm pin chống nhiệt, mái mát hơn',
          'Bắt đầu nhanh — không phải dựng khung thép kiến trúc',
        ],
        imagePath: '/images/solahome/scene-solaroof-villa.webp',
        imageAlt:
          'Biệt thự lắp tấm pin SolaHome trực tiếp trên mái ngói, giữ nguyên cấu trúc mái',
      },
    ],
  },
  {
    id: 'metal',
    label: 'Mái tôn',
    short: 'Tôn sóng, tôn màu — lắp trực tiếp, mái mát hơn',
    thumbPath: '/images/solamate/metal-tiles.webp',
    thumbAlt: 'Mái tôn sóng phủ trên hệ rường thép',
    headline: 'Mái tôn — SolaRoof lắp trực tiếp lên mái',
    structure:
      'Mái tôn (tôn sóng, tôn màu) có độ dốc thấp, bề mặt kim loại hấp nhiệt nhanh vào nhà.',
    method:
      'Tấm pin phủ lên mái, vừa phát điện vừa giảm nhiệt hấp thụ vào nhà.',
    check:
      'Mái tôn cần đủ độ cứng và đúng hướng nắng — kỹ thuật viên xác nhận khi khảo sát.',
    schemes: [
      {
        mountId: 'solaroof',
        name: 'Lắp trực tiếp trên mái',
        body: 'Tấm pin phủ lên mái tôn, không tháo lợp và không thay đổi kết cấu mái.',
        points: [
          'Tấm pin phủ lên mái tôn, không tháo lợp',
          'Giảm nhiệt hấp thụ từ mái vào nhà',
          'Bắt đầu nhanh — không phải dựng khung thép kiến trúc',
        ],
        imagePath: '/images/solahome/scene-solaloft.webp',
        imageAlt:
          'Biệt thự lắp tấm pin SolaHome trực tiếp trên mái tôn, giữ nguyên kết cấu mái',
      },
    ],
  },
  {
    id: 'flat',
    label: 'Mái bằng',
    short: 'Chống ballast trên bê tông, hoặc khung SolaLoft',
    thumbPath: '/images/solamate/Flat-Roof.webp',
    thumbAlt: 'Mái bằng bê tông phẳng của một tòa nhà',
    headline: 'Mái bằng — chống ballast hoặc khung SolaLoft',
    structure:
      'Mái bằng bê tông phẳng, không có độ dốc để đặt tấm pin trực tiếp.',
    method:
      'Hai phương án: chống ballast trên nền bê tông, hoặc dựng khung thép SolaLoft cao tầng.',
    check:
      'Cần đo diện tích khả dụng, khoảng lùi và kết cấu chịu lực của mái bằng.',
    schemes: [
      {
        mountId: 'solaroof',
        name: 'Chống ballast trên bê tông',
        body: 'Tấm pin được chặn bằng khối ballast trên nền bê tông, không đục khoan mái.',
        points: [
          'Chặn bằng khối ballast trên nền bê tông — không khoan mái',
          'Tấm pin đặt phẳng theo mái, không có khoảng trống bên dưới',
          'Chi phí thấp hơn phương án khung thép',
        ],
        imagePath: '/images/solamate/Flat-Roofs.webp',
        imageAlt:
          'Hệ tấm pin SolaRoof chống ballast trên mái bằng bê tông, khung và tấm pin được chặn bằng khối ballast',
      },
      {
        mountId: 'solaloft',
        name: 'Khung thép cao tầng',
        body: 'Khung thép kiến trúc cao 2,7–2,8 m, tấm pin nghiêng 5°, giữ được không gian sử dụng dưới tấm pin.',
        points: [
          'Khung thép kiến trúc cao 2,7–2,8 m, tấm pin nghiêng 5°',
          'Pin LiFePO₄ 10–20 kWh tích hợp dưới khung',
          'Giữ được vườn trên cao, khung chịu gió bão cấp 12',
        ],
        imagePath: '/images/solahome/scene-solaloft-canopy.webp',
        imageAlt:
          'Dàn khung thép SolaLoft cao tầng trên mái, giữ khoảng không gian sử dụng bên dưới tấm pin',
      },
    ],
  },
]

/**
 * The energy-flow states behind the simulator.
 *
 * Mirrors the three published operating modes and the published
 * backup behaviour: solar serves the load first, surplus charges the
 * battery, the grid fills the gap, and an outage switches the
 * essential loads to the battery. No kWh figures are attached — the
 * official material does not publish per-state runtime for SolaHome.
 */
export interface SolaHomeEnergyState {
  id: 'day' | 'night' | 'outage'
  label: string
  title: string
  body: string
  /** Flows drawn as active in the diagram. */
  flows: {
    pvHome: boolean
    pvBattery: boolean
    gridHome: boolean
    batteryHome: boolean
  }
  note: string
}

export const solaHomeEnergyStates: SolaHomeEnergyState[] = [
  {
    id: 'day',
    label: 'Ban ngày',
    title: 'Nắng lên — điện mặt trời cấp cho nhà trước',
    body:
      'Tấm pin phát điện, hệ thống ưu tiên cấp cho tải đang chạy. Phần dư sạc vào pin lưu trữ (nếu có); khi pin đầy hoặc tải vượt sản lượng, lưới điện bù phần còn thiếu.',
    flows: { pvHome: true, pvBattery: true, gridHome: true, batteryHome: false },
    note: 'Ưu tiên tự tiêu thụ — điện làm ra được dùng ngay tại nhà.',
  },
  {
    id: 'night',
    label: 'Ban đêm',
    title: 'Tối đến — pin tiếp quản phần điện đã tích',
    body:
      'Khi không còn nắng, hệ thống xả pin LiFePO₄ cho tải thiết yếu. Nếu pin yếu, biến tần hybrid bổ sung điện từ lưới để giữ nguồn điện liên tục.',
    flows: { pvHome: false, pvBattery: false, gridHome: true, batteryHome: true },
    note: 'Cần phương án pin để dùng điện mặt trời vào buổi tối.',
  },
  {
    id: 'outage',
    label: 'Mất lưới',
    title: 'Mất điện — tự chuyển sang pin dự phòng',
    body:
      'Chế độ dự phòng tự động ngắt khỏi lưới và chuyển tải sang pin: giữ tủ lạnh, đèn, quạt; với SolaLoft, hệ thống còn duy trì được điều hòa và thiết bị đang chạy.',
    flows: { pvHome: false, pvBattery: false, gridHome: false, batteryHome: true },
    note: 'Không có pin lưu trữ thì không có nguồn dự phòng khi mất lưới.',
  },
]

/**
 * The four HEMS capabilities published in the integrated-system flyer.
 * They are folded into the energy-flow section instead of getting a
 * separate "smart energy management" block.
 */
export const solaHomeHems: { title: string; body: string }[] = [
  {
    title: 'Giám sát thời gian thực',
    body: 'Dữ liệu phát điện, tiêu thụ và lưu trữ của gia đình.',
  },
  {
    title: 'Tối ưu tự tiêu thụ',
    body: 'Ưu tiên dùng điện mặt trời tại chỗ, giảm điện mua từ lưới.',
  },
  {
    title: 'Quản lý sạc/xả pin',
    body: 'Điều chỉnh chiến lược sạc/xả để kéo dài tuổi thọ pin.',
  },
  {
    title: 'Báo cáo & phân tích',
    body: 'Thống kê hiệu quả vận hành và gợi ý tối ưu hệ thống.',
  },
]

/**
 * Delivery + after-sales, merged into one sequence. The seven stages
 * are the service flow printed in the integrated-system flyer; the
 * owner column answers "who handles this?" so the handover, monitoring
 * and maintenance responsibilities are explicit.
 */
/** One step of the delivery flow — survey → after-sales. */
export type SolaHomeServiceIconKey =
  | 'survey'
  | 'design'
  | 'contract'
  | 'install'
  | 'handover'
  | 'monitor'
  | 'maintenance'

export const solaHomeService: {
  title: string
  body: string
  owner: string
  icon: SolaHomeServiceIconKey
}[] = [
  {
    title: 'Khảo sát miễn phí',
    body: 'Đo đạc mái, đánh giá tải trọng, hướng nắng và nhu cầu dự phòng.',
    owner: 'Kỹ thuật viên Solavita',
    icon: 'survey',
  },
  {
    title: 'Thiết kế phương án',
    body: 'Chọn SolaRoof hoặc SolaLoft, công suất và vị trí pin theo ngôi nhà.',
    owner: 'Kỹ thuật viên Solavita',
    icon: 'design',
  },
  {
    title: 'Ký hợp đồng',
    body: 'Báo giá trong 24 giờ, chốt cấu hình và tiến độ thi công.',
    owner: 'Solavita',
    icon: 'contract',
  },
  {
    title: 'Lắp đặt tại nhà',
    body: 'Thi công trong 2–3 ngày, gọn gàng, an toàn, đúng tiến độ.',
    owner: 'Đội thi công Solavita',
    icon: 'install',
  },
  {
    title: 'Đấu nối & nghiệm thu',
    body: 'Kết nối hộp phân phối AC theo quy định địa phương và chạy thử toàn hệ thống.',
    owner: 'Đội thi công Solavita',
    icon: 'handover',
  },
  {
    title: 'Giám sát thông minh',
    body: 'Bàn giao SKYWORTH Smart App, theo dõi sản lượng và mức tiêu thụ.',
    owner: 'Hệ thống giám sát',
    icon: 'monitor',
  },
  {
    title: 'Vận hành, bảo trì & hậu mãi',
    body: 'Bảo trì miễn phí 3 năm đầu; hỗ trợ kỹ thuật sau đó qua hotline và Zalo.',
    owner: 'Solavita',
    icon: 'maintenance',
  },
]

/**
 * Completed systems listed on the integrated-system flyer. Only the
 * capacity and the province are printed there, so that is all this
 * strip shows.
 */
export const solaHomeProjects: { capacity: string; location: string }[] = [
  { capacity: '25,2 kWp', location: 'Hà Nội' },
  { capacity: '13,23 kWp', location: 'Bắc Giang' },
  { capacity: '11,34 kWp', location: 'TP. Hồ Chí Minh' },
  { capacity: '10,08 kWp', location: 'TP. Hồ Chí Minh' },
  { capacity: '8,82 kWp', location: 'Bắc Giang' },
  { capacity: '7,56 kWp', location: 'Bình Dương' },
]

/**
 * Two published economics examples. The four figures the brief asks
 * for — investment, yearly saving, payback, long-term value — are all
 * either printed in the flyers or derived from two printed figures of
 * the same example. The derivation is spelled out in each `note`.
 *
 * Example A (5 kWp):
 *   - reference investment 15.042 VND/W × 5.000 W = 75.210.000 VND
 *   - monthly saving 1.766.500 × 12 = 21.198.000 VND/year
 *   - 75.210.000 / 21.198.000 = 3,55 years ≈ the published 3,5 years
 *   - 1.766.500 × 12 × 30 = 635.940.000 VND over 30 years
 *     (the flyer prints "6,38" next to a 30-year figure; 6,38 × 100
 *     million matches this arithmetic, not 6,38 billion — so the page
 *     states ~636 triệu, not 6,38 tỷ).
 * Example B (10 kWp + 16 kWh): all four figures are printed.
 */
export interface SolaHomeEconomicsExample {
  id: string
  /** Tab label. */
  label: string
  headline: string
  system: string
  investment: string
  annualSaving: string
  payback: string
  horizonLabel: string
  horizonValue: string
  note: string
}

export const solaHomeEconomicsExamples: SolaHomeEconomicsExample[] = [
  {
    id: 'grid-5kwp',
    label: '5 kWp · hòa lưới',
    headline: 'Hệ 5 kWp — hoàn vốn nhanh trên mái nhà',
    system: '5 kWp · không pin lưu trữ',
    investment: '75,2 triệu ₫',
    annualSaving: '~21,2 triệu ₫/năm',
    payback: '~3,5 năm',
    horizonLabel: 'Tổng tiết kiệm 30 năm',
    horizonValue: '~636 triệu ₫',
    note: 'Đầu tư tham chiếu 15.042 ₫/W (công bố cho hệ 5 kWp tại TP. Hồ Chí Minh) × 5.000 W. Tiết kiệm tháng 1.766.500 ₫ theo bảng sản lượng đã công bố; tổng 30 năm = tiết kiệm tháng × 12 × 30, chưa tính suy giảm tấm pin.',
  },
  {
    id: 'hybrid-10kwp',
    label: '10 kWp + pin 16 kWh',
    headline: 'Hệ 10 kWp + pin 16 kWh — dùng điện cả ngày lẫn đêm',
    system: '10 kWp · hybrid 1 pha · pin 16 kWh',
    investment: '153,7 triệu ₫',
    annualSaving: '~47 triệu ₫/năm',
    payback: '~3,3 năm',
    horizonLabel: 'Dòng tiền 25 năm',
    horizonValue: '~927 triệu ₫',
    note: 'Số liệu công bố cho hệ 10 kWp + lưu trữ 16 kWh tại TP. Hồ Chí Minh, 1.500 giờ nắng/năm và tỷ lệ tự tiêu thụ 95%. Dòng tiền đã bao gồm vận hành, bảo trì và thay thế linh kiện vào năm thứ 15.',
  },
]

/**
 * Certifications published on the VN product pages.
 *
 * The marks are the manufacturer's own files — the same ones the
 * SolaMate page shows. They are product-line independent (a TÜV / CE /
 * EVN mark says nothing about which housing the module lives in), so
 * the SolaHome page can show them too. The files still live under
 * `/images/solamate/` because that is where they were supplied;
 * moving them to a shared folder is a packaging tidy-up, not a
 * content change.
 *
 * The Red Dot design award is deliberately NOT here: that award belongs
 * to the SolaMate product, not to SolaHome.
 */
export const solaHomeCertifications: {
  name: string
  imagePath: string
  imageAlt: string
}[] = [
  {
    name: 'TÜV Rheinland',
    imagePath: '/images/solamate/cert-tuv-rheinland.png',
    imageAlt: 'Chứng nhận TÜV Rheinland',
  },
  {
    name: 'CE',
    imagePath: '/images/solamate/cert-ce.jpg',
    imageAlt: 'Chứng nhận CE',
  },
  {
    name: 'EVN Approved',
    imagePath: '/images/solamate/cert-evn.jpg',
    imageAlt: 'Chứng nhận EVN Approved',
  },
]

/** Warranty terms. */
export const solaHomeWarranty: { label: string; value: string }[] = [
  { label: 'Pin LiFePO₄', value: '10 năm' },
  { label: 'Hiệu suất tấm pin', value: '30 năm' },
  { label: 'Khung thép chống ăn mòn', value: '30 năm' },
  { label: 'Biến tần hybrid', value: '10 năm' },
]

/**
 * FAQ — trimmed to the eight questions that actually change a purchase
 * decision. The inverter-efficiency and install-quality answers were
 * folded into the product/spec sections above.
 */
export const solaHomeFaqs: { q: string; a: string }[] = [
  {
    q: 'SolaHome là gì?',
    a: 'SolaHome là hệ điện mặt trời lắp trên mái nhà cho biệt thự và nhà phố, gồm tấm pin N-type, biến tần hybrid và hệ lưu trữ năng lượng — mục tiêu là cấp điện liên tục 24/7 cho cả gia đình.',
  },
  {
    q: 'SolaRoof và SolaLoft khác nhau thế nào?',
    a: 'SolaRoof lắp trực tiếp lên mái hiện có, giữ nguyên cấu trúc mái. SolaLoft dựng khung thép kiến trúc cao tầng 2,7–2,8 m, tấm pin nghiêng 5° tối ưu bức xạ, đồng thời tạo thêm không gian sống trên mái và chỗ đặt pin tích hợp. Cùng một gói, SolaLoft có chi phí cao hơn SolaRoof vì phần khung thép và công trình kiến trúc.',
  },
  {
    q: 'Hệ thống lưu trữ của SolaHome có những lựa chọn dung lượng nào?',
    a: 'Hai phương án bổ sung pin: mô-đun LiFePO₄ xếp chồng 5 kWh (mở rộng lên 10 kWh hoặc 20 kWh) đi kèm biến tần hybrid 1 pha SWH 3-6KH/KL-S1; hoặc pin All-in-one 14,3 kWh đi kèm biến tần hybrid 3 pha SWH 5-15KH-T1. Cả hai phương án đều bảo hành 10 năm.',
  },
  {
    q: 'Tôi có duy trì được nguồn điện khi mất điện lưới không?',
    a: 'Có, nếu chọn phương án có pin lưu trữ. Chế độ dự phòng tự động chuyển sang pin và duy trì các thiết bị thiết yếu — tủ lạnh, đèn, quạt; với SolaLoft thì giữ được cả điều hòa và thiết bị đang chạy.',
  },
  {
    q: 'Hệ thống tối ưu hóa hóa đơn điện ra sao?',
    a: 'Hệ thống ưu tiên tự tiêu thụ điện mặt trời, sạc pin bằng phần dư và xả pin vào khung giờ cần dùng. Bộ biến tần hybrid đạt hiệu suất tối đa 98,6% và vẫn sạc được pin khi ánh sáng yếu.',
  },
  {
    q: 'Bảo hành các thiết bị chính trong bao lâu?',
    a: 'Pin LiFePO₄: 10 năm. Hiệu suất tấm pin: 30 năm. Khung thép chống ăn mòn: 30 năm. Biến tần hybrid: 10 năm. SolaHome cũng có 3 năm bảo trì vận hành miễn phí đầu tiên.',
  },
  {
    q: 'Tôi có quản lý được toàn bộ hệ năng lượng của gia đình từ xa không?',
    a: 'Có, qua SKYWORTH Smart App — bao gồm điện mặt trời, pin, bơm nhiệt và trạm sạc xe điện, với dữ liệu phát điện, tiêu thụ và lưu trữ theo thời gian thực.',
  },
  {
    q: 'Tôi có cần xin phép điện lưới không?',
    a: 'Với công suất dưới 15 kW, hệ thống không cần xin phép điện lưới. Việc kết nối hộp phân phối AC theo quy định địa phương vẫn được kỹ thuật viên xử lý trong quá trình thi công.',
  },
]
