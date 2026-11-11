import type { Metadata } from 'next'

/**
 * `/my-plan` renders one visitor's own plan — their address, their
 * system, their savings. It is addressed by a private `?id=<token>`
 * (the `plan_token` on their `consultation_leads` row), so it must
 * never be indexed even though it is a normal page in the App Router.
 *
 * The page component itself is a `'use client'` file and cannot export
 * `metadata`, so the noindex lives on this layout — every route under
 * `/my-plan` inherits it.
 *
 * The old robots.txt blocked `/my-plan/*` by path. That rule is gone
 * now that the whole site is closed, so the noindex lives here.
 */
export const metadata: Metadata = {
  title: 'Kế hoạch của bạn',
  robots: { index: false, follow: false, nocache: true },
}

export default function MyPlanLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
