'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const tabs = [
  { id: 'module', label: 'PV Modules', icon: '☀️' },
  { id: 'inverter', label: 'Inverter', icon: '⚡' },
  { id: 'battery', label: 'Battery', icon: '🔋' },
  { id: 'mounting', label: 'Mounting', icon: '🏗️' },
]

const tabContent: Record<string, {
  title: string
  subtitle: string
  description: string
  specs: { label: string; value: string }[]
  highlights: string[]
  images: string[]
  pdfUrl?: string
}> = {
  module: {
    title: 'All-Black High-Performance Modules',
    subtitle: 'Bifacial n-Type Double-Glass Technology',
    description: 'Our all-black n-Type modules combine maximum aesthetics with the highest output. Bifacial double-glass technology delivers up to 10% additional yield through rear-side reflection, with industry-leading degradation of just 0.4%/year.',
    specs: [
      { label: 'Series', value: 'QM n-Type (All-Black 48-Cell)' },
      { label: 'Power range', value: '440-450 Wp' },
      { label: 'Cell type', value: 'n-Type monocrystalline' },
      { label: 'Efficiency', value: 'Up to 22.5%' },
      { label: 'Bifacial gain', value: 'Up to 10% (Bifaciality 80% ±5%)' },
      { label: 'Degradation', value: '≤1% (Year 1), then 0.4%/year' },
      { label: 'Product warranty', value: '15 years' },
      { label: 'Performance warranty', value: '30 years linear' },
      { label: 'Protection class', value: 'IP68' },
    ],
    highlights: [
      'All-black design - seamless roof integration with no visible cell gaps',
      'Double-glass construction for maximum durability and mechanical stability',
      'Excellent low-light behaviour under cloudy skies',
      'Optimised partial-shading tolerance for complex roof geometries',
      'PID-free over the full lifetime',
    ],
    images: [
      '/static/images/product-module-1.webp',
      '/static/images/product-module-2.webp',
      '/static/images/product-module-3.webp',
    ],
    pdfUrl: '/static/pdfs/QM210RTHCDH-440-450W-48-All-Black Solar Panels.pdf',
  },
  inverter: {
    title: 'Hybrid Inverter',
    subtitle: 'Three-Phase · High-Voltage · AI-Protected',
    description: 'The SWH HV-Series hybrid inverter combines PV conversion, battery management and backup power in one unit. AI-assisted AFCI 3.0 arc-fault detection and up to 160% PV oversizing for maximum safety and yield.',
    specs: [
      { label: 'Model range', value: 'SWH 6000H-015KH-T1-G2' },
      { label: 'Available power', value: '6 / 8 / 10 / 12 / 15 kW' },
      { label: 'Max. PV oversizing', value: 'Up to 160%' },
      { label: 'Asymmetric feed-in', value: 'Up to 150%' },
      { label: 'Safety system', value: 'AFCI 3.0 + DC/AC SPD Type II' },
      { label: 'Backup power', value: 'Yes, fully automatic' },
      { label: 'Grid connection', value: '3-phase 400V' },
      { label: 'Protection class', value: 'IP66' },
      { label: 'Operating temperature', value: '-35°C to +60°C' },
      { label: 'Communication', value: 'WiFi / Ethernet / RS485 / CAN' },
    ],
    highlights: [
      'AFCI 3.0 - AI-assisted active arc-fault detection in real time',
      'G98 / G100 compliant - fully grid-service ready',
      'SG Ready & EEBUS for heat-pump control',
      'Potential-free contacts for intelligent load control',
      'One-click grid-connection configuration & OTA updates',
    ],
    images: [
      '/static/images/product-inverter-1.webp',
      '/static/images/product-inverter-2.webp',
    ],
    pdfUrl: '/static/pdfs/SWH6-15kW-T1-G2 (HV).pdf',
  },
  battery: {
    title: 'LiFePO₄ High-Voltage Storage',
    subtitle: 'Safe · Long-Lasting · Modular Stackable',
    description: 'Our stackable high-voltage storage system based on lithium iron phosphate offers maximum safety with zero thermal-runaway risk. Millisecond-precise cell balancing prevents capacity loss. Expandable years after initial installation - old and new modules can be freely mixed.',
    specs: [
      { label: 'Chemistry', value: 'LiFePO₄ (Lithium iron phosphate)' },
      { label: 'Capacity per module', value: '5.12 kWh' },
      { label: 'System capacity', value: '5.12-20.48 kWh (modular)' },
      { label: 'System voltage', value: '102.4-409.6V DC (high voltage)' },
      { label: 'Cycle life', value: '> 6,000 cycles at 90% DoD' },
      { label: 'Round-trip efficiency', value: '> 96%' },
      { label: 'Expandable', value: 'Yes, modular stacking (old/new mixable)' },
      { label: 'Mounting', value: 'Floor (stackable) or wall-mounted' },
      { label: 'Connection', value: 'Plug & play connector' },
      { label: 'Protection class', value: 'IP66' },
      { label: 'Certifications', value: 'IEC 62619 / BS 7671 / UN38.3 / MCS-012' },
    ],
    highlights: [
      'No thermal runaway possible',
      'Millisecond cell balancing to prevent capacity drift',
      'Modular: 5 kWh blocks freely combinable, also retroactively',
      'Plug & play - installation time per module under 10 minutes',
      'Integrated BMS with 24/7 cloud monitoring & remote diagnostics',
      '15-year product warranty',
    ],
    images: [
      '/static/images/product-battery-1.webp',
      '/static/images/product-battery-2.webp',
    ],
    pdfUrl: '/static/pdfs/SWR5.12-H1-GS.pdf',
  },
  mounting: {
    title: 'Universal Mounting System',
    subtitle: 'Fast · Safe · Roof-Friendly',
    description: 'Our factory-engineered mounting system is optimised for all common UK roof types. No roof penetration on tile roofs - your roof integrity remains fully preserved.',
    specs: [
      { label: 'Compatible roof types', value: 'Tile / Slate / Trapezoidal metal / Flat' },
      { label: 'Material', value: 'Anodised aluminium + stainless steel A2' },
      { label: 'Wind load', value: 'Up to 2,400 Pa' },
      { label: 'Snow load', value: 'Up to 5,400 Pa' },
      { label: 'Module mounting', value: 'Clamp system, tool-optimised' },
      { label: 'Roof hooks', value: 'Height-adjustable, no tile cutting required' },
    ],
    highlights: [
      'No roof penetration - tiles are lifted, not drilled',
      'Tested to Eurocode for UK wind and snow load zones',
      'Compatible with all common module frames and frameless modules',
      'Black rails for visual unity with all-black modules',
      'Pre-assembled components - faster on-roof installation',
    ],
    images: [
      '/static/images/product-mounting-1.webp',
      '/static/images/product-mounting-2.webp',
      '/static/images/product-mounting-3.webp',
    ],
  },
}

