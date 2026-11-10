'use client'

import { useState, type ReactElement, type ReactNode } from 'react'
import {
  Activity,
  Battery,
  BatteryCharging,
  Gauge,
  Moon,
  Plug,
  PlugZap,
  Sun,
  UtilityPole,
  type LucideIcon,
} from 'lucide-react'
import {
  solaHomeEnergyStates,
  solaHomeHems,
  type SolaHomeEnergyState,
} from '@/lib/data/solahome'

/**
 * SolaHomeEnergyFlow — the day / night / outage simulator.
 *
 * The old page split "energy management features" and "energy flow"
 * into two blocks and told the reader about three modes in prose. This
 * version shows one diagram and lets the visitor switch the state, so
 * the same system is seen doing three different jobs.
 *
 * Flow logic comes from the published operating modes: solar serves
 * the load first, surplus charges the battery, the grid fills the gap,
 * and an outage moves the essential loads onto the battery. No kWh
 * runtime is shown — the official SolaHome material does not publish
 * per-state runtime (see docs/VN-LOCALIZATION-TODO.md, item 2.19).
 *
 * Icons: every node in the diagram carries its own pictogram and every
 * state tab carries one too, so the diagram can be read without the
 * legend. The pictograms are literal — a single tilted PV module for
 * the array (the sun is the light source, not the product), a plug for
 * the household load (the node is electricity being consumed, not the
 * building), a battery cabinet for the storage and a utility pole for
 * the grid. The pictogram sits on top of the node and the label sits
 * underneath it.
 *
 * The node badges are HTML layered over the SVG and sized in
 * percentages of the diagram box, so they scale with it on every
 * viewport instead of drifting out of the node at small widths.
 */

const HEMS_ICONS: LucideIcon[] = [Activity, Gauge, BatteryCharging, Sun]

/** The diagram's viewBox — the percentages below are computed from it. */
const VIEW_W = 640
const VIEW_H = 374

/** Where the icon badge sits inside a node box (node-relative). */
const ICON_OFFSET_Y = 32

/** Node icon chip size in diagram units → as a percentage of the box. */
const ICON_SIZE_PCT = (44 / VIEW_W) * 100
const ICON_SIZE_PCT_Y = (44 / VIEW_H) * 100

/** The pictogram of each operating state, used on the tab strip. */
const STATE_ICONS: Record<SolaHomeEnergyState['id'], LucideIcon> = {
  day: Sun,
  night: Moon,
  outage: PlugZap,
}

const NODES = {
  pv: { x: 245, y: 6, label: 'Điện mặt trời', sub: 'Tấm pin trên mái' },
  home: { x: 245, y: 135, label: 'Phụ tải gia đình', sub: 'Thiết bị đang dùng' },
  battery: { x: 79, y: 264, label: 'Pin lưu trữ', sub: 'LiFePO₄ (tùy chọn)' },
  grid: { x: 411, y: 264, label: 'Lưới điện', sub: 'Nguồn bù khi thiếu' },
} as const

/**
 * Node box size in diagram units. Each box is now portrait: the
 * pictogram sits on top, the label and the caption underneath it.
 */
const NODE_W = 150
const NODE_H = 104

/** The four nodes of the diagram. */
type NodeKey = 'pv' | 'home' | 'battery' | 'grid'

/** Props every node pictogram accepts. */
interface GlyphProps {
  className?: string
  strokeWidth?: number
}

/**
 * A single PV module, drawn here rather than taken from the icon set:
 * the stock panel icons are either a layout grid (too abstract) or
 * carry a sun (the light source, not the product). This one is one
 * tilted module with its cell grid and its stand.
 *
 * Geometry — panel corners A(4,9) B(20,5) C(20,15) D(4,19), the two
 * cell dividers run parallel to A→D at a third and two thirds of the
 * width, and the horizontal divider runs parallel to A→B at half the
 * height. The stand hangs off the midpoint of the bottom edge.
 */
