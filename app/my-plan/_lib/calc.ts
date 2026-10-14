/**
 * Plan catalogue + recommendation + ROI engine for `/my-plan` (Nigeria).
 *
 * Architecture (per the user's spec):
 *   Consultation form ──► recommendPlan() ──► NgPlanId
 *   Plan (fixed)         ──► calculateROI() ──► PlanRoi
 *
 * The 6 NG solutions (LITE / HOME Standard / HOME High-spec /
 * BUSINESS Entry / BUSINESS Standard / BUSINESS Flagship) are the
 * fixed product set. The user can switch between them in `/my-plan`
 * but cannot adjust panel count or battery capacity independently.
 * Specs mirror `lib/data/solutions.ts` so the marketing surface and
 * the calculator stay in sync.
 *
 * **Prices** are *test-baseline* values derived from the UK price
 * ladder and tagged as `priceNgn` so they are clearly distinguishable
 * from any future business-approved ₦ figure. Per the user's spec
 * ("暂时复用英国系统价格作为测试基准，单独存放价格配置，后续替换为
 * 尼日利亚价格"), this file owns the price config - swap one number
 * here to update the whole calculator.
 *
 * **ROI engine**:
 *   1. Estimate total household annual kWh from the user's consumption
 *      tier (electricityUsage).
 *   2. Split into grid-portion vs generator-portion using
 *      `generatorFrequency`. Cap generator-portion kWh at the user's
 *      reported fuel budget (₦/month) so we don't over-state what can
 *      be saved.
 *   3. Compute solar year-1 generation from system size × NG regional
 *      yield. Apply self-consumption rate (battery boosts).
 *   4. Displace first the grid portion, then the generator portion
 *      (capped by the user's actual fuel spend). This is the
 *      no-double-count rule - the same self-consumed kWh cannot
 *      offset both grid and generator cost.
 *   5. Net annual saving = grid offset + generator offset − annual
 *      opex (1 % of system cost for maintenance).
 *   6. Payback = system price / net annual saving. 30-year lifetime
 *      applies the same model with panel degradation factors.
 */

import { solutionDetails } from '@/lib/data/solutions'

/* ──────────────────────────────────────────────────────────────────────
   NG solution catalogue
   ────────────────────────────────────────────────────────────────────── */

export type NgPlanId =
  | 'lite-essential-backup'
  | 'home-standard'
  | 'home-high-spec'
  | 'business-entry-3-phase'
  | 'business-standard-3-phase'
  | 'business-flagship-3-phase'

export interface NgPlan {
  id: NgPlanId
  name: string
  subtitle: string
  /** Total rated PV capacity (kWp). Drives the year-1 generation. */
  kwp: number
  /** Battery capacity (kWh, nominal). 0 for solar-only tiers. */
  batteryKwh: number
  /** Inverter continuous output (kW). */
  inverterKw: number
  /**
   * Test-baseline price (₦). Reuse UK ladder values for now - swap one
   * number here to update the whole calculator when business supplies
   * approved ₦ prices.
   */
  priceNgn: number
  /** Customer segment, drives segment-aware copy. */
  segment: 'homes' | 'businesses'
  /** True if this is the recommended mid-tier for its segment. */
  popular?: boolean
  /* ────── backward-compat aliases for the old UK Plan shape ──────
   * The /my-plan components still reference `plan.panels` and
   * `plan.priceGbp`. We mirror the values so the components can
   * read either; the values themselves are NG-currency now. */
  /** Alias for kwp. */
  panels: number
  /** Alias for priceNgn. Numeric value is ₦ even though the field is
   *  named `priceGbp` - kept for component compat. */
  priceGbp: number
}

/**
 * The 6 NG solutions, mirroring `lib/data/solutions.ts`. The order
 * is intentional: index 0 is LITE, 1 is HOME Standard (popular for
 * homes), 2 is HOME High-spec, then the three BUSINESS tiers in
 * ascending order of capacity. The `recommendPlan` ladder walks this
 * array in order, so reordering changes what gets surfaced for a
 * given consumption profile.
 */
