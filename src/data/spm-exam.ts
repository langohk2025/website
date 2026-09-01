import {
  BarChart3,
  BookOpen,
  Bot,
  Clock,
  GraduationCap,
  MessageSquare,
  Mic,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

export const LJEC_LESSONS_URL = 'https://learningjourneyeducationcentre.my/our-lessons/'

export const spmExplainerVideo = {
  youtubeId: 'LZ82IqcrhUs',
} as const

export const spmUsps: {
  icon: LucideIcon
  titleKey: string
  descKey: string
}[] = [
  {
    icon: Clock,
    titleKey: 'spm.usp.access.title',
    descKey: 'spm.usp.access.desc',
  },
  {
    icon: GraduationCap,
    titleKey: 'spm.usp.syllabus.title',
    descKey: 'spm.usp.syllabus.desc',
  },
]

export const spmFeatures: {
  icon: LucideIcon
  titleKey: string
  descKey: string
}[] = [
  {
    icon: Bot,
    titleKey: 'spm.features.ai.title',
    descKey: 'spm.features.ai.desc',
  },
  {
    icon: MessageSquare,
    titleKey: 'spm.features.roleplay.title',
    descKey: 'spm.features.roleplay.desc',
  },
  {
    icon: Mic,
    titleKey: 'spm.features.feedback.title',
    descKey: 'spm.features.feedback.desc',
  },
  {
    icon: BookOpen,
    titleKey: 'spm.features.vocab.title',
    descKey: 'spm.features.vocab.desc',
  },
  {
    icon: Sparkles,
    titleKey: 'spm.features.practice.title',
    descKey: 'spm.features.practice.desc',
  },
  {
    icon: BarChart3,
    titleKey: 'spm.features.progress.title',
    descKey: 'spm.features.progress.desc',
  },
]

export const spmSteps: {
  titleKey: string
  descKey: string
}[] = [
  {
    titleKey: 'spm.steps.1.title',
    descKey: 'spm.steps.1.desc',
  },
  {
    titleKey: 'spm.steps.2.title',
    descKey: 'spm.steps.2.desc',
  },
  {
    titleKey: 'spm.steps.3.title',
    descKey: 'spm.steps.3.desc',
  },
]

export const spmExperts: {
  id: 'ljec' | 'app'
  descKey: string
  href?: string
  ctaKey?: string
}[] = [
  {
    id: 'ljec',
    descKey: 'spm.experts.ljec.desc',
    href: LJEC_LESSONS_URL,
    ctaKey: 'spm.experts.ljec.cta',
  },
  {
    id: 'app',
    descKey: 'spm.experts.app.desc',
  },
]

export const spmBooks = [
  {
    src: '/exam/spm-book-1.jpeg',
    altKey: 'spm.experts.books.1.alt',
  },
  {
    src: '/exam/spm-book-2.jpeg',
    altKey: 'spm.experts.books.2.alt',
  },
] as const

export const spmFaqs: {
  questionKey: string
  answerKey: string
}[] = [
  { questionKey: 'spm.faq.1.q', answerKey: 'spm.faq.1.a' },
  { questionKey: 'spm.faq.2.q', answerKey: 'spm.faq.2.a' },
  { questionKey: 'spm.faq.3.q', answerKey: 'spm.faq.3.a' },
  { questionKey: 'spm.faq.4.q', answerKey: 'spm.faq.4.a' },
  { questionKey: 'spm.faq.5.q', answerKey: 'spm.faq.5.a' },
  { questionKey: 'spm.faq.6.q', answerKey: 'spm.faq.6.a' },
  { questionKey: 'spm.faq.7.q', answerKey: 'spm.faq.7.a' },
  { questionKey: 'spm.faq.8.q', answerKey: 'spm.faq.8.a' },
]

export const spmCtaPoints = [
  'spm.cta.point1',
  'spm.cta.point2',
  'spm.cta.point3',
] as const
