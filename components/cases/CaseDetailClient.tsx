'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowLeft,
  Sun,
  Banknote,
  MapPin,
  Zap,
  Battery,
  Calendar,
  ArrowRight,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import CaseStudyCard from '@/components/cases/CaseStudyCard'
import CTA from '@/components/solutions/CTA'
import { type CaseStudy } from '@/lib/data/uk-cases'

gsap.registerPlugin(ScrollTrigger)

const SunIcon = ({ className }: { className?: string }) => (
  <Sun className={className ?? 'w-5 h-5'} strokeWidth={1.5} />
)
const BanknoteIcon = ({ className }: { className?: string }) => (
  <Banknote className={className ?? 'w-5 h-5'} strokeWidth={1.6} />
)
const MapPinIcon = ({ className }: { className?: string }) => (
  <MapPin className={className ?? 'w-5 h-5'} strokeWidth={1.6} />
)
const ZapIcon = ({ className }: { className?: string }) => (
  <Zap className={className ?? 'w-5 h-5'} strokeWidth={1.6} />
)
const BatteryIcon = ({ className }: { className?: string }) => (
  <Battery className={className ?? 'w-5 h-5'} strokeWidth={1.6} />
)
const CalendarIcon = ({ className }: { className?: string }) => (
  <Calendar className={className ?? 'w-5 h-5'} strokeWidth={1.6} />
)
const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <ArrowLeft className={className ?? 'w-4 h-4'} strokeWidth={2} />
)
const ArrowRightIcon = ({ className }: { className?: string }) => (
  <ArrowRight className={className ?? 'w-4 h-4'} strokeWidth={2} />
)

interface CaseDetailClientProps {
  caseStudy: CaseStudy
  siblings: CaseStudy[]
}

/**
 * Case study detail view - left image, right copy, expanded into a full
 * narrative:
 *   breadcrumb → hero image → meta strip → description → system
 *   specs → metrics → CTA → siblings rail.
 *
 * System specs are parsed from `systemLabel` so the same string that
 * drives the card subtitle also feeds the specs list - no risk of
 * drift between card and detail copy.
 *
 * `siblings` (max 3, excluding current) come from the server page so
 * the SSR HTML is meaningful before hydration.
 */
