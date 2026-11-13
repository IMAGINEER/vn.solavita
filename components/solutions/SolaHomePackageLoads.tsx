import {
  AirVent,
  CookingPot,
  Fan,
  Lightbulb,
  Microwave,
  Monitor,
  Refrigerator,
  Snowflake,
  Tv,
  Utensils,
  WashingMachine,
  Waves,
  type LucideIcon,
} from 'lucide-react'
import type {
  SolaHomeLoadIconKey,
  SolaHomeLoadProfile,
} from '@/lib/data/solahome'

const icons: Record<SolaHomeLoadIconKey, LucideIcon> = {
  'ac-wall': AirVent,
  'ac-floor': Snowflake,
  refrigerator: Refrigerator,
  fan: Fan,
  light: Lightbulb,
  tv: Tv,
  washer: WashingMachine,
  cooker: CookingPot,
  pump: Waves,
  monitor: Monitor,
  oven: Microwave,
  dishwasher: Utensils,
}

/**
 * SolaHomePackageLoads — the published "typical load & runtime" row for
 * one package, laid out as a 2 × 3 grid.
 *
 * Each item is the device, an icon and the daily runtime printed in the
 * flyer. No power figures are added here: `solaHomeRoofTableNote` carries
 * the four reference powers behind the savings model, and the two are
 * different things (what the package can run vs. what the economics
 * assume).
 */
export default function SolaHomePackageLoads({
  loads,
  tone = 'light',
  className = '',
}: {
  loads: SolaHomeLoadProfile[]
  /** `dark` is the package-card hover overlay, drawn over the photo. */
  tone?: 'light' | 'dark'
  className?: string
}) {
  const dark = tone === 'dark'
  return (
    <ul className={`grid grid-cols-2 gap-x-3 gap-y-2.5 ${className}`}>
      {loads.map((load) => {
        const Icon = icons[load.icon]
        return (
          <li key={load.label} className="flex min-w-0 items-start gap-1.5">
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
                dark
                  ? 'bg-[#ffffff1a] text-uk-teal-soft'
                  : 'bg-uk-teal-soft text-uk-teal-dark'
              }`}
            >
              <Icon
                className="h-3 w-3"
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </span>
            <span className="min-w-0 leading-tight">
              <span
                className={`block text-[10px] ${
                  dark ? 'text-white/65' : 'text-uk-slate'
                }`}
              >
                {load.label}
              </span>
              <span
                className={`mt-0.5 block text-[11px] font-cw-bold ${
                  dark ? 'text-white' : 'text-uk-navy'
                }`}
              >
                {load.hours}
              </span>
            </span>
          </li>
        )
      })}
    </ul>
  )
}