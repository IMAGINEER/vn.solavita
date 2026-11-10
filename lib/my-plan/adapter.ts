/**
 * Adapter: `consultation_leads` DB row → UI-facing shapes.
 *
 * The DB stores snake_case; the rest of `/my-plan` consumes camelCase
 * `ConsultationInput` (from `_lib/calc.ts`) and `HomeDetails` (also from
 * `_lib/calc.ts`). Keeping these adapters isolated means calc + components
 * stay DB-agnostic.
 *
 * Devices quirk: `consultation_leads.devices` is stored as a comma-joined
 * string (`'wallbox, heatpump'`), not an array. We split it back on the
 * server side here so the rest of the pipeline keeps working with arrays.
 *
 * Privacy contract - what we **do not** expose to the client for
 * `/my-plan`'s `prefill`:
 *   - Personal info (firstName / lastName / email / phone / salutation)
 *   - Address details (street / houseNumber / postalCode / city)
 *
 * Those columns exist in the row but `toFormPrefill()` deliberately
 * omits them. The DB row is only fetched server-side; the client never
 * receives PII through this path.
 */

import type { ConsultationInput, HomeDetails, ConsumptionTier } from '@/app/my-plan/_lib/calc'
import type { FormData } from '@/lib/form-types'

/**
 * Shape of a `consultation_leads` row, as returned by Supabase.
 * Mirrors the columns written by `app/api/consultation/route.ts` plus the
 * new `plan_token` column. Types are intentionally loose - Supabase returns
 * `null` for any unset column regardless of NOT NULL constraints, so we
 * accept `null` everywhere and normalise on read.
 */
export interface ConsultationRow {
  id: string
  salutation: string | null
  first_name: string | null
  last_name: string | null
  email: string
  phone: string | null
  street: string | null
  house_number: string | null
  postal_code: string | null
  city: string | null
  region: string | null
  house_type: string | null
  roof_type: string | null
  /**
   * Step 1 from the 4-step form. `'home' | 'business' | 'exploring'`.
   * Nullable for rows registered before this column existed.
   */
  solution_type: string | null
  /**
   * One of `'1' / '2' / '3' / '4' / '5+'`. The form sends these literal
   * IDs from `components/Form.tsx`'s HOUSEHOLD_SIZES array and the API
   * route writes them straight through.
   */
  household_size: string | null
  /** One of `'low' / 'medium' / 'high' / 'very-high' / 'unknown'` —
   * the monthly-consumption band question in step 3. */
  electricity_usage: string | null
  /** Share of electricity used during daylight. `'under-30' | '30-50'
   *  | '50-70' | 'over-70' | 'unknown'`. VN-only column added
   *  2026-11-06; NULL for other country sites and older VN rows. */
  daytime_usage_ratio: string | null
  /** CSV: `'wallbox, heatpump'`. Carried over from the old form; new
   * 4-step submissions leave this NULL → empty list. */
  devices: string | null
  /**
   * Các trường mở rộng ở bước 3 (tần suất dùng nguồn dự phòng, ngân sách
   * năng lượng). Cả ba đều có thể null trên hàng dữ liệu nên các đăng ký
   * cũ đọc về `null` (và phần tính toán coi null là "người dùng đã bỏ qua
   * câu hỏi").
   */
  generator_frequency: string | null
  fuel_budget_ngn: string | null
  /** CSV: `'lights, fridge, ac'`. Carried over from the old form; new
   * 4-step submissions leave this NULL → empty list. */
  backup_needs: string | null
  country: string | null
  plan_token: string
  created_at: string
  updated_at: string
}

/** Defensive defaults when the row is missing fields (e.g. legacy rows). */
const DEFAULT_HOUSEHOLD_SIZE: ConsultationInput['householdSize'] = '3'
const DEFAULT_USAGE: ConsumptionTier = 'medium'
/** Khu vực mặc định khi hàng tư vấn không có thông tin khu vực. Biểu mẫu
 *  đã ngừng thu thập khu vực nên đây là giá trị hầu hết phương án hiển
 *  thị. Giá trị này cố ý KHÔNG trùng khoá nào trong bảng sản lượng theo
 *  khu vực: phần tính toán coi khu vực chưa xác định là mức sản lượng
 *  trung bình quốc gia (`NG_REGION_YIELD_FALLBACK`), và giao diện hiển
 *  thị đây là khu vực mặc định thay vì nêu tên một địa phương chưa từng
 *  được thu thập. */
const DEFAULT_REGION = 'Việt Nam'

/**
 * Build the `ConsultationInput` that feeds `recommendPlan()` + `calculateROI()`.
 * Decodes the CSV `devices` column into an array, falling back to `[]` for
 * missing values so the recommender's `for...of` loop is a no-op.
 */
