'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import NavbarClient from '@/components/NavbarClient'
import FooterClient from '@/components/FooterClient'
import RenovaiteBeforeAfterSlider from '@/components/RenovaiteBeforeAfterSlider'
import RenovaiteDesignForm from '@/components/RenovaiteDesignForm'
import type { RenovaitePageContent } from '@buildcivil/cms/site-pages'
import type { GlobalLayoutSettings } from '@buildcivil/cms/site-settings-defaults'
import { sectionStyleVars } from '@buildcivil/cms/section-style'

type RenovaitePageClientProps = {
  content: Partial<RenovaitePageContent>
  layoutSettings: GlobalLayoutSettings
  heroImage?: string
}

export default function RenovaitePageClient({
  content,
  layoutSettings,
  heroImage,
}: RenovaitePageClientProps) {
  const hero = content.hero
  const slider = content.slider
  const form = content.form
  const cta = content.cta
  const showMobileTopBar = Boolean(layoutSettings.header.mobileTopBar?.visible)
  const headerSpacerClass = showMobileTopBar
    ? 'h-[10rem] sm:h-[10.5rem] xl:h-[11.5rem]'
    : 'h-28 sm:h-32 xl:h-36'

  return (
    <main className="public-site cms-section-surface">
      <NavbarClient settings={layoutSettings.header} />
      <div className={headerSpacerClass} aria-hidden="true" />

      <section
        className="cms-section-surface relative overflow-hidden"
        style={sectionStyleVars(content.sectionSettings?.hero)}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: [
              'linear-gradient(105deg, rgba(28,23,18,0.86) 0%, rgba(28,23,18,0.55) 48%, rgba(28,23,18,0.28) 100%)',
              `url('${hero?.image || heroImage || ''}')`,
            ].join(', '),
          }}
        />
        <div className="relative mx-auto w-full max-w-[1800px] px-5 py-16 sm:px-6 sm:py-20 md:px-10 lg:px-16">
          <div className="on-image-overlay max-w-3xl">
            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-white/70">
              <Sparkles size={12} className="text-[#FFC81E]" />
              {hero?.label ?? 'Renovaite'}
            </span>
            <h1
              className="cms-hero-title title-display mt-5 text-white"
              style={{
                fontSize: 'var(--hero-title-size, clamp(2.6rem, 6.5vw, 5.5rem))',
                lineHeight: 0.94,
              }}
            >
              {hero?.title ?? 'AI-assisted interiors for real renovations.'}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              {hero?.copy ??
                'Explore before/after transformations and generate design directions from your room photo.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#generate" className="btn-primary inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold">
                Generate Designs
                <ArrowRight size={16} />
              </a>
              <a
                href="#compare"
                className="inline-flex items-center gap-2 border border-white/35 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
                style={{ borderRadius: 'var(--button-radius, 999px)' }}
              >
                View comparisons
              </a>
            </div>
          </div>
        </div>
      </section>

      <div id="compare" style={sectionStyleVars(content.sectionSettings?.slider)}>
        {slider ? (
          <RenovaiteBeforeAfterSlider
            label={slider.label}
            title={slider.title}
            copy={slider.copy}
            items={slider.items ?? []}
          />
        ) : null}
      </div>

      <div style={sectionStyleVars(content.sectionSettings?.form)}>
        {form ? <RenovaiteDesignForm content={form} /> : null}
      </div>

      {cta?.title ? (
        <section className="relative px-5 pb-16 sm:px-6 md:px-10 lg:px-16 lg:pb-20">
          <div className="mx-auto max-w-[1800px] rounded-[30px] border border-[#73A5CA]/14 bg-white px-6 py-8 shadow-[0_18px_48px_rgba(28,23,18,0.08)] sm:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-[#1c1712]">{cta.title}</h3>
                {cta.copy ? <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6e6256]">{cta.copy}</p> : null}
              </div>
              <Link href={cta.href || '/contact'} className="btn-primary inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold">
                {cta.label || 'Contact us'}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <FooterClient settings={layoutSettings.footer} />
    </main>
  )
}
