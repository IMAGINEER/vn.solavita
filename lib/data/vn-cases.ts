/**
 * Case studies — Vietnam site.
 *
 * Source of truth: the Skyworth PV overseas case deck. The overseas
 * entries below come from `docs/创维光伏海外案例2.0(1).pptx`; the
 * Vietnamese entries come from the newer
 * `docs/20260921_创维光伏海外案例.pptx`. Every capacity, date and
 * system description states only what the deck's slide text states.
 *
 * The three Vietnamese projects (Qili Xiang Restaurant, Bình Dương,
 * Bắc Ninh sunroom) are the ones the deck documents for Vietnam. Their
 * capacity is still to be read off the deck, so `capacity` is empty and
 * the card renders a visible TBD — the same rule the rest of the site
 * follows: an unverified number is never published.
 *
 * The card format is unchanged:
 *
 *     ┌─────────────────────────────┐
 *     │  Hộ gia đình                │  ← type badge
 *     │  21.59kW                    │  ← capacity
 *     │  Malaysia, Balakong         │  ← country, place
 *     └─────────────────────────────┘
 *
 * i.e. `annualGeneration` / `annualSaving` / `postcode` are gone —
 * capacity replaces generation as the headline number, and the location
 * renders as "country, place" on both the homepage and the /cases index.
 *
 * Images: every photo is extracted from the deck slide that documents the
 * case and re-encoded to WebP under `public/images/cases/` (see the
 * slide → file mapping in the comment above each case). `imagePath` is
 * therefore set on all published cases — except the Bắc Ninh sunroom,
 * whose slide photo is still pending.
 *
 * No fabricated results, savings or testimonials. Each `description`
 * states only what the deck states — the system size, the completion date
 * and the equipment mix.
 */

export type VnCaseType = 'residential' | 'commercial'

export interface VnCase {
  /** Stable slug — unique key, also the future /cases/[slug] id. */
  slug: string
  type: VnCaseType
  /** Badge text on the card. */
  typeLabel: string
  /**
   * Project name, when the source names the project. The card shows
   * it above the capacity; for the Vietnamese cases it is the more
   * useful headline.
   */
  name?: string
  /**
   * Headline capacity, e.g. "21.59kW" or "7.2kW / 11.52kWh".
   * Empty while the capacity is still to be read from the case deck —
   * the card renders a visible TBD instead of a blank line.
   */
  capacity: string
  /** City / site name, e.g. "Balakong". */
  place: string
  /** Country, e.g. "Malaysia". */
  country: string
  /** One factual line about the system. */
  description: string
  /** Path under `public/`. Omitted when the photo is still pending. */
  imagePath?: string
  /** What the image should show — used by the placeholder. */
  imageDescription: string
  /** Marks the cases featured on the homepage. */
  featured?: boolean
}

/** Badge label per type — kept as a constant so both surfaces agree. */
export const CASE_TYPE_LABELS: Record<VnCaseType, string> = {
  residential: 'Hộ gia đình',
  commercial: 'Công nghiệp & thương mại',
}

