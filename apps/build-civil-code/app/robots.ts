import type { MetadataRoute } from 'next'
import { getConfiguredSiteUrl, getGoogleSetup } from '@buildcivil/cms/google-setup'

export const revalidate = 300

export default async function robots(): Promise<MetadataRoute.Robots> {
  const googleSetup = await getGoogleSetup()
  const siteUrl = getConfiguredSiteUrl(googleSetup)

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
