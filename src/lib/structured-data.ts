import en from '@/translations/en.json'
import { spmFaqs } from '@/data/spm-exam'
import { absoluteUrl, ORGANIZATION, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'

type FaqEntry = {
  question: string
  answer: string
}

function organizationNode() {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: ORGANIZATION.name,
    legalName: ORGANIZATION.legalName,
    url: ORGANIZATION.url,
    logo: {
      '@type': 'ImageObject',
      url: ORGANIZATION.logo,
    },
    email: ORGANIZATION.email,
    telephone: ORGANIZATION.telephone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: ORGANIZATION.address.streetAddress,
      addressLocality: ORGANIZATION.address.addressLocality,
      addressCountry: ORGANIZATION.address.addressCountry,
    },
    sameAs: [...ORGANIZATION.sameAs],
  }
}

export function buildOrganizationGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organizationNode(),
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en',
      },
    ],
  }
}

export function getSpmFaqEntries(): FaqEntry[] {
  return spmFaqs.map(({ questionKey, answerKey }) => ({
    question: en[questionKey as keyof typeof en] ?? questionKey,
    answer: en[answerKey as keyof typeof en] ?? answerKey,
  }))
}

export function buildFaqPageSchema(entries: FaqEntry[], pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    url: pageUrl,
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: entry.answer,
      },
    })),
  }
}

export function buildSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Lango',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'iOS, Android, Web',
    url: absoluteUrl('/product/'),
    description:
      'AI-powered language learning suite for schools, classes, homes, exam preparation, and vocational training across Asia.',
    provider: { '@id': `${SITE_URL}/#organization` },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free trial available; school and family plans on request.',
    },
  }
}

export function buildNewsArticleSchema(article: {
  title: string
  description?: string
  url: string
  imageUrl?: string
  datePublished: string
  author: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.description,
    url: article.url,
    mainEntityOfPage: article.url,
    datePublished: article.datePublished,
    dateModified: article.datePublished,
    author: {
      '@type': 'Organization',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: ORGANIZATION.name,
      logo: {
        '@type': 'ImageObject',
        url: ORGANIZATION.logo,
      },
    },
    ...(article.imageUrl
      ? {
          image: [article.imageUrl.startsWith('http') ? article.imageUrl : absoluteUrl(article.imageUrl)],
        }
      : {}),
  }
}
