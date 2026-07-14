import type { Metadata } from 'next'
import RenovaitePageClient from '@/components/RenovaitePageClient'
import { cleanSeoText } from '@/lib/seo'
import { getSitePage, type RenovaitePageContent } from '@/lib/site-pages'
import { getGlobalLayoutSettings } from '@/lib/site-settings'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePage('renovaite')
  const content = page.content as Partial<RenovaitePageContent>
  const seo = content.seo
  const title = cleanSeoText(seo?.title, 'Renovaite by BuildCivil | AI Interior Design')
  const description = cleanSeoText(
    seo?.description,
    'Upload a room photo and explore Renovaite before/after design directions with BuildCivil.',
  )

  return {
    title,
    description,
    alternates: { canonical: '/renovaite' },
    openGraph: {
      title,
      description,
      images: seo?.ogImage || page.hero_image ? [{ url: seo?.ogImage || page.hero_image }] : undefined,
    },
  }
}

export default async function RenovaitePage() {
  const [page, layoutSettings] = await Promise.all([
    getSitePage('renovaite'),
    getGlobalLayoutSettings(),
  ])

  return (
    <RenovaitePageClient
      content={page.content as Partial<RenovaitePageContent>}
      layoutSettings={layoutSettings}
      heroImage={page.hero_image}
    />
  )
}
