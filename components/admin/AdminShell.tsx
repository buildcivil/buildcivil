'use client'

import type { ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ChevronDown,
  ExternalLink,
  LogOut,
  Menu,
  RefreshCw,
  Search,
  ShieldCheck,
  UploadCloud,
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
import { AdminAlert, AdminAvatar, AdminBadge, AdminButton, AdminIconButton, AdminKbd } from '@/components/admin/ui'

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
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [paletteQuery, setPaletteQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const paletteRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const role = session?.role ?? 'editor'
  const visibleGroups = useMemo(
    () =>
      ADMIN_NAV_GROUPS.map((group) => ({
        ...group,
        items: group.items.filter((item) => canViewAdmin(role, item.key)),
      })).filter((group) => group.items.length > 0),
    [role],
  )

  const paletteResults = useMemo(() => searchAdminNav(paletteQuery, role), [paletteQuery, role])
  const activeLabel = getAdminViewLabel(activeTab)
  const activeGroup = ADMIN_NAV_GROUPS.find((g) => g.items.some((i) => i.key === activeTab))
  const activeDescription = activeGroup?.items.find((i) => i.key === activeTab)?.description

  useEffect(() => {
    setMobileOpen(false)
    setPaletteOpen(false)
    setPaletteQuery('')
  }, [activeTab])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen(true)
        requestAnimationFrame(() => paletteRef.current?.focus())
      }
      if (event.key === 'Escape') {
        setPaletteOpen(false)
        setMobileOpen(false)
        setMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  function navigate(key: AdminViewKey) {
    onNavigate(key)
    setMobileOpen(false)
    setPaletteOpen(false)
    setPaletteQuery('')
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-1.5 pb-1 pt-0.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#F0954A] to-[#D6671A] text-white shadow-[0_4px_10px_-2px_rgba(224,113,28,0.5)]">
          <ShieldCheck size={17} strokeWidth={2.4} />
        </div>
        <div className="min-w-0">
          <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400">BuildCivil</div>
          <div className="truncate text-[15px] font-extrabold leading-tight tracking-[-0.03em] text-slate-900">Admin Studio</div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setPaletteOpen(true)
          requestAnimationFrame(() => paletteRef.current?.focus())
        }}
        className="mt-4 flex items-center gap-2 rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm text-slate-400 transition hover:border-slate-300 hover:bg-white"
      >
        <Search size={14} />
        <span className="flex-1">Search…</span>
        <AdminKbd>⌘K</AdminKbd>
      </button>

      <nav className="mt-5 flex-1 space-y-4 overflow-y-auto pb-4 pr-1 [-ms-overflow-style:none] [scrollbar-width:thin]">
        {visibleGroups.map((group) => (
          <div key={group.label}>
            <div className="mb-1 px-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{group.label}</div>
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
                      'group relative flex w-full items-center justify-between gap-2 rounded-[10px] py-[7px] pl-3 pr-2.5 text-left text-[13.5px] transition-colors duration-150',
                      active ? 'bg-orange-50 text-[#c45f12]' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                    )}
                  >
                    {active ? <span className="absolute -left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-[#E87F24]" /> : null}
                    <span className="flex min-w-0 items-center gap-2.5">
                      <Icon size={15} strokeWidth={2.1} className={active ? 'text-[#E87F24]' : 'text-slate-400 group-hover:text-slate-600'} />
                      <span className="truncate font-medium">{item.label}</span>
                    </span>
                    {typeof count === 'number' && count > 0 ? (
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums',
                          active ? 'bg-[#E87F24] text-white' : 'bg-slate-200/70 text-slate-500',
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
        <div className="relative mt-auto" ref={menuRef}>
          {menuOpen ? (
            <div className="animate-in fade-in zoom-in-95 slide-in-from-bottom-1 absolute bottom-[calc(100%+8px)] left-0 right-0 overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-xl duration-150">
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-2.5 border-b border-slate-100 px-3.5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <ExternalLink size={14} className="text-slate-400" />
                View site
              </Link>
              <form action="/api/admin/logout" method="post">
                <button
                  type="submit"
                  className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-orange-700 transition hover:bg-orange-50"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </form>
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex w-full items-center gap-2.5 rounded-[14px] border border-slate-200 bg-slate-50 p-2 transition hover:border-slate-300 hover:bg-white"
          >
            <AdminAvatar name={session.email} size={32} />
            <div className="min-w-0 flex-1 text-left">
              <div className="truncate text-[13px] font-bold text-slate-900">{session.email}</div>
              <div className="truncate text-[11px] capitalize text-slate-400">{session.role.replaceAll('_', ' ')}</div>
            </div>
            <ChevronDown size={14} className="shrink-0 text-slate-400" />
          </button>
        </div>
      ) : null}
    </div>
  )

  return (
    <main className="admin-shell min-h-screen bg-[#F4F5F7] text-slate-900">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_50%_at_100%_0%,rgba(115,165,202,0.10),transparent),radial-gradient(ellipse_50%_40%_at_0%_100%,rgba(232,127,36,0.07),transparent)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1680px]">
        <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 border-r border-slate-200/70 bg-white/70 px-3.5 py-4 backdrop-blur-2xl lg:block">
          {sidebar}
        </aside>

        {mobileOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button type="button" className="animate-in fade-in absolute inset-0 bg-slate-900/40 duration-150" aria-label="Close menu" onClick={() => setMobileOpen(false)} />
            <aside className="animate-in slide-in-from-left absolute inset-y-0 left-0 w-[min(300px,88vw)] border-r border-slate-200 bg-white p-3.5 shadow-2xl duration-200">
              <div className="mb-2 flex justify-end">
                <AdminIconButton onClick={() => setMobileOpen(false)} aria-label="Close">
                  <X size={16} />
                </AdminIconButton>
              </div>
              {sidebar}
            </aside>
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-[#F4F5F7]/85 px-3 py-3 backdrop-blur-xl sm:px-6">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <AdminIconButton className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                <Menu size={17} />
              </AdminIconButton>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  <span>{activeGroup?.label ?? 'Workspace'}</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-[#c45f12]">{activeLabel}</span>
                </div>
                <h1 className="truncate text-[1.35rem] font-extrabold tracking-[-0.045em] text-slate-900 sm:text-2xl">{activeLabel}</h1>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPaletteOpen(true)
                  requestAnimationFrame(() => paletteRef.current?.focus())
                }}
                className="hidden items-center gap-2 rounded-[12px] border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-400 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-slate-300 md:flex md:w-64"
              >
                <Search size={14} />
                <span className="flex-1 text-left">Search…</span>
                <AdminKbd>⌘K</AdminKbd>
              </button>

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <AdminIconButton className="md:hidden" onClick={() => { setPaletteOpen(true); requestAnimationFrame(() => paletteRef.current?.focus()) }} aria-label="Search">
                  <Search size={16} />
                </AdminIconButton>
                <AdminIconButton onClick={onRefresh} disabled={loading} className="!hidden sm:!inline-flex" aria-label="Refresh">
                  <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                </AdminIconButton>
                <AdminButton variant="primary" size="sm" onClick={onPublishRefresh} disabled={saving} className="!hidden sm:!inline-flex">
                  <UploadCloud size={14} />
                  Publish
                </AdminButton>
                <Link
                  href="/"
                  target="_blank"
                  className="hidden items-center gap-2 rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 lg:inline-flex"
                >
                  <ExternalLink size={14} />
                  Site
                </Link>
              </div>
            </div>

            {activeDescription ? <p className="mt-2 hidden text-sm text-slate-500 sm:block">{activeDescription}</p> : null}
          </header>

          <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-1 space-y-4 px-3 py-4 duration-300 sm:px-6 sm:py-6">
            {error ? (
              <AdminAlert
                tone="error"
                title="Needs attention"
                actions={
                  <>
                    <AdminButton size="sm" onClick={onRefresh}>Retry</AdminButton>
                    <form action="/api/admin/logout" method="post">
                      <AdminButton type="submit" size="sm" variant="danger">
                        Sign out
                      </AdminButton>
                    </form>
                    {onClearError ? (
                      <AdminButton size="sm" variant="ghost" onClick={onClearError}>
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
                actions={<AdminButton size="sm" onClick={onRefresh}>Check again</AdminButton>}
              >
                Some tables are unavailable. The dashboard may show fallback or empty data until the connection is restored.
              </AdminAlert>
            ) : null}

            {loading ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-[104px] animate-pulse rounded-[18px] border border-slate-200/80 bg-white" />
                ))}
              </div>
            ) : null}

            {!loading ? children : null}

            {!canViewAdmin(role, activeTab) ? (
              <div className="rounded-[18px] border border-slate-200 bg-white p-6 shadow-sm">
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

      {paletteOpen ? (
        <div className="animate-in fade-in fixed inset-0 z-[90] flex items-start justify-center bg-slate-900/50 px-4 pt-[12vh] backdrop-blur-sm duration-150" onClick={() => setPaletteOpen(false)}>
          <div
            className="animate-in fade-in zoom-in-95 slide-in-from-top-2 w-full max-w-lg overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-2xl duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 border-b border-slate-100 px-4 py-3.5">
              <Search size={16} className="shrink-0 text-slate-400" />
              <input
                ref={paletteRef}
                value={paletteQuery}
                onChange={(e) => setPaletteQuery(e.target.value)}
                autoFocus
                placeholder="Jump to a section…"
                className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
              <AdminKbd>Esc</AdminKbd>
            </div>
            <div className="max-h-[50vh] overflow-y-auto p-1.5">
              {paletteQuery.trim() === '' ? (
                <div className="px-3 py-8 text-center text-sm text-slate-400">Start typing to search all sections</div>
              ) : paletteResults.length ? (
                paletteResults.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => navigate(item.key)}
                      className="flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-left transition hover:bg-slate-50"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-orange-50 text-[#E87F24]">
                        <Icon size={15} />
                      </div>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-slate-900">{item.label}</span>
                        {item.description ? <span className="block truncate text-xs text-slate-500">{item.description}</span> : null}
                      </span>
                    </button>
                  )
                })
              ) : (
                <div className="px-3 py-8 text-center text-sm text-slate-400">No matching sections</div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}
