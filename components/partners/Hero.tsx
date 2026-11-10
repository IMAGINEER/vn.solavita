'use client'

import { motion } from 'motion/react'
import { Phone } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'
import { PARTNER_HOTLINE } from '@/lib/data/partners'

/**
 * For Partners hero - same banner image and overlay treatment as the
 * rest of the inner-page heroes so the navigation feels unified. Copy
 * makes the B2B nature of the page clear from the first line.
 *
 * Hero copy localizes the base text for Vietnam: the three VN partner
 * tracks (Đại lý kinh doanh / Đối tác lắp đặt / Đối tác kinh doanh),
 * and the supplier-group framing refers to SKYWORTH's group
 * supply-chain scale rather than any market-specific infrastructure.
 *
 * The four chips under the paragraph are the commercial promise of the
 * VN recruitment brochure — "Không áp lực tồn kho / Không cần thành
 * lập đội ngũ / Không cần kinh nghiệm chuyên môn / Không vốn đầu tư"
 * — condensed into the four barriers that actually decide whether a
 * prospect applies.
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
          className="text-4xl sm:text-5xl lg:text-6xl font-cw-bold leading-tight text-gradient mt-5 max-w-3xl"
        >
          Đồng hành cùng chuyển dịch năng lượng. Kiến tạo tương lai.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          className="mt-5 text-lg sm:text-xl text-white/85 font-cw-light max-w-2xl leading-relaxed"
        >
          Trở thành Đại lý kinh doanh, Đối tác lắp đặt hoặc Đối tác kinh doanh
          của Solavita. Bắt đầu mà không cần vốn, không cần tồn kho và không
          cần kinh nghiệm chuyên môn — có hoa hồng theo mỗi watt, đào tạo bởi
          chuyên gia và toàn bộ chuỗi cung ứng của tập đoàn SKYWORTH phía sau.
        </motion.p>

        {/* The four commercial barriers from the recruitment brochure */}
        <motion.ul
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.25 }}
          className="mt-7 flex flex-wrap gap-2.5"
        >
          {[
            'Không vốn đầu tư',
            'Không tồn kho',
            'Không cần đội ngũ',
            'Không cần kinh nghiệm chuyên môn',
          ].map((item) => (
            <li
              key={item}
              className="px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-sm font-cw-bold text-white/90"
            >
              {item}
            </li>
          ))}
        </motion.ul>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.32 }}
          className="mt-6 text-sm text-white/75 font-cw-regular"
        >
          Hotline đối tác:{' '}
          <a
            href={`tel:${PARTNER_HOTLINE}`}
            className="inline-flex items-center gap-1.5 font-cw-bold text-white hover:text-uk-emerald transition-colors"
          >
            <Phone className="w-4 h-4" strokeWidth={2} />
            {PARTNER_HOTLINE}
          </a>
        </motion.p>
      </div>
    </section>
  )
}