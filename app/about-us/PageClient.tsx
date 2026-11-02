'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AboutHero from '@/components/about/Hero'
import WhoWeAre from '@/components/about/WhoWeAre'
import Mission from '@/components/about/Mission'
import Approach from '@/components/about/Approach'
import Technology from '@/components/about/Technology'
import GlobalPresence from '@/components/about/GlobalPresence'
import ContactMethods from '@/components/contact/ContactMethods'
import CTA from '@/components/solutions/CTA'

/**
 * /about-us - Solavita Nigeria brand & company page.
 *
 * Composition mirrors the UK /about-us page (`UK.solavita/app/about-us`):
 *   AboutHero → WhoWeAre → Mission → Approach → Technology →
 *   GlobalPresence → ContactMethods (clickable={false}) → CTA.
 *
 * All section copy uses `lib/data/about.ts` (NG TBDs) and
 * `lib/data/contact.tsx` (NG TBDs) — the UK trust marks, revenue
 * figures and UK-specific claims are NOT transferred per the NG content
 * strategy. When unverified facts land they fill the same data slots.
 *
 * The sections are kept as NG-specific components (already localized)
 * rather than being inlined.
 */
export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Header logoHref="/" />

      <AboutHero />

      <WhoWeAre />

      <Mission />

      <Approach />

      <Technology />

      <GlobalPresence />

      <ContactMethods clickable={false} />

      <CTA
        eyebrow="Ready when you are"
        title={
          <>
            See What Solavita Can Do{' '}
            <span className="text-gradient">for Your Home.</span>
          </>
        }
        description="Whether for your home or business, Solavita helps you find the right solar and battery storage solution for your energy needs. Tell us what you need, and our team will help you get started."
      />

      <Footer />
    </main>
  )
}