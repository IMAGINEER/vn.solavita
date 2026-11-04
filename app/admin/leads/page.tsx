import { requireAdmin } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { LeadsTable, type ConsultationLead } from './LeadsTable'

export const dynamic = 'force-dynamic'

export default async function LeadsPage() {
  await requireAdmin()

  // All Solavita sites (NG/UK/DE/IT) share the same Supabase project.
  // Filter to country='vn' so other sites' rows are never shown here.
  // Order: most recently touched first so re-submitted leads (UPDATE
  // in /api/consultation dedup path) bubble to the top.
  const { data: rows } = await supabase
    .from('consultation_leads')
    .select(
      'id, salutation, first_name, last_name, email, phone, ' +
        'street, house_number, postal_code, city, ' +
        'region, house_type, roof_type, household_size, electricity_usage, ' +
        'devices, plan_token, country, created_at, updated_at, ' +
        // Plan lifecycle columns - drive the 4-state Plan badge via
        // `computePlanStatus()` in LeadsTable. See migration
        // 20260902000000_consultation_plan_lifecycle.sql.
        'plan_sent_at, plan_provider_id, plan_first_opened_at, ' +
        'plan_last_opened_at, plan_confirmed_at',
    )
    .eq('country', 'vn')
    .order('updated_at', { ascending: false })
    .order('created_at', { ascending: false })

  const leads = (rows || []) as unknown as ConsultationLead[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-cw-bold text-uk-navy">
          Khách hàng tiềm năng
        </h1>
        <p className="mt-1 text-sm text-uk-slate">
          Yêu cầu tư vấn gửi từ vn.solavita.com. Mới nhất trước.
        </p>
      </div>
      <LeadsTable leads={leads} />
    </div>
  )
}