'use client'

/**
 * Live Solar Plan Preview — the right-hand side of the Free UK Plan
 * section on the homepage. Renders a real HTML "Solar Plan" card that
 * auto-cycles through 5 stages (Home → System → Plan → Savings →
 * Offer) so the visitor sees what their own personalised report will
 * look like.
 *
 * Design notes
 * ────────────
 * - Pure HTML. No GIF, no video, no canvas, no screenshot. The card
 *   is built from the same primitives the real /my-plan page uses
 *   (rounded-2xl, uk-teal/emerald palette, font-cw-*), so it reads
 *   as the actual product — not a mock.
 * - Real ROI engine. The headline numbers come from
 *   `app/my-plan/_lib/calc.ts`, not hard-coded values. The demo
 *   consultation (1 person, London, low use, EV charger) lands on
 *   Home Energy Pro via `recommendPlan()`, so the numbers track the
 *   real product.
 * - The card itself has a subtle perspective tilt + slow float, so
 *   it reads as a 3D object on the canvas. Tilt and float are
 *   disabled under `prefers-reduced-motion`.
 * - The page only renders the *home* stage statically when reduced
 *   motion is on — no auto-cycle, no count-up, no cursor.
 *
 * Files that consume this component: `components/FreeDesignQuoteSection.tsx`.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Home,
  SolarPanel,
  BatteryCharging,
  CircuitBoard,
  Edit3,
  Check,
  Star,
} from 'lucide-react'
import {
  recommendPlan,
  calculateROI,
  defaultAssumptions,
  getPlan,
  PLANS,
  type PlanId,
  type Plan,
  type PlanRoi,
} from '@/app/my-plan/_lib/calc'
import { formatDateEnGB } from '@/app/my-plan/_lib/format'

/* ────────────────────────────────────────────────────────────────────────
   Stage machine
   ──────────────────────────────────────────────────────────────────────── */

type Stage = 'home' | 'system' | 'plan' | 'savings' | 'offer'

const STAGE_ORDER: ReadonlyArray<Stage> = [
  'home',
  'system',
  'plan',
  'savings',
  'offer',
]

/** Per-stage dwell (ms). Total cycle ≈ 11.2 s. */
const STAGE_DURATION_MS: Record<Stage, number> = {
  home: 1900,
  system: 1900,
  plan: 1900,
  savings: 3400,
  offer: 2000,
}

/* ────────────────────────────────────────────────────────────────────────
   Demo consultation profile
   ──────────────────────────────────────────────────────────────────────── */

const DEMO_CONSULTATION = {
  householdSize: '1' as const,
  electricityUsage: 'low' as const,
  devices: ['wallbox'],
  region: 'England - London',
}

const HOUSE_TYPE_LABEL = 'Semi-detached'
const ROOF_LABEL = 'Hipped'
const USAGE_LABEL = 'Low use'
const DEVICES_LABEL = 'EV charger'

interface DemoData {
  recommendedPlanId: PlanId
  plan: Plan
  metrics: PlanRoi
  systemKw: number
}

/**
 * Pre-compute the demo data through the real ROI engine so the
 * preview always agrees with what the user would see on /my-plan.
 * Memoised at module scope — inputs are stable.
 */
function buildDemoData(): DemoData {
  const recommendedPlanId = recommendPlan(DEMO_CONSULTATION)
  const plan = getPlan(recommendedPlanId)
  const assumptions = defaultAssumptions(plan)
  const metrics = calculateROI(plan, DEMO_CONSULTATION, assumptions)
  return {
    recommendedPlanId,
    plan,
    metrics,
    systemKw: plan.panels * 0.46, // 460 W panels — same constant as in calc.ts
  }
}

/* ────────────────────────────────────────────────────────────────────────
   useCountUp — animates a numeric value from 0 → target on a single rAF
   loop, gated by `isActive`. Used for the three savings numbers that
   spin up in sequence during Stage 4.
   ──────────────────────────────────────────────────────────────────────── */

