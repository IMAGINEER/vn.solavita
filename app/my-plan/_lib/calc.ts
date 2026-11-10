/**
 * Danh mục gói + gợi ý + công cụ ROI cho `/my-plan`.
 *
 * Kiến trúc:
 *   Biểu mẫu tư vấn ──► recommendPlan() ──► NgPlanId
 *   Gói (cố định)    ──► calculateROI() ──► PlanRoi
 *
 * Sáu gói (LITE / HOME Standard / HOME High-spec / BUSINESS Entry /
 * BUSINESS Standard / BUSINESS Flagship) là bộ sản phẩm cố định. Người
 * dùng có thể chuyển đổi giữa các gói trong `/my-plan` nhưng không thể tự
 * điều chỉnh số tấm pin hay dung lượng pin lưu trữ. Thông số phản chiếu
 * `lib/data/solutions.ts` để bề mặt marketing và công cụ tính luôn khớp.
 *
 * **Giá** là giá *tạm tính* lấy từ bảng giá UK và được đánh dấu bằng
 * `priceNgn` để phân biệt rõ với mọi con số ₦ đã được phê duyệt sau này.
 * Theo đặc tả của dự án, tệp này sở hữu cấu hình giá - chỉ cần thay một
 * con số ở đây là cập nhật toàn bộ công cụ tính.
 *
 * **Công cụ ROI**:
 *   1. Ước tính tổng kWh điện tiêu thụ hằng năm của hộ từ mức tiêu thụ
 *      (electricityUsage).
 *   2. Chia thành phần dùng điện lưới và phần dùng nguồn dự phòng dựa
 *      trên `generatorFrequency` (trường cũ được giữ để tương thích dữ
 *      liệu). Giới hạn phần kWh nguồn dự phòng theo ngân sách năng lượng
 *      người dùng khai báo để không phóng đại khoản tiết kiệm.
 *   3. Tính sản lượng điện mặt trời năm 1 từ công suất hệ thống × sản
 *      lượng theo khu vực. Áp dụng tỷ lệ tự tiêu thụ (pin lưu trữ giúp
 *      tăng tỷ lệ này).
 *   4. Thay thế trước hết phần điện lưới, sau đó phần nguồn dự phòng
 *      (giới hạn bởi chi phí năng lượng thực tế người dùng khai báo).
 *      Đây là quy tắc không tính trùng - cùng một kWh tự tiêu thụ không
 *      thể vừa giảm chi phí điện lưới vừa giảm chi phí nguồn dự phòng.
 *   5. Tiết kiệm ròng hằng năm = phần điện lưới được thay thế + phần
 *      nguồn dự phòng được thay thế − chi phí vận hành hằng năm (1 %
 *      giá hệ thống cho bảo trì).
 *   6. Thời gian hoàn vốn = giá hệ thống / tiết kiệm ròng hằng năm.
 *      Vòng đời 30 năm áp dụng cùng mô hình với hệ số suy giảm của tấm pin.
 */

import { solutionDetails } from '@/lib/data/solutions'

/* ──────────────────────────────────────────────────────────────────────
   Danh mục gói
   ────────────────────────────────────────────────────────────────────── */

export type NgPlanId =
  | 'lite-essential-backup'
  | 'home-standard'
  | 'home-high-spec'
  | 'business-entry-3-phase'
  | 'business-standard-3-phase'
  | 'business-flagship-3-phase'

export interface NgPlan {
  id: NgPlanId
  name: string
  subtitle: string
  /** Total rated PV capacity (kWp). Drives the year-1 generation. */
  kwp: number
  /** Battery capacity (kWh, nominal). 0 for solar-only tiers. */
  batteryKwh: number
  /** Inverter continuous output (kW). */
  inverterKw: number
  /**
   * Display string for the PV row on the plan card, e.g.
   * "9.92–12.40 kWp". Shown when the tier's capacity is a range rather
   * than a single number; the numeric `kwp` field stays the engine
   * input (a midpoint for ranged tiers). Falls back to `kwp` when unset.
   */
  kwpLabel?: string
  /**
   * Display string for the inverter row, e.g. "8–12 kW". Same
   * fallback rule as `kwpLabel`.
   */
  inverterLabel?: string
  /**
   * Test-baseline price (₦). Reuse UK ladder values for now - swap one
   * number here to update the whole calculator when business supplies
   * approved ₦ prices.
   */
  priceNgn: number
  /** Customer segment, drives segment-aware copy. */
  segment: 'homes' | 'businesses'
  /** True if this is the recommended mid-tier for its segment. */
  popular?: boolean
  /* ────── backward-compat aliases for the old UK Plan shape ──────
   * The /my-plan components still reference `plan.panels` and
   * `plan.priceGbp`. We mirror the values so the components can
   * read either; the values themselves are NG-currency now. */
  /** Alias for kwp. */
  panels: number
  /** Alias for priceNgn. Numeric value is ₦ even though the field is
   *  named `priceGbp` - kept for component compat. */
  priceGbp: number
}

