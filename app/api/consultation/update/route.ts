/**
 * POST /api/consultation/update
 *
 * Lightweight "Confirm edition" endpoint for the `/my-plan` Edit-details
 * modal. Distinct from `POST /api/consultation` (which still handles new
 * registrations and full re-submits from the homepage form).
 *
 * Differences vs the full endpoint:
 *   - **No PII in the payload.** The Edit-details modal hides Steps 3
 *     (Address) and 4 (Contact Info) and never surfaces personal data to
 *     the client, so the body here is just the 6 Steps-0/1/2 fields.
 *   - **Identified by `plan_token`** instead of email dedup. The page
 *     already has the token in the URL.
 *   - **UPDATE only**, never INSERT. If the token is unknown (e.g. user
 *     landed on a stale link), the request returns 404 - no fallback to
 *     INSERT because that would create a row without address/contact.
 *   - **No email sent.** A consultation confirmation was already sent
 *     when the lead originally registered; we don't re-send on edit.
 *
 * Server enforcement: this route only writes the 6 columns listed below
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
      region,
      houseType,
      roofType,
      householdSize,
      electricityUsage,
      devices,
    } = body

    // Validate the bearer. UUID-only - same regex the lookup route uses
    // so error semantics line up (400 invalid_token).
    if (typeof planToken !== 'string' || !UUID_RE.test(planToken)) {
      return NextResponse.json(
        { success: false, message: 'Invalid plan token' },
        { status: 400 },
      )
    }

    // Validate the 6 editable fields. Match the same required-by-the-form
    // semantics: `region`, `houseType`, `roofType`, `householdSize` must be
    // non-empty strings; `electricityUsage` may be empty or the sentinel
    // 'unknown' (Not Sure) so the customer can skip the question; `devices`
    // may be `[]`.
    const missing: string[] = []
    if (!region) missing.push('region')
    if (!houseType) missing.push('houseType')
    if (!roofType) missing.push('roofType')
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

    // Find the row. `.eq('country', 'uk')` keeps a DE token out of this
    // endpoint even if it's somehow reachable - defence-in-depth since
    // the form is only ever opened from /my-plan on the UK site.
    const { data: existing, error: lookupError } = await supabase
      .from('consultation_leads')
      .select('id')
      .eq('plan_token', planToken)
      .eq('country', 'uk')
      .maybeSingle()

    if (lookupError) {
      console.error('[/api/consultation/update] lookup error:', lookupError)
      return NextResponse.json(
        { success: false, message: 'Something went wrong. Please try again.' },
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
    const updatePayload = {
      region,
      house_type: houseType,
      roof_type: roofType,
      household_size: householdSize,
      // 'unknown' (Not Sure sentinel from the form) → NULL so admin
      // LeadsTable skips the Usage row entirely instead of rendering 'unknown'.
      electricity_usage: electricityUsage === 'unknown' ? null : (electricityUsage || null),
      devices: Array.isArray(devices) ? devices.join(', ') : '',
      updated_at: new Date().toISOString(),
    }

    const { error: updateError } = await supabase
      .from('consultation_leads')
      .update(updatePayload)
      .eq('id', existing.id)

    if (updateError) {
      console.error('[/api/consultation/update] update error:', updateError)
      return NextResponse.json(
        { success: false, message: 'Something went wrong. Please try again.' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Your details have been updated.',
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