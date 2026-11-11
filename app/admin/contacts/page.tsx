import { requireAdmin } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { DataErrorNotice } from '../DataErrorNotice'
import { ContactsTable, type ContactLead } from './ContactsTable'

export const dynamic = 'force-dynamic'

export default async function ContactsPage() {
  await requireAdmin()

  // vn_contact_leads is VN-only by table design (no `country` column).
  // Order: newest first so a fresh submission surfaces at the top.
  const { data: rows, error } = await supabase
    .from('vn_contact_leads')
    .select(
      'id, salutation, first_name, last_name, email, phone, ' +
        'postcode, city, subject, message, status, created_at, updated_at',
    )
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[/admin/contacts] vn_contact_leads query failed:', error)
  }

  const contacts = (rows || []) as unknown as ContactLead[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-cw-bold text-uk-navy">
          联系请求
        </h1>
        <p className="mt-1 text-sm text-uk-slate">
          来自 vn.solavita.com/contact-us 的留言，最新在前。
        </p>
      </div>
      {error ? (
        <DataErrorNotice scope="联系请求" error={error} />
      ) : (
        <ContactsTable contacts={contacts} />
      )}
    </div>
  )
}