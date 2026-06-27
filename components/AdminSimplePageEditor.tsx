'use client'

import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'
import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { ArrowDown, ArrowRight, ArrowUp, Copy, ImageIcon, Monitor, Plus, RotateCcw, Save, Trash2 } from 'lucide-react'
import AdminMediaPicker from './AdminMediaPicker'
import { publishRefresh } from '@/lib/admin-publish'
import { readJsonResponse } from '@/lib/safe-json'

type PageSlug = 'about' | 'services' | 'projects' | 'contact'
type PageRow = {
  id: string
  slug: string
  title: string
  hero_label: string
  hero_title: string
  hero_copy: string
  hero_image: string
  content: Record<string, any>
  published: boolean
  sort_order: number
}

type AdminResponse<T> = {
  connected: boolean
  table: 'pages'
  rows: T[]
}

const pageLabels: Record<PageSlug, { label: string; route: string; description: string }> = {
  about: {
    label: 'About page',
    route: '/about',
    description: 'Manage hero, story, principles, stats, process, team, and CTA content.',
  },
  services: {
    label: 'Services page',
    route: '/services',
    description: 'Manage page hero and intro copy. Service cards/details stay in the Service Library.',
  },
  projects: {
    label: 'Projects page',
    route: '/projects',
    description: 'Manage page hero and filter intro copy. Project cards/details stay in the Project Library.',
  },
  contact: {
    label: 'Contact page',
    route: '/contact',
    description: 'Manage hero text, contact cards, inquiry intro, map details, and supporting contact copy.',
  },
}

const editableSections: Record<PageSlug, string[]> = {
  about: ['hero', 'story', 'principles', 'stats', 'process', 'journey', 'team', 'cta'],
  services: ['hero', 'intro', 'stats', 'visual', 'ctas'],
  projects: ['hero', 'intro', 'categories', 'stats', 'cta'],
  contact: ['hero', 'contactCards', 'form', 'officeHighlights', 'location'],
}

const inputClass =
  'w-full rounded-[16px] border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm text-[#F5F3EB] outline-none transition placeholder:text-white/28 focus:border-[#D8FF6A]/70 focus:ring-2 focus:ring-[#D8FF6A]/10'
const textareaClass =
  'min-h-[112px] w-full rounded-[16px] border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm leading-6 text-[#F5F3EB] outline-none transition placeholder:text-white/28 focus:border-[#D8FF6A]/70 focus:ring-2 focus:ring-[#D8FF6A]/10'

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ''}`} />
}

function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${textareaClass} ${props.className ?? ''}`} />
}

function isSolidHexColor(value: string | undefined) {
  return Boolean(value && /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim()))
}

function normalizeSolidHexColor(value: string) {
  const trimmed = value.trim()
  return isSolidHexColor(trimmed) ? trimmed.toUpperCase() : ''
}

function SolidColorInput({
  value,
  onChange,
  placeholder = '#FEFDDF',
}: {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  const normalized = normalizeSolidHexColor(value ?? '')
  const pickerValue = normalized || '#FEFDDF'

  return (
    <div className="grid gap-3 sm:grid-cols-[88px_minmax(0,1fr)]">
      <input
        type="color"
        value={pickerValue}
        onChange={(event) => onChange(event.target.value.toUpperCase())}
        className="h-12 w-full cursor-pointer rounded-[16px] border border-white/10 bg-[#0f0f0f] p-2"
        aria-label="Choose solid background color"
      />
      <TextInput
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        spellCheck={false}
      />
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">{label}</span>
        {hint ? <span className="text-xs text-white/32">{hint}</span> : null}
      </div>
      {children}
    </label>
  )
}

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
  return (
    <Field label={label}>
      <TextInput value={value ?? ''} onChange={(event) => onChange(event.target.value)} placeholder="https://..." />
      <AdminMediaPicker value={value ?? ''} onSelect={onChange} />
    </Field>
  )
}

