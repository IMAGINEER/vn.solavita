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
  status: string | null
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
  not_sent: 'Plan: not sent',
  sent_unopened: 'Plan: sent',
  sent_opened_unconfirmed: 'Plan: opened',
  sent_opened_confirmed: 'Plan: confirmed',
}

const PLAN_STATUS_TOOLTIP: Record<PlanStatus, string> = {
  not_sent: 'No email sent yet (or Resend webhook not configured).',
  sent_unopened: 'Email delivered, /my-plan not yet visited.',
  sent_opened_unconfirmed: '/my-plan visited, no Talk-to-an-expert click yet.',
  sent_opened_confirmed: 'Customer clicked Talk to an expert. Follow up.',
}

function formatDateTime(iso: string): string {
  // en-GB: "31 Aug 2026, 14:23". Avoids the en-US month/day ambiguity
  // for an admin reviewing submissions.
  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Europe/London',
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

export function LeadsTable({ leads }: { leads: ConsultationLead[] }) {
  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-uk-line bg-white p-12 text-center text-uk-slate text-sm">
        No UK leads yet.
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-uk-line bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>House type</TableHead>
            <TableHead>Roof</TableHead>
            <TableHead>People</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Devices</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((l) => {
            const name = [l.salutation, l.first_name, l.last_name]
              .filter(Boolean)
              .join(' ')
            const devices = l.devices ? l.devices : '-'
            const planStatus = computePlanStatus(l)
            return (
              <TableRow key={l.id}>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span>{formatDateTime(l.updated_at)}</span>
                    {wasResubmitted(l) && (
                      <Badge variant="muted" title="Re-submitted (updated_at > created_at)">
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
                <TableCell>{l.house_type || '-'}</TableCell>
                <TableCell>{l.roof_type || '-'}</TableCell>
                <TableCell>{l.household_size || '-'}</TableCell>
                <TableCell>{l.electricity_usage || '-'}</TableCell>
                <TableCell className="max-w-[12rem] truncate" title={devices}>
                  {devices}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={PLAN_STATUS_VARIANT[planStatus]}
                    title={PLAN_STATUS_TOOLTIP[planStatus]}
                  >
                    {PLAN_STATUS_LABEL[planStatus]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={l.status === 'new' ? 'success' : 'outline'}>
                    {l.status || 'new'}
                  </Badge>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}