export default function CaseDetailClient({
  caseStudy: c,
  siblings,
}: CaseDetailClientProps) {
  const handleBack = () => {
    if (typeof window !== 'undefined') window.history.back()
  }

  const heroRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
      )
      gsap.fromTo(
        copyRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.15, ease: 'power3.out' }
      )
    }, heroRef)
    return () => ctx.revert()
  }, [])

  // Parse the comma-separated `systemLabel` for the specs strip. The
  // string format from lib/data/uk-cases.ts is e.g.:
  //   "6.56 kWp + 11 kWh + Single-Phase Inverter 6 kW"
  // We split on " + " and surface each chunk as its own tile.
  const specChunks = c.systemLabel
    .split('+')
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <main className="min-h-screen bg-[#F7F9FC]">
      <Header showBackButton={true} onBack={handleBack} logoHref="/" />

      <section className="pt-24 pb-6 lg:pt-28 lg:pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Case Studies', href: '/cases/' },
              { label: c.city },
            ]}
          />
        </div>
      </section>

      <section
        ref={heroRef}
        className="relative py-8 lg:py-12 bg-[#F7F9FC]"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-stretch">
            {/* Image column */}
            <div ref={imageRef} className="lg:col-span-3">
              <div className="relative h-full rounded-3xl overflow-hidden border border-uk-line bg-white min-h-[340px] shadow-sm flex items-center justify-center p-8">
                <img
                  src={c.imagePath}
                  alt={`Solavita installation in ${c.city}`}
                  loading="eager"
                  className="max-w-full max-h-full object-contain"
                />
                {/* Country pill */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs font-cw-bold text-uk-navy">
                  <span className="w-1.5 h-1.5 rounded-full bg-uk-emerald" />
                  {c.country === 'IT' ? 'Italy' : 'Germany'}
                </div>
                {/* System type pill */}
                <div className="absolute top-4 right-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-uk-teal text-white text-xs font-cw-bold">
                  {c.systemType}
                </div>
              </div>
            </div>

            {/* Copy column */}
            <div ref={copyRef} className="lg:col-span-2 flex flex-col gap-6">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-cw-bold tracking-wider uppercase text-uk-teal-dark">
                  <MapPinIcon className="w-3.5 h-3.5" />
                  {c.postcode} · {c.region}
                </span>
                <h1 className="mt-3 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
                  {c.city}{' '}
                  <span className="text-gradient">· {c.systemLabel}</span>
                </h1>
                <p className="mt-5 text-base text-uk-slate font-cw-regular leading-relaxed">
                  {c.description}
                </p>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-2 gap-4">
                {c.annualGeneration && (
                  <div className="rounded-2xl border border-uk-line bg-white p-5">
                    <div className="flex items-center gap-2 text-uk-teal-dark">
                      <SunIcon className="w-5 h-5" />
                      <span className="text-xs font-cw-bold uppercase tracking-wider">
                        Annual Generation
                      </span>
                    </div>
                    <div className="mt-3 text-2xl font-cw-bold text-uk-navy tabular-nums">
                      {c.annualGeneration}
                    </div>
                  </div>
                )}
                {c.annualSaving && (
                  <div className="rounded-2xl border border-uk-line bg-white p-5">
                    <div className="flex items-center gap-2 text-uk-emerald">
                      <BanknoteIcon className="w-5 h-5" />
                      <span className="text-xs font-cw-bold uppercase tracking-wider">
                        Annual Saving
                      </span>
                    </div>
                    <div className="mt-3 text-2xl font-cw-bold text-uk-emerald tabular-nums">
                      {c.annualSavingGbp ?? c.annualSaving}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specs strip - parsed from systemLabel */}
      <section className="py-12 lg:py-16 bg-white border-y border-uk-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-uk-line bg-[#F7F9FC] text-xs font-cw-regular text-uk-slate">
              <ZapIcon className="w-3.5 h-3.5 text-uk-teal-dark" />
              System Specifications
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {specChunks.map((chunk, idx) => {
              const isBattery = /kWh/i.test(chunk)
              const isInverter = /inverter/i.test(chunk)
              const Icon = isBattery ? BatteryIcon : isInverter ? ZapIcon : SunIcon
              return (
                <div
                  key={`${chunk}-${idx}`}
                  className="rounded-2xl border border-uk-line bg-[#F7F9FC] p-5"
                >
                  <div className="flex items-center gap-2 text-uk-teal-dark">
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-cw-bold uppercase tracking-wider">
                      {isBattery ? 'Storage' : isInverter ? 'Inverter' : 'Generation'}
                    </span>
                  </div>
                  <div className="mt-3 text-base font-cw-bold text-uk-navy">
                    {chunk}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTA
        eyebrow="Want a similar result on your home?"
        title={
          <>
            The same numbers,{' '}
            <span className="text-gradient">on your home.</span>
          </>
        }
        description="Send us your address and a recent energy bill. We will prepare a side-by-side design showing what a Solavita system would generate, store and save on your home."
        primaryLabel="Request a free design and quote →"
      />

      {/* Siblings */}
      {siblings.length > 0 && (
        <section className="py-16 lg:py-20 bg-[#F7F9FC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8 gap-4">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
                  <CalendarIcon className="w-3.5 h-3.5 text-uk-teal-dark" />
                  More installations
                </span>
                <h2 className="text-2xl md:text-3xl font-cw-bold text-uk-navy leading-tight">
                  Continue exploring
                </h2>
              </div>
              <Link
                href="/cases/"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-cw-bold text-uk-teal-dark hover:text-uk-teal transition-colors"
              >
                All cases
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {siblings.map((s) => (
                <CaseStudyCard key={s.slug} caseStudy={s} />
              ))}
            </div>

            <div className="sm:hidden mt-6 text-center">
              <Link
                href="/cases/"
                className="inline-flex items-center gap-1.5 text-sm font-cw-bold text-uk-teal-dark"
              >
                All cases
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Back to grid - bottom link */}
      <section className="py-8 bg-white border-t border-uk-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/cases/"
            className="inline-flex items-center gap-2 text-sm font-cw-bold text-uk-slate hover:text-uk-teal-dark transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to case studies
          </Link>
        </div>
      </section>

      <Footer variant="light" />
    </main>
  )
}
