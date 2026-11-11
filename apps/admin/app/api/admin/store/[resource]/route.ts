import { NextResponse } from 'next/server'
import { storeCategoryDefaults, storeProductDefaults } from '@buildcivil/cms/store'
import { isSupabaseConfigured, supabaseRequest } from '@buildcivil/cms/supabase-admin'
import { requireAdminPermission } from '@/lib/admin-access'
import { relayRevalidate } from '@/lib/publish-relay'

type Resource = 'categories' | 'products' | 'orders' | 'quotes'
type Context = { params: Promise<{ resource: string }> }

type Field = { type: 'string' | 'number' | 'nullable-number' | 'boolean' | 'array' | 'uuid-or-null'; max?: number }

const RESOURCES: Record<Resource, { table: string; order: string; creatable: boolean; fields: Record<string, Field> }> = {
  categories: {
    table: 'store_categories',
    order: 'sort_order.asc,name.asc',
    creatable: true,
    fields: {
      slug: { type: 'string', max: 120 }, name: { type: 'string', max: 160 }, description: { type: 'string', max: 2000 },
      image: { type: 'string', max: 1000 }, published: { type: 'boolean' }, sort_order: { type: 'number' },
    },
  },
  products: {
    table: 'store_products',
    order: 'sort_order.asc,name.asc',
    creatable: true,
    fields: {
      slug: { type: 'string', max: 160 }, name: { type: 'string', max: 200 }, category_id: { type: 'uuid-or-null' },
      sku: { type: 'string', max: 80 }, brand: { type: 'string', max: 120 }, short_description: { type: 'string', max: 400 },
      description: { type: 'string', max: 10000 }, price: { type: 'number' }, compare_at_price: { type: 'nullable-number' },
      unit: { type: 'string', max: 40 }, min_order_qty: { type: 'number' }, stock_status: { type: 'string', max: 20 },
      image: { type: 'string', max: 1000 }, gallery: { type: 'array' }, specs: { type: 'array' },
      seo_title: { type: 'string', max: 200 }, seo_description: { type: 'string', max: 400 },
      featured: { type: 'boolean' }, published: { type: 'boolean' }, sort_order: { type: 'number' },
    },
  },
  orders: {
    table: 'store_orders',
    order: 'created_at.desc',
    creatable: false,
    fields: { status: { type: 'string', max: 20 }, admin_notes: { type: 'string', max: 4000 } },
  },
  quotes: {
    table: 'store_quote_requests',
    order: 'created_at.desc',
    creatable: false,
    fields: { status: { type: 'string', max: 20 }, notes: { type: 'string', max: 4000 } },
  },
}

const ENUMS: Record<string, string[]> = {
  stock_status: ['in_stock', 'made_to_order', 'out_of_stock'],
}
const STATUS_ENUMS: Record<'orders' | 'quotes', string[]> = {
  orders: ['new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
  quotes: ['new', 'read', 'replied', 'closed'],
}
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

class ValidationError extends Error {}

function sanitize(resource: Resource, input: unknown, partial: boolean) {
  if (!input || typeof input !== 'object') throw new ValidationError('Invalid payload.')
  const source = input as Record<string, unknown>
  const out: Record<string, unknown> = {}
  for (const [key, field] of Object.entries(RESOURCES[resource].fields)) {
    if (!(key in source)) continue
    const value = source[key]
    switch (field.type) {
      case 'string': {
        const text = typeof value === 'string' ? value.trim().slice(0, field.max ?? 1000) : ''
        out[key] = text
        break
      }
      case 'number': {
        const num = Number(value)
        if (!Number.isFinite(num)) throw new ValidationError(`${key} must be a number.`)
        out[key] = key === 'price' || key === 'sort_order' ? num : Math.floor(num)
        break
      }
      case 'nullable-number': {
        if (value === null || value === '' || value === undefined) { out[key] = null; break }
        const num = Number(value)
        if (!Number.isFinite(num) || num < 0) throw new ValidationError(`${key} must be a positive number.`)
        out[key] = num
        break
      }
      case 'boolean':
        out[key] = Boolean(value)
        break
      case 'array':
        if (!Array.isArray(value)) throw new ValidationError(`${key} must be a list.`)
        out[key] = value.slice(0, 50)
        break
      case 'uuid-or-null':
        if (value === null || value === '' || value === undefined) { out[key] = null; break }
        if (typeof value !== 'string' || !UUID.test(value)) throw new ValidationError(`${key} is not a valid id.`)
        out[key] = value
        break
    }
  }

  if (typeof out.stock_status === 'string' && !ENUMS.stock_status.includes(out.stock_status)) throw new ValidationError('Invalid stock status.')
  if ((resource === 'orders' || resource === 'quotes') && typeof out.status === 'string' && !STATUS_ENUMS[resource].includes(out.status)) {
    throw new ValidationError('Invalid status.')
  }
  if (typeof out.slug === 'string') {
    out.slug = out.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  }
  if (!partial && (resource === 'categories' || resource === 'products')) {
    if (!out.slug || !out.name) throw new ValidationError('Name and slug are required.')
  }
  if (typeof out.price === 'number' && out.price < 0) throw new ValidationError('Price cannot be negative.')
  if (typeof out.min_order_qty === 'number' && out.min_order_qty < 1) throw new ValidationError('Minimum order quantity must be at least 1.')
  return out
}

async function resolve(context: Context) {
  const { resource } = await context.params
  return resource
}

async function guard(request: Request) {
  const access = await requireAdminPermission(request, 'store')
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status })
  return null
}

