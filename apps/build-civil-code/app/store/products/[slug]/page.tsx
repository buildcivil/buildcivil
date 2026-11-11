import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import ProductActions from '@/components/store/ProductActions'
import ProductCard from '@/components/store/ProductCard'
import { formatPrice, getStoreProductBySlug, getStoreProducts, STOCK_STATUS_LABELS } from '@buildcivil/cms/store'

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const product = await getStoreProductBySlug(slug)
  if (!product) return { title: 'Product not found | BuildCivil Store' }
  const title = product.seoTitle || `${product.name} | BuildCivil Store`
  const description = product.seoDescription || product.shortDescription
  return {
    title,
    description,
    alternates: { canonical: `/store/products/${product.slug}` },
    openGraph: { title, description, images: product.image ? [{ url: product.image }] : undefined },
  }
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params
  const product = await getStoreProductBySlug(slug)
  if (!product) notFound()

  const related = (await getStoreProducts())
    .filter((item) => item.id !== product.id && item.categoryId === product.categoryId)
    .slice(0, 4)
  const images = [product.image, ...product.gallery].filter(Boolean)
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: images,
    description: product.shortDescription || product.description,
    sku: product.sku || undefined,
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.price,
      availability: product.stockStatus === 'out_of_stock' ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
    },
  }

  return (
    <section className="cms-section-surface pb-20 pt-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto w-full max-w-[1500px] px-6 md:px-10 lg:px-16">
        <Link href="/store" className="inline-flex items-center gap-2 text-sm font-semibold text-[#5d8fb2] hover:text-[#E87F24]"><ArrowLeft size={16} /> Back to store</Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] border border-[#73A5CA]/14 bg-[#FEFDDF] shadow-[0_24px_70px_rgba(28,23,18,0.1)]">
              {images[0] ? <Image src={images[0]} alt={product.name} fill priority sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" /> : null}
            </div>
            {images.length > 1 ? (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {images.slice(1, 5).map((src) => (
                  <div key={src} className="relative aspect-square overflow-hidden rounded-2xl border border-[#73A5CA]/14">
                    <Image src={src} alt="" fill sizes="150px" className="object-cover" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            {product.categoryName ? (
              <Link href={`/store?category=${product.categorySlug}`} className="text-[11px] uppercase tracking-[0.28em] text-[#5d8fb2] hover:text-[#E87F24]">{product.categoryName}</Link>
            ) : null}
            <h1 className="cms-hero-title mt-3 text-[#1c1712]">{product.name}</h1>
            {product.brand ? <p className="mt-2 text-sm text-[#6e6256]">Brand: {product.brand}{product.sku ? ` · SKU ${product.sku}` : ''}</p> : null}
            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <span className="text-4xl font-black tracking-tight text-[#1c1712]">{formatPrice(product.price)}</span>
              <span className="text-sm text-[#6e6256]">per {product.unit}</span>
              {discount ? (
                <>
                  <span className="text-lg text-[#8b7e74] line-through">{formatPrice(product.compareAtPrice!)}</span>
                  <span className="rounded-full bg-[#E87F24] px-3 py-1 text-xs font-bold text-white">{discount}% OFF</span>
                </>
              ) : null}
            </div>
            <p className="mt-1 text-xs text-[#8b7e74]">Prices exclude GST and delivery; the final amount is confirmed by our team.</p>
            <div className="mt-3 inline-flex rounded-full border border-[#73A5CA]/20 bg-white px-3 py-1 text-xs font-semibold text-[#1c1712]">{STOCK_STATUS_LABELS[product.stockStatus]}</div>

            <p className="mt-6 text-base leading-7 text-[#6e6256]">{product.description || product.shortDescription}</p>

            <ProductActions product={product} />

            {product.specs.length ? (
              <dl className="mt-8 divide-y divide-[#73A5CA]/14 overflow-hidden rounded-[24px] border border-[#73A5CA]/14 bg-white">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="grid grid-cols-[40%_1fr] gap-4 px-5 py-3 text-sm">
                    <dt className="text-[#6e6256]">{spec.label}</dt>
                    <dd className="font-semibold text-[#1c1712]">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </div>

        {related.length ? (
          <div className="mt-16">
            <h2 className="mb-6">You may also need</h2>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {related.map((item) => <ProductCard key={item.id} product={item} />)}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
