import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import ChatalogWidget from '@/components/ChatalogWidget'

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
  title: 'Lango - Learn Speaking in a FUN WAY',
  description: 'Practice English speaking with our AI robot. Gamified experience with role-play exercises, immediate grading, and immersive conversational scenarios.',
  keywords: 'English learning, AI robot, speaking practice, language learning, gamified education',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${poppins.variable} font-inter antialiased`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <ChatalogWidget />
      </body>
    </html>
  )
}

