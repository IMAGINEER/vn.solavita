import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { consultationConfirmationEmail } from '@/lib/emails/consultation-confirmation'
import { sendEmail } from '@/lib/emails/send'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      salutation, firstName, lastName, email, phone,
      street, houseNumber, postalCode, city,
      region, houseType, roofType, householdSize,
      electricityUsage, devices,
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
      electricity_usage: electricityUsage || null,
      devices: Array.isArray(devices) ? devices.join(', ') : devices || null,
      // Bump on every write (INSERT or UPDATE) so /admin/leads sort
      // by updated_at DESC bubbles dedup re-submissions to the top.
      // created_at stays immutable - first-registration semantics.
      updated_at: new Date().toISOString(),
      // Hardcoded 'uk' from this site. On UPDATE we strip this to preserve
      // the original country from the first registration (so a DE lead
      // doesn't get re-tagged as UK if a UK user re-submits the same email).
      country: 'uk',
    }

    // Dedup - same email already registered → UPDATE the original row with the
    // new fields instead of erroring, and inform the user they already registered.
    const { data: existing } = await supabase
      .from('consultation_leads')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existing) {
      // Preserve the original country - never overwrite on re-submit.
      // (A DE-registered email later hitting this UK route must stay 'de'.)
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
          'This email is already registered with us. Your details have been updated. If you have not heard back yet, please contact our team at uk@solavita.com.',
      })
    }

    // New lead - insert
    const { error: insertError } = await supabase.from('consultation_leads').insert({
      ...payload,
      email,
    })

    if (insertError) {
      console.error('Consultation insert error:', insertError)
      return NextResponse.json(
        { success: false, message: 'Something went wrong. Please try again.' },
        { status: 500 }
      )
    }

    // Send confirmation email (non-blocking - a mail failure shouldn't fail the lead)
    const emailContent = consultationConfirmationEmail({
      country: 'uk',
      salutation,
      firstName,
      lastName,
      email,
      phone,
    })
    const emailResult = await sendEmail({
      country: 'uk',
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
    })
    if (emailResult.success) {
      await supabase.from('email_logs').insert({
        customer_id: null,
        country: 'uk',
        email_type: 'consultation_confirmation',
        sent_to: email,
        status: 'sent',
        provider_id: emailResult.id || null,
      })
    } else {
      // Record the failure so it's diagnosable (previously swallowed silently)
      console.error('❌ Consultation email failed:', emailResult.error)
      await supabase.from('email_logs').insert({
        customer_id: null,
        country: 'uk',
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
