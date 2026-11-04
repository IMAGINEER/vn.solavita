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
  // vi-VN: "31 Th08 2026, 14:23". Same locale as LeadsTable.
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Ho_Chi_Minh',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export function ContactsTable({ contacts }: { contacts: ContactLead[] }) {
  if (contacts.length === 0) {
    return (
      <div className="rounded-2xl border border-uk-line bg-white p-12 text-center text-uk-slate text-sm">
        Chưa có yêu cầu liên hệ nào.
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
            <TableHead>Địa điểm</TableHead>
            <TableHead>Chủ đề</TableHead>
            <TableHead className="max-w-[20rem]">Nội dung</TableHead>
            <TableHead>Trạng thái</TableHead>
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
                  {fullName || '-'}
                </TableCell>
                <TableCell>
                  <a
                    href={`mailto:${c.email}`}
                    className="text-uk-teal-dark hover:underline"
                  >
                    {c.email}
                  </a>
                </TableCell>
                <TableCell>{c.phone || '-'}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {location || '-'}
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
                    {c.status === 'new' ? 'Mới' : c.status || 'Mới'}
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