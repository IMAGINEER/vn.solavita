/**
 * Shared form data contract between the client form and server API route.
 * Field names are camelCase on the wire. Server (`app/api/consultation/route.ts`)
 * destructures these names and maps them to snake_case Supabase columns.
 *
 * Shape mirrors the 5-step Get-Free-Quote form:
 *   Step 1: `solutionType` — what the user is interested in
 *           ('home' | 'balcony' | 'business' | 'exploring').
 *   Step 2: `city`, `propertyType` — site location + property shape.
 *   Step 3: `householdSize`, `electricityUsage`, `daytimeRatio` —
 *           sizing inputs. `electricityUsage` keeps the legacy
 *           low/medium/high/very-high/unknown IDs but the UI asks for
 *           a monthly kWh band; `daytimeRatio` is the new share of
 *           electricity used during daylight.
 *   Step 4: `roofType` — roof material/shape, required.
 *   Step 5: `salutation`, `firstName`, `lastName`, `email`, `phone` —
 *           contact info. (Address fields were dropped; `city` now
 *           comes from Step 2.)
 *
 * Adding fields: update BOTH this type AND the API route AND Form.tsx state.
 * Removing fields: same triple. Several fields from the previous 5-step
 * shape (`devices`, `backupNeeds`, `street`, `houseNumber`,
 * `postalCode`) are intentionally gone. They are still written by the
 * /my-plan Edit-details update route which accepts a slimmer body — the
 * public form just doesn't surface them any more.
 */
export interface FormData {
  /** Step 1 — "What kind of solutions are you interested in?" */
  solutionType: 'home' | 'balcony' | 'business' | 'exploring' | ''
  /** Step 2 Q1 — "Which city is your property in?" */
  city: string
  /** Step 2 Q2 — property type. New 4-option set from docx. */
  propertyType: string
  /** Step 3 Q1 — household size, required. */
  householdSize: string
  /** Step 3 Q2 — monthly electricity-use band. Reuses the legacy tier
   *  IDs ('low' | 'medium' | 'high' | 'very-high' | 'unknown') so the
   *  /my-plan sizing engine keeps working unchanged. */
  electricityUsage: string
  /** Step 3 Q3 — share of electricity used during the day.
   *  'under-30' | '30-50' | '50-70' | 'over-70' | 'unknown'. */
  daytimeRatio: string
  /** Step 4 — roof type / material.
   *  'flat' | 'tile' | 'metal' | 'balcony' | 'other'. */
  roofType: string
  /** Step 5 — contact info. */
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
 * Step 4 roofType is required. Step 5 contact fields are required.
 *
 * The two Step-3 sizing extras (`electricityUsage`, `daytimeRatio`)
 * are required by the client form but tolerated as missing by the
 * server so older submissions / the /my-plan update route never 400.
 */
export const REQUIRED_FIELDS: ReadonlyArray<keyof FormData> = [
  'solutionType',
  'city',
  'propertyType',
  'householdSize',
  'roofType',
  'salutation',
  'firstName',
  'lastName',
  'email',
] as const
