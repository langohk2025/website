'use client'

import Image from 'next/image'
import {
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import ExamFaq from '@/components/exam/ExamFaq'
import { StoryworldVideoPlayer } from '@/components/storyworld/StoryworldVideoPlayer'
import { useLanguage } from '@/contexts/LanguageContext'
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
import {
  LJEC_LESSONS_URL,
  spmBooks,
  spmCtaPoints,
  spmExplainerVideo,
  spmExperts,
  spmFaqs,
  spmFeatures,
  spmSteps,
  spmUsps,
} from '@/data/spm-exam'
import { cn } from '@/lib/utils'

const partnerLogos = {
  ljec: {
    src: '/exam/ljec-logo.png',
    alt: 'Learning Journey Education Centre',
    width: 200,
    height: 31,
  },
  lango: {
    src: '/Lango_Logo.svg',
    alt: 'Lango',
    width: 131,
    height: 51,
  },
} as const

function PartnerLogo({
  partner,
  size = 'hero',
  className,
}: {
  partner: keyof typeof partnerLogos
  size?: 'hero' | 'card'
  className?: string
}) {
  const logo = partnerLogos[partner]
  const isLjec = partner === 'ljec'

  return (
    <div
      className={cn(
        'flex shrink-0 items-center',
        isLjec ? 'justify-end' : 'justify-start',
        size === 'hero' &&
          (isLjec
            ? 'h-[4.5rem] w-[220px] sm:h-20 sm:w-[280px] lg:h-24 lg:w-[340px]'
            : 'h-24 w-[200px] sm:h-24 sm:w-[230px] lg:h-28 lg:w-[280px]'),
        size === 'card' &&
          (isLjec ? 'h-12 w-[168px] sm:h-14 sm:w-[200px]' : 'h-16 w-[144px] sm:h-20 sm:w-[180px]'),
        className
      )}
    >
      <Image
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        className={cn(
          'max-h-full max-w-full object-contain',
          !isLjec && 'scale-110'
        )}
      />
    </div>
  )
}

function PartnerLogos({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex max-w-full flex-wrap items-center gap-x-0 gap-y-2',
        className
      )}
    >
      <PartnerLogo partner="ljec" />
      <span className="shrink-0 px-1 font-poppins text-2xl font-semibold text-font-400 sm:text-2xl lg:text-3xl">
        &amp;
      </span>
      <PartnerLogo partner="lango" className="-ml-1 sm:-ml-2" />
    </div>
  )
}

