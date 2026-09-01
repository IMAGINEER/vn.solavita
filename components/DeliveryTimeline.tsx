'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const timelineSteps = [
  { day: 'Day 1', title: 'AI Design', desc: 'Drone survey + 3D model of your roof. Shading analysis. Accurate yield forecast in 15 minutes.', icon: '🤖' },
  { day: 'Day 2-3', title: 'Contract', desc: 'Tailored proposal, digital contract signed online.', icon: '📝' },
  { day: 'Day 4-7', title: 'JIT Delivery', desc: 'Dispatched from our 40,000 sq ft UK warehouse. Every component checked and pre-commissioned.', icon: '🚚' },
  { day: 'Day 8-10', title: 'Installation', desc: 'Two-day install by NICEIC-certified electricians. Tidy site guaranteed.', icon: '🔧' },
  { day: 'Day 11', title: 'Commissioning', desc: 'Meter setup, grid connection, HEMS activation. Your system is now generating.', icon: '📶' },
  { day: 'Day 12-14', title: 'G98/G99 Notification', desc: 'DNOs receive your commissioning certificate at the click of a button. Secures full Smart Export Guarantee (SEG) eligibility.', icon: '📋' },
]

export default function DeliveryTimeline() {
  const sectionRef = useRef<HTMLElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    if (lineRef.current) {
      gsap.fromTo(lineRef.current, { scaleY: 0 }, {
        scaleY: 1,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: timelineRef.current, start: 'top 70%', end: 'bottom 70%', scrub: 1 },
      })
    }

    const steps = timelineRef.current?.querySelectorAll('.timeline-step')
    if (steps) {
      gsap.fromTo(steps, { x: -50, opacity: 0 }, {
        x: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: timelineRef.current, start: 'top 70%' },
      })
    }
  }, [])

  return (
    <section ref={sectionRef} id="delivery" className="py-24 lg:py-32 bg-uk-teal-soft/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-uk-emerald text-sm font-cw-bold uppercase tracking-wider">Delivery Process</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-cw-bold text-uk-navy mt-4 mb-6">
            Your solar system in <span className="text-uk-teal">14 days</span>
          </h2>
          <p className="text-lg text-uk-slate font-cw-regular max-w-2xl mx-auto">
            While other providers take months, we deliver in two weeks - from first call to first kilowatt-hour.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div ref={timelineRef} className="relative pl-8">
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-uk-line">
              <div ref={lineRef} className="w-full h-full bg-uk-gradient origin-top" />
            </div>

            <div className="space-y-8">
              {timelineSteps.map((step, i) => (
                <div key={i} className="timeline-step relative">
                  <div className="absolute -left-[22px] top-2 w-4 h-4 rounded-full bg-white border-2 border-uk-teal flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-uk-teal" />
                  </div>

                  <div className="pl-6 p-5 rounded-xl bg-white border border-uk-line hover:border-uk-teal/40 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl">{step.icon}</span>
                      <div>
                        <span className="text-xs text-uk-teal font-cw-bold">{step.day}</span>
                        <h4 className="text-base font-cw-bold text-uk-navy">{step.title}</h4>
                      </div>
                    </div>
                    <p className="text-sm text-uk-slate font-cw-regular leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-2xl overflow-hidden border border-uk-line">
              <img src="/static/images/case-placeholder.webp" alt="Two-week installation" className="w-full aspect-video object-cover" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '40,000 sq ft', label: 'UK warehouse', sub: 'Multi-region coverage' },
                { value: 'JIT', label: 'Delivery system', sub: 'Just-in-Time' },
                { value: '100+', label: 'NICEIC installers', sub: 'In our partner network' },
                { value: '2 days', label: 'Install time', sub: 'Standard installation' },
              ].map((fact, i) => (
                <div key={i} className="p-4 rounded-xl border border-uk-line bg-white text-center">
                  <div className="text-xl font-cw-bold text-uk-teal">{fact.value}</div>
                  <div className="text-xs text-uk-navy font-cw-bold mt-1">{fact.label}</div>
                  <div className="text-[10px] text-uk-slate font-cw-regular">{fact.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}