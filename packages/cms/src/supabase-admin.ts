export type SupabaseCollection =
  | 'projects'
  | 'services'
  | 'messages'
  | 'pages'
  | 'enquiries'
  | 'media'
  | 'package-quotes'
  | 'newsletter'
  | 'site-sections'
  | 'site-theme'
  | 'brand-assets'
  | 'form-definitions'
  | 'site-navigation'
  | 'admin-users'
  | 'seo-drafts'
  | 'policy-pages'
  | 'blogs'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || process.env.SUPABASE_URL?.trim() || ''

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || ''

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseServiceRoleKey)
}

export function hasSupabaseUrl() {
  return Boolean(supabaseUrl)
}

export function getSupabaseBaseUrl() {
  return supabaseUrl.replace(/\/$/, '')
}

function buildHeaders(extraHeaders?: HeadersInit) {
  return {
    apikey: supabaseServiceRoleKey,
    Authorization: `Bearer ${supabaseServiceRoleKey}`,
    'Content-Type': 'application/json',
    ...(extraHeaders ?? {}),
  }
}

export async function supabaseRequest<T>(
  path: string,
  init: RequestInit & { expectJson?: boolean; revalidate?: number } = {},
): Promise<T> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured.')
  }

  const { expectJson: _expectJson, revalidate, ...requestInit } = init
  let response: Response

  try {
    response = await fetch(`${getSupabaseBaseUrl()}${path}`, {
      ...requestInit,
      headers: buildHeaders(init.headers),
      ...(typeof revalidate === 'number' ? { next: { revalidate } } : { cache: 'no-store' }),
    })
  } catch (error) {
    if (process.env.DEBUG_CMS_FETCH === '1') {
      console.error(error)
    }

    throw new Error('Supabase request failed: network unavailable.')
  }

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Supabase request failed (${response.status}): ${text || response.statusText}`)
  }

  if (init.expectJson === false) {
    return undefined as T
  }

  const text = await response.text()
  if (!text) {
    return undefined as T
  }

  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error('Supabase request failed: invalid JSON response.')
  }
}
