/**
 * Plan catalogue + recommendation + ROI engine for `/my-plan` (v1, frontend-only).
 *
 * Architecture (per the user's spec):
 *   Consultation (mock) ──► recommendPlan() ──► PlanId
 *   Plan (fixed)         ──► calculateROI()  ──► PlanRoi
 *
 * - Plans are FIXED objects; the user can switch between them but cannot
 *   adjust panel count or battery capacity independently. The numbers below
 *   are the prototype prices from the spec.
 * - The recommendation function takes householdSize + electricityUsage +
 *   devices and maps to one of the four tiers. Devices bump the tier up.
 * - The ROI engine implements the documented calculation chain
 *   (regional generation → consumption → self-consumption → export →
 *   annual saving → 30-year degradation → payback → 30-year return → ROI).
 *
 * Numbers are intentionally UK-typical constants; swap for a real engine
 * later by replacing `calculateROI()` only.
 */

export type PlanId = 'essential' | 'storage' | 'smart' | 'premium'

/** Home details surfaced at the top of the plan page. */
export interface HomeDetails {
  houseType: string
  /**
   * Number of people in the household. Mirrors the form Step 2 question
   * "How many people live in your household?" - the DB column is named
   * `household_size` for that reason. Older revisions incorrectly
   * aliased this to "bedrooms"; that's wrong because household_size is
   * a count of residents, not rooms.
   */
  householdSize: number
  roofOrientation: string
  /**
   * Region (e.g. "England - South East"). Surfaced in the strip so the
   * user sees their region after editing via "Edit details" without
   * needing to scroll into the plan details to spot the change.
   * Mirrors `ConsultationInput.region`.
   */
  region: string
  /** Annual electricity-use tier ID (`low` / `medium` / `high` / `very-high`). */
  electricityUsage: string
  /** Heavy devices selected (e.g. `['wallbox', 'heatpump']`). */
  devices: string[]
}

export interface Plan {
  id: PlanId
  name: string
  subtitle: string
  panels: number
  /** kWh. `0` for Solar Essential. */
  batteryKwh: number
  inverterKw: number
  priceGbp: number
}

/**
 * Four fixed plans. Prices are prototype values per the spec - see also
 * `lib/data/uk-products.ts` for the parallel marketing product list.
 */
export const PLANS: Plan[] = [
  {
    id: 'essential',
    name: 'Solar Essential',
    subtitle: 'Simple start',
    panels: 8,
    batteryKwh: 0,
    inverterKw: 3.6,
    priceGbp: 8_999,
  },
  {
    id: 'storage',
    name: 'Storage Core',
    subtitle: 'Solar + Storage',
    panels: 8,
    batteryKwh: 5.12,
    inverterKw: 5,
    priceGbp: 12_999,
  },
  {
    id: 'smart',
    name: 'Smart Home',
    subtitle: 'More control',
    panels: 10,
    batteryKwh: 15.36,
    inverterKw: 6,
    priceGbp: 19_238,
  },
  {
    id: 'premium',
    name: 'Premium Backup',
    subtitle: 'Higher storage',
    panels: 12,
    batteryKwh: 20,
    inverterKw: 8,
    priceGbp: 23_800,
  },
]

export function getPlan(id: PlanId): Plan {
  const plan = PLANS.find((p) => p.id === id)
  if (!plan) throw new Error(`Unknown plan id: ${id}`)
  return plan
}

/** Lookup helper - matches the marketing data already used in ProductSelector. */
export function findPlanByPrice(priceGbp: number): Plan | undefined {
  return PLANS.find((p) => p.priceGbp === priceGbp)
}

/* ──────────────────────────────────────────────────────────────────────────
 * Recommendation input - MOCK for v1.
 *
 * When the real `consultation_leads` row is wired in, swap this constant
 * for whatever shape the API returns (already camelCase in FormData). The
 * recommendation function below takes the same fields, so the call site
 * is the only change needed.
 * ────────────────────────────────────────────────────────────────────────── */

/** Consumption tiers as captured by the consultation form (string IDs). */
export type ConsumptionTier = 'low' | 'medium' | 'high' | 'very-high'

/** Devices that materially raise demand and push the recommendation up. */
export type HeavyDevice = 'wallbox' | 'heatpump' | 'ac'

