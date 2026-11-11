import { isSupabaseConfigured, supabaseRequest } from './supabase-admin'

export type StockStatus = 'in_stock' | 'made_to_order' | 'out_of_stock'

export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  in_stock: 'In stock',
  made_to_order: 'Made to order',
  out_of_stock: 'Out of stock',
}

export type StoreCategory = {
  id: string
  slug: string
  name: string
  description: string
  image: string
  published: boolean
  sortOrder: number
}

export type ProductSpec = { label: string; value: string }

export type StoreProduct = {
  id: string
  slug: string
  name: string
  categoryId: string | null
  categorySlug: string
  categoryName: string
  sku: string
  brand: string
  shortDescription: string
  description: string
  price: number
  compareAtPrice: number | null
  unit: string
  minOrderQty: number
  stockStatus: StockStatus
  image: string
  gallery: string[]
  specs: ProductSpec[]
  seoTitle: string
  seoDescription: string
  featured: boolean
  published: boolean
  sortOrder: number
}

export type OrderStatus = 'new' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export const ORDER_STATUSES: OrderStatus[] = ['new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
export type PaymentMethod = 'cod' | 'bank_transfer'
export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cod: 'Pay on delivery',
  bank_transfer: 'Bank transfer / UPI (details sent after confirmation)',
}

export type OrderItem = {
  productId: string
  slug: string
  name: string
  unit: string
  price: number
  quantity: number
}

export const STORE_CURRENCY = 'INR'

export function formatPrice(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: STORE_CURRENCY,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)
}

type CategoryRow = {
  id: string
  slug: string
  name: string
  description: string
  image: string
  published: boolean
  sort_order: number
}

type ProductRow = {
  id: string
  slug: string
  name: string
  category_id: string | null
  sku: string
  brand: string
  short_description: string
  description: string
  price: number | string
  compare_at_price: number | string | null
  unit: string
  min_order_qty: number
  stock_status: StockStatus
  image: string
  gallery: unknown
  specs: unknown
  seo_title: string
  seo_description: string
  featured: boolean
  published: boolean
  sort_order: number
}

const img = (id: string) => `https://images.unsplash.com/${id}?q=80&w=1400&auto=format&fit=crop`

/**
 * Starter catalog shown when Supabase is not configured (local preview) and
 * importable from the admin panel. Prices are indicative placeholders.
 */
export const storeCategoryDefaults: StoreCategory[] = [
  { id: 'cat-cement', slug: 'cement-concrete', name: 'Cement & Concrete', description: 'Cement, ready-mix additives and concrete essentials for every pour.', image: img('photo-1504307651254-35680f356dfd'), published: true, sortOrder: 0 },
  { id: 'cat-steel', slug: 'steel-reinforcement', name: 'Steel & Reinforcement', description: 'TMT bars, binding wire and structural steel from trusted mills.', image: img('photo-1531834685032-c34bf0d84e48'), published: true, sortOrder: 1 },
  { id: 'cat-tiles', slug: 'tiles-flooring', name: 'Tiles & Flooring', description: 'Vitrified, ceramic and outdoor tiles for floors and walls.', image: img('photo-1505693416388-ac5ce068fe85'), published: true, sortOrder: 2 },
  { id: 'cat-plumbing', slug: 'plumbing-electrical', name: 'Plumbing & Electrical', description: 'Pipes, fittings, wiring and switchgear built to last.', image: img('photo-1503387762-592deb58ef4e'), published: true, sortOrder: 3 },
  { id: 'cat-paint', slug: 'paints-finishes', name: 'Paints & Finishes', description: 'Interior and exterior paints, primers and waterproofing.', image: img('photo-1486406146926-c627a92ad1ab'), published: true, sortOrder: 4 },
]

type ProductSeed = Omit<StoreProduct, 'id' | 'categoryId' | 'categoryName' | 'seoTitle' | 'seoDescription' | 'gallery' | 'published' | 'sortOrder' | 'minOrderQty' | 'compareAtPrice' | 'stockStatus' | 'featured'> &
  Partial<Pick<StoreProduct, 'compareAtPrice' | 'stockStatus' | 'featured' | 'minOrderQty'>>

