'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function PD2CSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 80, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden pd2c-card border-y border-white/5 bg-sv-blue/10">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-3xl sm:text-4xl font-cw-bold text-white mb-2"><span className="text-gradient">Warum wir günstiger sind</span></h3>
        <p className="text-sm text-sv-gray-light font-cw-regular">
          Wir bauen es. Wir liefern es. Wir installieren es. Kein Aufschlag dazwischen.
        </p>
      </div>

      {/* Comparison - horizontal cards */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
        {/* TRADITIONELL Card */}
        <div className="flex-1 w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-cw-bold" style={{ background: 'rgba(47,128,237,0.08)', border: '1px solid rgba(47,128,237,0.12)', color: '#2F80ED' }}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              TRADITIONELL
            </span>
          </div>
          <div className="flex items-center justify-center gap-1">
            {[
              { name: 'Hersteller', svg: '<svg width="24" height="24" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 50H52" stroke="#2F80ED" stroke-width="2.5" stroke-linecap="round"/><path d="M16 50V18H28V30L38 24V30L48 24V50" stroke="#2F80ED" stroke-width="2.5" stroke-linejoin="round"/><path d="M22 44H26" stroke="#2F80ED" stroke-width="2.5" stroke-linecap="round"/><path d="M32 44H36" stroke="#2F80ED" stroke-width="2.5" stroke-linecap="round"/><path d="M42 44H46" stroke="#2F80ED" stroke-width="2.5" stroke-linecap="round"/></svg>' },
              { name: 'Großhändler', svg: '<svg width="24" height="24" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 18H46L50 26H14L18 18Z" stroke="#2F80ED" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 18L16 26" stroke="#2F80ED" stroke-width="2.5" stroke-linecap="round"/><path d="M26 18L25 26" stroke="#2F80ED" stroke-width="2.5" stroke-linecap="round"/><path d="M32 18V26" stroke="#2F80ED" stroke-width="2.5" stroke-linecap="round"/><path d="M38 18L39 26" stroke="#2F80ED" stroke-width="2.5" stroke-linecap="round"/><path d="M46 18L48 26" stroke="#2F80ED" stroke-width="2.5" stroke-linecap="round"/><path d="M18 26V48H46V26" stroke="#2F80ED" stroke-width="2.5" stroke-linejoin="round"/><path d="M28 48V36H36V48" stroke="#2F80ED" stroke-width="2.5" stroke-linejoin="round"/></svg>' },
              { name: 'Installateur', svg: '<svg width="24" height="24" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.32 44.31a4.5 4.5 0 0 0 6.36 6.36L34.44 35.91l-6.36-6.36Z" fill="#2F80ED"/><polygon points="50.2 16.96 56.63 13.63 60 7.13 56.86 3.99 50.36 7.36 47.03 13.78 39.21 21.61 42.38 24.79 50.2 16.96" fill="#2F80ED"/><path d="M51.61 34 51 34a8.9 8.9 0 0 0-3.11.58L29.45 16.09A8.9 8.9 0 0 0 30 13l-.06-.6A8.9 8.9 0 0 0 17.19 4.89l6 6a3 3 0 0 1 .68 1.08A3 3 0 0 1 21 16a2.92 2.92 0 0 1-1-.21 3.15 3.15 0 0 1-1.08-.67l-6-6a8.9 8.9 0 0 0 7.49 12.78L21 22a8.9 8.9 0 0 0 3.11-.58L42.6 39.84A8.9 8.9 0 0 0 42 43l.06.6A9 9 0 0 0 51 51.94a8.72 8.72 0 0 0 3.85-.9l-6-6A3.08 3.08 0 0 1 48.21 44 3 3 0 0 1 51 40a2.92 2.92 0 0 1 1 .21 2.72 2.72 0 0 1 1.08.67l6 6A8.9 8.9 0 0 0 51.61 34Z" stroke="#2F80ED" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
              { name: 'Subunternehmer', svg: '<svg width="24" height="24" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="20" r="8" stroke="#2F80ED" stroke-width="2.5"/><path d="M22 20H42" stroke="#2F80ED" stroke-width="2.5" stroke-linecap="round"/><path d="M24 16C26 11 30 9 32 9C34 9 38 11 40 16" stroke="#2F80ED" stroke-width="2.5" stroke-linecap="round"/><path d="M20 50V38C20 33 25 30 32 30C39 30 44 33 44 38V50" stroke="#2F80ED" stroke-width="2.5" stroke-linejoin="round"/><path d="M26 40H38" stroke="#2F80ED" stroke-width="2.5" stroke-linecap="round"/></svg>' },
              { name: 'Kunde', svg: '<svg width="24" height="24" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="22" r="9" stroke="#2F80ED" stroke-width="2.5"/><path d="M18 50C18 41 24 36 32 36C40 36 46 41 46 50" stroke="#2F80ED" stroke-width="2.5" stroke-linecap="round"/></svg>' },
            ].map((step, i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-white border border-gray-200">
                    <span dangerouslySetInnerHTML={{ __html: step.svg }} />
                  </div>
                  <span className="text-xs text-gray-400 mt-1 whitespace-nowrap">{step.name}</span>
                </div>
                {i < 4 && (
                  <svg className="w-3 h-3 text-[#2F80ED]/40 mx-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-cw-bold" style={{ background: 'rgba(47,128,237,0.08)', border: '1px solid rgba(47,128,237,0.12)', color: '#2F80ED' }}>
              +80-150% Aufschlag
            </span>
          </div>
        </div>

        {/* VS Divider */}
        <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 pd2c-vs-badge" style={{ background: 'linear-gradient(135deg, #2F80ED, #22C55E)' }}>
          <span className="text-sm font-cw-bold text-white">VS</span>
        </div>

        {/* SOLAVITA PD2C Card */}
        <div className="flex-1 w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-cw-bold" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.12)', color: '#22C55E' }}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              SOLAVITA PD2C
            </span>
          </div>
          <div className="flex items-center justify-center gap-6">
            {[
              { name: 'Solavita Lager', svg: '<svg width="36" height="36" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 28L32 14L50 28V50H14V28Z" stroke="#22C55E" stroke-width="2.5" stroke-linejoin="round"/><path d="M24 50V38H40V50" stroke="#22C55E" stroke-width="2.5"/><path d="M22 30H42" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round"/></svg>' },
              { name: 'Sie', svg: '<svg width="36" height="36" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 30L32 14L50 30V50H14V30Z" stroke="#22C55E" stroke-width="2.5" stroke-linejoin="round"/><circle cx="32" cy="34" r="6" stroke="#22C55E" stroke-width="2.5"/><path d="M22 50C22 42 27 38 32 38C37 38 42 42 42 50" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round"/></svg>' },
            ].map((step, i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-white border border-gray-200">
                    <span dangerouslySetInnerHTML={{ __html: step.svg }} />
                  </div>
                  <span className="text-sm text-gray-400 mt-1">{step.name}</span>
                </div>
                {i === 0 && (
                  <svg className="w-4 h-4 text-[#22C55E]/40 mx-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-cw-bold" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.12)', color: '#22C55E' }}>
              Bis zu 50% günstiger
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}