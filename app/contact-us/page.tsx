'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContactHero from '@/components/contact/Hero'
import ContactMethods from '@/components/contact/ContactMethods'
import ContactForm from '@/components/contact/ContactForm'
import CTA from '@/components/solutions/CTA'

/**
 * /contact-us — Plain contact destination.
 *
 * Composition (per project brief):
 *   Hero → Contact Methods → Contact Form → CTA
 *
 * Reuses the user-info field set from the existing Consultation form
 * (salutation · first name · last name · email · phone · postal code ·
 * city) but deliberately OMITS the Solar Configuration fields — this
 * is a generic contact entry point, not a quote request. Submit
 * handler is a no-op for now; the form swaps to a success card inline
 * to demonstrate the full UI flow without leaking data.
 */
export default function ContactUsPage() {
  return (
    <main className="min-h-screen bg-[#F7F9FC]">
      <Header logoHref="/" />

      <ContactHero />

      <ContactMethods />

      <ContactForm />

      <CTA
        eyebrow="Looking for a quote?"
        title={
          <>
            Have a project in mind?
            <br />
            <span className="text-gradient">Start with a free design.</span>
          </>
        }
        description="If you are ready to explore a specific install, our team can put together a free, no-obligation design showing what solar, storage or a full home energy system would look like for your home."
      />

      <Footer variant="light" />
    </main>
  )
}
