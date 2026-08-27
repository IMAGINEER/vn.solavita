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
            Solavita UK Ltd · Last updated: August 2026
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
                This Cookie Policy explains how Solavita UK Ltd ("we", "us") uses cookies and similar
                technologies on our website. It should be read alongside our
                {' '}<a href="/privacy" className="text-[#0F766E] hover:underline">Privacy Policy</a>.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">1 What are cookies?</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Cookies are small text files placed on your device when you visit a website. They
                are widely used to make websites work efficiently and to provide information to the
                site owners.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">2 Cookies we use</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                We use the following categories of cookies on this website:
              </p>
              <ul className="list-disc pl-6 text-sm text-[#4A5568] leading-relaxed mb-3 space-y-2">
                <li>
                  <strong className="text-[#0A1628]">Strictly necessary cookies.</strong> Required
                  for the website to function (e.g. cookie-consent storage). These do not require consent.
                </li>
                <li>
                  <strong className="text-[#0A1628]">Analytics cookies.</strong> Help us understand
                  how visitors use our website so we can improve it. Only set with your consent.
                </li>
                <li>
                  <strong className="text-[#0A1628]">Marketing cookies.</strong> Used to measure the
                  effectiveness of advertising campaigns. Only set with your consent.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">3 Managing your preferences</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                You can change or withdraw your consent at any time by clicking the
                {' '}<strong className="text-[#0A1628]">"Cookie Settings"</strong> link in our footer. You can also block
                cookies via your browser settings. Blocking strictly necessary cookies may affect how
                the website works.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">4 Third-party cookies</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Some cookies are placed by third parties (e.g. analytics or video providers). These
                third parties may use cookies to collect information about your online activity
                across different websites. We do not control these third-party cookies.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">5 Contact</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Questions about our use of cookies? Email <a href="mailto:uk@solavita.com" className="text-[#0F766E] hover:underline">uk@solavita.com</a>.
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