export type Exam = {
  slug: string
  name: string
  shortName: string
  tagline: string
  description: string
  badge?: string
  region: string
}

export const exams: Exam[] = [
  {
    slug: 'spm',
    name: 'SPM English Speaking Success',
    shortName: 'SPM',
    tagline: 'Build Confidence. Speak Better. Score Better.',
    description:
      "Malaysia's 1st SPM English Speaking App — practise Parts 1–3 with AI role-play, instant feedback, and gamified learning.",
    badge: '1st SPM English Speaking App in Malaysia',
    region: 'Malaysia',
  },
]

export function getExamBySlug(slug: string): Exam | undefined {
  return exams.find((exam) => exam.slug === slug)
}
