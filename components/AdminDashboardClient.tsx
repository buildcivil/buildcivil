'use client'

import type { ComponentType, ErrorInfo, ReactNode } from 'react'
import { Component, useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Brush,
  FileText,
  FolderKanban,
  Handshake,
  Home,
  ImageIcon,
  LayoutGrid,
  Layers3,
  LogOut,
  MessageSquareText,
  Mail,
  MapPin,
  Package,
  Palette,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Type,
  Users,
  Wrench,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { sectionReveal } from './motion'
import { publishRefresh } from '@/lib/admin-publish'
import { readJsonResponse } from '@/lib/safe-json'
import type { ProjectItem } from '@/lib/projects'
import type { ServiceItem } from '@/lib/services'

const MotionSection = motion.section

function AdminPanelLoading() {
  return (
    <div className="mt-5 rounded-[24px] border border-white/8 bg-[#141518] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="h-3 w-32 rounded-full bg-white/12" />
          <div className="mt-3 h-2 w-52 max-w-full rounded-full bg-white/8" />
        </div>
        <div className="hidden h-9 w-24 rounded-full bg-[#D8FF6A]/12 sm:block" />
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="h-28 rounded-[18px] bg-white/[0.045]" />
        <div className="h-28 rounded-[18px] bg-white/[0.045]" />
        <div className="h-28 rounded-[18px] bg-white/[0.045]" />
      </div>
    </div>
  )
}

class AdminPanelBoundary extends Component<
  { title: string; children: ReactNode },
  { error: string | null }
> {
  state = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error: error.message || 'This admin section could not render.' }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`Admin panel failed: ${this.props.title}`, error, errorInfo)
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mt-6 rounded-[28px] border border-[#E87F24]/30 bg-[#2a1b11] p-6 text-sm text-[#ffd7b2]">
          <div className="text-[11px] font-black uppercase tracking-[0.24em] text-[#FFC81E]">Section render issue</div>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-white">{this.props.title}</h2>
          <p className="mt-3 leading-6">
            This admin section hit a render error instead of loading normally. The rest of the dashboard is still safe to use.
          </p>
          <p className="mt-2 break-words rounded-[16px] border border-[#E87F24]/20 bg-[#0f0f0f]/45 p-3 text-xs leading-5 text-[#ffd7b2]/80">
            {this.state.error}
          </p>
        </div>
      )
    }

    return this.props.children
  }
}

function AdminPreviewImage({
  src,
  alt,
  className = 'object-cover',
}: {
  src: string
  alt: string
  className?: string
}) {
  if (!src?.trim()) {
    return <div className="flex h-full w-full items-center justify-center text-sm text-white/45">Image preview</div>
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`h-full w-full ${className}`}
      loading="lazy"
      onError={(event) => {
        event.currentTarget.style.display = 'none'
      }}
    />
  )
}

const AdminPagesPanel = dynamic(() => import('./AdminPagesPanel'), { loading: AdminPanelLoading })
const AdminPackagesPanel = dynamic(() => import('./AdminPackagesPanel'), { loading: AdminPanelLoading })
const AdminMediaPanel = dynamic(() => import('./AdminMediaPanel'), { loading: AdminPanelLoading })
const AdminPackageQuotesPanel = dynamic(() => import('./AdminPackageQuotesPanel'), { loading: AdminPanelLoading })
const AdminSettingsPanel = dynamic(() => import('./AdminSettingsPanel'), { loading: AdminPanelLoading })
const AdminNewsletterPanel = dynamic(() => import('./AdminNewsletterPanel'), { loading: AdminPanelLoading })
const AdminCmsManagerPanel = dynamic(() => import('./AdminCmsManagerPanel'), { loading: AdminPanelLoading })
const AdminHomePageEditor = dynamic(() => import('./AdminHomePageEditor'), { loading: AdminPanelLoading })
const AdminSimplePageEditor = dynamic(() => import('./AdminSimplePageEditor'), { loading: AdminPanelLoading })
const AdminUsersPanel = dynamic(() => import('./AdminUsersPanel'), { loading: AdminPanelLoading })
const AdminSeoPanel = dynamic(() => import('./AdminSeoPanel'), { loading: AdminPanelLoading })
const AdminLeadMessagesPanel = dynamic(() => import('./AdminLeadMessagesPanel'), { loading: AdminPanelLoading })
const AdminServiceEnquiriesPanel = dynamic(() => import('./AdminServiceEnquiriesPanel'), { loading: AdminPanelLoading })
const AdminOverviewPanelView = dynamic(() => import('./AdminOverviewPanel'), { loading: AdminPanelLoading })
const AdminProjectLibraryPanel = dynamic(() => import('./AdminProjectLibraryPanel'), { loading: AdminPanelLoading })
const AdminServiceLibraryPanel = dynamic(() => import('./AdminServiceLibraryPanel'), { loading: AdminPanelLoading })
const AdminPolicyPagesPanel = dynamic(() => import('./AdminPolicyPagesPanel'), { loading: AdminPanelLoading })
const AdminGoogleSetupPanel = dynamic(() => import('./AdminGoogleSetupPanel'), { loading: AdminPanelLoading })
const AdminHelpGuidePanel = dynamic(() => import('./AdminHelpGuidePanel'), { loading: AdminPanelLoading })

type TableKey =
  | 'projects'
  | 'services'
  | 'messages'
  | 'pages'
  | 'enquiries'
  | 'package-quotes'
  | 'newsletter'
  | 'media'
  | 'policy-pages'
type ViewKey =
  | 'overview'
  | 'page-home'
  | 'page-about'
  | 'page-services'
  | 'page-projects'
  | 'page-contact'
  | 'page-renovaite'
  | TableKey
  | 'packages'
  | 'media'
  | 'package-quotes'
  | 'settings'
  | 'newsletter'
  | 'sections-builder'
  | 'theme-studio'
  | 'logos-brand'
  | 'fonts'
  | 'forms-fields'
  | 'seo-center'
  | 'google-setup'
  | 'site-navigation'
  | 'admin-users'
  | 'help-guide'

type PolicyRow = {
  id: string
  slug: string
  title: string
  summary: string
  content: string
  seo_title: string
  seo_description: string
  published: boolean
  show_in_header: boolean
  show_in_footer: boolean
  sort_order: number
}

type AdminSession = {
  email: string
  role: string
}

type ProjectRow = {
  id: string
  slug: string
  title: string
  category: ProjectItem['category']
  card_label: string
  location: string
  image: string
  description: string
  year: string
  height_class: string
  overview: string
  hero_title: string
  hero_copy: string
  seo_title: string
  seo_description: string
  seo_image: string
  highlights: string[] | unknown
  stats: unknown
  process: unknown
  gallery: unknown
  published: boolean
  sort_order: number
}

type ServiceRow = {
  id: string
  slug: string
  icon_name: ServiceItem['iconName']
  title: string
  description: string
  kicker: string
  image: string
  accent: string
  hero_title: string
  hero_copy: string
  seo_title: string
  seo_description: string
  seo_image: string
  intro: string
  bullets: string[] | unknown
  details: string[] | unknown
  stats: unknown
  process: unknown
  gallery: unknown
  published: boolean
  sort_order: number
}

type MessageRow = {
  id: string
  name: string
  email: string
  phone: string | null
  project_type: string | null
  details: string | null
  status: string
  created_at?: string
}

type EnquiryRow = {
  id: string
  name: string
  email: string
  phone: string
  service: string
  other_service: string
  status: string
  source: string
  created_at?: string
}

type PackageQuoteRow = {
  id: string
  name: string
  email: string
  phone: string
  plan_name: string
  start_timeline: string
  status: string
  notes: string
  source: string
  created_at?: string
}

type NewsletterRow = {
  id: string
  email: string
  status: string
  source: string
  notes: string
  created_at?: string
}

type PackageSummaryRow = {
  id: string
  slug: string
  name: string
  price: string
  package_name: string
  published: boolean
  sort_order: number
}

