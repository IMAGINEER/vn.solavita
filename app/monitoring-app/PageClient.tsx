'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MonitoringAppHero from '@/components/monitoring-app/Hero'
import FeaturesGrid from '@/components/monitoring-app/FeaturesGrid'
import PhoneShowcase from '@/components/monitoring-app/PhoneShowcase'
import CTA from '@/components/solutions/CTA'

/**
 * /monitoring-app - Solavita Monitoring App landing page (light theme).
 *
 * Composition:
 *   Hero (light, banner-style) →
 *   FeaturesGrid (heading → full-width demo video → 6 capability cards) →
 *   PhoneShowcase ("Solavita Monitoring App" + phone centered + download
 *   CTAs) →
 *   Bottom CTA (re-used from /solutions for visual consistency)
 *
 * The old `/hems` URL permanently redirects here (see next.config.js).
 */
export default function MonitoringAppPage() {
  return (
    <main className="min-h-screen">
      <Header logoHref="/" />

      <MonitoringAppHero />
      <FeaturesGrid />
      <PhoneShowcase />

      <CTA
        eyebrow="Thiết kế miễn phí · Không ràng buộc"
        title={
          <>
            Xem Ứng dụng giám sát trên chính ngôi nhà của bạn.
            <br />
            <span className="text-gradient">Nhận thiết kế &amp; báo giá miễn phí.</span>
          </>
        }
        description="Cho chúng tôi biết về ngôi nhà của bạn — đội ngũ Solavita sẽ thiết kế hệ thống điện mặt trời, pin lưu trữ và dự phòng, quản lý qua Ứng dụng giám sát, kèm báo giá rõ ràng, không ràng buộc."
        secondaryLabel="Trao đổi với đội ngũ"
        secondaryHref="mailto:vn@solavita.com"
      />

      <Footer />
    </main>
  )
}