export interface ConsultationInput {
  /** Form ID for household size: one of `'1'`, `'2'`, `'3'`, `'4'`, `'5+'`. */
  householdSize: '1' | '2' | '3' | '4' | '5+' | string
  /** Self-reported consumption band from the form. NOT kWh. */
  electricityUsage: ConsumptionTier
  /** Devices present at the home - bumps demand towards Premium. */
  devices: Array<HeavyDevice | string>
  region: string
}

/** Mock for v1. A typical 4-person home with a heat pump on London. */
export const MOCK_CONSULTATION: ConsultationInput = {
  householdSize: '4',
  electricityUsage: 'medium',
  devices: ['heatpump'],
  region: 'England - London',
}

/** Demand-tier order, low → very high. */
const TIER_PLAN_IDS: PlanId[] = ['essential', 'storage', 'smart', 'premium']

/**
 * Recommendation pipeline (per spec):
 *   householdSize + electricityUsage  ─►  basePlan
 *   basePlan + devices[]              ─►  finalPlan (each heavy device +1 tier)
 *
 * The base tier comes from a 5×4 lookup keyed by the form's exact
 * `householdSize` IDs (`'1' / '2' / '3' / '4' / '5+'`) × the consumption
 * band (`low / medium / high / very-high`). Heavy-load devices (wallbox,
 * heatpump, AC) each bump the tier up by one, capped at Premium.
 *
 * The grid encodes the implicit "people × kWh/yr" load:
 *   1 person ≈ 2,000 kWh, 5+ people ≈ 7,000+ kWh baseline.
 * So "5+ × medium" already lands in tier 2 (Smart Home), and only a
 * tiny household (1-2 people × low) keeps you in Solar Essential.
 */
const BASE_TIER_LOOKUP: Record<
  ConsultationInput['householdSize'],
  Record<ConsumptionTier, number>
> = {
  // householdSize → consumption → tier (0=essential ... 3=premium)
  '1':  { low: 0, medium: 0, high: 1, 'very-high': 1 },
  '2':  { low: 0, medium: 0, high: 1, 'very-high': 2 },
  '3':  { low: 0, medium: 1, high: 2, 'very-high': 2 },
  '4':  { low: 0, medium: 1, high: 2, 'very-high': 3 },
  '5+': { low: 1, medium: 2, high: 3, 'very-high': 3 },
}

export function recommendPlan(c: ConsultationInput): PlanId {
  // 1. Base tier from householdSize × electricityUsage. If the
  //    householdSize is unrecognised, fall back to the median row ('3').
  const sizeRow = BASE_TIER_LOOKUP[c.householdSize] ?? BASE_TIER_LOOKUP['3']
  let tier = sizeRow[c.electricityUsage] ?? 1

  // 2. Each heavy-load device bumps the tier up (capped at premium).
  for (const device of c.devices) {
    if (
      device === 'wallbox' ||
      device === 'heatpump' ||
      device === 'ac'
    ) {
      tier = Math.min(3, tier + 1)
    }
  }

  return TIER_PLAN_IDS[tier]
}

/* ──────────────────────────────────────────────────────────────────────────
 * ROI engine
 *
 * Pipeline (per spec):
 *   Plan ─► Regional generation ─► Consumption ─► Self-consumption ─►
 *   Export ─► Annual saving ─► 30-year degradation ─► Payback ─► 30-year ROI
 *
 * Tuning constants are UK-typical 2026 values. They're easy to tweak in
 * one place - search for `ROI_*` below.
 * ────────────────────────────────────────────────────────────────────────── */

const ROI_KW_PER_PANEL = 0.45              // 450 W panels
const ROI_KWH_PER_KW_YEAR = 950           // kWh per kW installed (UK average)
const ROI_SELF_CONSUMPTION_BASE = 0.35     // no-battery baseline (Solar Essential)
const ROI_IMPORT_PRICE_GBP = 0.2632        // £/kWh imported (Ofgem cap, 2026)
const ROI_EXPORT_PRICE_GBP = 0.15          // £/kWh exported (SEG rate, 2026)
const ROI_PROJECT_LIFETIME_YEARS = 30
const ROI_OFFER_DISCOUNT_GBP = 1_300
const ROI_OFFER_VALIDITY_DAYS = 30

