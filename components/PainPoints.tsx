'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronDown } from 'lucide-react'

const painPoints = [
  {
    id: 1,
    problem: 'Battery fires & safety risks',
    problemDetail: 'NMC batteries can suffer thermal runaway. Faulty systems have caused house fires across the UK.',
    solution: 'LiFePO4: Thermally non-flammable',
    solutionDetail: 'Lithium iron phosphate cannot physically undergo thermal runaway. Millisecond cell balancing prevents overload. Double surge protection built in from the factory.',
    icon: '🔥',
    solutionIcon: '🛡️',
  },
  {
    id: 2,
    problem: 'Inflated capacity & efficiency claims',
    problemDetail: 'Manufacturers advertise lab-tested figures. Reality is 20–30% less yield.',
    solution: 'Real 92% self-consumption, measured',
    solutionDetail: 'AI-optimised self-consumption control. 9,957 kWh/year from a 10kWp system, measured in the field. LCOE: £0.047/kWh. Transparent monitoring data in the app.',
    icon: '📉',
    solutionIcon: '📊',
  },
  {
    id: 3,
    problem: 'Months of waiting & site chaos',
    problemDetail: 'Established UK providers quote 6 weeks to 6 months. Install dates slip constantly.',
    solution: '2 weeks: From contract to power',
    solutionDetail: 'Just-in-time delivery from our 40,000 sq ft UK warehouse. Two-day installation by NICEIC-certified engineers. G99 grid application included.',
    icon: '⏳',
    solutionIcon: '⚡',
  },
  {
    id: 4,
    problem: 'Incompatible components',
    problemDetail: 'Different brands, different protocols. Integration fails more often than it works.',
    solution: 'One brand, zero compatibility issues',
    solutionDetail: 'PV modules, inverter, battery, mounting and HEMS: all developed in-house. SG Ready & EEBUS for heat pumps. OCPP for EV chargers.',
    icon: '🔌',
    solutionIcon: '🔗',
  },
  {
    id: 5,
    problem: 'Support hotlines that never answer',
    problemDetail: 'Many solar firms are start-ups without service infrastructure. Tickets go nowhere.',
    solution: '24/7 UK support with a national engineer network',
    solutionDetail: 'UK service team backed by 70+ years of European engineering heritage. AI fault detection automatically opens service tickets. On-site visits by qualified local engineers.',
    icon: '📵',
    solutionIcon: '🇬🇧',
  },
  {
    id: 6,
    problem: 'Hidden costs & inflated prices',
    problemDetail: '3–5 middlemen drive up the price. You pay the markup.',
    solution: 'Producer-direct pricing, no middlemen',
    solutionDetail: 'Producer-Direct-to-Consumer removes every intermediary. Same premium quality, up to 50% less. £12,999 for a complete 10kW / 10kWh system, fully installed.',
    icon: '💸',
    solutionIcon: '🏭',
  },
  {
    id: 7,
    problem: 'Upfront payment — then insolvency',
    problemDetail: 'Small solar firms go bust every year. Customer deposits vanish.',
    solution: '£10bn group: Your money is safe',
    solutionDetail: 'SKYWORTH Group: £10bn turnover, dual-listed (HK). 40+ years of corporate history. No start-up risk.',
    icon: '🏚️',
    solutionIcon: '🏦',
  },
  {
    id: 8,
    problem: 'Unrealistic self-sufficiency promises',
    problemDetail: '"90% self-sufficiency" ignores weather, shading and real consumption patterns.',
    solution: 'AI design based on your actual roof',
    solutionDetail: 'Drone survey + 3D model of your home. Hourly shading analysis. Yield forecast based on 20 years of Met Office data for your exact postcode.',
    icon: '🌥️',
    solutionIcon: '🤖',
  },
]

export default function PainPoints() {
  const sectionRef = useRef<HTMLElement>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      }
    )
  }, [])

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 relative bg-white">
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-15deg); }
          40% { transform: rotate(10deg); }
          60% { transform: rotate(-10deg); }
          80% { transform: rotate(5deg); }
        }
        @keyframes nod {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(8deg); }
          50% { transform: translateY(2px) rotate(-5deg); }
          75% { transform: translateY(-1px) rotate(3deg); }
        }
        .problem-group:hover .problem-icon {
          animation: shake 0.6s ease-in-out infinite;
        }
        .solution-group:hover .solution-icon {
          animation: nod 0.8s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-uk-teal-dark text-sm font-cw-bold uppercase tracking-wider">Market problems, solved</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-cw-bold text-uk-navy mt-4 mb-6">
            8 Problems. <span className="text-uk-teal">8 Solutions.</span>
          </h2>
          <p className="text-lg text-uk-slate font-cw-regular max-w-2xl mx-auto">
            The UK solar market has systemic weaknesses. Here's how Solavita solves every one of them.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {painPoints.map((point) => (
            <div
              key={point.id}
              onClick={() => setExpandedId(expandedId === point.id ? null : point.id)}
              className="rounded-2xl border border-uk-line overflow-hidden cursor-pointer hover:border-uk-teal/40 hover:shadow-md transition-all duration-300 bg-white"
            >
              <div className="p-6 flex items-start gap-4">
                <div className="flex-1 problem-group">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg problem-icon inline-block" style={{ transformOrigin: 'center' }}>{point.icon}</span>
                    <span className="text-xs font-cw-bold uppercase tracking-wider text-uk-slate">Problem</span>
                  </div>
                  <h4 className="text-sm font-cw-bold text-uk-navy">{point.problem}</h4>
                </div>

                <div className="flex items-center px-2 pt-2">
                  <span className="text-uk-line">→</span>
                </div>

                <div className="flex-1 solution-group">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg solution-icon inline-block" style={{ transformOrigin: 'center' }}>{point.solutionIcon}</span>
                    <span className="text-xs font-cw-bold uppercase tracking-wider text-uk-emerald">Solavita</span>
                  </div>
                  <h4 className="text-sm font-cw-bold text-uk-teal-dark">{point.solution}</h4>
                </div>

                <div className={`w-6 h-6 rounded-full bg-uk-teal-soft flex items-center justify-center transition-transform ${expandedId === point.id ? 'rotate-180' : ''}`}>
                  <ChevronDown className="w-3 h-3 text-uk-teal" strokeWidth={2} />
                </div>
              </div>

              <div className={`overflow-hidden transition-all duration-500 ${expandedId === point.id ? 'max-h-40' : 'max-h-0'}`}>
                <div className="px-6 pb-6 grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg border border-uk-line bg-uk-teal-soft/40">
                    <p className="text-xs text-uk-slate font-cw-regular">{point.problemDetail}</p>
                  </div>
                  <div className="p-3 rounded-lg border border-uk-emerald/30 bg-uk-emerald/5">
                    <p className="text-xs text-uk-slate font-cw-regular">{point.solutionDetail}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}