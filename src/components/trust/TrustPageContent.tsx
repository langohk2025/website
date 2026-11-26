'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, Mail } from 'lucide-react'
import ExamFaq from '@/components/exam/ExamFaq'
import { GlassCard } from '@/components/ui/GlassCard'
import { PressableLink, Reveal, Stagger, StaggerItem } from '@/components/ui/motion'
import { PageContainer, Section } from '@/components/ui/section'
import {
  H1Gradient,
  H1Sub,
  H2,
  Label2,
  Label3,
  P1,
  P3,
  SectionHeading,
} from '@/components/ui/typography'
import { useLanguage } from '@/contexts/LanguageContext'
import { trustFaqs, trustPillars, voiceLifecycleSteps } from '@/data/trust'
import { cn } from '@/lib/utils'

export function TrustPageContent() {
  const { t } = useLanguage()

  return (
    <>
      <Section className="bg-bg-500 pb-16 pt-6 lg:pb-24 lg:pt-10">
        <PageContainer>
          <div className="flex max-w-[54rem] flex-col gap-8">
            <Reveal>
              <div className="flex flex-col gap-4">
                <span className="inline-flex w-fit items-center rounded-full border border-[rgba(199,126,185,0.3)] bg-bg-100/90 px-4 py-1.5 font-poppins text-xs font-semibold tracking-wide text-brand-500 sm:text-sm">
                  {t('trust.hero.badge')}
                </span>
                <H1Gradient as="h1" className="leading-[1.15]">
                  {t('trust.hero.title')}
                </H1Gradient>
                <H1Sub as="p">{t('trust.hero.subtitle')}</H1Sub>
                <P1 className="max-w-3xl">{t('trust.hero.body')}</P1>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="flex flex-wrap items-center gap-4">
                <PressableLink href="#contact" variant="primary" className="gap-2">
                  <Label2 className="whitespace-nowrap text-bg-100">
                    {t('trust.hero.cta_pack')}
                  </Label2>
                  <ArrowRight className="size-5 text-bg-100" />
                </PressableLink>
                <PressableLink href="/privacy-policy/" variant="secondary" className="gap-2">
                  <FileText className="size-5 text-[#4f0b52]" />
                  <Label2 className="whitespace-nowrap text-[#4f0b52]">
                    {t('trust.hero.cta_policy')}
                  </Label2>
                </PressableLink>
              </div>
            </Reveal>
          </div>
        </PageContainer>
      </Section>

      <Section className="bg-bg-400 py-16 lg:py-24">
        <PageContainer>
          <div className="flex flex-col gap-12 lg:gap-16">
            <Reveal>
              <SectionHeading
                title={t('trust.pillars.title')}
                subtitle={t('trust.pillars.subtitle')}
              />
            </Reveal>

            <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2" stagger={0.08}>
              {trustPillars.map((pillar) => (
                <StaggerItem key={pillar.titleKey}>
                  <GlassCard hover className="flex h-full flex-col gap-5 p-7 lg:p-9">
                    <div
                      className={cn(
                        'flex size-[58px] shrink-0 items-center justify-center rounded-[16px]',
                        'bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end',
                        'shadow-[0px_11px_8px_rgba(201,43,151,0.2)]'
                      )}
                    >
                      <pillar.icon className="size-7 text-bg-100" strokeWidth={1.6} />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label3 as="h3">{t(pillar.titleKey)}</Label3>
                      <P3>{t(pillar.descKey)}</P3>
                    </div>

                    <ul className="mt-auto flex flex-col gap-2.5 border-t border-font-200/50 pt-4">
                      {pillar.points.map((pointKey) => (
                        <li key={pointKey} className="flex items-start gap-2.5">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-500" />
                          <P3 className="text-sm text-font-500">{t(pointKey)}</P3>
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </PageContainer>
      </Section>

      <Section className="bg-bg-500 py-16 lg:py-24">
        <PageContainer>
          <div className="flex flex-col gap-12 lg:gap-16">
            <Reveal>
              <SectionHeading
                title={t('trust.lifecycle.title')}
                subtitle={t('trust.lifecycle.subtitle')}
              />
            </Reveal>

            <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-3" stagger={0.08}>
              {voiceLifecycleSteps.map((step, index) => (
                <StaggerItem key={step.titleKey}>
                  <GlassCard hover className="flex h-full flex-col gap-4 p-7 lg:p-8">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-300/45 font-poppins text-base font-bold text-brand-500">
                        {index + 1}
                      </span>
                      <step.icon className="size-5 text-brand-500" strokeWidth={1.75} />
                    </div>
                    <Label3 as="h3">{t(step.titleKey)}</Label3>
                    <P3>{t(step.descKey)}</P3>
                  </GlassCard>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </PageContainer>
      </Section>

      <Section className="bg-bg-400 py-16 lg:py-20">
        <PageContainer>
          <Reveal>
            <GlassCard hover={false} className="flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between lg:p-12">
              <div className="flex max-w-2xl flex-col gap-3">
                <H2>{t('trust.pack.title')}</H2>
                <P1>{t('trust.pack.body')}</P1>
                <div className="flex flex-wrap items-center gap-4 pt-2 text-sm text-font-500">
                  <a
                    href="mailto:privacy@lango.ai"
                    className="inline-flex items-center gap-2 font-poppins font-semibold text-brand-500 underline-offset-4 hover:underline"
                  >
                    <Mail className="size-4" />
                    privacy@lango.ai
                  </a>
                  <span aria-hidden className="text-font-200">|</span>
                  <Link
                    href="/privacy-policy/"
                    className="font-poppins font-medium text-font-500 underline-offset-4 hover:text-brand-500 hover:underline"
                  >
                    {t('footer.privacy')}
                  </Link>
                  <span aria-hidden className="text-font-200">|</span>
                  <Link
                    href="/terms/"
                    className="font-poppins font-medium text-font-500 underline-offset-4 hover:text-brand-500 hover:underline"
                  >
                    {t('footer.terms')}
                  </Link>
                </div>
              </div>

              <div className="shrink-0">
                <PressableLink href="#contact" variant="primary" className="gap-2">
                  <Label2 className="whitespace-nowrap text-bg-100">
                    {t('trust.pack.cta')}
                  </Label2>
                  <ArrowRight className="size-5 text-bg-100" />
                </PressableLink>
              </div>
            </GlassCard>
          </Reveal>
        </PageContainer>
      </Section>

      <Section id="faq" className="bg-bg-500 py-16 lg:py-24">
        <PageContainer>
          <div className="flex flex-col items-center gap-12">
            <Reveal>
              <SectionHeading
                title={t('trust.faq.title')}
                subtitle={t('trust.faq.subtitle')}
              />
            </Reveal>
            <Reveal delay={0.08} className="w-full max-w-3xl">
              <ExamFaq items={trustFaqs} />
            </Reveal>
          </div>
        </PageContainer>
      </Section>
    </>
  )
}
