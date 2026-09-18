'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, FileText, Plus, Trash2 } from 'lucide-react'
import { publishRefresh } from '@/lib/admin-publish'
import type { PolicyPage } from '@buildcivil/cms/policies'
import { readJsonResponse } from '@buildcivil/cms/safe-json'

type PolicyResponse = {
  connected?: boolean
  rows: PolicyPage[]
  error?: string
}

type Draft = Omit<PolicyPage, 'id' | 'created_at' | 'updated_at'> & { id?: string }

const emptyDraft = (): Draft => ({
  slug: '',
  title: '',
  summary: '',
  content: '',
  seo_title: '',
  seo_description: '',
  published: true,
  show_in_header: false,
  show_in_footer: true,
  sort_order: 0,
})

function toDraft(row: PolicyPage): Draft {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    content: row.content,
    seo_title: row.seo_title,
    seo_description: row.seo_description,
    published: row.published,
    show_in_header: row.show_in_header,
    show_in_footer: row.show_in_footer,
    sort_order: row.sort_order,
  }
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{label}</span>
      {hint ? <span className="mt-1 block text-xs leading-5 text-slate-400">{hint}</span> : null}
      <span className="mt-2 block">{children}</span>
    </label>
  )
}

const inputClass = 'w-full rounded-[16px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#73A5CA] focus:ring-2 focus:ring-[#73A5CA]/20'
const emptyPolicyRows: PolicyPage[] = []

