import type { Metadata } from 'next'
import BlogPageClient from '@/components/BlogPageClient'
import { getBlogCategories, getBlogPosts } from '@/lib/blog'
import { getGlobalLayoutSettings } from '@/lib/site-settings'

export const revalidate = 120

export function generateMetadata(): Metadata {
  const title = 'Blogs & News | BuildCivil Constructions'
  const description = 'Practical construction advice, project updates, and company news from the BuildCivil Constructions team.'
  return {
    title,
    description,
    alternates: {
      canonical: '/blog',
    },
    openGraph: {
      title,
      description,
    },
  }
}

export default async function BlogPage() {
  const [posts, layoutSettings] = await Promise.all([
    getBlogPosts({ publishedOnly: true }),
    getGlobalLayoutSettings(),
  ])
  const categories = getBlogCategories(posts)

  return <BlogPageClient posts={posts} categories={categories} layoutSettings={layoutSettings} />
}
