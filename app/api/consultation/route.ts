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
  'https://uk.solavita.com'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      salutation, firstName, lastName, email, phone,
      street, houseNumber, postalCode, city,
      region, houseType, roofType, householdSize,
      electricityUsage, devices,
      // NG Step-3 extensions (all optional, all may be undefined for
      // pre-existing form submissions or /my-plan's slim update path).
      generatorFrequency, fuelBudgetNgn, backupNeeds,
    } = body

    // Basic server-side validation
    if (!salutation || !firstName || !lastName || !email || !postalCode || !city) {
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

    const payload = {
      salutation,
      first_name: firstName,
      last_name: lastName,
      phone: phone || null,
      street: street || null,
      house_number: houseNumber || null,
      postal_code: postalCode,
      city,
      region: region || null,
      house_type: houseType || null,
      roof_type: roofType || null,
      household_size: householdSize || null,
      electricity_usage: electricityUsage === 'unknown' ? null : (electricityUsage || null),
      devices: Array.isArray(devices) ? devices.join(', ') : devices || null,
      // NG Step-3 extensions - all map to NULL when missing or the
      // 'unknown' sentinel so the admin table shows a clean unspecified
      // state instead of a literal 'unknown' string. The DB columns
      // themselves are nullable so pre-existing rows are unaffected.
      generator_frequency: generatorFrequency && generatorFrequency !== 'unknown' ? generatorFrequency : null,
      fuel_budget_ngn: fuelBudgetNgn && fuelBudgetNgn !== 'unknown' ? fuelBudgetNgn : null,
      backup_needs: Array.isArray(backupNeeds) && backupNeeds.length > 0 ? backupNeeds.join(', ') : null,
      // Bump on every write (INSERT or UPDATE) so /admin/leads sort
      // by updated_at DESC bubbles dedup re-submissions to the top.
      // created_at stays immutable - first-registration semantics.
      updated_at: new Date().toISOString(),
      // Hardcoded 'ng' from this site. On UPDATE we strip this to preserve
      // the original country from the first registration (so a UK lead
      // doesn't get re-tagged as NG if an NG user re-submits the same email).
      country: 'ng',
    }

    // Dedup - same email already registered → UPDATE the original row with the
    // new fields instead of erroring, and inform the user they already registered.
    //
    // **Country-scoped dedup**: UK + DE share the same `consultation_leads`
    // table, but each site only dedups against its own country. A UK user
    // and a DE user with the same email are two different leads; never
    // merge them. The DE repo applies the same `country='de'` filter.
    const { data: existing } = await supabase
      .from('consultation_leads')
      .select('id')
      .eq('email', email)
      .eq('country', 'ng')
      .maybeSingle()

    if (existing) {
      // Defensive: even though the dedup SELECT filters by
      // `country='uk'`, don't blindly overwrite the row's country field
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
          { success: false, message: 'Something went wrong. Please try again.' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        alreadyRegistered: true,
        message:
          'This email is already registered with us. Your details have been updated. If you have not heard back yet, please contact our team (ng@solavita.com).',
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
        { success: false, message: 'Something went wrong. Please try again.' },
        { status: 500 }
      )
    }

    const planLink = `${SITE_URL}/my-plan?id=${inserted.plan_token}`

    // Send confirmation email (non-blocking - a mail failure shouldn't fail the lead)
    const emailContent = consultationConfirmationEmail({
      country: 'ng',
      salutation,
      firstName,
      lastName,
      email,
      phone,
      planLink,
    })
    const emailResult = await sendEmail({
      country: 'ng',
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
    })
    if (emailResult.success) {
      await supabase.from('email_logs').insert({
        customer_id: null,
        country: 'ng',
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
        country: 'ng',
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
