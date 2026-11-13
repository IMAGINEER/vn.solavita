'use client'

import { Download, ArrowRight, FileText } from 'lucide-react'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import { productDownloads } from '@/lib/data/products'

/**
 * DownloadSection — the "Download" block on /support.
 *
 * Per `docs/Modules&Inverter&Battery&All in One ESS.pptx` slide 7:
 * "Product Specs, manuals and downloads for panels, batteries and
 * inverters." + "Download Files →", and the note on slide 1: "鼠标移至
 * 图片显示 Learn More，点击后跳转 Support，在 Support 增加一个 Download
 * 栏目，点击 Download 后会浮现每款产品的图片及下载链接".
 *
 * The Support page's Product and Warranty cards both point their
 * "Download →" CTA here.
 *
 * Each card now links straight to the PDF in `public/downloads/products/`
 * and shows the real product render as its thumbnail — the documents and
 * imagery arrived in Nov 2026.
 */
export default function DownloadSection() {
  return (
    <section
      id="download"
      className="relative py-16 md:py-20 bg-white scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <SectionEyebrow>TÀI LIỆU TẢI VỀ</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
            Tài liệu sản phẩm —{' '}
            <span className="text-gradient">tải về trong một chỗ</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed max-w-2xl mx-auto">
            Bảng thông số, hướng dẫn sử dụng và tài liệu bảo hành cho từng
            linh kiện Solavita.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productDownloads.map((d) => (
            <a
              key={d.id}
              href={d.href}
              download
              className="group flex flex-col rounded-2xl border border-uk-line bg-white overflow-hidden transition-all duration-300 hover:border-uk-teal hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="relative aspect-[4/3] bg-white border-b border-uk-line flex items-center justify-center">
                {d.image ? (
                  <img
                    src={d.image}
                    alt={d.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-contain p-4"
                  />
                ) : (
                  <FileText
                    className="w-14 h-14 text-uk-teal-dark/40"
                    strokeWidth={1.25}
                    aria-hidden="true"
                  />
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-[10px] font-cw-bold uppercase tracking-wider text-uk-teal-dark">
                  {d.category} · PDF · {d.size}
                </div>
                <h3 className="mt-1.5 text-sm font-cw-bold text-uk-navy leading-snug flex-1">
                  {d.title}
                </h3>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-cw-bold text-uk-teal group-hover:text-uk-teal-dark transition-colors">
                  <Download className="w-4 h-4" strokeWidth={2} />
                  Tải về
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
