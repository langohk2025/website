import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContactSection from '@/components/ContactSection'
import { JsonLd } from '@/components/JsonLd'
import { TrustPageContent } from '@/components/trust/TrustPageContent'
import { buildPageMetadata } from '@/lib/seo'
import { absoluteUrl, TRUST_PATH } from '@/lib/site'
import { buildFaqPageSchema, getTrustFaqEntries } from '@/lib/structured-data'

export const metadata = buildPageMetadata({
  title: 'Data Privacy & Child Safeguarding | Lango.ai',
  description:
    'How Lango Innovation Limited protects student voice recordings and personal data for schools under Hong Kong PDPO and GDPR principles.',
  path: TRUST_PATH,
})

export default function TrustPage() {
  return (
    <>
      <JsonLd
        data={buildFaqPageSchema(getTrustFaqEntries(), absoluteUrl(TRUST_PATH))}
      />
      <Header />
      <main className="bg-bg-500">
        <TrustPageContent />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
