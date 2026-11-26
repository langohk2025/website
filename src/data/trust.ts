import {
  FileCheck2,
  Lock,
  Mic,
  Scale,
  ShieldCheck,
  UserCheck,
  type LucideIcon,
} from 'lucide-react'

export type TrustPillar = {
  icon: LucideIcon
  titleKey: string
  descKey: string
  points: readonly string[]
}

export const trustPillars: readonly TrustPillar[] = [
  {
    icon: ShieldCheck,
    titleKey: 'trust.pillar.safeguarding.title',
    descKey: 'trust.pillar.safeguarding.desc',
    points: [
      'trust.pillar.safeguarding.p1',
      'trust.pillar.safeguarding.p2',
      'trust.pillar.safeguarding.p3',
    ],
  },
  {
    icon: Mic,
    titleKey: 'trust.pillar.voice.title',
    descKey: 'trust.pillar.voice.desc',
    points: [
      'trust.pillar.voice.p1',
      'trust.pillar.voice.p2',
      'trust.pillar.voice.p3',
    ],
  },
  {
    icon: Scale,
    titleKey: 'trust.pillar.compliance.title',
    descKey: 'trust.pillar.compliance.desc',
    points: [
      'trust.pillar.compliance.p1',
      'trust.pillar.compliance.p2',
      'trust.pillar.compliance.p3',
    ],
  },
  {
    icon: Lock,
    titleKey: 'trust.pillar.governance.title',
    descKey: 'trust.pillar.governance.desc',
    points: [
      'trust.pillar.governance.p1',
      'trust.pillar.governance.p2',
      'trust.pillar.governance.p3',
    ],
  },
] as const

export const voiceLifecycleSteps = [
  {
    icon: UserCheck,
    titleKey: 'trust.lifecycle.1.title',
    descKey: 'trust.lifecycle.1.desc',
  },
  {
    icon: Lock,
    titleKey: 'trust.lifecycle.2.title',
    descKey: 'trust.lifecycle.2.desc',
  },
  {
    icon: FileCheck2,
    titleKey: 'trust.lifecycle.3.title',
    descKey: 'trust.lifecycle.3.desc',
  },
] as const

export const trustFaqs = [
  { questionKey: 'trust.faq.1.q', answerKey: 'trust.faq.1.a' },
  { questionKey: 'trust.faq.2.q', answerKey: 'trust.faq.2.a' },
  { questionKey: 'trust.faq.3.q', answerKey: 'trust.faq.3.a' },
  { questionKey: 'trust.faq.4.q', answerKey: 'trust.faq.4.a' },
  { questionKey: 'trust.faq.5.q', answerKey: 'trust.faq.5.a' },
] as const
