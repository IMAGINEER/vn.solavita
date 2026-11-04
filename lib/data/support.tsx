/**
 * Support page data.
 *
 * Categories drive the clickable cards on /support. FAQ items drive
 * the accordion. All copy placeholder - designed to be the single edit
 * point when the support team fills in final wording.
 */

import type { ReactNode } from 'react'

export type SupportCategoryId =
  | 'installation'
  | 'product'
  | 'monitoring'
  | 'warranty'
  | 'troubleshooting'

export interface SupportCategory {
  id: SupportCategoryId
  title: string
  description: string
  icon:
    | 'wrench'
    | 'package'
    | 'monitor'
    | 'shield'
    | 'life-buoy'
  /**
   * Label of the card's call-to-action. Per `docs/修改建议.docx`
   * "Support页面修改" (Oct 2026) the four visible cards no longer all
   * read "View FAQs".
   */
  ctaLabel: string
  /**
   * Where the CTA goes. A `#`-prefixed value is an on-page anchor to
   * the matching FAQ group; an absolute path is a route.
   */
  ctaHref: string
  /**
   * Set to false to hide the card from the grid while keeping the
   * category's FAQ group on the page. The Monitoring card was removed
   * per `docs/修改建议.docx` (Oct 2026) but its FAQ content stays.
   */
  card?: boolean
}

export const supportCategories: SupportCategory[] = [
  {
    id: 'installation',
    title: 'Lắp đặt',
    description:
      'Khảo sát, ngày lắp đặt, những gì cần chuẩn bị và cách chuẩn bị cho ngôi nhà của bạn.',
    icon: 'wrench',
    ctaLabel: 'Hướng dẫn lắp đặt',
    ctaHref: '/support/installation',
  },
  {
    id: 'product',
    title: 'Sản phẩm',
    description:
      'Thông số kỹ thuật, hướng dẫn sử dụng và tài liệu tải về cho tấm quang năng, pin lưu trữ và bộ biến tần.',
    icon: 'package',
    ctaLabel: 'Tải tài liệu',
    ctaHref: '#download',
  },
  {
    id: 'monitoring',
    title: 'Giám sát',
    description:
      'Thiết lập ứng dụng giám sát, cảnh báo, báo cáo và chia sẻ quyền truy cập với gia đình.',
    icon: 'monitor',
    ctaLabel: 'Xem Câu hỏi thường gặp',
    ctaHref: '#faq-monitoring',
    card: false,
  },
  {
    id: 'warranty',
    title: 'Bảo hành',
    description:
      'Phạm vi bảo hành, yêu cầu bảo hành, chuyển nhượng quyền sở hữu và những gì được bao gồm.',
    icon: 'shield',
    ctaLabel: 'Tải tài liệu',
    ctaHref: '#download',
  },
  {
    id: 'troubleshooting',
    title: 'Xử lý sự cố',
    description:
      'Các vấn đề thường gặp, mã lỗi và những việc cần làm trước khi đặt lịch kiểm tra.',
    icon: 'life-buoy',
    ctaLabel: 'Liên hệ',
    ctaHref: '/contact-us',
  },
]

export interface FaqItem {
  category: SupportCategoryId
  question: string
  answer: string
}

export const faqItems: FaqItem[] = [
  {
    category: 'installation',
    question: 'Lắp đặt mất bao lâu?',
    answer:
      'TBD — Thời gian lắp đặt chính thức (chờ xác nhận).',
  },
  {
    category: 'installation',
    question: 'Tôi có cần có mặt tại nhà khi khảo sát không?',
    answer:
      'Có - buổi khảo sát được thực hiện tại chỗ để kỹ thuật viên kiểm tra mái nhà, tủ điện và gác mái. Thường mất 60-90 phút.',
  },
  {
    category: 'installation',
    question: 'Việc lắp đặt có gây gián đoạn không?',
    answer:
      'Chúng tôi tháo ngói để gắn thanh ray, khoan bắt vít vào xà mái và đi dây đến tủ điện của bạn. Hầu hết các hộ gia đình trở lại sinh hoạt bình thường trong cùng ngày.',
  },
  {
    category: 'product',
    question: 'Tôi có thể tìm hướng dẫn sử dụng ở đâu?',
    answer:
      'Hướng dẫn sử dụng sản phẩm có trong mục Tải về của Ứng dụng giám sát và có thể yêu cầu từ đội ngũ dịch vụ của chúng tôi.',
  },
  {
    category: 'product',
    question: 'Tấm quang năng Solavita có đạt chuẩn Tier-1 không?',
    answer:
      'TBD — Xếp hạng Tier-1 và thứ hạng BloombergNEF của tấm quang năng (chờ xác nhận).',
  },
  {
    category: 'monitoring',
    question: 'Làm thế nào để tôi có Ứng dụng giám sát?',
    answer:
      'Sau khi hệ thống được đưa vào vận hành, chúng tôi tạo tài khoản Ứng dụng giám sát cho bạn và gửi email kèm liên kết tải về. Ứng dụng có trên iOS và Android.',
  },
  {
    category: 'monitoring',
    question: 'Tôi có thể chia sẻ quyền truy cập với gia đình không?',
    answer:
      'Có. Trong ứng dụng, bạn có thể mời thêm các thành viên trong hộ gia đình - họ sẽ có tài khoản riêng và cùng xem được sản lượng điện tạo ra và mức tiêu thụ.',
  },
  {
    category: 'warranty',
    question: 'Chế độ bảo hành bao gồm những gì?',
    answer:
      'TBD — Thời hạn và phạm vi bảo hành chính thức cho sản phẩm, hiệu suất tấm quang năng và tay nghề lắp đặt (chờ xác nhận).',
  },
  {
    category: 'warranty',
    question: 'Bảo hành có được chuyển nhượng nếu tôi bán nhà không?',
    answer:
      'Có. Bảo hành đi theo hệ thống. Vui lòng thông báo cho chúng tôi về việc thay đổi chủ sở hữu để chúng tôi cập nhật hồ sơ.',
  },
  {
    category: 'troubleshooting',
    question: 'Hệ thống của tôi ngừng phát điện - tôi nên kiểm tra gì?',
    answer:
      'Trước tiên, hãy kiểm tra cảnh báo trong Ứng dụng giám sát, sau đó xác nhận màn hình bộ biến tần vẫn sáng. Nếu cả hai đều bình thường, hãy gửi yêu cầu dịch vụ và chúng tôi sẽ phản hồi theo thời gian phản hồi chính thức.',
  },
]

export interface SupportContactChannel {
  label: string
  value: string
  href: string
  description?: ReactNode
}

export const supportContactChannels: SupportContactChannel[] = [
  {
    label: 'Email',
    value: 'vn@solavita.com',
    href: 'mailto:vn@solavita.com',
    description: 'TBD — Thời gian phản hồi chính thức (chờ xác nhận).',
  },
  {
    label: 'WhatsApp',
    // Visible label hides the digits until business supplies a
    // verified Vietnamese number; the `wa.me` link carries the user-
    // provided handoff number so the click target still routes
    // correctly. Same convention as components/Footer.tsx + lib/data/contact.tsx.
    value: 'WhatsApp',
    href: 'https://wa.me/8618500875025',
    description: (
      <>
        Nhấn để trò chuyện · TBD — Giờ làm việc chính thức (chờ xác nhận).
        <br />
        Không dùng WhatsApp?{' '}
        <a
          href="tel:+8618500875025"
          className="underline underline-offset-2 hover:text-uk-teal-dark font-cw-bold"
        >
          Gọi cho đội ngũ
        </a>
        .
      </>
    ),
  },
]
