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

export interface ContactLead {
  id: string
  salutation: string | null
  first_name: string | null
  last_name: string | null
  email: string
  phone: string | null
  postcode: string | null
  city: string | null
  subject: string
  message: string
  status: string | null
  created_at: string
  updated_at: string
}

function formatDateTime(iso: string): string {
  // en-GB: "31 Aug 2026, 14:23". Same locale as LeadsTable.
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

export function ContactsTable({ contacts }: { contacts: ContactLead[] }) {
  if (contacts.length === 0) {
    return (
      <div className="rounded-2xl border border-uk-line bg-white p-12 text-center text-uk-slate text-sm">
        No contact enquiries yet.
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
            <TableHead>Location</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead className="max-w-[20rem]">Message</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((c) => {
            const fullName = [c.salutation, c.first_name, c.last_name]
              .filter(Boolean)
              .join(' ')
            const location = [c.city, c.postcode].filter(Boolean).join(', ')
            return (
              <TableRow key={c.id}>
                <TableCell className="whitespace-nowrap">
                  {formatDateTime(c.created_at)}
                </TableCell>
                <TableCell className="font-cw-bold">
                  {fullName || '—'}
                </TableCell>
                <TableCell>
                  <a
                    href={`mailto:${c.email}`}
                    className="text-uk-teal-dark hover:underline"
                  >
                    {c.email}
                  </a>
                </TableCell>
                <TableCell>{c.phone || '—'}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {location || '—'}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{c.subject}</Badge>
                </TableCell>
                <TableCell className="max-w-[20rem]">
                  <div className="line-clamp-2" title={c.message}>
                    {c.message}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={c.status === 'new' ? 'success' : 'outline'}>
                    {c.status || 'new'}
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