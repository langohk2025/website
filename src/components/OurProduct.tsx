'use client'

import Link from 'next/link'
import {
  Briefcase,
  Building2,
  ChevronRight,
  GraduationCap,
  Home,
  Laptop,
  PenLine,
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { GlassCard } from '@/components/ui/GlassCard'
import { PressableButton, Reveal, Stagger, StaggerItem } from '@/components/ui/motion'
import { PageContainer, Section } from '@/components/ui/section'
import { Label3, Label6, P3, SectionHeading } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

const productKeys: {
  icon: typeof Building2
  titleKey: string
  descKey: string
  href?: string
}[] = [
  { icon: Building2, titleKey: 'home.product.school.title', descKey: 'home.product.school.desc' },
  { icon: Laptop, titleKey: 'home.product.class.title', descKey: 'home.product.class.desc' },
  { icon: Home, titleKey: 'home.product.home.title', descKey: 'home.product.home.desc' },
  { icon: PenLine, titleKey: 'home.product.pen.title', descKey: 'home.product.pen.desc' },
  {
    icon: GraduationCap,
    titleKey: 'home.product.exam.title',
    descKey: 'home.product.exam.desc',
  },
  {
    icon: Briefcase,
    titleKey: 'home.product.vocational.title',
    descKey: 'home.product.vocational.desc',
  },
]

function LearnMoreButton({ href, label }: { href?: string; label: string }) {
  const button = (
    <PressableButton className="flex items-center gap-2 rounded-[30px] bg-bg-100 px-[14px] py-[5px]">
      <Label6 className="bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end bg-clip-text text-transparent">
        {label}
      </Label6>
      <ChevronRight className="h-4 w-4 text-brand-500" />
    </PressableButton>
  )

  if (href) {
    return <Link href={href}>{button}</Link>
  }

  return button
}

function ProductCard({
  product,
  title,
  description,
  learnMoreLabel,
  compact = false,
}: {
  product: (typeof productKeys)[number]
  title: string
  description: string
  learnMoreLabel: string
  compact?: boolean
}) {
  return (
    <GlassCard
      className={cn(
        'flex flex-col',
        compact ? 'gap-2 p-4 lg:gap-0 lg:p-8' : 'p-8'
      )}
    >
      <div className={cn('flex items-center justify-between', compact ? 'mb-0' : 'mb-5')}>
        <div
          className={cn(
            'flex items-center justify-center rounded-[12.5px] bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end',
            'shadow-[0px_7.813px_5.859px_rgba(0,0,0,0.1)]',
            compact ? 'size-[50px]' : 'size-[70px] rounded-[18px] shadow-[0px_11px_8px_rgba(201,43,151,0.2)]'
          )}
        >
          <product.icon
            className={cn('text-bg-100', compact ? 'size-7' : 'size-10')}
            strokeWidth={1.5}
          />
        </div>
        <LearnMoreButton href={product.href ?? '/product'} label={learnMoreLabel} />
      </div>
      <Label3 as="h3" className={cn(compact ? 'mb-0 pt-2' : 'mb-3 pt-2')}>
        {title}
      </Label3>
      <P3>{description}</P3>
    </GlassCard>
  )
}

export default function OurProduct() {
  const { t } = useLanguage()
  const learnMore = t('home.product.learn_more')

  return (
    <Section id="products" className="bg-bg-500 py-12 lg:py-20">
      <PageContainer>
        <div className="flex flex-col items-center gap-10 lg:gap-16">
          <Reveal>
            <SectionHeading
              title={t('home.product.title')}
              subtitle={<span className="hidden lg:inline">{t('home.product.subtitle')}</span>}
            />
          </Reveal>

          {/* Mobile — single column compact cards */}
          <div className="flex w-full max-w-[347px] flex-col gap-6 lg:hidden">
            {productKeys.map((product) => (
              <ProductCard
                key={product.titleKey}
                product={product}
                title={t(product.titleKey)}
                description={t(product.descKey)}
                learnMoreLabel={learnMore}
                compact
              />
            ))}
          </div>

          {/* Desktop — grid */}
          <Stagger className="hidden w-full grid-cols-1 gap-[30px] sm:grid-cols-2 xl:grid-cols-3 lg:grid">
            {productKeys.map((product) => (
              <StaggerItem key={product.titleKey}>
                <GlassCard className="flex flex-col p-8">
                  <div className="mb-5 flex items-center justify-between">
                    <div
                      className={cn(
                        'flex size-[70px] items-center justify-center rounded-[18px]',
                        'bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end',
                        'shadow-[0px_11px_8px_rgba(201,43,151,0.2)]'
                      )}
                    >
                      <product.icon className="size-10 text-bg-100" strokeWidth={1.5} />
                    </div>
                    <LearnMoreButton href={product.href ?? '/product'} label={learnMore} />
                  </div>
                  <Label3 as="h3" className="mb-3 pt-2">
                    {t(product.titleKey)}
                  </Label3>
                  <P3>{t(product.descKey)}</P3>
                </GlassCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </PageContainer>
    </Section>
  )
}
