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
    return new Intl.DateTimeFormat('zh-CN', {
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
  'core-service': 'success',
  'certified-installer': 'success',
  'lead-partner': 'muted',
}

const TRACK_LABEL: Record<string, string> = {
  installer: '安装单位',
  business: '能源 / 企业',
  // VN tracks — titles match `lib/data/partners.ts`.
  'core-service': '经销代理',
  'certified-installer': '安装合作伙伴',
  'lead-partner': '商业合作伙伴',
}

export function PartnersTable({ partners }: { partners: PartnerLead[] }) {
  if (partners.length === 0) {
    return (
      <div className="rounded-2xl border border-uk-line bg-white p-12 text-center text-uk-slate text-sm">
        暂无合作申请。
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-uk-line bg-white overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>时间</TableHead>
            <TableHead>姓名</TableHead>
            <TableHead>公司</TableHead>
            <TableHead>邮箱</TableHead>
            <TableHead>合作类型</TableHead>
            <TableHead className="max-w-[20rem]">简介</TableHead>
            <TableHead>状态</TableHead>
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
                  {p.status === 'new' ? '新' : p.status || '新'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}