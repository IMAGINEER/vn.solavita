import { requireAdmin } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { DataErrorNotice } from '../DataErrorNotice'
import { LeadsTable, type ConsultationLead } from './LeadsTable'

export const dynamic = 'force-dynamic'

/**
 * Columns every deployment is guaranteed to have: they are all written
 * by the INSERT in /api/consultation, so a missing one would break
 * lead registration itself.
 */
const LEAD_COLUMNS_CORE =
  'id, salutation, first_name, last_name, email, phone, ' +
  'street, house_number, postal_code, city, ' +
  'region, house_type, roof_type, household_size, electricity_usage, ' +
  'devices, plan_token, country, created_at, updated_at'

/**
 * Columns added by later migrations. PostgREST rejects the WHOLE
 * select when one of them is missing (42703 "column ... does not
 * exist"), which is how a missing `business_profile` column once made
 * this page render "no leads" while the dashboard counter still said
 * "2". The list is therefore fetched in two steps: full first, and if
 * that fails, the core columns only - so the operator always sees the
 * leads, and the schema gap is logged loudly.
 */
const LEAD_COLUMNS_FULL =
  LEAD_COLUMNS_CORE +
  // Business (C&I) profile attached from /solutions/business-solar
  // — see migration 20261110000000_vn_consultation_business_profile.sql.
  ', business_profile' +
  // Plan lifecycle columns - drive the 4-state Plan badge via
  // `computePlanStatus()` in LeadsTable. See migration
  // 20260902000000_consultation_plan_lifecycle.sql.
  ', plan_sent_at, plan_provider_id, plan_first_opened_at' +
  ', plan_last_opened_at, plan_confirmed_at'

export default async function LeadsPage() {
  await requireAdmin()

  // All Solavita sites (NG/UK/DE/IT) share the same Supabase project.
  // Filter to country='vn' so other sites' rows are never shown here.
  // Order: most recently touched first so re-submitted leads (UPDATE
  // in /api/consultation dedup path) bubble to the top.
  const runQuery = async (columns: string) =>
    await supabase
      .from('consultation_leads')
      .select(columns)
      .eq('country', 'vn')
      .order('updated_at', { ascending: false })
      .order('created_at', { ascending: false })

  let rows: unknown[] | null = null
  let error: { message?: string; code?: string; details?: string | null } | null =
    null

  const full = await runQuery(LEAD_COLUMNS_FULL)
  if (full.error) {
    console.error(
      '[/admin/leads] full lead query failed (missing column?):',
      full.error,
    )
    const fallback = await runQuery(LEAD_COLUMNS_CORE)
    if (fallback.error) {
      error = fallback.error
    } else {
      console.warn(
        '[/admin/leads] fell back to the core column set - the database is missing one of: business_profile, plan_sent_at, plan_provider_id, plan_first_opened_at, plan_last_opened_at, plan_confirmed_at. Apply supabase/migrations/20261110000001_vn_consultation_columns_backfill.sql.',
      )
      rows = fallback.data
    }
  } else {
    rows = full.data
  }

  // A failed query must never look like "no leads". Surface it.
  if (error) {
    console.error('[/admin/leads] consultation_leads query failed:', error)
  }

  const leads = (rows || []) as unknown as ConsultationLead[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-cw-bold text-uk-navy">
          潜在客户
        </h1>
        <p className="mt-1 text-sm text-uk-slate">
          来自 vn.solavita.com 的咨询请求，最新在前。
        </p>
      </div>
      {error ? (
        <DataErrorNotice scope="潜在客户" error={error} />
      ) : (
        <LeadsTable leads={leads} />
      )}
    </div>
  )
}