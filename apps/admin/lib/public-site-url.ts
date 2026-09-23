// Unlike @buildcivil/cms/seo's getPublicSiteUrl() — which auto-detects "my own"
// production URL for use inside build-civil-code itself — this always points at
// the public marketing site, regardless of which Vercel project this code runs in.
export function getPublicSiteUrl() {
  const configured = process.env.PUBLIC_SITE_URL || 'https://buildcivil.in'
  return configured.replace(/\/$/, '')
}
