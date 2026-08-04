import type { Metadata } from 'next'
import { DEFAULT_OG_IMAGE, SITE_NAME, withTrailingSlash } from '@/lib/site'

type BuildPageMetadataInput = {
  title: string
  description: string
  path: string
  image?: {
    url: string
    width?: number
    height?: number
    alt?: string
  }
  noIndex?: boolean
}

/** Shared metadata helper: canonical + Open Graph + Twitter cards. */
export function buildPageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
}: BuildPageMetadataInput): Metadata {
  const canonical = withTrailingSlash(path)
  const ogImage = {
    url: image.url,
    width: image.width ?? DEFAULT_OG_IMAGE.width,
    height: image.height ?? DEFAULT_OG_IMAGE.height,
    alt: image.alt ?? title,
  }

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage.url],
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
            googleBot: {
              index: false,
              follow: false,
            },
          },
        }
      : {}),
  }
}
