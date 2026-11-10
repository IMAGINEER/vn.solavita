'use client'

import { Fragment } from 'react'
import {
  Fan,
  Lightbulb,
  Monitor,
  Refrigerator,
  Snowflake,
  Tv,
  WashingMachine,
  type LucideIcon,
} from 'lucide-react'

/**
 * LoadStrip — the generic "appliance + figure" strip used on the
 * solution package cards.
 *
 * Originally written for SolaMate (`SolaMateLoadStrip`), where the
 * headline figure is a *runtime* ("15 giờ"). SolaHome publishes rated
 * *loads* instead ("800 W"), so the figure is now a free-form string
 * and the component is shared by both lines.
 *
 * Every number rendered here comes from published data:
 *   - SolaMate → `solaMatePackages[].runs`
 *   - SolaHome → `solaHomeLoadReference` (the reference loads listed in
 *     the site's own savings-formula note)
 */

export type LoadIconKey =
  | 'light'
  | 'tv'
  | 'refrigerator'
  | 'ac'
  | 'washer'
  | 'fan'
  | 'pc'

export interface LoadItem {
  icon: LoadIconKey
  /** The headline figure — a runtime ("15 giờ") or a rated load ("800 W"). */
  value: string
  /** What the figure belongs to — the device name. */
  label: string
}

/**
 * Type scale for the strip.
 *
 * `sm` is the original compact strip — a single row of
 * "icon + figure + device name" chips joined by "+" signs. It is used by
 * the SolaHome package cards.
 *
 * `lg` is the SolaMate package-card version, where the strip is a
 * permanent part of the card rather than a hover detail: each appliance
 * becomes a stacked tile (icon in a soft disc, the runtime under it,
 * the device name below that) and the "+" separators are dropped, so
 * three appliances read as three separate appliances.
 */
export type LoadStripSize = 'sm' | 'lg'

interface LoadStripMetrics {
  icon: string
  /** Disc behind the icon — empty for the flat `sm` icon. */
  iconWrap: string
  /** Stacked layout (icon above the figure) instead of a side-by-side row. */
  stacked: boolean
  value: string
  label: string
  chrome: string
  caption: string
  separator: string
  chipGap: string
  blockGap: string
  /** The "+" signs between appliances. */
  noSeparator: boolean
}

const LOAD_STRIP_METRICS: Record<LoadStripSize, LoadStripMetrics> = {
  sm: {
    icon: 'h-[18px] w-[18px]',
    iconWrap: '',
    stacked: false,
    value: 'text-[11px] leading-none',
    label: 'text-[10px]',
    chrome: 'text-[10px]',
    caption: 'text-[10px]',
    separator: 'text-[11px]',
    chipGap: 'gap-1',
    blockGap: 'mt-3',
    noSeparator: false,
  },
  lg: {
    icon: 'h-6 w-6',
    iconWrap:
      'flex h-12 w-12 items-center justify-center rounded-full bg-uk-teal-soft/80',
    stacked: true,
    value: 'text-lg leading-none',
    label: 'text-[13px] leading-tight',
    chrome: 'text-[11px]',
    caption: 'text-[12px]',
    separator: 'text-[11px]',
    chipGap: 'gap-2',
    blockGap: 'mt-4',
    noSeparator: true,
  },
}

const LOAD_ICONS: Record<LoadIconKey, LucideIcon> = {
  light: Lightbulb,
  tv: Tv,
  refrigerator: Refrigerator,
  ac: Snowflake,
  washer: WashingMachine,
  fan: Fan,
  pc: Monitor,
}

