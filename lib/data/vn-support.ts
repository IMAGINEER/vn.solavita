/**
 * Support page data — Vietnam.
 *
 * Built from the Vietnam content brief. The source file held a flat list
 * of "what you can do" cards (App, Warranty, Service Request, ...). The
 * VN version keeps the same card shape (for visual parity) but every
 * title / description is VN-shaped and every operational claim
 * (warranty, data-protection, service request) is surfaced as a TBD
 * until business confirms the actual offering.
 */

export interface VnSupportItem {
  icon:
    | 'app'
    | 'warranty'
    | 'service'
    | 'knowledge'
    | 'contact'
    | 'compliance'
    | 'privacy'
    | 'terms'
  title: string
  description: string
}

export const vnSupportItems: VnSupportItem[] = [
  {
    icon: 'app',
    title: 'Ứng dụng giám sát',
    description:
      'TBD — Liên kết tải Ứng dụng giám sát và các khu vực hỗ trợ tại Việt Nam (chờ xác nhận).',
  },
  {
    icon: 'warranty',
    title: 'Bảo hành',
    description:
      'TBD — Điều khoản bảo hành đã được phê duyệt cho tấm quang năng, bộ biến tần, pin lưu trữ và tay nghề lắp đặt (chờ xác nhận).',
  },
  {
    icon: 'service',
    title: 'Yêu cầu dịch vụ',
    description:
      'TBD — Kênh hỗ trợ khách hàng, giờ làm việc và quy trình xử lý tại Việt Nam (chờ xác nhận).',
  },
  {
    icon: 'knowledge',
    title: 'Kho kiến thức',
    description:
      'TBD — Hướng dẫn, tài liệu và trung tâm tải xuống tại Việt Nam (chờ xác nhận).',
  },
  {
    icon: 'contact',
    title: 'Liên hệ',
    description:
      'TBD — Kênh email, WhatsApp và điện thoại đã xác minh tại Việt Nam (chờ xác nhận).',
  },
  {
    icon: 'compliance',
    title: 'Bảo vệ dữ liệu',
    description:
      'TBD — Cam kết bảo vệ dữ liệu theo quy định bảo vệ dữ liệu cá nhân tại Việt Nam (chờ xác nhận).',
  },
  {
    icon: 'privacy',
    title: 'An toàn & Riêng tư',
    description:
      'TBD — Thực tiễn bảo mật và quyền riêng tư đã được xác nhận (chờ xác nhận).',
  },
  {
    icon: 'terms',
    title: 'Điều khoản minh bạch',
    description:
      'TBD — Chính sách bằng văn bản đã được phê duyệt (điều khoản, quyền riêng tư, cookie) (chờ xác nhận).',
  },
]

/**
 * Support FAQ data — built from the Vietnam content brief, Section 2.
 * Five sub-groups (Choosing a System, Solar Panels and Generation,
 * Batteries and Backup, Installation and Warranty, Pricing and
 * Payments). Every answer is either a verified prose answer or a
 * `TBD — …` string surfaced directly by the page.
 */

export interface SupportFaqGroup {
  id: string
  title: string
  items: SupportFaqItem[]
}

export interface SupportFaqItem {
  q: string
  /** Plain text or JSX containing missing-answer markers. */
  a: string
}

