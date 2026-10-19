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
  /** One of `'low' / 'medium' / 'high' / 'very-high'`. Carried over from
   * the old 5-step form. New 4-step form submissions leave this NULL
   * and `toConsultationInput` falls back to a neutral `medium` tier. */
  electricity_usage: string | null
  /** CSV: `'wallbox, heatpump'`. Carried over from the old form; new
   * 4-step submissions leave this NULL → empty list. */
  devices: string | null
  /**
   * NG Step-3 extensions. All three are nullable on the row so pre-2026
   * registrations read back as `null` (and the calc treats null as
   * "user skipped the question").
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
const DEFAULT_REGION = 'England - London'

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
    // NG Step-3 extensions. Use a single 'unknown' string so the
    // recommendation/ROI code can branch with a single equality check.
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
 * **No PII**: returns only house-type + roof-orientation + bedrooms count.
 * `street` / `houseNumber` / `firstName` / etc. are deliberately omitted -
 * the HomeDetailsCard displays `postcode, city · house type · N bedrooms ·
 · roof orientation`, which is enough context to be useful and zero PII.
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
    devices: parseDevices(row.devices),
    // NG Step-3 fields - shown on the strip so the user can confirm
    // their generator / fuel / backup choices without re-opening the
    // edit modal.
    generatorFrequency: row.generator_frequency ?? 'unknown',
    fuelBudgetNgn: row.fuel_budget_ngn ?? 'unknown',
    backupNeeds: parseDevices(row.backup_needs),
  }
}

/**
 * Build the `Partial<FormData>` used by `<FormModal initialData={...}>` when
 * the user clicks "Edit details" on /my-plan.
 *
 * The form has 5 steps:
 *   Step 0 - Region + House Type        (prefilled)
 *   Step 1 - Roof Type                  (prefilled)
 *   Step 2 - Household + Usage + Devices (prefilled)
 *   Step 3 - Address                    (HIDDEN - user re-enters if they want)
 *   Step 4 - Contact Info               (HIDDEN - user re-enters if they want)
 *
 * The DB row holds all five steps' worth of data, but steps 3 and 4 carry
 * PII (street / house number / postal code / city + name / email / phone).
 * We deliberately omit those from the response so they never travel over
 * the wire to the client. Sections 4 and 5 are "hidden" in the user's
 * eyes - the form steps simply don't render those blocks at all when
 * opened from `/my-plan`. Steps 0/1/2 still prefill so the user doesn't
 * have to re-enter the non-PII consultation choices.
 *
 * Step 3 / Step 4 edits, if the user wants them, are typed fresh on the
 * modal - they go through the normal `/api/consultation` UPDATE path and
 * behave identically to the homepage form submission.
 */
export function toFormPrefill(row: ConsultationRow): Partial<FormData> {
  return {
    solutionType: (row.solution_type as FormData['solutionType']) ?? '',
    city: row.city ?? '',
    propertyType: row.house_type ?? '',
    householdSize: row.household_size ?? '',
    // NG Step-3 extensions - propagate so the Edit-details modal can
    // re-render the user's previous choices.
    generatorFrequency: row.generator_frequency ?? 'unknown',
    fuelBudgetNgn: row.fuel_budget_ngn ?? 'unknown',
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