/**
 * Annual panel output as a fraction of year-1 performance.
 *
 * 1-indexed (year 1 = installation year). Per spec:
 *
 *   year 1  = 100.00%
 *   year 2  =  99.00%   ┐ linear between year 2 and year 10
 *   year 10 =  95.66%   ┘
 *   year 10 =  95.66%   ┐ linear between year 10 and year 30
 *   year 30 =  85.00%   ┘
 *
 * Generated once at module load so the ROI loop is a constant-time
 * lookup. Length = ROI_PROJECT_LIFETIME_YEARS = 30.
 */
const ROI_DEGRADATION_FACTORS: ReadonlyArray<number> = (() => {
  const out: number[] = []
  for (let year = 1; year <= ROI_PROJECT_LIFETIME_YEARS; year++) {
    let factor: number
    if (year === 1) {
      factor = 1.0
    } else if (year <= 10) {
      factor = 0.99 + (year - 2) * (0.9566 - 0.99) / 8
    } else {
      factor = 0.9566 + (year - 10) * (0.85 - 0.9566) / 20
    }
    out.push(factor)
  }
  return out
})()

/** Exposed for the ROI breakdown disclosure (read-only array). */
export function getDegradationFactors(): ReadonlyArray<number> {
  return ROI_DEGRADATION_FACTORS
}

export interface PlanRoi {
  /** Year-1 generation before degradation. */
  annualGenerationKwh: number
  /** Year-1 self-consumed kWh. */
  annualSelfConsumedKwh: number
  /** Year-1 exported kWh. */
  annualExportedKwh: number
  /** Year-1 total saving (import offset + export income). */
  annualSavingGbp: number
  /** Year-1 export income only. */
  annualExportIncomeGbp: number
  /** Year-1 import offset only (self-consumed × import price). */
  annualImportOffsetGbp: number
  /** Years to break even on the *offer* price (year-1 saving basis). */
  paybackYears: number
  /** Sum of yearly savings across all 30 years. */
  total30YearSavingGbp: number
  /** Total lifetime saving minus *offer* price (i.e. what you net). */
  total30YearReturnGbp: number
  /** (lifetime saving / offer price − 1) × 100. */
  roiPct: number
  offerPriceGbp: number
  offerValidUntil: Date
  /** Effective assumption values used (after defaults applied). */
  appliedAssumptions: Required<RoiAssumptions>
}

/**
 * User-tweakable ROI assumptions. All values are required when passed in;
 * use `defaultAssumptions(plan)` to get the spec defaults for a given plan,
 * then spread user overrides on top.
 */
export interface RoiAssumptions {
  /** £/kWh imported. Slider range 0.10-0.50. Default 0.2632 (Ofgem 2026). */
  importPriceGbp: number
  /** £/kWh exported (SEG). Slider range 0.00-0.30. Default 0.15. */
  exportPriceGbp: number
  /** Self-consumption rate 0-1. Default per-plan (battery=100%, no-battery=35%). */
  selfConsumptionRate: number
}

/**
 * Spec-default assumptions for a plan. The user can override any of these
 * via the Advanced assumptions sliders in CustomiseCard.
 */
export function defaultAssumptions(plan: Plan): RoiAssumptions {
  return {
    importPriceGbp: ROI_IMPORT_PRICE_GBP,
    exportPriceGbp: ROI_EXPORT_PRICE_GBP,
    selfConsumptionRate:
      plan.batteryKwh > 0 ? 1 : ROI_SELF_CONSUMPTION_BASE,
  }
}

/** Slider bounds - surfaced as constants so the UI and engine agree. */
export const ROI_IMPORT_PRICE_MIN = 0.10
export const ROI_IMPORT_PRICE_MAX = 0.50
export const ROI_IMPORT_PRICE_STEP = 0.001
export const ROI_EXPORT_PRICE_MIN = 0.00
export const ROI_EXPORT_PRICE_MAX = 0.30
export const ROI_EXPORT_PRICE_STEP = 0.001

/**
 * Run the full ROI pipeline for a given Plan + consultation + assumptions.
 * Pure function, no I/O.
 *
 * Per spec, each project year is computed independently:
 *   generation[y]  = year1Generation × DEGRADATION_FACTORS[y]
 *   selfConsumed[y] = generation[y] × selfConsumptionRate
 *   exported[y]    = generation[y] − selfConsumed[y]
 *   saving[y]      = selfConsumed[y] × importPrice + exported[y] × exportPrice
 *
 * Payback + ROI % use the **offer** price (= list price − £1,300), not the
 * raw list price. The headline `annualSavingGbp` etc. are the year-1 values
 * using the *applied* assumptions. The 30-year totals are the sum across
 * all 30 degraded years.
 */
