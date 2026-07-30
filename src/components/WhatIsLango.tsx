'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import EcosystemDiagram from '@/components/EcosystemDiagram'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/motion'
import { PageContainer, Section } from '@/components/ui/section'
import { Label1, P3, SectionHeading } from '@/components/ui/typography'

export default function WhatIsLango() {
  const { t } = useLanguage()

  const stats = [
    { value: '500K+', labelKey: 'home.about.stat_learners' },
    { value: '12', labelKey: 'home.about.stat_languages' },
    { value: '50+', labelKey: 'home.about.stat_countries' },
    { value: '98%', labelKey: 'home.about.stat_satisfaction' },
  ]

  return (
    <Section
      id="about"
      className="relative bg-gradient-to-t from-bg-100 to-transparent pb-16 pt-16 lg:pb-44 lg:pt-36"
    >
      <PageContainer>
        <div className="relative flex flex-col items-center gap-8 lg:gap-20">
          <Reveal
            direction="scale"
            className="relative z-10 w-full max-w-[993px] lg:-mt-28"
          >
            <div className="glass rounded-[20px] px-6 py-8 shadow-[0px_8px_32px_rgba(104,50,102,0.1)] lg:px-8 lg:py-12">
              <Stagger
                className="grid grid-cols-2 items-center justify-items-center gap-6 sm:grid-cols-4 lg:flex lg:flex-wrap lg:justify-center lg:gap-[137px]"
                stagger={0.07}
                delayChildren={0.05}
              >
                {stats.map((stat) => (
                  <StaggerItem key={stat.labelKey} direction="up">
                    <div className="text-center lg:text-left">
                      <Label1 className="text-brand-500">{stat.value}</Label1>
                      <P3>{t(stat.labelKey)}</P3>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </Reveal>

          <Reveal delay={0.06} direction="up">
            <SectionHeading
              title={t('home.about.title')}
              subtitle={t('home.about.subtitle')}
            />
          </Reveal>

          <div className="w-full max-w-[1198px]">
            <EcosystemDiagram />
          </div>
        </div>
      </PageContainer>
    </Section>
  )
}
