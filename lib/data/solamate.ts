/**
 * SolaMate — balcony & mobile PV (Vietnam).
 *
 * Product line: `SWM` — a plug-and-play balcony power station that mounts
 * on a railing, over a window as a sun/awning, or on the ground.
 *
 * Sources (official Skyworth VN material, Nov 2026):
 *   - `docs/Vietnam SolaMate Flyer_VN.pdf`
 *   - https://vn.skyworth-pv.com/residential/solamate/sola-mate
 *
 * Every price, output figure and warranty term below comes from those two
 * sources — nothing here is estimated. Numbers that depend on site
 * conditions (yield, tariff, install cost) carry the assumption they were
 * published with, in the `assumption` fields.
 */

/**
 * Lucide icon key for one load row — the same idea as the NG template's
 * `LoadApplianceIconKey`, kept local so the VN page does not depend on
 * the NG data layer.
 */
export type SolaMateLoadIconKey =
  | 'light'
  | 'tv'
  | 'refrigerator'
  | 'ac'
  | 'washer'
  | 'fan'
  | 'pc'
  | 'ev'

/**
 * One load row of the "TẢI & CHẠY" strip.
 *
 * The figures convert the package's published daily yield
 * (`dailyOutput`) into something a household can picture: runtime for
 * the fridge and the air-conditioner, driving range for the EV.
 * Reference loads — fridge 150 W, AC 800 W, EV 15 kWh/100 km — are the
 * ones printed under the package grid on the page.
 */
export interface SolaMateLoad {
  icon: SolaMateLoadIconKey
  /** Device name as printed, e.g. "1 tủ lạnh". */
  device: string
  /** Converted figure — a runtime ("~4,5 giờ") or a range ("~24 km"). */
  value: string
}

/** The two power ratings on sale. */
export interface SolaMatePackage {
  id: string
  name: string
  /** Short badge — "Gói Phổ Biến" etc. */
  badge?: string
  /** Rated AC output of the micro-inverter, W. */
  power: string
  /** PV modules the package ships with (2 × 450 Wp for the 900 Wp
   *  system, 4 × 450 Wp for the 1800 Wp one). */
  modules: string
  /** Total DC nameplate, Wp. */
  systemPower: string
  /** Micro-inverter model range. */
  inverter: string
  /** Average daily yield — split so the card can set the figure large
   *  and the unit small. */
  dailyOutput: { value: string; unit: string }
  /** Estimated monthly saving — same split as `dailyOutput`. */
  monthlySaving: { value: string; unit: string }
  /** One-line positioning used on the card. */
  summary: string
  /** Daily yield converted into fridge / AC runtime and EV range. */
  runs: SolaMateLoad[]
  /** Kit photo — the header band of the package card. */
  imagePath: string
  imageAlt: string
}

export const solaMatePackages: SolaMatePackage[] = [
  {
    id: 'swm800',
    name: 'SolaMate 800',
    badge: 'Gói Cơ Bản',
    power: '800 W',
    modules: '2 module',
    systemPower: '900 Wp',
    inverter: 'Micro-inverter 800 W',
    dailyOutput: { value: '~3,6', unit: 'kWh/ngày' },
    monthlySaving: { value: '~230.278', unit: 'VND/tháng' },
    summary:
      'Bắt đầu với các thiết bị nhỏ: đèn, tủ lạnh, Wi-Fi — lắp trong 60 phút, không khoan tường.',
    // 3,6 kWh/ngày: 150 W × 24 h = 3,6 kWh · 800 W × ~4,5 h = 3,6 kWh ·
    // 3,6 kWh ÷ 15 kWh/100 km ≈ 24 km.
    runs: [
      { icon: 'refrigerator', device: '1 tủ lạnh', value: '24 giờ' },
      { icon: 'ac', device: '1 máy điều hòa', value: '~4,5 giờ' },
      { icon: 'ev', device: 'Xe điện', value: '~24 km' },
    ],
    imagePath: '/images/solamate/800w.webp',
    imageAlt:
      'Bộ sản phẩm SolaMate 800: hai tấm pin toàn đen, thanh khung nhôm, ngàm kẹp và micro-inverter',
  },
  {
    id: 'swm1600',
    name: 'SolaMate 1600',
    badge: 'Gói Phổ Biến',
    power: '1600 W',
    modules: '4 module',
    systemPower: '1800 Wp',
    inverter: 'Micro-inverter 1600–2000 W',
    dailyOutput: { value: '~7,2', unit: 'kWh/ngày' },
    monthlySaving: { value: '~460.557', unit: 'VND/tháng' },
    summary:
      'Đủ sức cho điều hòa và thiết bị lớn — vẫn gọn nhẹ, vẫn tự lắp trong 60 phút.',
    // 7,2 kWh/ngày: 2 × 150 W × 24 h = 7,2 kWh · 800 W × ~9 h = 7,2 kWh ·
    // 7,2 kWh ÷ 15 kWh/100 km ≈ 48 km.
    runs: [
      { icon: 'refrigerator', device: '2 tủ lạnh', value: '24 giờ' },
      { icon: 'ac', device: '1 máy điều hòa', value: '~9 giờ' },
      { icon: 'ev', device: 'Xe điện', value: '~48 km' },
    ],
    imagePath: '/images/solamate/1600w.webp',
    imageAlt:
      'Bộ sản phẩm SolaMate 1600: bốn tấm pin toàn đen, thanh khung nhôm, ngàm kẹp, micro-inverter và dây cáp',
  },
]

