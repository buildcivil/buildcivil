export type ProjectItem = {
  slug: string
  title: string
  category: 'Residential' | 'Commercial' | 'Interiors' | 'Renovation'
  cardLabel: string
  location: string
  image: string
  description: string
  year: string
  heightClass: string
  overview: string
  heroTitle: string
  heroCopy: string
  seoTitle?: string
  seoDescription?: string
  seoImage?: string
  highlights: string[]
  stats: { value: string; label: string }[]
  process: { step: string; title: string; copy: string }[]
  gallery: [string, string, string]
}

export const projectCatalog: ProjectItem[] = [
  {
    slug: 'courtyard-residence',
    title: 'Courtyard Residence',
    category: 'Residential',
    cardLabel: 'Residential build',
    location: 'Lucknow, Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1400&auto=format&fit=crop',
    description: 'A family residence delivered with careful site coordination, warm finishes, and clear courtyard planning.',
    year: '2026',
    heightClass: 'h-[430px] sm:h-[500px] xl:h-[620px]',
    overview:
      'A grounded residence shaped around a private courtyard, daylight access, and a practical room sequence that supports day-to-day family use.',
    heroTitle: 'A residential build guided by site rhythm, finish quality, and privacy.',
    heroCopy:
      'The project balances family comfort with a clear build sequence. Every room was coordinated to capture light, protect privacy, and keep circulation simple from the first layout study through handover.',
    highlights: ['Courtyard planning', 'Warm stone and wood tones', 'Family-focused circulation'],
    stats: [
      { value: '01', label: 'courtyard-centered planning' },
      { value: '06+', label: 'major room zones coordinated' },
      { value: '100%', label: 'focus on family comfort' },
    ],
    process: [
      { step: '01', title: 'Brief', copy: 'We mapped privacy, daylight, and circulation goals early.' },
      { step: '02', title: 'Layout', copy: 'Rooms were positioned to open toward the central courtyard.' },
      { step: '03', title: 'Detail', copy: 'Material transitions were refined for a calm, finished feel.' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop',
    ],
  },
  {
    slug: 'commercial-facade-study',
    title: 'Commercial Facade Study',
    category: 'Commercial',
    cardLabel: 'Commercial facade',
    location: 'Noida, Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400&auto=format&fit=crop',
    description: 'A commercial frontage built for visibility, proportion, and a confident street presence.',
    year: '2025',
    heightClass: 'h-[320px] sm:h-[360px] xl:h-[420px]',
    overview:
      'This project focused on visibility, proportion, and a facade rhythm that could perform well in a busy commercial environment.',
    heroTitle: 'A facade-led project shaped for presence and practical execution.',
    heroCopy:
      'The build strategy centered on a disciplined exterior envelope, efficient shell coordination, and a material language that feels modern while staying easy to maintain.',
    highlights: ['Facade logic', 'Street-facing clarity', 'Commercial performance'],
    stats: [
      { value: '02', label: 'primary frontage systems' },
      { value: '04+', label: 'visibility layers refined' },
      { value: '2025', label: 'delivery year' },
    ],
    process: [
      { step: '01', title: 'Survey', copy: 'Street context and plot geometry were studied first.' },
      { step: '02', title: 'Envelope', copy: 'Facade depth and openings were refined for balance.' },
      { step: '03', title: 'Finish', copy: 'Surface treatments were tuned to stay sharp over time.' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1400&auto=format&fit=crop',
    ],
  },
  {
    slug: 'modern-interior-fit-out',
    title: 'Modern Interior Fit-Out',
    category: 'Interiors',
    cardLabel: 'Interior fit-out',
    location: 'Gurugram, Haryana',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop',
    description: 'An interior fit-out delivered with balanced lighting, coordinated finishes, and clean day-to-day usability.',
    year: '2026',
    heightClass: 'h-[390px] sm:h-[450px] xl:h-[540px]',
    overview:
      'A refined interior package built around light, texture, and circulation so the finished space feels considered without becoming visually busy.',
    heroTitle: 'An interior delivery track with a quieter, more premium rhythm.',
    heroCopy:
      'The palette stays warm and restrained, while joinery, lighting, and transitions do the heavier visual work. That keeps the fit-out calm, maintainable, and easy to inhabit every day.',
    highlights: ['Lighting hierarchy', 'Soft finishes', 'Quiet luxury feel'],
    stats: [
      { value: '03', label: 'key finish families coordinated' },
      { value: '08', label: 'room and transition zones' },
      { value: '100%', label: 'visual calm and usability' },
    ],
    process: [
      { step: '01', title: 'Tone', copy: 'We defined a softer interior mood from the start.' },
      { step: '02', title: 'Layers', copy: 'Finishes, lighting, and joinery were aligned together.' },
      { step: '03', title: 'Tune', copy: 'Final balances were checked against comfort and function.' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1400&auto=format&fit=crop',
    ],
  },
  {
    slug: 'townhouse-renewal',
    title: 'Townhouse Renewal',
    category: 'Renovation',
    cardLabel: 'Renovation track',
    location: 'Kanpur, Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1400&auto=format&fit=crop',
    description: 'A selective remodel that improves layout, finishes, and usability without losing the existing structure.',
    year: '2025',
    heightClass: 'h-[340px] sm:h-[390px] xl:h-[460px]',
    overview:
      'This renewal focused on preserving the parts worth keeping while improving how the home works, moves, and feels day to day.',
    heroTitle: 'A renovation that upgrades use without erasing the original character.',
    heroCopy:
      'The process protected structural logic while reworking the layout, finishes, and material flow so the home feels more open, more useful, and easier to maintain.',
    highlights: ['Selective upgrades', 'Layout refresh', 'Less disruption'],
    stats: [
      { value: '04', label: 'major upgrade zones' },
      { value: '24', label: 'planning touchpoints' },
      { value: '90%', label: 'focus on value retention' },
    ],
    process: [
      { step: '01', title: 'Audit', copy: 'Existing elements were reviewed for keep-or-replace decisions.' },
      { step: '02', title: 'Sequence', copy: 'Work was staged to reduce disruption on site.' },
      { step: '03', title: 'Renew', copy: 'The final finish lifted the home without overdoing it.' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1400&auto=format&fit=crop',
    ],
  },
  {
    slug: 'retail-flagship',
    title: 'Retail Flagship',
    category: 'Commercial',
    cardLabel: 'Retail delivery',
    location: 'Delhi NCR',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1400&auto=format&fit=crop',
    description: 'A disciplined retail shell delivered with clean execution, strong circulation, and a modern envelope.',
    year: '2026',
    heightClass: 'h-[470px] sm:h-[520px] xl:h-[620px]',
    overview:
      'The flagship retail build was designed to perform visually from the street while staying practical for trade, fit-out, and future adaptation.',
    heroTitle: 'A retail shell built to hold attention and support operations.',
    heroCopy:
      'The project combines a strong exterior presence with a simple internal logic that supports operations, display planning, and long-term adaptability.',
    highlights: ['Retail visibility', 'Adaptable shell', 'Trade-friendly planning'],
    stats: [
      { value: '05', label: 'planning layers' },
      { value: '12+', label: 'months of coordination' },
      { value: '100%', label: 'focus on commercial function' },
    ],
    process: [
      { step: '01', title: 'Concept', copy: 'Frontage and customer flow were defined first.' },
      { step: '02', title: 'Shell', copy: 'We coordinated the envelope and service logic.' },
      { step: '03', title: 'Handover', copy: 'The final shell was prepared for fit-out teams.' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1400&auto=format&fit=crop',
    ],
  },
]

import { isSupabaseConfigured, supabaseRequest } from '@/lib/supabase-admin'

export function getProjectBySlug(slug: string) {
  return projectCatalog.find((project) => project.slug === slug)
}

export function getRelatedProjects(slug: string, category: ProjectItem['category']) {
  const sameCategory = projectCatalog.filter((project) => project.slug !== slug && project.category === category)
  const otherProjects = projectCatalog.filter(
    (project) => project.slug !== slug && project.category !== category,
  )

  return [...sameCategory, ...otherProjects].slice(0, 3)
}

type ProjectRow = Partial<ProjectItem> & {
  card_label?: string
  height_class?: string
  hero_title?: string
  hero_copy?: string
  seo_title?: string
  seo_description?: string
  seo_image?: string
  published?: boolean
  sort_order?: number
}

function normalizeProject(row: ProjectRow): ProjectItem {
  return {
    slug: row.slug ?? '',
    title: row.title ?? '',
    category: (row.category as ProjectItem['category']) ?? 'Residential',
    cardLabel: row.cardLabel ?? row.card_label ?? '',
    location: row.location ?? '',
    image: row.image ?? '',
    description: row.description ?? '',
    year: row.year ?? '',
    heightClass: row.heightClass ?? row.height_class ?? 'h-[430px] sm:h-[500px] xl:h-[620px]',
    overview: row.overview ?? '',
    heroTitle: row.heroTitle ?? row.hero_title ?? '',
    heroCopy: row.heroCopy ?? row.hero_copy ?? '',
    seoTitle: row.seoTitle ?? row.seo_title ?? '',
    seoDescription: row.seoDescription ?? row.seo_description ?? '',
    seoImage: row.seoImage ?? row.seo_image ?? '',
    highlights: Array.isArray(row.highlights) ? row.highlights.map(String) : [],
    stats: Array.isArray(row.stats)
      ? row.stats.filter((item): item is { value: string; label: string } => Boolean(item && typeof item === 'object' && 'value' in item && 'label' in item))
      : [],
    process: Array.isArray(row.process)
      ? row.process.filter((item): item is { step: string; title: string; copy: string } => Boolean(item && typeof item === 'object' && 'step' in item && 'title' in item && 'copy' in item))
      : [],
    gallery: Array.isArray(row.gallery)
      ? [String(row.gallery[0] ?? ''), String(row.gallery[1] ?? ''), String(row.gallery[2] ?? '')]
      : ['', '', ''],
  }
}

export async function getProjectCatalogFromCMS(): Promise<ProjectItem[]> {
  if (!isSupabaseConfigured()) return projectCatalog

  try {
    const rows = await supabaseRequest<ProjectRow[]>(
      '/rest/v1/projects?select=*&published=eq.true&order=sort_order.asc',
      { method: 'GET' },
    )
    if (!rows.length) return projectCatalog
    return rows.map(normalizeProject)
  } catch {
    return projectCatalog
  }
}

export async function getProjectBySlugFromCMS(slug: string): Promise<ProjectItem | undefined> {
  const projects = await getProjectCatalogFromCMS()
  return projects.find((project) => project.slug === slug)
}

export function getRelatedProjectsFromList(projects: ProjectItem[], slug: string, category: ProjectItem['category']) {
  const sameCategory = projects.filter((project) => project.slug !== slug && project.category === category)
  const otherProjects = projects.filter((project) => project.slug !== slug && project.category !== category)
  return [...sameCategory, ...otherProjects].slice(0, 3)
}
