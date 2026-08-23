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
  Package,
  TrendingUp,
} from 'lucide-react'
import type { AdminViewKey } from '@/lib/admin/nav'
import { AdminBadge, AdminButton, AdminCard, AdminEmptyState, AdminPageHeader, AdminStat } from '@/components/admin/ui'
import { cn } from '@/lib/cn'

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

  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Workspace"
        title="Dashboard overview"
        description={roleCopy}
        actions={
          <div className="flex flex-wrap gap-2">
            <AdminBadge tone={connected ? 'success' : 'warning'}>{connected ? 'Connected' : 'Offline mode'}</AdminBadge>
            <AdminBadge tone="neutral">{role.replaceAll('_', ' ')}</AdminBadge>
          </div>
        }
      />

      {loadIssues.length ? (
        <AdminCard className="border-amber-200 bg-[#FFC81E]/5">
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
        <AdminStat label="Live content" value={`${completionPercent}%`} hint={`${liveItems} published items`} onClick={() => onNavigate('projects')} />
        <AdminStat label="Unread leads" value={unreadTotal} hint={`${leadTotal} total records`} onClick={() => onNavigate('enquiries')} />
        <AdminStat label="Media assets" value={counts.media} hint={missingAltCount ? `${missingAltCount} missing alt` : 'Alt text healthy'} onClick={() => onNavigate('media')} />
        <AdminStat label="Newsletter" value={counts.newsletter} hint="Subscribers" onClick={() => onNavigate('newsletter')} />
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
                'rounded-2xl border p-5 text-left transition',
                card.accent
                  ? 'border-orange-200 bg-[#E87F24] text-white hover:bg-[#d6711c]'
                  : 'border-slate-200 bg-white text-slate-900 hover:border-orange-200',
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-3xl font-bold tracking-[-0.05em]">{card.value}</div>
                <Icon size={18} className={card.accent ? 'text-white' : 'text-[#E87F24]'} />
              </div>
              <div className="mt-3 text-sm font-semibold">{card.label}</div>
              <p className={cn('mt-1 text-sm', card.accent ? 'text-white/90' : 'text-slate-500')}>{card.copy}</p>
            </button>
          )
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <AdminCard>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Content health</div>
              <h3 className="mt-1 text-lg font-bold text-slate-900">Published vs drafts</h3>
            </div>
            <TrendingUp size={18} className="text-[#E87F24]" />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {contentHealth.map((item) => {
              const Icon = item.icon
              const pct = item.total ? Math.round((item.value / item.total) * 100) : 0
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => onNavigate(item.view)}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-sky-200"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-900">{item.label}</span>
                    <Icon size={15} className="text-[#E87F24]" />
                  </div>
                  <div className="mt-3 text-2xl font-bold text-slate-900">
                    {item.value}
                    <span className="text-sm font-medium text-slate-400"> / {item.total}</span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-[#E87F24]" style={{ width: `${pct}%` }} />
                  </div>
                </button>
              )
            })}
          </div>

          {(!counts.projects || !counts.services) ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {!counts.projects ? (
                <AdminButton onClick={() => onImportDefaults('projects')}>Import default projects</AdminButton>
              ) : null}
              {!counts.services ? (
                <AdminButton onClick={() => onImportDefaults('services')}>Import default services</AdminButton>
              ) : null}
            </div>
          ) : null}
        </AdminCard>

        <AdminCard>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Quick actions</div>
              <h3 className="mt-1 text-lg font-bold text-slate-900">Get things done</h3>
            </div>
            <Activity size={18} className="text-[#E87F24]" />
          </div>
          <div className="mt-4 space-y-2">
            {[
              { label: 'Edit homepage', view: 'page-home' as AdminViewKey },
              { label: 'Upload media', view: 'media' as AdminViewKey },
              { label: 'Review contact messages', view: 'messages' as AdminViewKey },
              { label: 'Manage packages', view: 'packages' as AdminViewKey },
            ].map((action) => (
              <button
                key={action.view}
                type="button"
                onClick={() => onNavigate(action.view)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-500 transition hover:border-sky-200 hover:text-slate-900"
              >
                {action.label}
                <ArrowRight size={14} className="text-[#E87F24]" />
              </button>
            ))}
          </div>
        </AdminCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <AdminCard>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-slate-900">Recent leads</h3>
            <AdminButton className="!py-2 text-xs" onClick={() => onNavigate('enquiries')}>
              View all
            </AdminButton>
          </div>
          <div className="mt-4 space-y-2">
            {[
              ...recentEnquiries.map((row) => ({ id: row.id, title: row.name, meta: row.service, status: row.status, kind: 'Enquiry' })),
              ...recentMessages.map((row) => ({ id: row.id, title: row.name, meta: row.email, status: row.status, kind: 'Message' })),
              ...recentQuotes.map((row) => ({ id: row.id, title: row.name, meta: row.plan_name, status: row.status, kind: 'Quote' })),
            ]
              .slice(0, 6)
              .map((row) => (
                <div key={`${row.kind}-${row.id}`} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-900">{row.title}</div>
                      <div className="mt-1 truncate text-xs text-slate-500">
                        {row.kind} · {row.meta}
                      </div>
                    </div>
                    <AdminBadge tone={(row.status || 'new') === 'new' ? 'warning' : 'neutral'}>{formatStatusLabel(row.status)}</AdminBadge>
                  </div>
                </div>
              ))}
            {!recentEnquiries.length && !recentMessages.length && !recentQuotes.length ? (
              <AdminEmptyState title="No recent leads" description="New form submissions will appear here." />
            ) : null}
          </div>
        </AdminCard>

        <AdminCard>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-slate-900">Latest project</h3>
            <AdminButton className="!py-2 text-xs" onClick={() => onNavigate('projects')}>
              Library
            </AdminButton>
          </div>
          {latestProject ? (
            <button
              type="button"
              onClick={() => onEditProject(latestProject)}
              className="mt-4 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 text-left transition hover:border-sky-200"
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
