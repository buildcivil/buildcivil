import { isSupabaseConfigured, supabaseRequest } from './supabase-admin'

export type GoogleSetup = {
  siteUrl: string
  siteName: string
  gaMeasurementId: string
  gtmId: string
  searchConsoleVerification: string
}

export const googleSetupDefaults: GoogleSetup = {
  siteUrl: '',
  siteName: 'BuildCivil Constructions',
  gaMeasurementId: '',
  gtmId: '',
  searchConsoleVerification: '',
}

type SiteSettingRow = {
  key: string
  value: unknown
}

function asString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback
}

export function mergeGoogleSetup(value: unknown): GoogleSetup {
  const input = value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
  return {
    siteUrl: asString(input.siteUrl, googleSetupDefaults.siteUrl),
    siteName: asString(input.siteName, googleSetupDefaults.siteName) || googleSetupDefaults.siteName,
    gaMeasurementId: asString(input.gaMeasurementId, googleSetupDefaults.gaMeasurementId),
    gtmId: asString(input.gtmId, googleSetupDefaults.gtmId),
    searchConsoleVerification: asString(input.searchConsoleVerification, googleSetupDefaults.searchConsoleVerification),
  }
}

export function getConfiguredSiteUrl(value?: GoogleSetup) {
  const configured = value?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (!configured) return 'http://localhost:3000'
  const withProtocol = configured.startsWith('http') ? configured : `https://${configured}`
  return withProtocol.replace(/\/$/, '')
}

export async function getGoogleSetup() {
  if (!isSupabaseConfigured()) return googleSetupDefaults

  try {
    const rows = await supabaseRequest<SiteSettingRow[]>(
      '/rest/v1/site_settings?select=key,value&key=eq.google_setup&limit=1',
      { method: 'GET', revalidate: 300 },
    )
    return mergeGoogleSetup(rows[0]?.value)
  } catch {
    return googleSetupDefaults
  }
}
