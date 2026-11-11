/**
 * For Partners page data — Vietnam.
 *
 * Source of truth (both supplied by the business, Sept 2026):
 *   - `docs/Vietnam Partner Recruitment Brochure_VN 20260911.pdf`
 *     (document version `Global-V1.09-2026VN`)
 *   - `docs/越南金牌商务合伙人 展架80x180cm 20260920(2).pdf`
 *     (the "Đối tác Vàng" roll-up standee / recruitment campaign)
 *
 * Commercial intent of the two documents, in one paragraph:
 *   Solavita is the solar brand of the SKYWORTH group, and the VN
 *   recruitment offer is deliberately low-barrier: an individual or a
 *   small business can start with **no capital, no stock and no
 *   technical background**, earn a per-watt commission on every
 *   contract they introduce, and be paid half on delivery and half on
 *   the final balance. The brochure supplies the institutional
 *   credibility (group scale, one-stop supply chain, local warehouse,
 *   training) that makes the offer credible; the standee supplies the
 *   *campaign* wrapper — a capped intake ("50 suất"), a stepped
 *   commission (+25% from the 3rd order), merchandising support
 *   (uniform, flyers, business cards), instalment financing through
 *   Shinhan, and a 7-step customer journey.
 *
 * Everything on this page is either copied from those documents or
 * derived arithmetically from them (the arithmetic is spelled out in
 * the comments next to each figure so it can be re-checked). Facts
 * that the business has NOT confirmed for Vietnam stay `TBD` in the
 * page and are listed in `docs/VN-LOCALIZATION-TODO.md`.
 */

/**
 * Recruitment hotline printed on the VN partner standee and used for
 * partner enquiries. This is the *partner* line — customer support
 * still runs on the group WhatsApp number.
 */
export const PARTNER_HOTLINE = '0939738000'

/**
 * Named partnership contact printed in the brochure footer.
 */
export const PARTNER_CONTACT = {
  name: 'Jason',
  phone: '+84 856 842 842',
  phoneHref: 'tel:+84856842842',
  email: 'Phan.thang@skyworth.com',
}

export type PartnerTypeId =
  | 'core-service'
  | 'certified-installer'
  | 'lead-partner'

export interface PartnerType {
  id: PartnerTypeId
  title: string
  /** Short "for whom" subtitle shown under the title. */
  description: string
  /** "What You Get" — bullets the partner receives from Solavita. */
  whatYouGet: string[]
  /** "Your Role" — bullets the partner is expected to do. */
  yourRole: string[]
  icon: 'wrench' | 'handshake' | 'users'
}

/**
 * The three VN partnership tracks.
 *
 * Titles now follow the brochure's own naming so the page, the printed
 * brochure and the standee use one vocabulary. The `id` values are
 * unchanged (they are the `partner_track` values persisted in
 * `vn_partner_leads` and whitelisted in `app/api/partner/route.ts`),
 * only the labels moved:
 *
 *   core-service        → "Đại lý kinh doanh"       (holds local stock)
 *   certified-installer → "Đối tác lắp đặt"         (surveys, installs)
 *   lead-partner        → "Đối tác kinh doanh"      (introduces customers)
 *
 * "Đơn vị lắp đặt được chứng nhận" was dropped on purpose: the
 * brochure describes installers working under the "Energy Partner
 * Solavita" arm (the group surveys, designs and installs), and no
 * Vietnamese installer-certification scheme has been confirmed.
 */