/**
 * The three installation scenarios — the "3 giải pháp" of the source page.
 *
 * The three mounting types and the Vietnamese names used across the
 * site:
 *   - `-R` → **Lan can**   (railing clamp)
 *   - `-S` → **Mái che**   (awning / canopy over a window or porch)
 *   - `-G` → **Cắm đất**   (ground-standing unit)
 *
 * The `id` keys stay `balcony / awning / ground` — they are the
 * internal handle for the model codes, not the customer-facing name.
 */
export interface SolaMateScenario {
  id: 'balcony' | 'awning' | 'ground'
  name: string
  /** Where it fits. */
  fits: string
  /** Installation photo from the official VN product page. */
  imagePath: string
  imageAlt: string
  bullets: string[]
}

export const solaMateScenarios: SolaMateScenario[] = [
  {
    id: 'balcony',
    name: 'Lan can',
    fits: 'Chung cư, nhà phố và ban công có lan can.',
    imagePath: '/images/solamate/scene-balcony.webp',
    imageAlt:
      'Tấm pin SolaMate kẹp vào lan can ban công của một căn hộ',
    bullets: [
      'Ngàm kẹp kép bằng thép không gỉ, kẹp vào lan can',
      'Thiết kế chống rơi — gió lớn vẫn giữ chắc',
      'Không khoan tường, không ảnh hưởng kết cấu công trình',
      'Hỗ trợ lắp DIY nhanh chóng',
    ],
  },
  {
    id: 'awning',
    name: 'Mái che',
    fits: 'Cửa sổ, hiên nhà và mặt tiền cửa hàng.',
    imagePath: '/images/solamate/scene-awning.webp',
    imageAlt:
      'Tấm pin SolaMate dùng làm mái che nắng trước cửa sổ và hiên nhà',
    bullets: [
      'Vừa che nắng, che mưa, vừa phát điện',
      'Khung tam giác chịu gió bão cấp 12',
      'Thiết kế thẩm mỹ cao, đồng bộ với ngoại thất',
      'Mở rộng theo chiều ngang cửa sổ',
    ],
  },
  {
    id: 'ground',
    name: 'Cắm đất',
    fits: 'Sân thượng, sân vườn và các bãi đỗ xe.',
    imagePath: '/images/solamate/scene-ground.webp',
    imageAlt:
      'Hệ SolaMate đặt trên mặt đất bên bờ hồ bơi, có thể di chuyển theo',
    bullets: [
      'Chân đế chịu mưa nắng, đặt trực tiếp trên nền',
      'Có thể mang theo khi cắm trại, dã ngoại',
      'Di chuyển và lắp đặt thuận tiện',
      'Điều chỉnh 4 góc độ: 25°, 30°, 35°, 40°',
    ],
  },
]

/** The 5-step install flow. */
export interface SolaMateStep {
  index: string
  title: string
  body: string
  /** Photo for the step card. */
  imagePath: string
  imageAlt: string
  /**
   * How the photo fills its card band: `cover` for the scene photos,
   * `contain` for the product cut-outs (which carry their own white
   * background and must not be cropped).
   */
  fit: 'cover' | 'contain'
}

