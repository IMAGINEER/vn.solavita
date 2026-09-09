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
 * /about-us - Solavita brand & company page.
 *
 * Composition (per project brief):
 *   Hero → Who We Are → Our Mission → Our Approach / Why Solavita →
 *   Technology / Expertise → Global Presence → Contact methods (info only) → CTA
 *
 * Per the brief the page must NOT read like a corporate brochure. We
 * keep the same teal/emerald soft surfaces + section badges as the
 * rest of the site, but the copy and structure tell a story (heritage →
 * mission → how we work → proof of engineering → where we operate →
 * how to reach us) rather than listing capabilities.
 *
 * ContactMethods is rendered with `clickable={false}` — on /about-us the
 * cards are informational, no mailto:/tel:/maps links open from them.
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
            See what Solavita can do{' '}
            <span className="text-gradient">for your home.</span>
          </>
        }
        description="Two-week installation. 10-year warranty. UK-based service team for life. Start with a free, no-obligation design & quote."
      />

      <Footer />
    </main>
  )
}