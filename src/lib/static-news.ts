import type { LanguageCode } from './languages'
import type { LocalizedValue, NewsArticle } from './sanity.locales'
import { newsItems } from '@/data/news'
import en from '@/translations/en.json'
import zhTW from '@/translations/zh-TW.json'
import zhCN from '@/translations/zh-CN.json'
import ja from '@/translations/ja.json'
import ms from '@/translations/ms.json'
import id from '@/translations/id.json'
import my from '@/translations/my.json'

const translationMap: Record<LanguageCode, Record<string, string>> = {
  en,
  'zh-TW': zhTW,
  'zh-CN': zhCN,
  ja,
  ms,
  id,
  my,
}

const staticDateIso: Record<number, string> = {
  1: '2024-12-07T00:00:00.000Z',
  2: '2025-05-15T00:00:00.000Z',
  3: '2025-04-25T00:00:00.000Z',
  4: '2025-04-03T00:00:00.000Z',
  5: '2024-12-20T00:00:00.000Z',
  6: '2025-04-15T00:00:00.000Z',
  7: '2025-12-31T00:00:00.000Z',
}

function localizedFromKey(key: string): LocalizedValue {
  const value: LocalizedValue = {}
  for (const [locale, translations] of Object.entries(translationMap) as [
    LanguageCode,
    Record<string, string>,
  ][]) {
    value[locale] = translations[key] ?? translationMap.en[key] ?? key
  }
  return value
}

export function getStaticNewsArticles(): NewsArticle[] {
  return newsItems.map((item) => ({
    slug: String(item.id),
    title: localizedFromKey(item.titleKey),
    excerpt: localizedFromKey(item.excerptKey),
    date: staticDateIso[item.id] ?? item.date,
    author: item.author,
    categoryKey: item.categoryKey,
    imageSrc: item.imageSrc,
    href: item.href,
    source: 'static' as const,
  }))
}