export const solaMateInstallSteps: SolaMateStep[] = [
  {
    index: '01',
    title: 'Lắp khung',
    body: 'Lắp các thanh khung và ngàm kẹp theo hướng dẫn đi kèm trong hộp — không cần dụng cụ phức tạp.',
    imagePath: '/images/installation-01.webp',
    imageAlt:
      'Hộp SolaMate mở ra: tấm pin nằm trong khay, bên cạnh là thanh khung, ngàm kẹp, cáp, micro-inverter và hướng dẫn lắp ráp',
    fit: 'contain',
  },
  {
    index: '02',
    title: 'Lắp đặt',
    body: 'Treo lên lan can ban công, chốt vào khung cửa sổ hoặc đặt trên sàn/sân thượng.',
    imagePath: '/images/installation-02.webp',
    imageAlt:
      'Đầu nối MC4 trên cáp của tấm pin SolaMate được ghép vào nhau, phía sau là ổ cắm tường',
    fit: 'cover',
  },
  {
    index: '03',
    title: 'Căn chỉnh',
    body: 'Chọn góc nghiêng 25°, 30°, 35° hoặc 40° để bắt nắng tốt nhất theo hướng ban công.',
    imagePath: '/images/solamate/feature-adjustable.webp',
    imageAlt: 'Các góc nghiêng có thể điều chỉnh của khung SolaMate',
    fit: 'contain',
  },
  {
    index: '04',
    title: 'Kết nối',
    body: 'Cắm dây nguồn vào ổ điện trong nhà. Hệ thống tự đồng bộ với lưới.',
    imagePath: '/images/installation-04.webp',
    imageAlt:
      'Vặn chặt giá đỡ SolaMate lên lan can kim loại bằng khoan điện, phía sau là tấm pin',
    fit: 'cover',
  },
  {
    index: '05',
    title: 'Vận hành',
    body: 'Tải SKYWORTH Smart App, kết nối Wi-Fi và theo dõi sản lượng, tiêu thụ và tiền tiết kiệm.',
    imagePath: '/images/installation-05.webp',
    imageAlt:
      'Màn hình ứng dụng SKYWORTH Smart App hiển thị sơ đồ dòng năng lượng, tỷ lệ tự dùng và tổng tiết kiệm',
    fit: 'contain',
  },
]

/**
 * The pain points the source page opens with — each paired with the
 * photo that answers it and one line of the answer.
 */
/**
 * The comic strip that runs beside the "VÌ SAO BẠN ĐANG PHÂN VÂN" heading:
 * eight frames that alternate — odd frames state a worry, even frames
 * answer it.
 *
 *   01 pain → 02 solution → 03 pain → 04 solution → …
 *
 * Each pair is a "before / after": the pain frame carries a `before-N`
 * illustration, the solution frame beside it carries the matching
 * `after-N` one. The line-art `icon` stays as the fallback for a frame
 * that has no artwork yet.
 */
export type SolaMateComicIcon = 'bill' | 'panel' | 'storm' | 'permit'

export interface SolaMateComicFrame {
  kind: 'pain' | 'solution'
  /** Line-art fallback, used only when the frame has no artwork. */
  icon?: SolaMateComicIcon
  /** Frame headline — the worry, or what Solavita does about it. */
  title: string
  /** One line of supporting copy. */
  body: string
  /** Frame artwork — `before-N` on pain frames, `after-N` on the answer. */
  imagePath?: string
  imageAlt?: string
}