export const partnerTypes: PartnerType[] = [
  {
    id: 'core-service',
    title: 'Đại lý kinh doanh',
    description:
      'Dành cho đơn vị có năng lực tồn kho và mạng lưới phân phối tại địa phương.',
    whatYouGet: [
      'Hoa hồng 950 đồng/W trên mỗi đơn hàng',
      'Thưởng thêm +190 đồng/W từ 5 đơn/tháng, +380 đồng/W từ 8 đơn/tháng',
      'Hoa hồng +190 đồng/W khi tự khảo sát công trình',
      'Tiếp cận kho hàng tại địa phương, không cần đặt cả container',
    ],
    yourRole: [
      'Duy trì tồn kho tại địa phương',
      'Chủ động tìm kiếm và chốt khách hàng trong khu vực',
      'Hỗ trợ các đối tác lắp đặt trong khu vực',
    ],
    icon: 'wrench',
  },
  {
    id: 'certified-installer',
    title: 'Đối tác lắp đặt',
    description:
      'Dành cho đội ngũ có kỹ năng điện và điện mặt trời, làm việc dưới Energy Partner Solavita.',
    whatYouGet: [
      'Được tổng bộ chỉ đạo khảo sát, thiết kế và lắp đặt',
      'Đào tạo sản phẩm và kỹ thuật lắp đặt',
      'Không yêu cầu đặt hàng theo container',
    ],
    yourRole: [
      'Khảo sát hiện trường và thi công theo phương án của tổng bộ',
      'Đảm bảo chất lượng lắp đặt và hậu mãi',
    ],
    icon: 'handshake',
  },
  {
    id: 'lead-partner',
    title: 'Đối tác kinh doanh',
    description:
      'Dành cho cá nhân hoặc doanh nghiệp chỉ cần giới thiệu khách hàng — không cần tồn kho, không cần đội ngũ, không cần vốn.',
    whatYouGet: [
      'Hoa hồng 760 đồng/W trên mỗi đơn hàng',
      'Thưởng thêm +190 đồng/W từ 3 đơn/tháng, +380 đồng/W từ 5 đơn/tháng',
      'Hoa hồng +190 đồng/W khi tự khảo sát công trình',
      'Tài liệu tiếp thị, đào tạo và nhóm Zalo hỗ trợ riêng',
    ],
    yourRole: [
      'Chia sẻ khách hàng có mái nhà và muốn tiết kiệm chi phí tiền điện',
      'Chúng tôi khảo sát, báo giá và ký kết hợp đồng',
      'Theo dõi thanh toán cùng tổng bộ',
    ],
    icon: 'users',
  },
]

/**
 * "Why partner" — the group / brand credibility numbers.
 *
 * `800.000+` and `34.6GW` were already published on this page before
 * the brochure landed and are left untouched. Note the brochure quotes
 * `29,3GW` for the same "cumulative installed capacity" metric — the
 * two figures are flagged in `docs/VN-LOCALIZATION-TODO.md` (item 2.7)
 * rather than silently swapped.
 */
export interface PartnerStats {
  /** Large headline number, e.g. "800,000+". */
  value: string
  /** Caption rendered under the number. */
  caption: string
}

export const partnerStats: PartnerStats[] = [
  {
    value: '800,000+',
    caption: 'Trạm điện mặt trời đã lắp đặt trên toàn thế giới',
  },
  {
    value: '34.6GW',
    caption: 'Tổng công suất lắp đặt luỹ kế',
  },
]

/**
 * SKYWORTH group facts printed on page 1 of the brochure. Used to
 * answer the first question any partner asks — "who is behind the
 * warranty?".
 */
export interface PartnerGroupFact {
  value: string
  caption: string
}

export const partnerGroupFacts: PartnerGroupFact[] = [
  { value: '1988', caption: 'Năm thành lập tập đoàn' },
  { value: '#252', caption: 'Top 500 doanh nghiệp Trung Quốc năm 2026' },
  { value: '30.000+', caption: 'Số lượng nhân viên' },
  { value: '$10+ tỷ', caption: 'Doanh thu hoạt động' },
  { value: '120+', caption: 'Quốc gia và khu vực kinh doanh' },
]

export interface PartnerBenefit {
  /** Pill label rendered on top of the card image (e.g. "Local Warehouse"). */
  label: string
  /** One-line caption under the pill (e.g. "No full container needed"). */
  caption: string
  /** Short description used for the card placeholder. */
  description: string
  /** Path to the hero image under `public/`. Omit to render the
   *  neutral `ImagePlaceholder` instead (keeps the card visible until
   *  the partner photo / render is supplied). */
  image?: string
}

