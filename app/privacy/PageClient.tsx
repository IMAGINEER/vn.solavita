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
            Solavita · Last updated: 13 October 2026
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
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">1 Introduction</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                This Privacy Policy explains how <strong className="text-[#0A1628]">[FULL LEGAL NAME OF THE WEBSITE OPERATOR]</strong> ("Solavita", "we", "our" or "us") collects, uses, stores and shares personal information when you visit this website, contact us or submit an enquiry.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                We aim to handle personal information transparently and in accordance with applicable data protection laws, including the Nigeria Data Protection Act 2023 where applicable.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">2 Information We May Collect</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Depending on how you interact with the website, we may collect the following categories of information:
              </p>
              <p className="text-sm text-[#4A1628] font-cw-bold mb-1">Information you provide</p>
              <ul className="list-disc pl-6 text-sm text-[#4A5568] leading-relaxed mb-3 space-y-1">
                <li>Name and contact details, such as email address and telephone number.</li>
                <li>Residential or business location information you choose to provide.</li>
                <li>Details about your energy requirements, property, intended installation or business enquiry.</li>
                <li>Information contained in messages and other communications you send to us.</li>
              </ul>
              <p className="text-sm text-[#0A1628] font-cw-bold mb-1">Technical and usage information</p>
              <ul className="list-disc pl-6 text-sm text-[#4A5568] leading-relaxed mb-3 space-y-1">
                <li>IP address, browser type, device information, operating system and approximate location derived from technical information.</li>
                <li>Pages viewed, referral information, interaction events and timestamps.</li>
                <li>Cookie identifiers and similar technical data, where these technologies are used.</li>
              </ul>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                We collect only the information supported by the website's actual functionality and our business processes.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">3 How We Use Information</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Subject to applicable law and the circumstances of collection, we may use personal information to:
              </p>
              <ul className="list-disc pl-6 text-sm text-[#4A5568] leading-relaxed mb-3 space-y-1">
                <li>Respond to enquiries and requests for information.</li>
                <li>Assess stated energy requirements and prepare or coordinate a proposed solution.</li>
                <li>Communicate about products, quotations, installation enquiries or after-sales requests.</li>
                <li>Operate, secure, troubleshoot and improve the website.</li>
                <li>Measure website performance where analytics are used lawfully.</li>
                <li>Meet legal obligations and establish, exercise or defend legal claims.</li>
              </ul>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                We will not use personal information for an unrelated purpose where doing so would be inconsistent with applicable law or the information provided to you.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">4 Legal Basis for Processing</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Where applicable law requires a legal basis for processing, we will rely on the basis appropriate to the relevant activity. Depending on the circumstances, this may include your consent, steps taken at your request before entering a contract, compliance with a legal obligation or another lawful basis permitted by applicable law.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Where consent is required, you may withdraw it using the relevant mechanism or by contacting us. Withdrawal does not affect processing lawfully carried out before withdrawal.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">5 Sharing of Information</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                We do not sell personal information as a standalone data product.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                We may share relevant information with service providers or other recipients where necessary for purposes such as website hosting, form delivery, communications, security, analytics, customer relationship management or fulfilment of a request.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                We may also disclose information where required by law, to protect legal rights or in connection with a business reorganisation, subject to applicable legal requirements.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                The specific recipients depend on the services actually used by the website operator. <strong className="text-[#0A1628]">[Before publication, identify the actual hosting, analytics, form, messaging and CRM providers, where applicable.]</strong>
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">6 International Transfers</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Some service providers may process or store information outside Nigeria or the country in which you are located.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Where personal information is transferred internationally, we will take the steps required by applicable data protection law, including any required safeguards or assessments.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                <strong className="text-[#0A1628]">[Confirm actual hosting regions, service-provider locations and applicable transfer safeguards before publication.]</strong>
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">7 Data Retention</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                We retain personal information only for as long as reasonably necessary for the purposes for which it was collected, including responding to enquiries, maintaining relevant business records, meeting legal obligations and resolving disputes.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Retention periods depend on the type of information, the purpose of processing and applicable legal requirements. We will delete or anonymise information when it is no longer required, where appropriate and technically feasible.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                <strong className="text-[#0A1628]">[Confirm the actual retention periods or retention criteria used for enquiries, analytics and server logs.]</strong>
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">8 Data Security</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                We use reasonable technical and organisational measures designed to protect personal information against unauthorised access, loss, misuse or alteration.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                No method of transmission or storage is completely secure. We cannot guarantee absolute security, but we take appropriate steps to protect information within our control.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">9 Your Privacy Rights</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Subject to applicable law and any relevant exceptions, you may have the right to:
              </p>
              <ul className="list-disc pl-6 text-sm text-[#4A5568] leading-relaxed mb-3 space-y-1">
                <li>Request access to personal information we hold about you.</li>
                <li>Request correction of inaccurate or incomplete information.</li>
                <li>Request deletion of personal information where legally available.</li>
                <li>Object to or request restriction of certain processing.</li>
                <li>Request a copy of certain information in a portable format where applicable.</li>
                <li>Withdraw consent where processing is based on consent.</li>
                <li>Raise a complaint with the relevant data protection authority.</li>
              </ul>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                To make a request, contact us using the details below. We may need to verify your identity before responding.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">10 Children</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                This website is intended for general residential and commercial enquiries and is not designed to solicit personal information directly from children. If you believe a child has provided personal information inappropriately, contact us so we can assess and address the matter.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">11 Third-Party Websites</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Our website may contain links to third-party websites. Their privacy practices are governed by their own policies. Please review those policies before providing personal information to those websites.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">12 Changes to This Policy</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                We may update this Privacy Policy to reflect changes in our practices, technology or legal requirements. The latest version will be published on this page with an updated revision date.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">13 Contact Us</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                For privacy questions or requests, contact:
              </p>
              <ul className="list-none pl-0 text-sm text-[#4A5568] leading-relaxed mb-3 space-y-1">
                <li><strong className="text-[#0A1628]">Data controller / website operator:</strong> [CONFIRM LEGAL ENTITY]</li>
                <li><strong className="text-[#0A1628]">Privacy contact:</strong> Johny Zhang</li>
                <li><strong className="text-[#0A1628]">Email:</strong> <a href="mailto:ng@solavita.com" className="text-[#0F766E] hover:underline">ng@solavita.com</a></li>
                <li><strong className="text-[#0A1628]">Address:</strong> [CONFIRMED BUSINESS OR REGISTERED ADDRESS]</li>
              </ul>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                If a designated privacy or data protection officer is legally required or has been appointed, their contact details should be provided here.
              </p>
            </div>

            <div className="pt-6 mt-8 border-t border-[rgba(10,22,40,0.1)]">
              <p className="text-xs text-[#9CA3AF]">
                Last updated: 13 October 2026 · Solavita
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
