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
  title: 'Monitoring App · Smart Home Energy',
  path: '/monitoring-app',
  description:
    'The Solavita Monitoring App puts your solar, battery and home energy in one place — generation, consumption, scheduling and alerts.',
  ogImage: '/images/hero-monitoring-app.webp',
  ogImageAlt:
    'Solavita Monitoring App - generation, consumption, scheduling and alerts for solar and battery storage',
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
            name: 'Solavita Monitoring App',
            description:
              'The Solavita Monitoring App puts your solar, battery and home energy in one place - generation, consumption, scheduling and alerts.',
          }),
          softwareApplicationJsonLd({
            name: 'Solavita Monitoring App',
            featureList: featureTitles,
            free: true,
          }),
          breadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: 'Monitoring App', url: '/monitoring-app' },
          ]),
        ]}
      />
      <MonitoringAppPage />
    </>
  )
}