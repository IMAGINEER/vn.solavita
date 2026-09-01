'use client'

import { useCallback, useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import MyPlanClient from './MyPlanClient'
import PlanUnavailable from './PlanUnavailable'
import type { ConsultationInput, HomeDetails } from '../_lib/calc'
import type { FormData } from '@/lib/form-types'

interface MyPlanHydratorProps {
  identifier: string
}

type HydrateState =
  | { status: 'loading' }
  | { status: 'ready'; consultation: ConsultationInput; home: HomeDetails; prefill: Partial<FormData> }
  | { status: 'unavailable' }
  | { status: 'error' }

/**
 * Client-side fetch orchestrator for `/my-plan`.
 *
 * Owns the loading / ready / unavailable / error state machine and decides
 * what to show:
 *
 *   loading     → page shell + 4 skeleton cards (matches `bg-[#F7F9FC]`)
 *   ready       → <MyPlanClient /> with the resolved row
 *   unavailable → <PlanUnavailable /> (row missing or token invalid)
 *   error       → <PlanUnavailable onRetry=... /> (DB unreachable)
 *
 * SSR safety: the fetch lives in `useEffect`, so the server-rendered HTML
 * is the loading skeleton. Hydration is consistent because both server
 * and client render `loading` on first paint.
 */
export default function MyPlanHydrator({ identifier }: MyPlanHydratorProps) {
  const [state, setState] = useState<HydrateState>({ status: 'loading' })

  const load = useCallback(async () => {
    let cancelled = false
    // Reset to loading so the skeleton (not stale ready data) re-renders.
    setState({ status: 'loading' })
    try {
      const res = await fetch(`/api/my-plan/${identifier}`, {
        cache: 'no-store',
      })
      if (cancelled) return
      if (res.status === 404 || res.status === 400) {
        setState({ status: 'unavailable' })
        return
      }
      if (!res.ok) {
        setState({ status: 'error' })
        return
      }
      const json = (await res.json()) as {
        found: boolean
        consultation?: ConsultationInput
        address?: HomeDetails
        prefill?: Partial<FormData>
      }
      if (
        !json.found ||
        !json.consultation ||
        !json.address ||
        !json.prefill
      ) {
        setState({ status: 'unavailable' })
        return
      }
      setState({
        status: 'ready',
        consultation: json.consultation,
        home: json.address,
        prefill: json.prefill,
      })
    } catch (err) {
      // Network error / fetch threw - surface as recoverable error so the
      // user can retry.
      if (cancelled) return
      console.error('[/my-plan] fetch failed:', err)
      setState({ status: 'error' })
    }
    return () => {
      cancelled = true
    }
  }, [identifier])

  useEffect(() => {
    void load()
  }, [load])

  if (state.status === 'loading') return <LoadingSkeleton identifier={identifier} />
  if (state.status === 'unavailable') return <PlanUnavailable />
  if (state.status === 'error') {
    return <PlanUnavailable onRetry={() => void load()} />
  }
  return (
    <MyPlanClient
      consultation={state.consultation}
      home={state.home}
      prefill={state.prefill}
    />
  )
}

/**
 * Loading shell - same hero + chrome as the ready page so the layout
 * doesn't jump when the data arrives. The 4 skeleton cards below the
 * hero mirror the home details strip + 3 product cards in real layout.
 */
function LoadingSkeleton({ identifier }: { identifier: string }) {
  return (
    <main className="min-h-screen bg-[#F7F9FC]">
      <Header logoHref="/" />

      <section className="pt-24 pb-8 lg:pt-32 lg:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'My Plan' },
            ]}
          />

          <h1 className="text-3xl lg:text-4xl font-cw-bold text-[#0A1628] mt-6 mb-2">
            Your Solar Plan
          </h1>
          <p className="text-sm text-[#4A5568] mb-4">
            Loading your personalised plan...
            <span className="ml-2 inline-flex items-center gap-1 text-uk-slate/80">
              <span className="hidden sm:inline">·</span>
              <code className="px-1.5 py-0.5 rounded bg-white border border-uk-line text-xs">
                {identifier}
              </code>
            </span>
          </p>
          <div className="h-1 bg-gradient-to-r from-[#0F766E] to-[#10B981] rounded w-20" />
        </div>
      </section>

      <section className="py-8 lg:py-12 pb-24 lg:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Home details strip placeholder. */}
          <div className="rounded-2xl p-5 sm:p-6 bg-white border border-uk-line">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-uk-teal-soft animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-uk-line/60 rounded animate-pulse" />
                <div className="h-3 w-64 bg-uk-line/40 rounded animate-pulse" />
              </div>
            </div>
          </div>

          <div className="mt-12 mb-4">
            <div className="h-10 w-48 bg-uk-line/60 rounded animate-pulse" />
          </div>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-white border border-uk-line p-5 h-44 animate-pulse"
                  />
                ))}
              </div>
              <div className="rounded-2xl bg-white border border-uk-line p-5 h-64 animate-pulse" />
            </div>
            <div className="lg:col-span-4">
              <div className="rounded-2xl bg-white border border-uk-line p-5 h-96 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      <Footer variant="dark" />
    </main>
  )
}