type MediaRow = {
  id: string
  file_name: string
  file_url: string
  file_type: string
  alt_text: string
  folder: string
  created_at?: string
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

type AdminResponse<T> = {
  connected: boolean
  table: TableKey | 'packages'
  rows: T[]
  error?: string
}

type TableConnectionKey = TableKey | 'packages'

type ProjectDraft = {
  id?: string
  slug: string
  title: string
  category: ProjectItem['category']
  card_label: string
  location: string
  image: string
  description: string
  year: string
  height_class: string
  overview: string
  hero_title: string
  hero_copy: string
  seo_title: string
  seo_description: string
  seo_image: string
  highlights_text: string
  stats_json: string
  process_json: string
  gallery_text: string
  published: boolean
  sort_order: number
}

type ServiceDraft = {
  id?: string
  slug: string
  icon_name: ServiceItem['iconName']
  title: string
  description: string
  kicker: string
  image: string
  accent: string
  hero_title: string
  hero_copy: string
  seo_title: string
  seo_description: string
  seo_image: string
  intro: string
  bullets_text: string
  details_text: string
  stats_json: string
  process_json: string
  gallery_text: string
  published: boolean
  sort_order: number
}

const tabs: { key: ViewKey; label: string; icon: ComponentType<{ size?: number; className?: string }> }[] = [
  { key: 'overview', label: 'Overview', icon: LayoutGrid },
  { key: 'page-home', label: 'Home Page', icon: Home },
  { key: 'page-about', label: 'About Page', icon: FileText },
  { key: 'page-services', label: 'Services Page', icon: Layers3 },
  { key: 'page-projects', label: 'Projects Page', icon: FolderKanban },
  { key: 'page-contact', label: 'Contact Page', icon: MessageSquareText },
  { key: 'page-renovaite', label: 'Renovaite Page', icon: Sparkles },
  { key: 'pages', label: 'Site Pages', icon: FileText },
  { key: 'sections-builder', label: 'Sections Builder', icon: Brush },
  { key: 'settings', label: 'Header & Footer', icon: Settings },
  { key: 'theme-studio', label: 'Theme Studio', icon: Palette },
  { key: 'logos-brand', label: 'Logos & Brand', icon: ShieldCheck },
  { key: 'fonts', label: 'Fonts', icon: Type },
  { key: 'media', label: 'Media Library', icon: ImageIcon },
  { key: 'projects', label: 'Project Library', icon: FolderKanban },
  { key: 'services', label: 'Service Library', icon: Layers3 },
  { key: 'packages', label: 'Package Library', icon: Package },
  { key: 'forms-fields', label: 'Forms & Fields', icon: FileText },
  { key: 'seo-center', label: 'SEO Center', icon: Search },
  { key: 'google-setup', label: 'Google Setup', icon: Search },
  { key: 'site-navigation', label: 'Navigation', icon: Settings },
  { key: 'admin-users', label: 'Admin Users', icon: ShieldCheck },
  { key: 'enquiries', label: 'Service Enquiries', icon: Handshake },
  { key: 'package-quotes', label: 'Plan Quotes', icon: Package },
  { key: 'newsletter', label: 'Newsletter', icon: Mail },
  { key: 'messages', label: 'Contact Messages', icon: MessageSquareText },
  { key: 'help-guide', label: 'Help & Guide', icon: BookOpen },
]

const sidebarGroups: Array<{
  label: string
  items: Array<{ key: ViewKey; label: string; icon: ComponentType<{ size?: number; className?: string }> }>
}> = [
  {
    label: 'Workspace',
    items: [
      { key: 'overview', label: 'Overview', icon: LayoutGrid },
      { key: 'media', label: 'Media Library', icon: ImageIcon },
      { key: 'help-guide', label: 'Help & Guide', icon: BookOpen },
    ],
  },
  {
    label: 'Pages',
    items: [
      { key: 'page-home', label: 'Home', icon: Home },
      { key: 'page-about', label: 'About', icon: FileText },
      { key: 'page-services', label: 'Services', icon: Layers3 },
      { key: 'page-projects', label: 'Projects', icon: FolderKanban },
      { key: 'page-contact', label: 'Contact', icon: MessageSquareText },
      { key: 'page-renovaite', label: 'Renovaite', icon: Sparkles },
    ],
  },
  {
    label: 'Content',
    items: [
      { key: 'projects', label: 'Project Library', icon: FolderKanban },
      { key: 'services', label: 'Service Library', icon: Layers3 },
      { key: 'packages', label: 'Package Library', icon: Package },
      { key: 'policy-pages', label: 'Policy Pages', icon: FileText },
    ],
  },
  {
    label: 'Leads',
    items: [
      { key: 'enquiries', label: 'Service Enquiries', icon: Handshake },
      { key: 'package-quotes', label: 'Plan Quotes', icon: Package },
      { key: 'messages', label: 'Contact Messages', icon: MessageSquareText },
      { key: 'newsletter', label: 'Newsletter', icon: Mail },
    ],
  },
  {
    label: 'Theme & Settings',
    items: [
      { key: 'settings', label: 'Header & Footer', icon: Settings },
      { key: 'theme-studio', label: 'Theme Studio', icon: Palette },
      { key: 'logos-brand', label: 'Logos & Brand', icon: ShieldCheck },
      { key: 'fonts', label: 'Fonts', icon: Type },
      { key: 'forms-fields', label: 'Forms & Fields', icon: FileText },
      { key: 'seo-center', label: 'SEO Center', icon: Search },
      { key: 'google-setup', label: 'Google Setup', icon: Search },
      { key: 'site-navigation', label: 'Navigation', icon: Settings },
      { key: 'admin-users', label: 'Admin Users', icon: ShieldCheck },
    ],
  },
  {
    label: 'Advanced',
    items: [
      { key: 'pages', label: 'Legacy Pages', icon: FileText },
      { key: 'sections-builder', label: 'Sections Builder', icon: Brush },
    ],
  },
]

const roleViewAccess: Record<string, ViewKey[]> = {
  super_admin: tabs.map((tab) => tab.key),
  admin: tabs.filter((tab) => tab.key !== 'admin-users').map((tab) => tab.key),
  content_manager: [
    'overview',
    'page-home',
    'page-about',
    'page-services',
    'page-projects',
    'page-contact',
    'page-renovaite',
    'projects',
    'services',
    'packages',
    'policy-pages',
    'media',
    'settings',
    'theme-studio',
    'logos-brand',
    'fonts',
    'forms-fields',
    'seo-center',
    'google-setup',
    'site-navigation',
    'help-guide',
  ],
  project_manager: ['overview', 'projects', 'services', 'media', 'seo-center', 'help-guide'],
  media_manager: ['overview', 'media', 'help-guide'],
  leads_manager: ['overview', 'enquiries', 'package-quotes', 'newsletter', 'messages', 'help-guide'],
  editor: ['overview', 'page-home', 'page-about', 'page-services', 'page-projects', 'page-contact', 'page-renovaite', 'projects', 'services', 'media', 'seo-center', 'policy-pages', 'help-guide'],
}

function canView(role: string | undefined, key: ViewKey) {
  return (roleViewAccess[role ?? 'editor'] ?? roleViewAccess.editor).includes(key)
}

function missingRequiredFields(fields: Record<string, string>) {
  return Object.entries(fields)
    .filter(([, value]) => !value.trim())
    .map(([label]) => label)
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const fallbackProjectImage = 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600&auto=format&fit=crop'
const fallbackServiceImage = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1600&auto=format&fit=crop'

const emptyProjectDraft = (): ProjectDraft => ({
  slug: '',
  title: '',
  category: 'Residential',
  card_label: 'Residential build',
  location: '',
  image: '',
  description: '',
  year: '2026',
  height_class: 'h-[420px] sm:h-[470px] xl:h-[560px]',
  overview: '',
  hero_title: '',
  hero_copy: '',
  seo_title: '',
  seo_description: '',
  seo_image: '',
  highlights_text: '',
  stats_json: '[]',
  process_json: '[]',
  gallery_text: '',
  published: false,
  sort_order: 0,
})

const emptyServiceDraft = (): ServiceDraft => ({
  slug: '',
  icon_name: 'home',
  title: '',
  description: '',
  kicker: '',
  image: '',
  accent: 'from-[#E87F24]/30 via-[#FFC81E]/14 to-transparent',
  hero_title: '',
  hero_copy: '',
  seo_title: '',
  seo_description: '',
  seo_image: '',
  intro: '',
  bullets_text: '',
  details_text: '',
  stats_json: '[]',
  process_json: '[]',
  gallery_text: '',
  published: false,
  sort_order: 0,
})

function formatLines(value: unknown) {
  if (Array.isArray(value)) return value.join('\n')
  return ''
}

function parseList(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

function formatStats(value: unknown) {
  if (!Array.isArray(value)) return ''
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return ''
      const row = item as Record<string, unknown>
      return [row.value, row.label].map((part) => String(part ?? '').trim()).filter(Boolean).join(' | ')
    })
    .filter(Boolean)
    .join('\n')
}

function parseStats(value: string) {
  return parseList(value).map((line) => {
    const [statValue = '', label = ''] = line.split('|').map((part) => part.trim())
    return { value: statValue, label }
  })
}

function formatProcess(value: unknown) {
  if (!Array.isArray(value)) return ''
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return ''
      const row = item as Record<string, unknown>
      return [row.step, row.title, row.copy].map((part) => String(part ?? '').trim()).filter(Boolean).join(' | ')
    })
    .filter(Boolean)
    .join('\n')
}

