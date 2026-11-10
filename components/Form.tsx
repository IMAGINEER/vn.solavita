import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronLeft, ChevronRight, Loader2, BadgeCheck } from 'lucide-react';
import type { FormData } from '@/lib/form-types';

// ============ PERSON ICONS ============
const PersonIcon = ({ count }: { count: number }) => (
  <div className="flex items-center justify-center gap-0.5">
    {Array.from({ length: Math.min(count, 5) }).map((_, i) => (
      <svg key={i} viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <circle cx="12" cy="8" r="4"/>
        <path d="M12 14c-5 0-8 2.5-8 5v1h16v-1c0-2.5-3-5-8-5z"/>
      </svg>
    ))}
    {count > 5 && <span className="text-sm ml-1">+</span>}
  </div>
);

/* ──────────────────────────────────────────────────────────────────────
   Option pictograms.

   Every answer card carries one of these. They follow the same drawing
   system as the DE site's consultation form (components/Form.tsx there):
   an 80×80 box of flat line art — 2px outlines, 1.5px interior detail,
   1px/opacity-.6 hints — rendered at 64px (`w-16 h-16`) inside the card.
   Drawing them on the 80 grid and rendering them large is what makes the
   shapes read as architecture instead of cramped glyphs; the earlier
   40×40 / 32px set lost its detail at the size the cards actually use.

   The frame forwards `className` so CardSelect owns the size.
   ────────────────────────────────────────────────────────────────────── */

type OptionIconProps = React.SVGProps<SVGSVGElement>

const LineIcon = ({ children, ...rest }: OptionIconProps) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
    {children}
  </svg>
)

/* Step 1 — solution type. */

/** Detached house with an array on the roof pitch. */
const HomeSolarIcon = (p: OptionIconProps) => (
  <LineIcon {...p}>
    <path d="M40 12L9 37v29h62V37L40 12Z" stroke="currentColor" strokeWidth="2" />
    <path d="M40 12L5 40M40 12l35 28" stroke="currentColor" strokeWidth="2" />
    <rect x="17" y="25" width="12" height="7" stroke="currentColor" strokeWidth="1" opacity=".65" transform="rotate(-39 23 28.5)" />
    <rect x="26" y="18" width="12" height="7" stroke="currentColor" strokeWidth="1" opacity=".65" transform="rotate(-39 32 21.5)" />
    <rect x="34" y="46" width="14" height="20" stroke="currentColor" strokeWidth="1.5" />
    <rect x="19" y="42" width="11" height="9" stroke="currentColor" strokeWidth="1.5" />
    <rect x="52" y="42" width="11" height="9" stroke="currentColor" strokeWidth="1.5" />
  </LineIcon>
)

/** Solar module mounted on a balcony railing. */
const BalconySolarIcon = (p: OptionIconProps) => (
  <LineIcon {...p}>
    <path d="M18 44L52 26l12 10-34 18z" stroke="currentColor" strokeWidth="2" />
    <path d="M35 35l12 10M24 49l34-18" stroke="currentColor" strokeWidth="1" opacity=".65" />
    <path d="M8 56h64M8 68h64" stroke="currentColor" strokeWidth="2" />
    <path d="M16 56v12M27 56v12M38 56v12M49 56v12M60 56v12" stroke="currentColor" strokeWidth="1.5" />
  </LineIcon>
)

/** Commercial building with a rooftop array. */
const BusinessSolarIcon = (p: OptionIconProps) => (
  <LineIcon {...p}>
    <rect x="10" y="34" width="20" height="30" stroke="currentColor" strokeWidth="2" />
    <rect x="30" y="24" width="26" height="40" stroke="currentColor" strokeWidth="2" />
    <rect x="56" y="42" width="14" height="22" stroke="currentColor" strokeWidth="2" />
    <path d="M6 64h68" stroke="currentColor" strokeWidth="2" />
    <path d="M33 20v-4h8v4M45 20v-4h8v4" stroke="currentColor" strokeWidth="1" opacity=".65" />
    <path d="M15 40h4M21 40h4M15 48h4M21 48h4M15 56h4M21 56h4" stroke="currentColor" strokeWidth="1.5" />
    <path d="M35 30h6M45 30h6M35 40h6M45 40h6M35 50h6M45 50h6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M61 48h4M61 56h4" stroke="currentColor" strokeWidth="1.5" />
  </LineIcon>
)

/** Unknown / still exploring / "other". */
const QuestionIcon = (p: OptionIconProps) => (
  <LineIcon {...p}>
    <circle cx="40" cy="40" r="27" stroke="currentColor" strokeWidth="2" />
    <path d="M30.3 30a10 10 0 0119.4 3.3c0 6.7-10 10-10 10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    <circle cx="40" cy="56.7" r="3" fill="currentColor" />
  </LineIcon>
)

/* Step 2 — property type. */

/** Townhouse / detached home on a street. */
const TownhouseIcon = (p: OptionIconProps) => (
  <LineIcon {...p}>
    <path d="M12 36L40 16l28 20" stroke="currentColor" strokeWidth="2" />
    <path d="M18 33v31h44V33" stroke="currentColor" strokeWidth="2" />
    <path d="M8 64h64" stroke="currentColor" strokeWidth="2" />
    <rect x="34" y="48" width="12" height="16" stroke="currentColor" strokeWidth="1.5" />
    <rect x="23" y="40" width="9" height="8" stroke="currentColor" strokeWidth="1.5" />
    <rect x="48" y="40" width="9" height="8" stroke="currentColor" strokeWidth="1.5" />
  </LineIcon>
)

