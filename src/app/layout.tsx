import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}

