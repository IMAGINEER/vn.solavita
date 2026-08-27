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
    }

    // Dedup — same email already registered → UPDATE the original row with the
    // new fields instead of erroring, and inform the user they already registered.
    const { data: existing } = await supabase
      .from('consultation_leads')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existing) {
      const { error: updateError } = await supabase
        .from('consultation_leads')
        .update(payload)
        .eq('id', existing.id)

      if (updateError) {
        console.error('Consultation update error:', updateError)
        return NextResponse.json(
          { success: false, message: 'Ein Fehler ist aufgetreten. Bitte erneut versuchen.' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        alreadyRegistered: true,
        message:
          'Diese E-Mail-Adresse wurde bereits registriert. Ihre Angaben wurden aktualisiert. Falls Sie noch keine Rückmeldung erhalten haben, kontaktieren Sie bitte unseren Kundenservice.',
      })
    }

    // New lead — insert
    const { error: insertError } = await supabase.from('consultation_leads').insert({
      ...payload,
      email,
    })

    if (insertError) {
      console.error('Consultation insert error:', insertError)
      return NextResponse.json(
        { success: false, message: 'Ein Fehler ist aufgetreten. Bitte erneut versuchen.' },
        { status: 500 }
      )
    }

    // Send confirmation email (non-blocking — a mail failure shouldn't fail the lead)
    const emailContent = consultationConfirmationEmail({
      salutation,
      firstName,
      lastName,
      email,
      phone,
    })
    const emailResult = await sendEmail({
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
    })
    if (emailResult.success) {
      await supabase.from('email_logs').insert({
        customer_id: null,
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
