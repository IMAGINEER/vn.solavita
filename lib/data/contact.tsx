/**
 * Contact Us page data — Vietnam.
 *
 *   - 5 selectable enquiry categories (Section 2)
 *   - All contact channels (phone, email, address, hours) are TBD until
 *     business supplies verified Vietnamese contact details
 *
 * Every TBD is surfaced in red on the website through the
 * `components/ui/tbd-text.tsx` component.
 */

import type { ReactNode } from 'react'

export type ContactSubjectId =
  | 'residential'
  | 'small-commercial'
  | 'existing-system'
  | 'installer-partner'
  | 'other'

export interface ContactSubject {
  id: ContactSubjectId
  label: string
  description?: string
}

export const contactSubjects: ContactSubject[] = [
  {
    id: 'residential',
    label: 'Hệ thống điện mặt trời cho hộ gia đình',
    description:
      'Gói điện mặt trời và pin lưu trữ cho gia đình — bao gồm mạch điện thiết yếu, điều hoà và thiết bị sinh hoạt hằng ngày.',
  },
  {
    id: 'small-commercial',
    label: 'Hệ thống điện mặt trời cho doanh nghiệp nhỏ',
    description:
      'Điện mặt trời và lưu trữ cho cửa hàng, văn phòng, nhà hàng hoặc công trình thương mại quy mô nhỏ.',
  },
  {
    id: 'existing-system',
    label: 'Hỗ trợ hệ thống đã lắp đặt',
    description:
      'Bạn đã có hệ thống Solavita và cần hỗ trợ về giám sát, pin lưu trữ hoặc bảo trì.',
  },
  {
    id: 'installer-partner',
    label: 'Hợp tác lắp đặt',
    description:
      'Bạn là đơn vị lắp đặt hoặc nhà cung cấp dịch vụ điện muốn hợp tác cùng chúng tôi.',
  },
  {
    id: 'other',
    label: 'Yêu cầu khác',
    description: 'Hãy cho chúng tôi biết bạn đang cần gì.',
  },
]

export interface ContactChannel {
  label: string
  value: string
  href: string
  description?: ReactNode
  icon: 'mail' | 'phone' | 'map-pin'
}

export const contactChannels: ContactChannel[] = [
  {
    label: 'Email',
    value: 'vn@solavita.com',
    href: 'mailto:vn@solavita.com',
    description: 'Phản hồi trong vòng một ngày làm việc.',
    icon: 'mail',
  },
  {
    label: 'WhatsApp',
    // Visible label hides the digits until a verified Vietnamese
    // number is supplied. The wa.me link below carries the
    // user-provided handoff number so the click target still routes
    // correctly.
    value: 'WhatsApp',
    href: 'https://wa.me/8618500875025',
    description:
      'TBD — Giờ làm việc và khung giờ hỗ trợ WhatsApp tại Việt Nam (chờ xác nhận).',
    icon: 'phone',
  },
  {
    label: 'Văn phòng',
    value: 'TBD — Địa chỉ văn phòng tại Việt Nam (chờ xác nhận)',
    href: 'https://maps.google.com/',
    description: 'TBD — Văn phòng đăng ký và khu vực phục vụ (chờ xác nhận).',
    icon: 'map-pin',
  },
]

/** Salutation options - mirrors the existing Consultation form. */
export const contactSalutations = [
  { value: '', label: 'Danh xưng' },
  { value: 'Anh', label: 'Anh' },
  { value: 'Chị', label: 'Chị' },
  { value: 'Ông', label: 'Ông' },
  { value: 'Bà', label: 'Bà' },
  { value: 'Khác', label: 'Khác' },
] as const