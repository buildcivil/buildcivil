import type { MetadataRoute } from 'next'
import { getGoogleSetup, getConfiguredSiteUrl } from '@buildcivil/cms/google-setup'
import { getBlogPosts } from '@buildcivil/cms/blog'
import { getPolicyPages } from '@buildcivil/cms/policies'
import { getProjectCatalogFromCMS } from '@buildcivil/cms/projects'
import { getServiceCatalogFromCMS } from '@buildcivil/cms/services'

export const revalidate = 300

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [googleSetup, services, projects, policies, blogPosts] = await Promise.all([
    getGoogleSetup(),
    getServiceCatalogFromCMS(),
    getProjectCatalogFromCMS(),
    getPolicyPages({ publishedOnly: true }),
    getBlogPosts({ publishedOnly: true }),
  ])
  const siteUrl = getConfiguredSiteUrl(googleSetup)
  const now = new Date()
  const staticRoutes = ['/', '/about', '/services', '/projects', '/contact', '/renovaite', '/blog', '/careers']
  const routes = [
    ...staticRoutes,
    ...services.map((service) => `/services/${service.slug}`),
    ...projects.map((project) => `/projects/${project.slug}`),
    ...policies.map((policy) => `/${policy.slug}`),
    ...blogPosts.map((post) => `/blog/${post.slug}`),
  ]

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : route.includes('/projects/') || route.includes('/services/') || route.includes('/blog/') ? 0.75 : 0.8,
  }))
}
