import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { NewsPageContent } from '@/components/news/NewsPageContent'
import { getAllNewsArticles } from '@/lib/sanity'

export const metadata: Metadata = {
  title: 'News | Lango.ai',
  description:
    'Latest news, events, and media coverage from Lango — AI-powered language learning for schools and families across Asia.',
}

export default async function NewsPage() {
  const articles = await getAllNewsArticles()

  return (
    <>
      <Header />
      <main className="bg-bg-500">
        <NewsPageContent articles={articles} />
      </main>
      <Footer />
    </>
  )
}
