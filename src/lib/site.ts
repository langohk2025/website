/** Canonical production origin. Override with NEXT_PUBLIC_SITE_URL for previews. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lango.ai'
).replace(/\/$/, '')

export const SITE_NAME = 'Lango.ai'
export const LEGAL_NAME = 'Lango Innovation Limited'

export const SITE_DESCRIPTION =
  'Practice English speaking with our AI robot. Gamified experience with role-play exercises, immediate grading, and immersive conversational scenarios.'

export const DEFAULT_OG_IMAGE = {
  url: '/og-image.png',
  width: 1200,
  height: 630,
  alt: 'Lango logo',
} as const

export const ORGANIZATION = {
  name: SITE_NAME,
  legalName: LEGAL_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/Lango_Logo.svg`,
  email: 'info@lango.ai',
  telephone: '+852-9354-1948',
  foundingLocation: 'Hong Kong',
  address: {
    streetAddress: '4/F, KOHO, 73-75 Hung To Road, Kwun Tong',
    addressLocality: 'Hong Kong',
    addressCountry: 'HK',
  },
  sameAs: [
    'https://www.instagram.com/lango_learning/',
    'https://www.facebook.com/LangoEnglish/',
    'https://www.youtube.com/@langohk',
    'https://hk.linkedin.com/company/lango-language',
  ],
} as const

/** SPM English Speaking landing page (trailing slash). */
export const SPM_EXAM_PATH = '/ljec-spm-english-speaking-AI-app/' as const

/** Public routes included in the sitemap (trailing-slash paths). */
export const PUBLIC_STATIC_PATHS = [
  '/',
  '/product/',
  '/storyworld/',
  SPM_EXAM_PATH,
  '/news/',
  '/privacy-policy/',
  '/terms/',
] as const

/** Internal / tool routes that must not be indexed. */
export const NOINDEX_PATH_PREFIXES = [
  '/admin/',
  '/ecosystem-edit/',
  '/map-calibrate/',
] as const

/** Ensure a site-relative path uses a trailing slash (matches next.config). */
export function withTrailingSlash(path: string): string {
  if (!path || path === '/') return '/'
  const normalized = path.startsWith('/') ? path : `/${path}`
  return normalized.endsWith('/') ? normalized : `${normalized}/`
}

export function absoluteUrl(path = '/'): string {
  const pathname = withTrailingSlash(path)
  return pathname === '/' ? `${SITE_URL}/` : `${SITE_URL}${pathname}`
}
