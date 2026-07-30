/**
 * Import existing static news (6 articles × 7 languages) into Sanity.
 *
 * Prerequisites:
 *   - NEXT_PUBLIC_SANITY_PROJECT_ID
 *   - NEXT_PUBLIC_SANITY_DATASET (default: production)
 *   - SANITY_API_TOKEN (Editor or Admin token)
 *
 * Usage:
 *   npm run sanity:seed
 */

import { createClient } from '@sanity/client'
import { readFileSync, existsSync } from 'node:fs'
import { basename, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')

function loadEnvFile(filename) {
  const filePath = join(root, filename)
  if (!existsSync(filePath)) return

  for (const line of readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const separator = trimmed.indexOf('=')
    if (separator === -1) continue
    const key = trimmed.slice(0, separator).trim()
    const value = trimmed.slice(separator + 1).trim()
    if (!(key in process.env)) {
      process.env[key] = value
    }
  }
}

loadEnvFile('.env.local')
loadEnvFile('.env')

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN in .env.local')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2025-01-01',
  token,
  useCdn: false,
})

const localeFields = [
  { language: 'en', field: 'en' },
  { language: 'zh-TW', field: 'zhTW' },
  { language: 'zh-CN', field: 'zhCN' },
  { language: 'ms', field: 'ms' },
  { language: 'id', field: 'idLang' },
  { language: 'ja', field: 'ja' },
  { language: 'my', field: 'my' },
]

const newsItems = [
  {
    id: 1,
    slug: '1',
    titleKey: 'news.item1.title',
    excerptKey: 'news.item1.excerpt',
    publishedAt: '2024-12-07T00:00:00.000Z',
    author: 'nexsoftech',
    category: 'competition',
    imageSrc: '/news-1.jpg',
  },
  {
    id: 2,
    slug: '2',
    titleKey: 'news.item2.title',
    excerptKey: 'news.item2.excerpt',
    publishedAt: '2025-05-15T00:00:00.000Z',
    author: 'nexsoftech',
    category: 'partnership',
    imageSrc: '/news-2.jpg',
  },
  {
    id: 3,
    slug: '3',
    titleKey: 'news.item3.title',
    excerptKey: 'news.item3.excerpt',
    publishedAt: '2025-04-25T00:00:00.000Z',
    author: 'nexsoftech',
    category: 'expansion',
    imageSrc: '/news-3.jpg',
  },
  {
    id: 4,
    slug: '4',
    titleKey: 'news.item4.title',
    excerptKey: 'news.item4.excerpt',
    publishedAt: '2025-04-03T00:00:00.000Z',
    author: 'nexsoftech',
    category: 'education',
    imageSrc: '/news-4.jpg',
  },
  {
    id: 5,
    slug: '5',
    titleKey: 'news.item5.title',
    excerptKey: 'news.item5.excerpt',
    publishedAt: '2024-12-20T00:00:00.000Z',
    author: 'nexsoftech',
    category: 'event',
    imageSrc: '/news-5.jpg',
  },
  {
    id: 6,
    slug: '6',
    titleKey: 'news.item6.title',
    excerptKey: 'news.item6.excerpt',
    publishedAt: '2025-04-15T00:00:00.000Z',
    author: 'nexsoftech',
    category: 'exhibition',
    imageSrc: '/news-6.jpg',
  },
  {
    id: 7,
    slug: '7',
    titleKey: 'news.item7.title',
    excerptKey: 'news.item7.excerpt',
    publishedAt: '2025-12-31T00:00:00.000Z',
    author: 'nexsoftech',
    category: 'partnership',
    imageSrc: '/news-7.jpg',
    externalUrl:
      'https://www.linkedin.com/posts/lango-language_langoschool-ricohthailand-partnership-activity-7412008449531871232-Atel',
  },
]

function loadTranslations(locale) {
  const filePath = join(root, 'src', 'translations', `${locale}.json`)
  return JSON.parse(readFileSync(filePath, 'utf8'))
}

function localizedField(item, key, translationsByLocale) {
  const value = {}
  for (const locale of localeFields) {
    value[locale.field] = translationsByLocale[locale.language][item[key]] ?? ''
  }
  return value
}

async function uploadImage(relativePath) {
  const filePath = join(root, 'public', relativePath.replace(/^\//, ''))
  if (!existsSync(filePath)) {
    console.warn(`Image not found: ${filePath}`)
    return undefined
  }

  const buffer = readFileSync(filePath)
  const asset = await client.assets.upload('image', buffer, {
    filename: basename(filePath),
  })

  return {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: asset._id,
    },
  }
}

async function seedNews() {
  const translationsByLocale = Object.fromEntries(
    localeFields.map((locale) => [locale.language, loadTranslations(locale.language)])
  )

  for (const item of newsItems) {
    const docId = `news-${item.id}`
    const image = await uploadImage(item.imageSrc)

    const document = {
      _id: docId,
      _type: 'news',
      title: localizedField(item, 'titleKey', translationsByLocale),
      slug: { _type: 'slug', current: item.slug },
      excerpt: localizedField(item, 'excerptKey', translationsByLocale),
      publishedAt: item.publishedAt,
      author: item.author,
      category: item.category,
      published: true,
      ...(item.externalUrl ? { externalUrl: item.externalUrl } : {}),
      ...(image ? { image } : {}),
    }

    await client.createOrReplace(document)
    console.log(`✓ Seeded news/${item.slug} (${docId})`)
  }
}

seedNews().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})
