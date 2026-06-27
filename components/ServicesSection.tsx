'use client'

import { ArrowRight, Briefcase, Home, Palette, RefreshCw, Ruler } from 'lucide-react'
import { motion } from 'framer-motion'
import { itemReveal, sectionReveal } from './motion'
import type { HomePageContent } from '@/lib/site-pages'

const MotionDiv = motion.div
const MotionA = motion.a

type ServicesSectionProps = {
  content?: Partial<HomePageContent['services']>
}

const iconMap = {
  home: Home,
  palette: Palette,
  refresh: RefreshCw,
  ruler: Ruler,
  briefcase: Briefcase,
}

const defaultServices = [
  {
    slug: 'turnkey-construction',
    icon: 'home' as const,
    title: 'Turnkey Construction',
    description: 'Complete end-to-end construction solutions from foundation to finishing, coordinated by one capable team.',
    color: 'from-header-500/16 to-highlight-500/10',
    border: 'border-header-500/18',
    iconBg: 'bg-header-500/12',
    iconColor: 'text-header-600',
  },
  {
    slug: 'interior-exterior-design',
    icon: 'palette' as const,
    title: 'Interior & Exterior Design',
    description: 'Professional design services for both interior and exterior spaces, balanced for comfort, function, and style.',
    color: 'from-border-500/16 to-highlight-500/6',
    border: 'border-border-500/18',
    iconBg: 'bg-border-500/14',
    iconColor: 'text-border-600',
  },
  {
    slug: 'renovation-remodeling',
    icon: 'refresh' as const,
    title: 'Renovation & Remodeling',
    description: 'Transform existing spaces with modern renovation solutions that improve layout, utility, and visual appeal.',
    color: 'from-highlight-600/18 to-header-500/6',
    border: 'border-highlight-600/20',
    iconBg: 'bg-highlight-500/14',
    iconColor: 'text-highlight-500',
  },
  {
    slug: 'architectural-planning',
    icon: 'ruler' as const,
    title: 'Architectural Planning',
    description: 'Expert architectural planning and structural design services that shape a clear, buildable project vision.',
    color: 'from-border-400/14 to-header-500/5',
    border: 'border-border-400/18',
    iconBg: 'bg-border-400/14',
    iconColor: 'text-border-500',
  },
  {
    slug: 'project-management',
    icon: 'briefcase' as const,
    title: 'Project Management',
    description: 'Professional project management and coordination services that keep your build organized, aligned, and on schedule.',
    color: 'from-border-500/16 to-highlight-500/8',
    border: 'border-border-500/18',
    iconBg: 'bg-border-500/14',
    iconColor: 'text-border-600',
  },
]

export default function ServicesSection({ content }: ServicesSectionProps) {
  const title = content?.title ?? 'Comprehensive construction services with unmatched precision'
  const copy =
    content?.copy ?? 'From architectural blueprints to the final coat of paint — we deliver comprehensive construction services with unmatched precision.'
  const services = content?.items?.length ? content.items : defaultServices
  return (
    <MotionDiv
      id="services"
      className="cms-section-surface relative overflow-hidden py-28"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      variants={sectionReveal}
    >
      {/* Background */}
      <div className="cms-section-fill absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(115,165,202,0.12),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(232,127,36,0.08),transparent_34%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#73A5CA]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full px-6 md:px-10 lg:px-16">
        {/* Section Header */}
        <MotionDiv className="text-center mb-16" variants={itemReveal}>
          <div className="badge badge-orange mx-auto mb-5">
            <span className="w-1.5 h-1.5 bg-[#E87F24] rounded-full" />
            Build Your Dream
          </div>
          <h2 className="font-display font-black text-4xl lg:text-6xl text-[#1c1712] mb-5">
            {title}
          </h2>
          <p className="text-[#6e6256] text-lg max-w-2xl mx-auto leading-relaxed">
            {copy}
          </p>
        </MotionDiv>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon ?? 'home'] ?? Home
            const color = service.color ?? 'from-header-500/16 to-highlight-500/10'
            const border = service.border ?? 'border-header-500/18'
            const iconBg = service.iconBg ?? 'bg-header-500/12'
            const iconColor = service.iconColor ?? 'text-header-600'
            return (
            <MotionDiv
              key={service.title}
              className={`glass-card rounded-3xl p-8 border ${border} group hover:scale-[1.02] transition-all duration-300 cursor-pointer relative overflow-hidden`}
              style={{ animationDelay: `${i * 0.1}s` }}
              variants={itemReveal}
              whileHover={{ y: -6, scale: 1.015 }}
            >
              {/* Hover glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl`} />

              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={iconColor} size={24} />
                </div>

                {/* Content */}
                <h3 className="font-display font-bold text-xl text-[#1c1712] mb-3 group-hover:text-header-700 transition-colors">
                  {service.title}
                </h3>
                <p className="text-[#6e6256] text-sm leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Link */}
                <div className="flex items-center gap-2 text-highlight-500 text-sm font-semibold group-hover:gap-3 transition-all duration-200">
                  <MotionA href={`/services/${service.slug}`} className="flex items-center gap-2">
                    Learn More <ArrowRight size={14} />
                  </MotionA>
                </div>
              </div>
            </MotionDiv>
          )})}
        </div>

        {/* View All CTA */}
        <MotionDiv className="text-center mt-12" variants={itemReveal}>
          <MotionA
            href="/contact"
            className="btn-primary px-8 py-4 rounded-2xl inline-flex items-center gap-2 text-sm font-semibold"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            Get a Custom Quote <ArrowRight size={16} />
          </MotionA>
        </MotionDiv>
      </div>
    </MotionDiv>
  )
}
