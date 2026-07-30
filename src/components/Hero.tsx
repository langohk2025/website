'use client'

import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { PageContainer, Section } from '@/components/ui/section'
import { PressableLink, Reveal } from '@/components/ui/motion'
import { H1Gradient, H1Sub, Label2, Label4, P1 } from '@/components/ui/typography'

export default function Hero() {
  const { t } = useLanguage()

  return (
    <Section id="home" className="bg-bg-500 pb-12 pt-4 lg:pb-24 lg:pt-10">
      <PageContainer>
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-[49px]">
          <div className="flex w-full flex-1 flex-col items-center gap-6 text-center lg:items-start lg:gap-8 lg:text-left">
            <Reveal>
              <div className="flex flex-col gap-4 lg:gap-5">
                <div className="flex flex-col gap-1 lg:gap-0">
                  <H1Gradient
                    as="h1"
                    className="text-[38px] leading-[1.2] lg:text-[clamp(2.5rem,6vw,4.1875rem)] lg:leading-[1.5]"
                  >
                    {t('home.hero.line1')}
                  </H1Gradient>
                  <H1Sub
                    as="span"
                    className="text-[21px] leading-[1.2] lg:text-[clamp(1.75rem,3.5vw,2.375rem)] lg:leading-[1.5]"
                  >
                    {t('home.hero.line2')}
                  </H1Sub>
                </div>
                <P1 className="max-w-xl text-base lg:pl-[10px] lg:text-[clamp(1rem,1.5vw,1.3125rem)]">
                  {t('home.hero.subtitle')}
                </P1>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="flex flex-wrap items-center justify-center gap-5 lg:justify-start">
                <PressableLink
                  href="#contact"
                  variant="primary"
                  className="px-[70px] py-[18px] lg:px-[52px] lg:py-[13px]"
                >
                  <Label2 className="whitespace-nowrap text-bg-100">{t('nav.book_demo')}</Label2>
                </PressableLink>
                <PressableLink href="#products" variant="secondary" className="hidden sm:inline-flex">
                  <Label4 className="whitespace-nowrap text-[#4f0b52]">
                    {t('home.hero.explore')}
                  </Label4>
                </PressableLink>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12} direction="scale" className="w-full shrink-0 lg:w-[484px]">
            <div className="relative mx-auto aspect-[330/412] w-full max-w-[330px] lg:aspect-[484/605] lg:max-w-[484px]">
              <div
                aria-hidden
                className="absolute left-0 top-0 h-[92%] w-[99%] rounded-b-[163px] bg-gradient-to-b from-bg-500 to-white lg:rounded-b-[240px]"
              />
              <Image
                src="/hero-figma.png"
                alt={t('home.hero.image_alt')}
                fill
                sizes="(max-width: 1024px) 330px, 484px"
                className="object-contain object-bottom"
                priority
              />
            </div>
          </Reveal>
        </div>
      </PageContainer>
    </Section>
  )
}
