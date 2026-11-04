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

export interface PartnerLead {
  id: string
  full_name: string
  company: string
  email: string
  partner_track: string
  message: string | null
  status: string | null
  created_at: string
  updated_at: string
}

function formatDateTime(iso: string): string {
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

// Map partner track → Badge variant so each track reads at a glance.
// Keep in sync with VALID_TRACKS in /app/api/partner/route.ts.
const TRACK_VARIANT: Record<string, BadgeVariant> = {
  installer: 'success',
  business: 'muted',
}

const TRACK_LABEL: Record<string, string> = {
  installer: 'Đơn vị lắp đặt',
  business: 'Năng lượng / Doanh nghiệp',
}

export function PartnersTable({ partners }: { partners: PartnerLead[] }) {
  if (partners.length === 0) {
    return (
      <div className="rounded-2xl border border-uk-line bg-white p-12 text-center text-uk-slate text-sm">
        Chưa có yêu cầu hợp tác nào.
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
            <TableHead>Công ty</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Nhóm đối tác</TableHead>
            <TableHead className="max-w-[20rem]">Giới thiệu</TableHead>
            <TableHead>Trạng thái</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partners.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="whitespace-nowrap">
                {formatDateTime(p.created_at)}
              </TableCell>
              <TableCell className="font-cw-bold">{p.full_name}</TableCell>
              <TableCell>{p.company}</TableCell>
              <TableCell>
                <a
                  href={`mailto:${p.email}`}
                  className="text-uk-teal-dark hover:underline"
                >
                  {p.email}
                </a>
              </TableCell>
              <TableCell>
                <Badge variant={TRACK_VARIANT[p.partner_track] ?? 'outline'}>
                  {TRACK_LABEL[p.partner_track] ?? p.partner_track}
                </Badge>
              </TableCell>
              <TableCell className="max-w-[20rem]">
                <div className="line-clamp-2" title={p.message ?? ''}>
                  {p.message || '-'}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={p.status === 'new' ? 'success' : 'outline'}>
                  {p.status === 'new' ? 'Mới' : p.status || 'Mới'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}