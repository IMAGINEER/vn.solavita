import { requireAdmin } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { PartnersTable, type PartnerLead } from './PartnersTable'

export const dynamic = 'force-dynamic'

export default async function PartnersPage() {
  await requireAdmin()

  // uk_partner_leads is UK-only by table design (no `country` column).
  const { data: rows } = await supabase
    .from('uk_partner_leads')
    .select(
      'id, full_name, company, email, partner_track, message, ' +
        'status, created_at, updated_at',
    )
    .order('created_at', { ascending: false })

  const partners = (rows || []) as unknown as PartnerLead[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-cw-bold text-uk-navy">
          UK Partner Enquiries
        </h1>
        <p className="mt-1 text-sm text-uk-slate">
          Submissions from uk.solavita.com/for-partners. Newest first.
        </p>
      </div>
      <PartnersTable partners={partners} />
    </div>
  )
}