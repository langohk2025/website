'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { PressableLink } from '@/components/ui/motion'
import { Label3, P3, P4 } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

type NewsCardProps = {
  slug: string
  title: string
  excerpt: string
  date: string
  author: string
  imageSrc: string
  readMoreLabel: string
  href?: string
  className?: string
}

function isExternalHref(href: string) {
  return href.startsWith('http://') || href.startsWith('https://')
}

export function NewsCard({
  slug,
  title,
  excerpt,
  date,
  author,
  imageSrc,
  readMoreLabel,
  href,
  className,
}: NewsCardProps) {
  const readMoreHref = href && isExternalHref(href) ? href : `/news/${slug}`
  const readMoreClassName =
    'pressable btn-primary inline-flex items-center justify-center gap-1 rounded-full bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end px-3 py-1.5 text-base shadow-none transition-transform duration-100 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]'
  return (
    <article
      className={cn(
        'flex h-full max-w-[390px] flex-col overflow-hidden rounded-[19px] bg-bg-100',
        'shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]',
        'card-hover',
        className
      )}
    >
      <div className="relative h-[199px] w-full shrink-0 overflow-hidden bg-[#d3a7ee]">
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 390px"
        />
      </div>

      <div className="flex flex-1 flex-col p-[19px]">
        <div className="flex flex-wrap items-center justify-between gap-y-2">
          <div className="flex items-center gap-1">
            <Calendar className="size-3.5 shrink-0 text-font-400" strokeWidth={1.75} />
            <P4>{date}</P4>
          </div>
          <div className="flex items-center gap-1">
            <User className="size-3.5 shrink-0 text-font-400" strokeWidth={1.75} />
            <P4>{author}</P4>
          </div>
        </div>

        <Label3 as="h2" className="mt-3 text-[#101828]">
          {title}
        </Label3>

        <P3 className="mt-3 line-clamp-3 text-[#6a7282]">{excerpt}</P3>

        <div className="relative z-10 mt-3">
          {href && isExternalHref(href) ? (
            <PressableLink
              href={href}
              variant="primary"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex gap-1 px-3 py-1.5 text-base shadow-none"
            >
              <span className="font-poppins text-base font-medium text-bg-500">
                {readMoreLabel}
              </span>
              <ArrowRight className="size-4 text-bg-500" strokeWidth={2} />
            </PressableLink>
          ) : (
            <Link href={readMoreHref} className={readMoreClassName}>
              <span className="font-poppins text-base font-medium text-bg-500">
                {readMoreLabel}
              </span>
              <ArrowRight className="size-4 text-bg-500" strokeWidth={2} />
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
