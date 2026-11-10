'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AboutHero from '@/components/about/Hero'
import WhoWeAre from '@/components/about/WhoWeAre'
import Mission from '@/components/about/Mission'
import Approach from '@/components/about/Approach'
import Technology from '@/components/about/Technology'
import GlobalPresence from '@/components/about/GlobalPresence'
import CTA from '@/components/solutions/CTA'

/**
 * /about-us - Solavita Việt Nam brand & company page.
 *
 * Composition mirrors the Italian market's about-us page
 * (`IT.solavita/components/about`):
 *   AboutHero → WhoWeAre → Mission → Approach → Technology →
 *   GlobalPresence → CTA.
 *
 * The Italian page has no contact-method block here either: the
 * contact channels live on /contact-us, and the office card is only
 * published once a verified Vietnamese office address exists.
 *
 * All section copy comes from `lib/data/about.ts`, which only states
 * facts the group publishes (SKYWORTH Group disclosures, the product
 * certifications already listed on the product pages, and the Hong
 * Kong legal entity named in the footer). Other markets' trust marks,
 * revenue figures and market-specific claims are NOT transferred.
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