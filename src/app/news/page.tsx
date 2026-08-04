import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { NewsPageContent } from '@/components/news/NewsPageContent'
import { getAllNewsArticles } from '@/lib/sanity'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: 'News | Lango.ai',
  description:
    'Latest news, events, and media coverage from Lango — AI-powered language learning for schools and families across Asia.',
  path: '/news/',
})

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
