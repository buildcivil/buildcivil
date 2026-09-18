import { isSupabaseConfigured, supabaseRequest } from './supabase-admin'
import {
  globalLayoutDefaults,
  mergeGlobalLayoutSettings,
  type GlobalLayoutSettings,
} from './site-settings-defaults'
import type { PolicyPage } from './policies'

export type { GlobalLayoutSettings, HeaderSettings, FooterSettings } from './site-settings-defaults'

export type SiteSettingRow = {
  id: string
  key: string
  value: unknown
  created_at?: string
  updated_at?: string
}

type SiteNavigationRow = {
  id: string
  location: string
  label: string
  href: string
  target?: string | null
  visible: boolean
  sort_order: number
}

type BrandAssetsRow = {
  header_logo_url?: string | null
  footer_logo_url?: string | null
  header_logo_alt?: string | null
  footer_logo_alt?: string | null
  favicon_url?: string | null
  social_image_url?: string | null
  logo_alt?: string | null
  logo_settings?: Record<string, unknown> | null
  brand_text?: Record<string, unknown> | null
  brand_colors?: Record<string, unknown> | null
  published?: boolean | null
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function asString(value: unknown, fallback: string) {
  if (typeof value === 'number') return String(value)
  return typeof value === 'string' && value.trim() ? value : fallback
}

function normalizeBrandWords(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[^a-zA-Z\s]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
}

function deriveBrandTokens(fullName: string) {
  const words = normalizeBrandWords(fullName)
  if (words.length >= 2) {
    const [top, bottom] = words
    return {
      markTop: top.slice(0, 2).toUpperCase() || 'BU',
      markBottom: bottom.slice(0, 2).toUpperCase() || 'CI',
      wordTop: top.slice(2).toUpperCase() || top.toUpperCase(),
      wordBottom: bottom.slice(2).toUpperCase() || bottom.toUpperCase(),
      mobileTop: top,
      mobileBottom: bottom,
    }
  }

  const compact = fullName.replace(/[^a-zA-Z]+/g, '')
  if (compact.length >= 8) {
    const midpoint = Math.ceil(compact.length / 2)
    const top = compact.slice(0, midpoint)
    const bottom = compact.slice(midpoint)
    return {
      markTop: top.slice(0, 2).toUpperCase() || 'BU',
      markBottom: bottom.slice(0, 2).toUpperCase() || 'CI',
      wordTop: top.slice(2).toUpperCase() || top.toUpperCase(),
      wordBottom: bottom.slice(2).toUpperCase() || bottom.toUpperCase(),
      mobileTop: top,
      mobileBottom: bottom,
    }
  }

  return null
}

function shouldNormalizeBrandTokens(brand: {
  markTop: string
  markBottom: string
  wordTop: string
  wordBottom: string
}) {
  return (
    brand.markTop.length > 3 ||
    brand.markBottom.length > 3 ||
    brand.wordTop.length > 5 ||
    brand.wordBottom.length > 5
  )
}

function applyNavigationOverrides(settings: GlobalLayoutSettings, rows: SiteNavigationRow[]) {
  const toLinks = (location: string) =>
    rows
      .filter((row) => row.location === location)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((row) => ({
        id: row.id,
        label: row.label,
        href: row.href,
        visible: row.visible,
      }))

  const headerLinks = toLinks('header')
  const footerLinks = toLinks('footer_company')
  const legalLinks = toLinks('footer_legal')

  if (headerLinks.length) settings.header.navLinks = headerLinks
  if (footerLinks.length) settings.footer.companyLinks = footerLinks
  if (legalLinks.length) settings.footer.legalLinks = legalLinks
}

function applyBrandOverrides(settings: GlobalLayoutSettings, row?: BrandAssetsRow) {
  const brandText = row?.brand_text
  if (!brandText) return

  let nextBrand = {
    ...settings.header.brand,
    markTop: asString(brandText.markTop, settings.header.brand.markTop),
    markBottom: asString(brandText.markBottom, settings.header.brand.markBottom),
    wordTop: asString(brandText.wordTop, settings.header.brand.wordTop),
    wordBottom: asString(brandText.wordBottom, settings.header.brand.wordBottom),
    mobileTop: asString(brandText.mobileTop, settings.header.brand.mobileTop),
    mobileBottom: asString(brandText.mobileBottom, settings.header.brand.mobileBottom),
    logoUrl: row?.header_logo_url || settings.header.brand.logoUrl,
    logoAlt: row?.header_logo_alt || row?.logo_alt || settings.header.brand.logoAlt || 'BuildCivil Constructions',
    showImageLogo: Boolean(row?.logo_settings?.showImageLogo),
    desktopWidth: asString(row?.logo_settings?.headerDesktopWidth ?? row?.logo_settings?.desktopWidth, settings.header.brand.desktopWidth || '180'),
    tabletWidth: asString(row?.logo_settings?.headerTabletWidth ?? row?.logo_settings?.tabletWidth, settings.header.brand.tabletWidth || '150'),
    mobileWidth: asString(row?.logo_settings?.headerMobileWidth ?? row?.logo_settings?.mobileWidth, settings.header.brand.mobileWidth || '126'),
    markSize: asString(row?.logo_settings?.markSize, settings.header.brand.markSize || '56'),
    faviconUrl: row?.favicon_url || settings.header.brand.faviconUrl,
    socialImageUrl: row?.social_image_url || settings.header.brand.socialImageUrl,
    primaryColor: asString(row?.brand_colors?.primary, settings.header.brand.primaryColor || '#1c1712'),
    accentColor: asString(row?.brand_colors?.accent, settings.header.brand.accentColor || '#E87F24'),
    markBackgroundColor: asString(row?.brand_colors?.markBackground, settings.header.brand.markBackgroundColor || '#FFC81E'),
  }

  const derivedName =
    asString(brandText.name, '') ||
    [asString(brandText.mobileTop, ''), asString(brandText.mobileBottom, '')].filter(Boolean).join(' ')

  if (derivedName && shouldNormalizeBrandTokens(nextBrand)) {
    const normalized = deriveBrandTokens(derivedName)
    if (normalized) {
      nextBrand = {
        ...nextBrand,
        ...normalized,
      }
    }
  }

  settings.header.brand = nextBrand
  settings.footer.brand = {
    ...nextBrand,
    logoUrl: row?.footer_logo_url || row?.header_logo_url || settings.footer.brand.logoUrl,
    logoAlt: row?.footer_logo_alt || row?.header_logo_alt || row?.logo_alt || nextBrand.logoAlt,
    desktopWidth: asString(row?.logo_settings?.footerDesktopWidth, settings.footer.brand.footerDesktopWidth || settings.footer.brand.desktopWidth || '190'),
    tabletWidth: asString(row?.logo_settings?.footerTabletWidth, settings.footer.brand.footerTabletWidth || settings.footer.brand.tabletWidth || '150'),
    mobileWidth: asString(row?.logo_settings?.footerMobileWidth, settings.footer.brand.mobileWidth || '126'),
    footerDesktopWidth: asString(row?.logo_settings?.footerDesktopWidth, settings.footer.brand.footerDesktopWidth || '190'),
    footerTabletWidth: asString(row?.logo_settings?.footerTabletWidth, settings.footer.brand.footerTabletWidth || '150'),
    primaryColor: asString(row?.brand_colors?.primary, settings.footer.brand.primaryColor || nextBrand.primaryColor || '#FEFDDF'),
    accentColor: asString(row?.brand_colors?.accent, settings.footer.brand.accentColor || nextBrand.accentColor || '#FFC81E'),
    markBackgroundColor: asString(row?.brand_colors?.markBackground, settings.footer.brand.markBackgroundColor || '#E87F24'),
  }
  settings.footer.bigText = asString(brandText.name, settings.footer.bigText)
}

function applyPolicyLinks(settings: GlobalLayoutSettings, rows: PolicyPage[]) {
  const policyLinks = rows
    .filter((row) => row.published)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((row) => ({
      id: `policy-${row.slug}`,
      label: row.title,
      href: `/${row.slug}`,
      visible: true,
    }))

  const headerPolicies = rows.filter((row) => row.show_in_header)
  if (headerPolicies.length) {
    const existing = new Set(settings.header.navLinks.map((link) => link.href))
    settings.header.navLinks = [
      ...settings.header.navLinks,
      ...policyLinks.filter((link) => existing.has(link.href) ? false : headerPolicies.some((row) => `/${row.slug}` === link.href)),
    ]
  }

  const footerPolicies = rows.filter((row) => row.show_in_footer)
  if (footerPolicies.length) {
    const footerPolicyLinks = policyLinks.filter((link) => footerPolicies.some((row) => `/${row.slug}` === link.href))
    const policyHrefs = new Set(footerPolicyLinks.map((link) => link.href))
    const policyLabels = new Set(footerPolicyLinks.map((link) => link.label.trim().toLowerCase()))
    settings.footer.legalLinks = [
      ...settings.footer.legalLinks.filter((link) => {
        const normalizedLabel = link.label.trim().toLowerCase()
        if (link.href === '#') return false
        if (policyHrefs.has(link.href)) return false
        if (policyLabels.has(normalizedLabel) && link.href === '/contact') return false
        return true
      }),
      ...footerPolicyLinks,
    ]
  }
}

export async function getGlobalLayoutSettings(): Promise<GlobalLayoutSettings> {
  if (!isSupabaseConfigured()) return clone(globalLayoutDefaults)

  try {
    // Header/footer branding and navigation must reflect admin updates immediately.
    const [rows, navigationRows, brandRows, policyRows] = await Promise.all([
      supabaseRequest<SiteSettingRow[]>('/rest/v1/site_settings?select=*&key=eq.global_layout&limit=1', { method: 'GET' }),
      supabaseRequest<SiteNavigationRow[]>(
        '/rest/v1/site_navigation?select=*&visible=eq.true&order=location.asc,sort_order.asc',
        { method: 'GET' },
      ),
      supabaseRequest<BrandAssetsRow[]>('/rest/v1/brand_assets?select=header_logo_url,footer_logo_url,header_logo_alt,footer_logo_alt,favicon_url,social_image_url,logo_settings,brand_text,brand_colors,published&key=eq.default&published=eq.true&limit=1', { method: 'GET' }),
      supabaseRequest<PolicyPage[]>('/rest/v1/policy_pages?select=slug,title,published,show_in_header,show_in_footer,sort_order&published=eq.true&order=sort_order.asc', { method: 'GET' }),
    ])
    const settings = mergeGlobalLayoutSettings(rows[0]?.value)
    applyNavigationOverrides(settings, navigationRows)
    applyBrandOverrides(settings, brandRows[0])
    applyPolicyLinks(settings, policyRows)
    return settings
  } catch {
    return clone(globalLayoutDefaults)
  }
}
