import {
  Award,
  BookOpen,
  Compass,
  Globe2,
  LineChart,
  MessageSquare,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'

export type CurriculumTrack = {
  slug: string
  icon: LucideIcon
  badgeKey: string
  titleKey: string
  descKey: string
  points: readonly string[]
}

export const curriculumTracks: readonly CurriculumTrack[] = [
  {
    slug: 'ib',
    icon: Globe2,
    badgeKey: 'intl.tracks.ib.badge',
    titleKey: 'intl.tracks.ib.title',
    descKey: 'intl.tracks.ib.desc',
    points: [
      'intl.tracks.ib.p1',
      'intl.tracks.ib.p2',
      'intl.tracks.ib.p3',
    ],
  },
  {
    slug: 'igcse',
    icon: BookOpen,
    badgeKey: 'intl.tracks.igcse.badge',
    titleKey: 'intl.tracks.igcse.title',
    descKey: 'intl.tracks.igcse.desc',
    points: [
      'intl.tracks.igcse.p1',
      'intl.tracks.igcse.p2',
      'intl.tracks.igcse.p3',
    ],
  },
  {
    slug: 'eal',
    icon: Compass,
    badgeKey: 'intl.tracks.eal.badge',
    titleKey: 'intl.tracks.eal.title',
    descKey: 'intl.tracks.eal.desc',
    points: [
      'intl.tracks.eal.p1',
      'intl.tracks.eal.p2',
      'intl.tracks.eal.p3',
    ],
  },
  {
    slug: 'global-exams',
    icon: Award,
    badgeKey: 'intl.tracks.exams.badge',
    titleKey: 'intl.tracks.exams.title',
    descKey: 'intl.tracks.exams.desc',
    points: [
      'intl.tracks.exams.p1',
      'intl.tracks.exams.p2',
      'intl.tracks.exams.p3',
    ],
  },
] as const

export type ClassroomPillar = {
  icon: LucideIcon
  titleKey: string
  descKey: string
}

export const classroomPillars: readonly ClassroomPillar[] = [
  {
    icon: MessageSquare,
    titleKey: 'intl.workflow.speaking.title',
    descKey: 'intl.workflow.speaking.desc',
  },
  {
    icon: LineChart,
    titleKey: 'intl.workflow.rubric.title',
    descKey: 'intl.workflow.rubric.desc',
  },
  {
    icon: ShieldCheck,
    titleKey: 'intl.workflow.safeguarding.title',
    descKey: 'intl.workflow.safeguarding.desc',
  },
] as const

export const pilotSteps = [
  {
    titleKey: 'intl.pilot.step1.title',
    descKey: 'intl.pilot.step1.desc',
  },
  {
    titleKey: 'intl.pilot.step2.title',
    descKey: 'intl.pilot.step2.desc',
  },
  {
    titleKey: 'intl.pilot.step3.title',
    descKey: 'intl.pilot.step3.desc',
  },
] as const

export const internationalFaqs = [
  { questionKey: 'intl.faq.1.q', answerKey: 'intl.faq.1.a' },
  { questionKey: 'intl.faq.2.q', answerKey: 'intl.faq.2.a' },
  { questionKey: 'intl.faq.3.q', answerKey: 'intl.faq.3.a' },
  { questionKey: 'intl.faq.4.q', answerKey: 'intl.faq.4.a' },
  { questionKey: 'intl.faq.5.q', answerKey: 'intl.faq.5.a' },
] as const