function parseProcess(value: string) {
  return parseList(value).map((line, index) => {
    const [step = String(index + 1).padStart(2, '0'), title = '', copy = ''] = line.split('|').map((part) => part.trim())
    return { step, title, copy }
  })
}

function toProjectDraft(row: Partial<ProjectRow>): ProjectDraft {
  return {
    id: row.id,
    slug: row.slug ?? '',
    title: row.title ?? '',
    category: (row.category as ProjectItem['category']) ?? 'Residential',
    card_label: row.card_label ?? '',
    location: row.location ?? '',
    image: row.image ?? '',
    description: row.description ?? '',
    year: row.year ?? '2026',
    height_class: row.height_class ?? 'h-[420px] sm:h-[470px] xl:h-[560px]',
    overview: row.overview ?? '',
    hero_title: row.hero_title ?? '',
    hero_copy: row.hero_copy ?? '',
    seo_title: row.seo_title ?? '',
    seo_description: row.seo_description ?? '',
    seo_image: row.seo_image ?? '',
    highlights_text: formatLines(row.highlights),
    stats_json: formatStats(row.stats),
    process_json: formatProcess(row.process),
    gallery_text: formatLines(row.gallery),
    published: row.published ?? true,
    sort_order: row.sort_order ?? 0,
  }
}

function toServiceDraft(row: Partial<ServiceRow>): ServiceDraft {
  return {
    id: row.id,
    slug: row.slug ?? '',
    icon_name: (row.icon_name as ServiceItem['iconName']) ?? 'home',
    title: row.title ?? '',
    description: row.description ?? '',
    kicker: row.kicker ?? '',
    image: row.image ?? '',
    accent: row.accent ?? 'from-[#E87F24]/30 via-[#FFC81E]/14 to-transparent',
    hero_title: row.hero_title ?? '',
    hero_copy: row.hero_copy ?? '',
    seo_title: row.seo_title ?? '',
    seo_description: row.seo_description ?? '',
    seo_image: row.seo_image ?? '',
    intro: row.intro ?? '',
    bullets_text: formatLines(row.bullets),
    details_text: formatLines(row.details),
    stats_json: formatStats(row.stats),
    process_json: formatProcess(row.process),
    gallery_text: formatLines(row.gallery),
    published: row.published ?? true,
    sort_order: row.sort_order ?? 0,
  }
}

async function api<T>(table: TableKey, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/admin/${table}`, {
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

function formatStatusLabel(status: string) {
  switch (status) {
    case 'new':
      return 'New lead'
    case 'read':
      return 'Read'
    case 'replied':
      return 'Replied'
    case 'closed':
      return 'Closed'
    default:
      return status
  }
}

function ShellStatCard({
  value,
  label,
  icon: Icon,
  accent,
}: {
  value: string
  label: string
  icon: ComponentType<{ size?: number; className?: string }>
  accent?: boolean
}) {
  return (
    <div
      className={`rounded-[26px] border p-5 shadow-[0_18px_45px_rgba(0,0,0,0.26)] backdrop-blur-xl ${
        accent
          ? 'border-[#D8FF6A]/70 bg-[#D8FF6A] text-[#121212]'
          : 'border-white/8 bg-white/5 text-white'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className={`text-2xl font-black tracking-[-0.05em] ${accent ? 'text-[#121212]' : 'text-white'}`}>
          {value}
        </div>
        <Icon size={18} className={accent ? 'text-[#121212]' : 'text-[#D8FF6A]'} />
      </div>
      <p className={`mt-3 text-sm leading-6 ${accent ? 'text-[#1d1d1d]/75' : 'text-white/64'}`}>{label}</p>
    </div>
  )
}

function TopPill({
  active,
  icon: Icon,
  label,
  onClick,
  count,
}: {
  active: boolean
  icon: ComponentType<{ size?: number; className?: string }>
  label: string
  onClick: () => void
  count?: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
        active
          ? 'bg-[#D8FF6A] text-[#111111] shadow-[0_12px_30px_rgba(216,255,106,0.18)]'
          : 'bg-white/5 text-white/78 hover:bg-white/8 hover:text-white'
      }`}
    >
      <Icon size={14} className={active ? 'text-[#111111]' : 'text-[#D8FF6A]'} />
      {label}
      {typeof count === 'number' ? (
        <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] ${active ? 'bg-[#111] text-[#D8FF6A]' : 'bg-white/8 text-white/60'}`}>
          {count}
        </span>
      ) : null}
    </button>
  )
}

