/**
 * Contact Us page data — Vietnam.
 *
 *   - 5 selectable enquiry categories (Section 2)
 *   - Two published contact channels: the Vietnam email address and
 *     the WhatsApp handoff line.
 *
 * There is deliberately no phone or office card: the number on the
 * business registration certificate is the legal representative's
 * personal contact, not a customer-facing business line, and the
 * registered office is already printed in the footer and legal pages.
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
      'Trao đổi trực tiếp với đội ngũ Solavita Việt Nam trên WhatsApp.',
    icon: 'phone',
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