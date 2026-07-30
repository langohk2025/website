'use client'

import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { GlassCard } from '@/components/ui/GlassCard'
import { Reveal } from '@/components/ui/motion'
import { PageContainer, Section } from '@/components/ui/section'
import { Label3, P3, SectionHeading } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

const audienceKeys = [
  { image: '/figma/serve-1.png', titleKey: 'home.serve.early.title', descKey: 'home.serve.early.desc' },
  { image: '/figma/serve-2.png', titleKey: 'home.serve.primary.title', descKey: 'home.serve.primary.desc' },
  { image: '/figma/serve-3.png', titleKey: 'home.serve.secondary.title', descKey: 'home.serve.secondary.desc' },
  { image: '/figma/serve-4.png', titleKey: 'home.serve.higher.title', descKey: 'home.serve.higher.desc' },
  { image: '/figma/serve-5.png', titleKey: 'home.serve.vocational.title', descKey: 'home.serve.vocational.desc' },
  { image: '/figma/serve-6.png', titleKey: 'home.serve.partners.title', descKey: 'home.serve.partners.desc' },
]

function CarouselDots({
  count,
  active,
  onSelect,
}: {
  count: number
  active: number
  onSelect: (index: number) => void
}) {
  return (
    <div className="flex items-center gap-[3px]">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Slide ${i + 1}`}
          onClick={() => onSelect(i)}
          className={cn(
            'size-[7px] rounded-full transition-colors',
            i === active ? 'bg-brand-400' : 'bg-[#f6d0df]'
          )}
        />
      ))}
    </div>
  )
}

function ServeCard({
  image,
  title,
  description,
  className,
}: {
  image: string
  title: string
  description: string
  className?: string
}) {
  return (
    <GlassCard className={cn('flex h-[280px] w-[318px] shrink-0 snap-center flex-col overflow-hidden bg-bg-100 p-0', className)}>
      <div className="relative h-[173px] w-full overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col border-2 border-font-100 bg-gradient-to-br from-bg-400 to-[#fcf7fe] px-[17px] py-[13px]">
        <Label3 as="h3" className="mb-1 capitalize">
          {title}
        </Label3>
        <P3>{description}</P3>
      </div>
    </GlassCard>
  )
}

export default function WhoWeServe() {
  const { t } = useLanguage()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const scrollToIndex = useCallback((index: number) => {
    const container = scrollRef.current
    if (!container) return
    const card = container.children[index] as HTMLElement | undefined
    card?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    setActiveIndex(index)
  }, [])

  const handleScroll = useCallback(() => {
    const container = scrollRef.current
    if (!container) return
    const cards = Array.from(container.children) as HTMLElement[]
    const center = container.scrollLeft + container.clientWidth / 2
    let closest = 0
    let minDist = Infinity
    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      const dist = Math.abs(center - cardCenter)
      if (dist < minDist) {
        minDist = dist
        closest = i
      }
    })
    setActiveIndex(closest)
  }, [])

  return (
    <Section className="bg-bg-500 py-12 lg:py-[70px]">
      <PageContainer>
        <div className="flex flex-col items-center gap-6 lg:gap-16">
          <Reveal>
            <SectionHeading title={t('home.serve.title')} subtitle={<span className="hidden lg:inline">{t('home.serve.subtitle')}</span>} />
          </Reveal>

          {/* Mobile — horizontal carousel */}
          <div className="flex w-full flex-col items-center gap-4 lg:hidden">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="-mx-5 flex w-[calc(100%+2.5rem)] snap-x snap-mandatory gap-[25px] overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {audienceKeys.map((item) => (
                <ServeCard
                  key={item.titleKey}
                  image={item.image}
                  title={t(item.titleKey)}
                  description={t(item.descKey)}
                />
              ))}
            </div>
            <CarouselDots
              count={audienceKeys.length}
              active={activeIndex}
              onSelect={scrollToIndex}
            />
          </div>

          {/* Desktop — grid */}
          <div className="hidden w-full grid-cols-1 gap-[25px] sm:grid-cols-2 xl:grid-cols-3 lg:grid">
            {audienceKeys.map((item) => (
              <ServeCard
                key={item.titleKey}
                image={item.image}
                title={t(item.titleKey)}
                description={t(item.descKey)}
                className="w-full"
              />
            ))}
          </div>
        </div>
      </PageContainer>
    </Section>
  )
}
