import { ArrowUpRight, Sparkles } from 'lucide-react'

const MAIN_SITE_URL = process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'https://buildcivil.in'

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-[4.25rem] sm:px-6 lg:px-8">
        <a href={MAIN_SITE_URL} className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-header/15 text-header">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold tracking-tight text-brand-dark group-hover:text-header">
              BuildCivil AI
            </span>
            <span className="block text-[11px] text-black/50">Cost estimator</span>
          </span>
        </a>

        <a
          href={MAIN_SITE_URL}
          className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3.5 py-2 text-xs font-semibold text-brand-dark transition hover:border-header/40 hover:text-header sm:text-sm"
        >
          Main site
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </header>
  )
}
