'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * SolaMatePaybackChart — the HOÀN VỐN curve.
 *
 * A single-series area chart: cumulative savings (triệu VND) over 30
 * years, plotted from the published points, with the initial investment
 * drawn as the breakeven line and the payback year marked where the
 * curve crosses it.
 *
 * Built to the dataviz house rules:
 *   - one hue, 2px line, ~10% area wash, ≥8px markers with a 2px
 *     surface ring, hairline solid gridlines;
 *   - selective direct labels (payback + endpoint), not a number on
 *     every point;
 *   - a hover layer with a crosshair that snaps to the nearest point,
 *     and the same readout on keyboard focus;
 *   - a table view twin, so no value is locked behind the tooltip.
 *
 * Colours come from CSS variables set in `app/globals.css` — one
 * validated step for the light surface and a separately chosen step for
 * the dark surface (never an automatic flip).
 */

interface SeriesPoint {
  year: number
  value: number
}

const PAD = { top: 18, right: 18, bottom: 30, left: 46 }
const PLOT_H = 210
const HEIGHT = PAD.top + PLOT_H + PAD.bottom
const Y_MAX = 200
const X_MAX = 30
const Y_TICKS = [0, 50, 100, 150, 200]
const X_TICKS = [0, 10, 20, 30]

const formatVn = (v: number) =>
  v.toLocaleString('vi-VN', { maximumFractionDigits: 1 })

