import { NextResponse } from 'next/server'
import { requireAdminPermission } from '@/lib/admin-access'
import { projectCatalog } from '@/lib/projects'
import { serviceCatalog } from '@/lib/services'
import { isSupabaseConfigured, supabaseRequest } from '@/lib/supabase-admin'

type ImportTarget = 'projects' | 'services'

function normalizeTarget(value: unknown): ImportTarget | null {
  return value === 'projects' || value === 'services' ? value : null
}

function projectRows(existingSlugs: Set<string>) {
  return projectCatalog
    .filter((project) => !existingSlugs.has(project.slug))
    .map((project, index) => ({
      slug: project.slug,
      title: project.title,
      category: project.category,
      card_label: project.cardLabel,
      location: project.location,
      image: project.image,
      description: project.description,
      year: project.year,
      height_class: project.heightClass,
      overview: project.overview,
      hero_title: project.heroTitle,
      hero_copy: project.heroCopy,
      seo_title: project.seoTitle ?? `${project.title} | BuildCivil Constructions`,
      seo_description: project.seoDescription ?? project.description,
      seo_image: project.seoImage ?? project.image,
      highlights: project.highlights,
      stats: project.stats,
      process: project.process,
      gallery: project.gallery,
      published: true,
      sort_order: index,
    }))
}

function serviceRows(existingSlugs: Set<string>) {
  return serviceCatalog
    .filter((service) => !existingSlugs.has(service.slug))
    .map((service, index) => ({
      slug: service.slug,
      title: service.title,
      description: service.description,
      kicker: service.kicker,
      image: service.image,
      accent: service.accent,
      bullets: service.bullets,
      details: service.details,
      hero_title: service.heroTitle,
      hero_copy: service.heroCopy,
      seo_title: service.seoTitle ?? `${service.title} | BuildCivil Constructions`,
      seo_description: service.seoDescription ?? service.description,
      seo_image: service.seoImage ?? service.image,
      intro: service.intro,
      gallery: service.gallery,
      stats: service.stats,
      process: service.process,
      icon_name: service.iconName,
      published: true,
      sort_order: index,
    }))
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const target = normalizeTarget((body as { target?: unknown }).target)
  if (!target) {
    return NextResponse.json({ error: 'Choose projects or services to import.' }, { status: 400 })
  }

  const access = await requireAdminPermission(request, target)
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status })
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 })
  }

  const existing = await supabaseRequest<Array<{ slug: string }>>(`/rest/v1/${target}?select=slug`, {
    method: 'GET',
  })
  const existingSlugs = new Set(existing.map((row) => row.slug).filter(Boolean))
  const rows = target === 'projects' ? projectRows(existingSlugs) : serviceRows(existingSlugs)

  if (!rows.length) {
    return NextResponse.json({
      ok: true,
      target,
      inserted: 0,
      skipped: existingSlugs.size,
      message: `No missing ${target} to import.`,
    })
  }

  const inserted = await supabaseRequest<Array<Record<string, unknown>>>(`/rest/v1/${target}`, {
    method: 'POST',
    body: JSON.stringify(rows),
    headers: {
      Prefer: 'return=representation',
    },
  })

  return NextResponse.json({
    ok: true,
    target,
    inserted: inserted.length,
    skipped: existingSlugs.size,
    rows: inserted,
  })
}