/**
 * Sáu gói, phản chiếu `lib/data/solutions.ts`. Thứ tự là có chủ đích:
 * chỉ số 0 là LITE, 1 là HOME Standard (phổ biến cho hộ gia đình), 2 là
 * HOME High-spec, sau đó là ba gói BUSINESS theo công suất tăng dần.
 * Thang gợi ý của `recommendPlan` duyệt mảng này theo thứ tự, nên đổi
 * thứ tự sẽ thay đổi gói được đề xuất cho một hồ sơ tiêu thụ nhất định.
 */
export const NG_PLANS: NgPlan[] = [
  {
    id: 'lite-essential-backup',
    name: 'LITE Essential Backup',
    subtitle: 'Một pha · Dự phòng thiết yếu',
    kwp: 4.34,
    batteryKwh: 5,
    inverterKw: 3.6,
    priceNgn: 3_800_000,
    segment: 'homes',
    panels: 4.34,         // alias
    priceGbp: 3_800_000,  // alias (value is actually ₦)
  },
  {
    id: 'home-standard',
    name: 'HOME Standard',
    subtitle: 'Một pha · Hộ gia đình thông thường',
    kwp: 7.44,
    batteryKwh: 10,
    inverterKw: 6,
    priceNgn: 6_200_000,
    segment: 'homes',
    popular: true,
    panels: 7.44,
    priceGbp: 6_200_000,
  },
  {
    id: 'home-high-spec',
    name: 'HOME High-spec',
    subtitle: 'Một pha · Công suất cao hơn',
    kwp: 11.16, // midpoint of 9.92-12.40 kWp
    batteryKwh: 16,
    inverterKw: 10, // midpoint of 8-12 kW
    kwpLabel: '9.92–12.40 kWp',
    inverterLabel: '8–12 kW',
    priceNgn: 9_500_000,
    segment: 'homes',
    panels: 11.16,
    priceGbp: 9_500_000,
  },
  {
    id: 'business-entry-3-phase',
    name: 'BUSINESS Entry 3-Phase',
    subtitle: 'Ba pha · Doanh nghiệp cơ bản',
    kwp: 11.78,
    batteryKwh: 16,
    inverterKw: 10,
    priceNgn: 11_500_000,
    segment: 'businesses',
    panels: 11.78,
    priceGbp: 11_500_000,
  },
  {
    id: 'business-standard-3-phase',
    name: 'BUSINESS Standard 3-Phase',
    subtitle: 'Ba pha · Doanh nghiệp tiêu chuẩn',
    kwp: 17.36,
    batteryKwh: 32,
    inverterKw: 15,
    priceNgn: 17_500_000,
    segment: 'businesses',
    panels: 17.36,
    priceGbp: 17_500_000,
  },
  {
    id: 'business-flagship-3-phase',
    name: 'BUSINESS Flagship 3-Phase',
    subtitle: 'Ba pha · Doanh nghiệp cao cấp',
    kwp: 23.56,
    batteryKwh: 32,
    inverterKw: 20,
    priceNgn: 24_000_000,
    segment: 'businesses',
    panels: 23.56,
    priceGbp: 24_000_000,
  },
]

/** Lookup by id. */
export function getNgPlan(id: NgPlanId): NgPlan {
  const plan = NG_PLANS.find((p) => p.id === id)
  if (!plan) throw new Error(`Unknown plan id: ${id}`)
  return plan
}

/* ──────────────────────────────────────────────────────────────────────
   Consultation input (consumed by recommendPlan + calculateROI)
   ────────────────────────────────────────────────────────────────────── */

/** Household size - same ID space as the form. */
export type HouseholdSize = '1' | '2' | '3' | '4' | '5+' | string

/** Self-reported consumption band. */
export type ConsumptionTier = 'low' | 'medium' | 'high' | 'very-high' | 'unknown'

/** Devices the customer already has that materially raise demand. */
export type HeavyDevice = 'wallbox' | 'heatpump' | 'ac' | string

/** Mức sử dụng nguồn dự phòng. */
export type GeneratorFrequency =
  | 'rarely'
  | 'sometimes'
  | 'daily'
  | 'frequently'
  | 'unknown'

/** Khoảng ngân sách năng lượng hằng tháng (₦). */
export type FuelBudgetNgn =
  | 'below-20k'
  | '20k-50k'
  | '50k-100k'
  | 'above-100k'
  | 'unknown'

/** Items the customer wants backup power for (drives battery sizing). */
export type BackupNeedId = 'lights' | 'fridge' | 'ac' | 'pump' | string

export interface ConsultationInput {
  householdSize: HouseholdSize
  electricityUsage: ConsumptionTier
  devices: HeavyDevice[]
  region: string
  /** Các trường mở rộng ở bước 3. Tất cả có thể là 'unknown' nếu người
   *  dùng đã bỏ qua. */
  generatorFrequency: GeneratorFrequency
  fuelBudgetNgn: FuelBudgetNgn
  backupNeeds: BackupNeedId[]
}