export default function AdminPolicyPagesPanel() {
  const [rows, setRows] = useState<PolicyPage[]>([])
  const [draft, setDraft] = useState<Draft>(emptyDraft())
  const [connected, setConnected] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function loadRows() {
    const response = await fetch('/api/admin/policy-pages', { cache: 'no-store' })
    const payload = await readJsonResponse<PolicyResponse>(response, { connected: false, rows: emptyPolicyRows })
    if (!response.ok) throw new Error(payload.error || 'Failed to load policy pages.')
    setRows(payload.rows)
    setConnected(Boolean(payload.connected))
    if (!draft.id && payload.rows[0]) setDraft(toDraft(payload.rows[0]))
  }

  useEffect(() => {
    loadRows().catch((err) => setError(err instanceof Error ? err.message : 'Failed to load policy pages.'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function normalizeSlug(value: string) {
    return value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
  }

  async function savePolicy() {
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const payload = {
        slug: normalizeSlug(draft.slug),
        title: draft.title.trim(),
        summary: draft.summary.trim(),
        content: draft.content.trim(),
        seo_title: draft.seo_title.trim(),
        seo_description: draft.seo_description.trim(),
        published: draft.published,
        show_in_header: draft.show_in_header,
        show_in_footer: draft.show_in_footer,
        sort_order: Number(draft.sort_order) || 0,
      }

      if (!payload.slug || !payload.title || !payload.content) {
        throw new Error('Slug, title, and content are required.')
      }

      const response = await fetch('/api/admin/policy-pages', {
        method: draft.id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft.id ? { id: draft.id, updates: payload } : payload),
      })
      const result = await readJsonResponse<{ error?: string }>(response, {})
      if (!response.ok) throw new Error(result.error || 'Failed to save policy page.')
      await loadRows()
      await publishRefresh(['/', `/${payload.slug}`, '/sitemap.xml', '/robots.txt'])
      setMessage('Policy page saved, navigation refreshed, and sitemap updated.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save policy page.')
    } finally {
      setSaving(false)
    }
  }

  async function deletePolicy(id: string, slug: string) {
    if (!confirm('Delete this policy page?')) return
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const response = await fetch('/api/admin/policy-pages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const result = await readJsonResponse<{ error?: string }>(response, {})
      if (!response.ok) throw new Error(result.error || 'Failed to delete policy page.')
      setDraft(emptyDraft())
      await loadRows()
      await publishRefresh(['/', `/${slug}`, '/sitemap.xml', '/robots.txt'])
      setMessage('Policy page deleted and public cache refreshed.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete policy page.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.26em] text-slate-400">Policy pages</div>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-900">{draft.id ? 'Edit policy' : 'Add policy'}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Create legal or company policy pages at root URLs like /privacy-policy and optionally show them in the header or footer.
            </p>
          </div>
          <button type="button" onClick={() => setDraft(emptyDraft())} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
            <Plus size={14} /> New
          </button>
        </div>

        {error ? <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">{error}</div> : null}
        {message ? <div className="mt-4 rounded-2xl border border-emerald-200 bg-orange-50 px-4 py-3 text-sm text-[#E87F24]">{message}</div> : null}
        {!connected ? <div className="mt-4 rounded-2xl border border-emerald-200 bg-orange-50 px-4 py-3 text-sm text-slate-600">Live policy table is unavailable here. Saving is paused until Supabase is connected.</div> : null}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Slug" hint="Root URL, for example privacy-policy. Cleaned up automatically on save.">
            <input
              className={inputClass}
              value={draft.slug}
              onChange={(event) => setDraft((prev) => ({ ...prev, slug: event.target.value }))}
              onBlur={(event) => setDraft((prev) => ({ ...prev, slug: normalizeSlug(event.target.value) }))}
            />
          </Field>
          <Field label="Title">
            <input className={inputClass} value={draft.title} onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))} />
          </Field>
          <Field label="SEO title">
            <input className={inputClass} value={draft.seo_title} onChange={(event) => setDraft((prev) => ({ ...prev, seo_title: event.target.value }))} />
          </Field>
          <Field label="Sort order">
            <input className={inputClass} type="number" value={draft.sort_order} onChange={(event) => setDraft((prev) => ({ ...prev, sort_order: Number(event.target.value) }))} />
          </Field>
        </div>

        <div className="mt-4 grid gap-4">
          <Field label="Summary"><textarea className={`${inputClass} min-h-[90px]`} value={draft.summary} onChange={(event) => setDraft((prev) => ({ ...prev, summary: event.target.value }))} /></Field>
          <Field label="Policy content" hint="Use blank lines to separate sections."><textarea className={`${inputClass} min-h-[260px]`} value={draft.content} onChange={(event) => setDraft((prev) => ({ ...prev, content: event.target.value }))} /></Field>
          <Field label="SEO description"><textarea className={`${inputClass} min-h-[90px]`} value={draft.seo_description} onChange={(event) => setDraft((prev) => ({ ...prev, seo_description: event.target.value }))} /></Field>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          {[
            ['published', 'Published'],
            ['show_in_header', 'Show in header'],
            ['show_in_footer', 'Show in footer'],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={Boolean(draft[key as keyof Draft])} onChange={(event) => setDraft((prev) => ({ ...prev, [key]: event.target.checked }))} />
              {label}
            </label>
          ))}
          <button type="button" disabled={!connected || saving} onClick={savePolicy} className="inline-flex items-center gap-3 rounded-full bg-[#E87F24] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
            Save policy <ArrowRight size={15} />
          </button>
          {draft.id ? (
            <button type="button" disabled={!connected || saving} onClick={() => deletePolicy(draft.id!, draft.slug)} className="inline-flex items-center gap-2 rounded-full border border-orange-200 px-4 py-3 text-sm font-semibold text-orange-700 disabled:opacity-60">
              <Trash2 size={14} /> Delete
            </button>
          ) : null}
        </div>
      </section>

      <section className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.26em] text-slate-400">Published links</div>
            <h3 className="mt-2 text-xl font-black text-slate-900">Select policy</h3>
          </div>
          <FileText size={18} className="text-[#E87F24]" />
        </div>
        <div className="mt-5 space-y-3">
          {rows.map((row) => (
            <button key={row.id} type="button" onClick={() => setDraft(toDraft(row))} className="w-full rounded-[22px] border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-sky-200 hover:bg-slate-100">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-lg font-black text-slate-900">{row.title}</h4>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${row.published ? 'bg-[#E87F24] text-white' : 'bg-slate-200 text-slate-500'}`}>{row.published ? 'Live' : 'Draft'}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-500">{row.summary || `/${row.slug}`}</p>
              <div className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">/{row.slug} • Header {row.show_in_header ? 'on' : 'off'} • Footer {row.show_in_footer ? 'on' : 'off'}</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
