import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProjectDetailPageClient from '@/components/ProjectDetailPageClient'
import { getProjectBySlugFromCMS, projectCatalog } from '@/lib/projects'
import { cleanSeoText } from '@/lib/seo'
import { getGlobalLayoutSettings } from '@/lib/site-settings'

export function generateStaticParams() {
  return projectCatalog.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlugFromCMS(slug)

  if (!project) {
    return {
      title: 'Project | BuildCivil Constructions',
      description: 'Explore BuildCivil Constructions project details and delivery highlights.',
    }
  }

  const title = cleanSeoText(project.seoTitle, `${project.title} | Projects | BuildCivil Constructions`)
  const description = cleanSeoText(project.seoDescription, project.description)

  return {
    title,
    description,
    alternates: {
      canonical: `/projects/${slug}`,
    },
    openGraph: {
      title,
      description,
      images: project.seoImage || project.image ? [{ url: project.seoImage || project.image }] : undefined,
    },
  }
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [project, layoutSettings] = await Promise.all([getProjectBySlugFromCMS(slug), getGlobalLayoutSettings()])

  if (!project) {
    notFound()
  }

  return <ProjectDetailPageClient project={project} layoutSettings={layoutSettings} />
}