/**
 * Lightweight, no-PII summary of the home used at the top of /my-plan.
 * Kept here (instead of in the adapter) because the components
 * historically import it from `../_lib/calc` and we don't want a
 * cross-folder rewrite just for the rename.
 */
export interface HomeDetails {
  houseType: string
  /** Number of people in the household (the form's `'5+'` maps to 5). */
  householdSize: number
  /** Roof shape/type. */
  roofOrientation: string
  /** Region. */
  region: string
  /** Electricity-use tier ID (from the monthly-consumption question). */
  electricityUsage: string
  /** Share of electricity used during daylight. */
  daytimeRatio: string
  /** Heavy devices selected. */
  devices: string[]
  /** Các trường mở rộng ở bước 3 được hiển thị trên dải thông tin. */
  generatorFrequency: string
  fuelBudgetNgn: string
  backupNeeds: string[]
}

/* ──────────────────────────────────────────────────────────────────────
   Các giả định + hằng số
   ────────────────────────────────────────────────────────────────────── */

/** kWh hằng năm theo mức tiêu thụ. Điểm giữa của khoảng kWh trong biểu mẫu. */
const USAGE_KWH_PER_YEAR: Record<ConsumptionTier, number> = {
  low: 3_000,
  medium: 4_500,
  high: 6_500,
  'very-high': 8_500,
  unknown: 5_000,
}

/**
 * Tỷ lệ điện tiêu thụ hiện đang được đáp ứng bởi nguồn dự phòng. Quyết
 * định cách chia kWh giữa điện lưới và nguồn dự phòng, từ đó quyết định
 * phần chi phí năng lượng thực sự có thể tiết kiệm.
 */
const GEN_SHARE_BY_FREQUENCY: Record<GeneratorFrequency, number> = {
  rarely: 0.10,
  sometimes: 0.30,
  daily: 0.60,
  frequently: 0.80,
  unknown: 0.40,
}

/**
 * Chi phí năng lượng trung bình hằng tháng (₦). Dùng khi người dùng chọn
 * một khoảng. Quy đổi theo năm trong phép tính ROI bằng ×12.
 */
const FUEL_BUDGET_ANNUAL_NGN: Record<FuelBudgetNgn, number> = {
  'below-20k': 240_000,    // 20k * 12
  '20k-50k': 420_000,      // 35k * 12
  '50k-100k': 900_000,     // 75k * 12
  'above-100k': 1_800_000, // 150k * 12
  unknown: 0,              // Suy ra từ tỷ lệ nguồn dự phòng + đơn giá năng lượng
}

/**
 * Biểu giá điện lưới (₦/kWh). Giá trị dân dụng hiện được dùng làm mức
 * tạm tính. TBD - thay bằng biểu giá EVN đã được xác nhận khi bộ phận
 * kinh doanh phê duyệt.
 */
const NG_GRID_TARIFF_NGN_PER_KWH = 68

/**
 * Đơn giá năng lượng + hiệu suất hệ thống, tách theo loại nhiên liệu.
 *
 * ⚠️ GIÁ TRỊ TẠM TÍNH — đang chờ xác nhận từ bộ phận kinh doanh.
 *
 * Các hằng số bên dưới thuộc mô hình chi phí năng lượng cũ, được giữ
 * nguyên định danh và con số vì các cột dữ liệu hiện có cùng toàn bộ
 * công thức ROI đọc trực tiếp chúng. Không thay đổi các giá trị này cho
 * đến khi có mô hình chi phí mới được phê duyệt.
 *
 * Hiệu suất (kWh mỗi lít) được suy ra từ khảo sát thị trường, KHÔNG phải
 * mức trung bình đo đạc. Hiệu suất thực tế phụ thuộc vào công suất định
 * mức, hệ số phụ tải, tuổi thiết bị và chế độ bảo trì. Đây là mức tạm
 * tính được chọn trong khoảng hợp lý, không lạc quan.
 *
 * **Không trình bày các con số này như mức trung bình đã kiểm chứng trên
 * giao diện.**
 *
 * Nếu sau này công cụ được cải tiến để hỏi công suất định mức và phụ tải
 * điển hình, các hằng số này sẽ chuyển thành bảng tra theo (công suất,
 * phụ tải).
 */
const NG_PMS_PRICE_NGN_PER_LITRE = 1_533
const NG_PMS_KWH_PER_LITRE        = 1.85
const NG_AGO_PRICE_NGN_PER_LITRE = 1_915
const NG_AGO_KWH_PER_LITRE        = 2.95

