/**
 * About Us page data — Vietnam.
 *
 * Structure mirrors the Italian market's about-us page
 * (`IT.solavita/components/about`): hero → who we are → mission →
 * approach → technology → global presence → CTA. The sections are the
 * same ones the Vietnamese site already shipped; only the copy and the
 * data behind it are formalised here.
 *
 * Every fact below is either (a) a SKYWORTH Group disclosure already
 * published on this site, (b) a product certification already listed on
 * the Vietnamese product pages, or (c) a legal-entity fact already
 * printed in the footer. No market-specific number is invented.
 *
 * Vietnam has no published office address yet, so the "global presence"
 * list names the market and the group entities but never a street
 * address. Add an office row back in the same pass that supplies the
 * address — and the matching office channel in `lib/data/contact.tsx`.
 */

export interface AboutStat {
  value: string
  unit: string
  label: string
}

/**
 * Stats block on the About page. These mirror the tiles rendered by
 * `components/about/WhoWeAre.tsx` so the data file and the section
 * never drift apart.
 */
export const aboutStats: AboutStat[] = [
  {
    value: '9,8 tỷ',
    unit: 'USD',
    label:
      'Doanh thu hằng năm của Tập đoàn SKYWORTH (năm tài chính 2024)',
  },
  {
    value: '4',
    unit: 'triệu',
    label: 'Hộ gia đình trên toàn thế giới tin dùng SKYWORTH',
  },
  {
    value: '40+',
    unit: 'năm',
    label:
      'Kinh nghiệm điện tử và kỹ thuật năng lượng của Tập đoàn SKYWORTH',
  },
  {
    value: '2',
    unit: 'sàn',
    label: 'Sàn niêm yết (Hồng Kông và Thâm Quyến)',
  },
]

export interface AboutApproach {
  title: string
  description: string
}

export const aboutApproach: AboutApproach[] = [
  {
    title: 'Thiết kế theo nhu cầu sử dụng thực tế',
    description:
      'Chúng tôi xây dựng giải pháp theo từng mức nhu cầu điện, từ nguồn dự phòng thiết yếu đến hệ thống công suất lớn hơn cho hộ gia đình và doanh nghiệp.',
  },
  {
    title: 'Cấu hình hệ thống rõ ràng',
    description:
      'Chúng tôi giải thích công suất tấm quang năng, công suất bộ biến tần và dung lượng pin lưu trữ để bạn tự tin so sánh các phương án.',
  },
  {
    title: 'Công nghệ hướng đến dài hạn',
    description:
      'Chúng tôi kết hợp sản xuất điện mặt trời và pin lưu trữ thành hệ thống giúp việc sử dụng điện linh hoạt hơn.',
  },
  {
    title: 'Dịch vụ và hỗ trợ tại địa phương',
    description:
      'Đội ngũ Solavita Việt Nam đồng hành cùng bạn trên suốt vòng đời hệ thống: từ khảo sát hiện trường, lắp đặt và đấu nối cho đến theo dõi vận hành, bảo hành và hỗ trợ kỹ thuật.',
  },
]

export interface AboutCertification {
  label: string
  description: string
}

/**
 * Certification list. Every entry is a certification the Solavita
 * products already carry on the Vietnamese product pages
 * (`lib/data/products.ts`, `lib/data/solamate.ts`, `lib/data/solahome.ts`)
 * — module and inverter standards, group management systems and the
 * TÜV / CE marks printed on the product imagery. No market-specific
 * grid-connection or incentive scheme is claimed.
 */
export const aboutCertifications: AboutCertification[] = [
  {
    label: 'IEC 61215 · IEC 61730',
    description:
      'Tiêu chuẩn thiết kế, an toàn điện và hiệu suất cho tấm quang năng Solavita.',
  },
  {
    label: 'ISO 9001 · ISO 14001',
    description:
      'Hệ thống quản lý chất lượng và hệ thống quản lý môi trường tại nhà sản xuất.',
  },
  {
    label: 'TÜV · CE',
    description:
      'Tấm quang năng và khung thép được TÜV giám sát chất lượng; thiết bị mang dấu chứng nhận CE.',
  },
  {
    label: 'RoHS · IEC 62109',
    description:
      'Giới hạn vật chất nguy hại và an toàn bộ biến tần nối lưới.',
  },
]

export interface AboutRegion {
  city: string
  /** Optional: shown next to the city when the two differ. */
  country: string
  role: string
}

/**
 * Region / presence list. Vietnam appears as a market (no office
 * address has been published yet), Hong Kong as the registered office
 * of the group entity named in the footer, and Shenzhen as the group
 * HQ. No street address is rendered anywhere on the page.
 */
export const aboutRegions: AboutRegion[] = [
  {
    city: 'Việt Nam',
    country: '',
    role: 'Thị trường Solavita Việt Nam · Tư vấn, lắp đặt và hậu mãi',
  },
  {
    city: 'Hồng Kông',
    country: '',
    role: 'Văn phòng đăng ký · SKYWORTH RENEWABLE ENERGY COMPANY LIMITED',
  },
  {
    city: 'Thâm Quyến',
    country: 'Trung Quốc',
    role: 'Trụ sở tập đoàn · R&D của SKYWORTH',
  },
]
