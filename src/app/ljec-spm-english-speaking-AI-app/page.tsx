import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContactSection from '@/components/ContactSection'
import SpmExamContent from '@/components/exam/SpmExamContent'
import { JsonLd } from '@/components/JsonLd'
import { getExamBySlug } from '@/data/exams'
import { buildPageMetadata } from '@/lib/seo'
import { absoluteUrl, SPM_EXAM_PATH } from '@/lib/site'
import { buildFaqPageSchema, getSpmFaqEntries } from '@/lib/structured-data'

const exam = getExamBySlug('spm')

export const metadata = buildPageMetadata({
  title: 'SPM English Speaking Success | Lango.ai',
  description:
    "Malaysia's 1st SPM English Speaking App. Build confidence, practise Parts 1–3 with AI role-play, and get instant feedback. A collaboration by LJEC & Lango.",
  path: SPM_EXAM_PATH,
  image: {
    url: '/exam/spm-screen.png',
    width: 2048,
    height: 2048,
    alt: 'SPM English Speaking Success app',
  },
})

export default function SpmExamPage() {
  if (!exam) {
    notFound()
  }

  return (
    <>
      <JsonLd
        data={buildFaqPageSchema(getSpmFaqEntries(), absoluteUrl(SPM_EXAM_PATH))}
      />
      <Header />
      <main className="bg-bg-500">
        <SpmExamContent />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
