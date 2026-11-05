/**
 * SolaHome — rooftop PV for villas & houses (Vietnam).
 *
 * Two installation types:
 *   - SolaRoof — panels mounted straight onto the existing roof.
 *   - SolaLoft — panels on a 2.7–2.8 m architectural steel frame, turning
 *     the roof into a usable "sky loft" / garden.
 *
 * Four packages: 5 kWp 1-phase, 10 kWp 1-phase, 10 kWp 3-phase,
 * 15 kWp 3-phase. Each package has a SolaRoof and a SolaLoft price
 * (the loft frame costs more to build), and two optional backup
 * solutions that pair a battery with a hybrid inverter.
 *
 * Sources (official Skyworth VN / CN material, Nov 2026):
 *   - `docs/Vietnam SolaRoof & SolaLoft Flyer_CN.pdf`
 *   - `docs/Vietnam SolaHome Integrated Solar System Flyer_VN 20260911.pdf`
 *   - `docs/Vietnam SolaHome Residential Flyer V2_VN 20260914.pdf`
 *   - https://vn.skyworth-pv.com/residential/solahome-pro/sola-home-pro
 *
 * Prices below are the published figures. Where two sources publish
 * different price sets they are kept apart on purpose — see the note on
 * `solaHomePackagePriceNote`.
 */

