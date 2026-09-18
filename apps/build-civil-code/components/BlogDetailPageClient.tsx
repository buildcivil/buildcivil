'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, Sparkles, Tag, User } from 'lucide-react'
import { motion } from 'framer-motion'
import NavbarClient from '@/components/NavbarClient'
import FooterClient from '@/components/FooterClient'
import { itemReveal, sectionReveal } from './motion'
import { formatBlogDate, type BlogPost } from '@buildcivil/cms/blog'
import type { GlobalLayoutSettings } from '@buildcivil/cms/site-settings-defaults'

const MotionDiv = motion.div
const MotionSection = motion.section

type Props = {
  post: BlogPost
  relatedPosts: BlogPost[]
  layoutSettings: GlobalLayoutSettings
}

function renderBlogContent(content: string) {
  return content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => {
      const lines = block.split('\n').map((line) => line.trim()).filter(Boolean)
      if (lines.length === 1 && lines[0].length < 64 && index > 0) {
        return (
          <h2 key={index} className="mt-10 text-2xl font-black tracking-[-0.03em] text-[#1c1712]">
            {lines[0]}
          </h2>
        )
      }

      return (
        <p key={index} className="mt-5 text-base leading-8 text-[#6e6256] sm:text-lg">
          {lines.join(' ')}
        </p>
      )
    })
}

export default function BlogDetailPageClient({ post, relatedPosts, layoutSettings }: Props) {
  return (
    <main className="public-site bg-white text-[#1c1712]">
      <NavbarClient settings={layoutSettings.header} />

      <MotionSection
        className="relative overflow-hidden pt-28 sm:pt-32"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
        variants={sectionReveal}
      >
        <div className="absolute inset-0 bg-[#FEFDDF]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(115,165,202,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(232,127,36,0.14),transparent_28%)]" />

        <div className="relative mx-auto w-full max-w-5xl px-5 pb-16 sm:px-6 md:px-10 lg:px-16">
          <MotionDiv variants={itemReveal}>
            <Link
              href="/blog"
              className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-[#73A5CA]/18 bg-white px-4 py-2 text-xs font-medium text-[#1c1712] shadow-[0_10px_24px_rgba(28,23,18,0.05)] transition-colors hover:border-[#E87F24]/30 hover:text-[#E87F24]"
            >
              <ArrowLeft size={14} />
              Back to Blogs & News
            </Link>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#73A5CA]/18 bg-white/82 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#5d8fb2] shadow-[0_12px_28px_rgba(28,23,18,0.06)]">
              <Sparkles size={12} className="text-[#E87F24]" />
              {post.category}
            </div>
            <h1 className="mt-6 max-w-4xl text-[clamp(2.4rem,6.4vw,5.4rem)] font-black leading-[0.95] tracking-[-0.055em] text-[#1c1712]">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="mt-6 max-w-3xl text-lg leading-8 text-[#6e6256] sm:text-xl">{post.excerpt}</p>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-5 text-xs uppercase tracking-[0.2em] text-[#8a7d70]">
              <span className="inline-flex items-center gap-1.5"><User size={14} className="text-[#E87F24]" /> {post.author_name}</span>
              <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} className="text-[#E87F24]" /> {formatBlogDate(post.published_at)}</span>
              <span className="inline-flex items-center gap-1.5"><Clock3 size={14} className="text-[#E87F24]" /> {post.read_minutes} min read</span>
            </div>
          </MotionDiv>

          {post.cover_image ? (
            <MotionDiv className="relative mt-10 h-[280px] w-full overflow-hidden rounded-[32px] border border-[#73A5CA]/14 shadow-[0_24px_70px_rgba(28,23,18,0.12)] sm:h-[420px] lg:h-[520px]" variants={itemReveal}>
              <Image
                src={post.cover_image}
                alt={post.cover_image_alt || post.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 900px, 100vw"
                priority
                unoptimized
              />
            </MotionDiv>
          ) : null}

          <MotionDiv variants={itemReveal}>
            <article className="mt-10 rounded-[36px] border border-[#73A5CA]/14 bg-white/72 p-6 shadow-[0_24px_90px_rgba(28,23,18,0.08)] backdrop-blur-md sm:p-10">
              {renderBlogContent(post.content)}
            </article>
          </MotionDiv>

          {post.tags.length ? (
            <div className="mt-8 flex flex-wrap items-center gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1.5 rounded-full border border-[#73A5CA]/18 bg-white px-3 py-1.5 text-xs font-medium text-[#5d8fb2]">
                  <Tag size={12} /> {tag}
                </span>
              ))}
            </div>
          ) : null}

          <MotionDiv className="mt-12 rounded-[30px] border border-[#73A5CA]/14 bg-white px-6 py-6 shadow-[0_18px_48px_rgba(28,23,18,0.08)] sm:px-8" variants={itemReveal}>
            <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h3 className="text-xl font-semibold text-[#1c1712]">Ready to start your project?</h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6e6256]">
                  Tell us about your site and goals, and we will help you plan the next step.
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

          {relatedPosts.length ? (
            <div className="mt-16">
              <h3 className="text-2xl font-black tracking-[-0.03em] text-[#1c1712]">More from the journal</h3>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((related) => (
                  <Link key={related.slug} href={`/blog/${related.slug}`} className="group block overflow-hidden rounded-[24px] border border-[#73A5CA]/14 bg-white shadow-[0_12px_32px_rgba(28,23,18,0.06)] transition-transform duration-300 hover:-translate-y-1">
                    <div className="relative h-[160px] w-full overflow-hidden">
                      {related.cover_image ? (
                        <Image
                          src={related.cover_image}
                          alt={related.cover_image_alt || related.title}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 33vw, 100vw"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#FEFDDF] text-xs text-[#6e6256]">No cover image</div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-[10px] uppercase tracking-[0.24em] text-[#5d8fb2]">{related.category}</div>
                      <h4 className="mt-2 text-sm font-semibold leading-snug text-[#1c1712] transition-colors group-hover:text-[#E87F24]">
                        {related.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </MotionSection>

      <FooterClient settings={layoutSettings.footer} />
    </main>
  )
}
