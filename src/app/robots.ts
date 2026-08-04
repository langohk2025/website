import type { MetadataRoute } from 'next'
import { NOINDEX_PATH_PREFIXES, SITE_URL } from '@/lib/site'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [...NOINDEX_PATH_PREFIXES],
      },
      // Explicit allow for major generative / AI search crawlers
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: [...NOINDEX_PATH_PREFIXES],
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: [...NOINDEX_PATH_PREFIXES],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: [...NOINDEX_PATH_PREFIXES],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: [...NOINDEX_PATH_PREFIXES],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: [...NOINDEX_PATH_PREFIXES],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: [...NOINDEX_PATH_PREFIXES],
      },
      {
        userAgent: 'Applebot-Extended',
        allow: '/',
        disallow: [...NOINDEX_PATH_PREFIXES],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
