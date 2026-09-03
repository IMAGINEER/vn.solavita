'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HEMSHero from '@/components/hems/Hero'
import FeaturesGrid from '@/components/hems/FeaturesGrid'
import PhoneShowcase from '@/components/hems/PhoneShowcase'
import CTA from '@/components/solutions/CTA'

/**
 * /hems - Solavita HEMS App landing page (light theme).
 *
 * Composition:
 *   Hero (light, banner-style) →
 *   FeaturesGrid (heading → full-width demo video → 6 capability cards) →
 *   PhoneShowcase ("Solavita HEMS App" + phone centered + download CTAs) →
 *   Bottom CTA (re-used from /solutions for visual consistency)
 */
export default function HemsPage() {
  return (
    <main className="min-h-screen bg-[#F7F9FC]">
      <Header logoHref="/" />

      <HEMSHero />
      <FeaturesGrid />
      <PhoneShowcase />

      <CTA
        eyebrow="Free design · No obligation"
        title={
          <>
            See the HEMS on your home.
            <br />
            <span className="text-gradient">Get a free design & quote.</span>
          </>
        }
        description="Tell us about your home. Our UK engineers will design the right HEMS-managed system - solar, battery, EV charger and heat pump - and send you a clear, no-obligation quote."
        secondaryLabel="Talk to our team"
        secondaryHref="mailto:uk@solavita.com"
      />

      <Footer variant="light" />
    </main>
  )
}