export function toConsultationInput(row: ConsultationRow): ConsultationInput {
  return {
    householdSize: (row.household_size ?? DEFAULT_HOUSEHOLD_SIZE) as ConsultationInput['householdSize'],
    // The 4-step form dropped electricityUsage / devices / region /
    // backupNeeds. Pre-2026 rows still carry them; the calc still
    // reads them. New rows read as NULL → fall back to a neutral
    // 'medium' usage tier and an empty device / backup list so the
    // recommendation engine doesn't bias toward a heavier or lighter
    // package.
    electricityUsage: (row.electricity_usage ?? DEFAULT_USAGE) as ConsumptionTier,
    devices: parseDevices(row.devices),
    region: row.region ?? DEFAULT_REGION,
    // Các trường mở rộng ở bước 3. Dùng một chuỗi 'unknown' duy nhất để
    // phần gợi ý/ROI chỉ cần một phép so sánh bằng.
    generatorFrequency: (row.generator_frequency ?? 'unknown') as ConsultationInput['generatorFrequency'],
    fuelBudgetNgn: (row.fuel_budget_ngn ?? 'unknown') as ConsultationInput['fuelBudgetNgn'],
    backupNeeds: parseDevices(row.backup_needs),
  }
}

/**
 * Build the `HomeDetails` for the top-of-page strip. Maps the form's
 * `'5+'` household ID to `bedrooms: 5` (it's the upper bound); other IDs
 * are numeric and parse cleanly.
 *
 * **Không chứa PII**: chỉ trả về khu vực, loại nhà, loại mái, số người
 * và nhu cầu sử dụng. `street` / `houseNumber` / `firstName` / v.v. được
 * cố ý bỏ qua - HomeDetailsCard hiển thị `khu vực · loại nhà · số người ·
 * loại mái`, đủ ngữ cảnh để hữu ích mà không có PII.
 */
export function toHomeDetails(row: ConsultationRow): HomeDetails {
  const sizeRaw = row.household_size ?? DEFAULT_HOUSEHOLD_SIZE
  const householdSize =
    sizeRaw === '5+' ? 5 : Math.max(1, parseInt(sizeRaw, 10) || 3)
  // No PII: address columns (postcode, city, street, house_number) and
  // personal-info columns (first_name, last_name, email, phone) are
  // deliberately omitted. The strip displays only the 6 editable
  // consultation fields so the Edit-details modal's "hidden address +
  // contact info" rule is mirrored on /my-plan.
  return {
    houseType: row.house_type ?? '',
    householdSize,
    roofOrientation: row.roof_type ?? '',
    region: row.region ?? DEFAULT_REGION,
    electricityUsage: row.electricity_usage ?? DEFAULT_USAGE,
    daytimeRatio: row.daytime_usage_ratio ?? '',
    devices: parseDevices(row.devices),
    // Các trường mở rộng ở bước 3 - hiển thị trên dải thông tin để người
    // dùng xác nhận lựa chọn nguồn dự phòng / năng lượng mà không cần mở
    // lại biểu mẫu chỉnh sửa.
    generatorFrequency: row.generator_frequency ?? 'unknown',
    fuelBudgetNgn: row.fuel_budget_ngn ?? 'unknown',
    backupNeeds: parseDevices(row.backup_needs),
  }
}

/**
 * Build the `Partial<FormData>` used by `<FormModal initialData={...}>` when
 * the user clicks "Edit details" on /my-plan.
 *
 * The modal opens with `hideAddressAndContact`, which renders the
 * non-PII steps only:
 *   Solution            (not rendered - already chosen at registration)
 *   Site + property     (prefilled)
 *   Household + usage   (prefilled)
 *   Roof type           (prefilled)
 *   Contact info        (not rendered - PII)
 *   Review              (built from the fields above)
 *
 * The DB row holds the PII columns (street / house number / postal code
 * / city + name / email / phone) but we deliberately omit them from the
 * response so they never travel over the wire to the client.
 */
export function toFormPrefill(row: ConsultationRow): Partial<FormData> {
  return {
    solutionType: (row.solution_type as FormData['solutionType']) ?? '',
    city: row.city ?? '',
    propertyType: row.house_type ?? '',
    householdSize: row.household_size ?? '',
    electricityUsage: row.electricity_usage ?? '',
    daytimeRatio: row.daytime_usage_ratio ?? '',
    roofType: row.roof_type ?? '',
    // Máy phát / ngân sách nhiên liệu không được thu thập trên site VN,
    // nên hai trường lịch sử này không có trong dữ liệu điền sẵn.
  }
}

/** Comma-separated string → array of trimmed IDs, dropping empties. */
function parseDevices(csv: string | null): Array<string> {
  if (!csv) return []
  return csv
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}
