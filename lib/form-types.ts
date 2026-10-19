/**
 * Shared form data contract between the client form and server API route.
 * Field names are camelCase on the wire. Server (`app/api/consultation/route.ts`)
 * destructures these names and maps them to snake_case Supabase columns.
 *
 * Shape mirrors the 4-step Get-Free-Quote form per `docs/修改建议.docx`:
 *   Step 1 (new)  : `solutionType` — what the user is interested in.
 *   Step 2 (was 1): `city`, `propertyType` — site location + property shape.
 *   Step 3 (new)  : `householdSize` (required) + `generatorFrequency` /
 *                   `fuelBudgetNgn` (optional) — sizing inputs.
 *   Step 4 (was 5): `salutation`, `firstName`, `lastName`, `email`,
 *                   `phone` — contact info. (Address fields were
 *                   dropped; `city` now comes from Step 2.)
 *
 * Adding fields: update BOTH this type AND the API route AND Form.tsx state.
 * Removing fields: same triple. Several fields from the previous 5-step
 * shape (`roofType`, `electricityUsage`, `devices`, `backupNeeds`,
 * `street`, `houseNumber`, `postalCode`) are intentionally gone; the
 * docx removed them. They are still written by the /my-plan Edit-details
 * update route which accepts a slimmer body — the public form just
 * doesn't surface them any more.
 */
export interface FormData {
  /** Step 1 — "What kind of solutions are you interested in?" */
  solutionType: 'home' | 'business' | 'exploring' | ''
  /** Step 2 Q1 — "Which city is your property in?" */
  city: string
  /** Step 2 Q2 — property type. New 4-option set from docx. */
  propertyType: string
  /** Step 3 Q1 — household size, required. */
  householdSize: string
  /**
   * Step 3 Q2 / Q3 — NG generator usage / monthly fuel budget.
   * Both optional ('unknown' sentinel) so the form doesn't block
   * submission. The calc reads them to estimate generator-side
   * savings; missing values fall back to neutral defaults.
   */
  generatorFrequency?: string
  fuelBudgetNgn?: string
  /** Step 4 — contact info. */
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
 * Step 1 solutionType is required (it's a single-tap choice). Step 2
 * city + propertyType are required. Step 3 householdSize is required.
 * Step 4 contact fields are required.
 */
export const REQUIRED_FIELDS: ReadonlyArray<keyof FormData> = [
  'solutionType',
  'city',
  'propertyType',
  'householdSize',
  'salutation',
  'firstName',
  'lastName',
  'email',
] as const
