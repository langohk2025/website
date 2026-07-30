import type { PortableTextBlock } from '@portabletext/types'
import type { LanguageCode } from './languages'

/** Sanity field names must not contain hyphens. */
export const localeFields: {
  language: LanguageCode
  field: string
  title: string
}[] = [
  { language: 'en', field: 'en', title: 'English' },
  { language: 'zh-TW', field: 'zhTW', title: '繁體中文' },
  { language: 'zh-CN', field: 'zhCN', title: '简体中文' },
  { language: 'ms', field: 'ms', title: 'Bahasa Melayu' },
  { language: 'id', field: 'idLang', title: 'Bahasa Indonesia' },
  { language: 'ja', field: 'ja', title: '日本語' },
  { language: 'my', field: 'my', title: 'မြန်မာ' },
]

export type LocalizedValue = Partial<Record<LanguageCode, string>>

type SanityLocalizedRecord<T> = Record<string, T>

export type SanityNewsDocument = {
  _id: string
  title: SanityLocalizedRecord<string>
  slug: { current: string }
  excerpt: SanityLocalizedRecord<string>
  body?: SanityLocalizedRecord<PortableTextBlock[]>
  publishedAt: string
  author?: string
  category?: string
  image?: {
    asset?: {
      _ref?: string
    }
  }
  externalUrl?: string
  published?: boolean
}

export type NewsArticle = {
  slug: string
  title: LocalizedValue
  excerpt: LocalizedValue
  body?: Partial<Record<LanguageCode, PortableTextBlock[]>>
  date: string
  author: string
  categoryKey: string
  imageSrc: string
  href?: string
  source: 'sanity' | 'static'
}

export function sanityLocalizedToApp<T extends string | PortableTextBlock[]>(
  value: SanityLocalizedRecord<T> | undefined
): Partial<Record<LanguageCode, T>> {
  if (!value) return {}

  const result: Partial<Record<LanguageCode, T>> = {}
  for (const locale of localeFields) {
    const entry = value[locale.field]
    if (entry !== undefined) {
      result[locale.language] = entry
    }
  }
  return result
}

export function appLocalizedToSanity(
  value: LocalizedValue
): SanityLocalizedRecord<string> {
  const result: SanityLocalizedRecord<string> = {}
  for (const locale of localeFields) {
    const entry = value[locale.language]
    if (entry) {
      result[locale.field] = entry
    }
  }
  return result
}

export function getLocalizedValue(
  value: LocalizedValue | undefined,
  language: LanguageCode,
  fallback = ''
) {
  if (!value) return fallback
  return value[language] || value.en || fallback
}

export function formatNewsDate(isoDate: string, language: LanguageCode) {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return isoDate

  return new Intl.DateTimeFormat(language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}
