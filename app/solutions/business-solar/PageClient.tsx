'use client'

import CollectionPage, {
  type CollectionPageProps,
} from '@/components/solutions/CollectionPage'
import { solutionDetails, businessSolutionFaqs } from '@/lib/data/solutions'
import { openFormModal } from '@/lib/form-modal'

/**
 * /solutions/business-solar — ba giải pháp điện mặt trời cho doanh nghiệp:
 *   - BUSINESS Entry 3-Phase
 *   - BUSINESS Standard 3-Phase
 *   - BUSINESS Flagship 3-Phase
 *
 * Trang không ngụ ý rằng mọi doanh nghiệp đều cần điện ba pha. Phần FAQ
 * nêu rõ "pha phụ thuộc điều kiện công trình".
 *
 * Nội dung FAQ nằm trong `lib/data/solutions.ts` để các trang khác dùng lại.
 */

const businessSolutions = solutionDetails.filter(
  (p) => p.segment === 'businesses',
)

export default function BusinessSolarPage() {
  const props: CollectionPageProps = {
    scenario: 'business',
    heroProps: {
      eyebrow: 'ĐIỆN MẶT TRỜI CHO DOANH NGHIỆP',
      title: 'Điện ổn định. Vận hành liền mạch.',
      body: 'Điện mặt trời kèm pin lưu trữ giúp doanh nghiệp giảm chi phí điện và giữ hoạt động liền mạch khi lưới điện có sự cố.',
      backgroundImage: '/images/business_solar_1600x856.webp',
      primaryCta: {
        label: 'Nhận đánh giá năng lượng miễn phí',
        onClick: openFormModal,
      },
      breadcrumbs: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Doanh nghiệp' },
      ],
    },
    contextCopy: {
      heading:
        'Cắt giảm chi phí, vận hành liên tục, chủ động ngân sách năng lượng',
      body: 'Solavita thiết kế hệ theo ba yếu tố: thiết bị cần chạy, giờ vận hành và yêu cầu về pha. Mỗi cấu hình dưới đây ứng với một mức phụ tải khác nhau; phương án cuối cùng được xác nhận qua khảo sát hiện trường. Không phải doanh nghiệp nào cũng cần điện ba pha.',
    },
    solutions: businessSolutions,
    // ①套餐 — one equal-width 3-up row. The docx's two categories are
    //   carried by the cards themselves: 分类1 (VITAL BUSINESS) folds
    //   into the Entry/Standard intros, and 分类2 (HEAVY DEMAND) into
    //   Flagship, which gets the featured teal outline.
    solutionGroups: [
      {
        solutions: businessSolutions.filter(
          (s) =>
            s.id === 'business-entry-3-phase' ||
            s.id === 'business-standard-3-phase',
        ),
      },
      {
        solutions: businessSolutions.filter(
          (s) => s.id === 'business-flagship-3-phase',
        ),
        featured: true,
        highlight: {
          title: 'Điện công nghiệp, gọn trong một tủ.',
          spec: 'Hệ thống ESS All-in-One 125 kW / 261 kWh.',
          body: 'Một tủ duy nhất vận hành nhà máy, siêu thị hoặc lưới điện mini cộng đồng — không cần thêm biến tần rời, không chiếm nhiều diện tích.',
          href: '/products/all-in-one-ess',
          ctaLabel: 'Chi tiết All-in-One ESS',
          // 工商业光伏背景图 per `docs/修改建议(2).docx`.
          backgroundImage: '/images/business-customized.webp',
        },
      },
    ],
    tailoredCta: {
      eyebrow: 'CHƯA THẤY CẤU HÌNH PHÙ HỢP?',
      title: (
        <>
          Hãy để chúng tôi <span className="text-gradient">thiết kế riêng.</span>
        </>
      ),
      body: 'Nếu phụ tải, giờ vận hành hoặc mặt bằng không khớp các cấu hình trên, hãy yêu cầu một đề xuất riêng. Đội ngũ Solavita sẽ liên hệ và đề xuất cấu hình phù hợp.',
      primaryCta: { label: 'Yêu cầu báo giá riêng', href: '/contact-us' },
    },
    // ②优势-品牌赋能 — "VITAL ENERGY. VITAL TRUST."
    showBrandAdvantage: true,
    // ③产品简介 — Module / Inverter / Battery / C&I ESS + "View More Products"
    showcaseProducts: [
      {
        title: 'Tấm pin',
        tagline: 'Cung cấp năng lượng ổn định.',
        href: '/products/module',
        imagePath: '/images/product-module-1.webp',
        imageDescription: 'Tấm pin mặt trời TOPCon 620 W của Solavita',
      },
      {
        title: 'Biến tần',
        tagline: 'Điều khiển thông minh.',
        href: '/products/inverter',
        imagePath: '/images/product-inverter-card.webp',
        imageDescription: 'Bộ biến tần hybrid Solavita',
      },
      {
        title: 'Pin lưu trữ',
        tagline: 'Dự phòng tin cậy.',
        href: '/products/battery',
        // SWR cabinet render — the previous `product-battery-card.webp`
        // actually showed the C&I ESS cabinet, not the residential
        // battery.
        imagePath: '/images/products/battery/swr-5-12-front.webp',
        imageDescription: 'Tủ pin LiFePO₄ SWR của Solavita',
      },
      {
        title: 'Hệ thống lưu trữ năng lượng C&I',
        tagline: 'Một tủ cho cả công trình.',
        href: '/products/all-in-one-ess',
        imagePath: '/images/products/all-in-one-ess/sws-261-1.webp',
        imageDescription:
          'Tủ ESS All-in-One 125 kW / 261 kWh của Solavita',
      },
    ],
    faqs: businessSolutionFaqs,
  }
  return <CollectionPage {...props} />
}