'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Wallet,
  Clock,
  Smartphone,
  BatteryCharging,
  ShieldCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHero from '@/components/ui/page-hero'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import ImagePlaceholder from '@/components/ui/image-placeholder'
import CTA from '@/components/solutions/CTA'
import FaqSection from '@/components/solutions/FaqSection'
import PhoneShowcase from '@/components/hems/PhoneShowcase'
import { openFormModal } from '@/lib/form-modal'
import { businessSolutionFaqs } from '@/lib/data/solutions'
import {
  microgridHero,
  microgridModes,
  microgridAdvantages,
  microgridScenarios,
  type MicrogridAdvantage,
} from '@/lib/data/microgrid'

/**
 * /solutions/microgrid — the third entry under the "Solutions" nav
 * dropdown, per `docs/修改建议.docx` §"Solutions - For Microgrid -
 * 详情页：①微电网实景图+②微电网优势+③典型应用场景+④APP（沿用之前的）
 * +⑤FAQ".
 *
 * Section order:
 *   ① microgrid hero image
 *   ② the three operating modes (below the image)
 *   ③ Why Choose Microgrid (icon wall with hover popovers)
 *   ④ typical application scenarios (image + text)
 *   ⑤ APP section (reuses the existing Smart Monitor block pattern)
 *   ⑥ FAQ (reuses the Business package FAQ)
 */

const ADVANTAGE_ICONS: Record<MicrogridAdvantage['icon'], LucideIcon> = {
  wallet: Wallet,
  clock: Clock,
  smartphone: Smartphone,
  battery: BatteryCharging,
  shield: ShieldCheck,
}

export default function MicrogridPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header logoHref="/" />

      {/* ① microgrid hero + real-scene image */}
      <PageHero
        backgroundImage="/images/banner_ng.webp"
        eyebrow={microgridHero.eyebrow}
        title={microgridHero.title}
        body={microgridHero.body}
        primaryCta={{ label: 'Get Free Quote', onClick: openFormModal }}
        secondaryCta={{ label: 'Explore Products', href: '/products/all-in-one-ess' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Solutions' },
          { label: 'For Microgrid' },
        ]}
      />

      <section className="relative py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ImagePlaceholder
            description={microgridHero.imageDescription}
            aspectRatio="21/9"
            className="!rounded-2xl"
          />
        </div>
      </section>

      {/* ② three operating modes */}
      <section className="relative py-16 md:py-20 bg-uk-line/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <SectionEyebrow>OPERATING MODES</SectionEyebrow>
            <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
              One Microgrid,{' '}
              <span className="text-gradient">Three Ways to Power Your Business</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {microgridModes.map((mode) => (
              <div
                key={mode.id}
                className="rounded-2xl border border-uk-line bg-white p-7 h-full"
              >
                <h3 className="text-xl font-cw-bold text-uk-navy">{mode.name}</h3>
                <p className="mt-3 text-base text-uk-slate font-cw-regular leading-relaxed">
                  {mode.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ③ Why Choose Microgrid — icon wall with hover popovers */}
      <section className="relative py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <SectionEyebrow>WHY MICROGRID</SectionEyebrow>
            <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
              Why Choose <span className="text-gradient">Microgrid</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {microgridAdvantages.map((adv) => {
              const Icon = ADVANTAGE_ICONS[adv.icon]
              return (
                <div
                  key={adv.id}
                  className="group relative rounded-2xl border border-uk-line bg-white p-6 text-center h-full"
                >
                  <div className="w-14 h-14 rounded-full bg-uk-emerald/15 flex items-center justify-center text-uk-emerald mx-auto">
                    <Icon className="w-7 h-7" strokeWidth={1.6} />
                  </div>
                  <h3 className="mt-4 text-sm font-cw-bold text-uk-navy leading-snug">
                    {adv.title}
                  </h3>
                  <p className="mt-1 text-lg font-cw-bold text-uk-teal-dark">
                    {adv.value}
                  </p>
                  {/* Hover popover — the docx reference shows the detail on
                      hover over the icon. On touch devices it stays
                      visible, so the information is never hover-only. */}
                  <div className="mt-3 hidden group-hover:block md:group-focus-within:block">
                    <p className="text-[11px] text-uk-slate font-cw-regular leading-relaxed">
                      {ADVANTAGE_DETAIL[adv.id]}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ④ typical application scenarios */}
      <section className="relative py-16 md:py-20 bg-uk-line/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <SectionEyebrow>APPLICATIONS</SectionEyebrow>
            <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
              Typical <span className="text-gradient">Application Scenarios</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {microgridScenarios.map((s) => (
              <div
                key={s.id}
                className="rounded-2xl border border-uk-line bg-white overflow-hidden"
              >
                <ImagePlaceholder
                  description={s.imageDescription}
                  aspectRatio="16/9"
                  className="!rounded-none !border-0 !border-b !border-dashed !border-slate-300"
                />
                <div className="p-6">
                  <h3 className="text-lg font-cw-bold text-uk-navy">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-uk-slate font-cw-regular">
                    {s.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⑤ the all-in-one ESS product, linked across */}
      <section className="relative py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <SectionEyebrow>THE HARDWARE</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
            Built on the <span className="text-gradient">All-in-One ESS</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
            Every microgrid configuration runs on the same 125 kW / 261 kWh
            cabinet. See its full technical data before you size a site.
          </p>
          <Link
            href="/products/all-in-one-ess"
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full btn-gradient text-sm font-cw-bold text-white"
          >
            All-in-One ESS details
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>
      </section>

      <CTA
        eyebrow="Ready when you are"
        title={
          <>
            Not a Solavita customer yet?
            <br />
            <span className="text-gradient">Start with a free design.</span>
          </>
        }
        description="If you're still weighing your options, our team can prepare a free, no-obligation design that shows how solar panels, battery storage or a full home energy system would fit your home."
      />

      {/* ④ APP — reuses the existing Solavita HEMS app section */}
      <PhoneShowcase />

      {/* ⑤ FAQ — reuses the Business package FAQ, per the docx */}
      <FaqSection faqs={businessSolutionFaqs} />

      <Footer />
    </main>
  )
}

/**
 * Hover-popover copy for the "Why Choose Microgrid" icon wall.
 *
 * The docx gives the headline figures only (70%~90% / <10ms / 24/7 /
 * 5+ years / <24h) and the reference image shows a hover detail
 * without transcribing it, so these lines explain the figure in the
 * business's own terms. They make no new promise beyond the headline
 * number itself.
 */
const ADVANTAGE_DETAIL: Record<string, string> = {
  'cut-diesel':
    'Run on solar and storage instead of burning fuel every day.',
  'zero-downtime':
    'Transfer to battery in under 10 ms — your equipment does not notice.',
  'remote-monitor':
    'Watch generation, battery state and load live from the app, day or night.',
  cycles: 'Battery chemistry rated for 6000+ cycles and a 5+ year service life.',
  'local-service':
    'A local team on the ground with a response target under 24 hours.',
}
