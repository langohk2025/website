'use client'

import { ClipboardList, PencilRuler, Rocket, type LucideIcon } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import AsiaMap from '@/components/AsiaMap'
import { PageContainer, Section } from '@/components/ui/section'
import { GlassCard } from '@/components/ui/GlassCard'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/motion'
import { H2, Label3, P3, P4, SectionHeading } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

/** Set to true to show partner logos + testimonial cards below the Asia map */
const SHOW_PARTNERS_TESTIMONIALS = false

const partners = [
  { letter: 'E', name: 'EduAsia', color: 'bg-blue-500' },
  { letter: 'L', name: 'LearnCo', color: 'bg-cyan-500' },
  { letter: 'B', name: 'BrightMind', color: 'bg-orange-500' },
  { letter: 'S', name: 'SchoolNet', color: 'bg-green-500' },
  { letter: 'T', name: 'TechEdu', color: 'bg-pink-500' },
  { letter: 'A', name: 'AcademiX', color: 'bg-indigo-500' },
  { letter: 'K', name: 'KidsBridge', color: 'bg-amber-500' },
  { letter: 'U', name: 'UniLearn', color: 'bg-teal-500' },
]

const testimonials = [
  {
    quote:
      'Lango transformed how our students engage with Mandarin. The gamified approach made speaking practice something they actually look forward to.',
    name: 'Dr. Sarah Lin',
    role: 'Head of Curriculum, EduAsia Network',
  },
  {
    quote:
      "The progress tracking dashboard gives our teachers real visibility into every student's speaking development. It has changed how we teach languages.",
    name: 'Prof. James Wong',
    role: 'Director of Studies, LearnCo International',
  },
]

function PartnerLogo({ letter, name, color }: { letter: string; name: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          'flex size-11 items-center justify-center rounded-full text-lg font-bold text-white',
          color
        )}
      >
        {letter}
      </div>
      <P4 className="text-font-500">{name}</P4>
    </div>
  )
}

function TestimonialCard({
  quote,
  name,
  role,
}: {
  quote: string
  name: string
  role: string
}) {
  return (
    <GlassCard hover className="rounded-[24px] p-7">
      <P3 className="mb-6 text-font-500">&ldquo;{quote}&rdquo;</P3>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-bg-100">
            Dr
          </div>
          <div>
            <p className="font-inter text-base font-medium text-font-600">{name}</p>
            <P4>{role}</P4>
          </div>
        </div>
        <div className="text-brand-400">★★★★★</div>
      </div>
    </GlassCard>
  )
}

export default function AsiaLearners() {
  const { t } = useLanguage()

  const collabSteps: {
    icon: LucideIcon
    titleKey: string
    descKey: string
  }[] = [
    {
      icon: ClipboardList,
      titleKey: 'home.asia.step1.title',
      descKey: 'home.asia.step1.desc',
    },
    {
      icon: PencilRuler,
      titleKey: 'home.asia.step2.title',
      descKey: 'home.asia.step2.desc',
    },
    {
      icon: Rocket,
      titleKey: 'home.asia.step3.title',
      descKey: 'home.asia.step3.desc',
    },
  ]

  return (
    <Section className="bg-bg-500 py-12 lg:py-24">
      <PageContainer>
        <div className="flex flex-col gap-12 lg:gap-24">
          <Reveal>
            <SectionHeading title={t('home.asia.title')} />
          </Reveal>

          <AsiaMap />

          {SHOW_PARTNERS_TESTIMONIALS && (
            <Reveal delay={0.06}>
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                <Stagger className="grid grid-cols-4 gap-6">
                  {partners.map((p) => (
                    <StaggerItem key={p.name}>
                      <PartnerLogo {...p} />
                    </StaggerItem>
                  ))}
                </Stagger>
                <Stagger className="flex flex-col gap-6" stagger={0.08}>
                  {testimonials.map((item) => (
                    <StaggerItem key={item.name}>
                      <TestimonialCard {...item} />
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            </Reveal>
          )}

          <div className="hidden flex-col items-center gap-16 lg:flex lg:gap-[108px]">
            <Reveal>
              <H2 className="text-center">{t('home.asia.collab_title')}</H2>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="relative w-full">
                <div className="mb-8 hidden items-center justify-center lg:flex">
                  {collabSteps.map((step, i) => (
                    <div key={step.titleKey} className="flex items-center">
                      <div className="flex size-[75px] items-center justify-center rounded-full bg-bg-100 shadow-lg">
                        <step.icon className="size-8 text-brand-500" strokeWidth={1.5} />
                      </div>
                      {i < collabSteps.length - 1 && (
                        <div className="h-0.5 w-[200px] border-t-2 border-dashed border-brand-300" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Stagger className="grid w-full grid-cols-1 gap-6 md:grid-cols-3" stagger={0.1}>
              {collabSteps.map((step) => (
                <StaggerItem key={step.titleKey}>
                  <GlassCard hover className="rounded-[19px] p-7">
                    <Label3 as="h3" className="mb-3">
                      {t(step.titleKey)}
                    </Label3>
                    <P3>{t(step.descKey)}</P3>
                  </GlassCard>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </PageContainer>
    </Section>
  )
}
