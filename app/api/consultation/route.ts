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
      // Step 1
      solutionType,
      // Step 2
      city, propertyType,
      // Step 3
      householdSize,
      generatorFrequency, fuelBudgetNgn,
      // Step 4
      salutation, firstName, lastName, email, phone,
    } = body

    // Basic server-side validation. The form has been reshaped to
    // 4 steps per docs/修改建议.docx; the previous 5-step fields
    // (region/roofType/electricityUsage/devices/backupNeeds/address)
    // are gone. Postal code / street were Step 4 before; `city` now
    // comes from Step 2 Q1 so we no longer require a separate
    // postal_code.
    if (
      !solutionType ||
      !city ||
      !propertyType ||
      !householdSize ||
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
    // ('home' | 'business' | 'exploring'). Reject anything else so
    // a tampered client can't write a junk value to a shared table.
    const allowedSolutionTypes = new Set(['home', 'business', 'exploring'])
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
      // Step 3 — only householdSize is required. generatorFrequency
      // and fuelBudgetNgn stay NULL for users who skip the optional
      // questions (or set 'unknown'). Old fields (roofType,
      // electricityUsage, devices, backupNeeds) are no longer
      // collected by the public form; we keep the column writes
      // NULL so old rows are untouched on UPDATE.
      household_size: householdSize,
      roof_type: null,
      electricity_usage: null,
      devices: null,
      backup_needs: null,
      generator_frequency:
        generatorFrequency && generatorFrequency !== 'unknown'
          ? generatorFrequency
          : null,
      fuel_budget_ngn:
        fuelBudgetNgn && fuelBudgetNgn !== 'unknown' ? fuelBudgetNgn : null,
      // Step 4
      salutation,
      first_name: firstName,
      last_name: lastName,
      email,
      phone: phone || null,
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
