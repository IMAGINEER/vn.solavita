'use client'

import { motion } from 'motion/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'

export default function CookiesPage() {
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
              { label: 'Cookie Policy' },
            ]}
          />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-3xl lg:text-4xl font-cw-bold text-[#0A1628] mt-6 mb-2"
          >
            Cookie Policy
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
              <p className="text-sm text-[#4A5568] leading-relaxed mb-6">
                This Cookie Policy explains how Solavita uses cookies and similar technologies on this website. It should be read alongside our <a href="/privacy" className="text-[#0F766E] hover:underline">Privacy Policy</a>.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">1 What Are Cookies?</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Cookies are small text files stored on your device when you visit a website. Websites may also use similar technologies, such as local storage, pixels or scripts, to remember preferences, maintain functionality, understand usage or support advertising.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                This policy explains how Solavita may use cookies and similar technologies on this website. The technologies actually used depend on the website's configuration and the services enabled by the operator.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">2 Categories of Cookies</h2>
              <p className="text-sm text-[#0A1628] font-cw-bold mb-1">Strictly necessary technologies</p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                These technologies support essential website functions, security, network management or features you specifically request. Where permitted by law, they may operate without consent.
              </p>
              <p className="text-sm text-[#0A1628] font-cw-bold mb-1">Analytics and performance technologies</p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                These technologies help measure traffic, understand how visitors use the website and identify technical issues. They should be enabled only in accordance with applicable consent requirements and the website's actual configuration.
              </p>
              <p className="text-sm text-[#0A1628] font-cw-bold mb-1">Marketing and advertising technologies</p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                These technologies may be used to measure advertising performance, attribute enquiries to campaigns or personalise marketing. They should be used only where they are actually installed and the required consent or other lawful conditions have been satisfied.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                We will not treat analytics or marketing technologies as active merely because this policy describes them.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">3 Cookies Used on This Website</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                The precise cookies and similar technologies depend on the tools enabled on the website.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                <strong className="text-[#0A1628]">[Before publication, complete a cookie inventory based on a browser inspection and the production configuration. For each technology, list its name, provider, purpose, category, duration and whether it transmits data to a third party.]</strong>
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Do not publish unverified cookie names, providers or expiry periods.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">4 Managing Your Preferences</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Where a cookie preference or consent tool is provided, you can use it to review or change your choices. If the website does not currently provide such a tool, do not assume that preferences can be changed through a website settings panel.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                You can also manage or delete cookies through your browser settings. Blocking all cookies may affect some website functions. Browser controls do not necessarily prevent all similar technologies from operating.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Where applicable law requires prior consent for non-essential technologies, those technologies should not be activated before the required consent is obtained.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">5 Third-Party Services</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Some website features may depend on third-party services, such as embedded content, analytics, advertising or communication tools. If enabled, those providers may process technical information in accordance with their own policies.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                The operator should identify the actual providers used on this website and link to their relevant privacy or cookie documentation.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">6 Changes to This Policy</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                We may update this Cookie Policy when website technologies, service providers or legal requirements change. The latest version will be published on this page with an updated revision date.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">7 Contact Us</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                For questions about cookies or similar technologies, contact:
              </p>
              <ul className="list-none pl-0 text-sm text-[#4A5568] leading-relaxed mb-3 space-y-1">
                <li><strong className="text-[#0A1628]">Website operator:</strong> [FULL LEGAL NAME]</li>
                <li><strong className="text-[#0A1628]">Contact:</strong> Johny Zhang</li>
                <li><strong className="text-[#0A1628]">Email:</strong> <a href="mailto:ng@solavita.com" className="text-[#0F766E] hover:underline">ng@solavita.com</a></li>
                <li><strong className="text-[#0A1628]">Address:</strong> [CONFIRMED BUSINESS OR REGISTERED ADDRESS]</li>
              </ul>
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
