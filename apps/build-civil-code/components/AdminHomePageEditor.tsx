'use client'

import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'
import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  ImageIcon,
  Layers3,
  Monitor,
  Plus,
  RotateCcw,
  Save,
  Smartphone,
  Tablet,
  Trash2,
} from 'lucide-react'
import AdminMediaPicker from './AdminMediaPicker'
import { publishRefresh } from '@/lib/admin-publish'
import { readJsonResponse } from '@buildcivil/cms/safe-json'

type AdminResponse<T> = {
  connected: boolean
  table: 'pages'
  rows: T[]
}

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

type ProjectOption = {
  slug: string
  title: string
  category?: string
  image?: string
  description?: string
  year?: string
  stats?: Array<{ value?: string; label?: string }>
  published?: boolean
}

type SectionKey = 'hero' | 'about' | 'showcase' | 'process' | 'projects' | 'plans' | 'services' | 'faq' | 'team'
type DeviceKey = 'desktop' | 'tablet' | 'mobile'

type HomeContent = {
  sectionVisibility?: Partial<Record<SectionKey, boolean>>
  sectionSettings?: Partial<Record<SectionKey, SectionSettings>>
  seo?: {
    title?: string
    description?: string
    ogImage?: string
  }
  hero: {
    label?: string
    title: string
    copy: string
    image: string
    imageAlt?: string
    ctaLabel?: string
    ctaHref?: string
    serviceOptions?: string[]
  }
  about: {
    title: string
    copy: string
    pillars?: Array<{ icon?: string; label: string; desc: string }>
    sustainability?: { icon?: string; title: string; copy: string }
  }
  showcase: {
    title: string
    copy: string
    slides?: Array<{ projectSlug?: string; title: string; label: string; image: string; imageAlt?: string; metric: string; metricLabel: string; description: string }>
  }
  process: {
    title: string
    copy: string
    steps?: Array<{ id: string; title: string; copy: string }>
  }
  projects: {
    title: string
    copy: string
    tiles?: Array<{ type: 'stat'; title: string; copy: string; value: string; note: string } | { type: 'image'; image: string; alt?: string }>
  }
  services: {
    title: string
    copy: string
    items?: Array<{ slug: string; icon?: string; title: string; description: string }>
  }
  plans?: {
    kicker?: string
    title?: string
    copy?: string
    ctaLabel?: string
  }
  faq: {
    title: string
    copy: string
    image?: string
    imageAlt?: string
    imageBadge?: string
    highlightTitle?: string
    highlightCopy?: string
    items?: Array<{ q: string; a: string }>
  }
  team: {
    kicker: string
    title: string
    accentTitle: string
    copy: string
    items?: Array<{ name: string; role: string; experience: string; specialty: string; image: string; imageAlt?: string }>
  }
}

type SectionSettings = {
  backgroundColor?: string
  textColor?: string
  fontFamily?: string
  heroTitleFontSize?: string
  sortOrder?: number
}

const inputClass =
  'w-full rounded-[16px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#73A5CA] focus:ring-2 focus:ring-[#73A5CA]/20'
const textareaClass =
  'min-h-[118px] w-full rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#73A5CA] focus:ring-2 focus:ring-[#73A5CA]/20'

const sections: Array<{ key: SectionKey; label: string; description: string }> = [
  { key: 'hero', label: 'Hero', description: 'Cover image, headline, copy, button, and enquiry dropdown.' },
  { key: 'about', label: 'Why BuildCivil', description: 'Intro copy, value pillars, and sustainability card.' },
  { key: 'showcase', label: 'Showcase Slider', description: 'Featured project slides and metrics.' },
  { key: 'process', label: 'Process', description: 'Step-by-step delivery flow.' },
  { key: 'projects', label: 'Projects Preview', description: 'Before-after cards and image tiles.' },
  { key: 'plans', label: 'Packages / Plans', description: 'Visibility and supporting intro for package cards.' },
  { key: 'services', label: 'Services Preview', description: 'Service cards shown on homepage.' },
  { key: 'faq', label: 'FAQ', description: 'Questions, answers, and visual panel.' },
  { key: 'team', label: 'Team', description: 'Team member cards. Hidden by default on homepage.' },
]

