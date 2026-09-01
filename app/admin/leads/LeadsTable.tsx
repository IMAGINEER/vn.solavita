'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

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

// True when a row was UPDATEd after INSERT — i.e. a customer re-submitted
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
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((l) => {
            const name = [l.salutation, l.first_name, l.last_name]
              .filter(Boolean)
              .join(' ')
            const devices = l.devices ? l.devices : '—'
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
                <TableCell>{name || '—'}</TableCell>
                <TableCell>
                  <a
                    href={`mailto:${l.email}`}
                    className="text-uk-teal-dark hover:underline"
                  >
                    {l.email}
                  </a>
                </TableCell>
                <TableCell>{l.phone || '—'}</TableCell>
                <TableCell>{l.region || '—'}</TableCell>
                <TableCell>{l.house_type || '—'}</TableCell>
                <TableCell>{l.roof_type || '—'}</TableCell>
                <TableCell>{l.household_size || '—'}</TableCell>
                <TableCell>{l.electricity_usage || '—'}</TableCell>
                <TableCell className="max-w-[12rem] truncate" title={devices}>
                  {devices}
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