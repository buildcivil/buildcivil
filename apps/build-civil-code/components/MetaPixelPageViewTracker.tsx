'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef } from 'react'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

function Tracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const hasTrackedInitialView = useRef(false)

  useEffect(() => {
    if (!hasTrackedInitialView.current) {
      // The inline Meta Pixel init script (in layout.tsx) already fires the
      // very first PageView — this effect only handles client-side route
      // changes, which the App Router doesn't reload the page for.
      hasTrackedInitialView.current = true
      return
    }
    window.fbq?.('track', 'PageView')
  }, [pathname, searchParams])

  return null
}

export default function MetaPixelPageViewTracker() {
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  )
}