/**
 * Mức trần cứng cho chi phí năng lượng hằng năm suy ra ngược (nhánh B
 * "Không chắc chắn").
 *
 * Khi người dùng chọn "Không chắc chắn" cho ngân sách năng lượng hằng
 * tháng, hệ thống suy ra mức trần từ hồ sơ tiêu thụ và các hằng số đơn
 * giá năng lượng. Phép suy ngược này về bản chất là mức tối đa lý thuyết,
 * nên nếu không có giới hạn này thì "Không chắc chắn" sẽ luôn ghi nhận
 * toàn bộ khoản tiết kiệm lý thuyết. Mức trần cứng này là giới hạn hợp lý
 * theo phân khúc, giữ khoản ghi nhận trong khoảng hợp lý cho đến khi
 * người dùng báo con số thực tế.
 *
 * Các con số là mặc định minh hoạ, đang chờ xác nhận:
 *   homes      → ₦50k/tháng  = ₦600k/năm
 *   businesses → ₦300k/tháng = ₦3.6M/năm
 */
const NOT_SURE_HARD_CAP_NGN_PER_YEAR: Record<NgPlan['segment'], number> = {
  homes: 600_000,
  businesses: 3_600_000,
}

/** Helper: gói này giả định loại nhiên liệu nào? Dùng cho cả phép suy
 *  ngược (nhánh B) và quy đổi kWh↔₦ (nhánh A). */
function fuelTypeFor(plan: NgPlan): 'pms' | 'ago' {
  return plan.segment === 'homes' ? 'pms' : 'ago'
}

/**
 * Annual opex as a fraction of system cost. Covers routine
 * maintenance, panel cleaning, and any inverter/battery servicing.
 *
 * ⚠️ IDEAL MODE — currently set to 0. Per user directive, the
 * calculator runs in an "ideal mode" that ignores ongoing
 * maintenance, panel cleaning, and battery/inverter replacement
 * costs. Re-introduce with a non-zero value (typical 0.5–1.5 %
 * of system cost for solar assets) once the maintenance model is
 * verified. When re-enabled, also extend the 30-year loop to add
 * one-off battery / inverter replacement events around year
 * 10–15 — see the comment trail in `calculateROI()`.
 */
const NG_OPEX_PCT = 0

const NG_PROJECT_LIFETIME_YEARS = 30

/**
 * Sản lượng riêng của PV theo khu vực (kWh / kWp / năm).
 *
 * Các khoá bên dưới là tên vùng cũ, được giữ để tương thích với dữ liệu
 * tư vấn đã ghi trước đây; các giá trị là số minh hoạ đang chờ mức trung
 * bình quốc gia được xác nhận. Khu vực chưa có trong bảng sẽ dùng mức dự
 * phòng 1.500 kWh/kWp/năm.
 */
const NG_REGION_YIELD: Record<string, number> = {
  'Lagos': 1_400,
  'Abuja (FCT)': 1_500,
  'North Central': 1_500,
  'North East': 1_700,
  'North West': 1_700,
  'South East': 1_400,
  'South South': 1_300,
  'South West': 1_400,
}
const NG_REGION_YIELD_FALLBACK = 1_500

/**
 * Self-consumption rate - what fraction of solar generation is used
 * on-site rather than exported. With a battery, most of the daytime
 * surplus can be shifted to evening; without one, the surplus has to
 * be exported (or curtailed).
 */
function selfConsumptionRateFor(plan: NgPlan): number {
  return plan.batteryKwh > 0 ? 0.85 : 0.40
}

/**
 * Panel degradation factors (year 1 = 100 %, year 30 ≈ 85 %).
 * 1-indexed. Length = NG_PROJECT_LIFETIME_YEARS.
 */
const DEGRADATION_FACTORS: ReadonlyArray<number> = (() => {
  const out: number[] = []
  for (let year = 1; year <= NG_PROJECT_LIFETIME_YEARS; year++) {
    let factor: number
    if (year === 1) {
      factor = 1.0
    } else if (year <= 10) {
      factor = 0.99 + (year - 2) * (0.9566 - 0.99) / 8
    } else {
      factor = 0.9566 + (year - 10) * (0.85 - 0.9566) / 20
    }
    out.push(factor)
  }
  return out
})()

/** Exposed for the ROI breakdown disclosure (read-only). */
export function getDegradationFactors(): ReadonlyArray<number> {
  return DEGRADATION_FACTORS
}

/* ──────────────────────────────────────────────────────────────────────
   Recommendation engine
   ────────────────────────────────────────────────────────────────────── */

/**
 * 5×4 base tier lookup (household size × consumption). Encodes the
 * implicit "people × kWh/yr" load:
 *   1 person ≈ 2,000 kWh, 5+ people ≈ 7,000+ kWh baseline.
 * Returns the NG_PLANS index for the base recommendation.
 */
