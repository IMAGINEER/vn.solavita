'use client'

import LoadStrip, { type LoadStripSize } from '@/components/solutions/LoadStrip'
import type { SolaMateLoad, SolaMateLoadIconKey } from '@/lib/data/solamate'

/**
 * SolaMateLoadStrip — the "TẢI & CHẠY" strip.
 *
 * Ported from the NG template's `LoadDiagram` (components/solutions/
 * CollectionPage.tsx): appliance icon + figure on the top line, the
 * device name underneath. On the NG site the strip is the hover state
 * of a solution card; here it is the hover state of the SolaMate
 * package card, with an inline copy for touch / narrow viewports.
 *
 * The three figures (`solaMatePackages[].runs`) convert each package's
 * published daily yield into fridge / air-conditioner runtime and EV
 * driving range. The reference loads behind the arithmetic — fridge
 * 150 W, AC 800 W, EV 15 kWh/100 km — are printed under the grid.
 *
 * Rendering is shared via `components/solutions/LoadStrip.tsx`; this
 * wrapper keeps the SolaMate-specific prop names.
 */

export default function SolaMateLoadStrip({
  runs,
  tone = 'light',
  variant = 'strip',
  columns = 3,
  caption,
  size = 'sm',
  className = '',
}: {
  runs: SolaMateLoad[]
  tone?: 'light' | 'dark'
  variant?: 'strip' | 'grid'
  /** Grid columns for the `grid` variant. */
  columns?: 2 | 3
  caption?: string
  /** Type scale — the SolaMate package cards use `lg`. */
  size?: LoadStripSize
  className?: string
}) {
  return (
    <LoadStrip
      className={className}
      tone={tone}
      variant={variant}
      columns={columns}
      caption={caption}
      size={size}
      header="Tải & chạy"
      note="Quy đổi mỗi ngày"
      items={runs.map((run: SolaMateLoad) => ({
        icon: run.icon as SolaMateLoadIconKey,
        value: run.value,
        label: run.device,
      }))}
    />
  )
}
