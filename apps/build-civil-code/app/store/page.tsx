import type { Metadata } from 'next'
import Link from 'next/link'
import { Search, ShieldCheck, Truck, Headphones } from 'lucide-react'
import ProductCard from '@/components/store/ProductCard'
import { getStoreCategories, getStoreProducts } from '@buildcivil/cms/store'

export const metadata: Metadata = {
  title: 'Store | BuildCivil Constructions',
  description: 'Shop quality construction materials — cement, steel, tiles, plumbing, electrical and paints — from BuildCivil, or request a custom bulk quote.',
  alternates: { canonical: '/store' },
}

type SearchParams = Promise<{ category?: string; q?: string }>

export default async function StorePage({ searchParams }: { searchParams: SearchParams }) {
  const { category, q } = await searchParams
  const [categories, products] = await Promise.all([getStoreCategories(), getStoreProducts()])
  const query = (q ?? '').trim().toLowerCase()
  const activeCategory = categories.find((item) => item.slug === category)

  const filtered = products.filter((product) => {
    if (activeCategory && product.categoryId !== activeCategory.id) return false
    if (!query) return true
    return [product.name, product.brand, product.sku, product.shortDescription, product.categoryName]
      .join(' ')
      .toLowerCase()
      .includes(query)
  })

  const pill = (active: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-semibold transition ${
      active ? 'border-[#E87F24] bg-[#E87F24] text-white' : 'border-[#73A5CA]/22 bg-white text-[#1c1712] hover:border-[#E87F24]/50 hover:text-[#E87F24]'
    }`

  return (
    <>
      <section className="cms-section-surface relative overflow-hidden pt-10 sm:pt-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(115,165,202,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(232,127,36,0.12),transparent_30%)]" />
        <div className="relative mx-auto w-full max-w-[1800px] px-6 pb-10 md:px-10 lg:px-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#73A5CA]/18 bg-white/75 px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-[#5d8fb2]">
            BuildCivil Store
          </div>
          <h1 className="cms-hero-title mt-6 max-w-4xl text-[clamp(2.4rem,6vw,5rem)] font-black leading-[0.95] tracking-[-0.05em] text-[#1c1712]">
            Build-ready materials, delivered with the BuildCivil promise.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#6e6256] sm:text-lg">
            Order the same trusted materials we use on our own sites. Need bulk pricing or a full project estimate? Add items to your cart and hit <strong>Get a Quote</strong>.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, text: 'Genuine brands, quality checked' },
              { icon: Truck, text: 'Site delivery across NCR & UP' },
              { icon: Headphones, text: 'Engineer-backed advice' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 rounded-[20px] border border-[#73A5CA]/12 bg-white/80 px-4 py-3 text-sm text-[#1c1712] shadow-[0_10px_28px_rgba(28,23,18,0.05)]">
                <Icon size={18} className="shrink-0 text-[#E87F24]" /> {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cms-section-surface pb-20">
        <div className="mx-auto w-full max-w-[1800px] px-6 md:px-10 lg:px-16">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              <Link href={q ? `/store?q=${encodeURIComponent(q)}` : '/store'} className={pill(!activeCategory)}>All</Link>
              {categories.map((item) => (
                <Link key={item.id} href={`/store?category=${item.slug}${q ? `&q=${encodeURIComponent(q)}` : ''}`} className={pill(activeCategory?.id === item.id)}>
                  {item.name}
                </Link>
              ))}
            </div>
            <form action="/store" className="relative w-full lg:w-80">
              {activeCategory ? <input type="hidden" name="category" value={activeCategory.slug} /> : null}
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8b7e74]" />
              <input name="q" defaultValue={q} placeholder="Search products…" className="w-full rounded-full border border-[#73A5CA]/25 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-[#E87F24] focus:ring-2 focus:ring-[#E87F24]/20" />
            </form>
          </div>

          {activeCategory?.description ? <p className="mt-6 max-w-2xl text-sm leading-6 text-[#6e6256]">{activeCategory.description}</p> : null}

          {filtered.length ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-[28px] border border-dashed border-[#73A5CA]/30 bg-white p-10 text-center">
              <h3>No products found</h3>
              <p className="mt-3 text-sm text-[#6e6256]">Try another category or search term, or <Link href="/contact" className="font-semibold text-[#E87F24]">contact us</Link> for a custom requirement.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
