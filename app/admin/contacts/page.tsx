import { requireAdmin } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { ContactsTable, type ContactLead } from './ContactsTable'

export const dynamic = 'force-dynamic'

export default async function ContactsPage() {
  await requireAdmin()

  // ng_contact_leads is NG-only by table design (no `country` column).
  // Order: newest first so a fresh submission surfaces at the top.
  const { data: rows } = await supabase
    .from('ng_contact_leads')
    .select(
      'id, salutation, first_name, last_name, email, phone, ' +
        'postcode, city, subject, message, status, created_at, updated_at',
    )
    .order('created_at', { ascending: false })

  const contacts = (rows || []) as unknown as ContactLead[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-cw-bold text-uk-navy">
          NG Contact Enquiries
        </h1>
        <p className="mt-1 text-sm text-uk-slate">
          Submissions from ng.solavita.com/contact-us. Newest first.
        </p>
      </div>
      <ContactsTable contacts={contacts} />
    </div>
  )
}