export default function SolaMatePaybackChart({
  series,
  investment,
  paybackYears,
}: {
  series: SeriesPoint[]
  investment: number
  paybackYears: number
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(560)
  const [active, setActive] = useState<{
    year: number
    value: number
    x: number
    y: number
  } | null>(null)

  // Measure the container so the SVG is drawn at real pixel size — a
  // scaled viewBox would shrink the axis type below reading size on
  // narrow screens.
  useEffect(() => {
    const node = wrapRef.current
    if (!node) return
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width
      if (w) setWidth(Math.round(w))
    })
    ro.observe(node)
    return () => ro.disconnect()
  }, [])

  const plotW = Math.max(140, width - PAD.left - PAD.right)

  const x = (year: number) => PAD.left + (year / X_MAX) * plotW
  const y = (value: number) => PAD.top + PLOT_H - (value / Y_MAX) * PLOT_H

  // Piecewise-linear value of the curve at an arbitrary year.
  const valueAt = (year: number) => {
    if (year <= series[0].year) return series[0].value
    for (let i = 1; i < series.length; i++) {
      const a = series[i - 1]
      const b = series[i]
      if (year <= b.year) {
        const t = (year - a.year) / (b.year - a.year)
        return a.value + (b.value - a.value) * t
      }
    }
    return series[series.length - 1].value
  }

  const geometry = useMemo(() => {
    const line = series
      .map((p) => `${x(p.year).toFixed(1)},${y(p.value).toFixed(1)}`)
      .join(' ')
    const baseY = y(0).toFixed(1)
    const area = `M ${x(series[0].year).toFixed(1)},${baseY} L ${series
      .map((p) => `${x(p.year).toFixed(1)},${y(p.value).toFixed(1)}`)
      .join(' L ')} L ${x(series[series.length - 1].year).toFixed(1)},${baseY} Z`
    return { line, area }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series, plotW])

  const handleMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const px = event.clientX - rect.left
    const year = Math.min(
      X_MAX,
      Math.max(0, ((px - PAD.left) / plotW) * X_MAX)
    )
    const value = valueAt(year)
    setActive({ year, value, x: x(year), y: y(value) })
  }

  const endpoint = series[series.length - 1]
  const tooltipLeft = active
    ? Math.min(Math.max(active.x, 70), Math.max(70, width - 70))
    : 0

  return (
    <div ref={wrapRef} className="relative">
      <svg
        width={width}
        height={HEIGHT}
        viewBox={`0 0 ${width} ${HEIGHT}`}
        role="img"
        aria-label={`Biểu đồ lợi nhuận tích lũy: sau 5 năm ${formatVn(series[1]?.value ?? 0)} triệu đồng, sau 30 năm ${formatVn(endpoint.value)} triệu đồng; hoàn vốn khoảng ${formatVn(paybackYears)} năm.`}
        onPointerMove={handleMove}
        onPointerLeave={() => setActive(null)}
        className="block touch-pan-y"
      >
        <defs>
          <linearGradient id="solamate-payback-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-fill)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--chart-fill)" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Gridlines — hairline, solid, recessive. */}
        {Y_TICKS.map((t) => (
          <g key={t}>
            <line
              x1={PAD.left}
              x2={PAD.left + plotW}
              y1={y(t)}
              y2={y(t)}
              stroke="var(--chart-grid)"
              strokeWidth="1"
            />
            <text
              x={PAD.left - 10}
              y={y(t) + 4}
              textAnchor="end"
              className="fill-[var(--chart-axis)] text-[11px]"
            >
              {t}
            </text>
          </g>
        ))}

        {/* Breakeven threshold — the initial investment. Dashed because it
            is a threshold, not a gridline. */}
        <line
          x1={PAD.left}
          x2={PAD.left + plotW}
          y1={y(investment)}
          y2={y(investment)}
          stroke="var(--chart-threshold)"
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />
        <text
          x={PAD.left + plotW}
          y={y(investment) - 8}
          textAnchor="end"
          className="fill-[var(--chart-axis)] text-[11px] font-cw-bold"
        >
          Đầu tư ban đầu ~{formatVn(investment)} triệu
        </text>

        {/* Area + line. */}
        <path d={geometry.area} fill="url(#solamate-payback-fill)" />
        <polyline
          points={geometry.line}
          fill="none"
          stroke="var(--chart-line)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Payback marker — where the curve crosses the investment line. */}
        <line
          x1={x(paybackYears)}
          x2={x(paybackYears)}
          y1={y(investment)}
          y2={y(0)}
          stroke="var(--chart-threshold)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <circle
          cx={x(paybackYears)}
          cy={y(investment)}
          r="5"
          fill="var(--chart-line)"
          stroke="var(--chart-surface)"
          strokeWidth="2"
        />
        <text
          x={x(paybackYears) + 10}
          y={y(investment) + 18}
          textAnchor="start"
          className="fill-[var(--chart-label)] text-[11px] font-cw-bold"
        >
          Hoàn vốn ~{formatVn(paybackYears)} năm
        </text>

        {/* Published points — focusable, so the readout is reachable by
            keyboard as well as by pointer. */}
        {series.map((p) => (
          <circle
            key={p.year}
            cx={x(p.year)}
            cy={y(p.value)}
            r="4.5"
            fill="var(--chart-line)"
            stroke="var(--chart-surface)"
            strokeWidth="2"
            tabIndex={0}
            role="button"
            aria-label={`Năm ${p.year}: ${formatVn(p.value)} triệu đồng`}
            onFocus={() =>
              setActive({ year: p.year, value: p.value, x: x(p.year), y: y(p.value) })
            }
            onBlur={() => setActive(null)}
            className="outline-none focus-visible:r-6"
          />
        ))}

        {/* Endpoint label — the one direct value label on the curve. */}
        <text
          x={x(endpoint.year) - 10}
          y={y(endpoint.value) - 12}
          textAnchor="end"
          className="fill-[var(--chart-label)] text-[11px] font-cw-bold"
        >
          ~{formatVn(endpoint.value)} triệu
        </text>

        {/* X axis. */}
        <line
          x1={PAD.left}
          x2={PAD.left + plotW}
          y1={y(0)}
          y2={y(0)}
          stroke="var(--chart-grid)"
          strokeWidth="1"
        />
        {X_TICKS.map((t) => (
          <text
            key={t}
            x={x(t)}
            y={y(0) + 18}
            textAnchor={t === 0 ? 'start' : t === X_MAX ? 'end' : 'middle'}
            className="fill-[var(--chart-axis)] text-[11px]"
          >
            {t}
          </text>
        ))}
        <text
          x={x(X_MAX)}
          y={y(0) + 30}
          textAnchor="end"
          className="fill-[var(--chart-axis)] text-[10px]"
        >
          năm
        </text>

        {/* Hover layer — crosshair + the snapped point. */}
        {active && (
          <g>
            <line
              x1={active.x}
              x2={active.x}
              y1={PAD.top}
              y2={y(0)}
              stroke="var(--chart-line)"
              strokeWidth="1"
              strokeOpacity="0.5"
            />
            <circle
              cx={active.x}
              cy={active.y}
              r="5"
              fill="var(--chart-line)"
              stroke="var(--chart-surface)"
              strokeWidth="2"
            />
          </g>
        )}
      </svg>

      {/* Readout — value leads, label follows. */}
      {active && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-lg border border-uk-line bg-white px-3 py-2 shadow-lg"
          style={{ left: tooltipLeft, top: Math.max(0, active.y - 62) }}
        >
          <p className="font-cw-bold text-sm text-uk-navy">
            ~{formatVn(active.value)} triệu đồng
          </p>
          <p className="text-[11px] text-uk-slate">
            Sau {formatVn(active.year)} năm
          </p>
        </div>
      )}

      {/* Table view — every value reachable without hovering. */}
      <table className="mt-4 w-full border-t border-uk-line text-sm">
        <caption className="sr-only">
          Lợi nhuận tích lũy theo năm, triệu đồng Việt Nam
        </caption>
        <thead>
          <tr>
            <th
              scope="col"
              className="py-2 text-left text-xs font-cw-bold text-uk-slate"
            >
              Mốc thời gian
            </th>
            <th
              scope="col"
              className="py-2 text-right text-xs font-cw-bold text-uk-slate"
            >
              Lợi nhuận tích lũy
            </th>
          </tr>
        </thead>
        <tbody>
          {series
            .filter((p) => p.year > 0)
            .map((p) => (
              <tr key={p.year} className="border-t border-uk-line/60">
                <th scope="row" className="py-2 text-left font-cw-regular text-uk-navy">
                  Năm {p.year}
                </th>
                <td className="py-2 text-right font-cw-bold text-uk-navy">
                  ~{formatVn(p.value)} triệu VND
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
