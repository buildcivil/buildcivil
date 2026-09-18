import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getPolicyPageBySlug, getPolicyPages } from '@buildcivil/cms/policies'
import { cleanSeoText } from '@buildcivil/cms/seo'

export const revalidate = 300

type PolicyPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const policies = await getPolicyPages({ publishedOnly: true })
  return policies.map((policy) => ({ slug: policy.slug }))
}

export async function generateMetadata({ params }: PolicyPageProps): Promise<Metadata> {
  const { slug } = await params
  const policy = await getPolicyPageBySlug(slug)
  if (!policy) return {}

  const title = cleanSeoText(policy.seo_title, `${policy.title} | BuildCivil Constructions`)
  const description = cleanSeoText(policy.seo_description, policy.summary)

  return {
    title,
    description,
    alternates: {
      canonical: `/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'article',
    },
  }
}

function renderPolicyContent(content: string) {
  return content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => {
      const lines = block.split('\n').map((line) => line.trim()).filter(Boolean)
      if (lines.length === 1 && lines[0].length < 64 && index > 0) {
        return <h2 key={index} className="mt-10 text-2xl font-black tracking-[-0.04em] text-[#1c1712]">{lines[0]}</h2>
      }

      return (
        <p key={index} className="mt-5 text-base leading-8 text-[#6e6256] sm:text-lg">
          {lines.join(' ')}
        </p>
      )
    })
}

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { slug } = await params
  const policy = await getPolicyPageBySlug(slug)
  if (!policy) notFound()

  return (
    <main className="public-site bg-white text-[#1c1712]">
      <Navbar />
      <section className="relative overflow-hidden pt-32">
        <div className="absolute inset-0 bg-[#FEFDDF]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(115,165,202,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(232,127,36,0.14),transparent_28%)]" />
        <div className="relative mx-auto w-full max-w-5xl px-5 pb-24 sm:px-6 md:px-10 lg:px-16">
          <div className="inline-flex w-fit items-center rounded-full border border-[#73A5CA]/18 bg-white/80 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#5d8fb2] shadow-[0_12px_28px_rgba(28,23,18,0.06)] backdrop-blur-sm">
            BuildCivil policy
          </div>
          <h1 className="mt-6 max-w-4xl text-[clamp(2.6rem,7vw,6.2rem)] font-black leading-[0.88] tracking-[-0.065em] text-[#1c1712]">
            {policy.title}
          </h1>
          {policy.summary ? (
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#6e6256] sm:text-xl">
              {policy.summary}
            </p>
          ) : null}
          <article className="mt-12 rounded-[36px] border border-[#73A5CA]/14 bg-white/72 p-6 shadow-[0_24px_90px_rgba(28,23,18,0.08)] backdrop-blur-md sm:p-10">
            {renderPolicyContent(policy.content)}
          </article>
        </div>
      </section>
      <Footer />
    </main>
  )
}
