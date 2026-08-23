import type { Metadata } from 'next'
import CareersPageClient from '@/components/CareersPageClient'
import { getGlobalLayoutSettings } from '@/lib/site-settings'

export const revalidate = 300

export function generateMetadata(): Metadata {
  const title = 'Careers | BuildCivil Constructions'
  const description = 'Join the BuildCivil Constructions team. Explore our culture, values, and how to reach us about open roles.'
  return {
    title,
    description,
    alternates: {
      canonical: '/careers',
    },
    openGraph: {
      title,
      description,
    },
  }
}

export default async function CareersPage() {
  const layoutSettings = await getGlobalLayoutSettings()
  return <CareersPageClient layoutSettings={layoutSettings} />
}
