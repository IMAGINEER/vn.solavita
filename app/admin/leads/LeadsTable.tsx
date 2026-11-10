'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge, type BadgeVariant } from '@/components/ui/badge'
import {
  House,
  Triangle,
  Users,
  Zap,
  Plug,
  Building2,
  ExternalLink,
} from 'lucide-react'
import {
  recommendPlan,
  getPlan,
  type ConsultationInput,
  type ConsumptionTier,
} from '@/app/my-plan/_lib/calc'

export interface ConsultationLead {
  id: string
  salutation: string | null
  first_name: string | null
  last_name: string | null
  email: string
  phone: string | null
  street: string | null
  house_number: string | null
  postal_code: string | null
  city: string | null
  region: string | null
  house_type: string | null
  roof_type: string | null
  household_size: string | null
  electricity_usage: string | null
  devices: string | null
  /**
   * Business (C&I) profile attached from the business-solar assessment
   * or the savings estimator — free text. NULL for home leads.
   */
  business_profile: string | null
  plan_token: string | null
  country: string | null
  created_at: string
  updated_at: string
  // Plan lifecycle - see migration 20260902000000_consultation_plan_lifecycle.sql.
  // All nullable: NULL means the signal hasn't fired yet.
  plan_sent_at: string | null
  plan_provider_id: string | null
  plan_first_opened_at: string | null
  plan_last_opened_at: string | null
  plan_confirmed_at: string | null
}

/**
 * Derived 4-state Plan lifecycle. Order matters - the most advanced state
 * wins. Computed in JSX (not stored in DB) so the timestamps stay the
 * single source of truth.
 */
type PlanStatus =
  | 'not_sent'
  | 'sent_unopened'
  | 'sent_opened_unconfirmed'
  | 'sent_opened_confirmed'

function computePlanStatus(l: ConsultationLead): PlanStatus {
  if (l.plan_confirmed_at) return 'sent_opened_confirmed'
  if (l.plan_first_opened_at) return 'sent_opened_unconfirmed'
  if (l.plan_sent_at) return 'sent_unopened'
  return 'not_sent'
}

const PLAN_STATUS_VARIANT: Record<PlanStatus, BadgeVariant> = {
  not_sent: 'muted',                  // gray
  sent_unopened: 'outline',           // white teal border - email in flight
  sent_opened_unconfirmed: 'default', // teal-dark filled - engaged, no reply yet
  sent_opened_confirmed: 'success',   // emerald - terminal / handed to sales
}

const PLAN_STATUS_LABEL: Record<PlanStatus, string> = {
  not_sent: 'Gói: chưa gửi',
  sent_unopened: 'Gói: đã gửi',
  sent_opened_unconfirmed: 'Gói: đã mở',
  sent_opened_confirmed: 'Gói: đã xác nhận',
}

const PLAN_STATUS_TOOLTIP: Record<PlanStatus, string> = {
  not_sent: 'Chưa gửi email nào (hoặc webhook Resend chưa được cấu hình).',
  sent_unopened: 'Email đã gửi, khách chưa vào /my-plan.',
  sent_opened_unconfirmed: 'Khách đã vào /my-plan, chưa bấm Liên hệ chuyên gia.',
  sent_opened_confirmed: 'Khách đã bấm Liên hệ chuyên gia. Cần theo dõi tiếp.',
}

