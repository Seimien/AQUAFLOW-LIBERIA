import React, { useEffect, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'

export interface CarouselCard {
  icon: LucideIcon
  title: string
  body: string
}

interface FeatureCarouselProps {
  cards: CarouselCard[]
  intervalMs?: number
}

/** Auto-sliding, swipeable feature carousel used on the landing page. */
export function FeatureCarousel({ cards, intervalMs = 1500 }: FeatureCarouselProps) {
  const [index, setIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const paused = useRef(false)

  useEffect(() => {
    const t = setInterval(() => {
      if (!paused.current) setIndex(i => (i + 1) % cards.length)
    }, intervalMs)
    return () => clearInterval(t)
  }, [cards.length, intervalMs])

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
    paused.current = true
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (delta > 40) setIndex(i => (i - 1 + cards.length) % cards.length)
    else if (delta < -40) setIndex(i => (i + 1) % cards.length)
    touchStartX.current = null
    setTimeout(() => { paused.current = false }, 400)
  }

  return (
    <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="relative overflow-hidden rounded-3xl">
        <div
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {cards.map((c, i) => (
            <div key={i} className="w-full shrink-0 px-0.5">
              <div className="rounded-3xl p-6 shadow-lift" style={{ background: 'linear-gradient(150deg, var(--navy) 0%, var(--navy-2) 100%)' }}>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <c.icon size={22} color="var(--aqua-2)" />
                </div>
                <h3 className="mt-5 text-[16px] font-display font-semibold text-white">{c.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.62)' }}>{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-center gap-1.5">
        {cards.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className="h-1.5 rounded-full transition-all"
            style={{ width: i === index ? 18 : 6, background: i === index ? 'var(--aqua)' : 'var(--secondary)' }}
          />
        ))}
      </div>
    </div>
  )
}
