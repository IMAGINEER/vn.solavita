'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHero from '@/components/ui/page-hero'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import ImagePlaceholder from '@/components/ui/image-placeholder'
import CTA from '@/components/solutions/CTA'
import { products, type ProductCategory } from '@/lib/data/products'
import { openFormModal } from '@/lib/form-modal'

/**
 * ProductHub — `/products`, the "Products (产品中心)" landing page.
 *
 * The nav groups the catalogue into two entries (per the IA table in
 * `docs/修改建议.docx`):
 *   - "Module & Inverter & Battery" → Module, Inverter, Battery
 *   - "All-in-One ESS"               → the C&I storage cabinet
 *
 * Both groups are surfaced here as sections so the page is a complete
 * entry point on its own, whichever nav item the visitor came from.
 */

const GROUPS: {
  id: ProductCategory
  title: string
  description: string
  slugs: string[]
}[] = [
  {
    id: 'module-inverter-battery',
    title: 'Module & Inverter & Battery',
    description:
      'The core of every Solavita system — the 620 W TOPCon module, the hybrid and off-grid inverter families, and the modular LiFePO₄ battery.',
    slugs: ['module', 'inverter', 'battery'],
  },
  {
    id: 'all-in-one-ess',
    title: 'All-in-One ESS',
    description:
      'A single 125 kW / 261 kWh cabinet for factories, supermarkets, community mini-grids and telecom sites.',
    slugs: ['all-in-one-ess'],
  },
]

export default function ProductHub() {
  return (
    <main className="min-h-screen bg-white">
      <Header logoHref="/" />

      <PageHero
        backgroundImage="/images/banner_ng.webp"
        eyebrow="PRODUCTS"
        title={'*The Hardware Behind\nEvery Solavita System.*'}
        body="Modules, inverters, batteries and the all-in-one ESS — the components every Solavita system is built from, with the parameters you need to size them."
        primaryCta={{ label: 'Get Free Quote', onClick: openFormModal }}
        secondaryCta={{ label: 'Explore Solutions', href: '/solutions/home-solar' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Products' },
        ]}
      />

      {GROUPS.map((group) => {
        const items = products.filter((p) => group.slugs.includes(p.slug))
        return (
          <section
            key={group.id}
            className="relative py-16 md:py-20 bg-uk-line/30"
          >
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-10">
                <SectionEyebrow>
                  {group.id === 'all-in-one-ess'
                    ? 'ALL-IN-ONE ESS'
                    : 'CORE COMPONENTS'}
                </SectionEyebrow>
                <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
                  {group.title}
                </h2>
                <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed max-w-3xl mx-auto">
                  {group.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/products/${p.slug}`}
                    className="group flex flex-col rounded-2xl border border-uk-line bg-white overflow-hidden transition-all duration-300 hover:border-uk-teal hover:shadow-md hover:-translate-y-0.5"
                  >
                    <ImagePlaceholder
                      description={p.imageDescription}
                      aspectRatio="16/9"
                      className="!rounded-none !border-0 !border-b !border-dashed !border-slate-300"
                    />
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-cw-bold text-uk-navy leading-tight">
                        {p.name}
                      </h3>
                      <p className="mt-1 text-sm font-cw-bold text-uk-teal-dark">
                        {p.tagline}
                      </p>
                      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                        {p.stats.map((s) => (
                          <div
                            key={s.label}
                            className="rounded-xl border border-uk-line bg-uk-line/30 px-2 py-2"
                          >
                            <div className="text-sm font-cw-bold text-uk-teal-dark">
                              {s.value}
                            </div>
                            <div className="mt-0.5 text-[10px] uppercase tracking-wider text-uk-slate font-cw-regular">
                              {s.label}
                            </div>
                          </div>
                        ))}
                      </div>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-cw-bold text-uk-teal group-hover:text-uk-teal-dark transition-colors">
                        View {p.name} details
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )
      })}

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

      <Footer />
    </main>
  )
}
