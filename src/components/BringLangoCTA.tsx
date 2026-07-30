'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { PressableLink, Reveal } from '@/components/ui/motion'
import { PageContainer, Section } from '@/components/ui/section'
import { H2, Label2 } from '@/components/ui/typography'

export default function BringLangoCTA() {
  const { t } = useLanguage()

  return (
    <Section className="bg-bg-500 py-12 lg:py-24">
      <PageContainer>
        <div className="flex flex-col items-center justify-center gap-8 lg:flex-row lg:gap-[149px]">
          <Reveal className="relative size-[300px] shrink-0 lg:size-[522px]">
            <div className="absolute inset-0 rounded-full bg-brand-300/25 blur-3xl" aria-hidden />
            <Image
              src="/figma/cta-phones.png"
              alt={t('home.cta.image_alt')}
              fill
              className="object-contain"
            />
          </Reveal>

          <Reveal delay={0.08} className="flex max-w-[599px] flex-col items-center gap-6 text-center lg:items-start lg:gap-8 lg:text-left">
            <H2 className="bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end bg-clip-text text-transparent">
              {t('home.cta.title_line1')}
              <br />
              {t('home.cta.title_line2')}
            </H2>

            <PressableLink
              href="#contact"
              variant="secondary"
              className="!h-auto w-fit gap-6 !rounded-full !border-0 !bg-bg-100 px-6 py-[5px] shadow-[0px_13px_10px_rgba(0,0,0,0.1)] lg:px-9 lg:py-2"
            >
              <Label2 className="text-base text-brand-500 lg:text-[21px]">{t('nav.book_demo')}</Label2>
              <span className="flex size-11 items-center justify-center rounded-full bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end lg:size-14">
                <ArrowRight className="size-5 text-bg-100 lg:size-6" />
              </span>
            </PressableLink>
          </Reveal>
        </div>
      </PageContainer>
    </Section>
  )
}
