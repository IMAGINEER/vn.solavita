'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const features = [
  { icon: '☀️', title: 'PV-Optimierung', desc: 'MPPT-Tracking in Echtzeit, maximale Ernte' },
  { icon: '🔋', title: 'Speichermanagement', desc: 'Prädiktive Lade-/Entladezyklen' },
  { icon: '🚗', title: 'EV-Ladesteuerung', desc: 'PV-Überschussladen, OCPP-kompatibel' },
  { icon: '🌡️', title: 'Wärmepumpe', desc: 'SG Ready / EEBUS Protokoll' },
  { icon: '💰', title: 'Virtuelles Kraftwerk', desc: 'Dynamische Strompreisarbitrage' },
  { icon: '🛡️', title: 'Notstrom (USV)', desc: 'Unterbrechungsfreie Umschaltung' },
]

export default function HEMSSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const items = featuresRef.current?.children
    if (items) {
      gsap.fromTo(items, { y: 50, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: featuresRef.current, start: 'top 75%' }
      })
    }
  }, [])

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sv-blue/5 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sv-blue text-sm font-cw-bold uppercase tracking-wider">Intelligente Steuerung</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-cw-bold text-white mt-4 mb-6">
            Ein Gehirn für <span className="text-gradient">6 Systeme</span>
          </h2>
          <p className="text-lg text-white/50 font-cw-regular max-w-2xl mx-auto">
            Das HEMS (Home Energy Management System) orchestriert PV, Batterie, Wallbox, Wärmepumpe, Netz und Notstrom in einer einzigen App.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="max-w-[260px] mx-auto -mt-[70px]">
              <div className="relative rounded-[2.5rem] border-[6px] border-white/10 bg-sv-navy overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-sv-dark rounded-b-2xl z-10" />
                <img
                  src="/images/cloud-app-data.webp"
                  alt="Solavita HEMS App - Energie-Dashboard"
                  loading="lazy"
                  className="w-full h-auto"
                />
              </div>
            </div>
            <div className="absolute top-8 -right-4 sm:right-0 glass rounded-xl px-4 py-3 animate-float max-w-[200px]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-sv-green/20 flex items-center justify-center"><span className="text-sm">💰</span></div>
                <div>
                  <div className="text-[10px] font-cw-bold text-white">VPP-Erlös</div>
                  <div className="text-[9px] text-white/50">+€1,24 (neg. Preis)</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div ref={featuresRef} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {features.map((feature, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-sv-blue/30 transition-all duration-300 group">
                  <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">{feature.icon}</span>
                  <h4 className="text-xs font-cw-bold text-white mb-1">{feature.title}</h4>
                  <p className="text-[10px] text-white/40 font-cw-regular leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-sv-blue/5 border border-sv-blue/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-sv-blue/20 flex items-center justify-center flex-shrink-0"><span className="text-sm">⚖️</span></div>
                <div>
                  <h4 className="text-sm font-cw-bold text-white mb-1">§14a EnWG konform</h4>
                  <p className="text-xs text-white/50 font-cw-regular leading-relaxed">
                    Automatische Netzstützung am Verknüpfungspunkt. Intelligentes Gegenrechnen mit Speicher stellt sicher, dass Wärmepumpe und Wallbox stets mit voller Leistung laufen.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden group border border-white/10">
              <video
                src="https://www.solavita.com/Public/Uploads/uploadfile/files/20250815/wangyeshipin22.mp4"
                className="w-full aspect-video bg-sv-navy"
                controls
                preload="metadata"
                poster=""
              />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-cw-bold text-white">HEMS Live-Demo: Strompreisarbitrage</span>
                  <span className="text-xs text-white/50">1:42</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}