const productSeeds: ProductSeed[] = [
  { slug: 'ppc-cement-50kg', name: 'PPC Cement – 50 kg bag', categorySlug: 'cement-concrete', sku: 'CEM-PPC-50', brand: 'UltraTech / ACC', shortDescription: 'Portland Pozzolana Cement for plaster, masonry and general RCC.', description: 'Reliable all-round cement for residential construction. Low heat of hydration, better workability and long-term durability. Supplied in sealed 50 kg bags.', price: 395, compareAtPrice: 430, unit: 'bag', minOrderQty: 10, featured: true, image: img('photo-1504307651254-35680f356dfd'), specs: [{ label: 'Grade', value: 'PPC' }, { label: 'Weight', value: '50 kg' }, { label: 'Standard', value: 'IS 1489' }] },
  { slug: 'opc-53-cement-50kg', name: 'OPC 53 Grade Cement – 50 kg bag', categorySlug: 'cement-concrete', sku: 'CEM-OPC53-50', brand: 'UltraTech / ACC', shortDescription: 'High-strength cement for columns, beams and slabs.', description: 'Ordinary Portland Cement 53 grade for structural work that needs rapid strength gain.', price: 435, unit: 'bag', minOrderQty: 10, image: img('photo-1504307651254-35680f356dfd'), specs: [{ label: 'Grade', value: 'OPC 53' }, { label: 'Weight', value: '50 kg' }, { label: 'Standard', value: 'IS 269' }] },
  { slug: 'tmt-bar-fe500d-12mm', name: 'TMT Bar Fe500D – 12 mm', categorySlug: 'steel-reinforcement', sku: 'STL-TMT-12', brand: 'Tata Tiscon / JSW', shortDescription: 'Earthquake-resistant ribbed TMT reinforcement bar.', description: 'Fe500D TMT bars with superior ductility and weldability. Supplied in 12 m lengths.', price: 68, unit: 'kg', minOrderQty: 100, featured: true, image: img('photo-1531834685032-c34bf0d84e48'), specs: [{ label: 'Grade', value: 'Fe500D' }, { label: 'Diameter', value: '12 mm' }, { label: 'Length', value: '12 m' }] },
  { slug: 'binding-wire-roll', name: 'Binding Wire – 20 kg roll', categorySlug: 'steel-reinforcement', sku: 'STL-BW-20', brand: 'Local mill', shortDescription: 'Annealed 18 gauge binding wire for rebar tying.', description: 'Soft, flexible annealed wire that ties rebar cages securely without snapping.', price: 1500, unit: 'roll', image: img('photo-1531834685032-c34bf0d84e48'), specs: [{ label: 'Gauge', value: '18' }, { label: 'Weight', value: '20 kg' }] },
  { slug: 'vitrified-tiles-600x600', name: 'Vitrified Floor Tiles 600×600 mm', categorySlug: 'tiles-flooring', sku: 'TIL-VIT-6060', brand: 'Kajaria / Somany', shortDescription: 'Glossy double-charged vitrified tiles, box of 4.', description: 'Durable, low-porosity tiles ideal for living rooms and bedrooms. Priced per box (1.44 sqm).', price: 880, compareAtPrice: 990, unit: 'box', minOrderQty: 2, featured: true, image: img('photo-1505693416388-ac5ce068fe85'), specs: [{ label: 'Size', value: '600 × 600 mm' }, { label: 'Finish', value: 'Glossy' }, { label: 'Coverage', value: '1.44 sqm / box' }] },
  { slug: 'anti-skid-bathroom-tiles', name: 'Anti-skid Bathroom Tiles 300×300 mm', categorySlug: 'tiles-flooring', sku: 'TIL-ASK-3030', brand: 'Kajaria', shortDescription: 'Matt anti-skid ceramic tiles for wet areas.', description: 'R10-rated matt tiles designed for bathrooms, balconies and terraces. Box of 11.', price: 520, unit: 'box', minOrderQty: 2, image: img('photo-1505693416388-ac5ce068fe85'), specs: [{ label: 'Size', value: '300 × 300 mm' }, { label: 'Finish', value: 'Matt anti-skid' }] },
  { slug: 'cpvc-pipe-1-inch', name: 'CPVC Pipe 1" – 3 m length', categorySlug: 'plumbing-electrical', sku: 'PLB-CPVC-1', brand: 'Astral / Ashirvad', shortDescription: 'Hot and cold water CPVC pipe, SDR 11.', description: 'Corrosion-free CPVC pipe suitable for hot and cold water lines in residential plumbing.', price: 340, unit: 'length', minOrderQty: 5, image: img('photo-1503387762-592deb58ef4e'), specs: [{ label: 'Diameter', value: '1 inch' }, { label: 'Length', value: '3 m' }, { label: 'Type', value: 'SDR 11' }] },
  { slug: 'fr-copper-wire-2-5sqmm', name: 'FR Copper Wire 2.5 sq mm – 90 m coil', categorySlug: 'plumbing-electrical', sku: 'ELC-WIRE-25', brand: 'Havells / Anchor', shortDescription: 'Flame-retardant house wiring, ISI marked.', description: 'FR PVC insulated copper cable for power circuits. Coil of 90 metres.', price: 3150, unit: 'coil', featured: true, image: img('photo-1503387762-592deb58ef4e'), specs: [{ label: 'Size', value: '2.5 sq mm' }, { label: 'Length', value: '90 m' }, { label: 'Standard', value: 'IS 694' }] },
  { slug: 'premium-emulsion-20l', name: 'Premium Interior Emulsion – 20 L', categorySlug: 'paints-finishes', sku: 'PNT-EMU-20', brand: 'Asian Paints', shortDescription: 'Washable, low-odour interior emulsion.', description: 'Smooth silk finish with excellent coverage and stain resistance. Available in tinted shades on request.', price: 7200, unit: 'bucket', stockStatus: 'made_to_order', image: img('photo-1486406146926-c627a92ad1ab'), specs: [{ label: 'Volume', value: '20 L' }, { label: 'Finish', value: 'Silk' }, { label: 'Coverage', value: '~140 sqm / coat' }] },
  { slug: 'waterproofing-compound-10kg', name: 'Waterproofing Compound – 10 kg', categorySlug: 'paints-finishes', sku: 'PNT-WP-10', brand: 'Dr. Fixit', shortDescription: 'Crystalline waterproofing for roofs and bathrooms.', description: 'Cementitious waterproofing slurry for terraces, sunken slabs and bathrooms.', price: 1250, unit: 'pack', image: img('photo-1486406146926-c627a92ad1ab'), specs: [{ label: 'Weight', value: '10 kg' }, { label: 'Coverage', value: '~25 sqm' }] },
]