function formatDateTime(iso: string): string {
  // vi-VN short: "31 Th08, 14:23" - drops the year because admin
  // scans recent leads in the current year; saves ~20px in the
  // narrow Time column. Falls back to the raw ISO if Intl fails.
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Ho_Chi_Minh',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

// True when a row was UPDATEd after INSERT - i.e. a customer re-submitted
// the consultation form. ISO-8601 strings compare lexicographically the
// same as chronologically, so `updated_at > created_at` is correct
// without parsing.
function wasResubmitted(l: ConsultationLead): boolean {
  return l.updated_at > l.created_at
}

/** Comma-separated `devices` string → trimmed ID array. Mirrors the
 *  helper in `lib/my-plan/adapter.ts`; duplicated here so we don't pull
 *  the whole adapter module just for one CSV split. */
function parseDevices(csv: string | null): Array<string> {
  if (!csv) return []
  return csv.split(',').map((s) => s.trim()).filter(Boolean)
}

/** Defensive defaults - match `lib/my-plan/adapter.ts` so an admin row
 *  with missing columns falls back to the same plan the customer would
 *  have seen when they opened /my-plan. */
const DEFAULT_HOUSEHOLD_SIZE: ConsultationInput['householdSize'] = '3'
const DEFAULT_USAGE: ConsumptionTier = 'medium'
/** Fallback region for rows with a NULL region column. Matches
 *  `lib/my-plan/adapter.ts` - the VN form no longer collects a
 *  region, so most rows land here. */
const DEFAULT_REGION = 'Việt Nam'

/** Run the recommendation engine client-side (same call as
 *  MyPlanClient) so the Plan column shows the actual bundle
 *  (LITE Essential Backup / HOME Standard / HOME High-spec /
 *  BUSINESS Entry 3-Phase / BUSINESS Standard 3-Phase / BUSINESS
 *  Flagship 3-Phase). The catalogue is pure - no
 *  I/O, no React hooks - so importing it into a 'use client' component
 *  is safe. */
function resolvePlanName(l: ConsultationLead): string {
  const consultation: ConsultationInput = {
    householdSize: (l.household_size ?? DEFAULT_HOUSEHOLD_SIZE) as ConsultationInput['householdSize'],
    electricityUsage: (l.electricity_usage ?? DEFAULT_USAGE) as ConsumptionTier,
    devices: parseDevices(l.devices),
    region: l.region ?? DEFAULT_REGION,
    // Legacy Step-3 fields from the calculator input type - older
    // leads may have NULL here, default to 'unknown' so the
    // recommendation engine still resolves a plan.
    generatorFrequency: 'unknown',
    fuelBudgetNgn: 'unknown',
    backupNeeds: [],
  }
  return getPlan(recommendPlan(consultation)).name
}

// Merged "Home Details" cell. Each attribute that has a value renders
// on its own line (icon + short label + value) so empty attributes
// don't bloat the row. Order matches the original consultation form
// sections - top-down: type, roof, household, usage, devices.
const HOME_DETAIL_ITEMS: ReadonlyArray<{
  key: keyof ConsultationLead
  icon: typeof House
  label: string
}> = [
  { key: 'house_type',        icon: House,    label: 'Loại nhà' },
  { key: 'roof_type',         icon: Triangle, label: 'Mái nhà' },
  { key: 'household_size',    icon: Users,    label: 'Số người' },
  { key: 'electricity_usage', icon: Zap,      label: 'Mức dùng' },
  { key: 'devices',           icon: Plug,     label: 'Thiết bị' },
]

function HomeDetailsCell({ lead }: { lead: ConsultationLead }) {
  const present = HOME_DETAIL_ITEMS.filter((item) => lead[item.key])
  if (present.length === 0 && !lead.business_profile) {
    return <span className="text-uk-slate">-</span>
  }
  return (
    <ul className="space-y-1">
      {present.map(({ key, icon: Icon, label }) => (
        <li key={key} className="flex items-center gap-2 text-sm leading-tight">
          <span title={label} className="inline-flex shrink-0 cursor-default">
            <Icon
              className="size-3.5 text-uk-slate shrink-0"
              strokeWidth={1.75}
              aria-hidden
            />
          </span>
          <span className="text-uk-navy">{lead[key] as string}</span>
        </li>
      ))}
      {/* Business (C&I) profile from /solutions/business-solar — the
          energy profile the visitor filled in before the enquiry. */}
      {lead.business_profile && (
        <li className="flex items-start gap-2 text-sm leading-tight">
          <span
            title="Hồ sơ doanh nghiệp"
            className="inline-flex shrink-0 cursor-default mt-0.5"
          >
            <Building2
              className="size-3.5 text-uk-slate shrink-0"
              strokeWidth={1.75}
              aria-hidden
            />
          </span>
          <span className="text-uk-navy break-words">
            {lead.business_profile}
          </span>
        </li>
      )}
    </ul>
  )
}

export function LeadsTable({ leads }: { leads: ConsultationLead[] }) {
  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-uk-line bg-white p-12 text-center text-uk-slate text-sm">
        Chưa có khách hàng tiềm năng nào.
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-uk-line bg-white overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Thời gian</TableHead>
            <TableHead>Họ tên</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Điện thoại</TableHead>
            <TableHead>Khu vực</TableHead>
            <TableHead>Chi tiết nhà</TableHead>
            <TableHead>Gói đề xuất</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((l) => {
            const name = [l.salutation, l.first_name, l.last_name]
              .filter(Boolean)
              .join(' ')
            const planStatus = computePlanStatus(l)
            const planName = resolvePlanName(l)
            return (
              <TableRow key={l.id}>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span>{formatDateTime(l.updated_at)}</span>
                    {wasResubmitted(l) && (
                      <Badge variant="muted" title="Gửi lại (updated_at > created_at)">
                        U
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{name || '-'}</TableCell>
                <TableCell>
                  <a
                    href={`mailto:${l.email}`}
                    className="text-uk-teal-dark hover:underline"
                  >
                    {l.email}
                  </a>
                </TableCell>
                <TableCell>{l.phone || '-'}</TableCell>
                <TableCell>{l.region || '-'}</TableCell>
                <TableCell><HomeDetailsCell lead={l} /></TableCell>
                <TableCell>
                  <div className="flex flex-col items-start gap-1">
                    <Badge
                      variant={PLAN_STATUS_VARIANT[planStatus]}
                      title={PLAN_STATUS_TOOLTIP[planStatus]}
                    >
                      {PLAN_STATUS_LABEL[planStatus]}
                    </Badge>
                    {l.plan_token ? (
                      <a
                        href={`/my-plan?id=${l.plan_token}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-cw-bold text-uk-teal-dark hover:underline leading-tight"
                      >
                        {planName}
                        <ExternalLink className="size-3" strokeWidth={1.75} aria-hidden />
                      </a>
                    ) : (
                      <span className="text-xs font-cw-bold text-uk-navy leading-tight">
                        {planName}
                      </span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}