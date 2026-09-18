'use client'

import { motion } from 'framer-motion'
import { itemReveal, sectionReveal } from './motion'
import type { HomePageContent, HomeProjectTile } from '@buildcivil/cms/site-pages'

const MotionDiv = motion.div
const MotionArticle = motion.article

type ProjectsSectionProps = {
  content?: Partial<HomePageContent['projects']>
}

const defaultTiles: HomeProjectTile[] = [
  {
    type: 'stat',
    title: 'Before - After',
    copy: 'We rework underused plots into calm, durable, and climate-aware homes.',
    value: '60%',
    note: 'designs better suited for sustainability',
  },
  {
    type: 'image',
    image:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
  },
  {
    type: 'stat',
    title: 'Before - After',
    copy: 'Every layout is tuned for better circulation, light, and day-to-day comfort.',
    value: '210%',
    note: 'space efficiency uplift',
  },
  {
    type: 'image',
    image:
      'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=1200&auto=format&fit=crop',
  },
  {
    type: 'image',
    image:
      'https://images.unsplash.com/photo-1565321652749-f808b3eba663?q=80&w=1200&auto=format&fit=crop',
  },
  {
    type: 'stat',
    title: 'Before - After',
    copy: 'We bring unfinished spaces into refined homes with crisp detailing.',
    value: '310%',
    note: 'a calmer, warmer finish',
  },
  {
    type: 'image',
    image:
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop',
  },
  {
    type: 'stat',
    title: 'Before - After',
    copy: 'The result is a place that feels more open, more considered, and more personal.',
    value: '510%',
    note: 'long-term livability',
  },
]

export default function ProjectsSection({ content }: ProjectsSectionProps) {
  const title = content?.title ?? 'Our Properties'
  const copy =
    content?.copy ?? 'A blend of calm material palettes, privacy, and warm living spaces built for modern family life.'
  const tiles = content?.tiles?.length ? content.tiles : defaultTiles
  return (
    <MotionDiv
      id="properties"
      className="cms-section-surface section-pad"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionReveal}
    >
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <MotionDiv variants={itemReveal}>
            <h2 className="title-serif text-[clamp(3rem,5vw,5.6rem)] leading-[0.9] tracking-tight">
              {title}
            </h2>
          </MotionDiv>
          <p className="max-w-md text-sm leading-6 text-[#706658]">{copy}</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {tiles.map((tile, index) => {
            if (tile.type === 'stat') {
              return (
              <MotionArticle
                key={`${tile.title}-${index}`}
                className="min-h-[250px] rounded-[28px] bg-white p-5 shadow-[0_14px_34px_rgba(28,23,18,0.08)]"
                variants={itemReveal}
                whileHover={{ y: -5, scale: 1.01 }}
              >
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <h3 className="title-serif text-[2rem] leading-none tracking-tight">{tile.title}</h3>
                    <p className="mt-4 max-w-[15rem] text-sm leading-6 text-[#6a6155]">{tile.copy}</p>
                  </div>
                  <div>
                    <p className="text-[4rem] leading-none tracking-tight">{tile.value}</p>
                    <p className="mt-1 max-w-[12rem] text-sm font-medium text-[#1c1712]">{tile.note}</p>
                  </div>
                </div>
              </MotionArticle>
              )
            }

            return (
              <MotionArticle
                key={`${tile.image}-${index}`}
                className="min-h-[250px] overflow-hidden rounded-[28px] bg-cover bg-center shadow-[0_14px_34px_rgba(0,0,0,0.1)]"
                style={{ backgroundImage: `url('${tile.image}')` }}
                variants={itemReveal}
                whileHover={{ y: -5, scale: 1.01 }}
              />
            )
          })}
        </div>
      </div>
    </MotionDiv>
  )
}
