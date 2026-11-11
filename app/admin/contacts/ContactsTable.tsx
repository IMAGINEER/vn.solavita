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
  // zh-CN: "2026年8月31日 14:23". Same locale as LeadsTable.
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

export function ContactsTable({ contacts }: { contacts: ContactLead[] }) {
  if (contacts.length === 0) {
    return (
      <div className="rounded-2xl border border-uk-line bg-white p-12 text-center text-uk-slate text-sm">
        暂无联系请求。
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
            <TableHead>邮箱</TableHead>
            <TableHead>电话</TableHead>
            <TableHead>地点</TableHead>
            <TableHead>主题</TableHead>
            <TableHead className="max-w-[20rem]">内容</TableHead>
            <TableHead>状态</TableHead>
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
                    {c.status === 'new' ? '新' : c.status || '新'}
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