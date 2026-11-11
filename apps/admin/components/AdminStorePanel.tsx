'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Plus, Receipt, Search, ShoppingBag, Tag, Trash2, Handshake, Download } from 'lucide-react'
import { readJsonResponse } from '@buildcivil/cms/safe-json'
import { formatPrice, ORDER_STATUSES, STOCK_STATUS_LABELS } from '@buildcivil/cms/store'
import AdminImageUploadControl from './AdminImageUploadControl'
import { publishRefresh } from '@/lib/admin-publish'
import {
  AdminAlert, AdminBadge, AdminButton, AdminCard, AdminConfirmDialog, AdminEmptyState, AdminField,
  AdminInput, AdminPageHeader, AdminSelect, AdminTextarea,
} from '@/components/admin/ui'

export type StoreView = 'products' | 'categories' | 'orders' | 'quotes'

type Row = Record<string, any> & { id: string }
type Items = { name: string; quantity: number; unit: string; price: number }[]

async function call<T = { error?: string }>(resource: string, method: string, body?: unknown): Promise<T & { error?: string }> {
  const response = await fetch(`/api/admin/store/${resource}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  })
  const payload = await readJsonResponse<T & { error?: string }>(response, {} as T & { error?: string })
  if (!response.ok) throw new Error(payload.error || 'Request failed.')
  return payload
}

function useResource(resource: string) {
  const [rows, setRows] = useState<Row[]>([])
  const [connected, setConnected] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const payload = await call<{ rows: Row[]; connected: boolean }>(resource, 'GET')
      setRows(payload.rows ?? [])
      setConnected(payload.connected)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load.')
    } finally {
      setLoading(false)
    }
  }, [resource])

  useEffect(() => { void load() }, [load])
  return { rows, connected, loading, error, setError, load }
}

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const date = (value?: string) => (value ? new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '')

export default function AdminStorePanel({ view }: { view: StoreView }) {
  if (view === 'products') return <ProductsView />
  if (view === 'categories') return <CategoriesView />
  if (view === 'orders') return <InboxView kind="orders" />
  return <InboxView kind="quotes" />
}

/* ---------------------------------- Products --------------------------------- */

type ProductDraft = {
  id?: string; name: string; slug: string; category_id: string; sku: string; brand: string; short_description: string
  description: string; price: string; compare_at_price: string; unit: string; min_order_qty: string; stock_status: string
  image: string; gallery_text: string; specs_text: string; seo_title: string; seo_description: string
  featured: boolean; published: boolean; sort_order: string
}

const emptyProduct = (): ProductDraft => ({
  name: '', slug: '', category_id: '', sku: '', brand: '', short_description: '', description: '', price: '', compare_at_price: '',
  unit: 'piece', min_order_qty: '1', stock_status: 'in_stock', image: '', gallery_text: '', specs_text: '', seo_title: '',
  seo_description: '', featured: false, published: true, sort_order: '0',
})

const lines = (text: string) => text.split('\n').map((l) => l.trim()).filter(Boolean)

function productToDraft(row: Row): ProductDraft {
  return {
    id: row.id, name: row.name, slug: row.slug, category_id: row.category_id ?? '', sku: row.sku ?? '', brand: row.brand ?? '',
    short_description: row.short_description ?? '', description: row.description ?? '', price: String(row.price ?? ''),
    compare_at_price: row.compare_at_price == null ? '' : String(row.compare_at_price), unit: row.unit ?? 'piece',
    min_order_qty: String(row.min_order_qty ?? 1), stock_status: row.stock_status ?? 'in_stock', image: row.image ?? '',
    gallery_text: (row.gallery ?? []).join('\n'),
    specs_text: (row.specs ?? []).map((s: { label: string; value: string }) => `${s.label}|${s.value}`).join('\n'),
    seo_title: row.seo_title ?? '', seo_description: row.seo_description ?? '', featured: Boolean(row.featured),
    published: row.published !== false, sort_order: String(row.sort_order ?? 0),
  }
}

function ProductsView() {
  const products = useResource('products')
  const categories = useResource('categories')
  const [draft, setDraft] = useState<ProductDraft | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [query, setQuery] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const error = products.error

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.rows.filter((r) => !q || [r.name, r.sku, r.brand, r.slug].join(' ').toLowerCase().includes(q))
  }, [products.rows, query])
  const categoryName = (id?: string | null) => categories.rows.find((c) => c.id === id)?.name ?? '—'
  const set = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) => setDraft((d) => (d ? { ...d, [key]: value } : d))

  async function save() {
    if (!draft) return
    setSaving(true); products.setError(''); setMessage('')
    try {
      const specs = lines(draft.specs_text).map((line) => {
        const [label = '', ...rest] = line.split('|')
        return { label: label.trim(), value: rest.join('|').trim() }
      }).filter((s) => s.label && s.value)
      const payload = {
        name: draft.name, slug: draft.slug || slugify(draft.name), category_id: draft.category_id || null, sku: draft.sku, brand: draft.brand,
        short_description: draft.short_description, description: draft.description, price: Number(draft.price || 0),
        compare_at_price: draft.compare_at_price === '' ? null : Number(draft.compare_at_price), unit: draft.unit || 'piece',
        min_order_qty: Number(draft.min_order_qty || 1), stock_status: draft.stock_status, image: draft.image,
        gallery: lines(draft.gallery_text), specs, seo_title: draft.seo_title, seo_description: draft.seo_description,
        featured: draft.featured, published: draft.published, sort_order: Number(draft.sort_order || 0),
      }
      if (draft.id) await call('products', 'PATCH', { id: draft.id, updates: payload })
      else await call('products', 'POST', payload)
      await products.load()
      setDraft(null)
      setMessage('Product saved.')
      await publishRefresh(['/store']).catch(() => undefined)
    } catch (err) {
      products.setError(err instanceof Error ? err.message : 'Failed to save product.')
    } finally { setSaving(false) }
  }

  async function remove() {
    if (!deleteId) return
    setSaving(true)
    try {
      await call('products', 'DELETE', { id: deleteId })
      setDeleteId(null); setDraft(null)
      await products.load()
      setMessage('Product deleted.')
    } catch (err) {
      products.setError(err instanceof Error ? err.message : 'Failed to delete product.')
    } finally { setSaving(false) }
  }

  async function importDefaults() {
    setSaving(true); products.setError('')
    try {
      await call('import-defaults', 'POST', {})
      await Promise.all([products.load(), categories.load()])
      setMessage('Starter categories and products imported (existing items were left untouched).')
    } catch (err) {
      products.setError(err instanceof Error ? err.message : 'Import failed.')
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Store"
        title="Products"
        description="Everything customers can buy on the BuildCivil store. Changes go live immediately."
        actions={<>
          <AdminButton onClick={importDefaults} disabled={saving || !products.connected}><Download size={14} /> Import starter catalog</AdminButton>
          <AdminButton variant="primary" onClick={() => setDraft(emptyProduct())}><Plus size={14} /> New product</AdminButton>
        </>}
      />
      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}
      {message ? <AdminAlert tone="success">{message}</AdminAlert> : null}
      {!products.connected && !products.loading ? <AdminAlert tone="warning">Live database is unavailable in this environment.</AdminAlert> : null}

      {draft ? (
        <AdminCard>
          <h3 className="text-lg font-bold text-slate-900">{draft.id ? 'Edit product' : 'New product'}</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <AdminField label="Name *"><AdminInput value={draft.name} onChange={(e) => set('name', e.target.value)} /></AdminField>
            <AdminField label="Slug" hint={`URL: /store/products/${draft.slug || slugify(draft.name) || '…'}`}><AdminInput value={draft.slug} onChange={(e) => set('slug', e.target.value)} placeholder={slugify(draft.name)} /></AdminField>
            <AdminField label="Category">
              <AdminSelect value={draft.category_id} onChange={(e) => set('category_id', e.target.value)}>
                <option value="">Uncategorised</option>
                {categories.rows.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </AdminSelect>
            </AdminField>
            <AdminField label="Brand"><AdminInput value={draft.brand} onChange={(e) => set('brand', e.target.value)} /></AdminField>
            <AdminField label="Price (₹) *"><AdminInput type="number" min={0} step="0.01" value={draft.price} onChange={(e) => set('price', e.target.value)} /></AdminField>
            <AdminField label="Compare-at price (₹)" hint="Shown struck through to display a discount."><AdminInput type="number" min={0} step="0.01" value={draft.compare_at_price} onChange={(e) => set('compare_at_price', e.target.value)} /></AdminField>
            <AdminField label="Unit" hint="bag, kg, box, piece…"><AdminInput value={draft.unit} onChange={(e) => set('unit', e.target.value)} /></AdminField>
            <AdminField label="Minimum order qty"><AdminInput type="number" min={1} value={draft.min_order_qty} onChange={(e) => set('min_order_qty', e.target.value)} /></AdminField>
            <AdminField label="SKU"><AdminInput value={draft.sku} onChange={(e) => set('sku', e.target.value)} /></AdminField>
            <AdminField label="Availability">
              <AdminSelect value={draft.stock_status} onChange={(e) => set('stock_status', e.target.value)}>
                {Object.entries(STOCK_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </AdminSelect>
            </AdminField>
            <AdminField label="Sort order"><AdminInput type="number" value={draft.sort_order} onChange={(e) => set('sort_order', e.target.value)} /></AdminField>
          </div>
          <div className="mt-4 grid gap-4">
            <AdminField label="Short description"><AdminInput value={draft.short_description} onChange={(e) => set('short_description', e.target.value)} /></AdminField>
            <AdminField label="Full description"><AdminTextarea value={draft.description} onChange={(e) => set('description', e.target.value)} /></AdminField>
            <AdminField label="Main image URL">
              <AdminInput value={draft.image} onChange={(e) => set('image', e.target.value)} placeholder="https://…" />
              <AdminImageUploadControl value={draft.image} onChange={(url) => set('image', url)} altSeed={draft.name || 'BuildCivil product'} folder="store" />
            </AdminField>
            <AdminField label="Extra gallery images" hint="One image URL per line."><AdminTextarea value={draft.gallery_text} onChange={(e) => set('gallery_text', e.target.value)} /></AdminField>
            <AdminField label="Specifications" hint="One per line: Label|Value (e.g. Grade|Fe500D)."><AdminTextarea value={draft.specs_text} onChange={(e) => set('specs_text', e.target.value)} /></AdminField>
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="SEO title"><AdminInput value={draft.seo_title} onChange={(e) => set('seo_title', e.target.value)} /></AdminField>
              <AdminField label="SEO description"><AdminInput value={draft.seo_description} onChange={(e) => set('seo_description', e.target.value)} /></AdminField>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-5">
            <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={draft.featured} onChange={(e) => set('featured', e.target.checked)} /> Featured</label>
            <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={draft.published} onChange={(e) => set('published', e.target.checked)} /> Published</label>
            <div className="ml-auto flex gap-2">
              {draft.id ? <AdminButton variant="danger" onClick={() => setDeleteId(draft.id!)}><Trash2 size={14} /> Delete</AdminButton> : null}
              <AdminButton onClick={() => setDraft(null)}>Cancel</AdminButton>
              <AdminButton variant="primary" loading={saving} disabled={!draft.name.trim() || draft.price === ''} onClick={save}>Save product</AdminButton>
            </div>
          </div>
        </AdminCard>
      ) : null}

      <AdminCard>
        <div className="relative">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <AdminInput className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, SKU, brand…" />
        </div>
        <div className="mt-5 space-y-3">
          {products.loading ? <div className="py-10 text-center text-sm text-slate-500">Loading products…</div> : filtered.length ? filtered.map((row) => (
            <button key={row.id} type="button" onClick={() => setDraft(productToDraft(row))} className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-[#E87F24]/40 hover:bg-white">
              {row.image ? <img src={row.image} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" /> : <div className="h-14 w-14 shrink-0 rounded-xl bg-slate-200" />}
              <div className="min-w-0 flex-1">
                <div className="truncate font-bold text-slate-900">{row.name}</div>
                <div className="truncate text-xs text-slate-500">{categoryName(row.category_id)} · {row.sku || row.slug}</div>
              </div>
              <div className="hidden flex-wrap items-center justify-end gap-2 sm:flex">
                {row.featured ? <AdminBadge tone="accent">Featured</AdminBadge> : null}
                {!row.published ? <AdminBadge tone="warning">Draft</AdminBadge> : null}
                {row.stock_status !== 'in_stock' ? <AdminBadge tone="neutral">{STOCK_STATUS_LABELS[row.stock_status as keyof typeof STOCK_STATUS_LABELS]}</AdminBadge> : null}
              </div>
              <div className="shrink-0 text-right text-sm font-black text-slate-900">{formatPrice(Number(row.price))}<span className="block text-[11px] font-normal text-slate-400">/ {row.unit}</span></div>
            </button>
          )) : (
            <AdminEmptyState icon={<ShoppingBag size={18} />} title={products.rows.length ? 'No products match your search' : 'No products yet'} description="Add your first product, or import the starter catalog to see the store populated." />
          )}
        </div>
      </AdminCard>

      <AdminConfirmDialog open={Boolean(deleteId)} title="Delete this product?" description="It will disappear from the store. Past orders keep their own copy of the item details." confirmLabel="Delete" danger loading={saving} onCancel={() => setDeleteId(null)} onConfirm={remove} />
    </div>
  )
}

/* --------------------------------- Categories -------------------------------- */

type CategoryDraft = { id?: string; name: string; slug: string; description: string; image: string; published: boolean; sort_order: string }
const emptyCategory = (): CategoryDraft => ({ name: '', slug: '', description: '', image: '', published: true, sort_order: '0' })

function CategoriesView() {
  const categories = useResource('categories')
  const products = useResource('products')
  const [draft, setDraft] = useState<CategoryDraft | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  async function save() {
    if (!draft) return
    setSaving(true); categories.setError(''); setMessage('')
    try {
      const payload = { name: draft.name, slug: draft.slug || slugify(draft.name), description: draft.description, image: draft.image, published: draft.published, sort_order: Number(draft.sort_order || 0) }
      if (draft.id) await call('categories', 'PATCH', { id: draft.id, updates: payload })
      else await call('categories', 'POST', payload)
      await categories.load(); setDraft(null); setMessage('Category saved.')
    } catch (err) {
      categories.setError(err instanceof Error ? err.message : 'Failed to save category.')
    } finally { setSaving(false) }
  }

  async function remove() {
    if (!deleteId) return
    setSaving(true)
    try {
      await call('categories', 'DELETE', { id: deleteId })
      setDeleteId(null); setDraft(null)
      await Promise.all([categories.load(), products.load()])
      setMessage('Category deleted. Its products are now uncategorised.')
    } catch (err) {
      categories.setError(err instanceof Error ? err.message : 'Failed to delete category.')
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader eyebrow="Store" title="Categories" description="Group products so customers can browse the catalog." actions={<AdminButton variant="primary" onClick={() => setDraft(emptyCategory())}><Plus size={14} /> New category</AdminButton>} />
      {categories.error ? <AdminAlert tone="error">{categories.error}</AdminAlert> : null}
      {message ? <AdminAlert tone="success">{message}</AdminAlert> : null}

      {draft ? (
        <AdminCard>
          <h3 className="text-lg font-bold text-slate-900">{draft.id ? 'Edit category' : 'New category'}</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <AdminField label="Name *"><AdminInput value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></AdminField>
            <AdminField label="Slug"><AdminInput value={draft.slug} placeholder={slugify(draft.name)} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} /></AdminField>
            <AdminField label="Description" className="md:col-span-2"><AdminTextarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></AdminField>
            <AdminField label="Image URL" className="md:col-span-2">
              <AdminInput value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} placeholder="https://…" />
              <AdminImageUploadControl value={draft.image} onChange={(url) => setDraft((d) => d && { ...d, image: url })} altSeed={draft.name || 'BuildCivil category'} folder="store" />
            </AdminField>
            <AdminField label="Sort order"><AdminInput type="number" value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: e.target.value })} /></AdminField>
            <label className="flex items-center gap-2 self-end pb-3 text-sm text-slate-600"><input type="checkbox" checked={draft.published} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} /> Published</label>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            {draft.id ? <AdminButton variant="danger" onClick={() => setDeleteId(draft.id!)}><Trash2 size={14} /> Delete</AdminButton> : null}
            <AdminButton onClick={() => setDraft(null)}>Cancel</AdminButton>
            <AdminButton variant="primary" loading={saving} disabled={!draft.name.trim()} onClick={save}>Save category</AdminButton>
          </div>
        </AdminCard>
      ) : null}

      <AdminCard>
        <div className="space-y-3">
          {categories.loading ? <div className="py-10 text-center text-sm text-slate-500">Loading…</div> : categories.rows.length ? categories.rows.map((row) => {
            const count = products.rows.filter((p) => p.category_id === row.id).length
            return (
              <button key={row.id} type="button" onClick={() => setDraft({ id: row.id, name: row.name, slug: row.slug, description: row.description ?? '', image: row.image ?? '', published: row.published !== false, sort_order: String(row.sort_order ?? 0) })} className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-[#E87F24]/40 hover:bg-white">
                {row.image ? <img src={row.image} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" /> : <div className="h-12 w-12 shrink-0 rounded-xl bg-slate-200" />}
                <div className="min-w-0 flex-1"><div className="font-bold text-slate-900">{row.name}</div><div className="text-xs text-slate-500">/{row.slug} · {count} product{count === 1 ? '' : 's'}</div></div>
                {!row.published ? <AdminBadge tone="warning">Draft</AdminBadge> : null}
              </button>
            )
          }) : <AdminEmptyState icon={<Tag size={18} />} title="No categories yet" description="Create a category, or import the starter catalog from the Products screen." />}
        </div>
      </AdminCard>

      <AdminConfirmDialog open={Boolean(deleteId)} title="Delete this category?" description="Products in it are kept but become uncategorised." confirmLabel="Delete" danger loading={saving} onCancel={() => setDeleteId(null)} onConfirm={remove} />
    </div>
  )
}

/* ------------------------------ Orders & Quotes ------------------------------ */

const ORDER_TONE: Record<string, 'warning' | 'info' | 'success' | 'danger' | 'neutral'> = {
  new: 'warning', confirmed: 'info', processing: 'info', shipped: 'info', delivered: 'success', cancelled: 'danger',
}
const QUOTE_STATUSES = ['new', 'read', 'replied', 'closed']

function InboxView({ kind }: { kind: 'orders' | 'quotes' }) {
  const { rows, connected, loading, error, setError, load } = useResource(kind)
  const [saving, setSaving] = useState(false)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({})
  const statuses = kind === 'orders' ? ORDER_STATUSES : QUOTE_STATUSES
  const noteKey = kind === 'orders' ? 'admin_notes' : 'notes'

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false
      return !q || [r.order_number, r.name, r.email, r.phone, r.city].join(' ').toLowerCase().includes(q)
    })
  }, [rows, query, statusFilter])

  async function patch(id: string, updates: Record<string, unknown>) {
    setSaving(true); setError('')
    try { await call(kind, 'PATCH', { id, updates }); await load() }
    catch (err) { setError(err instanceof Error ? err.message : 'Update failed.') }
    finally { setSaving(false) }
  }

  async function remove() {
    if (!deleteId) return
    setSaving(true)
    try { await call(kind, 'DELETE', { id: deleteId }); setDeleteId(null); await load() }
    catch (err) { setError(err instanceof Error ? err.message : 'Delete failed.') }
    finally { setSaving(false) }
  }

  const isOrders = kind === 'orders'
  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Store"
        title={isOrders ? 'Orders' : 'Store quotes'}
        description={isOrders ? 'Orders placed at checkout. Update the status as you confirm and fulfil them.' : 'Requests sent with the Get a Quote button on the cart, checkout and product pages.'}
        actions={<AdminButton onClick={load} loading={loading}>Refresh</AdminButton>}
      />
      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}
      {!connected && !loading ? <AdminAlert tone="warning">Live database is unavailable in this environment.</AdminAlert> : null}

      <AdminCard>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <AdminInput className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, phone…" />
          </div>
          <AdminSelect className="sm:w-44" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All statuses</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </AdminSelect>
        </div>

        <div className="mt-5 space-y-3">
          {loading ? <div className="py-10 text-center text-sm text-slate-500">Loading…</div> : filtered.length ? filtered.map((row) => {
            const items = (row.items ?? []) as Items
            const total = isOrders ? Number(row.total) : Number(row.estimated_total)
            return (
              <div key={row.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{isOrders ? row.order_number : row.name}</h3>
                      <AdminBadge tone={ORDER_TONE[row.status] ?? 'neutral'}>{row.status}</AdminBadge>
                      {isOrders ? <AdminBadge tone="neutral">{row.payment_method === 'cod' ? 'Pay on delivery' : 'Bank/UPI'}</AdminBadge> : <AdminBadge tone="neutral">{row.source}</AdminBadge>}
                    </div>
                    <p className="mt-2 break-all text-sm text-slate-600">{isOrders ? `${row.name} · ` : ''}{row.email} · {row.phone}</p>
                    {isOrders ? <p className="mt-1 text-sm text-slate-500">{row.address}, {row.city}{row.state ? `, ${row.state}` : ''} – {row.pincode}</p> : null}
                    <p className="mt-1 text-xs text-slate-400">{date(row.created_at)}</p>
                    {items.length ? (
                      <ul className="mt-3 space-y-1 text-sm text-slate-700">
                        {items.map((item, i) => <li key={i}>{item.name} <span className="text-slate-400">× {item.quantity} {item.unit}</span> — {formatPrice(item.price * item.quantity)}</li>)}
                      </ul>
                    ) : null}
                    {(isOrders ? row.notes : row.message) ? <p className="mt-3 max-w-3xl whitespace-pre-line rounded-xl bg-white px-3 py-2 text-sm leading-6 text-slate-600">{isOrders ? row.notes : row.message}</p> : null}
                  </div>
                  <div className="shrink-0 text-right">
                    {total > 0 ? <div className="text-lg font-black text-slate-900">{formatPrice(total)}</div> : null}
                    <div className="mt-2 flex flex-wrap justify-end gap-2">
                      <AdminSelect className="!w-40 !py-2 text-xs capitalize" value={row.status} disabled={!connected || saving} onChange={(e) => patch(row.id, { status: e.target.value })}>
                        {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                      </AdminSelect>
                      <AdminButton variant="danger" size="sm" disabled={!connected || saving} onClick={() => setDeleteId(row.id)}><Trash2 size={12} /> Delete</AdminButton>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <AdminInput
                    placeholder="Internal note…"
                    value={noteDrafts[row.id] ?? row[noteKey] ?? ''}
                    onChange={(e) => setNoteDrafts((d) => ({ ...d, [row.id]: e.target.value }))}
                  />
                  <AdminButton size="sm" disabled={saving || noteDrafts[row.id] === undefined} onClick={async () => { await patch(row.id, { [noteKey]: noteDrafts[row.id] }); setNoteDrafts((d) => { const n = { ...d }; delete n[row.id]; return n }) }}>Save note</AdminButton>
                </div>
              </div>
            )
          }) : (
            <AdminEmptyState icon={isOrders ? <Receipt size={18} /> : <Handshake size={18} />} title={rows.length ? 'Nothing matches your filters' : isOrders ? 'No orders yet' : 'No quote requests yet'} description={isOrders ? 'Orders will appear here as customers check out.' : 'Quote requests will appear here when customers use Get a Quote.'} />
          )}
        </div>
      </AdminCard>

      <AdminConfirmDialog open={Boolean(deleteId)} title={`Delete this ${isOrders ? 'order' : 'quote request'}?`} description="This permanently removes it from the inbox." confirmLabel="Delete" danger loading={saving} onCancel={() => setDeleteId(null)} onConfirm={remove} />
    </div>
  )
}