function PvModuleGlyph({
  className,
  strokeWidth = 2,
}: GlyphProps): ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 9 L20 5 L20 15 L4 19 Z" />
      <path d="M9.33 7.67 V17.67" />
      <path d="M14.67 6.33 V16.33" />
      <path d="M4 14 L20 10" />
      <path d="M12 17 V21" />
      <path d="M9 21.5 H15" />
    </svg>
  )
}

/**
 * The pictogram of each node. Kept as render functions rather than
 * components so the hand-drawn module and the stock icons can share
 * one array without a union of component types.
 */
const NODE_GLYPHS: Record<NodeKey, (props: GlyphProps) => ReactNode> = {
  pv: PvModuleGlyph,
  home: (props) => <Plug {...props} />,
  battery: (props) => <Battery {...props} />,
  grid: (props) => <UtilityPole {...props} />,
}

/** The nodes, in the order the diagram draws them. */
const NODE_LIST: {
  key: NodeKey
  node: (typeof NODES)[keyof typeof NODES]
}[] = [
  { key: 'pv', node: NODES.pv },
  { key: 'home', node: NODES.home },
  { key: 'battery', node: NODES.battery },
  { key: 'grid', node: NODES.grid },
]

function Flow({
  d,
  active,
}: {
  d: string
  active: boolean
}) {
  return (
    <path
      d={d}
      fill="none"
      strokeWidth={active ? 2.5 : 1.5}
      stroke={active ? 'var(--color-uk-teal)' : 'var(--color-uk-line)'}
      strokeDasharray={active ? '1 7' : '4 6'}
      strokeLinecap="round"
      markerEnd={active ? 'url(#flow-arrow-on)' : 'url(#flow-arrow-off)'}
      className={active ? 'solar-flow-active' : undefined}
    />
  )
}

function Node({
  node,
  active,
}: {
  node: (typeof NODES)[keyof typeof NODES]
  active: boolean
}) {
  return (
    <g>
      <rect
        x={node.x}
        y={node.y}
        width={NODE_W}
        height={NODE_H}
        rx={16}
        fill="#ffffff"
        stroke={active ? 'var(--color-uk-teal)' : 'var(--color-uk-line)'}
        strokeWidth={active ? 2 : 1.5}
      />
      {/* The pictogram sits on top of the node (drawn as HTML over the
          SVG) and the label sits underneath it. */}
      <text
        x={node.x + NODE_W / 2}
        y={node.y + 76}
        textAnchor="middle"
        className="fill-uk-navy text-[13px] font-cw-bold"
      >
        {node.label}
      </text>
      <text
        x={node.x + NODE_W / 2}
        y={node.y + 94}
        textAnchor="middle"
        className="fill-uk-slate text-[10px]"
      >
        {node.sub}
      </text>
    </g>
  )
}