export const solaMateComicFrames: SolaMateComicFrame[] = [
  {
    kind: 'pain',
    icon: 'bill',
    title: 'Hóa đơn điện "nhảy múa" mỗi tháng mùa nóng',
    body: 'Giá điện bậc cao, tiền điện vọt lên đúng lúc cả nhà bật điều hòa.',
    imagePath: '/images/before-1.webp',
    imageAlt:
      'Nhân vật SolaMate ôm đầu bên hóa đơn điện tăng vọt trong phòng có điều hòa',
  },
  {
    kind: 'solution',
    title: 'Sản lượng dùng ngay trong nhà',
    body: 'Điện sinh ra được dùng ngay trong nhà — không phụ thuộc khung giờ giá điện.',
    imagePath: '/images/after-1.webp',
    imageAlt:
      'Nhân vật SolaMate vui vẻ cầm hóa đơn điện đi xuống, tấm pin đã lắp ngoài ban công',
  },
  {
    kind: 'pain',
    icon: 'panel',
    title: 'Lo lắng giàn pin rơi vỡ, mất an toàn cho gia đình',
    body: 'Tấm pin treo cao ngoài ban công, gió lớn là rơi — nguy hiểm cho người bên dưới.',
    imagePath: '/images/before-2.webp',
    imageAlt:
      'Tấm pin rung lắc trên lan can ban công, nhân vật SolaMate lo lắng nhìn xuống',
  },
  {
    kind: 'solution',
    title: 'Kẹp chặt, không khoan tường',
    body: 'Ngàm kẹp kép bằng thép không gỉ, chịu gió bão cấp 12 — không khoan tường.',
    imagePath: '/images/after-2.webp',
    imageAlt:
      'Nhân vật SolaMate giơ tay khen, cận cảnh ngàm kẹp thép giữ tấm pin vào lan can',
  },
  {
    kind: 'pain',
    icon: 'storm',
    title: 'Lo lắng chập cháy điện khi trời mưa',
    body: 'Thiết bị ngoài trời, mưa gió thấp vào — mà dây điện lại ở ngay chỗ đó.',
    imagePath: '/images/before-3.webp',
    imageAlt:
      'Trời mưa bão, nhân vật SolaMate lo lắng về hộp đấu dây ngoài trời bị nước vào',
  },
  {
    kind: 'solution',
    title: 'Kết nối kín, chống dòng ngược',
    body: 'Tấm pin IP68, micro-inverter IP67 và thiết bị Zero-export trên mọi model.',
    imagePath: '/images/after-3.webp',
    imageAlt:
      'Trong mưa bão, hộp thiết bị của hệ thống vẫn kín nước và được nhân vật SolaMate khen',
  },
  {
    kind: 'pain',
    icon: 'permit',
    title: 'Ngại thi công rườm rà, đục phá ban công',
    body: 'Sợ phải khoan tường, đi dây lằng nhằng và mất nhiều ngày thi công.',
    imagePath: '/images/before-4.webp',
    imageAlt:
      'Nhân vật SolaMate ngập trong hồ sơ lắp đặt, phê duyệt và giấy phép',
  },
  {
    kind: 'solution',
    title: 'Cắm vào ổ là chạy',
    body: 'Không khoan tường, không đục phá — cắm vào ổ điện trong nhà là dùng.',
    imagePath: '/images/after-4.webp',
    imageAlt:
      'Nhân vật SolaMate khoe tờ hướng dẫn "Lắp đặt đơn giản" và ổ cắm điện đã có phích',
  },
]

/** Technical specs that apply to every model. */
export const solaMateSpecs: { label: string; value: string }[] = [
  { label: 'Micro-inverter', value: 'IP67 — chống nước, chống bụi' },
  { label: 'Tấm pin', value: 'IP68 — chịu mưa, chịu nóng' },
  { label: 'Khả năng chịu gió bão', value: 'Cấp 12' },
  { label: 'Thiết bị Zero-export', value: 'Có trên mọi model' },
  { label: 'Bảo hành micro-inverter', value: '10 năm' },
  { label: 'Bảo hành hiệu suất tấm pin', value: '30 năm' },
  { label: 'Bảo hành khung thép không gỉ', value: '25 năm' },
  { label: 'Tuổi thọ hệ thống', value: 'Đến 30 năm' },
]

/**
 * The 450 Wp all-black module the packages ship with.
 *
 * Every figure here is already published in this repo — the module entry
 * in `components/ProductDetails.tsx` (all-black 48-cell n-Type, 440–450 Wp,
 * 22,5 %, bifaciality 80 % ± 5 %, ≤1 % / 0,4 % annual degradation) and
 * `solaMateSpecs` above. Warranty terms are deliberately *not* repeated:
 * the specification table further down the page already carries them.
 */
export interface SolaMateModuleFeature {
  title: string
  body: string
}

export const solaMateModule = {
  power: '450',
  powerUnit: 'Wp',
  imagePath: '/images/product-module-1.webp',
  imageAlt: 'Tấm pin n-Type toàn đen 48 ô của SolaMate',
  body: 'Gói 800 W dùng 2 tấm, gói 1600 W dùng 4 tấm — cùng một loại pin n-Type toàn đen 48 ô, kính kép.',
  features: [
    {
      title: 'Chống PID toàn vòng đời',
      body: 'Không suy giảm công suất do hiệu ứng PID trong suốt thời gian sử dụng.',
    },
    {
      title: 'Hấp thụ tốt khi ánh sáng yếu',
      body: 'Vẫn phát điện khi trời nhiều mây, vào sáng sớm và chiều muộn.',
    },
    {
      title: 'Kết cấu kính kép',
      body: 'Hai lớp kính chịu lực; công suất giảm không quá 1% năm đầu, sau đó 0,4%/năm.',
    },
    {
      title: 'Hiệu suất chuyển đổi tới 22,5%',
      body: 'Tế bào n-Type đơn tinh thể, 48 ô toàn đen, không viền bạc.',
    },
    {
      title: 'Sản lượng hai mặt',
      body: 'Hệ số hai mặt 80% ± 5%, tận dụng ánh sáng phản xạ để thêm tới 10% sản lượng.',
    },
    {
      title: 'Chịu môi trường khắc nghiệt',
      body: 'Chống nước IP68, chịu nóng và chịu tải gió khi treo ngoài ban công.',
    },
  ] satisfies SolaMateModuleFeature[],
}

