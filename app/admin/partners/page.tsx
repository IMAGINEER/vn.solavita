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
      'id, full_name, company, email, whatsapp, partner_track, ' +
        'tracking_code, event_ids, message, ' +
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
          默认显示金牌合作伙伴计划（Chương trình Đối tác Vàng）的报名，可按会议筛选；
          「合作申请」为 vn.solavita.com/for-partners 的其余申请。均按时间倒序。
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