const BASE_TIER_LOOKUP: Record<HouseholdSize, Record<ConsumptionTier, number>> = {
  '1':  { low: 0, medium: 0, high: 1, 'very-high': 1, unknown: 0 },
  '2':  { low: 0, medium: 0, high: 1, 'very-high': 2, unknown: 0 },
  '3':  { low: 0, medium: 1, high: 2, 'very-high': 2, unknown: 1 },
  '4':  { low: 0, medium: 1, high: 2, 'very-high': 2, unknown: 1 },
  '5+': { low: 1, medium: 2, high: 2, 'very-high': 2, unknown: 2 },
}

/**
 * Gợi ý một gói. Quy trình:
 *   1. bậc cơ sở từ householdSize × electricityUsage
 *   2. mỗi thiết bị tiêu thụ lớn (+1 bậc, có giới hạn)
 *   3. mức dùng nguồn dự phòng 'daily' hoặc 'frequently' (+1 bậc) — mức
 *      phụ thuộc nguồn dự phòng cao nghĩa là hộ cần pin lưu trữ thực sự
 *      (≥5 kWh) để bù vào khoảng thiếu buổi tối, nên ta nâng từ LITE lên.
 *
 * The output is always a valid NgPlanId. The capped output is the
 * BUSINESS Flagship 3-Phase (the last plan in NG_PLANS). If the user
 * has signals suggesting even Flagship won't cover them (e.g. very-high
 * usage + 3 heavy devices), `recommendPlan` still returns Flagship
 * and the page can show a "human follow-up" banner — we do not
 * silently return null.
 */
export function recommendPlan(c: ConsultationInput): NgPlanId {
  const sizeRow = BASE_TIER_LOOKUP[c.householdSize] ?? BASE_TIER_LOOKUP['3']
  let tier = sizeRow[c.electricityUsage] ?? 1

  for (const device of c.devices ?? []) {
    if (device === 'wallbox' || device === 'heatpump' || device === 'ac') {
      tier = Math.min(NG_PLANS.length - 1, tier + 1)
    }
  }

  if (c.generatorFrequency === 'daily' || c.generatorFrequency === 'frequently') {
    tier = Math.min(NG_PLANS.length - 1, tier + 1)
  }

  return NG_PLANS[tier].id
}

/* ──────────────────────────────────────────────────────────────────────
   ROI engine
   ────────────────────────────────────────────────────────────────────── */

export interface PlanRoi {
  /** Year-1 solar generation (kWh). */
  annualGenerationKwh: number
  /** Year-1 self-consumed kWh (thay thế điện lưới trước, sau đó nguồn dự phòng). */
  annualSelfConsumedKwh: number
  /** Year-1 exported kWh. Giá điện phát lên lưới chưa xác nhận nên thu nhập
   *  hiện được tính bằng 0. */
  annualExportedKwh: number
  /** Year-1 grid-cost offset (₦). */
  annualGridOffsetNgn: number
  /** Khoản chi phí năng lượng được thay thế trong năm 1 (₦). Giới hạn
   *  theo ngân sách năng lượng đã khai báo. */
  annualGeneratorOffsetNgn: number
  /** Year-1 export income (₦). Hiện được tính bằng ₦0. */
  annualExportIncomeNgn: number
  /** Year-1 gross saving (₦). */
  annualSavingNgn: number
  /** Year-1 net saving after opex (₦). */
  annualNetSavingNgn: number
  /** Annual maintenance opex (₦). */
  annualOpexNgn: number
  /** Years to break even on the system price. */
  paybackYears: number
  /** Sum of yearly NET savings across all 30 years. */
  total30YearSavingNgn: number
  /** Total lifetime net saving minus system price (i.e. what you net). */
  total30YearReturnNgn: number
  /** (lifetime net saving / system price) × 100. */
  roiPct: number
  /** System price used (₦). */
  priceNgn: number
  /**
   * Chi phí năng lượng hằng năm thực tế (₦) mà công cụ dùng làm mức
   * trần cho khoản tiết kiệm. Hiển thị giá trị mà nhánh A hoặc nhánh B
   * đã chọn (điểm giữa của khoảng, suy ngược, hoặc người dùng ghi đè) để
   * giao diện có thể nói "đây là giả định của chúng tôi" thay vì một con
   * số khó hiểu.
   */
  appliedAnnualFuelCostNgn: number
  /**
   * Whether the user overrode the cap with a slider value (true)
   * or the calculator used the band / back-derive default (false).
   */
  fuelCostOverridden: boolean
  /** Regional yield used (kWh/kWp/yr). Surfaced for the breakdown. */
  appliedRegionYield: number
  /** Annual kWh used to size the savings (kWh). */
  appliedAnnualKwh: number
  /** Tỷ lệ phần nguồn dự phòng dùng để chia điện lưới và nguồn dự phòng. */
  appliedGeneratorShare: number

  /* ────── backward-compat aliases ──────
   * Old OfferCard + SavingsSection + PlanSummaryAside components
   * still reference `offerPriceGbp` and the `*Gbp` saving fields. The
   * underlying values are ₦ (the names are historical from the UK
   * implementation). Keep the names so we don't have to rewrite every
   * consumer at once. */
  offerPriceNgn: number
  offerPriceGbp: number
  offerValidUntil: Date
  annualSavingGbp: number
  total30YearSavingGbp: number
  total30YearReturnGbp: number
  annualExportIncomeGbp: number
  annualImportOffsetGbp: number
}

