import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import AppScreenshots from '@/components/AppScreenshots'
import Pricing from '@/components/Pricing'
import News from '@/components/News'
import Footer from '@/components/Footer'
import NewsletterSignup from '@/components/ui/NewsletterSignup'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <AppScreenshots />
        <Pricing />
        <News />
        <NewsletterSignup />
      </main>
      <Footer />
    </>
  )
}

