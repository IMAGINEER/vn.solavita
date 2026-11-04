/**
 * About Us page data — Vietnam.
 *
 * Built from the Vietnam business brief. All copy is placeholder / TBD
 * until business supplies the verified facts. Section-by-section
 * mapping:
 *   - Section 1 Hero: tagline + body
 *   - Section 2 Why We Exist: lede
 *   - Section 3 Our Approach: 4 cards
 *   - Section 4 Our Brand: SKYWORTH association + verified corporate
 *     facts TBD
 *   - Section 5 Our Commitment: service coverage / warranty TBD
 *   - Section 6 Local Presence: address / coverage TBD
 *
 * No other market's facts, no SKYWORTH-only claims, no fabricated
 * corporate history / factory capacity / project counts.
 */

export interface AboutStat {
  value: string
  unit: string
  label: string
}

/**
 * Stats block on the About page. Until verified corporate facts are
 * supplied, every entry is a TBD placeholder; the consumer renders
 * them with a `TbdText` so the page can be reviewed without
 * fabricating numbers.
 */
export const aboutStats: AboutStat[] = [
  {
    value: 'TBD',
    unit: '',
    label: 'TBD — Mốc ra mắt / hiện diện của SKYWORTH tại Việt Nam (chờ xác minh)',
  },
  {
    value: 'TBD',
    unit: '',
    label: 'TBD — Phạm vi lắp đặt tại Việt Nam (chờ xác minh)',
  },
  {
    value: 'TBD',
    unit: '',
    label: 'TBD — Quy mô toàn cầu của SKYWORTH (chờ xác minh)',
  },
  {
    value: 'TBD',
    unit: '',
    label: 'TBD — Số hộ gia đình sử dụng Solavita (chờ xác minh)',
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
      'TBD — Phương án lắp đặt, chăm sóc khách hàng và hậu mãi tại Việt Nam (chờ xác minh).',
  },
]

export interface AboutCertification {
  label: string
  description: string
}

/**
 * Certification list. Every entry is a TBD placeholder. Do not add
 * MCS / NICEIC / RECC / TUV / CE / 25-year / other markets'
 * regulatory claims until business confirms the certification applies
 * to Solavita Vietnam.
 */
export const aboutCertifications: AboutCertification[] = [
  {
    label: 'TBD',
    description: 'TBD — Chứng nhận quốc tế hoặc tại Việt Nam (chờ xác minh)',
  },
  {
    label: 'TBD',
    description: 'TBD — Chứng nhận quốc tế hoặc tại Việt Nam (chờ xác minh)',
  },
  {
    label: 'TBD',
    description: 'TBD — Chứng nhận quốc tế hoặc tại Việt Nam (chờ xác minh)',
  },
  {
    label: 'TBD',
    description: 'TBD — Chứng nhận quốc tế hoặc tại Việt Nam (chờ xác minh)',
  },
]

export interface AboutRegion {
  city: string
  country: string
  role: string
}

/**
 * Region / office list. Only SKYWORTH Group HQ is verifiable from
 * public sources; every Vietnamese entry is a TBD until the local
 * presence is confirmed.
 */
export const aboutRegions: AboutRegion[] = [
  { city: 'TBD', country: 'Việt Nam', role: 'TBD — Văn phòng và điểm dịch vụ tại Việt Nam (chờ xác minh)' },
  { city: 'TBD', country: 'Việt Nam', role: 'TBD — Khu vực lắp đặt được hỗ trợ (chờ xác minh)' },
  { city: 'Thâm Quyến', country: 'Trung Quốc', role: 'Trụ sở tập đoàn · SKYWORTH R&D' },
]