function SeoEditor({ content, update }: { content: Record<string, any>; update: (path: string[], value: unknown) => void }) {
  const seo = content.seo ?? {}
  return (
    <div className="rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
      <div className="text-[11px] uppercase tracking-[0.26em] text-[#D8FF6A]/70">SEO settings</div>
      <p className="mt-2 text-sm leading-6 text-white/48">Control how this page appears in Google, WhatsApp, and social sharing.</p>
      <div className="mt-6 grid gap-4">
        <Field label="SEO title" hint={`${String(seo.title ?? '').length}/60`}>
          <TextInput value={seo.title ?? ''} onChange={(e) => update(['seo', 'title'], e.target.value)} placeholder="Page title for search" />
        </Field>
        <Field label="SEO description" hint={`${String(seo.description ?? '').length}/160`}>
          <TextArea value={seo.description ?? ''} onChange={(e) => update(['seo', 'description'], e.target.value)} placeholder="Short search description" />
        </Field>
        <ImageField label="Social preview image" value={seo.ogImage ?? ''} onChange={(url) => update(['seo', 'ogImage'], url)} />
      </div>
    </div>
  )
}

function StyleControls({ content, update, sections }: { content: Record<string, any>; update: (path: string[], value: unknown) => void; sections: string[] }) {
  const settings = content.sectionSettings ?? {}
  return (
    <div className="rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
      <div className="text-[11px] uppercase tracking-[0.26em] text-[#D8FF6A]/70">Section style controls</div>
      <p className="mt-2 text-sm leading-6 text-white/48">Safe presentation fields for each page section. These are stored with the page CMS and ready for deeper public styling.</p>
      <div className="mt-5 space-y-4">
        {sections.map((section) => (
          <div key={section} className="rounded-[22px] border border-white/8 bg-white/[0.035] p-4">
            <div className="text-sm font-black capitalize text-white">{section}</div>
            <div className="mt-3 grid gap-3 md:grid-cols-4">
              <Field label="Visible">
                <select className={inputClass} value={String(settings[section]?.visible ?? true)} onChange={(e) => update(['sectionSettings', section, 'visible'], e.target.value === 'true')}>
                  <option value="true">Visible</option>
                  <option value="false">Hidden</option>
                </select>
              </Field>
              <Field label="Background">
                <SolidColorInput value={settings[section]?.backgroundColor ?? ''} onChange={(value) => update(['sectionSettings', section, 'backgroundColor'], value)} />
              </Field>
              <Field label="Text color">
                <TextInput value={settings[section]?.textColor ?? ''} onChange={(e) => update(['sectionSettings', section, 'textColor'], e.target.value)} placeholder="#1c1712" />
              </Field>
              <Field label="Font">
                <TextInput value={settings[section]?.fontFamily ?? ''} onChange={(e) => update(['sectionSettings', section, 'fontFamily'], e.target.value)} placeholder="Default" />
              </Field>
            </div>
            {section === 'hero' ? (
              <div className="mt-3">
                <Field label="Hero heading font size" hint="Example: 32px">
                  <TextInput
                    value={settings[section]?.heroTitleFontSize ?? ''}
                    onChange={(e) => update(['sectionSettings', section, 'heroTitleFontSize'], e.target.value)}
                    placeholder="32px"
                  />
                </Field>
                <p className="mt-2 text-xs leading-5 text-white/35">
                  Leave empty to use the default website size. You can use values like 28px, 32px, 40px, or clamp(32px, 5vw, 72px).
                </p>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

function setPath(source: Record<string, any>, path: string[], value: unknown) {
  const next = clone(source)
  let cursor = next
  for (const key of path.slice(0, -1)) {
    cursor[key] = cursor[key] && typeof cursor[key] === 'object' ? cursor[key] : {}
    cursor = cursor[key]
  }
  cursor[path[path.length - 1]] = value
  return next
}

async function adminPages<T>(init?: RequestInit): Promise<T> {
  const response = await fetch('/api/admin/pages', {
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

function RepeatBlock<T>({
  title,
  items,
  blank,
  onChange,
  render,
}: {
  title: string
  items: T[]
  blank: T
  onChange: (items: T[]) => void
  render: (item: T, index: number, update: (patch: Partial<T>) => void) => ReactNode
}) {
  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const next = [...items]
    const [item] = next.splice(index, 1)
    next.splice(target, 0, item)
    onChange(next)
  }

  return (
    <div className="rounded-[26px] border border-white/8 bg-white/[0.035] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-lg font-black text-white">{title}</h4>
          <p className="mt-1 text-sm text-white/42">Add, duplicate, delete, and reorder items.</p>
        </div>
        <button type="button" onClick={() => onChange([...items, clone(blank)])} className="inline-flex items-center gap-2 rounded-full bg-[#D8FF6A] px-4 py-2 text-sm font-semibold text-[#111]">
          <Plus size={14} />
          Add item
        </button>
      </div>
      <div className="mt-4 space-y-4">
        {items.map((item, index) => (
          <div key={index} className="rounded-[22px] border border-white/8 bg-[#0f0f0f] p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-white/72">Item {index + 1}</div>
              <div className="flex gap-2">
                <button type="button" onClick={() => move(index, -1)} className="rounded-full border border-white/10 bg-white/5 p-2 text-white/60"><ArrowUp size={13} /></button>
                <button type="button" onClick={() => move(index, 1)} className="rounded-full border border-white/10 bg-white/5 p-2 text-white/60"><ArrowDown size={13} /></button>
                <button type="button" onClick={() => onChange([...items.slice(0, index + 1), clone(item), ...items.slice(index + 1)])} className="rounded-full border border-white/10 bg-white/5 p-2 text-white/60"><Copy size={13} /></button>
                <button type="button" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} className="rounded-full border border-[#E87F24]/30 bg-[#E87F24]/10 p-2 text-[#FFBC8C]"><Trash2 size={13} /></button>
              </div>
            </div>
            {render(item, index, (patch) => onChange(items.map((row, itemIndex) => itemIndex === index ? { ...row, ...patch } : row)))}
          </div>
        ))}
      </div>
    </div>
  )
}

function PagePreview({ page, content, slug }: { page: PageRow | null; content: Record<string, any>; slug: PageSlug }) {
  const hero = content.hero ?? {}
  const sectionKeys = editableSections[slug].filter((section) => section !== 'hero')
  return (
    <div className="rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-white/40">
        <Monitor size={13} className="text-[#D8FF6A]" />
        Full draft page preview
      </div>
      <p className="mt-2 text-sm leading-6 text-white/48">
        This preview uses unsaved fields from this editor, so you can check page flow before publishing.
      </p>
      <div className="mt-5 overflow-hidden rounded-[26px] border border-[#73A5CA]/16 bg-[#FEFDDF] text-[#1c1712]">
        <div className="relative min-h-[260px] bg-[#73A5CA]">
          {hero.image || page?.hero_image ? (
            <Image src={hero.image || page?.hero_image || ''} alt={hero.title || page?.title || 'Page preview'} fill className="object-cover" sizes="520px" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon size={38} className="text-[#FEFDDF]/70" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1712]/78 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5">
            <div className="w-fit rounded-full border border-white/35 bg-white/18 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#FEFDDF] backdrop-blur-md">
              {hero.label || page?.hero_label || pageLabels[slug].label}
            </div>
            <h3 className="mt-3 text-4xl font-black leading-none text-[#FEFDDF]">{hero.title || page?.hero_title}</h3>
          </div>
        </div>
        <div className="p-5">
          <p className="text-sm leading-6 text-[#6e6256]">{hero.copy || page?.hero_copy}</p>
          <div className="mt-5 space-y-3">
            {sectionKeys.map((section) => {
              const sectionContent = content[section] ?? {}
              const items = Array.isArray(sectionContent.items) ? sectionContent.items :
                Array.isArray(sectionContent.cards) ? sectionContent.cards :
                Array.isArray(sectionContent.stats) ? sectionContent.stats :
                Array.isArray(sectionContent.principles) ? sectionContent.principles :
                Array.isArray(sectionContent.contactCards) ? sectionContent.contactCards :
                Array.isArray(sectionContent.officeHighlights) ? sectionContent.officeHighlights :
                []
              return (
                <div key={section} className="rounded-[18px] border border-[#73A5CA]/12 bg-white/70 p-4">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-[#5d8fb2]">{section.replace(/([A-Z])/g, ' $1')}</div>
                  <div className="mt-2 text-xl font-black">{sectionContent.title ?? sectionContent.label ?? section}</div>
                  <p className="mt-2 text-sm leading-6 text-[#6e6256]">{sectionContent.copy ?? sectionContent.description ?? 'Section copy appears here.'}</p>
                  {items.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {items.slice(0, 6).map((item: Record<string, any>, index: number) => (
                        <span key={index} className="rounded-full border border-[#73A5CA]/15 bg-[#FEFDDF] px-3 py-1 text-xs text-[#4e7693]">
                          {item.title ?? item.label ?? item.name ?? item.value ?? `Item ${index + 1}`}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function FullPagePreview({ route }: { route: string }) {
  return (
    <div className="mt-4 rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
      <div className="text-[11px] uppercase tracking-[0.26em] text-white/40">Full live page</div>
      <p className="mt-2 text-sm leading-6 text-white/48">This shows the currently published page. Draft cards above update before saving.</p>
      <div className="mt-4 overflow-hidden rounded-[22px] border border-white/10 bg-white">
        <iframe src={route} title="Published page preview" className="h-[560px] w-full bg-white" />
      </div>
    </div>
  )
}

export default function AdminSimplePageEditor({ slug }: { slug: PageSlug }) {
  const [page, setPage] = useState<PageRow | null>(null)
  const [content, setContent] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const meta = pageLabels[slug]
  const warnings = useMemo(() => {
    const output: string[] = []
    if (!content.hero?.title?.trim()) output.push('Hero heading is required.')
    if ((slug === 'about' || slug === 'services' || slug === 'projects') && !content.hero?.image?.trim()) output.push('Hero cover image is missing.')
    return output
  }, [content, slug])

  async function load() {
    setLoading(true)
    setError('')
    setNotice('')
    try {
      const payload = await adminPages<AdminResponse<PageRow>>()
      const row = payload.rows.find((item) => item.slug === slug) ?? null
      setPage(row)
      setContent(clone(row?.content ?? {}))
    } catch (err) {
      setError(err instanceof Error ? err.message : `Unable to load ${meta.label}.`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  function update(path: string[], value: unknown) {
    setContent((prev) => setPath(prev, path, value))
  }

  async function save(publish: boolean) {
    if (!page) return setError(`${meta.label} record was not found.`)
    setSaving(true)
    setError('')
    setNotice('')
    try {
      const hero = content.hero ?? {}
      await adminPages({
        method: 'PATCH',
        body: JSON.stringify({
          id: page.id,
          updates: {
            hero_label: hero.label ?? page.hero_label,
            hero_title: hero.title ?? page.hero_title,
            hero_copy: hero.copy ?? page.hero_copy,
            hero_image: hero.image ?? page.hero_image,
            content,
            published: publish ? true : page.published,
          },
        }),
      })
      if (publish) await publishRefresh([meta.route])
      setNotice(publish ? `${meta.label} published and public cache refreshed.` : 'Draft saved.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : `Unable to save ${meta.label}.`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="mt-6 rounded-[28px] border border-white/8 bg-white/5 px-6 py-12 text-center text-sm text-white/55">Loading {meta.label}...</div>
  }

  const hero = content.hero ?? {}

  return (
    <section className="mt-6 space-y-5">
      <div className="rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-[#D8FF6A]/20 bg-[#D8FF6A]/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] text-[#D8FF6A]">
              Pages / {meta.label.replace(' page', '')}
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">{meta.label} editor</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/56 sm:text-base">{meta.description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={load} disabled={saving} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/70 disabled:opacity-50">
              <RotateCcw size={15} /> Reload
            </button>
            <button type="button" onClick={() => save(false)} disabled={saving} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/70 disabled:opacity-50">
              <Save size={15} /> Save Draft
            </button>
            <button type="button" onClick={() => save(true)} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-[#D8FF6A] px-5 py-3 text-sm font-semibold text-[#111] disabled:opacity-50">
              Publish <ArrowRight size={15} />
            </button>
          </div>
        </div>
        {error ? <div className="mt-5 rounded-[20px] border border-[#E87F24]/30 bg-[#2a1b11] px-4 py-3 text-sm text-[#ffd7b2]">{error}</div> : null}
        {notice ? <div className="mt-5 rounded-[20px] border border-[#D8FF6A]/20 bg-[#D8FF6A]/10 px-4 py-3 text-sm text-[#D8FF6A]">{notice}</div> : null}
        {warnings.length ? <div className="mt-5 rounded-[20px] border border-[#FFC81E]/25 bg-[#FFC81E]/8 px-4 py-3 text-sm leading-6 text-[#F6DA8A]">{warnings.map((warning) => <div key={warning}>- {warning}</div>)}</div> : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)]">
        <div className="space-y-5">
          <div className="rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
            <div className="text-[11px] uppercase tracking-[0.26em] text-[#D8FF6A]/70">Hero section</div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Hero label"><TextInput value={hero.label ?? page?.hero_label ?? ''} onChange={(e) => update(['hero', 'label'], e.target.value)} /></Field>
              <Field label="Hero heading"><TextInput value={hero.title ?? page?.hero_title ?? ''} onChange={(e) => update(['hero', 'title'], e.target.value)} /></Field>
              <Field label="Hero text"><TextArea value={hero.copy ?? page?.hero_copy ?? ''} onChange={(e) => update(['hero', 'copy'], e.target.value)} /></Field>
              <ImageField label="Cover image" value={hero.image ?? page?.hero_image ?? ''} onChange={(url) => update(['hero', 'image'], url)} />
            </div>
          </div>

          {slug === 'about' ? (
            <>
              <SeoEditor content={content} update={update} />
              <StyleControls content={content} update={update} sections={editableSections[slug]} />
              <TextSection title="Story section" data={content.story ?? {}} onChange={(key, value) => update(['story', key], value)} />
              <RepeatBlock
                title="Principles"
                items={content.principles ?? []}
                blank={{ icon: 'shield', title: 'New principle', copy: 'Describe this principle.' }}
                onChange={(items) => update(['principles'], items)}
                render={(item, _index, patch) => (
                  <div className="grid gap-4 md:grid-cols-3">
                    <Field label="Icon"><TextInput value={item.icon ?? ''} onChange={(e) => patch({ icon: e.target.value })} /></Field>
                    <Field label="Title"><TextInput value={item.title ?? ''} onChange={(e) => patch({ title: e.target.value })} /></Field>
                    <Field label="Copy"><TextInput value={item.copy ?? ''} onChange={(e) => patch({ copy: e.target.value })} /></Field>
                  </div>
                )}
              />
              <RepeatBlock
                title="Stats"
                items={content.stats ?? []}
                blank={{ value: '100+', label: 'New stat' }}
                onChange={(items) => update(['stats'], items)}
                render={(item, _index, patch) => (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Value"><TextInput value={item.value ?? ''} onChange={(e) => patch({ value: e.target.value })} /></Field>
                    <Field label="Label"><TextInput value={item.label ?? ''} onChange={(e) => patch({ label: e.target.value })} /></Field>
                  </div>
                )}
              />
              <TextSection title="Process intro" data={content.process ?? {}} onChange={(key, value) => update(['process', key], value)} />
              <RepeatBlock
                title="Journey steps"
                items={content.journey ?? []}
                blank={{ step: '01', title: 'New step', copy: 'Describe this step.' }}
                onChange={(items) => update(['journey'], items)}
                render={(item, _index, patch) => (
                  <div className="grid gap-4 md:grid-cols-[0.3fr_0.7fr]">
                    <Field label="Step"><TextInput value={item.step ?? ''} onChange={(e) => patch({ step: e.target.value })} /></Field>
                    <Field label="Title"><TextInput value={item.title ?? ''} onChange={(e) => patch({ title: e.target.value })} /></Field>
                    <div className="md:col-span-2"><Field label="Copy"><TextArea value={item.copy ?? ''} onChange={(e) => patch({ copy: e.target.value })} /></Field></div>
                  </div>
                )}
              />
              <TeamMiniEditor content={content} update={update} />
              <TextSection title="CTA section" data={content.cta ?? {}} onChange={(key, value) => update(['cta', key], value)} />
            </>
          ) : null}

          {slug === 'services' || slug === 'projects' ? (
            <>
              <SeoEditor content={content} update={update} />
              <StyleControls content={content} update={update} sections={editableSections[slug]} />
              <TextSection title="Intro section" data={content.intro ?? {}} onChange={(key, value) => update(['intro', key], value)} />
              {slug === 'services' ? (
                <>
                  <RepeatBlock
                    title="Hero stats"
                    items={content.stats ?? []}
                    blank={{ value: '100%', label: 'New stat label' }}
                    onChange={(items) => update(['stats'], items)}
                    render={(item, _index, patch) => (
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Value"><TextInput value={item.value ?? ''} onChange={(e) => patch({ value: e.target.value })} /></Field>
                        <Field label="Label"><TextInput value={item.label ?? ''} onChange={(e) => patch({ label: e.target.value })} /></Field>
                      </div>
                    )}
                  />
                  <TextSection title="Hero visual card" data={content.visual ?? {}} onChange={(key, value) => update(['visual', key], value)} />
                  <div className="rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
                    <div className="text-[11px] uppercase tracking-[0.26em] text-[#D8FF6A]/70">Hero buttons</div>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <Field label="Primary button text"><TextInput value={content.ctas?.primaryLabel ?? ''} onChange={(e) => update(['ctas', 'primaryLabel'], e.target.value)} /></Field>
                      <Field label="Primary button link"><TextInput value={content.ctas?.primaryHref ?? ''} onChange={(e) => update(['ctas', 'primaryHref'], e.target.value)} /></Field>
                      <Field label="Secondary button text"><TextInput value={content.ctas?.secondaryLabel ?? ''} onChange={(e) => update(['ctas', 'secondaryLabel'], e.target.value)} /></Field>
                      <Field label="Secondary button link"><TextInput value={content.ctas?.secondaryHref ?? ''} onChange={(e) => update(['ctas', 'secondaryHref'], e.target.value)} /></Field>
                    </div>
                  </div>
                </>
              ) : null}
              {slug === 'projects' ? (
                <>
                  <RepeatBlock
                    title="Filter categories"
                    items={(content.categories ?? []).map((label: string) => ({ label }))}
                    blank={{ label: 'New category' }}
                    onChange={(items) => update(['categories'], items.map((item) => item.label).filter(Boolean))}
                    render={(item, _index, patch) => (
                      <Field label="Category label"><TextInput value={item.label ?? ''} onChange={(e) => patch({ label: e.target.value })} /></Field>
                    )}
                  />
                  <RepeatBlock
                    title="Hero stats"
                    items={content.stats ?? []}
                    blank={{ value: '100+', label: 'New stat label' }}
                    onChange={(items) => update(['stats'], items)}
                    render={(item, _index, patch) => (
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Value"><TextInput value={item.value ?? ''} onChange={(e) => patch({ value: e.target.value })} /></Field>
                        <Field label="Label"><TextInput value={item.label ?? ''} onChange={(e) => patch({ label: e.target.value })} /></Field>
                      </div>
                    )}
                  />
                  <TextSection title="Bottom CTA section" data={content.cta ?? {}} onChange={(key, value) => update(['cta', key], value)} />
                  <div className="rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
                    <div className="text-[11px] uppercase tracking-[0.26em] text-[#D8FF6A]/70">CTA button</div>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <Field label="Button text"><TextInput value={content.cta?.label ?? ''} onChange={(e) => update(['cta', 'label'], e.target.value)} /></Field>
                      <Field label="Button link"><TextInput value={content.cta?.href ?? ''} onChange={(e) => update(['cta', 'href'], e.target.value)} /></Field>
                    </div>
                  </div>
                </>
              ) : null}
              <div className="rounded-[24px] border border-[#D8FF6A]/15 bg-[#D8FF6A]/8 p-4 text-sm leading-6 text-white/58">
                {slug === 'services'
                  ? 'Individual service cards and detail pages are managed from Content > Service Library, including galleries, stats, process steps, and images.'
                  : 'Individual project cards and detail pages are managed from Content > Project Library, including galleries, highlights, stats, and images.'}
              </div>
            </>
          ) : null}

          {slug === 'contact' ? (
            <>
              <SeoEditor content={content} update={update} />
              <StyleControls content={content} update={update} sections={editableSections[slug]} />
              <RepeatBlock
                title="Contact cards"
                items={content.contactCards ?? []}
                blank={{ icon: 'phone', label: 'Call us', value: '+91 83030 76294' }}
                onChange={(items) => update(['contactCards'], items)}
                render={(item, _index, patch) => (
                  <div className="grid gap-4 md:grid-cols-3">
                    <Field label="Icon">
                      <select className={inputClass} value={item.icon ?? 'phone'} onChange={(event) => patch({ icon: event.target.value })}>
                        <option value="phone">Phone</option>
                        <option value="mail">Email</option>
                        <option value="map">Address</option>
                      </select>
                    </Field>
                    <Field label="Label"><TextInput value={item.label ?? ''} onChange={(event) => patch({ label: event.target.value })} /></Field>
                    <Field label="Value"><TextInput value={item.value ?? ''} onChange={(event) => patch({ value: event.target.value })} /></Field>
                  </div>
                )}
              />
              <TextSection title="Contact form intro" data={content.form ?? {}} onChange={(key, value) => update(['form', key], value)} />
              <RepeatBlock
                title="Office highlights"
                items={content.officeHighlights ?? []}
                blank={{ label: 'Response time', value: 'Within one business day' }}
                onChange={(items) => update(['officeHighlights'], items)}
                render={(item, _index, patch) => (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Label"><TextInput value={item.label ?? ''} onChange={(event) => patch({ label: event.target.value })} /></Field>
                    <Field label="Value"><TextInput value={item.value ?? ''} onChange={(event) => patch({ value: event.target.value })} /></Field>
                  </div>
                )}
              />
              <div className="rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
                <div className="text-[11px] uppercase tracking-[0.26em] text-[#D8FF6A]/70">Map and location panel</div>
                <p className="mt-2 text-sm leading-6 text-white/48">Use an embeddable Google Maps URL and customer-friendly location copy.</p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <Field label="Small label"><TextInput value={content.location?.label ?? ''} onChange={(event) => update(['location', 'label'], event.target.value)} /></Field>
                  <Field label="Heading"><TextInput value={content.location?.title ?? ''} onChange={(event) => update(['location', 'title'], event.target.value)} /></Field>
                  <Field label="Map embed URL"><TextInput value={content.location?.mapEmbedUrl ?? ''} onChange={(event) => update(['location', 'mapEmbedUrl'], event.target.value)} placeholder="https://www.google.com/maps/embed?..." /></Field>
                  <Field label="Detail heading"><TextInput value={content.location?.detailTitle ?? ''} onChange={(event) => update(['location', 'detailTitle'], event.target.value)} /></Field>
                  <Field label="Email"><TextInput value={content.location?.email ?? ''} onChange={(event) => update(['location', 'email'], event.target.value)} /></Field>
                  <Field label="Phone"><TextInput value={content.location?.phone ?? ''} onChange={(event) => update(['location', 'phone'], event.target.value)} /></Field>
                  <Field label="Location copy"><TextArea value={content.location?.copy ?? ''} onChange={(event) => update(['location', 'copy'], event.target.value)} /></Field>
                  <Field label="Detail copy"><TextArea value={content.location?.detailCopy ?? ''} onChange={(event) => update(['location', 'detailCopy'], event.target.value)} /></Field>
                </div>
              </div>
              <div className="rounded-[24px] border border-[#D8FF6A]/15 bg-[#D8FF6A]/8 p-4 text-sm leading-6 text-white/58">
                Contact form labels, placeholders, dropdowns, and required fields are managed from Theme &amp; Settings &gt; Forms &amp; Fields.
              </div>
            </>
          ) : null}
        </div>

        <div className="xl:sticky xl:top-6 xl:self-start">
          <PagePreview page={page} content={content} slug={slug} />
          <FullPagePreview route={meta.route} />
        </div>
      </div>
    </section>
  )
}

function TextSection({ title, data, onChange }: { title: string; data: Record<string, any>; onChange: (key: string, value: string) => void }) {
  return (
    <div className="rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
      <div className="text-[11px] uppercase tracking-[0.26em] text-[#D8FF6A]/70">{title}</div>
      <div className="mt-6 grid gap-4">
        <Field label="Heading"><TextInput value={data.title ?? ''} onChange={(e) => onChange('title', e.target.value)} /></Field>
        <Field label="Text"><TextArea value={data.copy ?? ''} onChange={(e) => onChange('copy', e.target.value)} /></Field>
      </div>
    </div>
  )
}

function TeamMiniEditor({ content, update }: { content: Record<string, any>; update: (path: string[], value: unknown) => void }) {
  const team = content.team ?? {}
  return (
    <div className="rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
      <div className="text-[11px] uppercase tracking-[0.26em] text-[#D8FF6A]/70">Team section</div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="Kicker"><TextInput value={team.kicker ?? ''} onChange={(e) => update(['team', 'kicker'], e.target.value)} /></Field>
        <Field label="Heading"><TextInput value={team.title ?? ''} onChange={(e) => update(['team', 'title'], e.target.value)} /></Field>
        <Field label="Accent heading"><TextInput value={team.accentTitle ?? ''} onChange={(e) => update(['team', 'accentTitle'], e.target.value)} /></Field>
        <Field label="Text"><TextArea value={team.copy ?? ''} onChange={(e) => update(['team', 'copy'], e.target.value)} /></Field>
      </div>
      <RepeatBlock
        title="Team members"
        items={team.items ?? []}
        blank={{ name: 'New member', role: 'Role', experience: '0 years', specialty: 'Specialty', image: '' }}
        onChange={(items) => update(['team', 'items'], items)}
        render={(item, _index, patch) => (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name"><TextInput value={item.name ?? ''} onChange={(e) => patch({ name: e.target.value })} /></Field>
            <Field label="Designation"><TextInput value={item.role ?? ''} onChange={(e) => patch({ role: e.target.value })} /></Field>
            <Field label="Experience"><TextInput value={item.experience ?? ''} onChange={(e) => patch({ experience: e.target.value })} /></Field>
            <Field label="Specialty"><TextInput value={item.specialty ?? ''} onChange={(e) => patch({ specialty: e.target.value })} /></Field>
            <ImageField label="Image" value={item.image ?? ''} onChange={(url) => patch({ image: url })} />
          </div>
        )}
      />
    </div>
  )
}