export const supportFaqGroups: SupportFaqGroup[] = [
  {
    id: 'choosing-a-system',
    title: 'Chọn hệ thống',
    items: [
      {
        q: 'Làm sao để chọn đúng giải pháp?',
        a: 'Hãy bắt đầu với các thiết bị bạn cần sử dụng, công suất định mức của chúng, thời gian dùng mỗi ngày và thời gian dự phòng bạn cần. Phần mô tả giải pháp chỉ là điểm khởi đầu; một buổi đánh giá phụ tải phù hợp sẽ xác nhận hệ thống cuối cùng.',
      },
      {
        q: 'Bộ biến tần lớn hơn có luôn tốt hơn không?',
        a: 'Không hẳn. Bộ biến tần phải đáp ứng tổng công suất vận hành và dòng khởi động của các thiết bị bạn dự định sử dụng. Dung lượng pin và sản lượng điện mặt trời cũng phải phù hợp với nhu cầu của bạn.',
      },
    ],
  },
  {
    id: 'solar-panels-and-generation',
    title: 'Tấm quang năng và sản lượng điện',
    items: [
      {
        q: 'Hệ thống của tôi sẽ tạo ra bao nhiêu điện?',
        a: 'Trang giải pháp cung cấp ước tính sản lượng điện hàng năm sơ bộ. Sản lượng thực tế thay đổi theo vị trí, điều kiện nắng, bóng che, thiết kế lắp đặt và tổn thất của hệ thống.',
      },
      {
        q: 'Hệ thống có hoạt động vào những ngày nhiều mây không?',
        a: 'Sản lượng điện mặt trời thay đổi theo điều kiện ánh sáng. Pin lưu trữ có thể cung cấp điện khi sản lượng mặt trời không đủ, nhưng lượng điện dự phòng khả dụng phụ thuộc vào năng lượng đã lưu và phụ tải đang kết nối.',
      },
    ],
  },
  {
    id: 'batteries-and-backup',
    title: 'Pin lưu trữ và điện dự phòng',
    items: [
      {
        q: 'Pin của tôi dùng được bao lâu khi mất điện?',
        a: 'Thời gian dự phòng phụ thuộc vào dung lượng pin khả dụng và các thiết bị đang tiêu thụ điện. Phụ tải càng lớn thì năng lượng lưu trữ được dùng càng nhanh.',
      },
      {
        q: 'Tôi có thể chạy điều hòa không?',
        a: 'Điều này phụ thuộc vào công suất tiêu thụ, dòng khởi động của điều hòa, công suất bộ biến tần và các thiết bị khác đang hoạt động đồng thời. Hãy xác nhận khả năng tương thích trước khi lắp đặt.',
      },
      {
        q: 'Tôi có thể giữ hệ thống điện hiện có của mình không?',
        a: 'Hệ thống điện mặt trời và pin lưu trữ có thể giúp giảm phụ thuộc vào lưới điện. Việc tích hợp với hệ thống điện hiện có phụ thuộc vào thiết bị và thiết kế lắp đặt.',
      },
    ],
  },
  {
    id: 'installation-and-warranty',
    title: 'Lắp đặt và bảo hành',
    items: [
      {
        q: 'Giải pháp có bao gồm lắp đặt không?',
        a: 'TBD — Phạm vi bao gồm/không bao gồm, quy trình khảo sát tại chỗ và khả năng lắp đặt (chờ xác nhận).',
      },
      {
        q: 'Chế độ bảo hành như thế nào?',
        a: 'TBD — Điều khoản bảo hành đã được phê duyệt cho tấm quang năng, bộ biến tần, pin lưu trữ và tay nghề lắp đặt (chờ xác nhận).',
      },
      {
        q: 'Lắp đặt có sẵn ở những đâu?',
        a: 'TBD — Phạm vi phục vụ lắp đặt tại Việt Nam (chờ xác nhận).',
      },
    ],
  },
  {
    id: 'pricing-and-payments',
    title: 'Giá và thanh toán',
    items: [
      {
        q: 'Một hệ thống có giá bao nhiêu?',
        a: 'TBD — Giá giải pháp đã được phê duyệt tại Việt Nam. Hãy yêu cầu báo giá theo nhu cầu của bạn.',
      },
      {
        q: 'Có hình thức trả góp không?',
        a: 'TBD — Nhà cung cấp tài chính, điều khoản thanh toán, phí, điều kiện và phạm vi địa lý đã được xác minh. Không quảng cáo PAYGo, thanh toán hàng tháng, trợ cấp hay tài chính cho đến khi ưu đãi thực tế được phê duyệt.',
      },
    ],
  },
]