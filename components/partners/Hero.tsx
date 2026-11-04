'use client'

import { motion } from 'motion/react'
import Breadcrumb from '@/components/Breadcrumb'

/**
 * For Partners hero - same banner image and overlay treatment as the
 * rest of the inner-page heroes so the navigation feels unified. Copy
 * makes the B2B nature of the page clear from the first line.
 *
 * Hero copy localizes the base text for Vietnam: the three VN partner
 * tracks (Đối tác dịch vụ chính / Đơn vị lắp đặt được chứng nhận /
 * Đối tác giới thiệu khách hàng), and the supplier-group framing refers
 * to SKYWORTH's group supply-chain scale rather than any market-specific
 * infrastructure.
 */
export default function PartnersHero() {
  return (
    <section
      className="hero-banner relative pt-32 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: 'url(/images/hero-partners.webp)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.65) 35%, rgba(15,23,42,0.25) 60%, rgba(15,23,42,0) 80%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <Breadcrumb
          theme="light"
          items={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Dành cho đối tác' },
          ]}
        />

        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm mt-6"
        >
          <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
          <span className="text-xs font-cw-regular text-white/90">
            Dành cho đối tác · B2B
          </span>
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-cw-bold leading-tight text-white mt-5 max-w-3xl"
        >
          Đồng hành cùng chuyển dịch năng lượng.{' '}
          <span className="text-gradient">Kiến tạo tương lai.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          className="mt-5 text-lg sm:text-xl text-white/85 font-cw-light max-w-2xl leading-relaxed"
        >
          Trở thành đối tác Solavita — Đối tác dịch vụ chính, Đơn vị lắp đặt
          được chứng nhận hoặc Đối tác giới thiệu khách hàng. Tận hưởng hỗ trợ
          kỹ thuật tại địa phương, quy mô chuỗi cung ứng của tập đoàn và một
          chương trình hợp tác xây dựng trên quan hệ dài lâu.
        </motion.p>
      </div>
    </section>
  )
}