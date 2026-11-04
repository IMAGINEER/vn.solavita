'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SupportHero from '@/components/support/Hero'
import SupportCategories from '@/components/support/SupportCategories'
import DownloadSection from '@/components/support/DownloadSection'
import FAQ from '@/components/support/FAQ'
import ContactSupport from '@/components/support/ContactSupport'
import CTA from '@/components/solutions/CTA'

/**
 * /support - User support centre.
 *
 * Composition (per project brief):
 *   Hero / Search → Support Categories → FAQ → Contact Support → CTA
 *
 * The Download block sits between the categories and the FAQ — it is
 * where the "Product → Download" and "Warranty → Download" card CTAs
 * land. See `docs/修改建议.docx` §"Support页面修改" (Oct 2026) and the
 * product PPTX slide 7.
 *
 * Search input is visual-only (no backend) per the project brief.
 * FAQ accordion uses motion/react for height transitions; no external
 * accordion library needed.
 */
export default function SupportPage() {
  return (
    <main className="min-h-screen">
      <Header logoHref="/" />

      <SupportHero />

      <SupportCategories />

      <DownloadSection />

      <FAQ />

      <ContactSupport />

      <CTA
        eyebrow="Cần một hệ thống mới?"
        title={
          <>
            Bạn chưa phải khách hàng?
            <br />
            <span className="text-gradient">Bắt đầu với thiết kế miễn phí.</span>
          </>
        }
        description="Nếu bạn vẫn đang tìm hiểu, đội ngũ của chúng tôi có thể chuẩn bị một thiết kế miễn phí, không ràng buộc, cho thấy hệ thống điện mặt trời, pin lưu trữ hoặc hệ thống năng lượng trọn nhà sẽ như thế nào với ngôi nhà của bạn."
      />

      <Footer />
    </main>
  )
}
