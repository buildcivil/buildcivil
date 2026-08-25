'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { ArrowRight, CalendarDays, Clock3, Newspaper, Sparkles, User } from 'lucide-react'
import { motion } from 'framer-motion'
import NavbarClient from '@/components/NavbarClient'
import FooterClient from '@/components/FooterClient'
import { itemReveal, sectionReveal } from './motion'
import { formatBlogDate, type BlogPost } from '@/lib/blog'
import type { GlobalLayoutSettings } from '@/lib/site-settings-defaults'

const MotionDiv = motion.div
const MotionSection = motion.section
const MotionArticle = motion.article

type BlogPageClientProps = {
  posts: BlogPost[]
  categories: string[]
  layoutSettings: GlobalLayoutSettings
}

export default function BlogPageClient({ posts, categories, layoutSettings }: BlogPageClientProps) {
  const [activeCategory, setActiveCategory] = useState('All')

  const featuredPost = useMemo(() => posts.find((post) => post.featured) ?? posts[0], [posts])

  const filteredPosts = useMemo(() => {
    const rest = posts.filter((post) => post.slug !== featuredPost?.slug)
    if (activeCategory === 'All') return rest
    return rest.filter((post) => post.category === activeCategory)
  }, [activeCategory, posts, featuredPost])

  return (
    <main className="public-site cms-section-surface">
      <NavbarClient settings={layoutSettings.header} />

      <MotionSection
        className="cms-section-surface relative overflow-hidden pt-28 sm:pt-32"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
        variants={sectionReveal}
      >
        <div className="absolute inset-0 bg-[#FEFDDF]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(115,165,202,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(232,127,36,0.12),transparent_30%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(115,165,202,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(232,127,36,0.08)_1px,transparent_1px)] [background-size:240px_240px] [mask-image:linear-gradient(180deg,transparent,black_14%,black_88%,transparent)]" />

        <div className="relative mx-auto w-full max-w-[1800px] px-5 pb-14 sm:px-6 md:px-10 lg:px-16">
          <MotionDiv className="inline-flex w-fit items-center gap-2 rounded-full border border-[#73A5CA]/18 bg-white px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#4e7c9d] shadow-[0_12px_28px_rgba(28,23,18,0.06)]" variants={itemReveal}>
            <Newspaper size={12} className="text-[#E87F24]" />
            Blogs & News
          </MotionDiv>
          <MotionDiv variants={itemReveal}>
            <h1 className="cms-hero-title mt-6 max-w-4xl text-[clamp(2.6rem,7.4vw,7.4rem)] font-black leading-[0.9] tracking-[-0.06em] text-[#1c1712]">
              Stories, updates, and ideas from BuildCivil.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#53483d] sm:text-lg">
              Practical construction advice, project updates, and company news, written by the team building your project.
            </p>
          </MotionDiv>

          {featuredPost ? (
            <MotionDiv className="mt-10" variants={itemReveal}>
              <Link href={`/blog/${featuredPost.slug}`} className="group block">
                <article className="grid gap-0 overflow-hidden rounded-[36px] border border-[#73A5CA]/14 bg-white shadow-[0_20px_60px_rgba(28,23,18,0.1)] lg:grid-cols-2">
                  <div className="relative h-[260px] w-full overflow-hidden sm:h-[340px] lg:h-full">
                    {featuredPost.cover_image ? (
                      <Image
                        src={featuredPost.cover_image}
                        alt={featuredPost.cover_image_alt || featuredPost.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        priority
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#FEFDDF] text-sm text-[#6e6256]">No cover image</div>
                    )}
                    <div className="absolute left-5 top-5 rounded-full border border-white/30 bg-black/45 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white backdrop-blur-md">
                      Featured
                    </div>
                  </div>
                  <div className="flex flex-col justify-center p-6 sm:p-10">
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#73A5CA]/18 bg-[#FEFDDF] px-3 py-1.5 text-[11px] uppercase tracking-[0.26em] text-[#5d8fb2]">
                      {featuredPost.category}
                    </div>
                    <h2 className="mt-4 text-[clamp(1.6rem,3vw,2.6rem)] font-black leading-[1.05] tracking-[-0.03em] text-[#1c1712] transition-colors group-hover:text-[#E87F24]">
                      {featuredPost.title}
                    </h2>
                    <p className="mt-4 text-sm leading-6 text-[#6e6256] sm:text-base">{featuredPost.excerpt}</p>
                    <div className="mt-6 flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.2em] text-[#8a7d70]">
                      <span className="inline-flex items-center gap-1.5"><User size={13} /> {featuredPost.author_name}</span>
                      <span className="inline-flex items-center gap-1.5"><CalendarDays size={13} /> {formatBlogDate(featuredPost.published_at)}</span>
                      <span className="inline-flex items-center gap-1.5"><Clock3 size={13} /> {featuredPost.read_minutes} min read</span>
                    </div>
                    <div className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#E87F24]">
                      Read the article <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </article>
              </Link>
            </MotionDiv>
          ) : null}
        </div>
      </MotionSection>

      <section className="cms-section-surface relative overflow-hidden py-10 sm:py-14 lg:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(115,165,202,0.1),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(232,127,36,0.08),transparent_34%)]" />
        <div className="relative mx-auto w-full max-w-[1800px] px-5 sm:px-6 md:px-10 lg:px-16">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-[#73A5CA]/18 bg-white/82 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#5d8fb2] shadow-[0_10px_24px_rgba(28,23,18,0.05)]">
                Browse articles
              </span>
              <h2 className="mt-5 text-[clamp(1.9rem,3.6vw,3.6rem)] font-black leading-[0.96] tracking-[-0.04em] text-[#1c1712]">
                Latest from the BuildCivil journal.
              </h2>
            </div>
          </div>

          {categories.length > 1 ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {categories.map((category) => {
                const active = category === activeCategory
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                      active
                        ? 'btn-primary shadow-[0_12px_24px_rgba(232,127,36,0.16)]'
                        : 'border border-[#73A5CA]/18 bg-white/82 text-[#1c1712] hover:border-[#E87F24]/25 hover:text-[#E87F24]'
                    }`}
                  >
                    {category}
                    {active ? <Sparkles size={14} /> : null}
                  </button>
                )
              })}
            </div>
          ) : null}

          {filteredPosts.length ? (
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredPosts.map((post, index) => (
                <li key={post.slug} className="list-none">
                  <Link href={`/blog/${post.slug}`} className="group block h-full">
                    <MotionArticle
                      className="flex h-full flex-col overflow-hidden rounded-[28px] border border-[#73A5CA]/12 bg-white/90 shadow-[0_14px_38px_rgba(28,23,18,0.07)] transition-transform duration-300 group-hover:-translate-y-1"
                      variants={itemReveal}
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                    >
                      <div className="relative h-[220px] w-full overflow-hidden">
                        {post.cover_image ? (
                          <Image
                            src={post.cover_image}
                            alt={post.cover_image_alt || post.title}
                            fill
                            className="object-cover"
                            sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                            priority={index === 0}
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-[#FEFDDF] text-sm text-[#6e6256]">No cover image</div>
                        )}
                        <div className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/45 px-3 py-1.5 text-[10px] uppercase tracking-[0.26em] text-white backdrop-blur-md">
                          {post.category}
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col p-5 sm:p-6">
                        <h3 className="text-lg font-black leading-tight tracking-[-0.02em] text-[#1c1712] transition-colors group-hover:text-[#E87F24]">
                          {post.title}
                        </h3>
                        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-[#6e6256]">{post.excerpt}</p>
                        <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-[#8a7d70]">
                          <span className="inline-flex items-center gap-1.5"><CalendarDays size={12} /> {formatBlogDate(post.published_at)}</span>
                          <span className="inline-flex items-center gap-1.5"><Clock3 size={12} /> {post.read_minutes} min</span>
                        </div>
                      </div>
                    </MotionArticle>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-10 rounded-[30px] border border-dashed border-[#73A5CA]/25 bg-white/70 p-10 text-center text-sm leading-6 text-[#6e6256]">
              No articles in this category yet. Check back soon or explore another category.
            </div>
          )}

          <MotionDiv className="mt-12 rounded-[30px] border border-[#73A5CA]/14 bg-white/84 px-6 py-6 shadow-[0_18px_48px_rgba(28,23,18,0.08)] sm:px-8" variants={itemReveal}>
            <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h3 className="text-xl font-semibold text-[#1c1712]">Have a project in mind?</h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6e6256]">
                  Talk to our team about your residential, commercial, interior, or renovation project.
                </p>
              </div>
              <Link
                href="/contact"
                className="btn-primary inline-flex items-center gap-3 px-6 py-3.5 text-sm font-semibold transition-transform"
              >
                Start a Conversation
                <ArrowRight size={16} />
              </Link>
            </div>
          </MotionDiv>
        </div>
      </section>

      <FooterClient settings={layoutSettings.footer} />
    </main>
  )
}
