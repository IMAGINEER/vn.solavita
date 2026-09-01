'use client'

import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import ProductSelector from '@/components/ProductSelector'
import FreeDesignQuoteSection from '@/components/FreeDesignQuoteSection'
// import ArticlesSection from '@/components/ArticlesSection' // Knowledge Hub - hidden for now, kept for re-enable
import CasesSection from '@/components/CasesSection'
import TrustBar from '@/components/TrustBar'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'

import { activeCampaign, isCampaignActive } from '@/lib/campaigns/activeCampaign'
import { openFormModal } from '@/lib/form-modal'
import CampaignBody from './CampaignBody'

gsap.registerPlugin(ScrollTrigger)

/**
 * Page-level host that decides whether to apply the active campaign override.
 * When `activeCampaign` is null OR outside its date window, the default sections
 * render unchanged. When the campaign is active, HeroSection receives its
 * `override` prop and <CampaignBody /> is inserted between TrustBar and Footer.
 *
 * UK homepage composition (per the Figma-driven redesign):
 *   Header → HeroSection → ProductSelector → FreeDesignQuoteSection →
 *   ArticlesSection → CasesSection → TrustBar → (optional CampaignBody) →
 *   Footer
 *
 * The 5-step consultation form modal is now hosted by `Footer`, which is
 * shared by every page on the site. "Get Free Design & Quote" buttons in
 * HeroSection / FreeDesignQuoteSection / ProductSelector dispatch the
 * `openFormModal()` event bus, which the Footer-hosted modal listens for.
 * No per-page modal wiring needed.
 *
 * Components preserved on disk but not currently rendered:
 *   ProductDetails, BrandStory, PainPoints, DeliveryTimeline,
 *   PD2CSection, HEMSSection, ROICalculator, FloatingButtons,
 *   SupportSection (kept for a future dedicated /support page)
 */
export default function CampaignOverrides() {
  // Date window evaluated at construction so the first paint matches the active
  // campaign (no flash-of-default before hydration).
  const [active] = useState(() => isCampaignActive())
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf)
    }
  }, [])

  const heroOverride = active && activeCampaign?.hero ? activeCampaign.hero : undefined
  const formOverride =
    active && activeCampaign?.formSection ? activeCampaign.formSection : undefined
  const showCampaignBody = Boolean(formOverride?.showCampaignBody)

  return (
    <main className="relative">
      <Header />
      <HeroSection override={heroOverride} />
      <ProductSelector onOpenForm={openFormModal} />
      <FreeDesignQuoteSection onOpenForm={openFormModal} />
      {/* <ArticlesSection /> */} {/* Knowledge Hub - hidden for now */}
      <CasesSection />
      <TrustBar />
      {showCampaignBody ? <CampaignBody /> : null}
      <Footer />
      <FloatingButtons />
    </main>
  )
}