export function calculateROI(
  plan: Plan,
  c: ConsultationInput,
  assumptions: RoiAssumptions,
  now: Date = new Date(),
): PlanRoi {
  // 0. Resolve assumptions (clamp defensively even though the UI already
  //    constrains inputs).
  const importPrice = Math.max(
    ROI_IMPORT_PRICE_MIN,
    Math.min(ROI_IMPORT_PRICE_MAX, assumptions.importPriceGbp),
  )
  const exportPrice = Math.max(
    ROI_EXPORT_PRICE_MIN,
    Math.min(ROI_EXPORT_PRICE_MAX, assumptions.exportPriceGbp),
  )
  const selfConsumptionRate = Math.max(
    0,
    Math.min(1, assumptions.selfConsumptionRate),
  )
  const applied: Required<RoiAssumptions> = {
    importPriceGbp: importPrice,
    exportPriceGbp: exportPrice,
    selfConsumptionRate,
  }

  // 1. Year-1 generation = system size × regional specific yield.
  const systemKw = plan.panels * ROI_KW_PER_PANEL
  const year1GenerationKwh = systemKw * ROI_KWH_PER_KW_YEAR

  // 2. Year-1 breakdown using the applied assumptions.
  const year1SelfConsumed = year1GenerationKwh * selfConsumptionRate
  const year1Exported = Math.max(0, year1GenerationKwh - year1SelfConsumed)
  const year1Saving =
    year1SelfConsumed * importPrice + year1Exported * exportPrice

  const annualGenerationKwh = Math.round(year1GenerationKwh)
  const annualSelfConsumedKwh = Math.round(year1SelfConsumed)
  const annualExportedKwh = Math.round(year1Exported)
  const annualSavingGbp = Math.round(year1Saving)
  const annualImportOffsetGbp = Math.round(year1SelfConsumed * importPrice)
  const annualExportIncomeGbp = Math.round(year1Exported * exportPrice)

  // 3. Offer = list price − flat discount. Payback + ROI use this, NOT the
  //    list price, because that's what the customer is actually paying.
  const offerPriceGbp = Math.max(0, plan.priceGbp - ROI_OFFER_DISCOUNT_GBP)

  // 4. Payback on the offer price (clamped to lifetime).
  const paybackYears =
    annualSavingGbp > 0
      ? Math.min(
          ROI_PROJECT_LIFETIME_YEARS,
          Math.round((offerPriceGbp / annualSavingGbp) * 10) / 10,
        )
      : Infinity

  // 5. 30-year cumulative saving: each year uses its own actual
  //    generation (degraded), not the year-1 figure multiplied.
  let total30YearSaving = 0
  for (let i = 0; i < ROI_PROJECT_LIFETIME_YEARS; i++) {
    const yearGen = year1GenerationKwh * ROI_DEGRADATION_FACTORS[i]
    const yearSelfConsumed = yearGen * selfConsumptionRate
    const yearExported = Math.max(0, yearGen - yearSelfConsumed)
    const yearSaving =
      yearSelfConsumed * importPrice + yearExported * exportPrice
    total30YearSaving += yearSaving
  }
  const total30YearSavingGbp = Math.round(total30YearSaving)

  const total30YearReturnGbp = total30YearSavingGbp - offerPriceGbp
  const roiPct = offerPriceGbp > 0
    ? Math.round(((total30YearSavingGbp / offerPriceGbp) - 1) * 100)
    : 0

  const offerValidUntil = new Date(now)
  offerValidUntil.setDate(offerValidUntil.getDate() + ROI_OFFER_VALIDITY_DAYS)

  return {
    annualGenerationKwh,
    annualSelfConsumedKwh,
    annualExportedKwh,
    annualSavingGbp,
    annualExportIncomeGbp,
    annualImportOffsetGbp,
    paybackYears,
    total30YearSavingGbp,
    total30YearReturnGbp,
    roiPct,
    offerPriceGbp,
    offerValidUntil,
    appliedAssumptions: applied,
  }
}