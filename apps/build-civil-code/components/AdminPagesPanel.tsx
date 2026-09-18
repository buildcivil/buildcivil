'use client'

import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, FileText, ImageIcon, Monitor, Plus, Sparkles, Trash2 } from 'lucide-react'
import AdminMediaPicker from './AdminMediaPicker'
import { publishRefresh } from '@/lib/admin-publish'
import { readJsonResponse } from '@buildcivil/cms/safe-json'

type PageRow = {
  id: string
  slug: string
  title: string
  hero_label: string
  hero_title: string
  hero_copy: string
  hero_image: string
  content: unknown
  published: boolean
  sort_order: number
}

type AdminResponse<T> = {
  connected: boolean
  table: 'pages'
  rows: T[]
}

type PageDraft = {
  id?: string
  slug: string
  title: string
  hero_label: string
  hero_title: string
  hero_copy: string
  hero_image: string
  content: unknown
  published: boolean
  sort_order: number
}

const defaultDraft = (): PageDraft => ({
  slug: '',
  title: '',
  hero_label: '',
  hero_title: '',
  hero_copy: '',
  hero_image: '',
  content: {},
  published: true,
  sort_order: 0,
})

function toDraft(row: Partial<PageRow>): PageDraft {
  return {
    id: row.id,
    slug: row.slug ?? '',
    title: row.title ?? '',
    hero_label: row.hero_label ?? '',
    hero_title: row.hero_title ?? '',
    hero_copy: row.hero_copy ?? '',
    hero_image: row.hero_image ?? '',
    content: row.content ?? {},
    published: row.published ?? true,
    sort_order: row.sort_order ?? 0,
  }
}

async function api<T>(init?: RequestInit): Promise<T> {
  const response = await fetch('/api/admin/pages', {
    cache: 'no-store',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  const payload = await readJsonResponse<T & { error?: string }>(response, {} as T & { error?: string })
  if (!response.ok) {
    throw new Error(payload.error || 'Request failed.')
  }
  return payload
}

function SectionHeader({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.26em] text-slate-400">
        <Sparkles size={12} className="text-[#E87F24]" />
        Pages CMS
      </div>
      <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-slate-900">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">{copy}</p>
    </div>
  )
}

function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-[16px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#73A5CA] focus:ring-2 focus:ring-[#73A5CA]/20 ${props.className ?? ''}`}
    />
  )
}

function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`min-h-[120px] w-full rounded-[16px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#73A5CA] focus:ring-2 focus:ring-[#73A5CA]/20 ${props.className ?? ''}`}
    />
  )
}

function getPreviewSections(content: unknown) {
  if (!content || typeof content !== 'object' || Array.isArray(content)) return []

  return Object.entries(content as Record<string, unknown>)
    .slice(0, 6)
    .map(([key, value]) => {
      if (Array.isArray(value)) return { key, label: key, detail: `${value.length} items` }
      if (value && typeof value === 'object') return { key, label: key, detail: `${Object.keys(value).length} fields` }
      return { key, label: key, detail: String(value ?? '').slice(0, 90) || 'Empty' }
    })
}

