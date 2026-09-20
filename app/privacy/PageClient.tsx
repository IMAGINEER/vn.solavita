'use client'

import { motion } from 'motion/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'

export default function PrivacyPage() {
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
              { label: 'Privacy Policy' },
            ]}
          />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-3xl lg:text-4xl font-cw-bold text-[#0A1628] mt-6 mb-2"
          >
            Privacy Policy
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="text-sm text-[#4A5568] mb-4"
          >
            Solavita Energy UK Limited · Last updated: August 2026
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
                Solavita Energy UK Limited ("we", "us", "our") is committed to protecting your privacy. This
                Privacy Policy explains how we collect, use, disclose and safeguard your personal
                data in accordance with the UK General Data Protection Regulation (UK GDPR) and the
                Data Protection Act 2018.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">1 Who we are</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                The data controller is Solavita Energy UK Limited (Company No. 17466951,
                registered in England and Wales). Our registered office is C/O Buzzacott LLP,
                130 Wood Street, London EC2V 6DL, United Kingdom.
                For any data protection queries, email <a href="mailto:uk@solavita.com" className="text-[#0F766E] hover:underline">uk@solavita.com</a>.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">2 Information we collect</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                When you submit an enquiry or sign a contract with us, we collect:
              </p>
              <ul className="list-disc pl-6 text-sm text-[#4A5568] leading-relaxed mb-3 space-y-1">
                <li>Identity data: name, salutation</li>
                <li>Contact data: address, email, phone</li>
                <li>Property data: house type, roof type, household size, electricity usage</li>
                <li>Survey data: roof imagery and shading analysis (if you book a survey)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">3 How we use your data</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                We use your personal data to:
              </p>
              <ul className="list-disc pl-6 text-sm text-[#4A5568] leading-relaxed mb-3 space-y-1">
                <li>Prepare and deliver your bespoke solar proposal</li>
                <li>Communicate with you about your enquiry and any contract you enter</li>
                <li>Comply with our legal obligations (e.g. MCS / SEG registration)</li>
                <li>Improve our services and website</li>
              </ul>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                We do not sell your data to third parties. We do not use your data for automated
                decision-making that produces legal effects.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">4 Legal basis</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                We process your data under the following UK GDPR bases: performance of a contract
                (Art. 6(1)(b)), compliance with legal obligations (Art. 6(1)(c)) and our legitimate
                interests in running and improving our business (Art. 6(1)(f)).
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">5 Sharing your data</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                We share your data only with carefully selected processors who help us deliver our
                service: cloud hosting and database storage (Supabase, EU region) and email delivery
                (Resend, Inc., United States — see section 6 on international transfers). Each
                processor is bound by a UK GDPR-compliant data processing agreement.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Where an installation is allocated to a Solavita-certified installer, we share the
                contact and property details needed to deliver your installation with that installer
                under a separate contract between you and the installer. Solavita remains your point
                of contact and the data controller for that information.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">6 International transfers</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Some of our processors are located outside the UK. Email delivery is provided by
                Resend, Inc. (United States). Cloud hosting and database storage are provided by
                Supabase (EU region). For any transfer of personal data outside the UK, we rely on
                UK-approved transfer mechanisms such as International Data Transfer Agreements or
                adequacy regulations in force at the time, and we carry out a transfer risk
                assessment for each destination.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">7 Retention</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                We keep enquiry data for up to 24 months and contract-related data for up to 7
                years to comply with HMRC, MCS and consumer law requirements.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">8 Your rights</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                You have the right to access, correct, delete, restrict or object to the processing
                of your personal data, and to data portability. To exercise any of these rights,
                contact <a href="mailto:uk@solavita.com" className="text-[#0F766E] hover:underline">uk@solavita.com</a>. You also have the right to complain to the
                Information Commissioner's Office (<a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-[#0F766E] hover:underline">ico.org.uk</a>).
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">9 Cookies</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                See our <a href="/cookies" className="text-[#0F766E] hover:underline">Cookie Policy</a> for details about the cookies we use.
              </p>
            </div>

            <div className="pt-6 mt-8 border-t border-[rgba(10,22,40,0.1)]">
              <p className="text-xs text-[#9CA3AF]">
                Last updated: August 2026 · Solavita Energy UK Limited (Company No. 17466951, registered in England and Wales)
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}