export default function SpmExamContent() {
  const { t } = useLanguage()

  return (
    <>
      {/* Hero */}
      <Section className="bg-bg-500 pb-16 pt-6 lg:pb-24 lg:pt-10">
        <PageContainer>
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
            <div className="flex flex-1 flex-col gap-8">
              <Reveal>
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-3">
                    <P3 className="font-medium text-brand-500">{t('spm.hero.collab')}</P3>
                    <PartnerLogos />
                  </div>
                  <div className="flex flex-col gap-3">
                    <H1Gradient as="h1">{t('spm.hero.title')}</H1Gradient>
                    <H1Sub as="span">{t('spm.hero.subtitle')}</H1Sub>
                  </div>
                  <div className="inline-flex w-fit rounded-full bg-brand-300/40 px-4 py-2">
                    <Label6 className="text-brand-500">{t('spm.hero.badge')}</Label6>
                  </div>
                  <P1 className="max-w-xl">{t('spm.hero.body')}</P1>
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="flex flex-wrap items-center gap-5">
                  <PressableLink href="#contact" variant="primary">
                    <Label2 className="whitespace-nowrap text-bg-100">
                      {t('spm.hero.cta_trial')}
                    </Label2>
                  </PressableLink>
                  <PressableLink href="#features" variant="secondary">
                    <Label2 className="whitespace-nowrap text-[#4f0b52]">
                      {t('spm.hero.cta_features')}
                    </Label2>
                  </PressableLink>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.12} className="w-full shrink-0 lg:w-[480px]">
              <div className="relative mx-auto aspect-square w-full max-w-[480px]">
                <Image
                  src="/exam/spm-screen.png"
                  alt={t('spm.hero.image_alt')}
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-contain"
                  priority
                />
              </div>
            </Reveal>
          </div>
        </PageContainer>
      </Section>

      {/* Intro + USPs */}
      <Section className="bg-bg-500 py-16 lg:py-20">
        <PageContainer>
          <div className="flex flex-col items-center gap-16">
            <Reveal>
              <SectionHeading
                title={t('spm.intro.title')}
                subtitle={t('spm.intro.subtitle')}
              />
            </Reveal>

            <Reveal delay={0.06} className="w-full max-w-4xl">
              <div className="flex flex-col items-center gap-4 text-center">
                <Label3 as="h3">{t('spm.video.title')}</Label3>
                <P3 className="max-w-2xl">{t('spm.video.subtitle')}</P3>
                <StoryworldVideoPlayer
                  youtubeId={spmExplainerVideo.youtubeId}
                  className="mt-2 w-full"
                />
              </div>
            </Reveal>

            <Stagger className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
              {spmUsps.map((usp) => (
                <StaggerItem key={usp.titleKey}>
                  <GlassCard className="flex items-start gap-5 p-8">
                    <div
                      className={cn(
                        'flex size-14 shrink-0 items-center justify-center rounded-2xl',
                        'bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end',
                        'shadow-[0px_8px_16px_rgba(201,43,151,0.2)]'
                      )}
                    >
                      <usp.icon className="size-7 text-bg-100" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label3 as="h3">{t(usp.titleKey)}</Label3>
                      <P3>{t(usp.descKey)}</P3>
                    </div>
                  </GlassCard>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </PageContainer>
      </Section>

      {/* Features */}
      <Section id="features" className="bg-bg-400 py-16 lg:py-20">
        <PageContainer>
          <div className="flex flex-col items-center gap-16">
            <Reveal>
              <SectionHeading
                title={t('spm.features.title')}
                subtitle={t('spm.features.subtitle')}
              />
            </Reveal>

            <Stagger className="grid w-full grid-cols-1 gap-[30px] md:grid-cols-2 xl:grid-cols-3">
              {spmFeatures.map((feature) => (
                <StaggerItem key={feature.titleKey}>
                  <GlassCard className="flex h-full flex-col p-8">
                    <div
                      className={cn(
                        'mb-5 flex size-[70px] items-center justify-center rounded-[18px]',
                        'bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end',
                        'shadow-[0px_11px_8px_rgba(201,43,151,0.2)]'
                      )}
                    >
                      <feature.icon className="size-10 text-bg-100" strokeWidth={1.5} />
                    </div>
                    <Label3 as="h3" className="mb-3">
                      {t(feature.titleKey)}
                    </Label3>
                    <P3>{t(feature.descKey)}</P3>
                  </GlassCard>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </PageContainer>
      </Section>

      {/* 3-step path */}
      <Section className="bg-bg-500 py-16 lg:py-20">
        <PageContainer>
          <div className="flex flex-col items-center gap-16">
            <Reveal>
              <SectionHeading
                title={t('spm.steps.title')}
                subtitle={t('spm.steps.subtitle')}
              />
            </Reveal>

            <Stagger className="grid w-full grid-cols-1 gap-8 lg:grid-cols-3">
              {spmSteps.map((step, index) => (
                <StaggerItem key={step.titleKey}>
                  <GlassCard className="relative flex h-full flex-col gap-4 p-8">
                    <span className="flex size-10 items-center justify-center rounded-full bg-brand-300/50 font-poppins text-lg font-bold text-brand-500">
                      {index + 1}
                    </span>
                    <Label3 as="h3">{t(step.titleKey)}</Label3>
                    <P3>{t(step.descKey)}</P3>
                  </GlassCard>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </PageContainer>
      </Section>

      {/* Experts */}
      <Section className="bg-bg-400 py-16 lg:py-20">
        <PageContainer>
          <div className="flex flex-col items-center gap-16">
            <Reveal>
              <SectionHeading
                title={t('spm.experts.title')}
                subtitle={t('spm.experts.subtitle')}
              />
            </Reveal>

            <Reveal className="w-full max-w-3xl">
              <div className="overflow-hidden rounded-[32px] shadow-[0_24px_48px_rgba(104,50,102,0.12)]">
                <Image
                  src="/exam/spm-teachers.jpeg"
                  alt={t('spm.experts.teachers_alt')}
                  width={2048}
                  height={2560}
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            </Reveal>

            <Stagger className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
              {spmExperts.map((expert) => (
                <StaggerItem key={expert.id}>
                  <GlassCard className="flex h-full flex-col gap-5 p-8">
                    <PartnerLogo
                      partner={expert.id === 'ljec' ? 'ljec' : 'lango'}
                      size="card"
                      className="justify-start"
                    />
                    <P3>{t(expert.descKey)}</P3>
                    {expert.href && expert.ctaKey && (
                      <a
                        href={expert.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto inline-flex items-center gap-2 text-brand-500 transition-opacity hover:opacity-80"
                      >
                        <Label6 className="text-brand-500">{t(expert.ctaKey)}</Label6>
                        <ArrowRight className="size-4" />
                      </a>
                    )}
                  </GlassCard>
                </StaggerItem>
              ))}
            </Stagger>

            <div className="flex w-full flex-col items-center gap-8">
              <Reveal>
                <div className="flex flex-col items-center gap-3 text-center">
                  <Label3 as="h3">{t('spm.experts.books.title')}</Label3>
                  <P3 className="max-w-xl">{t('spm.experts.books.desc')}</P3>
                  <a
                    href={LJEC_LESSONS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 text-brand-500 transition-opacity hover:opacity-80"
                  >
                    <Label6 className="text-brand-500">
                      {t('spm.experts.books.cta')}
                    </Label6>
                    <ArrowRight className="size-4" />
                  </a>
                </div>
              </Reveal>

              <Stagger className="grid w-full max-w-2xl grid-cols-2 gap-4 sm:gap-8">
                {spmBooks.map((book) => (
                  <StaggerItem key={book.src}>
                    <div className="overflow-hidden rounded-2xl shadow-[0_16px_32px_rgba(104,50,102,0.12)]">
                      <Image
                        src={book.src}
                        alt={t(book.altKey)}
                        width={1185}
                        height={1600}
                        className="h-auto w-full object-cover"
                        sizes="(max-width: 640px) 45vw, 320px"
                      />
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>
        </PageContainer>
      </Section>

      {/* FAQ */}
      <Section id="faq" className="bg-bg-500 py-16 lg:py-20">
        <PageContainer>
          <div className="flex flex-col items-center gap-12">
            <Reveal>
              <SectionHeading
                title={t('spm.faq.title')}
                subtitle={t('spm.faq.subtitle')}
              />
            </Reveal>
            <Reveal delay={0.08} className="w-full max-w-3xl">
              <ExamFaq items={spmFaqs} />
            </Reveal>
          </div>
        </PageContainer>
      </Section>

      {/* CTA */}
      <Section className="bg-bg-500 pb-16 lg:pb-24">
        <PageContainer>
          <Reveal>
            <GlassCard className="flex flex-col items-center gap-8 px-8 py-12 text-center lg:px-16 lg:py-16">
              <div className="flex flex-col gap-4">
                <H2 className="bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end bg-clip-text text-transparent">
                  {t('spm.cta.title')}
                </H2>
                <P1 className="max-w-2xl">{t('spm.cta.body')}</P1>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <PressableLink href="#contact" variant="primary" className="gap-3">
                  <Label2 className="text-bg-100">{t('spm.cta.button')}</Label2>
                  <ArrowRight className="size-5 text-bg-100" />
                </PressableLink>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6">
                {spmCtaPoints.map((key) => (
                  <span key={key} className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-brand-500" />
                    <Label6>{t(key)}</Label6>
                  </span>
                ))}
              </div>
            </GlassCard>
          </Reveal>
        </PageContainer>
      </Section>
    </>
  )
}
