/**
 * Shared form data contract between the client form and server API route.
 * Field names are camelCase on the wire. Server (`app/api/consultation/route.ts`)
 * destructures these names and maps them to snake_case Supabase columns.
 *
 * Adding fields: update BOTH this type AND the API route AND Form.tsx state.
 * Removing fields: same triple.
 */
export interface FormData {
  region: string
  houseType: string
  roofType: string
  householdSize: string
  electricityUsage: string
  devices: string[]
  /**
   * NG Step-3 extensions — all optional, no validation, don't block submit.
   * They feed the My-Plan recommendation + ROI calc to estimate generator
   * replacement value and battery sizing. Three brand-new fields; the
   * underlying DB columns are nullable so existing rows stay untouched.
   *
   * - `generatorFrequency` - 'rarely' | 'sometimes' | 'daily' | 'frequently' | 'unknown'
   *   (maps to a 4-step CardSelect in the form).
   * - `fuelBudgetNgn` - one of the tier IDs in `lib/data/fuel-budgets.ts`
   *   (a Not-Sure sentinel maps to 'unknown').
   * - `backupNeeds` - multi-select list of `BACKUP_NEEDS` ids (lights/ac/etc).
   */
  generatorFrequency?: string
  fuelBudgetNgn?: string
  backupNeeds?: string[]
  street: string
  houseNumber: string
  postalCode: string
  city: string
  salutation: string
  firstName: string
  lastName: string
  email: string
  phone: string
  /**
   * Free-text tag set when the user opens the modal from a tier detail
   * page (e.g. "Home Energy Pro") or a similar package context. Never
   * user-typed in Form.tsx; only seeded via `openFormModal(prefill)` so
   * it's optional everywhere else.
   */
  interestedProduct?: string
}

/**
 * Required-by-API fields (server returns 400 if any are missing).
 * Phone is always optional; the rest must be present.
 */
export const REQUIRED_FIELDS: ReadonlyArray<keyof FormData> = [
  'salutation',
  'firstName',
  'lastName',
  'email',
  'postalCode',
  'city',
] as const