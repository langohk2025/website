import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ProductPageContent } from '@/components/product/ProductPageContent'

export const metadata: Metadata = {
  title: 'Product | Lango.ai',
  description:
    'Explore the Lango product suite — School, Class, Home, Pen, Exam Preparation, and Vocational Training for language learning.',
}

export default function ProductPage() {
  return (
    <>
      <Header />
      <main className="bg-bg-500">
        <ProductPageContent />
      </main>
      <Footer />
    </>
  )
}
