'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import Image from 'next/image'
import { GripVertical, Sparkles } from 'lucide-react'
import type { RenovaiteSliderItem } from '@/lib/site-pages'

type RenovaiteBeforeAfterSliderProps = {
  label?: string
  title: string
  copy: string
  items: RenovaiteSliderItem[]
}

function ComparisonCard({ item }: { item: RenovaiteSliderItem }) {
  const [position, setPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  const updateFromClientX = useCallback((clientX: number) => {
    const track = trackRef.current
    if (!track) return
    const rect = track.getBoundingClientRect()
    if (rect.width <= 0) return
    const next = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(100, Math.max(0, next)))
  }, [])

  useEffect(() => {
    if (!isDragging) return

    function onPointerMove(event: PointerEvent) {
      event.preventDefault()
      updateFromClientX(event.clientX)
    }

    function onPointerUp() {
      setIsDragging(false)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: false })
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'ew-resize'

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [isDragging, updateFromClientX])

  function startDrag(event: ReactPointerEvent) {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(true)
    updateFromClientX(event.clientX)
  }

  return (
    <article className="overflow-hidden rounded-[28px] border border-[#73A5CA]/14 bg-white shadow-[0_18px_48px_rgba(28,23,18,0.08)]">
      <div
        ref={trackRef}
        className="relative h-[260px] w-full touch-none select-none sm:h-[340px] lg:h-[400px]"
        onPointerDown={(event) => {
          // Allow tapping/clicking the image area to jump the divider.
          if ((event.target as HTMLElement).closest('[data-slider-handle]')) return
          startDrag(event)
        }}
      >
        <Image
          src={item.beforeImage}
          alt={`${item.title} before`}
          fill
          draggable={false}
          className="pointer-events-none object-cover"
          sizes="(min-width: 1024px) 50vw, 100vw"
          unoptimized
        />
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image
            src={item.afterImage}
            alt={`${item.title} after`}
            fill
            draggable={false}
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
            unoptimized
          />
        </div>

        {/* Vertical divider + draggable center handle */}
        <div
          className="absolute inset-y-0 z-20"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        >
          <div className="pointer-events-none absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(28,23,18,0.18)]" />
          <button
            type="button"
            data-slider-handle
            aria-label="Drag to compare before and after"
            onPointerDown={startDrag}
            className={`absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border-2 border-white bg-[#1c1712] text-white shadow-[0_10px_28px_rgba(28,23,18,0.35)] transition ${
              isDragging ? 'scale-110 ring-4 ring-[#E87F24]/35' : 'hover:scale-105'
            }`}
          >
            <GripVertical size={20} />
          </button>
        </div>

        <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-[#1c1712]/55 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white backdrop-blur-sm">
          {item.beforeLabel ?? 'Before'}
        </div>
        <div className="pointer-events-none absolute right-4 top-4 rounded-full bg-[#E87F24]/90 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white">
          {item.afterLabel ?? 'After'}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <h3 className="text-xl font-semibold text-[#1c1712]">{item.title}</h3>
        <p className="mt-2 text-sm leading-6 text-[#6e6256]">{item.copy}</p>
        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[#5d8fb2]">
          Press the center handle and drag left or right
        </p>
      </div>
    </article>
  )
}

export default function RenovaiteBeforeAfterSlider({
  label = 'Before & after',
  title,
  copy,
  items,
}: RenovaiteBeforeAfterSliderProps) {
  const slides = useMemo(() => items.filter((item) => item.beforeImage && item.afterImage), [items])

  if (!slides.length) return null

  return (
    <section className="relative overflow-hidden py-14 sm:py-18 lg:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(115,165,202,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(232,127,36,0.08),transparent_34%)]" />
      <div className="relative mx-auto w-full max-w-[1800px] px-5 sm:px-6 md:px-10 lg:px-16">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#73A5CA]/18 bg-white/82 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#5d8fb2]">
            <Sparkles size={12} className="text-[#E87F24]" />
            {label}
          </span>
          <h2 className="mt-5 text-[clamp(2rem,4vw,4.2rem)] font-black leading-[0.94] tracking-[-0.05em] text-[#1c1712]">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6e6256] sm:text-base">{copy}</p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {slides.map((item) => (
            <ComparisonCard key={`${item.title}-${item.beforeImage}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