export const NG_PLANS: NgPlan[] = [
  {
    id: 'lite-essential-backup',
    name: 'LITE Essential Backup',
    subtitle: 'Single phase · Essential backup',
    kwp: 4.34,
    batteryKwh: 5,
    inverterKw: 3.6,
    priceNgn: 3_800_000,
    segment: 'homes',
    panels: 4.34,         // alias
    priceGbp: 3_800_000,  // alias (value is actually ₦)
  },
  {
    id: 'home-standard',
    name: 'HOME Standard',
    subtitle: 'Single phase · Everyday home',
    kwp: 7.44,
    batteryKwh: 10,
    inverterKw: 6,
    priceNgn: 6_200_000,
    segment: 'homes',
    popular: true,
    panels: 7.44,
    priceGbp: 6_200_000,
  },
  {
    id: 'home-high-spec',
    name: 'HOME High-spec',
    subtitle: 'Single phase · Higher capacity',
    kwp: 11.16, // midpoint of 9.92-12.40 kWp
    batteryKwh: 16,
    inverterKw: 10, // midpoint of 8-12 kW
    priceNgn: 9_500_000,
    segment: 'homes',
    panels: 11.16,
    priceGbp: 9_500_000,
  },
  {
    id: 'business-entry-3-phase',
    name: 'BUSINESS Entry 3-Phase',
    subtitle: 'Three phase · Entry commercial',
    kwp: 11.78,
    batteryKwh: 16,
    inverterKw: 10,
    priceNgn: 11_500_000,
    segment: 'businesses',
    panels: 11.78,
    priceGbp: 11_500_000,
  },
  {
    id: 'business-standard-3-phase',
    name: 'BUSINESS Standard 3-Phase',
    subtitle: 'Three phase · Standard commercial',
    kwp: 17.36,
    batteryKwh: 32,
    inverterKw: 15,
    priceNgn: 17_500_000,
    segment: 'businesses',
    panels: 17.36,
    priceGbp: 17_500_000,
  },
  {
    id: 'business-flagship-3-phase',
    name: 'BUSINESS Flagship 3-Phase',
    subtitle: 'Three phase · Flagship commercial',
    kwp: 23.56,
    batteryKwh: 32,
    inverterKw: 20,
    priceNgn: 24_000_000,
    segment: 'businesses',
    panels: 23.56,
    priceGbp: 24_000_000,
  },
]

/** Lookup by id. */
export function getNgPlan(id: NgPlanId): NgPlan {
  const plan = NG_PLANS.find((p) => p.id === id)
  if (!plan) throw new Error(`Unknown NG plan id: ${id}`)
  return plan
}

/* ──────────────────────────────────────────────────────────────────────
   Consultation input (consumed by recommendPlan + calculateROI)
   ────────────────────────────────────────────────────────────────────── */

/** Household size - same ID space as the form. */
export type HouseholdSize = '1' | '2' | '3' | '4' | '5+' | string

/** Self-reported consumption band. */
export type ConsumptionTier = 'low' | 'medium' | 'high' | 'very-high' | 'unknown'

/** Devices the customer already has that materially raise demand. */
export type HeavyDevice = 'wallbox' | 'heatpump' | 'ac' | string

/** Generator usage band. */
export type GeneratorFrequency =
  | 'rarely'
  | 'sometimes'
  | 'daily'
  | 'frequently'
  | 'unknown'

/** Monthly fuel-spend band in NGN. */
export type FuelBudgetNgn =
  | 'below-20k'
  | '20k-50k'
  | '50k-100k'
  | 'above-100k'
  | 'unknown'

/** Items the customer wants backup power for (drives battery sizing). */
export type BackupNeedId = 'lights' | 'fridge' | 'ac' | 'pump' | string

export interface ConsultationInput {
  householdSize: HouseholdSize
  electricityUsage: ConsumptionTier
  devices: HeavyDevice[]
  region: string
  /** NG Step-3 extensions. All may be 'unknown' if the user skipped. */
  generatorFrequency: GeneratorFrequency
  fuelBudgetNgn: FuelBudgetNgn
  backupNeeds: BackupNeedId[]
}

/**
 * Lightweight, no-PII summary of the home used at the top of /my-plan.
 * Kept here (instead of in the adapter) because the components
 * historically import it from `../_lib/calc` and we don't want a
 * cross-folder rewrite just for the rename.
 */
export interface HomeDetails {
  houseType: string
  /** Number of people in the household (the form's `'5+'` maps to 5). */
  householdSize: number
  /** Roof shape/type. */
  roofOrientation: string
  /** Region. */
  region: string
  /** Annual electricity-use tier ID. */
  electricityUsage: string
  /** Heavy devices selected. */
  devices: string[]
  /** NG Step-3 fields surfaced in the strip. */
  generatorFrequency: string
  fuelBudgetNgn: string
  backupNeeds: string[]
}