function PageLivePreview({ draft }: { draft: PageDraft }) {
  const previewSections = getPreviewSections(draft.content)

  return (
    <div className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-slate-400">
            <Monitor size={13} className="text-[#E87F24]" />
            Live preview
          </div>
          <h3 className="mt-2 text-xl font-black text-slate-900">Before saving</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${draft.published ? 'bg-[#E87F24] text-white' : 'bg-slate-100 text-slate-500'}`}>
          {draft.published ? 'Visible' : 'Draft'}
        </span>
      </div>

      <div className="mt-5 overflow-hidden rounded-[24px] border border-slate-200 bg-[#FEFDDF] text-[#1c1712]">
        <div className="relative min-h-[260px] overflow-hidden bg-[#73A5CA]">
          {draft.hero_image ? (
            <Image src={draft.hero_image} alt={draft.title || 'Page preview'} fill className="object-cover" sizes="(min-width: 1024px) 520px, 100vw" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[#73A5CA]/70">
              <ImageIcon size={40} className="text-[#FEFDDF]/70" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1c1712]/72 via-[#1c1712]/35 to-transparent" />
          <div className="relative z-10 flex min-h-[260px] flex-col justify-end p-5">
            <div className="w-fit rounded-full border border-[#FEFDDF]/35 bg-[#FEFDDF]/18 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#FEFDDF]">
              {draft.hero_label || 'Page label'}
            </div>
            <h4 className="mt-4 max-w-xl text-3xl font-black leading-none text-[#FEFDDF] sm:text-4xl">
              {draft.hero_title || draft.title || 'Page headline'}
            </h4>
            <p className="mt-3 max-w-lg text-sm leading-6 text-[#FEFDDF]/82">
              {draft.hero_copy || 'Hero supporting copy will appear here.'}
            </p>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#73A5CA]">Page record</div>
              <div className="mt-1 text-xl font-black">{draft.title || 'Untitled page'}</div>
            </div>
            <span className="rounded-full border border-[#73A5CA]/20 px-3 py-1 text-xs text-[#6e6256]">
              /{draft.slug || 'slug'}
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {previewSections.length ? (
              previewSections.map((section) => (
                <div key={section.key} className="rounded-[18px] border border-[#73A5CA]/12 bg-slate-505 p-3">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#73A5CA]">{section.label}</div>
                  <div className="mt-2 text-sm leading-5 text-[#6e6256]">{section.detail}</div>
                </div>
              ))
            ) : (
              <div className="rounded-[18px] border border-dashed border-[#73A5CA]/18 bg-slate-505 p-4 text-sm text-[#6e6256] sm:col-span-2">
                Section data appears here after using the Sections Builder tab.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminPagesPanel() {
  const [pages, setPages] = useState<PageRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [draft, setDraft] = useState<PageDraft>(defaultDraft())

  const selectedPage = draft.id ? pages.find((page) => page.id === draft.id) : null
  const pageCount = useMemo(() => pages.length, [pages])

  async function loadPages() {
    setLoading(true)
    setError(null)
    try {
      const response = await api<AdminResponse<PageRow>>()
      setPages(response.rows)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pages.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadPages()
  }, [])

  useEffect(() => {
    if (!draft.id && pages.length > 0) {
      setDraft(toDraft(pages[0]))
    }
  }, [draft.id, pages])

  async function savePage() {
    setSaving(true)
    setError(null)
    setMessage('')
    try {
      const payload = {
        slug: draft.slug,
        title: draft.title,
        hero_label: draft.hero_label,
        hero_title: draft.hero_title,
        hero_copy: draft.hero_copy,
        hero_image: draft.hero_image,
        content: draft.content ?? {},
        published: draft.published,
        sort_order: draft.sort_order,
      }

      if (draft.id) {
        await api({
          method: 'PATCH',
          body: JSON.stringify({ id: draft.id, updates: payload }),
        })
      } else {
        await api({
          method: 'POST',
          body: JSON.stringify(payload),
        })
      }

      await loadPages()
      await publishRefresh()
      setMessage('Page saved and public cache refreshed.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save page.')
    } finally {
      setSaving(false)
    }
  }

  async function deletePage(id: string) {
    if (saving || !confirm('Delete this page record?')) return
    setSaving(true)
    setError(null)
    setMessage('')
    try {
      await api({
        method: 'DELETE',
        body: JSON.stringify({ id }),
      })
      if (draft.id === id) setDraft(defaultDraft())
      await loadPages()
      await publishRefresh()
      setMessage('Page deleted and public cache refreshed.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete page.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-6">
      <SectionHeader
        title="Edit site pages"
        copy="Update page-level copy and hero images for Home, About, Services, Projects, and Contact from one place."
      />

      {error ? (
        <div className="mt-4 rounded-[20px] border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
          {error}
        </div>
      ) : null}
      {message ? (
        <div className="mt-4 rounded-[20px] border border-emerald-200 bg-orange-50 px-4 py-3 text-sm text-[#E87F24]">
          {message}
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.26em] text-slate-400">Page editor</div>
              <h3 className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-900">Selected page</h3>
            </div>
            <button
              type="button"
              onClick={() => setDraft(defaultDraft())}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-600"
            >
              <Plus size={14} />
              New
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <div className="mb-2 text-xs uppercase tracking-[0.24em] text-slate-500">Slug</div>
              <TextInput value={draft.slug} onChange={(e) => setDraft((prev) => ({ ...prev, slug: e.target.value }))} />
            </label>
            <label className="block">
              <div className="mb-2 text-xs uppercase tracking-[0.24em] text-slate-500">Title</div>
              <TextInput value={draft.title} onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))} />
            </label>
            <label className="block">
              <div className="mb-2 text-xs uppercase tracking-[0.24em] text-slate-500">Hero label</div>
              <TextInput value={draft.hero_label} onChange={(e) => setDraft((prev) => ({ ...prev, hero_label: e.target.value }))} />
            </label>
            <label className="block">
              <div className="mb-2 text-xs uppercase tracking-[0.24em] text-slate-500">Sort order</div>
              <TextInput
                type="number"
                value={draft.sort_order}
                onChange={(e) => setDraft((prev) => ({ ...prev, sort_order: Number(e.target.value) }))}
              />
            </label>
          </div>

          <div className="mt-4 grid gap-4">
            <label className="block">
              <div className="mb-2 text-xs uppercase tracking-[0.24em] text-slate-500">Hero title</div>
              <TextArea value={draft.hero_title} onChange={(e) => setDraft((prev) => ({ ...prev, hero_title: e.target.value }))} />
            </label>
            <label className="block">
              <div className="mb-2 text-xs uppercase tracking-[0.24em] text-slate-500">Hero copy</div>
              <TextArea value={draft.hero_copy} onChange={(e) => setDraft((prev) => ({ ...prev, hero_copy: e.target.value }))} />
            </label>
            <label className="block">
              <div className="mb-2 text-xs uppercase tracking-[0.24em] text-slate-500">Hero image URL</div>
              <TextInput value={draft.hero_image} onChange={(e) => setDraft((prev) => ({ ...prev, hero_image: e.target.value }))} />
              <AdminMediaPicker
                value={draft.hero_image}
                onSelect={(url) => setDraft((prev) => ({ ...prev, hero_image: url }))}
              />
            </label>
            <div className="rounded-[22px] border border-[#E87F24]/20 bg-[#E87F24]/8 p-4 text-sm leading-6 text-slate-500">
              Page hero fields are edited here. Section content is managed through the
              <span className="font-semibold text-[#E87F24]"> Sections Builder </span>
              tab with guided forms for cards, FAQs, sliders, and other page blocks.
            </div>
            <label className="mt-1 flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={draft.published}
                onChange={(e) => setDraft((prev) => ({ ...prev, published: e.target.checked }))}
              />
              Visible on site
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={savePage}
              className="inline-flex items-center gap-3 rounded-full bg-[#E87F24] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Save page
              <ArrowRight size={15} />
            </button>
            {draft.id ? (
              <button
                type="button"
                disabled={saving}
                onClick={() => deletePage(draft.id!)}
                className="inline-flex items-center gap-2 rounded-full border border-orange-200 px-4 py-3 text-sm font-semibold text-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 size={14} />
                Delete
              </button>
            ) : null}
          </div>

          {selectedPage ? (
            <div className="mt-5 rounded-[22px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
              Editing <span className="font-semibold text-slate-900">{selectedPage.title}</span>
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <PageLivePreview draft={draft} />

          <div className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.26em] text-slate-400">Pages library</div>
                <h3 className="mt-2 text-xl font-black tracking-[-0.04em] text-slate-900">
                  {pageCount} editable pages
                </h3>
              </div>
              <FileText size={18} className="text-[#E87F24]" />
            </div>

            <div className="mt-5 space-y-3">
                {loading ? (
                  <div className="rounded-[22px] border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                    Loading pages...
                  </div>
                ) : pages.length ? (
                  pages.map((page) => (
                    <button
                      key={page.id}
                      type="button"
                      onClick={() => setDraft(toDraft(page))}
                      className="group flex w-full flex-col gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-3 text-left transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white/7 sm:flex-row"
                    >
                    <div className="flex aspect-[16/10] w-full shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-slate-200 bg-[#111111] sm:h-20 sm:w-28 sm:aspect-auto">
                      {page.hero_image ? (
                        <Image src={page.hero_image} alt={page.title} width={112} height={80} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-[10px] uppercase tracking-[0.24em] text-slate-400">No image</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="truncate text-sm font-semibold text-slate-900">{page.title}</h4>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] uppercase tracking-[0.22em] text-slate-500">
                          {page.slug}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{page.hero_title}</p>
                      <div className="mt-2 text-[10px] uppercase tracking-[0.24em] text-slate-400">
                        {page.hero_label}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-[22px] border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                  No pages available yet.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="text-[11px] uppercase tracking-[0.26em] text-slate-400">Section data</div>
            <h3 className="mt-2 text-xl font-black tracking-[-0.04em] text-slate-900">Preview-first editing</h3>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Hero changes update the preview instantly. For section-level cards, FAQs, teams, process steps,
              sliders, images, and layout controls, use the Sections Builder tab.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
