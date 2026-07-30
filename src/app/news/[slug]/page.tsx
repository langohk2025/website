import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { NewsDetailContent } from '@/components/news/NewsDetailContent'
import { getAllNewsArticles, getNewsArticleBySlug } from '@/lib/sanity'
import { getLocalizedValue } from '@/lib/sanity.locales'

type NewsDetailPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const articles = await getAllNewsArticles()
  return articles.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const item = await getNewsArticleBySlug(slug)

  if (!item) {
    return { title: 'News | Lango.ai' }
  }

  const title = getLocalizedValue(item.title, 'en', 'News')
  const description = getLocalizedValue(item.excerpt, 'en')

  return {
    title: `${title} | Lango.ai`,
    description,
  }
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params
  const item = await getNewsArticleBySlug(slug)

  if (!item) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="bg-bg-500">
        <NewsDetailContent item={item} />
      </main>
      <Footer />
    </>
  )
}
