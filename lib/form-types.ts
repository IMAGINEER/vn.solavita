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
  street: string
  houseNumber: string
  postalCode: string
  city: string
  salutation: string
  firstName: string
  lastName: string
  email: string
  phone: string
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