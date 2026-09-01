'use client'

import { SolarPanel, BatteryCharging, CircuitBoard } from 'lucide-react'

export type ProductKind = 'panel' | 'battery' | 'inverter'

interface ProductCardProps {
  kind: ProductKind
  title: string
  subtitle: string
  /** Display value, already formatted, e.g. "8.1 kWp". */
  value: string
  /** "Change plan ›" handler - scrolls to the plan selector. All three
   *  components are bound to the same handler because Solar panels /
   *  Battery / Inverter are bundled into the plan and cannot be
   *  adjusted independently. */
  onChange: () => void
}

/**
 * Icon set for the three product cards. Picked for visual consistency
 * with the energy-system theme:
 *   - `SolarPanel`     - accurate PV module representation
 *   - `BatteryCharging` - energy-storage feel, better than plain Battery
 *   - `CircuitBoard`   - closest electrical-equipment metaphor for an
 *                        inverter (Cpu was a contender but leans IT)
 *
 * All three share `strokeWidth={1.8}` and a 30px box so the trio reads
 * as a unified set across the "Your system" strip.
 */
function KindIcon({ kind }: { kind: ProductKind }) {
  const Icon =
    kind === 'panel'
      ? SolarPanel
      : kind === 'battery'
        ? BatteryCharging
        : CircuitBoard
  return (
    <div className="w-[30px] h-[30px] flex items-center justify-center mb-3 text-uk-teal-dark">
      <Icon className="w-[30px] h-[30px]" strokeWidth={1.8} />
    </div>
  )
}

/**
 * One product card in the "Your system" strip. Renders the current plan's
 * fixed PV / battery / inverter values - these are NOT user-editable in v1,
 * the plan itself is. The "Change plan ›" button scrolls to the plan
 * selector.
 */
export default function ProductCard({
  kind,
  title,
  subtitle,
  value,
  onChange,
}: ProductCardProps) {
  return (
    <article className="rounded-2xl p-6 bg-white border border-uk-line hover:border-uk-teal/50 hover:shadow-md transition-all flex flex-col min-h-[260px]">
      <KindIcon kind={kind} />

      <h3 className="text-lg font-cw-bold text-uk-navy">{title}</h3>
      <p className="text-xs text-uk-slate mt-1">{subtitle}</p>

      <div className="mt-4">
        <span className="text-xl font-cw-bold text-uk-teal-dark tabular-nums">
          {value}
        </span>
      </div>

      <div className="mt-auto pt-4 border-t border-uk-line">
        <button
          type="button"
          onClick={onChange}
          className="text-uk-teal hover:text-uk-teal-dark text-sm font-cw-bold transition-colors"
        >
          Change plan ›
        </button>
      </div>
    </article>
  )
}