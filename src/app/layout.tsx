import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { JsonLd } from '@/components/JsonLd'
import {
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from '@/lib/site'
import { buildOrganizationGraph } from '@/lib/structured-data'

const SUPPORT_WIDGET_SRC = 'https://operation.lango.ai/support-widget.js'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Lango - Learn Speaking in a FUN WAY',
    template: '%s',
  },
  description: SITE_DESCRIPTION,
  keywords:
    'English learning, AI robot, speaking practice, language learning, gamified education, SPM English, Lango',
  applicationName: SITE_NAME,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: SITE_NAME,
    title: 'Lango - Learn Speaking in a FUN WAY',
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lango - Learn Speaking in a FUN WAY',
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${poppins.variable} font-inter antialiased`}>
        <JsonLd data={buildOrganizationGraph()} />
        <LanguageProvider>
          {children}
        </LanguageProvider>
        {/* AI support chat bubble, served and managed by the operations hub (operation.lango.ai). */}
        <Script src={SUPPORT_WIDGET_SRC} strategy="lazyOnload" />
      </body>
    </html>
  )
}