export const partnerBenefits: PartnerBenefit[] = [
  {
    label: 'Kho tại địa phương',
    caption: 'Không cần đặt cả container',
    description:
      'Kho Solavita tại địa phương cho phép lấy hàng theo từng pallet — không yêu cầu đặt tối thiểu cả container.',
    image: '/images/local_warehouse_card.webp',
  },
  {
    label: 'Bảo hành toàn hệ thống',
    caption: 'Hỗ trợ bảo hành tại địa phương',
    description:
      'Bảo hành toàn hệ thống với đầu mối xử lý tại địa phương, để bạn và khách hàng không phải chờ xử lý bảo hành ở nước ngoài.',
    image: '/images/full_warranty_card.webp',
  },
  {
    label: 'Hỗ trợ bán hàng',
    caption: 'Khách hàng & hỗ trợ kỹ thuật',
    description:
      'Chương trình đồng tiếp thị, chia sẻ khách hàng theo khu vực và hỗ trợ kỹ thuật trong tính toán, thiết kế hệ thống.',
    image: '/images/sales_support_card.webp',
  },
]

/* ────────────────────────────────────────────────────────────────
 * Commission economics — brochure page 3, "Thu hút khách hàng,
 * kiếm tiền dễ dàng".
 * ──────────────────────────────────────────────────────────────── */

export interface PartnerCommissionTier {
  /** Monthly order count that unlocks the bonus. */
  orders: number
  /** Bonus per watt on top of the base rate. */
  bonusPerWatt: number
}

export interface PartnerCommissionTrack {
  id: 'dealer' | 'business-partner'
  /** Track title as printed on the brochure. */
  title: string
  /** Base commission in VND per watt. */
  basePerWatt: number
  /** Monthly-order thresholds and the bonus each one unlocks. */
  tiers: PartnerCommissionTier[]
  /** Extra commission when the partner runs the site survey. */
  surveyBonusPerWatt: number
}

/**
 * The two commercial tracks of the brochure.
 *
 * Cross-check against the "Đối tác Vàng" standee, which quotes
 * "Thu nhập lên đến 7.600.000 / Trên mỗi đơn hàng" and "Từ đơn
 * hàng thứ 3 trở đi hoa hồng tăng 25%":
 *
 *   760 đồng/W × 10.000 W (hệ thống 10 kW) = 7.600.000 đồng
 *   7.600.000 × 1,25                        = 9.500.000 đồng
 *
 * …which is exactly the "9,5 TRIỆU / KHÁCH HÀNG" printed on the
 * standee, and 5 khách hàng × 9,5 triệu = 47,5 triệu/tháng and
 * × 12 = 570 triệu/năm. The two documents therefore agree.
 */
/**
 * The commission track the "Chương trình Đối tác Vàng" campaign runs on.
 *
 * The general `/for-partners/` page explains the commission *model*
 * without the numbers; the campaign page is where the rate basis is
 * published, next to the 7,6 / 9,5 triệu figures on the standee.
 */
export const goldMedalCommissionTrack: PartnerCommissionTrack = {
  id: 'business-partner',
  title: 'Đối tác kinh doanh',
  basePerWatt: 760,
  tiers: [
    { orders: 3, bonusPerWatt: 190 },
    { orders: 5, bonusPerWatt: 380 },
  ],
  surveyBonusPerWatt: 190,
}

export const partnerCommissionTracks: PartnerCommissionTrack[] = [
  {
    id: 'dealer',
    title: 'Đại lý kinh doanh',
    basePerWatt: 950,
    tiers: [
      { orders: 5, bonusPerWatt: 190 },
      { orders: 8, bonusPerWatt: 380 },
    ],
    surveyBonusPerWatt: 190,
  },
  goldMedalCommissionTrack,
]

/** Payout schedule printed on the brochure. */
export const partnerPayoutTerms = [
  '50% hoa hồng được trả khi giao hàng',
  '50% hoa hồng được trả khi thanh toán số dư còn lại',
  'Thưởng doanh số tháng được chi trả trước ngày 5 của tháng sau',
]

/** Reference system size used for the "per order" examples. */
export const PARTNER_REFERENCE_SYSTEM_KW = 10

/* ────────────────────────────────────────────────────────────────
 * Zero-barrier statements — brochure page 3.
 * ──────────────────────────────────────────────────────────────── */

export const partnerBarriers: string[] = [
  'Không áp lực tồn kho',
  'Không cần thành lập đội ngũ',
  'Không cần kinh nghiệm chuyên môn',
  'Không vốn đầu tư',
]

/* ────────────────────────────────────────────────────────────────
 * Cooperation model — brochure page 3, "4 bước hợp tác dễ dàng".
 * ──────────────────────────────────────────────────────────────── */

export interface PartnerProcessStep {
  step: string
  title: string
  description: string
}

