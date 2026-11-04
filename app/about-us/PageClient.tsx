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
 * /about-us - Solavita Việt Nam brand & company page.
 *
 * Composition mirrors the UK /about-us page (`UK.solavita/app/about-us`):
 *   AboutHero → WhoWeAre → Mission → Approach → Technology →
 *   GlobalPresence → ContactMethods (clickable={false}) → CTA.
 *
 * All section copy uses `lib/data/about.ts` (VN TBDs) and
 * `lib/data/contact.tsx` (VN TBDs) — other markets' trust marks,
 * revenue figures and market-specific claims are NOT transferred.
 * When unverified facts land they fill the same data slots.
 *
 * The sections are kept as dedicated components rather than being
 * inlined.
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
        eyebrow="Sẵn sàng khi bạn cần"
        title={
          <>
            Xem Solavita có thể làm gì{' '}
            <span className="text-gradient">cho tổ ấm của bạn.</span>
          </>
        }
        description="Dù cho gia đình hay doanh nghiệp, Solavita giúp bạn tìm đúng giải pháp điện mặt trời và pin lưu trữ theo nhu cầu. Hãy chia sẻ điều bạn cần, đội ngũ của chúng tôi sẽ đồng hành từ bước đầu tiên."
      />

      <Footer />
    </main>
  )
}