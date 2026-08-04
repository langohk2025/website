import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { JsonLd } from '@/components/JsonLd'
import { ProductPageContent } from '@/components/product/ProductPageContent'
import { buildPageMetadata } from '@/lib/seo'
import { buildSoftwareApplicationSchema } from '@/lib/structured-data'

export const metadata = buildPageMetadata({
  title: 'Product | Lango.ai',
  description:
    'Explore the Lango product suite — School, Class, Home, Pen, Exam Preparation, and Vocational Training for language learning.',
  path: '/product/',
})

export default function ProductPage() {
  return (
    <>
      <JsonLd data={buildSoftwareApplicationSchema()} />
      <Header />
      <main className="bg-bg-500">
        <ProductPageContent />
      </main>
      <Footer />
    </>
  )
}
