'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { BlogTag } from '@/lib/types/blog'

export function TagsManager({ tags }: { tags: BlogTag[] }) {
  const router = useRouter()
  const [draft, setDraft] = useState({ slug: '', name_en: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const res = await fetch('/api/admin/blog/tags', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(draft),
      })
      const json = (await res.json()) as { success: boolean; error?: string }
      if (!res.ok || !json.success) {
        setError(json.error ?? 'Error')
        return
      }
      setDraft({ slug: '', name_en: '' })
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = useCallback(
    async (id: string) => {
      if (!window.confirm('Delete this tag?')) return
      const res = await fetch(`/api/admin/blog/tags?id=${id}`, {
        method: 'DELETE',
      })
      const json = (await res.json()) as { success: boolean; error?: string }
      if (!res.ok || !json.success) {
        alert(json.error ?? 'Deletion failed')
        return
      }
      router.refresh()
    },
    [router],
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section className="lg:col-span-2 rounded-2xl border border-uk-line bg-white overflow-hidden">
        {tags.length === 0 ? (
          <div className="text-center text-uk-slate py-12">
            No tags. Add one on the right.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-uk-teal-soft/50 text-uk-slate">
              <tr>
                <th className="text-left font-cw-bold uppercase tracking-wider text-[11px] px-4 py-2.5">Name</th>
                <th className="text-left font-cw-bold uppercase tracking-wider text-[11px] px-4 py-2.5">Slug</th>
                <th className="text-right font-cw-bold uppercase tracking-wider text-[11px] px-4 py-2.5 w-20" />
              </tr>
            </thead>
            <tbody>
              {tags.map((t) => (
                <tr key={t.id} className="border-t border-uk-line">
                  <td className="px-4 py-3 font-cw-bold text-uk-navy">{t.name_en}</td>
                  <td className="px-4 py-3 font-mono text-uk-slate">{t.slug}</td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(t.id)}
                      aria-label="Delete"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <form
        onSubmit={handleCreate}
        className="rounded-2xl border border-uk-line bg-white p-5 space-y-3 h-fit"
      >
        <h2 className="text-sm font-cw-bold text-uk-navy uppercase tracking-wider">
          Add tag
        </h2>
        <div>
          <Label htmlFor="tag-name">Name</Label>
          <Input
            id="tag-name"
            value={draft.name_en}
            onChange={(e) => setDraft((d) => ({ ...d, name_en: e.target.value }))}
            placeholder="Solar PV"
            required
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="tag-slug">Slug</Label>
          <Input
            id="tag-slug"
            value={draft.slug}
            onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))}
            placeholder="solar-pv"
            required
            className="mt-1.5 font-mono"
          />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          Add
        </Button>
      </form>
    </div>
  )
}
