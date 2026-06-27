import type { Metadata } from 'next'
import ProjectsPageClient from '@/components/ProjectsPageClient'
import { getProjectCatalogFromCMS } from '@/lib/projects'
import { cleanSeoText } from '@/lib/seo'
import { getSitePage } from '@/lib/site-pages'
import { getGlobalLayoutSettings } from '@/lib/site-settings'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePage('projects')
  const content = page.content as any
  const seo = content?.seo
  const title = cleanSeoText(seo?.title, 'Projects | BuildCivil Constructions')
  const description = cleanSeoText(
    seo?.description,
    'Explore BuildCivil Constructions projects across residential, commercial, interior, and renovation work with a curated visual portfolio.',
  )
  return {
    title,
    description,
    alternates: {
      canonical: '/projects',
    },
    openGraph: {
      title,
      description,
      images: seo?.ogImage || page.hero_image ? [{ url: seo?.ogImage || page.hero_image }] : undefined,
    },
  }
}

export default async function ProjectsPage() {
  const [page, projects, layoutSettings] = await Promise.all([
    getSitePage('projects'),
    getProjectCatalogFromCMS(),
    getGlobalLayoutSettings(),
  ])
  return <ProjectsPageClient content={page.content as any} projects={projects} layoutSettings={layoutSettings} />
}
