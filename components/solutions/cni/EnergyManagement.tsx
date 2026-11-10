'use client'

import {
  Activity,
  Bell,
  BatteryCharging,
  LayoutDashboard,
  Sun,
  Zap,
} from 'lucide-react'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import TbdText from '@/components/ui/tbd-text'

/**
 * EnergyManagement — the desktop dashboard + mobile app block.
 *
 * The brief asked for more than a phone screenshot: a business needs to
 * see the dashboard an operations team would use. The phone on the right
 * is the real app screen; the panel on the left is a labelled layout
 * sample of the desktop dashboard — the tiles name what is measured, not
 * readings, because publishing live numbers for a site we do not operate
 * would be fiction. The published screenshot slot stays a visible TBD.
 */

const DASHBOARD_TILES = [
  { icon: Sun, title: 'PV generation', unit: 'kW, live' },
  { icon: Activity, title: 'Site consumption', unit: 'kW, live' },
  { icon: BatteryCharging, title: 'Battery', unit: 'state of charge %' },
  { icon: Zap, title: 'Grid', unit: 'import / export kW' },
]

const DASHBOARD_ROWS = [
  {
    icon: LayoutDashboard,
    title: 'Real-time energy monitoring',
    body: 'Generation, consumption and storage state for every site on one screen.',
  },
  {
    icon: Sun,
    title: 'PV generation & consumption',
    body: 'What the array produced against what the site actually used.',
  },
  {
    icon: BatteryCharging,
    title: 'Battery charging & discharging',
    body: 'Charge and discharge windows, state of charge and available runtime.',
  },
  {
    icon: Zap,
    title: 'Grid import & export',
    body: 'What came from the grid and what the site put back, per interval.',
  },
  {
    icon: Bell,
    title: 'System alerts & remote management',
    body: 'Fault notifications, schedules and settings managed remotely.',
  },
]

export default function EnergyManagement() {
  return (
    <section
      id="energy-management"
      className="relative py-16 md:py-24 bg-sv-light scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <SectionEyebrow>SMART ENERGY MANAGEMENT</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            Take Full Control of Your Energy,{' '}
            <span className="text-gradient">Anywhere</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
            One platform for the whole portfolio: a desktop dashboard for
            the operations team, and the app for whoever is on site.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
          {/* Desktop dashboard */}
          <div className="lg:col-span-2 rounded-2xl border border-uk-line bg-white overflow-hidden shadow-sm">
            {/* Window chrome */}
            <div className="flex items-center gap-2 border-b border-uk-line bg-uk-line/20 px-4 py-3">
              <span className="w-3 h-3 rounded-full bg-uk-line" />
              <span className="w-3 h-3 rounded-full bg-uk-line" />
              <span className="w-3 h-3 rounded-full bg-uk-line" />
              <span className="ml-3 text-xs font-cw-bold text-uk-slate">
                Desktop dashboard — site energy overview
              </span>
            </div>

            <div className="p-5 md:p-6">
              {/* The measured blocks */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {DASHBOARD_TILES.map((tile) => (
                  <div
                    key={tile.title}
                    className="rounded-xl border border-uk-line bg-sv-light p-4"
                  >
                    <tile.icon className="w-4 h-4 text-uk-teal-dark" strokeWidth={2} />
                    <p className="mt-2 text-sm font-cw-bold text-uk-navy leading-tight">
                      {tile.title}
                    </p>
                    <p className="mt-1 text-[11px] text-uk-slate font-cw-regular">
                      {tile.unit}
                    </p>
                  </div>
                ))}
              </div>

              {/* Sample chart frame — no readings, so no invented data */}
              <div className="mt-5 rounded-xl border border-dashed border-uk-line bg-white p-5">
                <p className="text-xs font-cw-bold text-uk-slate uppercase tracking-wider">
                  Generation vs. consumption — daily profile
                </p>
                <div className="mt-4 flex items-end gap-2 h-24" aria-hidden="true">
                  {[38, 52, 74, 88, 70, 46, 22, 12].map((height, index) => (
                    <div key={index} className="flex-1 flex flex-col gap-1">
                      <div
                        className="w-full rounded-t bg-uk-teal/70"
                        style={{ height: `${height}%` }}
                      />
                      <div
                        className="w-full rounded-t bg-uk-teal-soft"
                        style={{ height: `${Math.max(6, height - 28)}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-4 text-[11px] text-uk-slate font-cw-regular">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-uk-teal/70" /> PV
                    generation
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-uk-teal-soft" />{' '}
                    Site consumption
                  </span>
                </div>
              </div>

              {/* The capability rows */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {DASHBOARD_ROWS.map((row) => (
                  <div key={row.title} className="flex items-start gap-3">
                    <span className="mt-0.5 w-8 h-8 rounded-lg bg-uk-teal-soft flex items-center justify-center flex-shrink-0">
                      <row.icon
                        className="w-4 h-4 text-uk-teal-dark"
                        strokeWidth={1.9}
                      />
                    </span>
                    <div>
                      <p className="text-sm font-cw-bold text-uk-navy leading-tight">
                        {row.title}
                      </p>
                      <p className="mt-1 text-xs text-uk-slate font-cw-regular leading-relaxed">
                        {row.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-[11px] leading-relaxed">
                <TbdText
                  text="Published screenshot of the desktop web dashboard (chờ xác nhận) — the layout above is a sample, the app screen opposite is the real product"
                  inline
                />
              </p>
            </div>
          </div>

          {/* The app */}
          <div className="rounded-2xl border border-uk-line bg-white p-6 text-center">
            <p className="text-xs font-cw-bold text-uk-slate uppercase tracking-[0.16em]">
              On site, in your pocket
            </p>
            <div className="mx-auto mt-5 max-w-[240px]">
              <div className="relative rounded-[2rem] border-[6px] border-uk-navy/80 bg-sv-navy overflow-hidden shadow-xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-sv-dark rounded-b-2xl z-10" />
                <img
                  alt="Solavita monitoring app — live energy overview"
                  loading="lazy"
                  className="w-full h-auto block"
                  src="/images/cloud-app-data.webp"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href="https://apps.apple.com/us/app/skyworth-pv/id6499499800"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="App Store download"
                className="inline-flex items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-uk-teal-soft border border-uk-teal/30 hover:border-uk-teal/60 transition-colors"
              >
                <svg
                  className="w-6 h-6 text-uk-navy"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <span className="text-left">
                  <span className="block text-[10px] text-uk-slate font-cw-regular">
                    Download on the
                  </span>
                  <span className="block text-sm font-cw-bold text-uk-navy">
                    App Store
                  </span>
                </span>
              </a>

              <a
                href="https://play.google.com/store/apps/details?id=com.solavita.cloud"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Google Play download"
                className="inline-flex items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-uk-teal-soft border border-uk-teal/30 hover:border-uk-teal/60 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="#00B9EE"
                  aria-hidden="true"
                >
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a.996.996 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.302 2.302-8.636-8.634z" />
                </svg>
                <span className="text-left">
                  <span className="block text-[10px] text-uk-slate font-cw-regular">
                    Get it on
                  </span>
                  <span className="block text-sm font-cw-bold text-uk-navy">
                    Google Play
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
