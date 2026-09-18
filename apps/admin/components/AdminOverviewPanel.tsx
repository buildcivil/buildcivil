'use client'

import {
  Activity,
  ArrowRight,
  Database,
  FileText,
  FolderKanban,
  Handshake,
  ImageIcon,
  Layers3,
  Mail,
  Package,
  TrendingUp,
} from 'lucide-react'
import type { AdminViewKey } from '@/lib/admin/nav'
import { AdminAvatar, AdminBadge, AdminButton, AdminCard, AdminEmptyState, AdminPageHeader, AdminRing, AdminStat } from '@/components/admin/ui'
import { cn } from '@buildcivil/cms/cn'

type Counts = {
  projects: number
  services: number
  packages: number
  pages: number
  messages: number
  enquiries: number
  unread: number
  unreadEnquiries: number
  unreadQuotes: number
  publishedProjects: number
  publishedServices: number
  publishedPages: number
  packageQuotes: number
  newsletter: number
  media: number
}

type ProjectRow = {
  id: string
  title: string
  image?: string
  description?: string
}

type AdminOverviewPanelProps = {
  connected: boolean
  counts: Counts
  role: string
  loadIssues: string[]
  projects: ProjectRow[]
  services: unknown[]
  packages: { published?: boolean | null }[]
  pages: unknown[]
  messages: { id: string; name: string; email: string; details?: string | null; status?: string | null }[]
  enquiries: { id: string; name: string; email: string; service: string; status?: string | null }[]
  packageQuotes: { id: string; name: string; plan_name: string; phone: string; status?: string | null }[]
  newsletter: unknown[]
  media: { alt_text?: string | null }[]
  onNavigate: (view: AdminViewKey) => void
  onEditProject: (project: ProjectRow) => void
  onImportDefaults: (target: 'projects' | 'services') => void
}

function formatStatusLabel(status?: string | null) {
  return (status || 'new').replaceAll('_', ' ')
}