/** Certifications published on the source page. */
export const solaMateCertifications: {
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
    name: 'Red Dot Design',
    imagePath: '/images/solamate/cert-reddot.jpg',
    imageAlt: 'Giải thưởng Red Dot Design',
  },
  {
    name: 'EVN Approved',
    imagePath: '/images/solamate/cert-evn.jpg',
    imageAlt: 'Chứng nhận EVN Approved',
  },
]

/** Payback assumptions published with the ROI block. */
export interface SolaMateRoi {
  headline: string
  /**
   * The emphasised tail of `headline`. Rendered as the gradient half of
   * the section H2, matching the site-wide two-tone heading treatment.
   */
  headlineHighlight: string
  /** The assumption inputs behind the curve (tariff, saving rate, …). */
  rows: { label: string; value: string }[]
  /**
   * Cumulative savings by year, in triệu VND — the series the HOÀN VỐN
   * chart plots. Values are the published figures; the year-0 point is
   * the origin (nothing saved yet).
   */
  series: { year: number; value: number }[]
  /** Initial investment, triệu VND — the breakeven line on the chart. */
  investment: number
  /** Year the initial investment is paid back. */
  paybackYears: number
  assumption: string
}

export const solaMateRoi: SolaMateRoi = {
  headline: 'Cắt giảm hóa đơn điện —',
  headlineHighlight: 'hoàn vốn tối ưu',
  rows: [
    { label: 'Giá điện lưới EVN bậc cao', value: '~3.393 VND/kWh' },
    { label: 'Giá sinh hoạt bậc 6', value: '~380 VND/kWh' },
    { label: 'Mức tiết kiệm', value: '~80%' },
  ],
  series: [
    { year: 0, value: 0 },
    { year: 5, value: 27.6 },
    { year: 10, value: 55.3 },
    { year: 15, value: 110.5 },
    { year: 30, value: 165 },
  ],
  investment: 30,
  paybackYears: 5.4,
  assumption:
    'Tính theo hệ 1-to-4 (1800 W) tại Việt Nam, sản lượng ~7,2 kWh/ngày tại TP. Hồ Chí Minh. Thời gian hoàn vốn thực tế còn phụ thuộc nắng, hướng ban công và mức tiêu thụ; chi phí lắp đặt có thể thay đổi theo khu vực.',
}

/** FAQ — the six entries published on the source page. */
export const solaMateFaqs: { q: string; a: string }[] = [
  {
    q: 'SolaMate là gì?',
    a: 'SolaMate là trạm điện mặt trời ban công dạng all-in-one, thiết kế tối giản theo phong cách Bauhaus. Hệ thống tạo điện cho ban công chung cư, cửa sổ và sân vườn; lắp trong khoảng 60 phút, không khoan tường.',
  },
  {
    q: 'Tự lắp đặt trong bao lâu?',
    a: 'Sản phẩm hỗ trợ lắp DIY. Toàn bộ quá trình lắp ráp và kết nối mất khoảng 60 phút, với bộ khung và ngàm kẹp đi kèm hướng dẫn lắp ráp trong hộp.',
  },
  {
    q: 'SolaMate lắp ở đâu được?',
    a: 'Ba phương án: lan can, mái che cửa sổ và cắm đất. Thiết kế gập, mô-đun hóa giúp thích nghi với nhiều kiểu nhà.',
  },
  {
    q: 'Zero-export là gì?',
    a: 'Zero-export là thiết bị có trên mọi model: điện sinh ra được ưu tiên dùng ngay trong nhà và không phát ngược lên lưới. Việc đấu nối điện được thực hiện theo quy định an toàn tại địa phương.',
  },
  {
    q: 'Theo dõi sản lượng bằng cách nào?',
    a: 'Ứng dụng SKYWORTH Smart App cung cấp dữ liệu 24/7 về sản lượng, trạng thái hệ thống và số tiền tiết kiệm theo thời gian thực.',
  },
  {
    q: 'Hệ thống có cần đấu nối điện lưới không?',
    a: 'Tại Việt Nam, hệ thống phải kết nối cố định với hộp phân phối điện AC theo quy định địa phương — đây là yêu cầu an toàn bắt buộc, không phải hạn chế của sản phẩm.',
  },
]
