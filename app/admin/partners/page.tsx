import { requireAdmin } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { DataErrorNotice } from '../DataErrorNotice'
import { PartnersTable, type PartnerLead } from './PartnersTable'

export const dynamic = 'force-dynamic'

export default async function PartnersPage() {
  await requireAdmin()

  // vn_partner_leads is VN-only by table design (no `country` column).
  const { data: rows, error } = await supabase
    .from('vn_partner_leads')
    .select(
      'id, full_name, company, email, partner_track, message, ' +
        'status, created_at, updated_at',
    )
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[/admin/partners] vn_partner_leads query failed:', error)
  }

  const partners = (rows || []) as unknown as PartnerLead[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-cw-bold text-uk-navy">
          合作申请
        </h1>
        <p className="mt-1 text-sm text-uk-slate">
          来自 vn.solavita.com/for-partners 的申请，最新在前。
        </p>
      </div>
      {error ? (
        <DataErrorNotice scope="合作申请" error={error} />
      ) : (
        <PartnersTable partners={partners} />
      )}
    </div>
  )
}