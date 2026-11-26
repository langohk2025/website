import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContactSection from '@/components/ContactSection'
import { JsonLd } from '@/components/JsonLd'
import { InternationalSchoolsContent } from '@/components/international/InternationalSchoolsContent'
import { buildPageMetadata } from '@/lib/seo'
import { absoluteUrl, INTERNATIONAL_SCHOOLS_PATH } from '@/lib/site'
import {
  buildFaqPageSchema,
  getInternationalSchoolsFaqEntries,
} from '@/lib/structured-data'

export const metadata = buildPageMetadata({
  title: 'IB, IGCSE & EAL Speaking Practice for International Schools | Lango.ai',
  description:
    'AI speaking practice aligned with IB Language A/B oral assessments, Cambridge IGCSE speaking, British and American curricula, and EAL/ESL cohorts. Request a bounded school pilot.',
  path: INTERNATIONAL_SCHOOLS_PATH,
})

export default function InternationalSchoolsPage() {
  return (
    <>
      <JsonLd
        data={buildFaqPageSchema(
          getInternationalSchoolsFaqEntries(),
          absoluteUrl(INTERNATIONAL_SCHOOLS_PATH)
        )}
      />
      <Header />
      <main className="bg-bg-500">
        <InternationalSchoolsContent />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
