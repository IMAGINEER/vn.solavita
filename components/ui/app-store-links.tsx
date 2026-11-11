import { cn } from '@/lib/utils'

/**
 * AppStoreLinks — the App Store + Google Play download buttons for the
 * Solavita monitoring app.
 *
 * Shared by every surface that offers the app download: the
 * monitoring-app page (`PhoneShowcase`), the homepage monitoring
 * section, and the "ONE SCREEN. FULL CONTROL." advantage band on
 * /solutions/home-solar — where the buttons sit inside the band, next
 * to the copy they belong to. Keeping one copy means the store URLs and
 * the button treatment only have to change in one place.
 */
export default function AppStoreLinks({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap gap-3 justify-center', className)}>
      <a
        href="https://apps.apple.com/us/app/skyworth-pv/id6499499800"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="App Store download"
        className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-uk-teal-soft border border-uk-teal/30 hover:bg-uk-teal-soft/80 hover:border-uk-teal/60 transition-colors"
      >
        <svg
          className="w-6 h-6 text-uk-navy"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
        <div className="text-left">
          <div className="text-[10px] text-uk-slate font-cw-regular">
            Download on the
          </div>
          <div className="text-sm font-cw-bold text-uk-navy">App Store</div>
        </div>
      </a>

      <a
        href="https://play.google.com/store/apps/details?id=com.solavita.cloud"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Google Play download"
        className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-uk-teal-soft border border-uk-teal/30 hover:bg-uk-teal-soft/80 hover:border-uk-teal/60 transition-colors"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.302 2.302-8.636-8.634z"
            fill="#00B9EE"
          />
        </svg>
        <div className="text-left">
          <div className="text-[10px] text-uk-slate font-cw-regular">
            Get it on
          </div>
          <div className="text-sm font-cw-bold text-uk-navy">Google Play</div>
        </div>
      </a>
    </div>
  )
}