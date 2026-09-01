'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback } from 'react'
import {
  Inbox,
  LogOut,
  LayoutDashboard,
  Mail,
  Briefcase,
} from 'lucide-react'
import type { AdminUser } from '@/lib/auth-types'
import { cn } from '@/lib/utils'

// UK admin shell — top-bar nav (no Sidebar, simpler than DE's full
// shadcn Sidebar). Active state is reflected on the current route.
// When unauthenticated (login page), renders children with no chrome
// so /admin/login is a clean centered card.

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Leads', href: '/admin/leads', icon: Inbox },
  { label: 'Contacts', href: '/admin/contacts', icon: Mail },
  { label: 'Partners', href: '/admin/partners', icon: Briefcase },
] as const

export function AdminShell({
  user,
  children,
}: {
  user: AdminUser | null
  children: React.ReactNode
}) {
  const pathname = usePathname() || ''
  const router = useRouter()

  const logout = useCallback(async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }, [router])

  // Login page renders bare (no top bar).
  if (!user) {
    return (
      <div className="min-h-screen bg-uk-teal-soft/30 text-uk-navy">
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-uk-navy">
      {/* Top nav */}
      <header className="sticky top-0 z-30 border-b border-uk-line bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="flex items-center gap-2 font-cw-bold text-uk-navy"
            >
              <span className="inline-flex size-7 items-center justify-center rounded-md bg-uk-teal-dark text-white text-sm">
                S
              </span>
              <span className="text-sm">Solavita Admin</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const active =
                  item.href === '/admin'
                    ? pathname === '/admin'
                    : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'inline-flex items-center gap-2 px-3 h-9 rounded-md text-sm font-cw-bold transition-colors',
                      active
                        ? 'bg-uk-teal-soft text-uk-teal-dark'
                        : 'text-uk-slate hover:bg-uk-teal-soft/60 hover:text-uk-teal-dark',
                    )}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <div className="text-xs font-cw-bold text-uk-navy">
                {user.username}
              </div>
              <div className="text-[10px] text-uk-slate uppercase tracking-wider">
                {user.role}
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 h-9 rounded-md text-sm font-cw-bold text-uk-slate hover:bg-uk-teal-soft/60 hover:text-uk-teal-dark transition-colors"
              title="Sign out"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
            <Link
              href="/"
              className="text-xs text-uk-slate hover:text-uk-teal-dark"
            >
              ← Storefront
            </Link>
          </div>
        </div>

        {/* Mobile nav row */}
        <nav className="sm:hidden border-t border-uk-line px-4 py-2 flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'inline-flex items-center gap-2 px-3 h-9 rounded-md text-xs font-cw-bold transition-colors',
                  active
                    ? 'bg-uk-teal-soft text-uk-teal-dark'
                    : 'text-uk-slate hover:bg-uk-teal-soft/60 hover:text-uk-teal-dark',
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {children}
      </div>
    </div>
  )
}