import type { Metadata } from 'next'
import ContactPageClient from '@/components/ContactPageClient'
import { getFormDefinition } from '@/lib/form-definitions'
import { cleanSeoText } from '@/lib/seo'
import { getSitePage } from '@/lib/site-pages'
import { getGlobalLayoutSettings } from '@/lib/site-settings'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePage('contact')
  const content = page.content as any
  const seo = content?.seo
  const title = cleanSeoText(seo?.title, 'Contact | BuildCivil Constructions')
  const description = cleanSeoText(
    seo?.description,
    'Contact BuildCivil Constructions to discuss turnkey construction, design, renovation, architectural planning, or project management.',
  )
  return {
    title,
    description,
    alternates: {
      canonical: '/contact',
    },
    openGraph: {
      title,
      description,
      images: seo?.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
  }
}

export default async function ContactPage() {
  const [page, formDefinition, layoutSettings] = await Promise.all([
    getSitePage('contact'),
    getFormDefinition('contact'),
    getGlobalLayoutSettings(),
  ])
  return <ContactPageClient content={page.content as any} formDefinition={formDefinition} layoutSettings={layoutSettings} />
}
