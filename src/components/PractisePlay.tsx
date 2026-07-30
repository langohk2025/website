'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { PageContainer, Section } from '@/components/ui/section'
import { PressableButton, Reveal } from '@/components/ui/motion'
import { H2, Label1, Label3, P1, P3 } from '@/components/ui/typography'
import { springSnappy } from '@/lib/motion'
import { cn } from '@/lib/utils'

type Tab = { id: string; label: string; title: string; description: string }

function TabPills({
  tabs,
  active,
  onChange,
  groupId,
}: {
  tabs: Tab[]
  active: string
  onChange: (id: string) => void
  groupId: string
}) {
  return (
    <div className="grid w-full grid-cols-3 gap-2 sm:gap-3">
      {tabs.map((tab) => (
        <PressableButton
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'relative z-10 flex w-full items-center justify-center rounded-full px-2 py-2 text-center text-[13px] leading-tight sm:px-3 sm:text-[15px] lg:px-5 lg:py-[6px] lg:text-[21px] lg:leading-[1.2]',
            active === tab.id
              ? 'font-poppins font-semibold text-bg-100'
              : 'bg-bg-400/80 font-poppins font-normal text-font-400'
          )}
        >
          {active === tab.id && (
            <motion.span
              layoutId={`tab-bg-${groupId}`}
              className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end"
              transition={springSnappy}
            />
          )}
          {tab.label}
        </PressableButton>
      ))}
    </div>
  )
}

