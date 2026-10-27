'use client'

import Link from 'next/link'
import { Download, ArrowRight } from 'lucide-react'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import ImagePlaceholder from '@/components/ui/image-placeholder'
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
 * Each entry links to the matching product detail page, which carries
 * the full technical data. The actual PDF files are not in the repo
 * yet, so the card imagery is an `ImagePlaceholder` per the NG content
 * strategy.
 */
export default function DownloadSection() {
  return (
    <section
      id="download"
      className="relative py-16 md:py-20 bg-white scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <SectionEyebrow>DOWNLOADS</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
            Product Specs, Manuals and{' '}
            <span className="text-gradient">Downloads</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed max-w-2xl mx-auto">
            Datasheets, manuals and warranty documents for every
            Solavita component.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productDownloads.map((d) => (
            <Link
              key={d.id}
              href={d.href}
              className="group flex flex-col rounded-2xl border border-uk-line bg-white overflow-hidden transition-all duration-300 hover:border-uk-teal hover:shadow-md hover:-translate-y-0.5"
            >
              <ImagePlaceholder
                description={d.imageDescription}
                aspectRatio="4/3"
                className="!rounded-none !border-0 !border-b !border-dashed !border-slate-300"
              />
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-[10px] font-cw-bold uppercase tracking-wider text-uk-teal-dark">
                  {d.category}
                </div>
                <h3 className="mt-1.5 text-sm font-cw-bold text-uk-navy leading-snug flex-1">
                  {d.title}
                </h3>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-cw-bold text-uk-teal group-hover:text-uk-teal-dark transition-colors">
                  <Download className="w-4 h-4" strokeWidth={2} />
                  Download
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
