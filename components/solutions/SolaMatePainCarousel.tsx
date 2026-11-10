'use client'

import { useEffect, useRef, useState, type ReactElement } from 'react'
import { AlertTriangle, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react'
import type {
  SolaMateComicFrame,
  SolaMateComicIcon,
} from '@/lib/data/solamate'

/**
 * SolaMatePainCarousel — the eight-frame comic that runs beside the
 * "VÌ SAO BẠN ĐANG PHÂN VÂN" heading.
 *
 * The frames come in pairs. Odd frames (01, 03, 05, 07) state a worry and
 * carry a `before-N` illustration; even frames (02, 04, 06, 08) answer it
 * with the matching `after-N` picture. The reader therefore sees
 * worry → answer, worry → answer, and the small "Trước / Sau" pill on each
 * frame makes the pairing explicit. A frame without artwork falls back to
 * its line-art icon on the amber gradient.
 *
 * The slides cross-fade (CSS opacity, no JS animation) and advance on a
 * timer that pauses while the reader hovers or focuses the block — the
 * same pause-on-viewport behaviour the monitoring section uses, so the
 * carousel never rotates away from a line someone is reading.
 */

const ROTATE_MS = 6000

/* ──────────────────────────────────────────────────────────────────────
   Pain-frame illustrations — 80×80 line art, drawn in the currentColor
   of the frame so the component decides the colour.
   ────────────────────────────────────────────────────────────────────── */

type IconProps = { className?: string }

const BillIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 80 80"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="28" cy="42" r="17" />
    <path d="M30 27L19 46h9l-4 14 13-21h-9z" />
    <path d="M58 56V30" />
    <path d="M51 37l7-7 7 7" />
  </svg>
)

const PanelIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 80 80"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 26L56 14v24L12 50z" />
    <path d="M26 22v24M40 18v24" />
    <path d="M66 22v26" />
    <path d="M60 42l6 6 6-6" />
    <path d="M18 60h10M32 58h10M46 56h8" />
  </svg>
)

const StormIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 80 80"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M42 10L24 42h12l-6 26 22-38H40l10-20z" />
    <path d="M16 48l-5 12M16 66l-5 12M64 46l5 12" />
  </svg>
)

const PermitIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 80 80"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M14 10h30l14 14v44H14z" />
    <path d="M44 10v14h14" />
    <path d="M24 34h22M24 44h22M24 54h12" />
    <circle cx="54" cy="54" r="13" />
    <path d="M44 64l-9 9" />
  </svg>
)

const PAIN_ICONS: Record<SolaMateComicIcon, (p: IconProps) => ReactElement> = {
  bill: BillIcon,
  panel: PanelIcon,
  storm: StormIcon,
  permit: PermitIcon,
}

export default function SolaMatePainCarousel({
  frames,
}: {
  frames: SolaMateComicFrame[]
}) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (paused) return
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % frames.length)
    }, ROTATE_MS)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [paused, frames.length])

  const go = (next: number) =>
    setIndex((next + frames.length) % frames.length)

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Frames — the slides cross-fade in place so the block never jumps. */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-uk-line bg-uk-line/30">
        {frames.map((f, i) => {
          const pain = f.kind === 'pain'
          const Icon = f.icon ? PAIN_ICONS[f.icon] : null
          return (
            <div
              key={`${f.title}-${i}`}
              aria-hidden={i !== index}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                i === index ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {f.imagePath ? (
                <img
                  src={f.imagePath}
                  alt={f.imageAlt ?? ''}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-50 via-white to-amber-50/60">
                  {Icon && (
                    <Icon className="h-24 w-24 text-amber-500 md:h-28 md:w-28" />
                  )}
                </div>
              )}
              {/* The scrim keeps the frame number legible. Pain frames
                  get a warm scrim, solution frames the brand navy. */}
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-t ${
                  pain
                    ? 'from-amber-950/60 via-amber-950/5'
                    : 'from-uk-navy/75 via-uk-navy/5'
                } to-transparent`}
              />
              {/* Before / after marker — the two frames of a pair say
                  which side of the change they are on. */}
              <span
                className={`absolute left-4 top-4 rounded-full px-2.5 py-1 text-[10px] font-cw-bold tracking-[0.16em] uppercase shadow-sm ${
                  pain ? 'bg-amber-400 text-amber-950' : 'bg-uk-teal text-white'
                }`}
              >
                {pain ? 'Trước' : 'Sau'}
              </span>
              <span className="absolute bottom-4 left-5 font-cw-bold text-4xl text-white/85">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
          )
        })}
      </div>

      {/* Copy — every frame's text is stacked in the same grid cell, so
          the block is always as tall as the longest copy at the current
          width. Only the active one is visible; the rest are `invisible`
          (they still occupy the cell), which keeps the controls below
          from moving as frames rotate. */}
      <div className="mt-6 grid">
        {frames.map((f, i) => {
          const pain = f.kind === 'pain'
          const current = i === index
          return (
            <div
              key={`copy-${f.title}-${i}`}
              aria-hidden={!current}
              style={{ gridArea: '1 / 1' }}
              className={current ? '' : 'invisible'}
            >
              <div
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-cw-bold tracking-[0.16em] uppercase ${
                  pain
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-uk-teal-soft text-uk-teal-dark'
                }`}
              >
                {pain ? (
                  <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2.2} />
                ) : (
                  <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.2} />
                )}
                {pain ? 'Nỗi lo' : 'Cách Solavita giải quyết'}
              </div>
              <p className="mt-3 font-cw-bold text-lg leading-snug text-uk-navy">
                {f.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-uk-slate">
                {f.body}
              </p>
            </div>
          )
        })}
      </div>

      {/* Controls — dots jump to a frame, arrows step through them. */}
      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {frames.map((f, i) => (
            <button
              key={`${f.title}-${i}`}
              type="button"
              aria-label={`Xem khung ${i + 1}`}
              aria-current={i === index}
              onClick={() => go(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index
                  ? 'w-6 bg-uk-teal'
                  : f.kind === 'solution'
                    ? 'w-2 bg-uk-teal/30 hover:bg-uk-teal/50'
                    : 'w-2 bg-amber-300/70 hover:bg-amber-400'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Khung trước"
            onClick={() => go(index - 1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-uk-line text-uk-navy transition-colors hover:border-uk-teal hover:text-uk-teal-dark"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2.4} />
          </button>
          <span className="text-xs font-cw-bold text-uk-slate tabular-nums">
            {String(index + 1).padStart(2, '0')} / {String(frames.length).padStart(2, '0')}
          </span>
          <button
            type="button"
            aria-label="Khung tiếp theo"
            onClick={() => go(index + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-uk-line text-uk-navy transition-colors hover:border-uk-teal hover:text-uk-teal-dark"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </div>
  )
}
