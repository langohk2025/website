import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContactSection from '@/components/ContactSection'
import SpmExamContent from '@/components/exam/SpmExamContent'
import { getExamBySlug } from '@/data/exams'

const exam = getExamBySlug('spm')

export const metadata: Metadata = {
  title: 'SPM English Speaking Success | Lango.ai',
  description:
    "Malaysia's 1st SPM English Speaking App. Build confidence, practise Parts 1–3 with AI role-play, and get instant feedback. A collaboration by LJEC & Lango.",
}

export default function SpmExamPage() {
  if (!exam) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="bg-bg-500">
        <SpmExamContent />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
