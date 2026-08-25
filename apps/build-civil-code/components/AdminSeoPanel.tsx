'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2, Loader2, Search } from 'lucide-react'
import { publishRefresh } from '@/lib/admin-publish'
import { readJsonResponse } from '@/lib/safe-json'
import AdminMediaPicker from './AdminMediaPicker'

type PageRow = {
  id: string
  slug: string
  title: string
  hero_title: string
  hero_copy: string
  content: Record<string, any>
}

type ServiceRow = {
  id: string
  slug: string
  title: string
  description: string
  seo_title?: string
  seo_description?: string
  seo_image?: string
}

type ProjectRow = {
  id: string
  slug: string
  title: string
  description: string
  seo_title?: string
  seo_description?: string
  seo_image?: string
}

type Target = {
  type: 'page' | 'service' | 'project'
  id: string
  slug: string
  label: string
  baseTitle: string
  baseDescription: string
  baseImage: string
}

type AdminResponse<T> = {
  connected: boolean
  rows: T[]
  error?: string
}

const inputClass =
  'w-full rounded-[16px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#73A5CA] focus:ring-2 focus:ring-[#73A5CA]/20'

async function adminApi<T>(table: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/admin/${table}`, {
    cache: 'no-store',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
  const payload = await readJsonResponse<T & { error?: string }>(response, {} as T & { error?: string })
  if (!response.ok) throw new Error(payload.error || 'Admin request failed.')
  return payload
}

function limit(value: string, max: number) {
  if (value.length <= max) return value
  return `${value.slice(0, max - 1).trim()}…`
}

function buildSuggestion(target: Target, primary: string, secondary: string[], location: string, tone: string) {
  const locationText = location ? ` in ${location}` : ''
  const keyword = primary || target.baseTitle || target.label
  const title = limit(`${target.baseTitle || target.label} | ${keyword}${locationText} | BuildCivil`, 62)
  const secondaryText = secondary.length ? ` with ${secondary.slice(0, 2).join(', ')}` : ''
  const toneText = tone ? ` ${tone}` : ''
  const description = limit(
    `${target.baseDescription || `Explore ${target.label.toLowerCase()} by BuildCivil.`} BuildCivil delivers ${keyword}${locationText}${secondaryText} through clear planning, quality materials, and${toneText} execution.`,
    158,
  )
  return { title, description, keywords: [primary, ...secondary].filter(Boolean) }
}

function toTargets(pages: PageRow[], services: ServiceRow[], projects: ProjectRow[]): Target[] {
  return [
    ...pages.map((page) => ({
      type: 'page' as const,
      id: page.id,
      slug: page.slug,
      label: `${page.title || page.slug} page`,
      baseTitle: page.content?.seo?.title || page.hero_title || page.title,
      baseDescription: page.content?.seo?.description || page.hero_copy || '',
      baseImage: page.content?.seo?.ogImage || '',
    })),
    ...services.map((service) => ({
      type: 'service' as const,
      id: service.id,
      slug: service.slug,
      label: service.title,
      baseTitle: service.seo_title || service.title,
      baseDescription: service.seo_description || service.description,
      baseImage: service.seo_image || '',
    })),
    ...projects.map((project) => ({
      type: 'project' as const,
      id: project.id,
      slug: project.slug,
      label: project.title,
      baseTitle: project.seo_title || project.title,
      baseDescription: project.seo_description || project.description,
      baseImage: project.seo_image || '',
    })),
  ]
}

export default function AdminSeoPanel() {
  const [pages, setPages] = useState<PageRow[]>([])
  const [services, setServices] = useState<ServiceRow[]>([])
  const [projects, setProjects] = useState<ProjectRow[]>([])
  const [primaryKeyword, setPrimaryKeyword] = useState('construction company')
  const [secondaryKeywords, setSecondaryKeywords] = useState('home construction, turnkey construction, interior design')
  const [targetLocation, setTargetLocation] = useState('Uttar Pradesh')
  const [brandTone, setBrandTone] = useState('premium and trustworthy')
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [seoImages, setSeoImages] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const targets = useMemo(() => toTargets(pages, services, projects), [pages, services, projects])
  const secondary = useMemo(() => secondaryKeywords.split(',').map((item) => item.trim()).filter(Boolean), [secondaryKeywords])
  const suggestions = useMemo(
    () => targets.map((target) => ({ target, ...buildSuggestion(target, primaryKeyword.trim(), secondary, targetLocation.trim(), brandTone.trim()) })),
    [brandTone, primaryKeyword, secondary, targetLocation, targets],
  )

  async function load() {
    setLoading(true)
    setError('')
    try {
      const [pagePayload, servicePayload, projectPayload] = await Promise.all([
        adminApi<AdminResponse<PageRow>>('pages'),
        adminApi<AdminResponse<ServiceRow>>('services'),
        adminApi<AdminResponse<ProjectRow>>('projects'),
      ])
      setPages(pagePayload.rows)
      setServices(servicePayload.rows)
      setProjects(projectPayload.rows)
      setSelected(Object.fromEntries([...pagePayload.rows, ...servicePayload.rows, ...projectPayload.rows].map((row) => [row.id, true])))
      setSeoImages(
        Object.fromEntries(
          toTargets(pagePayload.rows, servicePayload.rows, projectPayload.rows).map((target) => [target.id, target.baseImage]),
        ),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load SEO targets.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function saveDraftRecord(item: (typeof suggestions)[number], status: 'draft' | 'applied') {
    const { target, title, description, keywords } = item
    await adminApi('seo-drafts', {
      method: 'POST',
      body: JSON.stringify({
        target_type: target.type,
        target_id: target.id,
        target_slug: target.slug,
        primary_keyword: primaryKeyword.trim(),
        secondary_keywords: secondary,
        target_location: targetLocation.trim(),
        brand_tone: brandTone.trim(),
        draft_title: title,
        draft_description: description,
        draft_keywords: keywords,
        status,
      }),
    })
  }

  async function applyOne(item: (typeof suggestions)[number]) {
    const { target, title, description } = item
    const image = seoImages[target.id]?.trim() || ''
    await saveDraftRecord(item, 'applied')

    if (target.type === 'page') {
      const page = pages.find((row) => row.id === target.id)
      const content = { ...(page?.content ?? {}), seo: { ...(page?.content?.seo ?? {}), title, description, ...(image ? { ogImage: image } : {}) } }
      await adminApi('pages', { method: 'PATCH', body: JSON.stringify({ id: target.id, updates: { content } }) })
      return
    }

    await adminApi(target.type === 'service' ? 'services' : 'projects', {
      method: 'PATCH',
      body: JSON.stringify({ id: target.id, updates: { seo_title: title, seo_description: description, ...(image ? { seo_image: image } : {}) } }),
    })
  }

  async function saveSelectedDrafts() {
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const chosen = suggestions.filter((item) => selected[item.target.id])
      for (const item of chosen) {
        await saveDraftRecord(item, 'draft')
      }
      setMessage(`${chosen.length} SEO draft${chosen.length === 1 ? '' : 's'} saved for review. Live SEO was not changed.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save SEO drafts.')
    } finally {
      setSaving(false)
    }
  }

  async function applySelected() {
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const chosen = suggestions.filter((item) => selected[item.target.id])
      for (const item of chosen) {
        await applyOne(item)
      }
      await publishRefresh()
      setMessage(`${chosen.length} SEO draft${chosen.length === 1 ? '' : 's'} applied and public cache refreshed.`)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to apply SEO suggestions.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="mt-6 space-y-5">
      <div className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-orange-50 px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] text-[#E87F24]">
          <Search size={13} />
          SEO Center
        </div>
        <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-[-0.05em] text-slate-900 sm:text-5xl">Keyword-driven SEO drafts</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
              Add launch keywords once, review suggested metadata, then apply only what you approve. Nothing overwrites live SEO until you click apply.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={saving || loading}
              onClick={saveSelectedDrafts}
              className="inline-flex items-center justify-center gap-3 rounded-full border border-sky-200 bg-orange-50 px-5 py-3 text-sm font-semibold text-[#E87F24] disabled:opacity-60"
            >
              {saving ? <Loader2 className="animate-spin" size={15} /> : <Search size={15} />}
              Save drafts
            </button>
            <button
              type="button"
              disabled={saving || loading}
              onClick={applySelected}
              className="inline-flex items-center justify-center gap-3 rounded-full bg-[#E87F24] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? <Loader2 className="animate-spin" size={15} /> : <CheckCircle2 size={15} />}
              Apply selected
            </button>
          </div>
        </div>
        {error ? <div className="mt-5 rounded-[20px] border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">{error}</div> : null}
        {message ? <div className="mt-5 rounded-[20px] border border-emerald-200 bg-orange-50 px-4 py-3 text-sm text-[#E87F24]">{message}</div> : null}
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
        <section className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="text-[11px] uppercase tracking-[0.26em] text-slate-400">Inputs</div>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-2 text-sm text-slate-600">Primary keyword<input className={inputClass} value={primaryKeyword} onChange={(e) => setPrimaryKeyword(e.target.value)} /></label>
            <label className="grid gap-2 text-sm text-slate-600">Secondary keywords<input className={inputClass} value={secondaryKeywords} onChange={(e) => setSecondaryKeywords(e.target.value)} /></label>
            <label className="grid gap-2 text-sm text-slate-600">Target location<input className={inputClass} value={targetLocation} onChange={(e) => setTargetLocation(e.target.value)} /></label>
            <label className="grid gap-2 text-sm text-slate-600">Brand tone<input className={inputClass} value={brandTone} onChange={(e) => setBrandTone(e.target.value)} /></label>
          </div>
        </section>

        <section className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.26em] text-slate-400">Draft previews</div>
              <h3 className="mt-2 text-xl font-black text-slate-900">{suggestions.length} editable SEO targets</h3>
            </div>
            <ArrowRight size={18} className="text-[#E87F24]" />
          </div>
          <div className="mt-5 grid gap-4">
            {loading ? <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">Loading SEO targets...</div> : null}
            {!loading && suggestions.map((item) => (
              <article key={`${item.target.type}-${item.target.id}`} className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.22em] text-[#E87F24]/70">{item.target.type} · {item.target.slug}</div>
                    <h4 className="mt-2 text-lg font-black text-slate-900">{item.target.label}</h4>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" checked={Boolean(selected[item.target.id])} onChange={(event) => setSelected((prev) => ({ ...prev, [item.target.id]: event.target.checked }))} />
                    Apply
                  </label>
                </div>
                <div className="mt-4 rounded-[18px] border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-[#8ab4f8]">{item.title}</div>
                  <div className="mt-1 text-xs text-[#bdc1c6]">https://buildcivil.in/{item.target.type === 'page' && item.target.slug === 'home' ? '' : item.target.slug}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
                </div>
                <div className="mt-4 rounded-[18px] border border-slate-200 bg-slate-50 p-4">
                  <label className="grid gap-2 text-sm text-slate-600">
                    Social preview image
                    <input
                      className={inputClass}
                      value={seoImages[item.target.id] ?? ''}
                      onChange={(event) => setSeoImages((prev) => ({ ...prev, [item.target.id]: event.target.value }))}
                      placeholder="Choose or paste an image URL"
                    />
                  </label>
                  <AdminMediaPicker
                    value={seoImages[item.target.id] ?? ''}
                    onSelect={(url) => setSeoImages((prev) => ({ ...prev, [item.target.id]: url }))}
                  />
                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    This image is applied to live SEO only when you click Apply selected.
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}
