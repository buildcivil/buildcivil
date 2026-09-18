import type { Metadata } from 'next'

import AiCostEstimatorPageClient from '@/components/AiCostEstimatorPageClient'

export const metadata: Metadata = {
  title: 'BuildCivil AI | Plan Your Construction',
  description:
    'Use BuildCivil AI to plan your construction project step by step. Get area estimates, INR cost breakdowns, and a phase-wise roadmap tailored to your selections.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'BuildCivil AI | Plan Your Construction',
    description:
      'Use BuildCivil AI to plan your construction project step by step. Get area estimates, INR cost breakdowns, and a phase-wise roadmap tailored to your selections.',
  },
}

export default function HomePage() {
  return <AiCostEstimatorPageClient />
}
