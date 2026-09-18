import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogDetailPageClient from '@/components/BlogDetailPageClient'
import { getBlogPostBySlug, getBlogPosts, getRelatedBlogPosts } from '@buildcivil/cms/blog'
import { cleanSeoText } from '@buildcivil/cms/seo'
import { getGlobalLayoutSettings } from '@buildcivil/cms/site-settings'

export const revalidate = 120

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getBlogPosts({ publishedOnly: true })
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) {
    return {
      title: 'Blog | BuildCivil Constructions',
      description: 'Read the latest updates and articles from BuildCivil Constructions.',
    }
  }

  const title = cleanSeoText(post.seo_title, `${post.title} | Blogs & News | BuildCivil Constructions`)
  const description = cleanSeoText(post.seo_description, post.excerpt)

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
    },
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params
  const [post, layoutSettings, allPosts] = await Promise.all([
    getBlogPostBySlug(slug),
    getGlobalLayoutSettings(),
    getBlogPosts({ publishedOnly: true }),
  ])

  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedBlogPosts(allPosts, post.slug, post.category)

  return <BlogDetailPageClient post={post} relatedPosts={relatedPosts} layoutSettings={layoutSettings} />
}
