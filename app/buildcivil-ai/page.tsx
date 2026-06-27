import type { Metadata } from 'next'

import BuildCivilAiPageClient from '@/components/BuildCivilAiPageClient'
import { getGlobalLayoutSettings } from '@/lib/site-settings'

export async function generateMetadata(): Promise<Metadata> {
  const title = 'BuildCivil AI | Plan Your Construction'
  const description =
    'Use BuildCivil AI to plan your construction project step by step. Get area estimates, INR cost breakdowns, and a phase-wise roadmap tailored to your selections.'
  return {
    title,
    description,
    alternates: {
      canonical: '/buildcivil-ai',
    },
    openGraph: {
      title,
      description,
    },
  }
}

export default async function BuildCivilAiPage() {
  const layoutSettings = await getGlobalLayoutSettings()
  return <BuildCivilAiPageClient layoutSettings={layoutSettings} />
}