/**
 * Internal: ước tính chi phí năng lượng hiện tại mỗi năm.
 *
 * Path A (người dùng chọn một khoảng): dùng trực tiếp điểm giữa của
 * khoảng. Mức trần chính là con số người dùng đưa ra nên không cắt thêm.
 *
 * Path B (người dùng chọn "Không chắc chắn"): suy ngược từ tỷ lệ nguồn
 * dự phòng + kWh ước tính + các hằng số năng lượng của loại nhiên liệu
 * tương ứng, sau đó cắt theo mức trần cứng của phân khúc
 * (`NOT_SURE_HARD_CAP_NGN_PER_YEAR`). Việc cắt này rất quan trọng: nếu
 * không, phép suy ngược bằng đúng mức tối đa lý thuyết, nên
 * `genOffsetNgn = min(theoretical, theoretical)` sẽ thành "không có giới
 * hạn nào" — mọi người dùng "Không chắc chắn" đều nhận toàn bộ khoản
 * tiết kiệm lý thuyết. Mức trần khôi phục một giới hạn trên hợp lý cho
 * đến khi người dùng báo con số thực tế.
 *
 * Trả về ₦/năm.
 */
function estimateAnnualFuelCostNgn(
  c: ConsultationInput,
  generatorKwhPerYear: number,
  fuelType: 'pms' | 'ago',
  segment: NgPlan['segment'],
  userOverride: number | undefined,
): { capNgn: number; overridden: boolean } {
  // User-set slider override takes priority. Always allow it; the
  // slider's own range in CustomiseCard is bounded (0 – 2× hard cap)
  // so the user can't drive this to absurd values.
  if (typeof userOverride === 'number' && Number.isFinite(userOverride) && userOverride >= 0) {
    return { capNgn: userOverride, overridden: true }
  }
  const budget = c.fuelBudgetNgn ?? 'unknown'
  if (budget !== 'unknown') {
    return { capNgn: FUEL_BUDGET_ANNUAL_NGN[budget] ?? 0, overridden: false }
  }
  // Back-derive: litres = kWh / kWhPerLitre; ₦ = litres × ₦/L
  const pricePerLitre = fuelType === 'ago' ? NG_AGO_PRICE_NGN_PER_LITRE : NG_PMS_PRICE_NGN_PER_LITRE
  const kwhPerLitre    = fuelType === 'ago' ? NG_AGO_KWH_PER_LITRE        : NG_PMS_KWH_PER_LITRE
  const backDerived = (generatorKwhPerYear / kwhPerLitre) * pricePerLitre
  return {
    capNgn: Math.min(backDerived, NOT_SURE_HARD_CAP_NGN_PER_YEAR[segment]),
    overridden: false,
  }
}

/**
 * Chạy toàn bộ quy trình ROI cho một gói + hồ sơ tư vấn. Hàm thuần, không
 * có I/O. Phần toán được mô tả ở đầu tệp.
 */
