import { isSupabaseConfigured, supabaseRequest } from './supabase-admin'

export type ServiceItem = {
  slug: string
  iconName: 'home' | 'palette' | 'refresh' | 'ruler' | 'briefcase'
  title: string
  description: string
  kicker: string
  image: string
  accent: string
  bullets: string[]
  details: string[]
  heroTitle: string
  heroCopy: string
  seoTitle?: string
  seoDescription?: string
  seoImage?: string
  intro: string
  gallery: [string, string]
  stats: { value: string; label: string }[]
  process: { step: string; title: string; copy: string }[]
}

export const serviceCatalog: ServiceItem[] = [
  {
    slug: 'turnkey-construction',
    title: 'Turnkey Construction',
    description:
      'Complete end-to-end construction solutions from foundation to finishing, coordinated by one capable team.',
    kicker: 'Full build delivery',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600&auto=format&fit=crop',
    accent: 'from-[#E87F24]/30 via-[#FFC81E]/14 to-transparent',
    bullets: ['Scope and scheduling', 'Site execution', 'Final handover'],
    details: [
      'One-point accountability from start to finish',
      'Built around clarity, quality, and steady site coordination',
      'Ideal for homeowners and developers who want less friction',
    ],
    heroTitle: 'A complete build process that stays calm from the first briefing to handover.',
    heroCopy:
      'Turnkey construction brings design, planning, execution, and close-out into one organized delivery path. That means fewer handoffs, clearer milestones, and a steadier site rhythm.',
    intro:
      'We handle the project as one coordinated system. That includes early scope alignment, structural work, finishes, coordination across vendors, and the final completion checks that make the handover feel effortless.',
    gallery: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1400&auto=format&fit=crop',
    ],
    stats: [
      { value: '01', label: 'single team across planning and build' },
      { value: '12+', label: 'years of coordination experience' },
      { value: '100%', label: 'accountability through handover' },
    ],
    process: [
      { step: '01', title: 'Brief', copy: 'We define scope, budget, and site conditions early.' },
      { step: '02', title: 'Plan', copy: 'Schedules, approvals, and sequencing are prepared.' },
      { step: '03', title: 'Build', copy: 'Site execution moves through a steady, documented cadence.' },
    ],
    iconName: 'home',
  },
  {
    slug: 'interior-exterior-design',
    title: 'Interior & Exterior Design',
    description:
      'Professional design services for both interior and exterior spaces, balanced for comfort, function, and style.',
    kicker: 'Design language',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop',
    accent: 'from-[#73A5CA]/28 via-[#E87F24]/12 to-transparent',
    bullets: ['Space planning', 'Material direction', 'Finish selection'],
    details: [
      'Cohesive interior and exterior treatment',
      'Practical choices that still feel premium',
      'Balanced light, texture, and spatial flow',
    ],
    heroTitle: 'A design-led service that connects indoor comfort with a strong outer presence.',
    heroCopy:
      'This service shapes how a home or commercial space feels in use, how it meets the street, and how the materials work together over time.',
    intro:
      'We translate the brief into layouts, material palettes, facade ideas, and finish direction. The aim is to create a complete visual language that feels clear, warm, and practical.',
    gallery: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop',
    ],
    stats: [
      { value: '02', label: 'interior and exterior tracks' },
      { value: '08+', label: 'design stages handled' },
      { value: '100%', label: 'finish alignment and clarity' },
    ],
    process: [
      { step: '01', title: 'Mood', copy: 'We define the visual direction and spatial intent.' },
      { step: '02', title: 'Palette', copy: 'Materials, finishes, and fixtures are coordinated.' },
      { step: '03', title: 'Refine', copy: 'We review details until the design feels build-ready.' },
    ],
    iconName: 'palette',
  },
  {
    slug: 'renovation-remodeling',
    title: 'Renovation & Remodeling',
    description:
      'Transform existing spaces with modern renovation solutions that improve layout, utility, and long-term value.',
    kicker: 'Fresh direction',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop',
    accent: 'from-[#FFC81E]/24 via-[#73A5CA]/10 to-transparent',
    bullets: ['Selective upgrades', 'Smarter layouts', 'Reduced disruption'],
    details: [
      'Refreshes spaces without losing structural intent',
      'Useful for homes that need a new rhythm',
      'Helps the project feel new without starting from zero',
    ],
    heroTitle: 'Selective upgrades that bring older spaces back into a cleaner, more usable rhythm.',
    heroCopy:
      'Renovation work is about knowing what to keep, what to improve, and what to rebuild so the result feels intentional rather than patched together.',
    intro:
      'We study the existing structure, then plan the sequence of upgrades so the work stays efficient and the final result feels transformed, not merely repaired.',
    gallery: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop',
    ],
    stats: [
      { value: '03', label: 'upgrade layers considered' },
      { value: '24', label: 'hours of careful planning per project' },
      { value: '90%', label: 'of effort focused on value retention' },
    ],
    process: [
      { step: '01', title: 'Audit', copy: 'We inspect the existing structure and finishes.' },
      { step: '02', title: 'Sequence', copy: 'Selective improvements are planned around disruption.' },
      { step: '03', title: 'Refresh', copy: 'We rebuild the experience with a calmer finish.' },
    ],
    iconName: 'refresh',
  },
  {
    slug: 'architectural-planning',
    title: 'Architectural Planning',
    description:
      'Expert architectural planning and structural design services that shape a clear, buildable project vision.',
    kicker: 'Build-ready clarity',
    image: 'https://images.unsplash.com/photo-1531834685032-c34bf0d84e48?q=80&w=1600&auto=format&fit=crop',
    accent: 'from-[#73A5CA]/26 via-[#FFC81E]/10 to-transparent',
    bullets: ['Concept diagrams', 'Technical drawings', 'Approval-ready flow'],
    details: [
      'Gives every project a stronger early foundation',
      'Connects ambition with real-world build logic',
      'Helps reduce confusion before site work begins',
    ],
    heroTitle: 'Planning that turns a rough idea into a project the site team can actually build from.',
    heroCopy:
      'Good planning reduces friction later. We shape layout, structure, and approval logic into a coherent direction before the project moves on-site.',
    intro:
      'This track focuses on clarity at the start: drawings, coordination, and logic that make the build easier to understand for everyone involved.',
    gallery: [
      'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1400&auto=format&fit=crop',
    ],
    stats: [
      { value: '04', label: 'planning layers' },
      { value: '100%', label: 'buildability focus' },
      { value: '12+', label: 'years of coordination' },
    ],
    process: [
      { step: '01', title: 'Study', copy: 'We review the site, brief, and constraints.' },
      { step: '02', title: 'Draw', copy: 'Plans and structural logic are organized clearly.' },
      { step: '03', title: 'Align', copy: 'We refine the direction until the project is build-ready.' },
    ],
    iconName: 'ruler',
  },
  {
    slug: 'project-management',
    title: 'Project Management',
    description:
      'Professional project management and coordination services that keep your build organized, aligned, and on schedule.',
    kicker: 'Control and cadence',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1600&auto=format&fit=crop',
    accent: 'from-[#E87F24]/24 via-[#73A5CA]/10 to-transparent',
    bullets: ['Scheduling', 'Procurement oversight', 'Progress reporting'],
    details: [
      'Keeps work moving with fewer surprises',
      'Supports the client with steady communication',
      'Useful for projects that need disciplined coordination',
    ],
    heroTitle: 'A coordination layer that keeps the entire build moving with calm, visible control.',
    heroCopy:
      'Project management holds together the many moving parts of a construction job and keeps the team, timeline, and quality expectations aligned.',
    intro:
      'We coordinate site progress, reporting, vendor communication, and delivery milestones so the client has a steadier view of what is happening and what comes next.',
    gallery: [
      'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1400&auto=format&fit=crop',
    ],
    stats: [
      { value: '05', label: 'coordination streams' },
      { value: '100%', label: 'visibility and reporting' },
      { value: '24/7', label: 'support when the build needs it' },
    ],
    process: [
      { step: '01', title: 'Plan', copy: 'We map the sequence and delivery milestones.' },
      { step: '02', title: 'Track', copy: 'Progress and dependencies stay visible.' },
      { step: '03', title: 'Deliver', copy: 'The project moves forward with fewer gaps.' },
    ],
    iconName: 'briefcase',
  },
]

