'use client'

import type { ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ExternalLink,
  LogOut,
  Menu,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react'
import {
  ADMIN_NAV_GROUPS,
  canViewAdmin,
  getAdminViewLabel,
  searchAdminNav,
  type AdminViewKey,
} from '@/lib/admin/nav'
import { cn } from '@/lib/cn'
import { AdminAlert, AdminBadge, AdminButton } from '@/components/admin/ui'

type AdminShellProps = {
  activeTab: AdminViewKey
  onNavigate: (tab: AdminViewKey) => void
  session: { email: string; role: string } | null
  getCount?: (key: AdminViewKey) => number | undefined
  loading?: boolean
  saving?: boolean
  error?: string | null
  notice?: string
  connected?: boolean
  onRefresh: () => void
  onPublishRefresh: () => void
  onClearError?: () => void
  children: ReactNode
}

export default function AdminShell({
  activeTab,
  onNavigate,
  session,
  getCount,
  loading,
  saving,
  error,
  notice,
  connected = true,
  onRefresh,
  onPublishRefresh,
  onClearError,
  children,
}: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  const role = session?.role ?? 'editor'
  const visibleGroups = useMemo(
    () =>
      ADMIN_NAV_GROUPS.map((group) => ({
        ...group,
        items: group.items.filter((item) => canViewAdmin(role, item.key)),
      })).filter((group) => group.items.length > 0),
    [role],
  )

  const searchResults = useMemo(() => searchAdminNav(searchQuery, role), [searchQuery, role])
  const activeLabel = getAdminViewLabel(activeTab)
  const activeDescription = ADMIN_NAV_GROUPS.flatMap((g) => g.items).find((i) => i.key === activeTab)?.description

  useEffect(() => {
    setMobileOpen(false)
    setSearchQuery('')
    setSearchOpen(false)
  }, [activeTab])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
        requestAnimationFrame(() => searchRef.current?.focus())
      }
      if (event.key === 'Escape') {
        setSearchOpen(false)
        setMobileOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  function navigate(key: AdminViewKey) {
    onNavigate(key)
    setMobileOpen(false)
    setSearchOpen(false)
    setSearchQuery('')
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-50 to-orange-50/60 p-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E87F24] text-white shadow-sm">
          <ShieldCheck size={18} />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">BuildCivil</div>
          <div className="truncate text-sm font-bold tracking-[-0.03em] text-slate-900">Admin Studio</div>
        </div>
      </div>

      <nav className="mt-4 flex-1 space-y-5 overflow-y-auto pb-4 pr-1 [-ms-overflow-style:none] [scrollbar-width:thin]">
        {visibleGroups.map((group) => (
          <div key={group.label}>
            <div className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">{group.label}</div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = activeTab === item.key
                const Icon = item.icon
                const count = getCount?.(item.key)
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => navigate(item.key)}
                    className={cn(
                      'group flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-left text-sm transition',
                      active
                        ? 'bg-orange-50 text-[#c45f12] ring-1 ring-[#E87F24]/20'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <Icon size={15} className={active ? 'text-[#E87F24]' : 'text-slate-400 group-hover:text-slate-600'} />
                      <span className="truncate font-medium">{item.label}</span>
                    </span>
                    {typeof count === 'number' ? (
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums',
                          active ? 'bg-[#E87F24] text-white' : 'bg-slate-100 text-slate-500',
                        )}
                      >
                        {count}
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {session ? (
        <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="truncate text-sm font-semibold text-slate-900">{session.email}</div>
          <div className="mt-1.5">
            <AdminBadge tone="success">{session.role.replaceAll('_', ' ')}</AdminBadge>
          </div>
        </div>
      ) : null}
    </div>
  )

  return (
    <main className="admin-shell min-h-screen bg-[#F3F5F8] text-slate-900">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(115,165,202,0.12),transparent_42%),radial-gradient(ellipse_at_bottom_left,rgba(232,127,36,0.08),transparent_40%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1680px]">
        <aside className="sticky top-0 hidden h-screen w-[268px] shrink-0 border-r border-slate-200/80 bg-white/90 p-4 backdrop-blur-xl lg:block">
          {sidebar}
        </aside>

        {mobileOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button type="button" className="absolute inset-0 bg-slate-900/30" aria-label="Close menu" onClick={() => setMobileOpen(false)} />
            <aside className="absolute inset-y-0 left-0 w-[min(300px,88vw)] border-r border-slate-200 bg-white p-4 shadow-2xl">
              <div className="mb-3 flex justify-end">
                <AdminButton variant="ghost" className="!px-2.5 !py-2" onClick={() => setMobileOpen(false)} aria-label="Close">
                  <X size={16} />
                </AdminButton>
              </div>
              {sidebar}
            </aside>
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-[#F3F5F8]/90 px-3 py-3 backdrop-blur-xl sm:px-5">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <AdminButton variant="ghost" className="!px-2.5 !py-2 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                <Menu size={18} />
              </AdminButton>

              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  {ADMIN_NAV_GROUPS.find((g) => g.items.some((i) => i.key === activeTab))?.label ?? 'Workspace'}
                </div>
                <h1 className="truncate text-lg font-bold tracking-[-0.04em] text-slate-900 sm:text-xl">{activeLabel}</h1>
              </div>

              <div className="relative hidden w-full max-w-xs md:block lg:max-w-sm">
                <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setSearchOpen(true)
                  }}
                  onFocus={() => setSearchOpen(true)}
                  placeholder="Search sections… ⌘K"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#73A5CA] focus:ring-2 focus:ring-[#73A5CA]/20"
                />
                {searchOpen && searchQuery.trim() ? (
                  <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                    {searchResults.length ? (
                      searchResults.map((item) => {
                        const Icon = item.icon
                        return (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => navigate(item.key)}
                            className="flex w-full items-start gap-3 border-b border-slate-100 px-3 py-2.5 text-left last:border-0 hover:bg-slate-50"
                          >
                            <Icon size={15} className="mt-0.5 text-[#E87F24]" />
                            <span>
                              <span className="block text-sm font-medium text-slate-900">{item.label}</span>
                              {item.description ? <span className="block text-xs text-slate-500">{item.description}</span> : null}
                            </span>
                          </button>
                        )
                      })
                    ) : (
                      <div className="px-3 py-4 text-sm text-slate-500">No matching sections</div>
                    )}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <AdminButton variant="ghost" className="!px-2.5 !py-2 md:hidden" onClick={() => { setSearchOpen(true); requestAnimationFrame(() => searchRef.current?.focus()) }} aria-label="Search">
                  <Search size={16} />
                </AdminButton>
                <AdminButton onClick={onRefresh} disabled={loading} className="!hidden sm:!inline-flex">
                  <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                  Refresh
                </AdminButton>
                <AdminButton variant="accent" onClick={onPublishRefresh} disabled={saving} className="!hidden sm:!inline-flex">
                  <RefreshCw size={14} />
                  Publish
                </AdminButton>
                <Link
                  href="/"
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <ExternalLink size={14} />
                  <span className="hidden sm:inline">Site</span>
                </Link>
                <form action="/api/admin/logout" method="post">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                  >
                    <LogOut size={14} />
                    <span className="hidden sm:inline">Sign out</span>
                  </button>
                </form>
              </div>
            </div>

            {activeDescription ? <p className="mt-2 hidden text-sm text-slate-500 sm:block">{activeDescription}</p> : null}

            {searchOpen ? (
              <div className="mt-3 md:hidden">
                <div className="relative">
                  <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    placeholder="Search sections…"
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#73A5CA]"
                  />
                </div>
                {searchQuery.trim() ? (
                  <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                    {searchResults.length ? (
                      searchResults.map((item) => {
                        const Icon = item.icon
                        return (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => navigate(item.key)}
                            className="flex w-full items-center gap-3 border-b border-slate-100 px-3 py-2.5 text-left last:border-0"
                          >
                            <Icon size={15} className="text-[#E87F24]" />
                            <span className="text-sm font-medium text-slate-900">{item.label}</span>
                          </button>
                        )
                      })
                    ) : (
                      <div className="px-3 py-3 text-sm text-slate-500">No matching sections</div>
                    )}
                  </div>
                ) : null}
              </div>
            ) : null}
          </header>

          <div className="space-y-4 px-3 py-4 sm:px-5 sm:py-5">
            {error ? (
              <AdminAlert
                tone="error"
                title="Needs attention"
                actions={
                  <>
                    <AdminButton onClick={onRefresh}>Retry</AdminButton>
                    <form action="/api/admin/logout" method="post">
                      <AdminButton type="submit" variant="danger">
                        Sign out
                      </AdminButton>
                    </form>
                    {onClearError ? (
                      <AdminButton variant="ghost" onClick={onClearError}>
                        Dismiss
                      </AdminButton>
                    ) : null}
                  </>
                }
              >
                {error}
              </AdminAlert>
            ) : null}

            {notice ? <AdminAlert tone="success">{notice}</AdminAlert> : null}

            {!loading && !connected && !error ? (
              <AdminAlert
                tone="warning"
                title="Database connection issue"
                actions={<AdminButton onClick={onRefresh}>Check again</AdminButton>}
              >
                Some tables are unavailable. The dashboard may show fallback or empty data until the connection is restored.
              </AdminAlert>
            ) : null}

            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                <RefreshCw size={20} className="mx-auto animate-spin text-[#E87F24]" />
                <p className="mt-3 text-sm text-slate-500">Loading dashboard…</p>
              </div>
            ) : null}

            {!loading ? children : null}

            {!canViewAdmin(role, activeTab) ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#E87F24]">Unavailable</div>
                <h2 className="mt-2 text-xl font-bold text-slate-900">This section is not available for your role</h2>
                <p className="mt-2 text-sm text-slate-500">Choose another section from the sidebar, or return to Overview.</p>
                <AdminButton variant="primary" className="mt-5" onClick={() => navigate('overview')}>
                  Go to Overview <ArrowRight size={14} />
                </AdminButton>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  )
}
