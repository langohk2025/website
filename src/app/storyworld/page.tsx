import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { StoryworldPageContent } from '@/components/storyworld/StoryworldPageContent'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: 'Storyworld | Lango.ai',
  description:
    'Explore Lango Storyworld — learn through stories, characters, and adventures with interactive missions and memorable guides like Uncle Tommy.',
  path: '/storyworld/',
})

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