export const partnerProcess: PartnerProcessStep[] = [
  {
    step: '01',
    title: 'Khai thác & giới thiệu khách hàng',
    description:
      'Chỉ cần giới thiệu đến tổng bộ những khách hàng có mái nhà và muốn tiết kiệm chi phí tiền điện.',
  },
  {
    step: '02',
    title: 'Kết nối & phục vụ khách hàng',
    description:
      'Tổng bộ theo dõi nhu cầu khách hàng, cung cấp phương án và hỗ trợ kỹ thuật.',
  },
  {
    step: '03',
    title: 'Hỗ trợ ký kết hợp đồng',
    description:
      'Tổng bộ hỗ trợ ký kết hợp đồng và theo dõi thanh toán cùng đối tác.',
  },
  {
    step: '04',
    title: 'Khảo sát, thiết kế & lắp đặt',
    description:
      'Khảo sát hiện trường, thiết kế và lắp đặt do tổng bộ chỉ đạo và thực hiện.',
  },
]

/* ────────────────────────────────────────────────────────────────
 * Training — brochure page 3, "Ba chương trình đào tạo".
 * ──────────────────────────────────────────────────────────────── */

export interface PartnerTrainingProgram {
  title: string
  description: string
  icon: 'book' | 'messages' | 'ruler'
}

export const partnerTraining: PartnerTrainingProgram[] = [
  {
    title: 'Đào tạo hệ thống kiến thức sản phẩm',
    description:
      'Kỹ năng tư vấn bán hàng và phát triển thị trường — không cần nền tảng, làm chủ nhanh chóng.',
    icon: 'book',
  },
  {
    title: 'Hỗ trợ giải đáp trực tuyến mọi lúc',
    description:
      'Nhóm Zalo riêng, phản hồi tức thời. Giải đáp ngay các vấn đề trong quá trình mở rộng thị trường.',
    icon: 'messages',
  },
  {
    title: 'Đào tạo nghiệp vụ trực tiếp',
    description:
      'Khảo sát thực địa hiện trường. Hướng dẫn tận tay đo đạc mái nhà.',
    icon: 'ruler',
  },
]

/* ────────────────────────────────────────────────────────────────
 * "Đối tác Vàng" campaign — 展架80x180cm standee, 20/09/2026.
 * ──────────────────────────────────────────────────────────────── */

export interface GoldMedalStat {
  value: string
  label: string
  detail: string
}

export interface GoldMedalStep {
  step: string
  title: string
}

export interface GoldMedalPerk {
  title: string
  description: string
  icon: 'wallet' | 'package' | 'trending' | 'graduation'
}

export interface GoldMedalProgram {
  /** Campaign name as printed on the standee. */
  name: string
  /** Sub-heading under the campaign name. */
  subtitle: string
  /**
   * Two-tone heading split for the campaign panel / page: the white
   * lead-in and the gold-highlighted tail. Together they read as
   * `subtitle` — kept as one string so the body copy can use the full
   * sentence without re-joining two halves.
   */
  subtitleLead: string
  subtitleHighlight: string
  /** Four-word rhythm printed at the top of the standee. */
  pillars: string[]
  /** Number of partner slots the intake is capped at. */
  slots: number
  /** Headline numbers shown at the top of the standee. */
  stats: GoldMedalStat[]
  /** Who the campaign is looking for. */
  lookingFor: string[]
  /** What the applicant should already have. */
  ifYouHave: string[]
  /** The four core advantages printed on the standee. */
  perks: GoldMedalPerk[]
  /** The 7-step customer journey printed on the standee. */
  journey: GoldMedalStep[]
  /** Merchandising + financing support included with the programme. */
  support: string[]
  /** Commission ramp published on the standee. */
  commissionRamp: string[]
}

/**
 * The standee is a two-sided roll-up: the front sells the programme and
 * the back explains the money. Everything below is transcribed from
 * it — the four "CHÚNG TÔI TÌM KIẾM / NẾU BẠN CÓ" columns, the four
 * "lợi thế cốt lõi", the 7-step journey and the income ladder.
 */
