'use client'

import { motion } from 'motion/react'
import Breadcrumb from '@/components/Breadcrumb'

/**
 * About hero - same banner image and overlay treatment as the rest of
 * the inner-page heroes so the top-level navigation feels unified.
 *
 * Manufacturing origin is SKYWORTH Group's Shenzhen / China factory
 * line (verifiable from public sources); the local last-mile layer is
 * the Vietnam warehouse + installer network that delivers the kit and
 * handles after-sales.
 * [TBD]: the specific warehouse city(ies), installer coverage areas,
 * and the local warehouse / service-network line once business
 * confirms.
 */
export default function AboutHero() {
  return (
    <section
      className="hero-banner relative pt-32 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: 'url(/images/hero-about.webp)' }}
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
            { label: 'Về chúng tôi' },
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
            Ra mắt tại Việt Nam
          </span>
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-cw-bold leading-tight text-white mt-5 max-w-3xl capitalize"
        >
          Sản xuất trên dây chuyền của chúng tôi.
          <br />
          <span className="text-gradient">Sẵn hàng tại địa phương.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          className="mt-5 text-lg sm:text-xl text-white/85 font-cw-light max-w-2xl leading-relaxed"
        >
          Solavita là thương hiệu điện mặt trời cho hộ gia đình của Tập đoàn
          SKYWORTH — hệ thống điện mặt trời và pin lưu trữ sản xuất trên dây
          chuyền của tập đoàn và dự trữ tại kho địa phương, giúp rút ngắn thời
          gian từ ký hợp đồng đến khi hệ thống vận hành.{' '}
          <span className="text-red-300/90 font-cw-bold">
            TBD — Vị trí kho và khu vực lắp đặt tại Việt Nam (chờ xác minh).
          </span>
        </motion.p>
      </div>
    </section>
  )
}
