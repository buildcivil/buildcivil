import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BuildCivil AI | Construction Cost Estimator',
  description:
    'Plan your construction project step by step. Get area estimates, INR cost breakdowns, and a phase-wise roadmap tailored to your selections.',
  icons: {
    icon: [{ url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' }, { url: '/favicon.ico' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