export function getServiceBySlug(slug: string) {
  return serviceCatalog.find((service) => service.slug === slug)
}

type ServiceRow = ServiceItem & {
  summary?: string
  card_label?: string
  published?: boolean
  sort_order?: number
  overview?: string
  hero_title?: string
  hero_copy?: string
  seo_title?: string
  seo_description?: string
  seo_image?: string
}

function normalizeService(row: Partial<ServiceRow>): ServiceItem {
  return {
    slug: row.slug ?? '',
    iconName: row.iconName ?? 'home',
    title: row.title ?? '',
    description: row.description ?? row.summary ?? '',
    kicker: row.kicker ?? '',
    image: row.image ?? '',
    accent: row.accent ?? 'from-[#E87F24]/30 via-[#FFC81E]/14 to-transparent',
    bullets: Array.isArray(row.bullets) ? row.bullets.filter((item): item is string => typeof item === 'string') : [],
    details: Array.isArray(row.details) ? row.details.filter((item): item is string => typeof item === 'string') : [],
    heroTitle: row.heroTitle ?? row.hero_title ?? '',
    heroCopy: row.heroCopy ?? row.hero_copy ?? '',
    seoTitle: row.seoTitle ?? row.seo_title ?? '',
    seoDescription: row.seoDescription ?? row.seo_description ?? '',
    seoImage: row.seoImage ?? row.seo_image ?? '',
    intro: row.intro ?? '',
    gallery: Array.isArray(row.gallery)
      ? [String(row.gallery[0] ?? ''), String(row.gallery[1] ?? '')]
      : ['', ''],
    stats: Array.isArray(row.stats)
      ? row.stats
          .map((stat) => (stat && typeof stat === 'object' ? stat : null))
          .filter((item): item is { value: string; label: string } => Boolean(item?.value && item?.label))
      : [],
    process: Array.isArray(row.process)
      ? row.process
          .map((step) => (step && typeof step === 'object' ? step : null))
          .filter((item): item is { step: string; title: string; copy: string } => Boolean(item?.step && item?.title && item?.copy))
      : [],
  }
}

export async function getServiceCatalogFromCMS(): Promise<ServiceItem[]> {
  if (!isSupabaseConfigured()) return serviceCatalog

  try {
    const rows = await supabaseRequest<Partial<ServiceRow>[]>(
      '/rest/v1/services?select=*&published=eq.true&order=sort_order.asc',
      { method: 'GET' },
    )
    if (!rows.length) return serviceCatalog
    return rows.map((row) => normalizeService(row))
  } catch {
    return serviceCatalog
  }
}

export async function getServiceBySlugFromCMS(slug: string): Promise<ServiceItem | undefined> {
  const services = await getServiceCatalogFromCMS()
  return services.find((service) => service.slug === slug)
}
