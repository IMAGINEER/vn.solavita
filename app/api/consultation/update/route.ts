/**
 * POST /api/consultation/update
 *
 * Lightweight "Confirm edition" endpoint for the `/my-plan` Edit-details
 * modal. Distinct from `POST /api/consultation` (which still handles new
 * registrations and full re-submits from the homepage form).
 *
 * Differences vs the full endpoint:
 *   - **No PII in the payload.** The Edit-details modal hides Step 1
 *     (solutionType — already chosen at registration) and Step 4
 *     (Contact Info) and never surfaces personal data to the client,
 *     so the body here is just the Step-2 + Step-3 fields.
 *   - **Identified by `plan_token`** instead of email dedup. The page
 *     already has the token in the URL.
 *   - **UPDATE only**, never INSERT. If the token is unknown (e.g. user
 *     landed on a stale link), the request returns 404 - no fallback to
 *     INSERT because that would create a row without address/contact.
 *   - **No email sent.** A consultation confirmation was already sent
 *     when the lead originally registered; we don't re-send on edit.
 *
 * Server enforcement: this route only writes the columns listed below
 * even if the client tries to include PII fields in the payload. Those
 * keys are stripped before the UPDATE.
 */

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      planToken,
      // Step 2 (replaces the old Step-1 region / houseType + Step-0
      // roofType). city is now the only required field; propertyType
      // is required by the form so it stays required here.
      city,
      propertyType,
      // Step 3 — householdSize required.
      householdSize,
    } = body

    // Validate the bearer. UUID-only - same regex the lookup route uses
    // so error semantics line up (400 invalid_token).
    if (typeof planToken !== 'string' || !UUID_RE.test(planToken)) {
      return NextResponse.json(
        { success: false, message: 'Invalid plan token' },
        { status: 400 },
      )
    }

    // Validate the 3 editable required fields: city + propertyType +
    // householdSize.
    const missing: string[] = []
    if (!city) missing.push('city')
    if (!propertyType) missing.push('propertyType')
    if (!householdSize) missing.push('householdSize')
    if (missing.length) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing fields: ${missing.join(', ')}`,
        },
        { status: 400 },
      )
    }

    // Find the row. `.eq('country', 'vn')` keeps other sites' tokens
    // out of this endpoint even if they're somehow reachable - defence-
    // in-depth since the form is only ever opened from /my-plan on
    // the VN site.
    const { data: existing, error: lookupError } = await supabase
      .from('consultation_leads')
      .select('id')
      .eq('plan_token', planToken)
      .eq('country', 'vn')
      .maybeSingle()

    if (lookupError) {
      console.error('[/api/consultation/update] lookup error:', lookupError)
      return NextResponse.json(
        { success: false, message: 'Đã xảy ra lỗi. Vui lòng thử lại.' },
        { status: 500 },
      )
    }

    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Plan not found' },
        { status: 404 },
      )
    }

    // Whitelist the writable columns explicitly - ignore anything else
    // the client might sneak in. The full endpoint at /api/consultation
    // owns name/email/phone/address; we don't.
    //
    // Fields that were dropped from the 4-step form (roof_type,
    // electricity_usage, devices, backup_needs, region, address)
    // are no longer written — leaving them untouched on UPDATE so
    // historical values from old-form submissions stay intact.
    const updatePayload = {
      city,
      house_type: propertyType,
      household_size: householdSize,
      // Generator/fuel fields are no longer collected on the VN site;
      // keep them NULL so historical rows from other country sites stay put.
      generator_frequency: null,
      fuel_budget_ngn: null,
      updated_at: new Date().toISOString(),
    }

    const { error: updateError } = await supabase
      .from('consultation_leads')
      .update(updatePayload)
      .eq('id', existing.id)

    if (updateError) {
      console.error('[/api/consultation/update] update error:', updateError)
      return NextResponse.json(
        { success: false, message: 'Đã xảy ra lỗi. Vui lòng thử lại.' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Thông tin của bạn đã được cập nhật.',
    })
  } catch (error) {
    console.error('[/api/consultation/update] error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, message: `Internal server error: ${errorMessage}` },
      { status: 500 },
    )
  }
}