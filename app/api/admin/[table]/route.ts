import { NextResponse } from 'next/server'
import { projectCatalog } from '@/lib/projects'
import { getDefaultPageRecord, getPageDefaultsForAdmin, type SitePageSlug } from '@/lib/site-pages'
import { serviceCatalog } from '@/lib/services'
import { getAdminSession } from '@/lib/admin-access'
import { createPasswordCredentials, sanitizeAdminUserRow } from '@/lib/admin-users'
import {
  getSupabaseBaseUrl,
  isSupabaseConfigured,
  supabaseRequest,
  type SupabaseCollection,
} from '@/lib/supabase-admin'

type AdminTable = SupabaseCollection

const rolePermissions: Record<string, AdminTable[]> = {
  super_admin: [
    'projects', 'services', 'messages', 'pages', 'enquiries', 'media', 'package-quotes', 'newsletter',
    'site-sections', 'site-theme', 'brand-assets', 'form-definitions', 'site-navigation', 'admin-users',
    'seo-drafts', 'policy-pages',
  ],
  admin: [
    'projects', 'services', 'messages', 'pages', 'enquiries', 'media', 'package-quotes', 'newsletter',
    'site-sections', 'site-theme', 'brand-assets', 'form-definitions', 'site-navigation',
    'seo-drafts', 'policy-pages',
  ],
  editor: ['projects', 'services', 'pages', 'media', 'site-sections', 'seo-drafts', 'policy-pages'],
  content_manager: ['projects', 'services', 'pages', 'media', 'site-sections', 'site-navigation', 'seo-drafts', 'policy-pages'],
  project_manager: ['projects', 'services', 'media', 'seo-drafts'],
  media_manager: ['media'],
  leads_manager: ['messages', 'enquiries', 'package-quotes', 'newsletter'],
}

type ProjectRow = Record<string, unknown> & {
  id: string
  slug: string
  title: string
  category: string
  card_label: string
  location: string
  image: string
  description: string
  year: string
  height_class: string
  overview: string
  hero_title: string
  hero_copy: string
  highlights: string[] | unknown
  stats: unknown
  process: unknown
  gallery: unknown
  published: boolean
  sort_order: number
}

type ServiceRow = Record<string, unknown> & {
  id: string
  slug: string
  title: string
  description: string
  kicker: string
  image: string
  accent: string
  bullets: string[] | unknown
  details: string[] | unknown
  hero_title: string
  hero_copy: string
  intro: string
  gallery: unknown
  stats: unknown
  process: unknown
  icon_name: string
  published: boolean
  sort_order: number
}

type MessageRow = Record<string, unknown> & {
  id: string
  name: string
  email: string
  phone: string | null
  project_type: string | null
  details: string | null
  status: string
  created_at?: string
}

