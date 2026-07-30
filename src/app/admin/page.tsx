'use client'

import Link from 'next/link'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import { PageContainer, Section } from '@/components/ui/section'
import { H2, P3 } from '@/components/ui/typography'

const studioUrl =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ?? 'https://lango-website.sanity.studio'

const cards = [
  {
    href: '/admin/demo-requests',
    title: 'Demo Requests',
    description: 'Review contact form submissions, update status, and add follow-up notes.',
    external: false,
  },
  {
    href: studioUrl,
    title: 'News CMS',
    description: 'Create and publish multilingual news articles in Sanity Studio.',
    external: true,
  },
]

export default function AdminPage() {
  return (
    <AdminAuthGate title="Lango Admin">
      <Section className="py-16">
        <PageContainer>
          <div className="mx-auto flex max-w-4xl flex-col gap-10">
            <div>
              <H2 as="h1">Website Admin</H2>
              <P3 className="mt-3 text-font-400">
                Manage demo requests and publish news updates from one place.
              </P3>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {cards.map((card) =>
                card.external ? (
                  <a
                    key={card.href}
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pressable rounded-[24px] border border-[#ede9fe] bg-bg-100 p-8 shadow-card transition-transform hover:-translate-y-0.5"
                  >
                    <H2 className="text-2xl text-font-600">{card.title}</H2>
                    <P3 className="mt-3 text-font-400">{card.description}</P3>
                  </a>
                ) : (
                  <Link
                    key={card.href}
                    href={card.href}
                    className="pressable rounded-[24px] border border-[#ede9fe] bg-bg-100 p-8 shadow-card transition-transform hover:-translate-y-0.5"
                  >
                    <H2 className="text-2xl text-font-600">{card.title}</H2>
                    <P3 className="mt-3 text-font-400">{card.description}</P3>
                  </Link>
                )
              )}
            </div>
          </div>
        </PageContainer>
      </Section>
    </AdminAuthGate>
  )
}
