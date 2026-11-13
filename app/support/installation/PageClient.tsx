'use client'

import Link from 'next/link'
import {
  ClipboardPenLine,
  PencilRuler,
  HardHat,
  ClipboardCheck,
  ArrowRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHero from '@/components/ui/page-hero'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import CTA from '@/components/solutions/CTA'
import { openFormModal } from '@/lib/form-modal'

/**
 * /support/installation — the "How to Install" landing page.
 *
 * Linked from the Support page's Installation card, whose CTA changed
 * from "View FAQs" to "How to Install →" per `docs/修改建议.docx`
 * §"Support页面修改" (Oct 2026).
 *
 * Content (4 steps + 4 FAQs) follows the same docx section, localised
 * for the Vietnam market, with unverified operational claims marked
 * as TBD.
 *
 * ⚠ The step-3 copy and the first FAQ previously stated a
 * 7-day / 7-working-day installation lead time, and the last FAQ
 * named "Solavita-certified engineers". Those are unverified
 * operational claims, so they are now published as `TBD — …`
 * markers. Confirm them with the Vietnam operations team before
 * launch — the per-package `installationTime` field on the solution
 * pages is still a TBD marker.
 */

interface Step {
  id: string
  Icon: LucideIcon
  title: string
  body: string
}

const STEPS: Step[] = [
  {
    id: 'survey',
    Icon: ClipboardPenLine,
    title: 'Khảo sát miễn phí',
    body: 'Kỹ thuật viên kiểm tra tải trọng mái và nhu cầu điện tại nhà, miễn phí.',
  },
  {
    id: 'quote',
    Icon: PencilRuler,
    title: 'Thiết kế & báo giá',
    body: 'Solavita đề xuất cấu hình phù hợp và gửi báo giá để bạn xem xét.',
  },
  {
    id: 'installation',
    Icon: HardHat,
    title: 'Lắp đặt',
    body: 'Đội thi công lắp tấm pin, biến tần và pin lưu trữ. TBD — Thời gian hoàn thành lắp đặt (chờ xác nhận).',
  },
  {
    id: 'commissioning',
    Icon: ClipboardCheck,
    title: 'Nghiệm thu',
    body: 'Kiểm tra toàn hệ thống, kích hoạt và bàn giao để bạn dùng ngay.',
  },
]

const FAQS: { q: string; a: string }[] = [
  {
    q: 'Lắp đặt mất bao lâu?',
    a: 'TBD — Thời gian lắp đặt chính thức (chờ xác nhận).',
  },
  {
    q: 'Tôi có cần chuẩn bị gì trước khi lắp đặt không?',
    a: 'Không cần chuẩn bị thiết bị. Solavita phụ trách khảo sát mái, thi công và đấu nối theo quy định.',
  },
  {
    q: 'Nguồn điện của tôi có bị gián đoạn trong quá trình lắp đặt không?',
    a: 'Thi công được sắp xếp để hạn chế gián đoạn sinh hoạt; nếu cần ngắt điện cục bộ, đội ngũ sẽ báo trước.',
  },
  {
    q: 'Ai là người lắp đặt hệ thống?',
    a: 'TBD — Thông tin chứng nhận của đơn vị lắp đặt (chờ xác nhận).',
  },
]

export default function SupportInstallationPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header logoHref="/" />

      <PageHero
        backgroundImage="/images/banner_home.webp"
        eyebrow="LẮP ĐẶT"
        title={'Lắp đặt hệ thống Solavita'}
        body="Bốn bước từ buổi khảo sát miễn phí đầu tiên đến khi hệ thống chính thức vận hành — Solavita phụ trách từng bước."
        primaryCta={{ label: 'Nhận báo giá miễn phí', onClick: openFormModal }}
        secondaryCta={{ label: 'Quay lại Hỗ trợ', href: '/support' }}
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Hỗ trợ', href: '/support' },
          { label: 'Lắp đặt' },
        ]}
      />

      {/* The 4 steps — chevron-linked, per the reference image. */}
      <section className="relative py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <SectionEyebrow>QUY TRÌNH</SectionEyebrow>
            <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
              Bốn bước <span className="text-gradient">đến khi vận hành</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={step.id} className="relative">
                <div className="rounded-2xl border border-uk-line bg-white p-7 h-full flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-uk-emerald/15 flex items-center justify-center text-uk-emerald mb-4">
                    <step.Icon className="w-6 h-6" strokeWidth={1.6} />
                  </div>
                  <div className="text-xs font-cw-bold uppercase tracking-wider text-uk-slate">
                    Bước {i + 1}
                  </div>
                  <h3 className="mt-1 text-lg font-cw-bold text-uk-navy">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-uk-slate font-cw-regular leading-relaxed flex-1">
                    {step.body}
                  </p>
                </div>
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="hidden lg:flex absolute right-[-14px] top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-uk-teal text-white items-center justify-center z-10"
                  >
                    <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The 4 FAQs */}
      <section className="relative py-16 md:py-20 bg-uk-line/30">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <SectionEyebrow>CÂU HỎI THƯỜNG GẶP VỀ LẮP ĐẶT</SectionEyebrow>
            <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
              Câu hỏi về <span className="text-gradient">lắp đặt</span>
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-uk-line bg-white overflow-hidden"
              >
                <h3 className="px-5 py-4 text-sm md:text-base font-cw-bold text-uk-navy">
                  {item.q}
                </h3>
                <div className="px-5 pb-5 text-sm text-uk-slate font-cw-regular leading-relaxed">
                  {item.a}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/support#faq-installation"
              className="inline-flex items-center gap-2 text-sm font-cw-bold text-uk-teal-dark hover:text-uk-teal transition-colors"
            >
              Xem thêm Câu hỏi thường gặp về lắp đặt
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>

      <CTA
        eyebrow="Sẵn sàng khi bạn cần"
        title={
          <>
            Bạn chưa phải khách hàng của Solavita?
            <br />
            <span className="text-gradient">Bắt đầu với thiết kế miễn phí.</span>
          </>
        }
        description="Nếu bạn đang cân nhắc, Solavita có thể chuẩn bị một thiết kế miễn phí, không ràng buộc — cho thấy hệ điện mặt trời kèm pin lưu trữ phù hợp với ngôi nhà của bạn ra sao."
      />

      <Footer />
    </main>
  )
}