function ProjectDraftPreview({ draft }: { draft: ProjectDraft }) {
  const highlights = parseList(draft.highlights_text).slice(0, 3)
  const gallery = parseList(draft.gallery_text).slice(0, 3)

  return (
    <div className="rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.26em] text-white/40">Project preview</div>
          <h3 className="mt-2 text-xl font-black text-white">Website-style draft view</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${draft.published ? 'bg-[#D8FF6A] text-[#111]' : 'bg-white/8 text-white/60'}`}>
          {draft.published ? 'Live' : 'Draft'}
        </span>
      </div>

      <div className="mt-5 overflow-hidden rounded-[28px] border border-[#73A5CA]/12 bg-[#FEFDDF] p-4 text-[#1c1712] shadow-[0_18px_48px_rgba(0,0,0,0.18)]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="rounded-full border border-[#73A5CA]/18 bg-white/82 px-4 py-2 text-[10px] uppercase tracking-[0.26em] text-[#5d8fb2]">
            Project card
          </div>
          <div className="text-xs font-semibold text-[#6e6256]">{draft.location || 'Location not set'}</div>
        </div>
        <div className="relative h-[420px] overflow-hidden rounded-[30px] bg-white/70 shadow-[0_18px_48px_rgba(28,23,18,0.08)]">
          {draft.image ? (
            <AdminPreviewImage src={draft.image} alt={draft.title || 'Project preview'} />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[#6e6256]">Image preview</div>
          )}
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(115,165,202,0.12),transparent_32%),linear-gradient(315deg,rgba(232,127,36,0.12),transparent_28%)] opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1712]/48 via-transparent to-transparent" />

          <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3 text-[#FEFDDF]">
            <h4 className="max-w-[13rem] text-lg font-semibold uppercase leading-[1.08] tracking-[0.16em] drop-shadow-[0_8px_20px_rgba(28,23,18,0.45)]">
              {draft.title || 'Project title'}
            </h4>
            <div className="rounded-full border border-[#FEFDDF]/50 bg-[#FEFDDF]/10 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-[#FEFDDF]/82 backdrop-blur-md">
              {draft.year || 'Year'}
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
            <div className="max-w-[76%] rounded-[22px] border border-[#FEFDDF]/30 bg-[#FEFDDF]/14 px-4 py-3 text-[#FEFDDF] backdrop-blur-md">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-[#FEFDDF]/82">
                <MapPin size={12} className="text-[#FFC81E]" />
                {draft.category}
              </div>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#FEFDDF]/86">{draft.description || 'Project description will appear here.'}</p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#FFC81E]/35 bg-[#FEFDDF]/16 text-[#FEFDDF] backdrop-blur-md">
              <ArrowRight size={16} />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="text-sm font-medium text-[#6e6256]">{draft.location || 'Location not set'}</div>
          <div className="text-[10px] uppercase tracking-[0.28em] text-[#5d8fb2]">{draft.card_label || 'Card label'}</div>
        </div>

        <div className="mt-5 rounded-[24px] border border-[#73A5CA]/12 bg-white/82 p-5">
          <div className="text-[11px] uppercase tracking-[0.26em] text-[#5d8fb2]">Detail page intro preview</div>
          <h4 className="mt-3 text-3xl font-black leading-none tracking-[-0.05em] text-[#1c1712]">{draft.hero_title || draft.title || 'Project detail heading'}</h4>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#6e6256]">{draft.hero_copy || draft.overview || 'Project detail copy will appear here.'}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[18px] border border-[#73A5CA]/12 bg-[#FEFDDF]/70 p-3">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#5d8fb2]">Highlights</div>
              <div className="mt-2 text-sm font-semibold text-[#1c1712]">{highlights.length}</div>
            </div>
            <div className="rounded-[18px] border border-[#73A5CA]/12 bg-[#FEFDDF]/70 p-3">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#5d8fb2]">Gallery</div>
              <div className="mt-2 text-sm font-semibold text-[#1c1712]">{gallery.length} images</div>
            </div>
            <div className="rounded-[18px] border border-[#73A5CA]/12 bg-[#FEFDDF]/70 p-3">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#5d8fb2]">SEO</div>
              <div className="mt-2 text-sm font-semibold text-[#1c1712]">{draft.seo_title ? 'Ready' : 'Fallback'}</div>
            </div>
          </div>
        </div>

        {highlights.length ? (
          <div className="mt-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#5d8fb2]">Highlights</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {highlights.map((highlight) => (
                <span key={highlight} className="rounded-full border border-[#FFC81E]/30 bg-[#FFC81E]/14 px-3 py-1 text-xs text-[#1c1712]">
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function ServiceDraftPreview({ draft }: { draft: ServiceDraft }) {
  const bullets = parseList(draft.bullets_text).slice(0, 4)
  const details = parseList(draft.details_text).slice(0, 3)
  const gallery = parseList(draft.gallery_text).slice(0, 3)

  return (
    <div className="rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.26em] text-white/40">Service preview</div>
          <h3 className="mt-2 text-xl font-black text-white">Website-style draft view</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${draft.published ? 'bg-[#D8FF6A] text-[#111]' : 'bg-white/8 text-white/60'}`}>
          {draft.published ? 'Live' : 'Draft'}
        </span>
      </div>

      <div className="mt-5 overflow-hidden rounded-[28px] border border-[#73A5CA]/12 bg-[#FEFDDF] p-4 text-[#1c1712] shadow-[0_18px_48px_rgba(0,0,0,0.18)]">
        <div className="relative min-h-[520px] overflow-hidden rounded-[32px] border border-[#73A5CA]/14 bg-[#FEFDDF] shadow-[0_24px_70px_rgba(28,23,18,0.1)]">
          {draft.image ? (
            <AdminPreviewImage src={draft.image} alt={draft.title || 'Service preview'} />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[#6e6256]">Image preview</div>
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,253,223,0.12),rgba(28,23,18,0.42))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,200,30,0.20),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(115,165,202,0.18),transparent_35%)]" />

          <div className="absolute left-5 top-5 rounded-full border border-[#73A5CA]/18 bg-[rgba(255,253,223,0.95)] px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#5d8fb2] shadow-[0_8px_20px_rgba(28,23,18,0.08)] backdrop-blur-md">
            {draft.kicker || 'Service'}
          </div>

          <div className="absolute bottom-5 left-5 right-5 rounded-[28px] border border-[#73A5CA]/14 bg-[rgba(255,253,223,0.95)] p-5 shadow-[0_10px_28px_rgba(28,23,18,0.08)] backdrop-blur-xl">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-[#5d8fb2]">
              <Wrench size={15} className="text-[#E87F24]" />
              {draft.title || 'Service title'}
            </div>
            <p className="mt-3 text-sm leading-6 text-[#6e6256]">{draft.description || 'Service description will appear here.'}</p>
          </div>
        </div>

        <div className="mt-5 rounded-[24px] border border-[#73A5CA]/12 bg-white/82 p-5">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#5d8fb2]">Service bullets</div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {bullets.length ? (
              bullets.map((bullet) => (
                <div key={bullet} className="rounded-[16px] border border-[#73A5CA]/12 bg-[#FEFDDF]/70 px-3 py-2 text-sm leading-6 text-[#6e6256]">
                  {bullet}
                </div>
              ))
            ) : (
              <div className="rounded-[16px] border border-dashed border-[#73A5CA]/14 bg-[#FEFDDF]/70 px-3 py-3 text-sm text-[#6e6256] sm:col-span-2">
                Bullet preview will appear here.
              </div>
            )}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[18px] border border-[#73A5CA]/12 bg-[#FEFDDF]/70 p-3">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#5d8fb2]">Details</div>
              <div className="mt-2 text-sm font-semibold text-[#1c1712]">{details.length}</div>
            </div>
            <div className="rounded-[18px] border border-[#73A5CA]/12 bg-[#FEFDDF]/70 p-3">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#5d8fb2]">Gallery</div>
              <div className="mt-2 text-sm font-semibold text-[#1c1712]">{gallery.length} images</div>
            </div>
            <div className="rounded-[18px] border border-[#73A5CA]/12 bg-[#FEFDDF]/70 p-3">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#5d8fb2]">SEO</div>
              <div className="mt-2 text-sm font-semibold text-[#1c1712]">{draft.seo_title ? 'Ready' : 'Fallback'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailLivePreview({
  title,
  route,
}: {
  title: string
  route: string
}) {
  return (
    <div className="rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.26em] text-white/40">Full live page</div>
          <h3 className="mt-2 text-xl font-black text-white">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-white/46">Shows the published page for this item. Draft preview above updates before saving.</p>
        </div>
        <Link href={route} target="_blank" className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/65 transition hover:border-[#D8FF6A]/25 hover:text-[#D8FF6A]">
          Open
        </Link>
      </div>
      <div className="mt-4 overflow-hidden rounded-[22px] border border-white/10 bg-white">
        <iframe src={route} title={`${title} live preview`} className="h-[560px] w-full bg-white" />
      </div>
    </div>
  )
}

export default function AdminDashboardClient() {
  const [activeTab, setActiveTab] = useState<ViewKey>('overview')
  const [projects, setProjects] = useState<ProjectRow[]>([])
  const [services, setServices] = useState<ServiceRow[]>([])
  const [packages, setPackages] = useState<PackageSummaryRow[]>([])
  const [pages, setPages] = useState<PageRow[]>([])
  const [messages, setMessages] = useState<MessageRow[]>([])
  const [enquiries, setEnquiries] = useState<EnquiryRow[]>([])
  const [packageQuotes, setPackageQuotes] = useState<PackageQuoteRow[]>([])
  const [newsletter, setNewsletter] = useState<NewsletterRow[]>([])
  const [media, setMedia] = useState<MediaRow[]>([])
  const [policyPages, setPolicyPages] = useState<PolicyRow[]>([])
  const [session, setSession] = useState<AdminSession | null>(null)
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadIssues, setLoadIssues] = useState<string[]>([])
  const [tableConnections, setTableConnections] = useState<Partial<Record<TableConnectionKey, boolean>>>({})
  const [tableLoadErrors, setTableLoadErrors] = useState<Partial<Record<TableConnectionKey, string>>>({})
  const [notice, setNotice] = useState('')
  const [projectDraft, setProjectDraft] = useState<ProjectDraft>(emptyProjectDraft())
  const [serviceDraft, setServiceDraft] = useState<ServiceDraft>(emptyServiceDraft())
  const projectDraftInitializedRef = useRef(false)
  const serviceDraftInitializedRef = useRef(false)

  const counts = useMemo(
    () => ({
      projects: projects.length,
      services: services.length,
      packages: packages.length,
      pages: pages.length,
      messages: messages.length,
      enquiries: enquiries.length,
      packageQuotes: packageQuotes.length,
      newsletter: newsletter.length,
      media: media.length,
      policyPages: policyPages.length,
      unread: messages.filter((message) => message.status === 'new').length,
      unreadEnquiries: enquiries.filter((enquiry) => enquiry.status === 'new').length,
      unreadQuotes: packageQuotes.filter((quote) => quote.status === 'new').length,
      publishedProjects: projects.filter((project) => project.published).length,
      publishedServices: services.filter((service) => service.published).length,
      publishedPages: pages.filter((page) => page.published).length,
    }),
    [enquiries, media, messages, newsletter, packageQuotes, packages, pages, policyPages, projects, services],
  )

  const recentMessages = useMemo(() => messages.slice(0, 3), [messages])

  async function loadData() {
    setLoading(true)
    setError(null)
    setLoadIssues([])
    setTableConnections({})
    setTableLoadErrors({})
    try {
      const authResponse = await fetch('/api/admin/auth', { cache: 'no-store' })
      const authPayload = await readJsonResponse<{ authenticated?: boolean; session?: AdminSession; error?: string }>(authResponse, {})
      if (!authResponse.ok || !authPayload.session) {
        throw new Error(authPayload.error || 'Please login to access the admin dashboard.')
      }

      const activeSession = authPayload.session
      setSession(activeSession)
      const role = activeSession.role
      const emptyResponse = <T,>(table: TableKey): AdminResponse<T> => ({ connected: true, table, rows: [] })
      const emptyPackagesResponse = (): AdminResponse<PackageSummaryRow> => ({ connected: true, table: 'packages', rows: [] })
      const fetchIfAllowed = <T,>(table: TableKey, key: ViewKey) =>
        canView(role, key) ? api<AdminResponse<T>>(table) : Promise.resolve(emptyResponse<T>(table))
      const fetchPackagesIfAllowed = () =>
        canView(role, 'packages')
          ? fetch('/api/admin/packages', { cache: 'no-store' }).then(async (response) => {
              const payload = await readJsonResponse<AdminResponse<PackageSummaryRow>>(response, emptyPackagesResponse())
              if (!response.ok) throw new Error(payload.error || 'Unable to load packages.')
              return payload
            })
          : Promise.resolve(emptyPackagesResponse())
      const issues: string[] = []
      const issueMap: Partial<Record<TableConnectionKey, string>> = {}
      const safeLoad = async <T,>(
        tableKey: TableConnectionKey,
        label: string,
        request: Promise<AdminResponse<T>>,
        fallback: AdminResponse<T>,
      ) => {
        try {
          return await request
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Unable to load data.'
          issues.push(`${label}: ${message}`)
          issueMap[tableKey] = message
          return {
            ...fallback,
            connected: false,
            error: message,
          }
        }
      }
      const [
        projectsResponse,
        servicesResponse,
        packagesResponse,
        pagesResponse,
        messagesResponse,
        enquiriesResponse,
        packageQuotesResponse,
        newsletterResponse,
        mediaResponse,
        policyPagesResponse,
      ] = await Promise.all([
        safeLoad('projects', 'Projects', fetchIfAllowed<ProjectRow>('projects', 'projects'), emptyResponse<ProjectRow>('projects')),
        safeLoad('services', 'Services', fetchIfAllowed<ServiceRow>('services', 'services'), emptyResponse<ServiceRow>('services')),
        safeLoad('packages', 'Packages', fetchPackagesIfAllowed(), emptyPackagesResponse()),
        safeLoad(
          'pages',
          'Pages',
          canView(role, 'pages') || canView(role, 'page-home') || canView(role, 'page-about') || canView(role, 'page-services') || canView(role, 'page-projects') || canView(role, 'page-contact') || canView(role, 'page-renovaite')
            ? api<AdminResponse<PageRow>>('pages')
            : Promise.resolve(emptyResponse<PageRow>('pages')),
          emptyResponse<PageRow>('pages'),
        ),
        safeLoad('messages', 'Contact Messages', fetchIfAllowed<MessageRow>('messages', 'messages'), emptyResponse<MessageRow>('messages')),
        safeLoad('enquiries', 'Service Enquiries', fetchIfAllowed<EnquiryRow>('enquiries', 'enquiries'), emptyResponse<EnquiryRow>('enquiries')),
        safeLoad('package-quotes', 'Plan Quotes', fetchIfAllowed<PackageQuoteRow>('package-quotes', 'package-quotes'), emptyResponse<PackageQuoteRow>('package-quotes')),
        safeLoad('newsletter', 'Newsletter', fetchIfAllowed<NewsletterRow>('newsletter', 'newsletter'), emptyResponse<NewsletterRow>('newsletter')),
        safeLoad('media', 'Media', fetchIfAllowed<MediaRow>('media', 'media'), emptyResponse<MediaRow>('media')),
        safeLoad('policy-pages', 'Policy Pages', fetchIfAllowed<PolicyRow>('policy-pages', 'policy-pages'), emptyResponse<PolicyRow>('policy-pages')),
      ])

      setProjects(projectsResponse.rows)
      setServices(servicesResponse.rows)
      setPackages(packagesResponse.rows)
      setPages(pagesResponse.rows)
      setMessages(messagesResponse.rows)
      setEnquiries(enquiriesResponse.rows)
      setPackageQuotes(packageQuotesResponse.rows)
      setNewsletter(newsletterResponse.rows)
      setMedia(mediaResponse.rows)
      setPolicyPages(policyPagesResponse.rows)
      setLoadIssues(issues)
      setTableLoadErrors(issueMap)
      setTableConnections({
        projects: projectsResponse.connected,
        services: servicesResponse.connected,
        packages: packagesResponse.connected,
        pages: pagesResponse.connected,
        messages: messagesResponse.connected,
        enquiries: enquiriesResponse.connected,
        'package-quotes': packageQuotesResponse.connected,
        newsletter: newsletterResponse.connected,
        media: mediaResponse.connected,
        'policy-pages': policyPagesResponse.connected,
      })
      setConnected(
        issues.length === 0 &&
          projectsResponse.connected &&
          servicesResponse.connected &&
          packagesResponse.connected &&
          pagesResponse.connected &&
          messagesResponse.connected &&
          enquiriesResponse.connected &&
          packageQuotesResponse.connected &&
          newsletterResponse.connected &&
          mediaResponse.connected &&
          policyPagesResponse.connected,
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load admin data.')
    } finally {
      setLoading(false)
    }
  }

  async function refreshPublicSite() {
    setSaving(true)
    setError(null)
    setNotice('')
    try {
      await publishRefresh()
      setNotice('Public pages refreshed.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh public pages.')
    } finally {
      setSaving(false)
    }
  }

  async function importDefaultContent(target: 'projects' | 'services') {
    setSaving(true)
    setError(null)
    setNotice('')
    try {
      const response = await fetch('/api/admin/import-defaults', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target }),
      })
      const payload = await readJsonResponse<{ inserted?: number; skipped?: number; error?: string }>(response, {})
      if (!response.ok) throw new Error(payload.error || `Failed to import ${target}.`)
      await loadData()
      await publishRefresh(target === 'projects' ? ['/projects'] : ['/services'])
      setNotice(`Imported ${payload.inserted ?? 0} ${target}. Existing records skipped: ${payload.skipped ?? 0}.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to import ${target}.`)
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  useEffect(() => {
    if (activeTab === 'projects' && !projectDraftInitializedRef.current && projects.length > 0) {
      setProjectDraft(toProjectDraft(projects[0]))
      projectDraftInitializedRef.current = true
    }
    if (activeTab === 'services' && !serviceDraftInitializedRef.current && services.length > 0) {
      setServiceDraft(toServiceDraft(services[0]))
      serviceDraftInitializedRef.current = true
    }
  }, [activeTab, projects, services])

  useEffect(() => {
    if (session && !canView(session.role, activeTab)) {
      setActiveTab('overview')
    }
  }, [activeTab, session])

  async function saveProject() {
    setSaving(true)
    setError(null)
    setNotice('')
    try {
      const normalizedSlug = slugify(projectDraft.slug || projectDraft.title)
      const projectTitle = projectDraft.title.trim()
      const projectDescription = projectDraft.description.trim()
      const projectImage = projectDraft.image.trim() || fallbackProjectImage
      const missing = missingRequiredFields({
        Title: projectTitle,
        Description: projectDescription,
      })
      if (missing.length) {
        throw new Error(`Please fill required project fields: ${missing.join(', ')}.`)
      }
      if (!normalizedSlug) {
        throw new Error('Please enter a project title so the system can create a URL slug.')
      }

      const previousSlug = selectedProject?.slug || normalizedSlug
      const payload = {
        slug: normalizedSlug,
        title: projectTitle,
        category: projectDraft.category || 'Residential',
        card_label: projectDraft.card_label.trim() || `${projectDraft.category || 'Residential'} project`,
        location: projectDraft.location.trim(),
        image: projectImage,
        description: projectDescription,
        year: projectDraft.year.trim() || '2026',
        height_class: projectDraft.height_class.trim() || 'h-[420px] sm:h-[470px] xl:h-[560px]',
        overview: projectDraft.overview.trim() || projectDescription,
        hero_title: projectDraft.hero_title.trim() || projectTitle,
        hero_copy: projectDraft.hero_copy.trim() || projectDescription,
        seo_title: projectDraft.seo_title.trim() || `${projectTitle} | BuildCivil Constructions`,
        seo_description: projectDraft.seo_description.trim() || projectDescription,
        seo_image: projectDraft.seo_image.trim() || projectImage,
        highlights: parseList(projectDraft.highlights_text),
        stats: parseStats(projectDraft.stats_json),
        process: parseProcess(projectDraft.process_json),
        gallery: parseList(projectDraft.gallery_text).length ? parseList(projectDraft.gallery_text) : [projectImage],
        published: projectDraft.published,
        sort_order: projectDraft.sort_order,
      }

      if (projectDraft.id) {
        await api<ProjectRow[]>('projects', {
          method: 'PATCH',
          body: JSON.stringify({ id: projectDraft.id, updates: payload }),
        })
      } else {
        await api<ProjectRow[]>('projects', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
      }

      await loadData()
      try {
        await publishRefresh(['/projects', `/projects/${previousSlug}`, `/projects/${normalizedSlug}`])
        setNotice('Project saved and public cache refreshed.')
      } catch {
        setNotice('Project saved. Public cache refresh did not complete, so use Publish refresh once before checking the live site.')
      }
      setProjectDraft(emptyProjectDraft())
      setActiveTab('projects')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project.')
    } finally {
      setSaving(false)
    }
  }

  async function deleteProject(id: string) {
    const deletedSlug = projects.find((project) => project.id === id)?.slug
    setSaving(true)
    setError(null)
    setNotice('')
    try {
      await api('projects', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      })
      await loadData()
      await publishRefresh(['/projects', ...(deletedSlug ? [`/projects/${deletedSlug}`] : [])])
      setNotice('Project deleted and public cache refreshed.')
      setProjectDraft(emptyProjectDraft())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project.')
    } finally {
      setSaving(false)
    }
  }

  async function saveService() {
    setSaving(true)
    setError(null)
    setNotice('')
    try {
      const normalizedSlug = slugify(serviceDraft.slug || serviceDraft.title)
      const serviceTitle = serviceDraft.title.trim()
      const serviceDescription = serviceDraft.description.trim()
      const serviceImage = serviceDraft.image.trim() || fallbackServiceImage
      const missing = missingRequiredFields({
        Title: serviceTitle,
        Description: serviceDescription,
      })
      if (missing.length) {
        throw new Error(`Please fill required service fields: ${missing.join(', ')}.`)
      }
      if (!normalizedSlug) {
        throw new Error('Please enter a service title so the system can create a URL slug.')
      }

      const previousSlug = selectedService?.slug || normalizedSlug
      const payload = {
        slug: normalizedSlug,
        icon_name: serviceDraft.icon_name,
        title: serviceTitle,
        description: serviceDescription,
        kicker: serviceDraft.kicker.trim() || 'BuildCivil service',
        image: serviceImage,
        accent: serviceDraft.accent.trim() || 'from-[#E87F24]/30 via-[#FFC81E]/14 to-transparent',
        hero_title: serviceDraft.hero_title.trim() || serviceTitle,
        hero_copy: serviceDraft.hero_copy.trim() || serviceDescription,
        seo_title: serviceDraft.seo_title.trim() || `${serviceTitle} | BuildCivil Constructions`,
        seo_description: serviceDraft.seo_description.trim() || serviceDescription,
        seo_image: serviceDraft.seo_image.trim() || serviceImage,
        intro: serviceDraft.intro.trim() || serviceDescription,
        bullets: parseList(serviceDraft.bullets_text),
        details: parseList(serviceDraft.details_text),
        stats: parseStats(serviceDraft.stats_json),
        process: parseProcess(serviceDraft.process_json),
        gallery: parseList(serviceDraft.gallery_text).length ? parseList(serviceDraft.gallery_text) : [serviceImage],
        published: serviceDraft.published,
        sort_order: serviceDraft.sort_order,
      }

      if (serviceDraft.id) {
        await api<ServiceRow[]>('services', {
          method: 'PATCH',
          body: JSON.stringify({ id: serviceDraft.id, updates: payload }),
        })
      } else {
        await api<ServiceRow[]>('services', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
      }

      await loadData()
      try {
        await publishRefresh(['/services', `/services/${previousSlug}`, `/services/${normalizedSlug}`])
        setNotice('Service saved and public cache refreshed.')
      } catch {
        setNotice('Service saved. Public cache refresh did not complete, so use Publish refresh once before checking the live site.')
      }
      setServiceDraft(emptyServiceDraft())
      setActiveTab('services')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save service.')
    } finally {
      setSaving(false)
    }
  }

  async function deleteService(id: string) {
    const deletedSlug = services.find((service) => service.id === id)?.slug
    setSaving(true)
    setError(null)
    setNotice('')
    try {
      await api('services', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      })
      await loadData()
      await publishRefresh(['/services', ...(deletedSlug ? [`/services/${deletedSlug}`] : [])])
      setNotice('Service deleted and public cache refreshed.')
      setServiceDraft(emptyServiceDraft())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete service.')
    } finally {
      setSaving(false)
    }
  }

  async function updateMessageStatus(id: string, status: string) {
    setSaving(true)
    setError(null)
    try {
      await api<MessageRow[]>('messages', {
        method: 'PATCH',
        body: JSON.stringify({ id, updates: { status } }),
      })
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update message.')
    } finally {
      setSaving(false)
    }
  }

  async function deleteMessage(id: string) {
    if (!confirm('Delete this inquiry?')) return
    setSaving(true)
    setError(null)
    try {
      await api('messages', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      })
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete inquiry.')
    } finally {
      setSaving(false)
    }
  }

  async function updateEnquiryStatus(id: string, status: string) {
    setSaving(true)
    setError(null)
    try {
      await api<EnquiryRow[]>('enquiries', {
        method: 'PATCH',
        body: JSON.stringify({ id, updates: { status } }),
      })
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update service enquiry.')
    } finally {
      setSaving(false)
    }
  }

  async function deleteEnquiry(id: string) {
    if (!confirm('Delete this service enquiry?')) return
    setSaving(true)
    setError(null)
    try {
      await api('enquiries', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      })
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete service enquiry.')
    } finally {
      setSaving(false)
    }
  }

  const selectedProject = projectDraft.id ? projects.find((item) => item.id === projectDraft.id) : null
  const selectedService = serviceDraft.id ? services.find((item) => item.id === serviceDraft.id) : null
  const activeRole = session?.role ?? 'editor'
  const visibleTabs = tabs.filter((tab) => canView(activeRole, tab.key))
  const activeTabLabel = tabs.find((tab) => tab.key === activeTab)?.label ?? 'Overview'
  const activeTabExists = tabs.some((tab) => tab.key === activeTab)
  const activeTabAllowed = canView(activeRole, activeTab)
  const visibleSidebarGroups = sidebarGroups
    .map((group) => ({ ...group, items: group.items.filter((item) => canView(activeRole, item.key)) }))
    .filter((group) => group.items.length > 0)
  const getTabCount = (key: ViewKey) => {
    if (key === 'projects') return counts.projects
    if (key === 'services') return counts.services
    if (key === 'packages') return counts.packages
    if (key === 'policy-pages') return counts.policyPages
    if (key === 'pages') return counts.pages
    if (key === 'enquiries') return counts.enquiries
    if (key === 'package-quotes') return counts.packageQuotes
    if (key === 'messages') return counts.messages
    if (key === 'newsletter') return counts.newsletter
    return undefined
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#09090a] text-white">
      <MotionSection
        className="relative overflow-hidden px-3 py-3 sm:px-5 sm:py-5 lg:px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
        variants={sectionReveal}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,255,106,0.08),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(232,127,36,0.08),transparent_28%),linear-gradient(180deg,#111214_0%,#09090a_100%)]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:140px_140px] [mask-image:linear-gradient(180deg,transparent,black_14%,black_86%,transparent)]" />

        <div className="relative mx-auto w-full max-w-[1800px]">
          <div className="rounded-[24px] border border-white/7 bg-[#101113]/96 p-3 shadow-[0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:rounded-[32px] sm:p-5 lg:p-5">
            <div className="grid min-w-0 gap-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-5">
              <aside className="hidden rounded-[26px] border border-white/8 bg-[#0d0e10] p-3 shadow-[0_16px_42px_rgba(0,0,0,0.28)] lg:sticky lg:top-5 lg:block lg:max-h-[calc(100vh-2.5rem)] lg:overflow-y-auto">
                <div className="flex items-center gap-3 rounded-[22px] border border-white/8 bg-white/[0.035] p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#D8FF6A] text-[#111111]">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.28em] text-white/38">BuildCivil</div>
                    <div className="text-base font-black tracking-[-0.04em] text-white">Admin Studio</div>
                  </div>
                </div>

                <nav className="mt-4 space-y-4">
                  {visibleSidebarGroups.map((group) => (
                    <div key={group.label}>
                      <div className="mb-1.5 px-3 text-[9px] uppercase tracking-[0.22em] text-white/30">{group.label}</div>
                      <div className="space-y-1.5">
                        {group.items.map((item) => {
                          const active = activeTab === item.key
                          const Icon = item.icon
                          const count = getTabCount(item.key)
                          return (
                            <button
                              key={item.key}
                              type="button"
                              onClick={() => setActiveTab(item.key)}
                              className={`flex w-full items-center justify-between gap-3 rounded-[16px] border px-3 py-2 text-left text-sm transition ${
                                active
                                  ? 'border-[#D8FF6A]/40 bg-[#D8FF6A]/12 text-[#D8FF6A]'
                                  : 'border-transparent text-white/58 hover:border-white/8 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              <span className="flex min-w-0 items-center gap-3">
                                <Icon size={16} className={active ? 'text-[#D8FF6A]' : 'text-white/36'} />
                                <span className="truncate font-semibold">{item.label}</span>
                              </span>
                              {typeof count === 'number' ? (
                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${active ? 'bg-[#D8FF6A] text-[#111]' : 'bg-white/8 text-white/42'}`}>
                                  {count}
                                </span>
                              ) : null}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </nav>
              </aside>

              <div className="min-w-0">
            <div className="flex min-w-0 flex-col gap-4 rounded-[22px] border border-white/7 bg-[#111214] p-4 shadow-[0_16px_42px_rgba(0,0,0,0.26)] sm:rounded-[26px] lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-[#D8FF6A] text-[#111111] shadow-[0_12px_30px_rgba(216,255,106,0.16)]">
                  <ShieldCheck size={20} />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-[0.3em] text-white/42">BuildCivil control</div>
                  <h1 className="mt-1 truncate text-2xl font-black tracking-[-0.06em] text-white sm:text-[1.95rem]">
                    {activeTab === 'overview' ? 'Dashboard overview' : activeTabLabel}
                  </h1>
                  <p className="mt-1 max-w-2xl text-sm text-white/55">
                    Manage projects, services, and lead messages from one centered workspace.
                  </p>
                  {session ? (
                    <p className="mt-2 truncate text-xs font-semibold uppercase tracking-[0.2em] text-[#D8FF6A]/62">
                      {session.role.replace(/_/g, ' ')} · {session.email}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="w-full md:hidden">
                <label className="block">
                  <span className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-white/36">Jump to section</span>
                  <select
                    value={activeTab}
                    onChange={(event) => setActiveTab(event.target.value as ViewKey)}
                    className="w-full rounded-[18px] border border-white/10 bg-[#151516] px-4 py-3 text-sm font-semibold text-white outline-none focus:border-[#D8FF6A]/50"
                  >
                    {visibleSidebarGroups.map((group) => (
                      <optgroup key={group.label} label={group.label}>
                        {group.items.map((item) => (
                          <option key={item.key} value={item.key}>
                            {item.label}
                            {typeof getTabCount(item.key) === 'number' ? ` (${getTabCount(item.key)})` : ''}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </label>
              </div>

              <div className="hidden w-full overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:block lg:hidden lg:w-auto lg:pb-0">
                <div className="flex min-w-max items-center gap-2">
                  {visibleTabs.map((tab) => {
                    const active = activeTab === tab.key
                    const Icon = tab.icon
                    return (
                      <TopPill
                        key={tab.key}
                        active={active}
                        icon={Icon}
                        label={tab.label}
                        onClick={() => setActiveTab(tab.key)}
                        count={tab.key === 'overview' ? undefined : getTabCount(tab.key)}
                      />
                    )
                  })}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <button
                  type="button"
                  onClick={loadData}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/74 transition hover:border-[#D8FF6A]/40 hover:text-white"
                >
                  <RefreshCw size={15} className="text-[#D8FF6A]" />
                  Refresh
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={refreshPublicSite}
                  className="inline-flex items-center gap-2 rounded-full border border-[#D8FF6A]/20 bg-[#D8FF6A]/10 px-4 py-2.5 text-sm font-medium text-[#D8FF6A] transition hover:border-[#D8FF6A]/45 disabled:opacity-50"
                >
                  <RefreshCw size={15} />
                  Publish refresh
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/74 transition hover:border-[#D8FF6A]/40 hover:text-white"
                >
                  Open site
                  <ArrowRight size={15} className="text-[#D8FF6A]" />
                </Link>
                <form action="/api/admin/logout" method="post">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2.5 text-sm font-medium text-white/74 transition hover:border-[#E87F24]/40 hover:text-white"
                  >
                    <LogOut size={15} />
                    Sign out
                  </button>
                </form>
              </div>
            </div>

            {error ? (
              <div className="mt-5 rounded-[24px] border border-[#E87F24]/30 bg-[#2a1b11] p-5 text-sm text-[#ffd7b2]">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-[0.24em] text-[#FFC81E]">Dashboard needs attention</div>
                    <p className="mt-2 leading-6">{error}</p>
                    <p className="mt-1 text-xs leading-5 text-[#ffd7b2]/70">
                      If your session expired, sign out and login again. If this keeps happening, refresh the dashboard data.
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={loadData}
                      className="inline-flex items-center gap-2 rounded-full border border-[#FFC81E]/25 bg-[#FFC81E]/10 px-4 py-2.5 text-xs font-semibold text-[#fff1c4]"
                    >
                      <RefreshCw size={14} />
                      Retry
                    </button>
                    <form action="/api/admin/logout" method="post">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-full bg-[#FFC81E] px-4 py-2.5 text-xs font-semibold text-[#1c1712]"
                      >
                        <LogOut size={14} />
                        Sign out
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ) : null}
            {notice ? (
              <div className="mt-5 rounded-[22px] border border-[#D8FF6A]/20 bg-[#D8FF6A]/10 px-5 py-4 text-sm text-[#D8FF6A]">
                {notice}
              </div>
            ) : null}

            {!loading && !connected && !error ? (
              <div className="mt-5 rounded-[24px] border border-[#FFC81E]/20 bg-[#FFC81E]/8 p-5 text-sm text-[#fff1c4]">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-[0.24em] text-[#FFC81E]">Database connection issue</div>
                    <p className="mt-2 leading-6">
                      The dashboard is showing fallback or empty data because one or more Supabase admin tables are unavailable in this environment.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={loadData}
                    className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FFC81E]/25 bg-[#FFC81E]/10 px-4 py-2.5 text-xs font-semibold text-[#fff1c4]"
                  >
                    <RefreshCw size={14} />
                    Check again
                  </button>
                </div>
              </div>
            ) : null}

            {loading ? (
              <div className="mt-6 rounded-[28px] border border-white/8 bg-white/5 px-6 py-12 text-center text-sm text-white/55">
                Loading dashboard...
              </div>
            ) : null}

            <AdminPanelBoundary key={activeTab} title={activeTabLabel}>
            {!loading && activeTab === 'overview' ? (
              <AdminOverviewPanelView
                connected={connected}
                counts={counts}
                role={activeRole}
                loadIssues={loadIssues}
                projects={projects}
                services={services}
                packages={packages}
                pages={pages}
                messages={messages}
                enquiries={enquiries}
                packageQuotes={packageQuotes}
                newsletter={newsletter}
                media={media}
                onNavigate={setActiveTab}
                onEditProject={(project) => {
                  setActiveTab('projects')
                  setProjectDraft(toProjectDraft(project))
                }}
                onImportDefaults={importDefaultContent}
              />
            ) : null}

            {!loading && activeTab === 'help-guide' ? (
              <AdminHelpGuidePanel />
            ) : null}

            {!loading && activeTab === 'page-home' ? (
              <AdminHomePageEditor />
            ) : null}

            {!loading && activeTab === 'page-about' ? <AdminSimplePageEditor slug="about" /> : null}

            {!loading && activeTab === 'page-services' ? <AdminSimplePageEditor slug="services" /> : null}

            {!loading && activeTab === 'page-projects' ? <AdminSimplePageEditor slug="projects" /> : null}

            {!loading && activeTab === 'page-contact' ? <AdminSimplePageEditor slug="contact" /> : null}

            {!loading && activeTab === 'page-renovaite' ? <AdminSimplePageEditor slug="renovaite" /> : null}

            {!loading && activeTab === 'projects' ? (
              <AdminProjectLibraryPanel
                connected={tableConnections.projects ?? connected}
                loadError={tableLoadErrors.projects}
                saving={saving}
                projects={projects}
                draft={projectDraft}
                selectedTitle={selectedProject?.title}
                setDraft={setProjectDraft}
                emptyDraft={emptyProjectDraft}
                toDraft={toProjectDraft}
                onSave={saveProject}
                onDelete={deleteProject}
                onImportDefaults={() => importDefaultContent('projects')}
              />
            ) : null}

            {!loading && activeTab === 'services' ? (
              <AdminServiceLibraryPanel
                connected={tableConnections.services ?? connected}
                loadError={tableLoadErrors.services}
                saving={saving}
                services={services}
                draft={serviceDraft}
                selectedTitle={selectedService?.title}
                setDraft={setServiceDraft}
                emptyDraft={emptyServiceDraft}
                toDraft={toServiceDraft}
                onSave={saveService}
                onDelete={deleteService}
                onImportDefaults={() => importDefaultContent('services')}
              />
            ) : null}

            {!loading && activeTab === 'pages' ? (
              <AdminPagesPanel />
            ) : null}

            {!loading && activeTab === 'sections-builder' ? (
              <AdminCmsManagerPanel mode="sections" />
            ) : null}

            {!loading && activeTab === 'packages' ? (
              <AdminPackagesPanel />
            ) : null}

            {!loading && activeTab === 'policy-pages' ? (
              <AdminPolicyPagesPanel />
            ) : null}

            {!loading && activeTab === 'media' ? (
              <AdminMediaPanel />
            ) : null}

            {!loading && activeTab === 'settings' ? (
              <AdminSettingsPanel />
            ) : null}

            {!loading && activeTab === 'google-setup' ? (
              <AdminGoogleSetupPanel />
            ) : null}

            {!loading && activeTab === 'theme-studio' ? (
              <AdminCmsManagerPanel mode="theme" />
            ) : null}

            {!loading && activeTab === 'logos-brand' ? (
              <AdminCmsManagerPanel mode="brand" />
            ) : null}

            {!loading && activeTab === 'fonts' ? (
              <AdminCmsManagerPanel mode="fonts" />
            ) : null}

            {!loading && activeTab === 'forms-fields' ? (
              <AdminCmsManagerPanel mode="forms" />
            ) : null}

            {!loading && activeTab === 'seo-center' ? (
              <AdminSeoPanel />
            ) : null}

            {!loading && activeTab === 'site-navigation' ? (
              <AdminCmsManagerPanel mode="navigation" />
            ) : null}

            {!loading && activeTab === 'package-quotes' ? (
              <AdminPackageQuotesPanel />
            ) : null}

            {!loading && activeTab === 'newsletter' ? (
              <AdminNewsletterPanel />
            ) : null}

            {!loading && activeTab === 'admin-users' ? (
              <AdminUsersPanel />
            ) : null}

            {!loading && activeTab === 'enquiries' ? (
              <AdminServiceEnquiriesPanel
                connected={connected}
                saving={saving}
                enquiries={enquiries}
                onUpdateStatus={updateEnquiryStatus}
                onDelete={deleteEnquiry}
              />
            ) : null}

            {!loading && activeTab === 'messages' ? (
              <AdminLeadMessagesPanel
                connected={connected}
                saving={saving}
                messages={messages}
                onUpdateStatus={updateMessageStatus}
                onDelete={deleteMessage}
              />
            ) : null}
            {!loading && (!activeTabExists || !activeTabAllowed) ? (
              <div className="mt-6 rounded-[28px] border border-white/8 bg-[#171719] p-6 text-sm text-white/58">
                <div className="text-[11px] font-black uppercase tracking-[0.24em] text-[#D8FF6A]">Section unavailable</div>
                <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-white">Open an available dashboard section</h2>
                <p className="mt-3 max-w-2xl leading-6">
                  This dashboard tab is not available for the current role or no longer exists. Choose a section from the sidebar, or return to Overview.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#D8FF6A] px-5 py-3 text-sm font-semibold text-[#111111]"
                >
                  Go to Overview
                  <ArrowRight size={15} />
                </button>
              </div>
            ) : null}
            </AdminPanelBoundary>
              </div>
            </div>
          </div>
        </div>
      </MotionSection>
    </main>
  )
}
