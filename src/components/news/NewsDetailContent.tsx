'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, User } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import type { NewsArticle } from '@/lib/sanity.locales'
import { formatNewsDate, getLocalizedValue } from '@/lib/sanity.locales'
import { PageContainer, Section } from '@/components/ui/section'
import { H2, P3, P4 } from '@/components/ui/typography'
import { PressableLink, Reveal } from '@/components/ui/motion'
import { NewsBody } from '@/components/news/NewsBody'

type NewsDetailContentProps = {
  item: NewsArticle
}

export function NewsDetailContent({ item }: NewsDetailContentProps) {
  const { t, currentLanguage } = useLanguage()
  const title = getLocalizedValue(item.title, currentLanguage)
  const excerpt = getLocalizedValue(item.excerpt, currentLanguage)
  const body = item.body?.[currentLanguage] ?? item.body?.en

  return (
    <Section className="pb-16 pt-6 lg:pb-24 lg:pt-10">
      <PageContainer>
        <div className="mx-auto flex max-w-[760px] flex-col gap-8">
          <Reveal>
            <Link
              href="/news"
              className="pressable inline-flex w-fit items-center gap-2 font-inter text-sm text-font-400 transition-colors hover:text-font-500"
            >
              <ArrowLeft className="size-4" strokeWidth={2} />
              {t('nav.news')}
            </Link>
          </Reveal>

          <Reveal delay={0.05} direction="scale">
            <div className="relative h-[280px] w-full overflow-hidden rounded-[19px] bg-[#d3a7ee] sm:h-[360px]">
              <Image
                src={item.imageSrc}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 760px"
                priority
              />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex flex-wrap items-center justify-between gap-y-2">
              <div className="flex items-center gap-1">
                <Calendar className="size-3.5 shrink-0 text-font-400" strokeWidth={1.75} />
                <P4>{formatNewsDate(item.date, currentLanguage)}</P4>
              </div>
              <div className="flex items-center gap-1">
                <User className="size-3.5 shrink-0 text-font-400" strokeWidth={1.75} />
                <P4>{item.author}</P4>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <H2 as="h1" className="text-[clamp(1.75rem,4vw,2.5rem)] text-[#101828]">
              {title}
            </H2>
          </Reveal>

          <Reveal delay={0.12}>
            <P3 className="text-[#6a7282]">{excerpt}</P3>
          </Reveal>

          {body && (
            <Reveal delay={0.14}>
              <NewsBody value={body} />
            </Reveal>
          )}

          {item.href && (
            <Reveal delay={0.16}>
              <div>
                <PressableLink
                  href={item.href}
                  variant="primary"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex gap-1 px-6 py-3 text-base shadow-none"
                >
                  <span className="font-poppins text-base font-medium text-bg-500">
                    {t('news.read_more')}
                  </span>
                </PressableLink>
              </div>
            </Reveal>
          )}
        </div>
      </PageContainer>
    </Section>
  )
}
