'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react'
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
  Label6,
  P1,
  P3,
  SectionHeading,
} from '@/components/ui/typography'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  classroomPillars,
  curriculumTracks,
  internationalFaqs,
  pilotSteps,
} from '@/data/international-schools'
import { SPM_EXAM_PATH, TRUST_PATH } from '@/lib/site'
import { cn } from '@/lib/utils'

export function InternationalSchoolsContent() {
  const { t } = useLanguage()

  return (
    <>
      <Section className="bg-bg-500 pb-16 pt-6 lg:pb-24 lg:pt-10">
        <PageContainer>
          <div className="flex max-w-[54rem] flex-col gap-8">
            <Reveal>
              <div className="flex flex-col gap-4">
                <span className="inline-flex w-fit items-center rounded-full border border-[rgba(199,126,185,0.3)] bg-bg-100/90 px-4 py-1.5 font-poppins text-xs font-semibold tracking-wide text-brand-500 sm:text-sm">
                  {t('intl.hero.badge')}
                </span>
                <H1Gradient as="h1" className="leading-[1.15]">
                  {t('intl.hero.title')}
                </H1Gradient>
                <H1Sub as="p">{t('intl.hero.subtitle')}</H1Sub>
                <P1 className="max-w-3xl">{t('intl.hero.body')}</P1>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="flex flex-wrap items-center gap-4">
                <PressableLink href="#contact" variant="primary" className="gap-2">
                  <Label2 className="whitespace-nowrap text-bg-100">
                    {t('intl.hero.cta_pilot')}
                  </Label2>
                  <ArrowRight className="size-5 text-bg-100" />
                </PressableLink>
                <PressableLink href={TRUST_PATH} variant="secondary" className="gap-2">
                  <ShieldCheck className="size-5 text-[#4f0b52]" />
                  <Label2 className="whitespace-nowrap text-[#4f0b52]">
                    {t('intl.hero.cta_trust')}
                  </Label2>
                </PressableLink>
              </div>
            </Reveal>
          </div>
        </PageContainer>
      </Section>

      <Section id="curricula" className="bg-bg-400 py-16 lg:py-24">
        <PageContainer>
          <div className="flex flex-col gap-12 lg:gap-16">
            <Reveal>
              <SectionHeading
                title={t('intl.tracks.title')}
                subtitle={t('intl.tracks.subtitle')}
              />
            </Reveal>

            <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2" stagger={0.08}>
              {curriculumTracks.map((track) => (
                <StaggerItem key={track.slug}>
                  <GlassCard hover className="flex h-full flex-col gap-5 p-7 lg:p-9">
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className={cn(
                          'flex size-[60px] shrink-0 items-center justify-center rounded-[16px]',
                          'bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end',
                          'shadow-[0px_11px_8px_rgba(201,43,151,0.2)]'
                        )}
                      >
                        <track.icon className="size-8 text-bg-100" strokeWidth={1.5} />
                      </div>
                      <Label6 className="rounded-full bg-brand-300/35 px-3 py-1 text-xs text-brand-500 sm:text-sm">
                        {t(track.badgeKey)}
                      </Label6>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label3 as="h3">{t(track.titleKey)}</Label3>
                      <P3>{t(track.descKey)}</P3>
                    </div>

                    <ul className="mt-auto flex flex-col gap-2.5 border-t border-font-200/50 pt-4">
                      {track.points.map((pointKey) => (
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

            <Reveal delay={0.06}>
              <div className="flex flex-wrap items-center justify-center gap-3 text-center">
                <P3 className="text-font-500">{t('intl.tracks.spm_note')}</P3>
                <Link
                  href={SPM_EXAM_PATH}
                  className="inline-flex items-center gap-1 font-poppins text-sm font-semibold text-brand-500 underline-offset-4 hover:underline"
                >
                  {t('intl.tracks.spm_link')}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </PageContainer>
      </Section>

      <Section className="bg-bg-500 py-16 lg:py-24">
        <PageContainer>
          <div className="flex flex-col gap-12 lg:gap-16">
            <Reveal>
              <SectionHeading
                title={t('intl.workflow.title')}
                subtitle={t('intl.workflow.subtitle')}
              />
            </Reveal>

            <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-3" stagger={0.08}>
              {classroomPillars.map((pillar) => (
                <StaggerItem key={pillar.titleKey}>
                  <GlassCard hover className="flex h-full flex-col gap-4 p-7 lg:p-8">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-300/40 text-brand-500">
                      <pillar.icon className="size-6" strokeWidth={1.75} />
                    </div>
                    <Label3 as="h3">{t(pillar.titleKey)}</Label3>
                    <P3>{t(pillar.descKey)}</P3>
                  </GlassCard>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </PageContainer>
      </Section>

      <Section id="pilot" className="bg-bg-400 py-16 lg:py-24">
        <PageContainer>
          <Reveal>
            <GlassCard hover={false} className="flex flex-col gap-10 p-8 lg:p-12">
              <div className="flex max-w-3xl flex-col gap-3">
                <span className="font-poppins text-sm font-semibold text-brand-500">
                  {t('intl.pilot.badge')}
                </span>
                <H2>{t('intl.pilot.title')}</H2>
                <P1>{t('intl.pilot.subtitle')}</P1>
              </div>

              <ol className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {pilotSteps.map((step, index) => (
                  <li
                    key={step.titleKey}
                    className="flex flex-col gap-3 rounded-[20px] border border-font-200/60 bg-bg-100/90 p-6"
                  >
                    <span className="flex size-9 items-center justify-center rounded-full bg-brand-300/45 font-poppins text-base font-bold text-brand-500">
                      {index + 1}
                    </span>
                    <Label3 as="h3">{t(step.titleKey)}</Label3>
                    <P3 className="text-sm">{t(step.descKey)}</P3>
                  </li>
                ))}
              </ol>

              <div className="flex flex-wrap items-center gap-4">
                <PressableLink href="#contact" variant="primary" className="gap-2">
                  <Label2 className="text-bg-100">{t('intl.pilot.cta')}</Label2>
                  <ArrowRight className="size-5 text-bg-100" />
                </PressableLink>
                <Link
                  href={TRUST_PATH}
                  className="inline-flex items-center gap-2 font-poppins text-sm font-semibold text-font-500 underline-offset-4 hover:text-brand-500 hover:underline"
                >
                  <ShieldCheck className="size-4 text-brand-500" />
                  {t('intl.pilot.trust_link')}
                </Link>
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
                title={t('intl.faq.title')}
                subtitle={t('intl.faq.subtitle')}
              />
            </Reveal>
            <Reveal delay={0.08} className="w-full max-w-3xl">
              <ExamFaq items={internationalFaqs} />
            </Reveal>
          </div>
        </PageContainer>
      </Section>
    </>
  )
}
