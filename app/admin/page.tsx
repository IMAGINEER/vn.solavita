import Link from 'next/link'
import { Inbox } from 'lucide-react'
import { requireAdmin } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { DataErrorNotice } from './DataErrorNotice'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const user = await requireAdmin()

  // Single source of truth: count VN leads (country = 'vn') to surface on
  // the dashboard. Cheap query - keeps the index on country busy.
  //
  // NOTE: this query only touches `id`, while /admin/leads selects the
  // full column list. A column that is missing in the database therefore
  // breaks the list page but leaves this counter working - the two pages
  // can legitimately disagree. Both now surface their own query error.
  const { count: leadCount, error: countError } = await supabase
    .from('consultation_leads')
    .select('id', { count: 'exact', head: true })
    .eq('country', 'vn')

  if (countError) {
    console.error('[/admin] lead count query failed:', countError)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-cw-bold text-uk-navy">
          Xin chào, {user.username}
        </h1>
        <p className="mt-1 text-sm text-uk-slate">
          Bảng điều khiển Solavita Việt Nam - liên kết nhanh tới quy trình tư vấn.
        </p>
      </div>

      {countError ? (
        <DataErrorNotice scope="số lượng yêu cầu tư vấn" error={countError} />
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/admin/leads"
          className="rounded-2xl bg-white border border-uk-line p-6 hover:border-uk-teal/40 hover:shadow-md transition-all block"
        >
          <div className="inline-flex size-10 items-center justify-center rounded-lg bg-uk-teal-soft text-uk-teal-dark mb-3">
            <Inbox className="size-5" strokeWidth={1.75} />
          </div>
          <div className="text-3xl font-cw-bold text-uk-navy tabular-nums">
            {leadCount ?? 0}
          </div>
          <div className="text-xs font-cw-bold text-uk-slate uppercase tracking-wider mt-1">
            Yêu cầu tư vấn
          </div>
        </Link>
      </div>
    </div>
  )
}