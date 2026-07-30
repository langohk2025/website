import Link from 'next/link'
import { ArrowRight, GraduationCap } from 'lucide-react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { GlassCard } from '@/components/ui/GlassCard'
import { PageContainer, Section } from '@/components/ui/section'
import { H1Gradient, H1Sub, Label2, Label3, Label6, P1, SectionHeading } from '@/components/ui/typography'
import { exams } from '@/data/exams'
import { cn } from '@/lib/utils'

/** Set to true to re-enable the exam listing page at /exam */
const EXAM_INDEX_ENABLED = false

export const metadata: Metadata = {
  title: 'Exam Preparation | Lango.ai',
  description:
    'AI-powered exam preparation for SPM, DSE, IELTS, TOEIC and more. Build speaking confidence with role-play practice and instant feedback.',
}

export default function ExamPage() {
  if (!EXAM_INDEX_ENABLED) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="bg-bg-500">
        <Section className="pb-16 pt-6 lg:pb-24 lg:pt-10">
          <PageContainer>
            <div className="flex flex-col items-center gap-16">
              <div className="flex flex-col items-center gap-5 text-center">
                <H1Gradient as="h1">Exam Preparation</H1Gradient>
                <H1Sub as="span">Speak with confidence on exam day</H1Sub>
                <P1 className="max-w-2xl">
                  Purpose-built programmes that align with national curricula and
                  international assessments. Practise speaking with AI role-play, get instant
                  feedback, and track your progress.
                </P1>
              </div>

              <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 xl:max-w-4xl">
                {exams.map((exam) => (
                  <Link key={exam.slug} href={`/exam/${exam.slug}`} className="group">
                    <GlassCard className="flex h-full flex-col gap-6 p-8 transition-transform duration-200 group-hover:-translate-y-1">
                      <div className="flex items-start justify-between gap-4">
                        <div
                          className={cn(
                            'flex size-[70px] items-center justify-center rounded-[18px]',
                            'bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end',
                            'shadow-[0px_11px_8px_rgba(201,43,151,0.2)]'
                          )}
                        >
                          <GraduationCap className="size-10 text-bg-100" strokeWidth={1.5} />
                        </div>
                        {exam.badge && (
                          <Label6 className="rounded-full bg-brand-300/40 px-3 py-1 text-brand-500">
                            {exam.region}
                          </Label6>
                        )}
                      </div>

                      <div className="flex flex-col gap-3">
                        <Label3 as="h2">{exam.name}</Label3>
                        <P1 className="text-base">{exam.description}</P1>
                        {exam.badge && (
                          <Label6 className="text-brand-500">{exam.badge}</Label6>
                        )}
                      </div>

                      <div className="mt-auto flex items-center gap-2 text-brand-500">
                        <Label2>Learn more</Label2>
                        <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </GlassCard>
                  </Link>
                ))}
              </div>

              <SectionHeading
                title="More exams coming soon"
                subtitle="We're expanding support for DSE, IELTS, TOEIC and other assessments. Get in touch to learn more."
                align="center"
              />
            </div>
          </PageContainer>
        </Section>
      </main>
      <Footer />
    </>
  )
}