/* ──────────────────────────────────────────────────────────────────────
   NG-specific assumptions + constants
   ────────────────────────────────────────────────────────────────────── */

/** Annual kWh per consumption tier. Midpoint of the form's kWh band. */
const USAGE_KWH_PER_YEAR: Record<ConsumptionTier, number> = {
  low: 3_000,
  medium: 4_500,
  high: 6_500,
  'very-high': 8_500,
  unknown: 5_000,
}

/**
 * Fraction of household consumption currently served by a generator.
 * Drives how the kWh pie splits between grid vs generator and therefore
 * how much fuel cost is actually available to save.
 */
const GEN_SHARE_BY_FREQUENCY: Record<GeneratorFrequency, number> = {
  rarely: 0.10,
  sometimes: 0.30,
  daily: 0.60,
  frequently: 0.80,
  unknown: 0.40,
}

/**
 * Midpoint monthly fuel spend (₦). Used when the user picks a band.
 * Annualised in the ROI calculation by ×12.
 */
const FUEL_BUDGET_ANNUAL_NGN: Record<FuelBudgetNgn, number> = {
  'below-20k': 240_000,    // 20k * 12
  '20k-50k': 420_000,      // 35k * 12
  '50k-100k': 900_000,     // 75k * 12
  'above-100k': 1_800_000, // 150k * 12
  unknown: 0,              // Derived from generator share + fuel price
}

/**
 * NG grid tariff (₦/kWh). Residential band (Band A/B/C). TBD - replace
 * with the verified national average when business confirms.
 */
const NG_GRID_TARIFF_NGN_PER_KWH = 68

/**
 * NG fuel prices + generator efficiency, split by fuel type.
 *
 * ⚠️ PROVISIONAL VALUES — pending business confirmation.
 *
 * Price (₦/L): 2026-10 reference pump prices (typical Nigeria retail
 * bands). Subject to NNPC subsidy changes, regional variation, and
 * black-market premiums in fuel-scarce zones. Treat as a *baseline*
 * that the business can swap in one number per field.
 *   - PMS ≈ ₦1,500–1,600/L (was ₦1,400/L — too low for late-2026)
 *   - AGO ≈ ₦1,900–2,000/L (was ₦1,800/L — too low for late-2026)
 *
 * Efficiency (kWh per litre): derived from market research, NOT a
 * measured Nigerian average. Real efficiency depends on generator
 * rated power, load factor, age, and maintenance. The range
 * "0.50–0.60 L/kWh for 5 kVA petrol household units" implies
 * 1.7–2.0 kWh/L (midpoint ~1.85). Small diesel units run
 * 0.32–0.36 L/kWh → 2.8–3.1 kWh/L (midpoint ~2.95).
 *
 * Source: nigerian generator market analysis (typical references,
 * 2025–2026), Nigeria energy audit reports. NOT verified by
 * business. **Do not present as a measured average** in the UI.
 *
 * If the calculator is later refined to ask about generator
 * rated power + typical load, these constants will move into
 * a per-(power, load) lookup table. For now they are a test
 * baseline tuned to be in the realistic range, not optimistic.
 *
 * Together with price, the implicit ₦/kWh cost of generator power:
 *   PMS 1,533 / 1.85 ≈ ₦829/kWh  (was ₦467/kWh at 3.0/1,400)
 *   AGO 1,915 / 2.95 ≈ ₦649/kWh  (was ₦514/kWh at 3.5/1,800)
 * Both corrected UP — the user actually spends more per kWh of
 * generator power than the previous placeholders implied, so
 * generator-savings claims now align closer to reality.
 */
const NG_PMS_PRICE_NGN_PER_LITRE = 1_533
const NG_PMS_KWH_PER_LITRE        = 1.85
const NG_AGO_PRICE_NGN_PER_LITRE = 1_915
const NG_AGO_KWH_PER_LITRE        = 2.95