export default function AdminOverviewPanel({
  connected,
  counts,
  role,
  loadIssues,
  projects,
  services,
  packages,
  pages,
  messages,
  enquiries,
  packageQuotes,
  newsletter,
  media,
  onNavigate,
  onEditProject,
  onImportDefaults,
}: AdminOverviewPanelProps) {
  const latestProject = projects[0]
  const leadTotal = counts.messages + counts.enquiries + counts.packageQuotes + counts.newsletter
  const unreadTotal = counts.unread + counts.unreadEnquiries + counts.unreadQuotes
  const liveItems = counts.publishedProjects + counts.publishedServices + counts.publishedPages
  const completionTotal = counts.projects + counts.services + counts.pages
  const completionPercent = completionTotal ? Math.round((liveItems / completionTotal) * 100) : 0
  const missingAltCount = media.filter((asset) => !asset.alt_text?.trim()).length
  const recentMessages = messages.slice(0, 3)
  const recentEnquiries = enquiries.slice(0, 3)
  const recentQuotes = packageQuotes.slice(0, 3)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const roleCopy =
    role === 'leads_manager'
      ? 'Your role focuses on contact messages, service enquiries, plan quotes, and newsletter subscribers.'
      : role === 'content_manager' || role === 'project_manager'
        ? 'Your role focuses on website content. Private lead inboxes may be hidden by permission.'
        : 'Jump into the areas that need attention, then publish when you are ready.'

  const shortcuts = [
    { label: 'Open leads', value: unreadTotal, copy: `${leadTotal} total lead records`, icon: Handshake, view: 'enquiries' as AdminViewKey, accent: true },
    { label: 'Content library', value: counts.projects + counts.services + counts.packages, copy: 'Projects, services, packages', icon: FolderKanban, view: 'projects' as AdminViewKey },
    { label: 'Media cleanup', value: missingAltCount, copy: 'Images missing alt text', icon: ImageIcon, view: 'media' as AdminViewKey },
  ]

  const contentHealth = [
    { label: 'Projects', value: counts.publishedProjects, total: counts.projects, icon: FolderKanban, view: 'projects' as AdminViewKey },
    { label: 'Services', value: counts.publishedServices, total: counts.services, icon: Layers3, view: 'services' as AdminViewKey },
    { label: 'Packages', value: packages.filter((pkg) => pkg.published).length, total: counts.packages, icon: Package, view: 'packages' as AdminViewKey },
    { label: 'Pages', value: counts.publishedPages, total: counts.pages, icon: FileText, view: 'pages' as AdminViewKey },
  ]

  const quickActions = [
    { label: 'Edit homepage', view: 'page-home' as AdminViewKey, icon: FileText },
    { label: 'Upload media', view: 'media' as AdminViewKey, icon: ImageIcon },
    { label: 'Review contact messages', view: 'messages' as AdminViewKey, icon: Mail },
    { label: 'Manage packages', view: 'packages' as AdminViewKey, icon: Package },
  ]

  const timeline = [
    ...recentEnquiries.map((row) => ({ id: row.id, title: row.name, meta: row.service, status: row.status, kind: 'Enquiry' })),
    ...recentMessages.map((row) => ({ id: row.id, title: row.name, meta: row.email, status: row.status, kind: 'Message' })),
    ...recentQuotes.map((row) => ({ id: row.id, title: row.name, meta: row.plan_name, status: row.status, kind: 'Quote' })),
  ].slice(0, 6)

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-[22px] border border-slate-200/70 bg-gradient-to-br from-[#1c2230] via-[#232a3a] to-[#2c2418] p-6 text-white shadow-[0_20px_50px_-20px_rgba(15,23,42,0.45)] sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#E87F24]/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-[#73A5CA]/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <AdminBadge tone={connected ? 'success' : 'warning'} dot>
              {connected ? 'All systems connected' : 'Offline mode'}
            </AdminBadge>
            <h1 className="mt-3 text-2xl font-extrabold tracking-[-0.04em] sm:text-3xl">
              {greeting}, welcome back
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">{roleCopy}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <div className="rounded-[16px] border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur">
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">Live content</div>
              <div className="mt-1 text-2xl font-extrabold tracking-[-0.03em]">{completionPercent}%</div>
            </div>
            <div className="rounded-[16px] border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur">
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">Unread leads</div>
              <div className="mt-1 text-2xl font-extrabold tracking-[-0.03em] text-[#F0954A]">{unreadTotal}</div>
            </div>
          </div>
        </div>
      </div>

      {loadIssues.length ? (
        <AdminCard className="border-amber-200 bg-amber-50/60">
          <div className="flex items-start gap-3">
            <Database size={18} className="mt-0.5 text-amber-600" />
            <div>
              <h3 className="font-semibold text-amber-800">Some data sources need attention</h3>
              <ul className="mt-2 space-y-1 text-sm text-amber-800/80">
                {loadIssues.map((issue) => (
                  <li key={issue}>• {issue}</li>
                ))}
              </ul>
            </div>
          </div>
        </AdminCard>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStat label="Live content" value={`${completionPercent}%`} hint={`${liveItems} published items`} icon={<TrendingUp size={14} />} onClick={() => onNavigate('projects')} />
        <AdminStat label="Unread leads" value={unreadTotal} hint={`${leadTotal} total records`} icon={<Handshake size={14} />} onClick={() => onNavigate('enquiries')} />
        <AdminStat label="Media assets" value={counts.media} hint={missingAltCount ? `${missingAltCount} missing alt` : 'Alt text healthy'} icon={<ImageIcon size={14} />} onClick={() => onNavigate('media')} />
        <AdminStat label="Newsletter" value={counts.newsletter} hint="Subscribers" icon={<Mail size={14} />} onClick={() => onNavigate('newsletter')} />
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {shortcuts.map((card) => {
          const Icon = card.icon
          return (
            <button
              key={card.label}
              type="button"
              onClick={() => onNavigate(card.view)}
              className={cn(
                'group rounded-[18px] border p-5 text-left transition-all duration-200 hover:-translate-y-0.5',
                card.accent
                  ? 'border-transparent bg-gradient-to-br from-[#F0954A] to-[#D6671A] text-white shadow-[0_10px_28px_-10px_rgba(224,113,28,0.55)] hover:shadow-[0_16px_36px_-10px_rgba(224,113,28,0.6)]'
                  : 'border-slate-200/80 bg-white text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_20px_-8px_rgba(15,23,42,0.08)] hover:border-orange-200',
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-3xl font-extrabold tracking-[-0.05em]">{card.value}</div>
                <div className={cn('flex h-9 w-9 items-center justify-center rounded-[10px]', card.accent ? 'bg-white/20' : 'bg-orange-50 text-[#E87F24]')}>
                  <Icon size={17} className={card.accent ? 'text-white' : ''} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-sm font-bold">
                {card.label}
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className={cn('mt-1 text-sm', card.accent ? 'text-white/85' : 'text-slate-500')}>{card.copy}</p>
            </button>
          )
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <AdminCard>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Content health</div>
              <h3 className="mt-1 text-lg font-extrabold tracking-[-0.02em] text-slate-900">Published vs drafts</h3>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-orange-50 text-[#E87F24]">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {contentHealth.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => onNavigate(item.view)}
                  className="flex items-center gap-4 rounded-[16px] border border-slate-200/80 bg-slate-50/70 p-4 text-left transition hover:border-orange-200 hover:bg-white"
                >
                  <AdminRing value={item.value} total={item.total} size={56} stroke={5} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                      <Icon size={14} className="text-[#E87F24]" />
                      {item.label}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">{item.value}</span> / {item.total} published
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {(!counts.projects || !counts.services) ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {!counts.projects ? (
                <AdminButton size="sm" onClick={() => onImportDefaults('projects')}>Import default projects</AdminButton>
              ) : null}
              {!counts.services ? (
                <AdminButton size="sm" onClick={() => onImportDefaults('services')}>Import default services</AdminButton>
              ) : null}
            </div>
          ) : null}
        </AdminCard>

        <AdminCard>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Quick actions</div>
              <h3 className="mt-1 text-lg font-extrabold tracking-[-0.02em] text-slate-900">Get things done</h3>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-orange-50 text-[#E87F24]">
              <Activity size={16} />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.view}
                  type="button"
                  onClick={() => onNavigate(action.view)}
                  className="group flex w-full items-center gap-3 rounded-[14px] border border-slate-200/80 bg-slate-50/70 px-4 py-3 text-left text-sm font-semibold text-slate-600 transition hover:border-orange-200 hover:bg-white hover:text-slate-900"
                >
                  <Icon size={15} className="shrink-0 text-slate-400 transition-colors group-hover:text-[#E87F24]" />
                  <span className="flex-1">{action.label}</span>
                  <ArrowRight size={14} className="shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-[#E87F24]" />
                </button>
              )
            })}
          </div>
        </AdminCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <AdminCard>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-extrabold tracking-[-0.02em] text-slate-900">Recent leads</h3>
            <AdminButton size="sm" onClick={() => onNavigate('enquiries')}>
              View all
            </AdminButton>
          </div>
          <div className="mt-4 space-y-2">
            {timeline.map((row) => (
              <div key={`${row.kind}-${row.id}`} className="flex items-center gap-3 rounded-[14px] border border-slate-200/80 bg-slate-50/70 px-4 py-3">
                <AdminAvatar name={row.title} size={34} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-slate-900">{row.title}</div>
                  <div className="mt-0.5 truncate text-xs text-slate-500">
                    {row.kind} · {row.meta}
                  </div>
                </div>
                <AdminBadge tone={(row.status || 'new') === 'new' ? 'warning' : 'neutral'}>{formatStatusLabel(row.status)}</AdminBadge>
              </div>
            ))}
            {!timeline.length ? (
              <AdminEmptyState title="No recent leads" description="New form submissions will appear here." />
            ) : null}
          </div>
        </AdminCard>

        <AdminCard>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-extrabold tracking-[-0.02em] text-slate-900">Latest project</h3>
            <AdminButton size="sm" onClick={() => onNavigate('projects')}>
              Library
            </AdminButton>
          </div>
          {latestProject ? (
            <button
              type="button"
              onClick={() => onEditProject(latestProject)}
              className="mt-4 w-full overflow-hidden rounded-[16px] border border-slate-200/80 bg-slate-50/70 text-left transition hover:border-orange-200"
            >
              <div
                className="aspect-[16/9] bg-cover bg-center"
                style={{ backgroundImage: latestProject.image ? `url('${latestProject.image}')` : undefined }}
              />
              <div className="p-4">
                <div className="text-base font-bold text-slate-900">{latestProject.title}</div>
                <p className="mt-2 line-clamp-2 text-sm text-slate-500">{latestProject.description || 'Open this project to edit details.'}</p>
              </div>
            </button>
          ) : (
            <div className="mt-4">
              <AdminEmptyState
                title="No projects yet"
                description="Import defaults or create your first project."
                action={<AdminButton variant="primary" onClick={() => onImportDefaults('projects')}>Import projects</AdminButton>}
              />
            </div>
          )}
          <p className="mt-3 text-xs text-slate-400">
            {services.length} services · {newsletter.length} newsletter subscribers · {pages.length} pages tracked
          </p>
        </AdminCard>
      </div>
    </div>
  )
}
