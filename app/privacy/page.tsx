import PrivacyPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  webPageJsonLd,
  breadcrumbJsonLd,
} from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  title: 'Chính sách bảo mật',
  path: '/privacy',
  description:
    'Cách Solavita thu thập, sử dụng, lưu trữ và chia sẻ thông tin cá nhân, phù hợp với pháp luật hiện hành về bảo vệ dữ liệu cá nhân.',
})

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: '/privacy',
            name: 'Chính sách bảo mật Solavita',
            description:
              'Cách Solavita thu thập, sử dụng, lưu trữ và chia sẻ thông tin cá nhân, phù hợp với pháp luật hiện hành về bảo vệ dữ liệu cá nhân.',
          }),
          breadcrumbJsonLd([
            { name: 'Trang chủ', url: '/' },
            { name: 'Chính sách bảo mật', url: '/privacy' },
          ]),
        ]}
      />
      <PrivacyPage />
    </>
  )
}