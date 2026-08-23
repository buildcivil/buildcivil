'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Newspaper, Plus, Star, Trash2 } from 'lucide-react'
import { publishRefresh } from '@/lib/admin-publish'
import type { BlogPost } from '@/lib/blog'
import { readJsonResponse } from '@/lib/safe-json'
import AdminImageUploadControl from './AdminImageUploadControl'

type BlogResponse = {
  connected?: boolean
  rows: BlogPost[]
  error?: string
}

type Draft = Omit<BlogPost, 'id' | 'tags' | 'created_at' | 'updated_at' | 'published_at'> & {
  id?: string
  tags_text: string
}

const emptyDraft = (): Draft => ({
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  cover_image: '',
  cover_image_alt: '',
  author_name: 'BuildCivil Team',
  category: 'Company News',
  tags_text: '',
  read_minutes: 5,
  seo_title: '',
  seo_description: '',
  published: true,
  featured: false,
  sort_order: 0,
})

function toDraft(row: BlogPost): Draft {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    cover_image: row.cover_image,
    cover_image_alt: row.cover_image_alt,
    author_name: row.author_name,
    category: row.category,
    tags_text: row.tags.join(', '),
    read_minutes: row.read_minutes,
    seo_title: row.seo_title,
    seo_description: row.seo_description,
    published: row.published,
    featured: row.featured,
    sort_order: row.sort_order,
  }
}

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
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
const emptyBlogRows: BlogPost[] = []