/** Apartment tower. */
const ApartmentIcon = (p: OptionIconProps) => (
  <LineIcon {...p}>
    <rect x="22" y="12" width="36" height="52" stroke="currentColor" strokeWidth="2" />
    <rect x="27" y="19" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
    <rect x="46" y="19" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
    <rect x="27" y="31" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
    <rect x="46" y="31" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
    <rect x="27" y="43" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
    <rect x="46" y="43" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
    <rect x="35" y="54" width="10" height="10" stroke="currentColor" strokeWidth="1.5" />
    <path d="M14 64h52" stroke="currentColor" strokeWidth="2" />
  </LineIcon>
)

/** Shop / small business with an awning. */
const StorefrontIcon = (p: OptionIconProps) => (
  <LineIcon {...p}>
    <path d="M14 30L20 18h40l6 12" stroke="currentColor" strokeWidth="2" />
    <path d="M20 18v12M30 18v12M40 18v12M50 18v12M60 18v12" stroke="currentColor" strokeWidth="1" opacity=".5" />
    <path d="M14 30h52" stroke="currentColor" strokeWidth="2" />
    <path d="M16 30v34h48V30" stroke="currentColor" strokeWidth="2" />
    <rect x="34" y="48" width="12" height="16" stroke="currentColor" strokeWidth="1.5" />
    <rect x="22" y="38" width="10" height="8" stroke="currentColor" strokeWidth="1.5" />
    <rect x="48" y="38" width="10" height="8" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10 64h60" stroke="currentColor" strokeWidth="2" />
  </LineIcon>
)

/* Step 3 — monthly consumption + daytime share. */

/**
 * Battery filled to `level` quarters. A framed body gives the fill a
 * meaning ("how much electricity") that bare bars don't, and the four
 * steps stay distinguishable at card size.
 */
