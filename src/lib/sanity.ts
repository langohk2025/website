import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import type { NewsArticle, SanityNewsDocument } from './sanity.locales'
import { sanityLocalizedToApp } from './sanity.locales'
import { getStaticNewsArticles } from './static-news'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2025-01-01'

export const isSanityConfigured = Boolean(projectId)

export const sanityClient = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: process.env.NODE_ENV === 'production',
      token: process.env.SANITY_API_TOKEN,
    })
  : null

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null

export function urlForImage(source: SanityImageSource) {
  return builder?.image(source)
}

const ALL_NEWS_QUERY = `*[_type == "news" && published == true] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  body,
  publishedAt,
  author,
  category,
  image,
  externalUrl,
  published
}`

const NEWS_BY_SLUG_QUERY = `*[_type == "news" && slug.current == $slug && published == true][0] {
  _id,
  title,
  slug,
  excerpt,
  body,
  publishedAt,
  author,
  category,
  image,
  externalUrl,
  published
}`

function mapStaticNews(): NewsArticle[] {
  return getStaticNewsArticles()
}

function mapSanityNews(doc: SanityNewsDocument): NewsArticle {
  const imageSrc = doc.image
    ? urlForImage(doc.image)?.width(1200).height(800).fit('crop').url() ?? '/news-1.jpg'
    : '/news-1.jpg'

  return {
    slug: doc.slug.current,
    title: sanityLocalizedToApp(doc.title),
    excerpt: sanityLocalizedToApp(doc.excerpt),
    body: sanityLocalizedToApp(doc.body),
    date: doc.publishedAt,
    author: doc.author ?? 'Lango Team',
    categoryKey: doc.category ? `news.category.${doc.category}` : 'news.category.event',
    imageSrc,
    href: doc.externalUrl,
    source: 'sanity',
  }
}

export async function getAllNewsArticles(): Promise<NewsArticle[]> {
  if (!sanityClient) {
    return mapStaticNews()
  }

  try {
    const docs = await sanityClient.fetch<SanityNewsDocument[]>(ALL_NEWS_QUERY)
    if (!docs.length) {
      return mapStaticNews()
    }
    return docs.map(mapSanityNews)
  } catch (error) {
    console.error('Failed to fetch news from Sanity:', error)
    return mapStaticNews()
  }
}

export async function getNewsArticleBySlug(slug: string): Promise<NewsArticle | undefined> {
  if (!sanityClient) {
    return mapStaticNews().find((item) => item.slug === slug)
  }

  try {
    const doc = await sanityClient.fetch<SanityNewsDocument | null>(NEWS_BY_SLUG_QUERY, { slug })
    if (doc) {
      return mapSanityNews(doc)
    }
  } catch (error) {
    console.error(`Failed to fetch news slug "${slug}" from Sanity:`, error)
  }

  return mapStaticNews().find((item) => item.slug === slug)
}
