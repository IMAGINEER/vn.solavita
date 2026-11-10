'use client'

import {
  ArrowLeftRight,
  ArrowRight,
  ArrowUpDown,
  Battery,
  Building2,
  Cpu,
  Factory,
  PanelsTopLeft,
  Zap,
} from 'lucide-react'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import ProductTabs from '@/components/solutions/cni/ProductTabs'
import {
  cniComponents,
  type CniComponentIcon,
} from '@/lib/data/cni'

/**
 * TechnologySection — the technical module.
 *
 * The brief asked for the old "Components Behind Every System" teaser
 * and the "Components in Detail" tab block to be merged into one
 * technical module, plus a diagram showing how the devices work
 * together. That is what this section is:
 *
 *   1. the four blocks and what each one is responsible for,
 *   2. the connection diagram (array → inverter → storage, with the
 *      energy-management layer on top and the grid and site loads
 *      underneath),
 *   3. the product tabs with the datasheets.
 */

const COMPONENT_ICONS: Record<CniComponentIcon, typeof Cpu> = {
  panel: PanelsTopLeft,
  inverter: Zap,
  battery: Battery,
  cpu: Cpu,
}

/** One labelled box in the connection diagram. */
function DiagramBox({
  icon,
  title,
  lines,
  tone = 'light',
}: {
  icon: React.ReactNode
  title: string
  lines: string[]
  tone?: 'light' | 'navy'
}) {
  const dark = tone === 'navy'
  return (
    <div
      className={`rounded-xl border px-4 py-3 text-center ${
        dark
          ? 'border-uk-navy bg-uk-navy text-white'
          : 'border-uk-line bg-white text-uk-navy'
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        <span className={dark ? 'text-uk-emerald' : 'text-uk-teal-dark'}>
          {icon}
        </span>
        <span className="text-sm font-cw-bold">{title}</span>
      </div>
      {lines.map((line) => (
        <p
          key={line}
          className={`mt-1 text-[11px] leading-snug ${
            dark ? 'text-white/70' : 'text-uk-slate'
          }`}
        >
          {line}
        </p>
      ))}
    </div>
  )
}

export default function TechnologySection() {
  return (
    <section
      id="technology"
      className="relative py-16 md:py-24 bg-sv-light scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <SectionEyebrow>SYSTEM ARCHITECTURE</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            Complete Energy Systems.{' '}
            <span className="text-gradient">Engineered to Work Together</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
            Modules, inverters, storage and the energy-management layer are
            specified as one system — one supplier, one set of
            documentation, one point of responsibility.
          </p>
        </div>

        {/* The four blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {cniComponents.map((component) => {
            const Icon = COMPONENT_ICONS[component.icon]
            return (
              <div
                key={component.id}
                className="rounded-2xl border border-uk-line bg-white p-6"
              >
                <span className="w-11 h-11 rounded-xl bg-uk-teal-soft flex items-center justify-center">
                  <Icon className="w-5 h-5 text-uk-teal-dark" strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 text-lg font-cw-bold text-uk-navy">
                  {component.title}
                </h3>
                <p className="mt-2 text-sm text-uk-slate font-cw-regular leading-relaxed">
                  {component.focus}
                </p>
                <dl className="mt-4 space-y-2">
                  {component.stats.map((stat) => (
                    <div key={stat.label}>
                      <dt className="text-[11px] font-cw-bold text-uk-slate uppercase tracking-wider">
                        {stat.label}
                      </dt>
                      <dd className="text-base font-cw-bold text-uk-navy">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )
          })}
        </div>

        {/* The connection diagram */}
        <div className="mt-12 md:mt-16 rounded-2xl border border-uk-line bg-white p-6 md:p-10">
          <h3 className="text-center text-xl md:text-2xl font-cw-bold text-uk-navy">
            How the system is <span className="text-gradient">wired together</span>
          </h3>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-3 items-center">
            {/* Row 1 — generation, conversion, storage */}
            <div className="md:col-span-1">
              <DiagramBox
                icon={<PanelsTopLeft className="w-4 h-4" strokeWidth={1.8} />}
                title="PV array"
                lines={['620–640 W modules', 'Roof or ground mounted']}
              />
            </div>
            <div className="flex justify-center text-uk-teal">
              <ArrowRight className="w-5 h-5" strokeWidth={2} />
            </div>
            <div className="md:col-span-1">
              <DiagramBox
                icon={<Zap className="w-4 h-4" strokeWidth={1.8} />}
                title="Hybrid inverter"
                lines={['Three phase, 5–20 kW', 'Grid-tied and off-grid']}
              />
            </div>
            <div className="flex justify-center text-uk-teal">
              <ArrowLeftRight className="w-5 h-5" strokeWidth={2} />
            </div>
            <div className="md:col-span-1">
              <DiagramBox
                icon={<Battery className="w-4 h-4" strokeWidth={1.8} />}
                title="Battery storage"
                lines={['5.12–16.08 kWh cabinets', 'Up to 16 in parallel']}
              />
            </div>
          </div>

          {/* The energy-management layer */}
          <div className="mt-4 flex flex-col items-center">
            <ArrowUpDown className="w-5 h-5 text-uk-teal" strokeWidth={2} />
            <div className="w-full max-w-2xl rounded-xl border border-uk-navy bg-uk-navy px-6 py-4 text-center text-white">
              <div className="flex items-center justify-center gap-2">
                <Cpu className="w-4 h-4 text-uk-emerald" strokeWidth={1.8} />
                <span className="text-sm font-cw-bold">
                  Energy management layer
                </span>
              </div>
              <p className="mt-1 text-[11px] text-white/70">
                Monitoring · dispatch scheduling · energy optimisation ·
                fault alerts
              </p>
            </div>
            <ArrowUpDown className="w-5 h-5 text-uk-teal my-4" strokeWidth={2} />
          </div>

          {/* Row 2 — the grid and the site */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-3 items-center">
            <div className="md:col-span-1">
              <DiagramBox
                icon={<Building2 className="w-4 h-4" strokeWidth={1.8} />}
                title="Utility grid"
                lines={['Import / export', 'Connection & metering']}
              />
            </div>
            <div className="flex justify-center text-uk-teal">
              <ArrowLeftRight className="w-5 h-5" strokeWidth={2} />
            </div>
            <div className="md:col-span-1">
              <DiagramBox
                icon={<Factory className="w-4 h-4" strokeWidth={1.8} />}
                title="Your site"
                lines={['Production & facilities', 'Critical loads prioritised']}
              />
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-uk-slate font-cw-regular leading-relaxed max-w-3xl mx-auto">
            The single-phase 3–12 kW hybrid and the 6 kW off-grid unit cover
            smaller sites; the diagram above shows the three-phase
            configuration used for business sites.
          </p>
        </div>

        <ProductTabs />
      </div>
    </section>
  )
}
