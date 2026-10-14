'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const stats = [
  { value: '10+', unit: 'Years', label: 'Of solar expertise for Nigerian homes' },
  { value: '5,000+', unit: 'Nigerian homes', label: 'Powered by Solavita systems' },
  { value: '70+', unit: 'Years', label: 'Of engineering heritage in Europe' },
  { value: '£7.7bn', unit: 'Group', label: 'Backed by the SKYWORTH Group' },
]

export default function BrandStory() {
  const sectionRef = useRef<HTMLElement>(null)
  const countersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    gsap.fromTo(sectionRef.current, { opacity: 0 }, {
      opacity: 1, duration: 1,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
    })

    const counters = countersRef.current?.querySelectorAll('.stat-value')
    if (counters) {
      gsap.fromTo(counters, { scale: 0.5, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.7)',
        scrollTrigger: { trigger: countersRef.current, start: 'top 75%' }
      })
    }
  }, [])

  return (
    <section ref={sectionRef} id="about" className="py-24 lg:py-32 relative overflow-hidden bg-white">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-uk-teal-soft/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-uk-emerald/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-uk-teal-dark text-sm font-cw-bold uppercase tracking-wider">About Solavita</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-cw-bold text-uk-navy mt-4 mb-6">
            <span className="text-uk-teal">Global Heritage.</span> Built for Nigeria.
          </h2>
          <p className="text-lg text-uk-slate font-cw-regular max-w-3xl mx-auto">
            Solavita is the Nigerian residential solar brand of the SKYWORTH Group - one of the world's largest electronics manufacturers.
            Premium engineering from a £7.7bn group, designed specifically for Nigerian homes.
          </p>
        </div>

        <div ref={countersRef} className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className="text-center p-6 rounded-2xl border border-uk-line bg-white shadow-sm">
              <div className="stat-value">
                <span className="text-3xl sm:text-4xl font-cw-bold text-uk-teal counter-number">{stat.value}</span>
                <span className="text-lg font-cw-bold text-uk-slate ml-1">{stat.unit}</span>
              </div>
              <p className="text-sm text-uk-slate font-cw-regular mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div className="p-8 rounded-3xl border border-uk-line bg-white shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-uk-teal-soft flex items-center justify-center overflow-hidden p-1">
                <img src="/images/a1logo02.svg" alt="Solavita" loading="lazy" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-lg font-cw-bold text-uk-navy">Nigeria-First Engineering</h3>
                <p className="text-xs text-uk-slate">Designed for Nigerian homes</p>
              </div>
            </div>
            <p className="text-sm text-uk-slate font-cw-regular leading-relaxed mb-4">
              Every Solavita system is engineered for Nigerian conditions — safe, factory-matched components and smart energy management designed around the realities of grid power and fuel costs.
              Our Nigeria-based service team is on hand for the lifetime of your system.
            </p>
            <div className="rounded-xl overflow-hidden border border-uk-line bg-uk-teal-soft">
              <img src="/images/hero-placeholder.webp" alt="Nigerian home with solar panels" loading="lazy" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="p-8 rounded-3xl border border-uk-line bg-white shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-uk-teal-soft flex items-center justify-center overflow-hidden p-1">
                <img src="/images/LOGOlan.svg" alt="SKYWORTH" loading="lazy" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-lg font-cw-bold text-uk-navy uppercase">SKYWORTH Global</h3>
                <p className="text-xs text-uk-slate">Your partner for decades</p>
              </div>
            </div>
            <p className="text-sm text-uk-slate font-cw-regular leading-relaxed mb-4">
              The SKYWORTH Group is a publicly listed global corporation with over 40,000 employees.
              Already serving 4 million households worldwide with TVs, appliances and smart-home systems,
              SKYWORTH now brings the same engineering quality and supply-chain scale to Nigerian residential solar.
            </p>
            <div className="rounded-xl overflow-hidden border border-uk-line bg-uk-teal-soft">
              <img src="/images/case-placeholder.webp" alt="SKYWORTH global reach" loading="lazy" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}