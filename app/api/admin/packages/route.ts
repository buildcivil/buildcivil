import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { constructionPackageDefaults } from '@/lib/packages'
import { requireAdminPermission } from '@/lib/admin-access'
import { isSupabaseConfigured, supabaseRequest } from '@/lib/supabase-admin'

type PackagePayload = {
  id?: string
  slug: string
  badge: string
  name: string
  price: string
  price_unit: string
  tagline: string
  package_name: string
  icon_name: string
  features: string[]
  projects: string
  satisfaction: string
  featured: boolean
  published: boolean
  sort_order: number
  materials: { label: string; value: string; icon_name: string; sort_order: number }[]
}

function materialPayload(materials: PackagePayload['materials'], packageId: string) {
  return materials.map((material, index) => ({
    package_id: packageId,
    label: material.label,
    value: material.value,
    icon_name: material.icon_name,
    sort_order: typeof material.sort_order === 'number' ? material.sort_order : index,
  }))
}

function fallbackRows() {
  return constructionPackageDefaults.map((item) => ({
    id: item.slug,
    slug: item.slug,
    badge: item.badge,
    name: item.name,
    price: item.price,
    price_unit: item.priceUnit,
    tagline: item.tagline,
    package_name: item.packageName,
    icon_name: item.iconName,
    features: item.features,
    projects: item.projects,
    satisfaction: item.satisfaction,
    featured: item.featured,
    published: item.published,
    sort_order: item.sortOrder,
    materials: item.materials.map((material) => ({
      label: material.label,
      value: material.value,
      icon_name: material.iconName,
      sort_order: material.sortOrder,
    })),
  }))
}

function refreshPackageRoutes() {
  revalidatePath('/')
  revalidatePath('/admin')
}

async function packageRows() {
  const [packages, materials] = await Promise.all([
    supabaseRequest<any[]>('/rest/v1/construction_packages?select=*&order=sort_order.asc', { method: 'GET' }),
    supabaseRequest<any[]>('/rest/v1/package_materials?select=*&order=sort_order.asc', { method: 'GET' }),
  ])

  return packages.map((pkg) => ({
    ...pkg,
    materials: materials.filter((material) => material.package_id === pkg.id),
  }))
}

export async function GET(request: Request) {
  const access = await requireAdminPermission(request, 'packages')
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status })

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ connected: false, table: 'packages', rows: fallbackRows() })
  }

  return NextResponse.json({ connected: true, table: 'packages', rows: await packageRows() })
}

export async function POST(request: Request) {
  const access = await requireAdminPermission(request, 'packages')
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status })

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 })
  }

  const payload = (await request.json()) as PackagePayload
  const [pkg] = await supabaseRequest<any[]>('/rest/v1/construction_packages', {
    method: 'POST',
    body: JSON.stringify({
      slug: payload.slug,
      badge: payload.badge,
      name: payload.name,
      price: payload.price,
      price_unit: payload.price_unit,
      tagline: payload.tagline,
      package_name: payload.package_name,
      icon_name: payload.icon_name,
      features: payload.features,
      projects: payload.projects,
      satisfaction: payload.satisfaction,
      featured: payload.featured,
      published: payload.published,
      sort_order: payload.sort_order,
    }),
    headers: { Prefer: 'return=representation' },
  })

  if (payload.materials.length) {
    await supabaseRequest('/rest/v1/package_materials', {
      method: 'POST',
      body: JSON.stringify(materialPayload(payload.materials, pkg.id)),
      headers: { Prefer: 'return=minimal' },
      expectJson: false,
    })
  }

  refreshPackageRoutes()

  return NextResponse.json({ ok: true, rows: await packageRows() })
}

export async function PATCH(request: Request) {
  const access = await requireAdminPermission(request, 'packages')
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status })

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 })
  }

  const rawPayload = (await request.json()) as PackagePayload | { id?: string; updates?: Partial<PackagePayload> }
  const currentRows = await packageRows()
  const current = rawPayload.id ? currentRows.find((row) => row.id === rawPayload.id) : null
  const payload: PackagePayload = 'updates' in rawPayload
    ? ({ ...(current ?? {}), ...(rawPayload.updates ?? {}), id: rawPayload.id, materials: (rawPayload.updates as any)?.materials ?? current?.materials ?? [] } as PackagePayload)
    : rawPayload as PackagePayload
  if (!payload.id) return NextResponse.json({ error: 'Package id is required.' }, { status: 400 })

  await supabaseRequest(`/rest/v1/construction_packages?id=eq.${encodeURIComponent(payload.id)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      slug: payload.slug,
      badge: payload.badge,
      name: payload.name,
      price: payload.price,
      price_unit: payload.price_unit,
      tagline: payload.tagline,
      package_name: payload.package_name,
      icon_name: payload.icon_name,
      features: payload.features,
      projects: payload.projects,
      satisfaction: payload.satisfaction,
      featured: payload.featured,
      published: payload.published,
      sort_order: payload.sort_order,
    }),
    headers: { Prefer: 'return=minimal' },
    expectJson: false,
  })

  await supabaseRequest(`/rest/v1/package_materials?package_id=eq.${encodeURIComponent(payload.id)}`, {
    method: 'DELETE',
    expectJson: false,
  })

  if (payload.materials.length) {
    await supabaseRequest('/rest/v1/package_materials', {
      method: 'POST',
      body: JSON.stringify(materialPayload(payload.materials, payload.id)),
      headers: { Prefer: 'return=minimal' },
      expectJson: false,
    })
  }

  refreshPackageRoutes()

  return NextResponse.json({ ok: true, rows: await packageRows() })
}

export async function DELETE(request: Request) {
  const access = await requireAdminPermission(request, 'packages')
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status })

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 })
  }

  const { id } = (await request.json()) as { id?: string }
  if (!id) return NextResponse.json({ error: 'Package id is required.' }, { status: 400 })

  await supabaseRequest(`/rest/v1/construction_packages?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    expectJson: false,
  })

  refreshPackageRoutes()

  return NextResponse.json({ ok: true, rows: await packageRows() })
}