export const goldMedalProgram: GoldMedalProgram = {
  name: 'Chương trình Đối tác Vàng',
  subtitle: 'Tuyển chọn đối tác — Liên kết giới thiệu khách hàng',
  subtitleLead: 'Tuyển chọn đối tác —',
  subtitleHighlight: 'Liên kết giới thiệu khách hàng',
  pillars: ['Kết nối', 'Đồng hành', 'Thu lợi', 'Trả góp'],
  slots: 50,
  stats: [
    {
      value: '7,6 triệu',
      label: 'Thu nhập trên mỗi đơn hàng',
      detail:
        'Tương đương hệ thống 10 kW theo mức hoa hồng 760 đồng/W của Đối tác kinh doanh.',
    },
    {
      value: '+25%',
      label: 'Hoa hồng tăng từ đơn hàng thứ 3',
      detail: 'Áp dụng cho mọi hợp đồng triển khai thành công từ đơn thứ 3 trở đi.',
    },
    {
      value: '9,5 triệu',
      label: 'Thu nhập mỗi khách hàng',
      detail:
        'Mức hoa hồng sau khi tăng 25% — tương đương 47,5 triệu đồng khi giới thiệu 5 khách hàng mỗi tháng.',
    },
    {
      value: '570 triệu',
      label: 'Thu nhập lên đến mỗi năm',
      detail: 'Khi duy trì 5 khách hàng mỗi tháng, quanh mức 47,5 triệu đồng.',
    },
  ],
  lookingFor: [
    'Cá nhân có sẵn nguồn khách hàng tiềm năng',
    'Định hướng phát triển trong ngành công nghiệp xu hướng mới',
    'Bạn không cần đúng ngành — chỉ cần đúng nhu cầu',
  ],
  ifYouHave: [
    'Mạng lưới quan hệ rộng',
    'Khả năng tiếp cận các hộ gia đình có đơn tiền điện từ 2 triệu đồng/tháng',
    'Mối quan hệ với các hộ kinh doanh hoặc doanh nghiệp có mức tiêu thụ điện cao',
  ],
  perks: [
    {
      title: 'Chi phí đầu tư thấp',
      description: 'Tối ưu hoá ngân sách, bắt đầu dễ dàng.',
      icon: 'wallet',
    },
    {
      title: 'Không tồn kho',
      description: 'Giảm thiểu rủi ro, vận hành linh hoạt.',
      icon: 'package',
    },
    {
      title: 'Hoa hồng cao',
      description: 'Lợi nhuận hấp dẫn, tăng trưởng bền vững.',
      icon: 'trending',
    },
    {
      title: 'Luôn đồng hành đào tạo và tư vấn',
      description: 'Đội ngũ chuyên gia hỗ trợ tận tay trong quá trình mở rộng.',
      icon: 'graduation',
    },
  ],
  journey: [
    { step: '01', title: 'Giới thiệu khách hàng' },
    { step: '02', title: 'Báo giá chi tiết' },
    { step: '03', title: 'Ký kết hợp đồng' },
    { step: '04', title: 'Thanh toán một phần' },
    { step: '05', title: 'Thiết kế thi công' },
    { step: '06', title: 'Nghiệm thu toàn diện' },
    { step: '07', title: 'Thanh toán toàn phần' },
  ],
  support: [
    'Đồng phục Solavita trị giá 200.000 đồng',
    '200 tờ rơi sản phẩm cho mỗi đơn hàng',
    'Danh thiếp cá nhân',
    'Shinhan cho vay NLMT — giải pháp tài chính linh hoạt, dễ dàng sở hữu hệ thống điện mặt trời',
  ],
  commissionRamp: [
    'Đơn hàng thứ 1 và thứ 2: 7,6 triệu đồng mỗi khách hàng',
    'Từ đơn hàng thứ 3 trở đi: 9,5 triệu đồng mỗi khách hàng (+25%)',
    'Thưởng thêm nếu vượt chỉ tiêu số đơn hàng trong tháng',
  ],
}

/**
 * Promise line printed at the top of the standee, and the short
 * answer to "is solar hard to get into?".
 */
export const goldMedalPromise = {
  headline: 'Vốn nhỏ — Lời to',
  journey: 'Hành trình đến thu nhập chục triệu hằng tháng',
  reassurance:
    'Năng lượng mặt trời có phải là ngành khó tiếp cận không? Không khó, chỉ mới. Vấn đề chuyên môn, SKYWORTH toàn lực hỗ trợ.',
}
