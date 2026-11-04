/**
 * For Partners page data — Vietnam.
 *
 * Text mirrors the For-Partner 页面修改参考页 PPTX layout. Three
 * tracks (Đối tác dịch vụ chính / Đơn vị lắp đặt được chứng nhận /
 * Đối tác giới thiệu khách hàng). Other markets' trust marks (MCS,
 * "UK-backed warranty", etc.) are dropped — Vietnam has no verified
 * installer certifications, warranty periods, or partner programme
 * specifics, so unverified business claims stay as TBD or are replaced
 * with the generic partner programme framing the PPTX calls out.
 */

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

export const partnerTypes: PartnerType[] = [
  {
    id: 'core-service',
    title: 'Đối tác dịch vụ chính',
    description:
      'Dành cho doanh nghiệp có mạng lưới địa phương và năng lực tồn kho.',
    whatYouGet: [
      'Ưu tiên tiếp cận tồn kho tại địa phương',
      'Hỗ trợ phát triển kênh và đồng tiếp thị',
      'Quản lý tài khoản chuyên trách',
    ],
    yourRole: [
      'Duy trì tồn kho tại địa phương',
      'Hỗ trợ các đơn vị lắp đặt trong khu vực',
    ],
    icon: 'wrench',
  },
  {
    id: 'certified-installer',
    title: 'Đơn vị lắp đặt được chứng nhận',
    description:
      'Dành cho đội ngũ có kỹ năng lắp đặt điện và điện mặt trời.',
    whatYouGet: [
      'Không yêu cầu đặt hàng theo container',
      'Đào tạo sản phẩm và kỹ thuật lắp đặt',
      'Chia sẻ khách hàng tiềm năng trong khu vực',
    ],
    yourRole: [
      'Hoàn thành chứng nhận Solavita',
      'Đảm bảo chất lượng lắp đặt và hậu mãi',
    ],
    icon: 'handshake',
  },
  {
    id: 'lead-partner',
    title: 'Đối tác giới thiệu khách hàng',
    description:
      'Dành cho cá nhân hoặc doanh nghiệp tập trung vào giới thiệu khách hàng và phát triển nhu cầu.',
    whatYouGet: [
      'Hoa hồng theo mỗi khách hàng giới thiệu',
      'Tài liệu tiếp thị miễn phí',
      'Không cần tồn kho, không cần lắp đặt',
    ],
    yourRole: [
      'Chia sẻ khách hàng tiềm năng',
      'Chúng tôi khảo sát và báo giá',
      'Bạn nhận hoa hồng',
    ],
    icon: 'users',
  },
]

/**
 * "Why partner" - per the For-Partner 页面修改参考页 PPTX layout:
 *   - 2 hero stats (800,000+ / 34.6GW) backed by the SKYWORTH Group's
 *     public global-deployment numbers
 *   - one body paragraph + a one-line tagline
 *   - 3 highlight cards (Local Warehouse / Full Warranty / Sales
 *     Support) each with an image and an overlay label
 *
 * The stats are real SKYWORTH Group numbers (verifiable from public
 * sources). The 3-card grid re-frames the "value of partnership" around
 * the PPTX's three pillars instead of the previous 6-reason block.
 */
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

export interface PartnerProcessStep {
  step: string
  title: string
  description: string
}

/**
 * "How partnership works" - 4-step process.
 */
export const partnerProcess: PartnerProcessStep[] = [
  {
    step: '01',
    title: 'Liên hệ với chúng tôi',
    description:
      'Cho chúng tôi biết về doanh nghiệp của bạn và hình thức hợp tác bạn quan tâm.',
  },
  {
    step: '02',
    title: 'Trao đổi sơ bộ',
    description:
      'Buổi trao đổi 30 phút với đội ngũ đối tác để xác định mức độ phù hợp và khu vực hoạt động.',
  },
  {
    step: '03',
    title: 'Tiếp nhận & đào tạo',
    description:
      'Đào tạo sản phẩm, chứng nhận (nếu áp dụng) và cấp quyền truy cập hệ thống.',
  },
  {
    step: '04',
    title: 'Bắt đầu triển khai',
    description:
      'Dự án hợp tác đầu tiên khởi động với sự hỗ trợ đầy đủ từ đội ngũ đối tác tại Việt Nam.',
  },
]