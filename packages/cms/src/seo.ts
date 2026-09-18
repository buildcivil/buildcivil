const fallbackSiteUrl = 'https://buildcivil.in'

export function getPublicSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || fallbackSiteUrl
  const withProtocol = configured.startsWith('http') ? configured : `https://${configured}`
  return withProtocol.replace(/\/$/, '')
}

export function getCanonicalPath(path: string) {
  if (!path || path === '/') return '/'
  return `/${path.replace(/^\/+|\/+$/g, '')}`
}

export function cleanSeoText(value: unknown, fallback = '') {
  const text = typeof value === 'string' ? value : fallback
  return text
    .replace(/\s+/g, ' ')
    .replace(/[.…]{2,}$/g, '')
    .trim()
}