export const storeProductDefaults: StoreProduct[] = productSeeds.map((seed, index) => {
  const category = storeCategoryDefaults.find((item) => item.slug === seed.categorySlug)
  return {
    id: `prod-${seed.slug}`,
    categoryId: category?.id ?? null,
    categoryName: category?.name ?? '',
    compareAtPrice: null,
    minOrderQty: 1,
    stockStatus: 'in_stock',
    featured: false,
    gallery: [],
    seoTitle: '',
    seoDescription: '',
    published: true,
    sortOrder: index,
    ...seed,
  }
})

function list(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String).filter(Boolean) : []
}

function specs(value: unknown): ProductSpec[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => ({
      label: typeof item?.label === 'string' ? item.label : '',
      value: typeof item?.value === 'string' ? item.value : '',
    }))
    .filter((item) => item.label && item.value)
}

export function normalizeCategory(row: CategoryRow): StoreCategory {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    image: row.image,
    published: row.published,
    sortOrder: row.sort_order,
  }
}

export function normalizeProduct(row: ProductRow, categories: StoreCategory[]): StoreProduct {
  const category = categories.find((item) => item.id === row.category_id)
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    categoryId: row.category_id,
    categorySlug: category?.slug ?? '',
    categoryName: category?.name ?? '',
    sku: row.sku,
    brand: row.brand,
    shortDescription: row.short_description,
    description: row.description,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price === null || row.compare_at_price === undefined ? null : Number(row.compare_at_price),
    unit: row.unit || 'piece',
    minOrderQty: row.min_order_qty || 1,
    stockStatus: row.stock_status,
    image: row.image,
    gallery: list(row.gallery),
    specs: specs(row.specs),
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    featured: row.featured,
    published: row.published,
    sortOrder: row.sort_order,
  }
}

export async function getStoreCategories(includeDrafts = false): Promise<StoreCategory[]> {
  if (!isSupabaseConfigured()) return storeCategoryDefaults
  try {
    const filter = includeDrafts ? '' : '&published=eq.true'
    const rows = await supabaseRequest<CategoryRow[]>(
      `/rest/v1/store_categories?select=*${filter}&order=sort_order.asc,name.asc`,
      { method: 'GET' },
    )
    return rows.map(normalizeCategory)
  } catch {
    return []
  }
}

export async function getStoreProducts(includeDrafts = false): Promise<StoreProduct[]> {
  if (!isSupabaseConfigured()) return storeProductDefaults
  try {
    const filter = includeDrafts ? '' : '&published=eq.true'
    const [rows, categories] = await Promise.all([
      supabaseRequest<ProductRow[]>(`/rest/v1/store_products?select=*${filter}&order=sort_order.asc,name.asc`, { method: 'GET' }),
      getStoreCategories(true),
    ])
    return rows.map((row) => normalizeProduct(row, categories))
  } catch {
    return []
  }
}

export async function getStoreProductBySlug(slug: string): Promise<StoreProduct | null> {
  if (!isSupabaseConfigured()) return storeProductDefaults.find((item) => item.slug === slug) ?? null
  try {
    const [rows, categories] = await Promise.all([
      supabaseRequest<ProductRow[]>(
        `/rest/v1/store_products?select=*&slug=eq.${encodeURIComponent(slug)}&published=eq.true&limit=1`,
        { method: 'GET' },
      ),
      getStoreCategories(true),
    ])
    return rows[0] ? normalizeProduct(rows[0], categories) : null
  } catch {
    return null
  }
}

/** Fetch published products by id (used to re-price carts server-side). */
export async function getStoreProductsByIds(ids: string[]): Promise<StoreProduct[]> {
  const unique = Array.from(new Set(ids)).filter(Boolean)
  if (!unique.length) return []
  if (!isSupabaseConfigured()) return storeProductDefaults.filter((item) => unique.includes(item.id))
  const rows = await supabaseRequest<ProductRow[]>(
    `/rest/v1/store_products?select=*&published=eq.true&id=in.(${unique.map(encodeURIComponent).join(',')})`,
    { method: 'GET' },
  )
  const categories = await getStoreCategories(true)
  return rows.map((row) => normalizeProduct(row, categories))
}

export function generateOrderNumber() {
  const stamp = new Date().toISOString().slice(2, 10).replace(/-/g, '')
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `BC-${stamp}-${rand}`
}
