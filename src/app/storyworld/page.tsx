import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { StoryworldPageContent } from '@/components/storyworld/StoryworldPageContent'

export const metadata: Metadata = {
  title: 'Storyworld | Lango.ai',
  description:
    'Explore Lango Storyworld — learn through stories, characters, and adventures with interactive missions and memorable guides like Uncle Tommy.',
}

export default function StoryworldPage() {
  return (
    <>
      <Header />
      <main className="bg-bg-500">
        <StoryworldPageContent />
      </main>
      <Footer />
    </>
  )
}
