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

/** The two power ratings on sale. */
export interface SolaMatePackage {
  id: string
  name: string
  /** Short badge — "Gói Phổ Biến" etc. */
  badge?: string
  /** Rated AC output of the micro-inverter, W. */
  power: string
  /** Retail price, VND (published launch price). */
  price: string
  /** Panel count range this package covers. */
  panels: string
  /** Total DC nameplate, Wp. */
  systemPower: string
  /** Micro-inverter model range. */
  inverter: string
  /** Average daily yield, kWh. */
  dailyOutput: string
  /** Estimated monthly saving, VND. */
  monthlySaving: string
  /** Model codes per installation scenario. */
  models: { balcony: string; awning: string; ground: string }
  /** One-line positioning used on the card. */
  summary: string
  /** What the system can run, in the publisher's own example set. */
  runs: { device: string; hours: string }[]
}

export const solaMatePackages: SolaMatePackage[] = [
  {
    id: 'swm800',
    name: 'SolaMate 800',
    badge: 'Gói Cơ Bản',
    power: '800 W',
    price: '12.999.000 VND',
    panels: '1–2 tấm pin',
    systemPower: '900 Wp',
    inverter: 'Micro-inverter 800 W',
    dailyOutput: '~3,6 kWh/ngày',
    monthlySaving: '~230.278 VND/tháng',
    models: {
      balcony: 'SWM800-R',
      awning: 'SWM800-S',
      ground: 'SWM800-G',
    },
    summary:
      'Bắt đầu với điện thiết bị nhỏ: đèn, tủ lạnh, Wi-Fi — lắp trong 15 phút, không cần đào lắp.',
    runs: [
      { device: '6 bóng đèn', hours: '15 giờ' },
      { device: '2 chiếc TV', hours: '7 giờ' },
      { device: '1 tủ lạnh', hours: '20 giờ' },
    ],
  },
  {
    id: 'swm1600',
    name: 'SolaMate 1600',
    badge: 'Gói Phổ Biến',
    power: '1600 W',
    price: '30.000.000 VND',
    panels: '1–4 tấm pin',
    systemPower: '1800 Wp',
    inverter: 'Micro-inverter 1600–2000 W',
    dailyOutput: '~7,2 kWh/ngày',
    monthlySaving: '~460.557 VND/tháng',
    models: {
      balcony: 'SWM1600-R',
      awning: 'SWM1600-S',
      ground: 'SWM1600-G',
    },
    summary:
      'Đủ sức cho điều hòa và thiết bị lớn — vẫn gọn nhẹ, vẫn tự lắp trong 15 phút.',
    runs: [
      { device: '2 máy điều hòa', hours: '8 giờ' },
      { device: '2 tủ lạnh', hours: '16 giờ' },
      { device: '6 bóng đèn', hours: '15 giờ' },
    ],
  },
]

/** The three installation scenarios — the "3 giải pháp" of the source page. */
export interface SolaMateScenario {
  id: 'balcony' | 'awning' | 'ground'
  /** Model suffix, e.g. "-R". */
  suffix: string
  name: string
  /** Where it fits. */
  fits: string
  bullets: string[]
}

