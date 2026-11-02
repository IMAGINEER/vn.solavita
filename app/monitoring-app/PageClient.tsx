'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MonitoringAppHero from '@/components/monitoring-app/Hero'
import FeaturesGrid from '@/components/monitoring-app/FeaturesGrid'
import PhoneShowcase from '@/components/monitoring-app/PhoneShowcase'
import CTA from '@/components/solutions/CTA'

/**
 * /monitoring-app - Solavita Monitoring App landing page (light theme).
 *
 * Composition:
 *   Hero (light, banner-style) →
 *   FeaturesGrid (heading → full-width demo video → 6 capability cards) →
 *   PhoneShowcase ("Solavita Monitoring App" + phone centered + download
 *   CTAs) →
 *   Bottom CTA (re-used from /solutions for visual consistency)
 *
 * The old `/hems` URL permanently redirects here (see next.config.js).
 */
export default function MonitoringAppPage() {
  return (
    <main className="min-h-screen">
      <Header logoHref="/" />

      <MonitoringAppHero />
      <FeaturesGrid />
      <PhoneShowcase />

      <CTA
        eyebrow="Free design · No obligation"
        title={
          <>
            See the Monitoring App on Your Home.
            <br />
            <span className="text-gradient">Get a Free Design &amp; Quote.</span>
          </>
        }
        description="Tell us about your home. Our Nigerian team will design the right Monitoring App-managed system - solar, battery and backup power - and send you a clear, no-obligation quote."
        secondaryLabel="Talk to our team"
        secondaryHref="mailto:ng@solavita.com"
      />

      <Footer />
    </main>
  )
}