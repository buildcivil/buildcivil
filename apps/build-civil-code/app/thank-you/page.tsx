import type { Metadata } from 'next'
import ThankYouPageClient from '@/components/ThankYouPageClient'
import { getGlobalLayoutSettings } from '@buildcivil/cms/site-settings'

export function generateMetadata(): Metadata {
  const title = 'Thank You | BuildCivil Constructions'
  const description = 'Thanks for reaching out to BuildCivil Constructions. Our team will get back to you shortly.'
  return {
    title,
    description,
    alternates: {
      canonical: '/thank-you',
    },
    robots: {
      index: false,
      follow: true,
    },
  }
}

export default async function ThankYouPage() {
  const layoutSettings = await getGlobalLayoutSettings()
  return <ThankYouPageClient layoutSettings={layoutSettings} />
}
