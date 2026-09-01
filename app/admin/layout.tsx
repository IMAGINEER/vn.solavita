import { getCurrentAdmin } from '@/lib/auth'
import { AdminShell } from './AdminShell'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentAdmin()
  return <AdminShell user={user}>{children}</AdminShell>
}