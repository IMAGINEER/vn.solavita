'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowUp,
  CircleCheckBig,
  TrendingUp,
  SlidersHorizontal,
} from 'lucide-react'
import { openFormModal } from '@/lib/form-modal'

gsap.registerPlugin(ScrollTrigger)

export default function ROICalculator() {
  const sectionRef = useRef<HTMLElement>(null)
  const chartSvgRef = useRef<SVGSVGElement>(null)
  const priceSvgRef = useRef<SVGSVGElement>(null)
  const chartPathRef = useRef<SVGPathElement>(null)
  const areaPathRef = useRef<SVGPathElement>(null)
  const pricePathRef = useRef<SVGPathElement>(null)
  const lcoePathRef = useRef<SVGPathElement>(null)

  const [electricityPrice, setElectricityPrice] = useState(0.30)
  const [selfConsumptionRateInput, setSelfConsumptionRateInput] = useState(60)
  const [hasHeatPump, setHasHeatPump] = useState(false)
  const [hasEV, setHasEV] = useState(false)
  // UK Smart Export Guarantee (SEG) typical rate — varies by supplier, ~£0.15/kWh
  const feedInTariff = 0.15

  const systemInvestment = 12999
  const systemLifespan = 30
  const specificYield = 995.7
  const systemCapacity = 10
  const degradationRate = 0.0112

  // Auto-adjust self-consumption rate based on heat pump / EV toggles
  useEffect(() => {
    let suggested = 60
    if (hasHeatPump && hasEV) suggested = 88
    else if (hasHeatPump) suggested = 75
    else if (hasEV) suggested = 80
    setSelfConsumptionRateInput(suggested)
  }, [hasHeatPump, hasEV])

  // === CORE CALCULATION ===
  const results = useMemo(() => {
    const selfConsumptionRate = selfConsumptionRateInput / 100

    const effectiveCapacity = systemCapacity
    const firstYearProduction = effectiveCapacity * specificYield

    let totalProduction = 0
    let totalSavings = 0
    let cumulativeSavings = 0
    let paybackYear = systemLifespan
    const yearlyData: { year: number; cumulative: number; savings: number }[] = []
    const annualCashflows: number[] = []

    for (let year = 1; year <= systemLifespan; year++) {
      const yearProduction = firstYearProduction * Math.pow(1 - degradationRate, year - 1)
      const yearPrice = electricityPrice * Math.pow(1.03, year - 1)

      const selfConsumed = yearProduction * selfConsumptionRate
      const exported = yearProduction * (1 - selfConsumptionRate)

      const yearSaving = (selfConsumed * yearPrice) + (exported * feedInTariff)

      totalProduction += yearProduction
      totalSavings += yearSaving
      cumulativeSavings += yearSaving
      annualCashflows.push(yearSaving)
      yearlyData.push({ year, cumulative: cumulativeSavings, savings: yearSaving })

      if (cumulativeSavings >= systemInvestment && paybackYear === systemLifespan) {
        const prev = cumulativeSavings - yearSaving
        const fraction = (systemInvestment - prev) / yearSaving
        paybackYear = parseFloat(((year - 1) + fraction).toFixed(1))
      }
    }

    const lcoe = systemInvestment / totalProduction

    // IRR bisection
    let irrLow = 0, irrHigh = 1, irr = 0
    for (let i = 0; i < 100; i++) {
      irr = (irrLow + irrHigh) / 2
      let npv = -systemInvestment
      for (let y = 0; y < annualCashflows.length; y++) {
        npv += annualCashflows[y] / Math.pow(1 + irr, y + 1)
      }
      if (npv > 0) irrLow = irr
      else irrHigh = irr
    }

    const firstYearSavings = Math.round(
      (firstYearProduction * selfConsumptionRate * electricityPrice) +
      (firstYearProduction * (1 - selfConsumptionRate) * feedInTariff)
    )

    return {
      lcoe,
      paybackYear,
      irr,
      totalBenefit: totalSavings - systemInvestment,
      firstYearProduction: Math.round(firstYearProduction),
      firstYearSavings,
      selfConsumptionRate,
      effectiveCapacity,
      yearlyData,
    }
  }, [electricityPrice, selfConsumptionRateInput])

  // === CHART PATH GENERATORS ===
  const cumulativeChart = useMemo(() => {
    const data = results.yearlyData
    if (!data.length) return null

    const W = 560, H = 240, PX = 50, PY = 30
    const plotW = W - PX - 20, plotH = H - PY - 20
    const maxVal = Math.max(data[data.length - 1].cumulative, systemInvestment) * 1.15

    const getX = (i: number) => PX + (i / (data.length - 1)) * plotW
    const getY = (v: number) => PY + plotH - (v / maxVal) * plotH

    const points = data.map((d, i) => ({ x: getX(i), y: getY(d.cumulative) }))
    const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
    const area = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)} L ${points[points.length - 1].x.toFixed(1)} ${(PY + plotH).toFixed(1)} L ${points[0].x.toFixed(1)} ${(PY + plotH).toFixed(1)} Z`

    const investY = getY(systemInvestment)

    // Payback point
    const pbIdx = Math.floor(results.paybackYear - 1)
    const pbFrac = results.paybackYear - 1 - pbIdx
    const pbX = pbIdx < data.length - 1
      ? getX(pbIdx) + (getX(pbIdx + 1) - getX(pbIdx)) * pbFrac
      : getX(data.length - 1)

    // Y axis labels
    const yLabels = [0, 0.25, 0.5, 0.75, 1].map(pct => ({
      value: Math.round(maxVal * pct),
      y: getY(maxVal * pct),
    }))

    // X axis labels (every 5 years)
    const xLabels = [1, 5, 10, 15, 20, 25, 30].map(yr => ({
      year: yr,
      x: getX(yr - 1),
    }))

    return { line, area, investY, pbX, W, H, PX, PY, plotH, yLabels, xLabels }
  }, [results])

  const priceChart = useMemo(() => {
    const W = 560, H = 160, PX = 50, PY = 25
    const plotW = W - PX - 20, plotH = H - PY - 20
    const years = 30
    const maxPrice = electricityPrice * Math.pow(1.03, years) * 1.2

    const getX = (i: number) => PX + (i / (years - 1)) * plotW
    const getY = (v: number) => PY + plotH - (v / maxPrice) * plotH

    const pricePoints: string[] = []
    const lcoePoints: string[] = []

    for (let y = 0; y < years; y++) {
      const x = getX(y)
      const price = electricityPrice * Math.pow(1.03, y)
      pricePoints.push(`${y === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${getY(price).toFixed(1)}`)
      lcoePoints.push(`${y === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${getY(results.lcoe).toFixed(1)}`)
    }

    const priceLine = pricePoints.join(' ')
    const lcoeLine = lcoePoints.join(' ')

    const xLabels = [1, 5, 10, 15, 20, 25, 30].map(yr => ({ year: yr, x: getX(yr - 1) }))

    return { priceLine, lcoeLine, W, H, PX, PY, plotH, xLabels, getY }
  }, [results, electricityPrice])

  // === GSAP ANIMATIONS ===
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.roi-title', { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none reverse' },
      })

      gsap.fromTo('.roi-left', { opacity: 0, x: -50 }, {
        opacity: 1, x: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.roi-content', start: 'top 80%', toggleActions: 'play none none reverse' },
      })

      gsap.fromTo('.roi-right', { opacity: 0, x: 50 }, {
        opacity: 1, x: 0, duration: 1, delay: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.roi-content', start: 'top 80%', toggleActions: 'play none none reverse' },
      })

      gsap.fromTo('.result-card', { opacity: 0, y: 30, scale: 0.95 }, {
        opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: '.result-grid', start: 'top 85%', toggleActions: 'play none none reverse' },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="roi"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background:
          'linear-gradient(100deg, rgba(20, 184, 166, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)',
      }}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] rounded-full bg-uk-teal/10 blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-uk-emerald/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="roi-title text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-uk-line mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
            <span className="text-sm text-uk-slate font-cw-regular">Payback in seconds</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-cw-bold mb-6 text-uk-navy">
            Calculate Your <span className="text-gradient">Savings</span>
          </h2>
          <p className="text-lg md:text-xl text-uk-slate font-cw-regular max-w-3xl mx-auto">
            Enter your details and see instantly how quickly your solar system pays for itself.
          </p>
        </div>

        {/* === 4 RESULT CARDS (Top) === */}
        <div className="result-grid grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-14">
          {/* LCOE */}
          <div className="result-card bg-white border border-uk-line rounded-2xl p-5 md:p-6 text-center hover:border-uk-teal/40 hover:shadow-lg hover:shadow-uk-teal/5 transition-all">
            <div className="text-xs uppercase tracking-wider text-uk-slate mb-2 font-cw-regular">LCOE</div>
            <div className="text-3xl md:text-4xl font-cw-bold text-uk-teal-dark mb-1">
              £{results.lcoe.toFixed(4)}
            </div>
            <div className="text-sm text-uk-slate">/kWh levelised cost</div>
            <div className="mt-3 text-xs text-uk-emerald flex items-center justify-center gap-1">
              <ArrowUp className="w-3 h-3" />
              87% cheaper than grid
            </div>
          </div>

          {/* Payback */}
          <div className="result-card bg-white border border-uk-line rounded-2xl p-5 md:p-6 text-center hover:border-uk-teal/40 hover:shadow-lg hover:shadow-uk-teal/5 transition-all">
            <div className="text-xs uppercase tracking-wider text-uk-slate mb-2 font-cw-regular">Payback</div>
            <div className="text-3xl md:text-4xl font-cw-bold text-uk-teal-dark mb-1">
              {results.paybackYear.toFixed(1)}
            </div>
            <div className="text-sm text-uk-slate">Years to payback</div>
            <div className="mt-3 text-xs text-uk-emerald flex items-center justify-center gap-1">
              <CircleCheckBig className="w-3 h-3" fill="currentColor" />
              Faster than market average
            </div>
          </div>

          {/* IRR */}
          <div className="result-card bg-white border border-uk-line rounded-2xl p-5 md:p-6 text-center hover:border-uk-teal/40 hover:shadow-lg hover:shadow-uk-teal/5 transition-all">
            <div className="text-xs uppercase tracking-wider text-uk-slate mb-2 font-cw-regular">Return (IRR)</div>
            <div className="text-3xl md:text-4xl font-cw-bold text-uk-teal-dark mb-1">
              {(results.irr * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-uk-slate">Annual return</div>
            <div className="mt-3 text-xs text-uk-emerald flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3" fill="currentColor" />
              vs. savings ~3%
            </div>
          </div>

          {/* 30yr Total */}
          <div className="result-card bg-white border border-uk-line rounded-2xl p-5 md:p-6 text-center hover:border-uk-teal/40 hover:shadow-lg hover:shadow-uk-teal/5 transition-all">
            <div className="text-xs uppercase tracking-wider text-uk-slate mb-2 font-cw-regular">30-Year Yield</div>
            <div className="text-3xl md:text-4xl font-cw-bold text-uk-teal-dark mb-1">
              £{Math.round(results.totalBenefit).toLocaleString('en-GB')}
            </div>
            <div className="text-sm text-uk-slate">Total net benefit</div>
            <div className="mt-3 text-xs text-uk-emerald flex items-center justify-center gap-1">
              <CircleCheckBig className="w-3 h-3" fill="currentColor" />
              After all costs
            </div>
          </div>
        </div>

        {/* === MAIN CONTENT: Inputs + Charts === */}
        <div className="roi-content grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT: Input Panel (4 cols) */}
          <div className="roi-left lg:col-span-4 bg-white border border-uk-line rounded-3xl p-6 md:p-8 sticky top-24 shadow-sm">
            <h3 className="text-xl font-cw-bold text-uk-navy mb-6 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-uk-teal" strokeWidth={2} />
              Your details
            </h3>

            {/* Electricity Price */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-uk-slate">Electricity price</label>
                <span className="text-base font-cw-bold text-uk-navy bg-uk-teal-soft px-3 py-1 rounded-lg">£{electricityPrice.toFixed(2)}/kWh</span>
              </div>
              <input
                type="range" min="0.25" max="0.50" step="0.01" value={electricityPrice}
                onChange={(e) => setElectricityPrice(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-uk-line
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-uk-teal [&::-webkit-slider-thumb]:shadow-lg
                  [&::-webkit-slider-thumb]:shadow-uk-teal/30 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
              />
              <div className="flex justify-between text-xs text-uk-slate mt-1"><span>£0.25</span><span>£0.50</span></div>
            </div>

            {/* Self-Consumption Rate */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-uk-slate">Self-consumption</label>
                <span className="text-base font-cw-bold text-uk-navy bg-uk-teal-soft px-3 py-1 rounded-lg">{selfConsumptionRateInput}%</span>
              </div>
              <input
                type="range" min="30" max="95" value={selfConsumptionRateInput}
                onChange={(e) => setSelfConsumptionRateInput(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-uk-line
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-uk-teal [&::-webkit-slider-thumb]:shadow-lg
                  [&::-webkit-slider-thumb]:shadow-uk-teal/30 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
              />
              <div className="flex justify-between text-xs text-uk-slate mt-1"><span>30%</span><span>95%</span></div>
            </div>

            {/* Heat Pump & EV Toggles */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-uk-slate">Appliances that boost self-consumption</label>
              </div>
              <div className="flex gap-3">
                {/* Heat Pump Toggle */}
                <button
                  type="button"
                  onClick={() => setHasHeatPump(!hasHeatPump)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all text-sm font-cw-regular ${
                    hasHeatPump
                      ? 'border-uk-teal bg-uk-teal-soft text-uk-teal-dark'
                      : 'border-uk-line bg-white text-uk-slate hover:border-uk-teal/50'
                  }`}
                >
                  <span>🔥</span>
                  <span>Heat pump</span>
                </button>

                {/* EV Toggle */}
                <button
                  type="button"
                  onClick={() => setHasEV(!hasEV)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all text-sm font-cw-regular ${
                    hasEV
                      ? 'border-uk-emerald bg-uk-emerald/10 text-uk-teal-dark'
                      : 'border-uk-line bg-white text-uk-slate hover:border-uk-emerald/50'
                  }`}
                >
                  <span>🚗</span>
                  <span>EV charging</span>
                </button>
              </div>
            </div>

            {/* Quick stats */}
            <div className="mt-6 pt-4 border-t border-uk-line space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-uk-slate">Effective capacity</span>
                <span className="text-uk-navy font-cw-bold">{results.effectiveCapacity} kWp</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-uk-slate">Appliances</span>
                <span className="text-uk-navy font-cw-bold">
                  {!hasHeatPump && !hasEV ? '—' : ''}
                  {hasHeatPump ? '🔥 ' : ''}{hasHeatPump && hasEV ? '·' : ''}{hasEV ? '🚗' : ''}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-uk-slate">Self-consumption</span>
                <span className="text-uk-navy font-cw-bold">{Math.round(results.selfConsumptionRate * 100)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-uk-slate">Year-1 yield</span>
                <span className="text-uk-navy font-cw-bold">{results.firstYearProduction.toLocaleString('en-GB')} kWh</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-uk-slate">Year-1 saving</span>
                <span className="text-uk-emerald font-cw-bold">£{results.firstYearSavings.toLocaleString('en-GB')}</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Charts (8 cols) */}
          <div className="roi-right lg:col-span-8 space-y-6">

            {/* Chart 1: Cumulative Savings */}
            <div className="bg-white border border-uk-line rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                <div>
                  <h4 className="text-lg font-cw-bold text-uk-navy">Cumulative yield over 30 years</h4>
                  <p className="text-sm text-uk-slate">Green = profit zone after payback</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-uk-slate">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-uk-teal rounded" />
                    Cumulative yield
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-uk-slate/40 rounded" />
                    Investment £{systemInvestment.toLocaleString('en-GB')}
                  </span>
                </div>
              </div>

              {cumulativeChart && (
                <svg ref={chartSvgRef} viewBox={`0 0 ${cumulativeChart.W} ${cumulativeChart.H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0F766E" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.20" />
                      <stop offset="100%" stopColor="#0F766E" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  {/* Grid lines */}
                  {cumulativeChart.yLabels.map((label, i) => (
                    <g key={`y-${i}`}>
                      <line x1={cumulativeChart.PX} y1={label.y} x2={cumulativeChart.W - 20} y2={label.y} stroke="rgba(15,23,42,0.06)" strokeWidth="1" />
                      <text x={cumulativeChart.PX - 8} y={label.y + 4} textAnchor="end" fill="#64748B" fontSize="9" fontFamily="monospace">
                        £{(label.value / 1000).toFixed(0)}k
                      </text>
                    </g>
                  ))}

                  {/* X axis labels */}
                  {cumulativeChart.xLabels.map((label, i) => (
                    <text key={`x-${i}`} x={label.x} y={cumulativeChart.H - 5} textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="monospace">
                      yr {label.year}
                    </text>
                  ))}

                  {/* Investment line */}
                  <line
                    x1={cumulativeChart.PX} y1={cumulativeChart.investY}
                    x2={cumulativeChart.W - 20} y2={cumulativeChart.investY}
                    stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.8"
                  />
                  <text x={cumulativeChart.W - 18} y={cumulativeChart.investY - 6} textAnchor="end" fill="#64748B" fontSize="9" fontFamily="monospace">
                    Invest £{(systemInvestment / 1000).toFixed(2)}k
                  </text>

                  {/* Area fill */}
                  <path ref={areaPathRef} d={cumulativeChart.area} fill="url(#areaGradient)" />

                  {/* Main line */}
                  <path ref={chartPathRef} d={cumulativeChart.line} fill="none" stroke="url(#chartGradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                  {/* Payback point */}
                  <circle cx={cumulativeChart.pbX} cy={cumulativeChart.investY} r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                  <text x={cumulativeChart.pbX} y={cumulativeChart.investY - 14} textAnchor="middle" fill="#0F766E" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    ↑ yr {results.paybackYear.toFixed(1)}
                  </text>
                </svg>
              )}
            </div>

            {/* Chart 2: Price Comparison */}
            <div className="bg-white border border-uk-line rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                <div>
                  <h4 className="text-lg font-cw-bold text-uk-navy">Grid price vs. your solar cost</h4>
                  <p className="text-sm text-uk-slate">Widening gap = growing yearly savings</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-uk-slate">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-uk-slate/50 rounded" />
                    Grid (+ 3%/year)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-uk-emerald rounded" />
                    Solavita LCOE
                  </span>
                </div>
              </div>

              {priceChart && (
                <svg ref={priceSvgRef} viewBox={`0 0 ${priceChart.W} ${priceChart.H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="gapGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#94A3B8" stopOpacity="0.10" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>

                  {/* Grid */}
                  {priceChart.xLabels.map((label, i) => (
                    <g key={`px-${i}`}>
                      <line x1={label.x} y1={priceChart.PY} x2={label.x} y2={priceChart.H - 20} stroke="rgba(15,23,42,0.05)" strokeWidth="1" />
                      <text x={label.x} y={priceChart.H - 5} textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="monospace">
                        yr {label.year}
                      </text>
                    </g>
                  ))}

                  {/* Price labels Y */}
                  <text x={priceChart.PX - 8} y={priceChart.getY(electricityPrice) + 4} textAnchor="end" fill="#64748B" fontSize="9" fontFamily="monospace">£{electricityPrice.toFixed(2)}</text>
                  <text x={priceChart.PX - 8} y={priceChart.getY(results.lcoe) + 4} textAnchor="end" fill="#10B981" fontSize="9" fontFamily="monospace">£{results.lcoe.toFixed(3)}</text>

                  {/* Price line (slate/grey) */}
                  <path ref={pricePathRef} d={priceChart.priceLine} fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" opacity="0.9" />

                  {/* LCOE line (emerald) */}
                  <path ref={lcoePathRef} d={priceChart.lcoeLine} fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />

                  {/* Gap annotation */}
                  <text x={priceChart.W - 30} y={priceChart.getY(electricityPrice * Math.pow(1.03, 12))} textAnchor="end" fill="#64748B" fontSize="9">
                    Δ Your saving
                  </text>
                  <line
                    x1={priceChart.W - 25} y1={priceChart.getY(electricityPrice * Math.pow(1.03, 12)) + 5}
                    x2={priceChart.W - 25} y2={priceChart.getY(results.lcoe) - 5}
                    stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 2" opacity="0.5"
                  />
                </svg>
              )}
            </div>

            {/* Chart 3: IRR Comparison Bars */}
            <div className="bg-white border border-uk-line rounded-3xl p-6 md:p-8 shadow-sm">
              <h4 className="text-lg font-cw-bold text-uk-navy mb-2">Return comparison</h4>
              <p className="text-sm text-uk-slate mb-6">Annual return (IRR) of different asset classes</p>

              <div className="space-y-4">
                {/* Solar IRR */}
                <div className="group">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm text-uk-navy font-cw-bold flex items-center gap-2">
                      ☀️ Solavita solar system
                    </span>
                    <span className="text-sm font-cw-bold text-uk-teal-dark">{(results.irr * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-uk-teal-soft rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-uk-gradient transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min((results.irr * 100) / 35 * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Real Estate */}
                <div className="group">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm text-uk-slate flex items-center gap-2">
                      🏢 Property (UK average)
                    </span>
                    <span className="text-sm text-uk-slate">~5%</span>
                  </div>
                  <div className="h-3 bg-uk-line rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-uk-slate/40 transition-all duration-1000" style={{ width: `${5 / 35 * 100}%` }} />
                  </div>
                </div>

                {/* ETF */}
                <div className="group">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm text-uk-slate flex items-center gap-2">
                      📈 MSCI World ETF (historical)
                    </span>
                    <span className="text-sm text-uk-slate">~7%</span>
                  </div>
                  <div className="h-3 bg-uk-line rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-uk-slate/40 transition-all duration-1000" style={{ width: `${7 / 35 * 100}%` }} />
                  </div>
                </div>

                {/* Fixed Income */}
                <div className="group">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm text-uk-slate flex items-center gap-2">
                      🏦 Fixed deposit / Gilts
                    </span>
                    <span className="text-sm text-uk-slate">~3%</span>
                  </div>
                  <div className="h-3 bg-uk-line rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-uk-slate/40 transition-all duration-1000" style={{ width: `${3 / 35 * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-3xl p-6 md:p-8 text-center border border-uk-teal/30" style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.10) 0%, rgba(16,185,129,0.10) 100%)' }}>
              <p className="text-lg font-cw-bold text-uk-navy mb-2">
                Want a calculation based on your actual roof?
              </p>
              <p className="text-sm text-uk-slate mb-5">
                Our AI builds a fixed-price solar design in 15 minutes — accurate yield forecast and savings based on your real location.
              </p>
              <button onClick={openFormModal} className="btn-gradient px-8 py-4 rounded-full text-white font-cw-bold text-base shadow-lg shadow-uk-teal/20">
                Start AI design →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
