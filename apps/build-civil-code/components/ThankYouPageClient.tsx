'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import NavbarClient from '@/components/NavbarClient'
import FooterClient from '@/components/FooterClient'
import { itemReveal, sectionReveal } from './motion'
import type { GlobalLayoutSettings } from '@buildcivil/cms/site-settings-defaults'

const MotionDiv = motion.div
const MotionSection = motion.section

type Props = {
  layoutSettings: GlobalLayoutSettings
}

export default function ThankYouPageClient({ layoutSettings }: Props) {
  return (
    <main className="public-site cms-section-surface">
      <NavbarClient settings={layoutSettings.header} />

      <MotionSection
        className="cms-section-surface relative flex min-h-[80svh] items-center overflow-hidden pt-28 sm:pt-32"
        initial="hidden"
        animate="visible"
        variants={sectionReveal}
      >
        <div className="absolute inset-0 bg-[#FEFDDF]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(115,165,202,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(232,127,36,0.12),transparent_30%)]" />

        <div className="relative mx-auto w-full max-w-[900px] px-5 pb-20 text-center sm:px-6 md:px-10">
          <MotionDiv
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E87F24]/12 text-[#E87F24]"
            variants={itemReveal}
          >
            <CheckCircle2 size={32} strokeWidth={2.2} />
          </MotionDiv>
          <MotionDiv variants={itemReveal}>
            <h1 className="cms-hero-title mt-6 text-[clamp(2.4rem,6vw,4.5rem)] font-black leading-[0.95] tracking-[-0.05em] text-[#1c1712]">
              Thank you for reaching out.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-[#53483d] sm:text-lg">
              We&rsquo;ve received your enquiry. A member of our team will get back to you shortly to discuss your project.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link href="/" className="btn-primary inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-semibold">
                Back to home
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2.5 rounded-full border border-[#73A5CA]/18 px-7 py-3.5 text-sm font-semibold text-[#1c1712] transition-colors hover:border-[#E87F24]/25 hover:text-[#E87F24]"
              >
                Explore our projects
              </Link>
            </div>
          </MotionDiv>
        </div>
      </MotionSection>

      <FooterClient settings={layoutSettings.footer} />
    </main>
  )
}
