import Link from 'next/link'
import { Inbox } from 'lucide-react'
import { requireAdmin } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const user = await requireAdmin()

  // Single source of truth: count VN leads (country = 'vn') to surface on
  // the dashboard. Cheap query - keeps the index on country busy.
  const { count: leadCount } = await supabase
    .from('consultation_leads')
    .select('id', { count: 'exact', head: true })
    .eq('country', 'vn')

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