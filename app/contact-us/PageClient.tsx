'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContactHero from '@/components/contact/Hero'
import ContactMethods from '@/components/contact/ContactMethods'
import ContactForm from '@/components/contact/ContactForm'
import CTA from '@/components/solutions/CTA'

/**
 * /contact-us - Solavita Nigeria contact destination.
 *
 * Composition mirrors the original UK v1 page (`UK.solavita/app/contact-us`):
 *   Header → Hero → Contact Methods → Contact Form → CTA → Footer
 *
 * The four section components used here are NG-localised:
 *   - components/contact/Hero           "Speak with our Nigerian team"
 *                                        uses /images/hero-contact.webp.
 *   - components/contact/ContactMethods ng@solavita.com, NG channels with
 *                                        clipboard fallback + toast.
 *   - components/contact/ContactForm    +234 phone placeholder, Lagos
 *                                        city placeholder, NDPR consent,
 *                                        Nigerian-team success copy.
 *                                        Submits to /api/contact.
 *   - components/solutions/CTA          opens the NG consultation modal
 *                                        via the shared `openFormModal()`
 *                                        event bus.
 *
 * Form behaviour: posts JSON to /api/contact, which writes to the
 * `ng_contact_leads` table and fires both the customer-confirmation
 * and team-notification emails. On 2xx the form swaps to an inline
 * success card; on non-2xx it shows a readable error and keeps the
 * values.
 */
export default function ContactUsPage() {
  return (
    <main className="min-h-screen bg-sv-light dark:bg-sv-darker">
      <Header logoHref="/" />

      <ContactHero />

      <ContactMethods />

      <ContactForm />

      <CTA
        eyebrow="Ready when you are"
        title={
          <>
            Have a Project in Mind?
            <br />
            <span className="text-gradient">Start with a Free Quote.</span>
          </>
        }
        description="Tell us what you want to power — our Nigerian team will put together a free, no-obligation design showing what solar, storage or a full home energy system would look like for your home or business."
      />

      <Footer />
    </main>
  )
}
