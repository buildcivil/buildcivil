'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Package, Plus, Trash2 } from 'lucide-react'
import { publishRefresh } from '@/lib/admin-publish'
import { readJsonResponse } from '@/lib/safe-json'

type PackageRow = {
  id: string
  slug: string
  badge: string
  name: string
  price: string
  price_unit: string
  tagline: string
  package_name: string
  icon_name: string
  features: string[]
  projects: string
  satisfaction: string
  featured: boolean
  published: boolean
  sort_order: number
  materials: { label: string; value: string; icon_name: string; sort_order: number }[]
}

type PackageResponse = {
  connected: boolean
  rows: PackageRow[]
  error?: string
}

type Draft = Omit<PackageRow, 'id' | 'features' | 'materials'> & {
  id?: string
  features_text: string
  materials_text: string
}

const emptyDraft = (): Draft => ({
  slug: '',
  badge: '',
  name: '',
  price: '',
  price_unit: '/sqft',
  tagline: '',
  package_name: '',
  icon_name: 'home',
  features_text: '',
  projects: '',
  satisfaction: '',
  featured: false,
  published: true,
  sort_order: 0,
  materials_text: '',
})

function toDraft(row: PackageRow): Draft {
  return {
    id: row.id,
    slug: row.slug,
    badge: row.badge,
    name: row.name,
    price: row.price,
    price_unit: row.price_unit,
    tagline: row.tagline,
    package_name: row.package_name,
    icon_name: row.icon_name,
    features_text: row.features.join('\n'),
    projects: row.projects,
    satisfaction: row.satisfaction,
    featured: row.featured,
    published: row.published,
    sort_order: row.sort_order,
    materials_text: row.materials.map((item) => `${item.label}|${item.value}|${item.icon_name}`).join('\n'),
  }
}

function parseLines(value: string) {
  return value.split('\n').map((item) => item.trim()).filter(Boolean)
}

function parseMaterials(value: string) {
  return parseLines(value).map((line, index) => {
    const [label = '', materialValue = '', iconName = 'package'] = line.split('|').map((item) => item.trim())
    return { label, value: materialValue, icon_name: iconName || 'package', sort_order: index }
  }).filter((item) => item.label && item.value)
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-2 text-xs uppercase tracking-[0.24em] text-white/56">{label}</div>
      {children}
    </label>
  )
}

const inputClass = 'w-full rounded-[16px] border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm text-[#F5F3EB] outline-none transition placeholder:text-white/28 focus:border-[#D8FF6A]/70 focus:ring-2 focus:ring-[#D8FF6A]/10'

