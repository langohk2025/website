import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { JsonLd } from '@/components/JsonLd'
import { NewsDetailContent } from '@/components/news/NewsDetailContent'
import { getAllNewsArticles, getNewsArticleBySlug } from '@/lib/sanity'
import { getLocalizedValue } from '@/lib/sanity.locales'
import { buildPageMetadata } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'
import { buildNewsArticleSchema } from '@/lib/structured-data'

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

  return buildPageMetadata({
    title: `${title} | Lango.ai`,
    description,
    path: `/news/${slug}/`,
    image: {
      url: item.imageSrc,
      alt: title,
    },
  })
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params
  const item = await getNewsArticleBySlug(slug)

  if (!item) {
    notFound()
  }

  const title = getLocalizedValue(item.title, 'en', 'News')
  const description = getLocalizedValue(item.excerpt, 'en')

  return (
    <>
      <JsonLd
        data={buildNewsArticleSchema({
          title,
          description,
          url: absoluteUrl(`/news/${slug}/`),
          imageUrl: item.imageSrc,
          datePublished: item.date,
          author: item.author,
        })}
      />
      <Header />
      <main className="bg-bg-500">
        <NewsDetailContent item={item} />
      </main>
      <Footer />
    </>
  )
}