export const solaMateScenarios: SolaMateScenario[] = [
  {
    id: 'balcony',
    suffix: '-R',
    name: 'Ban công',
    fits: 'Chung cư, nhà phố và ban công có lan can.',
    bullets: [
      'Ngàm kẹp kép bằng thép không gỉ, kẹp vào lan can',
      'Thiết kế chống rơi — gió lớn vẫn giữ chắc',
      'Không khoan tường, không ảnh hưởng kết cấu building',
      'Hỗ trợ lắp DIY nhanh chóng',
    ],
  },
  {
    id: 'awning',
    suffix: '-S',
    name: 'Che nắng',
    fits: 'Cửa sổ, hiên nhà và mặt tiền cửa hàng.',
    bullets: [
      'Vừa che nắng, che mưa, vừa phát điện',
      'Khung tam giác chịu gió bão cấp 12',
      'Thiết kế thẩm mỹ cao, đồng bộ với ngoại thất',
      'Mở rộng theo chiều ngang cửa sổ',
    ],
  },
  {
    id: 'ground',
    suffix: '-G',
    name: 'Mặt đất',
    fits: 'Sân thượng, sân vườn và các bãi đỗ xe.',
    bullets: [
      'Chân đế chịu thời tiết, đặt trực tiếp xuống nền',
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
}

export const solaMateInstallSteps: SolaMateStep[] = [
  {
    index: '01',
    title: 'Mở khung',
    body: 'Bộ giá đỡ lắp ráp sẵn từ nhà máy — tháo ra, không cần dụng cụ phức tạp.',
  },
  {
    index: '02',
    title: 'Lắp đặt',
    body: 'Treo lên lan can ban công, chốt vào khung cửa sổ hoặc đặt trên sàn/sân thượng.',
  },
  {
    index: '03',
    title: 'Căn chỉnh',
    body: 'Chọn góc nghiêng 25°, 30°, 35° hoặc 40° để bắt nắng tốt nhất theo hướng ban công.',
  },
  {
    index: '04',
    title: 'Kết nối',
    body: 'Cắm dây nguồn vào ổ điện trong nhà. Hệ thống tự đồng bộ với lưới.',
  },
  {
    index: '05',
    title: 'Vận hành',
    body: 'Tải SKYWORTH Smart App, kết nối Wi-Fi và theo dõi sản lượng, tiêu thụ và tiền tiết kiệm.',
  },
]

/** The pain points the source page opens with. */
export const solaMatePainPoints: string[] = [
  'Hóa đơn điện "nhảy múa" mỗi tháng mùa nóng',
  'Lo lắng giàn pin rơi vỡ, mất an toàn cho gia đình',
  'Lo lắng chập cháy điện khi trời mưa',
  'Ngại thủ tục xin phép lắp đặt rườm rà',
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

/** Certifications published on the source page. */
export const solaMateCertifications: string[] = [
  'TÜV Rheinland',
  'CE',
  'Red Dot Design',
  'EVN Approved',
]

/** Payback assumptions published with the ROI block. */
export interface SolaMateRoi {
  headline: string
  rows: { label: string; value: string }[]
  /** Cumulative profit by year, VND. */
  cumulative: { year: string; value: string }[]
  assumption: string
}

export const solaMateRoi: SolaMateRoi = {
  headline: 'Cắt giảm hóa đơn điện — hoàn vốn tối ưu',
  rows: [
    { label: 'Giá điện lưới EVN bậc cao', value: '~3.393 VND/kWh' },
    { label: 'Giá sinh hoạt bậc 6', value: '~380 VND/kWh' },
    { label: 'Mức tiết kiệm', value: '~80%' },
    { label: 'Đầu tư ban đầu', value: '~30 triệu VND' },
    { label: 'Thời gian hoàn vốn', value: '5,4 năm' },
  ],
  cumulative: [
    { year: 'Năm 5', value: '~27,6 triệu VND' },
    { year: 'Năm 10', value: '~55,3 triệu VND' },
    { year: 'Năm 15', value: '~110,5 triệu VND' },
    { year: 'Năm 30', value: '~165 triệu VND' },
  ],
  assumption:
    'Tính theo hệ 1-to-4 (1800 W) tại Việt Nam, sản lượng ~7,2 kWh/ngày tại TP. Hồ Chí Minh. Thời gian hoàn vốn thực tế còn phụ thuộc nắng, hướng ban công và mức tiêu thụ; chi phí lắp đặt có thể thay đổi theo khu vực.',
}

/** FAQ — the six entries published on the source page. */
export const solaMateFaqs: { q: string; a: string }[] = [
  {
    q: 'SolaMate là gì?',
    a: 'SolaMate là trạm điện mặt trời ban công "all-in-one" theo phong cách tối giản Bauhaus. Hệ thống tạo điện sạch cho ban công chung cư, cửa sổ, sân vườn và các không gian sống khác — không cần đào lắp, không cần xin phép lắp đặt điện.',
  },
  {
    q: 'Tự lắp đặt trong bao lâu?',
    a: 'Sản phẩm hỗ trợ lắp DIY. Toàn bộ quá trình lắp ráp và kết nối mất khoảng 15 phút với bộ khung lắp ráp sẵn từ nhà máy.',
  },
  {
    q: 'SolaMate lắp ở đâu được?',
    a: 'Ba phương án: lan can ban công (model -R), che nắng cửa sổ (model -S) và mặt đất / sân thượng (model -G). Thiết kế gập, mô-đun hóa giúp thích nghi với nhiều kiểu nhà.',
  },
  {
    q: 'Zero-export là gì?',
    a: 'Đây là thiết bị tiêu chuẩn đi kèm mọi model: điện sinh ra được ưu tiên dùng ngay trong nhà và không phát ngược lên lưới. Hệ thống hỗ trợ an toàn điện lưới và tuân thủ quy định địa phương mà không cần thủ tục phức tạp.',
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