export default function AdminBlogPanel() {
  const [rows, setRows] = useState<BlogPost[]>([])
  const [draft, setDraft] = useState<Draft>(emptyDraft())
  const [connected, setConnected] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  async function loadRows() {
    const response = await fetch('/api/admin/blogs', { cache: 'no-store' })
    const payload = await readJsonResponse<BlogResponse>(response, { connected: false, rows: emptyBlogRows })
    if (!response.ok) throw new Error(payload.error || 'Failed to load blog posts.')
    setRows(payload.rows)
    setConnected(Boolean(payload.connected))
  }

  useEffect(() => {
    loadRows().catch((err) => setError(err instanceof Error ? err.message : 'Failed to load blog posts.'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setConfirmDelete(false)
  }, [draft.id])

  async function saveBlogPost() {
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const payload = {
        slug: normalizeSlug(draft.slug),
        title: draft.title.trim(),
        excerpt: draft.excerpt.trim(),
        content: draft.content.trim(),
        cover_image: draft.cover_image.trim(),
        cover_image_alt: draft.cover_image_alt.trim(),
        author_name: draft.author_name.trim() || 'BuildCivil Team',
        category: draft.category.trim() || 'Company News',
        tags: draft.tags_text
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        read_minutes: Number(draft.read_minutes) || 5,
        seo_title: draft.seo_title.trim(),
        seo_description: draft.seo_description.trim(),
        published: draft.published,
        featured: draft.featured,
        sort_order: Number(draft.sort_order) || 0,
      }

      if (!payload.slug || !payload.title) {
        throw new Error('Slug and title are required.')
      }

      const response = await fetch('/api/admin/blogs', {
        method: draft.id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft.id ? { id: draft.id, updates: payload } : payload),
      })
      const result = await readJsonResponse<{ error?: string }>(response, {})
      if (!response.ok) throw new Error(result.error || 'Failed to save blog post.')
      await loadRows()
      await publishRefresh(['/', '/blog', `/blog/${payload.slug}`, '/sitemap.xml'])
      setMessage('Blog post saved and the website has been refreshed.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save blog post.')
    } finally {
      setSaving(false)
    }
  }

  async function deleteBlogPost(id: string, slug: string) {
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const response = await fetch('/api/admin/blogs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const result = await readJsonResponse<{ error?: string }>(response, {})
      if (!response.ok) throw new Error(result.error || 'Failed to delete blog post.')
      setDraft(emptyDraft())
      await loadRows()
      await publishRefresh(['/', '/blog', `/blog/${slug}`, '/sitemap.xml'])
      setMessage('Blog post deleted and the website has been refreshed.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete blog post.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.26em] text-slate-400">Blogs & News</div>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-900">{draft.id ? 'Edit post' : 'Write a new post'}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Publish articles, updates, and news. Saved posts appear instantly on the public Blog & News page.
            </p>
          </div>
          <button type="button" onClick={() => setDraft(emptyDraft())} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
            <Plus size={14} /> New
          </button>
        </div>

        {error ? <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">{error}</div> : null}
        {message ? <div className="mt-4 rounded-2xl border border-emerald-200 bg-orange-50 px-4 py-3 text-sm text-[#E87F24]">{message}</div> : null}
        {!connected ? <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">Live blog table is unavailable here. Saving is paused until Supabase is connected.</div> : null}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Slug" hint="Root URL under /blog, for example my-first-post. Cleaned up automatically on save.">
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
          <Field label="Category">
            <input className={inputClass} value={draft.category} onChange={(event) => setDraft((prev) => ({ ...prev, category: event.target.value }))} placeholder="e.g. Company News, Renovation, Process" />
          </Field>
          <Field label="Author name">
            <input className={inputClass} value={draft.author_name} onChange={(event) => setDraft((prev) => ({ ...prev, author_name: event.target.value }))} />
          </Field>
          <Field label="Tags" hint="Comma separated, e.g. renovation, tips, budget">
            <input className={inputClass} value={draft.tags_text} onChange={(event) => setDraft((prev) => ({ ...prev, tags_text: event.target.value }))} />
          </Field>
          <Field label="Read time (minutes)">
            <input className={inputClass} type="number" min={1} value={draft.read_minutes} onChange={(event) => setDraft((prev) => ({ ...prev, read_minutes: Number(event.target.value) }))} />
          </Field>
          <Field label="Sort order" hint="Lower numbers appear first within the same publish date.">
            <input className={inputClass} type="number" value={draft.sort_order} onChange={(event) => setDraft((prev) => ({ ...prev, sort_order: Number(event.target.value) }))} />
          </Field>
        </div>

        <div className="mt-4 grid gap-4">
          <Field label="Cover image" hint="Shown on the blog card and at the top of the article.">
            <input className={inputClass} value={draft.cover_image} onChange={(event) => setDraft((prev) => ({ ...prev, cover_image: event.target.value }))} />
            <AdminImageUploadControl
              value={draft.cover_image}
              altSeed={draft.title || 'BuildCivil blog cover image'}
              folder="blog"
              uploadLabel="Upload cover image"
              pickerLabel="Select cover image"
              onChange={(url) => setDraft((prev) => ({ ...prev, cover_image: url }))}
            />
          </Field>
          <Field label="Cover image alt text">
            <input className={inputClass} value={draft.cover_image_alt} onChange={(event) => setDraft((prev) => ({ ...prev, cover_image_alt: event.target.value }))} />
          </Field>
          <Field label="Excerpt" hint="A short summary shown on blog cards and search results.">
            <textarea className={`${inputClass} min-h-[90px]`} value={draft.excerpt} onChange={(event) => setDraft((prev) => ({ ...prev, excerpt: event.target.value }))} />
          </Field>
          <Field label="Article content" hint="Use blank lines to separate paragraphs and sections.">
            <textarea className={`${inputClass} min-h-[320px]`} value={draft.content} onChange={(event) => setDraft((prev) => ({ ...prev, content: event.target.value }))} />
          </Field>
          <Field label="SEO title">
            <input className={inputClass} value={draft.seo_title} onChange={(event) => setDraft((prev) => ({ ...prev, seo_title: event.target.value }))} />
          </Field>
          <Field label="SEO description">
            <textarea className={`${inputClass} min-h-[90px]`} value={draft.seo_description} onChange={(event) => setDraft((prev) => ({ ...prev, seo_description: event.target.value }))} />
          </Field>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={draft.published} onChange={(event) => setDraft((prev) => ({ ...prev, published: event.target.checked }))} />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={draft.featured} onChange={(event) => setDraft((prev) => ({ ...prev, featured: event.target.checked }))} />
            Featured on top of Blog & News page
          </label>
          <button type="button" disabled={!connected || saving} onClick={saveBlogPost} className="inline-flex items-center gap-3 rounded-full bg-[#E87F24] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
            Save post <ArrowRight size={15} />
          </button>
          {draft.id ? (
            <button
              type="button"
              disabled={!connected || saving}
              onClick={() => {
                if (!confirmDelete) {
                  setConfirmDelete(true)
                  return
                }
                deleteBlogPost(draft.id!, draft.slug)
              }}
              className="inline-flex items-center gap-2 rounded-full border border-orange-200 px-4 py-3 text-sm font-semibold text-orange-700 disabled:opacity-60"
            >
              <Trash2 size={14} /> {confirmDelete ? 'Confirm delete' : 'Delete'}
            </button>
          ) : null}
        </div>
      </section>

      <section className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.26em] text-slate-400">Published posts</div>
            <h3 className="mt-2 text-xl font-black text-slate-900">Select a post</h3>
          </div>
          <Newspaper size={18} className="text-[#E87F24]" />
        </div>
        <div className="mt-5 space-y-3">
          {rows.length ? rows.map((row) => (
            <button key={row.id} type="button" onClick={() => setDraft(toDraft(row))} className="group flex w-full flex-col gap-4 rounded-[22px] border border-slate-200 bg-slate-50 p-3 text-left transition hover:-translate-y-0.5 hover:border-sky-200 hover:bg-white sm:flex-row sm:items-start">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[16px] border border-slate-200 bg-slate-100 sm:h-20 sm:w-28 sm:shrink-0 sm:aspect-auto">
                {row.cover_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={row.cover_image} alt={row.cover_image_alt || row.title} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-slate-400">No image</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="truncate text-sm font-semibold text-slate-900">{row.title}</h4>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-black ${row.published ? 'bg-[#E87F24] text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {row.featured ? <Star size={10} /> : null}
                    {row.published ? 'Live' : 'Draft'}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{row.excerpt || 'No excerpt yet.'}</p>
                <div className="mt-2 text-[10px] uppercase tracking-[0.2em] text-slate-400">/blog/{row.slug} • {row.category} • {row.read_minutes} min read</div>
              </div>
            </button>
          )) : (
            <div className="rounded-[22px] border border-dashed border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-500">
              <div className="font-semibold text-slate-900">No blog posts yet.</div>
              <p className="mt-2">Write your first article using the form and it will appear on the public Blog & News page.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
