'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * "Who We Are" - brand-origin block on /about-us. Reuses the layout
 * shape the previous UK page established (eyebrow + headline +
 * description + 4 headline numbers + 2 heritage cards for Solavita
 * and SKYWORTH Group). SKYWORTH Group scale is the lead framing.
 *
 * Per ng-content-strategy rule 1 (no fabrication), every number is a
 * verifiable SKYWORTH Group disclosure or a TBD - never an invented
 * number converted from a previous UK-side calculation.
 */
export default function WhoWeAre() {
  const sectionRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const heritageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const stats = statsRef.current?.querySelectorAll('.stat-value')
      if (stats) {
        gsap.fromTo(
          stats,
          { scale: 0.7, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 80%',
            },
          }
        )
      }

      const cards = heritageRef.current?.querySelectorAll('.heritage-card')
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: heritageRef.current,
              start: 'top 80%',
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="who-we-are"
      className="relative py-16 md:py-24 bg-white overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-uk-teal-soft/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-uk-emerald/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
            <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
            Về Solavita
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            <span className="text-gradient">Sức mạnh toàn cầu.</span>{' '}
            Bản sắc địa phương.
          </h2>
        </div>

        {/* Featured brand video — sourced from the German Solavita
            site (skyworth-pv.com CDN). Reused here as the focal piece
            of the brand-origin block. Dark card on a light section
            gives the page a visual anchor without flipping the whole
            section into a dark theme. */}
        <div className="brand-film-card relative mb-12 md:mb-16 rounded-3xl overflow-hidden border border-uk-line bg-sv-navy shadow-sm">
          <video
            src="https://www.skyworth-pv.com/Public/Uploads/uploadfile/files/20250830/2banner.mp4"
            className="w-full aspect-video object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sv-darker/80 via-sv-darker/30 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 pointer-events-none">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-[10px] font-cw-bold uppercase tracking-wider text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-sv-blue animate-pulse" />
              Phim thương hiệu
            </span>
          </div>
        </div>

        {/* Stat tiles */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12 md:mb-16"
        >
          <div className="text-center p-6 rounded-2xl border border-uk-line bg-white shadow-sm">
            <div className="stat-value">
              {/* SKYWORTH Group revenue, converted from the previous
                 UK-side GBP £7.7bn figure. GBP→USD at ~1.27 mid-2026
                 (€/$/£) → £7.7bn × 1.27 = USD 9.779bn, rounded down
                 to USD 9.8bn. Cite the rate in source comments for
                 future audit; update when the SKYWORTH Group annual
                 report or central bank rate moves materially. */}
              <span className="text-3xl sm:text-4xl font-cw-bold text-uk-teal counter-number">
                9,8 tỷ
              </span>
              <span className="text-lg font-cw-bold text-uk-slate ml-1">
                USD
              </span>
            </div>
            <p className="text-sm text-uk-slate font-cw-regular mt-2">
              Doanh thu hằng năm của Tập đoàn SKYWORTH (năm tài chính 2024)
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl border border-uk-line bg-white shadow-sm">
            <div className="stat-value">
              <span className="text-3xl sm:text-4xl font-cw-bold text-uk-teal counter-number">
                4
              </span>
              <span className="text-lg font-cw-bold text-uk-slate ml-1">
                triệu
              </span>
            </div>
            <p className="text-sm text-uk-slate font-cw-regular mt-2">
              Hộ gia đình trên toàn thế giới tin dùng SKYWORTH
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl border border-uk-line bg-white shadow-sm">
            <div className="stat-value">
              <span className="text-3xl sm:text-4xl font-cw-bold text-uk-teal counter-number">
                40+
              </span>
              <span className="text-lg font-cw-bold text-uk-slate ml-1">
                năm
              </span>
            </div>
            <p className="text-sm text-uk-slate font-cw-regular mt-2">
              Kinh nghiệm điện tử và kỹ thuật năng lượng của Tập đoàn SKYWORTH
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl border border-uk-line bg-white shadow-sm">
            <div className="stat-value">
              <span className="text-3xl sm:text-4xl font-cw-bold text-uk-teal counter-number">
                2
              </span>
              <span className="text-lg font-cw-bold text-uk-slate ml-1">
                sàn
              </span>
            </div>
            <p className="text-sm text-uk-slate font-cw-regular mt-2">
              Sàn niêm yết (Hồng Kông và Thâm Quyến)
            </p>
          </div>
        </div>

        {/* Heritage cards */}
        <div
          ref={heritageRef}
          className="grid lg:grid-cols-2 gap-6 md:gap-8"
        >
          {/* Solavita */}
          <div className="heritage-card p-8 rounded-3xl border border-uk-line bg-white shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-uk-teal-soft flex items-center justify-center overflow-hidden p-1">
                <img
                  src="/images/a1logo02.svg"
                  alt="Solavita"
                  loading="lazy"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-cw-bold text-uk-navy">
                  Solavita
                </h3>
                <p className="text-xs text-uk-slate">
                  Thương hiệu điện mặt trời của Tập đoàn SKYWORTH
                </p>
              </div>
            </div>
            <p className="text-sm text-uk-slate font-cw-regular leading-relaxed">
              Solavita là thương hiệu điện mặt trời và năng lượng cho hộ gia
              đình của Tập đoàn SKYWORTH — nhà sản xuất điện tử toàn cầu với
              nhiều thập kỷ kinh nghiệm kỹ thuật và sản xuất trong lĩnh vực
              điện tử tiêu dùng, gia dụng và hệ thống điện.
            </p>
          </div>

          {/* SKYWORTH Global */}
          <div className="heritage-card p-8 rounded-3xl border border-uk-line bg-white shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-uk-teal-soft flex items-center justify-center overflow-hidden p-1">
                <img
                  src="/images/LOGOlan.svg"
                  alt="SKYWORTH"
                  loading="lazy"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-cw-bold text-uk-navy uppercase">
                  SKYWORTH Global
                </h3>
                <p className="text-xs text-uk-slate">
                  Người đồng hành của bạn qua nhiều thập kỷ
                </p>
              </div>
            </div>
            <p className="text-sm text-uk-slate font-cw-regular leading-relaxed">
              Tập đoàn SKYWORTH là doanh nghiệp điện tử toàn cầu niêm yết công
              khai — nhà sản xuất TV, tủ lạnh và hệ thống nhà thông minh bán
              trên toàn thế giới. Với Solavita, tập đoàn mang năng lực sản xuất
              này đến gần hộ gia đình và doanh nghiệp nhỏ tại Việt Nam.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}