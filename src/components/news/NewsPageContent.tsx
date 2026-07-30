'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import type { NewsArticle } from '@/lib/sanity.locales'
import { formatNewsDate, getLocalizedValue } from '@/lib/sanity.locales'
import { PageContainer, Section } from '@/components/ui/section'
import { H2 } from '@/components/ui/typography'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/motion'
import { NewsCard } from '@/components/news/NewsCard'

type NewsPageContentProps = {
  articles: NewsArticle[]
}

export function NewsPageContent({ articles }: NewsPageContentProps) {
  const { t, currentLanguage } = useLanguage()

  return (
    <Section className="pb-16 pt-6 lg:pb-24 lg:pt-10">
      <PageContainer>
        <div className="flex flex-col items-center gap-16">
          <Reveal>
            <H2 as="h1" className="w-full text-center text-[50px]">
              {t('nav.news')}
            </H2>
          </Reveal>

          <Stagger className="flex flex-wrap justify-center gap-x-[15px] gap-y-[33px]">
            {articles.map((item) => (
              <StaggerItem key={item.slug} className="w-full sm:w-[calc(50%-8px)] lg:w-[390px]">
                <NewsCard
                  slug={item.slug}
                  title={getLocalizedValue(item.title, currentLanguage)}
                  excerpt={getLocalizedValue(item.excerpt, currentLanguage)}
                  date={formatNewsDate(item.date, currentLanguage)}
                  author={item.author}
                  imageSrc={item.imageSrc}
                  readMoreLabel={t('news.read_more')}
                  href={item.href}
                />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </PageContainer>
    </Section>
  )
}
