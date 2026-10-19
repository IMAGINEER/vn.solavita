'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ScanEye,
  FileText,
  Truck,
  Wrench,
  Wifi,
  ClipboardList,
  type LucideIcon,
} from 'lucide-react'

interface TimelineStep {
  day: string
  title: string
  desc: string
  Icon: LucideIcon
}

const timelineSteps: TimelineStep[] = [
  { day: 'Day 1', title: 'AI Design', desc: 'Drone survey + 3D model of your roof. Shading analysis. Accurate yield forecast in 15 minutes.', Icon: ScanEye },
  { day: 'Day 2-3', title: 'Contract', desc: 'Tailored proposal, digital contract signed online.', Icon: FileText },
  { day: 'Day 4-7', title: 'JIT Delivery', desc: 'Dispatched from our local warehouse. Every component checked and pre-commissioned.', Icon: Truck },
  { day: 'Day 8-10', title: 'Installation', desc: 'Two-day install by certified electricians. Tidy site guaranteed.', Icon: Wrench },
  { day: 'Day 11', title: 'Commissioning', desc: 'Meter setup, grid connection, HEMS activation. Your system is now generating.', Icon: Wifi },
  { day: 'Day 12-14', title: 'Grid Notification', desc: 'Utility receives your commissioning certificate. Grid approval secured so your system can export and earn credits.', Icon: ClipboardList },
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
    <section ref={sectionRef} id="delivery" className="py-20 md:py-24 bg-uk-teal-soft/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow - same pill style as the "Why Nigerian homeowners choose us" section */}
        <div className="text-center mb-12 md:mb-14 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
            <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
            Delivery Process
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            Your solar system in <span className="text-uk-teal">14 days</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular max-w-2xl mx-auto">
            While other providers take months, we deliver in two weeks - from first call to first kilowatt-hour.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - timeline rail + compact horizontal step cards */}
          <div ref={timelineRef} className="relative pl-8">
            {/* Rail: vertically trimmed so it terminates at the first/last dot
                centres instead of piercing them - dot circles sit on top. */}
            <div className="absolute left-3 top-10 bottom-10 w-0.5 bg-uk-line">
              <div ref={lineRef} className="w-full h-full bg-uk-gradient origin-top" />
            </div>

            <div className="space-y-4">
              {timelineSteps.map((step, i) => (
                <div key={i} className="timeline-step relative">
                  {/* Dot centred to the card's vertical midpoint so the rail
                      visually aligns with each step's middle. */}
                  <div className="absolute -left-[22px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-uk-teal flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-uk-teal" />
                  </div>

                  <div className="pl-6 p-4 rounded-xl bg-white border border-uk-line hover:border-uk-teal/40 hover:shadow-sm transition-all">
                    <div className="flex items-start gap-4">
                      {/* Left column: icon badge + (Day + Title) */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="w-10 h-10 rounded-lg bg-uk-teal-soft flex items-center justify-center text-uk-teal-dark">
                          <step.Icon className="w-5 h-5" strokeWidth={1.6} />
                        </div>
                        <div className="min-w-[88px]">
                          <span className="block text-xs text-uk-teal font-cw-bold leading-tight">
                            {step.day}
                          </span>
                          <h4 className="text-base font-cw-bold text-uk-navy leading-tight">
                            {step.title}
                          </h4>
                        </div>
                      </div>

                      {/* Right column: description */}
                      <p className="text-sm text-uk-slate font-cw-regular leading-relaxed flex-1 pt-1.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - drone/3D hero image + capability stats */}
          <div className="space-y-6">
            <div className="rounded-2xl overflow-hidden border border-uk-line">
              <img
                src="/images/drone-3d.webp"
                alt="Drone survey and 3D roof model used in Solavita design"
                className="w-full aspect-video object-cover"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'Nationwide', label: 'Local warehouse', sub: 'Multi-region coverage' },
                { value: 'JIT', label: 'Delivery system', sub: 'Just-in-Time' },
                { value: '100+', label: 'Certified installers', sub: 'In our partner network' },
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