export function calculateROI(
  plan: NgPlan,
  c: ConsultationInput,
  /**
   * Ghi đè ngân sách năng lượng hằng năm do người dùng điều chỉnh
   * (₦/năm). Khi được đặt, giá trị này thay thế cả mức trần lấy từ điểm
   * giữa của khoảng (nhánh A) lẫn phép suy ngược + mức trần cứng (nhánh
   * B). Dùng bởi thanh trượt "Không chắc chắn" trong `CustomiseCard` để
   * người dùng có thể tăng/giảm mức chi phí giả định mà không cần chạy
   * lại biểu mẫu tư vấn.
   */
  userFuelBudgetOverrideNgn?: number,
): PlanRoi {
  // 1. Tổng kWh hằng năm và cách chia điện lưới / nguồn dự phòng.
  const annualKwh = USAGE_KWH_PER_YEAR[c.electricityUsage] ?? USAGE_KWH_PER_YEAR.unknown
  const genShare = GEN_SHARE_BY_FREQUENCY[c.generatorFrequency] ?? GEN_SHARE_BY_FREQUENCY.unknown
  const gridKwh = annualKwh * (1 - genShare)
  const generatorKwh = annualKwh * genShare

  // 2. Chi phí năng lượng ước tính (dùng để giới hạn khoản tiết kiệm).
  //    Loại nhiên liệu theo phân khúc của gói: homes → PMS,
  //    businesses → AGO.
  const fuelType = fuelTypeFor(plan)
  const { capNgn: annualFuelCostNgn, overridden: fuelCostOverridden } =
    estimateAnnualFuelCostNgn(c, generatorKwh, fuelType, plan.segment, userFuelBudgetOverrideNgn)

  // 3. Sản lượng điện mặt trời năm 1.
  const regionYield = NG_REGION_YIELD[c.region] ?? NG_REGION_YIELD_FALLBACK
  const year1GenKwh = plan.kwp * regionYield

  // 4. Tự tiêu thụ (pin lưu trữ giúp tăng tỷ lệ này).
  const selfConsumptionRate = selfConsumptionRateFor(plan)
  const selfConsumedKwh = Math.min(year1GenKwh * selfConsumptionRate, annualKwh)
  const exportedKwh = Math.max(0, year1GenKwh - selfConsumedKwh)

  // 5. Thay thế - quy tắc không tính trùng.
  // Trước hết là điện lưới, sau đó là nguồn dự phòng.
  const gridDisplacedKwh = Math.min(selfConsumedKwh, gridKwh)
  const gridOffsetNgn = gridDisplacedKwh * NG_GRID_TARIFF_NGN_PER_KWH

  const genDisplacedKwh = Math.max(0, selfConsumedKwh - gridKwh)
  // kWh mỗi ₦ của nguồn dự phòng: (kWh mỗi lít) / (₦ mỗi lít). Loại
  // nhiên liệu của gói quyết định hằng số — PMS cho homes, AGO cho
  // businesses. Mỗi tổ hợp cho một chi phí quy đổi ₦/kWh khác nhau, và
  // giá trị này được dùng cho cả phần thay thế lẫn mức trần của nhánh B.
  const fuelPricePerLitre = fuelType === 'ago' ? NG_AGO_PRICE_NGN_PER_LITRE : NG_PMS_PRICE_NGN_PER_LITRE
  const fuelKwhPerLitre    = fuelType === 'ago' ? NG_AGO_KWH_PER_LITRE        : NG_PMS_KWH_PER_LITRE
  const genKwhPerNgn = fuelKwhPerLitre / fuelPricePerLitre
  const potentialGenOffsetNgn = genDisplacedKwh / genKwhPerNgn
  // Giới hạn theo chi phí năng lượng thực tế của người dùng - không thể
  // ghi nhận khoản tiết kiệm lớn hơn mức họ đang chi. Đây là bảo đảm
  // cốt lõi "không phóng đại".
  const genOffsetNgn = Math.min(potentialGenOffsetNgn, annualFuelCostNgn)

  // 6. Thu nhập từ phát điện lên lưới (hiện tính bằng 0 vì giá chờ xác nhận).
  const exportIncomeNgn = exportedKwh * 0

  // 7. Chi phí vận hành hằng năm. Hiện bằng 0 (chế độ lý tưởng — xem
  //    chú thích NG_OPEX_PCT). Khi bật lại, đổi về
  //    `plan.priceNgn * NG_OPEX_PCT` và vòng lặp 30 năm bên dưới sẽ tự
  //    động áp dụng.
  const opexNgn = plan.priceNgn * NG_OPEX_PCT

  // 8. Tổng cộng. Ở chế độ lý tưởng `netSavingsNgn == grossSavingsNgn`.
  const grossSavingsNgn = gridOffsetNgn + genOffsetNgn + exportIncomeNgn
  const netSavingsNgn = grossSavingsNgn - opexNgn

  // 9. Thời gian hoàn vốn trên giá hệ thống (giới hạn theo vòng đời).
  const paybackYears =
    netSavingsNgn > 0
      ? Math.min(
          NG_PROJECT_LIFETIME_YEARS,
          Math.round((plan.priceNgn / netSavingsNgn) * 10) / 10,
        )
      : Infinity

  // 10. Tổng vòng đời 30 năm, áp dụng suy giảm theo từng năm.
  let total30YearSaving = 0
  for (let i = 0; i < NG_PROJECT_LIFETIME_YEARS; i++) {
    const yearGen = year1GenKwh * DEGRADATION_FACTORS[i]
    const yearSelfConsumed = Math.min(yearGen * selfConsumptionRate, annualKwh)
    const yearGridDisplaced = Math.min(yearSelfConsumed, gridKwh)
    const yearGenDisplaced = Math.max(0, yearSelfConsumed - gridKwh)
    const yearGridOffset = yearGridDisplaced * NG_GRID_TARIFF_NGN_PER_KWH
    const yearGenOffset = Math.min(
      yearGenDisplaced / genKwhPerNgn,
      annualFuelCostNgn,
    )
    const yearSavings = yearGridOffset + yearGenOffset - opexNgn
    total30YearSaving += yearSavings
  }
  const total30YearSavingNgn = Math.round(total30YearSaving)
  const total30YearReturnNgn = total30YearSavingNgn - plan.priceNgn
  // Backward-compat aliases - same numbers, GBP field names.
  const total30YearSavingGbp = total30YearSavingNgn
  const total30YearReturnGbp = total30YearReturnNgn
  const roiPct =
    plan.priceNgn > 0
      ? Math.round(((total30YearSavingNgn / plan.priceNgn) - 1) * 100)
      : 0

  return {
    annualGenerationKwh: Math.round(year1GenKwh),
    annualSelfConsumedKwh: Math.round(selfConsumedKwh),
    annualExportedKwh: Math.round(exportedKwh),
    annualGridOffsetNgn: Math.round(gridOffsetNgn),
    annualGeneratorOffsetNgn: Math.round(genOffsetNgn),
    annualExportIncomeNgn: Math.round(exportIncomeNgn),
    annualSavingNgn: Math.round(grossSavingsNgn),
    annualNetSavingNgn: Math.round(netSavingsNgn),
    annualOpexNgn: Math.round(opexNgn),
    paybackYears,
    total30YearSavingNgn,
    total30YearReturnNgn,
    roiPct,
    priceNgn: plan.priceNgn,
    appliedAnnualFuelCostNgn: annualFuelCostNgn,
    fuelCostOverridden,
    appliedRegionYield: regionYield,
    appliedAnnualKwh: annualKwh,
    appliedGeneratorShare: genShare,
    // Backward-compat aliases. The `*Gbp` fields used to be the live
    // UK-ladder savings in £; the values are now ₦ even though the
    // names are unchanged. `offerPriceGbp` is the system price with
    // no UK-style flat discount; `offerValidUntil` is 30 days out
    // from "now" (matches the old OfferCard expectation).
    offerPriceNgn: plan.priceNgn,
    offerPriceGbp: plan.priceNgn,
    offerValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    annualSavingGbp: Math.round(grossSavingsNgn),
    total30YearSavingGbp,
    total30YearReturnGbp,
    annualExportIncomeGbp: Math.round(exportIncomeNgn),
    annualImportOffsetGbp: Math.round(gridOffsetNgn),
  }
}