/**
 * "Not sure" path-B hard cap on the back-derived annual fuel cost.
 *
 * When the user picks "Not sure" for their monthly fuel budget, we
 * back-derive a cap from their consumption profile and the assumed
 * fuel constants. The back-derive is by construction a theoretical
 * maximum, so without this cap "Not sure" would always claim the
 * full theoretical generator saving — same as the "ignore the cap"
 * degenerate case. This hard cap is a sanity bound, segment-aware,
 * that keeps the claim in a plausible range until the user reports
 * an actual figure.
 *
 * Numbers are illustrative defaults pending business confirmation:
 *   homes      → ₦50k/month  = ₦600k/year
 *   businesses → ₦300k/month = ₦3.6M/year
 */
const NOT_SURE_HARD_CAP_NGN_PER_YEAR: Record<NgPlan['segment'], number> = {
  homes: 600_000,
  businesses: 3_600_000,
}

/** Helper: which fuel type does this plan assume? Drives both the
 *  back-derive (path B) and the kWh↔₦ conversion (path A). */
function fuelTypeFor(plan: NgPlan): 'pms' | 'ago' {
  return plan.segment === 'homes' ? 'pms' : 'ago'
}

/**
 * Annual opex as a fraction of system cost. Covers routine
 * maintenance, panel cleaning, and any inverter/battery servicing.
 *
 * ⚠️ IDEAL MODE — currently set to 0. Per user directive, the
 * calculator runs in an "ideal mode" that ignores ongoing
 * maintenance, panel cleaning, and battery/inverter replacement
 * costs. Re-introduce with a non-zero value (typical 0.5–1.5 %
 * of system cost for solar assets) once the maintenance model is
 * verified. When re-enabled, also extend the 30-year loop to add
 * one-off battery / inverter replacement events around year
 * 10–15 — see the comment trail in `calculateROI()`.
 */
const NG_OPEX_PCT = 0

const NG_PROJECT_LIFETIME_YEARS = 30

/**
 * Per-region PV specific yield (kWh / kWp / year) for Nigeria.
 *
 * Illustrative figures pending the verified national average - the
 * country sits in the high-irradiance belt so yields should be
 * 1,300-1,800 kWh/kWp/yr depending on latitude, cloud cover and dust.
 * Coastal states (South South, South West) are cloudier; the far
 * north (North East, North West) is the sunniest. The fallback is
 * 1,500 kWh/kWp/yr - a defensible middle figure for unrecognised
 * regions.
 */
const NG_REGION_YIELD: Record<string, number> = {
  'Lagos': 1_400,
  'Abuja (FCT)': 1_500,
  'North Central': 1_500,
  'North East': 1_700,
  'North West': 1_700,
  'South East': 1_400,
  'South South': 1_300,
  'South West': 1_400,
}
const NG_REGION_YIELD_FALLBACK = 1_500

/**
 * Self-consumption rate - what fraction of solar generation is used
 * on-site rather than exported. With a battery, most of the daytime
 * surplus can be shifted to evening; without one, the surplus has to
 * be exported (or curtailed).
 */
function selfConsumptionRateFor(plan: NgPlan): number {
  return plan.batteryKwh > 0 ? 0.85 : 0.40
}

/**
 * Panel degradation factors (year 1 = 100 %, year 30 ≈ 85 %).
 * 1-indexed. Length = NG_PROJECT_LIFETIME_YEARS.
 */