export default function SolaHomeEnergyFlow() {
  const [stateId, setStateId] =
    useState<SolaHomeEnergyState['id']>('day')

  const state =
    solaHomeEnergyStates.find((item) => item.id === stateId) ??
    solaHomeEnergyStates[0]

  const pvActive = state.flows.pvHome || state.flows.pvBattery
  const batteryActive = state.flows.pvBattery || state.flows.batteryHome
  const gridActive = state.flows.gridHome

  /** Which node is carrying power in the current state — drives the
      icon badge's colour. */
  const nodeActive: Record<NodeKey, boolean> = {
    pv: pvActive,
    home: true,
    battery: batteryActive,
    grid: gridActive,
  }

  return (
    <div className="mt-10">
      <div
        role="tablist"
        aria-label="Chọn thời điểm trong ngày"
        className="mx-auto flex w-full max-w-md rounded-full border border-uk-line bg-white p-1"
      >
        {solaHomeEnergyStates.map((item) => {
          const active = item.id === state.id
          const Icon = STATE_ICONS[item.id]
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setStateId(item.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-2 text-sm font-cw-bold transition-colors sm:gap-2 sm:px-4 ${
                active
                  ? 'bg-uk-navy text-white'
                  : 'text-uk-slate hover:text-uk-navy'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
              {item.label}
            </button>
          )
        })}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div className="rounded-3xl border border-uk-line bg-sv-light p-4 sm:p-6">
          {/* The diagram box — the icon badges are layered on top of the
              SVG inside it, so they scale with the drawing. */}
          <div className="relative">
            <svg
              viewBox="0 0 640 374"
              role="img"
              aria-label={`Sơ đồ dòng điện — ${state.title}. ${state.body}`}
              /* `block` — an inline SVG leaves a baseline gap under it,
                 which would offset the absolutely positioned icon
                 badges from the node boxes. */
              className="block h-auto w-full"
            >
              <defs>
                <marker
                  id="flow-arrow-on"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-uk-teal)" />
                </marker>
                <marker
                  id="flow-arrow-off"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-uk-line)" />
                </marker>
              </defs>

              <Flow d="M320,110 L320,135" active={state.flows.pvHome} />
              <Flow d="M276,110 L154,264" active={state.flows.pvBattery} />
              <Flow d="M154,264 L254,239" active={state.flows.batteryHome} />
              <Flow d="M486,264 L386,239" active={state.flows.gridHome} />

              <Node node={NODES.pv} active={pvActive} />
              <Node node={NODES.home} active />
              <Node node={NODES.battery} active={batteryActive} />
              <Node node={NODES.grid} active={gridActive} />
            </svg>

            {/* The node pictograms. Purely decorative — each node already
                carries its name — so they are hidden from screen
                readers. */}
            {NODE_LIST.map(({ key, node }) => {
              const isActive = nodeActive[key]
              return (
                <span
                  key={key}
                  aria-hidden="true"
                  className={`pointer-events-none absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[28%] border ${
                    isActive
                      ? 'border-uk-teal/40 bg-uk-teal-soft'
                      : 'border-uk-line bg-white'
                  }`}
                  style={{
                    left: `${((node.x + NODE_W / 2) / VIEW_W) * 100}%`,
                    top: `${((node.y + ICON_OFFSET_Y) / VIEW_H) * 100}%`,
                    width: `${ICON_SIZE_PCT}%`,
                    height: `${ICON_SIZE_PCT_Y}%`,
                  }}
                >
                  {NODE_GLYPHS[key]({
                    className: `h-[56%] w-[56%] ${
                      isActive ? 'text-uk-teal-dark' : 'text-uk-slate'
                    }`,
                    strokeWidth: 1.9,
                  })}
                </span>
              )
            })}
          </div>

          <p className="mt-2 flex items-center gap-2 text-[11px] text-uk-slate">
            <span className="inline-block h-0.5 w-6 rounded-full bg-uk-teal" />
            Nét đứt chuyển động: dòng điện đang chạy ở trạng thái này.
          </p>
        </div>

        <div>
          <p className="text-xs font-cw-bold tracking-[0.18em] text-uk-teal-dark uppercase">
            {state.label}
          </p>
          <h3 className="mt-3 text-2xl font-cw-bold leading-snug text-uk-navy">
            {state.title}
          </h3>
          <p className="mt-4 text-base leading-relaxed text-uk-slate">
            {state.body}
          </p>
          <p className="mt-5 rounded-xl border border-uk-line bg-white px-4 py-3 text-sm leading-relaxed text-uk-navy">
            {state.note}
          </p>
        </div>
      </div>

      {/* The four HEMS capabilities, folded in here instead of getting a
          separate "smart features" section. */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {solaHomeHems.map((item, index) => {
          const Icon = HEMS_ICONS[index] ?? Activity
          return (
            <div
              key={item.title}
              className="rounded-2xl border border-uk-line bg-white p-5"
            >
              <Icon
                className="h-5 w-5 text-uk-teal-dark"
                strokeWidth={1.9}
              />
              <p className="mt-3 text-sm font-cw-bold text-uk-navy">
                {item.title}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-uk-slate">
                {item.body}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}