'use client'

import LoadStrip, { type LoadStripSize } from '@/components/solutions/LoadStrip'
import type { SolaMateLoad, SolaMateLoadIconKey } from '@/lib/data/solamate'

/**
 * SolaMateLoadStrip — the "TẢI & CHẠY" strip.
 *
 * Ported from the NG template's `LoadDiagram` (components/solutions/
 * CollectionPage.tsx): appliance icon + estimated runtime on the top
 * line, the device name underneath, the rows joined by a "+". On the
 * NG site the strip is the hover state of a solution card; here it is
 * the hover state of the SolaMate package card, with an inline copy
 * for touch / narrow viewports where hover does not exist.
 *
 * The runtime figures are the publisher's own example set
 * (`solaMatePackages[].runs`) — nothing here is estimated.
 *
 * Rendering is shared with SolaHome via `components/solutions/
 * LoadStrip.tsx`; this wrapper keeps the SolaMate-specific prop names.
 */

export default function SolaMateLoadStrip({
  runs,
  tone = 'light',
  variant = 'strip',
  caption,
  size = 'sm',
  className = '',
}: {
  runs: SolaMateLoad[]
  tone?: 'light' | 'dark'
  variant?: 'strip' | 'grid'
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
      caption={caption}
      size={size}
      header="Tải & chạy"
      note="Thời gian chạy"
      items={runs.map((run: SolaMateLoad) => ({
        icon: run.icon as SolaMateLoadIconKey,
        value: run.hours,
        label: run.device,
      }))}
    />
  )
}