/* ──────────────────────────────────────────────────────────────────────
   Xuất lại để tương thích ngược
   Các component và bảng admin vẫn import các tên `PLANS`, `Plan`,
   `PlanId`, `RoiAssumptions` kiểu UK cũ. Cho đến khi các nơi gọi này
   được chuyển sang kiểu hiện tại, ta giữ các alias trỏ vào danh mục hiện
   hành. Giá trị số hiện là ₦, không phải £ - nên các nơi còn dùng
   `formatGBP` nên chuyển sang `formatNGN`.
   ────────────────────────────────────────────────────────────────────── */

export type Plan = NgPlan
export type PlanId = NgPlanId

/** Danh sách gói kiểu UK cũ, được giữ làm alias của danh mục hiện hành. */
export const PLANS: Plan[] = NG_PLANS

export function getPlan(id: PlanId): Plan {
  return getNgPlan(id)
}

export function findPlanByPrice(_priceGbp: number): Plan | undefined {
  // Legacy: price lookups were by GBP. The current catalogue keys by id -
  // callers that previously used this should switch to `getNgPlan(id)`.
  return undefined
}

/** Legacy alias. */
export type ConsumptionTierCompat = ConsumptionTier
/** Legacy alias. */
export type HeavyDeviceCompat = HeavyDevice

/** Giả định mặc định cũ - từng là £0.2632/kWh giá mua và £0.15/kWh giá
 *  bán. Công cụ tính hiện bỏ qua các giá trị này và dùng các hằng số biểu
 *  giá tích hợp sẵn. Vẫn được xuất để mọi import còn tham chiếu không bị
 *  lỗi biên dịch. */
export interface RoiAssumptions {
  importPriceGbp: number
  exportPriceGbp: number
  selfConsumptionRate: number
}

export function defaultAssumptions(_plan: Plan): RoiAssumptions {
  return {
    importPriceGbp: NG_GRID_TARIFF_NGN_PER_KWH,
    exportPriceGbp: 0,
    selfConsumptionRate: 0,
  }
}

export const DEFAULT_ROI_IMPORT_PRICE_GBP = NG_GRID_TARIFF_NGN_PER_KWH
export const DEFAULT_ROI_EXPORT_PRICE_GBP = 0
export const ROI_SELF_CONSUMPTION_BASE_RATE = 0.40
export const ROI_IMPORT_PRICE_MIN = 0
export const ROI_IMPORT_PRICE_MAX = 500
export const ROI_IMPORT_PRICE_STEP = 1
export const ROI_EXPORT_PRICE_MIN = 0
export const ROI_EXPORT_PRICE_MAX = 0
export const ROI_EXPORT_PRICE_STEP = 1
export const ROI_SELF_CONSUMPTION_MIN = 0
export const ROI_SELF_CONSUMPTION_MAX = 1
export const ROI_SELF_CONSUMPTION_STEP = 0.01

// Touch the import so it doesn't get flagged as unused while the
// marketing surface still sources its 6 solutions from the same data.
void solutionDetails

// Touch the marketing data to keep the linter honest about the
// single-source-of-truth contract between the marketing surface and
// the calculator. (No runtime cost; this compiles away.)
void NG_PLANS.length