const DEGRADATION_FACTORS: ReadonlyArray<number> = (() => {
  const out: number[] = []
  for (let year = 1; year <= NG_PROJECT_LIFETIME_YEARS; year++) {
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

/** Exposed for the ROI breakdown disclosure (read-only). */
export function getDegradationFactors(): ReadonlyArray<number> {
  return DEGRADATION_FACTORS
}

/* ──────────────────────────────────────────────────────────────────────
   Recommendation engine
   ────────────────────────────────────────────────────────────────────── */

/**
 * 5×4 base tier lookup (household size × consumption). Encodes the
 * implicit "people × kWh/yr" load:
 *   1 person ≈ 2,000 kWh, 5+ people ≈ 7,000+ kWh baseline.
 * Returns the NG_PLANS index for the base recommendation.
 */
const BASE_TIER_LOOKUP: Record<HouseholdSize, Record<ConsumptionTier, number>> = {
  '1':  { low: 0, medium: 0, high: 1, 'very-high': 1, unknown: 0 },
  '2':  { low: 0, medium: 0, high: 1, 'very-high': 2, unknown: 0 },
  '3':  { low: 0, medium: 1, high: 2, 'very-high': 2, unknown: 1 },
  '4':  { low: 0, medium: 1, high: 2, 'very-high': 2, unknown: 1 },
  '5+': { low: 1, medium: 2, high: 2, 'very-high': 2, unknown: 2 },
}

/**
 * Recommend an NG plan. Pipeline:
 *   1. base tier from householdSize × electricityUsage
 *   2. each heavy device (+1 tier, capped)
 *   3. generator use of 'daily' or 'frequently' (+1 tier) — a heavy
 *      generator dependency means the home needs a real battery
 *      (≥5 kWh) to cover the evening gap, so we move up from LITE.
 *
 * The output is always a valid NgPlanId. The capped output is the
 * BUSINESS Flagship 3-Phase (the last plan in NG_PLANS). If the user
 * has signals suggesting even Flagship won't cover them (e.g. very-high
 * usage + 3 heavy devices), `recommendPlan` still returns Flagship
 * and the page can show a "human follow-up" banner — we do not
 * silently return null.
 */
export function recommendPlan(c: ConsultationInput): NgPlanId {
  const sizeRow = BASE_TIER_LOOKUP[c.householdSize] ?? BASE_TIER_LOOKUP['3']
  let tier = sizeRow[c.electricityUsage] ?? 1

  for (const device of c.devices ?? []) {
    if (device === 'wallbox' || device === 'heatpump' || device === 'ac') {
      tier = Math.min(NG_PLANS.length - 1, tier + 1)
    }
  }

  if (c.generatorFrequency === 'daily' || c.generatorFrequency === 'frequently') {
    tier = Math.min(NG_PLANS.length - 1, tier + 1)
  }

  return NG_PLANS[tier].id
}

/* ──────────────────────────────────────────────────────────────────────
   ROI engine
   ────────────────────────────────────────────────────────────────────── */

export interface PlanRoi {
  /** Year-1 solar generation (kWh). */
  annualGenerationKwh: number
  /** Year-1 self-consumed kWh (replaces grid first, then generator). */
  annualSelfConsumedKwh: number
  /** Year-1 exported kWh. NG: feed-in tariff is minimal, so income is small. */
  annualExportedKwh: number
  /** Year-1 grid-cost offset (₦). */
  annualGridOffsetNgn: number
  /** Year-1 generator-fuel offset (₦). Capped by reported fuel budget. */
  annualGeneratorOffsetNgn: number
  /** Year-1 export income (₦). NG: typically ₦0. */
  annualExportIncomeNgn: number
  /** Year-1 gross saving (₦). */
  annualSavingNgn: number
  /** Year-1 net saving after opex (₦). */
  annualNetSavingNgn: number
  /** Annual maintenance opex (₦). */
  annualOpexNgn: number
  /** Years to break even on the system price. */
  paybackYears: number
  /** Sum of yearly NET savings across all 30 years. */
  total30YearSavingNgn: number
  /** Total lifetime net saving minus system price (i.e. what you net). */
  total30YearReturnNgn: number
  /** (lifetime net saving / system price) × 100. */
  roiPct: number
  /** System price used (₦). */
  priceNgn: number
  /**
   * The actual annual fuel cost (₦) the calculator used as the
   * cap for generator savings. Surfaces the value path A or path
   * B resolved to (band midpoint, back-derive, or user override)
   * so the UI can show "this is what we assumed" instead of a
   * magic number.
   */
  appliedAnnualFuelCostNgn: number
  /**
   * Whether the user overrode the cap with a slider value (true)
   * or the calculator used the band / back-derive default (false).
   */
  fuelCostOverridden: boolean
  /** Regional yield used (kWh/kWp/yr). Surfaced for the breakdown. */
  appliedRegionYield: number
  /** Annual kWh used to size the savings (kWh). */
  appliedAnnualKwh: number
  /** Generator share of the pie used to split grid vs generator. */
  appliedGeneratorShare: number

  /* ────── backward-compat aliases ──────
   * Old OfferCard + SavingsSection + PlanSummaryAside components
   * still reference `offerPriceGbp` and the `*Gbp` saving fields. The
   * underlying values are ₦ (the names are historical from the UK
   * implementation). Keep the names so we don't have to rewrite every
   * consumer at once. */
  offerPriceNgn: number
  offerPriceGbp: number
  offerValidUntil: Date
  annualSavingGbp: number
  total30YearSavingGbp: number
  total30YearReturnGbp: number
  annualExportIncomeGbp: number
  annualImportOffsetGbp: number
}

/**
 * Internal: estimate the current generator fuel spend per year.
 *
 * Path A (user picked a band): use the band midpoint directly. The
 * cap is the user's own number, so no further clipping.
 *
 * Path B (user picked "Not sure"): back-derive from generator share
 * + estimated kWh + fuel constants for the plan's fuel type, then
 * clip to the segment-aware hard cap (`NOT_SURE_HARD_CAP_NGN_PER_YEAR`).
 * The clip matters: without it, the back-derive equals the
 * theoretical maximum, so `genOffsetNgn = min(theoretical, theoretical)`
 * collapses to "no constraint at all" — every "Not sure" user
 * would get the full theoretical saving. The cap restores a
 * reasonable upper bound until the user reports an actual figure.
 *
 * Returns ₦/year.
 */
function estimateAnnualFuelCostNgn(
  c: ConsultationInput,
  generatorKwhPerYear: number,
  fuelType: 'pms' | 'ago',
  segment: NgPlan['segment'],
  userOverride: number | undefined,
): { capNgn: number; overridden: boolean } {
  // User-set slider override takes priority. Always allow it; the
  // slider's own range in CustomiseCard is bounded (0 – 2× hard cap)
  // so the user can't drive this to absurd values.
  if (typeof userOverride === 'number' && Number.isFinite(userOverride) && userOverride >= 0) {
    return { capNgn: userOverride, overridden: true }
  }
  const budget = c.fuelBudgetNgn ?? 'unknown'
  if (budget !== 'unknown') {
    return { capNgn: FUEL_BUDGET_ANNUAL_NGN[budget] ?? 0, overridden: false }
  }
  // Back-derive: litres = kWh / kWhPerLitre; ₦ = litres × ₦/L
  const pricePerLitre = fuelType === 'ago' ? NG_AGO_PRICE_NGN_PER_LITRE : NG_PMS_PRICE_NGN_PER_LITRE
  const kwhPerLitre    = fuelType === 'ago' ? NG_AGO_KWH_PER_LITRE        : NG_PMS_KWH_PER_LITRE
  const backDerived = (generatorKwhPerYear / kwhPerLitre) * pricePerLitre
  return {
    capNgn: Math.min(backDerived, NOT_SURE_HARD_CAP_NGN_PER_YEAR[segment]),
    overridden: false,
  }
}

/**
 * Run the full NG ROI pipeline for a given plan + consultation. Pure
 * function, no I/O. The math is documented in the file header.
 */
export function calculateROI(
  plan: NgPlan,
  c: ConsultationInput,
  /**
   * User-tweakable annual fuel budget override (₦/year). When set,
   * replaces both the band-midpoint cap (path A) and the back-derive
   * + hard-cap (path B). Used by the "Not sure" slider in
   * `CustomiseCard` so the user can dial the assumed spend up or down
   * without re-running the consultation form.
   */
  userFuelBudgetOverrideNgn?: number,
): PlanRoi {
  // 1. Total annual kWh and grid/generator split.
  const annualKwh = USAGE_KWH_PER_YEAR[c.electricityUsage] ?? USAGE_KWH_PER_YEAR.unknown
  const genShare = GEN_SHARE_BY_FREQUENCY[c.generatorFrequency] ?? GEN_SHARE_BY_FREQUENCY.unknown
  const gridKwh = annualKwh * (1 - genShare)
  const generatorKwh = annualKwh * genShare

  // 2. Estimated fuel spend (used to cap the savings claim). The fuel
  //    type follows the plan's segment: homes → PMS, businesses → AGO.
  const fuelType = fuelTypeFor(plan)
  const { capNgn: annualFuelCostNgn, overridden: fuelCostOverridden } =
    estimateAnnualFuelCostNgn(c, generatorKwh, fuelType, plan.segment, userFuelBudgetOverrideNgn)

  // 3. Solar year-1 generation.
  const regionYield = NG_REGION_YIELD[c.region] ?? NG_REGION_YIELD_FALLBACK
  const year1GenKwh = plan.kwp * regionYield

  // 4. Self-consumption (battery boosts).
  const selfConsumptionRate = selfConsumptionRateFor(plan)
  const selfConsumedKwh = Math.min(year1GenKwh * selfConsumptionRate, annualKwh)
  const exportedKwh = Math.max(0, year1GenKwh - selfConsumedKwh)

  // 5. Displacement - the no-double-count rule.
  // First the grid, then the generator.
  const gridDisplacedKwh = Math.min(selfConsumedKwh, gridKwh)
  const gridOffsetNgn = gridDisplacedKwh * NG_GRID_TARIFF_NGN_PER_KWH

  const genDisplacedKwh = Math.max(0, selfConsumedKwh - gridKwh)
  // kWh per ₦ from the generator: (kWh per litre) / (₦ per litre).
  // Plan's fuel type picks the constants — PMS for homes, AGO for
  // businesses. Each combination gives a different implicit ₦/kWh
  // cost of generator power, which the offset and the path-B cap both
  // thread through.
  const fuelPricePerLitre = fuelType === 'ago' ? NG_AGO_PRICE_NGN_PER_LITRE : NG_PMS_PRICE_NGN_PER_LITRE
  const fuelKwhPerLitre    = fuelType === 'ago' ? NG_AGO_KWH_PER_LITRE        : NG_PMS_KWH_PER_LITRE
  const genKwhPerNgn = fuelKwhPerLitre / fuelPricePerLitre
  const potentialGenOffsetNgn = genDisplacedKwh / genKwhPerNgn
  // Cap at the user's actual fuel spend - we cannot claim more savings
  // than they were spending. This is the key "don't over-state"
  // guarantee.
  const genOffsetNgn = Math.min(potentialGenOffsetNgn, annualFuelCostNgn)

  // 6. Export income (NG: minimal feed-in tariff).
  const exportIncomeNgn = exportedKwh * 0

  // 7. Annual opex. Currently 0 (ideal mode — see NG_OPEX_PCT comment).
  //    When re-introduced, swap back to `plan.priceNgn * NG_OPEX_PCT`
  //    and the 30-year loop below will pick it up automatically.
  const opexNgn = plan.priceNgn * NG_OPEX_PCT

  // 8. Totals. In ideal mode `netSavingsNgn == grossSavingsNgn`.
  const grossSavingsNgn = gridOffsetNgn + genOffsetNgn + exportIncomeNgn
  const netSavingsNgn = grossSavingsNgn - opexNgn

  // 9. Payback on the system price (clamped to lifetime).
  const paybackYears =
    netSavingsNgn > 0
      ? Math.min(
          NG_PROJECT_LIFETIME_YEARS,
          Math.round((plan.priceNgn / netSavingsNgn) * 10) / 10,
        )
      : Infinity

  // 10. 30-year lifetime sum, applying degradation year-by-year.
  let total30YearSaving = 0
  for (let i = 0; i < NG_PROJECT_LIFETIME_YEARS; i++) {
    const yearGen = year1GenKwh * DEGRADATION_FACTORS[i]
    const yearSelfConsumed = Math.min(yearGen * selfConsumptionRate, annualKwh)
    const yearGridDisplaced = Math.min(yearSelfConsumed, gridKwh)
    const yearGenDisplaced = Math.max(0, yearSelfConsumed - gridKwh)
    const yearGridOffset = yearGridDisplaced * NG_GRID_TARIFF_NGN_PER_KWH
    const yearGenOffset = Math.min(
      yearGenDisplaced / genKwhPerNgn,
      annualFuelCostNgn,
    )
    const yearSavings = yearGridOffset + yearGenOffset - opexNgn
    total30YearSaving += yearSavings
  }
  const total30YearSavingNgn = Math.round(total30YearSaving)
  const total30YearReturnNgn = total30YearSavingNgn - plan.priceNgn
  // Backward-compat aliases - same numbers, GBP field names.
  const total30YearSavingGbp = total30YearSavingNgn
  const total30YearReturnGbp = total30YearReturnNgn
  const roiPct =
    plan.priceNgn > 0
      ? Math.round(((total30YearSavingNgn / plan.priceNgn) - 1) * 100)
      : 0

  return {
    annualGenerationKwh: Math.round(year1GenKwh),
    annualSelfConsumedKwh: Math.round(selfConsumedKwh),
    annualExportedKwh: Math.round(exportedKwh),
    annualGridOffsetNgn: Math.round(gridOffsetNgn),
    annualGeneratorOffsetNgn: Math.round(genOffsetNgn),
    annualExportIncomeNgn: Math.round(exportIncomeNgn),
    annualSavingNgn: Math.round(grossSavingsNgn),
    annualNetSavingNgn: Math.round(netSavingsNgn),
    annualOpexNgn: Math.round(opexNgn),
    paybackYears,
    total30YearSavingNgn,
    total30YearReturnNgn,
    roiPct,
    priceNgn: plan.priceNgn,
    appliedAnnualFuelCostNgn: annualFuelCostNgn,
    fuelCostOverridden,
    appliedRegionYield: regionYield,
    appliedAnnualKwh: annualKwh,
    appliedGeneratorShare: genShare,
    // Backward-compat aliases. The `*Gbp` fields used to be the live
    // UK-ladder savings in £; the values are now ₦ even though the
    // names are unchanged. `offerPriceGbp` is the system price with
    // no UK-style flat discount; `offerValidUntil` is 30 days out
    // from "now" (matches the old OfferCard expectation).
    offerPriceNgn: plan.priceNgn,
    offerPriceGbp: plan.priceNgn,
    offerValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    annualSavingGbp: Math.round(grossSavingsNgn),
    total30YearSavingGbp,
    total30YearReturnGbp,
    annualExportIncomeGbp: Math.round(exportIncomeNgn),
    annualImportOffsetGbp: Math.round(gridOffsetNgn),
  }
}

/* ──────────────────────────────────────────────────────────────────────
   Backward-compat re-exports
   The components and admin tables still import the old UK `PLANS`,
   `Plan`, `PlanId`, `RoiAssumptions` names. Until those consumers are
   migrated to the NG types we keep aliases that point at the NG
   catalogue. The numeric values are ₦ now, not £ - so the old
   `formatGBP` consumers should switch to `formatNGN`.
   ────────────────────────────────────────────────────────────────────── */

export type Plan = NgPlan
export type PlanId = NgPlanId

/** Legacy UK plan list, retained as an alias of the NG catalogue. */
export const PLANS: Plan[] = NG_PLANS

export function getPlan(id: PlanId): Plan {
  return getNgPlan(id)
}

export function findPlanByPrice(_priceGbp: number): Plan | undefined {
  // Legacy: price lookups were by GBP. The NG catalogue keys by id -
  // callers that previously used this should switch to `getNgPlan(id)`.
  return undefined
}

/** Legacy alias. */
export type ConsumptionTierCompat = ConsumptionTier
/** Legacy alias. */
export type HeavyDeviceCompat = HeavyDevice

/** Legacy default assumptions - used to be £0.2632/kWh import, £0.15/kWh
 *  export. The NG calculator ignores these and uses NG tariff constants
 *  baked in. Kept exported so any import that still references them
 *  doesn't break at compile time. */
export interface RoiAssumptions {
  importPriceGbp: number
  exportPriceGbp: number
  selfConsumptionRate: number
}

export function defaultAssumptions(_plan: Plan): RoiAssumptions {
  return {
    importPriceGbp: NG_GRID_TARIFF_NGN_PER_KWH,
    exportPriceGbp: 0,
    selfConsumptionRate: 0,
  }
}

export const DEFAULT_ROI_IMPORT_PRICE_GBP = NG_GRID_TARIFF_NGN_PER_KWH
export const DEFAULT_ROI_EXPORT_PRICE_GBP = 0
export const ROI_SELF_CONSUMPTION_BASE_RATE = 0.40
export const ROI_IMPORT_PRICE_MIN = 0
export const ROI_IMPORT_PRICE_MAX = 500
export const ROI_IMPORT_PRICE_STEP = 1
export const ROI_EXPORT_PRICE_MIN = 0
export const ROI_EXPORT_PRICE_MAX = 0
export const ROI_EXPORT_PRICE_STEP = 1
export const ROI_SELF_CONSUMPTION_MIN = 0
export const ROI_SELF_CONSUMPTION_MAX = 1
export const ROI_SELF_CONSUMPTION_STEP = 0.01

// Touch the import so it doesn't get flagged as unused while the
// marketing surface still sources its 6 solutions from the same data.
void solutionDetails

// Touch the marketing data to keep the linter honest about the
// single-source-of-truth contract between the marketing surface and
// the calculator. (No runtime cost; this compiles away.)
void NG_PLANS.length
