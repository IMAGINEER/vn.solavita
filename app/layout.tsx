import type { Metadata } from 'next'
import './globals.css'
import ClientOnlyCookieConsent from '@/components/ClientOnlyCookieConsent'

export const metadata: Metadata = {
  metadataBase: new URL('https://solavita.uk'), // TODO: replace with the real production domain
  title: 'Solavita UK - Premium Solar & Battery Storage',
  description:
    'Solavita delivers premium solar panels and battery storage for UK homes. Two-week installation. MCS-certified. UK-wide support.',
  keywords:
    'solar panels UK, solar battery storage, photovoltaic, UK solar, MCS certified, Solavita, SKYWORTH, renewable energy UK, SEG, Smart Export Guarantee',
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Solavita UK - Power Your Home. Shape a Greener UK.',
    description:
      'Premium solar & storage for UK homes. Two-week turnaround.',
    locale: 'en_GB',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/favicon.ico" />
        {/* Pre-hydration theme bootstrap - must run before React paints to
           prevent flash-of-dark when the user has light-mode saved (or no
           preference, which defaults to light for the UK homepage). The
           source of truth is `document.documentElement` so FloatingButtons
           can toggle it from one place.
           Sets the legacy `.light-mode` class so the existing `.light-mode X`
           overrides keep firing, and (when dark) also sets `.dark` so the
           new `.dark X` overrides + Tailwind v4 `dark:` utilities activate. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('theme');if(t==='light'||t===null){document.documentElement.classList.add('light-mode');}else{document.documentElement.classList.add('dark');}}catch(e){}",
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <ClientOnlyCookieConsent />
      </body>
    </html>
  )
}