'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge, type BadgeVariant } from '@/components/ui/badge'
import { eventShortLabel, goldPartnerEvents } from '@/lib/data/partnerEvents'

export interface PartnerLead {
  id: string
  full_name: string
  company: string
  email: string
  whatsapp: string | null
  partner_track: string
  /** `?lp=` campaign code, null for organic traffic. */
  tracking_code: string | null
  /** Comma-separated conference ids (see lib/data/partnerEvents). */
  event_ids: string | null
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

// ── Gold Partner campaign ───────────────────────────────────────────
//
// /api/partner stamps campaign submissions with this prefix on
// `message` (see CAMPAIGN_LABEL there) — the leads table has no
// campaign column. That prefix is what separates the "Chương trình
// Đối tác Vàng" applications from the general /for-partners enquiries,
// so the gold tab filters on it. Keep the string in sync with
// app/api/partner/route.ts.
const GOLD_PREFIX = '[Chương trình Đối tác Vàng]'

function isGoldLead(p: PartnerLead): boolean {
  return (p.message ?? '').startsWith(GOLD_PREFIX)
}

/**
 * Which conferences a lead registered for.
 *
 * `event_ids` is authoritative; rows written before the tracking
 * migration only carry the ids parenthesised on the "Hội nghị tham dự"
 * line of `message` (e.g. "(bac-giang-2026-11-29)"), so they are parsed
 * out as a fallback.
 */
function leadEventIds(p: PartnerLead): string[] {
  if (p.event_ids) {
    return p.event_ids
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  }
  const line = (p.message ?? '')
    .split('\n')
    .find((l) => l.includes('Hội nghị tham dự'))
  if (!line) return []
  return [...line.matchAll(/\(([A-Za-z0-9_-]{3,64})\)/g)].map((m) => m[1])
}

// Admin-side status vocabulary. 'new' is the table default and reads
// as 未联系 in the follow-up dropdown; the other two are set from that
// dropdown (see /api/admin/partners/[id]).
const STATUS_OPTIONS = [
  { value: 'new', label: '未联系' },
  { value: 'contacted', label: '已联系' },
  { value: 'attended', label: '已参会' },
] as const

type TabKey = 'general' | 'gold'

export function PartnersTable({ partners }: { partners: PartnerLead[] }) {
  const [tab, setTab] = useState<TabKey>('gold')
  // Conference filter — applies to the gold tab; 'all' shows every
  // gold application.
  const [eventFilter, setEventFilter] = useState<string>('all')
  // Local copy so a status change updates the row without a reload.
  const [rows, setRows] = useState<PartnerLead[]>(partners)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [failedId, setFailedId] = useState<string | null>(null)

  const goldRows = rows.filter(isGoldLead)
  // The default tab is the general partner applications only — the
  // gold campaign has its own intake and its own follow-up, so its
  // rows live exclusively in the second tab.
  const base =
    tab === 'gold' ? goldRows : rows.filter((r) => !isGoldLead(r))
  const visible =
    tab === 'gold' && eventFilter !== 'all'
      ? base.filter((r) => leadEventIds(r).includes(eventFilter))
      : base

  const setStatus = async (id: string, status: string) => {
    setSavingId(id)
    setFailedId(null)
    try {
      const res = await fetch(`/api/admin/partners/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const json = (await res.json().catch(() => ({}))) as {
        success?: boolean
        status?: string
        error?: string
      }
      if (!res.ok || !json.success) throw new Error(json.error || 'Update failed')
      setRows((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: json.status ?? status } : r,
        ),
      )
    } catch {
      setFailedId(id)
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="space-y-3">
      {/* ── Tabs ──────────────────────────────────────────────────
          The gold campaign is a capped intake with its own follow-up
          flow, so it gets its own view instead of being mixed into
          the general partner enquiries. The filter is the campaign
          prefix on `message` — see GOLD_PREFIX above. */}
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-b border-uk-line">
        <div className="flex flex-wrap items-center gap-1">
          {(
            [
              { key: 'gold', label: '金牌合作伙伴计划', count: goldRows.length },
              { key: 'general', label: '合作申请', count: rows.length - goldRows.length },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`-mb-px border-b-2 px-3 py-2 text-sm font-cw-bold transition-colors ${
                tab === t.key
                  ? 'border-uk-teal text-uk-teal-dark'
                  : 'border-transparent text-uk-slate hover:text-uk-navy'
              }`}
            >
              {t.label}
              <span className="ml-1.5 text-xs font-normal text-uk-slate">
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Conference filter — gold tab only; the general partner
            applications are not tied to a conference. */}
        {tab === 'gold' && (
          <label className="mb-1.5 inline-flex items-center gap-1.5 text-xs text-uk-slate">
            会议
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="h-8 rounded-md border border-uk-line bg-white px-2 text-xs text-uk-navy focus:outline-none focus:border-uk-teal"
            >
              <option value="all">全部会议</option>
              {goldPartnerEvents.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.shortLabel}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-uk-line bg-white p-12 text-center text-uk-slate text-sm">
          {tab === 'gold' ? '暂无金牌合作伙伴计划申请。' : '暂无合作申请。'}
        </div>
      ) : (
        <div className="rounded-2xl border border-uk-line bg-white overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>时间</TableHead>
                <TableHead>姓名</TableHead>
                <TableHead>电话</TableHead>
                <TableHead>公司</TableHead>
                <TableHead>邮箱</TableHead>
                <TableHead>合作类型</TableHead>
                <TableHead>会议</TableHead>
                <TableHead>跟踪码</TableHead>
                <TableHead className="max-w-[20rem]">
                  {tab === 'gold' ? '报名信息' : '简介'}
                </TableHead>
                <TableHead>状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((p) => {
                const status = p.status || 'new'
                const busy = savingId === p.id
                // The gold tab is already filtered to gold leads, so
                // its type badge says so; elsewhere keep the generic
                // track label.
                const typeLabel =
                  tab === 'gold'
                    ? '金牌合作伙伴'
                    : TRACK_LABEL[p.partner_track] ?? p.partner_track
                return (
                  <TableRow key={p.id}>
                    <TableCell className="whitespace-nowrap">
                      {formatDateTime(p.created_at)}
                    </TableCell>
                    <TableCell className="font-cw-bold">
                      {p.full_name}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {p.whatsapp ? (
                        <a
                          href={`tel:${p.whatsapp}`}
                          className="text-uk-teal-dark hover:underline"
                        >
                          {p.whatsapp}
                        </a>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>{p.company || '-'}</TableCell>
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
                        {typeLabel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const ids = leadEventIds(p)
                        if (ids.length === 0) return '-'
                        return (
                          <div className="flex flex-wrap gap-1">
                            {ids.map((id) => (
                              <Badge key={id} variant="outline">
                                {eventShortLabel(id)}
                              </Badge>
                            ))}
                          </div>
                        )
                      })()}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-mono text-xs">
                      {p.tracking_code || '-'}
                    </TableCell>
                    <TableCell className="max-w-[20rem]">
                      <div
                        className="line-clamp-4 whitespace-pre-line"
                        title={p.message ?? ''}
                      >
                        {p.message || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {/* Follow-up state lives in one dropdown: it shows
                          the current state (未联系 for the `new`
                          default), and picking 已联系 / 已参会 writes
                          straight through to the API. Keeping the
                          label inside the control means the separate
                          badge column is not needed. */}
                      <select
                        value={status}
                        disabled={busy}
                        onChange={(e) => setStatus(p.id, e.target.value)}
                        className={`h-8 rounded-md border bg-white px-2 text-xs text-uk-navy focus:outline-none focus:border-uk-teal disabled:opacity-50 ${
                          status === 'attended'
                            ? 'border-uk-teal/60'
                            : 'border-uk-line'
                        }`}
                      >
                        {STATUS_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                      {failedId === p.id && (
                        <p className="mt-1 text-[10px] text-red-600">
                          更新失败
                        </p>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}