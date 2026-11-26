import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { buildPageMetadata } from '@/lib/seo'
import { TRUST_PATH } from '@/lib/site'

export const metadata = buildPageMetadata({
  title: 'Privacy Policy | Lango.ai',
  description:
    'Privacy Policy for Lango Innovation Limited (Lango.ai) — how we collect, use, store, and safeguard personal and student voice data under PDPO and GDPR principles.',
  path: '/privacy-policy/',
})

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">Privacy Policy</h1>

            <p className="mb-6 text-gray-600">
              <strong>Last Updated:</strong> November 2026 &nbsp;|&nbsp;{' '}
              <strong>Data Controller / Operator:</strong> Lango Innovation Limited (Hong Kong)
            </p>

            <div className="mb-8 rounded-xl border border-purple-200 bg-purple-50/70 p-4 text-sm text-gray-800">
              <strong>School IT &amp; Safeguarding Leads:</strong> For a plain-language overview of
              child safeguarding, voice data handling, PDPO/GDPR alignment, and Data Processing
              Agreements (DPAs), visit our{' '}
              <Link
                href={TRUST_PATH}
                className="font-semibold text-[#c92c97] underline underline-offset-4"
              >
                Data Privacy &amp; Child Safeguarding page
              </Link>
              .
            </div>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">1. Introduction</h2>
              <p className="leading-relaxed text-gray-700">
                Welcome to Lango.ai, operated by Lango Innovation Limited (&ldquo;we,&rdquo;
                &ldquo;our,&rdquo; or &ldquo;us&rdquo;). We are committed to protecting personal
                data and safeguarding learners who use our language learning applications and
                classroom tools. This Privacy Policy explains how we collect, use, store, and
                protect information when you visit our website or use Lango services, in accordance
                with the Hong Kong Personal Data (Privacy) Ordinance (Cap. 486, PDPO) and aligned
                with the EU/UK General Data Protection Regulation (GDPR) where applicable.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                2. Information We Collect
              </h2>

              <h3 className="mb-3 text-xl font-medium text-gray-900">
                2.1 Account &amp; Learning Information
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                Depending on whether Lango is used through a school deployment or a family/individual
                account, we may collect:
              </p>
              <ul className="mb-4 list-disc pl-6 text-gray-700">
                <li>
                  Contact and school inquiry details (name, work email, role, school/organization,
                  optional phone number)
                </li>
                <li>Account credentials and school-assigned learner identifiers or class groupings</li>
                <li>Learning activity, completed missions, and speaking assessment scores</li>
                <li>Payment information (processed securely through third-party payment providers)</li>
              </ul>

              <h3 className="mb-3 text-xl font-medium text-gray-900">
                2.2 Voice &amp; Audio Recordings
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                Because Lango provides AI-assisted speaking and pronunciation practice, learners
                record spoken responses within assigned exercises. Voice data is processed strictly
                to generate pronunciation, fluency, and oral-assessment feedback and to display
                learning progress to authorized teachers, school administrators, or parents. We do
                not sell voice recordings and we do not use student voice data for third-party
                advertising or behavioral profiling.
              </p>

              <h3 className="mb-3 text-xl font-medium text-gray-900">
                2.3 Automatically Collected Technical Information
              </h3>
              <ul className="mb-4 list-disc pl-6 text-gray-700">
                <li>Device type, operating system, browser type, and crash/diagnostic logs</li>
                <li>Session activity needed to deliver and maintain service reliability</li>
                <li>Essential cookies and preference settings (such as interface language)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                3. How We Use Information
              </h2>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Deliver speaking practice, instant pronunciation feedback, and classroom tools</li>
                <li>Provide teachers and parents with authorized progress dashboards</li>
                <li>Manage school pilots, licensing, and customer support requests</li>
                <li>Maintain platform security, integrity, and fraud prevention</li>
                <li>Comply with applicable legal and safeguarding obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                4. Information Sharing &amp; Sub-processors
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                We never sell, rent, or trade student or user personal data. We share data only:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>
                  With contracted infrastructure and speech-processing service providers bound by
                  confidentiality and data-protection obligations
                </li>
                <li>
                  With the learner&apos;s school, teachers, or parents/guardians in accordance with
                  the school&apos;s deployment settings
                </li>
                <li>When required by applicable law or to protect learner safety and legal rights</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                5. Data Security &amp; Retention
              </h2>
              <p className="leading-relaxed text-gray-700">
                We protect personal and voice data using industry-standard technical and
                organizational safeguards, including encryption in transit (TLS) and at rest,
                role-based access controls, and least-privilege administrative access. Data is
                retained only for as long as needed to deliver the educational service or as
                instructed by the contracting school, after which it is deleted or anonymized upon
                request or contract termination.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                6. Your Rights (PDPO &amp; GDPR)
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Subject to applicable law (including Hong Kong PDPO and GDPR), individuals, parents,
                and schools acting as data controllers may request:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Access to personal data held about them or their child</li>
                <li>Correction of inaccurate or incomplete personal data</li>
                <li>Deletion / erasure of accounts and associated learning or voice records</li>
                <li>Restriction of or objection to processing, and withdrawal of consent</li>
                <li>Data export / portability where applicable</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                7. Children&apos;s Privacy &amp; School Deployments
              </h2>
              <p className="leading-relaxed text-gray-700">
                Lango is designed for K–12, early-years, and language learners, including children
                under 13 or 16 years of age, when used under the supervision and authorization of a
                school or parent/legal guardian. In school deployments, the school acts as the
                controller for student records and obtains any required parental consents under local
                law; Lango processes student data strictly on the school&apos;s documented
                instructions. Student accounts contain no third-party advertising and cannot be used
                to contact strangers. Parents or schools may review or request deletion of a
                child&apos;s data at any time by contacting{' '}
                <a href="mailto:privacy@lango.ai" className="text-[#c92c97] underline">
                  privacy@lango.ai
                </a>
                .
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                8. International Data Transfers
              </h2>
              <p className="leading-relaxed text-gray-700">
                Where personal data is processed across borders to deliver speech-scoring or cloud
                hosting services, we apply contractual and technical safeguards aligned with PDPO and
                GDPR standards. Schools may request our current sub-processor and data-flow summary
                prior to onboarding.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                9. Changes to This Privacy Policy
              </h2>
              <p className="leading-relaxed text-gray-700">
                We may update this Privacy Policy periodically. Material changes will be posted on
                this page with an updated revision date, and active school partners will be notified
                in advance where required by our agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">10. Contact Us</h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                For privacy inquiries, data access or deletion requests, or to request a School Data
                Processing Agreement (DPA), please contact our Data Privacy team:
              </p>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-gray-700">
                  <strong>Entity:</strong> Lango Innovation Limited
                </p>
                <p className="text-gray-700">
                  <strong>Address:</strong> 4/F, KOHO, 73-75 Hung To Road, Kwun Tong, Hong Kong
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong>{' '}
                  <a href="mailto:privacy@lango.ai" className="text-[#c92c97] underline">
                    privacy@lango.ai
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
