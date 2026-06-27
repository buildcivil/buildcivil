import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ServiceDetailPageClient from '@/components/ServiceDetailPageClient'
import { getServiceBySlugFromCMS, serviceCatalog } from '@/lib/services'
import { cleanSeoText } from '@/lib/seo'
import { getGlobalLayoutSettings } from '@/lib/site-settings'

export function generateStaticParams() {
  return serviceCatalog.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlugFromCMS(slug)

  if (!service) {
    return {
      title: 'Service not found | BuildCivil Constructions',
    }
  }

  const title = cleanSeoText(service.seoTitle, `${service.title} | BuildCivil Constructions`)
  const description = cleanSeoText(service.seoDescription, service.description)

  return {
    title,
    description,
    alternates: {
      canonical: `/services/${slug}`,
    },
    openGraph: {
      title,
      description,
      images: service.seoImage || service.image ? [{ url: service.seoImage || service.image }] : undefined,
    },
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [service, layoutSettings] = await Promise.all([getServiceBySlugFromCMS(slug), getGlobalLayoutSettings()])

  if (!service) notFound()

  return <ServiceDetailPageClient service={service} layoutSettings={layoutSettings} />
}
