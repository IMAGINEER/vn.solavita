import { ShieldCheck, Zap, BadgeCheck, Leaf, HardHat } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type {
  CertificationMark,
  ProductCertification,
} from '@/lib/data/products'

/**
 * Quality-system / certification tiles.
 *
 * Every standard the manufacturer publishes is shown as an icon tile
 * instead of a plain bullet list: the mark on top, the standard number
 * underneath, and a one-line Vietnamese note.
 *
 * Two marks are real artwork the manufacturer supplied
 * (`/images/TUV.png`, `/images/CE.png`). We hold no official artwork for
 * the IEC / ISO standards, so those use a generic drawn glyph that
 * stands for the idea (shield, bolt, badge, leaf, hard hat) — the
 * standard number is always spelled out, so a tile never depends on the
 * pictogram alone.
 */

const GENERIC_ICONS: Record<
  Exclude<CertificationMark, 'tuv' | 'ce'>,
  LucideIcon
> = {
  shield: ShieldCheck,
  zap: Zap,
  badge: BadgeCheck,
  leaf: Leaf,
  hardhat: HardHat,
}

const REAL_MARKS: Partial<
  Record<CertificationMark, { src: string; alt: string; className: string }>
> = {
  tuv: {
    src: '/images/TUV.png',
    alt: 'Được chứng nhận TÜV SÜD',
    className: 'h-8 w-auto',
  },
  ce: {
    src: '/images/CE.png',
    alt: 'Dấu CE',
    className: 'h-6 w-auto',
  },
}

export default function CertificationGrid({
  title,
  items,
}: {
  title: string
  items: ProductCertification[]
}) {
  return (
    <div>
      <h3 className="text-xs font-cw-bold text-uk-slate uppercase tracking-wider">
        {title}
      </h3>
      <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => {
          const real = REAL_MARKS[item.mark]
          const Icon = GENERIC_ICONS[item.mark as keyof typeof GENERIC_ICONS]
          return (
            <li
              key={item.code}
              className="flex flex-col items-center text-center rounded-2xl border border-uk-line bg-white p-5"
            >
              <div className="w-14 h-14 rounded-xl bg-uk-teal-soft flex items-center justify-center">
                {real ? (
                  <img
                    src={real.src}
                    alt={real.alt}
                    className={real.className}
                    loading="lazy"
                  />
                ) : (
                  <Icon
                    className="w-7 h-7 text-uk-teal-dark"
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                )}
              </div>
              <div className="mt-3 text-sm font-cw-bold text-uk-navy leading-snug">
                {item.code}
              </div>
              <div className="mt-1 text-xs text-uk-slate font-cw-regular leading-relaxed">
                {item.note}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
