'use client'

import { productFeatures } from '@/data/products'
import { ProductFeatureRow } from '@/components/product/ProductFeatureRow'
import { PageContainer, Section } from '@/components/ui/section'
import { H2 } from '@/components/ui/typography'
import { Reveal } from '@/components/ui/motion'

export function ProductPageContent() {
  return (
    <Section className="py-16 lg:py-16">
      <PageContainer>
        <div className="flex flex-col gap-[30px]">
          <Reveal>
            <H2 as="h1" className="w-full text-center text-[50px]">
              Product
            </H2>
          </Reveal>

          <div className="flex flex-col gap-y-[80px]">
            {productFeatures.map((feature) => (
              <ProductFeatureRow key={feature.slug} feature={feature} />
            ))}
          </div>
        </div>
      </PageContainer>
    </Section>
  )
}