export const vnCases: VnCase[] = [
  /* ── Việt Nam ────────────────────────────────────────────────────────── */
  // The three Vietnamese projects from the Skyworth PV overseas case
  // deck (`docs/20260921_创维光伏海外案例.pptx`). They lead the case
  // list — and therefore the homepage's case strip — because they are
  // the references a Vietnamese visitor recognises.
  //
  // The deck is the only source for their figures, so the capacity
  // stays empty (rendered as a visible TBD) until it is read, and the
  // Bắc Ninh photo is still pending.
  {
    slug: 'vietnam-qili-xiang-restaurant',
    type: 'residential',
    typeLabel: CASE_TYPE_LABELS.residential,
    name: 'Nhà hàng Qili Xiang',
    capacity: '11,16 kWp',
    place: 'TP. Hồ Chí Minh · Quận 1',
    country: 'Việt Nam',
    description:
      '18 tấm 620 Wp, 1 bộ biến tần hybrid — 25 năm phát 400.354 kWh, hoàn vốn 3,25 năm. Địa chỉ: 18 Phan Ke Binh, Tân Định, Quận 1.',
    imagePath: '/images/solahome/case-hcm.webp',
    imageDescription:
      'Dàn SolaLoft bằng khung thép trên mái nhà hàng Qili Xiang tại TP. Hồ Chí Minh',
    featured: true,
  },
  {
    slug: 'vietnam-binh-duong-solaroof',
    type: 'residential',
    typeLabel: CASE_TYPE_LABELS.residential,
    name: 'Nhà phố tại Bình Dương',
    capacity: '',
    place: 'Bình Dương',
    country: 'Việt Nam',
    description:
      'Hệ SolaRoof lắp trực tiếp lên mái — giữ nguyên kết cấu mái và tận dụng toàn bộ diện tích thu.',
    imagePath: '/images/solahome/case-binhduong.webp',
    imageDescription:
      'Hệ điện mặt trời SolaRoof lắp trực tiếp trên mái nhà tại Bình Dương',
    featured: true,
  },
  {
    slug: 'vietnam-bac-ninh-sunroom',
    type: 'residential',
    typeLabel: CASE_TYPE_LABELS.residential,
    name: 'Nhà kính Bắc Ninh',
    capacity: '',
    place: 'Bắc Ninh',
    country: 'Việt Nam',
    description:
      'Hệ SolaLoft dạng mái nhà kính — khung thép và tấm pin tạo thành mái kính thu bức xạ.',
    imageDescription:
      'Hệ SolaLoft mái nhà kính tại Bắc Ninh — ảnh dự án chờ bổ sung từ hồ sơ case',
    featured: true,
  },

  /* ── Hộ gia đình ─────────────────────────────────────────────────────── */
  {
    // Deck slide 21 — 亚洲户用案例— 泰国 Jrokul Villa
    slug: 'thailand-bangkok-5-28kw',
    type: 'residential',
    typeLabel: CASE_TYPE_LABELS.residential,
    capacity: '5.28kWp',
    place: 'Bangkok',
    country: 'Thái Lan',
    description:
      'Biệt thự Jrokul Villa — hệ thống mái 5,28 kWp gồm tám tấm pin 660 Wp và bộ biến tần hybrid. Hoàn thành tháng 4/2026.',
    imagePath: '/images/cases/bangkok-5-28kw.webp',
    imageDescription:
      'Ảnh toàn cảnh hệ thống mái của biệt thự Jrokul Villa tại Bangkok, Thái Lan',
  },
  {
    // Deck slide 6 — 欧洲户用案例— 德国 法兰克福
    slug: 'germany-frankfurt-12kw-14kwh',
    type: 'residential',
    typeLabel: CASE_TYPE_LABELS.residential,
    capacity: '12kW / 14kWh',
    place: 'Frankfurt',
    country: 'Đức',
    description:
      'Hệ thống hybrid cho hộ gia đình tại Frankfurt — bộ biến tần hybrid 12 kW và 14 kWh pin lưu trữ. Hoàn thành tháng 4/2023.',
    imagePath: '/images/cases/frankfurt-12kw-14kwh.webp',
    imageDescription:
      'Hệ thống pin mặt trời trên mái bằng của một căn nhà tại Frankfurt, Đức',
  },
  {
    // Deck slide 26 — 亚洲户用案例— 马来西亚 Johor
    slug: 'malaysia-johor-16-51kw',
    type: 'residential',
    typeLabel: CASE_TYPE_LABELS.residential,
    capacity: '16.51kW',
    place: 'Johor',
    country: 'Malaysia',
    description:
      'Hệ thống điện mặt trời áp mái cho hộ gia đình tại Johor, Malaysia — công suất lắp đặt 16,51 kW.',
    imagePath: '/images/cases/johor-16-51kw.webp',
    imageDescription:
      'Ảnh toàn cảnh hệ thống điện mặt trời áp mái tại Johor, Malaysia',
  },
  {
    // Deck slide 16 — 欧洲户用案例— 意大利 Lecce
    slug: 'italy-lecce-4-6kw-11kwh',
    type: 'residential',
    typeLabel: CASE_TYPE_LABELS.residential,
    capacity: '4.6kW / 11kWh',
    place: 'Lecce',
    country: 'Ý',
    description:
      'Hệ thống hybrid cho hộ gia đình tại Lecce — bộ biến tần hybrid 4,6 kW và 11 kWh pin lưu trữ. Hoàn thành tháng 5/2023.',
    imagePath: '/images/cases/lecce-4-6kw-11kwh.webp',
    imageDescription:
      'Hệ thống pin mặt trời trên mái một căn nhà tại Lecce, Ý',
  },
  {
    // Deck slide 30 — 非洲户用案例— 多哥共和国 洛美 (Lomé)
    slug: 'togo-lome-5kw',
    type: 'residential',
    typeLabel: CASE_TYPE_LABELS.residential,
    capacity: '5kW',
    place: 'Lomé',
    country: 'Togo',
    description:
      'Hệ thống điện mặt trời áp mái cho hộ gia đình tại Lomé, Togo — công suất lắp đặt 5 kW.',
    imagePath: '/images/cases/togo-lome-5kw.webp',
    imageDescription:
      'Đội lắp đặt thi công hệ thống pin mặt trời tại Lomé, Togo',
  },
  {
    // Deck slide 20 — 亚洲户用案例— 伊拉克 苏莱曼尼亚（Sulaimaniyah）
    slug: 'iraq-sulaimaniyah-25-5kw',
    type: 'residential',
    typeLabel: CASE_TYPE_LABELS.residential,
    capacity: '25.5kW',
    place: 'Sulaimaniyah',
    country: 'Iraq',
    description:
      'Hệ thống điện mặt trời áp mái tại Sulaimaniyah, Iraq — công suất lắp đặt 25,5 kW.',
    imagePath: '/images/cases/iraq-sulaimaniyah-25-5kw.webp',
    imageDescription:
      'Hệ thống điện mặt trời nhìn ra thành phố Sulaimaniyah, Iraq',
  },
  {
    // Deck slide 4 — 欧洲户用案例— 德国 法兰克福
    slug: 'germany-frankfurt-20kw-22kwh',
    type: 'residential',
    typeLabel: CASE_TYPE_LABELS.residential,
    capacity: '20kW / 22kWh',
    place: 'Frankfurt',
    country: 'Đức',
    description:
      'Hệ thống cho hộ gia đình tại Frankfurt với hai bộ biến tần hybrid 10 kW và 22 kWh pin lưu trữ. Hoàn thành tháng 2/2023.',
    imagePath: '/images/cases/frankfurt-20kw-22kwh.webp',
    imageDescription:
      'Ảnh toàn cảnh một căn nhà phủ kín pin mặt trời tại Frankfurt, Đức',
  },
  {
    // Deck slide 5 — 欧洲户用案例— 德国 法兰克福
    slug: 'germany-frankfurt-10kw-11kwh',
    type: 'residential',
    typeLabel: CASE_TYPE_LABELS.residential,
    capacity: '10kW / 11kWh',
    place: 'Frankfurt',
    country: 'Đức',
    description:
      'Hệ thống hybrid cho hộ gia đình tại Frankfurt — bộ biến tần hybrid 10 kW và 11 kWh pin lưu trữ.',
    imagePath: '/images/cases/frankfurt-10kw-11kwh.webp',
    imageDescription:
      'Ảnh toàn cảnh hệ thống điện mặt trời áp mái tại Frankfurt, Đức',
  },
  {
    // Deck slide 28 — 亚洲户用案例— 马来西亚 Balakong，Selangor
    slug: 'malaysia-balakong-21-59kw',
    type: 'residential',
    typeLabel: CASE_TYPE_LABELS.residential,
    capacity: '21.59kW',
    place: 'Balakong',
    country: 'Malaysia',
    description:
      'Hệ thống điện mặt trời áp mái cho hộ gia đình tại Balakong, Selangor, Malaysia — công suất lắp đặt 21,59 kW.',
    imagePath: '/images/cases/balakong-21-59kw.webp',
    imageDescription:
      'Ảnh toàn cảnh hệ thống pin mặt trời tại Balakong, Selangor, Malaysia',
  },
  {
    // Deck slide 15 — 欧洲户用案例— 意大利 Lecce
    slug: 'italy-lecce-5kw-11kwh',
    type: 'residential',
    typeLabel: CASE_TYPE_LABELS.residential,
    capacity: '5kW / 11kWh',
    place: 'Lecce',
    country: 'Ý',
    description:
      'Hệ thống hybrid cho hộ gia đình tại Lecce — bộ biến tần hybrid 5 kW và 11 kWh pin lưu trữ. Hoàn thành tháng 6/2023.',
    imagePath: '/images/cases/lecce-5kw-11kwh.webp',
    imageDescription:
      'Hệ thống pin mặt trời trên mái một căn nhà tại Lecce, Ý',
  },
  {
    // Deck slide 14 — 欧洲户用案例— 意大利 Lecce
    slug: 'italy-lecce-6kw-11kwh',
    type: 'residential',
    typeLabel: CASE_TYPE_LABELS.residential,
    capacity: '6kW / 11kWh',
    place: 'Lecce',
    country: 'Ý',
    description:
      'Hệ thống hybrid cho hộ gia đình tại Lecce — bộ biến tần hybrid 6 kW và 11 kWh pin lưu trữ. Hoàn thành tháng 7/2023.',
    imagePath: '/images/cases/lecce-6kw-11kwh.webp',
    imageDescription:
      'Ảnh toàn cảnh hệ thống điện mặt trời áp mái tại Lecce, Ý',
  },
  {
    // Deck slide 12 — 欧洲户用案例— 德国Taunus
    slug: 'germany-taunus-7-2kw-11-52kwh',
    type: 'residential',
    typeLabel: CASE_TYPE_LABELS.residential,
    capacity: '7.2kW / 11.52kWh',
    place: 'Taunus',
    country: 'Đức',
    description:
      'Hệ thống cho hộ gia đình tại Taunus — công suất lắp đặt 7,2 kWp, bộ biến tần 10 kW và 11,52 kWh pin lưu trữ.',
    imagePath: '/images/cases/taunus-7-2kw-11-52kwh.webp',
    imageDescription:
      'Hệ thống pin mặt trời trên mái bằng của một căn nhà tại Taunus, Đức',
  },

  /* ── Công nghiệp & thương mại ────────────────────────────────────────── */
  {
    // Deck slide 35 — 非洲工商业案例—非洲 塞内加尔
    slug: 'senegal-africa-1mw-3mwh',
    type: 'commercial',
    typeLabel: CASE_TYPE_LABELS.commercial,
    capacity: '1MW / 3MWh',
    place: 'Senegal',
    country: 'Châu Phi',
    description:
      'Dự án lưu trữ quy mô lớn tại Senegal — công suất đầu ra 1 MW với dung lượng 3 MWh.',
    imagePath: '/images/cases/senegal-1mw-3mwh.webp',
    imageDescription:
      'Đội thi công lắp đặt tấm pin trên mái công trình thương mại tại Senegal',
  },
  {
    // Deck slide 32 — 亚洲EPC案例— 香港 联升工贸大厦 Hongkong Len Shing
    slug: 'hongkong-china-227kw',
    type: 'commercial',
    typeLabel: CASE_TYPE_LABELS.commercial,
    capacity: '227kW',
    place: 'Hồng Kông',
    country: 'Trung Quốc',
    description:
      'Dự án điện mặt trời áp mái thương mại 227 kW tại tòa nhà Len Shing, Hồng Kông.',
    imagePath: '/images/cases/hongkong-227kw.webp',
    imageDescription:
      'Ảnh toàn cảnh hệ thống pin mặt trời trên mái tòa nhà Len Shing, Hồng Kông',
    featured: true,
  },
  {
    // Deck slide 33 — 亚洲工商业案例— 泰国 Wathubrak School
    slug: 'thailand-wathubrak-school-5-58kw',
    type: 'commercial',
    typeLabel: CASE_TYPE_LABELS.commercial,
    capacity: '5.58kWp',
    place: 'Trường Wathubrak',
    country: 'Thái Lan',
    description:
      'Hệ thống cho khuôn viên trường tại Wathubrak, Thái Lan — dàn pin 5,58 kWp gồm chín tấm 620 Wp và bộ biến tần nối lưới. Hoàn thành tháng 4/2026.',
    imagePath: '/images/cases/thailand-wathubrak-school-5-58kw.webp',
    imageDescription:
      'Tấm pin mặt trời trên mái trường học tại Wathubrak, Thái Lan',
  },
  {
    // Deck slide 34 — 亚洲工商业案例— 缅甸 FCC商贸城
    slug: 'myanmar-fcc-trading-city-4-7mw-9-4mwh',
    type: 'commercial',
    typeLabel: CASE_TYPE_LABELS.commercial,
    capacity: '4.7MW / 9.4MWh',
    place: 'FCC Trading City',
    country: 'Myanmar',
    description:
      'Dự án điện mặt trời và lưu trữ thương mại tại FCC Trading City, Myanmar — công suất đầu ra 4,7 MW với dung lượng 9,4 MWh.',
    imagePath: '/images/cases/myanmar-fcc-4-7mw-9-4mwh.webp',
    imageDescription:
      'Lễ khởi công dự án điện mặt trời và lưu trữ FCC Trading City tại Myanmar',
  },
]

/** All residential cases, in the deck's listed order. */
export const vnResidentialCases: VnCase[] = vnCases.filter(
  (c) => c.type === 'residential',
)

/** All commercial & industrial cases, in the deck's listed order. */
export const vnCommercialCases: VnCase[] = vnCases.filter(
  (c) => c.type === 'commercial',
)

/** The cases featured on the homepage. */
export const featuredVnCases: VnCase[] = vnCases.filter((c) => c.featured)

/** Look up a single case by slug. */
export function getVnCaseBySlug(slug: string): VnCase | undefined {
  return vnCases.find((c) => c.slug === slug)
}