export default function ProductDetails() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeTab, setActiveTab] = useState('module')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.details-header',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Tab switch animation
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      )
    }
  }, [activeTab])

  // Reset image index when tab changes
  useEffect(() => {
    setCurrentImageIndex(0)
  }, [activeTab])

  const content = tabContent[activeTab]
  const imageCount = content.images.length

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % imageCount)
    }, 4000)
    return () => clearInterval(interval)
  }, [activeTab, imageCount])

  return (
    <section ref={sectionRef} id="details" className="relative py-24 md:py-32 bg-sv-blue/10 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-sv-blue/3 blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="details-header text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <span className="w-2 h-2 rounded-full bg-sv-blue animate-pulse" />
            <span className="text-sm text-sv-gray-light font-cw-regular">Components in detail</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-cw-bold mb-6">
            Components in{' '}
            <span className="text-gradient">Detail</span>
          </h2>
          <p className="text-lg text-sv-gray-light font-cw-regular max-w-2xl mx-auto">
            Every component self-developed and manufactured - no third-party parts, no compatibility issues.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-cw-bold transition-all duration-300
                ${activeTab === tab.id
                  ? 'bg-sv-gradient text-white shadow-lg shadow-sv-blue/20'
                  : 'bg-white/5 text-sv-gray-light border border-white/10 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: Image Carousel */}
          <div className="space-y-4">
            {/* Carousel */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white/[0.03] border border-white/10 group">
              {/* Images */}
              {content.images.map((img, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    idx === currentImageIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${content.title} - image ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}

              {/* Gradient overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-sv-darker/90 to-transparent" />

              {/* Navigation arrows */}
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev - 1 + imageCount) % imageCount)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
              >
                <ChevronLeft className="w-5 h-5 text-white" strokeWidth={2} />
              </button>
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev + 1) % imageCount)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
              >
                <ChevronRight className="w-5 h-5 text-white" strokeWidth={2} />
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2">
              {content.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentImageIndex
                      ? 'bg-sv-gradient w-8'
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right: Specs & Features */}
          <div className="space-y-8">
            {/* Title */}
            <div>
              <h3 className="text-3xl font-cw-bold text-white mb-2">{content.title}</h3>
              <p className="text-lg text-gradient font-cw-bold">{content.subtitle}</p>
              <p className="text-sv-gray-light font-cw-regular mt-4 leading-relaxed">
                {content.description}
              </p>
            </div>

            {/* Specs Table */}
            <div className="space-y-0">
              <h4 className="text-sm font-cw-bold text-sv-gray uppercase tracking-wider mb-4">
                Technical Specifications
              </h4>
              <div className="rounded-xl overflow-hidden border border-white/10">
                {content.specs.map((spec, idx) => (
                  <div
                    key={idx}
                    className={`flex justify-between items-center px-5 py-3 ${
                      idx % 2 === 0 ? 'bg-white/[0.02]' : 'bg-white/[0.05]'
                    }`}
                  >
                    <span className="text-sm text-sv-gray-light font-cw-regular">{spec.label}</span>
                    <span className="text-sm text-white font-cw-bold text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div>
              <h4 className="text-sm font-cw-bold text-sv-gray uppercase tracking-wider mb-4">
                Highlights
              </h4>
              <ul className="space-y-3">
                {content.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-sv-gradient flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-sv-gray-light font-cw-regular">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}