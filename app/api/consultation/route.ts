import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { consultationConfirmationEmail } from '@/lib/emails/consultation-confirmation'
import { sendEmail } from '@/lib/emails/send'

/**
 * Base URL used to build the personalised /my-plan link baked into the
 * confirmation email. Drives the "Plan: opened" lifecycle transition:
 * the customer must click this link for `record_my_plan_open()` to fire.
 * Override in Netlify env when running against a non-production domain.
 */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://vn.solavita.com'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      // Step 1
      solutionType,
      // Step 2
      city, propertyType,
      // Step 3 — household size + monthly usage + daytime ratio
      householdSize,
      electricityUsage,
      daytimeRatio,
      // Step 4 — roof type
      roofType,
      // Step 5
      salutation, firstName, lastName, email, phone,
      // Optional context tag seeded by the caller — e.g. the C&I
      // energy profile from /solutions/business-solar. Stored in
      // `business_profile` (see migration
      // 20261110000000_vn_consultation_business_profile.sql).
      interestedProduct,
    } = body

    // Basic server-side validation. The VN form has 5 steps:
    // solution → site/property → household+usage → roof → contact.
    // `electricityUsage` and `daytimeRatio` are required by the client
    // but tolerated as missing here so older clients / the /my-plan
    // update route never 400 on a partial body.
    if (
      !solutionType ||
      !city ||
      !propertyType ||
      !householdSize ||
      !roofType ||
      !salutation ||
      !firstName ||
      !lastName ||
      !email
    ) {
      return NextResponse.json(
        { success: false, message: 'Required fields missing' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate solutionType against the DB CHECK constraint values
    // ('home' | 'balcony' | 'business' | 'exploring' — the balcony
    // value was added on 2026-11-06). Reject anything else so a
    // tampered client can't write a junk value to a shared table.
    const allowedSolutionTypes = new Set([
      'home',
      'balcony',
      'business',
      'exploring',
    ])
    if (!allowedSolutionTypes.has(solutionType)) {
      return NextResponse.json(
        { success: false, message: 'Invalid solution type' },
        { status: 400 }
      )
    }

    const payload = {
      // Step 1 — solutionType is now persisted to the DB
      // (column + CHECK constraint applied by
      // `20261019000001_consultation_solution_type.sql`).
      solution_type: solutionType,
      // Step 2 — city is required; propertyType replaces the old
      // houseType. region is no longer collected; we keep the
      // column write NULL for NG.
      city,
      region: null,
      house_type: propertyType,
      // Step 3 — household size + monthly usage band + daytime ratio.
      // `electricity_usage` reuses the legacy tier IDs so /my-plan's
      // sizing engine keeps working. `daytime_usage_ratio` is the new
      // VN-only column (2026-11-06).
      household_size: householdSize,
      electricity_usage: electricityUsage || null,
      daytime_usage_ratio: daytimeRatio || null,
      // Step 4 — roof type.
      roof_type: roofType || null,
      // Not collected by the VN form any more; keep NULL so historical
      // rows from other country sites are untouched on UPDATE.
      devices: null,
      backup_needs: null,
      generator_frequency: null,
      fuel_budget_ngn: null,
      // Step 5
      salutation,
      first_name: firstName,
      last_name: lastName,
      email,
      phone: phone || null,
      // Business (C&I) profile from the business-solar assessment /
      // savings estimator. NULL for every home lead.
      //
      // Written only when the visitor actually filled a profile in, so
      // a deployment that has not applied
      // 20261110000000_vn_consultation_business_profile.sql yet still
      // accepts every home lead — the column is simply left out of the
      // INSERT for those rows.
      ...(interestedProduct ? { business_profile: interestedProduct } : {}),
      // Address fields are no longer collected (Step 2 captures the
      // city). Keep the columns NULL so existing admin tooling that
      // reads them still works.
      street: null,
      house_number: null,
      postal_code: null,
      // Bump on every write (INSERT or UPDATE) so /admin/leads sort
      // by updated_at DESC bubbles dedup re-submissions to the top.
      // created_at stays immutable - first-registration semantics.
      updated_at: new Date().toISOString(),
      // Hardcoded 'vn' from this site. On UPDATE we strip this to preserve
      // the original country from the first registration (so a lead from
      // another Solavita site doesn't get re-tagged as VN if a VN user
      // re-submits the same email).
      country: 'vn',
    }

    // Dedup - same email already registered → UPDATE the original row with the
    // new fields instead of erroring, and inform the user they already registered.
    //
    // **Country-scoped dedup**: every Solavita site shares the same
    // `consultation_leads` table, but each site only dedups against its
    // own country. Two users with the same email on different country
    // sites are two different leads; never merge them.
    const { data: existing } = await supabase
      .from('consultation_leads')
      .select('id')
      .eq('email', email)
      .eq('country', 'vn')
      .maybeSingle()

    if (existing) {
      // Defensive: even though the dedup SELECT filters by
      // `country='vn'`, don't blindly overwrite the row's country field
      // on UPDATE. Stays safe if the row's country is ever flipped
      // out-of-band (manual SQL fix, data migration, etc.).
      const { country: _omitCountry, ...updatePayload } = payload
      const { error: updateError } = await supabase
        .from('consultation_leads')
        .update(updatePayload)
        .eq('id', existing.id)

      if (updateError) {
        console.error('Consultation update error:', updateError)
        return NextResponse.json(
          { success: false, message: 'Đã xảy ra lỗi. Vui lòng thử lại.' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        alreadyRegistered: true,
        message:
          'Email này đã được đăng ký trước đó. Thông tin của bạn đã được cập nhật. Nếu chưa nhận được phản hồi, vui lòng liên hệ đội ngũ SKYWORTH Việt Nam (vn@solavita.com).',
      })
    }

    // New lead - insert. Capture the inserted row's id + plan_token so we
    // can (a) bake a personalised /my-plan link into the email and
    // (b) record `plan_provider_id` so Resend webhooks can update the
    // lifecycle columns on delivery / open.
    const { data: inserted, error: insertError } = await supabase
      .from('consultation_leads')
      .insert({
        ...payload,
        email,
      })
      .select('id, plan_token')
      .single()

    if (insertError || !inserted) {
      console.error('Consultation insert error:', insertError)
      return NextResponse.json(
        { success: false, message: 'Đã xảy ra lỗi. Vui lòng thử lại.' },
        { status: 500 }
      )
    }

    const planLink = `${SITE_URL}/my-plan?id=${inserted.plan_token}`

    // Send confirmation email (non-blocking - a mail failure shouldn't fail the lead)
    const emailContent = consultationConfirmationEmail({
      country: 'vn',
      salutation,
      firstName,
      lastName,
      email,
      phone,
      planLink,
    })
    const emailResult = await sendEmail({
      country: 'vn',
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
    })
    if (emailResult.success) {
      await supabase.from('email_logs').insert({
        customer_id: null,
        country: 'vn',
        email_type: 'consultation_confirmation',
        sent_to: email,
        status: 'sent',
        provider_id: emailResult.id || null,
      })
      // Stamp both `plan_provider_id` and `plan_sent_at` so /admin/leads
      // shows the correct Plan status immediately - no need to wait for
      // Resend to deliver the webhook. plan_sent_at here is the
      // "we successfully handed the email to Resend" timestamp; if the
      // Resend webhook arrives later with email.bounced, an admin
      // follow-up is the response (no auto-bounce handler yet).
      const stamp: Record<string, string> = {
        plan_sent_at: new Date().toISOString(),
      }
      if (emailResult.id) {
        stamp.plan_provider_id = emailResult.id
      }
      const { error: stampErr } = await supabase
        .from('consultation_leads')
        .update(stamp)
        .eq('id', inserted.id)
      if (stampErr) {
        console.error('[/api/consultation] plan lifecycle stamp failed:', stampErr)
      }
    } else {
      // Record the failure so it's diagnosable (previously swallowed silently)
      console.error('❌ Consultation email failed:', emailResult.error)
      await supabase.from('email_logs').insert({
        customer_id: null,
        country: 'vn',
        email_type: 'consultation_confirmation',
        sent_to: email,
        status: 'failed',
        error: emailResult.error?.message || 'Unknown email error',
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Submission successful',
    })

  } catch (error) {
    console.error('Consultation API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, message: `Internal server error: ${errorMessage}` },
      { status: 500 }
    )
  }
}