const UsageBarsIcon = ({ level, ...p }: { level: 1 | 2 | 3 | 4 } & OptionIconProps) => (
  <LineIcon {...p}>
    <rect x="10" y="26" width="52" height="30" rx="4" stroke="currentColor" strokeWidth="2" />
    <rect x="64" y="36" width="7" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
    {[0, 1, 2, 3].map((i) => (
      <rect
        key={i}
        x={16 + i * 11}
        y="31"
        width="8"
        height="20"
        rx="1.5"
        fill={level > i ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.5"
        opacity={level > i ? 1 : 0.28}
      />
    ))}
  </LineIcon>
)

const UsageLowIcon = (p: OptionIconProps) => <UsageBarsIcon level={1} {...p} />
const UsageMediumIcon = (p: OptionIconProps) => <UsageBarsIcon level={2} {...p} />
const UsageHighIcon = (p: OptionIconProps) => <UsageBarsIcon level={3} {...p} />
const UsageVeryHighIcon = (p: OptionIconProps) => <UsageBarsIcon level={4} {...p} />

/** Crescent moon — demand happens after dark. */
const MoonIcon = (p: OptionIconProps) => (
  <LineIcon {...p}>
    <path d="M40 10a20 20 0 0030 30 30 30 0 11-30-30Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </LineIcon>
)

/** Sun on the horizon — a little daytime use. */
const SunriseIcon = (p: OptionIconProps) => (
  <LineIcon {...p}>
    <path d="M40 32V22M29.6 44.4L22 36.8M50.4 44.4L58 36.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 54a16 16 0 0132 0" stroke="currentColor" strokeWidth="2" />
    <path d="M10 54h60" stroke="currentColor" strokeWidth="2" />
    <path d="M18 64h44" stroke="currentColor" strokeWidth="1.5" opacity=".4" />
  </LineIcon>
)

/** Full sun — roughly half the use is during daylight. */
const SunIcon = (p: OptionIconProps) => (
  <LineIcon {...p}>
    <circle cx="40" cy="40" r="14" stroke="currentColor" strokeWidth="2" />
    <path d="M40 12v8M40 60v8M12 40h8M60 40h8M18 18l6 6M56 56l6 6M62 18l-6 6M24 56l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </LineIcon>
)

/** Strong sun — most use happens while the array is producing. */
const BrightSunIcon = (p: OptionIconProps) => (
  <LineIcon {...p}>
    <circle cx="40" cy="40" r="17" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="40" cy="40" r="6" fill="currentColor" opacity=".55" />
    <path d="M40 8v6M40 66v6M8 40h6M66 40h6M17.4 17.4l4.2 4.2M58.4 58.4l4.2 4.2M62.6 17.4l-4.2 4.2M21.6 58.4l-4.2 4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </LineIcon>
)

/* Step 4 — roof type. */

/** Flat concrete roof with a low parapet and panels. */
const FlatRoofIcon = (p: OptionIconProps) => (
  <LineIcon {...p}>
    <rect x="12" y="34" width="56" height="5" stroke="currentColor" strokeWidth="2" />
    <rect x="12" y="39" width="56" height="25" stroke="currentColor" strokeWidth="2" />
    <path d="M20 34v-8h11v8M36 34v-8h11v8M52 34v-8h11v8" stroke="currentColor" strokeWidth="1" opacity=".65" />
  </LineIcon>
)

/** Pitched tile roof — courses run parallel to the eave. */
const TileRoofIcon = (p: OptionIconProps) => (
  <LineIcon {...p}>
    <path d="M8 38L40 14l32 24" stroke="currentColor" strokeWidth="2" />
    <path d="M14 33h52M20 28h40M27 23h26" stroke="currentColor" strokeWidth="1.2" opacity=".55" />
    <rect x="12" y="38" width="56" height="26" stroke="currentColor" strokeWidth="2" />
  </LineIcon>
)

/** Corrugated metal roof — seams run down the pitch. */
const MetalRoofIcon = (p: OptionIconProps) => (
  <LineIcon {...p}>
    <path d="M8 38L40 14l32 24" stroke="currentColor" strokeWidth="2" />
    <path d="M16 38V32M24 38V26M32 38V20M40 38V14M48 38V20M56 38V26M64 38V32" stroke="currentColor" strokeWidth="1" opacity=".6" />
    <rect x="12" y="38" width="56" height="26" stroke="currentColor" strokeWidth="2" />
  </LineIcon>
)

/** Balcony — railing on a slab, with nothing overhead. */
const NoRoofIcon = (p: OptionIconProps) => (
  <LineIcon {...p}>
    <path d="M12 28h56M12 60h56" stroke="currentColor" strokeWidth="2" />
    <path d="M12 28v32M68 28v32" stroke="currentColor" strokeWidth="2" />
    <path d="M20 28v32M28 28v32M36 28v32M44 28v32M52 28v32M60 28v32" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 66h68" stroke="currentColor" strokeWidth="2" />
  </LineIcon>
)

// ============ FORM DATA ============

const REGIONS = [
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'Bình Dương',
  'Đồng Nai',
  'Bà Rịa - Vũng Tàu',
  'Quảng Ninh',
  'Khánh Hòa',
  'Nghệ An',
  'Thanh Hóa',
  'Thừa Thiên Huế',
  'Lâm Đồng',
  'Tỉnh / thành khác',
];

/* ──────────────────────────────────────────────────────────────────────
   Step 1 — solution type. `balcony` is the SolaMate line; it maps to the
   `solution_type` CHECK value added on 2026-11-06.
   ────────────────────────────────────────────────────────────────────── */

const SOLUTION_TYPES = [
  { id: 'balcony', label: 'Điện mặt trời ban công', icon: BalconySolarIcon },
  { id: 'home', label: 'Điện mặt trời cho gia đình', icon: HomeSolarIcon },
  { id: 'business', label: 'Điện mặt trời cho doanh nghiệp', icon: BusinessSolarIcon },
  { id: 'exploring', label: 'Chưa chắc chắn / Đang tìm hiểu', icon: QuestionIcon },
];

/* Step 2 — property type. */
const PROPERTY_TYPES = [
  { id: 'detached-semi', label: 'Nhà phố / Nhà riêng', icon: TownhouseIcon },
  { id: 'terraced-apt', label: 'Căn hộ / Chung cư', icon: ApartmentIcon },
  { id: 'commercial', label: 'Cửa hàng / Doanh nghiệp', icon: StorefrontIcon },
  { id: 'others', label: 'Khác', icon: QuestionIcon },
];

/* Step 3 — household size. */
const HOUSEHOLD_SIZES = [
  { id: '1', label: '1 người', count: 1 },
  { id: '2', label: '2 người', count: 2 },
  { id: '3', label: '3 người', count: 3 },
  { id: '4', label: '4 người', count: 4 },
  { id: '5+', label: '5+ người', count: 5 },
];

/**
 * Step 3 — monthly electricity consumption.
 *
 * The IDs are the legacy `ConsumptionTier` values (`low` … `unknown`) so
 * the /my-plan sizing engine keeps working unchanged. The labels are now
 * monthly kWh bands, which is what the customer can actually read off
 * their EVN bill. Band midpoints roughly line up with the yearly figures
 * in `USAGE_KWH_PER_YEAR`.
 */
const ELECTRICITY_USAGE = [
  { id: 'low', label: '< 200 kWh/tháng', description: 'Mức dùng thấp', icon: UsageLowIcon },
  { id: 'medium', label: '200 – 400 kWh/tháng', description: 'Mức dùng trung bình', icon: UsageMediumIcon },
  { id: 'high', label: '400 – 700 kWh/tháng', description: 'Mức dùng cao', icon: UsageHighIcon },
  { id: 'very-high', label: 'Trên 700 kWh/tháng', description: 'Mức dùng rất cao', icon: UsageVeryHighIcon },
  // Sentinel id for the "I don't know" answer. Stored as its own value;
  // the sizing engine already maps `unknown` to a neutral tier.
  { id: 'unknown', label: 'Chưa rõ', description: 'Để Solavita tư vấn', icon: QuestionIcon },
];

/* Step 3 — share of electricity used during daylight. */
const DAYTIME_RATIOS = [
  { id: 'under-30', label: 'Dưới 30%', description: 'Chủ yếu dùng buổi tối', icon: MoonIcon },
  { id: '30-50', label: '30 – 50%', description: 'Ban ngày dùng vừa phải', icon: SunriseIcon },
  { id: '50-70', label: '50 – 70%', description: 'Phần lớn dùng ban ngày', icon: SunIcon },
  { id: 'over-70', label: 'Trên 70%', description: 'Gần như cả ngày', icon: BrightSunIcon },
  { id: 'unknown', label: 'Chưa rõ', description: 'Để Solavita tư vấn', icon: QuestionIcon },
];

/* Step 4 — roof type. `none` covers balcony installs, which have no roof. */
const ROOF_TYPES = [
  { id: 'flat', label: 'Mái bằng bê tông', icon: FlatRoofIcon },
  { id: 'tile', label: 'Mái ngói', icon: TileRoofIcon },
  { id: 'metal', label: 'Mái tôn / kim loại', icon: MetalRoofIcon },
  { id: 'none', label: 'Ban công, không có mái', icon: NoRoofIcon },
  { id: 'other', label: 'Loại khác', icon: QuestionIcon },
];

// ============ STEP COMPONENT ============
// 5-step public form:
//   1. solution type   (balcony / home / business / exploring)
//   2. city + property type
//   3. household size + monthly usage + daytime ratio
//   4. roof type
//   5. contact info
// The compressed Edit-details view (hideAddressAndContact) hides
// steps 1 and 5 and appends a review step, so it shows 4 dots.
const TOTAL_STEPS = 5

const StepIndicator = ({ current, total }: { current: number; total: number }) => (
  <div className="flex items-center justify-center gap-2 mb-8">
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} className="flex items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
            i < current
              ? 'bg-[#0F766E] text-white'
              : i === current
              ? 'bg-[#0F766E] text-white ring-4 ring-[#0F766E]/20'
              : 'bg-gray-200 text-gray-500'
          }`}
        >
          {i < current ? '✓' : i + 1}
        </div>
        {i < total - 1 && (
          <div className={`w-8 h-0.5 mx-1 transition-all duration-300 ${
            i < current ? 'bg-[#0F766E]' : 'bg-gray-200'
          }`}/>
        )}
      </div>
    ))}
  </div>
);

// ============ CARD SELECT ============
interface CardOption {
  id: string;
  label: string;
  icon?: React.ComponentType<OptionIconProps>;
  description?: string;
  emoji?: string;
  count?: number;
}

const CardSelect = ({
  options,
  selected,
  onSelect,
  columns = 4,
}: {
  options: CardOption[];
  selected: string;
  onSelect: (id: string) => void;
  columns?: number;
}) => (
  <div className={`grid grid-cols-2 ${
    columns === 5 ? 'md:grid-cols-5'
      : columns === 4 ? 'md:grid-cols-4'
      : columns === 3 ? 'md:grid-cols-3'
      : 'md:grid-cols-2'
  } gap-2.5`}>
    {options.map((opt) => {
      const isSelected = selected === opt.id;
      const Icon = opt.icon;
      return (
        <motion.button
          key={opt.id}
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(opt.id)}
          className={`relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 min-h-[120px] ${
            isSelected
              ? 'border-[#0F766E] bg-[#0F766E]/5 text-[#0F766E] shadow-md'
              : 'border-gray-200 bg-white hover:border-[#0F766E]/40 hover:bg-gray-50 text-gray-600'
          }`}
        >
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 w-5 h-5 bg-[#0F766E] rounded-full flex items-center justify-center"
            >
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </motion.div>
          )}
          {Icon && <Icon className="w-16 h-16" aria-hidden="true" />}
          {opt.emoji && <span className="text-2xl">{opt.emoji}</span>}
          {opt.count !== undefined && <PersonIcon count={opt.count} />}
          <span className="text-sm font-medium text-center leading-tight">{opt.label}</span>
          {opt.description && <span className="text-xs text-gray-400 leading-tight text-center">{opt.description}</span>}
        </motion.button>
      );
    })}
  </div>
);

// ============ MULTI-SELECT CARD ============
const MultiCardSelect = ({
  options,
  selected,
  onToggle,
}: {
  options: { id: string; label: string; icon: React.ComponentType<OptionIconProps> }[];
  selected: string[];
  onToggle: (id: string) => void;
}) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
    {options.map((opt) => {
      const isSelected = selected.includes(opt.id);
      const Icon = opt.icon;
      return (
        <motion.button
          key={opt.id}
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onToggle(opt.id)}
          className={`relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 min-h-[120px] ${
            isSelected
              ? 'border-[#0F766E] bg-[#0F766E]/5 text-[#0F766E] shadow-md'
              : 'border-gray-200 bg-white hover:border-[#0F766E]/40 hover:bg-gray-50 text-gray-600'
          }`}
        >
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 w-5 h-5 bg-[#0F766E] rounded-full flex items-center justify-center"
            >
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </motion.div>
          )}
          <Icon className="w-16 h-16" aria-hidden="true" />
          <span className="text-sm font-medium text-center leading-tight">{opt.label}</span>
        </motion.button>
      );
    })}
  </div>
);

// ============ REVIEW ROW ============
const ReviewRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-4 px-4 py-3">
    <dt className="text-sm text-gray-500">{label}</dt>
    <dd className="text-sm font-medium text-gray-800 text-right">{value}</dd>
  </div>
);

// ============ MAIN FORM COMPONENT ============
const DEFAULT_SUBMIT_URL = '/api/consultation'

const Form: React.FC<{
  onClose?: () => void
  initialData?: Partial<FormData>
  /**
   * When true, the form hides the solution step (already chosen at
   * registration) and the contact step (PII), so only city/property,
   * household/usage/daytime and roof render, followed by a review.
   * The Submit button shows on that review step. The StepIndicator is
   * recomputed so it shows 4 dots, not 5.
   *
   * Used by /my-plan "Edit details".
   */
  hideAddressAndContact?: boolean
  /**
   * Override the submit endpoint. Default `/api/consultation` (full
   * register-or-update with all 5 steps). For /my-plan's Edit-details
   * modal we use `/api/consultation/update`, which accepts the
   * non-PII fields and identifies the row by `plan_token`.
   */
  submitEndpoint?: string
  /**
   * Build the request body. Default sends the full FormData so the
   * existing /api/consultation contract is unchanged. Override for
   * endpoints that expect a slimmer payload.
   */
  submitPayload?: (formData: FormData) => unknown
  /** Visible label on the final Submit button. Default 'Submit'. */
  submitButtonLabel?: string
  /**
   * Fires after a successful submit, before the inline success screen.
   * The /my-plan host uses this to `window.location.reload()` so the
   * page re-fetches the row with the freshly-updated values.
   */
  onSubmitSuccess?: () => void
}> = ({
  onClose,
  initialData,
  hideAddressAndContact = false,
  submitEndpoint = DEFAULT_SUBMIT_URL,
  submitPayload,
  submitButtonLabel = 'Gửi thông tin',
  onSubmitSuccess,
}) => {
  // Compressed Edit-details view (hideAddressAndContact = true): the
  // public form's step 0 (solutionType — already chosen at
  // registration) and step 4 (contact info — PII, never surfaced) are
  // hidden. That leaves 3 data steps (city/property, household/usage,
  // roof) + 1 review step = 4 visible steps.
  //
  // `step` is the VISIBLE index. `publicStep` maps it back onto the
  // public form's numbering so the same step-content blocks render.
  // The compressed view's last visible step is the review, which has
  // no public-step equivalent (-1).
  const VISIBLE_TOTAL_STEPS = hideAddressAndContact ? 4 : TOTAL_STEPS
  const VISIBLE_LAST_STEP = VISIBLE_TOTAL_STEPS - 1
  const [step, setStep] = useState(0);
  // Defensive clamp: if the prop flips after mount (it doesn't in
  // practice - the modal is unmounted between opens), pull step back
  // into the visible range so we don't render an empty screen.
  useEffect(() => {
    setStep((s) => (s > VISIBLE_LAST_STEP ? VISIBLE_LAST_STEP : s))
  }, [VISIBLE_LAST_STEP])
  const publicStep =
    hideAddressAndContact && step === VISIBLE_LAST_STEP
      ? -1
      : step + (hideAddressAndContact ? 1 : 0)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState('');
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // optional
    const phoneRegex = /^[+]?[\d\s-()]{7,}$/;
    return phoneRegex.test(phone);
  };

  const validateStep = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Public-form step numbering (see `publicStep`). The compressed
    // Edit-details view reuses the same checks but skips step 0
    // (solutionType) and step 4 (contact) — see VISIBLE_TOTAL_STEPS /
    // VISIBLE_LAST_STEP at the top of the component.
    switch (publicStep) {
      case 0:
        // Step 1 — solutionType
        if (!formData.solutionType)
          newErrors.solutionType =
            'Vui lòng chọn loại giải pháp bạn quan tâm.'
        break;
      case 1:
        // Step 2 — city + propertyType
        if (!formData.city)
          newErrors.city = 'Vui lòng chọn tỉnh / thành phố của công trình.'
        if (!formData.propertyType)
          newErrors.propertyType = 'Vui lòng chọn loại công trình.'
        break;
      case 2:
        // Step 3 — householdSize + usage + daytime ratio
        if (!formData.householdSize)
          newErrors.householdSize = 'Vui lòng chọn số người trong hộ gia đình.'
        if (!formData.electricityUsage)
          newErrors.electricityUsage =
            'Vui lòng chọn mức điện năng tiêu thụ hằng tháng.'
        if (!formData.daytimeRatio)
          newErrors.daytimeRatio =
            'Vui lòng chọn tỷ lệ điện dùng vào ban ngày.'
        break;
      case 3:
        // Step 4 — roofType
        if (!formData.roofType)
          newErrors.roofType = 'Vui lòng chọn loại mái của công trình.'
        break;
      case 4:
        // Step 5 — contact info
        if (!formData.salutation) newErrors.salutation = 'Vui lòng chọn cách xưng hô.'
        if (!formData.firstName) newErrors.firstName = 'Vui lòng nhập tên.'
        if (!formData.lastName) newErrors.lastName = 'Vui lòng nhập họ.'
        if (!formData.email) {
          newErrors.email = 'Vui lòng nhập địa chỉ email.'
        } else if (!validateEmail(formData.email)) {
          newErrors.email = 'Vui lòng nhập địa chỉ email hợp lệ.'
        }
        if (formData.phone && !validatePhone(formData.phone)) {
          newErrors.phone = 'Vui lòng nhập số điện thoại hợp lệ.'
        }
        break;
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const clearErrors = () => {
    setErrors({});
  };
  const [formData, setFormData] = useState<FormData>(() => {
    // Lazy init so initialData is only consumed once on mount. Defaults
    // mirror FormData; missing fields fall back to the empty default so
    // a partial prefill (e.g. only city + householdSize) still leaves the
    // other fields blank instead of `undefined`.
    const defaults: FormData = {
      // Step 1
      solutionType: '',
      // Step 2
      city: '',
      propertyType: '',
      // Step 3 — household size + usage + daytime ratio, all required.
      householdSize: '',
      electricityUsage: '',
      daytimeRatio: '',
      // Step 4 — roof type, required.
      roofType: '',
      // Step 5
      salutation: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    };
    return initialData ? { ...defaults, ...initialData } : defaults;
  });

  const updateField = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = (): boolean => {
    // Compressed (hideAddressAndContact) view: the last visible step is
    // the Review step. It's always proceed-able; data correctness was
    // validated on the previous steps.
    if (publicStep === -1) return true
    switch (publicStep) {
      case 0: return !!formData.solutionType;
      case 1: return !!formData.city && !!formData.propertyType;
      case 2:
        return (
          !!formData.householdSize &&
          !!formData.electricityUsage &&
          !!formData.daytimeRatio
        );
      case 3: return !!formData.roofType;
      case 4:
        return (
          !!formData.salutation &&
          !!formData.firstName &&
          !!formData.lastName &&
          !!formData.email
        );
      default: return false
    }
  }

  const handleBackToHome = () => {
    // Modal context → close the modal; inline context → scroll to top.
    if (onClose) {
      onClose();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    // Default payload = full FormData (used by the homepage flow's
    // /api/consultation). When the host supplies a `submitPayload`
    // builder, we use that instead - /my-plan does this to send a
    // slim, no-PII body to /api/consultation/update.
    const body = submitPayload
      ? submitPayload(formData)
      : {
          // Step 1
          solutionType: formData.solutionType,
          // Step 2
          city: formData.city,
          propertyType: formData.propertyType,
          // Step 3
          householdSize: formData.householdSize,
          electricityUsage: formData.electricityUsage,
          daytimeRatio: formData.daytimeRatio,
          // Step 4 — roof type
          roofType: formData.roofType,
          // Step 5 — contact
          salutation: formData.salutation,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          // Optional context tag seeded by the caller (e.g. the C&I
          // energy profile from /solutions/business-solar). Stored in
          // the lead's `business_profile` column so sales sees what
          // the visitor already told us.
          interestedProduct: formData.interestedProduct,
        };

    try {
      const res = await fetch(submitEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.success) {
        setIsSubmitted(true);
        if (data.alreadyRegistered) setAlreadyRegistered(true);
        // Notify host (e.g. /my-plan page reloads to refetch the row).
        onSubmitSuccess?.();
        // Success screen renders inline. The "Close" button on the success
        // screen calls onClose() (via handleBackToHome), which closes the
        // modal - matches DE site's "show prompt first, then close" flow.
      } else {
        setSubmitError(data.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    } catch {
      setSubmitError('Lỗi kết nối mạng. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? -100 : 100, opacity: 0 }),
  };

  const [direction, setDirection] = useState(0);

  const goNext = () => {
    if (validateStep()) {
      clearErrors();
      setDirection(1);
      setStep(s => s + 1);
    }
  };

  const goBack = () => {
    setDirection(-1);
    setStep(s => s - 1);
  };

  return (
    <section id="form">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0F766E]/5 rounded-full blur-3xl"/>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0F766E]/3 rounded-full blur-3xl"/>
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-[30px]">
        {/* Form Card */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.01 }}
          transition={{ delay: 0.1 }}
          className="p-6 md:p-10"
        >
          <form
            name="solar-lead"
            method="POST"
            onSubmit={(e) => {
              // Form-level submit (e.g. Enter key inside an input) is
              // intercepted: only allow it from the Review step. Other
              // steps must use the Continue button to advance - the
              // Review step's Confirm button is its own `type="button"`
              // handler below, not a form submit.
              if (step !== VISIBLE_LAST_STEP) {
                e.preventDefault()
                e.stopPropagation()
                return
              }
              void handleSubmit(e)
            }}
          >
            <StepIndicator current={step} total={VISIBLE_TOTAL_STEPS} />

            <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {/* Success Screen */}
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6"
                  >
                    <Check className="w-10 h-10 text-green-500" strokeWidth={2} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Cảm ơn bạn đã gửi yêu cầu!
                  </h3>
                  <p className="text-gray-500 mb-8 max-w-sm">
                    Chúng tôi sẽ liên hệ trong vòng 24 giờ với đề xuất giải pháp điện mặt trời dành riêng cho bạn.
                  </p>
                  {alreadyRegistered && (
                    <div className="mb-6 max-w-sm rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                      Địa chỉ email này đã đăng ký trước đó. Thông tin của bạn đã được
                      cập nhật. Nếu chưa nhận được phản hồi, vui lòng liên hệ bộ phận chăm sóc khách hàng.
                    </div>
                  )}
                  <button
                    onClick={handleBackToHome}
                    className="px-6 py-3 rounded-xl bg-[#0F766E] text-white font-semibold hover:bg-[#0B5C56] transition-colors"
                  >
                    {onClose ? 'Đóng' : 'Về trang chủ'}
                  </button>
                </div>
              ) : (
                <>
                  {/* ─── Step map ─────────────────────────────────────────
                     Public form: 5 visible steps.
                       0 solution · 1 site/property · 2 household + usage
                       + daytime · 3 roof · 4 contact.

                     Compressed Edit-details view: `publicStep` maps visible
                     step 0..2 to public 1..3 and the last visible step to
                     the review screen (-1). Steps 0 and 4 never render
                     there — the solution was chosen at registration and
                     the contact block is PII. */}

                  {/* Step 0 (public only): solutionType */}
                  {!hideAddressAndContact && step === 0 && (
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Bạn quan tâm đến loại giải pháp nào? <span className="text-red-500">*</span>
                        </label>
                        <p className="text-sm text-gray-400 mb-4">
                          Chọn phương án mô tả đúng nhất nhu cầu của bạn.
                        </p>
                        <CardSelect
                          options={SOLUTION_TYPES as CardOption[]}
                          selected={formData.solutionType}
                          onSelect={id => {
                            updateField('solutionType', id as FormData['solutionType'])
                            clearErrors()
                          }}
                          columns={2}
                        />
                        {errors.solutionType && (
                          <p className="text-red-500 text-xs mt-2">{errors.solutionType}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 1 (public) / Step 0 (compressed): city + propertyType */}
                  {publicStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Công trình của bạn ở tỉnh / thành phố nào?
                        </label>
                        <p className="text-sm text-gray-400 mb-4">
                          Chọn địa điểm gần nhất. Thông tin này giúp chúng tôi ước tính
                          sản lượng điện mặt trời và chuyển yêu cầu đến đúng đội ngũ.
                        </p>
                        <select
                          value={formData.city}
                          onChange={e => { updateField('city', e.target.value); clearErrors() }}
                          className={`w-full px-4 py-3 border-2 ${errors.city ? 'border-red-500' : 'border-gray-200'} rounded-xl text-gray-700 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 outline-none transition-all appearance-none bg-white`}
                        >
                          <option value="">Vui lòng chọn...</option>
                          {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-3">
                          Loại công trình nào mô tả đúng nhất? <span className="text-red-500">*</span>
                        </label>
                        <CardSelect
                          options={PROPERTY_TYPES as CardOption[]}
                          selected={formData.propertyType}
                          onSelect={id => { updateField('propertyType', id); clearErrors() }}
                          columns={2}
                        />
                        {errors.propertyType && (
                          <p className="text-red-500 text-xs mt-2">{errors.propertyType}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 2 (public) / Step 1 (compressed): household + usage + daytime */}
                  {publicStep === 2 && (
                    <div className="space-y-7">
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Gia đình bạn có bao nhiêu người? <span className="text-red-500">*</span>
                        </label>
                        <CardSelect
                          options={HOUSEHOLD_SIZES as CardOption[]}
                          selected={formData.householdSize}
                          onSelect={id => { updateField('householdSize', id); clearErrors() }}
                          columns={5}
                        />
                        {errors.householdSize && <p className="text-red-500 text-xs mt-2">{errors.householdSize}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Một tháng gia đình bạn dùng khoảng bao nhiêu điện? <span className="text-red-500">*</span>
                        </label>
                        <p className="text-sm text-gray-400 mb-4">
                          Số kWh ghi trên hoá đơn tiền điện hằng tháng.
                        </p>
                        <CardSelect
                          options={ELECTRICITY_USAGE as CardOption[]}
                          selected={formData.electricityUsage}
                          onSelect={id => { updateField('electricityUsage', id); clearErrors() }}
                          columns={3}
                        />
                        {errors.electricityUsage && <p className="text-red-500 text-xs mt-2">{errors.electricityUsage}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Bao nhiêu phần trăm điện năng được dùng vào ban ngày? <span className="text-red-500">*</span>
                        </label>
                        <p className="text-sm text-gray-400 mb-4">
                          Tỷ lệ điện dùng trong khoảng 6 giờ sáng – 6 giờ chiều.
                        </p>
                        <CardSelect
                          options={DAYTIME_RATIOS as CardOption[]}
                          selected={formData.daytimeRatio}
                          onSelect={id => { updateField('daytimeRatio', id); clearErrors() }}
                          columns={3}
                        />
                        {errors.daytimeRatio && <p className="text-red-500 text-xs mt-2">{errors.daytimeRatio}</p>}
                      </div>
                    </div>
                  )}

                  {/* Step 3 (public) / Step 2 (compressed): roof type */}
                  {publicStep === 3 && (
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Công trình có loại mái nào? <span className="text-red-500">*</span>
                        </label>
                        <p className="text-sm text-gray-400 mb-4">
                          Chọn loại mái nơi dự kiến lắp đặt tấm quang năng.
                        </p>
                        <CardSelect
                          options={ROOF_TYPES as CardOption[]}
                          selected={formData.roofType}
                          onSelect={id => { updateField('roofType', id); clearErrors() }}
                          columns={2}
                        />
                        {errors.roofType && <p className="text-red-500 text-xs mt-2">{errors.roofType}</p>}
                      </div>
                    </div>
                  )}

                  {/* Review (compressed only): final visible step of the
                       Edit-details flow. Reads back the non-PII answers
                       seeded via initialData / edited on the previous
                       steps. */}
                  {publicStep === -1 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          Xem lại thay đổi
                        </h3>
                        <p className="text-sm text-gray-500">
                          Xác nhận thông tin tư vấn bạn muốn áp dụng cho gói của mình.
                        </p>
                      </div>

                      <dl className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
                        <ReviewRow
                          label="Giải pháp"
                          value={
                            SOLUTION_TYPES.find(o => o.id === formData.solutionType)?.label ?? '-'
                          }
                        />
                        <ReviewRow label="Tỉnh / thành phố" value={formData.city || '-'} />
                        <ReviewRow
                          label="Loại công trình"
                          value={
                            PROPERTY_TYPES.find(o => o.id === formData.propertyType)?.label ?? '-'
                          }
                        />
                        <ReviewRow
                          label="Số người"
                          value={
                            HOUSEHOLD_SIZES.find(o => o.id === formData.householdSize)?.label ?? '-'
                          }
                        />
                        <ReviewRow
                          label="Điện dùng hằng tháng"
                          value={
                            ELECTRICITY_USAGE.find(o => o.id === formData.electricityUsage)?.label ?? '-'
                          }
                        />
                        <ReviewRow
                          label="Tỷ lệ dùng ban ngày"
                          value={
                            DAYTIME_RATIOS.find(o => o.id === formData.daytimeRatio)?.label ?? '-'
                          }
                        />
                        <ReviewRow
                          label="Loại mái"
                          value={ROOF_TYPES.find(o => o.id === formData.roofType)?.label ?? '-'}
                        />
                      </dl>

                      <p className="text-xs text-gray-400 leading-relaxed">
                        Sau khi xác nhận, gói của bạn sẽ được tính lại dựa trên
                        các thông tin này. Thông tin liên hệ không thay đổi.
                      </p>
                    </div>
                  )}

                  {/* Step 4 (public only): Contact Info. PII — never rendered in
                       the Edit-details compressed view. */}
                  {publicStep === 4 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Chúng tôi có thể liên hệ với bạn bằng cách nào?
                        </label>
                        <p className="text-sm text-gray-400 mb-4">
                          Chúng tôi sẽ gửi báo giá dành riêng cho bạn qua email.
                        </p>
                      </div>

                      {/* Salutation */}
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2">Cách xưng hô</label>
                        <div className="flex gap-3">
                          {['Anh', 'Chị', 'Ông', 'Bà', 'Khác'].map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => { updateField('salutation', s); clearErrors(); }}
                              className={`px-5 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                                formData.salutation === s
                                  ? 'border-[#0F766E] bg-[#0F766E]/5 text-[#0F766E]'
                                  : errors.salutation ? 'border-red-500' : 'border-gray-200 text-gray-600 hover:border-[#0F766E]/40'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                        {errors.salutation && <p className="text-red-500 text-xs mt-1">{errors.salutation}</p>}
                      </div>

                      {/* Name */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">Tên</label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={e => { updateField('firstName', e.target.value); clearErrors(); }}
                            placeholder="Văn A"
                            className={`w-full px-4 py-3 border-2 ${errors.firstName ? 'border-red-500' : 'border-gray-200'} rounded-xl text-gray-700 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 outline-none transition-all`}
                          />
                          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">Họ</label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={e => { updateField('lastName', e.target.value); clearErrors(); }}
                            placeholder="Nguyễn"
                            className={`w-full px-4 py-3 border-2 ${errors.lastName ? 'border-red-500' : 'border-gray-200'} rounded-xl text-gray-700 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 outline-none transition-all`}
                          />
                          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                        </div>
                      </div>

                      {/* Email + Phone */}
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Email *</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={e => { updateField('email', e.target.value); clearErrors(); }}
                          placeholder="ten@example.com"
                          className={`w-full px-4 py-3 border-2 ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl text-gray-700 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 outline-none transition-all`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                          Số điện thoại <span className="text-gray-400">(không bắt buộc)</span>
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={e => { updateField('phone', e.target.value); clearErrors(); }}
                          placeholder="+84 900 000 000"
                          className={`w-full px-4 py-3 border-2 ${errors.phone ? 'border-red-500' : 'border-gray-200'} rounded-xl text-gray-700 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 outline-none transition-all`}
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>

                      {/* Privacy */}
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Khi gửi thông tin, bạn đồng ý với{' '}
                        <a href="/privacy/" className="text-[#0F766E] underline">Chính sách bảo mật</a>.
                        Dữ liệu của bạn chỉ được dùng để chuẩn bị báo giá.
                      </p>

                      {submitError && (
                        <p className="text-red-500 text-sm text-center">{submitError}</p>
                      )}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>

            {/* Navigation Buttons - hidden after a successful submit so the
                user can't trigger a duplicate POST. The success screen
                renders its own Close / Back to homepage button.

                Sticky to the bottom of the form (inside the AnimatePresence's
                parent form, not the page) so Continue is always within reach
                even when the Step 2 fields push the button off-screen on
                shorter viewports. A semi-opaque white background + border-top
                keep the sticky bar visually separated from the form fields
                above. */}
            {!isSubmitted && (
          <div className="sticky bottom-0 -mx-6 sm:-mx-10 mt-10 pt-4 pb-2 px-6 sm:px-10 bg-white/95 backdrop-blur-sm border-t border-gray-100 flex justify-between items-center">
            {step > 0 ? (
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-2 px-5 py-2.5 text-gray-500 hover:text-gray-700 font-medium transition-colors"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={2} />
                Quay lại
              </button>
            ) : (
              <div />
            )}

            {step < VISIBLE_LAST_STEP ? (
              <button
                type="button"
                onClick={goNext}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  canProceed()
                    ? 'bg-[#0F766E] text-white hover:bg-[#0B5C56] shadow-lg shadow-[#0F766E]/25'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Tiếp tục
                <ChevronRight className="w-4 h-4" strokeWidth={2} />
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  // Explicit button-click handler - bound directly to the
                  // Review step's button only. We avoid `type="submit"`
                  // because that routes through <form onSubmit>, which
                  // would also fire on Enter keypress in any input above.
                  e.preventDefault()
                  void handleSubmit(
                    e as unknown as React.FormEvent<HTMLFormElement>,
                  )
                }}
                disabled={!canProceed() || isSubmitting}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  canProceed() && !isSubmitting
                    ? 'bg-[#0F766E] text-white hover:bg-[#0B5C56] shadow-lg shadow-[#0F766E]/25'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    {submitButtonLabel}
                    <BadgeCheck className="w-5 h-5" strokeWidth={2} />
                  </>
                )}
              </button>
            )}
          </div>
            )}
          </form>
        </motion.div>

        {/* Trust badges below form */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-white" strokeWidth={3.5} />
            </span>
            100% không ràng buộc
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-white" strokeWidth={3.5} />
            </span>
            Tuân thủ quy định bảo vệ dữ liệu cá nhân
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-white" strokeWidth={3.5} />
            </span>
            Phản hồi trong 24 giờ
          </span>
        </div>
      </div>
    </section>
  );
};

export default Form;