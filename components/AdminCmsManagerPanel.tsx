'use client'

import { type CSSProperties, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  GripVertical,
  ImageIcon,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from 'lucide-react'
import AdminMediaPicker from './AdminMediaPicker'
import { publishRefresh } from '@/lib/admin-publish'
import { readJsonResponse } from '@/lib/safe-json'

type CmsMode = 'sections' | 'theme' | 'brand' | 'fonts' | 'forms' | 'navigation'

type AdminResponse<T> = {
  rows: T[]
  connected?: boolean
  error?: string
}

type SiteSectionRow = {
  id?: string
  page_slug: string
  section_key: string
  title: string
  subtitle: string
  kicker: string
  copy: string
  image_url: string
  image_alt: string
  cta_label: string
  cta_href: string
  layout_preset: string
  background_color: string
  text_color: string
  visible: boolean
  sort_order: number
  style: unknown
  content: unknown
}

type SiteThemeRow = {
  id?: string
  key: string
  colors: Record<string, string>
  typography: Record<string, string>
  spacing: Record<string, string>
  buttons: Record<string, string>
  cards: Record<string, string>
  motion: Record<string, string>
  published: boolean
}

type BrandAssetsRow = {
  id?: string
  key: string
  header_logo_url: string
  footer_logo_url: string
  header_logo_alt: string
  footer_logo_alt: string
  favicon_url: string
  social_image_url: string
  brand_text: Record<string, string>
  logo_settings: Record<string, string | number | boolean>
  brand_colors: Record<string, string>
  published: boolean
}

type FormDefinitionRow = {
  id?: string
  form_key: string
  title: string
  description: string
  submit_label: string
  success_message: string
  error_message: string
  fields: unknown
  visible: boolean
}

type NavigationRow = {
  id?: string
  location: string
  label: string
  href: string
  target: string
  icon: string
  visible: boolean
  sort_order: number
}

type CmsTable =
  | 'site-sections'
  | 'site-theme'
  | 'brand-assets'
  | 'form-definitions'
  | 'site-navigation'

type PanelProps = {
  mode: CmsMode
}

const modeCopy: Record<CmsMode, { eyebrow: string; title: string; copy: string }> = {
  sections: {
    eyebrow: 'Sections Builder',
    title: 'Edit every page section without raw code',
    copy: 'Control titles, copy, images, CTA links, visibility, order, layout presets, and advanced structured arrays.',
  },
  theme: {
    eyebrow: 'Theme Studio',
    title: 'Tune the global visual system',
    copy: 'Update approved color tokens, spacing, card treatment, buttons, and motion intensity while preserving the current BuildCivil design.',
  },
  brand: {
    eyebrow: 'Logos & Brand',
    title: 'Manage logo, favicon, and brand identity',
    copy: 'Change header/footer logo assets, brand text, logo sizing, social preview image, and brand accent controls.',
  },
  fonts: {
    eyebrow: 'Fonts',
    title: 'Control typography safely',
    copy: 'Choose approved font families, add Google Font URLs, and adjust body/nav/button sizing without touching code.',
  },
  forms: {
    eyebrow: 'Forms & Fields',
    title: 'Manage public form labels and placeholders',
    copy: 'Edit form titles, success/error messages, submit labels, required flags, dropdown options, and placeholder text.',
  },
  navigation: {
    eyebrow: 'Site Navigation',
    title: 'Reorder and edit header/footer links',
    copy: 'Add, hide, delete, and drag-sort menu links for header, footer, legal, and future navigation groups.',
  },
}

const pageOptions = ['home', 'about', 'services', 'projects', 'contact']
const locationOptions = ['header', 'footer_company', 'footer_legal', 'footer_social']

const inputClass =
  'w-full rounded-[16px] border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm text-[#F5F3EB] outline-none transition placeholder:text-white/28 focus:border-[#D8FF6A]/70 focus:ring-2 focus:ring-[#D8FF6A]/10'

const textareaClass =
  'min-h-[120px] w-full rounded-[16px] border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm text-[#F5F3EB] outline-none transition placeholder:text-white/28 focus:border-[#D8FF6A]/70 focus:ring-2 focus:ring-[#D8FF6A]/10'

function emptySection(): SiteSectionRow {
  return {
    page_slug: 'home',
    section_key: '',
    title: '',
    subtitle: '',
    kicker: '',
    copy: '',
    image_url: '',
    image_alt: '',
    cta_label: '',
    cta_href: '',
    layout_preset: 'default',
    background_color: '',
    text_color: '',
    visible: true,
    sort_order: 0,
    style: {},
    content: {},
  }
}

function emptyTheme(): SiteThemeRow {
  return {
    key: 'default',
    colors: {
      highlight: '#E87F24',
      border: '#FFC81E',
      base: '#FEFDDF',
      header: '#73A5CA',
      footer: '#73A5CA',
      dark: '#141412',
      ink: '#1f1b16',
      muted: '#776d62',
    },
    typography: {
      headingFamily: "'Outfit'",
      bodyFamily: "'Manrope'",
      displayFamily: "'Outfit'",
      baseSize: '16px',
      lineHeight: '1.65',
      navSize: '13px',
      buttonSize: '14px',
      googleFontUrl: '',
    },
    spacing: {
      sectionPadding: 'clamp(70px, 8vw, 130px)',
      containerPadding: 'clamp(18px, 4vw, 72px)',
      mobilePadding: '22px',
    },
    buttons: {
      backgroundColor: 'linear-gradient(135deg, #73A5CA 0%, #E87F24 52%, #FFC81E 100%)',
      textColor: '#1c1712',
      borderColor: 'transparent',
      hoverBackgroundColor: 'linear-gradient(135deg, #E87F24 0%, #FFC81E 100%)',
      hoverTextColor: '#1c1712',
      hoverBorderColor: 'transparent',
      fontFamily: 'var(--font-body, Inter)',
      radius: '999px',
      style: 'gloss',
      textTransform: 'none',
    },
    cards: {
      radius: '32px',
      shadow: 'soft',
      glassIntensity: 'medium',
    },
    motion: {
      intensity: 'subtle',
    },
    published: true,
  }
}

function emptyBrand(): BrandAssetsRow {
  return {
    key: 'default',
    header_logo_url: '',
    footer_logo_url: '',
    header_logo_alt: 'BuildCivil Constructions',
    footer_logo_alt: 'BuildCivil Constructions',
    favicon_url: '',
    social_image_url: '',
    brand_text: {
      markTop: 'BU',
      markBottom: 'CI',
      wordTop: 'ILD',
      wordBottom: 'VIL',
      mobileTop: 'Build',
      mobileBottom: 'Civil',
      name: 'BuildCivil',
      tagline: 'Constructions',
    },
    logo_settings: {
      headerDesktopWidth: 180,
      headerTabletWidth: 150,
      headerMobileWidth: 126,
      footerDesktopWidth: 190,
      footerTabletWidth: 150,
      markSize: 56,
      showImageLogo: false,
    },
    brand_colors: {
      primary: '#FEFDDF',
      accent: '#FFC81E',
      markBackground: '#FFC81E',
    },
    published: true,
  }
}

function emptyForm(): FormDefinitionRow {
  return {
    form_key: '',
    title: '',
    description: '',
    submit_label: 'Submit',
    success_message: 'Saved successfully.',
    error_message: 'Something went wrong. Please try again.',
    fields: [],
    visible: true,
  }
}

function emptyNavigation(): NavigationRow {
  return {
    location: 'header',
    label: '',
    href: '/',
    target: '_self',
    icon: '',
    visible: true,
    sort_order: 0,
  }
}

type FormFieldItem = {
  name: string
  label: string
  type: string
  placeholder: string
  required: boolean
  options: string[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}

function asContentRecord(value: unknown) {
  return isRecord(value) ? value : {}
}

function normalizeFormFields(value: unknown): FormFieldItem[] {
  if (!Array.isArray(value)) return []
  return value.map((field, index) => {
    const item = isRecord(field) ? field : {}
    const name = typeof item.name === 'string' ? item.name : typeof item.id === 'string' ? item.id : `field_${index + 1}`
    return {
      name,
      label: typeof item.label === 'string' ? item.label : '',
      type: typeof item.type === 'string' ? item.type : 'text',
      placeholder: typeof item.placeholder === 'string' ? item.placeholder : '',
      required: Boolean(item.required),
      options: Array.isArray(item.options) ? item.options.map(String) : [],
    }
  })
}

function emptyFormField(): FormFieldItem {
  return {
    name: '',
    label: '',
    type: 'text',
    placeholder: '',
    required: false,
    options: [],
  }
}

function normalizedLink(value: string) {
  const trimmed = value.trim()
  return trimmed.startsWith('/') || trimmed.startsWith('#') || trimmed.startsWith('http') || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')
}

function luminance(hex: string) {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return null
  const rgb = [0, 2, 4].map((start) => parseInt(clean.slice(start, start + 2), 16) / 255)
  const linear = rgb.map((channel) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4))
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
}

function contrastRatio(a?: string, b?: string) {
  if (!a || !b) return null
  const first = luminance(a)
  const second = luminance(b)
  if (first === null || second === null) return null
  const light = Math.max(first, second)
  const dark = Math.min(first, second)
  return (light + 0.05) / (dark + 0.05)
}

function isHexColor(value?: string) {
  return Boolean(value && /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value.trim()))
}

function ColorTokenInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <div className="flex gap-3">
      <input
        type="color"
        value={isHexColor(value) ? value : '#ffffff'}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-14 rounded-[14px] border border-white/10 bg-transparent"
        aria-label="Pick color"
      />
      <input className={inputClass} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </div>
  )
}

function buttonPreviewStyle(buttons: SiteThemeRow['buttons'], hover = false): CSSProperties {
  return {
    background: hover
      ? buttons.hoverBackgroundColor || buttons.backgroundColor || undefined
      : buttons.backgroundColor || undefined,
    color: hover ? buttons.hoverTextColor || buttons.textColor || undefined : buttons.textColor || undefined,
    borderColor: hover ? buttons.hoverBorderColor || buttons.borderColor || undefined : buttons.borderColor || undefined,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: buttons.radius || undefined,
    fontFamily: buttons.fontFamily || undefined,
    textTransform: (buttons.textTransform as CSSProperties['textTransform']) || undefined,
  }
}

async function adminFetch<T>(table: CmsTable, init?: RequestInit): Promise<AdminResponse<T>> {
  const response = await fetch(`/api/admin/${table}`, {
    cache: 'no-store',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
  const payload = await readJsonResponse<AdminResponse<T>>(response, {
    connected: response.ok,
    table,
    rows: [],
  } as AdminResponse<T>)
  if (!response.ok) throw new Error(payload.error || 'Request failed.')
  return payload
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <div className="mb-2 text-xs uppercase tracking-[0.24em] text-white/56">{label}</div>
      {children}
      {hint ? <div className="mt-2 text-xs leading-5 text-white/36">{hint}</div> : null}
    </label>
  )
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
        checked ? 'bg-[#D8FF6A] text-[#111]' : 'border border-white/10 bg-white/5 text-white/62'
      }`}
    >
      {checked ? <Eye size={14} /> : <EyeOff size={14} />}
      {label}
    </button>
  )
}

function CmsPreview({
  title,
  kicker,
  copy,
  image,
  imageAlt,
  cta,
  ctaStyle,
}: {
  title: string
  kicker?: string
  copy?: string
  image?: string
  imageAlt?: string
  cta?: string
  ctaStyle?: CSSProperties
}) {
  return (
    <aside className="rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.26em] text-white/40">Live preview</div>
          <h3 className="mt-2 text-xl font-black tracking-[-0.04em] text-white">Before publishing</h3>
        </div>
        <CheckCircle2 size={18} className="text-[#D8FF6A]" />
      </div>
      <div className="mt-5 overflow-hidden rounded-[26px] border border-white/8 bg-[#FEFDDF] text-[#1f1b16]">
        {image ? (
          <div className="relative aspect-[16/9] bg-[#111]">
            <Image src={image} alt={imageAlt || title || 'CMS preview image'} fill className="object-cover" sizes="420px" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/8 to-transparent" />
          </div>
        ) : (
          <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-[#73A5CA]/30 via-[#FEFDDF] to-[#FFC81E]/25 text-[#73A5CA]">
            <ImageIcon size={34} />
          </div>
        )}
        <div className="p-5">
          {kicker ? (
            <div className="mb-3 inline-flex rounded-full border border-[#73A5CA]/25 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-[#73A5CA]">
              {kicker}
            </div>
          ) : null}
          <h4 className="text-3xl font-black tracking-[-0.06em]">{title || 'Section title preview'}</h4>
          <p className="mt-3 text-sm leading-6 text-[#776d62]">{copy || 'Section copy will appear here so admins can check readability before publishing.'}</p>
          {cta ? <div className="btn-primary mt-5 inline-flex px-4 py-2 text-sm font-semibold" style={ctaStyle}>{cta}</div> : null}
        </div>
      </div>
    </aside>
  )
}

function logoSettingValue(settings: BrandAssetsRow['logo_settings'], key: string, fallback: string | number) {
  const value = settings[key]
  if (typeof value === 'number') return String(value)
  return typeof value === 'string' && value.trim() ? value : String(fallback)
}

function logoSettingFallback(value: BrandAssetsRow['logo_settings'][string], fallback: string | number) {
  return typeof value === 'string' || typeof value === 'number' ? value : fallback
}

function BrandLogoPreview({ draft }: { draft: BrandAssetsRow }) {
  const headerLogoWidth = logoSettingValue(draft.logo_settings, 'headerDesktopWidth', logoSettingFallback(draft.logo_settings.desktopWidth, 180))
  const mobileLogoWidth = logoSettingValue(draft.logo_settings, 'headerMobileWidth', logoSettingFallback(draft.logo_settings.mobileWidth, 126))
  const footerLogoWidth = logoSettingValue(draft.logo_settings, 'footerDesktopWidth', 190)
  const footerLogo = draft.footer_logo_url || draft.header_logo_url
  const previewLogo = draft.header_logo_url || draft.footer_logo_url || draft.social_image_url

  return (
    <aside className="rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.26em] text-white/40">Logo preview</div>
          <h3 className="mt-2 text-xl font-black tracking-[-0.04em] text-white">Header and footer sizing</h3>
        </div>
        <CheckCircle2 size={18} className="text-[#D8FF6A]" />
      </div>

      <div className="mt-5 space-y-4">
        <div className="rounded-[26px] border border-white/8 bg-[#FEFDDF] p-4 text-[#1c1712]">
          <div className="text-[10px] uppercase tracking-[0.24em] text-[#5d8fb2]">Header desktop</div>
          <div className="mt-3 flex items-center justify-between gap-4 rounded-b-[20px] border border-[#73A5CA]/14 bg-white px-4 py-2.5 shadow-[0_12px_28px_rgba(28,23,18,0.08)]">
            <div className="relative h-14 overflow-hidden" style={{ width: Number.parseFloat(headerLogoWidth) || 180 }}>
              {previewLogo ? <Image src={previewLogo} alt={draft.header_logo_alt || 'Header logo preview'} fill className="object-contain object-left" sizes="240px" unoptimized /> : <div className="flex h-full items-center text-xs text-[#5d8fb2]">No logo selected</div>}
            </div>
            <div className="hidden gap-5 text-[10px] uppercase tracking-[0.22em] text-[#1c1712]/70 sm:flex">
              <span>Home</span>
              <span>About</span>
              <span>Contact</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-[#6e6256]">Fixed height: width changes without stretching the header.</p>
        </div>

        <div className="rounded-[26px] border border-white/8 bg-[#FEFDDF] p-4 text-[#1c1712]">
          <div className="text-[10px] uppercase tracking-[0.24em] text-[#5d8fb2]">Mobile header</div>
          <div className="mt-3 flex max-w-[280px] items-center justify-between rounded-b-[20px] border border-[#73A5CA]/14 bg-white px-4 py-2.5 shadow-[0_12px_28px_rgba(28,23,18,0.08)]">
            <div className="relative h-12 overflow-hidden" style={{ width: Number.parseFloat(mobileLogoWidth) || 126 }}>
              {previewLogo ? <Image src={previewLogo} alt={draft.header_logo_alt || 'Mobile logo preview'} fill className="object-contain object-left" sizes="180px" unoptimized /> : null}
            </div>
            <div className="rounded-full border border-[#73A5CA]/18 px-3 py-2 text-xs">Menu</div>
          </div>
        </div>

        <div className="rounded-[26px] border border-white/8 bg-[#0f0d0b] p-4 text-[#FEFDDF]">
          <div className="text-[10px] uppercase tracking-[0.24em] text-[#D8FF6A]/70">Footer</div>
          <div className="mt-4 flex items-center gap-4">
            <div className="relative h-16 overflow-hidden" style={{ width: Number.parseFloat(footerLogoWidth) || 190 }}>
              {footerLogo ? <Image src={footerLogo} alt={draft.footer_logo_alt || 'Footer logo preview'} fill className="object-contain object-left" sizes="260px" unoptimized /> : <div className="flex h-full items-center text-xs text-[#FEFDDF]/50">No footer logo selected</div>}
            </div>
            <div className="text-xs leading-5 text-[#FEFDDF]/55">Footer logo has its own width setting, separate from header.</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

function blankLike(value: unknown): unknown {
  if (typeof value === 'number') return 0
  if (typeof value === 'boolean') return false
  if (Array.isArray(value)) return []
  if (isRecord(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, blankLike(item)]))
  }
  return ''
}

function ContentValueEditor({
  value,
  onChange,
  fieldPath,
}: {
  value: unknown
  onChange: (value: unknown) => void
  fieldPath: string
}) {
  if (Array.isArray(value)) {
    const allPrimitive = value.every((item) => !isRecord(item) && !Array.isArray(item))
    if (allPrimitive) {
      return (
        <textarea
          className={textareaClass}
          value={value.map(String).join('\n')}
          onChange={(event) => onChange(event.target.value.split('\n').map((item) => item.trim()).filter(Boolean))}
          placeholder="One item per line"
        />
      )
    }

    return (
      <div className="space-y-3">
        {value.map((item, index) => (
          <div key={`${fieldPath}-${index}`} className="rounded-[20px] border border-white/8 bg-white/5 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/44">Item {index + 1}</div>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}
                className="rounded-full border border-[#E87F24]/24 px-3 py-1 text-xs font-semibold text-[#FFBC8C]"
              >
                Remove
              </button>
            </div>
            <ContentValueEditor
              value={item}
              fieldPath={`${fieldPath}.${index}`}
              onChange={(nextValue) => onChange(value.map((current, itemIndex) => (itemIndex === index ? nextValue : current)))}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...value, blankLike(value[0] ?? {})])}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70"
        >
          <Plus size={14} />
          Add item
        </button>
      </div>
    )
  }

  if (isRecord(value)) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(value).map(([key, item]) => (
          <Field key={`${fieldPath}.${key}`} label={key}>
            <ContentValueEditor
              value={item}
              fieldPath={`${fieldPath}.${key}`}
              onChange={(nextValue) => onChange({ ...value, [key]: nextValue })}
            />
          </Field>
        ))}
      </div>
    )
  }

  if (typeof value === 'boolean') {
    return (
      <Toggle checked={value} onChange={onChange as (checked: boolean) => void} label={value ? 'Enabled' : 'Disabled'} />
    )
  }

  if (String(value ?? '').length > 90) {
    return (
      <textarea className={textareaClass} value={String(value ?? '')} onChange={(event) => onChange(event.target.value)} />
    )
  }

  return (
    <input className={inputClass} value={String(value ?? '')} onChange={(event) => onChange(event.target.value)} />
  )
}

function SectionContentEditor({
  content,
  onChange,
}: {
  content: Record<string, unknown>
  onChange: (content: Record<string, unknown>) => void
}) {
  const entries = Object.entries(content)

  if (!entries.length) {
    return (
      <div className="rounded-[22px] border border-dashed border-white/12 bg-white/5 p-5 text-sm leading-6 text-white/48">
        No repeatable content fields are stored for this section yet. Main section title, copy, image,
        CTA, layout, and visibility can still be edited above.
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {entries.map(([key, value]) => (
        <div key={key} className="rounded-[24px] border border-white/8 bg-[#101011] p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.24em] text-white/40">Structured field</div>
              <h4 className="mt-1 text-lg font-black text-white">{key}</h4>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = { ...content }
                delete next[key]
                onChange(next)
              }}
              className="rounded-full border border-[#E87F24]/24 px-3 py-1.5 text-xs font-semibold text-[#FFBC8C]"
            >
              Remove field
            </button>
          </div>
          <ContentValueEditor
            value={value}
            fieldPath={key}
            onChange={(nextValue) => onChange({ ...content, [key]: nextValue })}
          />
        </div>
      ))}
    </div>
  )
}

function FormFieldsBuilder({
  fields,
  onChange,
}: {
  fields: FormFieldItem[]
  onChange: (fields: FormFieldItem[]) => void
}) {
  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <div key={`${field.name}-${index}`} className="rounded-[22px] border border-white/8 bg-white/5 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/44">Field {index + 1}</div>
            <button
              type="button"
              onClick={() => onChange(fields.filter((_, fieldIndex) => fieldIndex !== index))}
              className="rounded-full border border-[#E87F24]/24 px-3 py-1 text-xs font-semibold text-[#FFBC8C]"
            >
              Remove
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name">
              <input className={inputClass} value={field.name} onChange={(event) => onChange(fields.map((item, fieldIndex) => fieldIndex === index ? { ...item, name: event.target.value } : item))} />
            </Field>
            <Field label="Label">
              <input className={inputClass} value={field.label} onChange={(event) => onChange(fields.map((item, fieldIndex) => fieldIndex === index ? { ...item, label: event.target.value } : item))} />
            </Field>
            <Field label="Type">
              <select className={inputClass} value={field.type} onChange={(event) => onChange(fields.map((item, fieldIndex) => fieldIndex === index ? { ...item, type: event.target.value } : item))}>
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="tel">Phone</option>
                <option value="textarea">Textarea</option>
                <option value="select">Dropdown</option>
              </select>
            </Field>
            <Field label="Placeholder">
              <input className={inputClass} value={field.placeholder} onChange={(event) => onChange(fields.map((item, fieldIndex) => fieldIndex === index ? { ...item, placeholder: event.target.value } : item))} />
            </Field>
            <Field label="Required">
              <Toggle checked={field.required} onChange={(checked) => onChange(fields.map((item, fieldIndex) => fieldIndex === index ? { ...item, required: checked } : item))} label={field.required ? 'Required' : 'Optional'} />
            </Field>
            <Field label="Dropdown options" hint="One option per line. Used only for dropdown fields.">
              <textarea
                className={textareaClass}
                value={field.options.join('\n')}
                onChange={(event) => onChange(fields.map((item, fieldIndex) => fieldIndex === index ? { ...item, options: event.target.value.split('\n').map((option) => option.trim()).filter(Boolean) } : item))}
              />
            </Field>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...fields, emptyFormField()])}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70"
      >
        <Plus size={14} />
        Add field
      </button>
    </div>
  )
}

export default function AdminCmsManagerPanel({ mode }: PanelProps) {
  const [sections, setSections] = useState<SiteSectionRow[]>([])
  const [sectionDraft, setSectionDraft] = useState<SiteSectionRow>(emptySection())
  const [sectionContent, setSectionContent] = useState<Record<string, unknown>>({})

  const [themeDraft, setThemeDraft] = useState<SiteThemeRow>(emptyTheme())
  const [brandDraft, setBrandDraft] = useState<BrandAssetsRow>(emptyBrand())
  const [forms, setForms] = useState<FormDefinitionRow[]>([])
  const [formDraft, setFormDraft] = useState<FormDefinitionRow>(emptyForm())
  const [formFields, setFormFields] = useState<FormFieldItem[]>([])
  const [navigation, setNavigation] = useState<NavigationRow[]>([])
  const [navigationDraft, setNavigationDraft] = useState<NavigationRow>(emptyNavigation())

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const copy = modeCopy[mode]
  const contrast = useMemo(
    () => contrastRatio(themeDraft.colors?.base, themeDraft.colors?.ink),
    [themeDraft.colors?.base, themeDraft.colors?.ink],
  )

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  async function load() {
    setLoading(true)
    setError('')
    setNotice('')
    try {
      if (mode === 'sections') {
        const payload = await adminFetch<SiteSectionRow>('site-sections')
        const rows = [...payload.rows].sort((a, b) => a.page_slug.localeCompare(b.page_slug) || a.sort_order - b.sort_order)
        setSections(rows)
        selectSection(rows[0] ?? emptySection())
      }

      if (mode === 'theme' || mode === 'fonts') {
        const payload = await adminFetch<SiteThemeRow>('site-theme')
        setThemeDraft({ ...emptyTheme(), ...(payload.rows[0] ?? {}) })
      }

      if (mode === 'brand') {
        const payload = await adminFetch<BrandAssetsRow>('brand-assets')
        setBrandDraft({ ...emptyBrand(), ...(payload.rows[0] ?? {}) })
      }

      if (mode === 'forms') {
        const payload = await adminFetch<FormDefinitionRow>('form-definitions')
        setForms(payload.rows)
        selectForm(payload.rows[0] ?? emptyForm())
      }

      if (mode === 'navigation') {
        const payload = await adminFetch<NavigationRow>('site-navigation')
        const rows = [...payload.rows].sort((a, b) => a.location.localeCompare(b.location) || a.sort_order - b.sort_order)
        setNavigation(rows)
        setNavigationDraft(rows[0] ?? emptyNavigation())
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load CMS data.')
    } finally {
      setLoading(false)
    }
  }

  function selectSection(row: SiteSectionRow) {
    setSectionDraft({ ...emptySection(), ...row })
    setSectionContent(asContentRecord(row.content))
  }

  function selectForm(row: FormDefinitionRow) {
    setFormDraft({ ...emptyForm(), ...row })
    setFormFields(normalizeFormFields(row.fields))
  }

  async function afterSave(message = 'Saved and refreshed public pages.') {
    await publishRefresh()
    setNotice(message)
    await load()
  }

  async function saveSection(published = sectionDraft.visible) {
    setSaving(true)
    setError('')
    try {
      if (!sectionDraft.page_slug.trim() || !sectionDraft.section_key.trim()) {
        throw new Error('Page slug and section key are required.')
      }
      if (sectionDraft.cta_href && !normalizedLink(sectionDraft.cta_href)) {
        throw new Error('CTA link must start with /, #, http, mailto:, or tel:.')
      }
      if (sectionDraft.image_url && !sectionDraft.image_alt.trim()) {
        setNotice('Saved, but please add image alt text for accessibility.')
      }
      const payload = {
        ...sectionDraft,
        visible: published,
        content: sectionContent,
        style: asContentRecord(sectionDraft.style),
      }
      const { id, ...updates } = payload
      await adminFetch<SiteSectionRow>('site-sections', {
        method: id ? 'PATCH' : 'POST',
        body: JSON.stringify(id ? { id, updates } : payload),
      })
      await afterSave(published ? 'Section published and refreshed.' : 'Draft saved.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save section.')
    } finally {
      setSaving(false)
    }
  }

  async function deleteSection() {
    if (!sectionDraft.id || !confirm('Delete this section override? The public site will use defaults if available.')) return
    setSaving(true)
    setError('')
    try {
      await adminFetch<SiteSectionRow>('site-sections', {
        method: 'DELETE',
        body: JSON.stringify({ id: sectionDraft.id }),
      })
      await afterSave('Section deleted and public cache refreshed.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete section.')
    } finally {
      setSaving(false)
    }
  }

  async function saveTheme() {
    setSaving(true)
    setError('')
    try {
      const { id, ...updates } = themeDraft
      await adminFetch<SiteThemeRow>('site-theme', {
        method: id ? 'PATCH' : 'POST',
        body: JSON.stringify(id ? { id, updates } : themeDraft),
      })
      await afterSave('Theme published and public cache refreshed.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save theme.')
    } finally {
      setSaving(false)
    }
  }

  async function saveBrand() {
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...brandDraft,
        logo_settings: { ...brandDraft.logo_settings, showImageLogo: true },
      }
      const { id, ...updates } = payload
      await adminFetch<BrandAssetsRow>('brand-assets', {
        method: id ? 'PATCH' : 'POST',
        body: JSON.stringify(id ? { id, updates } : payload),
      })
      await afterSave('Brand assets published and public cache refreshed.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save brand assets.')
    } finally {
      setSaving(false)
    }
  }

  async function saveForm() {
    setSaving(true)
    setError('')
    try {
      if (!formDraft.form_key.trim() || !formDraft.title.trim()) {
        throw new Error('Form key and title are required.')
      }
      const payload = { ...formDraft, fields: formFields }
      const { id, ...updates } = payload
      await adminFetch<FormDefinitionRow>('form-definitions', {
        method: id ? 'PATCH' : 'POST',
        body: JSON.stringify(id ? { id, updates } : payload),
      })
      await afterSave('Form settings published and refreshed.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save form.')
    } finally {
      setSaving(false)
    }
  }

  async function saveNavigation() {
    setSaving(true)
    setError('')
    try {
      if (!navigationDraft.location.trim() || !navigationDraft.label.trim() || !navigationDraft.href.trim()) {
        throw new Error('Location, label, and link are required.')
      }
      if (!normalizedLink(navigationDraft.href)) {
        throw new Error('Navigation link must start with /, #, http, mailto:, or tel:.')
      }
      const { id, ...updates } = navigationDraft
      await adminFetch<NavigationRow>('site-navigation', {
        method: id ? 'PATCH' : 'POST',
        body: JSON.stringify(id ? { id, updates } : navigationDraft),
      })
      await afterSave('Navigation saved and public cache refreshed.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save navigation.')
    } finally {
      setSaving(false)
    }
  }

  async function deleteNavigation() {
    if (!navigationDraft.id || !confirm('Delete this navigation item?')) return
    setSaving(true)
    setError('')
    try {
      await adminFetch<NavigationRow>('site-navigation', {
        method: 'DELETE',
        body: JSON.stringify({ id: navigationDraft.id }),
      })
      await afterSave('Navigation item deleted.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete navigation item.')
    } finally {
      setSaving(false)
    }
  }

  async function deleteForm() {
    if (!formDraft.id || !confirm('Delete this form definition?')) return
    setSaving(true)
    setError('')
    try {
      await adminFetch<FormDefinitionRow>('form-definitions', {
        method: 'DELETE',
        body: JSON.stringify({ id: formDraft.id }),
      })
      await afterSave('Form definition deleted.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete form definition.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="mt-6 space-y-5">
      <div className="rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-[#D8FF6A]/20 bg-[#D8FF6A]/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] text-[#D8FF6A]">
              {copy.eyebrow}
            </div>
            <h2 className="mt-4 max-w-4xl text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">
              {copy.title}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/56 sm:text-base">{copy.copy}</p>
          </div>
          <button
            type="button"
            onClick={load}
            disabled={loading || saving}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:border-[#D8FF6A]/30 hover:text-white disabled:opacity-50"
          >
            <RotateCcw size={14} className="text-[#D8FF6A]" />
            Reload
          </button>
        </div>

        {error ? (
          <div className="mt-5 rounded-[20px] border border-[#E87F24]/30 bg-[#2a1b11] px-4 py-3 text-sm text-[#ffd7b2]">
            {error}
          </div>
        ) : null}
        {notice ? (
          <div className="mt-5 rounded-[20px] border border-[#D8FF6A]/20 bg-[#D8FF6A]/10 px-4 py-3 text-sm text-[#D8FF6A]">
            {notice}
          </div>
        ) : null}
      </div>

      {loading ? (
        <div className="rounded-[28px] border border-white/8 bg-white/5 px-6 py-12 text-center text-sm text-white/55">
          Loading CMS controls...
        </div>
      ) : null}

      {!loading && mode === 'sections' ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
          <div className="rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.26em] text-white/40">Guided section editor</div>
                <h3 className="mt-2 text-2xl font-black text-white">
                  {sectionDraft.id ? `${sectionDraft.page_slug} / ${sectionDraft.section_key}` : 'New section'}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => selectSection(emptySection())}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70"
                >
                  <Plus size={14} />
                  New
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const copyRow = {
                      ...sectionDraft,
                      id: undefined,
                      section_key: `${sectionDraft.section_key || 'section'}-copy`,
                      sort_order: sectionDraft.sort_order + 1,
                    }
                    selectSection(copyRow)
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70"
                >
                  <Copy size={14} />
                  Duplicate
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Page">
                <select
                  value={sectionDraft.page_slug}
                  onChange={(event) => setSectionDraft((prev) => ({ ...prev, page_slug: event.target.value }))}
                  className={inputClass}
                >
                  {pageOptions.map((page) => (
                    <option key={page} value={page}>
                      {page}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Section key">
                <input
                  className={inputClass}
                  value={sectionDraft.section_key}
                  onChange={(event) => setSectionDraft((prev) => ({ ...prev, section_key: event.target.value }))}
                  placeholder="hero, faq, process..."
                />
              </Field>
              <Field label="Kicker / badge">
                <input className={inputClass} value={sectionDraft.kicker} onChange={(event) => setSectionDraft((prev) => ({ ...prev, kicker: event.target.value }))} />
              </Field>
              <Field label="Title">
                <input className={inputClass} value={sectionDraft.title} onChange={(event) => setSectionDraft((prev) => ({ ...prev, title: event.target.value }))} />
              </Field>
              <Field label="Subtitle">
                <input className={inputClass} value={sectionDraft.subtitle} onChange={(event) => setSectionDraft((prev) => ({ ...prev, subtitle: event.target.value }))} />
              </Field>
              <Field label="Sort order">
                <input
                  className={inputClass}
                  type="number"
                  value={sectionDraft.sort_order}
                  onChange={(event) => setSectionDraft((prev) => ({ ...prev, sort_order: Number(event.target.value) }))}
                />
              </Field>
              <Field label="Image URL">
                <input className={inputClass} value={sectionDraft.image_url} onChange={(event) => setSectionDraft((prev) => ({ ...prev, image_url: event.target.value }))} />
                <AdminMediaPicker value={sectionDraft.image_url} onSelect={(url) => setSectionDraft((prev) => ({ ...prev, image_url: url }))} />
              </Field>
              <Field label="Image alt text" hint="Strongly recommended for accessibility and SEO.">
                <input className={inputClass} value={sectionDraft.image_alt} onChange={(event) => setSectionDraft((prev) => ({ ...prev, image_alt: event.target.value }))} />
              </Field>
              <Field label="CTA label">
                <input className={inputClass} value={sectionDraft.cta_label} onChange={(event) => setSectionDraft((prev) => ({ ...prev, cta_label: event.target.value }))} />
              </Field>
              <Field label="CTA link">
                <input className={inputClass} value={sectionDraft.cta_href} onChange={(event) => setSectionDraft((prev) => ({ ...prev, cta_href: event.target.value }))} />
              </Field>
              <Field label="Layout preset">
                <select
                  className={inputClass}
                  value={sectionDraft.layout_preset}
                  onChange={(event) => setSectionDraft((prev) => ({ ...prev, layout_preset: event.target.value }))}
                >
                  <option value="default">Default</option>
                  <option value="split">Split content</option>
                  <option value="cards">Cards grid</option>
                  <option value="masonry">Masonry</option>
                  <option value="feature">Feature block</option>
                </select>
              </Field>
              <Field label="Visibility">
                <Toggle
                  checked={sectionDraft.visible}
                  onChange={(checked) => setSectionDraft((prev) => ({ ...prev, visible: checked }))}
                  label={sectionDraft.visible ? 'Visible' : 'Hidden'}
                />
              </Field>
            </div>

            <div className="mt-4 grid gap-4">
              <Field label="Body copy">
                <textarea className={textareaClass} value={sectionDraft.copy} onChange={(event) => setSectionDraft((prev) => ({ ...prev, copy: event.target.value }))} />
              </Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Background color">
                  <input
                    className={inputClass}
                    value={sectionDraft.background_color}
                    onChange={(event) => setSectionDraft((prev) => ({ ...prev, background_color: event.target.value }))}
                    placeholder="#FEFDDF or var(--brand-base)"
                  />
                </Field>
                <Field label="Text color">
                  <input
                    className={inputClass}
                    value={sectionDraft.text_color}
                    onChange={(event) => setSectionDraft((prev) => ({ ...prev, text_color: event.target.value }))}
                    placeholder="#1f1b16"
                  />
                </Field>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-4">
                <div className="text-[11px] uppercase tracking-[0.26em] text-white/40">Repeatable content</div>
                <h4 className="mt-2 text-xl font-black text-white">Cards, sliders, FAQs, teams, and lists</h4>
                <p className="mt-2 text-sm leading-6 text-white/48">
                  Edit structured content with guided fields built for non-technical updates.
                </p>
              </div>
              <SectionContentEditor content={sectionContent} onChange={setSectionContent} />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={saving}
                onClick={() => saveSection(false)}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/72 disabled:opacity-50"
              >
                <Save size={15} />
                Save Draft
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => saveSection(true)}
                className="inline-flex items-center gap-2 rounded-full bg-[#D8FF6A] px-5 py-3 text-sm font-semibold text-[#111] disabled:opacity-50"
              >
                Publish
                <ArrowRight size={15} />
              </button>
              {sectionDraft.id ? (
                <button
                  type="button"
                  disabled={saving}
                  onClick={deleteSection}
                  className="inline-flex items-center gap-2 rounded-full border border-[#E87F24]/30 px-5 py-3 text-sm font-semibold text-[#FFBC8C] disabled:opacity-50"
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              ) : null}
            </div>
          </div>

          <div className="space-y-5">
            <CmsPreview
              title={sectionDraft.title}
              kicker={sectionDraft.kicker || sectionDraft.section_key}
              copy={sectionDraft.copy || sectionDraft.subtitle}
              image={sectionDraft.image_url}
              imageAlt={sectionDraft.image_alt}
              cta={sectionDraft.cta_label}
            />
            <div className="rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
              <div className="text-[11px] uppercase tracking-[0.26em] text-white/40">Section library</div>
              <div className="mt-4 max-h-[620px] space-y-3 overflow-y-auto pr-1">
                {sections.map((section) => (
                  <button
                    key={section.id ?? `${section.page_slug}-${section.section_key}`}
                    type="button"
                    onClick={() => selectSection(section)}
                    className={`w-full rounded-[20px] border p-4 text-left transition hover:border-[#D8FF6A]/25 ${
                      sectionDraft.id === section.id ? 'border-[#D8FF6A]/45 bg-[#D8FF6A]/10' : 'border-white/8 bg-white/5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-white">{section.title || section.section_key}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/36">
                          {section.page_slug} / {section.section_key}
                        </div>
                      </div>
                      <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${section.visible ? 'bg-[#D8FF6A] text-[#111]' : 'bg-white/8 text-white/50'}`}>
                        {section.visible ? 'Live' : 'Hidden'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {!loading && (mode === 'theme' || mode === 'fonts') ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.85fr)]">
          <div className="rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
            {mode === 'theme' ? (
              <>
                <div className="text-[11px] uppercase tracking-[0.26em] text-white/40">Color and shape controls</div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {Object.entries(themeDraft.colors).map(([key, value]) => (
                    <Field key={key} label={key}>
                      <ColorTokenInput
                        value={value}
                        onChange={(nextValue) =>
                          setThemeDraft((prev) => ({ ...prev, colors: { ...prev.colors, [key]: nextValue } }))
                        }
                      />
                    </Field>
                  ))}
                </div>
                {contrast !== null && contrast < 4.5 ? (
                  <div className="mt-5 rounded-[18px] border border-[#E87F24]/30 bg-[#2a1b11] px-4 py-3 text-sm text-[#ffd7b2]">
                    Contrast warning: base and ink are below recommended readability contrast.
                  </div>
                ) : null}
                <div className="mt-8 rounded-[26px] border border-white/8 bg-white/[0.03] p-4 sm:p-5">
                  <div className="text-[11px] uppercase tracking-[0.26em] text-white/40">Public button controls</div>
                  <p className="mt-2 text-sm leading-6 text-white/45">
                    These settings affect public CTAs and form buttons only. Admin dashboard buttons stay unchanged.
                  </p>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {[
                      ['backgroundColor', 'Button background', 'Hex, rgb, or CSS gradient'],
                      ['textColor', 'Button text color', '#1c1712'],
                      ['borderColor', 'Button border color', 'transparent'],
                      ['hoverBackgroundColor', 'Hover background', 'Hex, rgb, or CSS gradient'],
                      ['hoverTextColor', 'Hover text color', '#1c1712'],
                      ['hoverBorderColor', 'Hover border color', 'transparent'],
                    ].map(([key, label, placeholder]) => (
                      <Field key={key} label={label}>
                        <ColorTokenInput
                          value={themeDraft.buttons[key] ?? ''}
                          placeholder={placeholder}
                          onChange={(nextValue) =>
                            setThemeDraft((prev) => ({ ...prev, buttons: { ...prev.buttons, [key]: nextValue } }))
                          }
                        />
                      </Field>
                    ))}
                    <Field label="Button font family" hint="Use a CSS font stack like var(--font-body, Inter) or 'Outfit', sans-serif.">
                      <input
                        className={inputClass}
                        value={themeDraft.buttons.fontFamily ?? ''}
                        onChange={(event) => setThemeDraft((prev) => ({ ...prev, buttons: { ...prev.buttons, fontFamily: event.target.value } }))}
                        placeholder="var(--font-body, Inter)"
                      />
                    </Field>
                    <Field label="Button radius">
                      <input
                        className={inputClass}
                        value={themeDraft.buttons.radius ?? ''}
                        onChange={(event) => setThemeDraft((prev) => ({ ...prev, buttons: { ...prev.buttons, radius: event.target.value } }))}
                        placeholder="999px"
                      />
                    </Field>
                    <Field label="Button text transform">
                      <select
                        className={inputClass}
                        value={themeDraft.buttons.textTransform ?? 'none'}
                        onChange={(event) => setThemeDraft((prev) => ({ ...prev, buttons: { ...prev.buttons, textTransform: event.target.value } }))}
                      >
                        <option value="none">None</option>
                        <option value="uppercase">Uppercase</option>
                        <option value="capitalize">Capitalize</option>
                        <option value="lowercase">Lowercase</option>
                      </select>
                    </Field>
                  </div>
                  {contrastRatio(themeDraft.buttons.backgroundColor, themeDraft.buttons.textColor) !== null &&
                  (contrastRatio(themeDraft.buttons.backgroundColor, themeDraft.buttons.textColor) ?? 10) < 4.5 ? (
                    <div className="mt-5 rounded-[18px] border border-[#E87F24]/30 bg-[#2a1b11] px-4 py-3 text-sm text-[#ffd7b2]">
                      Button contrast warning: button background and text may be hard to read.
                    </div>
                  ) : null}
                  <div className="mt-5 flex flex-wrap gap-3 rounded-[22px] border border-white/8 bg-[#0f0f0f] p-4">
                    <span className="btn-primary inline-flex px-5 py-3 text-sm font-semibold" style={buttonPreviewStyle(themeDraft.buttons)}>
                      Normal button
                    </span>
                    <span className="btn-primary inline-flex px-5 py-3 text-sm font-semibold" style={buttonPreviewStyle(themeDraft.buttons, true)}>
                      Hover preview
                    </span>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <Field label="Section spacing">
                    <input
                      className={inputClass}
                      value={themeDraft.spacing.sectionPadding ?? ''}
                      onChange={(event) => setThemeDraft((prev) => ({ ...prev, spacing: { ...prev.spacing, sectionPadding: event.target.value } }))}
                    />
                  </Field>
                  <Field label="Container padding">
                    <input
                      className={inputClass}
                      value={themeDraft.spacing.containerPadding ?? ''}
                      onChange={(event) => setThemeDraft((prev) => ({ ...prev, spacing: { ...prev.spacing, containerPadding: event.target.value } }))}
                    />
                  </Field>
                  <Field label="Card radius">
                    <input
                      className={inputClass}
                      value={themeDraft.cards.radius ?? ''}
                      onChange={(event) => setThemeDraft((prev) => ({ ...prev, cards: { ...prev.cards, radius: event.target.value } }))}
                    />
                  </Field>
                  <Field label="Motion intensity">
                    <select
                      className={inputClass}
                      value={themeDraft.motion.intensity ?? 'subtle'}
                      onChange={(event) => setThemeDraft((prev) => ({ ...prev, motion: { ...prev.motion, intensity: event.target.value } }))}
                    >
                      <option value="off">Off</option>
                      <option value="subtle">Subtle</option>
                      <option value="full">Full</option>
                    </select>
                  </Field>
                </div>
              </>
            ) : (
              <>
                <div className="text-[11px] uppercase tracking-[0.26em] text-white/40">Typography controls</div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {[
                    ['headingFamily', 'Heading font'],
                    ['bodyFamily', 'Body font'],
                    ['displayFamily', 'Display font'],
                    ['baseSize', 'Base size'],
                    ['lineHeight', 'Line height'],
                    ['navSize', 'Navigation size'],
                    ['buttonSize', 'Button size'],
                    ['googleFontUrl', 'Google Font stylesheet URL'],
                  ].map(([key, label]) => (
                    <Field key={key} label={label}>
                      <input
                        className={inputClass}
                        value={themeDraft.typography[key] ?? ''}
                        onChange={(event) => setThemeDraft((prev) => ({ ...prev, typography: { ...prev.typography, [key]: event.target.value } }))}
                      />
                    </Field>
                  ))}
                </div>
              </>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={saving}
                onClick={saveTheme}
                className="inline-flex items-center gap-2 rounded-full bg-[#D8FF6A] px-5 py-3 text-sm font-semibold text-[#111] disabled:opacity-50"
              >
                Save and Publish
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          <CmsPreview
            title="Architecture that Speaks Volume"
            kicker="BuildCivil theme preview"
            copy="The public design remains the same, while these tokens give admins safe control over color, type, spacing, buttons, and motion."
            cta="Preview Button"
            ctaStyle={buttonPreviewStyle(themeDraft.buttons)}
          />
        </div>
      ) : null}

      {!loading && mode === 'brand' ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.85fr)]">
          <div className="rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Header logo image">
                <input
                  className={inputClass}
                  value={brandDraft.header_logo_url}
                  onChange={(event) =>
                    setBrandDraft((prev) => ({
                      ...prev,
                      header_logo_url: event.target.value,
                      logo_settings: {
                        ...prev.logo_settings,
                        showImageLogo: event.target.value.trim() ? true : prev.logo_settings.showImageLogo,
                      },
                    }))
                  }
                />
                <AdminMediaPicker
                  value={brandDraft.header_logo_url}
                  onSelect={(url) =>
                    setBrandDraft((prev) => ({
                      ...prev,
                      header_logo_url: url,
                      logo_settings: { ...prev.logo_settings, showImageLogo: true },
                    }))
                  }
                />
              </Field>
              <Field label="Footer logo image">
                <input
                  className={inputClass}
                  value={brandDraft.footer_logo_url}
                  onChange={(event) => setBrandDraft((prev) => ({
                    ...prev,
                    footer_logo_url: event.target.value,
                    logo_settings: {
                      ...prev.logo_settings,
                      showImageLogo: event.target.value.trim() ? true : prev.logo_settings.showImageLogo,
                    },
                  }))}
                />
                <AdminMediaPicker value={brandDraft.footer_logo_url} onSelect={(url) => setBrandDraft((prev) => ({ ...prev, footer_logo_url: url, logo_settings: { ...prev.logo_settings, showImageLogo: true } }))} />
              </Field>
              <Field label="Header logo alt text">
                <input className={inputClass} value={brandDraft.header_logo_alt} onChange={(event) => setBrandDraft((prev) => ({ ...prev, header_logo_alt: event.target.value }))} />
              </Field>
              <Field label="Footer logo alt text">
                <input className={inputClass} value={brandDraft.footer_logo_alt} onChange={(event) => setBrandDraft((prev) => ({ ...prev, footer_logo_alt: event.target.value }))} />
              </Field>
              <Field label="Favicon URL">
                <input className={inputClass} value={brandDraft.favicon_url} onChange={(event) => setBrandDraft((prev) => ({ ...prev, favicon_url: event.target.value }))} />
                <AdminMediaPicker value={brandDraft.favicon_url} onSelect={(url) => setBrandDraft((prev) => ({ ...prev, favicon_url: url }))} />
              </Field>
              <Field label="Social preview image">
                <input className={inputClass} value={brandDraft.social_image_url} onChange={(event) => setBrandDraft((prev) => ({ ...prev, social_image_url: event.target.value }))} />
                <AdminMediaPicker value={brandDraft.social_image_url} onSelect={(url) => setBrandDraft((prev) => ({ ...prev, social_image_url: url }))} />
              </Field>
            </div>

            <div className="mt-6">
              <div className="text-[11px] uppercase tracking-[0.26em] text-white/40">Header logo size</div>
              <p className="mt-2 text-sm leading-6 text-white/45">Adjust only the logo width. Header height stays fixed so the navigation remains clean.</p>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {[
                  ['headerDesktopWidth', 'Header desktop width (px)', brandDraft.logo_settings.desktopWidth ?? 180],
                  ['headerTabletWidth', 'Header tablet / drawer width (px)', brandDraft.logo_settings.tabletWidth ?? 150],
                  ['headerMobileWidth', 'Header mobile width (px)', brandDraft.logo_settings.mobileWidth ?? 126],
                ].map(([key, label, fallback]) => (
                  <Field key={String(key)} label={String(label)}>
                    <input
                      className={inputClass}
                      type="number"
                      min={40}
                      value={logoSettingValue(brandDraft.logo_settings, String(key), String(fallback))}
                      onChange={(event) => setBrandDraft((prev) => ({ ...prev, logo_settings: { ...prev.logo_settings, [String(key)]: event.target.value } }))}
                    />
                  </Field>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="text-[11px] uppercase tracking-[0.26em] text-white/40">Footer logo size</div>
              <p className="mt-2 text-sm leading-6 text-white/45">Footer logo sizing is separate, so you can make the footer logo larger without changing the header.</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {[
                  ['footerDesktopWidth', 'Footer desktop width (px)', 190],
                  ['footerTabletWidth', 'Footer tablet width (px)', 150],
                ].map(([key, label, fallback]) => (
                  <Field key={String(key)} label={String(label)}>
                    <input
                      className={inputClass}
                      type="number"
                      min={40}
                      value={logoSettingValue(brandDraft.logo_settings, String(key), String(fallback))}
                      onChange={(event) => setBrandDraft((prev) => ({ ...prev, logo_settings: { ...prev.logo_settings, [String(key)]: event.target.value } }))}
                    />
                  </Field>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Use image logo">
                <Toggle
                  checked
                  onChange={() => setBrandDraft((prev) => ({ ...prev, logo_settings: { ...prev.logo_settings, showImageLogo: true } }))}
                  label="Image logo on"
                />
              </Field>
            </div>
            <div className="mt-4 rounded-[20px] border border-[#D8FF6A]/15 bg-[#D8FF6A]/8 px-4 py-3 text-sm leading-6 text-white/58">
              Text-logo controls are hidden to keep this panel simple. Upload/select the header logo, optional footer logo, favicon, and adjust image widths only.
            </div>
            <div className="mt-6">
              <button
                type="button"
                disabled={saving}
                onClick={saveBrand}
                className="inline-flex items-center gap-2 rounded-full bg-[#D8FF6A] px-5 py-3 text-sm font-semibold text-[#111] disabled:opacity-50"
              >
                Save Brand
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          <BrandLogoPreview draft={brandDraft} />
        </div>
      ) : null}

      {!loading && mode === 'forms' ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.85fr)]">
          <div className="rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-2xl font-black text-white">{formDraft.id ? formDraft.form_key : 'New form definition'}</h3>
              <button type="button" onClick={() => selectForm(emptyForm())} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70">
                <Plus size={14} />
                New
              </button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Form key">
                <input className={inputClass} value={formDraft.form_key} onChange={(event) => setFormDraft((prev) => ({ ...prev, form_key: event.target.value }))} />
              </Field>
              <Field label="Title">
                <input className={inputClass} value={formDraft.title} onChange={(event) => setFormDraft((prev) => ({ ...prev, title: event.target.value }))} />
              </Field>
              <Field label="Submit label">
                <input className={inputClass} value={formDraft.submit_label} onChange={(event) => setFormDraft((prev) => ({ ...prev, submit_label: event.target.value }))} />
              </Field>
              <Field label="Visibility">
                <Toggle checked={formDraft.visible} onChange={(checked) => setFormDraft((prev) => ({ ...prev, visible: checked }))} label={formDraft.visible ? 'Visible' : 'Hidden'} />
              </Field>
            </div>
            <div className="mt-4 grid gap-4">
              <Field label="Description">
                <textarea className={textareaClass} value={formDraft.description} onChange={(event) => setFormDraft((prev) => ({ ...prev, description: event.target.value }))} />
              </Field>
              <Field label="Success message">
                <input className={inputClass} value={formDraft.success_message} onChange={(event) => setFormDraft((prev) => ({ ...prev, success_message: event.target.value }))} />
              </Field>
              <Field label="Error message">
                <input className={inputClass} value={formDraft.error_message} onChange={(event) => setFormDraft((prev) => ({ ...prev, error_message: event.target.value }))} />
              </Field>
              <div>
                <div className="mb-3 text-xs uppercase tracking-[0.24em] text-white/56">Form fields</div>
                <FormFieldsBuilder fields={formFields} onChange={setFormFields} />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" disabled={saving} onClick={saveForm} className="inline-flex items-center gap-2 rounded-full bg-[#D8FF6A] px-5 py-3 text-sm font-semibold text-[#111] disabled:opacity-50">
                Save Form
                <ArrowRight size={15} />
              </button>
              {formDraft.id ? (
                <button type="button" disabled={saving} onClick={deleteForm} className="inline-flex items-center gap-2 rounded-full border border-[#E87F24]/30 px-5 py-3 text-sm font-semibold text-[#FFBC8C] disabled:opacity-50">
                  <Trash2 size={15} />
                  Delete
                </button>
              ) : null}
            </div>
          </div>
          <div className="rounded-[30px] border border-white/8 bg-[#171719] p-4 sm:p-6">
            <div className="text-[11px] uppercase tracking-[0.26em] text-white/40">Form library</div>
            <div className="mt-4 space-y-3">
              {forms.map((form) => (
                <button key={form.id ?? form.form_key} type="button" onClick={() => selectForm(form)} className="w-full rounded-[20px] border border-white/8 bg-white/5 p-4 text-left transition hover:border-[#D8FF6A]/25">
                  <div className="text-sm font-semibold text-white">{form.title}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/36">{form.form_key}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {!loading && mode === 'navigation' ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.85fr)]">
          <div className="rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-2xl font-black text-white">{navigationDraft.id ? navigationDraft.label : 'New navigation item'}</h3>
              <button type="button" onClick={() => setNavigationDraft(emptyNavigation())} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70">
                <Plus size={14} />
                New
              </button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Location">
                <select className={inputClass} value={navigationDraft.location} onChange={(event) => setNavigationDraft((prev) => ({ ...prev, location: event.target.value }))}>
                  {locationOptions.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Label">
                <input className={inputClass} value={navigationDraft.label} onChange={(event) => setNavigationDraft((prev) => ({ ...prev, label: event.target.value }))} />
              </Field>
              <Field label="Link">
                <input className={inputClass} value={navigationDraft.href} onChange={(event) => setNavigationDraft((prev) => ({ ...prev, href: event.target.value }))} />
              </Field>
              <Field label="Target">
                <select className={inputClass} value={navigationDraft.target} onChange={(event) => setNavigationDraft((prev) => ({ ...prev, target: event.target.value }))}>
                  <option value="_self">Same tab</option>
                  <option value="_blank">New tab</option>
                </select>
              </Field>
              <Field label="Icon name">
                <input className={inputClass} value={navigationDraft.icon} onChange={(event) => setNavigationDraft((prev) => ({ ...prev, icon: event.target.value }))} />
              </Field>
              <Field label="Sort order">
                <input className={inputClass} type="number" value={navigationDraft.sort_order} onChange={(event) => setNavigationDraft((prev) => ({ ...prev, sort_order: Number(event.target.value) }))} />
              </Field>
              <Field label="Visibility">
                <Toggle checked={navigationDraft.visible} onChange={(checked) => setNavigationDraft((prev) => ({ ...prev, visible: checked }))} label={navigationDraft.visible ? 'Visible' : 'Hidden'} />
              </Field>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" disabled={saving} onClick={saveNavigation} className="inline-flex items-center gap-2 rounded-full bg-[#D8FF6A] px-5 py-3 text-sm font-semibold text-[#111] disabled:opacity-50">
                Save Link
                <ArrowRight size={15} />
              </button>
              {navigationDraft.id ? (
                <button type="button" disabled={saving} onClick={deleteNavigation} className="inline-flex items-center gap-2 rounded-full border border-[#E87F24]/30 px-5 py-3 text-sm font-semibold text-[#FFBC8C] disabled:opacity-50">
                  <Trash2 size={15} />
                  Delete
                </button>
              ) : null}
            </div>
          </div>
          <div className="rounded-[30px] border border-white/8 bg-[#171719] p-4 sm:p-6">
            <div className="text-[11px] uppercase tracking-[0.26em] text-white/40">Drag order helper</div>
            <p className="mt-2 text-sm leading-6 text-white/48">Edit sort numbers to reorder. Lower numbers appear first. Drag-and-drop sequencing is supported in the existing Header & Footer editor.</p>
            <div className="mt-4 space-y-3">
              {navigation.map((item) => (
                <button key={item.id ?? `${item.location}-${item.href}`} type="button" onClick={() => setNavigationDraft(item)} className="flex w-full items-center gap-3 rounded-[20px] border border-white/8 bg-white/5 p-4 text-left transition hover:border-[#D8FF6A]/25">
                  <GripVertical size={16} className="text-white/28" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-white">{item.label}</div>
                    <div className="mt-1 truncate text-xs uppercase tracking-[0.2em] text-white/36">{item.location} • {item.href}</div>
                  </div>
                  <span className="rounded-full bg-white/8 px-2 py-1 text-xs text-white/50">{item.sort_order}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
