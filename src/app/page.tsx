import Header from '@/components/Header'
import Hero from '@/components/Hero'
import WhatIsLango from '@/components/WhatIsLango'
import WhoWeServe from '@/components/WhoWeServe'
import OurProduct from '@/components/OurProduct'
import PractisePlay from '@/components/PractisePlay'
import AsiaLearners from '@/components/AsiaLearners'
import BringLangoCTA from '@/components/BringLangoCTA'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'
import SecurityStatementPopup from '@/components/SecurityStatementPopup'

export default function Home() {
  return (
    <>
      <Header />
      <main className="bg-bg-500">
        <Hero />
        <WhatIsLango />
        <WhoWeServe />
        <OurProduct />
        <PractisePlay />
        <AsiaLearners />
        <BringLangoCTA />
        <ContactSection />
      </main>
      <Footer />
      <SecurityStatementPopup />
    </>
  )
}
