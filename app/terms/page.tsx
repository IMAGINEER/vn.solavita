'use client'

import { motion } from 'motion/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'

export default function TermsPage() {
  const handleBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back()
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F9FC]">
      <Header showBackButton={true} onBack={handleBack} logoHref="/" />

      <section className="pt-24 pb-8 lg:pt-32 lg:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Terms of Use' },
            ]}
          />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-3xl lg:text-4xl font-cw-bold text-[#0A1628] mt-6 mb-2"
          >
            Terms of Use
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="text-sm text-[#4A5568] mb-4"
          >
            of Solavita UK Ltd · Last updated: August 2026
          </motion.p>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            className="h-1 bg-gradient-to-r from-[#0F766E] to-[#10B981] rounded"
          />
        </div>
      </section>

      <section className="py-8 lg:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-6">
                These Terms of Use govern your use of the Solavita UK website and any related
                services offered by Solavita UK Ltd ("Solavita", "we", "us"). By accessing or using
                our website, you agree to be bound by these Terms. If you do not agree, please do
                not use our website.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">1 About us</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Solavita UK Ltd is a company registered in England and Wales (Company No. [TBC]).
                Solavita UK Ltd is a wholly-owned subsidiary of the SKYWORTH Group.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">2 Use of this website</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                You may use this website for personal, non-commercial information about our solar
                and storage products and to request quotes. You must not misuse the website, attempt
                to gain unauthorised access, or use it to send unsolicited communications.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">3 Quotes, contracts and the Consumer Contracts Regulations 2013</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Submitting an enquiry through our website does not create a contract. A contract is
                formed only when we accept your order and confirm it in writing. We will provide you
                with the information required by the Consumer Contracts (Information, Cancellation and
                Additional Charges) Regulations 2013 before any contract is formed.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Consumers have a statutory right to cancel most distance contracts within 14 days.
                We will provide full cancellation instructions with your order confirmation.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">4 Pricing and VAT</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                All prices displayed on this website are in pounds sterling (GBP) and include VAT at
                0% for qualifying residential solar and battery installations under HMRC Notice 708/6.
                Where VAT applies at the standard rate, this is shown clearly before you place an order.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">5 Warranties and consumer rights</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Nothing in these Terms affects your statutory rights under the Consumer Rights Act 2015.
                Product-specific warranties (typically 10-15 years on panels, 10 years on inverters, and
                10-15 years on batteries) are provided by the manufacturer and detailed in your order
                confirmation.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">6 Intellectual property</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                All content on this website - including text, graphics, logos, images and software -
                is the property of Solavita UK Ltd, the SKYWORTH Group or our licensors, and is
                protected by UK and international copyright laws.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">7 Limitation of liability</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                To the extent permitted by law, we exclude all liability for any indirect or
                consequential losses. Nothing in these Terms limits our liability for death or
                personal injury caused by our negligence, fraud, or any liability that cannot be
                excluded under English law.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">8 Governing law and jurisdiction</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                These Terms are governed by the laws of England and Wales. The courts of England and
                Wales have exclusive jurisdiction, except that consumers resident in Scotland or
                Northern Ireland may also bring proceedings in their local courts.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">9 Contact</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Questions about these Terms? Email us at <a href="mailto:uk@solavita.com" className="text-[#0F766E] hover:underline">uk@solavita.com</a>.
              </p>
            </div>

            <div className="pt-6 mt-8 border-t border-[rgba(10,22,40,0.1)]">
              <p className="text-xs text-[#9CA3AF]">
                Last updated: August 2026 · Solavita UK Ltd (registered in England and Wales)
              </p>
              <p className="text-xs text-[#9CA3AF] mt-2">
                This is a placeholder document for development purposes. Production-grade legal review
                is the responsibility of the operator before going live.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer variant="light" />
    </main>
  )
}