/** The two ways to install SolaHome on a roof. */
export interface SolaHomeMount {
  id: 'solaroof' | 'solaloft'
  name: string
  /** Headline positioning. */
  headline: string
  /** One-paragraph description. */
  body: string
  /** Published benefits, as a title + supporting line. */
  benefits: { title: string; body: string }[]
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
      'Lắp trực tiếp lên mái nhà sẵn có, giữ nguyên cấu trúc mái. Không phá hủy, không di dời, phù hợp nhà phố và biệt thự có mái nghiêng hoặc mái tôn.',
    benefits: [
      { title: 'Chống nóng, chống thấm', body: 'Lớp panel chống nhiệt giúp giảm nhiệt độ mái và làm chậm lão hóa của lớp mái cũ.' },
      { title: 'Quản lý thông minh', body: 'Giám sát sản lượng và tối ưu tỷ lệ tự tiêu thụ để hiệu quả ổn định qua nhiều năm.' },
      { title: 'Lắp đặt không phá hủy', body: 'Giữ nguyên cấu trúc mái nhà hiện tại — không tháo dỡ, không đục lợp.' },
      { title: 'Sản xuất chính hãng', body: 'Thiết kế đẹp theo yêu cầu, đồng bộ với ngoại thất ngôi nhà.' },
    ],
    bestFor: 'Nhà phố, biệt thự có mái nghiêng, mái tôn hoặc mái ngói — muốn giữ nguyên mái và bắt đầu nhanh.',
    specs: [
      { label: 'Tương thích mái', value: 'Tôn, ngói, đá phiến, mái bằng có ballast' },
      { label: 'Biến tần', value: 'Hybrid 1 pha / 3 pha' },
      { label: 'Pin lưu trữ', value: 'LiFePO₄ 5–20 kWh, xếp chồng & mở rộng linh hoạt' },
      { label: 'Vệ dự phòng', value: 'Mất lưới tự chuyển sang pin, giữ tủ lạnh, đèn, quạt' },
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
      'Dàn khung thép kiến trúc cao tầng 2,7–2,8 m, tấm pin đặt trên khung nghiêng 5° tối ưu bức xạ. Vừa tạo một khoảng không gian đa năng trên mái, vừa lưu điện dư xuống pin tích hợp bên dưới khung.',
    benefits: [
      { title: 'Chống nóng, chống thấm', body: 'Khung thép tách lớp che mưa, bảo vệ mái nhà khỏi nắng trực tiếp và mưa gió.' },
      { title: 'Quản lý thông minh', body: 'Toàn bộ khung và pin đều được giám sát trên cùng một hệ thống quản lý năng lượng.' },
      { title: 'Mỗi ngôi nhà một thiết kế', body: 'Bố cục khung, góc nghiêng và chiều cao được thiết kế riêng, làm mái đẹp hơn.' },
      { title: 'Sản xuất chính hãng', body: 'Khung thép đạt chuẩn TÜV Rheinland, chất lượng hoàn thiện hơn.' },
    ],
    bestFor: 'Biệt thự, nhà có khuôn viên rộng — muốn vừa có chỗ sống trên mái, vừa tối đa hóa công suất phát điện.',
    specs: [
      { label: 'Khung thép', value: 'Cao tầng 2,7–2,8 m, tấm pin nghiêng 5°' },
      { label: 'Chịu gió bão', value: 'Cấp 12, đạt chuẩn TÜV Rheinland' },
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
 * Real VN installations published on the official SolaHome Pro page.
 * Each entry states only what the source publishes: capacity, city,
 * district, bill reduction and monthly saving.
 */
export interface SolaHomeCase {
  id: string
  capacity: string
  location: string
  owner: string
  billReduction: string
  monthlySaving: string
  imagePath: string
  imageAlt: string
}

export const solaHomeCases: SolaHomeCase[] = [
  {
    id: 'binh-duong',
    capacity: '5 kWp',
    location: 'Bình Dương · Thủ Dầu Một',
    owner: 'Anh Minh',
    billReduction: '−79%',
    monthlySaving: '2,5 triệu đồng/tháng',
    imagePath: '/images/solahome/case-binhduong.webp',
    imageAlt: 'Hệ điện mặt trời 5 kWp trên mái bằng tại Bình Dương',
  },
  {
    id: 'dong-nai',
    capacity: '10 kWp',
    location: 'Đồng Nai · Biên Hòa',
    owner: 'Chị Lan',
    billReduction: '−82%',
    monthlySaving: '4,5 triệu đồng/tháng',
    imagePath: '/images/solahome/case-dongnai.webp',
    imageAlt: 'Hệ điện mặt trời 10 kWp tại Đồng Nai',
  },
  {
    id: 'ho-chi-minh',
    capacity: '20 kWp',
    location: 'TP. Hồ Chí Minh · Quận 9',
    owner: 'Anh Tuấn',
    billReduction: '−72%',
    monthlySaving: '2 triệu đồng/tháng',
    imagePath: '/images/solahome/case-hcm.webp',
    imageAlt: 'Hệ điện mặt trời 20 kWp tại Quận 9, TP. Hồ Chí Minh',
  },
]

/** One of the four packages. */
export interface SolaHomePackage {
  id: string
  name: string
  badge?: string
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
  /** Retail price for the SolaRoof build, VND. */
  priceRoof: string
  /** Retail price for the SolaLoft build, VND. */
  priceLoft: string
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
    priceRoof: '72 – 85 triệu VND',
    priceLoft: '82 – 96 triệu VND',
    summary: 'Mở đầu với mái 25–30 ㎡, ưu tiên tiết kiệm điện ban ngày.',
    fits: 'Hộ gia đình 1 pha, hóa đơn điện vừa phải, muốn bắt đầu nhẹ nhàng.',
  },
  {
    id: 'solahome-10kwp',
    name: 'Gói Phổ Biến',
    badge: 'Ưu tiên biệt thự',
    capacity: '10 kWp',
    phase: '1 pha',
    inverter: 'SWH series hybrid',
    dcRange: '7,44 – 11,16 kWp',
    roofArea: '45 – 52 ㎡',
    priceRoof: '106 – 136 triệu VND',
    priceLoft: '119 – 156 triệu VND',
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
    priceRoof: '146 – 169 triệu VND',
    priceLoft: '156 – 189 triệu VND',
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
    priceRoof: '179 – 209 triệu VND',
    priceLoft: '199 – 246 triệu VND',
    summary: 'Mái lớn 67–77 ㎡, công suất cao nhất trong dòng SolaHome.',
    fits: 'Biệt thự lớn, nhà 3 pha cần vừa phát điện vừa cấp điện dự phòng.',
  },
]

/**
 * Note printed under the price table.
 *
 * The SolaHome Pro pages publish the four packages above as price
 * *ranges* (the window depends on the final module/inverter mix). The
 * older VN residential flyer publishes a separate fixed retail list for
 * the standard SolaHome line (48,4 / 85,1 / 80,5 / 137,6 / 153,7 /
 * 150,2 / 170,5 / 204,7 triệu VND) — that list is grid-tied and hybrid
 * builds with the SWR battery family, i.e. a different product scope.
 * Both lists are published, so both stay on record; the business should
 * confirm which list is the retail list of record before the price table
 * is treated as final.
 */
export const solaHomePackagePriceNote =
  'Giá trên là mức niêm yết đã công bố cho từng kiểu lắp đặt. Khoảng giá thay đổi theo cấu hình tấm pin, biến tần và điều kiện mái thực tế. Giá cuối cùng được chốt sau khảo sát hiện trường và ký hợp đồng.'

/** The two optional backup (bổ sung pin) solutions. */
export interface SolaHomeBackup {
  id: string
  name: string
  /** Which homes this pairing suits. */
  fits: string
  battery: { model: string; capacity: string; note: string; price: string }
  inverter: { model: string; note: string }
  /** What the customer gets from the pairing. */
  benefits: string[]
}

export const solaHomeBackups: SolaHomeBackup[] = [
  {
    id: 'backup-modular',
    name: 'Phương án A — Pin xếp chồng + Hybrid 1 pha',
    fits: 'Gia đình 1 pha, cần pin mở rộng linh hoạt theo nhu cầu tăng dần.',
    battery: {
      model: 'Pin LiFePO₄ dạng mô-đun xếp chồng',
      capacity: '5 kWh (mở rộng lên 10 kWh hoặc 20 kWh)',
      note: 'Bổ sung +15.000.000 VND so với gói không kèm pin',
      price: '+15 triệu VND',
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
    battery: {
      model: 'Pin All-in-one LiFePO₄',
      capacity: '14,3 kWh',
      note: 'Bổ sung +38.000.000 VND so với gói không kèm pin',
      price: '+38 triệu VND',
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

/** Roof-area → capacity lookup, published in the CN flyer. */
export interface SolaHomeRoofRow {
  area: string
  capacity: string
  panels: string
  dailyOutput: string
  monthlySaving: string
}

export const solaHomeRoofTable: SolaHomeRoofRow[] = [
  { area: '25 – 30 ㎡', capacity: '5 kW', panels: '9 tấm (620 W)', dailyOutput: '20 kWh', monthlySaving: '1.766.500 VND' },
  { area: '28 – 33 ㎡', capacity: '6 kW', panels: '10 tấm (620 W)', dailyOutput: '24 kWh', monthlySaving: '2.181.700 VND' },
  { area: '36 – 42 ㎡', capacity: '8 kW', panels: '13 tấm (620 W)', dailyOutput: '32 kWh', monthlySaving: '3.012.100 VND' },
  { area: '45 – 52 ㎡', capacity: '10 kW', panels: '16 tấm (620 W)', dailyOutput: '40 kWh', monthlySaving: '3.842.500 VND' },
  { area: '67 – 77 ㎡', capacity: '15 kW', panels: '24 tấm (620 W)', dailyOutput: '60 kWh', monthlySaving: '5.918.500 VND' },
  { area: '135 – 150 ㎡', capacity: '30 kW', panels: '48 tấm (620 W)', dailyOutput: '120 kWh', monthlySaving: '12.146.500 VND' },
]

/** The footnote published under the roof table. */
export const solaHomeRoofTableNote =
  '月节省电费 = 日均有效时长 (4 giờ) × 日均发电量 × 30 ngày × đơn giá điện theo bậc thang. Công suất tải tham chiếu: điều hòa trung tâm 1 kW, điều hòa 800 W, tủ lạnh 150 W, quạt 50 W.'

/** The three operating modes. */
export const solaHomeModes: { title: string; subtitle: string; body: string }[] = [
  {
    title: 'Hòa lưới trực tiếp',
    subtitle: 'Direct Mode',
    body: 'Ban ngày có nắng, hệ thống cấp điện cho tải và sạc phần dư. Ưu tiên tự tiêu thụ, điện dư mới lưu vào pin.',
  },
  {
    title: 'Dùng pin độc lập',
    subtitle: 'Battery Mode',
    body: 'Ban đêm hoặc khi mưa gió, hệ thống chạy bằng pin LiFePO₄. 100% tự dùng, không phụ thuộc lưới điện.',
  },
  {
    title: 'Bù điện thông minh',
    subtitle: 'Hybrid Mode',
    body: 'Khi pin yếu, hệ thống bổ sung điện từ lưới. Đảm bảo nguồn điện liên tục mọi lúc.',
  },
]

/** The eight-step delivery flow from the flyer. */
export const solaHomeProcess: { title: string; body: string }[] = [
  { title: 'Đăng ký', body: 'Gửi yêu cầu khảo sát, không ràng buộc, không phí ẩn.' },
  { title: 'Khảo sát', body: 'Kỹ thuật viên đo đạc mái, đánh giá tải trọng và nhu cầu dự phòng.' },
  { title: 'Thiết kế', body: 'Thiết kế hệ thống, khung giá đỡ và phương án pin theo thực tế ngôi nhà.' },
  { title: 'Ký hợp đồng', body: 'Báo giá trong 24 giờ, chốt cấu hình và tiến độ.' },
  { title: 'Bàn giao thiết bị', body: 'Thiết bị được đưa đến tận nơi, kiểm tra trước khi lắp đặt.' },
  { title: 'Thi công', body: 'Lắp đặt trong 2–3 ngày, gọn gàng, an toàn, đúng tiến độ.' },
  { title: 'Đấu nối hòa lưới', body: 'Kết nối hộp phân phối AC theo quy định địa phương và đồng bộ hệ thống.' },
  { title: 'Thu hoạch điện', body: 'Bàn giao, hướng dẫn ứng dụng giám sát và khởi động vận hành.' },
]

/** Published economics — two published examples, kept apart. */
export const solaHomeEconomics: {
  headline: string
  rows: { label: string; value: string }[]
  note: string
}[] = [
  {
    headline: 'Gói 5 kWp — hoàn vốn nhanh trên mái nhà',
    rows: [
      { label: 'Thời gian hoàn vốn', value: '3,5 năm' },
      { label: 'Tổng lợi ích 30 năm', value: '6,38 tỷ VND' },
      { label: 'Chi phí đầu tư tham chiếu', value: '15.042 VND/W' },
    ],
    note: 'Tính theo hệ 5 kW lắp tại TP. Hồ Chí Minh, đơn giá điện theo bậc 6 của EVN. Lợi ích 30 năm tương đương giá trị 10 chiếc xe máy (585.900 VND/chiếc).',
  },
  {
    headline: 'Hệ 10 kW 1 pha + pin 16 kWh — dòng tiền 25 năm',
    rows: [
      { label: 'Tổng đầu tư', value: '153,7 triệu VND' },
      { label: 'Tiết kiệm mỗi năm', value: '~47 triệu VND' },
      { label: 'Giảm chi phí điện', value: 'đến 93%' },
      { label: 'Dòng tiền lũy kế 25 năm', value: '~927 triệu VND' },
    ],
    note: 'Tính theo hệ 10 kW 1 pha + lưu trữ 16 kWh tại TP. Hồ Chí Minh, giờ nắng tương đương 1.500 giờ/năm, tỷ lệ tự tiêu thụ 95%. Lợi nhuận đã bao gồm chi phí vận hành, bảo trì và thay thế linh kiện vào năm thứ 15.',
  },
]

/** Certifications published on the VN product pages. */
export const solaHomeCertifications: string[] = [
  'TÜV Rheinland',
  'CE',
  'EVN Approved',
]

/** Warranty terms. */
export const solaHomeWarranty: { label: string; value: string }[] = [
  { label: 'Pin LiFePO₄', value: '10 năm' },
  { label: 'Hiệu suất tấm pin', value: '30 năm' },
  { label: 'Khung thép chống ăn mòn', value: '30 năm' },
  { label: 'Biến tần hybrid', value: '10 năm' },
]

/** FAQ — from the official SolaHome Pro page. */
export const solaHomeFaqs: { q: string; a: string }[] = [
  {
    q: 'SolaHome là gì?',
    a: 'SolaHome là hệ điện mặt trời lắp trên mái nhà cho biệt thự và nhà phố, gồm tấm pin N-type, biến tần hybrid và hệ lưu trữ năng lượng — mục tiêu là cấp điện liên tục 24/7 cho cả gia đình.',
  },
  {
    q: 'SolaRoof và SolaLoft khác nhau thế nào?',
    a: 'SolaRoof lắp trực tiếp lên mái hiện có, giữ nguyên cấu trúc mái. SolaLoft dựng khung thép kiến trúc cao tầng 2,7–2,8 m, tấm pin nghiêng 5° tối ưu bức xạ, đồng thời tạo thêm không gian sống trên mái và chỗ đặt pin tích hợp. Giá của cùng một gói SolaLoft cao hơn SolaRoft vì phần khung thép và công trình kiến trúc.',
  },
  {
    q: 'Hệ thống lưu trữ của SolaHome có những lựa chọn dung lượng nào?',
    a: 'Hai phương án bổ sung pin: mô-đun LiFePO₄ xếp chồng 5 kWh (mở rộng lên 10 kWh hoặc 20 kWh) đi kèm biến tần hybrid 1 pha SWH 3-6KH/KL-S1; hoặc pin All-in-one 14,3 kWh đi kèm biến tần hybrid 3 pha SWH 5-15KH-T1. Cả hai phương án đều bảo hành 10 năm.',
  },
  {
    q: 'Tôi có duy trì được nguồn điện khi mất điện lưới không?',
    a: 'Có. Chế độ dự phòng tự động chuyển sang pin và duy trì các thiết bị thiết yếu — tủ lạnh, đèn, quạt; với SolaLoft thì giữ được cả điều hòa và thiết bị đang chạy.',
  },
  {
    q: 'Hệ thống tối ưu hóa hóa đơn điện ra sao?',
    a: 'Hệ thống sạc pin vào khung giờ thấp điểm hoặc dùng điện mặt trời dư, sau đó xả vào khung giá cao điểm (peak-load shifting). Ưu tiên tự tiêu thụ để tối đa hóa tỷ lệ tự dùng.',
  },
  {
    q: 'Hiệu suất bộ biến tần hybrid thế nào?',
    a: 'Hiệu suất tối đa 98,6%, hỗ trợ siêu tải DC 1,5 lần và vẫn sạc được pin khi ánh sáng yếu.',
  },
  {
    q: 'Bảo hành các thiết bị chính trong bao lâu?',
    a: 'Pin LiFePO₄: 10 năm. Hiệu suất tấm pin: 30 năm. Khung thép chống ăn mòn: 30 năm. Biến tần hybrid: 10 năm.',
  },
  {
    q: 'Tôi có quản lý được toàn bộ hệ năng lượng của gia đình từ xa không?',
    a: 'Có, qua SKYWORTH Smart App — bao gồm điện mặt trời, pin, bơm nhiệt và trạm sạc xe điện, với dữ liệu phát điện, tiêu thụ và lưu trữ theo thời gian thực.',
  },
  {
    q: 'Quy trình lắp đặt có đảm bảo tiêu chuẩn quốc tế không?',
    a: 'Hệ thống tuân thủ bộ tiêu chuẩn nội bộ, khảo sát mái bằng UAV 3D để đánh giá tải trọng, và được TÜV Rheinland giám sát chất lượng độc lập.',
  },
  {
    q: 'Tôi có cần xin phép điện lưới không?',
    a: 'Với công suất dưới 15 kW, hệ thống không cần xin phép điện lưới. Việc kết nối hộp phân phối AC theo quy định địa phương vẫn được kỹ thuật viên xử lý trong quá trình thi công.',
  },
]
