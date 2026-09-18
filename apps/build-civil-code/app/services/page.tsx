import type { Metadata } from 'next'
import ServicesPageClient from '@/components/ServicesPageClient'
import { getServiceCatalogFromCMS } from '@buildcivil/cms/services'
import { cleanSeoText } from '@buildcivil/cms/seo'
import { getSitePage } from '@buildcivil/cms/site-pages'
import { getGlobalLayoutSettings } from '@buildcivil/cms/site-settings'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePage('services')
  const content = page.content as any
  const seo = content?.seo
  const title = cleanSeoText(seo?.title, 'Services | BuildCivil Constructions')
  const description = cleanSeoText(
    seo?.description,
    'Explore BuildCivil Constructions services including turnkey construction, interior and exterior design, renovation, architectural planning, and project management.',
  )
  return {
    title,
    description,
    alternates: {
      canonical: '/services',
    },
    openGraph: {
      title,
      description,
      images: seo?.ogImage || page.hero_image ? [{ url: seo?.ogImage || page.hero_image }] : undefined,
    },
  }
}

export default async function ServicesPage() {
  const [page, services, layoutSettings] = await Promise.all([
    getSitePage('services'),
    getServiceCatalogFromCMS(),
    getGlobalLayoutSettings(),
  ])
  return <ServicesPageClient content={page.content as any} services={services} layoutSettings={layoutSettings} />
}