const emptyHomeContent: HomeContent = {
  sectionVisibility: {
    hero: true,
    about: true,
    showcase: true,
    process: true,
    projects: true,
    plans: true,
    services: true,
    faq: true,
    team: false,
  },
  sectionSettings: {},
  hero: {
    label: 'Premium construction delivery',
    title: 'Architecture that\nSpeaks Volume',
    copy: '',
    image: '',
    imageAlt: 'Construction site hero image',
    ctaLabel: 'Get Consultation',
    ctaHref: '#',
    serviceOptions: ['Turnkey Construction', 'Interior & Exterior Design', 'Renovation & Remodeling', 'Architectural Planning', 'Project Management', 'Other'],
  },
  about: {
    title: '',
    copy: '',
    pillars: [],
    sustainability: { icon: '', title: '', copy: '' },
  },
  showcase: { title: '', copy: '', slides: [] },
  process: { title: '', copy: '', steps: [] },
  projects: { title: '', copy: '', tiles: [] },
  plans: { kicker: 'Construction packages', title: 'Build plans made clear', copy: 'Package cards are managed from the Packages tab.', ctaLabel: 'Get Details' },
  services: { title: '', copy: '', items: [] },
  faq: { title: '', copy: '', image: '', imageAlt: 'Construction FAQ image', imageBadge: '', highlightTitle: '', highlightCopy: '', items: [] },
  team: { kicker: '', title: '', accentTitle: '', copy: '', items: [] },
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function merge<T extends Record<string, any>>(base: T, override: unknown): T {
  if (!isRecord(override)) return clone(base)
  const output: Record<string, any> = clone(base)
  for (const [key, value] of Object.entries(override)) {
    if (isRecord(value) && isRecord(output[key])) output[key] = merge(output[key], value)
    else output[key] = value
  }
  return output as T
}

function normalizeHome(row?: PageRow | null): HomeContent {
  const merged = merge(emptyHomeContent, row?.content)
  merged.hero.label = merged.hero.label || row?.hero_label || emptyHomeContent.hero.label
  merged.hero.title = merged.hero.title || row?.hero_title || emptyHomeContent.hero.title
  merged.hero.copy = merged.hero.copy || row?.hero_copy || ''
  merged.hero.image = merged.hero.image || row?.hero_image || ''
  merged.sectionVisibility = { ...emptyHomeContent.sectionVisibility, ...(merged.sectionVisibility ?? {}) }
  merged.sectionSettings = merged.sectionSettings ?? {}
  return merged
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

async function adminProjects<T>(): Promise<T> {
  const response = await fetch('/api/admin/projects', { cache: 'no-store' })
  const payload = await readJsonResponse<T & { error?: string }>(response, {} as T & { error?: string })
  if (!response.ok) throw new Error(payload.error || 'Unable to load project library.')
  return payload
}

function slideFromProject(project: ProjectOption) {
  const stat = Array.isArray(project.stats) ? project.stats[0] : undefined
  return {
    projectSlug: project.slug,
    title: project.title,
    label: project.category?.toLowerCase() || 'project',
    image: project.image || '',
    imageAlt: project.title,
    metric: stat?.value || project.year || '01',
    metricLabel: stat?.label || 'featured project',
    description: project.description || 'Selected BuildCivil project.',
  }
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
        className="h-12 w-full cursor-pointer rounded-[16px] border border-slate-200 bg-slate-50 p-2"
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
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</span>
        {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
      </div>
      {children}
    </label>
  )
}

function SectionControl({
  section,
  content,
  onChange,
}: {
  section: SectionKey
  content: HomeContent
  onChange: (next: HomeContent) => void
}) {
  const visible = content.sectionVisibility?.[section] ?? section !== 'team'
  const settings = content.sectionSettings?.[section] ?? {}

  function updateSettings(patch: Partial<SectionSettings>) {
    onChange({
      ...content,
      sectionSettings: {
        ...(content.sectionSettings ?? {}),
        [section]: { ...settings, ...patch },
      },
    })
  }

  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Section controls</div>
          <p className="mt-1 text-sm text-slate-500">Manage visibility and presentation preferences.</p>
        </div>
        <button
          type="button"
          onClick={() =>
            onChange({
              ...content,
              sectionVisibility: { ...(content.sectionVisibility ?? {}), [section]: !visible },
            })
          }
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
            visible ? 'bg-[#E87F24] text-white' : 'border border-slate-200 bg-slate-50 text-slate-500'
          }`}
        >
          {visible ? <Eye size={14} /> : <EyeOff size={14} />}
          {visible ? 'Visible' : 'Hidden'}
        </button>
      </div>
      {section === 'hero' ? (
        <div className="mt-4">
          <Field label="Hero heading font size" hint="Example: 32px">
            <TextInput
              value={settings.heroTitleFontSize ?? ''}
              onChange={(event) => updateSettings({ heroTitleFontSize: event.target.value })}
              placeholder="32px"
            />
          </Field>
          <p className="mt-2 text-xs leading-5 text-slate-400">
            Leave empty to use the default website size. You can use values like 28px, 32px, 40px, or clamp(32px, 5vw, 72px).
          </p>
        </div>
      ) : null}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
      <Field label="Background color">
        <SolidColorInput value={settings.backgroundColor ?? ''} onChange={(value) => updateSettings({ backgroundColor: value })} />
      </Field>
        <Field label="Text color">
          <TextInput value={settings.textColor ?? ''} onChange={(event) => updateSettings({ textColor: event.target.value })} placeholder="#1c1712" />
        </Field>
        <Field label="Font family">
          <TextInput value={settings.fontFamily ?? ''} onChange={(event) => updateSettings({ fontFamily: event.target.value })} placeholder="Use site default" />
        </Field>
        <Field label="Sort order">
          <TextInput type="number" value={settings.sortOrder ?? ''} onChange={(event) => updateSettings({ sortOrder: Number(event.target.value) })} />
        </Field>
      </div>
    </div>
  )
}

function MoveButtons({ onUp, onDown, onDuplicate, onDelete }: { onUp: () => void; onDown: () => void; onDuplicate: () => void; onDelete: () => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={onUp} className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-500"><ArrowUp size={14} /></button>
      <button type="button" onClick={onDown} className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-500"><ArrowDown size={14} /></button>
      <button type="button" onClick={onDuplicate} className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-500"><Copy size={14} /></button>
      <button type="button" onClick={onDelete} className="rounded-full border border-orange-200 bg-orange-50 p-2 text-orange-700"><Trash2 size={14} /></button>
    </div>
  )
}

function SectionShell({
  title,
  copy,
  children,
}: {
  title: string
  copy: string
  children: ReactNode
}) {
  return (
    <div className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div>
        <div className="text-[11px] uppercase tracking-[0.26em] text-[#E87F24]/70">Guided editor</div>
        <h3 className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-900">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">{copy}</p>
      </div>
      <div className="mt-6 space-y-5">{children}</div>
    </div>
  )
}

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
  return (
    <Field label={label}>
      <TextInput value={value} onChange={(event) => onChange(event.target.value)} placeholder="https://..." />
      <AdminMediaPicker value={value} onSelect={onChange} />
    </Field>
  )
}

function SeoEditor({ content, onChange }: { content: HomeContent; onChange: (next: HomeContent) => void }) {
  const seo = content.seo ?? {}
  const updateSeo = (patch: NonNullable<HomeContent['seo']>) => onChange({ ...content, seo: { ...seo, ...patch } })

  return (
    <SectionShell title="SEO and social sharing" copy="Control how the homepage appears in Google, WhatsApp, and social previews.">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="SEO title" hint={`${String(seo.title ?? '').length}/60`}>
          <TextInput value={seo.title ?? ''} onChange={(event) => updateSeo({ title: event.target.value })} placeholder="BuildCivil Constructions" />
        </Field>
        <ImageField label="Social preview image" value={seo.ogImage ?? ''} onChange={(url) => updateSeo({ ogImage: url })} />
      </div>
      <Field label="SEO description" hint={`${String(seo.description ?? '').length}/160`}>
        <TextArea value={seo.description ?? ''} onChange={(event) => updateSeo({ description: event.target.value })} placeholder="Short search description" />
      </Field>
      <div className="rounded-[22px] border border-[#73A5CA]/15 bg-[#73A5CA]/8 p-4">
        <div className="text-[10px] uppercase tracking-[0.22em] text-[#9ec7e7]">Search preview</div>
        <h4 className="mt-3 line-clamp-2 text-lg font-black text-slate-900">{seo.title || content.hero.title || 'Homepage title'}</h4>
        <p className="mt-2 text-xs text-[#E87F24]/70">buildcivil.in/</p>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{seo.description || content.hero.copy || 'Homepage description appears here.'}</p>
      </div>
    </SectionShell>
  )
}

function FullHomePreview({ content }: { content: HomeContent }) {
  const visibleSections = sections.filter((section) => content.sectionVisibility?.[section.key] ?? section.key !== 'team')
  return (
    <div className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="text-[11px] uppercase tracking-[0.26em] text-slate-400">Full draft homepage</div>
      <p className="mt-2 text-sm leading-6 text-slate-500">This preview uses your unsaved draft fields, so you can check section flow before publishing.</p>
      <div className="mt-4 max-h-[640px] overflow-auto rounded-[22px] border border-slate-200 bg-[#FEFDDF] p-4 text-[#1c1712]">
        <div className="rounded-[24px] bg-[#73A5CA]/18 p-5">
          <div className="text-[10px] uppercase tracking-[0.24em] text-[#5d8fb2]">{content.hero.label}</div>
          <h3 className="mt-3 text-4xl font-black leading-none">{content.hero.title.split('\n')[0]}</h3>
          <p className="mt-3 text-sm leading-6 text-[#6e6256]">{content.hero.copy}</p>
        </div>
        <div className="mt-4 space-y-3">
          {visibleSections.filter((section) => section.key !== 'hero').map((section) => {
            const data = content[section.key] as Record<string, any>
            const list =
              section.key === 'showcase' ? content.showcase.slides :
              section.key === 'process' ? content.process.steps :
              section.key === 'projects' ? content.projects.tiles :
              section.key === 'services' ? content.services.items :
              section.key === 'faq' ? content.faq.items :
              section.key === 'team' ? content.team.items :
              section.key === 'about' ? content.about.pillars :
              []
            return (
              <div key={section.key} className="rounded-[20px] border border-[#73A5CA]/12 bg-white/70 p-4">
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#5d8fb2]">{section.label}</div>
                <h4 className="mt-2 text-xl font-black">{String(data.title ?? section.label).split('\n')[0]}</h4>
                <p className="mt-2 text-sm leading-6 text-[#6e6256]">{String(data.copy ?? '')}</p>
                {Array.isArray(list) && list.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {list.map((item, index) => {
                      const row = (isRecord(item) ? item : { label: String(item) }) as Record<string, unknown>
                      return (
                        <span key={index} className="rounded-full border border-[#73A5CA]/15 bg-[#FEFDDF] px-3 py-1 text-xs text-[#4e7693]">
                          {String(row.title ?? row.name ?? row.q ?? row.label ?? row.id ?? `Item ${index + 1}`)}
                        </span>
                      )
                    })}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function SectionEditor({
  active,
  content,
  onChange,
  projectOptions,
}: {
  active: SectionKey
  content: HomeContent
  onChange: (next: HomeContent) => void
  projectOptions: ProjectOption[]
}) {
  if (active === 'hero') {
    return (
      <div className="space-y-5">
        <HeroSectionEditor content={content} onChange={onChange} />
        <SeoEditor content={content} onChange={onChange} />
      </div>
    )
  }

  return <HomeSectionEditor active={active} content={content} onChange={onChange} projectOptions={projectOptions} />
}

function HeroSectionEditor({ content, onChange }: { content: HomeContent; onChange: (next: HomeContent) => void }) {
  const patch = (patchValue: Partial<HomeContent>) => onChange(merge(content, patchValue))
  const hero = content.hero
  const options = hero.serviceOptions ?? []

  return (
    <SectionShell title="Hero section" copy="Manage the first screen, consultation button, and service dropdown options.">
      <SectionControl section="hero" content={content} onChange={onChange} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Hero label"><TextInput value={hero.label ?? ''} onChange={(e) => patch({ hero: { ...hero, label: e.target.value } })} /></Field>
        <Field label="Button text"><TextInput value={hero.ctaLabel ?? 'Get Consultation'} onChange={(e) => patch({ hero: { ...hero, ctaLabel: e.target.value } })} /></Field>
      </div>
      <Field label="Hero heading"><TextArea value={hero.title} onChange={(e) => patch({ hero: { ...hero, title: e.target.value } })} /></Field>
      <Field label="Hero text"><TextArea value={hero.copy} onChange={(e) => patch({ hero: { ...hero, copy: e.target.value } })} /></Field>
      <div className="grid gap-4 md:grid-cols-2">
        <ImageField label="Cover image" value={hero.image} onChange={(url) => patch({ hero: { ...hero, image: url } })} />
        <Field label="Image alt text"><TextInput value={hero.imageAlt ?? ''} onChange={(e) => patch({ hero: { ...hero, imageAlt: e.target.value } })} /></Field>
      </div>
      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h4 className="text-lg font-black text-slate-900">Service dropdown options</h4>
            <p className="mt-1 text-sm text-slate-500">These appear in the hero enquiry popup.</p>
          </div>
          <button type="button" onClick={() => patch({ hero: { ...hero, serviceOptions: [...options, 'New option'] } })} className="inline-flex items-center gap-2 rounded-full bg-[#E87F24] px-4 py-2 text-sm font-semibold text-white">
            <Plus size={14} /> Add option
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {options.map((option, index) => (
            <div key={`${option}-${index}`} className="flex gap-3">
              <TextInput value={option} onChange={(event) => patch({ hero: { ...hero, serviceOptions: options.map((item, itemIndex) => itemIndex === index ? event.target.value : item) } })} />
              <button type="button" onClick={() => patch({ hero: { ...hero, serviceOptions: options.filter((_, itemIndex) => itemIndex !== index) } })} className="rounded-[16px] border border-orange-200 px-3 text-orange-700">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}

function HomeSectionEditor({
  active,
  content,
  onChange,
  projectOptions,
}: {
  active: SectionKey
  content: HomeContent
  onChange: (next: HomeContent) => void
  projectOptions: ProjectOption[]
}) {
  const patch = (patchValue: Partial<HomeContent>) => onChange(merge(content, patchValue))

  function updateList<T>(section: SectionKey, key: string, items: T[]) {
    onChange({
      ...content,
      [section]: {
        ...(content[section] as Record<string, unknown>),
        [key]: items,
      },
    })
  }

  function move<T>(items: T[], index: number, direction: -1 | 1) {
    const next = [...items]
    const target = index + direction
    if (target < 0 || target >= next.length) return next
    const [item] = next.splice(index, 1)
    next.splice(target, 0, item)
    return next
  }

  if (active === 'about') {
    const about = content.about
    const pillars = about.pillars ?? []
    return (
      <SectionShell title="Why BuildCivil section" copy="Edit the main trust section, feature pillars, and sustainability note.">
        <SectionControl section="about" content={content} onChange={onChange} />
        <Field label="Heading"><TextInput value={about.title} onChange={(e) => patch({ about: { ...about, title: e.target.value } })} /></Field>
        <Field label="Text"><TextArea value={about.copy} onChange={(e) => patch({ about: { ...about, copy: e.target.value } })} /></Field>
        <RepeatHeader title="Pillars" onAdd={() => updateList('about', 'pillars', [...pillars, { icon: 'check', label: 'New pillar', desc: 'Describe this value.' }])} />
        {pillars.map((pillar, index) => (
          <CardEditor key={index} title={`Pillar ${index + 1}`} onMove={moveHandlers(pillars, index, (items) => updateList('about', 'pillars', items))}>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Icon"><TextInput value={pillar.icon ?? ''} onChange={(e) => updateList('about', 'pillars', pillars.map((item, i) => i === index ? { ...item, icon: e.target.value } : item))} /></Field>
              <Field label="Label"><TextInput value={pillar.label} onChange={(e) => updateList('about', 'pillars', pillars.map((item, i) => i === index ? { ...item, label: e.target.value } : item))} /></Field>
              <Field label="Description"><TextInput value={pillar.desc} onChange={(e) => updateList('about', 'pillars', pillars.map((item, i) => i === index ? { ...item, desc: e.target.value } : item))} /></Field>
            </div>
          </CardEditor>
        ))}
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-lg font-black text-slate-900">Sustainability card</h4>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Field label="Icon"><TextInput value={about.sustainability?.icon ?? ''} onChange={(e) => patch({ about: { ...about, sustainability: { ...(about.sustainability ?? { title: '', copy: '' }), icon: e.target.value } } })} /></Field>
            <Field label="Title"><TextInput value={about.sustainability?.title ?? ''} onChange={(e) => patch({ about: { ...about, sustainability: { ...(about.sustainability ?? { copy: '' }), title: e.target.value } } })} /></Field>
            <Field label="Copy"><TextInput value={about.sustainability?.copy ?? ''} onChange={(e) => patch({ about: { ...about, sustainability: { ...(about.sustainability ?? { title: '' }), copy: e.target.value } } })} /></Field>
          </div>
        </div>
      </SectionShell>
    )
  }

  if (active === 'showcase') {
    const showcase = content.showcase
    const slides = showcase.slides ?? []
    const publishedProjects = projectOptions.filter((project) => project.published !== false)
    return (
      <SectionShell title="Showcase slider" copy="Choose projects from Project Library, or keep custom slide content where needed.">
        <SectionControl section="showcase" content={content} onChange={onChange} />
        <Field label="Heading"><TextArea value={showcase.title} onChange={(e) => patch({ showcase: { ...showcase, title: e.target.value } })} /></Field>
        <Field label="Text"><TextArea value={showcase.copy} onChange={(e) => patch({ showcase: { ...showcase, copy: e.target.value } })} /></Field>
        <RepeatHeader title="Slides" onAdd={() => updateList('showcase', 'slides', [...slides, publishedProjects[0] ? slideFromProject(publishedProjects[0]) : { title: 'New project', label: 'residential', image: '', imageAlt: '', metric: '100+', metricLabel: 'metric label', description: 'Short project description.' }])} />
        {slides.map((slide, index) => (
          <CardEditor key={index} title={`Slide ${index + 1}`} onMove={moveHandlers(slides, index, (items) => updateList('showcase', 'slides', items))}>
            <div className="rounded-[20px] border border-[#E87F24]/20 bg-[#E87F24]/8 p-4">
              <Field label="Project Library source">
                <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
                  <select
                    className={inputClass}
                    value={slide.projectSlug ?? ''}
                    onChange={(event) => {
                      const project = publishedProjects.find((item) => item.slug === event.target.value)
                      updateList('showcase', 'slides', slides.map((item, i) => i === index ? (project ? slideFromProject(project) : { ...slide, projectSlug: '' }) : item))
                    }}
                  >
                    <option value="">Custom slide / no linked project</option>
                    {publishedProjects.map((project) => (
                      <option key={project.slug} value={project.slug}>{project.title}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={!publishedProjects.length}
                    onClick={() => {
                      const unused = publishedProjects.find((project) => !slides.some((slideItem) => slideItem.projectSlug === project.slug))
                      const project = unused ?? publishedProjects[0]
                      if (!project) return
                      updateList('showcase', 'slides', [...slides, slideFromProject(project)])
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E87F24] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <Plus size={14} /> Add from library
                  </button>
                </div>
              </Field>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Linked slides pull the latest title, image, category, and description from Project Library after publish.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Project title"><TextInput value={slide.title} onChange={(e) => updateList('showcase', 'slides', slides.map((item, i) => i === index ? { ...item, title: e.target.value } : item))} /></Field>
              <Field label="Label"><TextInput value={slide.label} onChange={(e) => updateList('showcase', 'slides', slides.map((item, i) => i === index ? { ...item, label: e.target.value } : item))} /></Field>
              <ImageField label="Image" value={slide.image} onChange={(url) => updateList('showcase', 'slides', slides.map((item, i) => i === index ? { ...item, image: url } : item))} />
              <Field label="Image alt text"><TextInput value={slide.imageAlt ?? ''} onChange={(e) => updateList('showcase', 'slides', slides.map((item, i) => i === index ? { ...item, imageAlt: e.target.value } : item))} /></Field>
              <Field label="Metric"><TextInput value={slide.metric} onChange={(e) => updateList('showcase', 'slides', slides.map((item, i) => i === index ? { ...item, metric: e.target.value } : item))} /></Field>
              <Field label="Metric label"><TextInput value={slide.metricLabel} onChange={(e) => updateList('showcase', 'slides', slides.map((item, i) => i === index ? { ...item, metricLabel: e.target.value } : item))} /></Field>
            </div>
            <Field label="Description"><TextArea value={slide.description} onChange={(e) => updateList('showcase', 'slides', slides.map((item, i) => i === index ? { ...item, description: e.target.value } : item))} /></Field>
          </CardEditor>
        ))}
      </SectionShell>
    )
  }

  if (active === 'process') {
    const process = content.process
    const steps = process.steps ?? []
    return (
      <SectionShell title="Process section" copy="Edit the construction journey cards.">
        <SectionControl section="process" content={content} onChange={onChange} />
        <Field label="Heading"><TextInput value={process.title} onChange={(e) => patch({ process: { ...process, title: e.target.value } })} /></Field>
        <Field label="Text"><TextArea value={process.copy} onChange={(e) => patch({ process: { ...process, copy: e.target.value } })} /></Field>
        <RepeatHeader title="Process steps" onAdd={() => updateList('process', 'steps', [...steps, { id: String(steps.length + 1).padStart(2, '0'), title: 'New step', copy: 'Describe this step.' }])} />
        {steps.map((step, index) => (
          <CardEditor key={index} title={`Step ${index + 1}`} onMove={moveHandlers(steps, index, (items) => updateList('process', 'steps', items))}>
            <div className="grid gap-4 md:grid-cols-[0.3fr_0.7fr]">
              <Field label="Step number"><TextInput value={step.id} onChange={(e) => updateList('process', 'steps', steps.map((item, i) => i === index ? { ...item, id: e.target.value } : item))} /></Field>
              <Field label="Title"><TextInput value={step.title} onChange={(e) => updateList('process', 'steps', steps.map((item, i) => i === index ? { ...item, title: e.target.value } : item))} /></Field>
            </div>
            <Field label="Description"><TextArea value={step.copy} onChange={(e) => updateList('process', 'steps', steps.map((item, i) => i === index ? { ...item, copy: e.target.value } : item))} /></Field>
          </CardEditor>
        ))}
      </SectionShell>
    )
  }

  if (active === 'projects') {
    const projects = content.projects
    const tiles = projects.tiles ?? []
    return (
      <SectionShell title="Projects preview" copy="Edit the homepage before-after tile grid.">
        <SectionControl section="projects" content={content} onChange={onChange} />
        <Field label="Heading"><TextInput value={projects.title} onChange={(e) => patch({ projects: { ...projects, title: e.target.value } })} /></Field>
        <Field label="Text"><TextArea value={projects.copy} onChange={(e) => patch({ projects: { ...projects, copy: e.target.value } })} /></Field>
        <RepeatHeader title="Project tiles" onAdd={() => updateList('projects', 'tiles', [...tiles, { type: 'stat', title: 'Before - After', copy: 'Describe the transformation.', value: '100%', note: 'result note' }])} />
        {tiles.map((tile, index) => (
          <CardEditor key={index} title={`Tile ${index + 1}`} onMove={moveHandlers(tiles, index, (items) => updateList('projects', 'tiles', items))}>
            <Field label="Tile type">
              <select
                className={inputClass}
                value={tile.type}
                onChange={(event) => {
                  const nextTile = event.target.value === 'image'
                    ? { type: 'image' as const, image: '', alt: '' }
                    : { type: 'stat' as const, title: 'Before - After', copy: '', value: '100%', note: '' }
                  updateList('projects', 'tiles', tiles.map((item, i) => i === index ? nextTile : item))
                }}
              >
                <option value="stat">Text / stat tile</option>
                <option value="image">Image tile</option>
              </select>
            </Field>
            {tile.type === 'image' ? (
              <div className="grid gap-4 md:grid-cols-2">
                <ImageField label="Image" value={tile.image} onChange={(url) => updateList('projects', 'tiles', tiles.map((item, i) => i === index ? { ...tile, image: url } : item))} />
                <Field label="Image alt text"><TextInput value={tile.alt ?? ''} onChange={(e) => updateList('projects', 'tiles', tiles.map((item, i) => i === index ? { ...tile, alt: e.target.value } : item))} /></Field>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Title"><TextInput value={tile.title} onChange={(e) => updateList('projects', 'tiles', tiles.map((item, i) => i === index ? { ...tile, title: e.target.value } : item))} /></Field>
                <Field label="Value"><TextInput value={tile.value} onChange={(e) => updateList('projects', 'tiles', tiles.map((item, i) => i === index ? { ...tile, value: e.target.value } : item))} /></Field>
                <Field label="Text"><TextArea value={tile.copy} onChange={(e) => updateList('projects', 'tiles', tiles.map((item, i) => i === index ? { ...tile, copy: e.target.value } : item))} /></Field>
                <Field label="Note"><TextArea value={tile.note} onChange={(e) => updateList('projects', 'tiles', tiles.map((item, i) => i === index ? { ...tile, note: e.target.value } : item))} /></Field>
              </div>
            )}
          </CardEditor>
        ))}
      </SectionShell>
    )
  }

  if (active === 'plans') {
    const plans = content.plans ?? emptyHomeContent.plans!
    return (
      <SectionShell title="Packages / Plans section" copy="Package cards are managed from Packages. These fields control section-level presentation metadata.">
        <SectionControl section="plans" content={content} onChange={onChange} />
        <Field label="Kicker"><TextInput value={plans.kicker ?? ''} onChange={(e) => patch({ plans: { ...plans, kicker: e.target.value } })} /></Field>
        <Field label="Heading"><TextInput value={plans.title ?? ''} onChange={(e) => patch({ plans: { ...plans, title: e.target.value } })} /></Field>
        <Field label="Text"><TextArea value={plans.copy ?? ''} onChange={(e) => patch({ plans: { ...plans, copy: e.target.value } })} /></Field>
        <Field label="Card button label"><TextInput value={plans.ctaLabel ?? 'Get Details'} onChange={(e) => patch({ plans: { ...plans, ctaLabel: e.target.value } })} /></Field>
        <div className="rounded-[22px] border border-[#E87F24]/20 bg-[#E87F24]/8 p-4 text-sm leading-6 text-slate-500">
          Pricing, features, and materials are edited from the Packages tab so package data stays reusable across the site.
        </div>
      </SectionShell>
    )
  }

  if (active === 'services') {
    const services = content.services
    const items = services.items ?? []
    return (
      <SectionShell title="Services preview" copy="Edit the service cards shown on the homepage.">
        <SectionControl section="services" content={content} onChange={onChange} />
        <Field label="Heading"><TextInput value={services.title} onChange={(e) => patch({ services: { ...services, title: e.target.value } })} /></Field>
        <Field label="Text"><TextArea value={services.copy} onChange={(e) => patch({ services: { ...services, copy: e.target.value } })} /></Field>
        <RepeatHeader title="Service cards" onAdd={() => updateList('services', 'items', [...items, { slug: 'new-service', icon: 'home', title: 'New Service', description: 'Describe this service.' }])} />
        {items.map((item, index) => (
          <CardEditor key={index} title={`Service ${index + 1}`} onMove={moveHandlers(items, index, (next) => updateList('services', 'items', next))}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Slug"><TextInput value={item.slug} onChange={(e) => updateList('services', 'items', items.map((row, i) => i === index ? { ...row, slug: e.target.value } : row))} /></Field>
              <Field label="Icon"><TextInput value={item.icon ?? ''} onChange={(e) => updateList('services', 'items', items.map((row, i) => i === index ? { ...row, icon: e.target.value } : row))} /></Field>
              <Field label="Title"><TextInput value={item.title} onChange={(e) => updateList('services', 'items', items.map((row, i) => i === index ? { ...row, title: e.target.value } : row))} /></Field>
              <Field label="Description"><TextArea value={item.description} onChange={(e) => updateList('services', 'items', items.map((row, i) => i === index ? { ...row, description: e.target.value } : row))} /></Field>
            </div>
          </CardEditor>
        ))}
      </SectionShell>
    )
  }

  if (active === 'faq') {
    const faq = content.faq
    const items = faq.items ?? []
    return (
      <SectionShell title="FAQ section" copy="Edit FAQ content, labels, image, and readable visual card copy.">
        <SectionControl section="faq" content={content} onChange={onChange} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Heading"><TextInput value={faq.title} onChange={(e) => patch({ faq: { ...faq, title: e.target.value } })} /></Field>
          <Field label="Image badge"><TextInput value={faq.imageBadge ?? ''} onChange={(e) => patch({ faq: { ...faq, imageBadge: e.target.value } })} /></Field>
          <ImageField label="FAQ image" value={faq.image ?? ''} onChange={(url) => patch({ faq: { ...faq, image: url } })} />
          <Field label="Image alt text"><TextInput value={faq.imageAlt ?? ''} onChange={(e) => patch({ faq: { ...faq, imageAlt: e.target.value } })} /></Field>
        </div>
        <Field label="Text"><TextArea value={faq.copy} onChange={(e) => patch({ faq: { ...faq, copy: e.target.value } })} /></Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Image card heading"><TextInput value={faq.highlightTitle ?? ''} onChange={(e) => patch({ faq: { ...faq, highlightTitle: e.target.value } })} /></Field>
          <Field label="Image card text"><TextArea value={faq.highlightCopy ?? ''} onChange={(e) => patch({ faq: { ...faq, highlightCopy: e.target.value } })} /></Field>
        </div>
        <RepeatHeader title="FAQ items" onAdd={() => updateList('faq', 'items', [...items, { q: 'New question?', a: 'Write the answer here.' }])} />
        {items.map((item, index) => (
          <CardEditor key={index} title={`FAQ ${index + 1}`} onMove={moveHandlers(items, index, (next) => updateList('faq', 'items', next))}>
            <Field label="FAQ question"><TextInput value={item.q} onChange={(e) => updateList('faq', 'items', items.map((row, i) => i === index ? { ...row, q: e.target.value } : row))} /></Field>
            <Field label="FAQ answer"><TextArea value={item.a} onChange={(e) => updateList('faq', 'items', items.map((row, i) => i === index ? { ...row, a: e.target.value } : row))} /></Field>
          </CardEditor>
        ))}
      </SectionShell>
    )
  }

  const team = content.team
  const members = team.items ?? []
  return (
    <SectionShell title="Team section" copy="Edit team content. This section is available but hidden on homepage by default.">
      <SectionControl section="team" content={content} onChange={onChange} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Kicker"><TextInput value={team.kicker} onChange={(e) => patch({ team: { ...team, kicker: e.target.value } })} /></Field>
        <Field label="Heading"><TextInput value={team.title} onChange={(e) => patch({ team: { ...team, title: e.target.value } })} /></Field>
        <Field label="Accent heading"><TextInput value={team.accentTitle} onChange={(e) => patch({ team: { ...team, accentTitle: e.target.value } })} /></Field>
      </div>
      <Field label="Text"><TextArea value={team.copy} onChange={(e) => patch({ team: { ...team, copy: e.target.value } })} /></Field>
      <RepeatHeader title="Team members" onAdd={() => updateList('team', 'items', [...members, { name: 'New member', role: 'Role', experience: '0 years', specialty: 'Specialty', image: '', imageAlt: '' }])} />
      {members.map((member, index) => (
        <CardEditor key={index} title={member.name || `Member ${index + 1}`} onMove={moveHandlers(members, index, (next) => updateList('team', 'items', next))}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name"><TextInput value={member.name} onChange={(e) => updateList('team', 'items', members.map((row, i) => i === index ? { ...row, name: e.target.value } : row))} /></Field>
            <Field label="Designation"><TextInput value={member.role} onChange={(e) => updateList('team', 'items', members.map((row, i) => i === index ? { ...row, role: e.target.value } : row))} /></Field>
            <Field label="Experience"><TextInput value={member.experience} onChange={(e) => updateList('team', 'items', members.map((row, i) => i === index ? { ...row, experience: e.target.value } : row))} /></Field>
            <Field label="Specialty"><TextInput value={member.specialty} onChange={(e) => updateList('team', 'items', members.map((row, i) => i === index ? { ...row, specialty: e.target.value } : row))} /></Field>
            <ImageField label="Person image" value={member.image} onChange={(url) => updateList('team', 'items', members.map((row, i) => i === index ? { ...row, image: url } : row))} />
            <Field label="Image alt text"><TextInput value={member.imageAlt ?? ''} onChange={(e) => updateList('team', 'items', members.map((row, i) => i === index ? { ...row, imageAlt: e.target.value } : row))} /></Field>
          </div>
        </CardEditor>
      ))}
    </SectionShell>
  )
}

function RepeatHeader({ title, onAdd }: { title: string; onAdd: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
      <div>
        <h4 className="text-lg font-black text-slate-900">{title}</h4>
        <p className="mt-1 text-sm text-slate-400">Add, duplicate, delete, and reorder items.</p>
      </div>
      <button type="button" onClick={onAdd} className="inline-flex items-center gap-2 rounded-full bg-[#E87F24] px-4 py-2 text-sm font-semibold text-white">
        <Plus size={14} />
        Add item
      </button>
    </div>
  )
}

function CardEditor({
  title,
  onMove,
  children,
}: {
  title: string
  onMove: { up: () => void; down: () => void; duplicate: () => void; delete: () => void }
  children: ReactNode
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h4 className="text-base font-black text-slate-900">{title}</h4>
        <MoveButtons onUp={onMove.up} onDown={onMove.down} onDuplicate={onMove.duplicate} onDelete={onMove.delete} />
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function moveHandlers<T>(items: T[], index: number, update: (items: T[]) => void) {
  return {
    up: () => {
      if (index === 0) return
      const next = [...items]
      const [item] = next.splice(index, 1)
      next.splice(index - 1, 0, item)
      update(next)
    },
    down: () => {
      if (index >= items.length - 1) return
      const next = [...items]
      const [item] = next.splice(index, 1)
      next.splice(index + 1, 0, item)
      update(next)
    },
    duplicate: () => update([...items.slice(0, index + 1), clone(items[index]), ...items.slice(index + 1)]),
    delete: () => update(items.filter((_, itemIndex) => itemIndex !== index)),
  }
}

function PreviewCard({ content, active, device }: { content: HomeContent; active: SectionKey; device: DeviceKey }) {
  const widthClass = device === 'mobile' ? 'max-w-[360px]' : device === 'tablet' ? 'max-w-[720px]' : 'max-w-full'
  const section = sections.find((item) => item.key === active)
  const visible = content.sectionVisibility?.[active] ?? active !== 'team'
  const data = content[active] as Record<string, any>
  const items =
    active === 'hero'
      ? content.hero.serviceOptions ?? []
      : active === 'showcase'
        ? content.showcase.slides ?? []
        : active === 'process'
          ? content.process.steps ?? []
          : active === 'projects'
            ? content.projects.tiles ?? []
            : active === 'services'
              ? content.services.items ?? []
              : active === 'faq'
                ? content.faq.items ?? []
                : active === 'team'
                  ? content.team.items ?? []
                  : active === 'about'
                    ? content.about.pillars ?? []
                    : []

  const image = active === 'hero' ? content.hero.image : active === 'faq' ? content.faq.image : active === 'showcase' ? content.showcase.slides?.[0]?.image : ''

  return (
    <div className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-slate-400">
            <Monitor size={13} className="text-[#E87F24]" />
            Live section preview
          </div>
          <h3 className="mt-2 text-xl font-black text-slate-900">{section?.label}</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${visible ? 'bg-[#E87F24] text-white' : 'bg-slate-100 text-slate-500'}`}>
          {visible ? 'Visible' : 'Hidden'}
        </span>
      </div>
      <div className={`mx-auto mt-5 overflow-hidden rounded-[26px] border border-[#73A5CA]/16 bg-[#FEFDDF] text-[#1c1712] transition-all ${widthClass}`}>
        {image ? (
          <div className="relative h-56 overflow-hidden bg-[#73A5CA]">
            <Image src={image} alt={String(data.imageAlt ?? data.title ?? 'Preview image')} fill className="object-cover" sizes="640px" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1712]/70 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="w-fit rounded-full border border-slate-200 bg-white/18 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#FEFDDF] backdrop-blur-md">
                {data.label ?? data.kicker ?? data.imageBadge ?? section?.label}
              </div>
              <h4 className="mt-3 text-3xl font-black leading-none text-[#FEFDDF]">{String(data.title ?? section?.label ?? 'Section title').split('\n')[0]}</h4>
            </div>
          </div>
        ) : null}
        <div className="p-5">
          {!image ? (
            <>
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#5d8fb2]">{data.kicker ?? data.label ?? section?.label}</div>
              <h4 className="mt-2 text-3xl font-black leading-tight">{String(data.title ?? section?.label ?? 'Section title').split('\n')[0]}</h4>
            </>
          ) : null}
          <p className="mt-3 text-sm leading-6 text-[#6e6256]">{String(data.copy ?? data.description ?? section?.description ?? '')}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {items.map((item, index) => {
              const row = (isRecord(item) ? item : { label: String(item) }) as Record<string, unknown>
              return (
                <div key={index} className="rounded-[18px] border border-[#73A5CA]/12 bg-white/72 p-3">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#5d8fb2]">
                    {String(row.label ?? row.id ?? row.type ?? `Item ${index + 1}`)}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-[#1c1712]">
                    {String(row.title ?? row.name ?? row.q ?? row.value ?? row.label ?? `Item ${index + 1}`)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function validate(content: HomeContent) {
  const warnings: string[] = []
  if (!content.hero.title.trim()) warnings.push('Hero heading is required.')
  if (!content.hero.image.trim()) warnings.push('Hero cover image is missing.')
  if (content.hero.image && !content.hero.imageAlt?.trim()) warnings.push('Hero image alt text is missing.')
  if (content.faq.image && !content.faq.imageAlt?.trim()) warnings.push('FAQ image alt text is missing.')
  const teamWarnings = (content.team.items ?? []).filter((member) => member.image && !member.imageAlt?.trim()).length
  if (teamWarnings) warnings.push(`${teamWarnings} team image${teamWarnings > 1 ? 's are' : ' is'} missing alt text.`)
  return warnings
}

export default function AdminHomePageEditor() {
  const [page, setPage] = useState<PageRow | null>(null)
  const [content, setContent] = useState<HomeContent>(clone(emptyHomeContent))
  const [projectOptions, setProjectOptions] = useState<ProjectOption[]>([])
  const [active, setActive] = useState<SectionKey>('hero')
  const [device, setDevice] = useState<DeviceKey>('desktop')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const warnings = useMemo(() => validate(content), [content])

  async function load() {
    setLoading(true)
    setError('')
    setNotice('')
    try {
      const [payload, projectPayload] = await Promise.all([
        adminPages<AdminResponse<PageRow>>(),
        adminProjects<{ rows?: ProjectOption[] }>().catch(() => ({ rows: [] })),
      ])
      const home = payload.rows.find((row) => row.slug === 'home') ?? payload.rows[0] ?? null
      setPage(home)
      setContent(normalizeHome(home))
      setProjectOptions(projectPayload.rows ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load home page.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function save(publish: boolean) {
    if (!page) {
      setError('Home page record was not found.')
      return
    }
    setSaving(true)
    setError('')
    setNotice('')
    try {
      const payload = {
        title: page.title || 'Home',
        hero_label: content.hero.label ?? page.hero_label,
        hero_title: content.hero.title,
        hero_copy: content.hero.copy,
        hero_image: content.hero.image,
        content,
        published: publish ? true : page.published,
        sort_order: page.sort_order ?? 0,
      }
      await adminPages({
        method: 'PATCH',
        body: JSON.stringify({ id: page.id, updates: payload }),
      })
      if (publish) {
        await publishRefresh(['/'])
      }
      setNotice(publish ? 'Home page published and public cache refreshed.' : 'Draft saved.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save home page.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500">Loading Home editor...</div>
  }

  return (
    <section className="mt-6 space-y-5">
      <div className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-emerald-200 bg-orange-50 px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] text-[#E87F24]">
              Pages / Home
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-slate-900 sm:text-5xl">Home page editor</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base">
              Manage every homepage section with clear fields, media picker support, and a right-side preview before publishing.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={load} disabled={saving} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-600 disabled:opacity-50">
              <RotateCcw size={15} /> Reload
            </button>
            <button type="button" onClick={() => save(false)} disabled={saving} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-600 disabled:opacity-50">
              <Save size={15} /> Save Draft
            </button>
            <button type="button" onClick={() => save(true)} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-[#E87F24] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
              Publish <ArrowRight size={15} />
            </button>
          </div>
        </div>
        {error ? <div className="mt-5 rounded-[20px] border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">{error}</div> : null}
        {notice ? <div className="mt-5 rounded-[20px] border border-emerald-200 bg-orange-50 px-4 py-3 text-sm text-[#E87F24]">{notice}</div> : null}
        {warnings.length ? (
          <div className="mt-5 rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-700">
            {warnings.map((warning) => <div key={warning}>- {warning}</div>)}
          </div>
        ) : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_minmax(360px,0.9fr)]">
        <aside className="rounded-[30px] border border-slate-200 bg-white p-3 shadow-sm xl:sticky xl:top-6 xl:self-start">
          <div className="px-3 pb-3 pt-2 text-[11px] uppercase tracking-[0.26em] text-slate-400">Home sections</div>
          <div className="space-y-2">
            {sections.map((section) => {
              const isActive = active === section.key
              const visible = content.sectionVisibility?.[section.key] ?? section.key !== 'team'
              return (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => setActive(section.key)}
                  className={`w-full rounded-[22px] border p-3 text-left transition ${
                    isActive ? 'border-[#E87F24]/40 bg-orange-50' : 'border-slate-200 bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-900">{section.label}</span>
                    <span className={`h-2 w-2 rounded-full ${visible ? 'bg-[#E87F24]' : 'bg-white/25'}`} />
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">{section.description}</p>
                </button>
              )
            })}
          </div>
        </aside>

        <SectionEditor active={active} content={content} onChange={setContent} projectOptions={projectOptions} />

        <div className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          <div className="rounded-[30px] border border-slate-200 bg-white p-3">
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'desktop' as const, label: 'Desktop', icon: Monitor },
                { key: 'tablet' as const, label: 'Tablet', icon: Tablet },
                { key: 'mobile' as const, label: 'Mobile', icon: Smartphone },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setDevice(item.key)}
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${
                    device === item.key ? 'bg-[#E87F24] text-white' : 'border border-slate-200 bg-slate-50 text-slate-500'
                  }`}
                >
                  <item.icon size={13} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <PreviewCard content={content} active={active} device={device} />
          <FullHomePreview content={content} />
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-500">
            Preview cards are designed for fast editing. The public homepage keeps its current premium layout after publish.
          </div>
        </div>
      </div>
    </section>
  )
}