function useCountUp(
  target: number,
  isActive: boolean,
  options: { durationMs?: number; delayMs?: number } = {},
): number {
  const { durationMs = 900, delayMs = 0 } = options
  const [value, setValue] = useState(0)
  const startRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isActive) {
      setValue(0)
      startRef.current = null
      return
    }
    const tick = (now: number) => {
      if (startRef.current == null) startRef.current = now + delayMs
      const elapsed = now - startRef.current
      if (elapsed < 0) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }
      const t = Math.min(1, elapsed / durationMs)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      setValue(Math.round(target * eased))
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [isActive, target, durationMs, delayMs])

  return value
}

/* ────────────────────────────────────────────────────────────────────────
   Component
   ──────────────────────────────────────────────────────────────────────── */

export default function HeroReportPreview() {
  /* Demo data — computed once. */
  const demo = useMemo(buildDemoData, [])
  const metrics = demo.metrics
  const plan = demo.plan

  /* Reduced-motion gate. SSR-safe: defaults to `false`, set on mount. */
  const [reducedMotion, setReducedMotion] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  /* Cycle driver. */
  const [stageIndex, setStageIndex] = useState(0)
  const [tickToken, setTickToken] = useState(0) // bumps to retrigger timers cleanly

  useEffect(() => {
    if (reducedMotion) return
    const stage = STAGE_ORDER[stageIndex]
    const duration = STAGE_DURATION_MS[stage]
    const id = window.setTimeout(() => {
      setStageIndex((i) => (i + 1) % STAGE_ORDER.length)
    }, duration)
    return () => window.clearTimeout(id)
  }, [stageIndex, tickToken, reducedMotion])

  // Pause-then-resume the cycle when the tab returns to the foreground,
  // so the user doesn't catch a half-finished stage on focus.
  useEffect(() => {
    if (reducedMotion) return
    const onVisibility = () => {
      if (!document.hidden) setTickToken((n) => n + 1)
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [reducedMotion])

  const stage: Stage = STAGE_ORDER[stageIndex]

  // Sequential count-ups during Stage 4 (savings). Three numbers, ~1s each,
  // with a small gap between them so the eye tracks one at a time.
  const SAVINGS_SUB_DURATION = 1000
  const SAVINGS_SUB_GAP = 200
  const annualCount = useCountUp(metrics.annualSavingGbp, stage === 'savings', {
    durationMs: SAVINGS_SUB_DURATION,
  })
  const paybackCount = useCountUp(
    Number.isFinite(metrics.paybackYears) ? metrics.paybackYears * 10 : 0,
    stage === 'savings',
    { durationMs: SAVINGS_SUB_DURATION, delayMs: SAVINGS_SUB_DURATION + SAVINGS_SUB_GAP },
  )
  const lifetimeCount = useCountUp(metrics.total30YearReturnGbp, stage === 'savings', {
    durationMs: SAVINGS_SUB_DURATION,
    delayMs: 2 * (SAVINGS_SUB_DURATION + SAVINGS_SUB_GAP),
  })

  return (
    <div
      className="hrp-stage"
      data-reduced-motion={reducedMotion || undefined}
      aria-label="Live preview of your personal Solar Plan"
    >
      {/* Card container — perspective host + floating motion */}
      <div className="hrp-card-host">
        <div className="hrp-card" aria-hidden={!reducedMotion ? undefined : 'true'}>
          {/* ── Header (matches the real /my-plan chrome) ── */}
          <div className="hrp-head">
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ background: '#10B981' }}
              />
              <span className="hrp-brand">Solavita</span>
            </div>
            <span className="hrp-pill">
              <span className="hrp-pill-dot" />
              Live plan preview
            </span>
          </div>

          {/* ── Body ── */}
          <div className="hrp-body">
            {/* Title + breadcrumb (always visible) */}
            <div className="hrp-crumb">Home&nbsp; / &nbsp;My Plan</div>
            <div className="hrp-title-row">
              <div>
                <div className="hrp-title">Your Initial Solar Plan</div>
                <div className="hrp-subtitle">
                  A personalised system designed around your home and energy needs.
                </div>
                <div className="hrp-underline" />
              </div>
            </div>

            {/* ── Section 1: Your home (mirrors HomeDetailsCard) ── */}
            <Section active={stage === 'home'} label="Your home">
              <div className="hrp-home">
                <div className="hrp-home-icon">
                  <Home className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <strong className="block text-sm font-cw-bold text-uk-navy">
                    Your home
                  </strong>
                  <p className="mt-0.5 text-xs text-uk-slate leading-relaxed">
                    {DEMO_CONSULTATION.region} · {HOUSE_TYPE_LABEL} ·{' '}
                    {DEMO_CONSULTATION.householdSize} person · {ROOF_LABEL}
                  </p>
                  <p className="mt-0.5 text-xs text-uk-slate leading-relaxed">
                    {USAGE_LABEL} · {DEVICES_LABEL}
                  </p>
                </div>
                <span className="hrp-edit">
                  <Edit3 className="w-3 h-3" strokeWidth={1.75} />
                  Edit
                </span>
              </div>
            </Section>

            {/* ── Section 2: Your system (mirrors ProductCard strip) ── */}
            <Section
              active={stage === 'system'}
              label="Your system"
              badge="Recommended for your home"
            >
              <div className="hrp-system-grid">
                <SystemCard
                  icon={<SolarPanel className="w-5 h-5" strokeWidth={1.8} />}
                  title="Solar panels"
                  subtitle={`${plan.panels} × 460W modules`}
                  value={`${plan.panels} modules`}
                />
                <SystemCard
                  icon={<BatteryCharging className="w-5 h-5" strokeWidth={1.8} />}
                  title="Battery"
                  subtitle={
                    plan.batteryKwh > 0
                      ? `${plan.batteryKwh} kWh storage`
                      : 'No battery'
                  }
                  value={plan.batteryKwh > 0 ? `${plan.batteryKwh} kWh` : '—'}
                />
                <SystemCard
                  icon={<CircuitBoard className="w-5 h-5" strokeWidth={1.8} />}
                  title="Inverter"
                  subtitle={`${plan.inverterKw} kW inverter`}
                  value={`${plan.inverterKw} kW`}
                />
              </div>
            </Section>

            {/* ── Section 3: Choose your plan (mirrors CustomiseCard) ── */}
            <Section active={stage === 'plan'} label="Choose your plan">
              <div className="hrp-plan-grid">
                {PLANS.map((p) => {
                  const isRecommended = p.id === demo.recommendedPlanId
                  return (
                    <div
                      key={p.id}
                      className={
                        'hrp-plan ' +
                        (isRecommended ? 'hrp-plan-recommended' : '')
                      }
                    >
                      {isRecommended && (
                        <span className="hrp-plan-star">
                          <Star
                            className="w-2.5 h-2.5"
                            strokeWidth={3}
                          />
                          Recommended
                        </span>
                      )}
                      <div className="text-sm font-cw-bold text-uk-navy truncate">
                        {p.name}
                      </div>
                      <dl className="hrp-plan-rows">
                        <div>
                          <dt>Panels</dt>
                          <dd>{p.panels}</dd>
                        </div>
                        <div>
                          <dt>Battery</dt>
                          <dd>{p.batteryKwh > 0 ? `${p.batteryKwh}` : '—'}</dd>
                        </div>
                        <div>
                          <dt>Inverter</dt>
                          <dd>{p.inverterKw} kW</dd>
                        </div>
                      </dl>
                      {isRecommended && (
                        <span className="hrp-plan-check">
                          <Check className="w-3 h-3" strokeWidth={3} />
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </Section>

            {/* ── Section 4: Estimated savings (mirrors SavingsSection) ── */}
            <Section
              active={stage === 'savings'}
              label="Your estimated savings"
            >
              <div className="hrp-savings-grid">
                <MetricCard
                  label="Annual saving"
                  value={`£${annualCount.toLocaleString('en-GB')}`}
                  suffix="/ year"
                  highlight
                  isCounting={stage === 'savings'}
                />
                <MetricCard
                  label="Estimated payback"
                  value={
                    Number.isFinite(metrics.paybackYears)
                      ? `${(paybackCount / 10).toFixed(1)} yrs`
                      : '—'
                  }
                  suffix="to break even"
                  isCounting={stage === 'savings'}
                />
                <MetricCard
                  label="30-year return"
                  value={`£${lifetimeCount.toLocaleString('en-GB')}`}
                  suffix="lifetime net"
                  highlight
                  isCounting={stage === 'savings'}
                />
              </div>
            </Section>

            {/* ── Section 5: Your offer (mirrors OfferCard) ── */}
            <Section active={stage === 'offer'} label="Your offer">
              <div className="hrp-offer">
                <div>
                  <div className="hrp-offer-eyebrow">YOUR OFFER</div>
                  {/* Price hidden on the marketing surface — the offer
                      card now points at the "Talk to an expert →" CTA
                      instead, matching the no-price pattern used on
                      /solutions/[slug]/ and the rest of the site. */}
                  <div className="hrp-offer-value">
                    Personalised quote
                  </div>
                  <div className="hrp-offer-valid">
                    Valid until {formatDateEnGB(metrics.offerValidUntil)}
                  </div>
                </div>
                <span className="hrp-offer-cta">Talk to an expert</span>
              </div>
            </Section>
          </div>
        </div>

        {/* Simulated cursor — drives eye through the journey */}
        {!reducedMotion && <Cursor stage={stage} />}

        {/* Floating "preview" tag pinned to the card */}
        <div className="hrp-tag" aria-hidden="true">
          <strong>Live plan preview</strong>
          <span>
            <i /> This is what you’ll receive after registration
          </span>
        </div>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Sub-components
   ──────────────────────────────────────────────────────────────────────── */

/**
 * Wraps each major block. Mounted always, but fades + slides when its
 * stage is active. Keeping it mounted (rather than conditionally
 * rendering) avoids layout-shift and keeps the section readable while
 * other stages play.
 */
function Section({
  active,
  label,
  badge,
  children,
}: {
  active: boolean
  label: string
  badge?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={'hrp-section ' + (active ? 'hrp-section-active' : '')}
      data-active={active || undefined}
      data-label={label}
    >
      <div className="hrp-section-head">
        <span className="hrp-section-label">{label}</span>
        {badge && <span className="hrp-section-badge">{badge}</span>}
      </div>
      {children}
    </div>
  )
}

function SystemCard({
  icon,
  title,
  subtitle,
  value,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  value: string
}) {
  return (
    <div className="hrp-system-card">
      <div className="hrp-system-icon">{icon}</div>
      <div className="text-xs font-cw-bold text-uk-navy mt-2">{title}</div>
      <div className="text-[10px] text-uk-slate mt-0.5 leading-snug">
        {subtitle}
      </div>
      <div className="text-base font-cw-bold text-uk-teal-dark mt-1.5 tabular-nums">
        {value}
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  suffix,
  highlight,
  isCounting,
}: {
  label: string
  value: string
  suffix: string
  highlight?: boolean
  isCounting?: boolean
}) {
  return (
    <div
      className={
        'hrp-metric ' +
        (highlight ? 'hrp-metric-highlight ' : '') +
        (isCounting ? 'hrp-metric-counting' : '')
      }
    >
      <div className="hrp-metric-label">{label.toUpperCase()}</div>
      <div className="hrp-metric-value tabular-nums">{value}</div>
      <div className="hrp-metric-suffix">{suffix}</div>
    </div>
  )
}

/**
 * A small simulated cursor that moves between stage anchors. Position is
 * stage-driven (percentages relative to the card-host); CSS transition
 * gives the motion. Kept tiny + semi-transparent so it never competes
 * with the content.
 */
const CURSOR_POS: Record<Stage, { y: string; x: string }> = {
  // Cursor y is the percentage of `.hrp-card-host` height. The card is
  // a single stacked container (head 52px + body with crumb/title-row
  // + 5 stacked `.hrp-section`s); cursor center lands at the section's
  // label row (top of section + ~24px for padding + label baseline).
  // Measured offsets assume a ~787px host: header 52 + body padding
  // 18 + crumb/title 76 ≈ 146px before Section 1 starts; each section
  // adds ~70-145px depending on its content height.
  home: { y: '23%', x: '14%' },     // lands on "Your home" label / icon
  system: { y: '38%', x: '50%' },   // lands on "Your system" label / Solar panels card
  plan: { y: '67%', x: '50%' },
  savings: { y: '80%', x: '50%' },
  offer: { y: '92%', x: '40%' },
}

function Cursor({ stage }: { stage: Stage }) {
  const pos = CURSOR_POS[stage]
  return (
    <div
      className="hrp-cursor"
      style={{ top: pos.y, left: pos.x }}
      aria-hidden="true"
    >
      <span className="hrp-cursor-dot" />
    </div>
  )
}