function DotIndicator({
  count,
  active,
  onSelect,
  size = 'md',
}: {
  count: number
  active: number
  onSelect?: (index: number) => void
  size?: 'sm' | 'md'
}) {
  return (
    <div className={cn('flex items-center', size === 'sm' ? 'gap-[3px]' : 'gap-[9px]')}>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Tab ${i + 1}`}
          disabled={!onSelect}
          onClick={() => onSelect?.(i)}
          className={cn('rounded-full transition-all', onSelect && 'cursor-pointer')}
        >
          <motion.div
            animate={{
              width: i === active ? (size === 'sm' ? 7 : 16) : size === 'sm' ? 7 : 9,
              height: size === 'sm' ? 7 : 9,
              backgroundColor: i === active ? '#e77abb' : size === 'sm' ? '#f6d0df' : '#ead2e2',
            }}
            transition={springSnappy}
            className="rounded-full"
          />
        </button>
      ))}
    </div>
  )
}

function FeatureBlock({
  section,
  showHeading,
  groupId,
  heading,
}: {
  section: { imagePosition: 'left' | 'right'; image: string; tabs: Tab[] }
  showHeading?: boolean
  groupId: string
  heading?: string
}) {
  const [activeTab, setActiveTab] = useState(section.tabs[0].id)
  const reduceMotion = useReducedMotion()
  const activeIndex = section.tabs.findIndex((t) => t.id === activeTab)
  const tab = section.tabs[activeIndex] ?? section.tabs[0]

  const selectTabByIndex = (index: number) => {
    const next = section.tabs[index]
    if (next) setActiveTab(next.id)
  }

  return (
    <div className="flex flex-col gap-8 lg:gap-[120px]">
      {showHeading && heading && (
        <H2 className="text-center">
          {heading.split(' ').length > 3 ? (
            <>
              {heading.split(' ').slice(0, 3).join(' ')}
              <br className="lg:hidden" />
              <span className="lg:ml-1">{heading.split(' ').slice(3).join(' ')}</span>
            </>
          ) : (
            heading
          )}
        </H2>
      )}

      {/* Mobile layout — pill, copy, phone, dots */}
      <div className="flex w-full flex-col items-center gap-6 lg:hidden">
        <div className="flex w-full max-w-[350px] flex-col gap-3">
          <span className="inline-flex w-fit rounded-full bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end px-[22px] py-[5px] font-inter text-base font-semibold text-font-100">
            {tab.label}
          </span>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab.id}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'translateY(8px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'translateY(-6px)' }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col gap-2"
            >
              <Label3 as="h3">{tab.title}</Label3>
              <P3>{tab.description}</P3>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative mx-auto w-full max-w-[322px]">
          <Image
            src={section.image}
            alt={tab.title}
            width={995}
            height={2048}
            className="h-auto w-full"
            sizes="322px"
            priority={groupId === 'play-1'}
          />
        </div>

        <DotIndicator
          count={section.tabs.length}
          active={activeIndex}
          onSelect={selectTabByIndex}
          size="sm"
        />
      </div>

      {/* Desktop layout */}
      <div
        className={cn(
          'hidden w-full min-w-0 flex-col items-center gap-12 lg:flex lg:gap-16',
          section.imagePosition === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'
        )}
      >
        <div className="relative mx-auto w-full max-w-[409px] shrink-0">
          <Image
            src={section.image}
            alt={tab.title}
            width={995}
            height={2048}
            className="h-auto w-full"
            sizes="409px"
            priority={groupId === 'play-1'}
          />
        </div>

        <div className="flex w-full min-w-0 flex-1 flex-col gap-10">
          <TabPills
            tabs={section.tabs}
            active={activeTab}
            onChange={setActiveTab}
            groupId={groupId}
          />

          <div className="flex max-w-[494px] flex-col gap-10 lg:gap-[72px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab.id}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'translateY(8px)' }}
                animate={{ opacity: 1, transform: 'translateY(0px)' }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'translateY(-6px)' }}
                transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-col gap-4"
              >
                <Label1 as="h3">{tab.title}</Label1>
                <P1>{tab.description}</P1>
              </motion.div>
            </AnimatePresence>
          </div>
          <DotIndicator count={section.tabs.length} active={activeIndex} />
        </div>
      </div>
    </div>
  )
}

export default function PractisePlay() {
  const { t } = useLanguage()

  const sections = useMemo(
    () => [
      {
        imagePosition: 'left' as const,
        image: '/figma/screenshot-1.png',
        tabs: [
          {
            id: 'speaking',
            label: t('home.play.speaking.label'),
            title: t('home.play.speaking.title'),
            description: t('home.play.speaking.desc'),
          },
          {
            id: 'pronunciation',
            label: t('home.play.pronunciation.label'),
            title: t('home.play.pronunciation.title'),
            description: t('home.play.pronunciation.desc'),
          },
          {
            id: 'vocabulary',
            label: t('home.play.vocabulary.label'),
            title: t('home.play.vocabulary.title'),
            description: t('home.play.vocabulary.desc'),
          },
        ],
      },
      {
        imagePosition: 'right' as const,
        image: '/figma/screenshot-2.png',
        tabs: [
          {
            id: 'reward',
            label: t('home.play.reward.label'),
            title: t('home.play.reward.title'),
            description: t('home.play.reward.desc'),
          },
          {
            id: 'ranking',
            label: t('home.play.ranking.label'),
            title: t('home.play.ranking.title'),
            description: t('home.play.ranking.desc'),
          },
          {
            id: 'progress',
            label: t('home.play.progress.label'),
            title: t('home.play.progress.title'),
            description: t('home.play.progress.desc'),
          },
        ],
      },
    ],
    [t]
  )

  return (
    <Section className="bg-gradient-to-b from-transparent via-bg-500/50 to-[#f2c2ea]/35 py-12 lg:py-28">
      <PageContainer>
        <div className="flex flex-col gap-12 lg:gap-[120px]">
          <Reveal>
            <FeatureBlock
              section={sections[0]}
              showHeading
              groupId="play-1"
              heading={t('home.play.heading')}
            />
          </Reveal>
          <Reveal delay={0.05}>
            <FeatureBlock section={sections[1]} groupId="play-2" />
          </Reveal>
        </div>
      </PageContainer>
    </Section>
  )
}
