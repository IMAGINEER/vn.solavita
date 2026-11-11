'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Save, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { BlogCategory } from '@/lib/types/blog'

// Admin: categories list + inline create/edit form. Mirrors the
// pattern used by other admin CRUD pages in this project.

interface CategoryWithCount extends BlogCategory {
  post_count: number
}

export function CategoriesManager({
  categories,
}: {
  categories: CategoryWithCount[]
}) {
  const router = useRouter()
  const [draft, setDraft] = useState({ slug: '', name_en: '', description_en: '', sort_order: 0 })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const res = await fetch('/api/admin/blog/categories', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          slug: draft.slug,
          name_en: draft.name_en,
          description_en: draft.description_en || null,
          sort_order: draft.sort_order,
        }),
      })
      const json = (await res.json()) as { success: boolean; error?: string }
      if (!res.ok || !json.success) {
        setError(json.error ?? '发生错误')
        return
      }
      setDraft({ slug: '', name_en: '', description_en: '', sort_order: 0 })
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = useCallback(
    async (id: string) => {
      if (!window.confirm('删除此分类？')) return
      const res = await fetch(`/api/admin/blog/categories/${id}`, {
        method: 'DELETE',
      })
      const json = (await res.json()) as { success: boolean; error?: string }
      if (!res.ok || !json.success) {
        alert(json.error ?? '删除失败')
        return
      }
      router.refresh()
    },
    [router],
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section className="lg:col-span-2 rounded-2xl border border-uk-line bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-uk-teal-soft/50 text-uk-slate">
            <tr>
              <th className="text-left font-cw-bold uppercase tracking-wider text-[11px] px-4 py-2.5">名称</th>
              <th className="text-left font-cw-bold uppercase tracking-wider text-[11px] px-4 py-2.5">Slug</th>
              <th className="text-right font-cw-bold uppercase tracking-wider text-[11px] px-4 py-2.5">文章数</th>
              <th className="text-right font-cw-bold uppercase tracking-wider text-[11px] px-4 py-2.5 w-20" />
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-t border-uk-line">
                <td className="px-4 py-3">
                  <div className="font-cw-bold text-uk-navy">{c.name_en}</div>
                  {c.description_en && (
                    <div className="text-[11px] text-uk-slate mt-0.5">
                      {c.description_en}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-uk-slate">{c.slug}</td>
                <td className="px-4 py-3 text-uk-slate tabular-nums text-right">{c.post_count}</td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(c.id)}
                    aria-label="删除"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <form
        onSubmit={handleCreate}
        className="rounded-2xl border border-uk-line bg-white p-5 space-y-3 h-fit"
      >
        <h2 className="text-sm font-cw-bold text-uk-navy uppercase tracking-wider">
          添加分类
        </h2>
        <div>
          <Label htmlFor="cat-name">名称</Label>
          <Input
            id="cat-name"
            value={draft.name_en}
            onChange={(e) => setDraft((d) => ({ ...d, name_en: e.target.value }))}
            placeholder="例如：太阳能指南"
            required
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="cat-slug">Slug</Label>
          <Input
            id="cat-slug"
            value={draft.slug}
            onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))}
            placeholder="huong-dan-dien-mat-troi"
            required
            className="mt-1.5 font-mono"
          />
        </div>
        <div>
          <Label htmlFor="cat-desc">描述</Label>
          <Textarea
            id="cat-desc"
            value={draft.description_en}
            onChange={(e) => setDraft((d) => ({ ...d, description_en: e.target.value }))}
            placeholder="用一句话描述该分类包含的内容。"
            className="mt-1.5 min-h-[80px] font-sans"
          />
        </div>
        <div>
          <Label htmlFor="cat-sort">排序</Label>
          <Input
            id="cat-sort"
            type="number"
            value={draft.sort_order}
            onChange={(e) => setDraft((d) => ({ ...d, sort_order: Number(e.target.value) }))}
            className="mt-1.5 w-24"
          />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          添加
        </Button>
      </form>
    </div>
  )
}
