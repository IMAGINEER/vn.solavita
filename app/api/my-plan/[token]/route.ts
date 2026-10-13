/**
 * GET /api/my-plan/[token]
 *
 * Looks up a `consultation_leads` row by its public `plan_token` UUID and
 * returns the shapes `/my-plan` needs:
 *   - `consultation` - the camelCase `ConsultationInput` consumed by
 *     `recommendPlan()` and `calculateROI()`.
 *   - `address` - `HomeDetails` for the top-of-page strip.
 *   - `prefill` - non-PII `Partial<FormData>` (region / house type /
 *     roof type / household / usage / devices). Address + personal info
 *     are deliberately excluded - the Edit-details modal hides Steps 3
 *     and 4 when opened from `/my-plan`, and even if a stale client
 *     surfaces those inputs, the API never sends the original values.
 *
 * The route does **not** verify ownership (no auth). Rationale: a UUID v4
 * is 122 bits of entropy, the token is single-purpose, and the data is
 * already a quote-style summary that the customer themselves submitted.
 * If we later add a portal login, narrow this with a `select ... where
 * email = auth.email()` predicate.
 *
 * Response shape:
 *   200: { found: true, consultation, address, prefill, token }
 *   400: { found: false, error: 'invalid_token' }
 *   404: { found: false }
 *   500: { found: false, error: 'db_unavailable' }
 *
 * **PII policy**: address columns (`postal_code`, `city`, `street`,
 * `house_number`) and personal-info columns (`salutation`, `first_name`,
 * `last_name`, `email`, `phone`) are NEVER selected from `consultation_leads`
 * - they're omitted from the `.select(...)` call entirely so they
 * never travel to the client over this endpoint. The Edit-details modal
 * on /my-plan also hides Steps 3 (Address) and 4 (Contact Info) for
 * the same reason. Strip data + prefill are derived from the 6 editable
 * consultation fields (region / houseType / roofType / householdSize /
 * electricityUsage / devices).
 */

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import {
  toConsultationInput,
  toHomeDetails,
  toFormPrefill,
  type ConsultationRow,
} from '@/lib/my-plan/adapter'

/** Match a UUID v4 (any casing). Reject before hitting Supabase. */
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params

  if (!UUID_RE.test(token)) {
    return NextResponse.json(
      { found: false, error: 'invalid_token' },
      { status: 400 },
    )
  }

  const { data, error } = await supabase
    .from('consultation_leads')
    .select(
      [
        // Identification + lookup
        'id',
        'plan_token',
        'country',
        'created_at',
        'updated_at',
        // Consultation inputs (Steps 0/1/2 in the form). Address
        // (postal_code, city, street, house_number) and personal info
        // (salutation, first_name, last_name, email, phone) are
        // deliberately NOT selected so they never leave the DB on this
        // path - see the route header.
        'region',
        'house_type',
        'roof_type',
        'household_size',
        'electricity_usage',
        'devices',
      ].join(', '),
    )
    .eq('plan_token', token)
    // All Solavita sites (NG/UK/DE/IT) share the same Supabase project.
    // Restrict to NG rows so another site's token can't accidentally
    // resolve here.
    .eq('country', 'ng')
    .maybeSingle()

  if (error) {
    console.error('[/api/my-plan] DB error:', error)
    return NextResponse.json(
      { found: false, error: 'db_unavailable' },
      { status: 500 },
    )
  }

  if (!data) {
    return NextResponse.json({ found: false }, { status: 404 })
  }

  // Supabase returns the row typed as `unknown` shape (GenericRow) when
  // you `.select(col1, col2, ...)`. Treat it as our snake_case adapter
  // shape - both sides agree on field names because we listed them.
  const row = data as unknown as ConsultationRow

  // Record this page visit. Idempotent via the SECURITY DEFINER RPC
  // `record_my_plan_open(uuid)` - first-opened preserved, last-opened
  // always updated. Failure here is non-fatal: the user still sees
  // their plan. Errors are logged for diagnostics only.
  try {
    const { error: trackError } = await supabase.rpc('record_my_plan_open', {
      p_token: token,
    })
    if (trackError) {
      console.error('[/api/my-plan] failed to record open:', trackError)
    }
  } catch (trackErr) {
    console.error('[/api/my-plan] open tracking threw:', trackErr)
  }

  return NextResponse.json({
    found: true,
    consultation: toConsultationInput(row),
    address: toHomeDetails(row),
    prefill: toFormPrefill(row),
    token,
  })
}