function LoadChip({
  item,
  dark,
  m,
}: {
  item: LoadItem
  dark: boolean
  m: LoadStripMetrics
}) {
  const Icon = LOAD_ICONS[item.icon]
  const iconTone = dark ? 'text-uk-teal-soft' : 'text-uk-teal-dark'

  // Stacked tile — the `lg` layout: disc, figure, then the device name
  // on up to two lines (never truncated).
  if (m.stacked) {
    return (
      <div className="flex min-w-0 flex-1 flex-col items-center text-center">
        <span className={m.iconWrap}>
          <Icon
            className={`${m.icon} shrink-0 ${iconTone}`}
            strokeWidth={1.8}
          />
        </span>
        <span
          className={`mt-2.5 whitespace-nowrap ${m.value} font-cw-bold ${
            dark ? 'text-white' : 'text-uk-navy'
          }`}
        >
          {item.value}
        </span>
        <span
          className={`mt-1 max-w-full text-balance ${m.label} font-cw-regular ${
            dark ? 'text-white/65' : 'text-uk-slate'
          }`}
        >
          {item.label}
        </span>
      </div>
    )
  }

  // Flat row — the original `sm` layout.
  return (
    <div className="flex min-w-0 flex-col items-center">
      <div className={`flex items-center ${m.chipGap}`}>
        <Icon
          className={`${m.icon} shrink-0 ${iconTone}`}
          strokeWidth={1.7}
        />
        <span
          className={`whitespace-nowrap ${m.value} font-cw-bold ${
            dark ? 'text-white' : 'text-uk-navy'
          }`}
        >
          {item.value}
        </span>
      </div>
      <span
        className={`mt-1 w-full truncate text-center ${m.label} font-cw-regular ${
          dark ? 'text-white/65' : 'text-uk-slate'
        }`}
      >
        {item.label}
      </span>
    </div>
  )
}

export default function LoadStrip({
  items,
  header = 'Tải & chạy',
  note,
  caption,
  tone = 'light',
  variant = 'strip',
  columns = 3,
  size = 'sm',
  className = '',
}: {
  items: LoadItem[]
  /** Small uppercase label on the top-left of the strip. */
  header?: string
  /** Small label on the top-right of the strip. */
  note?: string
  caption?: string
  tone?: 'light' | 'dark'
  variant?: 'strip' | 'grid'
  /** Grid columns for the `grid` variant. */
  columns?: 2 | 3
  /** Type scale — `lg` doubles every icon and text size. */
  size?: LoadStripSize
  className?: string
}) {
  const dark = tone === 'dark'
  const m = LOAD_STRIP_METRICS[size]

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-3">
        <span
          className={`${m.chrome} font-cw-bold tracking-[0.2em] uppercase ${
            dark ? 'text-uk-emerald' : 'text-uk-teal-dark'
          }`}
        >
          {header}
        </span>
        {note && (
          <span
            className={`${m.chrome} font-cw-regular ${
              dark ? 'text-white/50' : 'text-uk-slate'
            }`}
          >
            {note}
          </span>
        )}
      </div>

      {variant === 'strip' ? (
        <div className={`${m.blockGap} flex items-start`}>
          {items.map((item, i) => (
            <Fragment key={`${item.label}-${i}`}>
              {i > 0 && !m.noSeparator && (
                <span
                  aria-hidden="true"
                  className={`mt-[2px] shrink-0 px-0.5 ${m.separator} font-cw-regular ${
                    dark ? 'text-white/30' : 'text-uk-slate/60'
                  }`}
                >
                  +
                </span>
              )}
              <div className="min-w-0 flex-1">
                <LoadChip item={item} dark={dark} m={m} />
              </div>
            </Fragment>
          ))}
        </div>
      ) : (
        <div
          className={`${m.blockGap} grid gap-x-2 gap-y-3 ${
            columns === 2 ? 'grid-cols-2' : 'grid-cols-3'
          }`}
        >
          {items.map((item, i) => (
            <div key={`${item.label}-${i}`} className="min-w-0">
              <LoadChip item={item} dark={dark} m={m} />
            </div>
          ))}
        </div>
      )}

      {caption && (
        <p
          className={`${m.blockGap} ${m.caption} leading-snug font-cw-regular ${
            dark ? 'text-white/55' : 'text-uk-slate'
          }`}
        >
          {caption}
        </p>
      )}
    </div>
  )
}
