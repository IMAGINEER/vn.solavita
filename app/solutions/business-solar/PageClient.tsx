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
      eyebrow: 'ĐIỆN MẶT TRỜI CÔNG NGHIỆP & THƯƠNG MẠI',
      title: 'Năng lượng thông minh. Doanh nghiệp vững mạnh.',
      body: 'Giải pháp điện mặt trời và lưu trữ năng lượng tích hợp giúp giảm chi phí vận hành, tăng khả năng chịu tải và hỗ trợ doanh nghiệp tăng trưởng.',
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
      body: 'Giải pháp điện mặt trời cho doanh nghiệp của Solavita mang lại ba giá trị: chi phí vận hành thấp hơn, chủ động nguồn điện và nguồn điện ổn định. Ba giải pháp dưới đây được thiết kế dựa trên phụ tải thiết bị, giờ vận hành, phụ tải quan trọng và yêu cầu về pha. Khả năng phù hợp cuối cùng được xác nhận qua khảo sát phụ tải, đánh giá hiện trường và rà soát yêu cầu pha — không phải doanh nghiệp nào cũng cần điện ba pha.',
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
          title: 'ĐIỆN CÔNG NGHIỆP, ĐƠN GIẢN HÓA.',
          spec: 'Hệ thống ESS All-in-One 125kW / 261kWh.',
          body: 'Một tủ duy nhất vận hành nhà máy, siêu thị hoặc lưới điện mini cộng đồng — không cần biến tần riêng, không xếp container và không cần hậu cần nhiên liệu tại chỗ.',
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
      body: 'Nếu phụ tải, giờ vận hành hoặc điều kiện mặt bằng của bạn nằm ngoài các cấu hình trên, hãy yêu cầu một đề xuất riêng. Đại diện Solavita sẽ liên hệ với cấu hình phù hợp với doanh nghiệp của bạn.',
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
        tagline: 'Một tủ. Hiệu quả thực.',
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