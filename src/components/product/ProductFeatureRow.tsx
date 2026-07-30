'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from '@/components/ui/motion'
import { H4, ProductBody } from '@/components/ui/typography'
import { cn } from '@/lib/utils'
import type { ProductFeature } from '@/data/products'

type ProductFeatureRowProps = {
  feature: ProductFeature
}

function ProductImage({ feature }: ProductFeatureRowProps) {
  return (
    <div
      className="mx-auto shrink-0 lg:mx-0"
      style={{
        width: `min(100%, ${feature.imageWidth}px)`,
        maxWidth: `${feature.imageWidth}px`,
      }}
    >
      <Image
        src={feature.imageSrc}
        alt={feature.imageAlt}
        width={feature.imageWidth}
        height={feature.imageHeight}
        className={cn('h-auto w-full object-contain', feature.imageClassName)}
        priority={feature.slug === 'lango-school'}
      />
    </div>
  )
}

function ProductCopy({ feature }: ProductFeatureRowProps) {
  const content = (
    <>
      <H4>{feature.title}</H4>
      <ProductBody>{feature.description}</ProductBody>
    </>
  )

  if (feature.href) {
    return (
      <Link
        href={feature.href}
        className="flex min-w-0 flex-1 flex-col gap-[4px] transition-opacity hover:opacity-90"
      >
        {content}
      </Link>
    )
  }

  return <div className="flex min-w-0 flex-1 flex-col gap-[4px]">{content}</div>
}

export function ProductFeatureRow({ feature }: ProductFeatureRowProps) {
  const imageDirection = feature.imageOnLeft ? 'left' : 'right'
  const copyDirection = feature.imageOnLeft ? 'right' : 'left'

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-[50px]',
        !feature.imageOnLeft && 'lg:flex-row-reverse'
      )}
    >
      <Reveal direction={imageDirection} className="shrink-0">
        <ProductImage feature={feature} />
      </Reveal>
      <Reveal delay={0.06} direction={copyDirection} className="min-w-0 flex-1">
        <ProductCopy feature={feature} />
      </Reveal>
    </div>
  )
}