async function refresh() {
  try {
    await relayRevalidate(['/store', '/sitemap.xml'])
  } catch {
    // Best-effort: store pages are fetched uncached, so a failed relay does not block the save.
  }
}

function errorResponse(error: unknown) {
  if (error instanceof ValidationError) return NextResponse.json({ error: error.message }, { status: 400 })
  const message = error instanceof Error ? error.message : 'Request failed.'
  if (/duplicate key|23505/.test(message)) return NextResponse.json({ error: 'That slug is already in use.' }, { status: 409 })
  if (/store_[a-z_]+.*(does not exist|schema cache)|42P01|PGRST205/.test(message)) {
    return NextResponse.json({ error: 'Store tables are missing. Run apps/build-civil-code/supabase/store.sql in Supabase first.' }, { status: 503 })
  }
  return NextResponse.json({ error: message }, { status: 500 })
}

export async function GET(request: Request, context: Context) {
  const denied = await guard(request)
  if (denied) return denied
  const name = await resolve(context)
  const config = RESOURCES[name as Resource]
  if (!config) return NextResponse.json({ error: 'Unknown store resource.' }, { status: 404 })
  if (!isSupabaseConfigured()) return NextResponse.json({ connected: false, rows: [] })
  try {
    const rows = await supabaseRequest<unknown[]>(`/rest/v1/${config.table}?select=*&order=${config.order}`, { method: 'GET' })
    return NextResponse.json({ connected: true, rows })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function POST(request: Request, context: Context) {
  const denied = await guard(request)
  if (denied) return denied
  if (!isSupabaseConfigured()) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 })
  const name = await resolve(context)

  try {
    if (name === 'import-defaults') {
      const categories = await supabaseRequest<{ id: string; slug: string }[]>('/rest/v1/store_categories?on_conflict=slug', {
        method: 'POST',
        headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' },
        body: JSON.stringify(storeCategoryDefaults.map((c) => ({ slug: c.slug, name: c.name, description: c.description, image: c.image, published: c.published, sort_order: c.sortOrder }))),
        expectJson: false,
      }).then(() => supabaseRequest<{ id: string; slug: string }[]>('/rest/v1/store_categories?select=id,slug', { method: 'GET' }))
      const byslug = new Map(categories.map((c) => [c.slug, c.id]))
      await supabaseRequest('/rest/v1/store_products?on_conflict=slug', {
        method: 'POST',
        headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' },
        body: JSON.stringify(storeProductDefaults.map((p) => ({
          slug: p.slug, name: p.name, category_id: byslug.get(p.categorySlug) ?? null, sku: p.sku, brand: p.brand,
          short_description: p.shortDescription, description: p.description, price: p.price, compare_at_price: p.compareAtPrice,
          unit: p.unit, min_order_qty: p.minOrderQty, stock_status: p.stockStatus, image: p.image, gallery: p.gallery,
          specs: p.specs, featured: p.featured, published: p.published, sort_order: p.sortOrder,
        }))),
        expectJson: false,
      })
      await refresh()
      return NextResponse.json({ ok: true })
    }

    const config = RESOURCES[name as Resource]
    if (!config || !config.creatable) return NextResponse.json({ error: 'Unknown store resource.' }, { status: 404 })
    const rows = await supabaseRequest<unknown[]>(`/rest/v1/${config.table}`, {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(sanitize(name as Resource, await request.json(), false)),
    })
    await refresh()
    return NextResponse.json({ ok: true, row: rows[0] })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function PATCH(request: Request, context: Context) {
  const denied = await guard(request)
  if (denied) return denied
  if (!isSupabaseConfigured()) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 })
  const name = await resolve(context)
  const config = RESOURCES[name as Resource]
  if (!config) return NextResponse.json({ error: 'Unknown store resource.' }, { status: 404 })

  try {
    const body = (await request.json()) as { id?: string; updates?: unknown }
    if (!body.id || !UUID.test(body.id)) return NextResponse.json({ error: 'A valid id is required.' }, { status: 400 })
    const updates = sanitize(name as Resource, body.updates, true)
    const rows = await supabaseRequest<unknown[]>(`/rest/v1/${config.table}?id=eq.${body.id}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ ...updates, updated_at: new Date().toISOString() }),
    })
    await refresh()
    return NextResponse.json({ ok: true, row: rows[0] })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function DELETE(request: Request, context: Context) {
  const denied = await guard(request)
  if (denied) return denied
  if (!isSupabaseConfigured()) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 })
  const name = await resolve(context)
  const config = RESOURCES[name as Resource]
  if (!config) return NextResponse.json({ error: 'Unknown store resource.' }, { status: 404 })

  try {
    const { id } = (await request.json()) as { id?: string }
    if (!id || !UUID.test(id)) return NextResponse.json({ error: 'A valid id is required.' }, { status: 400 })
    await supabaseRequest(`/rest/v1/${config.table}?id=eq.${id}`, { method: 'DELETE', expectJson: false })
    await refresh()
    return NextResponse.json({ ok: true })
  } catch (error) {
    return errorResponse(error)
  }
}