export default function AdminPackagesPanel() {
  const [rows, setRows] = useState<PackageRow[]>([])
  const [draft, setDraft] = useState<Draft>(emptyDraft())
  const [connected, setConnected] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function loadRows() {
    const response = await fetch('/api/admin/packages', { cache: 'no-store' })
    const payload = await readJsonResponse<PackageResponse>(response, { connected: false, rows: [] })
    if (!response.ok) throw new Error(payload.error || 'Failed to load packages.')
    setRows(payload.rows)
    setConnected(payload.connected)
    if (!draft.id && payload.rows[0]) setDraft(toDraft(payload.rows[0]))
  }

  useEffect(() => {
    loadRows().catch((err) => setError(err instanceof Error ? err.message : 'Failed to load packages.'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function savePackage() {
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const payload = {
        ...draft,
        features: parseLines(draft.features_text),
        materials: parseMaterials(draft.materials_text),
      }
      const response = await fetch('/api/admin/packages', {
        method: draft.id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await readJsonResponse<{ error?: string }>(response, {})
      if (!response.ok) throw new Error(result.error || 'Failed to save package.')
      await loadRows()
      await publishRefresh(['/'])
      setMessage('Package saved and homepage refreshed.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save package.')
    } finally {
      setSaving(false)
    }
  }

  async function deletePackage(id: string) {
    if (!confirm('Delete this package?')) return
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const response = await fetch('/api/admin/packages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const result = await readJsonResponse<{ error?: string }>(response, {})
      if (!response.ok) throw new Error(result.error || 'Failed to delete package.')
      setDraft(emptyDraft())
      await loadRows()
      await publishRefresh(['/'])
      setMessage('Package deleted and homepage refreshed.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete package.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.26em] text-white/40">Package library</div>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">{draft.id ? 'Edit package' : 'Add package'}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/50">
              Add, edit, delete, and preview homepage construction packages, plan details, and material brands.
            </p>
          </div>
          <button type="button" onClick={() => setDraft(emptyDraft())} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/76">
            <Plus size={14} /> New
          </button>
        </div>
        {error ? <div className="mt-4 rounded-2xl border border-[#E87F24]/30 bg-[#2a1b11] px-4 py-3 text-sm text-[#ffd7b2]">{error}</div> : null}
        {message ? <div className="mt-4 rounded-2xl border border-[#D8FF6A]/20 bg-[#D8FF6A]/10 px-4 py-3 text-sm text-[#D8FF6A]">{message}</div> : null}
        {!connected ? <div className="mt-4 rounded-2xl border border-[#D8FF6A]/16 bg-[#D8FF6A]/10 px-4 py-3 text-sm text-white/70">Live database is unavailable in this environment, so package saving is paused.</div> : null}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {(['slug', 'badge', 'name', 'price', 'price_unit', 'tagline', 'package_name', 'icon_name', 'projects', 'satisfaction'] as const).map((key) => (
            <Field key={key} label={key.replaceAll('_', ' ')}>
              <input className={inputClass} value={draft[key]} onChange={(event) => setDraft((prev) => ({ ...prev, [key]: event.target.value }))} />
            </Field>
          ))}
          <Field label="sort order">
            <input className={inputClass} type="number" value={draft.sort_order} onChange={(event) => setDraft((prev) => ({ ...prev, sort_order: Number(event.target.value) }))} />
          </Field>
        </div>
        <div className="mt-4 grid gap-4">
          <Field label="features">
            <textarea className={`${inputClass} min-h-[130px]`} value={draft.features_text} onChange={(event) => setDraft((prev) => ({ ...prev, features_text: event.target.value }))} />
          </Field>
          <Field label="materials label|value|icon">
            <textarea className={`${inputClass} min-h-[150px]`} value={draft.materials_text} onChange={(event) => setDraft((prev) => ({ ...prev, materials_text: event.target.value }))} />
          </Field>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-white/65">
            <input type="checkbox" checked={draft.featured} onChange={(event) => setDraft((prev) => ({ ...prev, featured: event.target.checked }))} /> Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-white/65">
            <input type="checkbox" checked={draft.published} onChange={(event) => setDraft((prev) => ({ ...prev, published: event.target.checked }))} /> Published
          </label>
          <button type="button" disabled={!connected || saving} onClick={savePackage} className="inline-flex items-center gap-3 rounded-full bg-[#D8FF6A] px-5 py-3 text-sm font-semibold text-[#111] disabled:opacity-60">
            Save package <ArrowRight size={15} />
          </button>
          {draft.id ? (
            <button type="button" disabled={!connected || saving} onClick={() => deletePackage(draft.id!)} className="inline-flex items-center gap-2 rounded-full border border-[#E87F24]/30 px-4 py-3 text-sm font-semibold text-[#FFBC8C] disabled:opacity-60">
              <Trash2 size={14} /> Delete
            </button>
          ) : null}
        </div>
      </section>

      <section className="rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.26em] text-white/40">Package library</div>
            <h3 className="mt-2 text-xl font-black text-white">Select package</h3>
          </div>
          <Package size={18} className="text-[#D8FF6A]" />
        </div>
        <div className="mt-5 space-y-3">
          {rows.map((row) => (
            <button key={row.id} type="button" onClick={() => setDraft(toDraft(row))} className="w-full rounded-[22px] border border-white/8 bg-white/5 p-4 text-left transition hover:border-[#D8FF6A]/25 hover:bg-white/8">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-lg font-black text-white">{row.name} Package</h4>
                <span className="rounded-full bg-[#D8FF6A] px-3 py-1 text-xs font-black text-[#111]">{row.price}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-white/55">{row.tagline}</p>
              <div className="mt-2 text-xs uppercase tracking-[0.2em] text-white/36">{row.materials?.length ?? 0} materials</div>
            </button>
          ))}
          {!rows.length ? (
            <div className="rounded-[22px] border border-dashed border-white/10 bg-white/5 p-5 text-sm leading-6 text-white/55">
              No packages found. Use the form on the left to create the first package.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  )
}
