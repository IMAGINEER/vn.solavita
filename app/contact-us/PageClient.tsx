'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContactHero from '@/components/contact/Hero'
import ContactMethods from '@/components/contact/ContactMethods'
import ContactForm from '@/components/contact/ContactForm'
import CTA from '@/components/solutions/CTA'

/**
 * /contact-us - Solavita Việt Nam contact destination.
 *
 * Composition mirrors the original UK v1 page (`UK.solavita/app/contact-us`):
 *   Header → Hero → Contact Methods → Contact Form → CTA → Footer
 *
 * The four section components used here are VN-localised:
 *   - components/contact/Hero           "Trao đổi trực tiếp với đội ngũ
 *                                        Solavita Việt Nam", uses
 *                                        /images/hero-contact.webp.
 *   - components/contact/ContactMethods vn@solavita.com, VN channels with
 *                                        clipboard fallback + toast.
 *   - components/contact/ContactForm    +84 phone placeholder, Hà Nội
 *                                        city placeholder, consent copy,
 *                                        Vietnamese-team success copy.
 *                                        Submits to /api/contact.
 *   - components/solutions/CTA          opens the VN consultation modal
 *                                        via the shared `openFormModal()`
 *                                        event bus.
 *
 * Form behaviour: posts JSON to /api/contact, which writes to the
 * `vn_contact_leads` table and fires both the customer-confirmation
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
        eyebrow="Sẵn sàng khi bạn cần"
        title={
          <>
            Bạn đang có dự án trong đầu?
            <br />
            <span className="text-gradient">Bắt đầu với báo giá miễn phí.</span>
          </>
        }
        description="Hãy cho chúng tôi biết bạn muốn cấp điện cho điều gì — đội ngũ Solavita Việt Nam sẽ thiết kế miễn phí, không ràng buộc, để bạn thấy hệ thống điện mặt trời, lưu trữ hoặc trọn bộ nguồn điện cho gia đình hay doanh nghiệp của mình sẽ như thế nào."
      />

      <Footer />
    </main>
  )
}