type EnquiryRow = Record<string, unknown> & {
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

type MediaRow = Record<string, unknown> & {
  id: string
  file_name: string
  file_url: string
  file_type: string
  alt_text: string
  folder: string
  uploaded_by: string
  created_at?: string
}

type PackageQuoteRow = Record<string, unknown> & {
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

type NewsletterRow = Record<string, unknown> & {
  id: string
  email: string
  status: string
  source: string
  notes: string
  created_at?: string
}

type AdminUserRow = Record<string, unknown> & {
  id: string
  email: string
  name: string
  role: string
  status: string
  created_at?: string
}

type PageRow = Record<string, unknown> & {
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

const TABLE_MAP: Record<AdminTable, { table: string }> = {
  projects: { table: 'projects' },
  services: { table: 'services' },
  messages: { table: 'contact_messages' },
  pages: { table: 'site_pages' },
  enquiries: { table: 'service_enquiries' },
  media: { table: 'media_assets' },
  'package-quotes': { table: 'package_quote_requests' },
  newsletter: { table: 'newsletter_subscribers' },
  'site-sections': { table: 'site_sections' },
  'site-theme': { table: 'site_theme' },
  'brand-assets': { table: 'brand_assets' },
  'form-definitions': { table: 'form_definitions' },
  'site-navigation': { table: 'site_navigation' },
  'admin-users': { table: 'admin_users' },
  'seo-drafts': { table: 'seo_drafts' },
  'policy-pages': { table: 'policy_pages' },
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 })
}

function serverError(message: string) {
  return NextResponse.json({ error: message }, { status: 500 })
}

function validateProjectServicePayload(table: AdminTable, payload: unknown) {
  if (table !== 'projects' && table !== 'services') return null
  if (!isObject(payload)) return 'Project/service payload must be an object.'

  const required = ['slug', 'title', 'description']
  const missing = required.filter((key) => !stringValue(payload[key]).trim())
  if (missing.length) {
    return `${table === 'projects' ? 'Project' : 'Service'} requires: ${missing.join(', ')}.`
  }

  const jsonFields = table === 'projects'
    ? ['highlights', 'stats', 'process', 'gallery']
    : ['bullets', 'details', 'stats', 'process', 'gallery']
  const invalidJsonFields = jsonFields.filter((key) => key in payload && !Array.isArray(payload[key]))
  if (invalidJsonFields.length) {
    return `${table === 'projects' ? 'Project' : 'Service'} fields must be arrays: ${invalidJsonFields.join(', ')}.`
  }

  return null
}

async function hasTableAccess(request: Request, table: AdminTable) {
  const session = await getAdminSession(request)
  if (!session) return false
  return (rolePermissions[session.role] ?? rolePermissions.editor).includes(table)
}

function forbidden() {
  return NextResponse.json({ error: 'This admin role does not have access to this section.' }, { status: 403 })
}

function notConfiguredFallback(table: AdminTable) {
  if (table === 'projects') {
    const rows = projectCatalog.map((project, index) => ({
      id: project.slug,
      slug: project.slug,
      title: project.title,
      category: project.category,
      card_label: project.cardLabel,
      location: project.location,
      image: project.image,
      description: project.description,
      year: project.year,
      height_class: project.heightClass,
      overview: project.overview,
      hero_title: project.heroTitle,
      hero_copy: project.heroCopy,
      highlights: project.highlights,
      stats: project.stats,
      process: project.process,
      gallery: project.gallery,
      published: true,
      sort_order: index,
    }))
    return NextResponse.json({ connected: false, table, rows })
  }

  if (table === 'services') {
    const rows = serviceCatalog.map((service, index) => ({
      id: service.slug,
      slug: service.slug,
      title: service.title,
      description: service.description,
      kicker: service.kicker,
      image: service.image,
      accent: service.accent,
      bullets: service.bullets,
      details: service.details,
      hero_title: service.heroTitle,
      hero_copy: service.heroCopy,
      intro: service.intro,
      gallery: service.gallery,
      stats: service.stats,
      process: service.process,
      icon_name: service.iconName,
      published: true,
      sort_order: index,
    }))
    return NextResponse.json({ connected: false, table, rows })
  }

  if (table === 'pages') {
    const rows = getPageDefaultsForAdmin().map((page, index) => ({
      id: page.slug,
      slug: page.slug,
      title: page.title,
      hero_label: page.hero_label,
      hero_title: page.hero_title,
      hero_copy: page.hero_copy,
      hero_image: page.hero_image,
      content: page.content,
      published: page.published,
      sort_order: index,
    }))
    return NextResponse.json({ connected: false, table, rows })
  }

  return NextResponse.json({ connected: false, table, rows: [] as Array<MessageRow | EnquiryRow | MediaRow | PackageQuoteRow | NewsletterRow | AdminUserRow> })
}

function pageFallbackRows() {
  return getPageDefaultsForAdmin().map((page, index) => ({
    id: page.slug,
    slug: page.slug,
    title: page.title,
    hero_label: page.hero_label,
    hero_title: page.hero_title,
    hero_copy: page.hero_copy,
    hero_image: page.hero_image,
    content: page.content,
    published: page.published,
    sort_order: index,
  }))
}

function normalizeTable(table: string): AdminTable | null {
  if (
    table === 'projects' ||
    table === 'services' ||
    table === 'messages' ||
    table === 'pages' ||
    table === 'enquiries' ||
    table === 'media' ||
    table === 'package-quotes' ||
    table === 'newsletter' ||
    table === 'site-sections' ||
    table === 'site-theme' ||
    table === 'brand-assets' ||
    table === 'form-definitions' ||
    table === 'site-navigation' ||
    table === 'admin-users' ||
    table === 'seo-drafts' ||
    table === 'policy-pages'
  ) return table
  return null
}

function normalizeSort<T extends { sort_order?: number; created_at?: string }>(rows: T[]) {
  return [...rows].sort((a, b) => {
    const aSort = a.sort_order ?? 0
    const bSort = b.sort_order ?? 0
    if (aSort !== bSort) return aSort - bSort

    const aCreated = a.created_at ?? ''
    const bCreated = b.created_at ?? ''
    return bCreated.localeCompare(aCreated)
  })
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function stringValue(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function mergeObjects<T extends Record<string, unknown>>(base: T, override?: unknown): T {
  if (!isObject(override)) return { ...base }
  const output: Record<string, unknown> = { ...base }
  for (const [key, value] of Object.entries(override)) {
    const baseValue = output[key]
    if (isObject(baseValue) && isObject(value)) output[key] = mergeObjects(baseValue, value)
    else output[key] = value
  }
  return output as T
}

function sectionImage(section: Record<string, unknown>) {
  if (typeof section.image === 'string') return section.image
  if (Array.isArray(section.slides) && isObject(section.slides[0])) return stringValue(section.slides[0].image)
  return ''
}

function sectionRowToContent(section: Record<string, unknown>) {
  const content = isObject(section.content) ? section.content : {}
  return {
    ...content,
    title: stringValue(section.title) || stringValue(content.title),
    subtitle: stringValue(section.subtitle) || stringValue(content.subtitle),
    kicker: stringValue(section.kicker) || stringValue(content.kicker),
    copy: stringValue(section.copy) || stringValue(content.copy),
    image: stringValue(section.image_url) || stringValue(content.image),
    imageAlt: stringValue(section.image_alt) || stringValue(content.imageAlt),
    ctaLabel: stringValue(section.cta_label) || stringValue(content.ctaLabel),
    ctaHref: stringValue(section.cta_href) || stringValue(content.ctaHref),
    layoutPreset: stringValue(section.layout_preset),
    backgroundColor: stringValue(section.background_color),
    textColor: stringValue(section.text_color),
    style: isObject(section.style) ? section.style : content.style,
  }
}

async function mergePageRowsWithSections(rows: PageRow[]) {
  if (!rows.length) return rows
  const slugs = rows.map((row) => row.slug).filter(Boolean)
  if (!slugs.length) return rows

  const sections = await supabaseRequest<Array<Record<string, unknown>>>(
    `/rest/v1/site_sections?select=*&page_slug=in.(${slugs.map((slug) => encodeURIComponent(slug)).join(',')})&visible=eq.true&order=sort_order.asc`,
    { method: 'GET' },
  )

  const bySlug = sections.reduce<Record<string, Record<string, Record<string, unknown>>>>((output, section) => {
    const slug = stringValue(section.page_slug)
    const key = stringValue(section.section_key)
    if (!slug || !key) return output
    output[slug] = output[slug] ?? {}
    output[slug][key] = sectionRowToContent(section)
    return output
  }, {})

  return rows.map((row) => ({
    ...getDefaultPageRecord(row.slug as SitePageSlug),
    ...row,
    content: mergeObjects(
      mergeObjects(getDefaultPageRecord(row.slug as SitePageSlug).content, row.content),
      bySlug[row.slug],
    ),
  }))
}

async function syncPageSectionsFromContent(page: Record<string, unknown>, content: unknown) {
  const slug = stringValue(page.slug)
  if (!slug || !isObject(content)) return

  const visibility = isObject(content.sectionVisibility) ? content.sectionVisibility : {}
  const settings = isObject(content.sectionSettings) ? content.sectionSettings : {}
  const sectionRows = Object.entries(content)
    .filter(([key, value]) => !['seo', 'sectionVisibility', 'sectionSettings'].includes(key) && isObject(value))
    .map(([sectionKey, value], index) => {
      const section = value as Record<string, unknown>
      const sectionSettings = isObject(settings[sectionKey]) ? settings[sectionKey] as Record<string, unknown> : {}
      return {
        page_slug: slug,
        section_key: sectionKey,
        title: stringValue(section.title),
        subtitle: stringValue(section.subtitle),
        kicker: stringValue(section.kicker ?? section.label),
        copy: stringValue(section.copy),
        image_url: sectionImage(section),
        image_alt: stringValue(section.imageAlt),
        cta_label: stringValue(section.ctaLabel),
        cta_href: stringValue(section.ctaHref),
        layout_preset: stringValue(sectionSettings.layoutPreset) || 'default',
        background_color: stringValue(sectionSettings.backgroundColor),
        text_color: stringValue(sectionSettings.textColor),
        visible: typeof visibility[sectionKey] === 'boolean' ? visibility[sectionKey] as boolean : true,
        sort_order: typeof sectionSettings.sortOrder === 'number' ? sectionSettings.sortOrder as number : index,
        style: isObject(sectionSettings.style) ? sectionSettings.style : {},
        content: section,
      }
    })

  if (!sectionRows.length) return

  await supabaseRequest<void>(
    '/rest/v1/site_sections?on_conflict=page_slug,section_key',
    {
      method: 'POST',
      body: JSON.stringify(sectionRows),
      headers: {
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      expectJson: false,
    },
  )
}

type AdminTableRouteContext = {
  params: Promise<{ table: string }>
}

async function getRouteTable(context: AdminTableRouteContext) {
  const params = await context.params
  return normalizeTable(params.table)
}

export async function GET(_request: Request, context: AdminTableRouteContext) {
  const table = await getRouteTable(context)
  if (!table) return badRequest('Unsupported admin table.')
  if (!(await hasTableAccess(_request, table))) return forbidden()

  if (!isSupabaseConfigured()) {
    return notConfiguredFallback(table)
  }

  const select =
    table === 'admin-users'
      ? 'id,email,name,role,status,created_at,updated_at,last_login_at'
      : '*'

  const response = await supabaseRequest<Array<ProjectRow | ServiceRow | MessageRow | PageRow | EnquiryRow | MediaRow | PackageQuoteRow | NewsletterRow | AdminUserRow>>(
    `/rest/v1/${TABLE_MAP[table].table}?select=${select}`,
    {
      method: 'GET',
    },
  )

  if (table === 'pages' && response.length === 0) {
    return NextResponse.json({ connected: true, table, rows: pageFallbackRows() })
  }

  if (table === 'pages') {
    return NextResponse.json({
      connected: true,
      table,
      rows: normalizeSort(await mergePageRowsWithSections(response as PageRow[])),
    })
  }

  return NextResponse.json({
    connected: true,
    table,
    rows: normalizeSort(response),
  })
}

export async function POST(request: Request, context: AdminTableRouteContext) {
  const table = await getRouteTable(context)
  if (!table) return badRequest('Unsupported admin table.')
  if (!(await hasTableAccess(request, table))) return forbidden()
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error: 'Supabase is not configured.',
        detail: 'Admin database writes are unavailable in this environment.',
      },
      { status: 503 },
    )
  }

  const payload = await request.json()
  const validationError = validateProjectServicePayload(table, payload)
  if (validationError) return badRequest(validationError)

  let writePayload = payload as Record<string, unknown>
  if (table === 'admin-users') {
    const password = typeof writePayload.password === 'string' ? writePayload.password : ''
    if (!password.trim() || password.trim().length < 8) {
      return badRequest('A password of at least 8 characters is required when creating an admin user.')
    }
    const { password: _password, ...rest } = writePayload
    writePayload = { ...rest, ...createPasswordCredentials(password.trim()) }
  }

  try {
    const rows = await supabaseRequest<Array<ProjectRow | ServiceRow | MessageRow | PageRow | EnquiryRow | MediaRow | PackageQuoteRow | NewsletterRow | AdminUserRow>>(
      `/rest/v1/${TABLE_MAP[table].table}`,
      {
        method: 'POST',
        body: JSON.stringify(writePayload),
        headers: {
          Prefer: 'return=representation',
        },
      },
    )

    const safeRows = table === 'admin-users' ? rows.map((row) => sanitizeAdminUserRow(row as Record<string, unknown>)) : rows
    return NextResponse.json({ ok: true, rows: safeRows })
  } catch (err) {
    return serverError(err instanceof Error ? err.message : `Unable to create ${TABLE_MAP[table].table} record.`)
  }
}

export async function PATCH(request: Request, context: AdminTableRouteContext) {
  const table = await getRouteTable(context)
  if (!table) return badRequest('Unsupported admin table.')
  if (!(await hasTableAccess(request, table))) return forbidden()
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error: 'Supabase is not configured.',
        detail: 'Admin database writes are unavailable in this environment.',
      },
      { status: 503 },
    )
  }

  const payload = await request.json()
  const { id, updates } = payload as { id?: string; updates?: Record<string, unknown> }
  if (!id || !updates) return badRequest('PATCH requires id and updates.')
  const validationError = validateProjectServicePayload(table, updates)
  if (validationError) return badRequest(validationError)

  let writeUpdates = { ...updates }
  if (table === 'admin-users') {
    const password = typeof writeUpdates.password === 'string' ? writeUpdates.password.trim() : ''
    delete writeUpdates.password
    delete writeUpdates.password_hash
    delete writeUpdates.password_salt
    if (password) {
      if (password.length < 8) return badRequest('Password must be at least 8 characters.')
      writeUpdates = { ...writeUpdates, ...createPasswordCredentials(password) }
    }
  }

  try {
    const rows = await supabaseRequest<Array<ProjectRow | ServiceRow | MessageRow | PageRow | EnquiryRow | MediaRow | PackageQuoteRow | NewsletterRow | AdminUserRow>>(
      `/rest/v1/${TABLE_MAP[table].table}?id=eq.${encodeURIComponent(id)}`,
      {
        method: 'PATCH',
        body: JSON.stringify(writeUpdates),
        headers: {
          Prefer: 'return=representation',
        },
      },
    )

    if (table === 'pages' && rows[0] && writeUpdates.content) {
      await syncPageSectionsFromContent(rows[0], writeUpdates.content)
    }

    const safeRows = table === 'admin-users' ? rows.map((row) => sanitizeAdminUserRow(row as Record<string, unknown>)) : rows
    return NextResponse.json({ ok: true, rows: safeRows })
  } catch (err) {
    return serverError(err instanceof Error ? err.message : `Unable to update ${TABLE_MAP[table].table} record.`)
  }
}

export async function DELETE(request: Request, context: AdminTableRouteContext) {
  const table = await getRouteTable(context)
  if (!table) return badRequest('Unsupported admin table.')
  if (!(await hasTableAccess(request, table))) return forbidden()
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error: 'Supabase is not configured.',
        detail: 'Admin database writes are unavailable in this environment.',
      },
      { status: 503 },
    )
  }

  const payload = await request.json()
  const id = (payload as { id?: string }).id
  if (!id) return badRequest('DELETE requires id.')

  try {
    await supabaseRequest<void>(
      `/rest/v1/${TABLE_MAP[table].table}?id=eq.${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
        expectJson: false,
      },
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    return serverError(err instanceof Error ? err.message : `Unable to delete ${TABLE_MAP[table].table} record.`)
  }
}
