import MonitoringAppPage from './PageClient'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  webPageJsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
} from '@/lib/seo/jsonld'
import { monitoringAppFeatures } from '@/lib/data/monitoring-app'

export const metadata = buildPageMetadata({
  title: 'Ứng dụng giám sát · Năng lượng thông minh cho ngôi nhà',
  path: '/monitoring-app',
  description:
    'Ứng dụng giám sát Solavita đưa điện mặt trời, pin lưu trữ và năng lượng trong nhà về cùng một nơi — sản lượng, mức tiêu thụ, lịch trình vận hành và cảnh báo.',
  ogImage: '/images/og-monitoring-app.jpg',
  ogImageAlt:
    'Ứng dụng giám sát Solavita - sản lượng, mức tiêu thụ, lịch trình vận hành và cảnh báo cho điện mặt trời và pin lưu trữ',
})

export default function Page() {
  // Pull feature titles straight from `lib/data/monitoring-app` so the schema
  // stays in lockstep with `components/monitoring-app/FeaturesGrid.tsx`. The
  // Monitoring App ships bundled with every Solavita system - no
  // separate price.
  const featureTitles = monitoringAppFeatures.map((f) => f.title)

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: '/monitoring-app',
            name: 'Ứng dụng giám sát Solavita',
            description:
              'Ứng dụng giám sát Solavita đưa điện mặt trời, pin lưu trữ và năng lượng trong nhà về cùng một nơi - sản lượng, mức tiêu thụ, lịch trình vận hành và cảnh báo.',
          }),
          softwareApplicationJsonLd({
            name: 'Ứng dụng giám sát Solavita',
            featureList: featureTitles,
            free: true,
          }),
          breadcrumbJsonLd([
            { name: 'Trang chủ', url: '/' },
            { name: 'Ứng dụng giám sát', url: '/monitoring-app' },
          ]),
        ]}
      />
      <MonitoringAppPage />
    </>
  )
}