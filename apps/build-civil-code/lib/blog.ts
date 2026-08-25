import { isSupabaseConfigured, supabaseRequest } from './supabase-admin'

export type BlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  cover_image: string
  cover_image_alt: string
  author_name: string
  category: string
  tags: string[]
  read_minutes: number
  seo_title: string
  seo_description: string
  published: boolean
  featured: boolean
  sort_order: number
  published_at: string
  created_at?: string
  updated_at?: string
}

type BlogPostRow = Partial<BlogPost> & Record<string, unknown>

function normalizeBlogPost(row: BlogPostRow): BlogPost {
  return {
    id: String(row.id ?? ''),
    slug: String(row.slug ?? ''),
    title: String(row.title ?? ''),
    excerpt: String(row.excerpt ?? ''),
    content: String(row.content ?? ''),
    cover_image: String(row.cover_image ?? ''),
    cover_image_alt: String(row.cover_image_alt ?? ''),
    author_name: String(row.author_name ?? 'BuildCivil Team'),
    category: String(row.category ?? 'Company News'),
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
    read_minutes: Number(row.read_minutes) || 5,
    seo_title: String(row.seo_title ?? ''),
    seo_description: String(row.seo_description ?? ''),
    published: Boolean(row.published ?? true),
    featured: Boolean(row.featured ?? false),
    sort_order: Number(row.sort_order) || 0,
    published_at: String(row.published_at ?? row.created_at ?? ''),
    created_at: row.created_at ? String(row.created_at) : undefined,
    updated_at: row.updated_at ? String(row.updated_at) : undefined,
  }
}

export async function getBlogPosts(options: { publishedOnly?: boolean } = {}): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) return []

  try {
    const published = options.publishedOnly === false ? '' : '&published=eq.true'
    const rows = await supabaseRequest<BlogPostRow[]>(
      `/rest/v1/blog_posts?select=*&order=sort_order.asc,published_at.desc${published}`,
      { method: 'GET', revalidate: 120 },
    )
    return rows.map(normalizeBlogPost)
  } catch {
    return []
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSupabaseConfigured()) return null
  const normalizedSlug = slug.toLowerCase()

  try {
    const rows = await supabaseRequest<BlogPostRow[]>(
      `/rest/v1/blog_posts?select=*&slug=eq.${encodeURIComponent(normalizedSlug)}&published=eq.true&limit=1`,
      { method: 'GET', revalidate: 120 },
    )
    return rows[0] ? normalizeBlogPost(rows[0]) : null
  } catch {
    return null
  }
}

export function getBlogCategories(posts: BlogPost[]) {
  const categories = new Set<string>()
  posts.forEach((post) => {
    if (post.category.trim()) categories.add(post.category.trim())
  })
  return ['All', ...Array.from(categories)]
}

export function getRelatedBlogPosts(posts: BlogPost[], slug: string, category: string, limit = 3) {
  const sameCategory = posts.filter((post) => post.slug !== slug && post.category === category)
  const otherPosts = posts.filter((post) => post.slug !== slug && post.category !== category)
  return [...sameCategory, ...otherPosts].slice(0, limit)
}

export function formatBlogDate(value: string) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}
