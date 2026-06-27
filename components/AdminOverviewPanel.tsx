'use client'

import Link from 'next/link'
import {
  Activity,
  ArrowRight,
  Database,
  FileText,
  FolderKanban,
  Handshake,
  Home,
  ImageIcon,
  Layers3,
  Package,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'

type ViewKey =
  | 'overview'
  | 'page-home'
  | 'projects'
  | 'services'
  | 'packages'
  | 'pages'
  | 'messages'
  | 'enquiries'
  | 'media'

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
  onNavigate: (view: ViewKey) => void
  onEditProject: (project: ProjectRow) => void
  onImportDefaults: (target: 'projects' | 'services') => void
}

function AdminPreviewImage({ src, alt }: { src?: string | null; alt: string }) {
  if (!src?.trim()) {
    return <div className="flex h-full w-full items-center justify-center text-sm text-white/45">Image preview</div>
  }

  return <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
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
  const roleCopy = role === 'leads_manager'
    ? 'Your role is focused on contact messages, service enquiries, plan quotes, and newsletter subscribers.'
    : role === 'content_manager' || role === 'project_manager'
      ? 'Your role is focused on website content. Private lead inboxes may be hidden by permission.'
      : ''

  const commandCards = [
    { label: 'Open leads', value: unreadTotal, copy: `${leadTotal} total lead records`, icon: Handshake, view: 'enquiries' as ViewKey, accent: true },
    { label: 'Content library', value: counts.projects + counts.services + counts.packages, copy: 'Manage projects, services, and packages', icon: FolderKanban, view: 'projects' as ViewKey },
    { label: 'Media cleanup', value: missingAltCount, copy: 'Images missing alt text', icon: ImageIcon, view: 'media' as ViewKey },
  ]

  const contentHealth = [
    { label: 'Projects', value: counts.publishedProjects, total: counts.projects, icon: FolderKanban, view: 'projects' as ViewKey },
    { label: 'Services', value: counts.publishedServices, total: counts.services, icon: Layers3, view: 'services' as ViewKey },
    { label: 'Packages', value: packages.filter((pkg) => pkg.published).length, total: counts.packages, icon: Package, view: 'packages' as ViewKey },
    { label: 'Pages', value: counts.publishedPages, total: counts.pages, icon: FileText, view: 'pages' as ViewKey },
  ]

  return (
    <div className="mt-5 space-y-5 sm:mt-6 sm:space-y-6">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <section className="overflow-hidden rounded-[24px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:rounded-[30px] sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#D8FF6A]/20 bg-[#D8FF6A]/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-[#D8FF6A] sm:text-[11px] sm:tracking-[0.28em]">
                <Activity size={12} />
                Overview
              </div>
              <h2 className="mt-4 max-w-4xl text-4xl font-black leading-none text-white sm:text-5xl lg:text-6xl">
                BuildCivil admin workspace
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">
                Review site health, track inquiries, and jump into the content areas that need attention.
              </p>
            </div>

            <div className={`w-full rounded-[22px] border p-4 lg:max-w-[260px] ${connected ? 'border-[#D8FF6A]/40 bg-[#D8FF6A] text-[#111]' : 'border-white/10 bg-white/5 text-white'}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="text-[10px] uppercase tracking-[0.24em] opacity-70">Database</div>
                <Database size={16} />
              </div>
              <div className="mt-3 text-2xl font-black">{connected ? 'Live' : 'Offline'}</div>
              <p className={`mt-2 text-sm leading-6 ${connected ? 'text-[#111]/70' : 'text-white/55'}`}>
                {connected ? 'Supabase is connected and ready for edits.' : 'Fallback or partial data is being shown.'}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {commandCards.map((card) => {
              const Icon = card.icon
              return (
                <button
                  key={card.label}
                  type="button"
                  onClick={() => onNavigate(card.view)}
                  className={`rounded-[22px] border p-4 text-left transition hover:-translate-y-0.5 ${
                    card.accent ? 'border-[#D8FF6A]/35 bg-[#D8FF6A] text-[#111]' : 'border-white/8 bg-white/5 text-white hover:border-[#D8FF6A]/25'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[10px] uppercase tracking-[0.2em] opacity-60">{card.label}</div>
                    <Icon size={16} />
                  </div>
                  <div className="mt-4 text-4xl font-black leading-none">{String(card.value).padStart(2, '0')}</div>
                  <p className={`mt-2 text-sm leading-5 ${card.accent ? 'text-[#111]/65' : 'text-white/48'}`}>{card.copy}</p>
                </button>
              )
            })}
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-[22px] border border-white/8 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-white/36">Data status</div>
                  <div className="mt-2 text-base font-semibold text-white">{connected ? 'Supabase connected' : 'Fallback or partial data'}</div>
                </div>
                <Database size={17} className={connected ? 'text-[#D8FF6A]' : 'text-[#E87F24]'} />
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {[
                  ['Projects', counts.projects],
                  ['Services', counts.services],
                  ['Packages', counts.packages],
                  ['Messages', counts.messages],
                  ['Enquiries', counts.enquiries],
                  ['Quotes', counts.packageQuotes],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[16px] border border-white/8 bg-[#0f0f0f] px-3 py-2">
                    <div className="text-lg font-black text-[#D8FF6A]">{value}</div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-white/36">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[22px] border border-white/8 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-white/36">Access & diagnostics</div>
                  <div className="mt-2 text-base font-semibold capitalize text-white">{role.replaceAll('_', ' ')}</div>
                </div>
                <ShieldCheck size={17} className="text-[#D8FF6A]" />
              </div>
              {roleCopy ? <p className="mt-3 text-sm leading-6 text-white/52">{roleCopy}</p> : null}
              {loadIssues.length ? (
                <div className="mt-3 rounded-[16px] border border-[#E87F24]/25 bg-[#E87F24]/10 p-3">
                  <div className="text-xs font-semibold text-[#FFBC8C]">Some tables could not load:</div>
                  <div className="mt-2 space-y-1 text-xs leading-5 text-white/58">
                    {loadIssues.map((issue) => <div key={issue}>{issue}</div>)}
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm leading-6 text-white/52">All permitted dashboard tables loaded successfully.</p>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:rounded-[30px] sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.24em] text-white/40">Publishing health</div>
              <h3 className="mt-2 text-2xl font-black text-white">Content readiness</h3>
            </div>
            <div className="rounded-full bg-[#D8FF6A] px-3 py-1 text-sm font-black text-[#111]">{completionPercent}%</div>
          </div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/8">
            <div className="h-full rounded-full bg-gradient-to-r from-[#D8FF6A] to-[#E87F24]" style={{ width: `${completionPercent}%` }} />
          </div>
          <div className="mt-5 space-y-3">
            {contentHealth.map((item) => {
              const Icon = item.icon
              return (
                <button key={item.label} type="button" onClick={() => onNavigate(item.view)} className="flex w-full items-center justify-between gap-4 rounded-[18px] border border-white/8 bg-white/5 p-3 text-left transition hover:border-[#D8FF6A]/30 hover:bg-white/8">
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-white/8 text-[#D8FF6A]">
                      <Icon size={16} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-white">{item.label}</span>
                      <span className="block text-xs text-white/42">{item.value} of {item.total} live</span>
                    </span>
                  </span>
                  <ArrowRight size={15} className="shrink-0 text-white/42" />
                </button>
              )
            })}
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="rounded-[24px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:rounded-[30px] sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.24em] text-white/40">Quick actions</div>
              <h3 className="mt-2 text-2xl font-black text-white">Manage content</h3>
            </div>
            <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/74 transition hover:border-[#D8FF6A]/30 hover:text-white">
              View site
              <ArrowRight size={15} className="text-[#D8FF6A]" />
            </Link>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              { label: 'Home page editor', copy: 'Edit hero, process, projects, plans, FAQ, and team.', icon: Home, view: 'page-home' as ViewKey },
              { label: 'Project library', copy: 'Update portfolio cards, detail pages, SEO, and images.', icon: FolderKanban, view: 'projects' as ViewKey },
              { label: 'Service library', copy: 'Manage services, process steps, galleries, and SEO.', icon: Layers3, view: 'services' as ViewKey },
              { label: 'Package library', copy: 'Edit Basic, Classic, Royal, materials, and plan details.', icon: Package, view: 'packages' as ViewKey },
            ].map((action) => {
              const Icon = action.icon
              return (
                <button key={action.label} type="button" onClick={() => onNavigate(action.view)} className="rounded-[20px] border border-white/8 bg-white/5 p-4 text-left transition hover:-translate-y-0.5 hover:border-[#D8FF6A]/25 hover:bg-white/8">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#D8FF6A] text-[#111]">
                      <Icon size={16} />
                    </span>
                    <ArrowRight size={15} className="text-white/38" />
                  </div>
                  <div className="mt-4 text-base font-semibold text-white">{action.label}</div>
                  <p className="mt-2 text-sm leading-6 text-white/52">{action.copy}</p>
                </button>
              )
            })}
          </div>

          {(!projects.length || !services.length) ? (
            <div className="mt-4 rounded-[20px] border border-[#FFC81E]/20 bg-[#FFC81E]/10 p-4">
              <div className="text-sm font-semibold text-[#FFE9A0]">Starter content is missing</div>
              <p className="mt-2 text-sm leading-6 text-white/56">
                Supabase has an empty {projects.length ? '' : 'project'}{!projects.length && !services.length ? ' and ' : ''}{services.length ? '' : 'service'} table. Import defaults to make the library editable from the dashboard.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {!projects.length ? <button type="button" onClick={() => onImportDefaults('projects')} className="rounded-full bg-[#D8FF6A] px-4 py-2 text-xs font-black text-[#111]">Import default projects</button> : null}
                {!services.length ? <button type="button" onClick={() => onImportDefaults('services')} className="rounded-full bg-[#D8FF6A] px-4 py-2 text-xs font-black text-[#111]">Import default services</button> : null}
              </div>
            </div>
          ) : null}
        </section>

        <section className="rounded-[24px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:rounded-[30px] sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.24em] text-white/40">Inbox</div>
              <h3 className="mt-2 text-2xl font-black text-white">Recent inquiries</h3>
            </div>
            <button type="button" onClick={() => onNavigate('messages')} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D8FF6A] px-4 py-2.5 text-sm font-semibold text-[#111]">
              Open inbox
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {recentMessages.length ? recentMessages.map((message) => (
              <article key={message.id} className="rounded-[18px] border border-white/8 bg-white/5 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-semibold text-white">{message.name}</h4>
                    <p className="mt-1 truncate text-xs text-white/44">{message.email}</p>
                  </div>
                  <span className="w-fit rounded-full bg-[#D8FF6A] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#111]">
                    {formatStatusLabel(message.status)}
                  </span>
                </div>
                {message.details ? <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/55">{message.details}</p> : null}
              </article>
            )) : (
              <div className="rounded-[18px] border border-dashed border-white/10 bg-white/5 p-5 text-sm text-white/52">No contact messages yet.</div>
            )}
          </div>
        </section>
      </div>

      <section className="rounded-[24px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:rounded-[30px] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.24em] text-white/40">Recent lead activity</div>
            <h3 className="mt-2 text-2xl font-black text-white">Enquiries and plan quotes</h3>
          </div>
          <button type="button" onClick={() => onNavigate('enquiries')} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D8FF6A] px-4 py-2.5 text-sm font-semibold text-[#111]">
            Open enquiries
            <ArrowRight size={15} />
          </button>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {[...recentEnquiries.map((item) => ({ id: item.id, title: item.name, meta: item.service, status: item.status })), ...recentQuotes.map((item) => ({ id: item.id, title: item.name, meta: item.plan_name, status: item.status }))].slice(0, 6).map((item) => (
            <article key={item.id} className="rounded-[18px] border border-white/8 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <h4 className="truncate text-sm font-semibold text-white">{item.title}</h4>
                <span className="rounded-full bg-[#D8FF6A] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#111]">{formatStatusLabel(item.status)}</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-[#D8FF6A]">{item.meta}</p>
            </article>
          ))}
          {!recentEnquiries.length && !recentQuotes.length ? (
            <div className="rounded-[18px] border border-dashed border-white/10 bg-white/5 p-5 text-sm text-white/52 lg:col-span-3">No enquiry or quote activity yet.</div>
          ) : null}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {latestProject ? (
          <section className="rounded-[24px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:rounded-[30px] sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative h-40 overflow-hidden rounded-[18px] border border-white/8 sm:h-32 sm:w-44 sm:shrink-0">
                <AdminPreviewImage src={latestProject.image} alt={latestProject.title} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] uppercase tracking-[0.24em] text-white/40">Latest project</div>
                <h3 className="mt-2 text-2xl font-black text-white">{latestProject.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/54">{latestProject.description}</p>
                <button type="button" onClick={() => onEditProject(latestProject)} className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#D8FF6A] px-4 py-2.5 text-sm font-semibold text-[#111]">
                  Edit project
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </section>
        ) : null}

        <section className="rounded-[24px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:rounded-[30px] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.24em] text-white/40">Catalog snapshot</div>
              <h3 className="mt-2 text-2xl font-black text-white">Live content mix</h3>
            </div>
            <TrendingUp size={18} className="text-[#D8FF6A]" />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ['Projects', projects.length],
              ['Services', services.length],
              ['Packages', packages.length],
              ['Pages', pages.length],
              ['Media files', media.length],
              ['Newsletter', newsletter.length],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[18px] border border-white/8 bg-white/5 p-4">
                <div className="text-2xl font-black text-[#D8FF6A]">{value}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/38">{label}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
