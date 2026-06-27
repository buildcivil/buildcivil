import type { MetadataRoute } from 'next'
import { getGoogleSetup, getConfiguredSiteUrl } from '@/lib/google-setup'
import { getPolicyPages } from '@/lib/policies'
import { getProjectCatalogFromCMS } from '@/lib/projects'
import { getServiceCatalogFromCMS } from '@/lib/services'

export const revalidate = 300

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [googleSetup, services, projects, policies] = await Promise.all([
    getGoogleSetup(),
    getServiceCatalogFromCMS(),
    getProjectCatalogFromCMS(),
    getPolicyPages({ publishedOnly: true }),
  ])
  const siteUrl = getConfiguredSiteUrl(googleSetup)
  const now = new Date()
  const staticRoutes = ['/', '/about', '/services', '/projects', '/contact']
  const routes = [
    ...staticRoutes,
    ...services.map((service) => `/services/${service.slug}`),
    ...projects.map((project) => `/projects/${project.slug}`),
    ...policies.map((policy) => `/${policy.slug}`),
  ]

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : route.includes('/projects/') || route.includes('/services/') ? 0.75 : 0.8,
  }))
}
