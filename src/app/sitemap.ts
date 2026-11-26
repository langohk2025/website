import type { MetadataRoute } from 'next'
import { getAllNewsArticles } from '@/lib/sanity'
import {
  absoluteUrl,
  INTERNATIONAL_SCHOOLS_PATH,
  PUBLIC_STATIC_PATHS,
  SPM_EXAM_PATH,
  TRUST_PATH,
} from '@/lib/site'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = PUBLIC_STATIC_PATHS.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority:
      path === '/'
        ? 1
        : path === SPM_EXAM_PATH || path === INTERNATIONAL_SCHOOLS_PATH || path === '/product/'
          ? 0.9
          : path === TRUST_PATH
            ? 0.8
            : 0.7,
  }))

  const articles = await getAllNewsArticles()
  const newsEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: absoluteUrl(`/news/${article.slug}/`),
    lastModified: article.date ? new Date(article.date) : now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticEntries, ...newsEntries]
}
