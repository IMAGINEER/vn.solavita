import type { Metadata } from 'next'
import { getCurrentAdmin } from '@/lib/auth'
import { AdminShell } from './AdminShell'

export const dynamic = 'force-dynamic'

/**
 * The admin surface is private — it holds every lead, contact and
 * partner record. It must never appear in a search index, regardless
 * of the site-wide indexing switch: `/admin` is only reachable with a
 * signed-in staff session, so indexing it would publish the URL (and
 * whatever the session renders) to anyone who stumbles on it.
 *
 * The old robots.txt blocked `/admin` by path. That rule is gone now
 * that the whole site is closed, so the noindex lives here — on the
 * layout, which every admin route inherits.
 */
export const metadata: Metadata = {
  title: '管理后台',
  robots: { index: false, follow: false, nocache: true },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentAdmin()
  return <AdminShell user={user}>{children}</AdminShell>
}
