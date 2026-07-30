export type NewsItem = {
  id: number
  titleKey: string
  excerptKey: string
  date: string
  author: string
  categoryKey: string
  imageSrc: string
  /** External article URL. Internal detail pages use `/news/{id}`. */
  href?: string
}

export function getNewsById(id: number): NewsItem | undefined {
  return newsItems.find((item) => item.id === id)
}

export const newsItems: NewsItem[] = [
  {
    id: 1,
    titleKey: 'news.item1.title',
    excerptKey: 'news.item1.excerpt',
    date: 'December 7, 2024',
    author: 'nexsoftech',
    categoryKey: 'news.category.competition',
    imageSrc: '/news-1.jpg',
  },
  {
    id: 2,
    titleKey: 'news.item2.title',
    excerptKey: 'news.item2.excerpt',
    date: 'May 15, 2025',
    author: 'nexsoftech',
    categoryKey: 'news.category.partnership',
    imageSrc: '/news-2.jpg',
  },
  {
    id: 3,
    titleKey: 'news.item3.title',
    excerptKey: 'news.item3.excerpt',
    date: 'April 25, 2025',
    author: 'nexsoftech',
    categoryKey: 'news.category.expansion',
    imageSrc: '/news-3.jpg',
  },
  {
    id: 4,
    titleKey: 'news.item4.title',
    excerptKey: 'news.item4.excerpt',
    date: 'April 3, 2025',
    author: 'nexsoftech',
    categoryKey: 'news.category.education',
    imageSrc: '/news-4.jpg',
  },
  {
    id: 5,
    titleKey: 'news.item5.title',
    excerptKey: 'news.item5.excerpt',
    date: 'December 20, 2024',
    author: 'nexsoftech',
    categoryKey: 'news.category.event',
    imageSrc: '/news-5.jpg',
  },
  {
    id: 6,
    titleKey: 'news.item6.title',
    excerptKey: 'news.item6.excerpt',
    date: 'April 15, 2025',
    author: 'nexsoftech',
    categoryKey: 'news.category.exhibition',
    imageSrc: '/news-6.jpg',
  },
  {
    id: 7,
    titleKey: 'news.item7.title',
    excerptKey: 'news.item7.excerpt',
    date: 'December 31, 2025',
    author: 'nexsoftech',
    categoryKey: 'news.category.partnership',
    imageSrc: '/news-7.jpg',
    href: 'https://www.linkedin.com/posts/lango-language_langoschool-ricohthailand-partnership-activity-7412008449531871232-Atel',
  },
]
